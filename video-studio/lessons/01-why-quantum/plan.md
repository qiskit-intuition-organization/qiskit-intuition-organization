# 01 Why quantum computers? Beat plan

19 lines, 259 words, Emma ends at 87.7 s, film about 90.3 s with the 2.6 s hold.
Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Ink #e8e8e8, gold #d9b463 only for the
thing that matters right now.

Four scenes, never stacked:
A. The myth (lines 0 to 2): laptop vs quantum computer, every answer at once, one answer at random.
B. The harbour (lines 3 to 6): interference named, then the analogy, drawn big and moving.
C. Paths and amplitudes (lines 7 to 14): bars that add or cancel, then one H (fifty fifty), then
   the two H experiment.
D. What it means (lines 15 to 18): you never see the wave, calm spots on wrong answers, which
   problems, closing card.

One visual language carries through B, C and D: **height above a baseline**. A crest is a bar up,
a trough is a bar down. Amplitudes are drawn as the same little up and down bars, so the beginner
sees that an amplitude "is like a wave height". Bars that meet slide together and either stack
(grow) or meet and vanish (cancel).

Times below are from `project/assets/vo/timing.json` (line start to end). Timing note: whisper
puts some line-final words into the next line ("once" 1, "guess" 2, "out" 3, "flat" 5, "move" 6,
"squared" 9, "zero" 10, "toss" 11). It also glues "H" to the next word ("Hmakes", "Htwice",
"Hsplits"), so `cue(11, "H")`, `cue(12, "twice")` and `cue(12, "splits")` fall back to the
text-share estimate. That is fine; if one lands late, use `lines[i].end - 0.35` (for a last word)
or the line start plus a share of `dur`.

---

## Scene A: the myth

### Line 0 (0.4 to 3.6) "Why build a quantum computer, when your laptop is so fast?"
- Title block at top left from 0 (kit). Keep it to 3.9 s, `blurOut("#b-title")` at line 1 start.
- `b-qc` on "quantum": the quantum computer as people picture it, the gold-plated "chandelier"
  (dilution fridge) drawn in ink: three stacked discs joined by many thin vertical wires, centred
  x 1260, y 330 to 800, about 300 wide. Draw 1.6 s. Label "quantum computer" 44 px under it (y 830).
- `b-laptop` on "laptop": a hand-drawn open laptop at x 520, y 520 to 780 (screen 360x230, base
  trapezoid). A tiny speed streak (three short lines) behind it on "fast". Label "laptop" 44 px.
- `b-q` on "fast": a big gold "?" (80 px) between them at x 890, y 560. Gold: the question.

### Line 1 (3.9 to 6.5) "Maybe you've heard it tries every answer at once."
- blurOut `b-title`, `b-laptop`, `b-q` at line start (the laptop comes back in line 17).
- `b-qc` moves left and shrinks (x 1260 to x 360, scale 0.7) over 0.8 s.
- `b-cards`: on "every answer", a row of 8 small answer cards (110x140, rounded rect, ink) at
  x 640 to 1700, y 420, each with a number 1 to 8 written 48 px. They draw in quickly left to right
  (0.12 s stagger).
- `b-fan` on "every": 8 thin dashed arrows from the machine to the 8 cards, drawn together.
- `b-myth` on "once" (cue estimate, see timing note): label 52 px at y 660 centred under the
  cards: `"every answer at once?"` (with the quote marks, in ink: it is the myth).

### Line 2 (6.8 to 10.7) "But looking, which we call measuring, gives one random answer, just a guess."
- `b-eye` on "looking": a small hand-drawn eye (almond and pupil) above the cards at x 1170, y 230.
- `b-measure` on "measuring": label "measuring" 48 px next to the eye.
- On "one": blurOut `b-myth`; seven arrows and seven cards fade to 0.25, one arrow and card stay.
- On "random": the gold highlight hops across cards 2, 7, 4 and lands on card 5 (via `onFrame`
  and `sched`, 0.25 s per hop); card 5 fill turns gold hachure. A small die (cube with pips)
  draws at x 1660, y 260.
- On "guess" (use `lines[2].end - 0.35`): label "one answer, just a guess" 48 px at y 660.
- Gold: the one chosen card.

