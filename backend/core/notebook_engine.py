"""Restricted teaching sandbox for learner-written Qiskit code.

Layers of protection:

1. Static AST checks: only allowlisted modules may be imported, dangerous
   builtins are unavailable, and dunder / module-escape attribute access is
   rejected before anything runs.
2. Process isolation: code runs in a fresh Python process with a wall-clock timeout,
   a CPU limit, a memory cap and a minimal environment that holds no secrets.
3. An audit hook in that process (``sandbox_guard``) refuses system files,
   process spawns, sockets and writes outside its own folder, however the
   learner reached them. The worker reports back in plain JSON, never pickle.
4. This server process is made undumpable on Linux, so its environment cannot
   be read through /proc even by a worker that gets past everything else.

Pure-Python sandboxing is best-effort; do not expose this to untrusted users
without an additional OS-level boundary (container, seccomp, etc.).
"""

import ast
import contextlib
import io
import base64
import binascii
import json
import os
import subprocess
import sys
import tempfile
import traceback

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "qiskit-intuition-mpl"))

try:  # Optional: the Vercel backend omits matplotlib to keep its bundle small.
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
except ImportError:
    plt = None
import numpy as np
import qiskit
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

from backend.core import sandbox_guard

sandbox_guard.make_process_undumpable()

DEFAULT_TIMEOUT_SECONDS = 15
MAX_OUTPUT_CHARS = 20_000
MAX_FIGURES = 8
# Extra memory a learner program may allocate beyond the interpreter's own
# footprint. Stops one heavy program from exhausting a small shared host.
MEMORY_HEADROOM_BYTES = 1024 ** 3
# Keep numerical libraries single-threaded so concurrent learners share CPUs fairly.
_SINGLE_THREAD_ENV = {
    "OMP_NUM_THREADS": "1",
    "OPENBLAS_NUM_THREADS": "1",
    "MKL_NUM_THREADS": "1",
    "RAYON_NUM_THREADS": "1",
}

# Only these top-level packages may be imported by learner code.
ALLOWED_MODULES = {
    "qiskit", "qiskit_aer", "numpy", "matplotlib", "math", "cmath", "random",
    "itertools", "functools", "collections", "fractions", "decimal", "statistics",
    "typing", "dataclasses", "copy", "string", "re", "operator", "json", "time",
}

BLOCKED_CALLS = {
    "eval", "exec", "compile", "open", "__import__", "getattr", "setattr",
    "delattr", "globals", "locals", "vars", "breakpoint", "input",
}

# Attribute names that reach the OS, the interpreter, or the filesystem
# (e.g. ``matplotlib.os`` or ``np.loadtxt``).
BLOCKED_ATTRS = {
    "os", "sys", "subprocess", "shutil", "socket", "importlib", "builtins",
    "pathlib", "io", "ctypes", "pickle", "marshal", "signal", "threading",
    "multiprocessing", "system", "popen", "spawn", "fork",
    "load", "loads", "loadtxt", "genfromtxt", "fromfile", "tofile", "memmap",
    "save", "savez", "savez_compressed", "savetxt", "savefig", "ctypeslib",
    # str.format templates walk attributes ("{0.__init__.__globals__}") at run
    # time, out of reach of the AST check. f-strings are checked, so they stay.
    "format", "format_map", "vformat", "Formatter",
    # Library helpers that open a path the learner names. The audit hook in the
    # worker stops these anyway; refusing them here gives a clearer message.
    "DataSource", "fromregex", "recfromcsv", "recfromtxt", "from_qasm_file",
    "rc_params_from_file", "rc_file", "open", "imread", "get_sample_data",
    # Attribute access by string, out of reach of this check.
    "attrgetter", "methodcaller",
    # Raw memory views that can read or rewrite any part of the process.
    "as_strided", "stride_tricks",
    # The QASM parsers read include files in Rust, below the audit hook.
    "qasm2", "qasm3", "from_qasm_str", "qasm",
    # The real builtins under other names, and attribute access by string.
    "bltns", "getattr", "setattr", "delattr", "eval", "exec", "vars", "globals",
    "locals", "breakpoint",
    # Frames, code objects and tracebacks lead back to this module's globals and
    # the real builtins; gc, inspect and friends hand out any live object.
    "f_back", "f_globals", "f_builtins", "f_locals", "f_code", "f_trace", "f_lineno",
    "gi_frame", "gi_code", "cr_frame", "cr_code", "ag_frame", "ag_code",
    "tb_frame", "tb_next", "co_code", "co_consts", "co_names",
    "currentframe", "getframe", "settrace", "getouterframes", "getinnerframes",
    "gc", "get_objects", "get_referrers", "get_referents", "inspect", "getmembers",
    "enum", "types", "logging", "dill", "pointers", "importlib", "modules",
    "get_type_hints", "ForwardRef", "sympify", "parse_expr", "literal_eval",
}
FORMAT_ATTRS = {"format", "format_map"}

