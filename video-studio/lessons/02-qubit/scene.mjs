// Lesson 2, "What is a qubit?": switch -> weather vane -> arrow on a globe -> live odds ->
// the snap -> many repeats and a tally -> not secretly 0 or 1 -> the formula -> closing card.
export const phrases = [
  ["alpha ket zero plus beta ket one", "α|0⟩ + β|1⟩"],
  ["ket zero", "|0⟩"],
  ["ket one", "|1⟩"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, wobbly, lbl, cue, INK, GOLD, GROUND, DIM } = k;
  const PI = Math.PI;
  const rad = (d) => (d * PI) / 180;

  // ---------- Times (seconds), cued to the spoken words ----------
  const T = {
    light: cue(0, "light"), off: cue(0, "off"), on: cue(0, "on"), zero0: cue(0, "zero"), one0: 4.2,
    qubit: cue(1, "qubit"), quantum: cue(1, "quantum"), weather: cue(1, "weather"), vane: cue(1, "vane"),
    point: cue(2, "point"), question: cue(2, "question"), north2: cue(2, "north"),
    answers: cue(3, "answers"), word: cue(3, "word"), swings: cue(3, "swings"),
    qubit4: cue(4, "qubit"), state4: cue(4, "state"), every: cue(4, "everything"), arrow4: cue(4, "arrow"), globe: 21.6,
    straight5: cue(5, "straight"), north5: cue(5, "north"), ket0: cue(5, "ket"), bracket: cue(5, "bracket"), called: cue(5, "called"),
    straight6: cue(6, "straight"), ket1: cue(6, "ket", 1), direction: cue(6, "direction"), good: cue(6, "good"),
    catch: cue(7, "catch"), never: cue(7, "never"), measuring: cue(7, "measuring"), zero7: cue(7, "zero"), one7: cue(7, "one"),
    l8: cue(8), closer: cue(8, "closer"), north8: cue(8, "north"),
    equator: cue(9, "equator"), fifty: cue(9, "fifty"), below: cue(9, "below"),
    vane10: cue(10, "vane"), answers10: cue(10, "answers"), snaps: cue(10, "snaps"),
    l11: cue(11), vane11: cue(11, "vane"), breaks: cue(11, "breaks"), look: cue(11, "look"),
    l12: cue(12), see: cue(12, "see"), many: cue(12, "many"), prepared: cue(12, "prepared"), count: cue(12, "count"),
    counts: cue(13, "counts"), arrow13: cue(13, "arrow"), tilts: cue(13, "tilts"),
    l14: cue(14), secretly: cue(14, "secretly"), waiting: cue(14, "waiting"), found: cue(14, "found"), truly: cue(14, "truly"),
    symbols: cue(15, "symbols"), state15: cue(15, "state"), alpha: cue(15, "alpha"), plus: cue(15, "plus"), beta: cue(15, "beta"),
    numbers: cue(15, "numbers"), squared: cue(15, "squared"), odds: 73.6,
    l16: cue(16), arrow16: cue(16, "arrow"), measurement: cue(16, "measurement"), one16: cue(16, "one"),
  };

  // ---------- Small helpers ----------
  // A positioned box whose SVG uses board coordinates, so every drawing below is in board pixels.
  const box = (id, x, y, w, h, svg, inner = "", extra = "") =>
    `<div id="${id}" class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">` +
    `<svg class="sk" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}">${svg}</svg>${inner}</div>`;
  const g = (id, inner, attrs = "") => `<g id="${id}" ${attrs}>${inner}</g>`;
  const thin = (o = {}) => pen({ strokeWidth: 2.2, ...o });
  const dim = (o = {}) => pen({ stroke: DIM, strokeWidth: 2.2, ...o });
  const solid = (c) => pen({ stroke: "none", fill: c, fillStyle: "solid" });
  const ring = (cx, cy, rr, n, amp, seed, phase = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * 2 * PI + phase;
      const bump = 1 + amp * Math.abs(Math.sin(a * 5 + seed));
      return [cx + Math.cos(a) * rr[0] * bump, cy + Math.sin(a) * rr[1] * bump];
    });
  // Eyes: open (almond, iris, pupil) or closed (one lid curve with lashes).
  const eyeOpen = (cx, cy, s = 1) =>
    r.curve([[cx - 62 * s, cy], [cx - 20 * s, cy - 34 * s], [cx + 20 * s, cy - 34 * s], [cx + 62 * s, cy]], pen()) +
    r.curve([[cx - 62 * s, cy], [cx - 20 * s, cy + 32 * s], [cx + 20 * s, cy + 32 * s], [cx + 62 * s, cy]], pen()) +
    r.circle(cx, cy, 44 * s, thin()) + r.circle(cx, cy, 16 * s, solid(INK));
  const eyeShut = (cx, cy, s = 1) =>
    r.curve([[cx - 62 * s, cy - 6 * s], [cx - 20 * s, cy + 22 * s], [cx + 20 * s, cy + 22 * s], [cx + 62 * s, cy - 6 * s]], pen()) +
    [-36, -12, 12, 36].map((dx, i) => r.line(cx + dx * s, cy + 18 * s, cx + dx * 1.25 * s, cy + 40 * s, thin({ seed: 900 + i }))).join("");
  // A hand-drawn state arrow in local coordinates, pointing straight up from (0,0).
  const stateArrow = (len, o, head = 30) => arrow(0, 0, 0, -len, o, head);

  // ---------- 1. The light switch ----------
  const switchSvg =
    g("b-sw-plate", r.rect(860, 380, 200, 320, pen({ roughness: 1.1 })) + r.circle(960, 404, 12, thin()) + r.circle(960, 676, 12, thin())) +
    g("b-sw-slot", r.rect(918, 438, 84, 204, pen({ strokeWidth: 2.6, roughness: 1 }))) +
    g("b-tog",
      g("b-tog-ink", r.rect(924, 542, 72, 94, pen({ fill: INK, fillStyle: "hachure", hachureGap: 9, fillWeight: 1.6 }))) +
      g("b-tog-gold", r.rect(924, 542, 72, 94, goldPen({ fill: GOLD, fillStyle: "hachure", hachureGap: 9, fillWeight: 1.8 }))));
  const switchHtml = box("b-switch", 800, 280, 400, 520, switchSvg,
    lbl("b-on", 100, 6, 120, 56, "ON") + lbl("b-off", 90, 428, 140, 56, "OFF") +
    lbl("b-sw1", 282, 150, 80, 72, "1") + lbl("b-sw0", 282, 266, 80, 72, "0"));

  // ---------- 2. The weather vane (pivot at 960, 440) ----------
  const VP = [960, 440];
  const vaneShape =
    r.line(0, 150, 0, -170, pen({ strokeWidth: 4 })) +
    r.poly([[0, -218], [-32, -160], [32, -160]], pen({ fill: INK, fillStyle: "hachure", hachureGap: 8, fillWeight: 1.6, strokeWidth: 3.2 })) +
    r.poly([[-46, 92], [46, 92], [46, 184], [0, 160], [-46, 184]], pen({ fill: INK, fillStyle: "hachure", hachureGap: 10, fillWeight: 1.4, strokeWidth: 3 })) +
    r.circle(0, 0, 22, solid(INK));
  const vaneSvg =
    g("b-roof", r.poly([[760, 846], [960, 766], [1160, 846]], pen({ strokeWidth: 3.4, fill: INK, fillStyle: "hachure", hachureGap: 13, fillWeight: 1.2, hachureAngle: 60 })) +
      r.line(744, 848, 1176, 848, pen({ strokeWidth: 3.4 }))) +
    g("b-post", r.line(960, 452, 960, 768, pen({ strokeWidth: 4 })) + r.line(946, 736, 974, 736, thin())) +
    g("b-arms", r.line(960, 440, 960, 214, dim()) + r.line(944, 214, 976, 214, thin()) + r.line(944, 652, 976, 652, thin())) +
    `<g id="b-vrot" transform="translate(${VP[0]} ${VP[1]}) rotate(60)">${g("b-vaneshape", vaneShape)}</g>` +
    g("b-vmotion", r.arc(960, 440, 520, 520, -PI / 2 + 0.12, -PI / 2 + 0.75, false, thin()) + r.arc(960, 440, 570, 570, -PI / 2 + 0.2, -PI / 2 + 0.7, false, thin())) +
    g("b-ntick", r.linear([[1000, 170], [1012, 186], [1036, 150]], goldPen({ strokeWidth: 4 })));
  const vaneHtml = box("b-vane", 700, 110, 520, 740, vaneSvg,
    lbl("b-vN", 230, 6, 60, 60, "N") + lbl("b-vS", 280, 512, 60, 60, "S"),
    "transform-origin:260px 330px");

  // Speech bubbles
  const bubble1 = g("b-bub1", r.ellipse(470, 228, 480, 150, pen()) + r.linear([[640, 280], [790, 350], [600, 296]], pen()));
  const bubble2 = g("b-bub2", r.ellipse(1410, 240, 300, 128, pen()) + r.linear([[1300, 274], [1170, 360], [1330, 290]], pen()));
  const bubblesHtml = box("b-bubbles", 220, 150, 1340, 230, bubble1 + bubble2,
    lbl("b-ask", 30, 34, 440, 58, `<span class="gold">north</span> or <span class="gold">south</span>?`) +
    lbl("b-reply", 1090, 46, 220, 66, "north!", `color:${GOLD}`));

  // ---------- 3. The globe (centre 720, 470, radius 270) ----------
  const G = { x: 720, y: 470, R: 270 };
  const tipAt = (deg, rr = G.R) => [G.x + rr * Math.sin(rad(deg)), G.y - rr * Math.cos(rad(deg))];
  const arcPts = Array.from({ length: 181 }, (_, i) => tipAt(i, 232));
  const tiltArc = wobbly(arcPts, 1.4, 17);
  const ghost = (id, deg, seed) =>
    `<g transform="translate(${G.x} ${G.y}) rotate(${deg})">${g(id, stateArrow(256, { stroke: DIM, strokeWidth: 3, seed }, 26))}</g>`;
  const globeSvg =
    g("b-gl-body", r.circle(G.x, G.y, G.R * 2, pen({ strokeWidth: 3.2, roughness: 0.7, seed: 4242 })) +
      r.arc(G.x, G.y, 470, 470, PI * 1.08, PI * 1.42, false, dim({ strokeWidth: 2.6 })) +
      r.arc(G.x, G.y, 540, 140, PI, 2 * PI, false, dim({ strokeWidth: 2 })) +
      r.arc(G.x, G.y, 540, 140, 0, PI, false, pen({ strokeWidth: 2.6 }))) +
    g("b-gl-eqgold", r.ellipse(G.x, G.y, 540, 140, goldPen({ strokeWidth: 4 }))) +
    g("b-pn", r.circle(G.x, G.y - G.R, 18, solid(INK))) + g("b-pn-g", r.circle(G.x, G.y - G.R, 24, solid(GOLD))) +
    g("b-ps", r.circle(G.x, G.y + G.R, 18, solid(INK))) + g("b-ps-g", r.circle(G.x, G.y + G.R, 24, solid(GOLD))) +
    ghost("b-ghost1", -35, 501) + ghost("b-ghost2", -100, 502) + ghost("b-ghost3", -145, 503) +
    `<path id="b-tiltarc" d="${tiltArc.d}" pathLength="1" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linecap="round" style="opacity:0"/>` +
    `<g id="b-arot" transform="translate(${G.x} ${G.y}) rotate(40)">` +
    g("b-glow", `<line x1="0" y1="0" x2="0" y2="-250" stroke="${GOLD}" stroke-opacity="0.28" stroke-width="22" stroke-linecap="round"/>`) +
    g("b-arrowA", stateArrow(262, { stroke: GOLD, strokeWidth: 6, roughness: 0.9 }) + r.circle(0, 0, 20, solid(GOLD))) +
    g("b-arrowB", stateArrow(262, { stroke: GOLD, strokeWidth: 6, roughness: 0.9 }) + r.circle(0, 0, 20, solid(GOLD))) +
    `</g>` +
    g("b-curls", r.curve([[600, 96], [630, 112], [662, 150]], goldPen({ strokeWidth: 3 })) + r.line(662, 150, 646, 142, goldPen({ strokeWidth: 3 })) + r.line(662, 150, 660, 133, goldPen({ strokeWidth: 3 })) +
      r.curve([[846, 96], [812, 112], [782, 150]], goldPen({ strokeWidth: 3 })) + r.line(782, 150, 798, 142, goldPen({ strokeWidth: 3 })) + r.line(782, 150, 784, 133, goldPen({ strokeWidth: 3 }))) +
    g("b-goodtick", r.linear([[1000, 296], [1016, 318], [1050, 268]], goldPen({ strokeWidth: 4.4 }))) +
    g("b-snapticks", [[650, 716, 622, 706], [790, 716, 818, 706], [662, 686, 638, 668], [778, 686, 802, 668]].map(([a, b, c, d], i) => r.line(a, b, c, d, thin({ seed: 800 + i }))).join(""));
  const GB = { x: 380, y: 60, w: 700, h: 800 };
  const gl = (id, x, y, w, size, html, extra) => lbl(id, x - GB.x, y - GB.y, w, size, html, extra);
  const globeHtml = box("b-globe", GB.x, GB.y, GB.w, GB.h, globeSvg,
    gl("b-k0", 620, 100, 200, 66, "|0⟩") + gl("b-k1", 620, 748, 200, 66, "|1⟩") +
    gl("b-aket", 860, 76, 170, 50, "a ket", "text-align:left") +
    gl("b-tiltlbl", 752, 268, 120, 56, "tilt", `color:${GOLD};text-align:left`) +
    gl("b-qmark", 660, 380, 120, 130, "?", "color:rgba(232,232,232,0.5)"),
    `transform-origin:${G.x - GB.x}px ${G.y - GB.y}px`);

  // ---------- 4. Hidden arrow: cloud, eye, measurement ----------
  const cloudPts = ring(730, 470, [280, 250], 90, 0.13, 0.3);
  const cloudSvg = g("b-cloudshape",
    r.curve([...cloudPts, cloudPts[0]], pen({ fill: GROUND, fillStyle: "solid", strokeWidth: 3.2 })) +
    r.curve([...cloudPts, cloudPts[0]], pen({ stroke: "none", fill: DIM, fillStyle: "hachure", hachureGap: 16, fillWeight: 1.4, hachureAngle: -30 })));
  const cloudHtml = box("b-cloud", 410, 180, 640, 580, cloudSvg);
  const eyeHtml = box("b-eye1", 1100, 200, 160, 90, g("b-eye1g", eyeShut(1170, 236)));
  const measSvg =
    g("b-mbox", r.rect(1240, 450, 220, 140, pen({ strokeWidth: 3.2 })) + r.arc(1350, 560, 150, 150, PI, 2 * PI, false, thin()) +
      r.line(1350 - 75, 560, 1350 - 62, 552, thin()) + r.line(1350 + 75, 560, 1350 + 62, 552, thin())) +
    `<g transform="translate(1350 560)">${g("b-needle1", r.line(0, 0, 0, -62, pen({ strokeWidth: 3.6 })) + r.circle(0, 0, 14, solid(INK)))}</g>` +
    g("b-marrow", arrow(1072, 520, 1226, 520, { strokeWidth: 3 }, 20)) +
    g("b-mout", arrow(1470, 520, 1530, 520, { strokeWidth: 2.6 }, 16));
  const measHtml = box("b-meas", 1060, 300, 650, 340, measSvg,
    lbl("b-measlbl", 190, 76, 220, 52, "measure") +
    lbl("b-out0", 480, 70, 80, 84, "0") + lbl("b-outor", 476, 170, 90, 46, "or") + lbl("b-out1", 480, 226, 80, 84, "1"));
  const cantSee = lbl("b-cantsee", 1080, 290, 340, 46, "you can't see this", "text-align:left");

  // ---------- 5. Probability bars (base y 720, height 400) ----------
  const BAR = { x: [1180, 1400], w: 110, base: 720, h: 400 };
  const barSvg = BAR.x.map((x, i) =>
    g(`b-bframe${i}`, r.rect(x, BAR.base - BAR.h, BAR.w, BAR.h, dim({ strokeWidth: 2 }))) +
    `<clipPath id="b-clip${i}"><rect id="b-crect${i}" x="${x - 6}" y="${BAR.base}" width="${BAR.w + 12}" height="0"/></clipPath>` +
    `<g clip-path="url(#b-clip${i})">` +
    `<g id="b-fill${i}i">${r.rect(x + 3, BAR.base - BAR.h, BAR.w - 6, BAR.h, pen({ stroke: "none", fill: INK, fillStyle: "hachure", hachureGap: 10, fillWeight: 1.8 }))}</g>` +
    `<g id="b-fill${i}g">${r.rect(x + 3, BAR.base - BAR.h, BAR.w - 6, BAR.h, pen({ stroke: "none", fill: GOLD, fillStyle: "hachure", hachureGap: 9, fillWeight: 2.2 }))}</g></g>` +
    `<g id="b-lvl${i}" transform="translate(0 0)"><g id="b-lvl${i}i">${r.line(x - 4, BAR.base, x + BAR.w + 4, BAR.base, pen({ strokeWidth: 3.4 }))}</g>` +
    `<g id="b-lvl${i}g">${r.line(x - 4, BAR.base, x + BAR.w + 4, BAR.base, goldPen({ strokeWidth: 4 }))}</g></g>`).join("") +
    g("b-bbase", r.line(1140, BAR.base, 1550, BAR.base, pen({ strokeWidth: 3.2 })));
  const barsHtml = box("b-bars", 1120, 170, 460, 680, barSvg,
    lbl("b-bl0", 60, 556, 110, 60, "0") + lbl("b-bl1", 280, 556, 110, 60, "1") +
    lbl("b-pct0", 40, 70, 150, 54, `<span id="b-pv0">0</span>%`) + lbl("b-pct1", 260, 70, 150, 54, `<span id="b-pv1">0</span>%`) +
    lbl("b-5050", 120, -8, 220, 54, "50/50"));
  const bigOne = lbl("b-ans1", 1020, 560, 110, 110, "1", `color:${GOLD}`);

  // ---------- 6. The vane breaks: crack and open eye ----------
  const crackHtml = box("b-crack", 1040, 250, 120, 480,
    g("b-crackg", r.linear([[1100, 260], [1084, 330], [1114, 390], [1080, 460], [1110, 530], [1086, 600], [1104, 680], [1094, 720]], goldPen({ strokeWidth: 4 }))));
  const seeHtml = box("b-see", 1440, 340, 340, 200,
    g("b-eye2g", eyeOpen(1690, 400, 0.9)) +
    `<line id="b-sight" x1="1626" y1="404" x2="1460" y2="420" stroke="${INK}" stroke-opacity=".6" stroke-width="3" stroke-dasharray="10 12" stroke-linecap="round"/>`,
    lbl("b-canSee", 30, 92, 300, 48, "you can see it", "text-align:right"));

  // ---------- 7. Many copies and a tally ----------
  const shut2Html = box("b-eye3", 190, 400, 280, 140,
    g("b-eye3g", eyeShut(260, 460, 0.9)) +
    g("b-eye3x", r.line(360, 450, 440, 450, dim({ strokeWidth: 2.6 })) + r.line(384, 430, 416, 470, pen({ strokeWidth: 3.4 })) + r.line(416, 430, 384, 470, pen({ strokeWidth: 3.4 }))));
  const SG = [1200, 1330, 1460, 1590, 1720];
  const smallGlobes = SG.map((x, i) =>
    g(`b-sg${i}`, r.circle(x, 222, 96, pen({ strokeWidth: 2.6, roughness: 0.8, seed: 610 + i })) + r.ellipse(x, 222, 96, 26, dim({ strokeWidth: 1.8, seed: 620 + i })) +
      `<g transform="translate(${x} 222) rotate(60)">${arrow(0, 0, 0, -44, { stroke: INK, strokeWidth: 2.6, seed: 630 + i }, 12)}</g>`)).join("");
  const OUT = "00100010001001000001".split("");
  const GRID = { x: 1150, y: 318, cw: 116, ch: 70 };
  const gridSvg = g("b-grid",
    r.rect(GRID.x, GRID.y, GRID.cw * 5, GRID.ch * 4, pen({ strokeWidth: 2.6 })) +
    [1, 2, 3, 4].map((c) => r.line(GRID.x + c * GRID.cw, GRID.y + 4, GRID.x + c * GRID.cw, GRID.y + GRID.ch * 4 - 4, dim({ seed: 640 + c }))).join("") +
    [1, 2, 3].map((rw) => r.line(GRID.x + 4, GRID.y + rw * GRID.ch, GRID.x + GRID.cw * 5 - 4, GRID.y + rw * GRID.ch, dim({ seed: 650 + rw }))).join(""));
  const cells = OUT.map((d, i) => {
    const [c, rw] = [i % 5, Math.floor(i / 5)];
    return lbl(`b-cell${i}`, GRID.x - 1130 + c * GRID.cw, GRID.y - 90 + rw * GRID.ch - 4, GRID.cw, 54, d, "line-height:1.1");
  }).join("");
  const manyHtml = box("b-many", 1130, 90, 650, 640, smallGlobes + gridSvg,
    lbl("b-prep", 80, 4, 500, 46, "prepared the same way") + cells +
    lbl("b-count", 30, 528, 600, 54, `0: <span id="b-n0">0</span>&nbsp;&nbsp;&nbsp;&nbsp;1: <span id="b-n1">0</span>`) +
    lbl("b-countp", 30, 528, 600, 54, `0: <span class="gold">75%</span>&nbsp;&nbsp;&nbsp;&nbsp;1: 25%`));

  // ---------- 8. Not secretly 0 or 1: the cup ----------
  const cupHtml = box("b-cup", 1230, 300, 400, 380,
    g("b-table", r.line(1250, 560, 1610, 560, pen({ strokeWidth: 3 }))) +
    g("b-cupbody", r.poly([[1320, 556], [1540, 556], [1500, 380], [1360, 380]], pen({ fill: INK, fillStyle: "hachure", hachureGap: 14, fillWeight: 1.4, strokeWidth: 3.2 })) +
      r.ellipse(1430, 380, 140, 22, thin())) +
    g("b-cupx", r.line(1270, 340, 1600, 660, pen({ strokeWidth: 5 })) + r.line(1600, 340, 1270, 660, pen({ strokeWidth: 5 }))),
    lbl("b-secret", 10, 282, 380, 50, "secretly 0 or 1?"));

  // ---------- 9. The formula ----------
  const F = (id, html, extra = "") => `<span id="${id}" class="fp" style="${extra}">${k.hand(html)}</span>`;
  const formulaHtml =
    `<div class="lbl hand" id="b-formula" style="left:850px;top:300px;width:900px;font-size:92px;text-align:left">` +
    F("b-fa", "|ψ⟩ =") + F("b-fb", "α", "margin-left:0.3em") + F("b-fc", "|0⟩") + F("b-fd", "+", "margin:0 0.25em") + F("b-fe", "β") + F("b-ff", "|1⟩") +
    `</div>`;
  const MB = { a: 1086, b: 1308, base: 700, h: 140 };
  const miniSvg =
    g("b-minia", arrow(MB.a, 452, MB.a, 528, { strokeWidth: 2.6 }, 14) + arrow(MB.b, 452, MB.b, 528, { strokeWidth: 2.6 }, 14)) +
    g("b-minibars",
      r.rect(MB.a - 34, MB.base - MB.h * 0.75, 68, MB.h * 0.75, pen({ fill: INK, fillStyle: "hachure", hachureGap: 9, fillWeight: 1.6 })) +
      r.rect(MB.b - 34, MB.base - MB.h * 0.25, 68, MB.h * 0.25, pen({ fill: INK, fillStyle: "hachure", hachureGap: 9, fillWeight: 1.6 })) +
      r.line(MB.a - 70, MB.base, MB.b + 70, MB.base, pen({ strokeWidth: 3 })));
  const miniHtml = box("b-mini", 980, 440, 520, 400, miniSvg,
    lbl("b-thestate", -130, -8, 200, 44, "the state") +
    lbl("b-asq", MB.a - 980 - 70, 268, 140, 52, `|α|<span style="font-size:0.6em;vertical-align:0.8em">2</span>`) + lbl("b-bsq", MB.b - 980 - 70, 268, 140, 52, `|β|<span style="font-size:0.6em;vertical-align:0.8em">2</span>`) +
    lbl("b-odds", MB.b - 980 + 60, 170, 200, 52, "the odds", "text-align:left"));

  // ---------- 10. Closing card ----------
  const closeSvg =
    g("b-cl-arrow", arrow(606, 590, 980, 590, { strokeWidth: 3 }, 20)) +
    g("b-cl-box", r.rect(990, 520, 180, 130, pen({ strokeWidth: 3.2 })) + r.arc(1080, 620, 120, 120, PI, 2 * PI, false, thin())) +
    `<g transform="translate(1080 620)">${g("b-needle2", r.line(0, 0, 0, -50, pen({ strokeWidth: 3.4 })) + r.circle(0, 0, 12, solid(INK)))}</g>` +
    g("b-cl-out", arrow(1180, 585, 1260, 585, { strokeWidth: 2.6 }, 16)) +
    g("b-cl-bitbox", r.rect(1272, 516, 120, 140, pen({ strokeWidth: 3 }))) +
    g("b-cl-under", r.curve([[680, 464], [800, 456], [920, 462], [1060, 454]], goldPen({ strokeWidth: 4.4 })));
  const closeHtml = box("b-close", 620, 300, 1100, 480, closeSvg,
    lbl("b-steq", 50, 54, 460, 70, "state = arrow", `color:${GOLD};text-align:left`) +
    lbl("b-meas2", 350, 158, 260, 48, "measure") +
    lbl("b-bit0", 644, 220, 120, 104, "0") +
    lbl("b-onebit", 590, 360, 240, 58, "one bit"));

  const html = [
    switchHtml,
    lbl("b-qq", 720, 64, 480, 92, `qubit<span class="gold">?</span>`),
    lbl("b-qbit", 760, 178, 400, 50, "quantum bit"),
    vaneHtml, bubblesHtml,
    globeHtml,
    lbl("b-state", 1060, 214, 300, 60, "state", "text-align:left"),
    lbl("b-every", 1060, 292, 460, 46, "= everything about it", "text-align:left"),
    box("b-tie", 900, 240, 160, 60, g("b-tieg", r.line(1052, 272, 918, 262, thin()))),
    cloudHtml, eyeHtml, cantSee, measHtml,
    barsHtml, bigOne,
    crackHtml, seeHtml,
    shut2Html, manyHtml,
    cupHtml,
    lbl("b-between", 990, 262, 400, 54, "really in between", `color:${GOLD};text-align:left`),
    formulaHtml, miniHtml,
    closeHtml,
  ].join("\n");

  const css = `
    #root .fp { display: inline-block; }
    #b-formula { transform-origin: 0 50%; }
    #b-steq { transform-origin: 0 50%; }
  `;

  // ---------- Timeline ----------
  const script = `
    const T = ${JSON.stringify(T)};
    const GOLDC = "${GOLD}", INKC = "${INK}";
    const toGold = (sel, t, d = 0.25) => tl.to(all(sel), { color: GOLDC, duration: d }, t);
    const toInk = (sel, t, d = 0.3) => tl.to(all(sel), { color: INKC, duration: d }, t);
    const unblur = (sel, t) => tl.set(all(sel), { filter: "blur(0px)" }, t);

    hide("#b-bars"); show("#b-bars", T.closer - 0.12);
    hide(["#b-tog-gold", "#b-gl-eqgold", "#b-pn-g", "#b-ps-g", "#b-glow", "#b-countp", "#b-5050", "#b-qmark", "#b-sight"]);

    // 0. A bit is a light switch
    draw(["#b-sw-plate", "#b-sw-slot", "#b-tog-ink"], T.light - 0.1, 1.5);
    blurOut("#b-title", 3.0);
    write("#b-off", T.off, 0.25); write("#b-sw0", T.off + 0.05, 0.15);
    tl.fromTo("#b-tog", { y: 0 }, { y: -100, duration: 0.14, ease: "power3.out" }, T.on);
    fade("#b-tog-gold", 1, T.on, 0.08);
    write("#b-on", T.on, 0.2); write("#b-sw1", T.on + 0.05, 0.15); toGold("#b-sw1", T.on, 0.1);
    tl.to("#b-tog", { y: 0, duration: 0.14, ease: "power3.out" }, T.zero0);
    fade("#b-tog-gold", 0, T.zero0, 0.08); toInk("#b-sw1", T.zero0, 0.1); toGold("#b-sw0", T.zero0, 0.1);
    tl.to("#b-tog", { y: -100, duration: 0.14, ease: "power3.out" }, T.one0);
    fade("#b-tog-gold", 1, T.one0, 0.08); toInk("#b-sw0", T.one0, 0.1); toGold("#b-sw1", T.one0, 0.1);
    toInk("#b-sw1", 5.0, 0.4);
    fade("#b-switch", 0.45, T.qubit, 0.4);

    // 1. A qubit? Picture a weather vane
    write("#b-qq", T.qubit - 0.1, 0.55);
    write("#b-qbit", T.quantum, 0.6);
    blurOut("#b-switch", T.weather - 0.05);
    draw(["#b-roof", "#b-post"], T.weather, 0.75);
    draw("#b-vaneshape", T.vane - 0.1, 1.2);
    draw("#b-arms", T.vane + 0.6, 0.5);
    fade(["#b-qq", "#b-qbit"], 0, 7.9, 0.3);
    write("#b-vN", 8.3, 0.2); write("#b-vS", 8.45, 0.2);

    // 2. One question: north or south?
    draw("#b-bub1", T.question - 0.15, 0.6);
    write("#b-ask", T.north2 - 0.1, 0.9);
    toGold(["#b-vN", "#b-vS"], T.north2, 0.2); toInk(["#b-vN", "#b-vS"], 12.5, 0.3);
    tl.fromTo(["#b-vN", "#b-vS"], { scale: 1 }, { scale: 1.3, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" }, T.north2);

    // 3. One word, then it swings to point exactly that way
    blurOut(["#b-bub1", "#b-ask"], T.answers - 0.05);
    draw("#b-bub2", T.answers + 0.1, 0.5);
    write("#b-reply", T.word - 0.1, 0.45);
    draw("#b-vmotion", T.swings, 0.3); fade("#b-vmotion", 0, T.swings + 0.8, 0.4);
    toGold("#b-vN", T.swings + 0.3, 0.2); draw("#b-ntick", T.swings + 0.45, 0.3);

    // 4. A qubit's state is an arrow on a globe
    blurOut(["#b-bub2", "#b-reply"], T.qubit4 - 0.25);
    fade("#b-ntick", 0, T.qubit4 - 0.25, 0.25); toInk("#b-vN", T.qubit4, 0.3);
    move("#b-vane", { x: 0, y: 0, scale: 1, opacity: 1 }, { x: 700, y: -270, scale: 0.3, opacity: 0.5 }, T.qubit4, 0.9);
    write("#b-state", T.state4 - 0.1, 0.4);
    write("#b-every", T.every, 0.9);
    draw("#b-arrowA", T.arrow4 - 0.1, 0.6);
    draw("#b-gl-body", T.globe - 0.1, 1.4);
    draw(["#b-pn", "#b-ps"], T.globe + 1.0, 0.3);
    draw("#b-tieg", T.arrow4 + 0.4, 0.3);

    // 5. Straight up is |0>, a zero in a bracket called a ket
    fade(["#b-state", "#b-every", "#b-tie"], 0, T.straight5 - 0.1, 0.3);
    fade("#b-pn-g", 1, T.north5, 0.2);
    write("#b-k0", T.ket0 - 0.05, 0.45); toGold("#b-k0", T.ket0 + 0.3, 0.2);
    tl.fromTo("#b-k0", { scale: 1 }, { scale: 1.3, duration: 0.3, ease: "back.out(2)" }, T.bracket);
    tl.to("#b-k0", { scale: 1, duration: 0.4, ease: "power2.inOut" }, T.bracket + 1.0);
    draw("#b-curls", T.bracket, 0.4);
    write("#b-aket", T.called, 0.4);
    fade(["#b-curls", "#b-aket"], 0, 26.6, 0.3);

    // 6. Straight down is |1>; every direction is a good state
    fade("#b-pn-g", 0, T.straight6 + 0.2, 0.3); toInk("#b-k0", T.straight6 + 0.2);
    write("#b-k1", T.ket1 - 0.05, 0.45); toGold("#b-k1", T.ket1 + 0.25, 0.2);
    fade("#b-ps-g", 1, T.ket1 + 0.25, 0.2);
    fade("#b-ps-g", 0, 29.1, 0.3); toInk("#b-k1", 29.1);
    draw("#b-ghost1", T.direction, 0.35); draw("#b-ghost2", T.direction + 0.4, 0.35); draw("#b-ghost3", T.direction + 0.8, 0.35);
    fade(["#b-ghost1", "#b-ghost2", "#b-ghost3"], 0, 30.6, 0.3);
    draw("#b-goodtick", T.good - 0.1, 0.35); fade("#b-goodtick", 0, 31.3, 0.3);

    // 7. The catch: the arrow is hidden, and measuring gives 0 or 1
    move("#b-cloud", { x: -240, opacity: 0 }, { x: 0, opacity: 1 }, T.never - 0.25, 0.8, "power2.out");
    tl.set("#b-cloud", { opacity: 0 }, 0);
    draw("#b-eye1g", T.never + 0.3, 0.6); write("#b-cantsee", T.never + 0.6, 0.8);
    draw("#b-mbox", T.measuring - 0.1, 0.7); draw("#b-needle1", T.measuring + 0.4, 0.2);
    write("#b-measlbl", T.measuring + 0.2, 0.45);
    draw("#b-marrow", T.measuring + 0.5, 0.35);
    draw("#b-mout", T.zero7 - 0.25, 0.2);
    write("#b-out0", T.zero7, 0.18); write("#b-outor", T.zero7 + 0.22, 0.15); write("#b-out1", T.one7, 0.18);
    tl.to("#b-cloud", { y: -70, opacity: 0, duration: 0.45, ease: "power2.in" }, 35.85);

    // 8. Closer to north, more likely 0 (bars follow the arrow)
    blurOut(["#b-meas", "#b-eye1", "#b-cantsee"], T.l8 - 0.05);
    draw(["#b-bframe0", "#b-bframe1", "#b-bbase"], T.closer - 0.1, 0.9);
    write("#b-bl0", T.closer + 0.4, 0.15); write("#b-bl1", T.closer + 0.55, 0.15);
    write(["#b-pct0", "#b-pct1"], T.closer + 0.3, 0.4);

    // 9. On the equator 50/50; below it 1 is more likely
    fade("#b-gl-eqgold", 1, T.equator - 0.05, 0.3); fade("#b-gl-eqgold", 0, T.below, 0.35);
    fade("#b-5050", 1, T.fifty, 0.01); write("#b-5050", T.fifty, 0.45); fade("#b-5050", 0, T.below, 0.3);

    // 10. Like the vane: it answers and the arrow snaps
    fade("#b-vane", 1, T.vane10 - 0.2, 0.3);
    write("#b-ans1", T.answers10, 0.12);
    tl.fromTo("#b-ans1", { scale: 0.4 }, { scale: 1, duration: 0.35, ease: "back.out(2.4)" }, T.answers10);
    draw("#b-snapticks", T.snaps + 0.1, 0.2); fade("#b-snapticks", 0, T.snaps + 0.7, 0.3);
    toGold("#b-k1", T.snaps + 0.1, 0.15); fade("#b-ps-g", 1, T.snaps + 0.1, 0.15);

    // 11. The analogy breaks: you could look at a real vane
    blurOut(["#b-bars", "#b-ans1", "#b-arrowA"], T.l11 - 0.05);
    fade("#b-ps-g", 0, T.l11, 0.3); toInk("#b-k1", T.l11);
    fade("#b-globe", 0.35, T.l11, 0.4);
    tl.to("#b-vane", { x: 410, y: -20, scale: 0.72, duration: 0.9, ease: "power2.inOut" }, T.vane11 - 0.2);
    draw("#b-crackg", T.breaks, 0.45);
    draw("#b-eye2g", T.look - 0.2, 0.5); fade("#b-sight", 1, T.look + 0.2, 0.3); write("#b-canSee", T.look - 0.1, 0.6);

    // 12. Nobody can see a qubit's arrow: measure many copies and count
    blurOut(["#b-vane", "#b-crack", "#b-see"], T.l12 - 0.05);
    fade("#b-globe", 1, T.l12, 0.4);
    draw("#b-eye3g", T.see - 0.1, 0.5); draw("#b-eye3x", T.see + 0.3, 0.4);
    fade("#b-qmark", 1, T.see + 0.4, 0.4);
    ${JSON.stringify(SG.map((_, i) => i))}.forEach((i) => draw("#b-sg" + i, T.many + i * 0.26, 0.4));
    write("#b-prep", T.prepared, 0.8);
    draw("#b-grid", T.count - 0.25, 0.4);
    const CELL0 = T.count + 0.1, CELLDT = 0.072, OUT = ${JSON.stringify(OUT)};
    OUT.forEach((_, i) => write("#b-cell" + i, CELL0 + i * CELLDT, 0.1));
    write("#b-count", CELL0, 0.3);

    // 13. The counts tell us the tilt
    fade("#b-count", 0, T.counts - 0.1, 0.2);
    fade("#b-countp", 1, T.counts, 0.01); write("#b-countp", T.counts, 0.6);
    fade("#b-qmark", 0, T.arrow13 - 0.3, 0.25);
    draw("#b-arrowB", T.arrow13 - 0.1, 0.6);
    write("#b-tiltlbl", T.tilts + 0.3, 0.3);
    fade("#b-tiltlbl", 0, T.l14 + 0.1, 0.3);

    // 14. Not secretly 0 or 1: it truly points in between
    blurOut(["#b-many", "#b-eye3"], T.l14 + 0.05);
    draw("#b-table", T.secretly - 0.3, 0.3); draw("#b-cupbody", T.secretly - 0.15, 0.8);
    write("#b-secret", T.secretly + 0.3, 0.8);
    tl.fromTo("#b-cupbody", { y: 0, rotation: 0 }, { y: -64, rotation: -7, svgOrigin: "1540 556", duration: 0.45, ease: "power2.out" }, T.waiting);
    tl.to("#b-cupbody", { y: 0, rotation: 0, svgOrigin: "1540 556", duration: 0.35, ease: "power2.in" }, T.waiting + 0.75);
    draw("#b-cupx", T.found - 0.1, 0.45);
    blurOut("#b-cup", T.truly - 0.15);
    fade("#b-glow", 1, T.truly, 0.4);
    write("#b-between", T.truly + 0.05, 0.8);

    // 15. In symbols
    blurOut("#b-between", T.symbols - 0.2);
    fade("#b-glow", 0, T.symbols - 0.2, 0.3);
    tl.to("#b-globe", { x: -300, scale: 0.741, duration: 0.9, ease: "power2.inOut" }, T.symbols);
    write("#b-fa", T.state15 - 0.1, 0.5);
    write("#b-thestate", T.state15 + 0.15, 0.5);
    write(["#b-fb"], T.alpha, 0.2); write("#b-fc", T.alpha + 0.3, 0.35);
    write("#b-fd", T.plus, 0.15);
    write("#b-fe", T.beta, 0.2); write("#b-ff", T.beta + 0.3, 0.35);
    toGold(["#b-fb", "#b-fe"], T.numbers - 0.1, 0.3);
    draw("#b-minia", T.numbers, 0.35); draw("#b-minibars", T.numbers + 0.2, 0.5);
    write("#b-asq", T.squared, 0.3); write("#b-bsq", T.squared + 0.25, 0.3);
    write("#b-odds", T.odds - 0.1, 0.45);

    // 16. The state is the arrow; a measurement hands you one bit
    blurOut(["#b-mini"], T.l16 - 0.05);
    toInk(["#b-fb", "#b-fe"], T.l16, 0.3);
    tl.to("#b-formula", { y: -150, scale: 0.7, duration: 0.8, ease: "power2.inOut" }, T.l16);
    write("#b-steq", T.arrow16 - 0.15, 0.7); draw("#b-cl-under", T.arrow16 + 0.5, 0.4);
    draw("#b-cl-arrow", T.measurement - 0.1, 0.5); draw("#b-cl-box", T.measurement + 0.3, 0.5);
    draw("#b-needle2", T.measurement + 0.7, 0.2); write("#b-meas2", T.measurement + 0.45, 0.45);
    draw("#b-cl-out", T.one16 - 0.35, 0.2);
    write("#b-bit0", T.one16 - 0.1, 0.2); draw("#b-cl-bitbox", T.one16, 0.4);
    write("#b-onebit", T.one16 + 0.05, 0.4);
    tl.fromTo("#b-steq", { scale: 1 }, { scale: 1.05, duration: 0.9, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.one16 + 0.4);

    // ---------- Continuous values ----------
    const EASE = { io: (u) => 0.5 - 0.5 * Math.cos(Math.PI * u), o2: (u) => 1 - (1 - u) * (1 - u), o3: (u) => 1 - Math.pow(1 - u, 3) };
    function seg(list, t, v0) {
      let v = v0;
      for (const [a, b, f, to, e] of list) { if (t <= a) break; v = t >= b ? to : f + (to - f) * EASE[e || "io"]((t - a) / (b - a)); }
      return v;
    }
    const VANE = [[9.0, 10.6, 60, 500], [10.6, 12.5, 500, 410], [T.swings, T.swings + 0.5, 410, 360, "o2"], [T.vane10, T.vane10 + 0.7, 360, 540]];
    const TILT = [[T.straight5, T.straight5 + 0.8, 40, 0], [T.straight6, T.straight6 + 1.0, 0, 180], [T.direction, 30.9, 180, 60],
      [T.north8, 39.3, 60, 15], [T.equator, T.fifty + 0.1, 15, 90], [T.below, 43.5, 90, 135], [T.snaps, T.snaps + 0.25, 135, 180, "o3"],
      [T.l11 + 1, T.l11 + 1.05, 180, 60]];
    const ARCVIS = [[T.north8, T.north8 + 0.5, 0, 1], [40.4, 40.75, 1, 0], [T.tilts, T.tilts + 0.6, 0, 1], [T.l14 + 0.1, T.l14 + 0.5, 1, 0]];
    const GROW = [[T.closer + 0.2, T.closer + 0.9, 0, 1]];
    const COLLAPSE = [[T.answers10, T.answers10 + 0.3, 0, 1, "o2"]];
    const ARCFRAC = ${JSON.stringify(tiltArc.frac)};
    const BAR = ${JSON.stringify(BAR)};
    const vrot = $("b-vrot"), arot = $("b-arot"), arc = $("b-tiltarc");
    const fracAt = (deg) => { const x = Math.max(0, Math.min(180, deg)), i = Math.min(179, Math.floor(x)), u = x - i; return ARCFRAC[i] + (ARCFRAC[i + 1] - ARCFRAC[i]) * u; };
    function tiltAt(t) {
      let a = seg(TILT, t, 40);
      if (t > T.arrow16) a += 3.5 * Math.sin((t - T.arrow16) * 1.3);
      return a;
    }
    onFrame((t) => {
      // the vane: wind wobble until it is told the answer
      let v = seg(VANE, t, 60);
      if (t < T.swings) v += 3 * Math.sin(t * 2.3) + 1.6 * Math.sin(t * 3.9 + 1);
      vrot.setAttribute("transform", "translate(960 440) rotate(" + v.toFixed(2) + ")");
      // the state arrow on the globe
      const a = tiltAt(t);
      arot.setAttribute("transform", "translate(720 470) rotate(" + a.toFixed(2) + ")");
      // gold arc from the north pole to the arrow tip
      const vis = seg(ARCVIS, t, 0);
      arc.style.strokeDasharray = "1 2";
      arc.style.strokeDashoffset = String(1 - fracAt(a * vis));
      arc.style.opacity = vis > 0.01 ? "1" : "0";
      // probability bars: P(0) = cos^2(tilt/2), P(1) = sin^2(tilt/2)
      let p1 = Math.pow(Math.sin((a * Math.PI) / 360), 2);
      const c = seg(COLLAPSE, t, 0);
      p1 = p1 + (1 - p1) * c;
      const ps = [1 - p1, p1], grow = seg(GROW, t, 0);
      ps.forEach((p, i) => {
        const hgt = BAR.h * p * grow;
        const cr = $("b-crect" + i);
        cr.setAttribute("y", (BAR.base - hgt).toFixed(2)); cr.setAttribute("height", hgt.toFixed(2));
        $("b-lvl" + i).setAttribute("transform", "translate(0 " + (-hgt).toFixed(2) + ")");
        const lead = p - ps[1 - i] > 0.02;
        $("b-fill" + i + "g").style.opacity = lead ? "1" : "0"; $("b-lvl" + i + "g").style.opacity = lead ? "1" : "0";
        $("b-fill" + i + "i").style.opacity = lead ? "0" : "1"; $("b-lvl" + i + "i").style.opacity = lead ? "0" : "1";
        $("b-pv" + i).textContent = String(Math.round(p * 100));
        $("b-pct" + i).style.color = lead ? GOLDC : INKC;
        $("b-bl" + i).style.color = lead ? GOLDC : INKC;
      });
      // meter needles
      $("b-needle1").setAttribute("transform", "rotate(" + (38 * Math.sin(t * 3.1) + 14 * Math.sin(t * 7.3)).toFixed(2) + ")");
      const n2 = t < T.one16 ? 34 * Math.sin(t * 3.4) + 12 * Math.sin(t * 6.1) : -48 + 4 * Math.sin(t * 2.0) * Math.exp(-(t - T.one16) * 0.8);
      $("b-needle2").setAttribute("transform", "rotate(" + n2.toFixed(2) + ")");
      // the tally: counts of the answers written so far
      let n0 = 0, n1 = 0;
      OUT.forEach((d, i) => { if (t >= CELL0 + i * CELLDT + 0.05) { if (d === "0") n0++; else n1++; } });
      $("b-n0").textContent = String(n0); $("b-n1").textContent = String(n1);
    });
  `;
  return { html, script, css };
}
