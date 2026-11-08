# 10 Registers: "Many qubits and bit order" beat plan

Voiced with bf_emma: 17 lines, 258 words, narration ends at 82.49 s, film about 85.1 s with the 2.6 s hold.
Line starts (s): 0 0.40, 1 4.99, 2 9.85, 3 14.08, 4 17.30, 5 21.18, 6 25.90, 7 31.30, 8 36.87,
9 43.06, 10 47.65, 11 52.30, 12 57.42, 13 63.03, 14 68.53, 15 71.82, 16 77.35.

Timing note: whisper's word times run late here, so the last word of many lines lands in the next
line's window (line 0 "see", line 4 "again", line 7 "amplitude", line 11 "one", line 12 "ones").
`cue()` falls back to a text estimate for those, which is fine, but never cue a drawing to a
line's final word; cue to the word before it, or to the next line's start.
Numbers are heard as digits ("10", "1024", "0 1"); `cue(5, "ten")` still matches through `norm`, but
"one thousand and twenty four" is heard as "1024", so cue `cue(5, "which")` or use the estimate.

Layout: safe area x 140 to 1780, y 60 to 860. The title block holds y 118 to 260 until it blurs.
One main object at a time, centred. Gold only for the thing that matters now.

## Drawings (built once, reused)
- **Padlock** (`b-lock`): shackle as a thick ink arc (r.arc) over a wide rounded body, about 560 x 340,
  with a long window cut into the front. Inside the window up to three **wheel drums** (`b-wheel1..3`),
  each a tall rounded rect with ribbing lines, showing one digit big (72 px Caveat) and the next
  digit faintly above and below, like a real lock wheel. Wheels are spaced 150 px apart.
- **Counter column** (`b-count`): to the right of the lock, a stack of handwritten rows
  "1 wheel: 2", "2 wheels: 4", "3 wheels: 8", with small hand-drawn "×2" arrows curling between rows.
- **Ten-wheel strip** (`b-strip`): ten small drums in one row, x 220 to 1700, y 380 to 540, each with a
  digit that can roll (onFrame swaps digit opacity).
- **Qubit row** (`b-qrow`): ten hand-drawn circles (r = 48) on the same centres as the strip drums,
  each with a small "0/1" dial needle inside (a tiny arrow), so they read as qubits, not wheels.
- **Amplitude ledger** (`b-ledger`): a hand-drawn card, x 520 to 1400, y 300 to 820, ruled into rows.
  Each row: a ten-digit string in Caveat 48 px on the left, a hachured bar on the right. Six visible
  rows plus a "⋮" row, with a row counter "row 1 of 1,024" under the card.
- **Doubling blocks** (`b-blocks`): small hand-drawn squares that double in a staircase:
  2, 4, 8, 16, 32 blocks, packed into a growing rectangle.
- **Number place card** (`b-places`): "4 2" in big Caveat with "tens" and "ones" written under it.

## Line by line

**0** "Here's a question. When you measure ten qubits, how many different results could you see?" (0.40 to 4.69)
- On screen: kit title block (lesson 10, "Many qubits and bit order") until at least 2.9 s.
- On "ten": a row of ten small qubit circles draws on at y 560 to 660, left to right over 1 s.
- On "different": a big gold "?" writes at the centre right of the row (x 1640, y 470), 100 px.
- blurOut("#b-title", cue(0, "how")) about 3.0 s, so the title area is free for line 1.
- Leaves at the start of line 1: the ten circles and "?" blur out.

**1** "Picture a combination lock where every wheel has just two positions, zero and one." (4.99 to 9.56)
- On "combination": the **padlock** draws large at left centre (x 260 to 820, y 240 to 760), 2 s, ink.
- On "wheel": wheel drum 1 draws inside the window, 0.6 s.
- On "positions": the drum shows "0" big and "1" faint below; on "zero" the 0 glows gold, on "one"
  (heard in line 1 window, use the estimate) the drum rolls up so "1" sits in front and glows gold,
  then rolls back to 0. This roll is the first motion of the analogy.
- Gold: the digit the wheel is showing.

**2** "One wheel gives two settings. Add a second wheel, and now there are four." (9.85 to 13.77)
- On "two": counter row "1 wheel: 2" writes at x 1000, y 300 (56 px), the "2" in gold.
- On "second": wheel drum 2 draws beside drum 1 (0.6 s).
- On "four": row "2 wheels: 4" writes below with a hand-drawn "×2" arrow curling from the 2 to the 4;
  the 4 turns gold and the 2 drops to ink.

