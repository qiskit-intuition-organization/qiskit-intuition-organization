# Lesson 19, Phase estimation: beat plan

Voiced with bf_emma: 16 lines, 259 words, narration ends at 85.31 s, film about 87.9 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json` (approximate, for orientation); always cue with
`cue(line, "word")`, never hard numbers.

Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Ink #e8e8e8, gold #d9b463 on #17191c.
Gold rule: one gold thing at a time, almost always the hand that is turning right now, or the digits being read.

## Physics the pictures must keep (checked)
- An eigenstate of U only picks up a turn: U|ψ⟩ = e^{2πiφ}|ψ⟩, with φ a fraction of a full turn (1 turn = 360°).
  On its own that turn is invisible; phase kickback moves it onto the control as a relative phase, which is
  what a counting qubit's "hand" shows. Hands start pointing up (12 o'clock) and turn **clockwise**, as in lesson 18.
- Counting qubits start in |+⟩. Counting qubit j controls U run 2ʲ times and its hand turns 2ʲφ of a turn.
  Whole turns do not show on a dial: only the fractional part matters.
- Worked example for lines 7, 8 and 15: **φ = 0.101 in binary = 5/8 of a turn = 225°.**
  - U once: hand at 225° (0.101).
  - U twice: 2φ = 1.01, so 1 full turn + 90°: hand ends at **90°** (0.01).
  - U four times: 4φ = 10.1, so 2 full turns + 180°: hand ends at **180°** (0.1).
  - The first digit after the point on each hand is 1, 0, 1: φ's 1st, 2nd and 3rd digits. Readout 101 is a
    palindrome, so there is no bit order trap (Qiskit puts the U-once qubit last). Do not use any other value here.
- S example (lines 9, 10 and 12): S turns |1⟩ by a quarter turn: φ = 1/4 = 0.01 in binary. Counting qubit 1 controls S
  (quarter turn, 90°), counting qubit 2 controls S twice = Z (half turn, 180°). Inverse QFT reads **01** (as in course.json).
- Measuring a counting qubit straight away gives 0 or 1 with fifty fifty odds whatever its hand shows (line 11, the analogy break):
  show "0 or 1", never a hand being read off.
- Lines 13 and 14: the input (the target, labelled "special state") must be an eigenstate; for an input that is not an eigenstate, the output is one of U's phases at random. For S on |+⟩
  that is 0 or ¼, each half the time. Show exactly those two; never a blurred or averaged value.
- The clock in lines 2 and 3 is only the analogy. Its speed is about 0.18 turn per tick (65°), chosen to look
  like "some secret amount". Photos: 1 tick 65°, 2 ticks 130°, 4 ticks 260°. A ghost hand for a slightly
  faster clock (72° per tick) sits at 72°, 144°, 288°: the gap grows 7°, 14°, 28°. That is "magnifies".

## Recurring objects
- `b-dial*`: a qubit dial is a rough circle with 8 small ticks, a dot at the centre, and a hand (line + small head)
  drawn in a `<g>` rotated about the centre by `onFrame` from `sched()`. A faint dotted gold arc from 12 o'clock to
  the hand shows the turn so far (driven by the same value). Spins past a full turn must visibly go round.
- `b-clock`: the analogy clock, a bigger dial with 12 hour ticks, a small knob at top (a wall clock), and one hand.
- `b-photo1..3`: polaroid frames, 340 x 400, centres x 480, 960, 1440, y 280 to 680, each with a mini clock
  (r 120, centre y 450) and a caption strip "1 tick", "2 ticks", "4 ticks" (48 px) at y 640.
- Circuit (lines 4 to 7), x 300 to 1150: counting wires `b-w1..3` at y 280, 420, 560; target wire `b-wt` at y 720.
  "|+⟩" labels at x 160 to 290 (48 px). Target label "special state" (40 px) under the target wire at x 300, y 770.
  U boxes 130 x 100 on the target wire at x 450, 700, 950, labelled "U", "U<sup>2</sup>", "U<sup>4</sup>" (56 px,
  use `<sup>` in the label html; the hand-drawn symbol set has no superscript 4). Control dots on wires 1, 2, 3
  above the matching box, vertical lines down to the box. Dials r 62 at x 1350 on each counting wire's y, with
  value labels "φ", "2φ", "4φ" (56 px) at x 1450.
- `b-qft`: an "inverse QFT" box (rough rect, label 48 px, ink), reused in lines 12 and 15.

## Beats

### Line 0 (0.40 to 4.97) "Here's a puzzle. A gate secretly turns a special state by a fraction of a turn."
- Kit title block shows; `blurOut("#b-title", cue(0, "special", 0, 0))` (about 2.9 s, keep >= 2.5 s).
- On "gate" (1.70): a gate box draws at (1150 to 1400, y 430 to 610), label "gate" (56 px), and at the same time a dial
  draws at centre (700, 520), r 170, hand up, with an arrow from the gate to the dial. A small padlock sketch draws on
  the gate's top edge on "secretly" (1.96). Everything here sits below y 340, clear of the title.
- On "turns" (2.49): the hand turns to 225° (1.2 s, power2.inOut), gold, with the gold arc.
- On "special state" (2.88): label "special state" (48 px) writes under the dial.
- On "fraction" (3.90): "? of a turn" writes beside the arc (gold, 56 px).
- Leaves: the gate blurs at line 1 "chemistry"; dial and arc stay into line 1.

### Line 1 (5.26 to 9.21) "That fraction is its phase, and in chemistry, it's the number we're after."
- On "phase" (6.32): "? of a turn" rewrites as "phase" (gold, 64 px), and "= a fraction of a turn" (44 px, ink) under it.
- On "chemistry" (7.12): a small hand-drawn molecule (three circles and two bonds, about 220 px wide) draws at right
  (1400, 500); label "chemistry" (48 px) under it.
- On "number" (8.20): a dotted arrow draws from the molecule to the gold arc, tagged "the answer" (44 px, ink).
- Leaves: everything blurs at line 2 start.

### Line 2 (9.51 to 13.56) "To read it, picture a clock hand moving the same secret amount every tick."
- On "clock" (10.57): `b-clock` draws big and centred (960, 480), r 240 (1.5 s), hand at 12.
- On "moving" (11.22): the hand steps 65° (a quick 0.25 s snap, like a tick); on "same" (11.69) and "tick" (13.37)
  it steps again, so it ticks three times. Small "tick" marks (44 px, ink) pop by the rim at each step.
- On "secret amount" (12.15): a gold "? per tick" label writes under the clock (56 px).
- Leaves: clock and label blur at line 3 "Photograph".

### Line 3 (13.87 to 19.54) "Photograph it after one, two and four ticks. The four tick photo magnifies tiny differences."
- On "Photograph" (13.92): three polaroid frames draw left to right, 0.2 s apart (each 0.8 s); a tiny shutter flash
  (a short burst of 6 ink lines) at each frame's corner.
- On "one" (14.88), "two" (15.16), "four" (15.38): the mini clock in each frame draws with its hand already set
  (65°, 130°, 260°), and its caption writes. Hands are ink; their dotted arcs ink.
- On "magnifies" (18.05): a dotted ghost hand fades in on each clock at 72°, 144°, 288°. The gap between real hand
  and ghost is shaded with a gold wedge; the 4-tick wedge is the big one. A gold "4× the gap" label (48 px) under the
  4-tick frame on "differences" (19.03), and the third frame scales to 1.08.
- Leaves: frames blur at line 4 "Phase".

### Line 4 (19.84 to 25.56) "Phase estimation takes these photos with counting qubits. Call the gate U, and its fraction phi."
- On "Phase" (20.16): heading "Phase estimation" writes at top left (x 192, y 100, 60 px, ink, `.type` style is fine).
- On "counting" (22.16): wires `b-w1..3` draw (1 s each, 0.15 s apart), the three dials draw at x 1350, and a small
  camera icon (about 90 px) with "counting qubits" (44 px) writes above wire 1 at (300, 210). The camera links back to the
  photos; it fades at line 6 "kickback".
- On "gate" (24.11): target wire and its "special state" label draw; the "U" box at x 450 draws on "U" (estimate, about 24.4).
- On "fraction" (24.94; whisper put "phi" at the start of line 5, so do not cue it): a gold "hidden turn φ" label writes under the U box (44 px).
- Leaves: nothing; the circuit carries on.

### Line 5 (25.86 to 30.96) "Each counting qubit starts in ket plus, an even mix of zero and one, and controls U."
- On "ket plus" (27.50): three "|+⟩" labels write at the wire starts (x 160 to 290, 48 px).
- On "even mix" (28.57): a small note "= an even mix of 0 and 1" (40 px, ink, text-align left) writes between wires 1 and 2
  at (320, 330), pointing at the first "|+⟩" with a short tick line. It fades at line 6 start.
- On "controls" (29.89): the control dot on wire 1 and its line down to the U box draw (0.4 s); the dot is gold briefly,
  then ink at line 6 start.
- Leaves: the "even mix" note fades at line 6 start; the circuit carries on.

### Line 6 (31.26 to 35.31) "Phase kickback, from lesson fifteen, moves the turn onto that qubit's hand."
- Whisper put "Phase" at the end of line 5 (30.77) and "hand" at the start of line 7 (35.22): cue `cue(6, "kickback", 0, -0.35)`
  for the start and `cue(6, "qubit's")` for the end, not "Phase" or "hand".
- On "kickback" (31.14, minus the offset): a curved gold arrow draws from the U box up and right along wire 1 to dial 1 (0.8 s);
  "phase kickback" (44 px, ink) writes by the arrow. The camera icon and "counting qubits" fade.
- On "lesson" (32.23): a small "(lesson 15)" tag (40 px, ink) writes after "phase kickback".
- On "turn" (33.68): "hidden turn φ" under the U box fades to ink (0.35 s).
- On "qubit's" (34.61): dial 1's hand brightens to gold (still pointing up, nothing has turned yet).
- Leaves: the kickback arrow, its label and the tag blur at line 7 "Run".

### Line 7 (35.61 to 40.96) "Run U once, and the first hand turns phi. Run it twice, two phi, and four times, four phi."
- On "Run" (35.80): the U box pulses (scale 1.08 and back).
- On "turns" (37.87): dial 1 turns 0 to 225° (1 s), gold; "φ" writes at x 1450 on "phi" (37.92).
- On "twice" (38.91): "U²" box and its control from wire 2 draw (0.4 s); dial 2 spins 0 to 450° (1.2 s), so it visibly
  goes once round and stops at 90°; "2φ" writes. Dial 1 goes back to ink as dial 2 lights.
- On "four" #0 (39.59): "U⁴" box and control from wire 3 draw; dial 3 spins 0 to 900° (1.2 s), two and a half turns,
  stopping at 180°; "4φ" writes on "four" #1 (40.24). Dial 2 back to ink. Dial 3 finishes about 40.8, just inside the line.
- Leaves: at line 8 "Doubling", the wires, boxes, |+⟩ labels and heading blur; the three dials and their value labels stay.

### Line 8 (41.26 to 49.12) "Doubling slides phi's binary digits, its zeros and ones, one place left, and whole turns vanish, so each hand shows a finer digit."
- On "Doubling" (40.96, transcribed a touch early; cue it and add 0.2): the three dials move to x 420 (same y 280, 420, 560)
  and grow to r 70 (0.8 s), labels follow.
- On "binary" (42.33): beside them, at x 560, write in a column (64 px, ink): "φ = 0.101", "2φ = 1.01", "4φ = 10.1",
  with the binary point in each row aligned at the same x (use monospaced spacing in three spans).
- On "zeros" (43.75): a small "binary: only 0s and 1s" note (40 px, ink) writes above the column at (560, 200), and the
  digits of row 1 flick gold and back (0.5 s) so the eye lands on them.
- On "left" (45.21): a small curved arrow from row 1 to row 2 and row 2 to row 3 draws at the left edge of the digits
  (the 1 and the 01 are the same digits moved one place left).
- On "whole turns vanish" (45.88 to 46.62): the digits left of the point in rows 2 and 3 ("1", "10") get a quick ink
  strike-through and fade to 0.25; tiny "full turns" note (40 px) beside the strikes. Dials 2 and 3 do a quick extra
  full spin (0.6 s) that lands where they were, to show a full turn changes nothing.
- On "finer" (48.48): the first digit after the point in each row turns gold one after another (1, 0, 1, 0.2 s apart),
  and labels "1st digit", "2nd digit", "3rd digit" (44 px) write at x 1200 in each row. Each dial's hand is gold in turn
  with its digit (225°, 90°, 180°).
- Leaves: all blur at line 9 start.

### Line 9 (49.41 to 54.60) "Try the S gate, which turns ket one a quarter turn, zero point zero one in binary."
- "S gate" is heard merged ("Sgate"): cue `cue(9, "Try")` plus 0.15 for the box.
- On "Try" (49.56): an "S" box draws at (1120 to 1300, y 380 to 540) with a dial at (700, 460), r 180; arrow S to dial.
- On "ket" (50.90): "|1⟩" writes under the dial (64 px).
- On "quarter" (51.67): the hand turns 0 to 90° (0.9 s), gold, with arc; "¼ turn" writes by the arc (56 px).
- On "zero" #0 (52.79): "¼ = 0.01 in binary" writes at (960, 760, 64 px), with "0.01" gold. The hand goes ink.
- Leaves: blur at line 10 start.

### Line 10 (54.90 to 58.72) "With two counting qubits, one hand turns a quarter, the other a half."
- On "two" (55.27): two dials draw at (620, 400) and (1300, 400), r 150; labels above: "counting qubit 1:
  S once" and "counting qubit 2: S twice" (44 px).
- On "quarter" (57.33): dial 1 turns to 90° gold; "¼" writes under it.
- On "half" (58.24): dial 2 turns 0 to 180° gold (0.5 s, dial 1 to ink); "½" writes under it.
- Leaves: blur at line 11 start.

### Line 11 (59.02 to 63.37) "Here the picture breaks: measuring a qubit gives zero or one, never its hand."
- "Here" is transcribed at 58.75 inside line 10; start from `cue(11, "picture")`.
- On "picture" (59.21): one polaroid sketch (from line 3) draws small at (400, 420) and a gold cross strokes
  over it on "breaks" (59.73), then fades on "Measuring".
- On "Measuring" (60.30): a dial with its hand at 90° (the S counting qubit) draws at (860, 460), r 160, and a hand-drawn
  eye at (1350, 460) with a dotted arrow from the eye to the dial.
- On "zero" (61.83): "0 or 1" writes beside the eye (gold, 80 px); "fifty fifty, whatever the hand" (40 px, ink)
  under it.
- On "never" (62.65): the dial's hand fades to 0.2 and a "?" (64 px, ink) writes over it.
- Leaves: blur at line 12 start.

### Line 12 (63.67 to 69.15) "Instead, the inverse Q F T from lesson eighteen combines the hands into the digits zero one."
- On "Instead" (63.66): the two S dials from line 10 redraw smaller (r 110) at (620, 340) and (1300, 340), hands already
  at 90° and 180°, ink, labelled "¼" and "½" (44 px) beside them.
- On "inverse" (64.57): `b-qft` draws centred under them (760 to 1160, y 520 to 630), label "inverse QFT" (48 px).
  A small "(lesson 18)" tag (40 px, ink) writes to its right on "lesson" (65.63).
- On "combines" (66.55): arrows from the two dials into the box draw one after another (0.4 s each).
- On "digits" (68.33): "reads 01" writes under the box at (960, 750, 80 px), with "01" gold; on "one" (69.05) a small
  "= φ = ¼" (44 px, ink) writes to its right at x 1240. The dial hands stay ink.
- Leaves: blur at line 13 start.

### Line 13 (69.45 to 74.29) "The input must be a state U only turns, called an eigenstate, like ket one for S."
- "U only" is heard merged ("Uonly"); cue "turns" (70.96) for the turn.
- On "input" (69.71): input dial (560, 440), r 140, hand up, labelled "input" (44 px) above; "S" box at centre;
  output dial outline (1360, 440), same size.
- On "turns" (70.96): the output dial draws as the same state with its hand turned 90° (gold); "same state, just turned"
  (44 px) under it.
- On "eigenstate" (71.82): "eigenstate" writes gold (72 px) at (960, 700).
- On "ket" (73.60): "|1⟩" writes under both dials (56 px); "eigenstate" goes ink.
- Leaves: the output dial and "eigenstate" blur at line 14 start; the S box and input dial position stay for line 14.

### Line 14 (74.60 to 78.06) "Hand it any other state, and you get a random one of U's phases."
- On "other" (75.04): the input dial's label rewrites as "|+⟩" with "any other state" (44 px).
- On "random" (76.66): a hand-drawn die draws at the output side (1360, 440), about 180 px, gold, with a small wobble;
  two outcomes write under it: "0" and "¼" (64 px) with "half the time each" (40 px, ink).
- On "phases" (77.70): "a random one of S's phases" (44 px, ink) writes under the outcomes.
- Leaves: all blur at line 15 start.

### Line 15 (78.35 to 85.31, then the 2.6 s hold) "So kick U, U twice and U four times onto counting qubits, and the inverse Q F T reads phi's binary digits."
- Closing circuit, centred, x 180 to 1760: counting wires y 300, 430, 560 from x 300 to 1450 with "|+⟩" at x 160 to 290;
  target wire y 720 labelled "special state" (40 px) below; U boxes (130 x 100) at x 470, 700, 930: "U", "U²", "U⁴".
  Heading "Phase estimation" (56 px, ink) top left at y 100.
- On "kick" (78.69): wires draw (0.8 s). On "U," (78.89) the first box and its control; on "and" (79.54, since "Utwice"
  is merged) the second; on "times" (80.19, minus 0.3) the third. A short gold kickback arrow flicks up from each box as
  it lands, then goes ink.
- On "counting" (80.93): "counting qubits" (44 px) writes above wire 1 at x 300, y 230.
- On "inverse" (82.86): `b-qft` draws across the three counting wires (1070 to 1310, y 250 to 610).
- On "reads" (83.79): readout digits "1", "0", "1" write at the wire ends (x 1480, 72 px), and on "binary" (84.52) a gold
  brace and "φ = 0.101" (90 px, gold) write at x 1560 to 1760 (the line-8 example; three counting qubits give three
  digits). Keep the right edge at or left of x 1760 (if "φ = 0.101" is too wide at 90 px, stack "φ =" above "0.101").
- Stays to the end through the hold.

## Caption phrase pairs (add in scene.mjs)
```js
export const phrases = [
  ["four tick", "4-tick"],
  ["two phi", "2φ"], ["four phi", "4φ"], ["phi's", "φ's"], ["phi", "φ"],
  ["ket plus", "|+⟩"],
  ["ket one", "|1⟩"],
  ["zero point zero one", "0.01"],
  ["digits zero one", "digits 01"],
  ["Q F T", "QFT"],
];
```
- Keep "U twice" and "U four times" as words in the captions. The caption font is a Latin subset; if a check frame shows
  that "U⁴" renders well, `["U twice", "U²"], ["U four times", "U⁴"]` may be added, but both or neither.
- "zero or one" stays in words.

## Respellings
- None needed. Every real word was heard. Reported "not heard" items are only merged tokens ("Uonce", "Uonly", "Utwice",
  "Ufour", "Sgate", "QFT" for "Q F T"), digits for number words ("15", "18"), and words that whisper shifted across a line
  boundary ("phi" in line 4, "Phase" in line 6, "hand" in lines 6 and 14). The final "digits" of line 15 is not in the
  full-sequence transcript, but transcribing `lines/16.wav` alone hears it clearly, so Emma says it.

## Cue notes
- Words whisper merged ("U" + next word, "S gate", "Q F T") are not found by `cue()`, which then estimates from the
  letters. That is close enough here; prefer cueing a neighbouring clean word (for example "first", "turns", "twice" in
  line 7, "Try" or "which" in line 9, "turns" in line 13, "inverse" in lines 12 and 15).
- Kit note: on the first narrate run the transcriber dropped the end of the last line (it stopped at "inverse" and
  stretched the earlier words), so its cues were up to 1.7 s late. The re-run transcribed it cleanly. If the scene
  author re-narrates, check line 15's word times. In the current run its last heard word is "binary" (84.52) and the
  times before it look right (the line ends 85.31), so cue the closing "φ = 0.101" on "binary", not "digits".
