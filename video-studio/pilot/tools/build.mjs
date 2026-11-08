// Builds the pilot's compositions from lesson 6 ("Rotations: dialing in probability").
// Sketches are generated here with rough.js (seeded, so every build is identical) and
// written into compositions/board.html as plain SVG. Run: node tools/build.mjs
import rough from "roughjs";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INK = "#e8e8e8";
const GOLD = "#d9b463";
const GROUND = "#17191c";
const gen = rough.generator();
let seedCounter = 11;

const pen = (o = {}) => ({ stroke: INK, strokeWidth: 3, roughness: 1.4, bowing: 1.2, seed: seedCounter++, ...o });
const goldPen = (o = {}) => pen({ stroke: GOLD, strokeWidth: 3.6, ...o });

// rough.js drawable -> SVG paths. Stroked paths get pathLength=1 so they can be drawn on.
function svgOf(drawable) {
  return gen
    .toPaths(drawable)
    .map((p) => {
      const filled = p.fill && p.fill !== "none";
      if (filled) return `<path class="solid" d="${p.d}" fill="${p.fill}" stroke="none"/>`;
      return `<path class="ink" pathLength="1" d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    })
    .join("");
}
const r = {
  line: (x1, y1, x2, y2, o) => svgOf(gen.line(x1, y1, x2, y2, o)),
  rect: (x, y, w, h, o) => svgOf(gen.rectangle(x, y, w, h, o)),
  circle: (x, y, d, o) => svgOf(gen.circle(x, y, d, o)),
  ellipse: (x, y, w, h, o) => svgOf(gen.ellipse(x, y, w, h, o)),
  curve: (pts, o) => svgOf(gen.curve(pts, o)),
  poly: (pts, o) => svgOf(gen.polygon(pts, o)),
};

// Seeded smooth wobble, for the hand-made strokes whose length must be known exactly.
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function wobbly(points, amp, seed) {
  const rnd = mulberry32(seed);
  const [p1, p2, f1, f2] = [rnd() * 6.28, rnd() * 6.28, 0.018 + rnd() * 0.01, 0.05 + rnd() * 0.02];
  let s = 0;
  const out = points.map(([x, y], i) => {
    if (i > 0) s += Math.hypot(x - points[i - 1][0], y - points[i - 1][1]);
    const [nx, ny] = normalAt(points, i);
    const off = amp * (0.65 * Math.sin(s * f1 + p1) + 0.35 * Math.sin(s * f2 + p2));
    return [x + nx * off, y + ny * off];
  });
  const lengths = [0];
  for (let i = 1; i < out.length; i++) lengths.push(lengths[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
  const total = lengths[lengths.length - 1];
  const d = "M" + out.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L");
  return { d, frac: lengths.map((l) => +(l / total).toFixed(4)) };
}
function normalAt(pts, i) {
  const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  return [-dy / len, dx / len];
}

// Hand-drawn θ and π: neither display font has Greek, so the pen draws them.
const TH = `<svg class="gl gl-th" viewBox="0 0 60 100" aria-label="θ"><path d="M31 10 C14 11 9 38 10 54 C11 78 21 91 31 89 C46 87 52 62 50 44 C48 22 42 10 31 10 Z M12 51 C24 48 37 50 49 47"/></svg>`;
const PI = `<svg class="gl gl-pi" viewBox="0 22 64 72" aria-label="π"><path d="M6 38 C22 32 42 34 59 30 M23 36 C23 56 20 74 14 89 M43 35 C41 58 43 77 53 87"/></svg>`;
const hand = (s) => s.replaceAll("θ", TH).replaceAll("π", PI);

// ---------- Captions ----------
const CAPTIONS = [
  [0.4, 6.8, "Goal: a qubit that reads 1 one time in four."],
  [8.2, 12.2, "X is a light switch: only off or on."],
  [12.3, 16.0, "X and H are switches with fixed positions."],
  [16.4, 22.6, "RY(θ) is a dimmer: turn the knob to any level."],
  [25.4, 28.8, "At θ = 0 nothing happens. It always reads 0."],
  [29.0, 33.5, "At θ = π/2 you land on 50/50, like H."],
  [33.8, 38.5, "At θ = π it always reads 1, like X."],
  [39.0, 43.4, "Equal turns of the knob don't add equal odds."],
  [43.6, 47.9, "Slow near the ends, fastest in the middle."],
  [48.2, 52.8, "Turn to θ = π/3 and P(1) is exactly 25%."],
  [53.0, 57.8, "Each reading is still fully on or off, never half bright."],
  [58.2, 65.5, "The angle sets the probability of reading 1."],
];
for (const [, , s] of CAPTIONS) if (s.includes("—")) throw new Error("em dash in caption: " + s);

// ---------- Narration timing ----------
// With a voice (assets/vo/timing.json from tools/narrate.mjs) the voice is the clock: the
// lines play back to back with a natural gap, and the animation is stretched piecewise so
// each line starts at its moment ("at" in tools/narration.json). W(t) maps silent-cut
// seconds to narrated seconds. Captions show the spoken words, a few at a time.
const BASE_TOTAL = 65.5;
const LEAD = 0.4, GAP = 0.3, END_HOLD = 2.6;
const SCRIPT = JSON.parse(readFileSync(join(ROOT, "tools/narration.json"), "utf8")).lines;
const VO_TIMING = join(ROOT, "assets/vo/timing.json");
const vo = existsSync(VO_TIMING) ? JSON.parse(readFileSync(VO_TIMING, "utf8")) : null;
let ANCHORS = [[0, 0], [BASE_TOTAL, BASE_TOTAL]];
let VO_STARTS = [];
let TOTAL = BASE_TOTAL;
if (vo) {
  if (vo.lines.length !== SCRIPT.length) throw new Error("re-run tools/narrate.mjs: the script changed");
  let t = LEAD;
  VO_STARTS = vo.lines.map((l) => { const s = +t.toFixed(3); t += l.dur + GAP; return s; });
  TOTAL = +(t - GAP + END_HOLD).toFixed(3);
  ANCHORS = [[0, 0], ...SCRIPT.map((l, i) => [l.at, VO_STARTS[i]]), [BASE_TOTAL, TOTAL]];
  ANCHORS.slice(1).forEach(([a, v], i) => {
    const [pa, pv] = ANCHORS[i];
    if (a <= pa || v <= pv) throw new Error("narration anchors must increase");
    if ((v - pv) / (a - pa) < 0.75) console.warn(`animation squeezed to ${((v - pv) / (a - pa)).toFixed(2)}x between ${pa}s and ${a}s`);
  });
}
function warp(anchors, t) {
  for (let i = 1; i < anchors.length; i++) {
    const [a0, v0] = anchors[i - 1], [a1, v1] = anchors[i];
    if (t <= a1) return v0 + ((t - a0) * (v1 - v0)) / (a1 - a0);
  }
  const [a, v] = anchors[anchors.length - 1];
  return v + (t - a);
}
const W = (t) => +warp(ANCHORS, t).toFixed(3);

// Spoken words -> caption words. Math is shown as notation, everything else word for word.
const PHRASES = [
  ["sine squared of theta over two", "sin²(θ/2)"], ["pi over two", "π/2"], ["pi over three", "π/3"],
  ["fifty fifty", "50/50"], ["Fifty fifty", "50/50"], ["thirty five percent", "35%"], ["fifteen percent", "15%"], ["R Y", "RY"],
  ["theta", "θ"], ["pi", "π"],
];
function tokens(say) {
  const out = [];
  let rest = say.trim();
  while (rest) {
    const hit = PHRASES.find(([p]) => rest.startsWith(p) && !/[A-Za-z]/.test(rest[p.length] || ""));
    const m = hit ? null : rest.match(/^\S+/);
    const sayTok = hit ? hit[0] : m[0];
    let tail = "";
    rest = rest.slice(sayTok.length);
    if (hit) { const p = rest.match(/^[.,:!?]*/)[0]; tail = p; rest = rest.slice(p.length); }
    out.push({ show: (hit ? hit[1] : sayTok) + tail, weight: sayTok.length + tail.length + 1 });
    rest = rest.trimStart();
  }
  return out;
}
// Captions break at commas and full stops; a clause longer than 8 words is split evenly,
// and a clause of one or two words joins its neighbour.
const MAX_WORDS = 8;
function chunks(say) {
  const clauses = [];
  let cur = [];
  for (const tk of tokens(say)) { cur.push(tk); if (/[.,:!?]$/.test(tk.show)) { clauses.push(cur); cur = []; } }
  if (cur.length) clauses.push(cur);
  const merged = [];
  for (const c of clauses) {
    const prev = merged[merged.length - 1];
    if (prev && (c.length <= 2 || prev.length <= 2) && prev.length + c.length <= MAX_WORDS) merged[merged.length - 1] = [...prev, ...c];
    else merged.push(c);
  }
  return merged.flatMap((c) => {
    if (c.length <= MAX_WORDS) return [c];
    const parts = Math.ceil(c.length / 7), size = Math.ceil(c.length / parts);
    return Array.from({ length: parts }, (_, k) => c.slice(k * size, (k + 1) * size));
  });
}
let CAPTIONS_T = CAPTIONS;
if (vo) {
  const caps = [];
  SCRIPT.forEach((l, i) => {
    const groups = chunks(l.say);
    const total = groups.flat().reduce((s, t) => s + t.weight, 0);
    let t = VO_STARTS[i];
    groups.forEach((g) => {
      caps.push([+t.toFixed(3), g.map((x) => x.show).join(" ")]);
      t += (vo.lines[i].dur * g.reduce((s, x) => s + x.weight, 0)) / total;
    });
  });
  CAPTIONS_T = caps.map(([a, text], k) => [a, k + 1 < caps.length ? caps[k + 1][0] : TOTAL, text]);
  for (const [, , text] of CAPTIONS_T) if (text.includes("\u2014")) throw new Error("em dash in caption: " + text);
}

// ---------- Geometry shared with the runtime ----------
const KNOB = { cx: 300, cy: 290, r: 135, arcR: 208, a0: -225, sweep: 270 };
const CHART = { x0: 110, y0: 560, w: 640, h: 420 };
const p1 = (th) => Math.sin((Math.PI * th) / 2) ** 2; // th in units of π
const cx = (th) => CHART.x0 + CHART.w * th;
const cy = (th) => CHART.y0 - CHART.h * p1(th);

// ---------- Bulbs ----------
const BULB_X = [110, 330, 550, 770];
function bulb(x, i) {
  const glass = r.ellipse(x, 120, 150, 172, pen({ seed: 100 + i }));
  const neck = r.line(x - 40, 192, x - 34, 232, pen({ strokeWidth: 2.6 })) + r.line(x + 40, 192, x + 34, 232, pen({ strokeWidth: 2.6 }));
  const base = r.rect(x - 36, 232, 72, 46, pen({ roughness: 1 })) + r.line(x - 34, 248, x + 34, 246, pen({ strokeWidth: 2 })) + r.line(x - 34, 262, x + 34, 262, pen({ strokeWidth: 2 }));
  const tip = r.line(x - 14, 288, x + 14, 288, pen({ strokeWidth: 3.4 }));
  const fil = [[x - 16, 196], [x - 16, 150], [x - 8, 128], [x, 150], [x + 8, 128], [x + 16, 150], [x + 16, 196]];
  const filament = r.curve(fil, pen({ strokeWidth: 2.2, roughness: 0.8 }));
  const rays = [-150, -120, -90, -60, -30, 0, 180]
    .map((a, k) => {
      const t = (a * Math.PI) / 180;
      return r.line(x + Math.cos(t) * 100, 120 + Math.sin(t) * 110, x + Math.cos(t) * 128, 120 + Math.sin(t) * 140, goldPen({ strokeWidth: 3, seed: 400 + i * 10 + k }));
    })
    .join("");
  const lit =
    r.ellipse(x, 120, 128, 150, { fill: GOLD, fillStyle: "hachure", hachureGap: 9, fillWeight: 2, stroke: "none", seed: 300 + i, roughness: 1.2 }) +
    r.curve(fil, goldPen({ strokeWidth: 3, roughness: 0.8 })) +
    rays;
  return `<g id="b-bulb${i}">${glass}${neck}${base}${tip}${filament}</g><g id="b-lit${i}" class="lit">${lit}</g>`;
}
const bulbsSvg = BULB_X.map(bulb).join("");
const bulbLabels = (set, digits) =>
  digits.map((d, i) => `<div class="lbl hand b-read${set}" id="b-read${set}-${i}" style="left:${BULB_X[i] - 50}px;top:296px;width:100px;font-size:66px;${d === "1" ? `color:${GOLD}` : ""}">${d}</div>`).join("");

// ---------- Switch ----------
const switchSvg =
  `<g id="b-sw-plate">${r.rect(40, 80, 260, 400, pen({ roughness: 1.1 }))}${r.circle(170, 108, 12, pen({ strokeWidth: 2 }))}${r.circle(170, 452, 12, pen({ strokeWidth: 2 }))}</g>` +
  `<g id="b-sw-slot">${r.rect(124, 168, 92, 224, pen({ strokeWidth: 2.6, roughness: 1 }))}</g>` +
  `<g id="b-sw-toggle">${r.rect(128, 282, 84, 106, pen({ fill: INK, fillStyle: "hachure", hachureGap: 9, fillWeight: 1.6 }))}</g>`;

// ---------- Dimmer ----------
const ang = (th) => ((KNOB.a0 + KNOB.sweep * th) * Math.PI) / 180;
const kp = (th, rad) => [KNOB.cx + Math.cos(ang(th)) * rad, KNOB.cy + Math.sin(ang(th)) * rad];
const ticks = Array.from({ length: 9 }, (_, i) => {
  const [a, b] = [kp(i / 8, 160), kp(i / 8, 184)];
  return r.line(a[0], a[1], b[0], b[1], pen({ strokeWidth: i % 4 === 0 ? 3.4 : 2.4, roughness: 0.8 }));
}).join("");
const arcPts = Array.from({ length: 181 }, (_, i) => kp(i / 180, KNOB.arcR));
const knobArc = wobbly(arcPts, 1.6, 7);
const dimmerSvg =
  `<g id="b-knob">${r.circle(KNOB.cx, KNOB.cy, KNOB.r * 2, pen({ strokeWidth: 3.4 }))}${r.circle(KNOB.cx, KNOB.cy, 224, pen({ strokeWidth: 1.6, roughness: 1.8 }))}</g>` +
  `<g id="b-ticks">${ticks}</g>` +
  `<path id="b-arc" d="${knobArc.d}" pathLength="1" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>` +
  `<g id="b-pointer">${r.line(KNOB.cx, KNOB.cy, KNOB.cx + 112, KNOB.cy, goldPen({ strokeWidth: 6, roughness: 0.9 }))}${r.circle(KNOB.cx, KNOB.cy, 26, goldPen({ fill: GOLD, fillStyle: "solid" }))}</g>` +
  `<g id="b-stop">${r.curve([[452, 92], [430, 104], [412, 126]], goldPen({ strokeWidth: 2.6 }))}${r.line(412, 126, 428, 120, goldPen({ strokeWidth: 2.6 }))}${r.line(412, 126, 414, 110, goldPen({ strokeWidth: 2.6 }))}</g>`;
const tickLabel = (th, text, id) => {
  const [x, y] = kp(th, 246);
  return `<div class="lbl hand" id="${id}" style="left:${x - 60}px;top:${y - 40}px;width:120px;font-size:48px">${hand(text)}</div>`;
};

// ---------- Chart ----------
const { x0, y0, w, h } = CHART;
const tracePts = Array.from({ length: 241 }, (_, i) => [cx(i / 240), cy(i / 240)]);
const trace = wobbly(tracePts, 1.1, 21);
const dash = (x1, y1, x2, y2, id) => `<line id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-opacity=".28" stroke-width="2" stroke-dasharray="8 10"/>`;
const chartSvg =
  `<g id="b-axes">${r.line(x0 - 20, y0, x0 + w + 50, y0, pen())}${r.line(x0 + w + 50, y0, x0 + w + 34, y0 - 10, pen({ strokeWidth: 2.6 }))}${r.line(x0 + w + 50, y0, x0 + w + 34, y0 + 10, pen({ strokeWidth: 2.6 }))}` +
  `${r.line(x0, y0 + 20, x0, y0 - h - 50, pen())}${r.line(x0, y0 - h - 50, x0 - 10, y0 - h - 34, pen({ strokeWidth: 2.6 }))}${r.line(x0, y0 - h - 50, x0 + 10, y0 - h - 34, pen({ strokeWidth: 2.6 }))}` +
  [0.5, 1].map((t) => r.line(cx(t), y0 - 9, cx(t), y0 + 9, pen({ strokeWidth: 2.4, roughness: 0.6 }))).join("") +
  [0.5, 1].map((p) => r.line(x0 - 9, y0 - h * p, x0 + 9, y0 - h * p, pen({ strokeWidth: 2.4, roughness: 0.6 }))).join("") +
  `</g>` +
  `<g id="b-guides">${dash(x0 + 12, y0 - h / 2, x0 + w, y0 - h / 2, "b-g50")}${dash(x0 + 12, y0 - h, x0 + w, y0 - h, "b-g100")}</g>` +
  `<line id="b-gauge" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0}" stroke="${GOLD}" stroke-width="9" stroke-linecap="round"/>` +
  `<line id="b-leader" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0}" stroke="${GOLD}" stroke-opacity=".7" stroke-width="2.4" stroke-dasharray="7 9"/>` +
  `<path id="b-trace" d="${trace.d}" pathLength="1" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>` +
  // Step markers: two equal turns, unequal rises
  `<g id="b-br1">${r.line(x0 + 4, y0 + 92, cx(0.25) - 4, y0 + 92, goldPen({ strokeWidth: 2.6 }))}${r.line(x0 + 4, y0 + 82, x0 + 4, y0 + 102, goldPen({ strokeWidth: 2.6 }))}${r.line(cx(0.25) - 4, y0 + 82, cx(0.25) - 4, y0 + 102, goldPen({ strokeWidth: 2.6 }))}</g>` +
  `<g id="b-br2">${r.line(cx(0.25) + 4, y0 + 92, cx(0.5) - 4, y0 + 92, goldPen({ strokeWidth: 2.6 }))}${r.line(cx(0.25) + 4, y0 + 82, cx(0.25) + 4, y0 + 102, goldPen({ strokeWidth: 2.6 }))}${r.line(cx(0.5) - 4, y0 + 82, cx(0.5) - 4, y0 + 102, goldPen({ strokeWidth: 2.6 }))}</g>` +
  `<g id="b-rise1">${r.line(cx(0.25) + 14, y0 - 4, cx(0.25) + 14, cy(0.25) + 4, goldPen({ strokeWidth: 3.4 }))}</g>` +
  `<g id="b-rise2">${r.line(cx(0.5) + 14, cy(0.25), cx(0.5) + 14, cy(0.5) + 4, goldPen({ strokeWidth: 3.4 }))}</g>` +
  `<circle id="b-dot" cx="${x0}" cy="${y0}" r="12" fill="${GOLD}" stroke="${GROUND}" stroke-width="4"/>`;

// ---------- Formula underline ----------
const underline = r.curve([[10, 18], [260, 10], [520, 16], [700, 8]], goldPen({ strokeWidth: 4.4, roughness: 1 }));

const lbl = (id, x, y, wd, size, html, extra = "") =>
  `<div class="lbl hand" id="${id}" style="left:${x}px;top:${y}px;width:${wd}px;font-size:${size}px;${extra}">${html}</div>`;

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
    #root .gl { display: inline-block; height: 0.7em; width: 0.44em; vertical-align: -0.02em; margin: 0 0.02em; overflow: visible; }
    #root .gl-pi { height: 0.56em; width: 0.5em; vertical-align: 0; }
    #root .gl path { fill: none; stroke: currentColor; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; }
    #b-title { left: 192px; top: 118px; width: 1400px; }
    #b-eyebrow { font-family: "TASA Orbiter", "Inter", sans-serif; font-weight: 600; font-size: 28px; letter-spacing: 0.2em; color: ${GOLD}; }
    #b-h1 { font-family: "TASA Orbiter", "Inter", sans-serif; font-weight: 600; font-size: 64px; letter-spacing: -0.01em; color: #f2f2f2; margin-top: 16px; }
    #b-grain { position: absolute; inset: 0; opacity: 0.06; pointer-events: none; }
  </style>
  <div id="root" data-composition-id="board" data-width="1920" data-height="1080">
    <svg id="b-grain" width="1920" height="1080" data-layout-ignore><filter id="b-noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0"/></filter><rect width="1920" height="1080" filter="url(#b-noise)"/></svg>

    <div id="b-title" class="obj">
      <div id="b-eyebrow">LESSON 6 &nbsp;·&nbsp; SINGLE-QUBIT GATES</div>
      <div id="b-h1">Rotations: dialing in probability</div>
    </div>

    <div id="b-bulbs" class="obj" style="left:520px;top:380px;width:880px;height:480px">
      <svg class="sk" width="880" height="480" viewBox="0 0 880 480">${bulbsSvg}</svg>
      ${bulbLabels("a", ["0", "0", "0", "1"])}
      ${bulbLabels("b", ["0", "0", "1", "0"])}
      ${lbl("b-onein4", 290, 392, 300, 58, "1 in 4", `color:${GOLD}`)}
    </div>
    ${lbl("b-goal", 220, 236, 280, 42, "goal: 1 in 4", `color:${GOLD}`)}

    <div id="b-switch" class="obj" style="left:790px;top:140px;width:340px;height:660px">
      <svg class="sk" width="340" height="660" viewBox="0 0 340 660">${switchSvg}</svg>
      ${lbl("b-on", 110, 6, 120, 52, "ON")}
      ${lbl("b-off", 110, 490, 120, 52, "OFF")}
      ${lbl("b-xlbl", -30, 570, 400, 60, "X: on or off")}
    </div>
    ${lbl("b-vs", 800, 380, 160, 76, "vs", `color:${GOLD}`)}

    <div id="b-dimmer" class="obj" style="left:990px;top:130px;width:600px;height:700px">
      <svg class="sk" width="600" height="700" viewBox="0 0 600 700">${dimmerSvg}</svg>
      ${tickLabel(0, "0", "b-t0")}${tickLabel(0.5, "π/2", "b-t1")}${tickLabel(1, "π", "b-t2")}
      ${lbl("b-stoplbl", 410, 18, 260, 46, "stop anywhere", `color:${GOLD}`)}
      ${lbl("b-rylbl", 50, 560, 500, 62, hand("RY(θ): any level"))}
      <div class="lbl hand" id="b-readout" style="left:20px;top:560px;width:560px;font-size:58px">${hand("θ = ")}<span id="b-ro-th">0.00</span>${PI}<span style="display:inline-block;width:1.1em"></span>P(1) = <span id="b-ro-p" class="gold">0%</span></div>
    </div>

    <div id="b-chart" class="obj" style="left:880px;top:170px;width:860px;height:700px">
      <svg class="sk" width="860" height="700" viewBox="0 0 860 700">${chartSvg}</svg>
      ${lbl("b-cx0", x0 - 50, y0 + 14, 100, 48, "0")}
      ${lbl("b-cx1", cx(0.5) - 60, y0 + 14, 120, 48, hand("π/2"))}
      ${lbl("b-cx2", cx(1) - 60, y0 + 14, 120, 48, hand("π"))}
      ${lbl("b-cxt", x0 + w + 46, y0 - 34, 70, 56, hand("θ"))}
      ${lbl("b-cy1", x0 - 116, y0 - h / 2 - 34, 100, 44, "50%", "text-align:right")}
      ${lbl("b-cy2", x0 - 126, y0 - h - 34, 110, 44, "100%", "text-align:right")}
      ${lbl("b-cyt", x0 - 80, y0 - h - 132, 160, 52, "P(1)")}
      ${lbl("b-n0", x0 + 20, y0 - 96, 260, 48, "always 0", "text-align:left")}
      ${lbl("b-n1", cx(0.5) - 330, cy(0.5) - 110, 320, 48, "50/50, like H", "text-align:right")}
      ${lbl("b-n2", cx(1) - 420, cy(1) - 104, 400, 48, "always 1, like X", "text-align:right")}
      ${lbl("b-same1", x0, y0 + 98, cx(0.25) - x0, 40, "same turn")}
      ${lbl("b-same2", cx(0.25), y0 + 98, cx(0.25) - x0, 40, "same turn")}
      ${lbl("b-up1", cx(0.25) + 22, cy(0.25) - 6, 120, 46, "+15%", `color:${GOLD};text-align:left`)}
      ${lbl("b-up2", cx(0.5) + 22, (cy(0.25) + cy(0.5)) / 2 - 26, 120, 46, "+35%", `color:${GOLD};text-align:left`)}
      ${lbl("b-cy25", x0 - 116, cy(1 / 3) - 32, 100, 44, "25%", `color:${GOLD};text-align:right`)}
      ${lbl("b-n3", cx(1 / 3) + 24, cy(1 / 3) + 2, 360, 48, hand("θ = π/3 gives 25%"), "text-align:left")}
    </div>

    <div id="b-formula" class="obj" style="left:900px;top:300px;width:860px;height:420px">
      ${lbl("b-f1", 0, 0, 860, 76, hand("RY(θ) is a dial."), "text-align:left")}
      ${lbl("b-f2", 0, 110, 860, 140, hand("P(1) = sin²(θ/2)"), "text-align:left")}
      <svg class="sk" id="b-fline" width="760" height="40" viewBox="0 0 760 40" style="top:300px;left:6px"><g id="b-fund">${underline}</g></svg>
    </div>
  </div>
  <script>
  (function () {
    const TOTAL = ${TOTAL};
    const ANCHORS = ${JSON.stringify(ANCHORS)};
    const warp = ${warp.toString()};
    const W = (t) => warp(ANCHORS, t);
    const KNOB = ${JSON.stringify(KNOB)};
    const CHART = ${JSON.stringify(CHART)};
    const TRACE_FRAC = ${JSON.stringify(trace.frac)};
    // Knob schedule: [start, end, from, to], θ in units of π.
    const SCHED = [
      [19.9, 21.1, 0, 0.62], [21.3, 22.5, 0.62, 0],
      [29.0, 31.6, 0, 0.5], [33.8, 36.4, 0.5, 1],
      [39.0, 40.8, 1, 0], [41.2, 42.8, 0, 0.25], [43.8, 45.4, 0.25, 0.5],
      [48.4, 49.8, 0.5, 1 / 3],
    ].map(([a, b, f, to]) => [W(a), W(b), f, to]);
    const TRACE_FROM = W(28);
    const inOut = (u) => 0.5 - 0.5 * Math.cos(Math.PI * u);
    const segVal = ([a, b, f, to], t) => (t >= b ? to : f + (to - f) * inOut((t - a) / (b - a)));
    function thetaAt(t) {
      let th = 0;
      for (const s of SCHED) { if (t <= s[0]) break; th = segVal(s, t); }
      return th;
    }
    function traceAt(t) {
      let m = 0;
      for (const s of SCHED) { if (s[0] < TRACE_FROM) continue; if (t <= s[0]) break; m = Math.max(m, s[2], segVal(s, t)); }
      return m;
    }
    const $ = (id) => document.getElementById(id);
    const P1 = (th) => Math.sin((Math.PI * th) / 2) ** 2;
    function render(t) {
      const th = thetaAt(t), tm = traceAt(t), p = P1(th);
      $("b-pointer").setAttribute("transform", "rotate(" + (KNOB.a0 + KNOB.sweep * th).toFixed(3) + " " + KNOB.cx + " " + KNOB.cy + ")");
      const arc = $("b-arc");
      arc.style.strokeDasharray = "1 2"; arc.style.strokeDashoffset = String(1 - th);
      arc.style.opacity = th > 0.003 ? "1" : "0";
      const i = Math.min(239, Math.floor(tm * 240)), u = tm * 240 - i;
      const frac = TRACE_FRAC[i] + (TRACE_FRAC[i + 1] - TRACE_FRAC[i]) * u;
      const tr = $("b-trace");
      tr.style.strokeDasharray = "1 2"; tr.style.strokeDashoffset = String(1 - frac);
      tr.style.opacity = tm > 0.003 ? "1" : "0";
      const x = CHART.x0 + CHART.w * th, y = CHART.y0 - CHART.h * p;
      $("b-dot").setAttribute("cx", x.toFixed(2)); $("b-dot").setAttribute("cy", y.toFixed(2));
      $("b-gauge").setAttribute("y2", y.toFixed(2));
      $("b-leader").setAttribute("x2", x.toFixed(2)); $("b-leader").setAttribute("y1", y.toFixed(2)); $("b-leader").setAttribute("y2", y.toFixed(2));
      $("b-leader").style.opacity = t > W(25.4) && p > 0.03 && p < 0.97 ? "1" : "0";
      $("b-ro-th").textContent = th.toFixed(2);
      $("b-ro-p").textContent = Math.round(p * 100) + "%";
    }

    const tl0 = gsap.timeline({ paused: true });
    // Every position goes through W, so the narrated cut keeps the same choreography.
    // A move keeps its own speed when the scene is stretched, and speeds up only when squeezed.
    const fit = (v, p) => (typeof v.duration === "number" ? { ...v, duration: Math.min(v.duration, Math.max(0.01, W(p + v.duration) - W(p))) } : v);
    const tl = {
      to: (a, b, p) => tl0.to(a, fit(b, p), W(p)),
      fromTo: (a, b, c, p) => tl0.fromTo(a, b, fit(c, p), W(p)),
      set: (a, b, p) => tl0.set(a, b, W(p)),
    };
    const all = (sel) => Array.from(document.querySelectorAll(sel));
    // Pen draws each stroke in turn, time shared by stroke length.
    function draw(sel, start, dur) {
      const groups = all(sel);
      const paths = groups.flatMap((g) => Array.from(g.querySelectorAll("path.ink")));
      const lens = paths.map((p) => Math.max(8, p.getTotalLength()));
      const sum = lens.reduce((a, b) => a + b, 0);
      groups.forEach((g) => tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.01 }, start));
      let t = start;
      paths.forEach((p, k) => {
        const d = (dur * lens[k]) / sum;
        p.style.strokeDasharray = "1 2";
        tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: "power1.inOut" }, t);
        t += d;
      });
      groups.flatMap((g) => Array.from(g.querySelectorAll("path.solid"))).forEach((p) => tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.25 }, start + dur - 0.2));
    }
    // Labels are written in left to right.
    function write(sel, start, dur) {
      all(sel).forEach((el) => tl.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: "power1.inOut" }, start));
    }
    const fade = (sel, to, start, dur = 0.35) => tl.to(sel, { opacity: to, duration: dur, ease: "power2.inOut" }, start);
    const hide = (sel) => tl.set(sel, { opacity: 0 }, 0);
    const blurOut = (sel, start) => tl.to(sel, { opacity: 0, filter: "blur(8px)", duration: 0.25, ease: "power3.in" }, start);

    // Initial hidden states
    hide(["#b-lit0", "#b-lit1", "#b-lit2", "#b-lit3", "#b-readout", "#b-dot", "#b-gauge", "#b-guides"]);

    // 1. Hook: the goal, a qubit that reads 1 one time in four (0 to 8s)
    tl.fromTo("#b-title", { opacity: 1, filter: "blur(0px)" }, { opacity: 1, duration: 0.01 }, 0);
    draw("#b-bulb0, #b-bulb1, #b-bulb2, #b-bulb3", 0.3, 2.6);
    ["#b-reada-0", "#b-reada-1", "#b-reada-2", "#b-reada-3"].forEach((s, k) => write(s, 3.0 + k * 0.45, 0.22));
    fade("#b-lit3", 1, 4.35, 0.3);
    write("#b-onein4", 4.9, 0.5);
    blurOut("#b-title", 6.8);
    fade(["#b-reada-0", "#b-reada-1", "#b-reada-2", "#b-reada-3", "#b-onein4"], 0, 6.9, 0.25);
    tl.fromTo("#b-bulbs", { x: 0, y: 0, scale: 1 }, { x: -600, y: -460, scale: 0.3, duration: 0.9, ease: "power2.inOut" }, 7.0);
    write("#b-goal", 7.9, 0.5);

    // 2. X is a light switch (8 to 16s)
    draw("#b-sw-plate, #b-sw-slot, #b-sw-toggle", 8.1, 1.8);
    write("#b-on", 9.7, 0.25); write("#b-off", 9.9, 0.3);
    write("#b-xlbl", 10.2, 0.7);
    [[11.2, -110], [12.7, 0], [14.2, -110]].forEach(([t, y]) => tl.to("#b-sw-toggle", { y, duration: 0.18, ease: "power3.out" }, t));
    tl.fromTo("#b-sw-toggle", { y: 0 }, { y: 0, duration: 0.01 }, 0);

    // 3. RY(θ) is a dimmer (16 to 23s)
    tl.fromTo("#b-switch", { x: 0 }, { x: -360, duration: 0.8, ease: "power2.inOut" }, 16.0);
    write("#b-vs", 16.8, 0.35);
    draw("#b-knob", 17.0, 1.0); draw("#b-ticks", 17.9, 0.7); draw("#b-pointer", 18.5, 0.35);
    write("#b-t0", 18.7, 0.15); write("#b-t1", 18.85, 0.25); write("#b-t2", 19.1, 0.15);
    write("#b-rylbl", 19.0, 0.8);
    draw("#b-stop", 20.2, 0.4); write("#b-stoplbl", 20.4, 0.6);

    // 4. The knob drives P(1) (23 to 39s)
    blurOut(["#b-switch", "#b-vs", "#b-goal", "#b-bulbs"], 22.8);
    fade(["#b-stop", "#b-stoplbl", "#b-rylbl"], 0, 22.8, 0.25);
    tl.fromTo("#b-dimmer", { x: 0, y: 0 }, { x: -790, y: 20, duration: 1.2, ease: "power2.inOut" }, 23.0);
    tl.fromTo("#b-readout", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 24.3);
    write("#b-readout", 24.3, 0.8);
    draw("#b-axes", 23.8, 1.3);
    write("#b-cx0", 24.9, 0.12); write("#b-cx1", 25.0, 0.25); write("#b-cx2", 25.2, 0.15); write("#b-cxt", 25.0, 0.2);
    write("#b-cy1", 25.1, 0.25); write("#b-cy2", 25.3, 0.25); write("#b-cyt", 24.9, 0.3);
    fade(["#b-guides"], 1, 25.2, 0.4);
    fade(["#b-dot", "#b-gauge"], 1, 25.4, 0.2);
    write("#b-n0", 27.6, 0.5); fade("#b-n0", 0, 28.9, 0.25);
    write("#b-n1", 31.8, 0.7);
    write("#b-n2", 36.6, 0.8);

    // 5. Not linear: equal turns, unequal odds (39 to 48s)
    fade(["#b-n1", "#b-n2"], 0, 38.8, 0.3);
    draw("#b-br1", 41.2, 0.5); write("#b-same1", 41.5, 0.5);
    draw("#b-rise1", 42.9, 0.35); write("#b-up1", 43.1, 0.4);
    draw("#b-br2", 43.8, 0.5); write("#b-same2", 44.1, 0.5);
    draw("#b-rise2", 45.5, 0.4); write("#b-up2", 45.7, 0.4);

    // 6. The target: θ = π/3 gives 25%, and readings stay on or off (48 to 58s)
    fade(["#b-br1", "#b-br2", "#b-rise1", "#b-rise2", "#b-same1", "#b-same2", "#b-up1", "#b-up2"], 0, 47.9, 0.3);
    write("#b-cy25", 49.9, 0.4);
    write("#b-n3", 50.2, 0.9);
    fade(["#b-chart", "#b-dimmer"], 0, 53.0, 0.5);
    tl.set("#b-bulbs", { x: 0, y: 0, scale: 0.94, filter: "blur(0px)" }, 52.95);
    tl.set("#b-lit3", { opacity: 0 }, 52.95);
    fade("#b-bulbs", 1, 53.1, 0.4);
    tl.to("#b-bulbs", { scale: 1, duration: 0.6, ease: "expo.out" }, 53.1);
    ["#b-readb-0", "#b-readb-1", "#b-readb-2", "#b-readb-3"].forEach((s, k) => write(s, 54.1 + k * 0.55, 0.22));
    fade("#b-lit2", 1, 55.15, 0.25);
    tl.set("#b-onein4", { opacity: 1 }, 56.4);
    tl.fromTo("#b-onein4", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power1.inOut", immediateRender: false }, 56.4);

    // 7. The formula (58 to 65.5s)
    fade(["#b-bulbs", "#b-chart"], 0, 58.0, 0.4);
    fade("#b-dimmer", 1, 58.2, 0.5);
    write("#b-f1", 58.6, 0.9);
    write("#b-f2", 59.8, 1.5);
    draw("#b-fund", 61.4, 0.6);

    // One clock drives everything that follows the knob.
    const clock = { t: 0 };
    tl.fromTo(clock, { t: 0 }, { t: TOTAL, duration: TOTAL, ease: "none", onUpdate: () => render(clock.t) }, 0);
    window.addEventListener("hf-seek", (e) => render(e.detail.time));
    render(0);
    window.__timelines["board"] = tl0;
  })();
  </script>
