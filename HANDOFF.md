# Hand-off: Qiskit Intuition (2026-11-11)

Read this first if you are picking up from another account. For deeper detail on the video
pipeline, read `video-studio/HANDOFF.md` on the `video-lessons` branch (also merged into `main`).

## Where things stand
- Live site: https://qiskit-intuition-organization-phi.vercel.app (Vercel Hobby, 2 projects). **Every push to `main` deploys.**
- Repo: `qiskit-intuition-organization/qiskit-intuition-organization`, public (it has to be: Vercel Hobby can't deploy from a private org repo).
- Design: dark "Tomorrow Mensch / Quantum Economy", option A "White". Approved and live, with the brand box removed.
- **All 22 lessons have a hand-drawn explainer video on the live site** (16:9 and a phone 9:16 cut, 83 to 90 s each, Kokoro voice `bf_emma`).
  Last pushes: `a1f8277` (main: lessons 19, 21 and 22) and `aabe132` (video-lessons: handoff updated).
- Dhruv watched and approved lessons 01 to 07. **Lessons 08 to 22 are live but he hasn't watched them yet.**

## Rules Dhruv set (follow every one)
1. **Never use paid extra usage.** Not under any circumstances.
   - Before every batch, check both the 5-hour **and the weekly** limit (`mcp__ccd_session_mgmt__get_usage`).
   - A lesson costs about 20% of the 5-hour window and about 4% of the weekly limit.
   - Extra usage `spent` stood at $20.87 on 2026-11-11 (it went over once, by accident). If it rises at all, stop all work immediately.
2. **Tell him first, work on his go.** For a question or decision, answer and propose next steps, then wait.
3. **Approval before design changes go live.** Show sharp screenshots of the real local build (laptop and phone) and wait for an explicit "approved". "I like it" is not approval.
4. Short answers with bullets. No em dashes in video scripts. Never commit or paste secrets or tokens.
5. Direction: **visual, not texty.** Favour pictures and video over prose.

## Folders and git
- Main checkout: `~/Documents/qiskit-intuition-organization` (branch `main`).
- Video worktree: `~/Documents/qiskit-intuition-video-lessons` (branch `video-lessons`, folder `video-studio/`).
- Lesson 06 pilot MP4s live in `~/Downloads/Qiskit Intuition - video pilot/Videos`.
- Commit as Dhruv:
  `git -c user.name="Dhruv Sachdeva" -c user.email="109058006+LuCiFeR041205@users.noreply.github.com" commit ...`
  (the default git identity uses a personal email, don't use it).
- `web/src/data/videos.json` is caught by the `data/` rule in `.gitignore`: always `git add -f` it, or the Vercel build breaks.

## Checks to run before every push to main
```bash
.venv/bin/python scripts/export_course.py --check
.venv/bin/ruff check .
.venv/bin/pytest tests -q                 # 228 passed, 1 skipped
cd web && npm test && npm run lint && npm run build   # 16 pass
```
`web/` is Next.js 16: read `web/AGENTS.md` before changing it, because this version has breaking changes.
After pushing, confirm that both Vercel statuses on the commit say `success`.

## How a lesson video gets onto the site
1. In `video-studio/`, render both cuts: `node kit/render.mjs lessons/NN-id` (output in `video-studio/Videos/`, git-ignored).
2. Make the small web copies, posters and `videos.json`:
   `node kit/export-web.mjs ~/Documents/qiskit-intuition-organization/web ~/Downloads/"Qiskit Intuition - video pilot/Videos"`
3. In the main checkout:
   - `git merge --no-ff origin/video-lessons`
   - `git add web/public/videos`, then `git add -f web/src/data/videos.json`
   - Commit, run the checks, push.
4. The player is `web/src/components/lesson-video.tsx`. It sits at the top of stage 0 of each lesson in `web/src/app/page.tsx`.

The multi-agent pipeline (script, review, build, visual QA, save) is `video-studio/workflow/lesson-workflow.js`.
It is only needed if a video is remade.

## What's left (ask Dhruv which to start)
1. **His review of lessons 08 to 22.** Fix and re-publish any he flags.
2. **Trim the lesson text** so pages lead with the video. Cut what the video already says. Show before and after screenshots, then wait for approval before pushing.
3. **Sketches in the analogy cards.** Small hand-drawn pictures in the video style (rough.js look, ink #e8e8e8, gold #d9b463, on #17191c).
4. **Podcast clips.** On hold until outside approval comes in.
5. **Video kit fixes** (only matter if more videos are made; every builder worked around them):
   - `cue()` prefix-matches words and counts repeated words from the start of the line.
   - `timing.json` sometimes puts line-edge words in the next line.
   - `look.mjs --at` overwrites `review/`.
   - The caption fallback font is used for ⟩ and →.
   - In the handwritten Caveat font, 1 can look like a 7.
   - `draw()` in `kit/runtime.mjs` needs `autoRound: false` on the `strokeDashoffset` tween, or strokes jump on instead of drawing.
6. Housekeeping: untracked `.thumbnails/` and `.waveform-cache/` folders under `video-studio/lessons/*/project/` can be git-ignored.
