"""Line-by-line walkthroughs of each lesson's worked Qiskit example ("Code it" stage).

Each step is a chunk of the example (without its # comments), one short line on what
it does, an optional longer note folded behind "Tell me more", and an optional sketch:
the arrow on the globe after this line, or the odds of reading 0 and 1. Read in order,
the chunks cover every line of the code exactly once, so no line goes unexplained.
tests/test_code_walkthroughs.py enforces that and keeps the lines short.
"""

UP, DOWN = (0, 0, 1), (0, 0, -1)


def _step(code: str, does: str, more: str = "", sketch: dict | None = None) -> dict:
    """One walkthrough step: `code` is copied from the example, minus its comments."""
    return {"code": code, "does": does, "more": more, "sketch": sketch}


def _arrow(xyz: tuple, label: str, before: tuple | None = None) -> dict:
    """The state as an arrow on the globe; `before` draws where it was, dashed."""
    return {"kind": "arrow", "xyz": list(xyz), "before": list(before) if before else None, "label": label}


def _odds(odds: dict[str, float], label: str) -> dict:
    """The chance of reading each outcome, as bars."""
    return {"kind": "odds", "odds": odds, "label": label}


# Plain-Python basics, shown once, on the first lesson's Code it step.
PYTHON_BASICS = [
    ("from qiskit import QuantumCircuit", "Bring in a ready-made tool from Qiskit, so you can use it by name."),
    ("qc = QuantumCircuit(1)", "The = gives something a name (qc) so you can use it later."),
    ("qc.h(0)", "The dot asks qc to do something: add an H gate to qubit 0. Python counts from 0."),
    ("print(...)", "Show a result on screen."),
    ("# a note", "Everything after # is a note for people. Python skips it."),
    ("{'0': 0.5, '1': 0.5}", "A dictionary: each outcome with its chance. 0.5 means 50%."),
]

_NUMPY_NOTE = (
    "Python may print np.float64(0.5) instead of 0.5. That's just NumPy, a maths library "
    "Qiskit uses, labelling the number's type. Read it as 0.5."
)

WALKTHROUGHS: dict[str, list[dict]] = {
    "why-quantum": [
        _step(
            "from qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector",
            "Bring in two tools: one builds circuits, one works out exact results.",
            "A real quantum computer only ever shows you one answer per run. Statevector "
            "does the maths on your own computer instead, so you can see the exact odds.",
        ),
        _step(
            "once = QuantumCircuit(1)\nonce.h(0)",
            "A one-qubit circuit with one H: two paths, one to 0 and one to 1.",
            "Each path has amplitude about 0.707. Square it and you get 0.5: a fair coin.",
            _odds({"0": 0.5, "1": 0.5}, "after one H"),
        ),
        _step(
            "twice = QuantumCircuit(1)\ntwice.h(0)\ntwice.h(0)",
            "A second circuit with H twice. The two paths to 1 cancel out.",
            "The second H splits each path again. The two paths to 1 carry +½ and −½, so "
            "they cancel. The two paths to 0 carry +½ and +½, so they add up to 1.",
            _odds({"0": 1, "1": 0}, "after two Hs"),
        ),
        _step(
            "print(twice.draw())",
            "Draw the circuit: one wire with two H boxes, read left to right.",
        ),
        _step(
            "print('one H:  ', Statevector(once).probabilities_dict(decimals=3))\n"
            "print('two Hs: ', Statevector(twice).probabilities_dict(decimals=3))",
            "Print the exact odds: 50/50 after one H, always 0 after two.",
            "probabilities_dict leaves out outcomes with zero chance, so '1' is missing from "
            "the second line. " + _NUMPY_NOTE,
        ),
    ],
    "qubit": [
        _step(
            "from qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector",
            "The same two tools: one builds circuits, one shows the exact state.",
        ),
        _step(
            "qc = QuantumCircuit(1)",
            "One qubit. Every qubit starts at |0⟩, the north pole.",
            sketch=_arrow(UP, "starts at |0⟩"),
        ),
        _step(
            "state = Statevector(qc)",
            "Read the arrow exactly, as two amplitudes: α for |0⟩, β for |1⟩.",
            "Only a simulator can do this. Real hardware never shows the arrow, only 0s and 1s.",
        ),
        _step(
            "print(qc.draw())",
            "Draw the circuit: an empty wire, since no gate moves the arrow yet.",
        ),
        _step(
            "print(state)",
            "Prints α = 1 and β = 0: the whole state sits on |0⟩.",
            "You'll see Statevector([1.+0.j, 0.+0.j], dims=(2,)). Read 1.+0.j as plain 1; the "
            "+0.j part matters once you meet phase. dims=(2,) means one qubit, two outcomes.",
        ),
        _step(
            "print(state.probabilities_dict(decimals=3))",
            "Square each amplitude to get the odds: 0, every time.",
            _NUMPY_NOTE,
            _odds({"0": 1, "1": 0}, "odds of each reading"),
        ),
    ],
    "flip": [
        _step(
            "from qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector",
            "The same two tools: one builds circuits, one works out the arrow.",
        ),
        _step(
            "qc = QuantumCircuit(1)",
            "One qubit, arrow pointing up at |0⟩.",
            sketch=_arrow(UP, "starts at |0⟩"),
        ),
        _step(
            "qc.x(0)",
            "X on qubit 0: a half turn that flips the arrow down to |1⟩.",
            "Like flipping a pancake: the arrow turns over without stretching, and nothing is random.",
            _arrow(DOWN, "after X", before=UP),
        ),
        _step(
            "print(qc.draw())",
            "Draw the circuit: one wire with an X box.",
        ),
        _step(
            "print(Statevector(qc).probabilities_dict(decimals=3))",
            "The odds: 1 every time, 0 never. X is the quantum NOT.",
            _NUMPY_NOTE,
            _odds({"0": 0, "1": 1}, "odds of each reading"),
        ),
    ],
}