</template>
`;


const captions = `<template>
  <style>
    @font-face { font-family: "TASA Orbiter"; src: url("assets/fonts/TASAOrbiter-latin-wght.woff2") format("woff2"); font-weight: 400 800; }
    #root { position: absolute; inset: 0; }
    #root .cap { position: absolute; left: 0; right: 0; bottom: 118px; text-align: center; overflow: visible; }
    #root .cap span { display: inline-block; font-family: "TASA Orbiter", "Inter", sans-serif; font-weight: 500; font-size: 44px; letter-spacing: 0.005em; color: #e8e8e8; padding: 10px 26px; background: rgba(18, 17, 18, 0.72); border-radius: 6px; }
  </style>
  <div id="root" data-composition-id="captions" data-width="1920" data-height="1080">
${CAPTIONS_T.map(([a, b, s], i) => `    <div id="cap-${i + 1}" class="cap clip" data-start="${a}" data-duration="${(b - a).toFixed(2)}" data-track-index="0"><span>${s}</span></div>`).join("\n")}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    ${JSON.stringify(CAPTIONS_T)}.forEach(([a, b], i) => {
      const el = document.querySelector("#cap-" + (i + 1) + " span");
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "power2.out" }, a);
      tl.to(el, { opacity: 0, duration: 0.08, ease: "power2.in" }, b - 0.08);
    });
    window.__timelines["captions"] = tl;
  </script>
