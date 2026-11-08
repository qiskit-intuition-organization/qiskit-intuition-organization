# Lesson 9 "Measuring in other directions" (bases): beat plan

Voice: bf_emma, 17 lines, 258 words, narration ends 82.70 s, film about 85.3 s with the 2.6 s hold.
Board 1920x1080. Safe area x 140 to 1780, y 60 to 860. Title block (x 192 to 1500, y 118 to 260)
stays until about 3.0 s, then `blurOut("#b-title", 3.0)`; nothing is drawn into that band before then.

Story in one breath: two qubits (plus and minus) give identical fifty fifty readings when asked
"up or down?", exactly like slanted light under upright sunglasses. Tilt the question (front or back?)
and each answers with certainty. Hardware only asks up or down, so an H gate turns the qubit first.

Colour rule: gold is only the thing that matters now (the beam that passes, the arrow, the axis being
asked, the certain answer, the photon). Everything else is ink. One scene on screen at a time.

## Line timings (from timing.json, seconds)

| # | start | end | text |
|---|---|---|---|
| 0 | 0.40 | 4.43 | Here is a puzzle. Two different qubits look alike whenever we measure them. |
| 1 | 4.73 | 9.32 | Both read zero half the time and one half the time. How can we tell them apart? |
| 2 | 9.62 | 14.01 | Think of polarized sunglasses. They only let through light that wiggles their way. |
| 3 | 14.31 | 18.22 | Send in light wiggling on a slant, and upright glasses pass only half. |
| 4 | 18.52 | 21.29 | Tilt the glasses to that slant, and all of it passes. |
| 5 | 21.59 | 25.73 | The light never changed. Only the question the glasses were asking did. |
| 6 | 26.03 | 29.93 | A qubit works the same way. Picture it as an arrow inside a ball. |
| 7 | 30.23 | 36.46 | Measuring asks about one line through the ball, called an axis, usually with zero at the top and one at the bottom. |
| 8 | 36.76 | 41.46 | Our two qubits point sideways, to the front and the back. We call them plus and minus. |
| 9 | 41.76 | 46.47 | Both sit halfway between top and bottom, so asking up or down gives fifty fifty. |
| 10 | 46.77 | 52.81 | Ask along the front to back axis instead, and plus answers plus every time, while minus answers minus. |
| 11 | 53.11 | 55.60 | But real hardware can only ask up or down. |
| 12 | 55.90 | 60.13 | So first we turn it with an H gate, which swaps front and back with up and down. |
| 13 | 60.43 | 63.82 | Now plus reads zero and minus reads one, every time. |
| 14 | 64.12 | 70.18 | Here the sunglasses picture breaks. A beam can partly pass, but one particle of light passes or it doesn't. |
| 15 | 70.48 | 76.88 | Fifty fifty doesn't mean the qubit is random. Plus is perfectly definite, just not lined up with the question. |
| 16 | 77.18 | 82.70 | A measurement asks about one axis. To ask about another, turn that axis onto up and down first. |

### Cue warnings (the transcriber pushed some line-final words into the next line's window)
- `cue(7, "ball")` with nth 0 returns line 6's "ball" (30.00 s). For "through the ball" use `cue(7, "ball", 1)` (32.36 s).
- Line 2's "way" sits in line 3's words (14.14 s); line 7's "bottom" sits in line 8 (36.45 s); line 9's
  "Both" sits in line 8 (41.41 s); line 10's "Ask" sits in line 9 (46.52 s); line 13's "time" sits in line 14 (63.88 s).
  For these, cue the word from the line where it was heard (for example `cue(8, "bottom")`), or use the
  text estimate in its own line, which lands within about 0.2 s.
- "qubit" is heard as "cubit": `cue(n, "qubit")` falls back to the text estimate, which is fine; or cue a neighbour word.
- "fifty" is heard as "50-50": cue "gives" (line 9) or the line start (line 15) instead.
- "H gate" is heard as "Hgate": cue "an" + 0.15 s, or `cue(12, "hgate")`.

