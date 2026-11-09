# Lesson 17, Grover search: beat plan

Voiced with bf_emma: 18 lines, 259 words, narration ends at 84.32 s, film about 86.9 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json`; always cue with `cue(line, "word")`, never hard numbers.

Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Ink #e8e8e8, gold #d9b463 on #17191c.
Gold rule: one gold thing at a time, the thing that matters right now (almost always the prize box, its bar, or its chance).

## Physics the pictures must keep (checked)
- Four boxes are labelled by two qubits: 00, 01, 10, 11. The prize is **11** (as in the lesson's worked example).
- After H on both qubits every amplitude is +1/2, every chance (1/2)^2 = 1/4 = 25%.
- The oracle multiplies only the prize's amplitude by minus one: 11 goes to -1/2. Every chance is still 25%
  (the quiz answer: "the same uniform odds as before"). The bars change; the chance row must NOT change.
- The diffuser maps each amplitude a to 2m - a, with m the average. After the oracle, m = (1/2 + 1/2 + 1/2 - 1/2)/4 = 1/4.
  The three others: 1/2 is 1/4 above m, so they go to 1/4 below m = 0. The prize: -1/2 is 3/4 below m, so it goes to
  3/4 above m = 1. Final amplitudes (0, 0, 0, 1), chances (0, 0, 0, 100%). Sum of chances stays 100% at every step.
- Many boxes (lines 12 to 13) use N = 16 so the numbers are real. Start angle t = asin(1/4) = 14.48 degrees.
  After k rounds the prize amplitude is sin((2k+1)t), each other box cos((2k+1)t)/sqrt(15).
  Prize chance by round: k0 6%, k1 47%, k2 91%, k3 96%, k4 58%, k5 13%. Best is k = 3 = round((pi/4) x 4).
  Only show these values; never show a chance above 100% or a total other than 100%.
- The swing is only an analogy: never show the boxes' total growing. In lines 14 and 15 the total stays at 1 (100%).
- Never draw or say that it "opens every box at once" except in line 16, where it is crossed out.

## Recurring objects
- `b-boxes`: four sealed boxes (hand-drawn crates with a lid line and a ribbon cross), 200 x 180 each,
  centres x 480, 780, 1080, 1380, y 440 to 620. Box 4 (named 11) is the prize box.
- `b-helper`: a small stick figure with a pencil, x 1560 to 1740, y 400 to 660 (lines 1 only).
- `b-swing`: an A-frame swing set, top bar y 200 from x 700 to 1220, posts down to y 800; pivot (960, 210),
  rope 420 px to a seat with a small stick child. `b-swingGrp` is rotated about the pivot by `onFrame`;
  `b-arc` a dotted gold arc that marks the highest point reached so far.
- Circuit strip (lines 4 to 11), top of board, y 110 to 250: two wires (y 150 and y 220) from x 180 to 1700,
  `|0⟩` labels at x 150 (44 px; keep their left edge at x >= 140); `b-cH` two H boxes at x 300; `b-cO` an "oracle"
  box spanning both wires at x 480 to 680; `b-cD` a "diffuser" box at x 780 to 1010; `b-cM` a little eye at x 1120.
  The step that is running is gold; the others ink.
- Amplitude chart (lines 3 to 11): baseline `b-base` y 560 from x 420 to 1560; columns centred x 560, 840, 1120, 1400;
  bar width 130; scale 280 px per unit amplitude (+1 reaches y 280, -1/2 reaches y 700). Left header "amplitude"
  (x 150 to 400, y 400, 44 px). Bars `b-bar0..3` are rects whose top/bottom are driven by `onFrame` from `sched()`.
  Value labels above or below each bar (48 px). Mini boxes under the axis with "00 01 10 11" (48 px) at y 740;
  chance row `b-ch0..3` "25%" (44 px) at y 805, header "chance" at x 150, y 805.
- `b-avg`: dashed gold line at amplitude 1/4 (y 490), x 420 to 1560, label "average ¼" at its right end above it.


## Beats

### Line 0 (0.40 to 4.52) "Four sealed boxes, one hides a prize. Can we find it in one look?"
- Kit title block shows until at least 2.9 s; `blurOut("#b-title", cue(0, "prize", 0, 0.5))` (about 2.85 s, keep >= 2.5 s).
- On "Four" (0.36): `b-boxes` draw one after another, 0.25 s apart (each 0.8 s), so all four are there by "hides".
- On "prize" (2.34): a gold "1 prize" tag writes under the row (x 960, y 690, 56 px). No star in any box yet:
  nothing should single out box 4 before the helper marks it.
- On "one look" (3.94): a hand-drawn eye draws above the row (x 960, y 330, 120 px wide) with a single dotted
  arrow down toward the row; "1 look" writes beside it (48 px). Eye is ink; "1 look" gold (the goal).
- Leaves: eye and "1 look" blur at line 1 start; the boxes stay.

### Line 1 (4.82 to 8.06) "A helper knows which, and won't tell, but will quietly mark it."
- On "helper" (4.61): `b-helper` draws at right (1 s).
- On "won't tell" (5.97): a small speech bubble by the helper's head writes "shh" (44 px, ink).
- On "mark" (7.64): a pencil arrow from the helper to box 4 draws, and a small gold mark (a hand tick, drawn as a rough
  path, about 50 px) appears on box 4's lid. That gold tick is the one gold thing.
- Leaves: boxes, helper, bubble blur at `cue(2, "Grover", 0, -0.1)`.

### Line 2 (8.36 to 12.35) "Grover search can, and it's like pushing a swing: each push lifts it higher."
- On "Grover" (8.36): heading "Grover search" writes at top left (x 192, y 110, 64 px, ink).
- On "pushing" (10.13): `b-swing` draws (1.2 s), centred. The seat hangs still.
- On "push" (11.27): an ink hand arrow nudges the seat; `onFrame` swings it with a small angle (12 degrees).
- On "higher" (11.95): second push; the angle grows to 28 degrees; `b-arc` (gold dotted) traces the higher end of
  the swing's path. Keep it swinging into line 3 until it blurs.
- Leaves: heading and swing blur at line 3 start (12.65). The swing returns in line 12.

### Line 3 (12.65 to 17.00) "Each box gets an amplitude, a number whose square is its chance of showing up."
- On "box" (12.9): the four mini boxes draw under the axis line, still unlabelled.
- On "amplitude" (13.42): `b-base` draws and the header "amplitude" writes at left. Bar 0 alone rises to +1/2
  (onFrame, 0.8 s), ink, with "½" above it.
- On "square" (15.02): beside bar 0, a hatched gold square draws whose side equals the bar's height, with the label
  "½ × ½ = ¼" (48 px) above it.
- On "chance" (15.77): an ink arrow from the square down to the chance row, where "25%" writes under box 1 and
  the header "chance" writes at left. The square fades out at line 4 start.

### Line 4 (17.30 to 21.99) "Two qubits, quantum bits, name the boxes; an H gate on each spreads them evenly."
- On "qubits" (17.4; "Two" was heard at the end of line 3, so cue `cue(4, "qubits", 0, -0.3)`): the circuit strip's
  two wires draw at top, each with `|0⟩` at its left. Under "quantum bits" (17.72) a small ink note "qubit = quantum bit"
  writes at the right end of the strip (40 px, x 1300 to 1700, y 270), fading at line 5 start.
- On "name" (18.6): "00 01 10 11" write on the mini boxes, left to right (two qubits, four names).
- On "gate" (20.29; "an H" was heard as "each", so cue "gate"): `b-cH` both H boxes draw, gold for this step.
- On "spreads" (20.81): on the chart, bars 1 to 3 rise to +1/2 to match bar 0 (onFrame, 0.9 s), so all four columns
  are level: the "evenly" is the picture.

### Line 5 (22.29 to 25.90) "Every box gets amplitude one half: a one in four chance."
- On "amplitude" (23.06): the values "½" write above bars 1 to 3, left to right; bar 0's "½" pulses with them.
- On "four" (25.1): "25%" writes under 01, 10, 11. H boxes return to ink.

### Line 6 (26.20 to 31.06) "Now the helper, the oracle, flips the sign of the prize's amplitude to minus one half."
- On "oracle" (27.06): `b-cO` draws on the circuit, gold, with the label "oracle" inside (40 px). A tiny helper
  head sits on its top edge (callback to line 1), ink.
- On "sign" (28.14): a gold "+ → −" writes small under the oracle box (40 px).
- On "prize" (29.02): bar 3 (box 11) swings down through the baseline to -1/2 (onFrame, 0.9 s, power2.inOut), and
  turns gold; its "½" label fades and "−½" writes below the bar (gold) on "minus" (29.81). Draw the minus sign as a
  short stroke if the font lacks it.
- Oracle box returns to ink at line 7 start.

### Line 7 (31.36 to 34.33) "Squared, that's still a quarter, so the odds haven't changed."
- "Squared" was heard at the end of line 6 (30.92), so cue it as `cue(6, "squared")`.
- On "squared": at right of bar 3 (x 1490 to 1770, y 640, 48 px) "(−½)² = ¼" writes, gold.
- On "odds" (32.71): the whole chance row pulses (scale 1.12 and back, 0.4 s); "25%" under 11 flashes gold.
  On "changed" (33.31) an ink label "same odds" writes at the right end of the chance row (x 1490, y 805, 44 px).
- Leaves: "(−½)² = ¼", "+ → −" and "same odds" blur at line 8 start.

### Line 8 (34.63 to 39.22) "Next, the diffuser reflects every amplitude around their average, now one quarter."
- "Next" (33.92) was heard at the end of line 7; the diffuser box starts on "diffuser" (34.46).
- On "diffuser": `b-cD` draws on the circuit with "diffuser" inside, gold.
- On "reflects" (35.0): a small mirror icon (a vertical line with two curved flip arrows) draws beside the diffuser box.
- On "average" (37.38): `b-avg` draws left to right (0.8 s), gold dashed; "average ¼" writes at its right end.
  On "quarter" (38.35): a short ink sum writes just above the line at left: "(½ + ½ + ½ − ½) ÷ 4 = ¼" (40 px,
  x 430 to 1000, y 455). It fades at line 9 start.
- From here the average line is the gold thing; the prize bar goes back to ink until line 10.

### Line 9 (39.52 to 43.57) "The other three sit a quarter above it, so they land a quarter below, at zero."
- On "three" (39.46): bars 0 to 2 brighten (ink, full opacity), the prize bar dims to 0.5.
- On "above" (40.37): small double arrows between each bar top (y 420) and the average line (y 490), with "¼" by the
  first one (40 px).
- On "land" (41.27): bars 0 to 2 mirror across the average line: their tops slide from y 420 down to y 560 (height 0),
  0.9 s; faint dashed ghosts of their old tops remain for 1 s; matching double arrows below the line show the same ¼.
  Values become "0".
- On "zero" (42.42): their chance labels change to "0%".
- Leaves: the ¼ arrows and ghosts fade at line 10 start.

### Line 10 (43.87 to 47.77) "The prize sits three quarters below, so it's flung three quarters above, to one."
- "The prize sits" was heard at the end of line 9 (42.92 to 43.5): start the prize's beat there, `cue(9, "prize")`.
- Prize bar back to full gold. On "prize": a gold bracket from its bottom (y 700) up to the average (y 490), label "¾".
- On "flung" (45.59): the bar flips up across the line, from -1/2 to +1 (top at y 280), 1.0 s, a slight overshoot ease;
  the bracket is redrawn above the line from y 490 to y 280 with "¾". "−½" fades; "1" writes above the bar.
- On "one" (47.62): its chance becomes "100%", gold.

### Line 11 (48.07 to 54.02) "That's interference: amplitudes combine, the prize grows, the rest cancel, and one look always finds it."
- On "interference" (48.46): the word "interference" writes across the top at y 300 under the circuit (x 960, 64 px, ink).
- On "combine" (49.6): two tiny ink "+" signs pop between the oracle and diffuser boxes on the circuit (the two steps
  adding up), fading after 1 s.
- On "grows" (50.74): a gold up arrow beside bar 3. On "cancel" (52.02): the three empty columns get a soft ink
  "0" circle each.
- On "look" (52.49): the circuit's eye `b-cM` draws and glows gold; on "finds" (53.17) the mini box 11's lid flips open
  and a gold star pops out of it.
- Leaves: the whole chart, circuit and labels blur at line 12 start.

### Line 12 (54.32 to 57.87) "With sixteen boxes, we repeat both steps, one push per round."
- Left (x 160 to 760): the swing comes back, smaller (scale 0.6), pivot at (460, 200), still.
- On "sixteen" (54.46): right panel (x 840 to 1740, y 240 to 760): sixteen thin amplitude bars on a baseline at y 620,
  the twelfth bar (gold) is the prize, all at the start height 1/4 (scale 380 px per unit, so 95 px).
  A counter "16 boxes" writes at the top of the panel (48 px).
- On "repeat" (55.34): a small loop arrow labelled "oracle + diffuser" draws above the bars (40 px).
- On "push" (57.02): round 1. The swing gets one push (angle rises), and the bars move to their k = 1 values; the
  prize's chance label (above its bar, gold) reads "47%". A "round 1" counter writes at left under the swing.

### Line 13 (58.17 to 64.39) "For N boxes, the sweet spot is about pi over four root N rounds, three here. Push longer and it swings back."
- Round 2 at line 13 start (91%), round 3 on "sweet" (58.84, 96%). Swing angle tracks the prize's chance each time
  (max angle = 45 degrees x chance). Counter reads "round 3". On "sweet" a gold "sweet spot" tag points at the prize bar.
- On "pi" (60.14): under the bars write the gold formula "rounds ≈ (π/4)√N" (72 px, x 960 to 1700, y 700 to 800).
- On "three" (61.92): a small ink note "N = 16: about 3" (40 px) under it.
- On "Push" (62.28): round 4, the prize falls to 58%; on "swings" (62.97): round 5, 13%. The swing's arc shrinks in step.
  The "sweet spot" tag stays on round 3's mark (a faint gold dot at the 96% level).
- Leaves: bars, counter and formula blur at line 14 start. The swing stays.

### Line 14 (64.69 to 69.35) "But a real swing gains energy, and this never does: the chances always add to one."
- "But a real" was heard at the end of line 13 (63.92): the swing slides to centre left (x 300 to 800) on
  `cue(13, "But")` and swings big; on "energy" (65.14) an ink label "energy grows" with an up arrow writes beside it.
- On "never" (66.02): at right (x 1100 to 1500, y 220 to 760) a tall stacked column draws: a fixed outline with a
  dashed top line labelled "total = 1" (48 px). Inside, sixteen slices: one gold (the prize, 6%) and fifteen ink.
- On "always" (67.67): the "total = 1" label turns gold and underlines; "(100%)" writes after it on "one" (68.45).

### Line 15 (69.65 to 72.59) "The prize only grows because every other box shrinks."
- "The prize" was heard at the end of line 14 (68.92). On "grows" (69.67): the gold slice grows from 6% to 96%
  (onFrame, 1.4 s) while the fifteen ink slices squeeze thinner; the column's outline and its dashed top never move.
- On "shrinks" (71.23): small ink down arrows on the ink slices.
- Leaves: swing and column blur at line 16 start.

### Line 16 (72.89 to 78.22) "It never opens every box at once. It reshapes amplitudes so one look is likely right."
- "It never" was heard at the end of line 15 (71.92). On "opens" (72.63): the four boxes from line 0 redraw small
  (centre, y 300 to 440) with all four lids popping open at once; on "once" (74.16) a big ink cross strikes the row,
  and the label "not this" writes (44 px).
- On "reshapes" (75.31): the row blurs; below it four amplitude bars draw at ½ each and morph to (0, 0, 0, 1),
  1.2 s, the last one gold.
- On "look" (76.55): the eye draws above bar 4; on "likely" (76.97) a gold tick by the eye.
- Leaves: everything blurs at line 17 start.

### Line 17 (78.52 to 84.32, then the 2.6 s hold) "So mark the answer with a sign, reflect around the average, and repeat about pi over four root N times."
- "So mark" was heard at the end of line 16 (77.92). Closing card, stays to the end:
  - Circuit (y 160 to 460, x 180 to 1740): two wires with `|0⟩`, the two H boxes, an "oracle" box, a "diffuser"
    box, and the eye. Wires and H draw at `cue(16, "So")`.
  - On "mark" (78.05): the oracle box draws, with "flip the sign" (40 px) under it; on "sign" (79.25) a gold "−"
    pops inside it.
  - On "reflect" (79.65): the diffuser box draws with "reflect about the average" (40 px) under it.
  - On "repeat" (81.52): a bracket around oracle + diffuser draws with a loop arrow, gold, labelled "repeat".
  - On "pi" (82.29): the formula "rounds ≈ (π/4)√N" writes, 110 px, centred at y 640, then a gold underline.
  - Hold: the loop arrow keeps circling gently (onFrame rotation of a small arrow head round the bracket),
    so the last frames are not static.

## Cue notes (from the transcript)
- Words that land in a neighbour's list: "A" (line 1) in line 0, "Two" (line 4) in line 3, "Now" (line 6) in line 5,
  "Squared" (line 7) in line 6, "Next the" (line 8) in line 7, "The other" (line 9) in line 8, "The prize sits"
  (line 10) in line 9, "But a real" (line 14) in line 13, "The prize" (line 15) in line 14, "It never" (line 16) in
  line 15, "So mark" (line 17) in line 16. Cue those words in the line where they were heard.
- "an H" in line 4 was heard as "each"; cue "gate". "prize's" in line 6 was heard as "prize".
- "N" is heard as lower case "n": `cue(13, "n")`, `cue(17, "n")`.

## Captions: phrase pairs for scene.mjs
```js
export const phrases = [
  ["pi over four root N", "(π/4)√N"],
  ["minus one half", "−½"],
  ["one half", "½"],
  ["one quarter", "¼"],
  ["three quarters", "¾"],
  ["one in four", "1 in 4"],
];
```
"a quarter" stays in words. No respellings needed: Grover, oracle, diffuser, amplitude and interference were all heard.

## Glyph note
Labels hand-draw only θ π ψ φ α β ω Σ ⊗ | ⟨ ⟩ √ → ≈. Check that Caveat renders ½ ¼ ¾ ² × ÷ and the minus sign; if
any is missing, draw it as a small inline SVG stroke in the label (as lessons 1 and 8 did for −½).
