// Builds one lesson's video project from its scene and its voice.
// Usage: node kit/build.mjs <lessonDir>
// Needs <lessonDir>/scene.mjs, narration.json and project/assets/vo/timing.json (from narrate.mjs).
// Writes project/compositions/{board,captions,captions-v}.html, project/assets/vo/narration.wav,
// project/index.html (16:9) and project-phone/index.html (9:16).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { INK, GOLD, GROUND, DIM, makePen, wobbly, mulberry32, lbl, hand } from "./kit.mjs";
import { GLYPH_CSS } from "./glyphs.mjs";
import { END_HOLD, checkText, makeCue } from "./timing.mjs";
import { captionCues } from "./captions.mjs";
import { RUNTIME } from "./runtime.mjs";

const KIT = dirname(fileURLToPath(import.meta.url));
const lessonDir = process.argv[2] && resolve(process.argv[2]);
if (!lessonDir || !existsSync(join(lessonDir, "scene.mjs"))) throw new Error("usage: node kit/build.mjs <lessonDir>  (the folder must hold scene.mjs)");
const PROJ = join(lessonDir, "project");

// ---------- Lesson, script and voice ----------
const course = JSON.parse(readFileSync(join(KIT, "../course.json"), "utf8"));
const lessonId = basename(lessonDir).replace(/^\d+-/, "");
const lesson = course.lessons.find((l) => l.id === lessonId);
if (!lesson) throw new Error(`no lesson "${lessonId}" in course.json`);
const script = JSON.parse(readFileSync(join(lessonDir, "narration.json"), "utf8")).lines;
const timingFile = join(PROJ, "assets/vo/timing.json");
if (!existsSync(timingFile)) throw new Error("no voice yet: run node kit/narrate.mjs " + lessonDir);
const vo = JSON.parse(readFileSync(timingFile, "utf8"));
if (vo.lines.length !== script.length || vo.lines.some((l, i) => l.text !== script[i].say))
  throw new Error("narration.json changed since it was voiced: run node kit/narrate.mjs " + lessonDir);
const LINES = vo.lines;
const TOTAL = +(LINES[LINES.length - 1].end + END_HOLD).toFixed(3);
const cue = makeCue(LINES);

// ---------- Scene ----------
const sceneMod = await import(pathToFileURL(join(lessonDir, "scene.mjs")).href + "?t=" + Date.now());
const pen = makePen(11);
const k = { ...pen, wobbly, mulberry32, lbl, hand, INK, GOLD, GROUND, DIM, cue, lines: LINES, TOTAL, lesson };
const scene = sceneMod.default(k);
for (const key of ["html", "script"]) if (typeof scene[key] !== "string") throw new Error(`scene must return { html, script } strings (missing ${key})`);
checkText(scene.html, "scene html");

// ---------- Captions ----------
const CAPS = captionCues(LINES, TOTAL, sceneMod.phrases ?? []);
CAPS.forEach(([, , s]) => checkText(s, "caption"));

