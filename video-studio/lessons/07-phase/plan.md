# Lesson 7, Phase: the hidden direction. Beat plan

One idea, one picture: **the qubit arrow drawn inside a hand-drawn globe**. Latitude (how far up or
down) sets the odds; longitude (which way it faces around) is the phase. The same globe carries the
whole film: it becomes the analogy (cities on one latitude line), then the experiment (Z, then H),
then the closing picture. Odds are always shown as two hand-drawn bars labelled 0 and 1.

## Fixed geometry (board 1920x1080, safe x 140..1780, y 60..860)
- **Big globe** (lines 1 to 9): centre (760, 470), radius 290 (spans y 180..760). Outline circle,
  equator as a flat ellipse (rx 290, ry 70), two ink meridians (thin ellipses rx 120 and rx 230,
  ry 290) and a dashed vertical axis. North pole label `0` at (760, 150), south pole `1` at (760, 800),
  both 56 px.
- **The arrow**: a gold arrow from the centre to the tip of a unit vector (polar angle th, phase ph),
  drawn every frame with `onFrame`. Projection: x = cx + R sin th cos ph,
  y = cy - R cos th + 0.24 R sin th sin ph (ph = 0 points RIGHT on screen, ph = pi points left,
  ph = pi/2 faces the viewer, ph = 3pi/2 is behind). This is load-bearing physics: H sends only the
  ph = 0 arrow (right) to the north pole and the ph = pi arrow (left) to the south pole. With the old
  mapping (ph = pi/2 on the right) the line 10 to 12 experiment would be false, since H leaves that
  arrow at fifty fifty.
  Back half of the trip around the ring is drawn at 50 percent opacity so "round the back" reads.
  A small gold dot on the tip, and a gold dashed ring (the arrow's line of latitude) when asked.
- **Odds bars**: at right, x 1300..1640, baseline y 700, max height 420. Two bars `0` and `1`,
  ink outline, gold hachure fill, heights cos^2(th/2) and sin^2(th/2), live from th. Percent
  labels above each (40 px). Small heading "odds" (44 px).
- **Gate box**: hand-drawn square 120x120 with the letter at 72 px, placed at (300, 300) left of the
  globe; the letter is gold only while that gate acts.

## Beats (line: what is said, what is drawn, on which word)

**0. "Here's a puzzle. Can a gate change a qubit but leave the odds of reading zero or one unchanged?"**
Title block holds (kit). Below it, centred at y 520: a qubit wire (ink line x 420..1500) with a
gate box `?` (gold `?`) drawn on "gate" (0.6 s). On "change" the `?` box wiggles. On "odds"
two small bar pairs labelled `0` and `1` draw left and right of the box (both 50/50); on "unchanged"
a gold `=` writes between them. Title blurs out at the start of line 1 (it has had about 4 s).

**1. "Picture the qubit as an arrow. Up always reads zero, down always reads one."**
Blur out the puzzle (0.25 s) at line start. On "arrow": the big globe outline and dashed axis draw
(1.2 s) and the gold arrow grows from the centre straight up. On "Up": label `0` writes at the north
pole, gold. On "down": the arrow swings down (0.9 s, power2.inOut); label `1` writes at the south
pole, gold, and `0` goes ink.

**2. "The odds depend only on how far up or down it points, like latitude on a globe."**
On "odds": the odds bars draw at right and follow the arrow. On "how far up or down" the arrow
tips from down to about 60 degrees from the top (th = pi/3) and back toward 2 pi/3, the bars moving
with it (this is the live "odds follow height" picture). On "latitude": the gold dashed latitude
ring at the tip's height draws (0.8 s). On "globe": equator ellipse and two meridians draw in ink,
turning the sphere into a globe.

**3. "Cities on one line of latitude are equally far north, however far east or west."**
The central analogy sketch. Arrow and bars fade to 0 at line start (the globe stays). On "Cities":
two hand-drawn city pins (little house shapes with a dot) pop onto the gold latitude ring, one front
left, one front right. On "equally far north": two ink height brackets from the equator up to each
pin, then a gold `=` between them (0.3 s). On "east or west": the right pin slides along the ring
around the back and returns (onFrame, 1.6 s) while its bracket keeps exactly the same height.

**4. "That's longitude. Our arrow has one too, the way it faces round the globe, called the phase."**
On "longitude": a gold meridian through each pin draws, and label `longitude` (56 px) writes along
the top right of the globe. On "arrow": pins and brackets blur out, the arrow fades back in at
th = pi/3, bars fade back in. On "faces round": the arrow tip travels once around its latitude
ring (onFrame, 2 s; back half dimmed), bars stay perfectly still. On "phase": a small curved gold
arrow around the vertical axis near the top writes in with the label `phase` (64 px, gold). The
word `longitude` goes ink.

**5. "The Z gate spins the arrow half way round its latitude, so the odds stay put."**
On "Z": gate box `Z` draws at (300, 300), letter gold. On "spins": the arrow turns ph to ph + pi
(1.2 s) leaving a gold trail arc along the ring; label `half turn` (44 px) writes by the arc.
On "odds stay put": a gold tick and label `same` write above the bars, which have not moved.

**6. "S turns it a quarter of the way, and T an eighth."**
Z box and `half turn` blur out. A row of three small top-down dials (seen from above the north pole:
circle radius 70, a pointer, a gold wedge for the turn) draws at y 470, centres x 1310, 1480,
1650 (all inside x 1780), in place of the bars (bars fade to 0.25 for this line, then return). Dial 1 `Z` shows a half wedge (already true, drawn with
the first word). On "quarter": dial `S` draws and its pointer sweeps 90 degrees; on "eighth": dial
`T` sweeps 45 degrees. Meanwhile the big arrow itself turns a quarter on "quarter" and an eighth on
"eighth" so the globe and dials agree. Labels `half`, `quarter`, `eighth` (40 px) under the dials.

**7. "Let's test it. Lay the arrow on the equator pointing right, and it's fifty fifty."**
Dials blur out at line start; bars return to full opacity. Latitude ring fades. On "equator": the
equator ellipse turns gold and the arrow moves to th = pi/2, ph = 0 (points right on screen,
0.9 s). On "fifty fifty": bars settle at 50/50 and a gold `50/50` (64 px) writes above them.

**8. "Apply Z, and it swings round to point left. Still fifty fifty."**
On "Z": the gate box `Z` returns at (300, 300), gold letter. On "swings round": the arrow travels
ph 0 to pi along the equator from right to left (1.2 s; it passes the front at ph = pi/2, so it is
never dimmed here), leaving a gold trail.
On "Still": a small gold tick next to `50/50`; bars do not move.

**9. "So did Z do nothing? The bars never moved, but the arrow turned."**
The misconception, said kindly. On "nothing": an ink thought bubble near the Z box writes
`did nothing?` (44 px). On "bars never moved": a loose ink circle draws round the bars. On "arrow
turned": the gold trail from line 8 redraws (0.6 s) and the bubble text is struck through in gold.

**10. "Now add an H gate. It tips the arrow up or down, depending on which way it faces."**
Scene change: everything blurs out at line start except the globe, which shrinks and slides left
(move to centre (520, 500), scale 0.62, 1.0 s) while a copy draws at (1400, 500). Above each, a
hand-drawn circuit wire at y 170: left `[H]` on a wire with heading `no Z`, right `[Z] then [H]` on a wire with heading
`with Z` (headings 48 px). Left arrow points right (ph = 0); right arrow points left (ph = pi, the result of Z). On
"H gate": both `H` boxes draw, letters gold. On "up or down": a faint dashed up arrow ghost on the
left globe and a down arrow ghost on the right.

**11. "Without the Z, it lands straight up, and reads zero every time."**
On "straight up": the left arrow tips from right to straight up (onFrame, 1.0 s, gold). Under the
left globe a mini bar pair (y 760..860) goes from 50/50 to 100/0. On "zero": label `always 0`
(56 px, gold) writes under it.

**12. "With the Z, it lands straight down, and reads one every time."**
On "straight down": the right arrow tips from left to straight down; its mini bars go to 0/100.
On "one": label `always 1` (56 px, gold) writes. The left side goes ink (no gold) so the eye moves.

**13. "Same odds before, opposite answers after. The phase was there all along."**
On "Same odds before": small `50/50 = 50/50` writes between the circuits at the top, ink. On
"opposite answers after": a gold double headed arrow draws between `always 0` and `always 1`. On
"phase": the right circuit's `Z` box glows gold.

**14. "Here the globe breaks. Maps print longitude, but no measurement reads phase directly."**
Blur out both globes and circuits. On "globe breaks": a hand-drawn map (rectangle 560x340 at left,
x 220..780, y 260..600) with a coastline squiggle and three meridians, each with a printed number
`0°`, `30°E`, `60°E` (40 px). On "longitude": the numbers go gold. On "measurement": at right, a small
globe with the arrow (no labels) draws (x 1100..1600); a label `phase: ?` (64 px) writes above it.
On "directly": a measuring meter icon (half dial, needle) by the globe shows only `0` or `1`, and a
gold cross draws over a dotted line from the meter to the `?`.

**15. "Only a later gate, like our H, turns phase into odds. That's called interference."**
The map blurs out. The right globe slides to centre (960, 470); its arrow points right (ph = 0,
on the equator). On "later gate": an `H` box draws in front of it on a short wire; on "odds": the
arrow tips to the north pole and the odds bars (beside it) move from 50/50 to 100/0 (0.9 s,
onFrame). On "interference": label `interference` (64 px, gold) writes under the
globe.

**16. "In the formula, theta tracks latitude, the odds, and phi tracks longitude, the phase."**
Clean board (blur out at line start). The formula writes on "formula", centred at y 420, 96 px,
about 1400 px wide: `|ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩`. On "theta": both θ get an ink
underline and a note below `θ: latitude, the odds` (48 px) writes. On "phi": φ gets a gold circle
and a note `φ: longitude, the phase` (48 px, gold) writes. The first note goes ink.

**17. "So phase is the arrow's longitude: invisible now, but it decides what happens later."**
Closing picture, held through the 2.6 s end. The formula shrinks and moves up to y 170 (64 px);
notes blur out. Left: a small globe (centre (560, 560), r 210) with its gold arrow slowly circling
its latitude ring (onFrame, continuous, so the frame is never still). Right, x 900..1720: on
"longitude" `Phase is the arrow's longitude.` writes (64 px, ink); on "invisible now" `invisible
now,` writes (60 px, ink); on "decides" `decisive later.` writes (72 px, gold) with a gold
underline. Stays to the end.

## Gold discipline
Gold is only: the arrow, the current latitude ring, the active gate letter, the answer label of
the moment (`50/50`, `always 0`, `always 1`, `interference`), the phase arc and, at the end, the
φ circle and `decisive later.` Everything else is ink. When a new gold thing arrives, the previous
one goes ink.

## Caption phrase pairs (spoken -> notation), in scene.mjs
```js
export const phrases = [
  ["phi", "φ"],
];
```
Built in already: theta -> θ, fifty fifty -> 50/50. Leave "Z gate", "S", "T", "H gate" as letters
(the voice reads them as letters; the transcriber hears them as "Zgate", which is fine).

## Respellings for the voice
None needed: every real word was heard in the last narrate run (letters were glued to the next
word, numbers were heard as digits, both expected).

## Cueing notes from the narrate run (84.4 s of voice, 18 lines, 259 words)
Every real word was heard. The transcriber glues single letters to the next word, so `cue()`
cannot find these; cue by a neighbour or by the line start plus an offset instead:
- line 5: "Z gate" heard as `Zgate` (cue "spins"); "half way" heard as `halfway`.
- line 6: `Sturns`, `Tan` (cue "quarter" and "eighth").
- lines 7, 8: "fifty fifty" heard as `50-50`.
- lines 8, 9, 11, 12: `Zand`, `Zdo`, `Zit` (cue "Apply", "nothing", "lands").
- line 10: `Hgate` (cue "add"). Line 15: `Hturns` (cue "phase" or "odds").
- Boundary drift in the per-line word lists: line 2's `globe`, line 3's `west`, line 13's `along`,
  line 12's `time` and the tail of line 17 (`but it decides what happens later`) landed outside
  their lines (the transcript has them). Cue those by the line's start plus an offset or by the
  line's end (line 17's `decides` sits about 2 s before that line ends); check with `look.mjs --at`.
- `phi`, `theta`, `interference`, `longitude`, `latitude` were heard as written.