**3** "Zero zero, zero one, one zero, and one one." (14.08 to 17.00)
- The two drums roll through the four settings in sync with the words (onFrame + sched on each
  word cue): 00, 01, 10, 11. Each setting is also written as a small chip in a 2 x 2 grid under the
  counter (x 1000 to 1500, y 470 to 640, 48 px), the current chip gold, the earlier ones ink.
- The drums end on 11.

**4** "A third wheel makes eight, and every new wheel doubles the count again." (17.30 to 20.88)
- On "third": wheel drum 3 draws. The four chips blur out.
- On "eight": row "3 wheels: 8" writes with a second "×2" arrow; 8 gold.
- On "doubles": both "×2" arrows pulse gold together (fade to gold and back), then ink.
- Leaves at line 5 start: lock, drums and counter blur out.

**5** "So ten wheels give two to the power of ten, which is one thousand and twenty four." (21.18 to 25.60)
- On "ten": the **ten-wheel strip** draws across the board, left to right, 1.2 s.
- On "power": under the strip writes "2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2" (56 px), each "2"
  appearing under its own wheel so the doubling is visibly one per wheel.
- A live counter (onFrame + sched) at centre, y 700, ticks 2, 4, 8, 16 ... 1,024 as a gold sweep runs
  across the wheels, landing on "1,024" (90 px, gold) on "which" + 0.4 s.
- Meanwhile the wheel digits roll continuously so the strip never sits still.

**6** "Qubits count the same way. Ten qubits have one thousand and twenty four possible results." (25.90 to 31.00)
- On "Qubits": each wheel cross-fades into a **qubit circle** on the same centre (drums blur, circles
  draw, 0.8 s). The "2 × 2 ..." row fades out.
- On "possible": "possible results" writes beside the gold "1,024", which stays.
- Leaves at line 7 start: qubit row shrinks and moves up to y 150 to 220 (move, 0.8 s) as a reminder
  strip above the ledger; the counter blurs out.

**7** "Here's the quantum part. Qubits keep a number for every one of those results, called an amplitude." (31.30 to 36.57)
- On "quantum": the **ledger card** draws (1.5 s) under the reminder strip.
- On "results": the six rows write their ten-digit strings (0000000000, 0000000001, 0000000010,
  0000000011, 0000000100, ⋮, 1111111111), 0.15 s apart.
- On "number": the bars draw on, one per row, each a different length.
- On "called" (not the last word): label "amplitude" writes at the right of the card (64 px, gold)
  with a gold arrow to the top bar.

**8** "Each amplitude sets how likely its result is, so ten qubits carry one thousand and twenty four of them." (36.87 to 42.76)
- On "likely": the bars ease to new lengths (onFrame), and one bar grows long and gold while
  "more likely" writes beside it; a short bar gets "less likely" in ink.
- On "carry": the ledger rows scroll upward continuously (onFrame translate, seek-safe from t), and
  the row counter under the card runs "row 1 of 1,024" up to "row 1,024 of 1,024", ending gold.
- Leaves at line 9 start: ledger blurs out; the reminder strip of ten qubits blurs out.

**9** "That doubling with every qubit is where a quantum computer gets its room to work." (43.06 to 47.35)
- On "doubling": the **doubling blocks** build at centre: 2 blocks, then 4, 8, 16, 32 (one step every
  0.6 s), each new half drawn in gold and the old half dropping to ink. A small label beside each
  step "1 qubit", "2 qubits" ... "5 qubits" writes as it lands.
- On "room": a dashed arrow curves up from the stack with "and on to 1,024 at ten" (48 px).
- Leaves at line 10 start: blocks blur out.

**10** "But here the lock picture breaks. A lock is only ever set to one combination." (47.65 to 52.00)
- On "lock" (first): the padlock redraws at left centre (x 200 to 700), now with ten slim drums
  in its window.
- On "set": the drums roll and stop on one combination "0110100101", which turns gold.
- On "combination": label "one setting at a time" writes under it (48 px, ink).

**11** "Qubits carry an amplitude for every combination, yet measuring them shows you just one." (52.30 to 57.12)
- On "Qubits": at right (x 900 to 1700) a small ledger of the same kind draws, every row with a bar,
  so "an amplitude for every combination" is literal. Bars in ink.
