# Lesson 8, Interference: beat plan

Voiced with bf_emma: 19 lines, 260 words, narration ends at 86.63 s, film about 89.2 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json`; always cue with `cue(line, "word")`, never hard numbers.

Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Ink #e8e8e8, gold #d9b463 on #17191c.
Gold rule: one gold thing at a time, the thing that matters right now.

## Physics the pictures must keep (checked)
- Start in zero. The first H gives each path amplitude one over root two, both positive (both arrows point UP).
- The second H sends path zero to outcome zero and outcome one with a plus sign each, and path one to
  outcome zero with a plus sign and to outcome one with a MINUS sign. So with nothing in the middle:
  outcome zero gets up + up (grows, certain), outcome one gets up + down (cancels, never).
- Z multiplies path one by minus one (its arrow turns from UP to DOWN). Then outcome zero gets up + down
  (cancels) and outcome one gets up + up (grows): H Z H reads one every time.
- Quarter wave (the S gate, phase pi over two): path one's arrow turns to point RIGHT. The second H adds it
  on outcome zero (up + right) and flips it on outcome one (up + LEFT). Each sum is a slanted arrow of
  length about 0.71, which squared is one half: fifty fifty. Slot 1's slant must lean left, not right.
- The second H's own minus sign (on path one going to outcome one) is said aloud in line 8 ("this H flips
  path one's arrow"); show it as path one's copy turning over as it enters slot 1, every time.
- Convention on screen: arrow up = positive amplitude, down = negative, sideways = a quarter turn.
  Arrow length shows size; the bars show chance (length squared).

## Recurring objects
- `b-phones`: big hand-drawn headphones (headband arc, two ear cups with hatched pads), centre x 960, y 300 to 640.
- `b-wNoise` (ink) and `b-wAnti` (gold) sine waves, each about 900 px wide, drawn with `wobbly` so they can
  be traced; `b-wSum` the resulting wave driven by `onFrame` (amplitude A(t) via `sched`).
- Path diagram (the "interferometer"), lines 5 to 13, centred:
  - `b-ket0` label "|0⟩" at x 200, y 450 (56 px).
  - `b-H1` box at x 330 to 450, y 400 to 500, letter "H" 64 px.
  - Upper path from H1 to H2 along y 300 (label "path 0", 44 px), lower path along y 600 (label "path 1").
    Paths are drawn as gentle curves from (450, 450) out to y 300 / y 600 and back in to (1130, 450).
  - `b-amp0`, `b-amp1`: amplitude arrows, 110 px long, riding at x 780 on each path (arrow pointing up).
    `b-amp1` is a group rotated by `onFrame` around its centre (0, 180 or 90 degrees).
  - `b-Zbox` box on the lower path at x 730 to 830, y 550 to 650, letter "Z" 60 px (arrow `b-amp1` then sits
    at x 960 on the lower path, after the Z).
  - `b-H2` box at x 1130 to 1250, y 400 to 500.
  - Two output slots right of H2: "0" at (1360, 300) and "1" at (1360, 600), 56 px labels, each with an
    arrow-sum stage `b-sum0`, `b-sum1` at x 1440 to 1560 where arrows stack head to tail.
  - Chance bars `b-bar0`, `b-bar1` at x 1620 to 1740 (bar width 70 px, max height 200 px), heights
    driven by `onFrame`, percent label under each (40 px). Bars stay inside x 1780.

## Beats

### Line 0 (0.40 to 4.56) "Here's a challenge. Make a qubit read one every time, without an X gate."
- The kit title block shows (y 118 to 260) until 3.0 s at least.
- Below it, centred y 420 to 760: a qubit dial "|0⟩" at x 560 on "qubit"; an arrow to a readout panel of
  four little tally cards at x 900 to 1400 reading "1 1 1 1", written one by one from "one" to "time",
  the four 1s gold (the goal).
- On "without" plus 0.4 s (`cue(0, "without", 0, 0.4)`; "X gate" is heard glued as "Xgate"): a small "X" gate box at x 1500, y 560 draws, then an ink cross strikes it 0.3 s later.
- At about 3.4 s (end of "time"), `blurOut("#b-title")`.
- Leaves: whole hook blurs out at `cue(1, "headphones", 0, -0.4)`.

### Line 1 (4.86 to 8.87) "The trick is called interference, and noise cancelling headphones use it too."
- On "interference": the word "interference" writes at top centre (x 960, y 150, 72 px), gold. It stays
  as a small ink heading (fades to ink at line 2 start) through line 4.
- On "headphones": `b-phones` draws (2 s), centred x 960, y 300 to 640.

### Line 2 (9.17 to 12.20) "They hear the noise around you, and play its mirror image."
- Headphones shrink and slide to the left (x 300, scale 0.5) on "They" (move 0.8 s).
- On "noise": ink noise wave `b-wNoise` traces in at y 380, x 560 to 1460, with small "noise" label (44 px) at its left.
- On "mirror": gold wave `b-wAnti` traces in directly below at y 600, exactly upside down (crest under trough),
  label "mirror image" (44 px, gold).
- Gold: the mirror wave.

### Line 3 (12.50 to 16.94) "Where the noise wave rises, theirs dips, so they cancel and the sound disappears."
- On "rises": a small ink tick marks a crest on the noise wave; on "dips": a tick marks the trough on the
  gold wave right under it (a dotted line joins the two).
- On "cancel": both waves slide toward y 490 and overlap (move 0.8 s); `b-wSum` (gold) appears there and its
  amplitude falls from full to zero with `onFrame` over 1.2 s, ending as a flat line.
- On "disappears": the little sound strokes next to the headphones fade, label "silence" writes under the
  flat line (56 px, gold).

### Line 4 (17.24 to 20.16) "Waves that rise and dip together get louder instead."
- On "together": the mirror wave flips back the right way up (onFrame, 0.8 s), so crests line up.
- `b-wSum` grows from flat to double height (gold), label "louder" replaces "silence" on "louder".
- Leaves: waves, headphones, "interference" heading all blur out at `cue(5, "qubit", 0, -0.3)`.
  A tiny ink headphones icon (`b-phIcon`, 90 px) stays parked at top right (x 1640, y 120) as a reminder
  until line 13.

### Line 5 (20.46 to 25.56) "A qubit does this too. From zero, an H gate splits it into two paths, zero and one."
- On "zero" (first): "|0⟩" writes at the left.
- On "an" (`cue(5, "an")`; "H gate" is heard glued): box `b-H1` draws, letter H gold for 1 s then ink.
- On "paths": both paths draw out of H1 (1.2 s); a small dot travels from "|0⟩" into H1 and splits into two
  dots along both paths (onFrame).
- On "zero" (second, `cue(5, "zero", 1)`): label "path 0" writes above the upper path; on "and" (last word
  before "one", which the transcriber files late; use `cue(5, "and", 0, 0.2)`): "path 1" under the lower one.

### Line 6 (25.86 to 31.21) "Each path carries an amplitude, a number that sets its chance and can be negative, drawn as an arrow."
- On "amplitude": word "amplitude" writes at top centre (x 960, y 150, 60 px) with "= a number" after it.
- On "chance": the two empty chance bars at the right (x 1620 to 1740) draw with a small "chance" label (40 px)
  and both fill to 50 percent (ink), so "sets its chance" has a picture. They stay for lines 7 to 13.
- On "negative": a tiny side sketch at x 1500, y 160: an up arrow "+" and a down arrow "−" (40 px labels),
  so a beginner sees what negative looks like.
- On "drawn" (the transcriber files "arrow" late; use `cue(6, "drawn")`): `b-amp0` and `b-amp1` draw on both paths, both pointing up, gold.
- Leaves: the side sketch fades at line 7 start; "amplitude = a number" stays small until line 9 ends.

### Line 7 (31.51 to 35.72) "A second H brings the paths together, and on each result, their arrows add."
- On "second": `b-H2` draws where the paths meet; on "together" the two paths' ends close into it.
- On "result": the output labels "0" and "1" draw beside the bars on the right.
- On "arrows" (`cue(7, "arrows")`; "add" is filed late): copies of both arrows fly from the paths into each
  output slot (move 0.9 s). Path one's copy heading to slot 1 stays up for now; it turns over in line 8.

### Line 8 (36.02 to 41.61) "On zero they point the same way and grow. On one, this H flips path one's arrow, so they cancel."
- On "zero": in slot 0 the two up arrows stack head to tail into one long gold arrow; "grow" bounces it once.
- On "flips" (`cue(8, "path", 0, -0.3)`, since "H flips" is heard glued): H2 letter pulses gold and path one's
  copy in slot 1 rotates from up to down (onFrame, 0.6 s); on "cancel" the up and down arrows shrink into a
  single ink dot with a small "0" label.
- Bars: on "grow" bar 0 rises from 50 to 100 percent (gold); on "cancel" bar 1 drains from 50 to 0.

### Line 9 (41.91 to 44.19) "So H then H always reads zero."
- On "So" (single letters are heard glued to the next word, so cue `cue(9, "reads", 0, -0.8)` or the line start): a compact caption-card at the bottom of the board area (x 700 to 1220, y 760 to 840):
  "H → H  ⇒  always 0", 56 px, the "0" gold. (Use plain "→" twice if ⇒ is not a hand glyph.)
- Leaves: the card and both output stacks blur at `cue(10, "add")`; bars glide back to 50 50, ink.

### Line 10 (44.49 to 49.33) "Now add a Z gate in the middle. It shifts path one by half a wave, flipping its sign."
- On "add" (`cue(10, "add")`, Z is heard glued as "Zgate"): `b-Zbox` draws on the lower path, letter Z gold.
- On "half": a short wave (120 px) drawn along path 1 right of Z slides half a wavelength so it turns upside
  down (onFrame, 0.8 s), with a tiny "½ wave" label (40 px).
- On "flipping": the arrow `b-amp1` (after Z) rotates from up to down over 0.8 s (onFrame), gold; a small
  "+ → −" label writes under it on "sign" (44 px).
- Z letter returns to ink after the flip; the down arrow keeps the gold.

### Line 11 (49.63 to 53.79) "That's the headphone trick. Now the arrows cancel on zero, and add on one."
- On "headphone": the parked headphones icon wiggles and turns gold for 1 s.
- On "arrows": arrow copies fly again into the slots (move 0.9 s); path one's copy reaches slot 0 pointing
  down, and in slot 1 the second H turns it over again, so it points up.
- On "cancel": slot 0 shows up + down shrinking to an ink dot; bar 0 drains from 50 to 0.
- On "add": slot 1 shows up + up stacking into one long gold arrow; bar 1 rises from 50 to 100 percent, gold.

### Line 12 (54.09 to 57.70) "So H, Z, H reads one every time, no X gate needed."
- The diagram shrinks up (scale 0.75, move 1 s) and under it, at the line start (`cue(12)`; the letters are heard glued), a clean circuit row writes:
  "|0⟩ ─ H ─ Z ─ H" drawn as a hand circuit wire with three boxes (x 360 to 1300, y 760), and on "one"
  a readout "1 1 1 1" appears at the wire's end (x 1400 to 1700), the 1s gold.
- On "no": a small crossed out X gate, ink, beside the readout.
- Leaves: circuit row and readout blur at line 13 start (the diagram stays).

### Line 13 (58.00 to 62.54) "Shift path one by a quarter wave instead, and you land halfway, at fifty fifty."
- Diagram returns to full size. The Z box is replaced by a box labelled "¼ wave" (relabel on "quarter").
- On "quarter": `b-amp1` rotates from down to pointing right (90 degrees, onFrame, 0.8 s).
- On "halfway": slot 0 shows up + right stacking into a slanted gold arrow leaning right; slot 1 shows up +
  left (the second H turns the sideways arrow over) stacking into one leaning left. Same medium length.
- On "at" (`cue(13, "at")`; "fifty fifty" is heard as 50-50): both bars glide to 50 percent (onFrame), labels "50%" write, gold.
- Leaves: whole diagram blurs out at `cue(14, "Unlike", 0, -0.3)`, and the parked headphones icon goes with it.

### Line 14 (62.84 to 67.90) "Unlike headphones, nothing is lost. The chance that vanishes from zero reappears on one."
- Split frame. Left (x 200 to 820): small headphones with a flat line and "silence" (ink), drawn on "headphones".
- Right (x 1000 to 1700): two big chance bars "0" and "1"; bar 0 starts at 100 percent (gold).
- On "vanishes": bar 0 drains to 0 while bar 1 fills to 100 (onFrame, 1.4 s), with a curved gold arrow from
  bar 0 over to bar 1 drawn on "reappears", label "moves, never lost" (44 px).
- A "total 100%" ink label stays steady above both bars throughout.
- Leaves: left headphones blur at line 15 start; bars blur at `cue(15, "amplitudes", 0, -0.2)`.

### Line 15 (68.20 to 72.83) "And it isn't particles colliding. It's amplitudes, just numbers, adding to zero."
- On "particles": two hand-drawn balls rush toward each other at centre (x 700 to 1200, y 400) and on
  "colliding" a big ink cross is drawn over the pair.
- On "amplitudes": the balls blur away; at centre write "+½" and "−½" as two arrows (up, down) with
  their labels; on "zero" the sum writes: "+½ + −½ = 0" at 80 px, the "0" gold.
  (Exact values on outcome zero in H Z H are plus one half and minus one half, so this is literally right.)

### Line 16 (73.13 to 77.39) "Probabilities alone could never cancel, because a chance is never negative."
- On "Probabilities": under the sum, a number line from 0 to 100 percent draws (x 500 to 1420, y 680).
- Two ink blocks "50%" and "50%" stack on it to make "100%", never reaching back below 0.
- On "negative": the region left of 0 is drawn hatched and labelled "no chances here" (44 px); a small
  ink cross over a "−50%" block that tries to slide in.
- Leaves: everything blurs at line 17 start.

### Line 17 (77.69 to 81.51) "Every quantum algorithm is a careful pattern of these cancellations."
- On "algorithm": a wider sketch of many paths (six thin paths fanning out from one H column into a row of
  six output slots, x 300 to 1600, y 280 to 720). On "pattern": five slots show arrow pairs collapsing to dots
  one after another (0.25 s apart); on "cancellations" the last slot grows one tall gold arrow and bar.
  No label claims "right answer"; the picture only shows cancellations leaving one outcome.
- Leaves: blurs at line 18 start.

### Line 18 (81.81 to 86.63, then the 2.6 s hold) "Remember, amplitudes add like waves. In step they grow, and out of step they cancel."
- Closing card, stays to the end:
  - Top (y 180 to 300): the circuit "|0⟩ ─ H ─ Z ─ H → 1" at 70 px, drawn on "remember", the final 1 gold.
  - Middle left (x 260 to 900, y 420 to 700): two waves stacked in step merging into a tall wave (gold) with
    label "in step: grow" (56 px), drawn on "In step".
  - Middle right (x 1020 to 1660, y 420 to 700): two opposite waves merging into a flat line (ink) with
    label "out of step: cancel" (56 px), drawn on "out".
  - Bottom (y 760 to 840): "Amplitudes add like waves." 64 px, written on "amplitudes", underlined in gold.
- The flat line's sum keeps a gentle onFrame shimmer on the "grow" wave so the hold is not static.

## Glyph note
Labels only hand-draw θ π ψ φ α β ω Σ ⊗ | ⟨ ⟩ √ → ≈. For the minus sign, ½, ⇒ and the circuit wire, draw them
as small inline SVG strokes (or use rough lines for the wire) rather than relying on font glyphs. Check
`kit/glyphs.mjs` before building.

## Captions: phrase pairs for scene.mjs
```js
export const phrases = [
  ["noise cancelling", "noise-cancelling"],
  ["H then H", "H → H"],
  ["H, Z, H", "H Z H"],
];
```
Built-ins already cover "fifty fifty" to 50/50. Keep "zero" and "one" as words in captions (beginners read them
more easily than kets here); kets appear only in the drawings.

## Respellings for the voice
None needed. Whisper heard every real word. The "not heard" flags are of two kinds: single letters glued to the
next word ("Xgate", "Hbrings", "Hflips", "Hthen Halways", "Zgate", "HZ, Hreads"), and line-end words ("too",
"arrow", "add", "one", "it's") filed into the neighbouring line window, plus "fifty fifty" heard as 50-50.
So never cue on a single letter ("H", "Z", "X") or on those glued neighbours; cue on a nearby ordinary word
with an offset, as the beats above do. `cue()` on a missing word falls back to an estimate, which is fine for
the line-end words but drifts for the glued ones.
