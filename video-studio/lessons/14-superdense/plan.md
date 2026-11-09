# Lesson 14, Superdense coding: beat plan

Voice: bf_emma. 19 lines, 260 words, narration ends at 82.00 s, film about 84.6 s with the 2.6 s hold.
Board 1920x1080, safe area x 140 to 1780, y 60 to 860. The kit's title block sits at x 192 to 1500,
y 118 to 260; it stays until `blurOut("#b-title", cue(0, "qubit") - 0.2)` (about 3.0 s, so over 2.5 s).
Until then everything for line 0 is drawn below y 300.

## Cast (reused across beats)

- **Alice / Bob**: name labels (56 px, ink) at about (360, 330) and (1560, 330). No figures needed.
- **Qubit**: a hand-drawn circle, r 80 (r 60 when small), no letters inside: it is just a ball.
  Alice's qubit is the one that travels; Bob's stays put.
- **Bell link**: a gold wavy squiggle between two qubit circles. When the halves are far apart it is a
  long thin dashed gold curve, redrawn in `onFrame` from the two circle centres so it stretches as they move.
- **Envelope**: a small hand-drawn envelope (160 x 100) used for "post". It slides along a dashed ink
  path at y 560 from Alice to Bob (`move`, 1.0 s, power2.inOut).