## Scene B: the harbour (the analogy)

### Line 3 (11.0 to 14.8) "The real trick is interference, waves adding up or cancelling out."
- blurOut all of scene A at line start.
- `b-interf` on "interference": the word "interference" written 96 px, gold, at y 260, centred.
- `b-add` on "adding up": left at x 620, y 560, two small ink crests (bumps on a baseline) slide
  together and stack into one bump twice as tall. Label "add up" 44 px under it.
- `b-cancel` on "cancelling": right at x 1300, y 560, a crest and a trough (a bump up and a dip
  down) slide together and flatten into a straight line. Label "cancel out" 44 px under it.
  The baselines ripple slightly (`onFrame`) so nothing is still.
- All of it blurs out at the start of line 4.

### Line 4 (15.1 to 18.7) "Picture waves passing through two gaps in a harbour wall, spreading out."
Central sketch, top-down view of the harbour, filling the board:
- Sea on the left (x 160 to 700): `b-sea` straight vertical crest lines every 70 px, moving right
  continuously with `onFrame` (they wrap). Starts on "waves".
- `b-wall` on "harbour": a thick vertical wall at x 720, y 110 to 840, drawn as a hatched stone
  strip 36 px wide, with two gaps of 60 px at y 360 and y 600. Label "harbour wall" 44 px at
  x 520, y 90 (above, left of the wall).
- On "two gaps": two small ink arrows point at the gaps.
- `b-ripples` on "spreading": on the right of the wall (x 740 to 1500), half circles grow out of
  each gap, a new crest every 70 px, moving outwards continuously (`onFrame`, radius = speed * t
  mod spacing). Crests are solid ink strokes, troughs are dashed and dimmer (DIM). Clip at
  x 1500 so they never cross the beach.
- `b-beach` on "out" (the last word): a vertical line at x 1540, y 110 to 840 labelled "beach"
  44 px at its top.

### Line 5 (19.0 to 22.2) "Where a high crest meets a low trough, the water stays flat."
- Slow the ripple motion a little so the eye can follow.
- On "crest": one solid crest arc from the top gap briefly thickens (ink, stroke 4). Label
  "crest (high)" 44 px with an arrow to it.
- On "trough": one dashed trough arc from the bottom gap thickens. Label "trough (low)" 44 px.
- `b-meet` on "meets", at their crossing point: a small circle.
- `b-profile` on "water stays": on the beach, the wave height along the beach is drawn as a curve
  sticking out to the right of the beach line (x 1540 to 1740): big bumps where crests add, almost
  nothing where they cancel. Physically: height = |cos(pi * (d1 minus d2) / wavelength)| where d1,
  d2 are the distances from each gap to that beach point. Draw 1.2 s.
- On "flat" (use `lines[5].end - 0.35`): the flat stretches of the profile get gold dots,
  labelled "calm" 44 px gold. Gold: the calm spots.

### Line 6 (22.5 to 26.8) "Where two crests meet, the wave grows. Move the gaps, and the calm spots move."
- On "crests meet": two solid crest arcs (one from each gap) thicken where they cross; the
  matching bump on the beach profile pulses up (scale 1.15 and back). Label "big wave" 44 px ink.
- On "Move the gaps": the two gaps slide along the wall (top gap y 360 to 300, bottom gap y 600
  to 680) over 1.2 s with `power2.inOut`. The ripples follow their gaps, and the beach profile is
  recomputed every frame from the gap positions, so the calm spots visibly slide.
- On "spots move": the gold calm dots ride along to their new places. This is the key moving
  picture: you choose where the calm spots are.

## Scene C: paths and amplitudes

### Line 7 (27.1 to 32.6) "Quantum computers reach answers by several paths too, each carrying a number called an amplitude."
- blurOut the harbour at line start; clean board.
- `b-start` on "Quantum computers": a small circle "start" at x 360, y 470.
- `b-ans` on "answers": one answer card at x 1500, y 470 (the same card style as scene A).
- `b-paths` on "paths too": two curved arrows from start to the card, one arching up (y 260), one
  arching down (y 680), like the two routes through the two gaps. Draw 1 s.
- `b-amp` on "amplitude": on each path, a small tag: a baseline stub with a bar (bar 90 px high).
  Label "amplitude" 56 px gold at y 150, with a thin arrow to the top tag. Gold: the new word.

