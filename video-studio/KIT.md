# Qiskit Intuition lesson videos: how to make one

One short hand-drawn explainer per lesson (about 70 to 100 s), in 16:9 and a phone cut, voiced by Emma
(Kokoro `bf_emma`). Lesson 6 (Rotations) is the approved pilot, so match its style and quality.

## Who it is for, and what the client asked for
- A **complete beginner**. Assume no maths beyond school and no physics at all.
- The script must be **fluent, continuous and humane**: one warm teacher talking, with each sentence
  leading into the next. No pauses, no lists read aloud, no textbook phrasing.
- **Captions, script and voice match word for word.** Captions are generated from the script, so
  just write good spoken English.
- Hand-drawn look: #e8e8e8 ink and gold #d9b463 on #17191c, Caveat handwriting, TASA Orbiter titles.
- **No em dashes or en dashes anywhere.** The build fails on them.

## Look at the pilot first
- Pilot storyboard: `pilot/reference/storyboard.jpg`.
- Pilot frames with Emma: `pilot/reference/emma-frames-1.jpg` and `emma-frames-2.jpg`.
- Pilot script: `pilot/tools/narration.json`. Pilot drawings: `pilot/tools/build.mjs`.
  The bulbs, the light switch, the dimmer knob and the live chart show the bar for detail.

## Your files (only these two; never edit kit/)
`lessons/NN-id/narration.json`:
```json
{ "lines": [ { "say": "Let's start with a small goal." }, { "say": "..." } ] }
```
`lessons/NN-id/scene.mjs`: see the API below.

The lesson text is in `course.json` (summary, intuition, analogy with picture/captures/breaks,
misconception, explanation, takeaway, key_ideas). The video teaches that lesson's analogy and
idea, and must never contradict it.

## Writing the script
- **Length:** 14 to 22 lines, 170 to 260 words, which comes to about 70 to 100 s with Emma.
- **Lines:** one line is one or two sentences of 6 to 24 words. A line is also a sync unit:
  drawings are cued to its words.
- **Shape:**
  1. A hook: a concrete goal or question in plain words.
  2. The analogy from course.json, drawn.
  3. The real idea, shown moving.
  4. Where the analogy breaks, or the common misconception, said kindly.
  5. A one-sentence takeaway; show the lesson's formula or circuit if it has one.
- **Voice:** "you" and "we", contractions, short words, and concrete numbers ("half the time",
  "one time in four").
- **Jargon:** define each technical word the first time it appears, in the same breath. Show a
  symbol only after saying what it means.
- **Saying maths:** write it the way it is said: "theta", "pi over two", "ket zero", "C NOT",
  "fifty fifty", "sine squared of theta over two". Numbers go in words ("thirty five percent").
- **Notation in captions:** captions turn speech into notation using phrase pairs. The built-in
  pairs are in `kit/captions.mjs` (theta to θ, pi over two to π/2, R Y to RY, C NOT to CNOT,
  fifty fifty to 50/50 and more). Add the lesson's own with `export const phrases = [["ket zero", "|0⟩"], ...]`
  in scene.mjs. Use notation only where a beginner benefits; otherwise leave the words.
- **Names Kokoro may mangle:** Qiskit, Hadamard, Grover, Deutsch, Vazirani, Fourier and so on.
  `narrate.mjs` prints which words the transcriber did not hear. If a real word is missing,
  respell it for the voice (for example "Kiss kit") and add a phrase pair so the caption shows
  the right spelling: `["Kiss kit", "Qiskit"]`. Digits heard for number words are fine.
- **Physics must be exactly right.** Say less rather than say something false. Avoid "it's both 0
  and 1 at once" and "it tries every answer in parallel" unless you immediately correct them.

## Layout (board is 1920x1080; the phone shows it scaled to 0.6585)
- **Safe area:** x 140 to 1780 and y 60 to 860. Below about y 880 sit the 16:9 captions. Outside
  x 140 to 1780 is cut off on the phone.
- **Title block:** the kit draws it at top left (x 192 to about 1500, y 118 to 260). Keep it at
  least 2.5 s, then `blurOut("#b-title", t)` before you draw anything into that area.
- **Text sizes:** labels at least 40 px (they show at 26 px on the phone); key labels 56 to 80 px;
  a closing formula 90 to 140 px.
- **Focus:** one main object at a time, big and centred. Gold is only for the thing that matters
  right now: the lit bulb, the answer, the moving pointer. Everything else is ink.
- **Clean up:** fade or blur out what the voice has finished with before the next idea arrives.
  Never stack two scenes.
- Leave nothing on screen unexplained, and say nothing that is not on screen.
- **Never static:** no frame should sit still for more than about 5 s. Something draws, writes,
  moves or lights up.

