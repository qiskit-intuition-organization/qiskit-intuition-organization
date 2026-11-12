"""Tests for the sandbox execution core in the FastAPI backend layout."""
import sys

import pytest

from backend.core.notebook_engine import _child_env, execute_notebook_code


def test_simple_execution():
    result = execute_notebook_code("print('hello from sandbox')")
    assert result["success"] is True
    assert "hello from sandbox" in result["stdout"]


def test_qiskit_runs_in_sandbox():
    code = (
        "from qiskit import QuantumCircuit\n"
        "qc = QuantumCircuit(1)\n"
        "qc.h(0)\n"
        "print(qc.num_qubits)\n"
    )
    result = execute_notebook_code(code)
    assert result["success"] is True
    assert "1" in result["stdout"]


def test_error_is_captured():
    result = execute_notebook_code("raise ValueError('boom')")
    assert result["success"] is False
    assert "boom" in result["error"]


def test_functions_see_module_level_names():
    code = "import math\ndef f():\n    return math.pi\nprint(round(f(), 2))\n"
    result = execute_notebook_code(code)
    assert result["success"] is True, result["error"]
    assert "3.14" in result["stdout"]


def test_figures_are_returned_as_png_bytes():
    result = execute_notebook_code("plt.plot([0, 1], [1, 0])\n")
    assert result["success"] is True
    assert len(result["figures"]) == 1
    assert result["figures"][0].startswith(b"\x89PNG")


def test_infinite_loop_times_out():
    result = execute_notebook_code("while True:\n    pass\n", timeout=1)
    assert result["success"] is False
    assert "Timeout" in result["error"]


@pytest.mark.parametrize(
    "code",
    [
        "import importlib",
        "import io",
        "import matplotlib\nmatplotlib.os.getcwd()",
        "np.loadtxt('/etc/hostname')",
        "().__class__.__base__",
        "from qiskit import sys",
        "qc = QuantumCircuit(1)\nqc.draw(output='text', filename='x.txt')",
    ],
)
def test_escape_attempts_are_blocked(code):
    result = execute_notebook_code(code)
    assert result["success"] is False
    assert "Security Restriction" in result["error"]


@pytest.mark.skipif(
    sys.platform == "darwin",
    reason="macOS ignores RLIMIT_AS; the memory cap is enforced on Linux, where CI and Vercel run",
)
def test_memory_hungry_program_is_stopped_with_a_clear_message():
    result = execute_notebook_code("big = np.ones(600_000_000)\nprint(big.sum())\n")
    assert result["success"] is False
    assert "Memory limit" in result["error"]


def test_normal_qiskit_program_fits_within_the_memory_cap():
    code = (
        "from qiskit import QuantumCircuit, transpile\n"
        "from qiskit_aer import AerSimulator\n"
        "qc = QuantumCircuit(12)\n"
        "qc.h(range(12))\n"
        "qc.measure_all()\n"
        "sim = AerSimulator()\n"
        "print(len(sim.run(transpile(qc, sim), shots=200).result().get_counts()) > 1)\n"
    )
    result = execute_notebook_code(code)
    assert result["success"] is True, result["error"]
    assert "True" in result["stdout"]


def test_sandbox_runs_without_matplotlib(monkeypatch):
    """The Vercel backend omits matplotlib; code must still run, just without figures."""
    from backend.core import notebook_engine

    monkeypatch.setattr(notebook_engine, "plt", None)
    result = notebook_engine._run("from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.h(0)\nprint(qc.num_qubits)")
    assert result["success"], result["error"]
    assert result["stdout"].strip() == "1"
    assert result["figures"] == []


def test_worker_inherits_this_process_import_path(monkeypatch, tmp_path):
    """Vercel installs packages onto the server's sys.path only; the worker must see them too."""
    import subprocess
    import sys

    from backend.core import notebook_engine

    extra = tmp_path / "runtime-site-packages"
    extra.mkdir()
    (extra / "runtime_only_pkg.py").write_text("VALUE = 42\n")
    monkeypatch.setattr(sys, "path", [*sys.path, str(extra)])
    child = subprocess.run(
        [sys.executable, "-c", "import runtime_only_pkg; print(runtime_only_pkg.VALUE)"],
        env=notebook_engine._child_env(), capture_output=True, text=True, cwd=tmp_path, timeout=60,
    )
    assert child.stdout.strip() == "42", child.stderr


@pytest.mark.parametrize(
    "code",
    [
        # str.format walks attributes inside the template, out of reach of the AST check.
        'from qiskit import QuantumCircuit\nprint("{0.__init__.__globals__}".format(QuantumCircuit(1)))',
        'print(str.format("{0.__class__}", 1))',
        'print("{a}".format_map({"a": 1}))',
        "from string import Formatter",
        "import string\nprint(string.Formatter().vformat('{0}', [1], {}))",
    ],
)
def test_format_templates_are_blocked(code):
    result = execute_notebook_code(code)
    assert result["success"] is False
    assert "Security Restriction" in result["error"]


def test_format_message_points_to_f_strings():
    result = execute_notebook_code('print("{:.3f}".format(0.5))')
    assert "f-string" in result["error"]


def test_f_strings_still_work():
    result = execute_notebook_code('p = 0.5\nprint(f"{p:.3f}")\n')
    assert result["success"] is True, result["error"]
    assert "0.500" in result["stdout"]


def test_worker_never_receives_backend_secrets(monkeypatch):
    for name in ["AUTH_JWT_SECRET", "TURSO_AUTH_TOKEN", "TURSO_DATABASE_TURSO_AUTH_TOKEN",
                 "TURSO_DATABASE_URL", "RESEND_API_KEY", "GEMINI_API_KEY", "SOME_FUTURE_SECRET"]:
        monkeypatch.setenv(name, "must-not-reach-learner-code")
    env = _child_env()
    assert "must-not-reach-learner-code" not in env.values()
    assert env["OMP_NUM_THREADS"] == "1"
    assert env["PYTHONPATH"]


@pytest.mark.parametrize(
    "code",
    [
        # numpy's DataSource opens any path the worker can read, e.g. /proc/<ppid>/environ.
        "import numpy as np\nprint(np.lib.npyio.DataSource().open('/etc/hostname').read())",
        "from numpy.lib.npyio import DataSource\nprint(DataSource().open('/etc/hostname').read())",
        "import numpy as np\nprint(np.fromregex('/etc/hostname', r'(.)', [('c', 'S1')]))",
        "from qiskit import QuantumCircuit\nQuantumCircuit.from_qasm_file('/etc/hostname')",
        "import matplotlib\nmatplotlib.rc_params_from_file('/etc/hostname')",
    ],
)
def test_file_reading_helpers_are_blocked(code):
    result = execute_notebook_code(code)
    assert not result["success"]
    assert "Security Restriction" in result["error"]