### Line 8 (32.9 to 38.2) "Like a wave's height, it can be positive or negative, and amplitudes for the same answer add up."
- On "wave's height": a tiny crest-and-trough squiggle with a height arrow draws next to the
  label, to link back.
- `b-legend` at the left edge (x 200 to 320, y 640 to 820), small and ink: on "positive" an up
  bar labelled "+" 56 px writes in; on "negative" a down bar labelled with a hand-drawn minus
  stroke. The two path tags in this example are both up bars, so the sum grows.
- On "add up": both bars slide along their paths into the card (0.9 s) and stack into one bar of
  double height on top of the card. That stacked bar is gold.

### Line 9 (38.5 to 41.5) "That answer's chance is the size of the total, squared."
- On "chance": label "chance" 56 px under the card.
- On "size": the gold stacked bar gets a bracket labelled "size".
- On "squared" (use `lines[9].end - 0.35`): a gold hachured square grows out from the bar
  (side = bar height), labelled "size × size" in a small label (write "size times size" if the ×
  glyph does not render in Caveat), and "chance" moves inside it. The area of the square is the
  chance.

### Line 10 (41.8 to 46.3) "Let's try one qubit, a quantum bit that reads zero or one, starting at zero."
- blurOut scene C so far at line start.
- Path diagram across the board, left to right, all ink:
  - `b-q0` on "qubit": start node, an empty circle at x 260, y 470. Label "qubit" 44 px under it.
  - `b-01` on "zero or one": a small label "reads 0 or 1" 44 px under "qubit" (y 600).
  - On "starting at zero" (use `lines[10].end - 0.6`): the "0" 64 px writes inside the node.

### Line 11 (46.6 to 49.6) "One step called H makes it a fifty fifty coin toss."
- `b-h1` on "H" (cue estimate, see timing note): a tall gate box at x 600, y 230 to 710 with "H"
  72 px. Label "a step" 40 px above it.
- `b-split1` on "makes": two arrows from H1 to two middle nodes, "0" at x 870, y 290 and "1" at
  x 870, y 650.
- On "fifty fifty": "50%" 44 px writes beside each middle node.
- `b-coin` on "coin toss": a small coin at x 870, y 470 between them flips (scaleY through 0 via
  `onFrame`, 0.3 s per flip) showing 0, 1, 1, 0 in turn. Gold: the coin.

### Line 12 (49.9 to 54.1) "Now do H twice. Each H splits every path in two, making four."
- At line start, the coin and both "50%" labels blur out.
- `b-h2` on "twice" (cue estimate): a second tall H box at x 1140, y 230 to 710.
- `b-split2` on "splits" (cue estimate): from each middle node, through H2, two arrows to the end
  nodes "0" at x 1500, y 290 and "1" at x 1500, y 650. Four arrows draw together (0.8 s).
- `b-count` on "four": label "4 paths" 48 px at x 1660, y 470.

### Line 13 (54.4 to 58.3) "The paths to one carry plus a half and minus a half. They cancel."
- On "paths to one": the two paths ending at end node "1" thicken; the other two dim to 0.35.
- On "plus a half": tag on the 0 to 0 to 1 path, a short up bar labelled "+½".
- On "minus a half": tag on the 0 to 1 to 1 path (H acting on 1 is where the sign flips), a
  down bar labelled "−½" (draw the minus as a short stroke if the glyph is missing).
- On "cancel": both bars slide into end node "1" and meet: the up bar and the down bar shrink to
  nothing together (0.6 s). End node "1" fades to DIM and gets a small "0%" label. Gold: the
  moment of cancelling (the bars are gold while they slide).

### Line 14 (58.6 to 63.2) "Both paths to zero carry plus a half, adding to one. It always reads zero."
- On "paths to zero": the two paths to end node "0" thicken, the paths to "1" dim.
- On "plus a half": two up bars, each "+½".
- On "adding": they slide into end node "0" and stack into one full bar, labelled "1" in gold.
- On "always reads zero": end node "0" turns gold (hachure fill), label "100%" 56 px gold beside
  it. A quick tally of four readouts writes under it: "0 0 0 0" (0.15 s each) so the screen keeps
  moving.

