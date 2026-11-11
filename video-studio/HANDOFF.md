# HANDOFF: Qiskit Intuition lesson videos (start here)

Branch `video-lessons`, folder `video-studio/`. This note is for a fresh Claude session that picks
up the work from another account. Read this file, then `KIT.md`.

## The goal
Dhruv wants one short hand-drawn explainer video (70 to 100 s) for **every one of the 22 lessons**,
each in 16:9 and as a phone cut, at the highest quality and as easy to understand as possible.
Lesson 6 (Rotations) is the approved pilot; all the others follow its style.

## What Dhruv has decided (do not re-ask)
- **Voice:** Emma (Kokoro `bf_emma`) for all lessons. It is the default in `kit/timing.mjs`; changing
  `DEFAULT_VOICE` there re-voices everything.
- **Script:** fluent, continuous and humane, like teaching a complete beginner, with no pauses.
  Captions, script and voice must match word for word.
- **Look:** hand-drawn rough.js: #e8e8e8 ink and gold #d9b463 on #17191c, Caveat labels and TASA
  Orbiter titles.
- **Punctuation:** no em dashes anywhere.
- **Hosting (2026-11-09): free, on our own Vercel site.** No YouTube and nothing paid.
  - Web copies of each MP4: H.264, `-crf 30 -preset slow -tune animation`, AAC 64 kb/s mono,
    `-movflags +faststart`. Lesson 01 went from 29 MB to 3.5 MB with no visible loss, so all 44
    cuts are roughly 150 MB. Vercel Hobby is free and never bills (about 100 GB a month of
    transfer, roughly 30,000 plays); check its current file and deployment limits before the
    first push.
  - Files go in `web/public/videos/` (both cuts plus a small poster JPG per lesson, and a list of
    which lessons have videos). A small export script in `kit/` should produce them.
  - Player: the browser's own `<video>` in a new `web/src/components/lesson-video.tsx`, at the top
    of each lesson ("Watch the 90-second explainer"), phone cut on narrow screens, loads only on
    play, shown only for lessons that have a video. Captions are already burned into the video.
  - The uncommitted design work in Dhruv's local `main` checkout also edits `web/src/app/page.tsx`,
    so the player keeps its change there to **one line**. Build it on its own branch cut from
    `origin/main` (never in that checkout), run all CI checks, and ship it by PR. Merging to `main`
    deploys. Dhruv asked to start this after the usage reset, so ask him before starting.
- **Merging this branch (2026-11-09):** when all 22 videos are done, open a PR from
  `video-lessons` to `main` and squash and merge it on GitHub. It only adds `video-studio/` (no
  Python, so CI is unaffected), so it merges cleanly. Renders and audio stay out of git.

## How Dhruv likes to work
- Keep answers short, with bullets.
- **Don't start work until he says go.** Answer or propose first, then wait.
- **Never use paid extra usage.** Work in small batches and check the plan's usage between batches.
  Stop at about 90% of the 5-hour limit and wait for the reset.
- Don't touch the rest of the repository. The app's design work on `main` belongs to someone else.
  Keep everything in `video-studio/` on this branch, and don't merge to `main` unless he asks.

## Status (updated 2026-11-09)
| Lessons | State | Next step |
|---|---|---|
| 01 to 05, 07 | Done: script reviewed, built, visual QA passed, rendered (78 to 90 s). Dhruv watched them and approved. On the live site since 2026-11-09 | None |
| 06 | Done (pilot). Source in `pilot/`, MP4s on Dhruv's Mac in `~/Downloads/Qiskit Intuition - video pilot/Videos/`. On the live site since 2026-11-09 | None |
| 08 to 17 | Done: script reviewed, built, visual QA passed, rendered (84 to 90 s), 2026-11-09. On the live site since 2026-11-09 | None |
| 18 to 21 | Draft `narration.json` only (no `plan.md`) | Script stage again, then review, build, visual QA. A full lesson costs about 25 to 30% of the 5-hour limit |
| 22 | Nothing yet | All stages |