# The only parts of this process's environment the worker needs. Everything
# else (account secrets, database tokens, API keys) stays out of its reach.
CHILD_ENV_KEYS = (
    "PATH", "HOME", "LANG", "LC_ALL", "LC_CTYPE", "TMPDIR", "TEMP", "TMP",
    "SYSTEMROOT", "MPLCONFIGDIR",
)

# Dunder attributes learners legitimately read.
ALLOWED_DUNDERS = {"__name__", "__doc__", "__version__", "__init__", "__len__"}

BLOCKED_KEYWORDS = {"filename", "file", "fname"}

_orig_import = __import__


def _safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    if level or name.split(".")[0] not in ALLOWED_MODULES:
        raise ImportError(f"Security Restriction: Module '{name}' is not available in the sandbox.")
    return _orig_import(name, globals, locals, fromlist, level)


SAFE_BUILTINS = {
    "__import__": _safe_import,
    "__build_class__": __build_class__,
    "__name__": "__sandbox__",
    "abs": abs, "all": all, "any": any, "bin": bin, "bool": bool,
    "callable": callable, "chr": chr, "complex": complex, "dict": dict,
    "divmod": divmod, "enumerate": enumerate, "filter": filter, "float": float,
    "format": format, "frozenset": frozenset, "hasattr": hasattr, "hash": hash,
    "hex": hex, "int": int, "isinstance": isinstance, "issubclass": issubclass,
    "iter": iter, "len": len, "list": list, "map": map, "max": max, "min": min,
    "next": next, "object": object, "oct": oct, "ord": ord, "pow": pow,
    "print": print, "property": property, "range": range, "repr": repr,
    "reversed": reversed, "round": round, "set": set, "slice": slice,
    "sorted": sorted, "staticmethod": staticmethod, "classmethod": classmethod,
    "str": str, "sum": sum, "super": super, "tuple": tuple, "type": type, "zip": zip,
    "True": True, "False": False, "None": None,
    "Exception": Exception, "ArithmeticError": ArithmeticError,
    "AssertionError": AssertionError, "AttributeError": AttributeError,
    "ImportError": ImportError, "IndexError": IndexError, "KeyError": KeyError,
    "NameError": NameError, "NotImplementedError": NotImplementedError,
    "RuntimeError": RuntimeError, "StopIteration": StopIteration,
    "TypeError": TypeError, "ValueError": ValueError,
    "ZeroDivisionError": ZeroDivisionError,
}


def _is_private(name: str) -> bool:
    """Library internals (``random._os`` is ``os``) are walled off; lessons never need them."""
    return name.startswith("_") and not (name.startswith("__") and name.endswith("__"))


def _blocked_path(dotted: str) -> bool:
    return any(part in BLOCKED_ATTRS or _is_private(part) for part in dotted.split("."))