</template>
`;

writeFileSync(join(ROOT, "compositions/board.html"), board);
writeFileSync(join(ROOT, "compositions/captions.html"), captions);
// Phone cut: same captions, bigger and wrapped, placed under the board.
const captionsV = captions
  .replace("#root .cap { position: absolute; left: 0; right: 0; bottom: 118px;", "#root .cap { position: absolute; left: 80px; right: 80px; top: 1290px;")
  .replace("font-size: 44px;", "font-size: 54px; line-height: 1.3;")
  .replaceAll('data-composition-id="captions" data-width="1920" data-height="1080"', 'data-composition-id="captionsv" data-width="1080" data-height="1920"')
  .replace('window.__timelines["captions"]', 'window.__timelines["captionsv"]')
  .replaceAll("cap-", "capv-");
writeFileSync(join(ROOT, "compositions/captions-v.html"), captionsV);

// ---------- Narration mix and root durations ----------
if (vo) {
  const inputs = vo.lines.flatMap((l) => ["-i", join(ROOT, l.file)]);
  const delays = vo.lines.map((l, i) => {
    const ms = Math.round(VO_STARTS[i] * 1000);
    return `[${i}]aresample=48000,adelay=${ms}|${ms}[a${i}]`;
  });
  const mix = `${delays.join(";")};${vo.lines.map((_, i) => `[a${i}]`).join("")}amix=inputs=${vo.lines.length}:normalize=0,apad,atrim=0:${TOTAL},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[out]`;
  const res = spawnSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", mix, "-map", "[out]", "-ac", "1", join(ROOT, "assets/vo/narration.wav")], { encoding: "utf8" });
  if (res.status !== 0) throw new Error("ffmpeg mix failed: " + res.stderr);
  console.log(`narration (${vo.voice}) mixed: ${vo.lines.length} lines back to back, ${TOTAL}s total`);
}
const AUDIO = `<audio id="vo" class="clip" src="assets/vo/narration.wav" data-start="0" data-duration="${TOTAL}" data-track-index="3" data-volume="1"></audio>`;
for (const [file, hostEnd] of [
  ["index.html", 'data-width="1920" data-height="1080" style="z-index:2"></div>'],
  ["../project-phone/index.html", 'data-width="1080" data-height="1920" style="z-index:2"></div>'],
]) {
  let html = readFileSync(join(ROOT, file), "utf8").replace(/data-duration="[\d.]+"/g, `data-duration="${TOTAL}"`);
  html = html.replace(/\n\s*<audio id="vo"[^>]*><\/audio>/, "");
  if (vo) html = html.replace(hostEnd, `${hostEnd}\n      ${AUDIO}`);
  writeFileSync(join(ROOT, file), html);
}
console.log(`built board.html and captions.html (${TOTAL}s)`);
