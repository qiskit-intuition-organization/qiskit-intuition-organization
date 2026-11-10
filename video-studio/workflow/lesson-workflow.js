export const meta = {
  name: 'qiskit-lesson-videos',
  description: 'Script, review, build and visually check 21 hand-drawn lesson explainers with the shared kit',
  phases: [
    { title: 'Script', detail: 'write narration.json and plan.md per lesson' },
    { title: 'Script review', detail: 'independent check of accuracy, clarity and fluency' },
    { title: 'Build', detail: 'voice, draw and animate the scene' },
    { title: 'Visual QA', detail: 'fresh eyes on every frame, fix in place' },
    { title: 'Save', detail: 'commit and push each lesson to video-lessons', model: 'haiku' },
  ],
}

// Pass { studio: "<absolute path to video-studio>", date: "YYYY-MM-DD", parallel: 3, stagger: false, lessons: [...] } as the Workflow args.
const STUDIO = args.studio

const ctx = (L) => `You are making one short hand-drawn explainer video for lesson ${L.number} of the Qiskit Intuition course: "${L.title}" (lesson id "${L.id}").
Studio folder: ${STUDIO}
Your lesson folder: ${STUDIO}/lessons/${L.dir}
Read ${STUDIO}/KIT.md in full before doing anything: it holds the client's brief, the style, the script rules, the layout safe area, the scene API and the commands. The lesson's own text is in ${STUDIO}/course.json (find the lesson with id "${L.id}"; read summary, intuition, analogy, misconception, explanation, equation, takeaway, key_ideas).
Rules: work only inside your lesson folder. Never edit ${STUDIO}/kit/, ${STUDIO}/pilot/, other lessons, or anything in the repository outside video-studio/. Do not render MP4s. Do not git commit or push. Run commands from ${STUDIO}. Other agents are building other lessons at the same time, so stay in your folder. If the kit itself has a bug that blocks you, work around it in your scene and report it.`

const SCRIPT_SCHEMA = { type: 'object', properties: {
  lines: { type: 'number' }, words: { type: 'number' }, seconds: { type: 'number' },
  hook: { type: 'string' }, summary: { type: 'string' } }, required: ['lines', 'words', 'seconds', 'summary'] }
const REVIEW_SCHEMA = { type: 'object', properties: {
  verdict: { type: 'string', enum: ['approved', 'revised'] },
  changes: { type: 'array', items: { type: 'string' } }, seconds: { type: 'number' } }, required: ['verdict', 'changes'] }
const BUILD_SCHEMA = { type: 'object', properties: {
  seconds: { type: 'number' }, checkErrors: { type: 'number' }, lookRounds: { type: 'number' },
  scenes: { type: 'array', items: { type: 'string' } }, knownIssues: { type: 'array', items: { type: 'string' } },
  kitProblems: { type: 'array', items: { type: 'string' } } }, required: ['seconds', 'checkErrors', 'knownIssues'] }
const QA_SCHEMA = { type: 'object', properties: {
  verdict: { type: 'string', enum: ['pass', 'fixed', 'needs_work'] },
  fixed: { type: 'array', items: { type: 'string' } }, remaining: { type: 'array', items: { type: 'string' } },
  seconds: { type: 'number' }, checkErrors: { type: 'number' } }, required: ['verdict', 'fixed', 'remaining'] }

const scriptPrompt = (L) => `${ctx(L)}

YOUR JOB: write the narration script and a beat plan. Do not write scene.mjs yet. If narration.json already exists in your lesson folder it is an unreviewed first draft: read it, keep what is good, and rewrite freely where it falls short.
1. Study the lesson text, and the pilot's script (${STUDIO}/pilot/tools/narration.json) and storyboard (${STUDIO}/pilot/reference/storyboard.jpg) for tone and pacing.
2. Write ${STUDIO}/lessons/${L.dir}/narration.json following every script rule in KIT.md: complete beginner, fluent and continuous, warm, the lesson's analogy, where it breaks, a one-sentence takeaway, 14 to 22 lines, 170 to 260 words, no dashes, maths spelled as spoken. Physics must be exactly right.
3. Write ${STUDIO}/lessons/${L.dir}/plan.md: for each line (numbered from 0), what is on screen, which drawing appears on which spoken word, what is gold, what leaves. Design visuals a beginner understands at a glance; plan a strong central sketch for the analogy and a moving picture of the real idea (dials, arrows, bars, coins, waves, circuits drawn by hand), plus the closing picture. Keep everything in the safe area. Also list caption phrase pairs to add (spoken -> notation) and any respellings for the voice.
4. Run node kit/narrate.mjs lessons/${L.dir} to hear it: check the length lands at 70 to 100 s and that no real word is reported unheard. Fix the script and re-run until clean.
Return the line count, word count, seconds, the hook line, and a two-sentence summary of the video.`