def validate_code_safety(code_string: str):
    """Return an error message if the code uses anything outside the sandbox, else None."""
    try:
        tree = ast.parse(code_string)
    except SyntaxError as e:
        return f"Syntax Error: {e.msg} at line {e.lineno}"

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name.split(".")[0] not in ALLOWED_MODULES:
                    return f"Security Restriction: Importing '{alias.name}' is not available in the sandbox."
                if _blocked_path(alias.name):
                    return f"Security Restriction: Importing '{alias.name}' is prohibited in the sandbox."
        elif isinstance(node, ast.ImportFrom):
            if node.level or not node.module or node.module.split(".")[0] not in ALLOWED_MODULES:
                return f"Security Restriction: Importing from '{node.module}' is not available in the sandbox."
            if _blocked_path(node.module):
                return f"Security Restriction: Importing from '{node.module}' is prohibited in the sandbox."
            for alias in node.names:
                if alias.name == "*":
                    return "Security Restriction: 'import *' is not available in the sandbox. Import the names you need."
                if alias.name in BLOCKED_ATTRS or _is_private(alias.name):
                    return f"Security Restriction: Importing '{alias.name}' is prohibited in the sandbox."
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in BLOCKED_CALLS:
                return f"Security Restriction: Function '{node.func.id}()' is prohibited in the sandbox."
            for kw in node.keywords:
                if kw.arg in BLOCKED_KEYWORDS:
                    return f"Security Restriction: Writing files ('{kw.arg}=') is prohibited in the sandbox."
        elif isinstance(node, ast.Attribute):
            attr = node.attr
            is_dunder = attr.startswith("__") and attr.endswith("__")
            if attr in FORMAT_ATTRS:
                return (
                    f"Security Restriction: '.{attr}()' is not available in the sandbox. "
                    'Use an f-string instead, for example f"{p:.3f}".'
                )
            if attr in BLOCKED_ATTRS or (is_dunder and attr not in ALLOWED_DUNDERS) or _is_private(attr):
                return f"Security Restriction: Accessing '{attr}' is prohibited in the sandbox."
        elif isinstance(node, ast.Name):
            if node.id.startswith("__") and node.id not in ALLOWED_DUNDERS:
                return f"Security Restriction: Name '{node.id}' is prohibited in the sandbox."

    return None


def _truncate(text: str) -> str:
    if len(text) <= MAX_OUTPUT_CHARS:
        return text
    return text[:MAX_OUTPUT_CHARS] + f"\n... output truncated after {MAX_OUTPUT_CHARS} characters"


def _figure_to_png(fig) -> bytes:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    return buf.getvalue()


def _run(code_string: str) -> dict:
    """Execute code in the current process and return a picklable result."""
    stdout_buffer = io.StringIO()
    stderr_buffer = io.StringIO()
    existing_figs = set(plt.get_fignums()) if plt else set()

    # A single namespace so functions defined by the learner can see
    # module-level names (separate globals/locals breaks closures).
    namespace = {
        "__builtins__": SAFE_BUILTINS,
        "__name__": "__sandbox__",
        "np": np,
        "qiskit": qiskit,
        "QuantumCircuit": QuantumCircuit,
        "Statevector": Statevector,
    }
    if plt:
        namespace["plt"] = plt

    # Print numpy scalars as plain numbers (numpy 2 shows np.float64(...)).
    with contextlib.suppress(Exception):
        np.set_printoptions(legacy="1.25")

    success = True
    error_message = None
    with contextlib.redirect_stdout(stdout_buffer), contextlib.redirect_stderr(stderr_buffer):
        try:
            exec(compile(code_string, "<sandbox>", "exec"), namespace)
        except MemoryError:
            success = False
            error_message = (
                f"Memory limit: the program tried to use more than about {MEMORY_HEADROOM_BYTES // 1024 ** 3} GB. "
                "Use fewer qubits or shots, or smaller arrays. (Each extra qubit doubles a statevector's size.)"
            )
        except Exception:
            success = False
            error_message = _truncate(traceback.format_exc())

    figures = []
    for num in sorted(set(plt.get_fignums()) - existing_figs) if plt else []:
        fig = plt.figure(num)
        if len(figures) < MAX_FIGURES:
            try:
                figures.append(_figure_to_png(fig))
            except Exception:
                pass
        plt.close(num)

    return {
        "success": success,
        "stdout": _truncate(stdout_buffer.getvalue()),
        "stderr": _truncate(stderr_buffer.getvalue()),
        "error": error_message,
        "figures": figures,
    }


def _failure(message: str) -> dict:
    return {"success": False, "stdout": "", "stderr": message, "error": message, "figures": []}


def _read_result(path: str) -> dict:
    """Load the worker's JSON result, trusting nothing about its shape.

    Learner code shares the worker's folder, so it could overwrite this file.
    JSON can only ever carry data, and the checks below keep forged output to
    what the learner could have printed anyway.
    """
    try:
        with open(path, encoding="utf-8") as handle:
            data = json.load(handle)
        figures = data["figures"]
        valid = (
            isinstance(data["success"], bool)
            and isinstance(data["stdout"], str)
            and isinstance(data["stderr"], str)
            and (data["error"] is None or isinstance(data["error"], str))
            and isinstance(figures, list)
            and len(figures) <= MAX_FIGURES
            and all(isinstance(figure, str) for figure in figures)
        )
        if not valid:
            return _failure("The sandbox returned an unreadable result.")
        return {
            "success": data["success"],
            "stdout": _truncate(data["stdout"]),
            "stderr": _truncate(data["stderr"]),
            "error": None if data["error"] is None else _truncate(data["error"]),
            "figures": [base64.b64decode(figure, validate=True) for figure in figures],
        }
    except (OSError, ValueError, KeyError, TypeError, binascii.Error):
        return _failure("The sandbox returned an unreadable result.")


