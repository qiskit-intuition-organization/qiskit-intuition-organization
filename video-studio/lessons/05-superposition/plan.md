# Lesson 5: Superposition with H. Beat plan

Voiced with Emma: 17 lines, 259 words, narration ends at 82.87 s (TOTAL about 85.5 s with the hold).
Times below are from `project/assets/vo/timing.json` and are only a guide: always place things with `cue()`.

## The pictures (built once, reused)

- **Ball** (Bloch sketch). Ink circle, centre (700, 480), radius 250 (y 230 to 730). Equator: a dashed ink
  ellipse, rx 250, ry 72. A short ink tick and label at each pole: "0" above the top (y about 190) and
  "1" below the bottom (y about 770), 56 px. Tiny ink dot at the centre.
- **Arrow** (the state). Gold, from the centre, length 240, drawn as one group whose rotation is set every
  frame by `onFrame` with `sched()` from a single angle value `tilt` (0 = up, 90 = on the equator facing
  you, 180 = down). In the sketch, "facing you" is the front-left point of the equator ellipse
  (about (520, 532)); map `tilt` to a 2D tip position along the arc up -> front-left -> down so that
  tilt 90 lands exactly on the dashed ellipse. Gold dot at the tip.
- **Bars** (chance of reading 0 and 1). Right of the ball, x 1180 to 1640, baseline y 760, max height 420.
  Two hand-drawn bar outlines labelled "0" and "1" under them (56 px), and a live percentage above each
  (48 px). Heights follow the arrow every frame: P(0) = cos squared of tilt over two, P(1) = sin squared.
  The taller bar is gold hachure; at fifty fifty both are gold hachure.
- **Circuit strip**. Top, y about 150 to 250, x 380 to 1300: "|0⟩" then a wire with a hand-drawn "H" box,
  room for a second "H" box later. Ink; the box being applied right now flashes gold.
- **Compass**. Big centred rose, centre (960, 480), radius 240. Ink ring, small ticks, "N" top and "S"
  bottom (64 px), "E" right, "W" left (48 px). Small notes beside N and S: "0" and "1" (56 px).
  Needle: a slim double-ended rough diamond, gold, rotating on `onFrame`.
- **Coin**. Ink ellipse with a hachure face and a "0" on it, about 200 px wide; spinning = scaleX
  oscillating between 1 and 0.1 with a few ink motion arcs.

## Beats (line number, from 0)

**0** (0.4 to 5.0) "Here's a puzzle. Can you make a qubit's answer random, then undo it so it's certain again?"
- Title block holds from 0 to about 3.4 s.
- Below the title (y 420 to 760, centred): on "random" write a row of readings "1 0 0 1 1 0 1" (ink, 64 px),
  with a small "random" label under it.
- On "undo" (about 3.5 s) blurOut the title, and draw a gold looping arrow from the end of the row back to
  its start.
- On "certain" write a second row below it, "0 0 0 0 0 0 0", in gold, with "certain" under it.
- Leaves: both rows and the loop blur out at the start of line 1.

**1** (5.3 to 9.1) "A tossed coin can't. Once it spins, its starting side is lost."
- On "coin" draw the coin, centre (960, 460), showing "0" face up; tiny label "start: 0" beside it.
- On "spins" the coin rises a little and starts spinning (scaleX oscillation, motion arcs drawn).
- On "starting" the "start: 0" label pulses once; on "lost" (estimate; the word is filed under line 2 in
  timing.json) it gets a hand scribble through it and a "?" writes over the spinning coin.
- Leaves: coin and labels blur out at the start of line 2.

**2** (9.4 to 13.4) "Let's draw the qubit as an arrow in a ball, up for zero and down for one."
- On "arrow" draw the gold arrow pointing up from the centre (tilt 0), 0.8 s.
- On "ball" draw the circle (1.2 s) and the dashed equator (0.8 s), ink.
- On "up" the top tick and "0" write in; on "down" a dashed ink ghost arrow points down for about 1.5 s
  and "1" writes in at the bottom (on "one", estimate: filed under line 3); the ghost fades by the end of
  the line.
- Gold: only the real arrow.

**3** (13.7 to 17.8) "It starts pointing up, a state written ket zero, so it always reads zero."
- On "ket" write "|0⟩" in gold next to the arrow tip (about (760, 215), 64 px).
- On "always" draw the bars (outline, labels "0" and "1"); bar 0 fills to 100% gold, bar 1 stays empty,
  live labels "100%" and "0%".
- Ball, arrow and bars stay into line 4.

**4** (18.1 to 24.8) "Now apply the Hadamard gate, H for short. Like any gate, it turns the arrow, tipping it flat onto the equator, facing you."
- On "Hadamard" draw the circuit strip: "|0⟩", a wire, and the first H box (ink); the "H" letter writes in
  gold on "H" (estimate: the transcriber hears "Hfor", so `cue(4, "H")` falls back to the letter count,
  which is fine).
