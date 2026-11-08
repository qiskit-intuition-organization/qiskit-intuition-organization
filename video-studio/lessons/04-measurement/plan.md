# Lesson 4, Measurement and shots: beat plan

Voiced with Emma: 19 lines, 259 words, narration ends at 82.77 s, film about 85.4 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json` (re-check with `cue()`; they move if the script changes).

## Picture language (used all the way through)
- **The qubit** is a hand-drawn circle (r about 110) with an arrow from the centre. Small "0" at the top
  of the circle, small "1" at the bottom (40 px labels). The arrow's tilt from straight up sets the odds:
  our friend's qubit leans 60 degrees from the top, which reads 0 three times in four
  (cos squared of 30 degrees = 0.75). Never say or show "it is both 0 and 1".
- **The measurement** is the circuit meter: a rough rectangle (about 150 x 110) with a half arc and a
  needle, the same symbol a Qiskit circuit uses. A result card (rough rounded square, 90 px digit)
  pops out to its right.
- **The poll**: stick-figure voters (circle head, line body) and a ballot box with a slot.
- **The counts**: two fat bars labelled "0" and "1" with a dashed line for the true odds.
- Gold is only for: the result that was just read, "shot", the true 75% line while it is being named,
  the gap called shot noise, the fresh qubit, and the takeaway.

Safe area x 140 to 1780, y 60 to 860. Title block sits top left until about 4.9 s.

---

## Scene A: one look tells you almost nothing (lines 0 to 3, 0.4 to 18.1 s)

**Line 0** (0.4 s) "Suppose a friend prepares a qubit, and you want to know how they set it."
- Title block holds (kit). Below it, centred at x 760, y 560: a small stick-figure friend (x 360) with a
  hand reaching to a box labelled "set up" (x 520, y 560), with an arrow to the qubit circle (x 860, y 560).
- On "friend" (0.56): friend draws (0.8 s). On "prepares" (1.0): "set up" box and arrow draw.
- On "qubit" (1.66): the qubit circle draws (1.2 s), its arrow drawn at 60 degrees, then a hand-drawn
  cover card with a big "?" slides over the circle on "how" (3.12): we do not know the setting.
- "?" is gold.

**Line 1** (4.35 s) "You measure it once, which means you look, and it reads zero. What did you learn?"
- `blurOut("#b-title")` at about 4.8 s (title has had 4.4 s).
- On "measure" (4.94): the meter draws to the right of the qubit (x 1180, y 560) with an arrow into it.
- On "look" (6.22): the meter needle swings once (onFrame, 0.5 s).
- On "zero" (7.06): result card "0" pops out at x 1450, gold, scale 0.8 to 1.
- On "What" (7.52): a small ink "?" writes above the card; "what did we learn?" written small (44 px)
  under it.

**Line 2** (8.53 s) "Almost nothing. One measurement only gives one bit, a single zero or a single one."
- On "nothing" (9.41): the friend, set-up box and "what did we learn?" blur out. Qubit (still covered),
  meter and card slide left and shrink (move, 0.9 s) to make room.
- On "bit" (11.7): label "1 look = 1 bit" writes under the card (56 px, card stays gold).
- On "zero" (12.49) and "one" (line end, about 13.3; estimate with cue since the transcriber hears it
  late): two tiny ghost cards "0" and "1" outline beside the gold card, "0" first, then "1".

**Line 3** (13.67 s) "That zero could come from a qubit that nearly always reads zero, or rarely does."
- Everything but the gold "0" card blurs out on "That" (13.82). The card moves to the centre right
  (x 1300, y 560).
- On "nearly" (16.23): left qubit A draws at x 520, y 380, arrow almost straight up (15 degrees);
  label "nearly always 0" (44 px) under it. Arrow from A to the card.
- On "rarely" (17.59): qubit B draws at x 520, y 720, arrow almost straight down (150 degrees);
  label "rarely 0". Arrow from B to the same card.
- Both arrows meet at the one card: the same zero, two very different qubits. Card stays gold.

## Scene B: the opinion poll (lines 4 to 5, 18.4 to 25.6 s)

**Line 4** (18.43 s) "It's like an opinion poll. One voter can't tell you who will win."
- On "It's" (18.6): scene A blurs out.
- On "opinion" (19.31): a ballot box draws centre (x 960, y 600, about 260 x 220) with "poll" written on
  its front (56 px).
- On "voter" (20.79): one stick-figure voter draws at x 640, y 560, dropping a ballot into the slot
  (ballot moves 0.6 s).
- On "win" (about 21.8, estimate): to the right a results board (x 1360, y 420) writes "winner?" with
  two empty bars "A" and "B". The "?" is gold.

**Line 5** (22.36 s) "But ask a thousand, and the percentages come into focus."
- On "thousand" (23.01): the single voter is replaced by a crowd: a grid of about 60 small stick figures
  fanning out left of the box (x 160 to 760, y 380 to 820) drawing on quickly in waves (1.2 s),
  label "1,000 voters" (56 px) above.
- On "percentages" (24.09): the board's bars fill to "A 58%" and "B 42%"; the bars and numbers start
  blurred (filter blur 10 px) and come sharp on "focus" (about 25.4, 0.8 s). "58%" is gold.

## Scene C: shots (lines 6 to 7, 25.9 to 34.6 s)

**Line 6** (25.88 s) "Quantum programs do the same. They prepare the same qubit again and again, measuring each copy."
- On "Quantum" (26.69): poll blurs out.
- On "prepare" (28.51): one row draws: "set up" box (x 300) to qubit (x 620, r 70, arrow 60 degrees)
  to meter (x 900) to result card (x 1150). Row at y 300.
- On "again" (29.43) and "again" (29.91): a second row (y 470), then a third (y 640) draw as copies.
- On "measuring" (30.46): each row's card fills in turn: 0, 0, 1 (0.3 s apart); and a fourth row at
  y 810 hints more (faded dashes "...").
- Each card is ink once it has been read; the newest card is briefly gold.

**Line 7** (31.45 s) "Each run is called a shot, and each shot is one vote."
- On "shot" (32.8): a gold bracket wraps the first row; gold label "1 run = 1 shot" (64 px) at x 1450,
  y 300.
- On "vote" (34.45): a small ballot icon draws next to each card (callback to the poll), label
  "1 shot = 1 vote" (64 px) writes under the first.

## Scene D: counts settle on the true odds (lines 8 to 12, 34.9 to 55.0 s), the moving picture

Layout: left panel, counts bars, x 200 to 760; right panel, the trace chart, x 880 to 1760.
- Left: shot counter at the top ("shots: 0", 64 px, x 220, y 150); two bars "0" and "1" on a base line
  at y 780, each 160 wide, max height 520 for 100%; numbers above each bar (count and percent, 48 px).
- Right: axes "fraction of zeros" (y, 0 to 100%, 50% and 75% ticks) against "shots" on a log scale
  (x: 1, 10, 100, 1000 ticks). Height y 200 to 780.

**Line 8** (34.91 s) "Say your friend's qubit reads zero three times out of four."
- On "Say" (35.06): scene C blurs out; the friend's qubit (circle, arrow at 60 degrees) draws small at
  top centre right of the left panel (x 640, y 180, r 60).
- On "zero" (36.74): the left panel's axes and empty bars draw.
- On "three" (37.01): a dashed gold line draws across the "0" bar's 75% height, label "true: 3 in 4"
  (gold, 44 px). A matching faint dashed line at 25% on the "1" bar (ink).

**Line 9** (38.43 s) "Ten shots might give six zeros, which is sixty percent, not seventy five."
- On "Ten" (38.6): the counter ticks 0 to 10 over 1.2 s (onFrame + sched). Each tick drops a tiny card
  into the right bar; bars grow and wobble from count to count.
- On "six" (39.75): bars land at 6 and 4; "6 zeros" over the "0" bar.
- On "sixty" (41.02): "60%" writes in gold over the "0" bar; the gap to the dashed 75% line is plain to see.
- The right chart's trace starts drawing from shot 1 to shot 10 at the same time (wobbly() stroke with
  known length, frac follows the counter). It jumps around a lot.

**Line 10** (42.93 s) "A hundred shots give seventy one zeros. A thousand give seven hundred and forty eight."
- On "hundred" (43.42): counter runs 10 to 100 (1.4 s). Bars land at 71 and 29, label "71%" gold.
  The trace continues to x = 100, wobbling less.
- On "thousand" (46.1): counter runs 100 to 1000 (1.4 s). Bars land at 748 and 252, "74.8%" gold,
  almost on the dashed line. Trace continues to x = 1000, now hugging the dashed 75% line.
- The sample sequence must be built at build time with a seeded random generator (p(0) = 0.75), then
  nudged so that exactly 6 of the first 10, 71 of the first 100 and 748 of the first 1000 are zeros
  (swap outcomes within each segment). These numbers are all within one typical error of 75%:
  about 14%, 4.3% and 1.4%.

**Line 11** (48.31 s) "The fraction wobbles at first, then settles toward the true odds."
- Left panel dims to 0.35 (fade) so the chart is the one main object.
- On "wobbles" (49.11): the early, jumpy part of the trace (shots 1 to 30) flashes gold briefly with a
  small "wobbles" label (44 px).
- On "settles" (50.43): a gold arrow sweeps along the tail toward the dashed line; label "settles"
  (44 px) at the right end.
- On "true" (51.43): the dashed 75% line turns gold and its label "true odds 75%" writes.

**Line 12** (52.13 s) "To halve the wobble, you need four times as many shots."
- On "halve" (52.53): a light band (ink, hachure, low opacity) draws around the dashed line, wide on the
  left and narrowing to the right (half-width proportional to one over the square root of shots).
- On "wobble" (52.86): an I-bar marks the band's height at 100 shots (ink, label "100").
- On "four" (53.86): a second I-bar at 400 shots draws, exactly half as tall, gold, with label
  "400: half the wobble" (44 px). A curved arrow from the first to the second, "x4" written on it.

## Scene E: the misconception (lines 13 to 14, 55.3 to 66.0 s)

**Line 13** (55.31 s) "So when a fifty fifty qubit gives five hundred and twelve zeros and four hundred and eighty eight ones, relax."
- On "So" (55.44): scene D blurs out.
- On "fifty" (55.94): centre, a qubit with its arrow level (90 degrees) draws small at x 420, y 360
  with label "50/50"; two big bars draw at x 860 and x 1160 with dashed lines at 500 each, "500"
  written beside the dashed line.
- On "twelve" (58.13): "0" bar rises to 512, "512" writes on top.
- On "eighty" (59.84): "1" bar rises to 488, "488" writes on top.
- On "relax" (about 61.0): a calm hand-drawn check mark draws at x 1500, y 360.

**Line 14** (61.50 s) "Nothing is broken. That gap is called shot noise, the normal wobble of any poll."
- On "broken" (62.49): label "circuit is fine" (56 px) writes under the check.
- On "gap" (63.42): small gold brackets mark the 12 count gap between each bar top and its dashed line.
- On "shot" (64.16): gold label "shot noise" (64 px) writes beside the brackets.
- On "poll" (end of line, about 66.0): a tiny ballot icon fades in next to the label, linking back to
  the poll. The 50/50 qubit fades.

## Scene F: where the poll breaks (lines 15 to 17, 66.3 to 79.3 s)

Two halves with a hand-drawn "vs" in the middle (x 960).

**Line 15** (66.32 s) "Here's where the poll breaks. A voter already had an opinion before you asked."
- On "Here's" (66.5): scene E blurs out.
- On "breaks" (67.5): a hand-drawn crack line runs down the centre (x 960, y 260 to 820).
- On "voter" (68.06): left, a stick-figure voter draws (x 460, y 600).
- On "opinion" (69.27): a thought bubble draws above the voter, with "B" already inside it (ink).
- On "asked" (about 70.4): a pollster's speech bubble "who?" writes beside the voter; the "B" in the
  thought bubble goes gold: the answer was there before the question.

**Line 16** (70.91 s) "But our qubit has no answer waiting. Measuring creates one, and leaves the qubit sitting on it."
- On "qubit" (71.5): right, the friend's qubit draws (x 1300, y 600, arrow at 60 degrees).
- On "no" (72.17): a thought bubble above it draws empty and dashed; label "no answer yet" (44 px).
- On "Measuring" (73.72): the meter draws to its right (x 1580, y 600); needle swings.
- On "creates" (74.25): a gold "0" card pops out of the meter.
- On "sitting" (76.13): the qubit's arrow swings (onFrame, 0.8 s, power2.inOut) from 60 degrees
  straight up to the "0", and stays there. The "0" at the top of the circle goes gold.

**Line 17** (76.45 s) "That's why every vote needs a freshly prepared qubit."
- On "That's" (76.72): the left half (voter) blurs out; the measured qubit greys (fade to 0.35) with a
  small "used" label.
- On "freshly" (78.25): a "set up" box draws, and a fresh qubit (arrow back at 60 degrees, outlined in
  gold) slides in beside the used one; gold label "fresh qubit for every shot" (56 px).

## Scene G: takeaway (line 18, 79.6 s to the end, about 85.4 s)

**Line 18** (79.61 s) "One shot is one vote, and many shots reveal the odds."
- On "One" (79.68): scene F blurs out.
- Left (x 200 to 760): a small ballot icon and a single "0" card, label "1 shot = 1 vote" (64 px),
  writes on "vote" (80.43).
- Right (x 900 to 1760): the two bars from scene D redraw at 748 and 252 with the dashed true lines,
  on "many" (80.99); the gold label "many shots reveal the odds" (72 px) writes on "reveal" (81.55);
  and a gold underline draws under it.
- Holds to the end; the bars give one small settle wobble (amplitude 4 px, damped) in the hold so the
  frame is not frozen.

---

## Caption phrase pairs (export const phrases in scene.mjs)
```js
export const phrases = [
  ["five hundred and twelve", "512"],
  ["four hundred and eighty eight", "488"],
  ["seven hundred and forty eight", "748"],
  ["seventy one", "71"],
  ["sixty percent", "60%"],
  ["seventy five", "75%"],
  ["Ten shots", "10 shots"],
  ["six zeros", "6 zeros"],
  ["A hundred", "100"],
  ["A thousand", "1,000"],   // capital A only: line 10. Line 5 "a thousand" stays in words.
];
```
"fifty fifty" to 50/50 is built in.

## Respellings for the voice
None needed. Every word was heard by the transcriber. "qubit" is said cleanly.

## Notes for whoever writes scene.mjs
- The transcriber places the last word of many lines about 0.2 s late with a long tail, so `narrate.mjs`
  lists it under the next line ("learn", "does", "win", "focus", "copy", "relax", "poll", "asked",
  "on it", "qubit"). They are heard, just counted in the wrong window. In `cue()`, a line-final word
  falls back to the letter-share estimate, which is fine. Do not cue those words on the next line.
- Hyphenated numbers come back as "seventy-five", "seventy-one", "forty-eight", "fifty-fifty",
  "eighty-eight", so `cue()` estimates them; cue on a neighbouring plain word when timing matters
  ("six", "sixty", "hundred", "thousand", "twelve", "fifty" is estimated too, use "qubit" minus 0.6).
- Physics: arrow tilt 60 degrees from the top is P(0) = 0.75; level arrow is 50/50. After measuring,
  the arrow must point straight at the result read. The error band half width is
  square root of (0.75 x 0.25 / N), about 4.3% at 100 and 2.2% at 400.
