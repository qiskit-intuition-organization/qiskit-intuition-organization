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

Run it in batches of about 3 lessons. Pass it the Workflow args below; set `scriptDone: true` to
skip the script stage for lessons 01 to 13.
```json
{ "studio": "<absolute path to video-studio>",
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