- On the second "gate" (`cue(4, "gate", 1)`) write a small ink note under the H box: "gate = a turn".
- "|0⟩" by the arrow tip fades at "turns".
- On "tipping" `tilt` goes 0 to 90 over 1.3 s (power2.inOut): the arrow swings down to the front-left of the
  equator. The bars move with it, ending at 50% and 50%.
- On "equator" the dashed ellipse briefly brightens to gold for about 1 s, then back to ink.
- On "facing" a small ink note "facing you" with a tiny arrow points at the tip.
- Leaves: ball, bars and strip blur out at the start of line 5 (the strip is redrawn in line 8).

**5** (25.1 to 30.4) "Picture a compass needle. North means zero, south means one, and our needle now points east."
- On "compass" draw the compass ring and ticks (1.2 s); needle drawn pointing north on "needle".
- On "North" the "N" and its note "0" write in; on "south" (check it: in one earlier take the joined
  transcript heard "North" as "South"; if so, use `cue(5, "south", 1)`) the "S" and its "1" write in.
  "E" and "W" write in quietly.
- On "east" (estimate; the word is filed under line 6) the needle swings from north to east over 1 s.

**6** (30.7 to 35.5) "That's a definite direction. It's only the question, north or south, that has no good answer."
- On "definite" write "a definite direction" under the needle tip in ink and draw a gold underline.
- On "question" write "north or south?" at the right (about x 1290 to 1700, y 360, 56 px).
- On "north" a dotted ink line runs from the needle tip to N; on "south" a matching one to S. Write
  "equally far" between them; the two lines are the same length, which is the whole point.
- Leaves: the dotted lines, the question and the "definite" note fade at line 7.

**7** (35.8 to 39.6) "Asking that is called measuring, and each answer comes up half the time."
- On "Asking" the compass shrinks and slides left (centre about (520, 480), scale 0.65); "north or south?"
  writes again small over it.
- On "measuring" write "measuring = asking 0 or 1?" (ink, 48 px) at the top right, and draw a tally board at
  the right (x 1000 to 1700): two columns headed "0" and "1". Over the next 2 s a fixed shuffled
  sequence of 16 readings drops in one by one (each a small handwritten digit, about 0.12 s apart, one
  fresh arrow per reading), and two counters tick up together, ending 8 and 8.
- On "half" write "half each" in gold under the board (80 px).
- Leaves: compass and board blur out at the start of line 8.

**8** (39.9 to 44.7) "Here's the surprise. Before measuring, apply H again, and the arrow tips straight back up."
- At line start the ball comes back exactly as at the end of line 4 (arrow on the equator, bars at
  50%/50%, strip with one H), fading in over 0.4 s.
- On "measuring" a small hand-drawn meter (box with a half dial) appears at the end of the wire with an
  ink cross through it: no measuring yet.
- On "apply" the second H box draws on the strip, before the crossed meter, and its "H" writes in gold.
- On "tips" `tilt` goes 90 to 0 over 1.3 s; bars return to 100% and 0%.

**9** (45.0 to 48.6) "Now it reads zero every time. Nothing random is left."
- On "reads" write a row of readings "0 0 0 0 0 0" under the bars in gold, one after another.
- On "Nothing" write "certain again" (ink) and tick it with a small gold check stroke.
- Leaves: the readings row, note and crossed meter fade at line 10.

**10** (48.9 to 53.3) "So H isn't a coin toss. It's a turn, and the same turn again undoes it."
- On "coin" a small coin sketch (about 120 px) appears at the top right (about (1560, 200)) and on "toss"
  an ink cross is drawn over it.
- On "turn" (first) `tilt` goes 0 to 90 over 1 s and a curved ink arrow labelled "H" draws along the path.
- On "same" `tilt` goes 90 back to 0 over 1 s and a second curved arrow labelled "H" draws on the way back.
- On "undoes" write "H then H: back home" (56 px) under the ball, "back home" in gold.
- Leaves: coin, curved arrows and note blur at line 11.

**11** (53.6 to 57.0) "Randomness only appears when you measure an arrow between up and down."
- At line start (the joined transcript hears "Randomness" as "Compass", so use the line start, not
  `cue(11, "Randomness")`; the line on its own is heard cleanly) write "random" small over the bars.
- On "measure" draw the measurement meter beside the bars, ink, and let `tilt` ease to 90 again over 1 s.
- On "between" shade the band around the equator with faint gold hachure and label it "random answers";
  the two poles get small notes "certain".
- Leaves: the ball, bars, band and meter blur out at the start of line 12.

