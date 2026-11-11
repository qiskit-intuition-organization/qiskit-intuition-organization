# Lesson 22, Trainable circuits and quantum ML: beat plan

Voiced with bf_emma: 17 lines, 260 words, narration ends at 81.00 s, film about 83.6 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json`; always cue with `cue(line, "word")`, never hard numbers.

Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Ink #e8e8e8, gold #d9b463 on #17191c.
Gold rule: one gold thing at a time, the thing that matters right now (the peg being turned, the knob pointer,
the ball on the cost curve, the P(1) bar while it slides).

## Physics the pictures must keep (checked numerically)
- One qubit starting in |0⟩, one gate RY(θ), then a measurement. P(1) = sin²(θ/2) (the pilot's dial, lesson 6).
- θ = π/2 gives P(1) = 50%. The target is 25%, reached at θ = π/3 (the pilot's answer).
- Cost: C(θ) = (P(1) − ¼)², the squared distance between what we read and what we want. It is zero at θ = π/3.
  For the drawing, plot C over θ from 0 to 0.6π: C(0) = 0.0625, C(π/3) = 0, C(π/2) = 0.0625, C(0.6π) = 0.164.
  So the curve is a valley: high at left edge, bottom at π/3, the start point π/2 on the right wall at the same
  height as θ = 0, rising further to the right. Scale y so C(0.6π) reaches the top of the plot.
- Gradient at θ = π/2 is positive (cost climbs if θ grows), so the step makes θ smaller. Never show θ moving up.
- Training run used for every number on screen (gradient descent, step size 1.5, slope by parameter shift):
  | step | θ | P(1) |
  |---|---|---|
  | 0 | 0.50π | 50% |
  | 1 | 0.38π | 32% |
  | 2 | 0.35π | 27% |
  | 3 | 0.34π | 26% |
  | 4 | 0.33π (π/3) | 25% |
  Show only these values. Each step is smaller than the one before (the slope flattens near the bottom).
- Parameter shift (line 12): slope of P(1) at θ = [P(θ + π/2) − P(θ − π/2)] / 2. Show it at the start point
  θ = π/2: the two shifted runs are θ = 0 (reads 0%) and θ = π (reads 100%), both on the dial's own range, so the
  slope is (100% − 0%) / 2, positive, which is why the first step turned θ down. Keep the numbers off screen except
  the two readings.
- Shots (line 11): each run gives a whole 0 or a whole 1, never a fraction. At θ = π/2 an estimate from 10 shots
  can read 60%, from 100 shots 47%, from 1000 shots 50% (the spread shrinks as shots grow). Never show a
  half-lit reading.
- Misconception (line 14): no claim of speed-ups. The scale shows a tie, then tips toward the ordinary computer.

## Recurring objects
- `b-dial`: the pilot's knob, redrawn: circle r 120 with an inner ring, 7 ticks over the top half from 0 (left) to
  π (right), labels "0", "π/2", "π" (44 px). Pointer `b-ptr` rotated by `onFrame` from θ (0 points left, π right,
  as in the pilot). A gold arc from 0 to the pointer. Readouts under it: "θ = 0.50π" (ink, 48 px) and
  "P(1) = 50%" (gold, 52 px), both live from θ.
- `b-guitar`: a guitar headstock and neck lying horizontally: headstock at left (x 260 to 560, y 360 to 620) with
  three tuning pegs on top and three on the bottom; six strings run right to x 1500; a round sound hole edge at the
  right (arc, x 1450 to 1650). The top middle peg `b-peg` is the one we turn (gold when turned). A small ear
  `b-ear` (x 1500 to 1640, y 160 to 320), and a clip-on tuner `b-tuner` (x 780 to 1100, y 150 to 330): a half-round
  meter with "flat" (left), "in tune" (centre tick), "sharp" (right) labels (40 px) and a needle driven by `onFrame`.
- Circuit strip `b-circ` (lines 3 to 7, top band y 120 to 260): wire from x 220 to 1000, "|0⟩" at x 150 (left edge
  at x >= 140), RY box at x 420 to 620 with "RY(θ)" (48 px) and a tiny knob drawn on its top edge, a meter
  (half dial with a needle) at x 760 to 900, then "→ P(1)" (44 px).
- Cost chart `b-chart` (lines 5 to 8, right half): axes from (1000, 800) up to (1000, 380) and right to (1720, 800).
  y label "cost" (44 px) at the top of the y axis; x label "θ" at the right end; x ticks "0" at 1000, "π/3" at 1400,
  "π/2" at 1600 (44 px; the x range 0 to 0.6π maps to 1000 to 1720). The curve `b-curve` drawn by `wobbly()` from
  the formula above. Ball `b-ball` (gold, r 18) placed on the curve by `onFrame` from θ. Trail dots `b-dot0..4`
  (gold, r 7) left at each step, like the widget's amber dots.
- Dial left (lines 4 to 8): `b-dial` centred at (500, 560), readouts below at y 740 and 800.
- `b-loop` (line 9): three hand-drawn boxes on a circle round a laptop, see line 9.

## Beats

### Line 0 (0.40 to 6.14) "Remember turning the R Y knob by hand until a qubit, a quantum bit, read one a quarter of the time?"
- Kit title block from 0; `blurOut("#b-title", cue(0, "qubit"))` (about 2.97 s, so it holds 2.5 s or more).
- "R Y" was heard as "R-Y": cue the knob on `cue(0, "knob", 0, -0.2)` (about 1.4 s). `b-dial` draws large in the
  lower centre (centre (960, 600), r 140, clear of the title box which ends at y 260), 1.2 s, with its labels.
- On "hand" (2.08): a hand-drawn hand (simple outline of fingers pinching) draws at the knob's right, and the
  pointer turns from 0 to π/2 (onFrame, 1 s) while the gold arc follows.
- On "qubit" (2.97): small "qubit = quantum bit" note writes above the dial (44 px, ink) at y 340 (title gone by now).
- On "quarter" (5.12): the pointer eases on to π/3 (it overshoots nothing), "P(1) = 25%" writes in gold under the
  dial (56 px), "1 in 4" under it (44 px, ink).
- Leaves: note and hand blur at line 1 start; the dial stays.

### Line 1 (6.44 to 8.62) "This time, let a computer turn it for you."
- On "This" (6.6): the pointer swings back to 0 (0.6 s) and "P(1)" resets, so the goal is open again.
- On "computer" (7.5): a hand-drawn laptop draws at left (x 220 to 560, y 460 to 720), and a dotted ink arrow from
  the laptop to the knob draws on "turn" (8.03). The hand from line 0 is gone; the laptop now owns the knob.
- Leaves: dial, laptop and arrow blur at `cue(2, "It's")` (9.16).

### Line 2 (8.91 to 13.71) "It's like tuning a guitar by ear: pluck, hear how far off it is, nudge the peg, pluck again."
- Central analogy sketch, the biggest drawing in the film.
- On "guitar" (9.84): `b-guitar` draws, headstock first then the strings, 1.6 s. Label "tuning by ear" writes at top
  left (x 192, y 120, 56 px).
- On "ear" (10.33): `b-ear` draws at top right.
- On "Pluck" (11.12): the top string vibrates (onFrame: a sine wobble of the string path's midpoint, 0.8 s, amplitude
  fading), and three small curved sound lines draw from the string toward the ear.
- "hear" was heard as "here": on `cue(2, "here")` (11.56) `b-tuner` draws above the neck; its needle jumps to the
  "flat" side (−30 degrees) and a gold "too low" writes beside it (44 px).
- On "nudge" (12.58): `b-peg` turns gold and rotates 40 degrees about its centre (0.6 s); a small curved gold arrow
  round it draws.
- On "pluck" second time (13.34): the string vibrates again; the needle swings to about −8 degrees (closer).
  The "again" is heard in line 3, so keep this motion through 13.9.

### Line 3 (14.02 to 19.38) "Our circuit's pegs are its rotation angles, like theta, left free to change, so it's trainable."
- On "Our" (14.16): the guitar blurs except `b-peg`, which slides (0.9 s) to the top band and lands on the RY box's
  knob position as `b-circ` draws (wire, "|0⟩", RY box, meter, "→ P(1)").
- On "rotation" (15.32): the RY box outline turns gold; "rotation angle" writes under it (44 px, ink).
- On "theta" (16.59): "θ" inside the box glows gold; label under the box rewrites as "θ = rotation angle".
- On "free" (17.42): the tiny knob on the box wiggles left and right (onFrame, small ±20 degrees), dotted.
- On "trainable" (18.95): a gold underlined word "trainable" writes at right of the strip (x 1100, y 190, 64 px).
- Leaves: "trainable" and the labels under the box blur at line 4 start. The circuit strip stays (ink).

### Line 4 (19.67 to 24.15) "Start theta at pi over two: a one comes up half the time, but we want a quarter."
- On "Start" (20.0): `b-dial` draws at left (centre (500, 560), r 120), pointer at 0, then on "pi" (20.84) the
  pointer turns to π/2 (0.7 s). "θ = 0.50π" writes under it on "theta" (20.44) and its value updates as it turns.
- "one" was heard as the digit "1": on `cue(4, "comes")` (22.16) a gold "1" coin pops beside the dial, and on
  "half" (22.45) a P(1) bar at centre (x 820 to 900, from y 800 up; 100% = 400 px tall) fills to 50%, gold, with
  "50%" at its top. The readout "P(1) = 50%" writes under the dial.
- On "want" (23.52): a dashed ink line at 25% across the bar labelled "target 25%" (44 px). The gap between the
  bar top and the dashed line gets a small double-headed ink arrow. The "1" coin fades at line 5 start.

### Line 5 (24.45 to 29.85) "How far off we are is called the cost. Plotted against theta, it's a valley with zero at the bottom."
- On "far" (24.72): the gap arrow on the bar turns gold and "how far off" writes beside it (44 px).
- On "cost" (25.77): "= cost" writes after it (52 px, gold).
- On "Plotted" (26.91): `b-chart` axes draw on the right (0.8 s) with "cost" at the top of the y axis and "θ" at
  the right end of the x axis (written on "theta", 27.48), plus the x ticks.
- On "valley" (28.21): `b-curve` draws left to right (1.2 s). The gold ball appears on the curve at θ = π/2
  (x 1600, right wall) and a gold trail dot `b-dot0` under it.
- On "zero" (28.84): a small ink "0" tick and an arrow point at the bottom of the valley at π/3, label
  "zero cost" (40 px) written on "bottom" (29.4).
- Leaves: "how far off = cost" label fades at line 6 start; bar, dial, chart stay.

### Line 6 (30.15 to 34.41) "Its slope, called the gradient, shows which way is downhill, so we nudge that way."
- On "slope" (30.16): a short ink tangent line draws through the ball (the slope at θ = π/2 rises to the right),
  with "slope" written above it.
- On "gradient" (31.04): "= gradient" writes after "slope" (44 px).
- On "downhill" (32.65): a gold arrow along the curve points left and down from the ball, labelled "downhill".
- On "nudge" (33.61): the step happens: θ goes from 0.50π to 0.38π (onFrame, 0.8 s). Together: the dial pointer
  turns back a little, "θ = 0.38π" updates, the ball rolls left down the curve, the P(1) bar drops to 32%, and the
  readout reads "P(1) = 32%". `b-dot1` is left at the new ball spot. The "downhill" arrow fades as the ball moves.

### Line 7 (34.71 to 39.34) "Run, measure, nudge again, and the chance slides from fifty percent to twenty five."
- On `cue(7, "run")` (34.68): the circuit strip's wire flashes gold left to right (a gold dash travels along it,
  0.4 s); on "measure" (35.4) the meter needle flicks; on "nudge" (35.56) the knob on the RY box ticks.
- Steps 2, 3, 4 run one after another from `cue(7, "again")` (35.86) to `cue(7, "to")` (38.73), each about 0.9 s,
  each smaller than the last: θ 0.38π → 0.35π → 0.34π → 0.33π. Ball, pointer, bar and readouts move together;
  `b-dot2..4` drop at each stop; the tangent line follows the ball and flattens.
- On "from" (37.69): "50%" (ink, struck through with one ink line) writes small above the bar; on "to" (38.73) the
  readout settles on "P(1) = 25%" (gold) and "θ = π/3" replaces "θ = 0.33π"; the bar top meets the dashed
  target line and a gold tick draws beside it.

### Line 8 (39.64 to 44.38) "Each time, the new theta is the old theta minus a small step times the slope."
- On "Each" (39.8): the dial, the bar and the circuit strip blur; the chart moves (0.9 s) to centre and up, so it
  spans x 600 to 1320, y 140 to 560 (keep it; it is the picture of the rule).
- Under the chart the rule writes on its spoken words, 72 px, centred at (960, 720):
  "new θ" on "new" (40.44), "= old θ" on "old" (41.57), "− step" on "minus" (42.32), "× slope" on "times" (43.59).
- On "slope" (44.14): the tangent at the first ball spot redraws gold, and a little gold arrow from "× slope" in the
  rule to it.
- Leaves: chart and rule blur at line 9 start. (The rule returns on the closing card.)

### Line 9 (44.68 to 49.59) "An ordinary program, the optimizer, runs this loop, just as AI models are trained."
- On "ordinary" (44.91): the laptop from line 1 redraws at the centre (x 800 to 1120, y 400 to 620); on
  "optimizer" (46.32) "optimizer" writes on its screen (44 px).
- On "loop" (47.65): three small boxes on a circle round it draw one after another with curved arrows between
  them: "run circuit" (top, x 960, y 200), "measure cost" (right, x 1400, y 620), "nudge θ" (left, x 520, y 620),
  40 px labels. A gold dot travels round the loop (onFrame, one lap every 1.6 s) through to the line's end.
- On "AI" (48.49): at the far right (x 1450 to 1720, y 180 to 380) a small neural net doodle (3, 4, 2 nodes
  joined by lines) draws, labelled "AI model" (40 px), with an ink "≈" between it and the loop's "run circuit" box.
- Leaves: all of it blurs at line 10 start.

### Line 10 (49.89 to 53.68) "But here the guitar picture breaks: you hear a pitch the moment you pluck."
- On "guitar" (50.61): the guitar redraws smaller at left (x 180 to 820, y 380 to 620) with the ear above it.
- On "breaks" (51.44): a hand-drawn crack (zigzag ink line) splits the board down the middle (x 960, y 200 to 760).
- On "hear" (52.19): one sound line from string to ear, and on "moment" (53.01) the tuner needle snaps to its
  value at once with a gold "instant" (44 px) under it. Right half is empty and waiting for line 11.

### Line 11 (53.98 to 58.95) "Each run gives just a zero or a one, so we estimate the cost from many runs, called shots."
- Right half (x 1020 to 1740). On "run" (54.34): a tiny circuit (|0⟩, RY, meter) draws at top right.
- On "zero" (55.16) and "one" (55.63): two outcome coins pop out of the meter: an ink "0" coin, then a gold "1" coin
  (each a circle r 34 with the digit, 48 px). Never a half coin.
- On "estimate" (56.31): coins pour into two piles (a row of small 0 coins and a row of small 1 coins), and an
  estimate bar for P(1) draws with a live label driven by `onFrame`: "10 runs: 60%", then "100 runs: 47%",
  then "1000 runs: 50%" by "called" (58.49). The bar's top wobbles less each time.
- "shots" is heard at the start of line 12 (58.79): on `cue(12, "shots")` the word "shots" writes in gold under the
  piles (56 px), "= runs" after it in ink.

### Line 12 (59.25 to 63.99) "Even the slope must be measured, by rerunning with theta shifted pi over two each way."
- On "Even" (59.52): the guitar half blurs and the crack fades; the shots panel slides left and shrinks.
- On "slope" (59.78): at the centre (x 960, y 420) the dial draws small (r 90) at θ = π/2, with "θ" under it.
- "theta shifted" was heard as one token "theta-shifted" (62.16): cue it with `cue(12, "theta")`. Then two more
  small dials draw left (x 520) and right (x 1400) of it: left "θ − π/2" (pointer at 0), right "θ + π/2" (pointer
  at π), labels 44 px. Under each a few coins and a reading: "0%" (left, all ink 0 coins) and "100%" (right, all
  gold 1 coins).
- On "each" (63.75; "way" is heard at 63.98 in line 13's window): two gold arrows from the side readings meet in a
  "compare" box under the middle dial, which writes "slope" (44 px).

### Line 13 (64.29 to 66.36) "So every listen costs many runs."
- On "listen" (64.9): a small ear icon draws by the "compare" box; on "costs" (65.24) a gold run counter beside it
  ticks up fast (onFrame) "runs: 0 → 3000" (three dials times about 1000 shots each), and the coin piles grow.
- Leaves: everything blurs at `cue(14, "quantum")` (66.47; "And" is heard at the end of line 13).

### Line 14 (66.66 to 72.57) "And quantum learning isn't automatically better: today it often matches ordinary computers, or does worse."
- On "quantum" (66.47): a hand-drawn balance scale draws at centre (beam x 560 to 1360 at y 360, post down to y 760).
  Left pan holds the tiny circuit labelled "quantum" (44 px); right pan holds the laptop labelled "ordinary" (44 px).
- On "automatically" (67.87): "not automatically better" writes at top (y 170, 56 px, ink). Fine as said kindly.
- On "matches" (70.2): the beam settles level (onFrame) and "tie" writes under the post.
- On "worse" (72.21): the beam tips so the ordinary side goes down (heavier = better result), 0.8 s, and "tie"
  rewrites as "or worse" in ink. Nothing in gold here except the beam pivot dot.

### Line 15 (72.87 to 75.77) "The point is knowing how it works, and where it might help."
- On "point" (73.13): the scale blurs; the loop picture from line 9 redraws small at centre, and a magnifying glass
  draws over it on "works" (74.19), labelled "how it works" (44 px).
- On "where" (74.64): a small signpost at right draws with a gold "?" on its board, labelled "where it might help"
  (44 px).
- Leaves: all blur at `cue(16, "So")` (76.3).

### Line 16 (76.07 to 81.00, then the 2.6 s hold) "So a trainable circuit has knobs, and an optimizer turns them downhill on a measured cost."
- Closing card, stays to the end:
  - On "trainable" (76.36): circuit across the top (y 160 to 300, x 220 to 1600): "|0⟩", wire, RY(θ) box with its
    tiny knob, meter. On "knobs" (77.38) the tiny knob turns gold.
  - On "optimizer" (78.12): the laptop draws small at right of the meter (x 1450 to 1700, y 150 to 330) with a curved
    ink arrow back over the circuit to the knob, labelled "optimizer" (40 px).
  - On "downhill" (79.27): a small cost valley draws at centre left (x 260 to 760, y 420 to 680) and the gold ball
    rolls to its bottom (onFrame, 1 s).
  - On "measured" (80.0): the rule writes big at right of the valley, 96 px, centred at (1260, 560):
    "new θ = old θ − step × slope", then a gold underline on "cost" (80.51) under the valley's y label "cost".
  - Hold: the gold ball keeps settling with a tiny damped wobble at the valley bottom, and the tiny knob on the RY
    box twitches every 1.2 s (onFrame), so the last frames are not static.

## Cue notes (from the transcript)
- Words heard in a neighbour's window: "again" (line 2) in line 3, "Its" (line 6) at 29.97 just before line 6's
  start, "Run" (line 7) at 34.68, "pluck" (line 10) in line 11, "shots" (line 11) in line 12, "way" (line 12) in
  line 13, "And" (line 14) in line 13. Cue those words in the line where they were heard.
- "R Y" heard as one token "R-Y": cue "knob" instead. "hear" (line 2) heard as "here": `cue(2, "here")`.
  "one" (line 4) heard as "1": cue "comes". "from" (line 11) heard as "for": do not cue it. "theta shifted" heard
  as "theta-shifted": `cue(12, "theta")`. "fifty percent" and "twenty five" heard as "50%" and "25.": cue "from"
  and "to" in line 7.

## Captions: phrase pairs for scene.mjs
```js
export const phrases = [
  ["fifty percent", "50%"],
  ["twenty five", "25%"],
  ["a quarter of the time", "¼ of the time"],
];
```
Built in already: "R Y" to RY, "pi over two" to π/2, "theta" to θ. "half the time" stays in words (it reads naturally).
No respellings needed: qubit, optimizer, gradient, trainable and every other real word were heard.

## Glyph note
Labels hand-draw only θ π ψ φ α β ω Σ ⊗ | ⟨ ⟩ √ → ≈. Check that Caveat renders ¼, ×, the minus sign and % ;
if any is missing, draw it as a small inline SVG stroke in the label (as lessons 1 and 8 did for −½).
