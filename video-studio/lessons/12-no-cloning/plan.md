# Lesson 12, "Why you can't copy a qubit": beat plan

Voice: Emma, 17 lines, 256 words, narration ends at 79.97 s, film about 82.6 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json` (re-run narrate before trusting them after any edit).

Through line: a qubit and an empty space beside it (can we copy it?) -> the C NOT circuit copying
0 and 1 -> the photocopier with white, black and a grey page bound to its "copy" (the analogy) ->
the same circuit fed the plus state, with live outcome bars: four even bars for true copies against
the real two bars 00 and 11 -> two arrows dissolving into one linked pair -> the no cloning rule ->
why: a pile of copies would reveal the arrow, but one qubit gives one bit -> where the copier
breaks (grey is visible, a qubit's shade is not) -> the kind note: repeat a known recipe ->
closing circuit and takeaway card. One main object at a time.

## Cue gotchas (from the transcriber)
- "C NOT" is heard as one word `CNOT`, and "C NOT's" as `CNOT`. Cue it as `cue(n, "CNOT")`.
- Some last words slide into the next line's word list: "zero." of line 1 sits in line 2
  (8.28 s), "one." of line 2 in line 3 (14.0 s), "own." of line 10 in line 11 (48.4 s),
  "arrow." of line 12 in line 13 (58.5 s), "that." of line 13 in line 14 (63.6 s). Cue those from
  the next line (for example `cue(2, "zero.")` or `cue(2)` with a small negative offset), or check
  what `cue` matches before relying on it.

## Recurring objects (all inside x 140..1780, y 60..860)

- **Mini globe** (a qubit): circle r 110, dashed equator ellipse (rx 110, ry 28), dots at the poles.
  The state arrow is gold, drawn from the centre as a group rotated by `onFrame` (pivot at centre,
  0 = straight up). Plus state = arrow pointing right along the equator (90 degrees).
- **Circuit** (lines 1, 2, 7, 9, 16): two hand-drawn wires, x 620..1300, top wire y 380 ("original"),
  bottom wire y 600 ("blank"). C NOT symbol at x 960: a solid ink dot on the top wire (r 14), a
  circle r 40 with a cross inside on the bottom wire (the target), a vertical stroke joining them.
  Input labels at x 470 (56 px), output labels at x 1360..1600 (56 px). Small ink caption labels
  "original" above the top wire and "blank" below the bottom wire (40 px).
- **Photocopier** (lines 3 to 6, then small on 14): body a rough box 560 x 240 centred (960, 560)
  (x 680..1240, y 440..680), a lid line and a little button on top, a slot in the top left where
  pages go in, an output tray sticking out on the right (x 1240..1420, y 640). Pages are
  rounded rects 150 x 200 with three faint text lines. White page: solid ink fill (#e8e8e8) with a
  dark outline. Black page: solid near black (#0b0c0e) fill with an ink outline so it shows on the
  ground. Grey page: mid grey (#8b8d90) hachure fill. Gold marks only the thing that matters now.
- **Outcome bars** (lines 8 to 9): four bars at x 1180, 1320, 1460, 1600 (width 90), base y 720,
  max height 360 (100 percent), labels "00" "01" "10" "11" (48 px) below at y 760, live percentages
  above each bar (40 px). Heights driven by `onFrame` + `sched()`.

## Line by line

**0** (0.40 to 3.73) "Here's a question. Can you make a perfect copy of a qubit?"
- Title block shows from 0 (kit). A mini globe draws at (760, 600), r 130, at "question" (0.6),
  1.2 s, its gold arrow tilted 55 degrees, gently wobbling a few degrees (never static).
- "copy" (2.9): a dashed outline of a second globe draws at (1160, 600) with a big gold "?"
  written inside it (80 px). A small ink arrow from the first globe to the dashed one, labelled
  "copy?" (48 px) above it.
- blurOut("#b-title") at 3.0 (title has had 3 s). Everything blurs out at 3.9.

**1** (4.03 to 8.23) "C NOT does it for plain zeros and ones, with a blank qubit set to zero."
- "CNOT" (4.2): the two wires draw (0.6 s) and the C NOT symbol draws on top (0.8 s); label
  "CNOT" writes above the symbol at y 300 (56 px, ink).
- "zeros" (5.5): input "0" writes on the top wire at x 470 (64 px). "ones" (6.1): it rewrites as
  "1" (the "0" fades) so both are shown as possible inputs. Simplest: a stacked "0 / 1" pair.
- "blank" (6.9): "|0⟩" writes on the bottom wire input (64 px), small "blank" label under it.
  Gold underline on "blank" at "zero" (8.28, which sits in line 2's words).

**2** (8.53 to 14.12) "It flips the blank only when the original is one, so zero gives zero zero, and one gives one one."
- "flips" (8.8): the target circle pulses gold once; a tiny curved arrow beside it ("flip").
- "original" (10.3) "one" (11.0): the top input shows "1" in gold; a gold dot travels along the top
  wire to the C NOT dot and down the vertical stroke to the target (0.6 s).
- "zero gives zero zero" (11.5 to 12.8): top input set to "0"; the outputs write "0" and "0" on the
  right ends of the wires, then a big "0 → 00" summary writes at bottom centre (y 760, 64 px).
- "one gives one one" (13.2 to 13.5 and "one." at 14.0 in line 3): top input "1"; outputs write
  "1" and "1"; the summary row adds "1 → 11". A gold tick draws beside each row.
  ("00" and "11" are what the captions also show.)
- Circuit stays in mind but leaves: at 14.4 the whole circuit shrinks to a small icon at top right
  (x 1500..1740, y 90..230, dim) so the copier can take the stage. It returns on line 7.

**3** (14.42 to 17.60) "It's like a photocopier that only understands black and white."
- "photocopier" (15.1): the photocopier draws centred (2 s), big.
- "black" (16.9) and "white" (17.4): two small swatches write on the copier's front panel,
  a black square and a white square, with "black & white only" as a 40 px label under the
  copier (y 730). Keep the "&" or write "black and white only".

**4** (17.90 to 22.44) "A white page gives two white pages, and a black page gives two black ones."
- "white" (18.0): a white page slides into the top slot (move from x 520 to the slot, 0.8 s).
- "two" (19.1): two white pages come out side by side on the output tray (one slides out, the
  original lands beside it). Gold tick above them at "pages" (19.7).
- "black" (20.6): the white pages blur out; a black page slides in; at "two" (21.6) two black pages
  come out. Gold tick at "ones" (22.3).
- Mapping note under the copier (40 px, ink): "white = 0, black = 1" writes at 21.0 so the link
  to the circuit is explicit.

**5** (22.74 to 25.94) "But feed it a grey page, and it doesn't make a grey copy."
- Black pages blur out at 22.8. "grey" (23.6): a grey page slides in, its outline gold (this is
  the thing that matters now).
- "doesn't" (24.6): on the tray, where the copy should be, a dashed grey page outline appears;
  at "copy" (25.8) a gold cross draws over the dashed outline (0.3 s).

**6** (26.24 to 31.26) "It binds the two pages together, so whenever anyone looks, both are black or both are white."
- "binds" (26.5): the original and a second page (now plain outlined, no shade of its own) sit
  side by side out of the copier; a gold ribbon (a wobbly loop tying round both pages) draws on
  (1 s). The copier blurs out at 27.2 so the two bound pages move to centre (960, 520) and grow.
- "looks" (29.2): a hand-drawn eye draws above the pages (x 960, y 230).
- "black" (30.4): both pages flip to black together (a quick squash and fill swap, 0.3 s).
  "white" (31.1): both flip to white together. Keep them flipping in step (black, white, white,
  black, at random looking but fixed times) through to 31.5 so the "always agree" idea moves.
- Note: the pages never show grey once bound.

**7** (31.56 to 35.57) "Now feed C NOT the plus state, an arrow lying flat on the equator."
- Bound pages blur out at 31.6. The circuit returns from the corner icon to centre (move 0.9 s),
  shifted left so the outputs and bars can sit at right: wires x 380..900, C NOT at x 640.
- "plus" (32.7): on the top input a mini globe draws (centre (260, 380), r 90), its gold arrow
  swinging from up to flat right along the equator by "equator" (35.1). The label "|+⟩" writes
  above it (56 px) at "state" (33.0). Bottom input keeps "|0⟩".
- Make sure the left globe stays inside x 140 (centre 260, r 90: left edge 170).

**8** (35.87 to 39.58) "Two true copies would give all four results, one time in four each."
- "copies" (36.4): at the right, two mini globes (r 70) at (1150, 230) and (1350, 230), each with
  its own flat gold arrow, label "true copies?" (40 px, ink) beside them at y 120.
- "four" (37.6): the four bars rise together to 25 percent each (onFrame, 0.9 s), labels
  "00 01 10 11" write under them, "25%" over each. All four bars ink with a gold outline.
- "one time in four" (38.5): a small "1 in 4 each" label writes under the bars (40 px).

**9** (39.88 to 43.72) "Instead you only ever get zero zero or one one, half the time each."
- "Instead" (40.4): the "true copies?" globes blur out. The bars morph (onFrame): 01 and 10 sink
  to 0, 00 and 11 rise to 50 percent; these two turn gold. Percentages update live.
- "zero zero" (41.6): a gold "00" pops on the top output wire pair; "one one" (42.2) a gold "11".
  The outputs on the wires flicker between "0 0" and "1 1" in step (never 0 1).
- "half" (42.8): "50%" labels settle over the two gold bars.

**10** (44.02 to 48.24) "They're entangled, their answers locked together, and neither has an arrow of its own."
- "entangled" (44.6): the bars blur out. At the circuit output, two mini globes draw (r 80) at
  (1180, 420) and (1500, 420); a gold wavy link (like the ribbon from line 6, on purpose) joins them.
  The word "entangled" writes in gold above the link (56 px, y 250).
- "answers locked" (45.8): a small "same answer" label (40 px) under the link.
- "neither" (47.1): inside each globe the arrow fades out and is replaced by a soft hachured blur
  at the centre with "no arrow" (40 px) under each globe. Point back at the line 6 ribbon visually.
- "own" (48.4, in line 11's words): everything except the circuit icon blurs out at 48.8.

**11** (48.54 to 53.64) "That's not C NOT's fault. The no cloning theorem says no circuit can copy an unknown state."
- "fault" (49.7): the circuit (small, centre) gets a little ink "not its fault" shrug label; then
  it blurs out at 50.3.
- "no cloning theorem" (50.5 to 51.1): a card writes at centre (y 300): "no-cloning theorem"
  (72 px, ink) with a hand-drawn underline.
- "circuit" (52.0): a generic box labelled "any circuit" (x 760..1160, y 450..640) draws with a
  "?" input arrow on its left. "unknown state" (53.0): the input is a mini globe covered by a
  hachured cloth with a gold "?" on it; the box's output side gets a big gold cross over a second
  globe outline (0.3 s at "state" 53.5).

**12** (53.94 to 58.55) "With lots of copies, you could measure each along a different direction and work out the arrow."
- Card blurs out at 54.0. "copies" (54.6): six mini globes (r 60) draw in a row, y 360, x 360..1560,
  each with the same hidden arrow (not shown: a "?" inside each).
- "measure" (55.7): each globe gets a small ink measuring stick through it at a different angle
  (up, right, tilted 45, 135 and so on), drawn one after another 0.15 s apart, with a tiny "0" or
  "1" result under each.
- "work out the arrow" (57.5 to 58.5): the results feed (thin arrows down) into one big globe at
  bottom centre (960, 660, r 130) where the gold arrow draws in clearly, label "the arrow!"
  (48 px). This is the payoff that shows why copies would be powerful.

**13** (58.85 to 63.52) "But measuring one qubit only ever gives you one bit. Copying would sneak past that."
- The six globes and the big globe blur out at 59.0. "measuring one qubit" (59.5 to 60.1): one
  mini globe (r 110) at (620, 460) with a gold arrow under a hachured cloth; an ink measuring box
  (a meter with a needle) at (1000, 460) and a wire between.
- "one bit" (61.6): out of the meter comes a single "1" (gold, 80 px) and the label "one bit"
  (48 px). The cloth stays: the arrow is never seen.
- "Copying" (62.2) "sneak past" (63.0): a dashed ink path draws from a tiny copier icon around the
  top of the meter (a sneaky detour), then at 63.4 a big gold cross draws over that dashed path.

**14** (63.82 to 68.92) "That's where the photocopier breaks. Anyone can see grey, but nobody can see a qubit's shade."
- Line 13's picture blurs out at 63.9. "photocopier" (64.9): a small copier draws at top centre
  (y 140..260, x 820..1100), and at "breaks" (65.7) a jagged crack draws through it.
- Split screen beneath (y 340..800): left half, the grey page (from line 5) at (560, 560) with the
  eye above it and an ink tick; label "see grey" (48 px) writes at "grey" (67.0).
- Right half: a mini globe at (1360, 560) under the hachured cloth, the eye above it closed (a
  curved lid line), and a gold "?" at "shade" (68.8); label "can't see it" (48 px).

**15** (69.22 to 73.49) "You can still make many qubits in a known state, though. Just repeat the recipe."
- Line 14 blurs out at 69.3. "many qubits" (70.3): a recipe card draws (rough rect x 460..1460,
  y 200..760) with a title "recipe" (48 px). Inside, row one draws: "|0⟩" then a wire into an
  ink box with "H" then a wire to a mini globe with a flat gold arrow (the plus state again).
- "known" (71.1): gold underline under "known state" label (48 px) at the top of the card.
- "repeat" (72.8): rows two and three draw beneath row one (0.4 s each), identical, each with a
  gold tick. Make the point: same recipe, same state, no copying needed.

**16** (73.79 to 79.97, then the 2.6 s hold) "So no circuit copies an unknown state. C NOT copies zero and one, but entangles everything in between."
- Card blurs out at 73.9. Closing picture, stays to the end:
  - Top: the takeaway, 90 px, ink with gold on "unknown": "No circuit copies an unknown state."
    written at y 200, centred, at "no" (74.1) to "state" (75.9).
  - Middle (y 380..640): the C NOT circuit once more, small, centred (wires x 700..1220). On the
    left two input rows stacked: "0 → 00" and "1 → 11" with ink ticks, written at "copies zero
    and one" (77.0 to 77.6).
  - Then "|+⟩" on the top input at "entangles" (78.2), with the output pair joined by the gold
    wavy link and the word "entangled" (56 px gold) at "between" (79.2).
  - The gold link gently pulses (opacity 0.7 to 1, onFrame) through the hold so the last frame is
    not static.

## Gold, per moment
Line 0 the "?" copy; 1 to 2 the flowing control and the ticks; 4 the ticks; 5 the grey page's
outline and the cross; 6 the ribbon; 7 the plus state arrow; 8 the bar outlines; 9 the 00 and 11
bars; 10 the link and "entangled"; 11 the cross over the clone; 12 the reconstructed arrow;
13 the one bit and the cross on the sneaky path; 14 the "?"; 15 the plus arrows and ticks;
16 "unknown" and the link.

## Caption phrase pairs (add in scene.mjs)
```js
export const phrases = [
  ["zero zero", "00"],
  ["one one", "11"],
  ["plus state", "|+⟩ state"],
  ["no cloning", "no-cloning"],
];
```
"C NOT" to "CNOT" is built in (and covers "C NOT's"). Leave "zero" and "one" as words elsewhere.

## Respellings for the voice
None needed: every real word was heard. "C NOT" is heard as "CNOT", which is correct.
