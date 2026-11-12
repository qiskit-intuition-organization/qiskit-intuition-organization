"""Last line of defence for the code sandbox's worker process.

The AST check in ``notebook_engine`` stops most escapes before code runs, but
scientific libraries offer endless indirect ways to reach ``open`` or ``os``
(numpy keeps a reference to the builtin ``open``; ``random._os`` is ``os``).
So the worker also gets:

* ``lock_down_process``: on Linux a seccomp filter makes the kernel refuse to
  start any program, and the unaudited process helpers are removed.
* ``install``: a PEP 578 audit hook that sees every file open, spawn and socket
  the worker makes, whichever library asks. Python code cannot remove it.

Paths are judged by what the kernel will open, not by how they are spelled:
every folder along a path is compared by (device, inode) with the forbidden
roots, so case changes, ``..`` after a symlink and macOS firmlinks all land on
the same answer. The hook keeps its state in a positional default tuple
(replacing it raises an audited ``object.__setattr__``) and calls only
built-in functions, so patching Python modules cannot fool it.
"""

import os
import sys

# Reading anything here could expose process environments (and with them the
# backend's secrets), host configuration or devices.
DENIED_ROOTS = ("/proc", "/sys", "/dev", "/etc", "/private/etc", "/run", "/var/run", "/root")
# Every file on these pseudo filesystems is refused, however it was reached.
DENIED_FILESYSTEMS = ("/proc", "/sys", "/dev")
# Harmless system files: devices, and the hardware facts Qiskit Aer reads (via
# psutil) to size simulations. Matched by inode, so no other spelling gets in.
SAFE_SYSTEM_FILES = (
    "/dev/null", "/dev/zero", "/dev/random", "/dev/urandom",
    "/proc/meminfo", "/proc/cpuinfo", "/proc/stat", "/proc/loadavg",
)
SAFE_SYSTEM_TREES = ("/sys/devices/system/cpu",)
# Local databases never need reading by learner code.
DATABASE_SUFFIXES = (".sqlite3", ".sqlite", ".db")
# Other learners' worker folders live beside this one; they are off limits.
WORKER_FOLDER_PREFIX = "qi-sandbox-"
# Spawning processes, opening sockets, calling C directly, rewriting functions
# or moving the working folder are never needed by learner code.
BLOCKED_EVENT_PREFIXES = (
    "subprocess.", "os.system", "os.exec", "os.posix_spawn", "os.spawn", "os.fork",
    "os.forkpty", "os.kill", "os.killpg", "os.startfile", "pty.", "socket.", "ctypes.",
    "os.symlink", "os.link", "os.chdir", "os.chroot", "os.fchdir", "_winapi.",
)
FUNCTION_INTERNALS = ("__code__", "__defaults__", "__kwdefaults__")
# Events whose first argument is a path that is opened or listed.
READ_PATH_EVENTS = ("open", "os.listdir", "os.scandir")
# Events that change files. Every path argument must sit in a writable folder.
CHANGE_PATH_EVENTS = (
    "os.remove", "os.rmdir", "os.rename", "os.mkdir", "os.chmod", "os.chown",
    "os.truncate", "os.utime", "os.chflags", "os.lchflags", "os.lchmod", "os.lchown",
    "os.setxattr", "os.removexattr", "shutil.copyfile", "shutil.copymode",
    "shutil.copystat", "shutil.copytree", "shutil.rmtree", "shutil.move",
)
WRITE_FLAGS = os.O_WRONLY | os.O_RDWR | os.O_CREAT | os.O_APPEND | os.O_TRUNC
# Process helpers that start programs or make files without an audit event.
UNAUDITED_HELPERS = (("_posixsubprocess", "fork_exec"), ("os", "mkfifo"), ("os", "mknod"),
                     ("posix", "mkfifo"), ("posix", "mknod"))


def as_text(path, _type=type, _str=str, _bytes=bytes):
    """A str/bytes path as text, or None for anything else.

    Exotic path objects are refused outright: an ``__fspath__`` could answer
    the guard with one path and ``open`` with another.
    """
    if _type(path) is _bytes:
        return path.decode("utf-8", "surrogateescape")
    if _type(path) is _str:
        return path
    return None


def prefixes(path, cwd):
    """Every folder the kernel walks through for ``path``, in order, as raw text.

    ``..`` is kept, not collapsed: ``stat`` resolves it after symlinks, exactly
    as ``open`` will.
    """
    if not path.startswith("/"):
        path = cwd + "/" + path
    found = []
    current = ""
    for part in path.split("/"):
        if part == "":
            continue
        current = current + "/" + part
        found.append(current)
    return found


def identity(path, stat=os.stat):
    try:
        info = stat(path)
    except (OSError, ValueError):
        return None
    return (info.st_dev, info.st_ino)