## Scene A. The puzzle (lines 0 and 1, 0.4 to 9.3 s)
Central picture: two identical hand-drawn sealed boxes, "A" (centre x 620) and "B" (centre x 1300),
each 260 x 200 at y 330 to 530, each with a small measuring meter drawn on its front (a semicircle
gauge with a needle, like the pilot's), and a little stream of readings coming out underneath.

- L0 "puzzle" (0.85): a big gold "?" writes at x 960, y 420 between where the boxes will go, small. Title still up.
- L0 3.0 s: blurOut title.
- L0 "Two" (1.92) to "different" (2.06): box A draws (1.2 s), box B draws 0.3 s later. Labels "A", "B" (56 px) write above each box at y 300.
  The "?" moves up to x 960, y 300 (between the labels).
- L0 "measure" (3.74): each meter needle flicks (onFrame, a quick wobble, 0.6 s).
- L1 "zero" (5.23) to "time" (7.48): under each box a row of readings writes one digit at a time at y 600,
  the same mixed pattern idea but different digits: A "0 1 1 0 1 0", B "1 0 0 1 0 1" (56 px, ink).
  Each new digit lands about every 0.35 s, so the frame is never still.
- L1 "half" (5.73) and second "half" (7.08): under each row a small two-bar chart draws (bars "0" and "1", each to the
  same 50% height, ink, labels "0" "1" at 44 px, and "half and half" 44 px under it). Both charts identical.
- L1 "apart" (9.22): the "?" turns gold and scales up 1.4x. A wobbly "=" written between the two bar charts, ink, to say "they match".
- Leaves: at 9.5 s blurOut everything in Scene A.

## Scene B. Polarized sunglasses, the analogy (lines 2 to 5, 9.6 to 25.7 s)
Central sketch, one big side-view picture across the board at y 300 to 760:
a hand-drawn torch at left (x 180 to 400, y 470 to 590), a beam path to the right, a big single sunglasses
lens in the middle (an upright rounded rectangle 180 x 340 at x 870 to 1050, y 360 to 700, with 7 vertical
hatch lines inside: the "upright" filter), a short arm drawn on it so it reads as sunglasses, and a little
light meter at right (x 1500 to 1700, y 380 to 700: a tall empty bar with "0%" at the bottom and "100%" at the top, 44 px).

- L2 "polarized" (10.29) to "sunglasses" (10.37): the lens and arm draw (1.5 s). Label "polarized sunglasses" writes under it at y 760 (48 px).
- L2 "light" (12.77) to "wiggles" (13.35): a small demo wave: an upright zigzag (a vertical wiggle drawn as a wave whose
  wiggles go up and down) travels from x 420 into the lens and out the other side, gold, because it is the thing that passes.
  Use a `wobbly` sine path and `draw()` it left to right over 1.2 s. Tiny label beside it: "wiggles up and down" (44 px).
- L3 start (14.31): the demo wave fades out. Torch draws (0.8 s) on "Send" (14.60).
- L3 "slant" (15.69): the incoming wave draws again from the torch to the lens, but its wiggles lean at 45 degrees
  (a sine path drawn inside a group rotated 45 degrees about the beam line), ink. Label "on a slant" (48 px) above it.
- L3 "upright" (16.32): the lens's vertical hatch lines flash gold for 0.4 s and back to ink. Label "upright" (48 px) above the lens.
- L3 "half" (18.02): the outgoing wave draws from the lens to the meter: upright wiggles, about 70% of the incoming height,
  gold at half opacity. The meter bar fills (onFrame + sched) from 0 to 50% in gold hatch; a label "half" (56 px, gold) writes beside it.
- L4 "Tilt" (18.68) to "slant" (19.88): the lens group rotates 45 degrees about its centre (onFrame, 1.0 s, ease.inOut), so its
  hatch lines now lie along the incoming slant. "upright" label rewrites as "slanted" (ink).
- L4 "all" (20.38): the outgoing wave redraws as a full-height slanted wave in full gold; the meter climbs from 50% to 100%;
  "half" is replaced by "all of it" (56 px, gold).
- L5 "light" (21.80) to "changed" (22.61): the incoming wave gets a gentle pulse (opacity 1, 0.6, 1) and a small tick label "same light" writes above the torch.
- L5 "question" (23.76): a hand-drawn speech bubble writes above the lens: "upright?" crossed out (a single ink stroke) then "slanted?" in gold.
- Leaves: at 25.9 s blurOut all of Scene B.

## Scene C. The arrow in a ball, and plus and minus (lines 6 to 10, 26.0 to 52.8 s)
Central sketch: a hand-drawn ball (circle, radius 260, centre (640, 470)), with a dashed equator ellipse
(rx 260, ry 70). The qubit is a gold arrow from the centre. Right side (x 1060 to 1740) holds the readout panel.
The front to back axis is drawn in perspective: front point at the lower left of the equator ellipse
(about (470, 525)), back point at the upper right (about (810, 415)). This is the standard Bloch drawing with the X axis toward the viewer.

- L6 "qubit" (26.36): ball circle draws (1.5 s). L6 "ball" (cue(7, "ball") = 30.00): equator ellipse draws dashed (0.8 s).
- L6 "arrow" (29.02): gold arrow draws from the centre, pointing to the top for now (an onFrame arrow so it can turn later).
- L7 "line" (31.45) to "ball" nth 1 (32.36): the up and down axis draws (dashed vertical line through the poles, y 190 to 750, ink, 1 s).
- L7 "axis" (33.27): label "axis" (48 px) writes beside the line at x 700, y 250.
- L7 "zero" (34.38): "|0⟩" writes at the top pole (56 px). L7 "one" (35.39): "|1⟩" writes at the bottom pole.
  Gold stays on the arrow only.
- L8 "sideways" (37.87) to "front" (38.58): the arrow swings (onFrame, 1.0 s) from the top down to the front point.
  The front to back axis draws dashed through the centre (ink), with small labels "front" and "back" (44 px) at its ends.
- L8 "back" (39.32): a second arrow draws from the centre to the back point (ink, thinner; the front arrow stays gold).
- L8 "plus" (40.30): "|+⟩" (56 px) writes at the front tip. L8 "minus" (40.73): "|−⟩" writes at the back tip.
- L9 "halfway" (41.90): a dotted line from each tip across to the vertical axis meets it exactly at the middle, with a small tick.
- L9 "up" (44.47): the vertical axis turns gold (this is the question now). A question tag "up or down?" (56 px, gold) writes at the top of the right panel (x 1100, y 230).
- L9 "gives" (45.02): two bar pairs draw in the right panel: row "|+⟩" with bars "0" 50% and "1" 50%, row "|−⟩" with the same (bars
  ink hatch, labels 44 px). A label "50/50" writes beside each row (48 px). Bars grow with onFrame.
- L10 "front" (47.69) to "axis" (48.23): the vertical axis returns to ink, the front to back axis turns gold, and the question tag
  rewrites to "front or back?". This is the same move as tilting the glasses: say it with motion, the gold jumps from one axis to the other.
- L10 "plus" nth 1 (50.18) to "time" (50.84): the |+⟩ row's bars morph: they become "+" 100% (gold) and "−" 0%, label "every time".
- L10 "minus" nth 1 (52.60): the |−⟩ row becomes "−" 100% (gold), "+" 0%.
- Leaves: at 52.9 s the right panel blurs out; the ball stays and slides left to centre (440, 470) and shrinks to 0.8 (0.8 s).

## Scene D. Hardware can only ask up or down, so turn first (lines 11 to 13, 53.1 to 63.8 s)
Left: the ball from Scene C (scaled), with only the front arrow |+⟩ gold and the back arrow |−⟩ ink.
Right: a hand-drawn circuit on one wire at y 520 from x 900 to 1700: input label "qubit", an H box (110 x 110),
then a measuring meter box (the pilot's meter: a box with a semicircle gauge and needle), then an output.

- L11 "hardware" (53.69): the meter box draws first, alone at x 1500 (1 s), with label "the hardware" (44 px) below it.
- L11 "up" (55.04) to "down" (55.25): a small tag above the meter writes "only: up or down?" (48 px). The ball's vertical axis flashes gold, front to back axis goes ink.
- L12 "turn" (56.37): the wire draws from x 900 to the meter.
- L12 "H gate" (about 57.2): the H box draws on the wire at x 1180, gold, with "H" (80 px) inside.
- L12 "swaps" (58.19) to "down" (60.04): on the ball, the whole picture turns: the front arrow (|+⟩) swings up to the top pole
  and the back arrow (|−⟩) swings down to the bottom pole (onFrame, 1.6 s, ease.inOut), while the front to back axis line
  rotates onto the vertical. Two small curved swap arrows draw beside the ball, ink. The |+⟩ and |−⟩ labels ride with their tips.
- L13 "plus" (60.75) to "zero" (61.35): after the meter, a row "|+⟩ → 0 0 0 0" writes out (56 px), the zeros gold, one by one.
- L13 "minus" (61.98) to "one" (62.89): a second row "|−⟩ → 1 1 1 1" writes, the ones gold.
- L13 end (63.88): a small gold tick beside both rows. Leaves: at 64.0 s blurOut all of Scene D.

## Scene E. Where the analogy breaks, and the misconception (lines 14 and 15, 64.1 to 76.9 s)
Part 1 (line 14): a smaller copy of the upright lens (x 860 to 980, y 330 to 610) with the torch at left, as in Scene B.
- L14 "sunglasses" (65.24): torch and lens draw (1 s). "breaks" (65.84): a small ink crack mark writes in the corner of the lens.
- L14 "beam" (66.46) to "partly" (66.90): a wide slanted wave draws in, and the dimmer half-bright upright wave draws out (as in L3), label "a beam: part passes" (44 px).
- L14 "particle" (68.17): the beam fades; one gold dot (the photon, radius 14) flies from the torch to the lens (onFrame, 0.8 s).
- L14 "passes" (69.13): the dot comes out whole on the far side and keeps going; label "passes, whole" (48 px, gold) beside it.
- L14 "doesn't" (69.72): a second ghost dot (ink, dashed outline) stops dead at the lens with a short stop bar; label "or stopped" (48 px).
  Never draw a half dot. Leaves at 70.3 s.
Part 2 (line 15): the ball returns at centre left (640, 470) with the gold |+⟩ arrow at the front point, and the vertical axis in ink.
- L15 start (70.48): ball, axis, and the |+⟩ arrow draw (1 s). On the right, a 50/50 bar pair ("0", "1") draws, ink, with the tag "up or down?".
- L15 "random" (72.90): the word "random?" writes over the bars (48 px) and gets a single ink cross-out stroke 0.4 s later.
- L15 "definite" (74.24): the |+⟩ arrow pulses gold and its label "|+⟩: a definite direction" writes (48 px).
- L15 "lined" (75.59) to "question" (76.46): a small right-angle mark draws where the arrow meets the vertical axis, gold for 0.5 s,
  showing the arrow sits square across the question, not along it. Leaves: at 77.0 s blurOut all of Scene E.

## Scene F. Closing picture (line 16, 77.2 s to the end, stays through the 2.6 s hold)
- L16 "measurement" (77.30) to "axis" (79.29): headline writes centred at y 230: "A measurement asks about one axis." (64 px, ink, "one axis" in gold).
- L16 "another" (80.31): the circuit writes centred at y 520: "qubit ---[ H ]---[ meter ]" drawn by hand (the wire and boxes are drawn strokes), H box gold,
  with "H" at 90 px. Under it, a label writes: "turn, then measure" (64 px).
- L16 "onto" (81.66) to "first" (82.27): a small ball sketch at left of the circuit (radius 90 at (330, 520)) shows a gold curved arrow
  turning the front to back axis onto the vertical one. Label under the circuit: "H, then measure = asks front or back?" (48 px).
- Everything stays to the end. A slow gold underline under "one axis" draws during the hold so the frame is not still for more than 5 s.

Closing formula note: the course equation (1 + r.n)/2 is not spoken and is too heavy for a complete beginner;
the circuit "H, then measure" is the lesson's own takeaway picture, so the card uses it.

## Caption phrase pairs (add in scene.mjs)
```js
export const phrases = [
  ["plus and minus", "|+⟩ and |−⟩"],   // line 8 only, ties the words to the on-screen labels
];
```
Built-in pairs already cover "Fifty fifty" / "fifty fifty" (lines 9 and 15). Leave "plus", "minus", "zero", "one",
"H gate" as words elsewhere: "plus answers plus" reads best as words.

## Respellings for the voice
None needed. The pronunciation check is clean: "qubit" is heard as "cubit" (correct sound, transcriber spelling),
"polarized" as "polarised", "H gate" as "Hgate", "fifty fifty" as "50-50". Every other missing word is a
line-final word the transcriber placed in the next line's window.

## Physics checks
- Diagonal (45 degree) light through an upright polarizer: half the intensity passes, and what passes is upright. Tilted to 45 degrees: all passes. Correct.
- |+⟩ and |−⟩ sit on the equator at the ends of the X axis (front, back), so a Z measurement gives 50/50 for both and an X measurement is certain. Correct.
- H swaps the X and Z axes: |+⟩ goes to |0⟩ (reads zero), |−⟩ goes to |1⟩ (reads one). Correct.
- A single photon passes whole or not at all; the outcome is random, the state before it was definite. The script says the qubit is not random, not that the outcome is fixed.
