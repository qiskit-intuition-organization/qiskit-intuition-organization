// Lesson 5, "Superposition with H". Beat plan: plan.md. Drawings follow the voice word by word.
// Pictures: random/certain readings -> spinning coin -> arrow in a ball with live bars and a
// circuit strip -> compass needle pointing east -> a tally of fresh readings -> H again brings it
// home -> the compass breaks -> the snap -> the equation -> closing picture.
export const phrases = [
  ["ket zero plus ket one", "|0⟩ + |1⟩"],
  ["one over root two", "1/√2"],
  ["ket zero", "|0⟩"],
  ["ket one", "|1⟩"],
  ["ket plus", "|+⟩"],
  ["root two", "√2"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, lines, TOTAL, INK, GOLD, GROUND, DIM } = k;
  const PI = Math.PI;
  const rad = (d) => (d * PI) / 180;
  const f1 = (v) => +v.toFixed(1);

  // A word as the transcriber wrote it (for joined words such as "Hfor" or "Htips").
  const said = (line, word, nth = 0) => {
    const n = (s) => s.toLowerCase().replace(/[^a-z']/g, "");
    const hits = lines[line].words.filter((w) => n(w.w) === n(word));
    if (!hits[nth]) throw new Error(`said: "${word}" not in transcript of line ${line}`);
    return hits[nth].start;
  };

  // ---------- Times (seconds), cued to the spoken words ----------
  const T = {
    random0: cue(0, "random"), undo: cue(0, "undo"), certain: cue(0, "certain"),
    l1: cue(1), coin: cue(1, "coin"), spins: cue(1, "spins"), starting: cue(1, "starting"), lost: said(2, "lost"),
    l2: cue(2), draw2: cue(2, "draw"), arrow2: cue(2, "arrow"), ball: cue(2, "ball"), up2: cue(2, "up"), down2: cue(2, "down"), one2: said(3, "one"),
    ket3: cue(3, "ket"), always: cue(3, "always"),
    l4: cue(4), hadamard: cue(4, "hadamard"), h4: said(4, "Hfor"), gate4: cue(4, "gate", 1), turns4: cue(4, "turns"),
    tipping: cue(4, "tipping"), equator4: cue(4, "equator"), facing: cue(4, "facing"),
    l5: cue(5), compass: cue(5, "compass"), needle: cue(5, "needle"), north5: cue(5, "north"), south5: cue(5, "south"), points: cue(5, "points"),
    l6: cue(6), definite: cue(6, "definite"), question: cue(6, "question"), north6: cue(6, "north"), south6: cue(6, "south"), good: cue(6, "good"),
    l7: cue(7), asking: cue(7, "asking"), measuring7: cue(7, "measuring"), half7: cue(7, "half"),
    l8: cue(8), measuring8: cue(8, "measuring"), apply8: cue(8, "apply"), h8: said(8, "Hagain"), tips8: cue(8, "tips"),
    l9: cue(9), reads9: cue(9, "reads"), nothing: cue(9, "nothing"),
    l10: cue(10), coin10: cue(10, "coin"), toss: cue(10, "toss"), turn10: cue(10, "turn"), same: cue(10, "same"), undoes: cue(10, "undoes"),
    l11: cue(11), measure11: cue(11, "measure"), between: cue(11, "between"), up11: cue(11, "up"), down11: said(12, "down"),
    l12: cue(12), compass12: cue(12, "compass"), breaks: cue(12, "breaks"), answer12: cue(12, "answer"), neither: cue(12, "neither"),
    l13: cue(13), qubit13: cue(13, "qubit"), zero13: cue(13, "zero"), one13: cue(13, "one"), becomes: cue(13, "becomes"),
    l14: cue(14), h14: said(14, "Hturns"), ket14a: cue(14, "ket"), ket14b: cue(14, "ket", 1), ket14c: cue(14, "ket", 2),
    plus14: cue(14, "plus", 1), ket14d: cue(14, "ket", 3), weighted: cue(14, "weighted"), root: cue(14, "root"),
    l15: cue(15), chance: cue(15, "chance"), half15: cue(15, "half"),
    tips16: said(16, "Htips") + 0.25, definite16: cue(16, "definite"), random16: cue(16, "random"), second: cue(16, "second"), home: cue(16, "home"),
  };
  T.close = T.half15 + 0.55; // the closing picture assembles as "half" ends and "So" begins
  T.tips16 = Math.max(T.tips16, T.close + 0.75);

  // ---------- Helpers ----------
  const G = `color:${GOLD};`;
  // A full-board layer: its SVG and labels use board coordinates.
  const layer = (id, svg, labels = "", style = "") =>
    `<div id="${id}" class="obj" data-layout-allow-overflow style="left:0;top:0;width:1920px;height:1080px;${style}"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${labels}</div>`;
  const g = (id, inner, attrs = "") => `<g id="${id}" ${attrs}>${inner}</g>`;
  const thin = (o = {}) => pen({ strokeWidth: 2.2, ...o });
  const dim = (o = {}) => pen({ stroke: DIM, strokeWidth: 2.4, ...o });
  const solid = (c) => pen({ stroke: "none", fill: c, fillStyle: "solid" });
  const hatch = (c, o = {}) => pen({ stroke: "none", fill: c, fillStyle: "hachure", hachureGap: 10, fillWeight: 2, ...o });
  // Labels centred on (cx, cy), or left / right aligned at x.
  const L = (id, cx, cy, size, text, w, extra = "") => lbl(id, f1(cx - w / 2), f1(cy - size * 0.745), w, size, text, extra);
  const LL = (id, x, cy, size, text, w, extra = "") => lbl(id, x, f1(cy - size * 0.745), w, size, text, "text-align:left;" + extra);
  const LR = (id, xr, cy, size, text, w, extra = "") => lbl(id, xr - w, f1(cy - size * 0.745), w, size, text, "text-align:right;" + extra);
  // A curved hand-drawn arrow along points, head at the last point.
  const curvedArrow = (pts, o = {}, head = 18) => {
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const hp = (da) => [b[0] - head * Math.cos(ang + da), b[1] - head * Math.sin(ang + da)];
    const [h1, h2] = [hp(0.5), hp(-0.5)];
    return r.curve(pts, pen(o)) + r.line(b[0], b[1], h1[0], h1[1], pen({ ...o, strokeWidth: (o.strokeWidth ?? 3) * 0.85 })) +
      r.line(b[0], b[1], h2[0], h2[1], pen({ ...o, strokeWidth: (o.strokeWidth ?? 3) * 0.85 }));
  };
  // The measurement symbol: a box, a half dial and a needle (rotated at run time).
  const meter = (id, cx, cy, w, h) => {
    const py = cy + h * 0.28, ar = w * 0.32;
    return g(id + "-body",
      r.rect(cx - w / 2, cy - h / 2, w, h, pen({ strokeWidth: 3, roughness: 1, fill: GROUND, fillStyle: "solid" })) +
      r.arc(cx, py, ar * 2, ar * 2, PI * 1.06, PI * 1.94, false, thin({ roughness: 0.8 }))) +
      `<g transform="translate(${cx} ${f1(py)})"><g id="${id}-n" transform="rotate(-35)">${r.line(0, 0, 0, -ar * 1.1, pen({ strokeWidth: 3.2, roughness: 0.6 }))}${r.circle(0, 0, 14, solid(INK))}</g></g>`;
  };

  // ---------- 0. Readings: random, then certain again ----------
  const R1 = "1001101".split(""), R2 = "0000000".split("");
  const rowX = (i) => 960 + (i - 3) * 72;
  const rowsHtml = layer("b-rows",
    g("b-loop", curvedArrow([[1232, 412], [1330, 430], [1372, 500], [1330, 570], [1236, 592]], { stroke: GOLD, strokeWidth: 3.6 }, 20)),
    R1.map((d, i) => L(`b-ra${i}`, rowX(i), 412, 66, d, 60)).join("") +
    L("b-rlbl1", 960, 482, 44, "random", 200) +
    R2.map((d, i) => L(`b-rb${i}`, rowX(i), 592, 66, d, 60, G)).join("") +
    L("b-rlbl2", 960, 662, 44, "certain", 200, G) +
    LL("b-undo", 1392, 502, 46, "undo", 120, G));

  // ---------- 1. The coin ----------
  const coinFace =
    g("b-coing", r.circle(120, 120, 220, pen({ strokeWidth: 3.4, roughness: 0.9 })) + r.circle(120, 120, 176, thin({ roughness: 1.1 })) +
      r.circle(120, 120, 176, hatch(DIM, { hachureGap: 14, fillWeight: 1.4, hachureAngle: -35 })));
  const coinHtml = layer("b-coinL",
    g("b-spinarcs",
      r.arc(960, 440, 330, 330, PI * 0.78, PI * 1.22, false, thin()) + r.arc(960, 440, 380, 380, PI * 0.85, PI * 1.15, false, thin()) +
      r.arc(960, 440, 330, 330, -PI * 0.22, PI * 0.22, false, thin()) + r.arc(960, 440, 380, 380, -PI * 0.15, PI * 0.15, false, thin())) +
    g("b-scribble", r.linear([[1192, 372], [1230, 352], [1256, 384], [1290, 350], [1318, 384], [1352, 352], [1378, 380]], pen({ strokeWidth: 3.4 }))),
    `<div id="b-coin" class="obj" style="left:840px;top:350px;width:240px;height:240px">` +
      `<svg class="sk" width="240" height="240" viewBox="0 0 240 240">${coinFace}</svg>` +
      L("b-cf0", 120, 122, 110, "0", 100) + L("b-cf1", 120, 122, 110, "1", 100) + `</div>` +
    LL("b-start", 1190, 368, 50, "start: 0", 220) +
    L("b-qcoin", 960, 230, 110, "?", 100));

  // ---------- 2. The ball (centre 700, 480) ----------
  const C = { x: 700, y: 480 }, RB = 250, EQY = 72, LEN = 240;
  const FX = -Math.SQRT1_2 * RB, FY = Math.SQRT1_2 * EQY; // "facing you": front-left point of the equator
  const tipAt = (deg, s = 1) => [C.x + s * Math.sin(rad(deg)) * FX, C.y + s * (Math.sin(rad(deg)) * FY - Math.cos(rad(deg)) * LEN)];
  const arcPts = (s, a0, a1) => Array.from({ length: 9 }, (_, i) => tipAt(a0 + ((a1 - a0) * i) / 8, s));
  const [tx90, ty90] = tipAt(90);
  const ballSvg =
    // Every arrow between the poles gives random answers: the hatch is strongest at the equator
    // and fades to nothing at the two poles, where the answer is certain.
    `<defs><linearGradient id="b-bandgrad" gradientUnits="userSpaceOnUse" x1="0" y1="${C.y - RB}" x2="0" y2="${C.y + RB}">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<mask id="b-bandmask" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><rect x="0" y="0" width="1920" height="1080" fill="url(#b-bandgrad)"/></mask></defs>` +
    g("b-band", `<g mask="url(#b-bandmask)">${r.circle(C.x, C.y, RB * 2 - 14, hatch(GOLD, { hachureGap: 13, fillWeight: 1.6, hachureAngle: -40 }))}</g>`, `style="opacity:0.7"`) +
    g("b-ballbody",
      r.circle(C.x, C.y, RB * 2, pen({ strokeWidth: 3.2, roughness: 0.8, seed: 4242 })) +
      r.arc(C.x, C.y, RB * 2, EQY * 2, PI, 2 * PI, false, dim({ strokeWidth: 2.2 })) +
      r.arc(C.x, C.y, RB * 2, EQY * 2, 0, PI, false, pen({ strokeWidth: 2.6 }))) +
    g("b-eqgold", r.ellipse(C.x, C.y, RB * 2, EQY * 2, goldPen({ strokeWidth: 4.4 }))) +
    g("b-pole0", r.circle(C.x, C.y - RB, 14, solid(INK))) + g("b-pole1", r.circle(C.x, C.y + RB, 14, solid(INK))) +
    g("b-ghostD", arrow(C.x, C.y, C.x, C.y + LEN, { stroke: DIM, strokeWidth: 3.4 }, 26)) +
    g("b-ghostE", arrow(C.x, C.y, f1(tx90), f1(ty90), { stroke: DIM, strokeWidth: 3.4 }, 24)) +
    g("b-carc1", curvedArrow(arcPts(1.16, 15, 82), { strokeWidth: 3 }, 18)) +
    g("b-carc2", curvedArrow(arcPts(0.66, 80, 10), { strokeWidth: 3 }, 16)) +
    g("b-facearr", arrow(392, 612, 506, 546, { strokeWidth: 2.6 }, 14)) +
    `<g id="b-shaftT" transform="translate(${C.x} ${C.y})">${g("b-shaft", r.line(0, 0, 0, -LEN, goldPen({ strokeWidth: 6, roughness: 0.7 })))}</g>` +
    `<g id="b-headT" transform="translate(${C.x} ${C.y - LEN})">${g("b-head", r.line(0, 0, -16, 30, goldPen({ strokeWidth: 5, roughness: 0.5 })) + r.line(0, 0, 16, 30, goldPen({ strokeWidth: 5, roughness: 0.5 })))}</g>` +
    `<g id="b-dotT" transform="translate(${C.x} ${C.y - LEN})">${g("b-tipdot", r.circle(0, 0, 18, solid(GOLD)))}</g>` +
    g("b-cdot", r.circle(C.x, C.y, 16, solid(INK)));
  const ballHtml = layer("b-ball", ballSvg,
    L("b-p0", C.x, 186, 56, "0", 70) + L("b-p1", C.x, 778, 56, "1", 70) +
    LL("b-ket0", 752, 226, 64, "|0⟩", 140, G) +
    LL("b-facing", 170, 628, 46, "facing you", 230) +
    L("b-hl1", tipAt(44, 1.5)[0], tipAt(44, 1.5)[1], 50, "H", 60) +
    L("b-hl2", tipAt(44, 0.48)[0] + 4, tipAt(44, 0.48)[1] + 6, 50, "H", 60) +
    LL("b-hh1", 170, 660, 56, "H then H:", 300) + LL("b-hh2", 170, 726, 56, "back home", 300, G) +
    LR("b-randans", 434, 478, 44, "random answers", 300, G) +
    LL("b-cert0", 748, 188, 44, "certain", 160) + LL("b-cert1", 748, 780, 44, "certain", 160),
    `transform-origin:${C.x}px ${C.y}px`);

  // ---------- Bars: chance of reading 0 and 1 (follow the arrow) ----------
  const BAR = { x: [1220, 1450], w: 150, base: 770, h: 400 };
  const barSvg = BAR.x.map((x, i) =>
    g(`b-bframe${i}`, r.rect(x, BAR.base - BAR.h, BAR.w, BAR.h, dim({ strokeWidth: 2 }))) +
    `<clipPath id="b-clip${i}"><rect id="b-crect${i}" x="${x - 6}" y="${BAR.base}" width="${BAR.w + 12}" height="0"/></clipPath>` +
    `<g clip-path="url(#b-clip${i})">` +
    g(`b-fill${i}i`, r.rect(x + 3, BAR.base - BAR.h, BAR.w - 6, BAR.h, hatch(INK, { fillWeight: 1.8 }))) +
    g(`b-fill${i}g`, r.rect(x + 3, BAR.base - BAR.h, BAR.w - 6, BAR.h, hatch(GOLD, { hachureGap: 9, fillWeight: 2.2 }))) + `</g>` +
    `<g id="b-lvl${i}">${g(`b-lvl${i}i`, r.line(x - 4, BAR.base, x + BAR.w + 4, BAR.base, pen({ strokeWidth: 3.4 })))}` +
    `${g(`b-lvl${i}g`, r.line(x - 4, BAR.base, x + BAR.w + 4, BAR.base, goldPen({ strokeWidth: 4 })))}</g>`).join("") +
    g("b-bbase", r.line(1190, BAR.base, 1630, BAR.base, pen({ strokeWidth: 3.2 })));
  const barsHtml = layer("b-bars", barSvg,
    BAR.x.map((x, i) => L(`b-bl${i}`, x + BAR.w / 2, 808, 52, String(i), 80) + L(`b-pct${i}`, x + BAR.w / 2, 330, 48, `<span id="b-pv${i}">0</span>%`, 180)).join(""),
    `transform-origin:1410px 770px`);

  // ---------- Circuit strip (top right) ----------
  const strip =
    g("b-wire", r.line(1180, 150, 1240, 150, pen({ strokeWidth: 2.6 })) + r.line(1330, 150, 1572, 150, pen({ strokeWidth: 2.6 }))) +
    g("b-h1box", r.rect(1240, 108, 90, 84, pen({ strokeWidth: 3, fill: GROUND, fillStyle: "solid" }))) +
    g("b-h1gold", r.rect(1240, 108, 90, 84, goldPen({ strokeWidth: 4 }))) +
    g("b-h2box", r.rect(1400, 108, 90, 84, pen({ strokeWidth: 3, fill: GROUND, fillStyle: "solid" }))) +
    g("b-h2gold", r.rect(1400, 108, 90, 84, goldPen({ strokeWidth: 4 }))) +
    g("b-mstub", r.line(1568, 150, 1592, 150, pen({ strokeWidth: 2.6 }))) + meter("b-m1", 1650, 150, 116, 84) +
    g("b-mcross", r.line(1582, 100, 1718, 200, pen({ strokeWidth: 4 })) + r.line(1718, 100, 1582, 200, pen({ strokeWidth: 4 })));
  const stripHtml = layer("b-strip", strip,
    L("b-sk0", 1130, 152, 60, "|0⟩", 110) + L("b-sh1", 1285, 152, 60, "H", 70, G) + L("b-sh2", 1445, 152, 60, "H", 70, G) +
    L("b-gatenote", 1290, 236, 44, "gate = a turn", 280) +
    L("b-reads", 1250, 244, 56, "0 0 0 0 0 0", 330, G) +
    LL("b-certagain", 1440, 244, 46, "certain again", 260),
    "");
  const readDigits = Array.from({ length: 6 }, (_, i) => i); // the row is written in six steps
  const checkSvg = layer("b-checkL", g("b-check", r.linear([[1698, 236], [1714, 258], [1748, 214]], goldPen({ strokeWidth: 4.4 }))));

  // ---------- Measurement meter beside the bars (line 11) ----------
  const meas2Html = layer("b-meas2", g("b-m2wrap", meter("b-m2", 1300, 196, 130, 92)), L("b-randomlbl", 1480, 198, 52, "random", 200));

  // ---------- Small coin with a cross (line 10) ----------
  const coin2Html = layer("b-coin2",
    g("b-c2", r.circle(1030, 262, 104, pen({ strokeWidth: 3 })) + r.circle(1030, 262, 80, thin()) + r.circle(1030, 262, 80, hatch(DIM, { hachureGap: 12, fillWeight: 1.2 }))) +
    g("b-c2x", r.line(966, 200, 1094, 324, pen({ strokeWidth: 4.4 })) + r.line(1094, 200, 966, 324, pen({ strokeWidth: 4.4 }))));

  // ---------- Compass (centre 960, 480) ----------
  const K = { x: 960, y: 480, R: 240 };
  const kp = (deg, rr) => [K.x + rr * Math.sin(rad(deg)), K.y - rr * Math.cos(rad(deg))];
  const kticks = Array.from({ length: 16 }, (_, i) => {
    const d = i * 22.5, major = i % 4 === 0;
    const [a, b] = [kp(d, major ? 196 : 206), kp(d, 222)];
    return r.line(a[0], a[1], b[0], b[1], pen({ strokeWidth: major ? 3.2 : 2.2, roughness: 0.7 }));
  }).join("");
  const needleShape =
    r.poly([[0, -196], [-20, 0], [20, 0]], goldPen({ strokeWidth: 3.2, fill: GOLD, fillStyle: "hachure", hachureGap: 8, fillWeight: 2 })) +
    r.poly([[0, 196], [-20, 0], [20, 0]], pen({ strokeWidth: 3 })) + r.circle(0, 0, 22, solid(INK));
  const compassSvg =
    g("b-kring", r.circle(K.x, K.y, K.R * 2, pen({ strokeWidth: 3.4, roughness: 0.8 })) + r.circle(K.x, K.y, 446, thin({ roughness: 1.2 })) + kticks) +
    `<g id="b-needleT" transform="translate(${K.x} ${K.y})">${g("b-needle", needleShape)}</g>` +
    g("b-crack", r.linear([[1188, 252], [1162, 282], [1176, 296], [1146, 318], [1158, 334], [1120, 352], [1128, 368], [1096, 384]], pen({ strokeWidth: 4 })) +
      r.linear([[1146, 318], [1124, 312]], pen({ strokeWidth: 2.6 })) + r.linear([[1158, 334], [1178, 348]], pen({ strokeWidth: 2.6 })));
  const compassHtml = layer("b-compass", compassSvg,
    L("b-kN", K.x, 196, 64, "N", 80) + L("b-kS", K.x, 768, 64, "S", 80) +
    L("b-kE", 1236, 482, 48, "E", 60) + L("b-kW", 684, 482, 48, "W", 60) +
    LL("b-kn0", 1004, 196, 56, "= 0", 120) + LL("b-ks1", 1004, 768, 56, "= 1", 120),
    `transform-origin:${K.x}px ${K.y}px`);
  // Dotted lines from the tip to N and S, with equal-length ticks.
  const dots = (id, a, b, n) => Array.from({ length: n }, (_, i) => {
    const u = (i + 0.5) / n;
    return `<circle class="${id}" cx="${f1(a[0] + (b[0] - a[0]) * u)}" cy="${f1(a[1] + (b[1] - a[1]) * u)}" r="4" fill="${INK}"/>`;
  }).join("");
  const TIP = [1156, 480];
  const eqTick = (a, b) => {
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = [-(b[1] - a[1]) / d, (b[0] - a[0]) / d];
    return [-7, 7].map((o) => {
      const c = [m[0] + ((b[0] - a[0]) / d) * o, m[1] + ((b[1] - a[1]) / d) * o];
      return r.line(c[0] - n[0] * 14, c[1] - n[1] * 14, c[0] + n[0] * 14, c[1] + n[1] * 14, goldPen({ strokeWidth: 3 }));
    }).join("");
  };
  const askHtml = layer("b-ask",
    `<g id="b-dotsN">${dots("b-dn", TIP, [K.x, K.y - K.R + 4], 22)}</g><g id="b-dotsS">${dots("b-ds", TIP, [K.x, K.y + K.R - 4], 22)}</g>` +
    g("b-eqticks", eqTick(TIP, [K.x, K.y - K.R]) + eqTick(TIP, [K.x, K.y + K.R])) +
    g("b-defline", r.curve([[1296, 612], [1420, 604], [1560, 610], [1690, 600]], goldPen({ strokeWidth: 4 }))),
    LL("b-nos", 1296, 372, 56, "north or south?", 420) +
    LL("b-def", 1296, 568, 52, "a definite direction", 430) +
    LL("b-eqfar", 1296, 690, 48, "equally far", 300, G));
  const nos2 = L("b-nos2", 520, 214, 48, "north or south?", 420);

  // Speech bubble for "neither!"
  const bubbleHtml = layer("b-bubble",
    g("b-bub", r.ellipse(1500, 300, 360, 160, pen({ strokeWidth: 3 })) + r.linear([[1400, 360], [1192, 452], [1436, 372]], pen({ strokeWidth: 3 }))),
    L("b-neither", 1500, 302, 64, "neither!", 300));

  // ---------- Tally board (line 7) ----------
  const OUT = "0110100111000110".split("");
  const slot = [0, 0];
  const cells = OUT.map((d, i) => {
    const c = +d, j = slot[c]++;
    return L(`b-tc${i}`, 1040 + c * 310 + 70 + (j % 4) * 58, 372 + Math.floor(j / 4) * 64, 52, d, 50);
  }).join("");
  const tallyHtml = layer("b-tally",
    g("b-tframe", r.rect(1040, 236, 620, 336, pen({ strokeWidth: 3 })) + r.line(1350, 248, 1350, 560, thin()) + r.line(1052, 318, 1648, 318, thin())),
    L("b-measq", 1350, 182, 48, "measuring = asking 0 or 1?", 640) +
    L("b-th0", 1195, 280, 56, "0", 80) + L("b-th1", 1505, 280, 56, "1", 80) + cells +
    L("b-cnt0", 1195, 520, 46, `<span id="b-n0">0</span> of 16`, 240) + L("b-cnt1", 1505, 520, 46, `<span id="b-n1">0</span> of 16`, 240) +
    L("b-fresh", 1350, 612, 42, "each from a fresh qubit", 520) +
    L("b-halfeach", 1350, 700, 80, "half each", 420, G));

  // ---------- Equation (line 14) ----------
  const EQ = { x: 250, y: 330, size: 96 };
  const sp = (id, html, extra = "") => `<span id="${id}" class="fp" style="${extra}">${k.hand(html)}</span>`;
  const eqHtml =
    `<div class="lbl hand" id="b-eq" style="left:${EQ.x}px;top:${EQ.y}px;width:1100px;font-size:${EQ.size}px;text-align:left">` +
    sp("b-e1", "H", "margin-right:0.1em") + sp("b-e2", "|0⟩") + sp("b-e3", "=", "margin:0 0.25em") + sp("b-e4", "|+⟩", G) + sp("b-e5", "=", "margin:0 0.25em") +
    sp("b-e6", "(") + sp("b-e7", "|0⟩") + sp("b-e8", "+", "margin:0 0.22em") + sp("b-e9", "|1⟩") + sp("b-e10", ")") + sp("b-e11", "/√2") + `</div>`;
  const upArrow = (id) => `<svg class="sk" width="140" height="56" viewBox="0 0 140 56" style="position:relative;display:block;margin:0 auto">${g(id, arrow(70, 52, 70, 8, { stroke: GOLD, strokeWidth: 2.8 }, 12))}</svg>`;
  const wNote = (id, aid) =>
    `<div class="lbl hand" id="${id}" style="left:0;top:${EQ.y + 136}px;width:140px;font-size:48px;color:${GOLD};padding:0">${upArrow(aid)}<div>${k.hand("1/√2")}</div></div>`;
  const sqNote = (id, align) =>
    `<div class="lbl hand" id="${id}" style="left:0;top:${EQ.y + 270}px;width:320px;font-size:54px;text-align:${align}">${k.hand("(1/√2)²")} = ½</div>`;
  const eqLayer = eqHtml + wNote("b-w0", "b-wa0") + wNote("b-w1", "b-wa1") + sqNote("b-q0", "right") + sqNote("b-q1", "left");
  const plusTip = LR("b-plustip", 398, 708, 52, "|+⟩", 120, G);

  // Small bars (line 15)
  const SB = { x: [1440, 1590], w: 100, base: 770, h: 240 };
  const sbarSvg = SB.x.map((x, i) =>
    g(`b-sbf${i}`, r.rect(x, SB.base - SB.h, SB.w, SB.h, dim({ strokeWidth: 2 }))) +
    `<clipPath id="b-sclip${i}"><rect id="b-scr${i}" x="${x - 4}" y="${SB.base}" width="${SB.w + 8}" height="0"/></clipPath>` +
    `<g clip-path="url(#b-sclip${i})">${r.rect(x + 3, SB.base - SB.h, SB.w - 6, SB.h, hatch(GOLD, { hachureGap: 9 }))}` +
    `${r.line(x - 3, SB.base - SB.h / 2, x + SB.w + 3, SB.base - SB.h / 2, goldPen({ strokeWidth: 4 }))}</g>`).join("") +
    g("b-sbase", r.line(1410, SB.base, 1720, SB.base, pen({ strokeWidth: 3 })));
  const sbarsHtml = layer("b-sbars", sbarSvg,
    L("b-sb0", 1490, 808, 48, "0", 60) + L("b-sb1", 1640, 808, 48, "1", 60) + L("b-shalf", 1565, 480, 56, "½ each", 220, G));

  // ---------- Closing notes ----------
  const CL = { x: 680, y: 540, s: 0.92 };
  const ctip = [CL.x + CL.s * (tx90 - C.x), CL.y + CL.s * (ty90 - C.y)];
  const closeHtml =
    LR("b-cdef", 440, f1(ctip[1] - 22), 46, "definite state", 320) +
    LR("b-crand", 440, f1(ctip[1] + 40), 46, "random answers", 320) +
    LL("b-chome", 740, 262, 56, "back home", 280, G);

  const html = [
    rowsHtml, coinHtml, ballHtml, barsHtml, stripHtml, checkSvg, meas2Html, coin2Html,
    compassHtml, askHtml, nos2, bubbleHtml, tallyHtml, eqLayer, plusTip, sbarsHtml, closeHtml,
  ].join("\n");

  const css = `
    #root .fp { display: inline-block; }
    #b-eq { transform-origin: 0 50%; }
    #b-coin { transform-origin: 120px 120px; }
  `;

  // ---------- Timeline ----------
  const script = `
    const T = ${JSON.stringify(T)};
    const GOLDC = "${GOLD}", INKC = "${INK}";
    const toGold = (sel, t, d = 0.25) => tl.to(all(sel), { color: GOLDC, duration: d }, t);
    const toInk = (sel, t, d = 0.3) => tl.to(all(sel), { color: INKC, duration: d }, t);
    const unblur = (sel, t) => tl.set(all(sel), { filter: "blur(0px)" }, t);
    const back = (sel, t, d = 0.4) => { unblur(sel, t); fade(sel, 1, t, d); };
    const pulse = (sel, t, s = 1.35) => tl.fromTo(all(sel), { scale: 1 }, { scale: s, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out" }, t);

    hide(["#b-eqgold", "#b-h1gold", "#b-h2gold", "#b-bars", "#b-band"]);
    tl.set("#b-ball", { x: 0, y: 0, scale: 1 }, 0);
    tl.set("#b-compass", { x: 0, y: 0, scale: 1 }, 0);

    // 0. Random, then certain again
    ${JSON.stringify(R1.map((_, i) => i))}.forEach((i) => write("#b-ra" + i, T.random0 - 0.15 + i * 0.07, 0.16));
    write("#b-rlbl1", T.random0 + 0.35, 0.4);
    blurOut("#b-title", T.undo - 0.05);
    draw("#b-loop", T.undo, 0.6); write("#b-undo", T.undo + 0.35, 0.3);
    ${JSON.stringify(R2.map((_, i) => i))}.forEach((i) => write("#b-rb" + i, T.certain - 0.1 + i * 0.07, 0.16));
    write("#b-rlbl2", T.certain + 0.3, 0.4);
    blurOut("#b-rows", T.l1 - 0.05);

    // 1. A tossed coin loses its starting side
    draw("#b-coing", T.coin - 0.15, 0.8);
    write("#b-cf0", T.coin + 0.45, 0.2);
    write("#b-start", T.coin + 0.6, 0.5);
    draw("#b-spinarcs", T.spins, 0.5);
    pulse("#b-start", T.starting, 1.18);
    draw("#b-scribble", T.lost - 0.05, 0.35);
    write("#b-qcoin", T.lost + 0.05, 0.25);
    blurOut("#b-coinL", T.draw2);

    // 2. The qubit as an arrow in a ball
    draw("#b-shaft", T.arrow2 - 0.1, 0.6); draw("#b-head", T.arrow2 + 0.45, 0.25); draw("#b-tipdot", T.arrow2 + 0.5, 0.25);
    draw("#b-cdot", T.arrow2 - 0.1, 0.2);
    draw("#b-ballbody", T.ball - 0.1, 1.6);
    draw("#b-pole0", T.up2, 0.2); write("#b-p0", T.up2, 0.2);
    draw("#b-ghostD", T.down2 - 0.05, 0.45);
    draw("#b-pole1", T.one2 - 0.1, 0.2); write("#b-p1", T.one2 - 0.1, 0.2);
    fade("#b-ghostD", 0, T.one2 + 0.6, 0.4);

    // 3. It starts at |0>: always reads 0
    write("#b-ket0", T.ket3 - 0.05, 0.45);
    show("#b-bars", T.always - 0.15);
    draw(["#b-bframe0", "#b-bframe1", "#b-bbase"], T.always - 0.15, 0.7);
    write(["#b-bl0", "#b-bl1"], T.always + 0.2, 0.2);
    write(["#b-pct0", "#b-pct1"], T.always + 0.3, 0.35);

    // 4. The Hadamard gate tips the arrow onto the equator
    write("#b-sk0", T.hadamard - 0.15, 0.3);
    draw("#b-wire", T.hadamard + 0.1, 0.5);
    draw("#b-h1box", T.hadamard + 0.45, 0.5);
    write("#b-sh1", T.h4 - 0.05, 0.2);
    write("#b-gatenote", T.gate4 - 0.05, 0.8);
    fade("#b-ket0", 0, T.turns4, 0.3);
    fade("#b-h1gold", 1, T.tipping - 0.1, 0.2); fade("#b-h1gold", 0, T.tipping + 1.5, 0.4);
    fade("#b-eqgold", 1, T.equator4 - 0.05, 0.25); fade("#b-eqgold", 0, T.equator4 + 1.0, 0.4);
    write("#b-facing", T.facing - 0.05, 0.5); draw("#b-facearr", T.facing + 0.2, 0.3);
    blurOut(["#b-ball", "#b-bars", "#b-strip"], T.l5 - 0.05);
    tl.set(["#b-facing", "#b-facearr", "#b-gatenote"], { opacity: 0 }, T.l5 + 0.3);

    // 5. A compass needle
    draw("#b-kring", T.compass - 0.1, 1.2);
    draw("#b-needle", T.needle, 0.5);
    write("#b-kN", T.north5 - 0.05, 0.2); write("#b-kn0", T.north5 + 0.2, 0.35);
    write("#b-kS", T.south5 - 0.05, 0.2); write("#b-ks1", T.south5 + 0.2, 0.35);
    write("#b-kE", T.south5 + 0.9, 0.15); write("#b-kW", T.south5 + 1.05, 0.15);

    // 6. A definite direction; only the question has no good answer
    write("#b-def", T.definite - 0.05, 0.9); draw("#b-defline", T.definite + 0.8, 0.5);
    write("#b-nos", T.question - 0.1, 0.8);
    tl.fromTo(all(".b-dn"), { opacity: 0 }, { opacity: 1, duration: 0.04, stagger: 0.022 }, T.north6 - 0.05);
    tl.fromTo(all(".b-ds"), { opacity: 0 }, { opacity: 1, duration: 0.04, stagger: 0.022 }, T.south6 - 0.05);
    draw("#b-eqticks", T.good - 0.2, 0.4);
    write("#b-eqfar", T.good - 0.1, 0.55);
    fade("#b-ask", 0, T.l7 - 0.1, 0.3);

    // 7. Asking is measuring: fresh qubits, half each
    tl.to("#b-compass", { x: -440, scale: 0.65, duration: 0.9, ease: "power2.inOut" }, T.asking);
    write("#b-nos2", T.asking + 0.6, 0.7);
    write("#b-measq", T.measuring7 - 0.1, 1.0);
    draw("#b-tframe", T.measuring7 - 0.05, 0.5);
    write(["#b-th0", "#b-th1"], T.measuring7 + 0.15, 0.15);
    write(["#b-cnt0", "#b-cnt1"], T.measuring7 + 0.2, 0.3);
    const CELL0 = T.measuring7 + 0.3, CELLDT = 0.095, OUT = ${JSON.stringify(OUT)};
    OUT.forEach((_, i) => tl.fromTo("#b-tc" + i, { opacity: 0, y: -26 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, CELL0 + i * CELLDT));
    write("#b-fresh", T.measuring7 + 0.6, 0.8);
    write("#b-halfeach", T.half7 - 0.05, 0.5);
    blurOut(["#b-compass", "#b-tally", "#b-nos2"], T.l8 - 0.1);

    // 8. Before measuring, H again: the arrow tips straight back up
    back(["#b-ball", "#b-bars", "#b-strip"], T.l8 - 0.02);
    draw("#b-mstub", T.measuring8 - 0.1, 0.1); draw("#b-m1-body", T.measuring8, 0.45);
    draw("#b-m1-n", T.measuring8 + 0.35, 0.15);
    draw("#b-mcross", T.measuring8 + 0.45, 0.3);
    draw("#b-h2box", T.apply8 - 0.1, 0.45);
    write("#b-sh2", T.h8 - 0.05, 0.2);
    fade("#b-h2gold", 1, T.tips8 - 0.1, 0.2); fade("#b-h2gold", 0, T.tips8 + 1.5, 0.4);

    // 9. Now it reads 0 every time
    tl.fromTo("#b-reads", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "steps(6)" }, T.reads9 - 0.05);
    write("#b-certagain", T.nothing - 0.1, 0.7);
    draw("#b-check", T.nothing + 0.65, 0.3);
    fade(["#b-reads", "#b-certagain", "#b-checkL", "#b-m1-body", "#b-m1-n", "#b-mstub", "#b-mcross"], 0, T.l10 - 0.1, 0.3);

    // 10. Not a coin toss: a turn, and the same turn undoes it
    draw("#b-c2", T.coin10 - 0.1, 0.45);
    draw("#b-c2x", T.toss, 0.3);
    draw("#b-carc1", T.turn10 - 0.05, 0.7); write("#b-hl1", T.turn10 + 0.3, 0.2);
    fade("#b-h1gold", 1, T.turn10 - 0.05, 0.15); fade("#b-h1gold", 0, T.turn10 + 0.75, 0.25);
    draw("#b-carc2", T.same - 0.05, 0.9); write("#b-hl2", T.same + 0.4, 0.2);
    fade("#b-h2gold", 1, T.same - 0.05, 0.15); fade("#b-h2gold", 0, T.same + 1.1, 0.25);
    write("#b-hh1", T.undoes - 0.35, 0.45); write("#b-hh2", T.undoes + 0.05, 0.45);
    blurOut(["#b-coin2", "#b-strip"], T.l11 - 0.05);
    fade(["#b-carc1", "#b-carc2", "#b-hl1", "#b-hl2", "#b-hh1", "#b-hh2"], 0, T.l11 + 0.7, 0.3);

    // 11. Randomness only appears when you measure an arrow between the poles
    write("#b-randomlbl", T.l11 + 0.1, 0.45);
    draw("#b-m2-body", T.measure11 - 0.1, 0.45); draw("#b-m2-n", T.measure11 + 0.2, 0.2);
    fade("#b-band", 0.75, T.between - 0.05, 0.4);
    write("#b-randans", T.between + 0.05, 0.55);
    write("#b-cert0", T.up11 - 0.05, 0.35); write("#b-cert1", T.down11 - 0.05, 0.35);
    blurOut(["#b-ball", "#b-bars", "#b-meas2"], T.compass12 - 0.15);
    tl.set(["#b-band", "#b-randans", "#b-cert0", "#b-cert1"], { opacity: 0 }, T.compass12 + 0.3);

    // 12. The compass breaks down: a real needle would answer neither
    tl.set("#b-compass", { x: 0, y: 0, scale: 1 }, T.compass12 - 0.2);
    back("#b-compass", T.compass12 - 0.1, 0.4);
    draw("#b-crack", T.breaks - 0.05, 0.45);
    draw("#b-bub", T.answer12 - 0.1, 0.5);
    write("#b-neither", T.neither - 0.2, 0.4);

    // 13. A qubit must answer 0 or 1, and becomes that answer
    blurOut(["#b-compass", "#b-bubble"], T.qubit13 + 0.15);
    back(["#b-ball", "#b-bars"], T.qubit13 + 0.3);
    pulse(["#b-bl0", "#b-pct0"], T.zero13 - 0.05);
    pulse(["#b-bl1", "#b-pct1"], T.one13 - 0.05);
    toGold("#b-p1", T.becomes + 0.1, 0.15);

    // 14. In symbols: H|0> = |+> = (|0> + |1>)/sqrt2
    blurOut(["#b-ball", "#b-bars"], T.l14 - 0.05);
    tl.set(["#b-p0", "#b-p1"], { opacity: 0 }, T.l14 + 0.3); toInk("#b-p1", T.l14 + 0.3, 0.01);
    write("#b-e1", T.h14 - 0.05, 0.2); write("#b-e2", T.ket14a - 0.05, 0.4);
    write("#b-e3", T.ket14b - 0.25, 0.2); write("#b-e4", T.ket14b - 0.02, 0.45);
    write("#b-e5", T.ket14c - 0.3, 0.2); write("#b-e6", T.ket14c - 0.12, 0.12); write("#b-e7", T.ket14c, 0.4);
    write("#b-e8", T.plus14 - 0.08, 0.15); write("#b-e9", T.ket14d, 0.4); write("#b-e10", T.ket14d + 0.4, 0.12);
    write("#b-e11", T.root - 0.15, 0.5);
    tl.set("#b-ball", { x: -180, y: 210, scale: 0.44 }, T.l14 + 0.3);
    back("#b-ball", T.ket14b + 0.1, 0.4);
    write("#b-plustip", T.ket14b + 0.5, 0.4);
    write("#b-w0", T.weighted - 0.1, 0.4); write("#b-w1", T.weighted + 0.15, 0.4);

    // 15. Squared, each weight gives a chance of one half
    blurOut(["#b-ball", "#b-plustip"], T.l15 - 0.05);
    write("#b-q0", T.l15 + 0.05, 0.7); write("#b-q1", T.l15 + 0.55, 0.7);
    draw(["#b-sbf0", "#b-sbf1", "#b-sbase"], T.chance - 0.1, 0.5);
    write(["#b-sb0", "#b-sb1"], T.chance + 0.3, 0.15);
    [0, 1].forEach((i) => tl.fromTo("#b-scr" + i, { attr: { y: ${SB.base}, height: 0 } }, { attr: { y: ${SB.base - SB.h / 2}, height: ${SB.h / 2} }, duration: 0.6, ease: "power2.out" }, T.half15 - 0.05));
    write("#b-shalf", T.half15 - 0.1, 0.35);

    // 16. Closing: H tips the arrow onto the equator; a second H brings it home
    blurOut(["#b-w0", "#b-w1", "#b-q0", "#b-q1"], T.close - 0.12); blurOut("#b-sbars", T.close + 0.3);
    tl.to("#b-eq", { y: -232, scale: 0.667, duration: 0.7, ease: "power2.inOut" }, T.close - 0.08);
    tl.set("#b-ball", { x: ${CL.x - C.x}, y: ${CL.y - C.y}, scale: ${CL.s} }, T.close - 0.1);
    tl.set(["#b-p0", "#b-p1"], { opacity: 1 }, T.close - 0.1);
    back("#b-ball", T.close + 0.42, 0.4);
    back("#b-strip", T.close + 0.5, 0.45);
    fade("#b-h1gold", 1, T.tips16 - 0.1, 0.2); fade("#b-h1gold", 0, T.tips16 + 1.4, 0.35);
    write("#b-cdef", T.definite16 - 0.05, 0.7);
    back("#b-bars", T.random16 - 0.15, 0.35);
    write("#b-crand", T.random16 + 0.05, 0.7);
    draw("#b-ghostE", T.second - 0.1, 0.35);
    fade("#b-h2gold", 1, T.second - 0.1, 0.2); fade("#b-h2gold", 0, T.second + 1.3, 0.35);
    write("#b-chome", T.home - 0.1, 0.55);

    // ---------- Continuous values ----------
    const LEN = ${LEN}, CX = ${C.x}, CY = ${C.y}, FX = ${FX}, FY = ${FY};
    const BAR = ${JSON.stringify(BAR)};
    const TILT = [
      [T.tipping, T.tipping + 1.3, 0, 90], [T.tips8, T.tips8 + 1.3, 90, 0],
      [T.turn10, T.turn10 + 0.7, 0, 90], [T.same, T.same + 1.0, 90, 0],
      [T.measure11, T.measure11 + 1.0, 0, 90], [T.becomes, T.becomes + 0.22, 90, 180],
      [T.l14 + 0.2, T.l14 + 0.21, 180, 90], [T.close - 0.2, T.close - 0.19, 90, 0],
      [T.tips16, T.tips16 + 1.2, 0, 90], [T.second, T.second + 1.0, 90, 0],
    ];
    const GROW = [[T.always, T.always + 0.7, 0, 1]];
    const NEEDLE = [[T.points, T.points + 1.0, 0, 90]];
    const RISE = [[T.spins - 0.1, T.spins + 0.4, 0, -34]];
    const R = (d) => (d * Math.PI) / 180;
    const shaftT = $("b-shaftT"), headT = $("b-headT"), dotT = $("b-dotT"), needleT = $("b-needleT");
    const coin = $("b-coin"), cf0 = $("b-cf0"), cf1 = $("b-cf1");
    const m2n = $("b-m2-n"), n0 = $("b-n0"), n1 = $("b-n1");
    const eqSpans = [$("b-e7"), $("b-e9")], wNotes = [$("b-w0"), $("b-w1")], qNotes = [$("b-q0"), $("b-q1")];
    onFrame((t) => {
      // the state arrow: tilt 0 = up, 90 = on the equator facing you, 180 = down
      const a = sched(TILT, t, 0);
      const s = Math.sin(R(a)), c = Math.cos(R(a));
      const vx = s * FX, vy = s * FY - c * LEN;
      const len = Math.hypot(vx, vy), ang = (Math.atan2(vx, -vy) * 180) / Math.PI;
      const tx = CX + vx, ty = CY + vy;
      shaftT.setAttribute("transform", "translate(" + CX + " " + CY + ") rotate(" + ang.toFixed(2) + ") scale(1 " + (len / LEN).toFixed(4) + ")");
      headT.setAttribute("transform", "translate(" + tx.toFixed(2) + " " + ty.toFixed(2) + ") rotate(" + ang.toFixed(2) + ")");
      const breathe = t > T.home + 0.4 ? 1 + 0.15 * Math.pow(Math.sin((t - T.home - 0.4) * 2.4), 2) : 1;
      dotT.setAttribute("transform", "translate(" + tx.toFixed(2) + " " + ty.toFixed(2) + ") scale(" + breathe.toFixed(3) + ")");
      // the bars: P(0) = cos^2(tilt/2), P(1) = sin^2(tilt/2)
      const p1 = Math.pow(Math.sin(R(a) / 2), 2), ps = [1 - p1, p1], grow = sched(GROW, t, 0);
      ps.forEach((p, i) => {
        const hgt = BAR.h * p * grow;
        const cr = $("b-crect" + i);
        cr.setAttribute("y", (BAR.base - hgt).toFixed(2)); cr.setAttribute("height", hgt.toFixed(2));
        $("b-lvl" + i).setAttribute("transform", "translate(0 " + (-hgt).toFixed(2) + ")");
        const lead = p >= ps[1 - i] - 0.02;
        $("b-fill" + i + "g").style.opacity = lead ? "1" : "0"; $("b-lvl" + i + "g").style.opacity = lead ? "1" : "0";
        $("b-fill" + i + "i").style.opacity = lead ? "0" : "1"; $("b-lvl" + i + "i").style.opacity = lead ? "0" : "1";
        $("b-pv" + i).textContent = String(Math.round(p * 100));
        $("b-pct" + i).style.color = lead ? GOLDC : INKC;
      });
      // the compass needle: north, then a swing to east that settles
      let na = sched(NEEDLE, t, 0);
      const te = t - (T.points + 1.0);
      if (te > 0) na += 7 * Math.exp(-te * 3.2) * Math.sin(te * 13);
      needleT.setAttribute("transform", "translate(${K.x} ${K.y}) rotate(" + na.toFixed(2) + ")");
      // the coin: spins once tossed, showing 0 and 1 in turn
      const spin = t > T.spins ? Math.cos(2 * Math.PI * 2.1 * (t - T.spins)) : 1;
      coin.style.transform = "translateY(" + sched(RISE, t, 0).toFixed(1) + "px) scaleX(" + Math.max(0.05, Math.abs(spin)).toFixed(3) + ")";
      cf0.style.opacity = spin >= 0 ? "1" : "0"; cf1.style.opacity = spin >= 0 ? "0" : "1";
      // the meter beside the bars: its needle flicks between the two answers
      m2n.setAttribute("transform", "rotate(" + (t > T.measure11 ? 38 * Math.sin((t - T.measure11) * 4.6) + 10 * Math.sin(t * 11.3) : -35).toFixed(2) + ")");
      // the tally of fresh readings
      let c0 = 0, c1 = 0;
      OUT.forEach((d, i) => { if (t >= CELL0 + i * CELLDT + 0.07) { if (d === "0") c0++; else c1++; } });
      n0.textContent = String(c0); n1.textContent = String(c1);
      // weight notes sit under |0> and |1> of the equation
      if (t > T.weighted - 1 && t < T.close + 1) {
        eqSpans.forEach((sp, i) => {
          const mid = ${EQ.x} + sp.offsetLeft + sp.offsetWidth / 2;
          wNotes[i].style.left = (mid - 70).toFixed(1) + "px";
          qNotes[i].style.left = (i === 0 ? mid + 60 - 320 : mid - 60).toFixed(1) + "px";
        });
      }
    });
  `;
  return { html, script, css };
}
