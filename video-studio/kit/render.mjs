// Renders a built lesson in 16:9 and 9:16 and files both MP4s under Videos/.
// Usage: node kit/render.mjs <lessonDir>
import { readFileSync, copyFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const KIT = dirname(fileURLToPath(import.meta.url));
const VIDEOS = process.env.VIDEOS_DIR || join(KIT, "../Videos"); // finished MP4s (git-ignored)
const lessonDir = process.argv[2] && resolve(process.argv[2]);
if (!lessonDir) throw new Error("usage: node kit/render.mjs <lessonDir>");
const { lessons } = JSON.parse(readFileSync(join(KIT, "../course.json"), "utf8"));
const lesson = lessons.find((l) => l.id === basename(lessonDir).replace(/^\d+-/, ""));
const name = `Lesson ${String(lesson.number).padStart(2, "0")} - ${lesson.title.replaceAll(":", " -").replaceAll("/", "-")}`;

for (const [dir, sub, file] of [
  ["project", "16x9", "lesson-16x9.mp4"],
  ["project-phone", "Phone 9x16", "lesson-9x16.mp4"],
]) {
  const proj = join(lessonDir, dir);
  const out = join(proj, "renders", file);
  const res = spawnSync("npx", ["hyperframes", "render", "-q", "delivery", "-o", out], { cwd: proj, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (res.status !== 0) throw new Error(`render failed (${dir}): ${res.stdout}\n${res.stderr}`);
  mkdirSync(join(VIDEOS, sub), { recursive: true });
  copyFileSync(out, join(VIDEOS, sub, `${name}.mp4`));
  console.log(`${sub}: ${name}.mp4`);
}
