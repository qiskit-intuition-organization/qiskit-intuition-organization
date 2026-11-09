# Lesson 16, Bernstein Vazirani: beat plan

Voiced with bf_emma: 18 lines, 260 words, narration ends at 84.37 s (about 87.0 s with the 2.6 s hold).
Word times below are from `project/assets/vo/timing.json` (re-check with `cue()`; never hard-code).

Secret throughout: **s = 101** (switch 1 wired, switch 2 not, switch 3 wired). Switches are numbered
1, 2, 3 left to right on the wall and top to bottom on the circuit, so the readout 1 0 1 reads in
the same order everywhere. Do not mention Qiskit bit order.

## Recurring drawings

- **Switch wall** (lines 1 to 3, back small in 4, one big switch in 15): an ink panel `r.rect` about 900 x 380 at
  x 360 to 1260, y 330 to 710. Three toggle switches (small plate + lever that moves up for on,
  down for off) at x 520, 810, 1100, y 520. Each has "1", "2", "3" under it (44 px).
  **Hidden wiring:** dashed DIM wires from the back of switches 1 and 3 running right to the
  buzzer; switch 2 has no wire. Label "hidden wiring" (40 px, DIM) above the wires.
- **Buzzer** at x 1450, y 520: a round bell (circle r 70 + small base), with three short sound
  arcs that draw in gold when it rings. A sign under it, y 640: writes "ODD" or "EVEN" (56 px).
- **Sign bars** (the qubit state picture, lines 6 to 12): two small vertical bars side by side,
  labelled "0" and "1" under them (40 px). Plus = both bars up, equal height (60 px).
  Minus = the "0" bar up, the "1" bar pointing down. A ket label sits right of the pair
  (|+⟩ or |−⟩, 48 px). Bars are driven with `onFrame` + `sched()` so a bar can swing from up to
  down smoothly (scaleY from 1 to -1 about the baseline), and two bars can merge into one.
- **Circuit** (lines 5 to 12, and the closing card): wires at y 250 (switch 1), 390 (switch 2),
  530 (switch 3), 690 (buzzer), from x 260 to 1600. Left of each wire a tiny switch icon with its
  number; "|0⟩" (44 px) at x 270 to 330 on each input wire; left of the buzzer wire a tiny bell.
  Columns: first H boxes centred x 400 (x 365 to 435); sign bars x 470 to 620;
  the **box** (the secret, the "oracle") as one tall hand-drawn rect x 700 to 900, y 190 to 750,
  labelled "box" (56 px) on top; sign bars after the box x 960 to 1110; second H boxes x 1180;
  result bars x 1270 to 1400; meters x 1480; readout digits x 1640 to 1730 (80 px).


## Line by line

**0** "A box hides a secret string of bits, like one zero one. How many questions will it take?"
(0.4 to 5.7 s)
- Title block top left from t 0 (kit). Keep it to about 3.0 s, then `blurOut("#b-title", ...)`.
- At "box": a closed box draws centre, x 760 to 1160, y 420 to 720 (ink, 1.2 s), with a padlock.
- At "secret": three cards on its face write "? ? ?" (64 px).
- At "one zero one" (heard as digits, about 3.25 s): a small gold tag pops out of the box above
  it, "secret: 101" (56 px, gold), then slides back in, and the cards stay "? ? ?".
- At "How many questions": write "how many questions?" (56 px) under the box, y 790. Gold: the tag only.
- Leaves: box, cards and question blur out at the start of line 1.

**1** "Picture a wall of three switches, some secretly wired to a buzzer." (6.0 to 9.6 s)
- At "wall": switch wall panel draws (1.5 s). At "three switches": the three switches and their
  numbers draw in, 0.3 s apart.
- At "secretly wired": the dashed DIM wires from switches 1 and 3 draw toward the right, label
  "hidden wiring" writes. At "buzzer": bell and its sign plate draw.
- Gold: nothing yet.

**2** "The buzzer only tells you if an odd or even number of wired switches are on." (9.9 to 13.7 s)
- Just before "odd" (11.3 s): switches 1 and 2 flip on (levers up, 0.4 s). One wired switch is
  on, so the bell rings: gold sound arcs, sign writes "ODD" in gold.
- At "wired" (12.7 s; "odd" and "even" are only 0.4 s apart, so do not flip on "even"): switch 3
  flips on too. Two wired switches on: arcs fade, sign rewrites "EVEN" in ink (no ring).
