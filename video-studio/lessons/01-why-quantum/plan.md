# 01 Why quantum computers? Beat plan

18 lines, 259 words, Emma ends at 83.2 s, film about 85.8 s with the 2.6 s hold.
Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Ink #e8e8e8, gold #d9b463 only for the
thing that matters right now.

Four scenes, never stacked:
A. The myth (lines 0 to 2): laptop vs quantum computer, every answer at once, one answer at random.
B. The harbour (lines 3 to 6): the analogy, drawn big and moving.
C. Paths and amplitudes (lines 7 to 13): bars that add or cancel, then the two H experiment.
D. What it means (lines 14 to 17): you never see the wave, calm spots on wrong answers, which
   problems, closing card.

One visual language carries through B, C and D: **height above a baseline**. A crest is a bar up,
a trough is a bar down. Amplitudes are drawn as the same little up and down bars, so the beginner
sees that an amplitude "is like a wave height". Bars that meet slide together and either stack
(grow) or meet and vanish (cancel).

Timing note: whisper puts some line-final words into the next line ("once" 1, "out" 4, "flat" 5,
"move" 6, "up" 8, "twice" 10, "wins" 16). `cue()` falls back to a text-share estimate for those,
which is fine; if one lands late, use `lines[i].end - 0.35` instead.

---

## Scene A: the myth

### Line 0 (0.4 to 3.6) "Why build a quantum computer, when your laptop is so fast?"
- Title block at top left from 0 (kit). Keep it to 3.7 s, `blurOut("#b-title")` at line 1 start.
- `b-qc` on "quantum": the quantum computer as people picture it, the gold-plated "chandelier"
  (dilution fridge) drawn in ink: three stacked discs joined by many thin vertical wires, centred
  x 1260, y 330 to 800, about 300 wide. Draw 1.6 s. Label "quantum computer" 44 px under it (y 830).
- `b-laptop` on "laptop": a hand-drawn open laptop at x 520, y 520 to 780 (screen 360x230, base
  trapezoid). A tiny speed streak (three short lines) behind it on "fast". Label "laptop" 44 px.
- `b-q` on "fast": a big gold "?" (80 px) between them at x 890, y 560. Gold: the question.

### Line 1 (3.9 to 6.4) "You may have heard it tries every answer at once."
- blurOut `b-title`, `b-laptop`, `b-q` at line start (laptop comes back in line 16).
- `b-qc` moves left and shrinks (x 1260 to x 360, scale 0.7) over 0.8 s.
- `b-cards`: on "every answer", a row of 8 small answer cards (110x140, rounded rect, ink) at
  x 640 to 1700, y 420, each with a number 1 to 8 written 48 px. They draw in quickly left to right
  (0.12 s stagger).
- `b-fan` on "every": 8 thin dashed arrows from the machine to the 8 cards, drawn together.
- `b-myth` on "once": label 52 px at y 660 centred over the cards: `"every answer at once?"`
  (with the quote marks, in ink: it is the myth).

### Line 2 (6.7 to 10.5) "But looking, which we call measuring, gives you one answer, picked at random."
- `b-eye` on "looking": a small hand-drawn eye (almond and pupil) above the cards at x 1170, y 230.
- `b-measure` on "measuring": label "measuring" 48 px next to the eye.
- On "one answer": seven arrows and seven cards fade to 0.25, one arrow and card stay.
- On "random": the gold highlight hops across cards 2, 7, 4 and lands on card 5 (via `onFrame`
  and `sched`, 0.25 s per hop); card 5 fill turns gold hachure. A small die (cube with pips) draws
  at x 1660, y 260 on "random". Label "one answer, at random" 48 px at y 660 replaces `b-myth`
  (blurOut the myth on "one").
- Gold: the one chosen card.

## Scene B: the harbour (the analogy)

### Line 3 (10.8 to 14.0) "The real trick is something waves do, called interference."
- blurOut all of scene A at line start.
- `b-wave3` on "waves": one long sine stroke across the centre, x 360 to 1560, y 470, drawn 0.9 s,
  then it ripples (phase moves via `onFrame`).
- `b-interf` on "interference": the word "interference" written 96 px, gold, at y 640, centred.
- Both blur out at the start of line 4 (the wave "becomes" the sea: fade, not cut).

### Line 4 (14.3 to 18.2) "Picture waves passing through two gaps in a harbour wall, and spreading out."
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
- `b-beach` on "out": a vertical line at x 1540, y 110 to 840 labelled "beach" 44 px at its top.