- On "measuring": a hand-drawn arrow from the ledger down to a result box, and every bar but one
  fades to dim; the remaining row's string "0110100101" lifts into the box in gold (move 0.8 s).
- Gold: only the one string that showed up.

**12** "So all those amplitudes don't mean all those answers. You get one string of ten zeros and ones." (57.42 to 62.73)
- On "answers": "1,024 answers" writes above the box in ink, and a hand-drawn strike line draws
  through it (0.4 s).
- On "string": the result box grows to centre (move, 1 s), the gold string at 90 px with ten small
  tick marks under its digits counting "ten zeros and ones".
- Leaves at line 13 start: everything blurs out.

**13** "One last habit to lock in. When Kiss kit writes a string, qubit zero goes on the right." (63.03 to 68.24)
- On "habit": two empty digit slots draw at centre (two boxes, 180 px each, gap 60).
- On "string": labels "q1" and "q0" write under the slots, 64 px; "q0" in gold.
- On "right": a gold arrow curls from the "q0" label to the right-hand slot, and a small "right"
  writes beside it (avoid cueing the last word: use cue(13, "goes") + 0.2).

**14** "Take two qubits, and flip only qubit zero to one." (68.53 to 71.52)
- On "two": two qubit circles draw above the slots, labelled q1 (left) and q0 (right), each with a
  needle pointing to 0; the slots fill with "0" "0" in ink.
- On "flip": a small hand-drawn X gate box draws on the q0 circle; its needle swings from 0 to 1
  (onFrame, 0.6 s), q0 turns gold, and its slot digit rewrites as a gold "1".

**15** "Kiss kit shows zero one, not one zero, like a number whose smallest place sits on the right." (71.82 to 77.05)
- On "shows": the slots read "0 1" (q1 = 0 left, q0 = 1 right, gold).
- On "not": "10" writes small at the right of the board, and an ink cross strikes it.
- On "number": the **place card** writes below: "4 2" with "tens" and "ones" under the digits;
  on "smallest" a gold underline draws under "ones", lined up beneath the q0 slot, so the matching
  is visible: the right-hand place is the smallest place.
- Leaves at line 16 start: the place card, crossed "10" and qubit circles blur out; the "0 1" slots
  with q1 / q0 stay and slide to the left half (move 0.8 s).

**16** "So every qubit you add doubles the amplitudes, but a measurement still shows you just one string." (77.35 to 82.49, then 2.6 s hold)
- Closing card on the right half (x 900 to 1740):
  - On "add": "+1 qubit → ×2 amplitudes" writes, 72 px, ink, with a tiny doubling block pair beside it.
  - On "measurement": "measure → one string" writes below, 72 px, gold, with a gold underline.
- Left half keeps the "0 1" slots with "q1 q0" under them as the bit-order reminder.
- Everything stays through the end hold; a slow gold shimmer along the underline keeps it alive.

## Caption phrase pairs (spoken -> shown)
```js
export const phrases = [
  ["Kiss kit", "Qiskit"],
  ["one thousand and twenty four", "1,024"],
  ["two to the power of ten", "2 to the power of 10"],
  ["Zero zero", "00"], ["zero one", "01"], ["one zero", "10"], ["one one", "11"],
  ["qubit zero", "qubit 0"],
  ["ten qubits", "10 qubits"], ["ten wheels", "10 wheels"], ["ten zeros", "10 zeros"],
];
```
Checked against the script: "zero one", "one zero" and "one one" occur only in lines 3 and 15, and
"qubit zero" (longer, so matched first) protects lines 13 and 14. Caption font (TASA Orbiter) has
no ⁰, ⁿ, subscripts or ⟩, so captions use plain digits; labels may use `<sub>` for q₀ if wanted.

## Respellings for the voice
- "Qiskit" is written "Kiss kit" (lines 13, 15); the transcriber heard "Kiskit", so it is spoken right.
  The caption shows "Qiskit" through the pair above.

## Physics checks
- n qubits have 2ⁿ possible results and one amplitude per result: ten qubits, 1,024.
- An amplitude "sets how likely" its result is (the chance is its size squared); the script never
  says the qubits "are in every state" or "try every answer".
- Measurement returns one n-bit string; 1,024 amplitudes are not 1,024 readable answers.
- Qiskit order: qubit 0 is the rightmost, least significant bit. Flipping only q0 on two qubits
  reads "01". The place-value picture (ones on the right) matches that exactly.
