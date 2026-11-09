# Lesson 11 Entanglement: beat plan

Voiced with bf_emma: 16 lines, 260 words, narration ends 85.82 s, film about 88.4 s with the 2.6 s hold.

Line windows (s): 0 0.40-6.61 | 1 6.91-12.13 | 2 12.44-17.38 | 3 17.68-22.82 | 4 23.12-28.42 |
5 28.72-36.48 | 6 36.78-41.03 | 7 41.33-45.21 | 8 45.51-50.03 | 9 50.33-55.20 | 10 55.50-59.59 |
11 59.89-65.52 | 12 65.82-71.44 | 13 71.73-74.38 | 14 74.68-80.01 | 15 80.31-85.82

## Cueing notes for the scene
- Whisper heard every real word. The "not heard" items are digit pairs written as "zero-zero",
  "one-one" (fine) and a last word that spilled into the next line's window.
- Spilled last words: line 0 "flip", 1 "up", 3 "target", 9 "pair", 10 "advance" are stored
  under the NEXT line. The other way round, line 6's first word "Measure" is stored under line 5 and
  line 15's first word "So" under line 14. `cue(n, word)` falls back to a letter estimate for them, which is fine, or
  cue them as the next line's start. Same for "zero zero / one one" in lines 5, 6, 7, 14: cue them
  by estimate (`cue(5, "zero", 0)` etc.) or by a neighbouring real word ("stays", "becomes",
  "Never", "half").
- Line 4: Whisper heard "H to" as one token "Hto", so cue the H box with `cue(4, "use")` plus a small
  offset rather than `cue(4, "H")`.
- Digit convention: in every pair the FIRST digit is the control (top qubit), the second the target,
  as in course.json. Put tiny "c t" labels over the first pair drawn so this is never ambiguous.

## Recurring objects
- Two qubits are drawn as two hand-drawn coins, A (left) and B (right), about 150 px across.
- Results are small hand-drawn chips: a rounded rect holding two Caveat digits, 56 px.
- Gold only on the thing being talked about right now.

## Beats

**0. "Here's our goal. We want two qubits whose answers always match, even though each one alone is a fair coin flip."**
- Title block (kit) top left until about 3.0 s, then `blurOut("#b-title")`.
- From 0.4 s, below the title (y 330 to 800): coins A at x 700 and B at x 1220, y 470, draw on 1.2 s.
  Small labels "qubit A", "qubit B" under them (44 px).
- On "match": the coins start flipping (onFrame: ellipse x scale cos wave, face digit swaps at the
  edge-on moment, about 2 flips per second) and land together; a chip row writes in under them
  at y 700: "0 0", "1 1", "1 1", "0 0" one per 0.4 s; on "always" a gold bracket joins each pair
  and gold label "always match" (56 px) writes at y 790.
- On "fair": "50/50" ink labels appear under each coin. (Spoken "flip" lands at the line end.)
- Leaves: everything blurs out at the start of line 1.

**1. "Picture two dancers sharing one routine. Watch either one alone, and the moves look made up."**
- Central analogy sketch: a stage floor line (x 360 to 1560, y 760) and two stick-figure dancers
  (head circle, torso, two arms and two legs as separate rough paths in groups that rotate at the
  shoulder and hip), left at x 720, right at x 1200, about 380 px tall. Draw on "dancers" (1.5 s).
- Above them one sheet of music-like paper (rough rect, wavy lines) labelled "one routine" on "routine".
- On "either": a spotlight cone (dashed rough polygon, light hachure) drops onto the LEFT dancer;
  the right dancer fades to 0.2. The left dancer's limbs swing through jerky, uneven poses
  (onFrame with sched on a pseudo-random angle table). Label "looks made up" (48 px) beside it
  on "made".
- Leaves: the "looks made up" label fades at line 2 start.

**2. "Watch both, and every step lines up. The routine belongs to the pair, not to either dancer."**
- On "both": the spotlight widens to cover both, right dancer back to 1. Now both dancers run the
  SAME pose table in mirror image, perfectly together.
