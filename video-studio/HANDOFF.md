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

## How Dhruv likes to work
- Keep answers short, with bullets.
- **Don't start work until he says go.** Answer or propose first, then wait.
- **Never use paid extra usage.** Work in small batches and check the plan's usage between batches.
  Stop at about 90% of the 5-hour limit and wait for the reset.
- Don't touch the rest of the repository. The app's design work on `main` belongs to someone else.
  Keep everything in `video-studio/` on this branch, and don't merge to `main` unless he asks.

## Status at hand-over (2026-11-08)
| Lessons | State | Next step |
|---|---|---|
| 01 to 13 (no 06) | Script and beat plan (`narration.json`, `plan.md`) written | Script review, build, visual QA |
| 14 to 21 | Draft `narration.json` only. The writer was stopped before `plan.md` | Script stage again, then the rest |
| 22 | Nothing yet | All stages |
| 06 | Done (pilot). Source in `pilot/`, finished MP4s on Dhruv's Mac in `~/Downloads/Qiskit Intuition - video pilot/Videos/` | None |

- No lesson has a `scene.mjs` yet.
- Voice files are not in git; `narrate.mjs` regenerates them in about a minute per lesson.
- Lessons 01 to 03 were in script review when work stopped, so their `narration.json` may be
  partly edited. Run the review again.

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