def normalise(path, cwd):
    """Absolute, ``..``-free text form of a path (used for messages)."""
    text = as_text(path)
    if text is None:
        return None
    parts = []
    for step in prefixes(text, cwd):
        part = step.rsplit("/", 1)[-1]
        if part == ".":
            continue
        if part == "..":
            if parts:
                parts.pop()
            continue
        parts.append(part)
    return "/" + "/".join(parts)


def _identities(paths):
    return frozenset(found for found in (identity(path) for path in paths) if found)


def default_readable_dirs():
    """Where a worker may read: Python itself, installed packages, the app's code."""
    found = [sys.prefix, sys.base_prefix, sys.exec_prefix, *sys.path, os.environ.get("MPLCONFIGDIR", "")]
    return [path for path in found if path and os.path.isdir(path)]


def build_guard(writable_dirs, cwd=None, readable_dirs=None):
    """Return the audit hook for a worker.

    It may write only in ``writable_dirs`` and read only there or in
    ``readable_dirs`` (by default Python's own folders and ``sys.path``).
    """
    here = cwd or os.getcwd()
    filesystems = []
    for root in DENIED_FILESYSTEMS:
        found = identity(root)
        if found:
            filesystems.append(found[0])
    settings = (
        _identities(writable_dirs), here, _identities(DENIED_ROOTS), frozenset(filesystems),
        _identities(SAFE_SYSTEM_FILES), BLOCKED_EVENT_PREFIXES, FUNCTION_INTERNALS,
        READ_PATH_EVENTS, CHANGE_PATH_EVENTS, WRITE_FLAGS,
        # The folder holding this worker's folder holds the others too. (Inside
        # the worker TMPDIR points at its own folder, so gettempdir() won't do.)
        _identities(os.path.dirname(os.path.abspath(d)) for d in writable_dirs if d),
        WORKER_FOLDER_PREFIX,
        _identities([*writable_dirs, *(default_readable_dirs() if readable_dirs is None else readable_dirs)]),
        DATABASE_SUFFIXES,
        _identities(SAFE_SYSTEM_TREES),
    )

    def guard(event, args, _settings=settings, _as_text=as_text, _prefixes=prefixes,
              _identity=identity, _type=type, _int=int, _str=str, _len=len, _getattr=getattr,
              _tuple=tuple, _range=range, _stat=os.stat, _error=PermissionError):
        (writable, cwd, denied, filesystems, devices, blocked, internals,
         read_events, change_events, write_flags, shared_temp, worker_prefix,
         readable, databases, safe_trees) = _settings

        def within(text, roots):
            steps = _prefixes(text, cwd)
            for index in _range(_len(steps) - 1, -1, -1):
                if _identity(steps[index], _stat) in roots:
                    for later in steps[index + 1:]:
                        if later.rsplit("/", 1)[-1] == "..":
                            return False
                    return True
            return False

        if event.startswith(blocked):
            raise _error(f"'{event}' is not allowed in the sandbox.")
        if event == "object.__setattr__":
            # Libraries set __defaults__ legitimately (namedtuple does), so only
            # the guard's own functions are protected, plus __code__ everywhere.
            if _len(args) > 1 and args[1] in internals:
                target = args[0]
                defaults = _getattr(target, "__defaults__", None)
                own = target is _as_text or target is _prefixes or target is _identity or (
                    _type(defaults) is _tuple and _len(defaults) > 0 and defaults[0] is _settings
                )
                if own or args[1] == "__code__":
                    raise _error("Changing the sandbox guard is not allowed.")
            return
        if event in read_events:
            if not args or _type(args[0]) is _int:  # an already-open file descriptor
                return
            text = _as_text(args[0])
            if text is None:
                raise _error("Only plain text paths can be opened in the sandbox.")
            if text.rsplit("/", 1)[-1].casefold().startswith(".env"):
                raise _error("Reading environment files is not allowed in the sandbox.")
            if text.casefold().endswith(databases):
                raise _error("Reading database files is not allowed in the sandbox.")
            target = _identity(text, _stat)
            safe = target in devices or within(text, safe_trees)
            if not safe and not within(text, readable):
                raise _error(f"Reading '{text}' is not allowed in the sandbox.")
            if not safe:
                if target is not None and target[0] in filesystems:
                    raise _error(f"Reading '{text}' is not allowed in the sandbox.")
                parent = None
                for step in _prefixes(text, cwd):
                    here = _identity(step, _stat)
                    if here in denied:
                        raise _error(f"Reading '{text}' is not allowed in the sandbox.")
                    if (parent is not None and parent in shared_temp and here not in writable
                            and step.rsplit("/", 1)[-1].startswith(worker_prefix)):
                        raise _error("Reading another sandbox's files is not allowed.")
                    parent = here
            if event != "open":
                return
            if target is not None and _stat(text).st_mode & 0o170000 == 0o040000:
                # A folder's file descriptor could serve as dir_fd, and the audit
                # event does not say which folder a relative path starts from.
                raise _error("Opening folders is not allowed in the sandbox.")
            if _len(args) > 2:
                mode, flags = args[1], args[2]
                writing = (_type(mode) is _str and ("w" in mode or "a" in mode or "x" in mode or "+" in mode)) or (
                    _type(flags) is _int and flags > 0 and flags & write_flags
                )
                if writing and not within(text, writable):
                    raise _error(f"Writing '{text}' is not allowed in the sandbox.")
            return
        if event in change_events:
            for arg in args:
                if _type(arg) is _int:
                    continue
                text = _as_text(arg)
                if text is None or not within(text, writable):
                    raise _error(f"Changing files outside the sandbox folder is not allowed ('{event}').")

    return guard