- On "step": thin gold dashed ties connect matching hands across the gap, pulsing on each step.
- On "pair": a gold rough loop (ellipse) draws around both dancers, and the "one routine" sheet
  slides down to sit on the loop; gold label "belongs to the pair" (60 px).
- Leaves: dancers, loop and sheet blur out at line 3 start (they return small in line 10).

**3. "For qubits, we use a gate called C NOT. If the control qubit is one, it flips the target."**
- Hand-drawn circuit, centred, y 360 to 640: two wires x 420 to 1500, top at y 420 labelled
  "control" (left, 48 px), bottom at y 600 labelled "target". On "gate" draw the CNOT at x 1060:
  solid dot on control, circle with plus (⊕) on target, vertical line between. Caption shows CNOT.
- On "If": a tiny rule card at right (x 1220 to 1700, y 700 to 840): "control 1 → flip target",
  with "flip" in gold on "flips". ("target" lands at the line end.)
- Stays.

**4. "Start with both qubits at zero, and use H to put the control in a fifty fifty superposition."**
- On "zero": a "0" (56 px) writes at the left end of each wire, with the small "c" and "t" tags.
- On "H": an H box draws on the control wire at x 760.
- On "fifty": a small coin sketch above the control wire between H and CNOT, with gold "50/50"
  label. The rule card fades to 0.35.
- Stays.

**5. "Now apply C NOT, and it acts on each part of that superposition: zero zero stays zero zero, and one zero becomes one one."**
- On "apply": the CNOT symbol turns gold briefly (0.6 s) then back to ink. The circuit moves up and
  shrinks (scale 0.7, to y 140 to 320; the title is long gone).
- On "part": the control's "0" and "1" halves (from the 50/50 coin) split into two chips centre stage, stacked: row 1 at y 560, row 2 at y 720, each with an
  arrow to a result chip on the right.
- "Zero zero stays zero zero": row 1 writes "0 0 → 0 0", all ink.
- "one zero becomes one one": row 2 writes "1 0 →", then the result chip shows "1 0" whose second
  digit flips like a coin (scaleY 1 → 0 → 1) and lands as gold "1", giving "1 1".
- Leaves: the two rows blur out at line 6 start; the small circuit stays at top.

**6. "Measure the pair, and half the time you get zero zero, half the time one one."**
- On "Measure": a hand-drawn bar chart (axes x 420 to 1500, baseline y 780) with four slots
  labelled "00", "01", "10", "11" (56 px).
- A shot counter "shots: N" (48 px) ticks up via onFrame from 0 to 200; the 00 and 11 bars grow
  together towards a dashed "half" line (gold bars while growing), each wobbling around 50%.
- On "half" (first): a label "half" over 00; on "half" (second): "half" over 11.
- Stays.

**7. "Never zero one, never one zero. The two answers always agree."**
- On "Never": the empty 01 and 10 slots get an ink "0" and a short hand stroke through them.
- On "always": a gold check-style tick and gold label "always agree" (64 px) above the chart.
- Leaves: the 01 and 10 marks fade at line 8 start.

**8. "Yet either qubit alone is a fair coin flip, and its own arrow shrinks to nothing."**
- On "either": the chart slides left and shrinks (scale 0.6, to x 160 to 820). Right side: a coin for
  qubit A alone with its own two-bar tally "0" and "1", each at half; label "A alone: 50/50".
- On "arrow": a small hand-drawn circle (the qubit ball from earlier lessons) at x 1400, y 620 with
  a gold arrow pointing up; from "shrinks" to "nothing" (onFrame) the arrow shrinks to a dot.
  Label "no arrow of its own" (48 px) on "nothing".
- Leaves: the single-qubit tally and shrinking ball blur out at line 9 start, the label stays 1 s.

