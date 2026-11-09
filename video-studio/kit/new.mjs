// Makes sure every lesson in course.json (except 6, the pilot) has its folder and the two
// HyperFrames projects (16:9 and phone) with their symlinks. Safe to run again any time.
// Usage: node kit/new.mjs
import { readFileSync, mkdirSync, existsSync, symlinkSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const KIT = dirname(fileURLToPath(import.meta.url));
const STUDIO = join(KIT, "..");
const TEMPLATES = join(KIT, "templates");
const { lessons } = JSON.parse(readFileSync(join(STUDIO, "course.json"), "utf8"));
const link = (target, at) => { if (!existsSync(at)) symlinkSync(target, at); };

for (const l of lessons) {
  if (l.id === "rotations") continue;
  const dir = join(STUDIO, "lessons", `${String(l.number).padStart(2, "0")}-${l.id}`);
  const proj = join(dir, "project"), phone = join(dir, "project-phone");
  mkdirSync(join(proj, "compositions"), { recursive: true });
  mkdirSync(join(proj, "assets/vo"), { recursive: true });
  mkdirSync(phone, { recursive: true });
  link("../../../../kit/fonts", join(proj, "assets/fonts"));
  for (const f of ["hyperframes.json", "package.json"]) for (const p of [proj, phone]) if (!existsSync(join(p, f))) copyFileSync(join(TEMPLATES, f), join(p, f));
  link("../project/assets", join(phone, "assets"));
  link("../project/compositions", join(phone, "compositions"));
}
console.log(`lesson folders ready (${lessons.length - 1})`);
