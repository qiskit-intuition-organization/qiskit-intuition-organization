# Hand-off: Quantum Intuition, formerly Qiskit Intuition (2026-11-12)

Read this first if you are picking up from another account. For deeper detail on the video
pipeline, read `video-studio/HANDOFF.md` on the `video-lessons` branch (also merged into `main`).

## Where things stand
- Live site: https://qiskit-intuition-organization-phi.vercel.app (Vercel Hobby, 2 projects). **Every push to `main` deploys.**
- Repo: `qiskit-intuition-organization/qiskit-intuition-organization`, public (it has to be: Vercel Hobby can't deploy from a private org repo).
- Design: dark "Tomorrow Mensch / Quantum Economy", option A "White". Approved and live, with the brand box removed.
- **All 22 lessons have a hand-drawn explainer video on the live site** (16:9 and a phone 9:16 cut, 83 to 90 s each, Kokoro voice `bf_emma`).
  Last pushes: `a1f8277` (main: lessons 19, 21 and 22) and `aabe132` (video-lessons: handoff updated).
- Dhruv has reviewed all 22 lesson videos (01 to 07 approved earlier; 08 to 22 reviewed 2026-11-11, no fixes asked).
- **Lessons lead with the video** (live, `a8dcd76`): stage 0 shows the video and Try-it widget; the goals,
  analogy and intuition text fold into "Prefer to read?". Lessons without a video are unchanged.
- **Code walkthroughs on every "Code it" step** (live, `9913873`, approved): each chunk of the example gets one
  short line (max 16 words), an optional "Tell me more" fold and a sketch (arrow on the globe or odds bars).
  Content lives in `frontend/code_walkthroughs.py`; `tests/test_code_walkthroughs.py` checks the chunks cover
  every line of the example. Python basics are explained once, on lesson 1. Dhruv's direction: short and visual.
- **Analogy cards have a chalk sketch** (approved): a still cut from each lesson's own video, in
  `web/public/sketches/NN-id.webp` (840 px wide). `frontend/analogy_sketches.py` holds each file's alt text and size;
  `tests/test_analogy_sketches.py` checks every lesson has one and the sizes match. The cards still sit inside the
  folded "Prefer to read?" section; moving them below the Try-it widget was offered, not asked for yet.
  To recut one: grab a frame with ffmpeg, crop above the captions (y < 870), trim to the ink on the board colour
  RGB (27,29,33), resize to 840 wide, save WebP quality 88, then update the size in `analogy_sketches.py`.

- **Accounts on the live site**: the backend project (`-mhye`) has `AUTH_FRONTEND_URL` and a Turso
  database (`database-green-castle`, connected with prefix `TURSO_DATABASE`) and `AUTH_JWT_SECRET`.
  Sign-up and sign-in work live (Dhruv tested 2026-11-11, `f98ed36`). Resend (password-reset email) is not set up yet.

- **Security (2026-11-12)**: the code sandbox leaked backend env secrets through `.format()` templates. Fixed in
  `d62d2d3` (minimal worker env, `.format` blocked) and `AUTH_JWT_SECRET` was rotated. A daily cloud routine,
  "Daily security check - Qiskit Intuition" (6:00 am IST, connectors removed,
  https://claude.ai/code/routines/trig_01SUoyFYHHcbUZR9UJC5xvBF), reviews the repo and opens PRs only.

- **PR #21 merged and live (2026-11-12, `44db000`)**: the sandbox boundary now sits in the worker process
  (audit hook in `backend/core/sandbox_guard.py`, seccomp on Linux, minimal env, JSON results, more AST blocks;
  tests in `tests/test_sandbox_guard.py`). PR #20 closed as superseded. Checked on the live site after the merge:
  all 22 lesson examples run, the exercise checker works, and the `/proc/.../environ` read (numpy `DataSource`),
  `open()` and `.format()` are all refused.
  - **Still to do by Dhruv:** rotate `AUTH_JWT_SECRET`, create a new Turso token and paste it into
    `TURSO_DATABASE_TURSO_AUTH_TOKEN` (backend project `-mhye`), then redeploy the backend.
  - Known residual: name blocking is only a first filter; after an escape, code can still read files under
    Python/`sys.path`. Long-term: run learner code in a separate project with no secrets.

- **README** rewritten and fact-checked (`5fc9342`), screenshots in `docs/images/`.

- **Import browser notebook fix**: live since 2026-11-12 (Dhruv said push it; merged from `fix/import-notebook-button`). After sign-in the import
  offer never showed because `page.tsx` hid `NotebookSyncNotice` for quiet statuses. Now gated by
  `shouldShowSyncNotice` in `web/src/lib/notebook-sync.js`, with `web/tests/sync-notice.test.mjs`; full CI passed.

- **Certificates live (2026-11-12, `649f2be`, Dhruv approved the screenshots)**:
  - A pass counts only when a signed-in learner passes `/course/exercise` through the server checker. Passes are stored in the `course_exercise_passes` table; notebook progress never counts.
  - `backend/routers/certificate.py`: `GET /certificate/status`, `POST /certificate {name}` (one per user, ID `QE-QI-XXXX-XXXX`), and public `GET /certificate/verify/{id}`.
  - Web: `/certificate` (Dark/Light switch, PDF via browser print, LinkedIn, verify link) and `/verify/[id]`. Lessons open from `/?lesson=<id>`.
  - Frame rule `frame-ancestors 'self' https://thequantumeconomy.com https://*.thequantumeconomy.com` in `web/next.config.mjs`.
  - Design draft in `docs/certificate/`. Waiting on Anders: the signature PNG and his OK on the logo and wording.
  - Checked live as a guest. Not yet checked: a signed-in pass and issuing (Dhruv's own account).
- **Renamed to Quantum Intuition (2026-11-12, `b8c69fa`, Dhruv approved)** because Qiskit is IBM's trademark. Only the visible name changed:
  the storage key `qiskit-intuition-notebook-v1` and the JWT issuer/audience stay, so guests keep progress and nobody is signed out.
  The repo, Vercel projects and folders keep the old name. Anders was asked (Gmail draft) to rename his WordPress pages.
- **thequantumeconomy.com integration (2026-11-12)**: `learn.thequantumeconomy.com` is live (Anders added the CNAME; Dhruv added
  the domain to the `qiskit-intuition-organization` Vercel project; HTTPS OK). The backend trusts it via `COURSE_ORIGINS` in
  `backend/routers/auth.py` (`389f602`). Anders' pages: `/learn/` and `/quantumintuition/` (iframe; `/qiskitintuition/` redirects). Done by Anders: switch
  the iframe script to `var B="https://learn.thequantumeconomy.com"`, rename his pages to Quantum Intuition and use Dhruv's
  statement. Dhruv confirmed sign-in works inside the embedded page (2026-11-12).

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
.venv/bin/pytest tests -q                 # 468 passed, 3 skipped
cd web && npm test && npm run lint && npm run build   # 29 pass
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
1. ~~His review of lessons 08 to 22~~ Done.
2. ~~Trim the lesson text~~ Done: lessons lead with the video, and every lesson has a code walkthrough.
3. ~~Sketches in the analogy cards~~ Done. Open idea: show the card outside the "Prefer to read?" fold.
4. **Podcast clips.** On hold until outside approval comes in.
5. **Video kit fixes** (only matter if more videos are made; every builder worked around them):
   - `cue()` prefix-matches words and counts repeated words from the start of the line.
   - `timing.json` sometimes puts line-edge words in the next line.
   - `look.mjs --at` overwrites `review/`.
   - The caption fallback font is used for ⟩ and →.
   - In the handwritten Caveat font, 1 can look like a 7.
   - `draw()` in `kit/runtime.mjs` needs `autoRound: false` on the `strokeDashoffset` tween, or strokes jump on instead of drawing.
6. Housekeeping: untracked `.thumbnails/` and `.waveform-cache/` folders under `video-studio/lessons/*/project/` can be git-ignored.
