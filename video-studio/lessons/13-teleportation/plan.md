# Lesson 13, Teleportation: beat plan

Voice: bf_emma. 17 lines, 257 words, narration ends at 80.70 s, film about 83.3 s with the 2.6 s hold.
Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Title block (kit) sits at x 192 to 1500,
y 118 to 260 until it blurs out at cue(0, "Alice") + 0.6 (about 3.1 s, so it shows for over 2.5 s).
Until then everything of line 0 is drawn below y 300.

## Cast of drawings (reused across beats)

- **Alice's station**, left: name label "Alice" (56 px, ink) at about (330, 300). Her qubit is a
  hand-drawn circle (r 120) centred near (400, 520) with a faint dashed vertical axis and small
  "0" at the top, "1" at the bottom (40 px). The **state arrow** is gold, from the centre, tilted
  about 35 degrees right of up (so it is clearly "some way"), with a gold "?" (64 px) beside its tip.
- **Bob's station**, right: "Bob" (56 px, ink) at about (1450, 300); the same circle near
  (1500, 520) but empty at first.
- **Distance**: a long dashed ink line between them at y 520 with "far away" (40 px) above it.
- **The arrow is the state.** Gold always marks wherever the real state lives right now: Alice's
  arrow at first, Bob's arrow at the end. Never two gold arrows at once (that would look like a copy).

Arrow geometry is one SVG group per arrow, rotated with `transform` in `onFrame` + `sched()` so
swings are continuous and seek safe. Bob's mirrored arrow is the same arrow with `scaleX(-1)`.

## Beats

### Line 0 (0.40 to 5.67) "Here's a puzzle. Alice has a qubit whose state, drawn as an arrow, points some way nobody knows."
- Title block is up; nothing else for the first beat.
- On "Alice" (about 2.5 s): "Alice" label writes in; her qubit circle draws (1.2 s) below y 300.
  Blur out the title block at about 3.1 s.
- On "arrow": the gold state arrow draws from the centre (0.6 s).
- On "some way": the arrow wobbles a little left and right (onFrame, plus or minus 8 degrees) to
  say "some direction"; on "nobody knows" the gold "?" writes in by its tip.
- Gold: the arrow and the "?". Leaves: nothing yet.

### Line 1 (5.97 to 11.56) "She wants Bob, far away, to get that exact state, but she can't copy it, and measuring destroys it."
- On "Bob": "Bob" label and his empty circle draw on the right.
- On "far away": the dashed distance line draws left to right (1 s) with "far away" written above.
- On "exact state": a faint dotted ghost of the gold arrow appears inside Bob's circle (ink, 30%
  opacity) with a small "goal" label: this is what we want.
- On "copy": a small hand-drawn photocopier icon pops near Alice, then a big ink cross strikes it
  (0.3 s); label "no copying" (40 px, ink).
- On "measuring destroys": a small meter icon (arc plus needle) by Alice; her arrow flickers and the
  "?" shakes; a second cross strikes the meter.
- Leaves at end of line: crosses, copier, meter, ghost arrow all blur out (0.25 s). Alice, Bob and
  the circles fade to 0 as the fax arrives (they come back on line 4).

### Line 2 (11.86 to 15.08) "Picture a fax machine that shreds the original as it sends."
- Central analogy sketch. On "fax": a big hand-drawn fax machine draws at left centre (box about
  420 x 260 at x 260 to 680, y 360 to 620, paper slot on top, keypad dots, a handset on a curly
  cord). A second identical fax machine draws on the right (x 1240 to 1660).
- On "original": a sheet of paper (gold outline, with a little gold drawn star on it, the "page")
  sits above Alice's machine's slot.
- On "shreds": the page slides down into the slot (move, 0.9 s) and ink strips fall out of the
  bottom of the left machine (5 to 6 short wavy strips dropping with onFrame, then resting in a
  small bin).
- Gold: the page.

### Line 3 (15.38 to 20.65) "The page appears at Bob's end, the original is destroyed at Alice's, and it needs the phone line."
- On "appears": the same gold page with the star slides up out of the right machine (0.9 s).
- On "destroyed": the shred strips at the left flash briefly, label "shredded" (40 px) writes under them.
- On "phone line": a wavy cable (curve from one handset to the other, about y 300 to 320) draws
  left to right (1.2 s) and a small ink pulse runs along it (onFrame dot). Label "phone line".
