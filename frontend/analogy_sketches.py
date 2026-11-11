"""Hand-drawn analogy sketches, cut from each lesson's own video.

Each entry is (video stem, alt text, width, height); the file is web/public/sketches/<video stem>.webp.
tests/test_analogy_sketches.py checks every file exists at that size.
"""

SKETCHES = {
    'why-quantum': ('01-why-quantum', 'Chalk sketch of straight waves reaching a harbour wall with gaps, spreading out as overlapping ripples, with calm spots marked as gold dots along the beach.', 840, 441),
    'qubit': ('02-qubit', 'A chalk weathervane with N at the top and S at the bottom, its arrow pointing between them, and a bubble asking \"north or south?\".', 840, 643),
    'flip': ('03-flip', 'A chalk sketch of a pancake in a frying pan under an X gate box, with the pancake\'s top side marked and a note reading "flips: 2, back to the start".', 840, 395),
    'measurement': ('04-measurement', "A chalk sketch of a crowd of 1,000 stick-figure voters next to a ballot box labelled poll, with a bar chart asking 'winner?' showing A at 58% and B at 42%.", 840, 339),
    'superposition': ('05-superposition', 'A chalk compass with N = 0 at the top and S = 1 at the bottom, its needle pointing east, with dotted lines showing east is equally far from north and south, labelled "north or south?", "a definite direction" and "equally far".', 840, 521),
    'rotations': ('06-rotations', 'A chalk light switch that is only ON or OFF, labelled "X: on or off", beside a dimmer dial from 0 to π that can stop anywhere, labelled "RY(θ): any level".', 840, 469),
    'phase': ('07-phase', "A chalk globe with two little houses on the same dashed line of latitude, an equals sign between them, and two yellow meridians labelled 'longitude' showing they sit at different longitudes.", 769, 740),
    'interference': ('08-interference', 'A chalk sketch of headphones beside a white "noise" wave and a gold "mirror image" wave that dips wherever the noise wave rises.', 840, 235),
    'bases': ('09-bases', 'A flashlight sends slanted light waves through tilted polarized sunglasses, a bubble crossing out "upright?" for "slanted?", and a meter shows all of the light getting through.', 840, 338),
    'registers': ('10-registers', 'A chalk sketch of a combination lock with ten wheels, each set to 0 or 1, with 2 × 2 × … × 2 written underneath and the total 1,024 in gold.', 840, 259),
    'entanglement': ('11-entanglement', 'Two stick-figure dancers on a stage, holding hands, with a dotted line joining their feet. A gold ring circles the pair under a box of shared dance notes, labelled "belongs to the pair".', 840, 413),
    'no-cloning': ('12-no-cloning', 'A chalk sketch of an eye looking down at two white pages tied together with a gold string bow.', 610, 547),
    'teleportation': ('13-teleportation', "Chalk sketch of two fax machines, Alice's and Bob's, joined by a phone line, with the starred page coming out at Bob's end and the original shredded in a bin beside Alice's.", 840, 372),
    'superdense': ('14-superdense', 'A chalk sketch of a safe with two keyholes, with Alice holding a key whose dial can turn to four positions on the left and Bob holding the other key on the right.', 840, 279),
    'deutsch': ('15-deutsch', 'Chalk sketch of a trick coin with a sun on both faces, labelled constant, beside a real coin with a sun and a moon, labelled balanced.', 840, 244),
    'bernstein-vazirani': ('16-bernstein-vazirani', 'A chalk sketch of a panel of three switches with dashed hidden wiring running from switches 1 and 3 to a buzzer labelled EVEN, with the note "wired + on: 2".', 840, 382),
    'grover': ('17-grover', 'A chalk sketch of a stick figure on a swing hanging from an A-frame, swung high to one side above a dotted yellow arc that traces its path.', 756, 660),
    'qft': ('18-qft', 'A chalk sketch of piano keys playing a chord, sending out one tangled wave to an ear that splits it into three separate waves labelled slow, faster and fastest frequencies.', 840, 224),
    'phase-estimation': ('19-phase-estimation', 'Three hand-drawn photo frames of a clock, labelled 1 tick, 2 ticks and 4 ticks, with the hand turned further each time and the 4-tick photo marked "4× the gap".', 840, 343),
    'hardware': ('20-hardware', 'A chalk line of eight stick figures passes a whisper along, with "blue cat" drifting to "blue hat" and "glue hat" until the last bubble is just a scribble, and brackets mark a short line and a long line.', 840, 303),
    'real-chip': ('21-real-chip', 'Chalk sketch of five stick-figure guests at a long dinner table, each chatting only with the guest beside them, with arrows between neighbours labelled "neighbours".', 840, 293),
    'qml': ('22-qml', 'A chalk sketch of a guitar being tuned by ear, with one tuning peg turning, a tuner dial between flat and sharp reading "too low", and an ear listening to the plucked string.', 840, 339),
}


def sketch_for(lesson_id: str) -> dict | None:
    """The card's sketch entry for one lesson, or None when it has none."""
    if lesson_id not in SKETCHES:
        return None
    stem, alt, width, height = SKETCHES[lesson_id]
    return {"src": f"/sketches/{stem}.webp", "alt": alt, "width": width, "height": height}
