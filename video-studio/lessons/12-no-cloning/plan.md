# Lesson 12, "Why you can't copy a qubit": beat plan

Voice: Emma, 17 lines, 260 words, narration ends at 81.38 s, film about 84.0 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json` (re-run narrate before trusting them after any edit).

Through line: a qubit and an empty space beside it (can we copy it?) -> the C NOT circuit copying
0 and 1 -> the photocopier with white, black and a grey page bound to its "copy" (the analogy) ->
the same circuit fed the plus state (the quantum grey page), with live outcome bars: four even bars
for true copies against the real two bars 00 and 11 -> two arrows dissolving into one linked pair
-> the no cloning rule -> why: a pile of copies would reveal the arrow, but one qubit gives one bit
-> where the copier breaks (grey is visible, a qubit's shade is not) -> the kind note: repeat a
known recipe -> closing circuit and takeaway card. One main object at a time.

## Cue gotchas (from the transcriber)
- "C NOT" is heard as one word `CNOT` (sometimes `CNOT,`), and "C NOT's" as `CNOT`. Cue it as
  `cue(n, "CNOT")`, or check what `cue` matches first.
- "plain" is heard as `plane` (line 1), "They're" as `They are` (line 10), and the "but" of line 16
  as `It` (79.64). Cue line 16's second half from "entangles".
- Some edge words slide into the neighbouring line's word list: "one." of line 2 sits in line 3
  (16.19 s), "but" of line 5 sits in line 4 (24.05 s), "It" of line 6 sits in line 5 (27.68 s),
  "own." of line 10 in line 11 (50.62 s), "Why?" of line 12 in line 11 (55.67 s), "that." of line
  13 in line 14 (65.30 s). Cue those from the line that holds them, or use `cue(n)` with a small
  negative offset.

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

**0** (0.40 to 4.71) "Here's a question. Can you perfectly copy a qubit, the quantum version of a bit?"
- Title block shows from 0 (kit). A mini globe draws at (760, 600), r 130, at "question" (0.8),
  1.2 s, its gold arrow tilted 55 degrees, gently wobbling a few degrees (never static).
- "copy" (2.66): a dashed outline of a second globe draws at (1160, 600) with a big gold "?"
  written inside it (80 px). A small ink arrow from the first globe to the dashed one, labelled
  "copy?" (48 px) above it.
- blurOut("#b-title") at 2.9 (title has had about 3 s). "qubit" (2.91): the label "qubit" (48 px,
  ink) writes under the first globe; at "quantum version of a bit" (3.38 to 4.42) a smaller
  "a quantum bit" (40 px) writes beneath it. Everything blurs out at 4.8.

**1** (5.01 to 10.38) "For plain zeros and ones, yes, using a gate called C NOT and a blank qubit set to zero."
- "zeros" (5.58) "ones" (6.12): a stacked "0 / 1" pair writes at the top wire's input position
  (x 470, 64 px) before the wires exist. "yes" (6.81): a gold tick draws beside it (0.3 s).
- "gate" (7.42) "CNOT" (8.2): the two wires draw (0.6 s) and the C NOT symbol draws on top (0.8 s);
  label "CNOT gate" writes above the symbol at y 300 (56 px, ink). The "0 / 1" now sits on the top
  wire's input; small "original" label above the top wire (40 px).
- "blank" (8.95): "|0⟩" writes on the bottom wire input (64 px), small "blank" label under it.
  Gold underline on "blank" at "zero" (10.21).

**2** (10.69 to 16.27) "It flips the blank only when the original is one, so zero gives zero zero, and one gives one one."
- "flips" (10.86): the target circle pulses gold once; a tiny curved arrow beside it ("flip").
- "original" (12.84) "one" (13.22): the top input shows "1" in gold; a gold dot travels along the
  top wire to the C NOT dot and down the vertical stroke to the target (0.6 s).
- "zero gives zero zero" (13.74 to 14.71): top input set to "0"; the outputs write "0" and "0" on
  the right ends of the wires, then a big "0 → 00" summary writes at bottom centre (y 760, 64 px).
- "one gives one one" (15.38 to 16.12, "one." at 16.19 in line 3's words): top input "1"; outputs
  write "1" and "1"; the summary row adds "1 → 11". A gold tick draws beside each row.
- At 16.5 the whole circuit shrinks to a small dim icon at top right (x 1500..1740, y 90..230) so
  the copier can take the stage. It returns on line 7.

**3** (16.57 to 19.75) "It's like a photocopier that only understands black and white."
- "photocopier" (17.28): the photocopier draws centred (2 s), big.
- "black" (19.09) and "white" (19.58): two small swatches draw on the copier's front panel, a black
  square and a white square, with "black and white only" as a 40 px label under the copier (y 730).

**4** (20.05 to 24.23) "A white page gives two white pages, and a black page two black ones."
- "white" (20.17): a white page slides into the top slot (move from x 520 to the slot, 0.8 s).
- "two" (21.03): two white pages come out side by side on the output tray. Gold tick above them at
  "pages" (21.93).
- "black" (22.36): the white pages blur out; a black page slides in; at "two" (22.89) two black
  pages come out. Gold tick at "ones" (23.63).
- Mapping note under the copier (40 px, ink): "white = 0, black = 1" writes at 22.5 so the link to
  the circuit is explicit.

**5** (24.53 to 27.73; "But" at 24.05 sits in line 4) "But feed it a grey page, and it doesn't make a grey copy."
- Black pages blur out at 24.1. "grey" (24.77): a grey page slides in, its outline gold.
- "doesn't" (25.86): on the tray, where the copy should be, a dashed grey page outline appears; at
  "copy" (27.35) a gold cross draws over the dashed outline (0.3 s).

**6** (28.03 to 32.83; "It" at 27.68 sits in line 5) "It binds the pages together, so whenever anyone looks, both are black or both are white."
- "binds" (27.83): the original and a second page (plain outline, no shade of its own) sit side by
  side out of the copier; a gold ribbon (a wobbly loop tying round both pages) draws on (1 s). The
  copier blurs out at 28.5 and the two bound pages move to centre (960, 520) and grow.
- "looks" (30.69): a hand-drawn eye draws above the pages (x 960, y 230).
- "black" (31.42): both pages flip to black together (a quick squash and fill swap, 0.3 s).
  "white" (32.59): both flip to white together. Keep them flipping in step (black, white, white,
  black, at fixed times) through to 33.0 so the "always agree" idea moves. The bound pages never
  show grey.

**7** (33.13 to 37.72) "Now feed C NOT our grey page, the plus state, whose arrow lies on the equator."
- Bound pages blur out at 33.1. The circuit returns from the corner icon to centre (move 0.9 s),
  shifted left so the outputs and bars can sit at right: wires x 380..900, C NOT at x 640.
- "grey page" (34.38): a small grey page (from line 5, 90 x 120) draws at (260, 200), above where
  the input globe will be.
- "plus" (35.32): on the top input a mini globe draws (centre (260, 420), r 90); the label "|+⟩"
  writes beside the small grey page with "=" between them (56 px) at "state" (35.61). The globe's
  gold arrow swings from up to flat right along the equator by "equator" (37.37), and the dashed
  equator line flashes gold at that word. Bottom input keeps "|0⟩".
- Keep the left globe inside x 140 (centre 260, r 90: left edge 170).

**8** (38.02 to 41.73) "Two true copies would give all four results, one time in four each."
- "copies" (38.6): at the right, two mini globes (r 70) at (1150, 230) and (1350, 230), each with
  its own flat gold arrow, label "true copies?" (40 px, ink) beside them at y 120.
- "four" (39.9): the four bars rise together to 25 percent each (onFrame, 0.9 s), labels
  "00 01 10 11" write under them, "25%" over each. All four bars ink with a gold outline.
- "one time in four" (40.5): a small "1 in 4 each" label writes under the bars (40 px).

**9** (42.03 to 45.87; "Instead" at 41.75) "Instead you only ever get zero zero or one one, half the time each."
- "Instead" (41.75): the "true copies?" globes blur out. The bars morph (onFrame): 01 and 10 sink
  to 0, 00 and 11 rise to 50 percent; these two turn gold. Percentages update live.
- "zero zero" (43.45): the circuit's two outputs show "0" and "0" in gold; "one one" (44.05) they
  show "1" and "1". The outputs keep flickering between "0 0" and "1 1" in step (never 0 1).
- "half" (44.8): "50%" labels settle over the two gold bars.

**10** (46.17 to 50.40) "They're entangled, their answers locked together, and neither has an arrow of its own."
- "entangled" (46.66): the bars blur out. At the circuit output, two mini globes draw (r 80) at
  (1180, 420) and (1500, 420); a gold wavy link (like the ribbon from line 6, on purpose) joins
  them. The word "entangled" writes in gold above the link (56 px, y 250).
- "answers locked" (47.54 to 48.07): a small "same answers" label (40 px) under the link.
- "neither" (49.31): inside each globe the arrow fades out and is replaced by a soft hachured blur
  at the centre, with "no arrow" (40 px) under each globe.
- "own" (50.62, in line 11's words): everything except the circuit blurs out at 50.7.

**11** (50.70 to 55.80) "That's not C NOT's fault. The no cloning theorem says no circuit can copy an unknown state."
- "fault" (51.83): the circuit (now small, centre) gets a little ink "not its fault" label; then it
  blurs out at 52.3.
- "no cloning theorem" (52.59 to 53.0): a card writes at centre (y 300): "no-cloning theorem"
  (72 px, ink) with a hand-drawn underline.
- "circuit" (54.05): a generic box labelled "any circuit" (x 760..1160, y 450..640) draws.
  "unknown" (54.71): its input is a mini globe covered by a hachured cloth with a gold "?" on it;
  at "state" (55.36) the box's output side gets a big gold cross over a second globe outline (0.3 s).

**12** (56.10 to 60.75; "Why?" at 55.67 sits in line 11) "Why? With many copies, you could measure each along a different direction and work out the arrow."
- "Why?" (55.67): the card and box blur out and a big ink "why?" (72 px) writes at top centre; it
  fades at 56.5.
- "copies" (56.55): six mini globes (r 60) draw in a row, y 360, x 360..1560, each with the same
  hidden arrow (a "?" inside each, no arrow shown).
- "measure" (57.56) "different direction" (59.15 to 59.29): each globe gets a small ink measuring
  stick through it at a different angle (up, right, tilted 45, 135 and so on), drawn one after
  another 0.15 s apart, with a tiny "0" or "1" result under each.
- "work out the arrow" (60.01 to 60.62): the results feed (thin arrows down) into one big globe at
  bottom centre (960, 660, r 130) where the gold arrow draws in clearly, label "the arrow!"
  (48 px). This is the payoff that shows why copies would be powerful.

**13** (61.05 to 65.19) "But measuring a qubit gives just one bit, and copying would sneak past that."
- The six globes and the big globe blur out at 61.1. "measuring a qubit" (61.36 to 62.06): one mini
  globe (r 110) at (620, 460) with its arrow hidden under a hachured cloth; an ink meter (a box
  with a needle) at (1000, 460) and a wire between.
- "one bit" (62.97): out of the meter comes a single "1" (gold, 80 px) and the label "one bit"
  (48 px). The cloth stays: the arrow is never seen.
- "copying" (63.99) "sneak past" (64.52 to 64.84): a dashed ink path draws from a tiny copier icon
  around the top of the meter (a sneaky detour); at "that" (65.3) a big gold cross draws over that
  dashed path.

**14** (65.49 to 70.58) "That's where the photocopier breaks. Anyone can see grey, but nobody can see a qubit's shade."
- Line 13's picture blurs out at 65.5. "photocopier" (66.52): a small copier draws at top centre
  (y 140..260, x 820..1100), and at "breaks" (67.27) a jagged crack draws through it.
- Split screen beneath (y 340..800): left half, the grey page at (560, 560) with an open eye above
  it and an ink tick; label "see grey" (48 px) writes at "grey" (68.16).
- Right half: a mini globe at (1360, 560) under the hachured cloth, a closed eye above it (a curved
  lid line), and a gold "?" at "shade" (70.33); label "can't see it" (48 px).

**15** (70.89 to 74.90) "You can still make many qubits in a known state: just repeat the recipe."
- Line 14 blurs out at 70.9. "many qubits" (71.75 to 71.95): a recipe card draws (rough rect
  x 460..1460, y 200..760) with a title "recipe" (48 px). Inside, row one draws: "|0⟩" then a wire
  into an ink box labelled "same steps" then a wire to a mini globe with a flat gold arrow (the
  plus state again). No gate letters, so nothing on screen is unexplained.
- "known state" (72.4 to 72.68): gold underline under a "known state" label (48 px) at the top of
  the card.
- "repeat" (74.27): rows two and three draw beneath row one (0.3 s each), identical, each with a
  gold tick. Same recipe, same state, no copying needed.

**16** (75.20 to 81.38, then the 2.6 s hold) "So no circuit copies an unknown state. C NOT copies zero and one, but entangles everything in between."
- Card blurs out at 75.2. Closing picture, stays to the end:
  - Top: the takeaway, 90 px, ink with gold on "unknown": "No circuit copies an unknown state."
    written at y 200, centred, from "no" (75.58) to "state" (77.32).
  - Middle (y 380..640): the C NOT circuit once more, small, centred (wires x 700..1220). On the
    left two input rows stacked: "0 → 00" and "1 → 11" with ink ticks, written at "copies zero
    and one" (78.23 to 79.34).
  - Then "|+⟩" on the top input at "entangles" (79.92), with the output pair joined by the gold
    wavy link and the word "entangled" (56 px gold) at "between" (80.92).
  - The gold link gently pulses (opacity 0.7 to 1, onFrame) through the hold so the last frame is
    not static.

## Gold, per moment
Line 0 the "?" copy; 1 the "yes" tick and the blank underline; 2 the flowing control and the ticks; 4 the ticks; 5 the grey page's
outline and the cross; 6 the ribbon; 7 the plus state arrow and the equator flash; 8 the bar outlines; 9 the 00 and 11
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
None needed: every real word was heard. "C NOT" is heard as "CNOT", which is correct; "plain" as
"plane" and "They're" as "They are" are homophones; line 16's "but" was once heard as "It" and once
correctly on an identical take, so the voice says it.