**9. "That's entanglement. The pair has one shared state, and the information lives in the pair."**
- On "entanglement": big gold key label "entanglement" (80 px) at top centre (y 140).
- On "pair": the two coins A and B return centre (x 720, 1200, y 520) and one gold rough loop
  draws around BOTH; label inside the loop bottom "one shared state" (56 px) on "shared".
- On "information": a small chip pair "00 or 11" slides inside the loop, then label "lives in the
  pair" on "lives".
- Leaves: everything blurs out at line 10 start, keeping nothing.

**10. "Here the dancers mislead us, because they follow steps written in advance."**
- On "dancers": the two dancers return smaller (about 260 px), centred at y 520.
- On "steps": each dancer holds a little paper sheet with scribbled steps (two copies of the same
  sheet, one per dancer); on "written" a label "steps written in advance" (52 px). ("advance" spills
  to line 11's start.)
- Stays.

**11. "Experiments called Bell tests show entangled qubits can't be carrying answers settled in advance."**
- On "Bell": label "Bell tests" (64 px) at top; a small lab sketch (a box with two detectors) beside it.
- On "can't": a big ink X draws over both paper sheets (0.5 s), and gold label "no answers settled
  in advance" (56 px) writes below.
- Leaves: dancers, sheets and X blur out at line 12 start.

**12. "Nor can entanglement send a message faster than light. Each side alone just sees random results."**
- Two "labs", rough boxes at x 260 to 700 and x 1220 to 1660 (y 360 to 800), labelled "side A",
  "side B"; a wavy dotted line between them (the shared pair).
- On "message": an envelope arrow from A to B draws, with speed lines and a label "faster than
  light?" (48 px) on "faster"; on "light" a hand strike crosses the envelope out.
- On "random": each lab's list of results writes downward via onFrame: A "0 1 1 0 1 0", B the same
  digits, each list labelled "random" (48 px) on "random".
- Stays.

**13. "The match only shows up when the two lists are compared."**
- On "match": the two lists start sliding toward the centre (move 1.0 s, power2.inOut) until they
  sit side by side.
- On "compared": gold ties join each matching row, one by one, and gold label "they match" (60 px)
  writes above.
- Leaves: labs and lists blur out at line 14 start.

**14. "This pair is called a Bell state, written ket zero zero plus ket one one, over root two."**
- On "Bell": label "Bell state" (64 px) top centre.
- The formula writes in pieces, centred at y 480, 120 px: "|00⟩" on "ket" (first), "+" on "plus",
  "|11⟩" on "ket" (second), then the brackets and "/√2" on "root" (cue "root"; "two" is heard as "2"). Gold underline draws under the
  whole formula at line end. Small notes under the digits: "both 0" under |00⟩, "both 1" under |11⟩
  (44 px).
- Stays: formula moves up to y 300 at line 15 start.

**15. "So entangled qubits share one state. Each one alone is random, but together they always agree."**
- Closing card: formula at top (y 300, scale 0.8, gold underline kept).
- Left: the small circuit (H then CNOT) redrawn at x 200 to 760, y 520 to 720.
- Right, on "alone": "each alone: random" (56 px ink); on "together": "together: always agree"
  (64 px, gold).
- The two coins A and B sit under the text inside one gold loop, landing on the same face once
  more on "agree".
- Everything stays through the end hold.

## Safe area
Everything above sits inside x 140 to 1780, y 60 to 860. Nothing is drawn in the title area before
the title blurs out (about 3 s). Bottom-most labels stop at y 840.

## Caption phrase pairs for scene.mjs
```js
export const phrases = [
  ["ket zero zero plus ket one one, over root two", "(|00⟩ + |11⟩)/√2"],
  ["Zero zero", "00"], ["zero zero", "00"],
  ["one zero", "10"], ["zero one", "01"], ["one one", "11"],
];
```
Built-ins already cover "C NOT" to CNOT and "fifty fifty" to 50/50. Check the captions read
"superposition: 00 stays 00, and 10 becomes 11" and "Never 01, never 10."

## Respellings
None needed: Whisper heard C NOT, H, superposition, entanglement, Bell and ket correctly.
