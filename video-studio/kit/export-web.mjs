// Makes the small web copies of the finished lesson videos for the site.
// Usage: node kit/export-web.mjs <web dir> [extra Videos dir ...]
// Reads Videos/16x9 and Videos/Phone 9x16 here (plus any extra Videos dirs, e.g. the lesson 6 pilot),
// and writes <web>/public/videos/<id>.mp4, <id>-phone.mp4 and <id>.jpg (poster),
// plus <web>/src/data/videos.json: { "<lesson id>": "<file stem>" } for every lesson with a video.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const STUDIO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const web = process.argv[2] && resolve(process.argv[2]);
if (!web) throw new Error("usage: node kit/export-web.mjs <web dir> [extra Videos dir ...]");
const sources = [join(STUDIO, "Videos"), ...process.argv.slice(3).map((d) => resolve(d))];

const { lessons } = JSON.parse(readFileSync(join(STUDIO, "course.json"), "utf8"));
const outDir = join(web, "public", "videos");
mkdirSync(outDir, { recursive: true });

// H.264 tuned for flat drawings: about 3 MB per 90 s with no visible loss. faststart lets playback begin at once.
const VIDEO = ["-c:v", "libx264", "-crf", "30", "-preset", "slow", "-tune", "animation", "-pix_fmt", "yuv420p"];
const AUDIO = ["-c:a", "aac", "-b:a", "64k", "-ac", "1", "-movflags", "+faststart"];
const POSTER_AT = 0.4; // a frame 40% in, when the board is full

const run = (args) => {
  const res = spawnSync("ffmpeg", ["-v", "error", "-y", ...args], { encoding: "utf8" });
  if (res.status !== 0) throw new Error(`ffmpeg failed: ${res.stderr}`);
};
const seconds = (file) =>
  Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" }).stdout);
const find = (cut, number) => {
  const prefix = `Lesson ${String(number).padStart(2, "0")} - `;
  for (const root of sources) {
    const dir = join(root, cut);
    if (!existsSync(dir)) continue;
    const hit = readdirSync(dir).find((f) => f.startsWith(prefix) && f.endsWith(".mp4"));
    if (hit) return join(dir, hit);
  }
  return null;
};
const newer = (out, src) => existsSync(out) && statSync(out).mtimeMs > statSync(src).mtimeMs;

const list = {};
for (const lesson of lessons) {
  const wide = find("16x9", lesson.number);
  const phone = find("Phone 9x16", lesson.number);
  if (!wide || !phone) continue;
  const stem = `${String(lesson.number).padStart(2, "0")}-${lesson.id}`;
  const targets = [
    [wide, join(outDir, `${stem}.mp4`)],
    [phone, join(outDir, `${stem}-phone.mp4`)],
  ];
  for (const [src, out] of targets) if (!newer(out, src)) run(["-i", src, ...VIDEO, ...AUDIO, out]);
  const poster = join(outDir, `${stem}.jpg`);
  if (!newer(poster, wide)) run(["-ss", String(seconds(wide) * POSTER_AT), "-i", wide, "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "4", poster]);
  list[lesson.id] = stem;
  console.log(`${stem}: ${targets.map(([, out]) => `${(statSync(out).size / 1e6).toFixed(1)} MB`).join(" + ")}`);
}
writeFileSync(join(web, "src", "data", "videos.json"), `${JSON.stringify(list, null, 2)}\n`);
console.log(`${Object.keys(list).length} lessons with video`);
