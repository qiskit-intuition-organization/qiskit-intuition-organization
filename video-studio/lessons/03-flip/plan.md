# Lesson 3, Flipping a qubit with X: beat plan

Voiced length: narration ends at 75.41 s, so the film is about 78.0 s with the 2.6 s hold.
17 lines, 258 words. Board 1920x1080, safe area x 140 to 1780, y 60 to 860.

## The three pictures
1. **The qubit dial (main object, reused).** A side view of the qubit: a big hand-drawn circle,
   centre (960, 470), radius 250, so the poles sit at y 220 and y 720. Pole labels "0" at (960, 150)
   and "1" at (960, 790), 64 px. The arrow runs from the centre to the rim and is gold whenever it
   is the thing moving. A faint dashed horizontal line through the centre is the "axle" of X.
2. **The pancake (analogy).** A frying pan seen from the side: handle sticking out to the left,
   shallow pan bowl about 560 wide centred at (960, 640). The pancake is a thick flat ellipse
   (about 380 x 70) with one face hachured gold (the "top" side, like a golden crust) and the
   other face plain ink. A curved motion arc above the pan shows the flip.
3. **Probability bars.** Two hand-drawn bars on a baseline at y 720, x 1260 to 1660: left bar
   labelled "0", right bar labelled "1", full height 400 px = always. Heights are live
   (`onFrame`), and the taller bar is gold with an "8 in 10" tag above it.

## How the flip is animated (keep the physics right)
X is a half turn around the left to right axis. Seen from the side, a rotation around a
horizontal axis that lies in the picture plane is exactly a vertical squash: the arrow's tip keeps
its x and its height goes y -> y cos(phi) as phi runs 0 to pi. So animate the arrow (and the
pancake) with `scaleY` from 1 through 0 to -1 about the circle's centre, eased with
`power2.inOut` over about 1.1 s. An arrow pointing up passes through a dot at the centre and
grows downward, exactly like a pancake turning over edge on. Do NOT spin it around the circle
in the picture plane, that would be a rotation around the wrong axis.
For the tilted arrow in lines 11 to 13, drive the bars from the same phi:
z(phi) = z0 cos(phi), P(0) = (1 + z) / 2, P(1) = (1 - z) / 2, with z0 = 0.6 (arrow 53 degrees
from straight up, so P(0) = 0.8). The bars then swap smoothly and finish at 20 and 80.

## Line by line (times are from timing.json)

**0** (0.40 to 5.43) "Your qubit, a quantum bit, reads zero every time you check it. How can you make it read one?"
- Title block shows (kit) and stays to at least 2.9 s.
- On "reads": three small hand-drawn readout cards in a row at y 560, x 520, 760, 1000, each
  writing "0" in ink (0.25 s apart, first on "zero").
- On "make": a gold hand arrow from the cards to a fourth card at x 1340 with a dashed outline
  and a gold "1?" (write on "one"; cue estimate, "one" is heard at 5.71 s, just after the line).
- Gold: only the wished-for "1?".

**1** (5.74 to 9.43) "Picture the qubit as an arrow. Up means zero, and down means one."
- 4.92: `blurOut("#b-title")` and blur out the readout cards.
- On "Picture": draw the big circle (1.2 s). On "arrow": draw the gold arrow from centre to top.
- On "up": write pole label "0" at top (gold briefly, then ink). On "down": a dashed ghost arrow
  draws downward and "1" writes at the bottom pole; the ghost fades 0.6 s later.

**2** (9.73 to 13.46) "To change it, we use a gate, which turns the arrow without stretching it."
- On "gate": a hand-drawn box at (300, 470), 150 x 150, labelled "gate" (56 px), with an ink
  arrow from the box to the circle's left edge.
- On "turns": the arrow swings 35 degrees right and back (in-plane wobble, 0.8 s, just to show
  "turning"). A small label "turns" writes under the box.
- On "stretching": a tiny ruler tick on the arrow and label "same length" (40 px) beside the box.
- Leaves at the end of the line: box, labels; the circle blurs out at 13.6 s too (pancake next).

