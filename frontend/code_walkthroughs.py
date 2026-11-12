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

def _numpy_note(outcome: str, chance: str) -> str:
    """Explain NumPy's printed types, using the step's own first result."""
    return (
        f"Python may print np.str_('{outcome}') and np.float64({chance}) instead of "
        f"'{outcome}' and {chance}. That's just NumPy, a maths library Qiskit uses, "
        f"labelling each value's type. Read them as '{outcome}' and {chance}."
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
            "the second line. " + _numpy_note("0", "0.5"),
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
            _numpy_note("0", "1.0"),
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
            _numpy_note("1", "1.0"),
            _odds({"0": 0, "1": 1}, "odds of each reading"),
        ),
    ],
    "measurement": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.primitives import StatevectorSampler"
            ),
            "Two tools: one builds circuits, one runs them shot by shot.",
            "StatevectorSampler is new here. It plays the role of real hardware: instead of handing you the arrow, it hands you counts, like a poll.",
        ),
        _step(
            "qc = QuantumCircuit(1)",
            "One qubit, arrow pointing up at |0⟩.",
            "",
            _arrow((0.0, 0.0, 1.0), "starts at |0⟩"),
        ),
        _step(
            "qc.h(0)",
            "H tips the arrow down to the equator: |+⟩, a fifty fifty qubit.",
            "H gets its own lesson next. For now it just sets up a qubit whose true odds we know: half 0, half 1.",
            _arrow((1.0, 0.0, 0.0), "after H", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "qc.measure_all()",
            "Add a measurement: each shot, the qubit answers 0 or 1, one vote.",
            "Measuring creates the answer and leaves the qubit sitting on it. The answer lands in a place named meas, which we read later.",
            _odds({"0": 0.5, "1": 0.5}, "true odds of each vote"),
        ),
        _step(
            "print(qc.draw())",
            "Draw the circuit: an H box, then a meter writing to meas.",
            "The shaded ░ column is a barrier that measure_all adds before the meters. The double line at the bottom is meas, where the 0 or 1 gets stored; '1/' means it holds 1 bit.",
        ),
        _step(
            (
                "sampler = StatevectorSampler()\n"
                "result = sampler.run([qc], shots=1000).result()"
            ),
            "Run the poll: prepare a fresh qubit and measure it, 1000 times.",
            "The circuit goes inside square brackets, [qc], because a Sampler takes a list and can run several circuits at once. .result() waits for the run to finish.",
        ),
        _step(
            (
                "counts = result[0].data.meas.get_counts()\n"
                "print(counts)"
            ),
            "Count the votes: about 500 zeros and 500 ones, like {'1': 513, '0': 487}.",
            "result[0] is the first (and only) circuit, and meas is where its readings went. Your numbers will differ each run: that gap from 500 is shot noise, not a bug.",
        ),
    ],
    "superposition": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "The same two tools: one builds circuits, one works out the arrow.",
        ),
        _step(
            (
                "plus = QuantumCircuit(1)\n"
                "plus.h(0)"
            ),
            "One qubit, then H tips the arrow from the north pole onto the equator.",
            "The arrow now faces you at |+⟩. It is a definite direction, like a compass needle pointing east. Only the question \"0 or 1?\" has no favourite answer.",
            _arrow((1.0, 0.0, 0.0), "after H", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            (
                "back = QuantumCircuit(1)\n"
                "back.h(0)"
            ),
            "A second circuit: same start at |0⟩, same first H, arrow at |+⟩.",
            "",
            _arrow((1.0, 0.0, 0.0), "after first H", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "back.h(0)",
            "H again: the same turn tips the arrow straight back up to |0⟩.",
            "H is a turn, not a coin toss. Doing the same turn twice brings the arrow home, so nothing random is left.",
            _arrow((0.0, 0.0, 1.0), "after second H", before=(1.0, 0.0, 0.0)),
        ),
        _step(
            "print(back.draw())",
            "Draw the second circuit: one wire with two H boxes in a row.",
        ),
        _step(
            "print('H|0>  =', Statevector(plus))",
            "One H: two equal weights, 0.707 each, so 0 and 1 are 50/50.",
            "Each number is a weight, 1/√2 ≈ 0.707. Squared, it gives the chance: one half. The \"+0.j\" is an imaginary part of zero, and dims=(2,) just says one qubit with two possible answers.",
            _odds({"0": 0.5, "1": 0.5}, "odds after one H"),
        ),
        _step(
            "print('HH|0> =', Statevector(back))",
            "Two H's: weights 1 and 0, so it reads 0 every time.",
            "Nothing random happened to the arrow. It just pointed along the equator, and the second H turned it back to the pole.",
            _odds({"0": 1.0, "1": 0.0}, "odds after two H's"),
        ),
    ],
    "rotations": [
        _step(
            (
                "import numpy as np\n"
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "Our two usual tools, plus numpy for the number pi.",
            "Angles here are in radians: a half turn is pi (about 3.142), a quarter turn is pi / 2. `import numpy as np` just lets us write the short name np.",
        ),
        _step(
            (
                "for theta in [0, np.pi / 3, np.pi / 2, np.pi]:\n"
                "    qc = QuantumCircuit(1)"
            ),
            "Try four dial settings. Each one starts a fresh qubit, arrow up at |0⟩.",
            "This is a loop, new in this lesson. The indented lines run once for each value in the list, with theta set to that value: 0, then pi/3, then pi/2, then pi.",
            _arrow((0.0, 0.0, 1.0), "each round starts at |0⟩"),
        ),
        _step(
            "    qc.ry(theta, 0)",
            "Turn the dial: RY tips the arrow by angle theta, angle first, then qubit.",
            "The sketch shows theta = pi/3, a sixth of a full turn: the arrow leans a third of the way from the north pole to the south pole. At pi/2 it sits on the equator, at pi it points straight down at |1⟩.",
            _arrow((0.866, 0.0, 0.5), "after RY(π/3)", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "    p1 = Statevector(qc).probabilities()[1]",
            "Read off the chance of getting 1 for this setting.",
            "probabilities() gives a list of odds in outcome order, 0 first. The [1] picks the second entry, the chance of 1. For theta = pi/3 that is 0.25: one reading in four.",
            _odds({"0": 0.75, "1": 0.25}, "odds at θ = π/3"),
        ),
        _step(
            "    print(f'theta = {theta:.3f}  ->  P(1) = {p1:.3f}')",
            "Print one line per setting: P(1) climbs 0, 0.25, 0.5, 1 as the dial turns.",
            "The f before the quotes makes an f-string: anything in {curly braces} is replaced by its value. The :.3f part means show 3 decimal places, so pi/3 prints as 1.047.",
        ),
        _step(
            "print(qc.draw())",
            "Draw the last circuit from the loop: one wire with an Ry(π) box.",
            "After the loop ends, qc still holds the circuit from the final round, theta = pi. That is a half turn that lands on |1⟩ just like X, though around a different axis.",
        ),
    ],
    "phase": [
        _step(
            (
                "import numpy as np\n"
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "The two usual tools, plus numpy to tidy up long numbers.",
            "numpy is Python's number toolbox. We only use np.round from it, to cut the amplitudes to 3 decimals.",
        ),
        _step(
            (
                "qc = QuantumCircuit(1)\n"
                "qc.h(0)"
            ),
            "One qubit, then H lays the arrow on the equator, pointing at |+⟩.",
            "This is where the video started: on the equator, fifty fifty.",
            _arrow((1.0, 0.0, 0.0), "after H", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "qc.s(0)",
            "S turns the arrow a quarter way round the equator. Longitude changes, latitude doesn't.",
            "Z would be a half turn, S a quarter, T an eighth. The arrow now faces |+i⟩, still on the equator, so the odds can't have moved.",
            _arrow((0.0, 1.0, 0.0), "after S", before=(1.0, 0.0, 0.0)),
        ),
        _step(
            "print(qc.draw())",
            "Draw the circuit: one wire, an H box then an S box.",
        ),
        _step(
            (
                "state = Statevector(qc)\n"
                "print('amplitudes   :', np.round(state.data, 3))"
            ),
            "Peek at the raw amplitudes: the j on |1⟩ is the phase S added.",
            "Python writes i as j. So [0.707+0.j    0.   +0.707j] means 0.707 for |0⟩ and 0.707i for |1⟩ (the spaces are just padding). Without S the second one would be plain 0.707: only the phase differs.",
        ),
        _step(
            "print('probabilities:', state.probabilities_dict(decimals=3))",
            "The odds: still fifty fifty. Measurement can't see the turn S made.",
            "Python prints np.str_('0'): np.float64(0.5), which just means '0': 0.5. To reveal the phase, a later gate like H must turn longitude into latitude.",
            _odds({"0": 0.5, "1": 0.5}, "odds after S"),
        ),
    ],
    "interference": [
        _step(
            (
                "import numpy as np\n"
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "The usual two Qiskit tools, plus numpy for pi and evenly spaced numbers.",
            "numpy is a maths library. We nickname it np, so np.pi is the number pi (about 3.14).",
        ),
        _step(
            "for phi in np.linspace(0, 2 * np.pi, 5):",
            "Try 5 phase shifts, from none up to a full wave (2π).",
            "np.linspace(0, 2 * np.pi, 5) makes 5 evenly spaced numbers: 0, 1.57, 3.14, 4.71, 6.28. A for loop runs the indented lines below once per number, with phi set to that number each time.",
        ),
        _step(
            (
                "    qc = QuantumCircuit(1)\n"
                "    qc.h(0)"
            ),
            "A fresh qubit each round. H splits it into two paths, |0⟩ and |1⟩.",
            "On the globe, the arrow tips from the north pole down to |+⟩ on the equator.",
            _arrow((1.0, 0.0, 0.0), "after H", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "    qc.p(phi, 0)",
            "Shift the |1⟩ path by phi: the globe's arrow slides along the equator.",
            "Shown here for phi = π (3.14), half a wave: the same flip as a Z gate, so the arrow lands on |−⟩. At phi = 0 or 2π it stays at |+⟩. The odds of 0 and 1 do not change yet.",
            _arrow((-1.0, 0.0, 0.0), "phi = π: at |−⟩", before=(1.0, 0.0, 0.0)),
        ),
        _step(
            "    qc.h(0)",
            "Recombine the paths: in step they add on |0⟩, out of step they cancel there.",
            "Still the phi = π round: H sends |−⟩ to |1⟩, so P(0) is 0. With phi = 0 the paths come back in step and the arrow returns to |0⟩.",
            _arrow((0.0, 0.0, -1.0), "phi = π: reads 1", before=(-1.0, 0.0, 0.0)),
        ),
        _step(
            (
                "    p0 = Statevector(qc).probabilities()[0]\n"
                "    print(f'phi = {phi:.2f}  ->  P(0) = {p0:.3f}')"
            ),
            "Print the chance of 0 for each shift: 1, 0.5, 0, 0.5, 1.",
            "probabilities() gives a list [P(0), P(1)], and [0] picks the first. The f'...' string fills in the values in curly braces; :.2f and :.3f round to 2 and 3 decimals. In step gives 1, half a wave gives 0, a quarter wave gives 0.5.",
        ),
        _step(
            "print(qc.draw())",
            "Draw the last circuit: H, a phase box P(2π), H.",
            "After the loop, qc is the last one built, with phi = 2π. A full wave is like no shift at all, so it reads 0 every time.",
            _odds({"0": 1.0, "1": 0.0}, "last circuit, phi = 2π"),
        ),
    ],
    "bases": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.primitives import StatevectorSampler"
            ),
            "Two tools: one builds circuits, one runs them many times and counts readings.",
        ),
        _step(
            (
                "def measure_along(axis):\n"
                "    qc = QuantumCircuit(1)\n"
                "    qc.h(0)"
            ),
            "A reusable recipe. H first tips the arrow from north to front, |+⟩.",
            "def makes a function: a named recipe you can reuse. measure_along('X') runs the indented lines with axis set to 'X' and hands back a circuit. Every call starts from the same |+⟩.",
            _arrow((1.0, 0.0, 0.0), "after H: |+⟩", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            (
                "    if axis == 'X':\n"
                "        qc.h(0)"
            ),
            "Asking along X: H swaps front with north, so |+⟩ lands on |0⟩.",
            "if runs the indented line only when its test is true. == asks 'are these equal?', unlike = which stores a value. For 'Z' nothing is added: hardware already asks up or down.",
            _arrow((0.0, 0.0, 1.0), "X question: |0⟩", before=(1.0, 0.0, 0.0)),
        ),
        _step(
            (
                "    elif axis == 'Y':\n"
                "        qc.sdg(0)\n"
                "        qc.h(0)"
            ),
            "Asking along Y: Sdg turns Y onto X, then H turns X onto Z.",
            "elif means 'else, if this instead'. The arrow was at front, halfway between right and left, so after the turns it sits on the equator: still 50/50.",
            _arrow((0.0, 1.0, 0.0), "Y question: on equator", before=(1.0, 0.0, 0.0)),
        ),
        _step(
            (
                "    qc.measure_all()\n"
                "    return qc"
            ),
            "Measure up or down as usual, then hand the finished circuit back.",
            "return is how a function gives its result back to whoever called it.",
        ),
        _step(
            (
                "sampler = StatevectorSampler()\n"
                "for axis in ['Z', 'X', 'Y']:\n"
                "    counts = sampler.run([measure_along(axis)], shots=1000).result()[0].data.meas.get_counts()\n"
                "    print(axis, counts)"
            ),
            "Ask the same |+⟩ three questions, 1000 shots each. Only X is certain.",
            "for repeats the indented lines once per item in the list, with axis set to 'Z', then 'X', then 'Y'. Expect roughly Z {'0': 507, '1': 493}, X {'0': 1000}, Y {'1': 503, '0': 497}: the near-even splits change a little each run.",
        ),
        _step(
            "print(measure_along('Y').draw())",
            "Draw the Y circuit: H to prepare |+⟩, then Sdg and H, then measure.",
            "The first H only prepares |+⟩. The Sdg and H after it are the turn that points the Y axis up and down.",
        ),
    ],
    "registers": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "The same two tools: one builds circuits, one works out the state.",
        ),
        _step(
            "qc = QuantumCircuit(3)",
            "Three qubits, all at |0⟩. Like a lock with three wheels: eight readings.",
            "Each wheel doubles the count: 2 × 2 × 2 = 8, from 000 to 111. The state keeps one amplitude for each of those eight readings. Right now all the odds sit on 000.",
            _odds({"000": 1.0, "001": 0.0, "010": 0.0, "011": 0.0, "100": 0.0, "101": 0.0, "110": 0.0, "111": 0.0}, "odds at the start"),
        ),
        _step(
            "qc.x(0)",
            "X on qubit 0 only: its arrow flips down to |1⟩. The others stay up.",
            "The number in qc.x(0) is the index of the qubit the gate acts on. Qiskit counts qubits from 0, so this circuit has qubits 0, 1 and 2.",
            _arrow((0.0, 0.0, -1.0), "qubit 0 after X", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "print(qc.draw())",
            "Draw it: three wires, with the X box on q_0, the top wire.",
            "In the drawing q_0 sits on top. In printed results it sits on the right. Same qubit, two different places, so it is worth checking which one you are looking at.",
        ),
        _step(
            "print(Statevector(qc).probabilities_dict(decimals=3))",
            "The reading is 001 every time: qubit 0 is the rightmost bit.",
            "Read the string right to left: q0 = 1, q1 = 0, q2 = 0, like the ones digit sitting on the right in 42. Python may print it as {np.str_('001'): np.float64(1.0)}, which just means {'001': 1.0}.",
            _odds({"000": 0.0, "001": 1.0, "010": 0.0, "011": 0.0, "100": 0.0, "101": 0.0, "110": 0.0, "111": 0.0}, "odds after flipping q0"),
        ),
    ],
    "entanglement": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector, partial_trace"
            ),
            "Circuit builder, arrow calculator, and partial_trace to look at one qubit alone.",
        ),
        _step(
            "qc = QuantumCircuit(2)",
            "Two qubits, both arrows pointing up: the pair starts as |00⟩.",
            "",
            _odds({"00": 1.0, "01": 0.0, "10": 0.0, "11": 0.0}, "pair starts at 00"),
        ),
        _step(
            "qc.h(0)",
            "H on qubit 0: its arrow tips to the equator, a fair coin.",
            "Qubit 1 is untouched and still points at |0⟩. So far each qubit has its own arrow.",
            _arrow((1.0, 0.0, 0.0), "qubit 0 after H", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "qc.cx(0, 1)",
            "CNOT: if qubit 0 is 1, flip qubit 1. Both branches happen at once.",
            "In qc.cx(control, target) the first number is the control, the second the target. The part where qubit 0 is 0 stays put; the part where qubit 0 is 1 gets qubit 1 flipped too. The pair is now (|00⟩ + |11⟩)/√2, a Bell state.",
            _odds({"00": 0.5, "01": 0.0, "10": 0.0, "11": 0.5}, "the pair after CNOT"),
        ),
        _step(
            "print(qc.draw())",
            "Draw it: H on q_0, then a dot on q_0 wired to X on q_1.",
            "The dot marks the control qubit. The X box on the other wire is the target that gets flipped when the control is 1.",
        ),
        _step(
            (
                "state = Statevector(qc)\n"
                "print(state.probabilities_dict(decimals=3))"
            ),
            "Exact odds: 00 half the time, 11 half the time. Never a mismatch.",
            "Python prints np.str_('00') for the string '00' and np.float64(0.5) for 0.5. 01 and 10 are missing because their odds are 0: the two answers always agree.",
            _odds({"00": 0.5, "01": 0.0, "10": 0.0, "11": 0.5}, "odds of each reading"),
        ),
        _step(
            "print('q0 alone:', partial_trace(state, [1]).purity().real)",
            "Qubit 0 on its own: purity 0.5, so it has no arrow of its own.",
            "partial_trace(state, [1]) ignores qubit 1 and describes qubit 0 by itself. Purity 1 means a full arrow on the globe; 0.5 means the arrow has shrunk to nothing at the centre. 0.4999999999999998 is just 0.5 with a tiny rounding error, and .real drops an imaginary part that is zero.",
            _odds({"0": 0.5, "1": 0.5}, "qubit 0 alone"),
        ),
    ],
    "no-cloning": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector, state_fidelity"
            ),
            "The usual tools, plus state_fidelity: a score for how alike two states are.",
            "state_fidelity gives a number from 0 to 1. 1 means the two states are identical, 0 means completely different.",
        ),
        _step(
            (
                "copier = QuantumCircuit(2)\n"
                "copier.h(0)"
            ),
            "Two qubits. H tips q0's arrow onto the equator: our grey page, |+⟩.",
            "q1 stays at |0⟩: it is the blank sheet the copier will write on.",
            _arrow((1.0, 0.0, 0.0), "q0 after H", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "copier.cx(0, 1)",
            "CNOT tries to copy q0 into blank q1. It entangles them instead.",
            "For a plain 0 or 1, this CNOT is a perfect copier. For |+⟩ it makes the Bell state from Lesson 11, so neither qubit has an arrow of its own any more.",
            _odds({"00": 0.5, "11": 0.5}, "odds after CNOT"),
        ),
        _step(
            "print(copier.draw())",
            "Draw the copier: H on q0, then a CNOT from q0 to q1.",
        ),
        _step(
            (
                "true_copy = QuantumCircuit(2)\n"
                "true_copy.h([0, 1])"
            ),
            "What two real copies would be: H on both, two independent |+⟩ arrows.",
            "Passing a list [0, 1] applies H to both qubits in one line.",
            _odds({"00": 0.25, "01": 0.25, "10": 0.25, "11": 0.25}, "two real copies"),
        ),
        _step(
            (
                "print('copier:  ', Statevector(copier).probabilities_dict(decimals=3))\n"
                "print('2 copies:', Statevector(true_copy).probabilities_dict(decimals=3))"
            ),
            "Compare odds: the copier gives only 00 or 11, real copies give all four.",
            "Python prints np.str_('00') for '00' and np.float64(0.5) for 0.5. The copier's answers are locked together, which two separate copies never are.",
        ),
        _step(
            "print('fidelity:', round(state_fidelity(Statevector(copier), Statevector(true_copy)), 3))",
            "Score how alike they are: 0.5, not 1. The copy failed.",
            "round(x, 3) keeps 3 decimals. A perfect copier would score 1, and the no-cloning theorem says no circuit can do that for an unknown state.",
        ),
    ],
    "teleportation": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector, partial_trace, state_fidelity"
            ),
            "Tools: build circuits, work out states, compare Bob's qubit with Alice's.",
        ),
        _step(
            (
                "qc = QuantumCircuit(3)\n"
                "qc.ry(1.1, 0)\n"
                "qc.rz(0.7, 0)"
            ),
            "Three qubits; two turns tilt q0's arrow into Alice's mystery state.",
            "Ry(1.1) tips the arrow down from the north pole, then Rz(0.7) swings it around the globe. Any angles would do: the protocol works without anyone knowing them.",
            _arrow((0.6816, 0.5741, 0.4536), "Alice's mystery state", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            (
                "qc.h(1)\n"
                "qc.cx(1, 2)"
            ),
            "The Bell pair from lesson 11: q1 stays with Alice, q2 goes to Bob.",
            "On its own, Bob's half is now a fifty fifty coin flip. It has no arrow of its own yet.",
        ),
        _step(
            (
                "qc.cx(0, 1)\n"
                "qc.h(0)"
            ),
            "Alice links her mystery qubit to her half: CNOT, then H.",
            "Here she would measure q0 and q1. Each of her four readings comes up one time in four, whatever her state was, so the bits alone say nothing about it. In the odds, q0 is the rightmost bit.",
            _odds({"00": 0.25, "01": 0.25, "10": 0.25, "11": 0.25}, "Alice's two readings"),
        ),
        _step(
            (
                "qc.cx(1, 2)\n"
                "qc.cz(0, 2)"
            ),
            "Bob's fixes: X if q1 is 1, Z if q0 is 1. Arrow restored.",
            "On hardware Alice measures and phones Bob her two bits. In a simulator, 'if the bit is 1, apply a gate' becomes a controlled gate, so cx and cz stand in for the phone call.",
            _arrow((0.6816, 0.5741, 0.4536), "Bob's qubit after fix"),
        ),
        _step(
            "print(qc.draw())",
            "Draw it: mystery state, Bell pair, Alice's two gates, Bob's two fixes.",
        ),
        _step(
            (
                "original = QuantumCircuit(1)\n"
                "original.ry(1.1, 0)\n"
                "original.rz(0.7, 0)\n"
                "bob = partial_trace(Statevector(qc), [0, 1])\n"
                "print('fidelity with Alice\\'s original:', round(state_fidelity(bob, Statevector(original)), 6))"
            ),
            "Rebuild Alice's state alone, keep only Bob's qubit, and compare: 1.0 means identical.",
            "partial_trace(..., [0, 1]) sets qubits 0 and 1 aside, leaving Bob's q2 on its own. state_fidelity scores how alike two states are, from 0 to 1. The \\' inside the quotes just puts an apostrophe in the text.",
        ),
    ],
    "superdense": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "The same two tools: one builds circuits, one works out the odds.",
        ),
        _step(
            (
                "def superdense(message):\n"
                "    qc = QuantumCircuit(2)\n"
                "    qc.h(0)\n"
                "    qc.cx(0, 1)"
            ),
            "A recipe for any message. First the shared Bell pair: Alice q0, Bob q1.",
            "def makes a function: a named recipe you can run again with a different message. Everything indented below it belongs to the recipe. Here H then CNOT give the pair whose readings are random but always match.",
            _odds({"00": 0.5, "11": 0.5}, "odds of the Bell pair"),
        ),
        _step(
            (
                "    if message[0] == '1':\n"
                "        qc.x(0)\n"
                "    if message[1] == '1':\n"
                "        qc.z(0)"
            ),
            "Alice sets her key: X, Z, both or nothing, all on her qubit q0.",
            "message[0] is the first character (the bit for q1) and decides X. message[1] is the second (the bit for q0) and decides Z. if runs the indented line only when the test is true. The odds shown are for message '11': still random on their own, the message hides in the pair.",
            _odds({"01": 0.5, "10": 0.5}, "pair after '11' twists"),
        ),
        _step(
            (
                "    qc.cx(0, 1)\n"
                "    qc.h(0)\n"
                "    return qc"
            ),
            "Bob holds both halves: CNOT then H, the pair's recipe run backwards.",
            "return hands the finished circuit back to whoever called the recipe. The odds shown are for message '11': it arrives for certain.",
            _odds({"11": 1.0}, "Bob reads '11'"),
        ),
        _step(
            (
                "for message in ['00', '01', '10', '11']:\n"
                "    print(message, '->', Statevector(superdense(message)).probabilities_dict(decimals=3))"
            ),
            "Send all four messages. Each one arrives with odds 1.0: two bits, certain.",
            "A for loop runs the indented line once per item in the list, with message set to '00', then '01', and so on. In the printout, np.str_('01') just means '01' and np.float64(1.0) means 1.0.",
        ),
        _step(
            "print(superdense('11').draw())",
            "Draw the '11' circuit: H, CNOT, Alice's X and Z, then Bob's CNOT, H.",
        ),
    ],
    "deutsch": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "The same two tools: one builds circuits, one works out the arrows.",
        ),
        _step(
            (
                "def deutsch(oracle):\n"
                "    qc = QuantumCircuit(2)\n"
                "    qc.x(1)\n"
                "    qc.h([0, 1])"
            ),
            "Setup for kickback: input q0 goes to |+⟩, helper q1 to |−⟩.",
            "def makes a function: a recipe that only runs when called. Its input, oracle, is itself a function that adds the box's gates, so the rest of the algorithm never changes.",
            _arrow((1.0, 0.0, 0.0), "q0 after H", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "    oracle(qc)",
            "One query: a balanced box turns q0 over to |−⟩, a constant one leaves |+⟩.",
            "The box flips the helper when f(x) is 1. Because the helper is |−⟩, that flip comes out as a minus sign on q0 instead: phase kickback. The helper stays |−⟩.",
            _arrow((-1.0, 0.0, 0.0), "q0, balanced box", before=(1.0, 0.0, 0.0)),
        ),
        _step(
            (
                "    qc.h(0)\n"
                "    return qc"
            ),
            "Final H: arrows add or cancel. |+⟩ lands on 0, |−⟩ lands on 1.",
            "return hands the finished circuit back to whoever called deutsch. For a constant box q0 ends at |0⟩ instead.",
            _arrow((0.0, 0.0, -1.0), "balanced: q0 at |1⟩", before=(-1.0, 0.0, 0.0)),
        ),
        _step(
            (
                "oracles = {\n"
                "    'constant 0': lambda qc: None,\n"
                "    'constant 1': lambda qc: qc.x(1),\n"
                "    'balanced x': lambda qc: qc.cx(0, 1),\n"
                "    'balanced NOT x': lambda qc: (qc.cx(0, 1), qc.x(1)),\n"
                "}"
            ),
            "Four sealed boxes to test: two constant, two balanced, each a tiny function.",
            "lambda qc: ... is a one-line function with no name. In the last box, brackets with a comma let one lambda add two gates.",
        ),
        _step(
            (
                "for name, oracle in oracles.items():\n"
                "    p1 = Statevector(deutsch(oracle)).probabilities([0])[1]\n"
                "    print(f'{name:15s} -> q0 reads {round(p1)}')"
            ),
            "Ask each box once and read q0: 0 means constant, 1 means balanced.",
            ".items() gives each name with its function. probabilities([0])[1] is the chance q0 alone reads 1; round tidies tiny leftovers (like 1e-33) to 0 or 1. {name:15s} pads the name to 15 characters so the -> signs line up.",
        ),
        _step(
            "print(deutsch(oracles['balanced x']).draw())",
            "Draw the balanced x circuit: X and H set up, the CNOT is the box.",
        ),
    ],
    "bernstein-vazirani": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "The same two tools: one builds circuits, one works out the state.",
        ),
        _step(
            (
                "def bernstein_vazirani(secret):\n"
                "    n = len(secret)\n"
                "    qc = QuantumCircuit(n + 1)\n"
                "    qc.x(n)"
            ),
            "A recipe for any secret: one qubit per switch, plus a buzzer qubit flipped to |1⟩.",
            "def makes a function: a named recipe you can reuse with any secret, like '101' or '0110'. The indented lines are its body. len(secret) counts the bits, and the extra qubit, number n, is the buzzer (the answer qubit).",
            _arrow((0.0, 0.0, -1.0), "buzzer qubit after X", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "    qc.h(range(n + 1))",
            "H on every qubit: each switch qubit goes to |+⟩, the buzzer to |−⟩.",
            "range(n + 1) means qubits 0, 1, ... up to n, so one line puts H on all of them. The buzzer was at |1⟩, and H turns |1⟩ into |−⟩.",
            _arrow((-1.0, 0.0, 0.0), "buzzer qubit: |−⟩", before=(0.0, 0.0, -1.0)),
        ),
        _step(
            (
                "    for i, bit in enumerate(reversed(secret)):\n"
                "        if bit == '1':\n"
                "            qc.cx(i, n)"
            ),
            "The one question: a CNOT per wired switch flips |+⟩ to |−⟩.",
            "Each CNOT kicks a minus sign back onto its switch qubit. A for loop repeats its indented lines once per bit; reversed() reads the secret right to left (qubit 0 is the rightmost bit), and enumerate() gives each bit's position i. For '101': CNOTs from qubits 0 and 2, qubit 1 stays |+⟩, the buzzer stays |−⟩.",
            _arrow((-1.0, 0.0, 0.0), "qubit 0 after kickback", before=(1.0, 0.0, 0.0)),
        ),
        _step(
            (
                "    qc.h(range(n))\n"
                "    return qc"
            ),
            "One more H on each switch qubit: |+⟩ back to 0, |−⟩ to 1.",
            "Before this H, measuring would give 50/50 on every qubit: the secret hides in the signs. The H makes paths add or cancel so only the secret is left. return hands the finished circuit back to whoever called the function.",
            _odds({"101": 1.0}, "switch qubits after H"),
        ),
        _step(
            "state = Statevector(bernstein_vazirani('101'))",
            "Build the circuit for secret 101 and work out its final state.",
        ),
        _step(
            "print(bernstein_vazirani('101').draw())",
            "Draw it: H on each switch wire, CNOTs from q_0 and q_2 to q_3.",
            "q_3 is the buzzer qubit: X then H at the start, no H at the end. The CNOTs from q_0 and q_2 are the 1s in 101; q_1 has none because its bit is 0. q_1's two H boxes sit side by side because nothing happens on that wire between them.",
        ),
        _step(
            "print(state.probabilities_dict([0, 1, 2], decimals=3))",
            "Odds for the switch qubits only: 101 every time, from a single question.",
            "[0, 1, 2] keeps just the switch qubits and ignores the buzzer. Python prints {np.str_('101'): np.float64(1.0)}, which just means '101' with probability 1.0.",
            _odds({"101": 1.0}, "odds of each reading"),
        ),
    ],
    "grover": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "The same two tools: one builds circuits, one works out the odds.",
        ),
        _step(
            (
                "qc = QuantumCircuit(2)\n"
                "qc.h([0, 1])"
            ),
            "Two qubits name four boxes. H on both: each box gets amplitude one half.",
            "qc.h([0, 1]) puts an H on qubit 0 and qubit 1 in one line: most gate methods accept a list of qubits. Amplitude one half, squared, is a one in four chance.",
            _odds({"00": 0.25, "01": 0.25, "10": 0.25, "11": 0.25}, "every box equal"),
        ),
        _step(
            "qc.cz(0, 1)",
            "The oracle: CZ quietly flips the sign of |11⟩, the prize box.",
            "Its amplitude goes from one half to minus one half. Squared, that is still a quarter, so the odds have not changed yet. The mark is a phase, like Lesson 7.",
            _odds({"00": 0.25, "01": 0.25, "10": 0.25, "11": 0.25}, "odds unchanged, sign flipped"),
        ),
        _step(
            (
                "qc.h([0, 1])\n"
                "qc.x([0, 1])\n"
                "qc.cz(0, 1)\n"
                "qc.x([0, 1])\n"
                "qc.h([0, 1])"
            ),
            "The diffuser reflects every amplitude around the average: the prize jumps, the rest cancel.",
            "The average is now one quarter: the three other boxes sit a quarter above it and land at zero, while the prize sits three quarters below and is flung to one (Qiskit shows minus one, an overall sign that never changes the odds). The X gates around CZ move the sign flip to |00⟩. With the H's around them, that becomes the reflection around the average.",
            _odds({"00": 0.0, "01": 0.0, "10": 0.0, "11": 1.0}, "odds after the diffuser"),
        ),
        _step(
            "print(qc.draw())",
            "Draw it: H on both wires, the oracle's dot pair, then the diffuser.",
            "A CZ shows as two dots joined by a line. It has no top or bottom: it flips the sign only when both qubits are 1.",
        ),
        _step(
            "print(Statevector(qc).probabilities_dict(decimals=3))",
            "The odds: 11 with chance 1. One look always finds the prize.",
            "Python prints {np.str_('11'): np.float64(1.0)}, which just means {'11': 1.0}. The other boxes have chance 0, so they are left out. With four boxes, one round of oracle plus diffuser is exactly enough.",
        ),
    ],
    "qft": [
        _step(
            (
                "import math\n"
                "from qiskit import QuantumCircuit\n"
                "from qiskit.circuit.library import QFTGate\n"
                "from qiskit.quantum_info import Operator, Statevector"
            ),
            "Our tools, plus math for π and Qiskit's own ready-made QFT to check against.",
            "Operator captures everything a circuit does, so two circuits can be compared as a whole.",
        ),
        _step(
            (
                "def qft2(qc):\n"
                "    qc.h(1)\n"
                "    qc.cp(math.pi / 2, 0, 1)\n"
                "    qc.h(0)\n"
                "    qc.swap(0, 1)"
            ),
            "A recipe for the 2-qubit QFT: H gates plus one quarter-turn clock hand.",
            "def makes a function: a named recipe you can reuse. The indented lines are its steps, and they only run when you call qft2(...). cp(angle, control, target) turns the target's arrow by that angle, but only in the branch where the control is 1.",
        ),
        _step(
            (
                "qc = QuantumCircuit(2)\n"
                "qc.h(1)"
            ),
            "Build the input: equal weight on readings 0 and 2, a rhythm repeating every 2.",
            "Qubit 1 is the left bit, so H on it splits 00 into 00 and 10, which are readings 0 and 2.",
            _odds({"00": 0.5, "01": 0.0, "10": 0.5, "11": 0.0}, "input: period 2"),
        ),
        _step(
            "qft2(qc)",
            "Run the QFT: clock hands add at outputs 0 and 2, cancel at 1 and 3.",
            "Calling the function runs its four lines on qc. With 4 readings and a rhythm of 2, the peaks land on multiples of 4 over 2: 0 and 2.",
            _odds({"00": 0.5, "01": 0.0, "10": 0.5, "11": 0.0}, "odds after QFT"),
        ),
        _step(
            "print(qc.draw())",
            "Draw it: our input H, then the QFT's H, phase turn, H and swap.",
            "The P(π/2) line joining both wires is the controlled quarter turn. The X marks at the end are the swap.",
        ),
        _step(
            "print(Statevector(qc).probabilities_dict(decimals=3))",
            "The odds: half on 00, half on 10. Peaks at frequencies 0 and 2.",
            "np.str_('00') just means '00', and np.float64(0.5) means 0.5. Readings 01 and 11 are missing because their chance is 0.",
        ),
        _step(
            (
                "mine = QuantumCircuit(2)\n"
                "qft2(mine)\n"
                "library = QuantumCircuit(2)\n"
                "library.append(QFTGate(2), [0, 1])"
            ),
            "Two clean circuits: one with our QFT recipe, one with Qiskit's QFTGate box.",
            "append places a whole gate on the listed qubits, here qubits 0 and 1. No input state this time, just the transform itself.",
        ),
        _step(
            "print('matches QFTGate:', Operator(mine).equiv(Operator(library)))",
            "Compare them: True means our recipe does exactly what Qiskit's QFT does.",
            "equiv checks every possible input at once, ignoring a global phase that no measurement can see.",
        ),
    ],
    "phase-estimation": [
        _step(
            (
                "import math\n"
                "from qiskit import QuantumCircuit\n"
                "from qiskit.circuit.library import QFTGate\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "Our tools, plus math for π and the QFT from lesson 18.",
        ),
        _step(
            "phi = 1 / 4",
            "The hidden fraction: S turns |1⟩ by a quarter turn.",
            "A quarter is 0.01 in binary. That is the pair of digits we hope to read at the end.",
        ),
        _step(
            (
                "qc = QuantumCircuit(3)\n"
                "qc.x(2)\n"
                "qc.h([0, 1])"
            ),
            "Two counting qubits go to |+⟩; q2 is flipped to |1⟩, the state S only turns.",
            "q2 must be a state U only turns (an eigenstate). Hand it any other state and you get a random one of U's phases.",
            _arrow((1.0, 0.0, 0.0), "q0 and q1 at |+⟩", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "qc.cp(2 * math.pi * phi, 0, 2)",
            "Controlled-U once: kickback turns q0's hand a quarter turn, to |+i⟩.",
            "The angle is 2π times phi, so a full turn times a quarter. q2 stays at |1⟩; the turn lands on the control, as in lesson 15.",
            _arrow((0.0, 1.0, 0.0), "q0 after 1 tick", before=(1.0, 0.0, 0.0)),
        ),
        _step(
            "qc.cp(2 * math.pi * phi * 2, 1, 2)",
            "Controlled-U twice: q1's hand turns two ticks, a half turn, to |−⟩.",
            "Doubling slides phi's binary digits one place left, and whole turns vanish. So q1 shows a finer digit than q0.",
            _arrow((-1.0, 0.0, 0.0), "q1 after 2 ticks", before=(1.0, 0.0, 0.0)),
        ),
        _step(
            "qc.append(QFTGate(2).inverse(), [0, 1])",
            "Inverse QFT on q0, q1: turns the two hands into binary digits.",
            "Measuring a qubit gives 0 or 1, never its hand. The inverse QFT combines the hands so a plain reading spells out phi.",
        ),
        _step(
            "print(qc.draw())",
            "Draw it: H boxes, two controlled turns P(π/2) and P(π), then qft_dg.",
            "P(π/2) is the quarter turn of U, P(π) the half turn of U². qft_dg is the inverse QFT (dg means dagger, the undo).",
        ),
        _step(
            "print(Statevector(qc).probabilities_dict([0, 1], decimals=3))",
            "Odds for the counting qubits only: 01 every time, phi = 0.01 in binary.",
            "The list [0, 1] asks for just q0 and q1. Python prints np.str_('01') and np.float64(1.0): read them as '01' and 1.0. The digits 01 after the point are a quarter.",
            _odds({"00": 0.0, "01": 1.0, "10": 0.0, "11": 0.0}, "counting qubits read 01"),
        ),
    ],
    "hardware": [
        _step(
            (
                "from qiskit import QuantumCircuit\n"
                "from qiskit import transpile"
            ),
            "Two tools: one builds circuits, transpile rewrites them for a real chip.",
        ),
        _step(
            (
                "bell = QuantumCircuit(2)\n"
                "bell.h(0)"
            ),
            "Two qubits at |0⟩. H tips qubit 0's arrow down to the equator, |+⟩.",
            "Qubit 1 has not moved yet, so its arrow still points up at |0⟩.",
            _arrow((1.0, 0.0, 0.0), "qubit 0 after H", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            "bell.cx(0, 1)",
            "CNOT links the two qubits: a Bell pair that reads 00 or 11.",
            "The qubits are now linked, so one arrow per qubit no longer tells the story. The odds of each reading do. These are ideal odds, with no noise.",
            _odds({"00": 0.5, "11": 0.5}, "ideal Bell odds"),
        ),
        _step(
            "native = transpile(bell, basis_gates=['rz', 'sx', 'cx'], optimization_level=1)",
            "Rewrite the circuit for a pretend chip whose only native gates are rz, sx and cx.",
            "basis_gates is a list of the gates the chip allows, and optimization_level=1 asks for light tidying. The rewrite changes the steps, not the answer: on an ideal simulator the odds stay 50/50 for 00 and 11.",
            _odds({"00": 0.5, "11": 0.5}, "same odds after rewrite"),
        ),
        _step(
            "print(native.draw())",
            "Draw it: the single H became three gates, Rz(π/2), √X, Rz(π/2).",
            "The line 'global phase: π/4' is a turn of the whole state that no reading can ever see. You can safely ignore it.",
        ),
        _step(
            (
                "print('ops before:', dict(bell.count_ops()), 'depth', bell.depth())\n"
                "print('ops after :', dict(native.count_ops()), 'depth', native.depth())"
            ),
            "Count gates and time steps: 2 gates became 4, depth 2 became 4.",
            "Each extra gate is one more whisper down the line: a small chance of error that shrinks the arrow toward random. Depth counts time steps, gates that must run one after another, so a waiting qubit has more time to leak.",
        ),
    ],
    "real-chip": [
        _step(
            (
                "from qiskit import QuantumCircuit, transpile\n"
                "from qiskit.providers.fake_provider import GenericBackendV2\n"
                "from qiskit_aer import AerSimulator"
            ),
            "Three tools: build circuits, fit them to a chip, and copy a chip's noise.",
        ),
        _step(
            "backend = GenericBackendV2(num_qubits=5, coupling_map=[[0, 1], [1, 2], [2, 3], [3, 4]], seed=42)",
            "A fake 5-qubit chip: guests at a long table, wired 0-1-2-3-4.",
            "coupling_map is a list of pairs, one per wire, and only those pairs can run a CNOT directly. seed=42 fixes the made-up error rates, so you get the same chip every time.",
        ),
        _step(
            (
                "qc = QuantumCircuit(3)\n"
                "qc.h(0)"
            ),
            "Three qubits at |0⟩, then H tips qubit 0's arrow to the equator.",
            "",
            _arrow((1.0, 0.0, 0.0), "qubit 0 after H", before=(0.0, 0.0, 1.0)),
        ),
        _step(
            (
                "qc.cx(0, 1)\n"
                "qc.cx(1, 2)"
            ),
            "CNOT 0 to 1, then 1 to 2: neighbours only. All three now agree.",
            "Each CNOT joins qubits that sit side by side on the chip's line, so nobody has to swap seats.",
            _odds({"000": 0.5, "111": 0.5}, "ideal odds: 000 or 111"),
        ),
        _step(
            (
                "qc.measure_all()\n"
                "print(qc.draw())"
            ),
            "Measure all three and draw the circuit as you wrote it.",
            "measure_all also adds a barrier (the dotted ░ line) and a row of classical bits called meas.",
        ),
        _step(
            (
                "native = transpile(qc, backend=backend, optimization_level=1, seed_transpiler=7)\n"
                "print('ops:', dict(native.count_ops()), ' depth:', native.depth())"
            ),
            "Fit it to the chip: no SWAPs needed, just H rewritten in native gates.",
            "Qubits 0, 1, 2 already sit side by side, so cx stays at 2 and no SWAPs appear. The chip has no H gate, so H becomes rz, sx, rz, three turns that add up to H. depth: 6 means six layers of gates one after another.",
        ),
        _step(
            (
                "noisy = AerSimulator.from_backend(backend)\n"
                "counts = noisy.run(native, shots=2000, seed_simulator=1).result().get_counts()\n"
                "print(counts)"
            ),
            "Run 2000 times with the chip's noise: mostly 000 and 111, 25 strays.",
            "Ideally only 000 and 111 appear, about 1000 each. Here you get 962 and 1013, plus 25 readings like 010 that noise produced. The chain .result().get_counts() waits for the run to finish, then tallies the readings.",
        ),
    ],
    "qml": [
        _step(
            (
                "import numpy as np\n"
                "from qiskit import QuantumCircuit\n"
                "from qiskit.circuit import Parameter\n"
                "from qiskit.quantum_info import Statevector"
            ),
            "Our usual tools, plus Parameter: a blank to fill with an angle later.",
            "numpy (shortened to np) gives us pi as np.pi.",
        ),
        _step(
            (
                "theta = Parameter('theta')\n"
                "model = QuantumCircuit(1)\n"
                "model.ry(theta, 0)"
            ),
            "One qubit with an RY knob whose angle, theta, is left free to turn.",
            "theta is not a number yet, just a named placeholder. That is what makes the circuit trainable: the same circuit can be run with any angle.",
        ),
        _step(
            "print(model.draw())",
            "Draw it: one wire with an Ry box, the angle still written as theta.",
        ),
        _step(
            (
                "def p1(t):\n"
                "    return Statevector(model.assign_parameters({theta: t})).probabilities()[1]"
            ),
            "A helper that sets the knob to t and returns the chance of reading 1.",
            "def makes a function: a reusable recipe that takes t and hands back a result with return. assign_parameters makes a copy with theta set to t, and probabilities()[1] picks the odds of 1 from the list [P(0), P(1)].",
        ),
        _step(
            (
                "target = 0.8\n"
                "value = 0.1"
            ),
            "Goal: read 1 eight times in ten. Start the knob at 0.1, near |0⟩.",
            "At theta = 0.1 the arrow barely leaves the north pole, so P(1) is only about 0.0025. Far out of tune. The video aimed for a quarter; this code picks a different goal and start, but the loop works the same way.",
            _arrow((0.0998, 0.0, 0.995), "start, theta = 0.1"),
        ),
        _step(
            (
                "for step in range(40):\n"
                "    dp = (p1(value + np.pi / 2) - p1(value - np.pi / 2)) / 2\n"
                "    grad = 2 * (p1(value) - target) * dp\n"
                "    value -= 1.0 * grad"
            ),
            "Forty rounds: find the slope of the cost, then nudge the knob downhill.",
            "for step in range(40) repeats the indented lines 40 times. The slope of P(1) comes from rerunning with theta shifted pi/2 each way (the parameter-shift rule), and value -= 1.0 * grad means new theta = old theta minus a step times the slope. Here Statevector gives the exact odds; a real chip would estimate them from many shots.",
            _arrow((0.8, 0.0, -0.6), "after training", before=(0.0998, 0.0, 0.995)),
        ),
        _step(
            "print(f'trained theta = {value:.3f}, P(1) = {p1(value):.3f}')",
            "The tuned knob: theta about 2.214, and 1 now comes up 80% of the time.",
            "An f-string fills each {...} with a value; :.3f rounds it to 3 decimals. The cost is now about zero: we reached the bottom of the valley.",
            _odds({"0": 0.2, "1": 0.8}, "odds after training"),
        ),
    ],
}