const reviewPrompt = (L) => `${ctx(L)}

YOUR JOB: you are an independent, demanding reviewer of the script another writer just wrote. Files: ${STUDIO}/lessons/${L.dir}/narration.json and plan.md. Assume there are problems until you have checked.
Check, line by line:
- Physics accuracy against course.json and real quantum mechanics. Any false or misleading statement (for example "both 0 and 1 at once", "tries every answer in parallel", "faster than light", wrong amplitudes, wrong bit order) must be fixed.
- A complete beginner can follow it: every technical word defined when first used, no leaps, concrete examples.
- It reads aloud as one fluent, continuous, warm teacher; sentences flow into each other; no list-like or textbook lines; no filler.
- It uses the lesson's analogy, says honestly where the analogy breaks, and ends on a clear takeaway.
- Script rules from KIT.md: 14 to 22 lines, 170 to 260 words, no em or en dashes, maths spelled as spoken, phrase pairs sensible.
- plan.md gives every line a clear on-screen picture that matches the words.
Edit narration.json and plan.md in place to fix every problem you find (keep what already works). Then run node kit/narrate.mjs lessons/${L.dir} and make sure the length is 70 to 100 s and no real word is unheard.
Return verdict "approved" if you changed nothing of substance, else "revised", with a list of the changes and the final length in seconds.`

const buildPrompt = (L) => `${ctx(L)}

YOUR JOB: build the video. The script (narration.json) and beat plan (plan.md) in your lesson folder are reviewed and final; change a script line only if it is truly needed, and then re-run narrate.
1. Run node kit/narrate.mjs lessons/${L.dir} if project/assets/vo/timing.json is missing or out of date. Read timing.json to see when each word is spoken.
2. If scene.mjs already exists, an earlier build was cut off part-way: read it alongside plan.md and timing.json, keep what is sound and finish it rather than starting over. Otherwise write scene.mjs per KIT.md's API so the drawings follow plan.md, each cued to its word with cue(). Aim for the pilot's level of craft: rich, clear hand-drawn sketches, gold only on what matters, smooth moves, continuous values driven with onFrame/sched, nothing static for more than about 5 s, old scenes cleared before new ones, a closing picture that holds to the end. Study the pilot's build.mjs (${STUDIO}/pilot/tools/build.mjs) for how its knob, chart and bulbs were drawn and animated.
3. node kit/build.mjs lessons/${L.dir}, then (cd lessons/${L.dir}/project && npx hyperframes check) until 0 errors, and fix real layout warnings.
4. node kit/look.mjs lessons/${L.dir}, then open review/wide/contact-sheet.jpg and review/phone/contact-sheet.jpg and several single frames with the Read tool. Look hard: overlaps, clipping, text under 40 px, things outside x 140 to 1780 or below y 860, labels colliding with captions, a drawing that doesn't match what the voice says at that moment, leftover objects, empty or static frames. Also snapshot moments in the middle of moves (--at) to check motion. Fix and look again. Do at least three look-and-fix rounds.
Return the length in seconds, the check error count, the number of look rounds, a list of the scenes in order, known issues you could not fix, and any kit problems.`

const qaPrompt = (L, prior) => `${ctx(L)}

YOUR JOB: you are an independent visual reviewer with fresh eyes. Another agent built this video; their notes: ${JSON.stringify(prior ?? {})}.
1. node kit/build.mjs lessons/${L.dir}, then (cd lessons/${L.dir}/project && npx hyperframes check), then node kit/look.mjs lessons/${L.dir}.
2. Read review/wide/contact-sheet.jpg and review/phone/contact-sheet.jpg, then open every single frame in review/wide and at least five phone frames. Also snapshot moments between line ends with --at to check what happens while the voice speaks.
3. Judge against KIT.md and the pilot (${STUDIO}/pilot/reference/emma-frames-1.jpg):
- overlaps, clipping, or anything outside the safe area (x 140 to 1780, y 60 to 860)
- text too small for the phone, or crowding the captions
- a picture that doesn't match the spoken words, or arrives well before or after its word (compare cue times with project/assets/vo/timing.json)
- leftover objects from an earlier scene, frames that look empty or static
- a weak or unclear sketch for the analogy
- wrong physics or typos in labels, or dashes
- a missing closing picture
4. Fix every problem directly in scene.mjs (narration.json only if a line is wrong; then re-run narrate). Rebuild, re-check, look again. Repeat until it is clean.
Return verdict "pass" (nothing needed fixing), "fixed" (you fixed things and it's now clean) or "needs_work" (a real problem remains), the lists of fixed and remaining issues, the length in seconds and the check error count.`

const lessons = args.lessons
log(`making ${lessons.length} lessons`)

// Save progress so another account can continue if usage runs out.
// Commits run one at a time (a promise chain) so lessons never clash in git.
const REPO = STUDIO.replace(/\/video-studio\/?$/, '')
const COMMIT_SCHEMA = { type: 'object', properties: {
  sha: { type: 'string' }, pushed: { type: 'boolean' }, files: { type: 'array', items: { type: 'string' } } }, required: ['pushed'] }