**3** (13.76 to 17.13) "Our first gate is called X, and it's like flipping a pancake."
- On "called": a gate box at top centre (960, 200), 130 x 130, with a big "X" (90 px) writing in.
- On "flipping": draw the pan (handle and bowl, 1.2 s). On "pancake" (estimated cue): the
  pancake drops into the pan with its gold face up. Small labels "top" (gold) above it.

**4** (17.43 to 20.48) "Flip the pan, and the pancake's top ends up on the bottom."
- On "Flip": pan tips up 12 degrees and back; a curved motion arc draws above; the pancake rises
  140 px, turns over with `scaleY` 1 -> -1, and lands (1.1 s total).
- On "bottom": the gold face is now underneath; the "top" label slides down under the pancake
  and becomes "bottom" (rewrite). Tally label at (1500, 640) "flips: 1" writes.

**5** (20.78 to 23.19) "Flip it again, and you're back where you started."
- On "again": the same flip back, gold face up. Tally becomes "flips: 2".
- On "back": a gold tick draws next to the pancake and label "back to the start" (48 px).
- Leaves at 23.9 s: pan, pancake, tally, tick, X box (blur out).

**6** (23.49 to 27.76) "X does the same to our arrow, a half turn around a line running left to right."
- 24.0: circle, pole labels and the gold up arrow fade back in at centre; "X" box sits at
  (300, 470) with an arrow to the circle (cue on "same", since "X does" is heard as one token).
- On "line": draw the dashed axle across the circle, x 660 to 1260, gold (it is the thing named).
- On "running": a small curved rotation arrow around the right end of the axle (an ellipse arc
  at x 1270, like the turn of a spit), ink.
- On "half": label "half turn" (56 px) writes at (1500, 330), clear of the "1" label and the
  captions. (The axle, spin arrow and label come in the order the words name them: "half turn",
  then "line", then "running"; cue each on its own word.)

**7** (28.06 to 31.17) "The arrow pointing up at zero lands pointing down at one."
- On "zero": the "0" label glows gold.
- On "lands": the flip, `scaleY` 1 -> -1 about the centre (1.1 s). The arrow shrinks to a dot
  and grows downward. On "one": "1" glows gold, "0" back to ink.

**8** (31.47 to 37.23) "It's the not gate of ordinary computers, swapping zero and one every time, with no chance involved."
- Fade the axle and spin arrow to dim. On "not" ("knot" in the transcript): a little table at x 1300 to 1700, y 300 to 560,
  heading "NOT" (64 px), with an ink label "ordinary computer" (40 px) under it on "ordinary";
  rows "0 → 1" and "1 → 0" writing on "swapping" (56 px).
- On "chance": a small hand-drawn die at (1500, 680) with a gold cross through it, label
  "no chance" (40 px).
- Leaves at the end: table, die.

**9** (37.53 to 41.18) "Do X twice, and two half turns make a full turn, so you're back home."
- Cue on "half" (not "X" / "twice", heard glued): the second flip, arrow back up (1.1 s).
- On "full": label at (1500, 330) rewrites to "half + half = full turn".
- On "home": "0" glows gold and a gold tick draws beside it.

**10** (41.48 to 46.54) "Here the pancake falls short. It's always one side up, but our arrow can point in between."
- On "pancake": the circle group moves left to centre (620, 470) (0.9 s); a small pancake
  sketch at (1400, 380) shows two states only: gold face up, gold face down, with "or" between.
- On "between": the pancake sketch blurs out; five dim ghost arrows fan out between up and down
  on the right half of the circle (draw quickly, 0.15 s apart).

**11** (46.84 to 50.59) "Say it leans toward the top, so it reads zero eight times out of ten."
- On "leans": ghosts fade; the gold arrow tilts to 53 degrees from up, toward the right.
- On "reads": draw the bar frame at x 1260 to 1660, y 320 to 720, with labels "0" and "1".
- On "eight": bars grow (onFrame) to 80 and 20; the "0" bar is gold, tag "8 in 10" above it.