- Labels under machines: "Alice" and "Bob" (48 px).
- Leaves at end: the whole fax scene blurs out (0.25 s) just before line 4.

### Line 4 (20.95 to 26.18) "The quantum version starts with a Bell pair, two entangled qubits whose readings always match."
- Centre stage. On "Bell pair": two small qubit circles (r 70) draw side by side at the centre
  (x 860 and 1060, y 480), joined by a gold wavy "link" squiggle between them. Label "Bell pair" (64 px).
- On "entangled": the link squiggle pulses (stroke width up and down, onFrame).
- On "always match": under each circle a pair of readings ticks through 0 0, 1 1, 0 0, 1 1 in sync
  (onFrame switching every 0.5 s), with a gold "=" between them. Label "always match" (40 px).

### Line 5 (26.48 to 28.63) "Alice keeps one, and Bob takes the other."
- On "Alice": the left circle slides left to (520, 560) and "Alice" writes above it; on "Bob": the
  right circle slides right to (1500, 560) and "Bob" writes above. The gold squiggle stretches
  between them (drawn as a long thin dashed gold curve, redrawn by onFrame as the ends move).
- The readings tickers fade out.

### Line 6 (28.93 to 33.75) "She links her mystery qubit to her half with a C NOT and an H gate, then measures both."
- On "mystery": Alice's mystery qubit (circle with the gold arrow and "?") fades in above her half,
  at (300, 420) with her half at (300, 640) (shift her half left to make room).
- To the right of her two qubits, a small hand-drawn circuit draws on two wires (x 420 to 820,
  y 420 and y 640): on "C NOT" a dot on the top wire, a vertical line, and ⊕ on the bottom wire;
  on "H" a box with "H" on the top wire; on "measures" two meter icons at the ends of the wires.
- The circuit is ink; the moving gold is the mystery arrow, which slides along the top wire into
  the gates on "links" (0.9 s) and fades at the meters on "both".
- Bob's half and the long gold dashed link stay on the right.

### Line 7 (34.05 to 38.08) "She gets two bits, and each of the four outcomes comes up one time in four."
- On "two bits": out of the meters come two digits (72 px), which flicker through 00, 01, 10, 11
  (onFrame) like a slot machine.
- On "four outcomes": the circuit fades; four cards draw in a row in the centre (x 560 to 1360,
  y 400 to 640): "00", "01", "10", "11", each with a gold bar of equal height underneath.
- On "one time in four": label "1 in 4 each" (56 px) writes under the bars; the flicker stops on
  "10", whose card turns gold. Other cards dim to 40%.

### Line 8 (38.38 to 41.48) "She sends them to Bob the ordinary way, like a phone call."
- The cards blur out, leaving the gold "10" near Alice.
- On "phone call": a small handset icon by Alice and one by Bob; a wavy cable draws between them
  across the top (y about 330). On "sends", the "10" rides along the cable (onFrame, 2 s) from left to
  right. Label "ordinary message, ordinary speed" (40 px) under the cable.

### Line 9 (41.78 to 45.92) "They tell him which of four fixes to make: nothing, an X, a Z, or both."
- Bob's circle now shows his qubit: an ink arrow that is the **mirror image** of Alice's original
  (tilted 35 degrees left of up), labelled "scrambled" (40 px).
- A small fix table draws right of centre (x 820 to 1260, y 400 to 720), one row per spoken word:
  "00 → nothing" on "nothing", "01 → X" on "X", "10 → Z" on "Z", "11 → X and Z" on "both" (48 px each).
- The row "10 → Z" turns gold as the travelling "10" arrives at Bob.

### Line 10 (46.22 to 49.39) "Now Bob's qubit points exactly where Alice's started."
- On "Now": the Z fix happens. Bob's arrow swings round the vertical axis (scaleX from -1 to 1 over
  0.9 s, so it narrows to vertical and opens out on the other side: exactly the picture of Z, a half
  turn about the up axis) and turns gold as it lands.
- On "exactly": a dotted gold copy of Alice's starting arrow (from line 0) is drawn faintly over it
  and lines up perfectly; a small gold tick appears. Label "same state" (56 px, gold).
- The fix table fades out.

### Line 11 (49.69 to 54.05) "Her original was wiped out by measuring, so the state moved. It wasn't copied."
- Camera on Alice: her mystery circle reappears with the arrow now ink and snapped straight down to
  "1" (the measured result for the leading bit 1); its "?" is gone. Label "just a plain 1 now" (40 px).