- Renders of 01 to 05 and 07 are on Dhruv's Mac in `video-studio/Videos/16x9` and
  `Videos/Phone 9x16` (git-ignored). `node kit/render.mjs lessons/NN-id` remakes them.
- Voice files are not in git; `narrate.mjs` regenerates them in about a minute per lesson.
- Workflow notes from the builders: `kit/look.mjs` writes `contact-sheet-1.jpg`, `-2.jpg` and so
  on when there are more than 9 frames; `cue(line, word)` prefix-matches words longer than 3
  letters and words at line edges can land in the next line's word list, so check cue times.

## Putting finished videos on the site (live since 2026-11-09)
The player (`web/src/components/lesson-video.tsx`) sits at the top of each lesson's Intuition step and
shows only for lessons listed in `web/src/data/videos.json`. After rendering new lessons, run from
`video-studio/` in a checkout of `main`:
```bash
node kit/export-web.mjs ../web ~/Downloads/"Qiskit Intuition - video pilot/Videos"   # second dir = lesson 6 pilot
```
It writes `web/public/videos/NN-id.mp4`, `NN-id-phone.mp4` and `NN-id.jpg` (skipping ones already up
to date) and rewrites `videos.json`. Commit those, run the CI checks, push to `main`, and Vercel deploys.

## If usage runs out (Dhruv's rule)
Dhruv switches between Claude accounts when one runs out of usage. So:
- Check the plan's usage before each batch and when one ends. At about 85 to 90% of the 5-hour or
  weekly limit, start nothing new: commit and push this branch, and update this file.
- The workflow commits and pushes each lesson as soon as it passes visual QA, and adds a line to
  the progress log below. A lesson with **uncommitted** changes in its folder was cut off mid-way:
  start it again from its build stage (`scriptDone: true`) if the log says its script review is
  done, otherwise from script review.
- Never commit renders or audio (`project/assets/vo`, `review/`, `Videos/`).

## Progress log
Newest at the bottom. One line per lesson when it is committed.
- 2026-11-08: batch 1 (lessons 01 to 03) started. 02's script review is done and committed; 01
  and 03 were mid-review when the batch was restarted to add per-lesson commits.
