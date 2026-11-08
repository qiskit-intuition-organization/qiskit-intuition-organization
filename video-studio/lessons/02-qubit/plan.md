# Lesson 2, "What is a qubit?": beat plan

Voice: Emma, 17 lines, 254 words, narration ends at 75.60 s, film about 78.2 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json` (re-run narrate before trusting them after any edit).

Through line: switch (a bit) -> weather vane (the analogy) -> the arrow on a globe (the real idea)
-> live probability bars as the arrow tilts -> the snap -> many repeats and a tally (where the vane
breaks) -> "not secretly 0 or 1" -> the formula -> closing card. One main object at a time.

## Recurring objects and where they live (all inside x 140..1780, y 60..860)

- **Switch** (lines 0 to 1): a wall plate, centre (960, 540), about 220 x 340, toggle hatched ink,
  "OFF" / "ON" ink labels 48 px above and below, "0" and "1" beside them. Below the title block.
- **Weather vane** (lines 1 to 3, then a small copy on 10 to 11): a little roof ridge at y 760,
  a post up to a pivot at (960, 470), the vane an arrow 420 px long with a feathered tail, rotated
  by `onFrame`. Fixed cross arms with "N" (top) and "S" (bottom) 56 px ink labels; "E"/"W" are left
  out on purpose, because the only question allowed is north or south.
- **Globe** (lines 4 to 16): circle centre (720, 470), r 270 (y 200..740), dashed equator ellipse
  (rx 270, ry 70), small dots at both poles. Labels: "|0⟩" above the north pole (y about 165,
  64 px), "|1⟩" below the south pole (y about 790, 64 px). The **state arrow** is gold, from the
  centre, tilt angle `tilt` from straight up, driven by `onFrame` + `sched()` (rotation pivot at the
  centre; 0 = north). Draw it as a group rotated by `tilt` so the head stays hand-drawn.
- **Bars** (lines 8 to 10): two hand-drawn bars at x 1260 and x 1480, base y 700, max height 420,
  labelled "0" and "1" (56 px) below and live percentages above (48 px). Heights follow the arrow:
  P(0) = cos²(tilt/2), P(1) = sin²(tilt/2). The bar that is currently larger is gold, the other ink.

## Line by line

**0** (0.40 to 4.71) "A computer bit is like a light switch. It's either off or on, zero or one."
- Title block shows (kit). Switch draws at "light" (1.6), 1.6 s, centred low (y 400..760) so it
  never enters the title area.
- "off" (3.6): toggle snaps down, "OFF" and "0" write. "on" (4.0): toggle snaps up, "ON" and "1"
  write; the toggle is gold while on. "zero" (4.3) "0" flashes gold briefly, "one" (end) "1" gold.
- blurOut("#b-title") at about 3.3 (title has had 2.9 s).

**1** (5.01 to 9.08) "So what is a qubit, the quantum kind of bit? Picture a weather vane instead."
- "qubit" (5.5): a big handwritten "qubit?" writes at top centre (y 140, 80 px, gold "?").
- "weather" (8.3): switch blurs out; roof ridge and post draw (0.8 s), then the vane draws at "vane"
  (8.5), 1.4 s. "qubit?" fades at 8.8.

**2** (9.38 to 13.67) "It can point any way, but you may ask it just one question: north or south?"
- "point" (9.7) to "way" (10.3): the vane swings around smoothly (onFrame, about 1.3 turns, easing).
  Never static: it keeps drifting gently through the line, settling at about 50 degrees east of north.
- "question" (11.9): a speech bubble draws at top left of the vane (x 260..640, y 150..300),
  "north or south?" writes in at "north" (13.0), "north" and "south" both gold. N and S labels pulse gold.

**3** (13.97 to 18.24) "It answers with one word, then instantly swings to point exactly that way."
- "answers" (14.2): bubble blurs out; a second bubble from the vane writes "north!" (gold) at "word" (15.3).
- "swings" (16.7): vane swings to point exactly north in 0.5 s (power2.out), gold tick on "N".
  Small motion lines either side of the vane on the swing.

**4** (18.54 to 23.13) "A qubit works like that. Its state, everything about it, is an arrow on a globe."
- "qubit" (18.8): the whole vane scene shrinks to a small icon at top right (x 1480..1700, y 90..300)
  and stays dim (it returns on line 10). 0.9 s move.
- "state" (20.6): the word "state" writes at right (x 1240, y 300, 56 px).
- "arrow" (22.2): the gold state arrow draws from the centre (0.6 s), pointing a little east of north
  (tilt 40 degrees). "globe" (est. about 22.9): the globe circle and equator draw (1.4 s, the arrow on top).
  A small ink line ties "state" to the arrow ("state = this arrow").

**5** (23.43 to 27.39) "Straight up is the state we call ket zero, and straight down is ket one."
- "Straight up" (23.7): arrow swings to straight up (0.8 s). "ket zero" (25.2): "|0⟩" writes at the
  north pole, gold while the arrow is there.
- "straight down" (25.8 to 26.2): arrow swings to straight down (1 s). "ket one" (26.7): "|1⟩" writes
  at the south pole and goes gold; "|0⟩" returns to ink.
- "state" label from line 4 fades out at 24.0.

**6** (27.69 to 30.89) "Every direction in between is a perfectly good state too."
- "direction" (27.8): the arrow sweeps slowly from south through the equator to about 60 degrees from
  north while three faint ink "ghost" arrows draw at other tilts (one at 30, one at 100, one at 140
  degrees) and fade by 30.6. A small gold tick "✓" style mark by the arrow tip on "good" (30.2),
  drawn as an svg path. Nothing static: the sweep runs across the whole line.

**7** (31.19 to 35.78) "Here's the catch: you never see the arrow, and measuring it only ever gives zero or one."
- "catch" (31.7): a hand-drawn cloud (ink hachure, 30 percent opacity) rolls over the globe at
  "never see" (32.7), hiding the arrow; a small closed-eye sketch beside it, label "you can't see this" (44 px).
- "measuring" (33.8): a measurement box draws at right (x 1240..1460, y 400..540) with a little meter
  needle, label "measure" (48 px) above; an arrow from the globe to the box.
- "zero" (35.3) and "one" (35.7): two big outputs pop out to the right of the box, "0" then "1"
  (80 px), stacked, with "or" between, both ink. The cloud lifts at end of line (35.7, 0.4 s).

**8** (36.08 to 39.81) "The closer the arrow is to the north pole, the more likely you get zero."
- Box, outputs and eye blur out at 36.1. The two bars draw at "closer" (36.3), 1 s, with "0" and "1"
  labels and live percentages (start values from the current tilt).
- "north pole" (37.5): the arrow tilts slowly from 60 degrees to 15 degrees (onFrame, to 38.9);
  the "0" bar grows to about 98 percent, gold. A gold arc from the north pole to the arrow tip shows
  how close it is.

**9** (40.11 to 43.59) "On the equator it's fifty fifty, and below it, one is more likely."
- "equator" (40.3): the equator ellipse goes gold and the arrow tilts to exactly 90 degrees (arriving
  by "fifty" at 41.0). Bars read 50% and 50%, both ink, and a small "50/50" label writes between them.
- "below" (42.1): equator returns to ink; the arrow tilts on to 135 degrees by 43.3. Bars read
  15% and 85%; the "1" bar is gold. (cos²(67.5°) is 0.146, sin² is 0.854.)

**10** (43.89 to 47.52) "And just like the vane, once it answers, the arrow snaps to that pole."
- "vane" (44.8): the small vane icon at top right brightens and swings to "S" (echo of line 3).
- "answers" (45.4): a big "1" (gold, 80 px) pops beside the measurement point (right of the globe,
  x 1120, y 700) and the bars collapse: "1" to 100%, "0" to 0% (0.3 s).
- "snaps" (46.4): the arrow snaps to straight down in 0.25 s (power3.out), "|1⟩" goes gold; a few
  short motion ticks around the south pole.

**11** (47.82 to 51.68) "Here's where the vane breaks down. You could walk up and look at a real one."
- 47.8: bars, the "1" and the arrow on the globe blur out; the globe stays dim (opacity 0.35).
  The vane icon grows back to centre right (x 1180..1560) at "vane" (49.0).
- "breaks" (49.1): a small gold crack line draws across the space between globe and vane.
- "look" (50.8): an open-eye sketch with a dashed sight line to the vane writes in, label "you can see it".

**12** (51.98 to 57.10) "Nobody can see a qubit's arrow, so we prepare the same qubit many times and count the answers."
- 52.0: vane, eye and crack blur out; the globe returns to full ink, centred left. "see" (53.0): a
  closed eye with a cross over the sight line toward the globe.
- "prepare" (54.3): to the right, a row of small identical globes (each with the same faint arrow at
  60 degrees) draws one after another, five of them, x 1150..1730, y 220.
- "count" (56.0): under them a tally grid fills fast: 20 small cells (4 rows of 5, x 1150..1700,
  y 330..620), each writing "0" or "1" in turn (15 zeros, 5 ones, mixed order), onFrame driven,
  finishing at 57.4. Ones are ink, zeros ink; a counter label "0: 15  1: 5" updates live below
  (y 690, 48 px).

**13** (57.40 to 60.73) "Those counts tell us how far the arrow tilts from the north pole."
- "counts" (57.7): the counter turns into "0: 75%   1: 25%" (gold on 75%).
- "arrow" (59.2): the arrow draws back on the big globe at 60 degrees (gold), and a gold arc from
  the north pole to the arrow with the label "tilt" (56 px) draws at "tilts" (59.4). (75 percent
  zeros means cos²(tilt/2) = 0.75, so tilt is 60 degrees. Correct.)
- Only the tilt is claimed, not the direction around the globe, which matches the narration.

**14** (61.03 to 65.70) "And a tilted arrow isn't secretly zero or one. It truly points in between."
- 61.0: grid, small globes and counter blur out. "secretly" (62.5): at right, an upturned cup sketch
  hiding a coin, label "secretly 0 or 1?" (48 px); at "isn't" (62.1) is too early, so the cup draws at
  62.3 and a big ink X strikes it at "one" (63.8).
- "truly" (64.2): the arrow on the globe glows gold (stroke width up), and the label "really in
  between" writes beside its tip (48 px, gold). The cup and X blur out at 65.4.

**15** (66.00 to 71.38) "In symbols, the state is alpha ket zero plus beta ket one, two numbers that set the odds."
- "symbols" (66.3): the globe shrinks to the left (centre 420, 470, r 200, 0.9 s). The formula writes
  at right, centred x 1220, y 380, 90 px: "|ψ⟩ = α|0⟩ + β|1⟩", in pieces cued to the words:
  "|ψ⟩ =" at "state" (66.8) with a small ink label "the state" under "|ψ⟩"; "α|0⟩" at "alpha" (67.5);
  "+ β|1⟩" at "beta" (68.5).
- "numbers" (69.9): α and β turn gold, with two small arrows down to two mini bars (P(0) and P(1),
  matching the 60 degree arrow: 75% and 25%) at y 560..700, label "set the odds" (48 px) at "odds" (71.0).

**16** (71.67 to 75.60, then the 2.6 s hold) "So the state is the arrow, and a measurement only ever hands you one bit."
- 71.6: mini bars and "set the odds" blur out; the formula moves up and shrinks (y 180, 64 px, ink).
- "arrow" (72.8): a gold underline under the globe's arrow and the label "state = arrow" (64 px, gold)
  writes to the right of the globe (x 700, y 400).
- "measurement" (73.8): an arrow from the globe to a small measure box (x 1250, y 560), and out of
  it a single big "0" (90 px, ink) at "one bit" (75.0), boxed, with the label "one bit" (56 px).
- Closing picture holds through the end: small formula at top, globe with gold arrow at left,
  "state = arrow", box -> "0" "one bit". A slow drift of the arrow (a few degrees) and a gentle gold
  pulse on "state = arrow" keep it alive during the hold.

## Gold, by beat
Line 0 toggle when on; 1 "?"; 2 "north", "south"; 3 "north!"; 4 to 16 the state arrow; 5 the pole
label the arrow sits on; 8 the larger bar; 9 the equator then the "1" bar; 10 the "1" outcome; 11
the crack; 13 the "75%" and tilt arc; 14 "really in between"; 15 α and β; 16 "state = arrow".

## Captions: phrase pairs to add in scene.mjs
```js
export const phrases = [
  ["alpha ket zero plus beta ket one", "α|0⟩ + β|1⟩"],
  ["ket zero", "|0⟩"],
  ["ket one", "|1⟩"],
];
```
"fifty fifty" -> "50/50" is already built in. Keep "zero or one" as words.

## Respellings for the voice
None needed. Every word was heard; the few "not heard" words in narrate's report are words whisper
put at the edge of the next line (globe, too, pole, one) and "fifty fifty" heard as 50-50.

## Notes for the scene author
- Some boundary words were assigned to the neighbouring line by the transcriber, so do not cue on
  them by line: line 0 "one" sits in line 1's words, line 4 "globe" in line 5's, line 6 "too" in 7's,
  line 9 "On" in line 8's, line 10 "pole" in 11's, line 11 "one" in 12's, line 15 "So" in 16's. Use
  the estimate (cue on a word not heard falls back to the text estimate) or cue a neighbour with an offset.
- Line 1 contains no "one", but its words list does: avoid `cue(1, "one")`.
- Physics checks: P(0) = cos²(tilt/2) everywhere; equator = 50/50; snap goes to the reported pole;
  the tally (15 of 20 zeros) and the 60 degree arrow agree; we never say "both at once".