// ---------- Board ----------
const eyebrow = `LESSON ${lesson.number} &nbsp;·&nbsp; ${lesson.eyebrow.toUpperCase()}`;
const board = `<template>
  <style>
    @font-face { font-family: "Caveat"; src: url("assets/fonts/Caveat-latin.woff2") format("woff2"); font-weight: 400 700; }
    @font-face { font-family: "TASA Orbiter"; src: url("assets/fonts/TASAOrbiter-latin-wght.woff2") format("woff2"); font-weight: 400 800; }
    #root { position: absolute; inset: 0; background: ${GROUND}; overflow: hidden; }
    #root .obj { position: absolute; }
    #root svg.sk { position: absolute; left: 0; top: 0; overflow: visible; }
    #root .lbl { position: absolute; text-align: center; line-height: 1.25; padding: 0.12em 0.1em; white-space: nowrap; color: ${INK}; }
    #root .hand { font-family: "Caveat", cursive; font-weight: 600; }
    #root .gold { color: ${GOLD}; }
    #root .dim { color: ${DIM}; }
    #root .type { font-family: "TASA Orbiter", "Inter", sans-serif; font-weight: 600; }
    ${GLYPH_CSS}
    #b-title { left: 192px; top: 118px; width: 1500px; }
    #b-eyebrow { font-family: "TASA Orbiter", "Inter", sans-serif; font-weight: 600; font-size: 28px; letter-spacing: 0.2em; color: ${GOLD}; }
    #b-h1 { font-family: "TASA Orbiter", "Inter", sans-serif; font-weight: 600; font-size: 64px; letter-spacing: -0.01em; color: #f2f2f2; margin-top: 16px; }
    #b-grain { position: absolute; inset: 0; opacity: 0.06; pointer-events: none; }
    ${scene.css ?? ""}
  </style>
  <div id="root" data-composition-id="board" data-width="1920" data-height="1080">
    <svg id="b-grain" width="1920" height="1080" data-layout-ignore><filter id="b-noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0"/></filter><rect width="1920" height="1080" filter="url(#b-noise)"/></svg>
    <div id="b-title" class="obj">
      <div id="b-eyebrow">${eyebrow}</div>
      <div id="b-h1">${lesson.title}</div>
    </div>
${scene.html}
  </div>
  <script>
  (function () {
    const TOTAL = ${TOTAL};
${RUNTIME}
    tl.fromTo("#b-title", { opacity: 1, filter: "blur(0px)" }, { opacity: 1, duration: 0.01 }, 0);
    // ---------- scene ----------
${scene.script}
    // ---------- end of scene ----------
    __finish();
    window.__timelines["board"] = tl;
  })();
  </script>
</template>
`;

const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const captionsHtml = (id, w, h, prefix, boxCss, spanCss) => `<template>
  <style>
    @font-face { font-family: "TASA Orbiter"; src: url("assets/fonts/TASAOrbiter-latin-wght.woff2") format("woff2"); font-weight: 400 800; }
    #root { position: absolute; inset: 0; }
    #root .cap { position: absolute; ${boxCss} text-align: center; overflow: visible; }
    #root .cap span { display: inline-block; font-family: "TASA Orbiter", "Inter", sans-serif; font-weight: 500; ${spanCss} letter-spacing: 0.005em; color: #e8e8e8; padding: 10px 26px; background: rgba(18, 17, 18, 0.72); border-radius: 6px; }
  </style>
  <div id="root" data-composition-id="${id}" data-width="${w}" data-height="${h}">
${CAPS.map(([a, b, s], i) => `    <div id="${prefix}-${i + 1}" class="cap clip" data-start="${a}" data-duration="${(b - a).toFixed(3)}" data-track-index="0"><span>${esc(s)}</span></div>`).join("\n")}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    ${JSON.stringify(CAPS.map(([a, b]) => [a, b]))}.forEach(([a, b], i) => {
      const el = document.querySelector("#${prefix}-" + (i + 1) + " span");
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "power2.out" }, a);
      tl.to(el, { opacity: 0, duration: 0.08, ease: "power2.in" }, b - 0.08);
    });
    window.__timelines["${id}"] = tl;
  </script>
</template>
`;

writeFileSync(join(PROJ, "compositions/board.html"), board);
writeFileSync(join(PROJ, "compositions/captions.html"), captionsHtml("captions", 1920, 1080, "cap", "left: 0; right: 0; bottom: 118px;", "font-size: 44px;"));
writeFileSync(join(PROJ, "compositions/captions-v.html"), captionsHtml("captionsv", 1080, 1920, "capv", "left: 80px; right: 80px; top: 1290px;", "font-size: 54px; line-height: 1.3;"));

