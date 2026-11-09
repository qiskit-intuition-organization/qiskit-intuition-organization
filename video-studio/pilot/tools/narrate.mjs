// Speaks each narration line with Kokoro (via `hyperframes tts`) and records its length.
// Usage: node tools/narrate.mjs [voice]   default bf_emma, the voice for every lesson
// Writes assets/vo/lines/NN.wav and assets/vo/timing.json; then run node tools/build.mjs.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_VOICE = "bf_emma";
const voice = process.argv[2] || DEFAULT_VOICE;
const { lines } = JSON.parse(readFileSync(join(ROOT, "tools/narration.json"), "utf8"));
for (const { say: s } of lines) if (s.includes("—")) throw new Error("em dash in narration: " + s);

const outDir = join(ROOT, "assets/vo/lines");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const env = { ...process.env, HYPERFRAMES_PYTHON: join(ROOT, "tools/.venv/bin/python") };

const timing = lines.map(({ say: text }, i) => {
  const file = `assets/vo/lines/${String(i + 1).padStart(2, "0")}.wav`;
  const res = spawnSync("npx", ["hyperframes", "tts", text, "-v", voice, "-o", join(ROOT, file), "--json"], { env, encoding: "utf8" });
  const last = (res.stdout || "").trim().split("\n").pop();
  const out = JSON.parse(last || "{}");
  if (!out.ok) throw new Error(`tts failed on line ${i + 1}: ${res.stdout}\n${res.stderr}`);
  console.log(`${i + 1}: ${out.durationSeconds.toFixed(2)}s  ${text}`);
  return { file, text, dur: out.durationSeconds };
});
writeFileSync(join(ROOT, "assets/vo/timing.json"), JSON.stringify({ voice, lines: timing }, null, 2));
console.log("wrote assets/vo/timing.json");
