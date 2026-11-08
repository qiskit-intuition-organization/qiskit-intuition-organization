// Snapshots a built lesson so you can look at it: one frame near the end of every narration line
// (when that line's drawing should be complete), in 16:9 and on the phone.
// Usage: node kit/look.mjs <lessonDir> [--at 3.2,10.5] [--phone-only|--wide-only]
// Writes <lessonDir>/review/wide/ and review/phone/, each with PNGs and contact-sheet.jpg.
import { readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const lessonDir = process.argv[2] && resolve(process.argv[2]);
if (!lessonDir) throw new Error("usage: node kit/look.mjs <lessonDir> [--at t1,t2] [--phone-only|--wide-only]");
const args = process.argv.slice(3);
const atArg = args.includes("--at") ? args[args.indexOf("--at") + 1] : null;
const { lines } = JSON.parse(readFileSync(join(lessonDir, "project/assets/vo/timing.json"), "utf8"));
const times = atArg ?? lines.map((l) => Math.max(l.start + 0.5, l.end - 0.15).toFixed(2)).join(",");

const runs = [
  ["wide", join(lessonDir, "project")],
  ["phone", join(lessonDir, "project-phone")],
].filter(([name]) => !(args.includes("--phone-only") && name === "wide") && !(args.includes("--wide-only") && name === "phone"));

for (const [name, dir] of runs) {
  const out = join(lessonDir, "review", name);
  rmSync(out, { recursive: true, force: true });
  const res = spawnSync("npx", ["hyperframes", "snapshot", dir, "--at", times, "--no-end", "-o", out, "--timeout", "120000"], { encoding: "utf8" });
  if (res.status !== 0) throw new Error(`snapshot failed (${name}): ${res.stdout}\n${res.stderr}`);
  console.log(`${name}: ${out}/contact-sheet.jpg  (frames at ${times})`);
}
