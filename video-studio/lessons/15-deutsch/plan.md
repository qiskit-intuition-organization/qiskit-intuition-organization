# Lesson 15, Phase kickback: Deutsch's algorithm: beat plan

Voiced with bf_emma: 17 lines, 260 words, narration ends at 87.54 s, film about 90.1 s with the 2.6 s hold.
Times below are from `project/assets/vo/timing.json`; always cue with `cue(line, "word")`, never hard numbers.
Every script word was heard. Note for cues: the transcriber glued "H gate" into "Hgate" (line 8) and
"H makes" into "Hmakes" (line 12), heard "You'd" as "You" (line 3), and some first or last words drift into
the neighbouring line's window: "one" ending line 0 and line 8, "Set" starting line 6, "Flip" starting
line 7, "time" ending line 12, "pair" ending line 14. Cue those by the line start or a neighbouring word
(given below).

Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Ink #e8e8e8, gold #d9b463 on #17191c.
Gold rule: one gold thing at a time, the thing that matters right now.

## Physics the pictures must keep (checked)
- The box computes a one bit answer f(x) for input x = 0 or 1. Constant: f(0) = f(1). Balanced: f(0) differs from f(1).
- The box acts as |x⟩|y⟩ → |x⟩|y ⊕ f(x)⟩: it flips the helper exactly when its answer is one.
- Arrow convention (as in lesson 8): each reading 0 and 1 gets an amplitude arrow; up = plus, down = minus.
  Equal lengths throughout (every state here is an even split).
- Minus |−⟩ = up on 0, down on 1. Flipping it (X) swaps the arrows: down on 0, up on 1 = (−1) × |−⟩.
  So a flip leaves the helper as minus, only times minus one.
- Input after H: |+⟩ = up on 0, up on 1. After the box: the arrow for reading x is turned over when f(x) = 1.
  The helper card never changes. The sign lives on the input's branch: that is the kickback.
- Constant, always one: both input arrows turn down. Same shape, just turned over (an overall sign,
  invisible). Constant, always zero: nothing turns. Either way the final H gives 0 every time.
- Balanced (0 → 0, 1 → 1): only the arrow on 1 turns: up on 0, down on 1 = minus. Final H gives 1 every time.
  (The other balanced box, 0 → 1, 1 → 0, gives down, up = −|−⟩, also 1. Not shown.)
- The final H makes the arrows interfere: for same signs they add on 0 and cancel on 1; for opposite
  signs they cancel on 0 and add on 1. Never draw a 50/50 readout here.
- One query only. You learn f(0) ⊕ f(1), never f(0) or f(1) themselves. Never show the box's two answers
  being read out at the end.

## Recurring objects
- `b-box`: the sealed box. A hand-drawn crate (rough rect, slight 3D top edge, two strap lines) with a big
  "?" on the front. Hook size 360 x 280 at centre (x 780 to 1140, y 430 to 710). Reused as the tall oracle
  box in the circuit (line 5 on, redrawn as `b-oracle`, x 860 to 1060, y 330 to 730, "?" on it).
- Coins (`b-coinTrick`, `b-coinFair`): each is a pair of circles side by side (front and back, r 95),
  with a hand-drawn face glyph inside: a sun (circle with 8 rays) or a crescent moon. Trick coin: sun, sun.
  Real coin: sun, moon. A small curved "turn over" arrow links front to back.
- Arrow card (`b-card...`): a short baseline (220 px), two slot labels "0" and "1" (44 px) at its ends,
  and one vertical amplitude arrow per slot (length 80 px, up or down from the baseline). Each arrow is a
  group rotated by `onFrame` around its foot so it can turn over (0 to 180 degrees) or swap slots.
  Tiny "+" / "−" are not drawn; up and down alone carry the sign.
- Circuit, lines 5 to 12: input wire `b-wireIn` at y 420 and helper wire `b-wireHelp` at y 640, both from
  x 200 to x 1700, labels "input" and "helper" (44 px) at their left ends (x 150 to 330, just above each wire).
  Input arrow cards sit above the input wire (baseline y 290); helper card sits below the helper wire
  (baseline y 760, arrows reach 680 to 840).
- Heading `b-head`: "phase kickback", 48 px ink, top centre (x 960, y 110) from line 4 until line 12.

## Beats