**12** (50.89 to 55.12) "After the same half turn, it leans low and reads one eight times out of ten."
- On "half": the flip, `scaleY` 1 -> -1. The arrow ends at
  127 degrees from up, still on the right side. Bars follow phi live and finish at 20 and 80.
- On "low": gold moves to the "1" bar; on "one" the "8 in 10" tag moves above it.

**13** (55.42 to 58.85) "X has swapped how much zero and how much one the arrow holds."
- On "much": a curved two-headed gold arrow draws between the two bar tops.
- On "holds": label under the bars "X swaps the amounts" (48 px).

**14** (59.15 to 63.63) "X doesn't read the qubit and then flip it. It turns the whole arrow, lean and all."
- Bars, swap arrow and label blur out at line start.
- On "read": a hand-drawn eye at (1440, 420) with a gold line struck through it, label
  "no reading first" (48 px).
- On "whole": the whole arrow pulses gold (thicker stroke, glow) for 0.6 s.

**15** (63.93 to 70.59) "Up is written ket zero, and down is ket one, so X turns ket zero into ket one and ket one into ket zero."
- At line start: everything blurs out.
- On "Up": a mini up-arrow (60 px tall) draws at (240, 330); on "zero" "|0⟩" writes beside it at
  x 300 (90 px). On "down": a mini down-arrow at (240, 500) and "|1⟩" on "one". This key sits in
  x 180 to 480, so each symbol appears only after its meaning is said.
- On "turns": the first formula line writes centred at (1100, 330), 110 px: "X|0⟩ = |1⟩", its
  result gold on the second "one" (`cue(15, "one", 1)`).
- On the third "one" (`cue(15, "one", 2)`): the second line writes at (1100, 500): "X|1⟩ = |0⟩",
  result gold on the last "zero". The key blurs out at the end of the line.

**16** (70.89 to 75.41) "So remember, gates turn the arrow, and X is the half turn that swaps zero and one."
- The two formula lines move to centre x 960 and up to y 230 and 370 (0.9 s), and scale to 0.85.
- On "gates": a small circle (radius 110) at (560, 650) with a gold arrow; on "half" it flips
  up to down (`scaleY`) once.
- On "swaps": takeaway text at x 760 to 1700, y 600 to 720 (64 px, ink): "Gates turn the arrow.
  X is a half turn that swaps 0 and 1." with a gold underline under "half turn".
- Closing picture holds: formula, mini dial, takeaway, all inside y 160 to 760.

## What is gold, line by line
0: "1?". 1: arrow. 2: arrow. 3: X, pancake top face. 4 to 5: pancake top face, tick.
6: arrow, axle. 7: arrow, the lit pole. 8: crossed die only. 9: arrow, tick.
10: arrow. 11 to 12: arrow, taller bar. 13: swap arrow. 14: eye strike, arrow pulse.
15: results |1⟩ and |0⟩. 16: mini arrow, underline.

## Caption phrase pairs (add in scene.mjs)
```js
export const phrases = [
  ["ket zero", "|0⟩"],
  ["ket one", "|1⟩"],
  ["not gate", "NOT gate"],
];
```

## Voice and cue notes
- No respellings needed. "X" is spoken clearly; the transcriber glues it to the next word
  ("Xdoes", "Xtwice", "Xhas", "Xdoesn't", "Xturns", "Xis"). Respelling it "Ex" gave
  the identical audio and the same transcript, so it stays "X". `cue()` falls back to a
  letter-share estimate for both "X" and the glued word; prefer cueing a neighbouring word
  (listed in each beat above).
- The last word of lines 0 and 5 ("one", "started") is heard just after the line window, and
  the first word of line 12 ("After") just before it, so those cues are estimates. Fine within 0.3 s.
- Homophones in the transcript: "you're" as "your" (lines 5, 9), "not" as "knot" (line 8).
  The audio is right; cue neighbouring words if `cue()` cannot find them.