**12** (57.3 to 61.7) "Here the compass breaks down. A real needle pointing east would answer neither."
- The compass returns at the centre with the needle pointing east (fade in 0.4 s).
- On "breaks" draw a small hand-drawn crack line across the compass rim.
- On "neither" a speech bubble from the needle tip writes "neither!" (ink, 56 px).

**13** (62.0 to 66.1) "A qubit can't. It must answer zero or one, and then it becomes that answer."
- On "qubit" the compass blurs out; the ball returns with the arrow on the equator and bars at 50/50.
- On "zero" bar 0 pulses, on "one" bar 1 pulses.
- On "becomes" the arrow snaps to pointing down (tilt 90 to 180 in 0.35 s, a snap, not a turn), bar 1 jumps
  to 100% gold and bar 0 empties; the "1" at the bottom pole goes gold. Showing a 1 here, not a 0,
  keeps it from looking like the answer is always zero.
- Leaves: everything blurs out at the start of line 14.

**14** (66.4 to 73.1) "In symbols, H turns ket zero into ket plus: ket zero plus ket one, each weighted one over root two."
- A one-line equation, centred at y about 380, 96 px, written left to right in the order it is spoken:
  `H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2`.
  "H|0⟩" on "turns" (estimate: heard as "Hturns", so cue the first "ket"), "= |+⟩" in gold on "plus"
  (the first one), then "= (|0⟩ + |1⟩)" on the second "ket" (`cue(14, "ket", 2)`), and "/√2" on "root".
- On "weighted" two small gold notes "1/√2" write in under |0⟩ and |1⟩ (48 px), each with a tiny arrow
  up to its ket: these are the weights the voice names.
- A small ball (radius 110, centre (960, 690)) draws under it with the arrow on the equator, tip labelled
  "|+⟩" in gold, so the symbol is tied to the picture.

**15** (73.4 to 76.4) "Squared, that weight gives each answer's chance, one half."
- On the line start ("Squared" is filed under line 14, so use `cue(15)`) the small ball blurs out and,
  under each "1/√2" note, "(1/√2)² = ½" writes in (ink, 56 px).
- On "chance" two small bars labelled "0" and "1" draw at the right (x 1300 to 1640) and on "half" both
  fill to ½ in gold hachure. This is the same fifty fifty the tally showed.
- Leaves: the weight notes and small bars blur out at the start of line 16.

**16** (76.7 to 82.9, then the 2.6 s hold) "So H tips the arrow onto the equator, a definite state with random answers, and a second H brings it home."
- At line start ("So" is filed under line 15) the equation moves up and shrinks (to y about 170, 64 px).
- Closing picture: ball on the left (centre (620, 540), radius 230) with the arrow up; a two-box strip
  "|0⟩ H H" under the equation.
- On "tips" (estimate: heard as "Htips") `tilt` goes 0 to 90; on "definite" write "definite state" (ink) by
  the tip; on "random" small 50/50 bars at the right fill gold, labelled "random answers".
- On "second" `tilt` goes 90 back to 0; on "home" write "back home" by the top pole in gold.
- Everything stays through the hold. Nothing static: the gold tip dot breathes gently (scale 1 to 1.15)
  during the hold.

## Captions: phrase pairs to add in scene.mjs

```js
export const phrases = [
  ["ket zero plus ket one", "|0⟩ + |1⟩"],
  ["one over root two", "1/√2"],
  ["ket zero", "|0⟩"],
  ["ket one", "|1⟩"],
  ["ket plus", "|+⟩"],
  ["root two", "√2"],
];
```
Line 14 then reads "In symbols, H turns |0⟩ into |+⟩: |0⟩ + |1⟩, each weighted 1/√2." Longer pairs first.

## Respellings

None needed. "Hadamard", "qubit", "ket", "equator", "measuring" and "squared" were all heard. "H" is heard
joined to the next word ("Hfor", "Hagain", "Hisn't", "Hturns", "Htips", "Hbrings"), which is only the
transcriber; the voice says the letter. "Randomness" (line 11) is heard as "Compass" in the joined
transcript, but transcribing that line on its own gives every word cleanly, so the voice is fine.

## Notes for the scene writer

- Last words of a line are often filed under the next line in timing.json (lost, one, zero, east, time, up,
  it, down, Squared, So), because the transcript runs a little late. `cue()` then estimates them from the
  letters, which is close enough. Same for "H" everywhere.
- Physics notes, keep them true on screen: the second H is applied before any measurement (the crossed
  meter in line 8); the 16 readings in line 7 come from 16 fresh arrows, never one arrow measured again;
  the weights are 1/√2 and only their squares, ½, are chances, so never label a bar "0.707".
- The tilt 90 to 0 return in lines 8, 10 and 16 retraces the drawn arc. A real second H keeps turning
  the same way about H's diagonal axis and closes the circle; the retrace is a fair simplification for this
  2D sketch, so do not label the path with a direction of rotation.