### Line 0 (0.40 to 4.62) "Here's a puzzle. A sealed box takes zero or one, and answers zero or one."
- Kit title block shows until `cue(0, "answers")` (3.48 s), then `blurOut("#b-title")`.
- On "sealed": `b-box` draws (1.6 s) at centre, x 780 to 1140, y 430 to 710 (clear of the title block).
- On "takes": an ink arrow from x 380 into the box's left side at y 570, label "0 or 1" (56 px) above it.
- On "answers": an arrow out of the right side to x 1540, label "0 or 1" (56 px), gold (the unknown answer).
- Leaves: arrows and labels blur out at `cue(1, "either", 0, -0.2)`; the box stays.

### Line 1 (4.92 to 9.51) "It's either constant, the same answer both times, or balanced, two different answers."
- On "It's": the box shrinks and slides to top centre (scale 0.5, centre x 960, y 200; move 0.8 s).
- On "constant": left card at x 260 to 860, y 360 to 760: title "constant" (64 px), then two rows written in
  "0 → 1" and "1 → 1" (56 px) on "same" and "both". The two answers "1" "1" gold, with a gold "same" note.
- On "balanced": right card at x 1060 to 1660: title "balanced", rows "0 → 0" and "1 → 1" written on "two"
  and "different", answers gold with a "different" note; the constant card's gold fades to ink on "balanced".
- Leaves: both cards and the small box blur out at `cue(2, "Think", 0, -0.2)`.

### Line 2 (9.81 to 14.89) "Think of a coin. A trick coin has the same face twice, a real one two different faces."
- Central sketch of the analogy. On "coin" (first): `b-coinTrick` outline circles draw at left (x 220 to 820, y 360 to 600).
- On "same": a sun draws in the front circle; on "twice": a sun in the back circle. Both suns gold while said.
  Label "trick coin" (56 px) under it, and smaller "constant" (44 px) under that.
- On "real": `b-coinFair` circles draw at right (x 1100 to 1700); on "two" a sun, on "different" a moon (gold).
  Label "real coin", and "balanced" under it. The trick coin's suns turn ink when "real" is said.

### Line 3 (15.19 to 19.35) "You'd check both sides, and an ordinary computer must ask the box twice."
- On "check": the little "turn over" arrows on both coins draw and wiggle (rotate ±8 degrees twice), so
  the viewer sees "look at both sides".
- On "ordinary": coins shrink and park in the top left (scale 0.45, x 180 to 620, y 90 to 210).
  A laptop sketch draws at x 300 to 680, y 420 to 700 (ink). The small box (`b-box`, scale 0.6) at x 1150, y 560.
- On "ask": a speech bubble "0 ?" (56 px) travels from laptop to box; on "twice": a second bubble "1 ?".
  A tally "2 questions" (56 px) writes under the box, gold.
- Leaves: laptop, bubbles blur out at `cue(4, "quantum", 0, -0.2)`.

### Line 4 (19.65 to 24.51) "A quantum computer asks once, using phase kickback, where the answer becomes a sign."
- On "quantum": a quantum chip sketch (a square with a qubit circle and pins) draws where the laptop was.
- On "once": one bubble travels to the box; the old "2 questions" is struck through in ink and
  "1 question" writes under it, gold.
- On "phase": "phase kickback" writes centred at y 760 (72 px, gold).
- On "answer": under it at y 840, a small ink note "answer → a sign" (44 px), and on "sign" a tiny up arrow
  and down arrow draw beside it (the up/down sign picture used from line 6 on). On the line's end the note
  fades and "phase kickback" shrinks and moves to become `b-head` at top centre (48 px, ink). Coins, chip, box, tallies blur out at `cue(5, "box", 0, -0.2)`.

### Line 5 (24.81 to 27.86) "The box flips a helper qubit whenever its answer is one."
- On "box": `b-oracle` (tall sealed box, "?") draws at x 860 to 1060, y 330 to 730, and `b-wireIn` draws
  through its top half with label "input".
- On "helper": `b-wireHelp` draws through its bottom half, label "helper".
- On "whenever": a small gold flip arrow (a curl, about 70 px) draws on the helper wire just right of the
  box, with label "flip if answer is 1" (44 px) under it at y 700. It turns ink at line end.

