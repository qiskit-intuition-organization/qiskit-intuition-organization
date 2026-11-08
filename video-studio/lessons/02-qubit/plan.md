# Lesson 2, "What is a qubit?": beat plan

Voice: Emma, 17 lines, 260 words, narration ends at 77.82 s, film about 80.4 s with the 2.6 s hold.
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

**0** (0.40 to 4.30) "A computer bit is like a light switch, either off or on, zero or one."
- Title block shows (kit). Switch draws at "light" (1.5), 1.6 s, centred low (y 400..760) so it
  never enters the title area.
- "off" (3.08): toggle snaps down, "OFF" and "0" write. "on" (3.49): toggle snaps up, "ON" and "1"
  write; the toggle is gold while on. "zero" (3.80) "0" flashes gold briefly, "one" (about 4.2,
  heard in line 1's words, so use the estimate) "1" gold.
- blurOut("#b-title") at about 3.0 (title has had 2.6 s); nothing draws into the title area before it.

**1** (4.60 to 8.21) "So what's a qubit, a quantum bit? Picture a weather vane instead."
- "qubit" (5.30): a big handwritten "qubit?" writes at top centre (y 140, 80 px, gold "?").
  "quantum bit" (5.83): a small ink label "quantum bit" writes under it (48 px).
- "weather" (7.20): switch blurs out; roof ridge and post draw (0.8 s), then the vane draws at "vane"
  (7.59), 1.4 s. "qubit?" and "quantum bit" fade at 7.9.

**2** (8.51 to 12.48) "It can point any way, but you may ask it one question: north or south?"
- "point" (9.02) to "way" (9.52): the vane swings around smoothly (onFrame, about 1.3 turns, easing).
  Never static: it keeps drifting gently through the line, settling at about 50 degrees east of north.
- "question" (11.08): a speech bubble draws at top left of the vane (x 260..640, y 150..300),
  "north or south?" writes in at "north" (11.64), "north" and "south" both gold. N and S labels pulse gold.

**3** (12.78 to 17.04) "It answers with one word, then instantly swings to point exactly that way."
- "answers" (13.26): bubble blurs out; a second bubble from the vane writes "north!" (gold) at "word" (13.95).
- "swings" (15.32): vane swings to point exactly north in 0.5 s (power2.out), gold tick on "N".
  Small motion lines either side of the vane on the swing.

**4** (17.34 to 21.61) "A qubit is similar. Its state, everything about it, is an arrow on a globe."
- "qubit" (17.41): the whole vane scene shrinks to a small icon at top right (x 1480..1700, y 90..300)
  and stays dim (it returns on line 10). 0.9 s move.
- "state" (19.38): the word "state" writes at right (x 1240, y 300, 56 px); "everything" (19.62): a
  small ink label "= everything about it" writes under it (44 px).
- "arrow" (21.12): the gold state arrow draws from the centre (0.6 s), pointing a little east of north
  (tilt 40 degrees). "globe" (about 21.6, heard in line 5's words): the globe circle and equator draw
  (1.4 s, the arrow on top). A small ink line ties "state" to the arrow ("state = this arrow").

**5** (21.91 to 26.18) "Straight up, the north pole, is ket zero: a zero in a bracket called a ket."
- "Straight" (22.62): arrow swings to straight up (0.8 s). "north" (23.18): the north pole dot goes gold.
- "ket" (23.99): "|0⟩" writes at the north pole (64 px), gold while the arrow is there.
- "bracket" (25.25): the "|0⟩" label scales up briefly (1.3x) and two small gold ink curls point at its
  "|" and "⟩" (the bracket), then at "called" (25.77) a 48 px ink label "a ket" writes beside them.
- "state" labels from line 4 fade out at 22.6. The curls and "a ket" fade at 26.6.

**6** (26.48 to 31.19) "Straight down is ket one, and every direction in between is a perfectly good state."
- "Straight" (27.22): arrow swings to straight down (1 s). "ket one" (27.72): "|1⟩" writes at the south
  pole and goes gold; "|0⟩" returns to ink. Note: cue(6, "ket") returns 26.29, the end of line 5's "a
  ket"; use cue(6, "ket", 1) or cue(6, "down") for this beat.
- "direction" (28.78): the arrow sweeps slowly from south through the equator to about 60 degrees from
  north while three faint ink "ghost" arrows draw at other tilts (one at 30, one at 100, one at 140
  degrees) and fade by 30.9. A small gold tick mark by the arrow tip on "good" (30.74), drawn as an
  svg path. Nothing static: the sweep runs across the whole line.

**7** (31.49 to 35.93) "Here's the catch: you never see the arrow, and measuring only ever gives zero or one."
- "catch" (32.17): a hand-drawn cloud (ink hachure, 30 percent opacity) rolls over the globe at
  "never" (32.80), hiding the arrow; a small closed-eye sketch beside it, label "you can't see this" (44 px).
- "measuring" (34.08): a measurement box draws at right (x 1240..1460, y 400..540) with a little meter
  needle, label "measure" (48 px) above; an arrow from the globe to the box.
- "zero" (35.43) and "one" (35.81): two big outputs pop out to the right of the box, "0" then "1"
  (80 px), stacked, with "or" between, both ink. The cloud lifts at end of line (35.9, 0.4 s).

**8** (36.23 to 39.96) "The closer the arrow is to the north pole, the more likely you get zero."
- Box, outputs and eye blur out at 36.2. The two bars draw at "closer" (36.70), 1 s, with "0" and "1"
  labels and live percentages (start values from the current tilt, 60 degrees: 75% and 25%).
- "north" (37.87): the arrow tilts slowly from 60 degrees to 15 degrees (onFrame, to 39.3);
  the "0" bar grows to about 98 percent, gold. A gold arc from the north pole to the arrow tip shows
  how close it is.

**9** (40.26 to 43.74) "On the equator it's fifty fifty, and below it, one is more likely."
- "equator" (40.78): the equator ellipse goes gold and the arrow tilts to exactly 90 degrees (arriving
  by "fifty" at about 41.4; heard as "50-50", so the cue uses the estimate). Bars read 50% and 50%,
  both ink, and a small "50/50" label writes between them.
- "below" (42.55): equator returns to ink; the arrow tilts on to 135 degrees by 43.5. Bars read
  15% and 85%; the "1" bar is gold. (cos²(67.5°) is 0.146, sin² is 0.854.)

**10** (44.04 to 47.52) "Just like the vane, once it answers, the arrow snaps to that pole."
- "vane" (44.97): the small vane icon at top right brightens and swings to "S" (echo of line 3).
- "answers" (45.72): a big "1" (gold, 80 px) pops beside the measurement point (right of the globe,
  x 1120, y 700) and the bars collapse: "1" to 100%, "0" to 0% (0.3 s).
- "snaps" (46.78): the arrow snaps to straight down in 0.25 s (power3.out), "|1⟩" goes gold; a few
  short motion ticks around the south pole.

**11** (47.82 to 51.51) "Here the vane breaks down, though. You could walk up and look at a real one."
- 47.8: bars, the "1" and the arrow on the globe blur out; the globe stays dim (opacity 0.35).
  The vane icon grows back to centre right (x 1180..1560) at "vane" (48.42).
- "breaks" (48.67): a small gold crack line draws across the space between globe and vane.
- "look" (50.79): an open-eye sketch with a dashed sight line to the vane writes in, label "you can see it".

**12** (51.81 to 57.14) "Nobody can see a qubit's arrow, so we measure many qubits prepared the same way and count the answers."
- 51.8: vane, eye and crack blur out; the globe returns to full ink, centred left. "see" (52.47): a
  closed eye with a cross over the sight line toward the globe.
- "many" (54.39) to "way" (55.70): to the right, a row of five small identical globes (each with the
  same faint arrow at 60 degrees) draws one after another, x 1150..1730, y 220; at "prepared" (54.91)
  a 44 px label "prepared the same way" writes above them.
- "count" (56.06): under them a tally grid fills fast: 20 small cells (4 rows of 5, x 1150..1700,
  y 330..620), each writing "0" or "1" in turn (15 zeros, 5 ones, mixed order), onFrame driven,
  finishing at 57.5. All ink; a counter label "0: 15  1: 5" updates live below (y 690, 48 px).

**13** (57.44 to 60.77) "Those counts tell us how far the arrow tilts from the north pole."
- "counts" (58.02): the counter turns into "0: 75%   1: 25%" (gold on 75%).
- "arrow" (59.19): the arrow draws back on the big globe at 60 degrees (gold), and a gold arc from
  the north pole to the arrow with the label "tilt" (56 px) draws at "tilts" (59.50). (75 percent
  zeros means cos²(tilt/2) = 0.75, so tilt is 60 degrees. Correct.)
- Only the tilt is claimed, not the direction around the globe, which matches the narration.

**14** (61.07 to 67.04) "And a tilted arrow isn't secretly zero or one, waiting to be found out. It truly points in between."
- 61.1: grid, small globes and counter blur out. "secretly" (62.70): at right, an upturned cup sketch
  draws (from 62.5), label "secretly 0 or 1?" (48 px) writes under it.
- "waiting" (63.69): the cup lifts a little to peek; "found" (64.76): a big ink X strikes the cup and
  label (nothing hidden under it).
- "truly" (65.98): the arrow on the globe glows gold (stroke width up), and the label "really in
  between" writes beside its tip (48 px, gold) by "between" (66.68). The cup and X blur out at 66.4.

**15** (67.34 to 73.59) "In symbols, the state is alpha ket zero plus beta ket one, two numbers whose squared sizes give the odds."
- "symbols" (67.86): the globe shrinks to the left (centre 420, 470, r 200, 0.9 s). The formula writes
  at right, centred x 1220, y 380, 90 px: "|ψ⟩ = α|0⟩ + β|1⟩", in pieces cued to the words:
  "|ψ⟩ =" at "state" (68.50) with a small ink label "the state" under "|ψ⟩"; "α|0⟩" at "alpha" (69.03);
  "+ β|1⟩" at "beta" (70.24).
- "numbers" (71.70): α and β turn gold, with two small arrows down to two mini bars (matching the
  60 degree arrow: 75% and 25%) at y 560..700. "squared" (72.27): "|α|²" and "|β|²" (48 px) write
  under the bars. "odds" (about 73.6, heard in line 16's words, so use the estimate): the label
  "the odds" (48 px) writes beside the bars.

**16** (73.89 to 77.82, then the 2.6 s hold) "So the state is the arrow, and a measurement only ever hands you one bit."
- 73.9: mini bars, "|α|²", "|β|²" and "the odds" blur out; the formula moves up and shrinks (y 180, 64 px, ink).
- "arrow" (74.90): a gold underline under the globe's arrow and the label "state = arrow" (64 px, gold)
  writes to the right of the globe (x 700, y 400).
- "measurement" (75.56): an arrow from the globe to a small measure box (x 1250, y 560), and out of
  it a single big "0" (90 px, ink) at "one" (77.18), boxed, with the label "one bit" (56 px).
- Closing picture holds through the end: small formula at top, globe with gold arrow at left,
  "state = arrow", box -> "0" "one bit". A slow drift of the arrow (a few degrees) and a gentle gold
  pulse on "state = arrow" keep it alive during the hold.

## Gold, by beat
Line 0 toggle when on; 1 "?"; 2 "north", "south"; 3 "north!"; 4 to 16 the state arrow; 5 the pole
label the arrow sits on and the bracket curls; 6 "|1⟩" and the tick; 8 the larger bar; 9 the equator then the "1" bar; 10 the "1" outcome; 11
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
put at the edge of the next line (one, globe, likely, pole, one, odds) and "fifty fifty" heard as 50-50.

## Notes for the scene author
- Some boundary words were assigned to the neighbouring line by the transcriber, so do not cue on
  them by line: line 0 "one" sits in line 1's words, line 4 "globe" in line 5's, line 5's last "ket"
  in line 6's, line 9 "likely" in line 10's, line 10 "pole" in 11's, line 11 "one" in 12's, line 15
  "odds" in 16's. Use the estimate (cue on a word not heard falls back to the text estimate) or cue a
  neighbour with an offset.
- Line 1 contains no "one", but its words list does: avoid `cue(1, "one")`. Line 6: `cue(6, "ket")`
  hits line 5's last word; use `cue(6, "ket", 1)`.
- Physics checks: P(0) = cos²(tilt/2) everywhere; equator = 50/50; snap goes to the reported pole;
  the tally (15 of 20 zeros) and the 60 degree arrow agree; the mini bars in line 15 are |α|² and
  |β|² for that same arrow (75% and 25%); we never say "both at once".
