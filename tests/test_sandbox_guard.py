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


@pytest.mark.skipif(not sys.platform.startswith("linux"), reason="/proc exists on Linux only")
def test_hardware_facts_aer_needs_can_be_read():
    """Qiskit Aer sizes simulations from /proc/meminfo (through psutil)."""
    result = escaped("print(opener('/proc/meminfo').read()[:8], len(OS.listdir('/sys/devices/system/cpu')) > 0)")
    assert result["success"], result["error"]
    assert result["stdout"].startswith("MemTotal")


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
    program = sandbox_guard._seccomp_program(*sandbox_guard._SECCOMP_TABLES["x86_64"], x86=True)
    assert (0x06, 0, 0, 0x7FFF0000) in program
    assert (0x15, 0, 1, 59) in program  # execve
    assert all(step[0] in (0x20, 0x15, 0x35, 0x45, 0x06) for step in program)


# Linux syscall numbers the filter is judged on (not taken from the code under test).
_SYSCALLS = {
    "x86_64": {"read": 0, "execve": 59, "socket": 41, "fork": 57, "vfork": 58, "clone": 56,
               "clone3": 435, "io_uring_setup": 425},
    "aarch64": {"read": 63, "execve": 221, "socket": 198, "clone": 220, "clone3": 435,
                "io_uring_setup": 425},
}
_ALLOW, _EPERM, _ENOSYS = 0x7FFF0000, 0x00050000 | 1, 0x00050000 | 38
_CLONE_THREAD, _SIGCHLD = 0x00010000, 17
_PTHREAD_FLAGS = 0x3D0F00  # what glibc passes to clone() for a new thread


def _verdict(program, audit_arch, number, first_arg=0):
    """Run a classic BPF seccomp program the way the kernel would."""
    data = {0: number, 4: audit_arch, 16: first_arg, 20: 0}
    accumulator, step = 0, 0
    while True:
        code, if_true, if_false, value = program[step]
        if code == 0x20:
            accumulator = data[value]
            step += 1
        elif code == 0x06:
            return value
        else:
            taken = {0x15: accumulator == value, 0x35: accumulator >= value,
                     0x45: bool(accumulator & value)}[code]
            step += 1 + (if_true if taken else if_false)


@pytest.mark.parametrize("machine", ["x86_64", "aarch64"])
def test_seccomp_program_refuses_network_and_new_processes(machine):
    # An escape that switches off the audit hook (it lives in the worker's own
    # memory) must still find the kernel refusing sockets and new processes.
    table = sandbox_guard._SECCOMP_TABLES[machine]
    program = sandbox_guard._seccomp_program(*table, x86=machine == "x86_64")
    arch, calls = table[0], _SYSCALLS[machine]
    assert _verdict(program, arch, calls["read"]) == _ALLOW
    for name in ("execve", "socket", "fork", "vfork", "io_uring_setup"):
        if name in calls:
            assert _verdict(program, arch, calls[name]) == _EPERM, name
    assert _verdict(program, arch, calls["clone"], _SIGCHLD) == _EPERM  # os.fork()
    assert _verdict(program, arch, calls["clone"], _PTHREAD_FLAGS) == _ALLOW  # threads still start
    assert _verdict(program, arch, calls["clone3"]) == _ENOSYS  # glibc then falls back to clone()
    assert _verdict(program, 0xC0DE, calls["read"]) == _EPERM  # a foreign architecture


@pytest.mark.skipif(not sys.platform.startswith("linux"), reason="seccomp is Linux only")
def test_seccomp_stops_sockets_and_forks_but_not_threads_without_the_audit_hook():
    probe = (
        "from backend.core import sandbox_guard\n"
        "assert sandbox_guard._install_seccomp(), 'filter not installed'\n"
        "import os, socket, threading\n"
        "for attempt in (socket.socket, os.fork):\n"
        "    try:\n"
        "        attempt()\n"
        "    except PermissionError:\n"
        "        print('refused')\n"
        "worker = threading.Thread(target=print, args=('thread ran',))\n"
        "worker.start()\n"
        "worker.join()\n"
    )
    child = subprocess.run([sys.executable, "-c", probe], capture_output=True, text=True, timeout=60,
                           cwd=notebook_engine._PROJECT_ROOT)
    assert child.stdout.split("\n")[:3] == ["refused", "refused", "thread ran"], child.stderr


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


def test_a_device_shared_with_python_is_not_treated_as_a_pseudo_filesystem(tmp_path, monkeypatch):
    """On AWS Lambda /dev lives on the same device as Python's own files."""
    python_home = tmp_path / "lang"
    python_home.mkdir()
    (python_home / "zoneinfo.py").write_text("x = 1\n")
    monkeypatch.setattr(sandbox_guard, "DENIED_FILESYSTEMS", (str(tmp_path),))
    guard = sandbox_guard.build_guard([str(tmp_path / "work")], cwd=str(tmp_path), readable_dirs=[str(python_home)])
    guard("open", (str(python_home / "zoneinfo.py"), "r", 0))


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
        # Round three (weekly audit 2026-11-24): match patterns read attributes by
        # name, and a numpy __array_interface__ on a learner class reads and writes
        # raw memory, which switches the audit hook off.
        "import random\nmatch random:\n    case object(_os=OS):\n        pass",
        "match np:\n    case object(__dict__=D):\n        pass",
        "class M:\n    @property\n    def __array_interface__(self):\n        return {}",
        "M = type('M', (), {'__array_interface__': {}})",
        "M = type('M', (), dict(__array_interface__={}))",
        "def f(__array_interface__=None):\n    pass",
        "import collections.abc\nclass M(metaclass=collections.abc.ABCMeta):\n    pass",
        "from collections.abc import ABCMeta",
        "import typing\nprint(typing.NamedTupleMeta)",
        "import dataclasses\nM = dataclasses.make_dataclass('M', ['x'])",
        "from functools import update_wrapper",
        # singledispatch evaluates string annotations, out of reach of this check.
        "import functools\n@functools.singledispatch\ndef g(x):\n    return x\n"
        "def f(x: 'random._os'):\n    pass\ng.register(f)",
    ],
)
def test_known_escape_routes_are_blocked_before_running(code):
    result = execute_notebook_code(code)
    assert result["success"] is False
    assert "Security Restriction" in result["error"]


@pytest.mark.parametrize(
    "code",
    [
        "M = type('M', (), {})",
        "print(type(int))",
        "key = '_' * 2 + 'array_interface' + '_' * 2\nM = type(int)('M', (), {key: {}})",
    ],
)
def test_classes_cannot_be_built_from_runtime_strings(code):
    # Names built at run time slip past the AST check, so type() itself refuses
    # to make classes or hand out the metaclass that would.
    result = execute_notebook_code(code)
    assert result["success"] is False
    assert "Security Restriction" in result["error"]


def test_ordinary_classes_and_type_checks_still_work():
    code = (
        "class Qubit:\n"
        "    def __init__(self, name):\n"
        "        self.name = name\n"
        "    def __repr__(self):\n"
        "        return f'Qubit({self.name})'\n"
        "    def __eq__(self, other):\n"
        "        return isinstance(other, Qubit) and other.name == self.name\n"
        "print(Qubit('q0'), Qubit('q0') == Qubit('q0'), type(3).__name__, type(1.5) is float)\n"
        "if __name__ == '__sandbox__':\n"
        "    print('ok')\n"
    )
    result = execute_notebook_code(code)
    assert result["success"], result["error"]
    assert result["stdout"].split() == ["Qubit(q0)", "True", "int", "True", "ok"]


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
