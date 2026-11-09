# Lesson 9 "Measuring in other directions" (bases): beat plan

Voice: bf_emma, 18 lines, 259 words, narration ends 83.24 s, film about 85.8 s with the 2.6 s hold.
Board 1920x1080. Safe area x 140 to 1780, y 60 to 860. Title block (x 192 to 1500, y 118 to 260)
stays until about 3.0 s, then `blurOut("#b-title", 3.0)`; nothing is drawn into that band before then.

Story in one breath: two qubits (plus and minus) give identical fifty fifty readings when asked
"up or down?", exactly like slanted light under upright sunglasses. The odds follow how near the arrow
is to each end of the axis being asked. Tilt the question (front or back?) and each answers with
certainty. Hardware only asks up or down, so an H gate turns the qubit first.

Colour rule: gold is only the thing that matters now (the beam that passes, the arrow, the axis being
asked, the certain answer, the photon). Everything else is ink. One scene on screen at a time.

## Line timings (from timing.json, seconds)

| # | start | end | text |
|---|---|---|---|
| 0 | 0.40 | 4.84 | Here is a puzzle. Two different qubits look alike when we measure them the usual way. |
| 1 | 5.14 | 9.72 | Both read zero half the time and one half the time. How can we tell them apart? |
| 2 | 10.02 | 14.12 | Think of polarized sunglasses. They let through light that wiggles their way. |
| 3 | 14.42 | 18.32 | Send in light wiggling on a slant, and upright glasses pass only half. |
| 4 | 18.62 | 21.40 | Tilt the glasses to that slant, and all of it passes. |
| 5 | 21.70 | 25.84 | The light never changed. Only the question the glasses were asking did. |
| 6 | 26.14 | 30.04 | A qubit works the same way. Picture it as an arrow inside a ball. |
| 7 | 30.34 | 36.36 | Measuring asks about one line through the ball, called an axis, usually zero at the top and one at the bottom. |
| 8 | 36.66 | 39.84 | The nearer the arrow is to an end, the more likely that answer. |
| 9 | 40.13 | 44.19 | Our two qubits lie sideways: plus points front, minus points back. |
| 10 | 44.49 | 48.73 | Both sit halfway between top and bottom, so up or down gives fifty fifty. |
| 11 | 49.03 | 54.41 | Ask along the front to back axis instead, and plus always answers front, minus always back. |
| 12 | 54.71 | 57.12 | But real hardware only asks up or down. |
| 13 | 57.42 | 61.30 | So first, a turn called the H gate swaps front and back with up and down. |
| 14 | 61.60 | 65.00 | Now plus reads zero and minus reads one, every time. |
| 15 | 65.30 | 70.71 | Here the picture breaks. A beam can partly pass, but one particle of light passes or it doesn't. |
| 16 | 71.01 | 77.41 | Fifty fifty doesn't mean the qubit is random. Plus is perfectly definite, just not lined up with the question. |
| 17 | 77.71 | 83.24 | A measurement asks about one axis. To ask about another, turn that axis onto up and down first. |

### Cue warnings (the transcriber pushed some line-final words into the next line's window)
- Line 0's "way" sits in line 1 (5.05 s); line 2's "way" sits in line 3 (14.27 s); line 3's "half" sits in
  line 4 (18.37 s): use `cue(4, "half")`. Line 6's "ball" sits in line 7 (30.10 s).
- `cue(7, "ball")` with nth 0 returns line 6's "ball" (30.10 s). For "through the ball" use `cue(7, "ball", 1)` (32.88 s).
- Line 7 says "one" twice: `cue(7, "one")` is "one line" (31.65 s). For "one at the bottom" use `cue(7, "one", 1)` (35.39 s).
- Line 11 says "front" and "back" twice: the answers are `cue(11, "front", 1)` (52.64 s) and `cue(11, "back", 1)` (54.06 s).
- "fifty fifty" is heard as "50-50": cue "gives" (line 10) or the line start (line 16) instead.
- "H gate" is heard as "Hgate": use `cue(13, "hgate")` (59.04 s).
- "polarized" is heard as "polarised": cue "sunglasses" (11.07 s) or `cue(2, "polarised")`.

