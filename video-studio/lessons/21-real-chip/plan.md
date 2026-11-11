# Lesson 21, Running on a real chip: beat plan

Voiced with bf_emma: 18 lines, 258 words, narration ends at 81.00 s, film about 83.6 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json` and are only a guide: always cue with `cue(line, "word")`.

Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Ink #e8e8e8, gold #d9b463 on #17191c.
Gold rule: one gold thing at a time. Here it is almost always the **travelling state** (the gold guest, the gold
token "A") or the number that matters right now (7 CNOTs, the noise bar).

## Physics the pictures must keep (checked)
- A two-qubit gate (CNOT) can only run between qubits joined by a wire in the coupling map. Never draw a CNOT
  link between two qubits that have no wire between them.
- Four qubits in a line q0 - q1 - q2 - q3, CNOT from q0 to q3. Distance 3, so **two SWAPs** are needed:
  SWAP(q0,q1) moves state A to q1, SWAP(q1,q2) moves it to q2, which is beside q3. Then CNOT(q2, q3) runs.
  The token that was in q1 ends in q0, the token that was in q2 ends in q1 (they shift back one each). Show that.
- A SWAP is three CNOTs: CNOT(1,2) CNOT(2,1) CNOT(1,2), the middle one pointing the other way.
  Total = 2 x 3 + 1 = **7** CNOTs. Never show 6 or 9.
- A SWAP moves the **states**, not the physical qubits: the circles stay put, only the tokens inside move.
- Noise: each CNOT adds a small chance of error. Show it qualitatively (a taller bar, more specks); do not print
  error percentages, since none are said.
- Misconception (line 15): the rewritten circuit computes the same thing. Its ideal result is the same; draw two
  identical ideal result bars with "=" between them, and put the extra noise only on the right one as faint
  specks, not as a different answer.
- After the swaps, state A lives on physical q2. The transpiler keeps track of that, so results are read from the
  right qubits; nothing on screen should suggest the answer got scrambled.
- Draw CNOT symbols (dot and ⊕) and SWAP symbols as SVG strokes, not as label text.
- The chip shortcut: on a chip there is no "shout". Never draw a link jumping over qubits that ends in a gate.

## Recurring objects
- `b-table`: a long dinner table seen from the front, x 220 to 1700, tabletop y 560 to 600 with two legs,
  a cloth fringe line; five seated guests behind it (stick figures, round heads r 34) at x 360, 670, 960, 1250, 1560,
  heads at y 430. Guest 1 (far left) is gold (the one who wants to talk); the rest ink. A cup on the table in
  front of each guest (small trapezoid, 40 px).
- `b-chip`: a microchip: a rounded rectangle x 560 to 1360, y 280 to 800,
  short pin ticks on all four sides (12 per side, 30 px long), so it reads as "a chip" at a glance. Inside, eight
  qubit circles (r 38) in two rows of four at x 700, 880, 1040, 1220 and y 420, 660. Wires (`b-wires`): along each
  row, plus two rungs (x 700 and x 1220) between the rows. No diagonals. Label "qubit" with a small ink arrow to
  one circle on its first appearance.
- `b-row`: four qubit circles in a line (r 52) at x 380, 760, 1140, 1520, y 380, labels "q0" to "q3" under them
  (44 px, y 470), wires between them. Tokens inside: `b-tA` gold disc with "A" (the state that must travel),
  `b-tB` ink disc "B" in q1, `b-tC` ink disc "C" in q2, `b-tD` ink disc "D" in q3. Tokens are divs moved with `move()`.
- `b-strip`: a small circuit strip under the row, y 600 to 800, x 260 to 1660: four horizontal wires
  (y 620, 680, 740, 800), where gates appear as they are spent: SWAP symbols (two small x's joined by a line)
  and the CNOT symbol (control dot plus ⊕ circle). A counter at the right end, "CNOTs: 1" (56 px, x 1500 to 1760).

## Beats

### Line 0 (0.40 to 4.13) "Your circuit is ready. Now let's run it on a real quantum chip."
- Kit title block until at least 2.9 s; `blurOut("#b-title", cue(0, "real", 0, -0.1))` (about 2.85 s).
- On "circuit" (0.45): a small circuit sketch draws at left centre (x 300 to 820, y 420 to 640): two wires, an H box,
  a CNOT (dot and ⊕) and a meter. Ink. Label "your circuit" (48 px) under it.
- On "run" (2.32): a hand arrow draws from the circuit to the right (x 860 to 1060, y 530).
- On "chip" (3.79): the microchip outline with its pins draws at right (x 1100 to 1600, y 330 to 730, 1.0 s); a gold
  spark (three short rays) at its top right corner. The spark is the gold thing.
- Leaves: circuit sketch, arrow and spark blur at `cue(1, "catch")`; the small chip shrinks away with them.

### Line 1 (4.43 to 8.29) "Here's the catch: on a chip, not every qubit is wired to every other."
- On "chip" (5.65): `b-chip` (big, centred) draws its outline and pins (1.0 s), then the eight qubit circles pop in
  one after another (0.06 s apart). A "qubit" pointer label writes on the first circle.
- On "wired" (7.03): `b-wires` draw along rows and rungs (1.0 s), ink.
- On "other" (7.96): a dotted ink line tries to join the top-left qubit to the bottom-right one, then a quick ink
  cross on its middle (there is no wire there). Fades at line 2 start.
- Leaves: the whole chip blurs at line 2 start (it comes back in line 4).

### Line 2 (8.59 to 12.33) "Picture a long dinner table where guests can only chat with their neighbours."
- On "dinner" (9.07): `b-table` draws (1.4 s): tabletop, legs, cups.
- On "guests" (10.29): the five guests draw one after another, 0.12 s apart, guest 1 gold.
- On "chat" (10.89): small speech bubbles with "..." pop between each neighbouring pair (four bubbles, ink).
- On "neighbours" (cue "neighbo", 11.76): a short ink double arrow under each neighbouring pair, under the table,
  label "neighbours" (48 px, x 960, y 680).

### Line 3 (12.63 to 16.64) "To reach the far end, guests swap seats, and each swap risks a spilled drink."
- "To" was heard at the end of line 2 (12.36); start on `cue(3, "reach", 0, -0.2)`.
- Bubbles fade. On "far" (13.07): a gold dotted arc from guest 1 to guest 5 with a "?" over guest 5 (gold).
- On "swap" (13.91): guests 1 and 2 trade places: guest 1 slides right to x 670 while guest 2 slides left to
  x 360 (0.9 s, power2.inOut), with two small curved arrows. The arc's start follows guest 1 (or redraw it).
- On "swap" (2nd, 15.03): guest 1 trades again with guest 3 (to x 960).
- On "spilled" (15.73): the cup in front of x 670 tips over and a hand-drawn splash with three drops draws (ink).
  Label "every swap: risk" (44 px) under the splash on "drink" (16.23).
- Leaves: table, guests and arc blur at `cue(4, "chip", 0, -0.2)`; the chip arrives on a clean board.

### Line 4 (16.94 to 21.70) "A chip is the same: wires join only neighbours, in a pattern called the coupling map."
- "A" was heard at the end of line 3 (16.68). On "chip" (17.13): `b-chip` comes back (rewrite and redraw, 0.8 s).
- On "wires" (17.97): `b-wires` redraw, and each wire flashes once in order (opacity pulse), so the eye follows them.
- On "neighbours" (cue "neighbo", 19.19): a small ink bracket around one neighbouring pair with "neighbours" (44 px).
- On "coupling" (20.75): the bracket fades; a gold heading "coupling map" writes above the chip (72 px, centred
  x 960, y 190, inside the area freed by the title block), and the wires turn gold for 1 s then back to ink.

### Line 5 (22.00 to 25.56) "A gate on two qubits, like C NOT, only works along a wire."
- "A" was heard at the end of line 4 (21.76). On "gate" (22.21): two neighbouring qubits on the top row
  (x 700 and 880) light gold.
- On "CNOT" (23.76): a CNOT symbol draws on the wire between them: control dot on the left circle side, ⊕ on the
  right (gold), with the label "CNOT" above (56 px).
- On "wire" (25.28): a small gold tick beside the label.
- Leaves: gold highlight back to ink at line 6 start; the CNOT symbol blurs.

### Line 6 (25.86 to 29.29) "What if your circuit needs a C NOT between qubits that aren't neighbours?"
- On "circuit" (26.22): top-left qubit (700, 420) and bottom-right qubit (1220, 660) light gold.
- On "CNOT" (27.03): a dotted ink line between them with a CNOT symbol at its middle, drawn faint.
- On "neighbours" (cue "neighbo", 28.71): a big ink "?" writes beside it (80 px). No cross yet: it is a question.
- Leaves: the whole chip blurs at `cue(7, "kiss")` (29.36), before anything of line 7 draws, so two scenes never stack.

### Line 7 (29.59 to 33.52) "Kiss kit's transpiler, which fits your circuit to the chip, adds swap gates."
- At `cue(7, "kiss", 0, 0.25)` (just after the chip has blurred): the little circuit from line 0 redraws at left (x 180 to 560, y 380 to 600).
- On "transpiler" (29.88): a machine box draws in the middle (x 760 to 1160, y 340 to 640) with a hand-drawn gear
  inside, label "transpiler" (56 px) above it; an arrow from the circuit into it.
- On "fits" (30.84): the gear turns (onFrame rotation) until the end of the line.
- On "chip" (32.13): a small chip icon draws on the machine's lower edge.
- On "add" (cue "add", 32.44; the word "adds" is heard as "add"), with the gold SWAPs landing on "swap" (32.89): out of the right side, an arrow and a longer circuit (x 1240 to 1760, y 380 to 600) with two
  gold SWAP symbols (x-line-x) before the CNOT. Label "SWAP" under the first (48 px, gold).
- Leaves: everything blurs at `cue(8, "swap", 0, -0.25)` (about 33.41), so the line 8 circles arrive on a clean board.

### Line 8 (33.82 to 39.30) "A swap trades the states of two neighbours, like guests trading seats. Adding them is called routing."
- On "swap" (33.66): two qubit circles draw centred (x 700 and 1220, y 420, r 70) joined by a wire, a SWAP symbol on
  the wire. Gold token "A" in the left, ink token "B" in the right.
- On "trades" (33.91): the tokens trade places along two curved arrows (1.0 s, power2.inOut): A goes right over the
  top, B goes left under. The circles stay put.
- On "states" (34.48): a small ink label "states move, qubits stay" (44 px, x 960, y 560).
- On "guests" (35.99): in the lower part (x 760 to 1160, y 620 to 800) a tiny two-seat sketch of the table with two
  stick guests trading places (mirrors the tokens). Ink, guest gold.
- On "routing" (38.81): the word "routing" writes big (80 px, gold, x 960, y 200).
- Leaves: all blur at line 9 start.

### Line 9 (39.60 to 43.08) "Take four qubits in a row, and a C NOT from first to last."
- On "four" (39.74): `b-row` draws: four circles, wires, q0 to q3 labels (1.0 s). Tokens A (gold), B, C, D pop in.
- On "CNOT" (41.52): a dotted ink arc from q0 over q1 and q2 to q3, with a faint CNOT symbol at its top and the
  label "needed" (44 px).
- On "last" (42.54): the arc gets a small ink cross at its middle, "no wire" (40 px). The cross stays faint till line 10.
- `b-strip` wires draw quietly on "row" (40.85), with "q0" to "q3" at their left (40 px).

### Line 10 (43.38 to 47.43) "Two swaps walk the first state next to the last. Then the C NOT runs."
- "Two" was heard at the end of line 9 (42.72): start the first swap on `cue(9, "two")`.
- Swap 1 (cue(9, "two") to +0.9 s): A moves q0 to q1, B moves q1 to q0 (curved arrows). A SWAP symbol draws on the
  strip between wires q0 and q1 (gold, then ink once done).
- Swap 2 on "walk" (43.42): A moves q1 to q2, C moves q2 to q1. A second SWAP symbol on the strip (q1 to q2).
- On "next" (44.67): a short gold bracket under q2 and q3: "neighbours now" (44 px).
- On "CNOT" (46.59): the CNOT draws on the wire between q2 and q3 (dot on q2, ⊕ on q3, gold), and its symbol draws
  on the strip after the swaps. The dotted arc and cross from line 9 fade.
- Counter at strip right writes "2 SWAPs + 1 CNOT" (48 px).

### Line 11 (47.73 to 51.34) "But each swap costs three C NOTs, so one gate has become seven."
- "But" was heard at the end of line 10 (47.29).
- On "swap" (47.95): the first SWAP on the strip glows; on "three" (48.8) it opens out into three CNOT symbols
  (the middle one pointing the other way), 0.8 s; the second SWAP opens the same way 0.3 s later. The strip now holds
  seven CNOT symbols in a row.
- On "one" (49.83): counter rewrites "1 CNOT"; on "seven" (51.02) an arrow and a gold "7 CNOTs" (72 px) after it.
- Leaves: row and tokens blur at `cue(11, "seven", 0, 0.45)` (about 51.47); at the same moment the strip (with its seven CNOTs and
  counter) slides up to y 260 to 460 (0.6 s) and stays. The line 12 specks are children of the strip, so they ride along.

### Line 12 (51.64 to 56.67) "Every C NOT adds a small chance of error, called noise, so more gates mean a noisier answer."
- On "CNOT" (51.76): a little ink speck cloud (three dots) appears beside each of the seven CNOTs in turn
  (0.12 s apart).
- On "error" (53.46): below, two bars on a baseline (y 780), x 700 and 1220, width 160, header "chance of error"
  (48 px, x 960, y 520). Bar heights at most 190 px (tops no higher than y 590, clear of the header); bar labels
  under the baseline at y 800 to 845, inside the safe area. Left bar "1 CNOT" rises a little (onFrame); label under it.
- On "noise" (54.25): the word "noise" writes beside the header (gold).
- On "more" (54.73): right bar "7 CNOTs" rises in seven steps (onFrame with sched, 1.2 s), gold, much taller.
- On "noisier" (55.77): over the right bar a small results chart wobbles (three thin bars jittering) to show a fuzzier
  answer. Keep moving to the end of the line.
- Leaves: all blur at line 13 start.

### Line 13 (56.97 to 60.81) "Here's where the dinner table breaks down: a guest could always just shout."
- On "dinner" (57.65): the table returns (smaller, y 360 to 640), guests in their original seats, guest 1 gold.
- On "breaks" (58.68): a hand-drawn ink zigzag crack draws across the table's top edge (0.4 s).
- On "just" (60.17): guest 1's mouth opens and three gold sound arcs fly across to guest 5 (0.4 s); on "shout" (60.44)
  a "HEY!" (64 px) writes over them and guest 5 turns with a small ink tick.
- Leaves: table blurs at `cue(14, "chip", 0, -0.2)` (about 60.71), so it is gone before the row draws on "chip".

### Line 14 (61.11 to 66.66) "A chip has no shortcut. Distant qubits can't interact until their states sit side by side."
- "A" was heard at the end of line 13 (60.84). On "chip" (60.91): `b-row` returns with A in q0 and D in q3.
- On "shortcut" (61.6): a gold sound arc tries to jump from q0 to q3 and is crossed out with a big ink cross;
  label "no shortcut" (56 px).
- On "interact" (63.6): the cross and arc fade.
- On "states" (64.85): A slides q0 to q1 to q2 (two quick swaps, B and C shifting back), 1.2 s.
- On "side" (65.55): a gold bracket joins q2 and q3, then the CNOT draws between them on "side" (2nd, 66.22).
- Leaves: blur at line 15 start.

### Line 15 (66.96 to 71.84) "The rewritten circuit may look different, but it computes the same thing. Only the noise grows."
- "The" was heard at the end of line 14 (66.68). On "rewritten" (67.13): two circuits side by side, y 200 to 420:
  left "before" (an H on q0, then 1 CNOT from q0 to q3), right "after" (the same H, 2 SWAPs, then the CNOT
  between q2 and q3), labels 48 px. Both put q0 and q3 into the same pair state: they read both 0 or both 1, half the
  time each.
- On "different" (68.13): a small ink "?" between the two circuits that fades as the next beat lands.
- On "computes" (68.91): under each circuit, an ideal result chart draws: two bars, "both 0" and "both 1"
  (40 px labels), each at half height, identical on both sides, with "=" between them and "same answer" (56 px, gold). Both charts use the
  same values.
- On "noise" (70.74): faint ink specks drift over the right chart only (onFrame jitter), label "+ noise" (44 px).
- Leaves: blur at `cue(16, "think", 0, -0.3)` (about 71.75), before the chip returns on "think".

### Line 16 (72.14 to 76.41) "So think like the chip: keep qubits that work together close, and circuits short."
- "So" was heard at the end of line 15 (71.64). On "think" (72.05): the eight-qubit chip returns, smaller
  (x 300 to 900, y 260 to 700).
- On "together" (74.53): two tokens that need a CNOT are placed on two neighbouring qubits; they glow gold with a
  small CNOT on their wire and a tick. Label "close" (56 px).
- On "circuits" (75.56): at right (x 1080 to 1740) a short circuit strip (three gates) draws next to a ruler; on
  "short" (76.08) the label "short" (56 px, gold) writes and the tokens go back to ink, so gold sits on the label only.
- Leaves: blur at line 17 start.

### Line 17 (76.71 to 81.00, then the 2.6 s hold) "Chips connect only neighbours, routing adds swaps, and every swap adds noise."
Closing card, three parts, stays to the end:
- On "connect" (76.89): left, a row of four small qubit circles with wires (x 200 to 640, y 360), label
  "neighbours only" (48 px) under it.
- On "routing" (78.41): centre, the course's equation as a circuit picture (x 720 to 1500, y 260 to 480):
  a SWAP symbol, then "=" then three CNOTs on two wires, the middle one upside down. Label "SWAP = 3 CNOTs" (72 px)
  under it.
- On "noise" (80.44): right, a small gold noise bar with specks (x 1560 to 1740, y 260 to 480), label "+ noise".
- Below, centred, the takeaway in 64 px on two lines (one line would be far wider than the safe area):
  "Chips connect only neighbours;" at y 680 and "routing adds SWAPs, and every SWAP adds noise." at y 760, written
  in with the voice, with a gold underline under "every SWAP adds noise" on "every" (79.54). The noise bar at right goes
  ink while the underline is gold, so one gold thing at a time.
- Hold: the specks on the noise bar keep jittering gently, so the last frames are not static.

## Captions
Phrase pairs to add in scene.mjs (built-in `C NOT -> CNOT` already covers the singular):
```js
export const phrases = [["Kiss kit's", "Qiskit's"], ["C NOTs", "CNOTs"]];
```
Respellings for the voice: "Qiskit's" is written "Kiss kit's" (heard cleanly as "kiss kits").

## Cue notes (from the transcript)
- The transcript writes "neighbors" for "neighbours": cue `"neighbo"` (prefix match), not "neighbours".
- "C NOT" is heard as one word "CNOT": cue `"CNOT"`. "C NOTs" is heard as "CNOT".
- "adds" in lines 7 and 17 was heard as "add"; "states" in line 14 as "state": cue "add" / "state".
- Words heard in the line before: "To" (line 3) in line 2; "A" (line 4) in line 3; "A" (line 5) in line 4;
  "a" (line 8) in line 7; "two" (line 10) in line 9; "but" (line 11) in line 10; "a" (line 14) in line 13;
  "the" (line 15) in line 14; "so" (line 16) in line 15. Several first words also start up to 0.4 s before their line's
  `start` (for example "picture" 8.17, "what" 25.6, "kiss" 29.36): cue the word, not the line start.