## Motion (all seek-safe: every animation is placed on the one timeline `tl`)
- **Strokes** draw on with `draw()`: 0.3 s for a tick, 1 to 2.5 s for a big object.
- **Labels** write in left to right with `write()`, at about 0.06 s per character, between 0.15 and 1 s.
- **Moves** take 0.6 to 1.2 s with `power2.inOut`. A scene change blurs out what is leaving (0.25 s).
- **Sync:** time things to the word that names them, with `cue(line, "word")`. Start a drawing
  0 to 0.3 s before its word, and never more than 0.5 s after it.
- **Continuous values** (a dial, a needle, a probability bar, a counter, a sweeping wave, a
  rotating arrow) use `onFrame((t) => ...)` with `sched()`, like the pilot's knob and chart.
- **End:** the last line's picture (a takeaway card, formula or circuit) stays on screen until
  the end, through the 2.6 s hold.

## scene.mjs API
```js
export const phrases = [["ket zero", "|0⟩"]];        // optional: spoken -> caption
export default function scene(k) {
  const { r, pen, goldPen, arrow, wobbly, lbl, hand, cue, lines, TOTAL, INK, GOLD, GROUND, DIM, lesson } = k;
  const html = `...`;   // board content (positioned .obj divs with <svg class="sk"> and labels)
  const script = `...`; // timeline code, with times computed at build time: ${cue(3, "switch")}
  return { html, script, css: "" };   // css optional, scope it under #root or your ids
}
```
Build time (Node), from `k`:
- `r.line / rect / circle / ellipse / curve / poly / linear / arc / path (..., pen(opts))` return
  rough.js SVG; for example `r.rect(x, y, w, h, pen({ strokeWidth: 2.6 }))`. Leaving out the pen
  gives an ink pen. `goldPen()` gives a gold pen. Fill with
  `pen({ fill: GOLD, fillStyle: "hachure", hachureGap: 9, fillWeight: 2 })` or `fillStyle: "solid"`.
- `arrow(x1, y1, x2, y2, penOpts, headSize)`: a hand-drawn arrow.
- `wobbly(points, amp, seed)` returns `{ d, frac }`: a stroke with a known length, for traces that
  follow a value (see the pilot's `b-trace`).
- `lbl(id, x, y, w, size, html, extraCss)`: a handwritten label. Use `text-align:left` in
  extraCss when needed, and `color:${GOLD}` for gold. The text may contain θ π ψ φ α β ω Σ ⊗ | ⟨ ⟩ √ → ≈,
  which are drawn by hand. For any other symbol, draw it yourself as a small inline SVG path in the label.
- `cue(line, word?, nth = 0, offset = 0)`: the time in seconds when that word is spoken. `line`
  counts from 0. With no word you get the line's start. `lines[i]` is `{ text, start, end, dur, words }`.
  `TOTAL` is the film length.

Runtime (inside `script`):
- `draw(sel, start, dur)`
- `write(sel, start, dur)`, and `rewrite(...)` to write a label again after it faded out
- `fade(sel, toOpacity, start, dur = 0.35)`
- `hide(sel)`: hidden from t = 0
- `show(sel, start)`
- `blurOut(sel, start)`
- `move(sel, fromVars, toVars, start, dur = 0.8, ease)`
- `tl.to / tl.fromTo / tl.set` (GSAP)
- `$(id)`, `all(sel)`
- `onFrame(fn)`
- `sched([[start, end, from, to], ...], t)`
- `ease.inOut(u)`

`sel` may be a CSS selector or an array of them.

How the timeline behaves:
- Ids must start with `b-` and be unique.
- Groups to draw are `<g id="b-...">` holding rough paths. A group drawn with `draw()` stays
  hidden until its start.
- Labels written with `write()` stay hidden until their start.
- Anything you only want to `fade()` in must be hidden first with `hide()`.

## Commands (run from video-studio/; first-time setup is in HANDOFF.md)
```
node kit/narrate.mjs lessons/NN-id     # voice it (about 1 minute); re-run after any script change
node kit/build.mjs lessons/NN-id       # build both cuts (seconds)
(cd lessons/NN-id/project && npx hyperframes check)   # 0 errors; fix real layout warnings (overlap, off-canvas,
                                                      # unreadable text). Dense captions and rotation pivot notes are expected.
node kit/look.mjs lessons/NN-id        # a frame at the end of every line, 16:9 and phone
node kit/look.mjs lessons/NN-id --at 12.4,13.1   # exact moments
```
Then read `review/wide/contact-sheet.jpg` and `review/phone/contact-sheet.jpg`, and open single
frames to check detail. Do not render MP4s; that happens at the end for all lessons.
