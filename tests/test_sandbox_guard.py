"""The sandbox's defences beyond the AST check: path, process and network guards.

Hook tests call ``_run_in_worker`` directly, skipping the AST check, and reach
the real ``open``, ``os`` and builtins the way a successful escape would
(``random._os`` is ``os``; ``re.enum.bltns`` is the real builtins module).
Each test proves what still holds after such an escape.
"""

import json
import os
import subprocess
import sys

import pytest

from backend.core import notebook_engine, sandbox_guard
from backend.core.notebook_engine import _read_result, _run_in_worker, execute_notebook_code

ESCAPE = (
    "import random, re, collections\n"
    "B = re.enum.bltns\n"
    "opener = B.open\n"
    "OS = random._os\n"
    "SYS = collections._sys\n"
    "IMPORT = B.getattr(B, '__import__')\n"
)


def escaped(code: str) -> dict:
    return _run_in_worker(ESCAPE + code)


def refused(result: dict) -> bool:
    text = (result["error"] or "") + result["stderr"]
    return result["success"] is False and ("not allowed" in text or "Operation not permitted" in text)


def test_the_escape_itself_works_so_these_tests_mean_something():
    result = escaped("print(OS.getpid() > 0, callable(opener))")
    assert result["success"], result["error"]
    assert result["stdout"].strip() == "True True"


# --- Reading -------------------------------------------------------------------------

SYSTEM_FILES = ["/etc/hosts", "/etc/passwd", "/dev/stdin", "/var/run/../../etc/hosts", "/etc/./hosts"]
if sys.platform == "darwin":  # case-insensitive volume and the data-volume firmlink
    SYSTEM_FILES += ["/ETC/hosts", "/Etc/passwd", "/System/Volumes/Data/private/etc/hosts", "/private/etc/hosts"]
if sys.platform.startswith("linux"):
    SYSTEM_FILES += ["/proc/self/environ", "/proc/1/environ", "/proc/self/../self/environ",
                     "/var/run/../proc/self/environ", "/sys/kernel/hostname"]


@pytest.mark.parametrize("path", SYSTEM_FILES)
def test_system_files_cannot_be_read(path):
    result = escaped(f"print(opener({path!r}).read())")
    assert refused(result), result


def test_relative_paths_cannot_climb_out_to_system_files():
    climb = "../" * 30 + "etc/hosts"
    assert refused(escaped(f"print(opener({climb!r}).read())"))


@pytest.mark.parametrize("name", [".env", ".ENV", ".env.local", ".Env.production"])
def test_env_files_cannot_be_read(tmp_path, name):
    secret = tmp_path / name
    secret.write_text("AUTH_JWT_SECRET=must-not-leak\n")
    result = escaped(f"print(opener({str(secret)!r}).read())")
    assert "must-not-leak" not in result["stdout"] + result["stderr"]
    assert refused(result)


def test_other_learners_sandbox_folders_cannot_be_read():
    import tempfile

    other = tempfile.mkdtemp(prefix="qi-sandbox-")
    target = os.path.join(other, "result.json")
    try:
        with open(target, "w") as handle:
            handle.write("someone else's output")
        result = escaped(f"print(opener({target!r}).read())")
        assert "someone else" not in result["stdout"]
        assert refused(result)
    finally:
        os.remove(target)
        os.rmdir(other)


def test_folders_cannot_be_opened_for_use_as_dir_fd():
    assert refused(escaped("fd = OS.open('/', OS.O_RDONLY)\nprint(OS.read(OS.open('etc/hosts', 0, dir_fd=fd), 50))"))


def test_files_outside_python_and_the_app_cannot_be_read(tmp_path):
    secret = tmp_path / "id_rsa"
    secret.write_text("PRIVATE-KEY-must-not-leak\n")
    result = escaped(f"print(opener({str(secret)!r}).read())")
    assert "must-not-leak" not in result["stdout"]
    assert refused(result)


def test_database_files_cannot_be_read():
    import tempfile

    assert refused(escaped(f"print(opener({tempfile.gettempdir() + '/auth.sqlite3'!r}).read())"))


def test_library_files_can_still_be_read():
    result = escaped("import numpy as np\nprint(len(opener(np.get_include() + '/numpy/ndarrayobject.h').read()) > 0)")
    assert result["success"], result["error"]
    assert "True" in result["stdout"]


# --- Writing -------------------------------------------------------------------------