- 2026-11-08: lesson 02-qubit: script reviewed and scene built, visual QA next. Build notes: {"seconds":80.418,"checkErrors":0,"knownIssues":["hyperframes check reports 2 lint warnings that every lesson gets (the board file is 335 lines, and the caption track has 48 elements). Layout, contrast, motion and runtime are all clean.","Captions show ⟩ and α in TASA Orbiter's fallback font, because the caption font has no such glyphs. This is the same for all lessons that use the plan's phrase p
- 2026-11-08: both batches stopped at the 5-hour limit. Saved on 2026-11-09:
  - 03-flip: script reviewed and scene built (78 s, 0 check errors). Visual QA next.
  - 01-why-quantum, 04-measurement, 07-phase: script reviewed. `scene.mjs` is a **partial** build,
    cut off mid-way. Next: build (continue from the partial scene), then visual QA.
  - 05-superposition: script reviewed. Next: build, then visual QA.
  - 02-qubit: visual QA next.
- 2026-11-09: lesson 03-flip: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":78.011,"remaining":["Minor, unchanged: on the X return turn in line 14 (trace C), the gold dashed tip trace runs a few px outside the circle's rim on the right. This comes from the oblique 3D projection and is hard to notice.","Minor, unchanged: the die under 'no chance' is small and its pips are mostly covered by the gold cross. The label carries the meaning.","Minor,
- 2026-11-09: lesson 01-why-quantum: script reviewed and scene built, visual QA next.
- 2026-11-09: lesson 02-qubit: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":80.418,"remaining":["Cosmetic only: the rough.js globe circle leaves a tiny stroke-start mark of about 3 px just left of the north pole (near x 666, y 200). It cannot be seen on the phone; changing the seed would move it and could make the circle less round.","Known and accepted, same as the builder's notes: the two common check warnings, the fallback caption font for (QA JSON truncated in the source instructions; full text not restored)
- 2026-11-09: lesson 04-measurement: script reviewed and scene built, visual QA next. Build notes: {"seconds":86.672,"checkErrors":0,"knownIssues":["hyperframes check reports 2 Craft line_unread warnings for the fresh qubit's '0'/'1' pole labels (#b-f-fq-l0/-l1, on screen 1.86 s before scene G clears them). These are not the film's last line, so they are false positives. Also flagged: composition_file_too_large and timeline_track_too_dense, which are expected for the kit's single board file and
- 2026-11-09: lesson 07-phase: script reviewed and scene built, visual QA next. Build notes: {"seconds":86.968,"checkErrors":0,"knownIssues":["Line 17's word timings in timing.json drift late. The scene cues 'longitude', 'invisible' and 'decides' at fixed times (80.45, 81.65, 82.85 s). I checked these against the voice track: the line runs 79.1 to 84.2 s, with a pause from 81.2 to 81.65 s.","Line 16: the gold circle round φ also takes in the superscript i and touches the e. It reads fine,
- 2026-11-09: lesson 04-measurement: visual QA done, ready to render. QA verdict: fixed (86.672 s). Remaining items are minor or known false positives. The two Craft line_unread warnings on the qubit pole labels are not the film's last line. The full QA JSON was truncated in the request, so it is not restored here.
- 2026-11-09: lesson 07-phase: visual QA done, ready to render. QA verdict: fixed (86.968 s). Remaining items are minor or known deviations: the φ circle touches the superscript i slightly, line 6 fades the odds bars out instead of dimming them to 0.25 (a known deviation from plan.md), and the Z, S and T turns are mirror-handed on screen. The full QA JSON was truncated in the request, so it is not restored here.
- 2026-11-09: lesson 05-superposition: script reviewed and scene built, visual QA next. Build notes: {"seconds":85.474,"checkErrors":0,"knownIssues":["hyperframes check gives 12 line_unread craft warnings. Eleven are for the tally digits in line 7, which drop in 0.1 s apart and leave with the board. One is for the coin's '1' face, which flickers on purpose while the coin spins. None of these are layout problems.","check also gives 2 lint warnings that every lesson gets from the kit: board.html is
- 2026-11-09: lesson 05-superposition: visual QA done, ready to render. QA verdict: fixed (85.474 s). Remaining items are minor or known: 12 line_unread craft warnings (tally digits and the coin face, by design), and the label 'random' writes about 1 to 2 s before its meter. The full QA JSON was truncated in the request, so it is not restored here.
- 2026-11-09: lesson 08-interference: script reviewed and scene built, visual QA next. Build notes: {"seconds":89.233,"checkErrors":0,"knownIssues":["hyperframes check gives the 2 lint warnings every lesson gets: the board file is 449 lines, and the caption track has 48 elements. Layout, contrast, motion and runtime are all clean.","Deviations from plan.md, all made for layout: the parked headphones icon sits at top left (about x 230, y 150), not top right, so it does not hit the 'chance' label.
- 2026-11-09: lesson 09-bases: script reviewed and scene built, visual QA next. Build notes: {"seconds":85.84,"checkErrors":0}. The full known-issues list was truncated in the request, so it is not restored here.
- 2026-11-09: lesson 10-registers: script reviewed and scene built, visual QA next. Build notes: {"seconds":86.373,"checkErrors":0,"knownIssues":["hyperframes check gives 40 line_unread warnings. All of them are for rolling drum digits in the line 10 lock (#b-l2w*), which flash past on purpose while the wheels spin. The other 2 warnings (composition_file_too_large, timeline_track_too_dense) are generic kit lint, not layout problems.","In Caveat at small sizes the digit 1 has a flag that can r... (remaining known-issues text truncated in the request, so it is not restored here)."]}
- 2026-11-09: lesson 08-interference: visual QA done, ready to render. QA verdict: fixed (89.233 s). Remaining items are minor or known: the 2 lint warnings every lesson gets, and a small diagram label that drops below 40 px for about 4 s when the diagram shrinks to 0.75 scale. The full QA JSON was truncated in the request, so it is not restored here.
- 2026-11-09: lesson 09-bases: visual QA done, ready to render. QA verdict: fixed (85.84 s). Remaining items are minor or known: a kit-level timing issue (in timing.json a line's last word can land in the next line's word list, so cue(4, 'half') resolves to line 3's word; the scene's timing still lines up), and one expected check item. The full QA JSON was truncated in the request, so it is not restored here.
- 2026-11-09: lesson 10-registers: visual QA done, ready to render. QA verdict: fixed (86.373 s). Remaining items are minor or known: 40 line_unread warnings on the rolling drum digits in the line 10 lock (by design), and 2 generic kit lint warnings. The full QA JSON was truncated in the request, so it is not restored here.
- 2026-11-09: lesson 11-entanglement: script reviewed. `scene.mjs` is a **partial** build, stopped at the 5-hour limit. Next: build (continue from the partial scene, `scriptDone: true, reviewDone: true`), then visual QA.
- 2026-11-09: lesson 11-entanglement: script reviewed and scene built, visual QA next. Build notes: {"seconds":88.417,"checkErrors":0,"knownIssues":["Scene 5: the circuit shrinks to 0.75, so its 'control'/'target' labels show at about 42 px and the small 'c t' tags are 42 px (about 28 px and lower on the phone). This was left on purpose because they are secondary context next to the big chips.","Scene 8: the shrunk chart's '00 01 10 11' labels show at about 40 px. 'half' and 'shots' were raised
- 2026-11-09: lesson 11-entanglement: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":88.417,"remaining":["Minor and accepted: in scene 5 the second gold dashed branch arrow, from the coin to the '10' chip, crosses the thin '00 -> 00' arrow. It still reads clearly on wide and phone.","Known and accepted by the builder: the scaled circuit's control/target labels and 'c t' tags, and the shrunk chart's '00 01 10 11', 'half' and 'shots' labels, show at a small size on purpose."]} (the rest of the QA JSON was truncated in the request, so it is not restored here).
- 2026-11-09: lesson 13-teleportation: script reviewed and scene built, visual QA next. Build notes: {"seconds":83.938,"checkErrors":0,"knownIssues":["hyperframes check gives a connector_orphan warning for #b-link at 23.3/32.6/42.0/51.3 s. It appears to be a false positive: the link's endpoints are the Bell-pair circles, which onFrame positions inside the same svg, and they are visible in every one of those frames","check gives line_unread warnings for the coin faces '0'/'1' (each face shows abou (the rest of the build notes were truncated in the request, so they are not restored here)."
- 2026-11-09: lesson 12-no-cloning: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":83.98,"remaining":["Kit note, not blocking: in timing.json the per-line word lists sometimes include the last word of the previous line, and word starts can sit up to about 0.4 s before the line's own start (for example 'binds' at 27.83 s against a line 6 start of 28.03 s). Cues that rely on those words may come up to about 0.4 s early. Nothing looked visibly out of sync."]}
- 2026-11-09: lesson 13-teleportation: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":83.938,"remaining":["Not a problem, noted only: hyperframes check still gives the connector_orphan warning for #b-link at 23.3/32.6/42.0/51.3 s. It is a false positive: the Bell-pair circles at each end are on stage in all four frames","Not a problem, noted only: check gives line_unread warnings for the flipping coin face '1' (intended) and for the crawling '10' in lin
- 2026-11-09: lesson 14-superdense: script reviewed and scene built, visual QA next. Build notes: {"seconds":84.602,"checkErrors":0,"knownIssues":["hyperframes check gives a layout warning, connector_orphan, on #b-link at 23.5, 32.9, 42.3 and 51.7 s. The frames show both qubit balls on stage at those times, and moving the link ends onto the circle edges did not clear it. I believe it is a false positive from how the checker finds endpoints on hollow rough.js circles.","hyperframes check gives ... (the rest of the build notes were truncated in the request, so they are not restored here)."]}
- 2026-11-09: lesson 14-superdense: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":84.602}. Known false positives, not blocking: hyperframes check still gives connector_orphan on #b-link at 23.5, 32.9, 42.3 and 51.7 s (both qubit balls are on stage in those frames), and line_unread on #b-c1v0 (the "0" face of the bit card that flips).
- 2026-11-09: lesson 15-deutsch: script reviewed and scene built, visual QA next. Build notes: {"seconds":90.144,"checkErrors":0,"knownIssues":["Lines 6 and 7: the circuit is kept at 12 percent behind the big minus card for context, so a faint outline of the box and its '?' shows behind the card's centre until 'still', when the circuit fades out completely.","Line 9: once the input's arrow on 1 turns over, its tip just touches the sealed box's top edge (the rest of the build notes were truncated in the request, so they are not restored here)."]}
- 2026-11-09: lesson 16-bernstein-vazirani: script reviewed and scene built, visual QA next. Build notes: {"seconds":86.969,"checkErrors":0,"knownIssues":["hyperframes check gives 0 errors but 3 warnings. Two are lint warnings that come from the kit: board.html is 304 lines, and the captions track has 47 elements. The third, a craft 'line_unread' warning, wrongly takes the gold '101' card label (#b-ctg, line 14) for the film's last line. All three were left as they are.","The corner miniature of the s
- 2026-11-09: lesson 15-deutsch: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":90.144,"remaining":["hyperframes check craft warning 'line_unread' still flags the moving '−1' token (#b-tokl, 45.8 s) as the film's last line. This is a false positive in the kit rule. The real closing takeaway holds through the end.","Lint warnings composition_file_too_large and timeline_track_too_dense are expected for this kit (large board file, dense captions).","
- 2026-11-09: lesson 16-bernstein-vazirani: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":86.969,"remaining":["hyperframes check: 0 errors and 3 warnings. Two are lint warnings from the kit (board.html is 304 lines, and the captions track has 47 elements). The third is the craft 'line_unread' warning, which wrongly takes the gold '101' card label (#b-ctg) for the film's last line. None of the three needs a fix.","A short 0.4 s blank breath remains at about
- 2026-11-09: lesson 17-grover: script reviewed and scene built, visual QA next. Build notes: {"seconds":86.925,"checkErrors":0,"knownIssues":["The swing is drawn side-on (one A-frame with the pivot at the top), not the front-view A-frame that plan.md describes, because from the front a swing cannot be seen moving sideways. hyperframes check reports two rotation-pivot warnings on #b-sw2-rot. The swing is meant to turn about its top pivot, so these are expected.","On phone the sixteen-bar p... (the rest of the build notes were truncated in the request, so they are not restored here)."]}
- 2026-11-09: lesson 17-grover: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":86.925}. Remaining items are minor and were already listed by the builder, so they were accepted: the |0> labels and the amplitude/chance headers sit at the left edge of the safe area (about x 140 to 160), close to the phone edge but not cut off; the sixteen-bar panel is small on phone; hyperframes check gives 2 expected rotation-pivot warnings on #b-sw2-rot. The full QA JSON was truncated in the request, so it is not restored here.
- 2026-11-10: lesson 18-qft: script reviewed and scene built, visual QA next. Build notes: {"seconds":87.736,"checkErrors":0,"knownIssues":["Changed one beat in line 13: the plan has the tally boxes and eye fade to 0.3 on 'plenty' and puts 'one hidden rhythm' between the boxes and the bars, but there is no room there next to the rays on bar 2, so the tally row and eye blur out on 'plenty' and the label writes where the tally row was","The cancel '0' sits at the lower right of the centre (the rest of the build notes were truncated in the request, so they are not restored here).
- 2026-11-10: lesson 18-qft: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":87.736,"remaining":["Not a defect: the two hyperframes check warnings (composition_file_too_large at 421 lines, timeline_track_too_dense at 48 items) come from how the kit builds every lesson.","Minor: on the phone, 'length sets the chance' (line 10) ends at x 1778, just inside the safe area, so it sits close to the right edge. It was left as is.","Minor: around 78.3 s
- 2026-11-10: lesson 20-hardware: visual QA done, ready to render. QA: {"verdict":"fixed","seconds":88.864,"remaining":["Minor and left as is: in line 8 the arrow briefly shrinks to 0.9 to show 'keeps one minus lambda'. The live bars then read 95% and 5%, the same numbers the ten-gate case shows in line 9. This is consistent with the arrow and not wrong physics.","Kit bug, reported and not fixed because kit/ is off limits: kit/build.mjs puts a filter with id b-noise
- 2026-11-11: lesson 19-phase-estimation: script reviewed and scene built, visual QA next. Build notes: {"seconds":87.907,"checkErrors":0,"knownIssues":["The hyperframes Craft check warns line_unread on the line-2 tick label (#b-tk2). This is a false positive: it treats a short-lived rim label as the film closing line. The real closing card holds to the end.","Lint warns that board.html is long (346 lines) and the caption track is dense (52 captions). Every lesson built with this kit has these warnings."]}

## First-time setup (macOS, from the repo root)
```bash
git fetch origin && git switch video-lessons
cd video-studio
(cd kit && npm install)                      # rough.js
python3 -m venv kit/.venv && kit/.venv/bin/pip install kokoro-onnx soundfile   # Kokoro voice
node kit/new.mjs                             # lesson project folders and symlinks
```
You also need ffmpeg and Node 18 or newer. `npx hyperframes` (0.9.x) installs itself on first use;
it handles voice (`tts`), transcription (`transcribe`), `check`, `snapshot` and `render`.

Test it with one lesson:
```bash
node kit/narrate.mjs lessons/01-why-quantum
```

## How each lesson is made
`workflow/lesson-workflow.js` is a Claude Code Workflow script that runs four agents per lesson:
1. **Script:** writes `narration.json` and `plan.md`, and voices them to check the length.
2. **Script review:** an independent reviewer checks the physics, beginner clarity and fluency,
   and fixes them in place.
3. **Build:** writes `scene.mjs`, builds, checks and snapshots, with at least three rounds of
   looking and fixing.
4. **Visual QA:** fresh eyes on every frame, fixed in place; a second round if needed.
5. **Save:** after the build and again after QA, a small agent commits that lesson's source files,
   adds a line to the progress log above and pushes `video-lessons`.

Pass it the Workflow args below. It runs `parallel` lessons at a time (default 3) in the order
given, so each lesson finishes before the next starts. Per-lesson flags pick up where an earlier
run stopped (read the progress log above): `scriptDone: true` skips the script stage,
`reviewDone: true` skips script review, `buildDone: true` skips the build (add `buildNotes` with
the builder's known issues if you have them). A partial `scene.mjs` is finished, not restarted. If the Workflow tool won't load the file by path,
paste its contents inline as the `script` input.
```json
{ "studio": "<absolute path to video-studio>", "date": "YYYY-MM-DD",
  "lessons": [ { "dir": "01-why-quantum", "id": "why-quantum", "number": 1, "title": "Why quantum computers?", "scriptDone": true } ] }
```
`dir`, `id`, `number` and `title` for every lesson come from `course.json`; the folder is
`NN-id`. Without the workflow tool, do the same four steps by hand, following the prompts in that
file.

When a batch is done, render it and look at the result:
```bash
node kit/render.mjs lessons/01-why-quantum     # both cuts into video-studio/Videos/ (git-ignored)
```
Commit the source files (`narration.json`, `plan.md`, `scene.mjs`) to this branch after each batch.
Never commit renders or audio.

## Map
- `KIT.md`: the authoring guide covering brief, script rules, layout safe area, scene API and commands.
- `course.json`: the lesson text, a snapshot of `web/src/data/course.json`.
- `kit/`: the shared tools: `narrate`, `build`, `look`, `render`, `new`, plus the drawing kit, glyphs,
  captions and timing.
- `lessons/NN-id/`: one folder per lesson.
- `pilot/`: lesson 6's generator, script and reference frames, the quality bar.
- `workflow/lesson-workflow.js`: the four-stage process.