let gitQueue = Promise.resolve()
const checkpoint = (L, stage, note) => {
  const run = () => agent(`Commit and push one lesson's progress in a git worktree. Do exactly this and nothing else.
Repository worktree: ${REPO} (branch video-lessons). Run every command with git -C ${REPO}.
1. Stage ONLY these files if they exist and changed: video-studio/lessons/${L.dir}/narration.json, video-studio/lessons/${L.dir}/plan.md, video-studio/lessons/${L.dir}/scene.mjs. Never stage anything else (no audio, renders, review/, project/, other lessons, nothing outside video-studio/).
2. In ${STUDIO}/HANDOFF.md, under "## Progress log", append this line at the bottom of that list (before the next "## " heading), then stage HANDOFF.md too:
- ${args.date}: lesson ${L.dir}: ${stage}. ${note}
3. Commit with: git -C ${REPO} -c user.name="Dhruv Sachdeva" -c user.email="109058006+LuCiFeR041205@users.noreply.github.com" commit -m "chore(video): ${L.dir} ${stage}" -m "Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" -- video-studio/HANDOFF.md followed by only those of the three lesson files that exist (this path list makes the commit hold only these files, even if another batch staged something else)
4. git -C ${REPO} push origin video-lessons. If it is rejected, run git -C ${REPO} pull --rebase origin video-lessons, then push again.
If git reports index.lock, wait 5 seconds and retry. Return the commit sha, whether the push succeeded, and the files committed.`,
    { label: `commit:${L.dir}:${stage}`, phase: 'Save', schema: COMMIT_SCHEMA, model: 'haiku', effort: 'low' })
  const p = gitQueue.then(run, run)
  gitQueue = p.catch(() => null)
  return p
}
const brief = (o) => JSON.stringify(o ?? {}).slice(0, 400)

// Per-lesson flags let a run pick up where an earlier one stopped:
// scriptDone skips the script stage, reviewDone skips script review, buildDone skips the build
// (pass buildNotes so visual QA knows what the builder said).
// With args.stagger, the first lesson runs alone until its script review is done, and only then
// do the others start. Use it when the usage window is nearly full and about to reset.
let openGate = () => {}
const gate = args.stagger ? new Promise((open) => { openGate = open }) : Promise.resolve()

const runLesson = async (L) => {
  const script = L.scriptDone ? { skipped: 'script already written' }
    : await agent(scriptPrompt(L), { label: `script:${L.dir}`, phase: 'Script', schema: SCRIPT_SCHEMA, effort: 'high' })
  const review = L.reviewDone ? { skipped: 'script review already done' }
    : await agent(reviewPrompt(L), { label: `review:${L.dir}`, phase: 'Script review', schema: REVIEW_SCHEMA, effort: 'high' })
  if (L === lessons[0]) openGate()
  let build = L.buildNotes ?? { skipped: 'build already done' }
  if (!L.buildDone) {
    build = await agent(buildPrompt(L), { label: `build:${L.dir}`, phase: 'Build', schema: BUILD_SCHEMA, effort: 'high' })
    if (!build) return { lesson: L.dir, script, review, failed: 'build' }
    await checkpoint(L, 'script reviewed and scene built, visual QA next', `Build notes: ${brief({ seconds: build.seconds, checkErrors: build.checkErrors, knownIssues: build.knownIssues })}`)
  }
  let qa = await agent(qaPrompt(L, build), { label: `qa:${L.dir}`, phase: 'Visual QA', schema: QA_SCHEMA, effort: 'high' })
  if (qa && qa.verdict === 'needs_work') {
    log(`${L.dir}: second QA round for ${qa.remaining.length} remaining issue(s)`)
    qa = await agent(qaPrompt(L, { previousQaRemaining: qa.remaining, previousQaFixed: qa.fixed }), { label: `qa2:${L.dir}`, phase: 'Visual QA', schema: QA_SCHEMA, effort: 'high' })
  }
  if (!qa) return { lesson: L.dir, script, review, build, failed: 'qa' }
  const save = await checkpoint(L, 'visual QA done, ready to render', `QA: ${brief({ verdict: qa.verdict, seconds: qa.seconds, remaining: qa.remaining })}`)
  return { lesson: L.dir, script, review, build, qa, save }
}

// At most args.parallel lessons (default 3) at once, in the order given, so lessons finish
// completely instead of all stopping half-built when usage runs out.
const LIMIT = args.parallel ?? 3
let active = 0
const waiting = []
const limited = async (fn) => {
  while (active >= LIMIT) await new Promise((wake) => waiting.push(wake))
  active++
  try { return await fn() } finally { active--; const next = waiting.shift(); if (next) next() }
}

const results = await parallel(lessons.map((L, i) => () => limited(async () => {
  if (i > 0) await gate
  try { return await runLesson(L) } finally { if (i === 0) openGate() }
})))
return results.map((r, i) => r ?? { lesson: lessons[i].dir, failed: true })