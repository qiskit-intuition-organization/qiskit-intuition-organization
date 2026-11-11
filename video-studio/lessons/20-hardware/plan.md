# Lesson 20, Noise and real hardware: beat plan

Voiced with bf_emma: 15 lines, 259 words, narration ends at 86.26 s, film about 88.9 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json` (approximate); always cue with `cue(line, "word")`, never hard numbers.

Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Ink #e8e8e8, gold #d9b463 on #17191c.
Gold rule: one gold thing at a time, the thing that matters right now (the wrong reading, the changed letter,
the arrow, the gap).

## Physics the pictures must keep (checked)
- Hook circuit: one wire from `|0⟩`, two X boxes, a meter. Ideally X X is the identity, so the ideal result is
  "0" 100%, "1" 0%. The chip shows a small "1" bar (draw about 5%, no number on it).
- Noise model is depolarizing: with chance λ a gate replaces the state with a random one, so the Bloch arrow
  keeps (1 − λ) of its length per gate. After n gates the length is (1 − λ)^n. The arrow never rotates
  because of this noise; it only gets shorter, along the same direction.
- Arrow pointing up with length L reads 0 with chance (1 + L)/2 and 1 with chance (1 − L)/2.
  L = 0 (the centre) is 50/50. Never show a reading chance above 50% for "1" in the shrink scenes.
- λ = 1%: 10 gates leave 0.99^10 = 0.904 (show "≈ 90%"), and P(1) = 4.8% (show "≈ 5%", "1 in 20").
  100 gates leave 0.99^100 = 0.366 (show "≈ 37%", "just over a third"), and P(1) = 31.7% (show "≈ 32%", "nearly 1 in 3").
- Transpiling example (line 5) must be a real count: three wires q0, q1, q2 on a chip wired in a line
  (q0 to q1 to q2). Your circuit: H on q0, then a CNOT from q0 to q2: two gates. On the chip: H becomes
  rz sx rz (3), q0 and q2 are not wired together so a swap of q0 and q1 (3 cx), then cx from q1 to q2 (1),
  then the swap back (3 cx): 3 + 3 + 1 + 3 = 10 gates.
- Shot noise (line 11): a 50/50 qubit, 100 shots, a fixed pattern with exactly 47 ones. Shot wobble is
  chance from finite runs, not a device fault.
- Compare (line 12): on the chip's "1" bar, draw a small wobble whisker (shot spread); the gold gap from 0 up to
  the bar is much bigger than the whisker. That gap is device noise.
- Mitigation vs correction (line 13): mitigation works on the results after the run; correction protects the
  qubit during the run using many extra qubits. Do not say or draw that mitigation removes the noise from the qubit.

## Recurring objects
- `b-ball`: the Bloch ball (lines 6 to 11 and 14). Circle centre (640, 470), radius 270; an equator ellipse
  (front half solid, back half dashed, ry 70); small "0" at the top (640, 170, 52 px) and "1" at the bottom
  (640, 790, 52 px), ink. Centre dot (small, ink).
- `b-arrow`: gold arrow from the centre straight up; its length is driven by `onFrame` from `sched()` (full = 250 px).
  Head stays the same size; only the shaft shortens.
- Readout panel (right of the ball, x 1060 to 1740): two horizontal bars "reads 0" and "reads 1" (labels 48 px at
  x 1060, bars from x 1290, max length 420 px for 100%), y 380 and y 480, with live percent labels (44 px) at the
  bar ends. "reads 1" bar is gold (the thing that grows wrong); "reads 0" ink. Driven by the same arrow length L.
- Gate counter (x 1060 to 1740, y 230): "gates: N" (56 px) and "length: NN%" under it (y 300, 48 px), counted by `onFrame`.

## Beats

### Line 0 (0.40 to 5.35) "Start a qubit, a quantum bit, at zero and flip it twice. It should always read zero."
- Title block shows until about 2.6 s; `blurOut("#b-title", cue(0, "flip", 0, -0.05))` (about 2.6 s, keeps >= 2.5 s).
- On "qubit" (0.47): a hand-drawn wire draws below the title area (x 560 to 1360, y 560, 0.8 s), with "|0⟩" writing at
  its left (x 470, 64 px). On "quantum" (1.03) a small ink note "qubit = quantum bit" writes under the wire
  (x 960 centred, y 650, 44 px); it fades at line 1 start.
- On "flip" (2.64) and "twice" (3.04): two X boxes draw on the wire (centres x 800 and x 1000, 110 px squares,
  "X" 64 px), one per word. A tiny ink caption "X = flip" (40 px) writes under the first box on "flip".
- On "always" (4.54): a meter (a box with a needle arc) draws at x 1200; on "read" (4.95) a gold "0" writes after it
  (x 1420, 90 px). That gold 0 is the goal.
- After the title blurs (from about 3.0 s), move the whole circuit up to y 210 (1 s, power2.inOut) so line 1 has room.
  Keep it inside x 140 to 1780.

### Line 1 (5.65 to 10.88) "An ideal simulator on a laptop agrees, but a real chip sometimes reads one. Why?"
- "zero." is heard at 5.27 (end of line 0); the circuit is already in place at top.
- On "simulator" (6.21): left panel label "ideal simulator" writes (48 px, y 560); on "laptop" (7.07) a little laptop
  sketch draws above it (x 330 to 610, y 360 to 520), and beside it a mini bar chart (x 650 to 900, baseline y 760):
  bar "0" full height 180 px, bar "1" empty (just a stub). Bar labels "0", "1" at y 800 (44 px). Ink; on "agrees"
  (7.44) a small ink tick draws over the "0" bar.
- On "chip" (8.67): right panel draws: a chip sketch (rounded square with pin ticks on all sides, x 1030 to 1270,
  y 380 to 560), labelled "real chip" (48 px, y 600); mini chart at x 1320 to 1570: bar "0" about 95% (171 px),
  bar "1" starts at 0.
- On "sometimes" (8.96) to "one" (10.03): the chip's "1" bar grows to a small gold sliver (about 9 px tall, onFrame,
  0.6 s) and flickers once (opacity 1 to 0.5 to 1), the one gold thing.
- On "Why" (heard in line 2, `cue(2, "why")`, about 10.98): a big gold "?" writes between the panels (x 960, y 560, 120 px).
- Leaves: everything blurs at `cue(2, "think", 0, -0.15)`. The circuit and charts come back in line 12.

### Line 2 (11.18 to 15.28) "Think of whispering a message down a line: each whisper adds a small mistake."
- On "whispering" (11.99): a row of 8 small stick figures draws left to right (x 220 to 1700, heads y 470,
  feet y 680, 0.15 s apart, each 0.6 s). Small curved whisper arrows draw from each head to the next.
- On "message" (12.52): a speech bubble above person 1 writes "blue cat" (48 px, y 360).
- On "each" (13.6): bubbles above persons 3, 5 and 8 write in turn: "blue hat", "glue hat", "glue mat".
  In each, only the changed letter is gold (draw the word as two spans). On "mistake" (14.93) the last gold letter
  pulses.

### Line 3 (15.57 to 19.11) "A short line gets it through. A long line turns it into mush."
- On "short" (15.66): a bracket draws under persons 1 and 2 (y 720) with "short line" (44 px); the bubble over person 2
  writes "blue cat" and an ink tick draws beside it on "through" (16.67).
- On "long" (17.46): a long bracket draws under all eight (y 780) with "long line" (44 px).
- On "mush" (heard in line 4, `cue(4, "mush")`, about 19.08): person 8's bubble "glue mat" is scribbled over and
  replaced by a gold squiggle scrawl (a wobbly line, 0.4 s): mush.
- Leaves: the row and bubbles blur at `cue(4, "gates", 0, -0.15)` (about 19.57).

### Line 4 (19.41 to 25.53) "Gates, a circuit's steps, whisper too: each is slightly off, and a waiting qubit leaks its state. That's noise."
- On "Gates" (`cue(4, "gates")`, 19.72): a wire draws across the middle (x 220 to 1700, y 420) with five gate boxes
  (90 px) on its left part (x 300 to 1000). On "steps" (20.63) "gate = one step of a circuit" writes under them
  (44 px, ink, y 520). On "whisper" (20.93) each box gets a tiny whisper mark over it (a small curved arrow, like the
  people's).
- On "off" (22.65): a small gold wavy tilde draws on top of each box, left to right (0.12 s apart): each gate is
  a little off. "slightly off" writes above the boxes (44 px, ink).
- On "waiting" (23.09): on the right part of the wire (x 1100 to 1700) with no gates, an hourglass sketch draws
  (x 1400, y 280) with "waiting" (44 px) beside it.
- On "leaks" (23.86): a gold dot travels along that empty stretch of wire (onFrame, 1.4 s) while its opacity falls
  from 1 to 0.3 and small ink dotted arrows draw away from the wire into the surroundings (3 tiny arrows, up and
  down). The dot fading is the state leaking away.
- On "noise" (heard in line 5, `cue(5, "noise")`, about 25.41): a bracket draws under the whole wire (y 600) and
  "= noise" writes under it (64 px, gold; the tildes turn ink as it writes, so it is the one gold thing).
- Leaves: all blur at `cue(5, "your", 0, -0.1)` (about 25.9; "noise" stays about 0.5 s).

### Line 5 (25.84 to 32.71) "Your circuit is transpiled: rewritten into the chip's few gates and fitted to its wiring. Here, two gates become ten."
- On "circuit" (26.46): top: "your circuit" (48 px, x 200, y 140) and three short wires q0, q1, q2 (x 360 to 900,
  y 210, 270, 330, labels "q0 q1 q2" 40 px at x 200) with an H box on q0 and a CNOT (dot on q0, a plus circle on q2,
  joined by a vertical line) after it. Ink.
- On "transpiled" (26.73): a gold down arrow draws (x 960, y 380 to 470) with "transpiled" writing beside it (48 px)
  and under it, in ink, "= rewritten for the chip" (40 px). The arrow is gold for this moment.
- On "few gates" (`cue(5, "few")`, 28.64): bottom: three long wires (x 200 to 1740, y 560, 650, 740), and a small note
  "chip's gates: rz sx cx" (40 px, x 1250, y 200) writes.
- On "wiring" (30.42): a tiny chip wiring note at right of the top half ("q0 • q1 • q2" as three dots joined by two
  short lines, x 1250 to 1600, y 280, label "chip wiring: q0 and q2 not joined" 40 px). Ten small boxes (64 px) draw one
  after another (0.12 s apart, from "few" through "wiring"): rz, sx, rz on q0; three cx (swap q0 and q1); cx q1 to q2;
  three cx (swap back). Labels inside boxes 40 px. Over the swap groups write "swap" (40 px) on "wiring".
- On "two" (31.43): under "your circuit" a count "2 gates" writes (48 px, ink).
- On "ten" (32.54): under the long circuit a count "10 gates" writes, gold (56 px), and the ten boxes flash in sequence.
- Leaves: all blur at `cue(6, "picture", 0, -0.15)`.

### Line 6 (33.01 to 36.74) "Picture the qubit as an arrow in a ball: up is zero, down is one."
- On "arrow" (34.22): `b-ball` starts drawing (1.2 s, from `cue(6, "arrow", 0, -0.2)`), with its equator and centre
  dot, and `b-arrow` draws straight up at full length, gold, just after the circle begins.
- On "ball" (34.71): the circle completes; the equator draws.
- On "zero" (35.67): "0" writes at the top of the ball; on "one" (36.56) "1" writes at the bottom. The readout panel
  draws at right with "reads 0" at 100% and "reads 1" at 0%.

### Line 7 (37.04 to 43.80) "Here's where whispering breaks: noise doesn't swap in a new message; it mostly shrinks the arrow toward the fifty fifty centre."
- On "breaks" (38.45): top right, a small ink speech bubble "glue mat" (44 px, x 1250 to 1600, y 120 to 200) writes.
- On "new message" (`cue(7, "new")`, 40.27): an ink cross draws through that bubble (0.3 s): noise is not a different
  message.
- On "shrinks" (41.57): the arrow shrinks from full to 0.4 (onFrame, 1.2 s); the readout bars follow
  (reads 1 rises to 30%).
- On "fifty fifty" (heard as "50-50", 42.92) to "centre" (heard as "center", 43.64): the arrow shrinks on to nothing;
  the centre dot turns gold and grows slightly, the bars meet at 50% / 50%, and a label "50/50" writes beside the
  centre dot (x 700, y 470, 48 px, gold). The crossed bubble fades.
- At line 8 start the arrow regrows to full (0.6 s) and the "50/50" label fades; bars back to 100 / 0.

### Line 8 (44.10 to 50.07) "If each gate makes the state random with a small chance, lambda, the arrow keeps one minus lambda of its length."
- On "gate" (44.69): a single gate box draws at right (x 1100, y 200, 100 px).
- On "random" (45.75): inside the box a tiny dice sketch draws (ink), a picture of "random".
- On "chance" (46.89) to "lambda" (47.23): a small "λ" writes in the box corner and "λ = small chance" writes beside
  the box (44 px, ink).
- On "keeps" (48.15): the arrow shrinks one step (to 0.9 for visibility in this demo, 0.4 s), and the formula
  "length × (1 − λ)" writes under the box (56 px), with "(1 − λ)" gold on "one" (`cue(8, "one")`, 48.44).
- Leaves: the dice and "λ = small chance" fade at line 9 start; the formula stays smaller at top right
  (scale 0.8) for lines 9 and 10. The arrow returns to full at line 9 start.

### Line 9 (50.37 to 55.75) "At one percent, ten gates leave about ninety percent, so it reads one about one time in twenty."
- On "one percent" (50.6): "λ = 1%" writes next to the formula (48 px).
- On "ten" (51.34): the gate counter appears and counts "gates: 0" up to 10 (onFrame, 1.2 s); a short row of ten tiny
  gate ticks draws along a wire under the ball (y 830, x 360 to 920). The arrow shrinks in steps from 1 to 0.904.
- On "ninety" (52.55): "length ≈ 90%" settles under the counter.
- On "reads" (53.62): the "reads 1" bar is at 5% (gold); on "twenty" (55.62) "≈ 5%, 1 in 20" writes by it (44 px, gold).

### Line 10 (56.05 to 60.38) "A hundred leave just over a third: it reads one nearly one time in three."
- On "hundred" (56.62): the counter runs on from 10 to 100 (onFrame, 1.6 s); the tick row compresses into a dense
  hatched band (to suggest a hundred). The arrow shrinks to 0.366.
- On "third" (57.75): "length ≈ 37%" settles.
- On "reads" (58.82): "reads 1" bar at 32%; on "three" (heard in line 11, `cue(11, "three")`, about 60.27)
  "≈ 32%, nearly 1 in 3" replaces the old note (gold).
- Leaves: ball, panel, counter and formula blur at `cue(11, "some", 0, -0.15)`.

### Line 11 (60.68 to 66.95) "Some wobble is just chance: a hundred runs, called shots, of a fifty fifty qubit might give forty seven ones."
- On "chance" (61.97): a coin sketch draws at left (x 300, y 450, radius 90) with "50/50" (48 px) under it.
- On "runs" (63.13): a 10 by 10 grid of small circles (x 620 to 1180, y 230 to 790, spacing 56) fills in row by row
  (onFrame, about 2.6 s, from "runs" to "give"). Each circle is either an ink ring (read 0) or a gold dot (read 1),
  following a fixed pattern with exactly 47 gold. On "shots" (63.77) "1 run = 1 shot" writes at right (44 px).
- A live counter at right (x 1300 to 1740, y 450): "ones: N" (56 px) counts with the grid; on "forty seven"
  (heard as "forty-seven", 66.37) it lands on 47, gold, and "not exactly 50" writes under it (44 px, ink).
- Leaves: coin and grid blur at `cue(12, "always", 0, -0.15)`; the "47" stays a moment then fades.

### Line 12 (67.25 to 73.25) "Always compare with an ideal simulation of the same circuit. The gap beyond that wobble is device noise."
- On "compare" (67.79): the hook's circuit (`|0⟩ X X meter`) writes small at top centre (y 170), and the two mini charts
  from line 1 return side by side (x 360 to 820 and x 1100 to 1560, baseline y 720), labelled "ideal simulation" and
  "real chip" (48 px).
- On "same circuit" (`cue(12, "same")`, 70.05): two thin ink lines draw from the circuit down to each chart (one
  circuit, two runs).
- On "gap" (71.27): a gold bracket starts drawing beside the chip's "1" bar from the baseline to the bar top.
- On "wobble" (72.11): a small ink whisker (an I-shaped error bar, about 12 px) draws on the chip's "1" bar, labelled
  "wobble" (40 px). The bracket is clearly bigger than the whisker.
- On "device" (72.62) to "noise" (73.01): "device noise" writes beside the bracket (48 px, gold).
- Leaves: all blur at `cue(13, "careful", 0, -0.2)`.

### Line 13 (73.55 to 81.42) "Careful: error mitigation only estimates better answers from noisy results; protecting the qubit takes error correction and extra qubits."
- On "Careful" (heard as "Careful,", 73.6) to "error" (74.2): two headings write: left "error mitigation" (56 px,
  x 200 to 860, y 200), right "error correction" (56 px, x 1040 to 1740, y 200), with a hand-drawn "≠" between them
  (x 950).
- On "estimates" (75.5): left card: a noisy little bar chart (ragged bars) with a pencil arrow pointing to a
  cleaner estimated chart drawn in dotted ink; under it "a better estimate, after the run" (40 px). Ink.
- On "results" (77.63): a small "after the run" clock tick on the left card.
- On "protecting" (78.85): right card: one qubit dot in the middle and a gold shield outline drawn around it; under
  it "protects the qubit, during the run" (40 px).
- On "extra" (81.04): eight smaller helper dots draw in a ring around the qubit inside the shield, and "many extra
  qubits" writes (40 px, ink). The shield is the one gold thing.
- Leaves: all blur at `cue(14, "every", 0, -0.15)` ("qubits." is heard at 81.33, in line 14's word list).

### Line 14 (81.72 to 86.26, plus the 2.6 s hold) "Every gate adds a little noise: the arrow shrinks, and results drift toward random."
- On "every gate" (81.82): the ball returns smaller at left (centre x 520, y 470, radius 220) with the gold arrow full,
  and a wire under it (y 790, x 220 to 820) where small gate boxes slide in one by one (one every 0.5 s, onFrame),
  each tick shrinking the arrow by a step, and keep doing so slowly through the hold (never fully reaching 0).
- On "noise" (83.24): at right, the takeaway writes: "Every gate adds a little noise." (64 px, x 980 to 1760, y 300).
- On "shrinks" (84.23): "length × (1 − λ) per gate" writes under it (56 px, with "(1 − λ)" gold), y 430.
- On "random" (85.84): the two readout bars at right (y 560 and 640, x 1000 to 1700) drift toward 50/50 with the arrow,
  and "→ random" writes after them (48 px). Everything stays through the hold.

## Caption phrase pairs (add in scene.mjs; longer first)
```js
export const phrases = [
  ["one minus lambda", "1 − λ"],
  ["lambda", "λ"],
  ["one percent", "1%"],
  ["ninety percent", "90%"],
  ["one time in twenty", "1 in 20"],
  ["one time in three", "1 in 3"],
  ["forty seven", "47"],
];
```
("fifty fifty" is built in. The minus sign is U+2212, not a dash.)

## Respellings
- None needed: the transcriber heard every word. "fifty fifty", "one percent", "forty seven" were heard as digits
  ("50-50", "forty-seven"), which is fine. Some last words drift into the next line's word list ("zero" into line 1,
  "why" into line 2, "mush" into line 4, "noise" into line 5, "three" into line 11, "qubits" into line 14), so cue
  them on the line where they were heard. "centre" was transcribed as "center", "circuit's" as "circuit" and
  "Careful" as "Careful,"; check `lines[i].words` for the exact token before cueing.
