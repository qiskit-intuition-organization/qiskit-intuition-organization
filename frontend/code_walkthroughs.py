"""Line-by-line walkthroughs of each lesson's worked Qiskit example ("Code it" stage).

Each step pairs a chunk of the example code with what it does and what it means in
the lesson's picture (the arrow on the sphere, the paths that add or cancel, ...).
Read in order, the chunks cover every non-blank line of the code exactly once, so no
line goes unexplained. tests/test_code_walkthroughs.py enforces that.
"""


def _step(code: str, does: str, picture: str = "") -> dict:
    """One walkthrough step: `code` is copied verbatim from the lesson's example."""
    return {"code": code, "does": does, "picture": picture}


WALKTHROUGHS: dict[str, list[dict]] = {
    "why-quantum": [
        _step(
            (
                "from qiskit import QuantumCircuit  # the circuit builder\n"
                "from qiskit.quantum_info import Statevector  # works out exact amplitudes"
            ),
            "Qiskit is a library, a bundle of ready-made code, and an import brings one of its tools in so you can use it by name. 'from qiskit import QuantumCircuit' means: from Qiskit, bring in QuantumCircuit, the tool that builds a circuit, a recipe of steps for your qubits. qiskit.quantum_info is one section of Qiskit, and from there we bring in Statevector, which works out the exact amplitudes of a circuit with no randomness.",
            "Statevector is how we peek at the wave. On a real machine you never see it: each run shows one answer. Here your own computer does the maths and works out the amplitudes exactly, and we print their sizes squared: the chance of each answer.",
        ),
        _step(
            (
                "once = QuantumCircuit(1)  # one qubit, starts at |0⟩\n"
                "once.h(0)  # H on qubit 0: split into two paths"
            ),
            "QuantumCircuit(1) makes a new circuit with 1 qubit, which starts at |0⟩. The = gives it a name we chose, once, so we can use it later. The dot in once.h(0) means: on the circuit called once, add an H step to qubit 0 (Python counts from 0, so qubit 0 is the first and only qubit).",
            "One qubit, a quantum bit that reads zero or one, starting at zero. One step called H splits it into two paths, one to 0 and one to 1. Each path carries an amplitude of about 0.707, and 0.707 squared is about 0.5: a fifty fifty coin toss.",
        ),
        _step(
            (
                "twice = QuantumCircuit(1)  # a fresh qubit, also at |0⟩\n"
                "twice.h(0)  # first H: two paths, 50/50\n"
                "twice.h(0)  # second H: the paths to 1 cancel"
            ),
            "This builds a second, separate circuit called twice, again with one qubit at |0⟩, and leaves once alone so we can compare the two at the end. The line twice.h(0) appears two times, which adds two H steps in a row. Nothing is calculated yet: you are only writing down the recipe.",
            "Now do H twice. Each H splits every path in two, making four paths. The minus comes from H: when H acts on a 1, the path that stays at 1 picks up a minus sign. So the two paths to 1 carry +½ and −½ and cancel, while the two paths to 0 both carry +½ and add up to 1.",
        ),
        _step(
            (
                "print(twice.draw())  # a text drawing of the circuit"
            ),
            "twice.draw() turns the circuit into a picture made of text, and print shows it. You will see one line labelled q (your qubit) with two boxes on it, each marked H, read left to right.",
            "The line is the qubit's journey from start to finish, left to right. Each H box is one splitting step, the same two H boxes you saw in the video's path diagram.",
        ),
        _step(
            (
                "print('one H:  ', Statevector(once).probabilities_dict(decimals=3))  # 50/50"
            ),
            "Statevector(once) works out the exact amplitudes at the end of once, and .probabilities_dict(decimals=3) turns them into a dictionary: a lookup table of answer: chance pairs, rounded to 3 decimal places. print shows the label one H: and the dictionary side by side on one line, so you will see '0' with 0.5 and '1' with 0.5. Python may show them as np.str_('0') and np.float64(0.5) (np is NumPy, a maths library Qiskit uses): that just means the text '0' and the number 0.5.",
            "One H: a fifty fifty coin toss. Each answer has one path with amplitude about 0.707, and its size squared is 0.5. The chance is written out of 1, so 0.5 means 50%. Nothing has cancelled yet.",
        ),
        _step(
            (
                "print('two Hs: ', Statevector(twice).probabilities_dict(decimals=3))  # always reads 0"
            ),
            "The same calculation for the twice circuit. You will see two Hs: followed by only '0' with chance 1.0, which means 100%. The answer '1' is missing because its chance is zero, and the dictionary leaves out answers with zero chance.",
            "Interference in action: the +½ and −½ paths to 1 cancelled, a calm spot on the wrong answer. The two +½ paths to 0 added up to 1, so it always reads zero.",
        ),
    ],
    "qubit": [
        _step(
            (
                "from qiskit import QuantumCircuit  # the tool for building circuits\n"
                "from qiskit.quantum_info import Statevector  # shows the exact state (the arrow)"
            ),
            "An import brings a tool in from Qiskit so you can use it by name. QuantumCircuit builds a circuit, which is the list of steps you want done to your qubits. Statevector lives in a part of Qiskit called quantum_info (the dot means \"inside\"), and it works out the exact state. Nothing prints yet.",
            "One tool holds the steps that move the arrow. The other lets the computer see the arrow exactly, something no real measurement can do.",
        ),
        _step(
            (
                "qc = QuantumCircuit(1)  # one qubit, its arrow starts at |0⟩"
            ),
            "This builds an empty circuit with one qubit and saves it under the name qc. The 1 is how many qubits you want. Qiskit always starts every qubit in |0⟩.",
            "One arrow on the globe, pointing straight up at the north pole: |0⟩. There are no steps yet, so nothing will move it.",
        ),
        _step(
            (
                "state = Statevector(qc)  # the exact state: amplitudes α and β"
            ),
            "Statevector(qc) works out the circuit's exact state and saves it as state. It holds two numbers called amplitudes: α for |0⟩ and β for |1⟩. Their squared sizes give the odds of each answer.",
            "This is the arrow itself, written as numbers. On a real quantum computer the arrow stays hidden, but a simulator can show it to you.",
        ),
        _step(
            (
                "print(qc.draw())  # a picture of the circuit"
            ),
            "A dot after a name calls something that object can do, so qc.draw() asks the circuit to draw itself as text. print then shows that drawing on screen (the inside of the brackets runs first). The circuit has no instructions yet (Qiskit calls them gates), so you only see the qubit's label q: with nothing after it.",
            "Gates are the steps that turn the arrow. With none, it stays at the north pole.",
        ),
        _step(
            (
                "print(state)  # the amplitudes for |0⟩ and |1⟩"
            ),
            "This shows Statevector([1.+0.j, 0.+0.j], dims=(2,)), spread over two lines. The list holds α then β. Read 1.+0.j as just 1 (the dot means 1.0, and +0.j is an extra part that is zero here; it matters once you meet phase in Lesson 7), so α is 1 and β is 0. dims=(2,) says one qubit with two possible answers.",
            "α = 1 and β = 0 is the arrow pointing exactly at the north pole: the whole state sits on |0⟩.",
        ),
        _step(
            (
                "print(state.probabilities_dict(decimals=3))  # the odds of reading 0 or 1"
            ),
            "probabilities_dict squares the size of each amplitude to get the odds, and decimals=3 is a setting passed by name: round to 3 decimal places. It prints {np.str_('0'): np.float64(1.0)}, a dictionary of label: value pairs. Read it as {'0': 1.0}: outcome 0 has probability 1.0, which is 100%, and outcome 1 is missing because its odds are 0. (The np. tags come from NumPy, the number library Qiskit uses, and some setups leave them out.)",
            "These are the bars from the widget: the 0 bar at 100% and the 1 bar empty. They are exact odds worked out by the simulator. On a real qubit you can't see them; you'd measure many qubits prepared the same way and count the answers, and here every answer would be 0.",
        ),
    ],
    "flip": [
        _step(
            (
                "from qiskit import QuantumCircuit  # tool for building circuits\n"
                "from qiskit.quantum_info import Statevector  # tool to work out the arrow"
            ),
            "from qiskit import QuantumCircuit means: from the Qiskit library, fetch the ready-made tool named QuantumCircuit so you can use it by name. QuantumCircuit builds circuits, which are lists of steps for your qubits, and Statevector, kept in the quantum_info part of Qiskit, works out exactly where a qubit's arrow ends up. Text after # is a note for people, and Python skips it.",
            "QuantumCircuit is where you list the gates that turn the arrow. Statevector is how the code keeps track of the arrow itself.",
        ),
        _step(
            (
                "qc = QuantumCircuit(1)  # one qubit, its arrow starts at |0⟩"
            ),
            "This makes a new, empty circuit with one qubit and stores it under the name qc. Qubits are numbered from 0, so this single qubit is qubit 0. Every new qubit starts in |0⟩.",
            "One arrow, pointing straight up. Up means 0, written |0⟩. Check it now and it would read 0 every time.",
        ),
        _step(
            (
                "qc.x(0)  # X on qubit 0: a half turn, |0⟩ to |1⟩"
            ),
            "qc.x(0) is a method call: the dot means 'ask qc to do something', here add an X gate to its list of steps. The 0 picks which qubit, our only one, qubit 0. This just writes the step down, nothing is worked out yet, so nothing prints.",
            "This is the flip from the video. X turns the arrow a half turn around a line running left to right, like flipping the pancake, so the arrow pointing up at |0⟩ will land pointing down at |1⟩. It turns the arrow without stretching it, with no chance involved.",
        ),
        _step(
            (
                "print(qc.draw())  # picture of the circuit"
            ),
            "qc.draw() makes a text drawing of the circuit, and print shows it on screen. You will see one wire labeled q with a box marked X on it. Read the wire from left to right like a timeline, so steps further right happen later.",
            "The wire is the life of our one arrow, and the X box is the moment it gets its half turn from up to down.",
        ),
        _step(
            (
                "print(Statevector(qc).probabilities_dict(decimals=3))  # chance of reading 0 or 1"
            ),
            "Statevector(qc) works out exactly where the arrow ends up after all the gates in qc have run, with no randomness, and .probabilities_dict(decimals=3) turns that into the chance of reading each result, rounded to 3 places. The answer is a dict, pairs of result: chance inside { }, and you will see {np.str_('1'): np.float64(1.0)}, where np.str_ and np.float64 are just type labels added by NumPy, a math tool Qiskit uses. Read it as {'1': 1.0}: you read 1 with probability 1.0, every time, and 0 is left out because its chance is zero.",
            "The arrow now points straight down at |1⟩, so reading it gives 1 every time and never 0. Before the flip it read 0 every time. X swapped them, just like the NOT gate of ordinary computers.",
        ),
    ],
}