def install(writable_dirs) -> None:
    """Install the guard for the rest of this process's life. Cannot be undone."""
    sys.addaudithook(build_guard(writable_dirs, readable_dirs=default_readable_dirs()))


# --- Process lock-down -----------------------------------------------------------

# Syscalls the worker never needs: starting programs, and reading or writing
# other processes. (Linux numbers per architecture, with the audit arch value.)
_SECCOMP_TABLES = {
    "x86_64": (0xC000003E, (59, 322, 101, 310, 311)),  # execve, execveat, ptrace, process_vm_readv/writev
    "aarch64": (0xC00000B7, (221, 281, 117, 270, 271)),
}


def _seccomp_program(audit_arch, denied, x86):
    load_word, jump_equal, jump_at_least, give = 0x20, 0x15, 0x35, 0x06
    allow, refuse = 0x7FFF0000, 0x00050000 | 1  # SECCOMP_RET_ERRNO | EPERM
    program = [
        (load_word, 0, 0, 4),            # the calling architecture
        (jump_equal, 1, 0, audit_arch),  # ours: skip the refusal below
        (give, 0, 0, refuse),
        (load_word, 0, 0, 0),            # the syscall number
    ]
    if x86:  # the x32 ABI reuses numbers with bit 30 set
        program += [(jump_at_least, 0, 1, 0x40000000), (give, 0, 0, refuse)]
    for number in denied:
        program += [(jump_equal, 0, 1, number), (give, 0, 0, refuse)]
    program.append((give, 0, 0, allow))
    return program


def _install_seccomp() -> bool:
    """Make the kernel refuse execve and cross-process access for this process."""
    if not sys.platform.startswith("linux"):
        return False
    import ctypes
    import platform

    table = _SECCOMP_TABLES.get(platform.machine())
    if table is None:
        return False

    class SockFilter(ctypes.Structure):
        _fields_ = [("code", ctypes.c_ushort), ("jt", ctypes.c_ubyte),
                    ("jf", ctypes.c_ubyte), ("k", ctypes.c_uint)]

    class SockFprog(ctypes.Structure):
        _fields_ = [("len", ctypes.c_ushort), ("filter", ctypes.POINTER(SockFilter))]

    program = _seccomp_program(*table, x86=platform.machine() == "x86_64")
    filters = (SockFilter * len(program))(*[SockFilter(*step) for step in program])
    fprog = SockFprog(len(program), filters)
    libc = ctypes.CDLL(None, use_errno=True)
    pr_set_no_new_privs, pr_set_seccomp, seccomp_mode_filter = 38, 22, 2
    if libc.prctl(pr_set_no_new_privs, 1, 0, 0, 0) != 0:
        return False
    return libc.prctl(pr_set_seccomp, seccomp_mode_filter, ctypes.byref(fprog), 0, 0) == 0


def lock_down_process() -> bool:
    """Remove unaudited process helpers and, on Linux, forbid starting programs.

    Returns True when the kernel-level filter is active.
    """
    for module_name, attribute in UNAUDITED_HELPERS:
        module = sys.modules.get(module_name)
        if module is not None and hasattr(module, attribute):
            delattr(module, attribute)
    try:
        return _install_seccomp()
    except (OSError, AttributeError, ValueError) as error:  # pragma: no cover - host dependent
        print(f"sandbox: seccomp filter unavailable: {error}", file=sys.stderr)
        return False


def make_process_undumpable() -> None:
    """Hide this process's memory and environment from same-user processes (Linux).

    With PR_SET_DUMPABLE off, /proc/<pid>/environ and /proc/<pid>/mem become
    readable by root only, so even a worker that slips past every other check
    cannot read the backend's secrets out of its parent.
    """
    if not sys.platform.startswith("linux"):
        return
    try:
        import ctypes

        pr_set_dumpable = 4
        ctypes.CDLL(None, use_errno=True).prctl(pr_set_dumpable, 0, 0, 0, 0)
    except (OSError, AttributeError) as error:  # pragma: no cover - depends on the host
        print(f"sandbox: could not make the process undumpable: {error}", file=sys.stderr)