// ---------- Narration mix ----------
const inputs = LINES.flatMap((l) => ["-i", join(PROJ, l.file)]);
const delays = LINES.map((l, i) => { const ms = Math.round(l.start * 1000); return `[${i}]aresample=48000,adelay=${ms}|${ms}[a${i}]`; });
const mix = `${delays.join(";")};${LINES.map((_, i) => `[a${i}]`).join("")}amix=inputs=${LINES.length}:normalize=0,apad,atrim=0:${TOTAL},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[out]`;
const ff = spawnSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", mix, "-map", "[out]", "-ac", "1", join(PROJ, "assets/vo/narration.wav")], { encoding: "utf8" });
if (ff.status !== 0) throw new Error("ffmpeg mix failed: " + ff.stderr);

// ---------- Roots ----------
const title = lesson.title;
const AUDIO = `<audio id="vo" class="clip" src="assets/vo/narration.wav" data-start="0" data-duration="${TOTAL}" data-track-index="3" data-volume="1"></audio>`;
const GSAP = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>`;
writeFileSync(join(PROJ, "index.html"), `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Lesson ${lesson.number}: ${title}</title>
    ${GSAP}
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: ${GROUND}; }
      #root { position: relative; width: 1920px; height: 1080px; background: ${GROUND}; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="1920" data-height="1080">
      <div id="board" data-composition-id="board" data-composition-src="compositions/board.html"
        data-start="0" data-duration="${TOTAL}" data-track-index="1" data-track-kind="graphics"
        data-width="1920" data-height="1080" style="z-index:1"></div>
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html"
        data-start="0" data-duration="${TOTAL}" data-track-index="2" data-track-kind="captions"
        data-width="1920" data-height="1080" style="z-index:2"></div>
      ${AUDIO}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
writeFileSync(join(lessonDir, "project-phone/index.html"), `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Lesson ${lesson.number}: ${title} (phone)</title>
    ${GSAP}
    <style>
      @font-face { font-family: "TASA Orbiter"; src: url("assets/fonts/TASAOrbiter-latin-wght.woff2") format("woff2"); font-weight: 400 800; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: ${GROUND}; }
      #root { position: relative; width: 1080px; height: 1920px; background: ${GROUND}; overflow: hidden; }
      #v-head { position: absolute; left: 96px; top: 250px; width: 900px; }
      #v-eyebrow { font-family: "TASA Orbiter", "Inter", sans-serif; font-weight: 600; font-size: 30px; letter-spacing: 0.2em; color: ${GOLD}; }
      #v-title { font-family: "TASA Orbiter", "Inter", sans-serif; font-weight: 600; font-size: 66px; line-height: 1.12; color: #f2f2f2; margin-top: 18px; }
      #b-title { visibility: hidden; }
      #b-grain { display: none; }
      #v-grain { position: absolute; inset: 0; opacity: 0.06; pointer-events: none; z-index: 5; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="vmain" data-start="0" data-duration="${TOTAL}" data-width="1080" data-height="1920">
      <svg id="v-grain" width="1080" height="1920" data-layout-ignore><filter id="v-noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0"/></filter><rect width="1080" height="1920" filter="url(#v-noise)"/></svg>
      <div id="v-head">
        <div id="v-eyebrow">LESSON ${lesson.number}</div>
        <div id="v-title">${title}</div>
      </div>
      <div id="board" data-composition-id="board" data-composition-src="compositions/board.html"
        data-start="0" data-duration="${TOTAL}" data-track-index="1" data-track-kind="graphics"
        data-width="1920" data-height="1080"
        style="position:absolute;left:-92px;top:540px;width:1920px;height:1080px;transform:scale(0.6585);transform-origin:0 0;z-index:1"></div>
      <div id="captionsv" data-composition-id="captionsv" data-composition-src="compositions/captions-v.html"
        data-start="0" data-duration="${TOTAL}" data-track-index="2" data-track-kind="captions"
        data-width="1080" data-height="1920" style="z-index:2"></div>
      ${AUDIO}
    </div>
    <script>
      window.__timelines["vmain"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
console.log(`built lesson ${lesson.number} (${lesson.id}): ${TOTAL}s, ${LINES.length} lines, ${CAPS.length} captions, voice ${vo.voice}`);