def test_files_outside_the_worker_folder_cannot_be_written(tmp_path):
    target = tmp_path / "planted.py"
    assert refused(escaped(f"opener({str(target)!r}, 'w').write('x')"))
    assert not target.exists()


def test_fifos_and_device_nodes_cannot_be_made():
    result = escaped("print(hasattr(OS, 'mkfifo'), hasattr(OS, 'mknod'))")
    assert result["stdout"].strip() == "False False", result


def test_the_worker_folder_is_still_writable():
    result = escaped("opener('scratch.txt', 'w').write('ok')\nprint(opener('scratch.txt').read())")
    assert result["success"], result["error"]
    assert result["stdout"].strip() == "ok"


# --- Processes and network ----------------------------------------------------------

def test_the_unaudited_process_helper_is_gone():
    result = escaped("print(hasattr(IMPORT('_posixsubprocess'), 'fork_exec'))")
    assert result["success"], result["error"]
    assert result["stdout"].strip() == "False"


@pytest.mark.parametrize(
    "code",
    [
        "OS.system('id')",
        "IMPORT('subprocess').run(['id'])",
        "OS.execv('/bin/sh', ['sh'])",
        "OS.posix_spawn('/bin/sh', ['sh'], {})",
        "OS.fork()",
        "IMPORT('socket').socket()",
        "IMPORT('ctypes').CDLL(None)",
        "OS.symlink('/etc/hosts', 'link')",
        "OS.chdir('/')",
    ],
)
def test_processes_sockets_and_c_calls_are_refused(code):
    assert refused(escaped(code))


@pytest.mark.skipif(not sys.platform.startswith("linux"), reason="seccomp is Linux only")
def test_seccomp_stops_programs_starting_even_without_the_audit_hook():
    probe = (
        "from backend.core import sandbox_guard\n"
        "assert sandbox_guard._install_seccomp(), 'filter not installed'\n"
        "import os\n"
        "try:\n"
        "    os.execv('/bin/true', ['true'])\n"
        "except PermissionError:\n"
        "    print('refused')\n"
    )
    child = subprocess.run([sys.executable, "-c", probe], capture_output=True, text=True, timeout=60,
                           cwd=notebook_engine._PROJECT_ROOT)
    assert child.stdout.strip() == "refused", child.stderr


def test_seccomp_program_refuses_exec_and_allows_everything_else():
    audit_arch, denied = sandbox_guard._SECCOMP_TABLES["x86_64"]
    program = sandbox_guard._seccomp_program(audit_arch, denied, x86=True)
    assert program[-1] == (0x06, 0, 0, 0x7FFF0000)
    assert (0x15, 0, 1, 59) in program  # execve
    assert all(step[0] in (0x20, 0x15, 0x35, 0x06) for step in program)


# --- The guard itself ---------------------------------------------------------------

@pytest.mark.parametrize(
    ("event", "args"),
    [
        ("subprocess.Popen", ("/bin/sh", ["sh"], None, None)),
        ("os.system", (b"id",)),
        ("socket.connect", (None, ("169.254.169.254", 80))),
        ("ctypes.dlopen", ("libc.so.6",)),
        ("os.link", ("/etc/hosts", "link", -1, -1)),
        ("object.__setattr__", (len, "__code__", None)),
        ("object.__setattr__", (sandbox_guard.prefixes, "__defaults__", ())),
        ("open", ("/etc/hosts", "r", 0)),
        ("open", ("/tmp/x.py", "w", 577)),
        ("os.remove", ("/tmp/x.py", -1)),
        ("os.rename", ("scratch.txt", "/tmp/x.py", -1, -1)),
    ],
)
def test_guard_refuses_dangerous_events(tmp_path, event, args):
    guard = sandbox_guard.build_guard([str(tmp_path)], cwd=str(tmp_path))
    with pytest.raises(PermissionError):
        guard(event, args)


@pytest.mark.parametrize(
    ("event", "args"),
    [
        ("open", ("scratch.txt", "w", 577)),
        ("open", ("/dev/urandom", "rb", 0)),
        ("open", (3, "rb", 0)),
        ("os.remove", ("scratch.txt", -1)),
        ("os.mkdir", ("sub", 0o777, -1)),
        ("import", ("numpy", None, [], [], [])),
        ("object.__setattr__", (lambda x=1: x, "__defaults__", (2,))),
    ],
)
def test_guard_allows_ordinary_events(tmp_path, event, args):
    guard = sandbox_guard.build_guard([str(tmp_path)], cwd=str(tmp_path))
    guard(event, args)