- **The message**: the example message is **11** (twist "both", as in course.json's try_this). Gold
  always marks the message: the chosen key position, then the "both" twist, its Bell pattern, and the
  read bits. Everything else is ink.
- **Bit order**: twists map nothing to 00, Z to 01, X to 10, both to 11 (Qiskit order q1 q0, Alice applies
  X^b1 then Z^b0). Never show any other pairing.

## Beats

### Line 0 (0.40 to 3.73) "Can Alice send Bob two bits by posting him just one qubit?"
- Note: the sequence transcript dropped "Can" (it is spoken; checked by transcribing line 01.wav on its own). Do not cue it.
- On "Alice" (about 0.5 s): "Alice" writes at left; on "Bob": "Bob" writes at right (both at y 420, below the title).
- On "two bits": two gold bit cards (110 x 140, "1" and "1", 80 px) draw above Alice's side at (300 to 540, 480 to 620).
- On "posting": the dashed post path draws from Alice to Bob (x 520 to 1400, y 720) and the envelope draws at its left end.
- On "one qubit": a single ink qubit circle (r 50) drops into the envelope; a gold "?" (80 px) writes above the path centre.
- Title blurs out at about 3.0 s.
- Gold: the two bit cards, the "?". Leaves: nothing yet.

### Line 1 (4.03 to 7.95) "A bit is a zero or a one, and a lone qubit can only carry one bit."
- On "bit": one bit card moves to centre-left (700, 520); on "zero" it shows "0", on "one" it flips to "1"
  (onFrame scaleX flip, then keeps toggling slowly 0, 1, 0 so it never sits still). Label "bit = 0 or 1" (48 px).
- On "lone qubit": a qubit circle (r 80) draws at (1100, 520); on "carry" an ink arrow draws from it to ONE
  card; a second dashed ghost card beside it gets a quick cross (0.3 s). Label "1 qubit alone → 1 bit" (48 px).
- Gold: the card that is carried. Leaves at end: the envelope, path and "?" from line 0 fade; everything
  blurs out (0.25 s) just before line 2, except the "Alice" and "Bob" labels, which fade to 0.

### Line 2 (8.25 to 11.07) "Their trick? Picture a safe that opens with two keys."
- Central analogy sketch. On "safe": a big safe draws centre (box x 760 to 1160, y 330 to 730, 1.6 s):
  thick door outline, hinge bolts on the left, a handle wheel in the middle, and **two keyholes**
  (left one at (870, 620), right one at (1050, 620)).
- On "two keys": the two keyholes get a gold ring each (0.3 s) and the label "opens with 2 keys" (48 px) writes under the safe (y 780).
- Gold: the keyholes. Leaves: nothing (the safe stays for lines 3 and 4).

### Line 3 (11.37 to 15.64) "Bob holds one key. Alice sets hers to one of four positions and posts it."
- On "Bob": "Bob" rewrites at (1560, 330); Bob's key draws beneath it at (1480 to 1700, 450): a plain ink key.
- On "Alice": "Alice" rewrites at (360, 330); Alice's key draws at (220 to 500, 450). Her key's round head is
  a little **dial** (r 50) with four tick marks (up, right, down, left).
- On "four positions": a gold pointer in the head sweeps through all four ticks (onFrame + sched, 1.2 s)
  and stops on the right-hand tick (our example). A tiny label "4 positions" (40 px) under the key.
- On "posts": Alice's key slips into an envelope that slides along a dashed path to beside Bob (move, 1.0 s).
- Gold: the pointer on Alice's key. Leaves: the "4 positions" label fades on arrival.

### Line 4 (15.94 to 18.90) "With both keys, Bob can tell which position she chose."
- On "both keys": both keys slide into the two keyholes (move, 0.8 s; Bob's left keyhole, Alice's right).
- On "tell": the safe door gets a small window (x 860 to 1060, y 380 to 470) showing four position icons
  (tiny dials). On "position" the right-hand one turns gold, and on "chose" it gets a tick mark.
- Gold: the chosen icon. Leaves at end: the whole safe scene blurs out (0.25 s) just before line 5. Names stay.

### Line 5 (19.20 to 24.62) "The quantum keys are a Bell pair: two entangled qubits whose readings are random but always match."
- On "quantum keys": two small ink key outlines appear at centre (860, 500) and (1060, 500) and morph out: they fade
  as two qubit circles (r 80) draw in the same spots, so the keys visibly become qubits.
- On "Bell pair": the gold squiggle link draws between the circles (0.6 s); label "Bell pair" (64 px) above (y 360).
- On "entangled": the link pulses (onFrame stroke width).
- On "random": under each circle a reading ticks 0 / 0, 1 / 1, 1 / 1, 0 / 0 in sync (onFrame, every
  0.5 s), so each side looks random; label "random" (40 px) at y 760.
- On "always match": a gold "=" draws between the two readings and the label becomes "random, but always match"
  (40 px). This sets up line 15, where Alice's qubit alone looks random.
- Gold: the link and "=". Leaves at end: the readings ticker fades.

### Line 6 (24.92 to 28.40) "They share it in advance: Alice keeps one half, Bob the other."
- On "in advance": a small hand-drawn clock (r 40) at (960, 300) with label "before any message" (40 px).
- On "Alice": the left circle slides to (420, 560) under "Alice"; on "Bob" the right one slides to (1500, 560)
  under "Bob". The link stretches into a long dashed gold curve between them (onFrame from the centres).
- Leaves at end: the clock and its label fade; "Bell pair" label fades.

### Line 7 (28.70 to 33.33) "To set her key, Alice gives her half one of four twists: nothing, Z, X, or both."
- Alice's circle grows to r 100 and moves to (420, 520). Bob's circle stays at (1500, 560), smaller (r 60).
- Four twist cards (each 190 x 110, ink, 56 px text) write in a row under the centre (x 560 to 1460, y 640 to 750),
  one per spoken word: "nothing" on "nothing", "Z" on "Z", "X" on "X", "Z + X" on "both".
- On "twists": a curved gold arrow circles Alice's qubit once (onFrame, 0.8 s).
- Gold: the twist arrow. Cards are ink.

### Line 8 (33.63 to 38.87) "Z and X are half turns, and the twists mean zero zero, zero one, one zero, one one."
- On "half turns": above the "Z" card a tiny circle with a curved arrow going round its vertical axis; above
  the "X" card a tiny circle with an arrow flipping it top to bottom (each 0.6 s, small, at y about 560). Label
  "half turns" (40 px) between them.
- Under the cards, the messages write in on their words (64 px): "00" under nothing (on "zero zero"), "01" under
  Z, "10" under X, "11" under Z + X (on "one one"). Cue the first digit of each pair; use `nth` for the repeats.
- On the last "one one": the "Z + X" card and its "11" turn gold (our example).
- Gold: the "Z + X / 11" card. Leaves at end: the half-turn sketches fade.

### Line 9 (39.17 to 43.31) "Each twist leaves the pair in a different one of four patterns, called Bell states."
- Above each card a mini pair icon draws (two small circles r 26 with a link), each with a clearly different
  link style: smooth wave, zigzag, loops, and double wave (the four patterns), drawn on "different".
- The pattern above "Z + X" is gold; the other three ink.
- On "Bell states": label "4 Bell states" (64 px) writes above the row (y about 470, clear of Alice's circle).
- Leaves: nothing yet.

### Line 10 (43.61 to 48.22) "The four can be told apart perfectly, but only by reading both qubits together."
- On "told apart": short ink divider strokes draw between the four columns, and a tick writes under each
  (0.3 s each, staggered). No extra label; the ticks say it.
- On "both qubits": a magnifying glass draws over Alice's lone circle with a "?" inside and a quick cross; then a
  wide gold oval outline draws around a mini pair icon (the gold one) with a gold tick, label "both together" (48 px).
- Leaves at end: the cards, patterns, dividers, glass and labels all blur out (0.25 s) before line 11.
  Alice's circle keeps a small gold "Z + X" tag beside it.

### Line 11 (48.52 to 51.66) "So Alice posts her qubit, and Bob holds both halves."
- On "posts": the envelope draws round Alice's circle (circle shrinks to r 60 inside it), and the envelope slides
  along the dashed path to Bob (move, 1.0 s). The long dashed gold link shrinks with it (onFrame).
- On "both halves": at Bob's side two circles sit together at (1360, 560) and (1560, 560); the envelope fades,
  the gold squiggle is short again; label "both halves" (48 px). "Alice" label fades.
- Gold: the link and the tag. Leaves: nothing.

### Line 12 (51.96 to 55.95) "He undoes the link, running the pair's recipe backwards: C NOT, then H."
- The pair slides to the left end of two horizontal wires that draw across the centre (x 360 to 1500, y 460 and 660).
- On "recipe": a faint ink note above the wires writes "made with: H, then CNOT" (40 px, 60% opacity), at y 330.
- On "backwards": a gold curved arrow draws under the note, pointing right to left.
- On "C NOT" (heard as "Cnot"; the cue estimates it): the CNOT draws on the wires at x 800: dot on the top
  wire, vertical line, ⊕ on the bottom wire (0.5 s).
- On "H": the "H" box draws on the top wire at x 1050. Note: the transcriber placed "H" at the start of line 13,
  so cue it as `cue(13)` minus 0.15 s, or the end of line 12.
- As each gate draws, the two circles slide through it along the wires (onFrame); the gold squiggle between them
  fades to nothing as they pass the H (the link is undone).
- Gold: the backwards arrow. Leaves at end: the "made with" note and arrow fade.

### Line 13 (56.25 to 59.15) "Then he measures both, and reads her two bits for certain."
- On "measures": two meter icons (arc plus needle, 120 x 90) draw at the wire ends (x 1300).
- On "two bits": a gold "1" (80 px) writes out of each meter at x 1460; a gold bracket joins them into "11"
  (80 px), the same message as Alice's gold card. No qubit labels.
- On "certain": label "every time" (48 px) under the digits; the needles stay steady (no flicker).
- Gold: the read bits. Leaves at end: the whole circuit scene blurs out (0.25 s).

### Line 14 (59.45 to 63.71) "Here the safe picture breaks: peek at a posted key and you'd see its position."
- On "safe picture": a small safe icon (220 x 220) at left (360, 520) with a hand-drawn crack line drawing across it
  (0.4 s); label "where the picture breaks" (48 px). It is the analogy that breaks, not a safe.
- On "posted key": Alice's key from line 3 (the dial head) draws large at centre-left (700, 520), inside an envelope outline.
- On "see": a magnifying glass slides over the key's head; on "position" the gold pointer inside the glass
  is plainly visible; label "you can see it" (48 px).
- Gold: the pointer. Leaves: the safe icon fades at the end of the line.

### Line 15 (64.01 to 68.67) "Alone, her qubit looks completely random, so a spy who grabs it learns nothing."
- On "Alone": at right (1350, 520) Alice's qubit (r 80) in its envelope draws, with no link.
- On "random": under it a reading ticker shows a random-looking 0 / 1 flicker (fixed pseudo-random sequence via
  onFrame, seek safe), label "random" (48 px).
- On "spy": a small hand-drawn magnifying glass with a peeking eye moves over the qubit; on "nothing" a big
  ink "?" writes in the glass and a cross strikes it. Label "learns nothing" (48 px).
- Gold: nothing new (the pointer on the left key stays gold for contrast). Leaves at end: both halves of the
  comparison blur out.

### Line 16 (68.97 to 71.03) "The message lives only in the pair."
- On "message": two circles draw centre (860, 520) and (1060, 520) with the gold squiggle link; a gold "11"
  (80 px) writes between and above them (y 400).
- On "pair": a gold dashed oval outline draws round both circles (0.8 s). Label "only in the pair" (56 px) at y 720.
- Leaves at end: the label fades; the pair stays and shrinks up for line 17.

### Line 17 (71.33 to 76.58) "It's not magic: the pair was shared beforehand, and her qubit still travels no faster than light."
- A left to right time arrow draws across the board (x 220 to 1700, y 520), with two marks.
- On "beforehand": at the first mark (x 520) the pair icon sits with label "earlier: share the pair" (40 px).
- On "travels": at the second mark (x 1100) the envelope with one qubit slides along a dashed path (move, 1.0 s);
  label "then: post 1 qubit" (40 px).
- On "no faster": a thin ink light ray (straight arrow with a little sun icon at its tail) shoots past the envelope
  along the top (y 640) and reaches the end first; on "light" the label "no faster than light" (48 px) writes.
- Gold: none new; the pair link stays gold. Leaves at end: the whole timeline scene blurs out (0.25 s).

### Line 18 (76.88 to 82.00) "With a shared Bell pair, one qubit delivers two bits. The second rides on the entanglement."
- Closing picture, stays through the 2.6 s hold. The full circuit on two wires (x 260 to 1660, y 360 and 540),
  drawn left to right in 2.0 s from "shared":
  - left section, ink: H on the top wire, CNOT; a bracket under it labelled "shared Bell pair" (40 px);
  - middle, gold: Alice's twist boxes "X" and "Z" on the top wire (dashed outlines, meaning "if needed");
  - a dashed vertical "post" line with a tiny envelope icon;
  - right section, ink: CNOT, H, two meters, and out of them a gold "2 bits" (56 px).
- On "two bits": the takeaway writes under the circuit at y 700: "1 qubit + shared pair → 2 bits" (96 px), with
  "2 bits" in gold.
- On "entanglement": a gold underline draws under the takeaway, and the gold squiggle at the left of the circuit
  pulses once. Nothing leaves.

## Caption phrase pairs (spoken -> notation)

Built in already: `C NOT -> CNOT`.
Add in scene.mjs:
```js
export const phrases = [
  ["zero zero", "00"], ["zero one", "01"], ["one zero", "10"], ["one one", "11"],
];
```
Checked: none of these four sequences appears anywhere else in the script, so only line 8 changes.
Leave "Z", "X", "H", "Bell pair", "two bits" as words.

## Respellings for the voice

None needed. narrate.mjs reported only boundary shifts (a word counted in the next line's window: "keys",
"it", "states", "pair", "light", "H"), digits/joins it wrote differently ("Xor", "Zand", "Cnot"), and "Can",
which is spoken (verified by transcribing line 01.wav alone). For cues: `cue(12, "H")` falls back to an
estimate; prefer `cue(13) - 0.15` for the H box. `cue(7, "X")`, `cue(8, "Z")` and `cue(12, "C")` also estimate
from letters, which is close enough.
`cue(17, "light")` also falls into line 18's window (heard as "light." at its start); use `cue(18) - 0.3` for the
"no faster than light" label. "pair's" in line 12 is heard as "pairs", which is fine.