- A small counter under the panel follows the on, wired switches: "wired + on: 1" then "2" (40 px).
- Leaves: counter and sign text fade at the start of line 3; all levers drop to off.
  ("on" is heard at the start of line 3's window; that is fine.)

**3** "Test them one at a time, and three switches take three questions." (14.0 to 17.4 s)
- At "one at a time": switch 1 alone flips on, bell rings gold, a gold "1" writes under switch 1's
  number row (y 760, 64 px); switch 1 off. Then switch 2: no ring, ink "0". Then switch 3: ring,
  gold "1". Each test about 0.7 s.
- At "three questions": a tally "questions: 3" writes at the right of the panel (56 px), each
  test adding a mark. The digits row reads 1 0 1.
- Leaves: wall, bell and digits slide left and shrink to a small corner sketch (scale 0.4,
  top left x 160 to 520, y 70 to 230), tally stays with it.

**4** "A quantum computer needs just one question." (17.7 to 20.2 s)
- Centre: write "3 questions" (ink, 72 px) at x 560, y 420 next to the small wall. At "one"
  (19.6 s): a hand-drawn strike through "3 questions" and "1 question" writes below it in gold
  (80 px). ("question" is heard in line 5's window; cue on "one".)
- Leaves: everything blurs out at the start of line 5, including the corner wall.

**5** "Each switch gets a qubit, a quantum bit, starting at zero." (20.5 to 23.7 s)
- At "switch": the three input wires draw left to right with their switch icons and numbers.
- At "qubit": label "qubit = quantum bit" writes at top right, x 1150, y 120 (48 px).
- At "zero": "|0⟩" writes at the start of each input wire (x 270 to 330), gold for a moment, then ink.

**6** "A step called an H gate makes it plus, an even blend of zero and one." (24.0 to 28.2 s)
- The "qubit = quantum bit" label fades at the line start.
- At "H gate" (heard as "Hgate", 25.0 s): the three first H boxes draw at x 400, and a small label
  "H gate = a quantum step" (44 px) writes at top right where the qubit label was.
- At "plus": the sign bars grow up on all three wires at x 470 to 620, with |+⟩ beside each.
- At "even blend": both bars of the top pair pulse gold once to show they are equal, then ink.
- Leaves: the "H gate = a quantum step" label fades at the end of the line.

**7** "An extra buzzer qubit is set to minus, the same blend with a minus sign. Then we ask once."
(28.5 to 34.2 s)
- At "extra buzzer qubit": the buzzer wire draws at y 690 with its bell icon and its own H box.
- At "minus": its sign bars draw, the "1" bar pointing down, label |−⟩. At "minus sign": the
  down bar flashes gold.
- At "ask" (33.6 s): the tall **box** draws across all four wires (1.2 s), "box" writes on top,
  and a gold "asked once" (48 px) writes above it at "once" (33.8 s).

**8** "Each wired switch kicks a minus sign back onto its own qubit, turning plus into minus."
(34.5 to 39.4 s)
- At "wired": inside the box, ink dots on wires 1 and 3 joined by short vertical lines to the
  buzzer wire (the hidden wiring, now as two connections). Wire 2 has none.
- At "kicks": two gold curved arrows draw from the buzzer wire up to wires 1 and 3, just right of
  the box (about 0.8 s each).
- At "turning plus into minus": the sign bars after the box draw for all three wires; on wires
  1 and 3 the "1" bar swings from up to down (onFrame, 0.8 s) and turns gold, labels read |−⟩
  in gold. Wire 2 stays |+⟩ in ink. Buzzer wire stays |−⟩ (unchanged).

**9** "That sign is called a phase, so this is phase kickback." (39.7 to 42.6 s)
- At "phase" (40.8 s): label "phase = a hidden sign" writes under the circuit, x 700, y 800 (48 px).
- At the second "phase" (41.9 s; "kickback" lands in line 10's window): label "phase kickback"
  writes in gold beside the curved arrows (56 px, x 1150, y 150). Gold: the arrows and the down bars.

**10** "Measure now, and plus and minus both give fifty fifty. The secret hides in the signs."
(42.9 to 47.8 s)
- At "Measure": three meter icons draw at x 1180 (where the second H will go later), and the
  "phase = a hidden sign" label fades.
- At "fifty fifty" (heard as "50 50", 45.1 s): next to each meter a digit flickers 0 and 1 at
  random (onFrame, seeded, about 6 changes per second) with "50/50" (44 px) under it. Same for
  |+⟩ and |−⟩ wires.
- At "secret hides": flicker stops, digits and "50/50" fade; a gold ring circles the two down bars
  ("signs" lands at 47.8 s, the line end).
- Leaves: meters blur out at the end of the line.

**11** "One more H on each qubit turns plus back into zero, and minus into one." (48.1 to 52.6 s)
- At "more" (48.5 s; "H on" is heard as "Hon"): the second H boxes draw on the three input wires
  at x 1180.
- At "plus back into zero": on wire 2, the two equal up bars slide together into one tall bar over
  "0" (onFrame merge, 0.8 s); label writes |0⟩.
- At "minus into one": on wires 1 and 3, the up and down bars merge into one tall bar over "1",
  gold; label |1⟩ in gold.

**12** "Measure, and we read one zero one, every time, from a single question." (52.9 to 56.8 s)
- At "Measure": meters draw at x 1480 on the three input wires.
- At "one zero one" (digits at 53.9, 54.2, 54.4 s): readout digits write 1, 0, 1 at x 1640 to
  1730 on wires 1, 2, 3 (80 px, 1 and 1 gold, 0 ink), each on its spoken word.
- At "every time": a gold bracket draws around the three digits with "s = 101" (64 px) beside it.
  The "asked once" above the box pulses gold at "single question".
- Leaves: the whole circuit blurs out at the start of line 13.

**13** "But the computer didn't secretly try every setting and collect the answers." (57.1 to 61.1 s)
- At "every setting": a grid of all eight switch settings writes centre, two rows of four cards
  (000 001 010 011 / 100 101 110 111, 56 px), x 420 to 1500, y 300 to 620, quickly (0.08 s apart).
- At "collect": a ledger-style tick column draws beside the cards, then a big ink X is drawn
  over the whole grid (0.5 s) at the line end ("answers" lands in line 14's window, 61.2 s).
  Nothing gold.
- Leaves: the X and tick column blur out; the eight cards stay for line 14.

**14** "It asked once, and interference, where possibilities add or cancel like ripples, left only the secret."
(61.4 to 67.2 s)
- At "interference": the eight cards drop to a baseline and each grows an equal ink bar above it
  (a bar chart of the eight readings you could get right after the box, one in eight each,
  height 120 px), x 420 to 1500, baseline y 640.
- At "ripples": two sets of hand-drawn ripples (three concentric arcs each) draw in DIM from two
  points above the chart, overlapping, to suggest waves meeting.
- From "add or cancel" through "left only": onFrame sched: seven bars shrink to zero while the
  "101" bar grows to 380 px and turns gold. Ripples fade as the bars settle.
- At "secret" (66.9 s): "only 101" writes in gold above the bar (64 px).
- Leaves: chart blurs out at the start of line 15.

**15** "Here's where the switch wall breaks. A real switch is only on or off, never plus."
(67.5 to 72.1 s)
- At "switch wall": one big toggle switch from the wall draws left of centre, x 500 to 760,
  y 300 to 700, with "on" and "off" (56 px) at its top and bottom.
- At "on or off": the lever snaps up then down (0.3 s each).
- At "never plus": a sign bar pair |+⟩ (scaled up, 100 px bars) draws at the right, x 1100 to
  1400, and a hand-drawn ink X crosses it. Small label "no real switch does this" (44 px).

**16** "It only works for an odd or even rule, which interference can unpick. Most rules aren't."
(72.4 to 77.3 s)
- Line 15's drawings blur out at the line start.
- At "odd or even rule": the bell with its "ODD / EVEN" sign draws at the left, x 420 to 760, with
  a gold tick beside it and "odd or even rule" (56 px, gold) under it.
- At "Most rules" (76.5 s): at the right, a lumpy box labelled "other rules" (56 px, ink) with a
  "?" on its face draws, x 1100 to 1440; an ink X draws over it at about 77.1 s ("aren't" lands
  in line 17's window, 77.3 s).
- Leaves: both blur out at the start of line 17.

**17** "That's Bernstein Vazirani: phase kickback on every input at once, so one question reveals the whole secret string."
(77.6 to 84.4 s, then the 2.6 s hold)
- Closing card, all inside x 200 to 1740, y 120 to 840:
  - At "Bernstein Vazirani": title "Bernstein-Vazirani" writes top centre, y 150 (72 px).
  - At "Phase kickback": a compact circuit draws (1.5 s): three input wires starting "|0⟩", then
    H, the tall box, H, meter; the buzzer wire simply starts at "|−⟩" and passes through the box.
    Wires y 300, 390, 480, buzzer y 580, x 300 to 1500. The two gold kickback arrows draw into
    wires 1 and 3 at "every input".
  - At "one question": "1 question" (56 px) writes above the box in gold.
  - At "whole secret string": the readout "1 0 1" writes in gold at the right end of the wires
    (90 px) and the closing line writes under the circuit, y 740: "one question → the whole
    secret" (64 px, ink with "whole secret" gold), underlined in gold.
- Everything stays on through the hold.

## Captions: phrase pairs to add in scene.mjs

```js
export const phrases = [
  ["one zero one", "101"],
  ["Bernstein Vazirani", "Bernstein-Vazirani"],
];
```
(Leave "plus", "minus", "H gate" and "phase" as words in the captions; the ket notation |+⟩,
|−⟩, |0⟩, |1⟩ appears only in the drawings, next to the spoken word. "fifty fifty" is built in.)

## Respellings for the voice

None needed. Every real word was heard; Bernstein Vazirani was heard correctly. The transcriber
writes "H gate" as "Hgate" (line 6) and "H on" as "Hon" (line 11), so use `cue(6, "Hgate")` or
`cue(6, "an")`, and `cue(11, "more")`. "one zero one" and "fifty fifty" are heard as digits
("1 0 1", "50 50"): cue them as digits. Avoid the symbol "×" in labels (not in the hand-drawn set).
Some line-final words are assigned to the next line by the transcriber ("on" in 2, "question" in
4, "kickback" in 9, "signs" in 10, "answers" in 13, "aren't" in 16; and line 16's first word "It"
lands in 15): cue the word before them instead, as the beats above do, and check the frames.
