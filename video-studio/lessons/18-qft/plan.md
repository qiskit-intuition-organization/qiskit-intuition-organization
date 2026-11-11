# Lesson 18, The quantum Fourier transform: beat plan

Voiced with bf_emma: 17 lines, 260 words, narration ends at 85.14 s, film 87.74 s with the 2.6 s hold.
The script was reviewed and revised, then voiced again; every time below is from that voicing's
`project/assets/vo/timing.json` and is only a guide: always cue with `cue(line, "word")`, never with hard numbers.

Board 1920x1080, safe area x 140 to 1780, y 60 to 860. Ink #e8e8e8, gold #d9b463 on #17191c.
Gold rule: one gold thing at a time, the thing the voice is naming right now (the three notes, the peaks,
the hand that is turning, the one reading a measurement gives, the factors).

Story in one breath: a chord reaches the ear as one wave and the ear hears its notes (a Fourier transform);
the QFT does that to amplitudes (the numbers that set each reading's chance when you measure); a pattern on
0 and 2 (it repeats every 2 steps) comes out as peaks on frequencies 0 and 2; clock hands show why (they add
on 0 and 2, cancel on 1 and 3); slide the pattern and the peaks do not move; unlike the ear, measuring gives
one frequency per run; that is plenty for one hidden rhythm, and Shor's algorithm finds one and uses it to
factor; closing rule: every r steps lands on multiples of N/r.

## The script (line numbers from 0)
0. Play a piano chord. How does your ear pick out the notes?
1. One tangled wave arrives, yet you hear three separate notes.
2. Your ear splits that wave into frequencies, how fast each note vibrates. That's a Fourier transform.
3. The quantum Fourier transform, or Q F T, does the same to amplitudes, the numbers that set each reading's chance when you measure.
4. Two qubits, quantum bits, have four possible readings, zero to three.
5. Put equal amplitudes on zero and two, leaving one and three empty. That pattern repeats every two steps.
6. Now run the Q F T, and the chance peaks at frequencies zero and two.
7. Here's why. Each input sends every output a clock hand, and where it points is its phase.
8. From zero, every hand points up. From two, each turns half a circle more than the last.
9. At outputs one and three, up cancels down, while at zero and two they add. That's interference.
10. Slide the pattern onto one and three, and the peaks stay put. The Q F T hears the rhythm, wherever it starts.
11. Here the chord picture breaks. Your ear hears every note at once.
12. But measuring gives one frequency per run, picked at random from the peaks.
13. That's no good for listing every note in your data, but plenty when you need one hidden rhythm.
14. Shor's algorithm finds one, and uses it to break huge numbers into their factors.
15. So the Q F T turns rhythm into position.
16. With N readings, a pattern repeating every r steps lands on multiples of N over r.

Shape: hook (0), analogy (0 to 2), the real idea moving (3 to 10), where the analogy breaks and the
misconception (11 to 13), why it matters (14), takeaway and formula (15, 16).

## Physics the pictures must keep (checked)
- Two qubits, N = 4 readings 0, 1, 2, 3. Input state (|0> + |2>)/sqrt 2: equal amplitudes on 0 and 2,
  zero on 1 and 3. It repeats every r = 2 steps.
- The QFT sends reading x to all four outputs k with equal size 1/2 and phase 2 pi x k / 4.
  From x = 0: phases 0, 0, 0, 0 (all hands up). From x = 2: phases 0, half turn, full turn, one and a half
  turns (hands up, down, up, down), so each is half a circle more than the last. Sum: outputs 0 and 2 add
  (amplitude 1/sqrt 2, chance 50% each), outputs 1 and 3 cancel exactly (chance 0%). This is the lesson's
  quiz answer: "0 and 2, 50% each".
- Slid pattern (|1> + |3>)/sqrt 2. From x = 1: hands up, quarter, half, three quarters. From x = 3: hands up,
  three quarters, half (one and a half turns), quarter. Output 0: up + up, adds. Output 1: opposite, cancels.
  Output 2: down + down, adds (amplitude minus 1/sqrt 2, same length, so the same 50%). Output 3: opposite,
  cancels. Chances are again 50%, 0%, 50%, 0%. The output chance bars must NEVER move during the slide.
- Drawing hands clockwise for growing phase is only a drawing choice (a mirror image); keep it the same everywhere.
- The two hands in a clock have the same length. A stacked pair is exactly twice one hand. A cancelled
  pair is exactly opposite. Never draw a pair at any other relative angle (see the slide formula in line 10).
- Chance bars only ever show 50%, 0%, 50%, 0% for the outputs. The total is always 100%.
- A measurement gives ONE reading per run, 0 or 2, never 1 or 3, and never two bars lit at once (line 12).
- "Peaks" (first said in line 6, used again in lines 10 and 12) always means the two tall output bars, 0 and 2.
  The input bars are never called peaks.
- Line 3's generic bars use amplitudes 0.8, 0.4, 0.2, 0.4 so the chances 64%, 16%, 4%, 16% are their exact
  squares and add to 100%. Do not print the amplitude numbers, only the percentages.
- Line 2's tangled wave is the true sum of the three pure waves drawn beside the ear (1.5, 3 and 5 cycles).
- Closing example: N = 4, r = 2, N/r = 2, peaks on 0 and 2 (the multiples of 2 below 4). 3233 = 61 x 53 is true.
- Never draw or say that the QFT hands you the whole spectrum, except crossed out in line 13.

## The main board (lines 3 to 10): three tiers on four columns
Columns (readings 0, 1, 2, 3) at x = 600, 890, 1180, 1470. Left headers live in x 150 to 490. The right
margin x 1580 to 1775 holds short notes (line 3's small eye, line 4's qubits, "phase", "length sets the chance"),
one at a time. Nothing below y 850.

- Tier 1, the input pattern (y 60 to 280): baseline `b-inBase` y 220 from x 520 to 1560. Bars `b-in0..3`,
  90 wide, 140 px per unit amplitude (0.71 is 100 px, top at y 120), driven by `onFrame` + `sched()`.
  Number labels `b-inN0..3` "0 1 2 3" under the baseline (44 px, y 226 to 276).
  Left header `b-hAmp` "amplitude" (56 px, x 150 to 480, y 132 to 196).
- Tier 2, the transform (y 300 to 585): first the gate band `b-band`, a rough rounded box x 520 to 1560,
  y 395 to 485 with "QFT" inside (80 px). From line 7 it is replaced by four clock faces `b-ck0..3`,
  centres y 440, radius 90, with a centre dot and four small ticks. Each clock holds two hands of length 70:
  `b-hs0..3` solid (from the first lit input) and `b-hd0..3` dashed (from the second lit input). A stacked
  pair reaches 140 px, so it pokes 50 px out of the rim (up to y 300, or down to y 580).
- Tier 3, the output (y 600 to 850): baseline `b-outBase` y 780 from x 520 to 1560. Chance bars `b-out0..3`,
  90 wide, 50% is 140 px (top y 640), hachure fill. Labels `b-outN0..3` "0 1 2 3" (44 px, y 787 to 845).
  "50%" labels sit to the RIGHT of bars 0 and 2 (x col + 58, y 680 to 730, 44 px), never above them, so a
  down pointing stack in clock 2 has room. Left header `b-hCh` "chance" (56 px, y 650 to 712) and under it
  `b-hFr` "of each frequency" (40 px, y 714 to 762).

## Beats

### Line 0 (0.40 to 3.41) "Play a piano chord. How does your ear pick out the notes?"
- The kit title block stays until `blurOut("#b-title", cue(0, "pick"))` (2.63 s, more than 2.5 s). Everything
  in this scene is drawn below y 330 so nothing touches the title before it leaves.
- On "piano" (0.51): `b-piano` draws at left (1.0 s): a keyboard x 170 to 604, y 400 to 640, seven white keys
  62 wide with five black keys on top (y 400 to 545).
- On "chord" (1.02): three white keys (1st, 3rd, 5th) press down 8 px and fill gold hachure, 0.12 s apart;
  three tiny gold sound ticks fan out above them. Label "chord" (48 px, gold) writes under the keys (y 655 to 715).
- On "ear" (2.47): `b-ear` draws at x 1120 to 1300, y 390 to 650 (outer C curve, inner swirl, lobe), ink, 0.8 s.
- On "pick" (2.63): a gold "?" (90 px) writes above the ear (x 1180 to 1240, y 290 to 380; this is just
  below the title's bottom edge, and the title is blurring out at the same moment).
- Leaves: the "?" fades at line 1 start.

### Line 1 (3.71 to 7.12) "One tangled wave arrives, yet you hear three separate notes."
- On "tangled" (4.36): `b-tangle` draws left to right from the piano to the ear (x 640 to 1100, centre y 520,
  swing up to 105 px), 1.3 s, ink. It is the true sum of the three pure waves below, built with `wobbly()`.
  Label "one wave" (44 px) writes under it on "wave" (4.68), y 660 to 710.
- On "yet" (5.72): the three gold keys and "chord" fade to ink (0.3 s) so gold is free for the notes.
- On "three" (6.25): right of the ear, three pure waves draw one after another, 0.3 s apart, 0.6 s each,
  gold: `b-w1` slow (1.5 cycles), `b-w2` medium (3 cycles), `b-w3` fast (5 cycles), each x 1400 to 1640,
  swing 36 px, centres y 400, 520, 640. (They stop at x 1640 to leave room for the speed tags of line 2.)
- Leaves: nothing yet.

### Line 2 (7.42 to 13.25) "Your ear splits that wave into frequencies, how fast each note vibrates. That's a Fourier transform."
- On "splits" (8.10): the ear pulses (scale 1.06 and back) and three short ink arrows fan from the ear
  (x 1310, y 520) to the start of each pure wave (0.5 s). The tangled wave flickers once.
- On "frequencies" (9.41): label "frequencies" (56 px, gold) writes under the three waves (x 1390 to 1720,
  y 705 to 770).
- On "how" (10.19): the three waves go to ink and a gold dot starts riding along each one, left to right and
  round again, all three at the same sideways speed (`onFrame`, one pass every 1.6 s). The dot on the slow
  wave bobs gently, the dot on the fast wave bobs more than three times as often: "how fast it vibrates",
  seen moving. The dots keep riding until the scene leaves.
- Speed tags (40 px, ink, left aligned at x 1655, ending before x 1775), one beside each wave: "slow" on
  "fast" (10.40), "faster" on "each" (10.68), "fastest" on `cue(2, "note", 1)` (10.94).
- On "Fourier" (12.51, start 0.3 s early): big label "Fourier transform" (84 px, ink) writes at x 560 to 1360,
  y 150 to 250 (the title is long gone). A gold underline draws under it on "transform" (12.88), and
  "frequencies" returns to ink as it draws.
- Leaves: the whole chord scene blurs at `cue(3, null, 0, -0.15)` (13.40).

### Line 3 (13.55 to 20.88) "The quantum Fourier transform, or Q F T, does the same to amplitudes, the numbers that set each reading's chance when you measure."
- On "quantum" (14.11): `b-band` draws in tier 2 (0.9 s) and "quantum Fourier transform" (56 px, ink) writes inside it.
- On "QFT" (16.00): the long name fades (0.25 s) and "QFT" (80 px, gold) writes in the middle of the band.
- On "amplitudes" (17.42): tier 1 draws: `b-inBase`, then the four bars rise (onFrame, 0.7 s, staggered 0.1 s)
  to 0.8, 0.4, 0.2, 0.4. Header "amplitude" writes at left. Four short ink arrows drop from tier 1 into the band.
  "QFT" goes back to ink; the bars are the thing now.
- On "numbers" (18.45): the tallest bar turns gold and wiggles (height plus or minus 6 px for 0.6 s).
- On "chance" (19.88, heard inside the line now, so `cue(3, "chance")` works): "64%  16%  4%  16%" write above the
  four bars (40 px, each 8 px above its own bar top; the tall bar's sits at y 60 to 100), the gold bar's in gold,
  0.1 s apart. Under the header, the note "sets the chance" (40 px, gold, y 200 to 248) writes. Taller bar,
  bigger chance: one number per reading.
- On "when" (20.24): a small hand drawn eye `b-eyeS` (130 wide, an almond with a round pupil) draws in the right
  margin, centre (1678, 140), 0.35 s, ink, and "measure" (40 px, ink, x 1590 to 1770, y 190 to 238) writes under
  it at `cue(3, "you", 0, 0.2)` (20.68). It is the same eye that comes back, bigger, in line 12. This is the
  only place the film says what a "reading" is: what you see when you measure.
- Leaves: the percentages, "sets the chance", the eye and "measure" fade at `cue(4, null, 0, -0.1)` (21.08), so
  the margin is empty before the qubit doodle draws there; the gold bar returns to ink.

### Line 4 (21.18 to 25.00) "Two qubits, quantum bits, have four possible readings, zero to three."
- On "Two" (21.28): in the right margin, two small circles draw (`b-q`, radius 30, centres (1640, 150) and
  (1720, 150)); "2 qubits" (40 px) writes under them (x 1600 to 1770, y 190 to 238).
- On "bits" (22.41): a digit writes inside each circle: "0" "0" (48 px).
- On "four" (23.09): the digits step through 00, 01, 10, 11 (0.34 s each, a quick fade swap); as each pair
  shows, the matching bar flashes brighter. Four bars, four pairs.
- On "zero" (24.44): "0", "1", "2", "3" write under the bars left to right (0.15 s apart), finishing on "three"
  (`cue(4, "to", 0, 0.25)`, 24.87).
- Leaves: the qubit doodle and its label fade at line 5 start.

### Line 5 (25.30 to 31.28) "Put equal amplitudes on zero and two, leaving one and three empty. That pattern repeats every two steps."
- On "equal" (25.88): bars 0 and 2 move to the same height, 0.71 (100 px), 0.8 s, and turn gold. A thin dashed
  level line across their tops (x 555 to 1225, y 120) draws on the first "two" (27.26) to show "equal", then
  fades after 1 s.
- On "leaving" (27.59): bars 1 and 3 sink to zero (0.7 s); on "empty" (29.15) a small ink "0" writes in each
  empty slot just above the baseline (40 px).
- On "pattern" (29.91): the bars go back to ink hachure. On "repeats" (30.20): a gold hop arrow `b-hop` draws
  from the top of bar 0 to the top of bar 2 (arc from (600, 112) to (1180, 112), peak y 68, arrowhead at bar 2).
- On the second "two" (`cue(5, "two", 1)`, 30.91): "every 2 steps" (44 px, gold) writes inside the arc, in the
  empty slot above reading 1 (x 760 to 1020, y 132 to 186). The small "0" there fades as it writes; the "0" in
  slot 3 fades 1 s later, so line 10 can slide the pattern cleanly.
- `b-hop` and "every 2 steps" form one group `b-rhythm` that will slide with the bars in line 10.

### Line 6 (31.58 to 35.76) "Now run the Q F T, and the chance peaks at frequencies zero and two."
- On "run" (32.16): the hop group goes to ink. The band turns gold and a bright gold stroke sweeps along its
  outline left to right (0.9 s, a `wobbly()` trace with `frac`); the four arrows above it pulse downward.
- On "chance" (33.53): `b-outBase` draws, header "chance" writes at left, and four short arrows drop from the
  band to tier 3.
- On "peaks" (33.77): bars `b-out0` and `b-out2` rise from 0 to 50% (onFrame, 0.9 s), gold hachure: two tall
  bars, the peaks. Slots 1 and 3 stay empty. Never show a flat 25% row first.
- On "frequencies" (34.33): "of each frequency" writes under the header and the labels "0 1 2 3" write under
  the baseline (0.12 s apart), so the bottom row is clearly a new axis: frequency, not the input reading.
- On "zero" (35.46): "50%" writes beside bar 0; on "two" (`cue(6, "and", 1, 0.2)`, 35.71): "50%" beside bar 2.
  Both gold. The band is ink again by now.

### Line 7 (36.06 to 41.28) "Here's why. Each input sends every output a clock hand, and where it points is its phase."
- On "Here's" (36.28): the band and its eight little arrows blur out; the output bars and their "50%" dim to
  0.3 (the result we are about to explain). Four clock faces `b-ck0..3` draw in tier 2, 0.12 s apart, 0.5 s each.
  A small header "inside the QFT" (40 px, ink) writes at left (x 150 to 480, y 418 to 466).
- On "input" (37.21): small tag "input" (44 px) writes above "amplitude" (y 80 to 130). Input bar 0 turns gold.
- On "sends" (37.52): a fan of four thin ink lines `b-fanA` draws from under the "0" label (600, 282) to
  the top of each clock (y 345), 0.6 s, one line after another so it reads as "to every output".
- On "output" (38.14): small tag "output" (44 px) writes above "chance" (y 598 to 646).
- On "clock" (38.58): a solid hand `b-hs0..3` draws in every clock, pointing straight up, 0.1 s apart, gold.
  The fan fades to 0.25.
- On "where" (39.44): the hand in clock 3 rocks 25 degrees each way and comes back up (onFrame, 39.4 to 40.5),
  and a small curved double arrow draws round its tip, to show that where it points is a thing that can change.
  "phase" (56 px, gold) writes in the right margin (x 1585 to 1775, y 405 to 470) on "phase" (40.68, start 0.3 s early).
- Leaves: "phase", its arrow and the fan fade at line 8 start.

### Line 8 (41.58 to 46.68) "From zero, every hand points up. From two, each turns half a circle more than the last."
- On "zero" (42.23): input bar 0 pulses; on "every" (42.52) the four solid hands glow gold one after another
  (0.15 s apart), each with a tiny up tick, and settle to ink by "up" (43.63).
- On the second "From" (`cue(8, "From", 1)`, 44.02): input bar 0 goes ink, input bar 2 turns gold, and a second
  fan `b-fanB` (dashed lines) draws from under the "2" label to the four clocks (0.4 s).
- On "two" (44.46): a dashed hand `b-hd0..3` appears in every clock, gold, pointing up, sitting just beside
  the solid one (offset 6 px so both read). `b-fanB` fades to 0.2.
- On "turns" (44.85): the dashed hands sweep clockwise together at the same speed (onFrame): clock 0 does not
  move, clock 1 stops after half a turn (down), clock 2 after a full turn (up), clock 3 after one and a half
  turns (down). Half a turn takes 0.5 s, so the last one lands at 46.35, just before "last" (about 46.55).
  As each hand stops, a small hop arrow with "half turn" (40 px) draws between that clock and the one before
  it, above the rims (y 296 to 340, centred at x 745, 1035, 1325): three hops in all, "half a circle more
  than the last" read straight off the row.
- Leaves: the three "half turn" hops and the fan fade at line 9 start. Hands go to ink. Input bar 2 goes ink.

### Line 9 (46.98 to 52.25) "At outputs one and three, up cancels down, while at zero and two they add. That's interference."
- On "outputs" (47.52): clocks 0 and 2 dim to 0.35; clocks 1 and 3 stay bright. "inside the QFT" fades.
- On "up" (48.53): in clocks 1 and 3 the solid hand (pointing up) flashes gold for 0.3 s.
- On "cancels" (48.89): in clocks 1 and 3 the dashed hand (pointing down) turns gold and slides tip to tail onto
  the solid one (0.4 s), so it is moving as "down" (49.12) is said: the path goes up and comes straight back to
  the centre dot. At 49.3 a small ink "0" pops at the centre, then both hands return to their places at opacity
  0.3 and stay as a straight line through the centre. "0%" (40 px, ink) writes above the baseline in output
  slots 1 and 3.
- On "while" (49.58): clocks 1 and 3 dim to 0.35; on "zero" (49.97) clocks 0 and 2 come back to full.
- On "add" (50.89, start 0.2 s early): in clocks 0 and 2 the dashed hand lifts tip to tail on top of the solid
  one (0.5 s): one long gold hand, twice as long, poking out of the rim. At the same time output bars 0 and 2
  return to full opacity gold with their "50%".
- On "interference" (51.83, start 0.3 s early): "interference" (56 px, gold, hand underline) writes at left in
  tier 2 (x 150 to 490, y 410 to 478). The word names both things just seen, the cancelling and the adding, so
  all four clocks are at full opacity again as it writes.

### Line 10 (52.55 to 58.65) "Slide the pattern onto one and three, and the peaks stay put. The Q F T hears the rhythm, wherever it starts."
- One number drives the whole beat: `s = sched([[cue(10,"Slide"), cue(10,"three"), 0, 1], [cue(10,"wherever"), cue(10,"starts",0,0.2), 1, 0]], t)`.
  Input bars and the `b-rhythm` group shift right by `290 * s` px (bars from columns 0 and 2 to columns 1 and 3).
  Hand angles in clock k (degrees, clockwise from up): solid `90 * s * k`, dashed `180 * k + 90 * s * k`.
  The two hands in a clock therefore always stay aligned (k even) or opposite (k odd), so the stacks and the
  cancelled pairs turn as rigid pieces: clock 0 does not move, clock 1's dim pair turns a quarter, clock 2's
  gold stack swings from up to down, clock 3's dim pair turns three quarters.
- On "Slide" (52.68): "interference" fades; the slide runs to "three" (54.49). The output bars do not move at all.
- On "peaks" (55.09): gold rings draw round the output labels "0" and "2"; on "stay" (55.47) the two output
  bars give one small bounce (scaleY 1.06, 0.3 s).
- On "put" (55.66): in the right margin the note "length sets" / "the chance" (40 px, ink, two lines,
  x 1585 to 1775, y 395 to 485) writes, and the down pointing stack in clock 2 and output bar 2 flash together
  once: the long hand points the other way, it is just as long, so the chance is the same.
- On "hears" (56.59): a small ear `b-ear2` draws at left in tier 2 (x 240 to 380, y 370 to 520), the callback
  to the chord.
- On "rhythm" (57.18): the `b-rhythm` hop and "every 2 steps" turn gold.
- On "wherever" (57.93): the pattern slides back to 0 and 2 (s goes 1 to 0, done by 58.61) and the hands
  retrace. The output bars and rings still do not move.
- Leaves: the whole three tier board blurs at `cue(11, null, 0, -0.1)` (58.85).

### Line 11 (58.95 to 62.67) "Here the chord picture breaks. Your ear hears every note at once."
- Left half. On "chord" (59.69): a bigger ear `b-ear3` draws at x 430 to 650, y 300 to 600, and three ink
  waves (slow, medium, fast; x 170 to 400; centres y 360, 450, 540) draw running into it, 0.2 s apart.
- On "breaks" (60.49): a jagged crack `b-crack` draws down the middle of the board (x about 880, y 130 to 800,
  0.5 s), splitting "ear" from what comes next on the right.
- On "every" (61.81): all three waves turn gold at the same instant and the ear pulses.
  "every note at once" (48 px, gold) writes under them (x 170 to 700, y 640 to 700), ending on "once"
  (`cue(11, "at", 0, 0.25)`, 62.65).

### Line 12 (62.97 to 66.98) "But measuring gives one frequency per run, picked at random from the peaks."
- At line start (`cue(12)`, on "But"): the left half dims to 0.4 (waves back to ink) and the crack dims to 0.35.
  At `cue(12, null, 0, 0.1)` the output chart redraws bigger on the right half (0.5 s): baseline y 660 from
  x 1030 to 1730, columns x 1110, 1290, 1470, 1650, bars 0 and 2 at 50% (200 px, hachure, ink), labels
  "0 1 2 3" (48 px, y 668 to 728), "frequency" (44 px) centred under them (y 735 to 790).
- On "measuring" (63.53): the hand drawn eye from line 3, now bigger (140 wide), draws at (1380, 150) with
  "measure" (44 px) beside it (0.3 s).
- On "gives" (63.86): four empty tally boxes draw under the eye (100 x 80, at x 1110, 1290, 1470, 1650,
  y 290 to 370, 0.3 s for all four) with "run 1" to "run 4" above them (40 px, y 242 to 288).
- Four runs, one reading each, never two bars lit together:
  run 1 on "one" (64.19) reads 2; run 2 on "per" (64.99) reads 0; run 3 on "picked" (65.56) reads 0;
  run 4 on "random" (66.05) reads 2. Each run: that bar turns solid gold for 0.4 s, a gold dot hops from its
  top to the run's tally box, and the number writes in the box (56 px, gold while new, ink after).
- On "peaks" (`cue(12, "the", 0, 0.12)`, 66.92): a thin gold outline flashes round both bars together, to say
  "these are the peaks it picks from". Slots 1 and 3 stay empty throughout.

### Line 13 (67.28 to 72.06) "That's no good for listing every note in your data, but plenty when you need one hidden rhythm."
- At `cue(13, null, 0, -0.25)` (67.03): the left half (ear, waves, label) blurs out. In its place a spectrum
  doodle draws fast (0.5 s): eight thin bars of mixed heights on a baseline (x 240 to 760, y 300 to 570), the
  full list of notes you might hope to get.
- On "good" (68.00, plus 0.15): a big ink cross strikes the doodle (two strokes, 0.4 s).
- The label under it (48 px, ink, x 200 to 800, y 600 to 660) writes in two parts as the words are said:
  "every note" on "every" (68.84), "in your data" on "your" (69.50).
- On "plenty" (70.30): right half, the tally row and the eye fade to 0.3; bar 2 turns solid gold with short
  rays round its top (like the pilot's lit bulb). One reading, and that is enough.
- On "one" (71.30): "one hidden rhythm" (56 px, gold) writes above the chart (x 1040 to 1720, y 390 to 450).
- Leaves: everything blurs at `cue(14, null, 0, -0.1)` (72.26).

### Line 14 (72.36 to 77.22) "Shor's algorithm finds one, and uses it to break huge numbers into their factors."
One row, read left to right: a number goes in, the QFT finds a hidden rhythm, the factors come out. The words
arrive middle first ("finds one"), then left ("huge numbers"), then right ("factors"), so the row fills in
that order.
- On "Shor's" (heard as "Shaw's" at 72.88; cue it as `cue(14, "algorithm", 0, -0.6)`, 72.75): "Shor's algorithm"
  (72 px, ink) writes above the row (x 620 to 1300, y 200 to 290), 0.8 s, done before "finds".
- On "finds" (73.87): a rough box draws in the middle of the board (x 850 to 1070, y 380 to 500, 0.4 s), gold,
  with "QFT" (72 px, gold) inside. On "one" (74.20): under it, "finds a hidden rhythm" (40 px, ink,
  x 760 to 1160, y 520 to 568) writes, and below that a small gold rhythm doodle `b-beat` draws (four short
  ticks 60 px apart on a thin line, x 870 to 1050, y 610, with three little hop arcs between them): the
  "one" the voice means, and the link back to line 13.
- On "uses" (74.73): the QFT box and its letters go to ink, and a hand arrow draws out of the box to the right
  (x 1090 to 1250, y 440): the rhythm is handed on.
- On "break" (75.25): "3233" (100 px, ink) writes at left (x 330 to 620, y 380 to 500), finishing on "numbers"
  (75.84), and a hand arrow draws from it into the box (x 650 to 830, y 440) on "huge" (75.58).
- On "factors" (76.89, start 0.3 s early): "61 × 53" (100 px, gold) writes at right (x 1270 to 1640,
  y 380 to 500). The rhythm doodle goes to ink as it writes, so the factors are the one gold thing.
- Leaves: all of it blurs at `cue(15, null, 0, -0.1)` (77.42).

### Line 15 (77.52 to 80.04) "So the Q F T turns rhythm into position."
Closing card, built over lines 15 and 16, stays to the end.
- Headline (y 80 to 190, centred, 84 px): "QFT:" writes on "QFT" (78.11), "rhythm" on "rhythm" (78.69),
  a hand arrow draws on `cue(15, "rhythm", 0, 0.45)` (79.14, just before "into"), "position" in gold on
  `cue(15, "position", 0, -0.1)` (79.41).
- Picture row (y 240 to 560), drawing from line start to about 78.9 so it grows under the headline.
  Left, small input chart: baseline y 500 from x 330 to 810, slots at x 390, 510, 630, 750, ink bars 60 wide
  and 110 tall on slots 0 and 2, labels "0 1 2 3" (40 px, y 506 to 552). This is the rhythm.
  Middle, a small "QFT" box (x 870 to 1050, y 370 to 470) with a short arrow in and out.
  Right, small output chart: baseline y 500 from x 1120 to 1600, slots at x 1180, 1300, 1420, 1540, gold bars
  on slots 0 and 2, labels "0 1 2 3" (40 px). This is the position; its bars rise on "position".

### Line 16 (80.34 to 85.14, then the 2.6 s hold) "With N readings, a pattern repeating every r steps lands on multiples of N over r."
- On "N readings" (`cue(16, "With", 0, 0.3)`, 80.76): a brace draws under the input chart and
  "N = 4 readings" (44 px) writes under it (y 585 to 635).
- On "pattern" (81.49): the two input bars pulse once (scaleY 1.06, 0.3 s).
- On "repeating" (82.27): a gold hop arrow draws from bar 0 to bar 2 on the input chart (peak y 330), 0.3 s.
  On "every" (82.54): "r = 2 steps" (44 px, gold) writes above it (x 400 to 640, y 250 to 300), 0.3 s.
- The formula writes at the bottom, centred (y 670 to 790, 100 px, about x 265 to 1655), in three parts:
  "every r steps" in ink on "steps" (`cue(16, "every", 0, 0.35)`, 82.89); the arrow on "lands" (83.24), when
  the output bars also bounce once; "multiples of N/r" in gold on "multiples" (83.69).
- On the last "N over r" (`cue(16, "of", 0, 0.15)`, 84.42): a gold underline draws under "N/r", and
  "N/r = 4/2 = 2" (44 px, ink) writes under the output chart (y 585 to 635), finishing by the last "r" (84.72).
  The hop arrow and "r = 2 steps" go to ink when the formula's gold half writes.
- Hold (85.14 to 87.74): not static. The hop arrow on the input chart redraws every 1.2 s and the two output
  bars breathe (height plus or minus 4 px, onFrame). The formula and underline stay still and readable.

## Cue notes (from this voicing's transcript)
- Words the transcriber filed under the next line, so `cue()` estimates them from the text (up to 0.3 s early;
  prefer the word before with an offset): "notes" (lines 0 and 1), "measure" (line 3), "three" (line 4),
  "steps" (line 5), "two" (line 6), "last" (line 8), "once" (line 11), "peaks" (line 12), "rhythm" (line 13).
  "chance" in line 3 is now heard inside its own line (19.88).
- `cue(2, "note")` returns 7.18, the "notes" left over from line 1. Use `cue(2, "note", 1)` (10.94).
  `cue(1, "notes")` returns 3.30, the one left over from line 0. Use `cue(1, "separate", 0, 0.5)`.
- "Q F T" is heard as one word "QFT": use `cue(n, "QFT")` in lines 3, 6, 10 and 15.
- "Shor's" is heard as "Shaw's" (Emma's accent; it is said correctly) at 72.88. `cue(14, "Shor's")` only
  returns the line start (72.36); use `cue(14, "algorithm", 0, -0.47)` for the word itself.
- Line 11: in the full run the transcriber wrote "Where" for "Here" (transcribed on its own, the line comes
  back as "Here the chord picture breaks, your ear hears every note at once", so the voice is right). Do not
  cue on "Here"; use `cue(11)`.
- Line 16: the letters are glued to their neighbours ("Nreadings" at 80.78, "Rsteps" at 82.86, "Nover" at
  84.40), so only the last "r" is a word of its own: `cue(16, "r")` is 84.72 (the LAST r). For the first N use
  `cue(16, "With", 0, 0.3)`, for the first r `cue(16, "every", 0, 0.35)`, for the second N `cue(16, "of", 0, 0.15)`.
- Line 15: "into" (79.44) and "position" (79.51) are heard almost together, so the headline arrow is cued off
  "rhythm" instead (see the beat).
- Line 8 has two "From": use `nth`. Line 9 has only one "At" now (the second is lower case "at", and
  `cue(9, "at", 1)` finds it at 49.87, but `cue(9, "zero")` is the better anchor). Line 5 has two "two"
  (27.26 and 30.91).
- Whisper's word times run up to 0.2 s early at line starts. Where a cue is the first word of a line, use
  `cue(line)` instead.
- Re-run `node kit/narrate.mjs lessons/18-qft` only if the script changes; the times and the way words are
  split both move when it is re-run, so check these notes again after any re-run.

## Captions: phrase pairs for scene.mjs
```js
export const phrases = [
  ["Q F T", "QFT"],
  ["N over r", "N/r"],
];
```
Leave "zero", "one", "two", "three", "N readings" and "r steps" as words; they read fine and a beginner gains
nothing from digits here. No built-in pair fires by accident ("pi" does not match inside "piano", "picture"
or "picked"). No respellings are needed for the voice: Fourier, qubits, amplitudes, frequencies, vibrates,
interference, measuring, rhythm and Shor's were all said correctly. Every word the pronunciation check lists
as "not heard" was heard: the transcriber filed it under the neighbouring line, glued a letter to it (QFT,
Nreadings, Rsteps, Nover), or spelled it its own way (Shaw's for Shor's, Where for Here).

## Glyph and build notes
- Labels hand draw only θ π ψ φ α β ω Σ ⊗ | ⟨ ⟩ √ → ≈. This plan also needs "%", "/", "=", "?", ":" and "×".
  Check that Caveat renders "×" in "61 × 53"; if not, draw it as two short crossed strokes (inline SVG).
  "half turn" is written in words on purpose, so no ½ glyph is needed.
- No em dashes or en dashes anywhere in scene.mjs text.
- Dashed hands: rough.js `strokeLineDash: [10, 8]` on the dashed hands and on `b-fanB`.
- The hands, the input bars, the output bars, the riding dots and the slide all use `onFrame` + `sched()` so
  every frame is seek safe.
- Phone cut check: the right margin notes ("phase", "length sets the chance", "2 qubits", the small eye and
  "measure", the speed tags) end at x 1775; keep them inside 1780. The left headers start at x 150.
- Longest quiet stretches to watch for the 5 s rule: line 2 between "vibrates" and "That's" (the riding dots
  cover it), line 3 between "QFT" and "amplitudes" (the name swap covers it), and the end hold (the hop arrow
  and the breathing bars cover it).