### Line 6 (28.16 to 33.30) "Set the helper to a state called minus: one arrow per reading, up on zero, down on one."
- Zoom in on the helper. The circuit dims to 25 percent opacity (fade 0.35 s at `cue(6)`, the line start;
  "Set" is heard in line 5's window).
- On "minus": a big arrow card `b-cardMinus` draws in the centre (baseline x 640 to 1280, y 500; arrows
  200 px; slot labels "0" and "1" 64 px) with the title "minus" (72 px) and "|−⟩" (72 px) beside it at y 250.
- On "arrow": the baseline and slot labels draw (one slot per reading). On "up": the arrow on 0 draws up (ink).
  On "down": the arrow on 1 draws down, gold.

### Line 7 (33.60 to 38.87) "Flip it, and the arrows swap. It's still minus, just turned over, which means times minus one."
- At `cue(7)` (the line start; "Flip" is heard in line 6's window): a gold flip curl draws above the card.
- On "swap": the two arrows swap slots along crossing arcs (`onFrame`, 1.0 s): now down on 0, up on 1.
- On "still": the card slides left (x 300 to 940); a ghost copy of the original minus card (up, down) draws
  at the right (x 1000 to 1640). On "turned": a gold half turn arrow joins them, so you see one is the
  other upside down.
- On "times": "= −1 × minus" writes under the two cards (72 px), the "−1" gold.
- Leaves: the ghost and the label blur out at `cue(8, "Now", 0, -0.2)`; the flipped card is removed too.

### Line 8 (39.17 to 43.99) "Now an H gate puts the input in superposition: up arrows on zero and on one."
- The circuit returns to full opacity. A small helper card (up on 0, down on 1, gold down arrow turning ink)
  slides into place below the helper wire (baseline y 760, x 260 to 480).
- On "puts" minus 0.3 s (`cue(8, "puts", 0, -0.3)`, since "H gate" is heard as "Hgate"): an "H" gate box
  draws on the input wire at x 380 to 480 (letter 60 px).
- On "superposition": label "superposition" (44 px) writes above the input wire at x 520.
- Input card above the wire at x 540 to 760: on "zero" the arrow on 0 draws up, and on the second "on"
  (`cue(8, "on", 1, 0.15)`, since "one" is heard in line 9's window) the arrow on 1 draws up. Both gold,
  turning ink at line end. This picture is what "superposition" means here: an arrow on each reading.

### Line 9 (44.29 to 50.07) "Wherever the box answers one, that minus one turns the input's arrow over instead. That's phase kickback."
- On "Wherever": the input card and the helper card slide into the box (input card to x 900, centred over
  the box, helper card to x 900 below the box; move 0.9 s). The box face shows a small tag "example: 0 → 0, 1 → 1" (40 px), so the untouched arrow on 0 makes sense.
- On "minus": a gold "−1" token leaves the helper card and travels up the box to the input card's slot 1
  along a gold curved arrow (`draw` the trace, `move` the token, 0.9 s).
- On "turns": the input's arrow on 1 turns over to point down (`onFrame`, 0.8 s), gold.
- On "instead": the helper card gets a small ink tick and the label "still minus" (40 px).
- On "phase": `b-head` flashes gold for 1.2 s, then back to ink.
- Leaves: cards and tag blur out at `cue(10, "If", 0, -0.2)`; wires and box fade to 25 percent.

### Line 10 (50.38 to 55.12) "If the box is constant, both arrows get the same sign, and the input keeps its shape."
- Two comparison panels side by side. Left panel at x 180 to 900, y 260 to 820. Right panel at x 1020 to
  1740 (drawn in line 11). The faded circuit blurs out on "If".
- On "constant": label "constant" (64 px) at the top of the left panel and a small box sketch with
  "0 → 1, 1 → 1" (44 px). Below it an input card with both arrows up (ink).
- On "both": both arrows turn over together (`onFrame`, 0.8 s), gold.
- On "same": a gold bracket over both arrows, label "same sign" (44 px).
- On "keeps": a dotted ghost of the up, up card overlays it, showing the same shape turned over;
  label "same shape" (44 px). Gold returns to ink at line end.

### Line 11 (55.41 to 59.33) "If it's balanced, only one arrow turns, and the input becomes minus."
- On "balanced": right panel: label "balanced" (64 px), a small box sketch with "0 → 0, 1 → 1", and an
  input card with both arrows up.
- On "one": only the arrow on 1 turns over (`onFrame`, 0.8 s), gold.
- On "minus": "= minus |−⟩" (56 px) writes under the card, gold; a tiny copy of the helper's minus card
  is not needed: the shape speaks (up on 0, down on 1, just like line 6).

### Line 12 (59.64 to 66.19) "A final H makes the arrows interfere, adding or cancelling: zero for constant, one for balanced, every time."
- On `cue(12, "final", 0, 0.2)` (H is glued to "makes"): an "H" gate box draws right of each card.
- On "interfere": in each panel the two arrows slide together (`onFrame`, 1.2 s, through "adding or cancelling"):
  constant: they stack on 0 into one long arrow ("adding") and the 1 slot empties ("cancelling");
  balanced: they cancel on 0 (to nothing) and stack on 1. A small ink note "add / cancel" (44 px) writes
  between the panels on "adding".
  Each long arrow turns into a readout bar: 100 percent on one result, 0 on the other.
- On "Zero": the left readout "0" (80 px) writes, gold. On "one" (`cue(12, "one")`): the right readout "1", gold;
  the left turns ink. On "every" ("time" is heard in line 13's window): "every time" (44 px) under both readouts.
- Leaves: both panels and `b-head` blur out at `cue(13, "Here", 0, -0.2)`.

### Line 13 (66.48 to 70.92) "Here the coin picture breaks. You never see either face, only whether they differ."
- On "coin": the two coins from line 2 return at centre (trick at x 260 to 860, fair at x 1060 to 1660, y 330 to 570).
- On "breaks": a small hand-drawn crack line across the gap between them (ink).
- On "never": hatched ink covers draw over every face (the faces hide), each with a "?" (56 px).
- On "whether": under each coin a gold label writes: "same" under the trick coin, "different" under the
  fair coin (56 px). Only that one fact shows.

### Line 14 (71.22 to 75.57) "It never reads both answers. Interference gives you one fact about the pair."
- On "never": coins blur out. Two answer cards draw at centre, "answer for 0: ?" and "answer for 1: ?"
  (56 px, ink), side by side at y 400; the "?" marks stay unknown (never filled in).
- On "Interference": a gold brace joins the two cards from below, and on "fact" (`cue(14, "fact")`)
  one gold card writes under it: "same or different" (64 px).
- Leaves: all of it blurs out at `cue(15, "Deutsch's", 0, -0.2)`.

### Line 15 (75.87 to 81.40) "That's Deutsch's algorithm. The box multiplies the input by minus one to the power of its answer."
- On "Deutsch's": "Deutsch's algorithm" writes at top centre (x 960, y 150, 72 px), and a compact circuit
  draws at y 300 to 520 (x 400 to 1520): input wire with H, the box, H, a meter; helper wire starting at
  "|−⟩". Ink, 1.6 s.
- On "multiplies": the formula writes centred at y 680, 96 px:
  "U_f |x⟩|−⟩ = (−1)^f(x) |x⟩|−⟩" (U_f with subscript f, f(x) as superscript via `<sup>`).
- On "minus" (`cue(15, "minus")`): "(−1)" turns gold; on "power": the superscript "f(x)" turns gold.
  Small ink notes under it (40 px): "U_f: the box", "x: input", "f(x): its answer", "|−⟩: helper".

### Line 16 (81.70 to 87.54, then 2.6 s hold) "Phase kickback writes the box's answer into the input's phase, and interference reads it in one question."
- On "Phase": the circuit and notes blur out; the formula moves up to y 300 (scale 1.0, stays 96 px).
- On "writes": takeaway text writes under it at y 520 (56 px): "kickback writes the answer into the phase".
- On "interference": second row at y 620: "interference reads it", and on "one" (`cue(16, "one")`)
  "in 1 question" writes after it, gold, with a gold underline. Card and formula stay to the end.

## Caption phrase pairs (spoken -> shown) for scene.mjs
```js
export const phrases = [
  ["times minus one", "× (−1)"],
  ["that minus one", "that −1"],
  ["becomes minus", "becomes |−⟩"],
  ["minus one to the power of its answer", "(−1)^f(x)"],
];
```
Do not pair the bare word "minus": it also appears inside "minus one". "H gate" and "H" stay as words.

## Respellings for the voice
None needed: "Deutsch's", "qubit", "superposition" and "kickback" were all heard cleanly on the first run.