### Line 5 (18.5 to 22.5) "Where a crest from one gap meets a trough from the other, the water stays flat."
- Slow the ripple motion a little so the eye can follow.
- On "crest": one solid crest arc from the top gap briefly thickens (ink, stroke 4). Label "crest"
  44 px with an arrow to it.
- On "trough": one dashed trough arc from the bottom gap thickens. Label "trough" 44 px.
- `b-meet` at their crossing point: a small circle.
- `b-profile` on "water stays": on the beach, the wave height along the beach is drawn as a curve
  sticking out to the right of the beach line (x 1540 to 1740): big bumps where crests add, almost
  nothing where they cancel. Physically: height = |cos(pi * (d1 minus d2) / wavelength)| where d1, d2
  are the distances from each gap to that beach point. Draw 1.2 s.
- On "flat": the flat stretches of the profile get gold dots, labelled "calm" 44 px gold. Gold: the
  calm spots.

### Line 6 (22.8 to 27.1) "Where two crests meet, the wave grows. Move the gaps, and the calm spots move."
- On "crests meet": two solid crest arcs (one from each gap) thicken where they cross; the
  matching bump on the beach profile pulses up (scale 1.15 and back). Label "big wave" 44 px ink.
- On "Move the gaps": the two gaps slide along the wall (top gap y 360 to 300, bottom gap y 600
  to 680) over 1.2 s with `power2.inOut`. The ripples follow their gaps, and the beach profile is
  recomputed every frame from the gap positions, so the calm spots visibly slide.
- On "spots move": the gold calm dots ride along to their new places. This is the key moving
  picture: you choose where the calm spots are.

## Scene C: paths and amplitudes

### Line 7 (27.4 to 33.0) "A quantum computer does this with answers. Each path to an answer carries a number called an amplitude."
- blurOut the harbour except `b-profile`'s idea; clean board.
- `b-start` on "quantum computer": a small circle "start" at x 360, y 470.
- `b-ans` on "answers": one answer card at x 1500, y 470 (the same card style as scene A).
- `b-paths` on "path": two curved arrows from start to the card, one arching up (y 260), one
  arching down (y 680). Draw 1 s.
- `b-amp` on "amplitude": on each path, a small tag: a baseline stub with a bar (bar 90 px high).
  Label "amplitude" 56 px gold at y 150, with a thin arrow to the top tag. Gold: the new word.

### Line 8 (33.3 to 37.7) "Like a wave, it can be positive or negative, and paths to one answer add up."
- On "wave": a tiny crest-and-trough squiggle draws next to the label, to link back.
- `b-legend` at the left edge (x 200 to 320, y 640 to 820), small and ink: on "positive" an up bar
  labelled "+" 56 px writes in; on "negative" a down bar labelled with a hand-drawn minus stroke.
  The two path tags in this example are both up bars, so the sum grows.
- On "add up": both bars slide along their paths into the card (0.9 s) and stack into one bar of
  double height on top of the card. That stacked bar is gold.

### Line 9 (38.0 to 41.2) "The chance of that answer is the size of the total, squared."
- On "chance": label "chance" 56 px under the card.
- On "size": the gold stacked bar gets a bracket labelled "size".
- On "squared": a gold hachured square grows out from the bar (side = bar height), labelled
  "size x size" in a small label, and "chance" sits inside it. The area of the square is the
  chance. (Write "size × size" only if the × glyph renders in Caveat; otherwise "size times size".)

### Line 10 (41.5 to 46.9) "Let's try it. A qubit, the quantum bit, starts at zero and goes through a step called H, twice."
- blurOut scene C so far at line start.
- Path diagram across the board, left to right, all ink:
  - `b-q0` on "qubit": start node, a circle with "0" written 64 px, at x 260, y 470. Label "qubit"
    44 px under it.
  - On "zero": the "0" inside writes in.
  - `b-h1` on "H": a square gate box 120x120 with "H" 72 px at x 600, y 470.
  - `b-h2` on "twice": a second H box at x 1140, y 470 (cue estimate, see timing note).
- Nothing else yet: the boxes are the "steps".

### Line 11 (47.2 to 50.9) "Each H splits every path in two, so four paths reach the end."
- `b-split1` on "splits": two arrows from H1 to two middle nodes, "0" at x 870, y 290 and "1" at
  x 870, y 650.
- `b-split2` on "four": from each middle node, through H2, two arrows to the end nodes "0" at
  x 1500, y 290 and "1" at x 1500, y 650. Four arrows draw together (0.8 s).
- `b-count` on "end": label "4 paths" 48 px at x 1660, y 470.
- Lay the H2 box as a tall column (x 1140, y 230 to 710) so all four paths visibly pass through
  it; same for H1 if that reads better.

