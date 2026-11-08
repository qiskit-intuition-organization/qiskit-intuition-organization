// Voices a lesson with Kokoro and measures exactly when each word is spoken.
// Usage: node kit/narrate.mjs <lessonDir> [voice]     (default voice: bf_emma)
// 1. Speaks each line of <lessonDir>/narration.json to project/assets/vo/lines/NN.wav.
// 2. Lays the lines back to back (LEAD, GAP from timing.mjs) and transcribes that once with
//    whisper, so every word gets a start time. Scenes cue drawings to words with k.cue().
// 3. Writes project/assets/vo/timing.json and prints a pronunciation check: script words the
//    transcriber did not hear are a sign Kokoro said them oddly.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { LEAD, GAP, DEFAULT_VOICE, checkText, norm } from "./timing.mjs";

const KIT = dirname(fileURLToPath(import.meta.url));
// Python with kokoro-onnx and soundfile: $HYPERFRAMES_PYTHON, else kit/.venv (see HANDOFF.md).
const VENV_PY = process.env.HYPERFRAMES_PYTHON || join(KIT, ".venv/bin/python");
if (!existsSync(VENV_PY)) throw new Error(`no Kokoro python at ${VENV_PY}: python3 -m venv kit/.venv && kit/.venv/bin/pip install kokoro-onnx soundfile`);

const lessonDir = process.argv[2] && resolve(process.argv[2]);
if (!lessonDir || !existsSync(join(lessonDir, "narration.json"))) throw new Error("usage: node kit/narrate.mjs <lessonDir> [voice]  (the folder must hold narration.json)");
const voice = process.argv[3] || DEFAULT_VOICE;
const { lines } = JSON.parse(readFileSync(join(lessonDir, "narration.json"), "utf8"));
if (!Array.isArray(lines) || !lines.length) throw new Error("narration.json needs { lines: [{ say }] }");
lines.forEach(({ say }, i) => checkText(say, `narration line ${i}`));

const voDir = join(lessonDir, "project/assets/vo");
const linesDir = join(voDir, "lines");
rmSync(linesDir, { recursive: true, force: true });
mkdirSync(linesDir, { recursive: true });
const env = { ...process.env, HYPERFRAMES_PYTHON: VENV_PY };

const spoken = lines.map(({ say }, i) => {
  const file = `assets/vo/lines/${String(i + 1).padStart(2, "0")}.wav`;
  const res = spawnSync("npx", ["hyperframes", "tts", say, "-v", voice, "-o", join(lessonDir, "project", file), "--json"], { env, encoding: "utf8" });
  const out = JSON.parse((res.stdout || "").trim().split("\n").pop() || "{}");
  if (!out.ok) throw new Error(`tts failed on line ${i}: ${res.stdout}\n${res.stderr}`);
  return { file, text: say, dur: +out.durationSeconds.toFixed(3) };
});

let t = LEAD;
const placed = spoken.map((l) => { const start = +t.toFixed(3); t += l.dur + GAP; return { ...l, start }; });

// Lay the lines out as they will play, then transcribe once for word times.
const seqFile = join(voDir, "sequence.wav");
const inputs = placed.flatMap((l) => ["-i", join(lessonDir, "project", l.file)]);
const delays = placed.map((l, i) => { const ms = Math.round(l.start * 1000); return `[${i}]aresample=48000,adelay=${ms}|${ms}[a${i}]`; });
const mix = `${delays.join(";")};${placed.map((_, i) => `[a${i}]`).join("")}amix=inputs=${placed.length}:normalize=0[out]`;
const ff = spawnSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", mix, "-map", "[out]", "-ac", "1", seqFile], { encoding: "utf8" });
if (ff.status !== 0) throw new Error("ffmpeg failed: " + ff.stderr);
const tr = spawnSync("npx", ["hyperframes", "transcribe", seqFile, "--dir", voDir, "--json"], { encoding: "utf8" });
const trOut = JSON.parse((tr.stdout || "").trim().split("\n").pop() || "{}");
if (!trOut.ok) throw new Error("transcribe failed: " + tr.stdout + tr.stderr);
const heard = JSON.parse(readFileSync(trOut.transcriptPath, "utf8"));

// Give each heard word to the line whose window holds its midpoint.
const withWords = placed.map((l, i) => {
  const from = l.start - GAP / 2, to = l.start + l.dur + GAP / 2;
  const words = heard
    .filter((w) => { const m = (w.start + w.end) / 2; return m >= from && m < to; })
    .map((w) => ({ w: w.text, start: +w.start.toFixed(3), end: +w.end.toFixed(3) }));
  return { ...l, end: +(l.start + l.dur).toFixed(3), words };
});
writeFileSync(join(voDir, "timing.json"), JSON.stringify({ voice, lead: LEAD, gap: GAP, lines: withWords }, null, 1));

// Pronunciation check.
let flagged = 0;
withWords.forEach((l, i) => {
  const heardSet = new Set(l.words.map((w) => norm(w.w)));
  const missing = l.text.split(/\s+/).map(norm).filter((w) => w && !heardSet.has(w));
  const share = 1 - missing.length / Math.max(1, l.text.split(/\s+/).length);
  const mark = share < 0.8 ? "  <-- check" : "";
  if (mark) flagged++;
  console.log(`${String(i).padStart(2)}  ${l.start.toFixed(2)}s +${l.dur.toFixed(2)}s  heard ${(share * 100).toFixed(0)}%${missing.length ? "  not heard: " + missing.join(" ") : ""}${mark}`);
});
console.log(`voice ${voice}: ${withWords.length} lines, narration ends at ${(t - GAP).toFixed(2)}s. ${flagged ? flagged + " line(s) to check: numbers and symbols are often heard as digits, which is fine; real words missing may be mispronounced." : "every line heard cleanly."}`);