_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def _child_env() -> dict:
    """Environment for the worker: minimal, single-threaded, able to import what we can.

    Only the variables in CHILD_ENV_KEYS are passed on, so learner code never
    sees backend secrets. The worker gets this process's import path as
    PYTHONPATH: hosts that install packages at startup (Vercel) put them on
    this process's ``sys.path`` only, so a plain child would not find numpy.
    """
    env = {key: os.environ[key] for key in CHILD_ENV_KEYS if key in os.environ}
    env.update(_SINGLE_THREAD_ENV)
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    paths = [_PROJECT_ROOT, *sys.path, *os.environ.get("PYTHONPATH", "").split(os.pathsep)]
    env["PYTHONPATH"] = os.pathsep.join(dict.fromkeys(path for path in paths if path))
    return env


def execute_notebook_code(code_string, timeout: float = DEFAULT_TIMEOUT_SECONDS):
    """Validate and run learner code in a fresh, time-limited Python process.

    A new interpreter per run (rather than ``fork``) is deliberate: forking the
    multi-threaded app server deadlocks once Qiskit's Rust thread pool has been
    used (e.g. by ``transpile``), and a fresh process never inherits app state.

    Returns a dict with ``success``, ``stdout``, ``stderr``, ``error`` and
    ``figures`` (a list of PNG images as bytes).
    """
    security_violation = validate_code_safety(code_string)
    if security_violation:
        return _failure(security_violation)
    return _run_in_worker(code_string, timeout)


def _run_in_worker(code_string: str, timeout: float = DEFAULT_TIMEOUT_SECONDS) -> dict:
    """Run already-validated code in a fresh, locked-down Python process."""
    env = _child_env()
    with tempfile.TemporaryDirectory(prefix="qi-sandbox-") as workdir:
        env["TMPDIR"] = workdir
        result_path = os.path.join(workdir, "result.json")
        try:
            completed = subprocess.run(
                [sys.executable, "-m", "backend.core.notebook_engine", result_path, str(timeout)],
                input=code_string,
                text=True,
                capture_output=True,
                timeout=timeout,
                cwd=workdir,
                env=env,
            )
        except subprocess.TimeoutExpired:
            return _failure(
                f"Timeout: execution exceeded {timeout:g} seconds and was stopped. "
                "Check for infinite loops or reduce the number of shots/qubits."
            )
        if not os.path.exists(result_path):
            detail = (completed.stderr or "").strip()[-2000:]
            return _failure("The sandbox process exited unexpectedly (possibly out of memory).\n" + detail)
        return _read_result(result_path)


def _current_address_space() -> int | None:
    try:
        with open("/proc/self/status", encoding="ascii") as status:
            for line in status:
                if line.startswith("VmSize:"):
                    return int(line.split()[1]) * 1024
    except (OSError, ValueError):
        pass
    return None


def _limit_memory(timeout: float) -> None:
    """Cap this process at its current size plus MEMORY_HEADROOM_BYTES (POSIX only)."""
    try:
        import resource
    except ImportError:  # Windows: rely on the timeout alone
        return
    current = _current_address_space()
    if current is not None:
        limit = current + MEMORY_HEADROOM_BYTES
        resource.setrlimit(resource.RLIMIT_AS, (limit, limit))
    cpu = int(timeout) + 2
    resource.setrlimit(resource.RLIMIT_CPU, (cpu, cpu))


def _worker_main(result_path: str, timeout: float = DEFAULT_TIMEOUT_SECONDS) -> None:
    code_string = sys.stdin.read()
    try:
        _limit_memory(timeout)
        # From here on the kernel refuses to start programs (Linux), and only the
        # worker's own folder can be written.
        sandbox_guard.lock_down_process()
        sandbox_guard.install([os.getcwd()])
        result = _run(code_string)
    except Exception:
        result = _failure(traceback.format_exc())
    result = {**result, "figures": [base64.b64encode(png).decode("ascii") for png in result["figures"]]}
    with open(result_path, "w", encoding="utf-8") as handle:
        json.dump(result, handle)


if __name__ == "__main__":
    _worker_main(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_TIMEOUT_SECONDS)