## Scene D: what it means

### Line 15 (63.5 to 67.3) "Unlike water, you never see this wave. Each run shows one answer."
- blurOut scene C at line start.
- Left panel (x 200 to 840): a mini harbour (wall with two gaps, a few ripple arcs, moving) with
  the eye from line 2 above it. Label "water: you watch it" 44 px. Draws on "water".
- Right panel (x 1060 to 1700): a closed box (the quantum computer, simple rectangle with a slot).
  On "never see": inside the box a faint wave draws, then a lid slides shut over it (0.6 s) and a
  small "?" appears on the lid. Label "you never see the wave" 44 px.
- On "run": a single answer card drops out of the slot, gold; on "one answer" a second card
  follows (ink), replacing the first, so it reads "one per run".

### Line 16 (67.6 to 73.6) "So a quantum algorithm, a recipe of steps, puts calm spots on wrong answers, making the right one likely."
- blurOut both panels.
- `b-recipe` on "algorithm": top left (x 200, y 140), a small recipe card with three numbered
  lines, labelled "algorithm = recipe of steps" 44 px; it writes in on "recipe".
- The 8 answer cards from line 1 return in a row (x 300 to 1620, y 600). Above them, a wave height
  curve (same style as the beach profile): on "calm spots" it draws flat over seven cards
  (gold dots on the flat stretches, as in line 5); on "wrong answers" small ink crosses mark those
  seven cards.
- On "right one": the curve rises into one tall peak over card 5, which turns gold.
- On "likely": under the cards, a chance bar for each card: seven almost empty, card 5's bar fills
  to near the top (gold). This is the payoff of the analogy: the algorithm places the calm spots.

### Line 17 (73.9 to 81.5) "This only helps on problems with hidden patterns, like factoring or simulating molecules. For everyday jobs, your laptop wins."
- blurOut line 16's picture at line start.
- Left half, heading "hidden patterns" 56 px at y 220 (x 260).
  - On "factoring": "15 = 3 × 5" written 64 px at x 260, y 400 (gold for "3 × 5"; write
    "15 → 3 and 5" if × is missing), with a tiny "factoring" label under it, so the word is
    shown as well as said.
  - On "molecules": a ball-and-stick molecule (three circles, two sticks, like water) at x 560,
    y 620, drawn 1 s.
- Right half: on "everyday": the laptop from line 0 redraws at x 1350, y 520 with a little email
  envelope and a tiny spreadsheet grid on its screen. Label "everyday jobs" 48 px.
- On "wins" (use `lines[17].end - 0.35`): a gold tick next to the laptop.

### Line 18 (81.8 to 87.7, holds to the end) "In short, quantum speed-ups come from interference, where wrong answers cancel and right ones reinforce."
- blurOut line 17's picture at line start.
- Closing card, centred:
  - On "interference": "interference" written 110 px, gold, at y 280, with a short gold underline.
  - On "cancel": left at x 560, y 560, an up bar and a down bar slide together and vanish,
    leaving a flat line; label "wrong answers cancel" 48 px ink under it.
  - On "reinforce": right at x 1360, y 560, two up bars stack into one tall gold bar; label
    "right ones reinforce" 48 px under it.
  - Keep a slow ripple running in the underline (`onFrame`) so the held frame is never fully
    still. Everything stays through the 2.6 s hold.

---

## Caption phrase pairs (spoken -> notation)
Add in scene.mjs:
```js
export const phrases = [
  ["plus a half", "+½"],
  ["minus a half", "−½"],
];
```
"fifty fifty" becomes 50/50 through the kit's built-in pair. "speed-ups" is written with its
hyphen in the script, so it needs no pair. "H" stays as spoken. Leave "zero", "one" and "four"
as words: in this lesson they are spoken as answers, and a beginner reads the words more easily.
(If "½" or "−" is missing from the caption font, fall back to "+1/2" and "-1/2".)

## Respellings for the voice
None needed. Every real word was heard. The words narrate flags ("why", "once", "guess", "out",
"flat", "squared", and "H", "makes", "twice", "splits", "toss") are line-boundary slips or
whisper gluing "H" to the next word, and "fifty fifty" is heard as "50-50" (digits are fine).