- On "moved": a big gold curved arrow sweeps from Alice's circle to Bob's (draw, 1 s) over the top.
  Label "moved" (64 px, gold) writes on it.
- On "copied": label "not copied" (56 px, ink) under it, with a tiny photocopier icon struck out.
- Only one gold state arrow on screen: Bob's.

### Line 12 (54.35 to 59.00) "Here's where the fax breaks. A fax reads the page, but Alice never learns her state."
- Everything blurs out. Split board: left half a small fax sketch with a magnifying glass over the
  gold page and the label "a fax reads the page" (48 px); right half Alice's circle with a gold arrow
  hidden under a hand-drawn sheet, a "?" and the label "Alice never sees it" (48 px).
- On "breaks": a wobbly ink vertical line divides the halves, with "where the fax breaks" (56 px) on top.
- On "never": a gold underline under "never".

### Line 13 (59.30 to 63.95) "It rides on the shared entanglement and the two bits together, never on the bits alone."
- The split board blurs out. A simple sum draws in the centre (key labels 64 px):
  a gold squiggle (the link) labelled "shared entanglement" + "10" labelled "two bits" → the gold
  arrow labelled "the state".
- On "together": a gold bracket draws under both terms.
- On "alone": below, a second smaller row: "10" alone → "?" (ink), with "says nothing" (40 px).

### Line 14 (64.25 to 70.24) "And it can't beat light. Until the bits arrive, Bob's qubit is a fifty fifty coin flip, whatever Alice sent."
- The sum blurs out. On "light": a small sun or light beam icon at the top with "can't beat light" (56 px).
- On "Until": Bob's circle at right with the arrow shrunk to a dot (the shrinking is animated
  with onFrame, 0.8 s), and a hand-drawn coin beside it flipping (scaleY oscillation, onFrame).
- On "fifty fifty": two bars "0" and "1" under Bob, each held at exactly half height, gold.
- On "whatever Alice sent": on the left, Alice's circle with an arrow that swings through several
  different directions (onFrame) while Bob's two bars do not move at all. That contrast is the point.

### Line 15 (70.54 to 74.60) "So Bob must wait for the call, and no atoms fly across, only the state."
- On "wait": a small hand-drawn clock by Bob whose hand sweeps (onFrame); the phone cable draws
  again across the top with the "10" crawling along it.
- On "atoms": a little ball (atom) drawn by Alice with a dashed path toward Bob and a cross over the
  path; label "no matter moves" (40 px).
- On "only the state": the gold arrow appears in Bob's circle again with a gold glow.

### Line 16 (74.90 to 80.70, then hold to the end) "Shared entanglement plus two ordinary bits move a state. Nothing is copied, and nothing outruns light."
- Everything blurs out. Closing picture, centred, drawn in order of the words:
  - Top (y about 300 to 560): the teleportation circuit by hand on three wires labelled
    "|ψ⟩", "|0⟩", "|0⟩": H and C NOT making the Bell pair on wires 2 and 3 (drawn on "Shared
    entanglement"), C NOT and H on wires 1 and 2 with two meters (on "two ordinary bits"), double
    lines down to "X" and "Z" boxes on wire 3, which ends in a gold "|ψ⟩" (on "move a state").
  - Bottom (y about 640 to 800): the takeaway in 72 px: "entanglement + 2 bits = the state moves",
    then two smaller lines (48 px) "nothing copied" on "copied" and "nothing outruns light" on
    "outruns". Gold: the output |ψ⟩ and a gold underline under the takeaway.
- This picture holds through the 2.6 s hold.

## Safe area check
All objects sit inside x 140 to 1780, y 60 to 860; nothing is drawn into the title area before it
blurs out at about 3.1 s; the bottom of every scene stays above y 860 (captions below 880).

## Caption phrase pairs (spoken -> notation)
- `["one time in four", "1 in 4"]`
- `["two bits", "2 bits"]` (optional; keep words if it reads better)
- `["fifty fifty", "50/50"]` and `["C NOT", "CNOT"]` are already built in.
- No others: "an X", "a Z", "H gate" and "Bell pair" read well as words.

## Respellings for the voice
None needed. The transcriber writes "qubit" as "cubit" and "light" as "Lite", which are the same
sounds, and "C NOT" as "Cknot", which is right. The other "not heard" words are only the last word
of a line landing a few hundredths of a second inside the next line's window (whisper timestamps
run late), so cue those words by estimate or with `cue(next, firstWord)` minus a little.