## Scene A. The puzzle (lines 0 and 1, 0.4 to 9.7 s)
Central picture: two identical hand-drawn sealed boxes, "A" (centre x 620) and "B" (centre x 1300),
each 260 x 200 at y 330 to 530, each with a small measuring meter drawn on its front (a semicircle
gauge with a needle, like the pilot's), and a little stream of readings coming out underneath.

- L0 "puzzle" (0.85): a big gold "?" writes at x 960, y 420 between where the boxes will go, small. Title still up.
- L0 3.0 s: blurOut title.
- L0 "Two" (1.94) to "different" (2.08): box A draws (1.2 s), box B draws 0.3 s later. Labels "A", "B" (56 px) write above each box at y 300.
  The "?" moves up to x 960, y 300 (between the labels).
- L0 "measure" (3.48): each meter needle flicks (onFrame, a quick wobble, 0.6 s).
- L0 "usual" (4.36): both needles come to rest pointing the same way, at the same moment, so the two meters look identical.
- L1 "zero" (5.90) to "time" (7.94): under each box a row of readings writes one digit at a time at y 600,
  the same mixed pattern idea but different digits: A "0 1 1 0 1 0", B "1 0 0 1 0 1" (56 px, ink).
  Each new digit lands about every 0.35 s, so the frame is never still.
- L1 "half" (6.19) and second "half" (7.43): under each row a small two-bar chart draws (bars "0" and "1", each to the
  same 50% height, ink, labels "0" "1" at 44 px, and "half and half" 44 px under it). Both charts identical.
- L1 "apart" (9.60): the "?" turns gold and scales up 1.4x. A wobbly "=" written between the two bar charts, ink, to say "they match".
- Leaves: at 9.85 s blurOut everything in Scene A.

## Scene B. Polarized sunglasses, the analogy (lines 2 to 5, 10.0 to 25.8 s)
Central sketch, one big side-view picture across the board at y 300 to 760:
a hand-drawn torch at left (x 180 to 400, y 470 to 590), a beam path to the right, a big single sunglasses
lens in the middle (an upright rounded rectangle 180 x 340 at x 870 to 1050, y 360 to 700, with 7 vertical
hatch lines inside: the "upright" filter), a short arm drawn on it so it reads as sunglasses, and a little
light meter at right (x 1500 to 1700, y 380 to 700: a tall empty bar with "0%" at the bottom and "100%" at the top, 44 px).

- L2 "Think" (10.05) to "sunglasses" (11.07): the lens and arm draw (1.5 s). Label "polarized sunglasses" writes under it at y 760 (48 px).
- L2 "light" (13.01) to "wiggles" (13.55): a small demo wave: an upright zigzag (a wave whose wiggles go up and down)
  travels from x 420 into the lens and out the other side, gold, because it is the thing that passes.
  Use a `wobbly` sine path and `draw()` it left to right over 1.2 s. Tiny label beside it: "wiggles up and down" (44 px).
- L3 start (14.42): the demo wave fades out. Torch draws (0.8 s) on "Send" (14.68).
- L3 "slant" (15.85): the incoming wave draws again from the torch to the lens, but its wiggles lean at 45 degrees
  (a sine path drawn inside a group rotated 45 degrees about the beam line), ink. Label "on a slant" (48 px) above it.
- L3 "upright" (16.90): the lens's vertical hatch lines flash gold for 0.4 s and back to ink. Label "upright" (48 px) above the lens.
- L3 "only" (17.97) to `cue(4, "half")` (18.37): the outgoing wave draws from the lens to the meter: upright wiggles, about 70% of
  the incoming height, gold at half opacity. The meter bar fills (onFrame + sched) from 0 to 50% in gold hatch; a label "half"
  (56 px, gold) writes beside it.
- L4 "Tilt" (18.87) to "slant" (20.08): the lens group rotates 45 degrees about its centre (onFrame, 1.0 s, ease.inOut), so its
  hatch lines now lie along the incoming slant. "upright" label rewrites as "slanted" (ink).
- L4 "all" (20.51): the outgoing wave redraws as a full-height slanted wave in full gold; the meter climbs from 50% to 100%;
  "half" is replaced by "all of it" (56 px, gold).
- L5 "light" (22.14) to "changed" (22.86): the incoming wave gets a gentle pulse (opacity 1, 0.6, 1) and a small tick label "same light" writes above the torch.
- L5 "question" (23.93): a hand-drawn speech bubble writes above the lens: "upright?" crossed out (a single ink stroke) then "slanted?" in gold.
- Leaves: at 25.95 s blurOut all of Scene B.

## Scene C. The arrow in a ball, the odds, and plus and minus (lines 6 to 11, 26.1 to 54.4 s)
Central sketch: a hand-drawn ball (circle, radius 260, centre (640, 470)), with a dashed equator ellipse
(rx 260, ry 70). The qubit is a gold arrow from the centre. Right side (x 1060 to 1740) holds the readout panel.
The front to back axis is drawn in perspective: front point at the lower left of the equator ellipse
(about (470, 525)), back point at the upper right (about (810, 415)). This is the standard Bloch drawing with the X axis toward the viewer.

- L6 "qubit" (26.06): ball circle draws (1.5 s). L6 "ball" (`cue(7, "ball")` = 30.10): equator ellipse draws dashed (0.8 s).
- L6 "arrow" (29.09): gold arrow draws from the centre, pointing to the top for now (an onFrame arrow so it can turn later).
- L7 "line" (31.69) to "ball" nth 1 (32.88): the up and down axis draws (dashed vertical line through the poles, y 190 to 750, ink, 1 s).
- L7 "axis" (33.54): label "axis" (48 px) writes beside the line at x 700, y 250.
- L7 "zero" (34.49): "|0⟩" writes at the top pole (56 px). L7 `cue(7, "one", 1)` (35.39): "|1⟩" writes at the bottom pole.
  Gold stays on the arrow only.
- L8 "nearer" (36.69): a small two-bar chart draws in the right panel at x 1150 to 1450, y 420 to 700 (bars "0" and "1",
  labels 44 px). Its heights follow the arrow live (onFrame): with the arrow at angle a from the top, bar "0" is
  cos squared of a over two and bar "1" is sin squared of a over two. The taller bar is gold, the other ink.
- L8 "nearer" (36.69) to "end" (38.11): the arrow leans from the top down to about 30 degrees from the top (bar "0" about 93%),
  then on "end" sweeps on round to about 30 degrees from the bottom (bar "1" about 93%), 1.2 s ease.inOut.
- L8 "likely" (38.86): the arrow swings back to the top (bar "0" full); label "nearer an end, more likely" (44 px) writes under the chart.
- Leaves: at 39.95 s blurOut the chart and its label. The ball, axis and arrow stay.
- L9 "sideways" (41.41): the arrow swings (onFrame, 1.0 s) from the top down to the front point.
  The front to back axis draws dashed through the centre (ink), with small labels "front" and "back" (44 px) at its ends.
- L9 "plus" (41.95): "|+⟩" (56 px) writes at the front tip as the arrow lands there.
- L9 "minus" (43.01) to "back" (43.85): a second arrow draws from the centre to the back point (ink, thinner; the front arrow stays gold),
  and "|−⟩" writes at the back tip.
- L10 "halfway" (44.87): a dotted line from each tip across to the vertical axis meets it exactly at the middle, with a small tick.
- L10 "up" (47.13): the vertical axis turns gold (this is the question now). A question tag "up or down?" (56 px, gold) writes at the top of the right panel (x 1100, y 230).
- L10 "gives" (47.65): two bar pairs draw in the right panel: row "|+⟩" with bars "0" 50% and "1" 50%, row "|−⟩" with the same (bars
  ink hatch, labels 44 px). A label "50/50" writes beside each row (48 px). Bars grow with onFrame.
- L11 "front" (49.73) to "axis" (50.44): the vertical axis returns to ink, the front to back axis turns gold, and the question tag
  rewrites to "front or back?". The bar labels rewrite from "0" "1" to "front" "back". This is the same move as tilting the glasses:
  say it with motion, the gold jumps from one axis to the other.
- L11 "always" (51.72) to `cue(11, "front", 1)` (52.64): the |+⟩ row's bars morph: "front" 100% (gold) and "back" 0%, label "always".
- L11 "minus" (53.22) to `cue(11, "back", 1)` (54.06): the |−⟩ row becomes "back" 100% (gold), "front" 0%.
- Leaves: at 54.45 s the right panel blurs out; the ball stays and slides left to centre (440, 470) and shrinks to 0.8 (0.8 s).

## Scene D. Hardware only asks up or down, so turn first (lines 12 to 14, 54.7 to 65.0 s)
Left: the ball from Scene C (scaled), with only the front arrow |+⟩ gold and the back arrow |−⟩ ink.
Right: a hand-drawn circuit on one wire at y 520 from x 900 to 1700: input label "qubit", an H box (110 x 110),
then a measuring meter box (the pilot's meter: a box with a semicircle gauge and needle), then an output.

- L12 "hardware" (55.22): the meter box draws first, alone at x 1500 (1 s), with label "the hardware" (44 px) below it.
- L12 "up" (56.55) to "down" (56.89): a small tag above the meter writes "only asks: up or down?" (48 px). The ball's vertical axis flashes gold, front to back axis goes ink.
- L13 "turn" (58.14): the wire draws from x 900 to the meter.
- L13 `cue(13, "hgate")` (59.04): the H box draws on the wire at x 1180, gold, with "H" (80 px) inside.
- L13 "swaps" (59.32) to "down" (61.13): on the ball, the whole picture turns: the front arrow (|+⟩) swings up to the top pole
  and the back arrow (|−⟩) swings down to the bottom pole (onFrame, 1.6 s, ease.inOut), while the front to back axis line
  rotates onto the vertical. Two small curved swap arrows draw beside the ball, ink. The |+⟩ and |−⟩ labels ride with their tips.
- L14 "plus" (61.81) to "zero" (62.43): after the meter, a row "|+⟩ → 0 0 0 0" writes out (56 px), the zeros gold, one by one.
- L14 "minus" (63.05) to "one" (63.49): a second row "|−⟩ → 1 1 1 1" writes, the ones gold.
- L14 "every" (64.29) to "time" (64.70): a small gold tick beside both rows. Leaves: at 65.1 s blurOut all of Scene D.

## Scene E. Where the analogy breaks, and the misconception (lines 15 and 16, 65.3 to 77.4 s)
Part 1 (line 15): a smaller copy of the upright lens (x 860 to 980, y 330 to 610) with the torch at left, as in Scene B.
The voice says only "the picture", so the lens and torch must be on screen as it says it.
- L15 "Here" (65.66) to "picture" (65.94): torch and lens draw (1 s). "breaks" (66.38): a small ink crack mark writes in the corner of the lens.
- L15 "beam" (66.98) to "partly" (67.40): a wide slanted wave draws in, and the dimmer half-bright upright wave draws out (as in L3), label "a beam: part passes" (44 px).
- L15 "particle" (68.49): the beam fades; one gold dot (the photon, radius 14, label "one particle of light" 44 px) flies from the torch to the lens (onFrame, 0.8 s).
- L15 "passes" (69.66): the dot comes out whole on the far side and keeps going; label "passes, whole" (48 px, gold) beside it.
- L15 "doesn't" (70.22): a second ghost dot (ink, dashed outline) stops dead at the lens with a short stop bar; label "or stopped" (48 px).
  Never draw a half dot. Leaves at 70.8 s.
Part 2 (line 16): the ball returns at centre left (640, 470) with the gold |+⟩ arrow at the front point, and the vertical axis in ink.
- L16 start (71.01): ball, axis, and the |+⟩ arrow draw (1 s). On the right, a 50/50 bar pair ("0", "1") draws, ink, with the tag "up or down?".
- L16 "random" (73.32): the word "random?" writes over the bars (48 px) and gets a single ink cross-out stroke 0.4 s later.
- L16 "perfectly" (74.38) to "definite" (75.59): the |+⟩ arrow pulses gold and its label "|+⟩: a definite direction" writes (48 px).
- L16 "lined" (76.15) to "question" (76.99): a small right-angle mark draws where the arrow meets the vertical axis, gold for 0.5 s,
  showing the arrow sits square across the question, not along it. Leaves: at 77.5 s blurOut all of Scene E.

## Scene F. Closing picture (line 17, 77.7 s to the end, stays through the 2.6 s hold)
- L17 "measurement" (77.85) to "axis" (79.52): headline writes centred at y 230: "A measurement asks about one axis." (64 px, ink, "one axis" in gold).
- L17 "another" (80.86): the circuit writes centred at y 520: "qubit ---[ H ]---[ meter ]" drawn by hand (the wire and boxes are drawn strokes), H box gold,
  with "H" at 90 px. Under it, a label writes: "turn, then measure" (64 px).
- L17 "turn" (81.24) to "first" (82.81): a small ball sketch at left of the circuit (radius 90 at (330, 520)) shows a gold curved arrow
  turning the front to back axis onto the vertical one. Label under the circuit: "H, then measure = asks front or back?" (48 px).
- Everything stays to the end. A slow gold underline under "one axis" draws during the hold so the frame is not still for more than 5 s.

Closing formula note: the course equation (1 + r.n)/2 is not spoken and is too heavy for a complete beginner;
line 8 says its meaning in words (nearer an end, more likely) and its chart shows it moving.
The circuit "H, then measure" is the lesson's own takeaway picture, so the card uses it.

## Caption phrase pairs (add in scene.mjs)
```js
export const phrases = [
  ["plus points front", "|+⟩ points front"],   // line 9 only, ties the words to the on-screen labels
  ["minus points back", "|−⟩ points back"],
];
```
Built-in pairs already cover "Fifty fifty" / "fifty fifty" (lines 10 and 16). Leave "plus", "minus", "zero", "one",
"H gate" as words elsewhere: "plus always answers front" reads best as words.

## Respellings for the voice
None needed. The pronunciation check is clean: "polarized" is heard as "polarised", "H gate" as "Hgate",
"fifty fifty" as "50-50". Every other missing word is a line-final word the transcriber placed in the next line's window.

## Physics checks
- Diagonal (45 degree) light through an upright polarizer: half the intensity passes, and what passes is upright. Tilted to 45 degrees: all passes. Correct.
- Odds along an axis follow closeness to its ends: with the arrow at angle a from the top, P(0) = cos squared of a over two. Line 8's chart uses exactly this.
- |+⟩ and |−⟩ sit on the equator at the ends of the X axis (front, back), so a Z measurement gives 50/50 for both and an X measurement is certain. Correct.
- H is a half turn that swaps the X and Z axes: |+⟩ goes to |0⟩ (reads zero), |−⟩ goes to |1⟩ (reads one). Correct.
- A single photon passes whole or not at all; the outcome is random, the state before it was definite. The script says the qubit is not random, not that the outcome is fixed.
- The hook says the qubits look alike "the usual way" (an up or down measurement), not "whenever we measure them", which would contradict line 11.