### Line 12 (51.2 to 55.3) "The two paths to one carry plus a half and minus a half. They cancel."
- On "two paths to one": the two paths ending at end node "1" thicken; the other two dim to 0.35.
- On "plus a half": tag on the 0 to 0 to 1 path, a short up bar labelled "+½".
- On "minus a half": tag on the 0 to 1 to 1 path (the H acting on 1 is where the sign flips), a
  down bar labelled "−½" (draw the minus as a short stroke if the glyph is missing).
- On "cancel": both bars slide into end node "1" and meet: the up bar and the down bar shrink to
  nothing together (0.6 s). End node "1" fades to DIM and gets a small "0%" label. Gold: the
  moment of cancelling (the bars are gold while they slide).

### Line 13 (55.6 to 60.3) "The two paths to zero carry a half each, adding up to one. It always reads zero."
- On "paths to zero": the two paths to end node "0" thicken, the paths to "1" dim.
- On "half each": two up bars, each "+½".
- On "adding": they slide into end node "0" and stack into one full bar, labelled "1" in gold.
- On "always reads zero": end node "0" turns gold (hachure fill), label "100%" 56 px gold beside it.
  A quick tally of four readouts writes under it: "0 0 0 0" (0.15 s each) so the screen keeps moving.

## Scene D: what it means

### Line 14 (60.6 to 64.5) "Unlike water, you never see this wave. Each run shows one answer."
- blurOut scene C at line start.
- Left panel (x 200 to 840): a mini harbour (wall with two gaps, a few ripple arcs, moving) with
  the eye from line 2 above it. Label "water: you watch it" 44 px. Draws on "water".
- Right panel (x 1060 to 1700): a closed box (the quantum computer, simple rectangle with a slot).
  On "never see": inside the box a faint wave draws, then a lid slides shut over it (0.6 s) and a
  small "?" appears on the lid. Label "you never see the wave" 44 px.
- On "one answer": a single answer card drops out of the slot, gold. On "run" two more cards follow
  (ink), each replacing the last, so it reads "one per run".

### Line 15 (64.8 to 69.7) "So a quantum algorithm puts the calm spots on wrong answers, making the right one likely."
- blurOut both panels.
- The 8 answer cards from line 1 return in a row (x 300 to 1620, y 600). Above them, a wave height
  curve (same style as the beach profile): on "calm spots" it draws flat over seven cards
  (gold dots on the flat stretches, as in line 5); on "wrong answers" small ink crosses mark those
  seven cards.
- On "right one": the curve rises into one tall peak over card 5, which turns gold.
- On "likely": under the cards, a chance bar for each card: seven almost empty, card 5's bar fills
  to near the top (gold). This is the payoff of the analogy: the algorithm places the calm spots.

### Line 16 (70.0 to 77.7) "That only pays off for problems with hidden structure, like factoring or simulating molecules. For everyday jobs, your laptop wins."
- blurOut line 15's picture at line start.
- Left half, heading "hidden structure" 56 px at y 220 (x 260).
  - On "factoring": "15 → 3 and 5" written 64 px at x 260, y 400 (gold for the answer "3 and 5").
  - On "molecules": a ball-and-stick molecule (three circles, two sticks, like water) at x 560,
    y 620, drawn 1 s.
- Right half: on "everyday": the laptop from line 0 redraws at x 1350, y 520 with a little email
  envelope and a tiny spreadsheet grid on its screen. Label "everyday jobs" 48 px.
- On "wins": a gold tick next to the laptop.

### Line 17 (78.0 to 83.2, holds to the end) "Quantum speed ups come from interference, where wrong answers cancel and right ones reinforce."
- blurOut line 16's picture at line start.
- Closing card, centred:
  - On "interference": "interference" written 110 px, gold, at y 280, with a short gold underline.
  - On "wrong answers cancel" (cue "cancel"): left at x 560, y 560, an up bar and a down bar slide
    together and vanish, leaving a flat line; label "wrong answers cancel" 48 px ink under it.
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
  ["a half each", "½ each"],
  ["speed ups", "speed-ups"],
];
```
"H" stays as spoken. Leave "zero", "one" and "four" as words: in this lesson they are spoken as
answers, and a beginner reads the words more easily. (If "½" or "−" is missing from the caption font,
fall back to "+1/2" and "-1/2".)

## Respellings for the voice
None needed. Every real word was heard. The words narrate flags ("why", "once", "out", "flat",
"wins") are line-boundary slips: the transcriber heard them but filed them under the next line.