def test_guard_refuses_climbing_out_of_the_worker_folder(tmp_path):
    guard = sandbox_guard.build_guard([str(tmp_path)], cwd=str(tmp_path))
    with pytest.raises(PermissionError):
        guard("open", (f"{tmp_path}/../escaped.txt", "w", 577))


def test_guard_cannot_be_rewired(tmp_path):
    guard = sandbox_guard.build_guard([str(tmp_path)], cwd=str(tmp_path))
    for name in ("__defaults__", "__code__"):
        with pytest.raises(PermissionError):
            guard("object.__setattr__", (guard, name, ()))


def test_guard_refuses_path_objects_it_cannot_pin_down(tmp_path):
    class Shifty:
        def __fspath__(self):
            return "ok.txt"

    guard = sandbox_guard.build_guard([str(tmp_path)], cwd=str(tmp_path))
    with pytest.raises(PermissionError):
        guard("open", (Shifty(), "r", 0))


# --- The AST check ------------------------------------------------------------------

@pytest.mark.parametrize(
    "code",
    [
        "from numpy import *",
        "import operator\nprint(operator.attrgetter('lib')(np))",
        "from operator import methodcaller",
        "from numpy.lib.stride_tricks import as_strided",
        "import numpy as np\nprint(np.lib.npyio.DataSource().open('/etc/hosts').read())",
        "import numpy as np\nopener = np.lib._datasource._file_openers[None]",
        "import random\nprint(random._os)",
        "import collections\nprint(collections._sys)",
        "import re\nprint(re.enum.bltns.open)",
        "import numpy.lib._datasource",
        "from numpy.lib import _datasource",
        "import matplotlib\nmatplotlib.rc_file('/etc/hosts')",
        "from qiskit import QuantumCircuit\nQuantumCircuit.from_qasm_file('/etc/hosts')",
        # QASM includes are read in Rust, where the audit hook cannot see them.
        "from qiskit import QuantumCircuit\nQuantumCircuit.from_qasm_str('include \"/etc/hosts\";')",
        "import qiskit.qasm2",
        "from qiskit.qasm2 import loads",
        "from qiskit import qasm3",
        # Round two: frame walking and object scanning without any _private name.
        "f = plt.inspect.currentframe()",
        "print(np.ma.core.inspect)",
        "import re\nprint(re.enum)",
        "import typing\nprint(typing.types)",
        "import qiskit\nprint(qiskit.passmanager.base_passmanager.dill.pointers.gc.get_objects)",
        "def gen():\n    yield 1\ng = gen()\nprint(g.gi_frame.f_back)",
        "try:\n    1 / 0\nexcept Exception as e:\n    print(e.with_traceback(None))\n    t = e.args\nx = (lambda: 0)\nprint(x.f_globals)",
        "import typing\ndef f(a: 'x'):\n    pass\nprint(typing.get_type_hints(f))",
    ],
)
def test_known_escape_routes_are_blocked_before_running(code):
    result = execute_notebook_code(code)
    assert result["success"] is False
    assert "Security Restriction" in result["error"]


def test_lesson_style_code_still_runs():
    code = (
        "from qiskit import QuantumCircuit, transpile\n"
        "from qiskit_aer import AerSimulator\n"
        "import json as _qi_json\n"
        "qc = QuantumCircuit(2)\n"
        "qc.h(0)\n"
        "qc.cx(0, 1)\n"
        "qc.measure_all()\n"
        "sim = AerSimulator()\n"
        "counts = sim.run(transpile(qc, sim), shots=100).result().get_counts()\n"
        "print(sorted(counts) == ['00', '11'])\n"
        "plt.bar(list(counts), list(counts.values()))\n"
    )
    result = execute_notebook_code(code)
    assert result["success"], result["error"]
    assert "True" in result["stdout"]
    assert len(result["figures"]) == 1


# --- The result channel -------------------------------------------------------------

def test_results_come_back_as_plain_json_not_pickle(tmp_path):
    forged = tmp_path / "result.json"
    forged.write_text(json.dumps({"success": True, "stdout": 1, "stderr": "", "error": None, "figures": []}))
    assert _read_result(str(forged))["success"] is False
    good = {"success": True, "stdout": "hi", "stderr": "", "error": None, "figures": ["iVBORw0KGgo="]}
    forged.write_text(json.dumps(good))
    assert _read_result(str(forged)) == {**good, "figures": [b"\x89PNG\r\n\x1a\n"]}
