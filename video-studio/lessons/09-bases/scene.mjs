// Lesson 9, "Measuring in other directions" (bases). Beat plan: plan.md.
// Scenes: A the puzzle (two boxes, same readings) -> B polarized sunglasses -> C the arrow in a
// ball, the odds, plus and minus asked two ways -> D hardware asks up or down, so turn with H ->
// E where the picture breaks, and 50/50 is not random -> F the closing card.
export const phrases = [
  ["plus points front", "|+⟩ points front"],
  ["minus points back", "|−⟩ points back"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, INK, GOLD, DIM } = k;
  const PI = Math.PI;
  const f1 = (v) => +v.toFixed(1);

  // ---------- Times, cued to the spoken words ----------
  const T = {
    // A
    puzzle: cue(0, "puzzle"), two: cue(0, "two"), measure: cue(0, "measure"), usual: cue(0, "usual"),
    zero1: cue(1, "zero"), half1: cue(1, "half"), time1b: cue(1, "time", 1), tell: cue(1, "tell"), apart: cue(1, "apart"),
    // B
    think: cue(2, "think"), sung: cue(2, "sunglasses"), light2: cue(2, "light"), wiggles: cue(2, "wiggles"),
    l3: cue(3), send: cue(3, "send"), slant3: cue(3, "slant"), upright: cue(3, "upright"), only: cue(3, "only"), half4: cue(4, "half"),
    tilt: cue(4, "tilt"), slant4: cue(4, "slant"), all4: cue(4, "all"),
    light5: cue(5, "light"), changed: cue(5, "changed"), question5: cue(5, "question"),
    // C
    qubit6: cue(6, "qubit"), arrow6: cue(6, "arrow"), ball6: cue(7, "ball"),
    line7: cue(7, "line"), ball7: cue(7, "ball", 1), axis7: cue(7, "axis"), zero7: cue(7, "zero"), one7: cue(7, "one", 1),
    nearer: cue(8, "nearer"), end8: cue(8, "end"), likely: cue(8, "likely"),
    sideways: cue(9, "sideways"), plus9: cue(9, "plus"), minus9: cue(9, "minus"), back9: cue(9, "back"),
    halfway: cue(10, "halfway"), up10: cue(10, "up"), gives: cue(10, "gives"),
    front11: cue(11, "front"), axis11: cue(11, "axis"), always11: cue(11, "always"), frontAns: cue(11, "front", 1),
    minus11: cue(11, "minus"), backAns: cue(11, "back", 1),
    // D
    l12: cue(12), hardware: cue(12, "hardware"), up12: cue(12, "up"),
    turn13: cue(13, "turn"), hgate: cue(13, "hgate"), swaps: cue(13, "swaps"), down13: cue(13, "down"),
    plus14: cue(14, "plus"), zero14: cue(14, "zero"), minus14: cue(14, "minus"), one14: cue(14, "one"), every: cue(14, "every"),
    // E
    here15: cue(15, "here"), breaks: cue(15, "breaks"), beam: cue(15, "beam"), partly: cue(15, "partly"), particle: cue(15, "particle"),
    passes15: cue(15, "passes"), doesnt: cue(15, "doesn't"),
    l16: cue(16), random: cue(16, "random"), perfectly: cue(16, "perfectly"), lined: cue(16, "lined"),
    // F
    measurement: cue(17, "measurement"), axis17: cue(17, "axis"), another: cue(17, "another"), turn17: cue(17, "turn"),
    first: cue(17, "first"), lastEnd: k.lines[17].end,
  };
  T.endA = T.apart + 0.25;
  T.endB = k.lines[5].end + 0.1;
  T.endC = k.lines[11].end + 0.04;
  T.endD = k.lines[14].end + 0.1;
  T.endE1 = k.lines[16].start - 0.08;
  T.endE = k.lines[16].end + 0.08;

  // ---------- Helpers (every drawing and label is in board pixels) ----------
  const sheet = (id, svg, labels = "", style = "") =>
    `<div id="${id}" class="obj" style="left:0;top:0;width:1920px;height:1080px;${style}"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${labels}</div>`;
  const g = (id, inner, attrs = "") => `<g id="${id}" ${attrs}>${inner}</g>`;
  // Labels centred on cx with their top at `top`; LL is left-aligned from x.
  const L = (id, cx, top, w, size, html, extra = "") => lbl(id, f1(cx - w / 2), f1(top), w, size, html, extra);
  const LL = (id, x, top, w, size, html, extra = "") => lbl(id, f1(x), f1(top), w, size, html, "text-align:left;" + extra);
  const LR = (id, xr, top, w, size, html, extra = "") => lbl(id, f1(xr - w), f1(top), w, size, html, "text-align:right;" + extra);
  const GC = `color:${GOLD};`;
  const thin = (o = {}) => pen({ strokeWidth: 2.2, ...o });
  const dim = (o = {}) => pen({ stroke: DIM, strokeWidth: 2.2, ...o });
  const solid = (c) => pen({ stroke: "none", fill: c, fillStyle: "solid", roughness: 0.6 });
  const hatch = (c, gap = 9) => pen({ stroke: "none", fill: c, fillStyle: "hachure", hachureGap: gap, fillWeight: c === GOLD ? 2.2 : 1.7 });
  // A dashed line made of short rough strokes, so draw() pens it on dash by dash.
  const dashed = (x1, y1, x2, y2, o = {}, dash = 16, gap = 12) => {
    const len = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.floor((len + gap) / (dash + gap)));
    const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    let out = "";
    for (let i = 0; i < n; i++) {
      const a = i * (dash + gap), b = Math.min(len, a + dash);
      out += r.line(x1 + ux * a, y1 + uy * a, x1 + ux * b, y1 + uy * b, pen({ strokeWidth: 2.6, roughness: 0.5, ...o }));
    }
    return out;
  };
  const rrPath = (x, y, w, h, q) =>
    `M${x + q} ${y} L${x + w - q} ${y} Q${x + w} ${y} ${x + w} ${y + q} L${x + w} ${y + h - q} Q${x + w} ${y + h} ${x + w - q} ${y + h} L${x + q} ${y + h} Q${x} ${y + h} ${x} ${y + h - q} L${x} ${y + q} Q${x} ${y} ${x + q} ${y} Z`;
  const tick = (x, y, s, o) => r.linear([[x, y], [x + s * 0.35, y + s * 0.4], [x + s, y - s * 0.55]], o);
  // A bar with a dim frame and a hachure fill that a clip rect reveals from the base up.
  const BARS = [];
  function bar(id, x, base, w, h, gold = false) {
    BARS.push({ id, x, base, w, h });
    return (
      g(`${id}-fr`, r.rect(x, base - h, w, h, dim({ strokeWidth: 2.2 }))) +
      `<clipPath id="${id}-cp"><rect id="${id}-cr" x="${x - 6}" y="${base}" width="${w + 12}" height="0"/></clipPath>` +
      `<g clip-path="url(#${id}-cp)"><g id="${id}-fi">${r.rect(x + 3, base - h, w - 6, h, hatch(INK))}</g>` +
      (gold ? `<g id="${id}-fg" style="opacity:0">${r.rect(x + 3, base - h, w - 6, h, hatch(GOLD))}</g>` : "") +
      `</g>`
    );
  }
  // A measuring meter: box, half dial, 0 and 1 marks, needle (rotated at run time).
  function meter(id, cx, cy, w, h, labels = true) {
    const py = cy + h * 0.32, ar = Math.min(w * 0.36, h * 0.5);
    const body =
      r.rect(cx - w / 2, cy - h / 2, w, h, pen({ strokeWidth: 3.2, roughness: 1 })) +
      r.arc(cx, py, ar * 2, ar * 2, PI * 1.05, PI * 1.95, false, thin({ roughness: 0.8 })) +
      r.line(cx - ar * 0.95, py - ar * 0.3, cx - ar * 0.78, py - ar * 0.24, thin()) +
      r.line(cx + ar * 0.95, py - ar * 0.3, cx + ar * 0.78, py - ar * 0.24, thin());
    const needle =
      `<g id="${id}-rot" transform="translate(${cx} ${f1(py)})">` +
      g(`${id}-nd`, r.line(0, 0, 0, -ar * 1.02, pen({ strokeWidth: 3.6, roughness: 0.6 })) + r.circle(0, 0, 14, solid(INK))) + `</g>`;
    const marks = labels ? L(`${id}-m0`, cx - ar - 16, py - ar * 0.62 - 30, 40, 40, "0") + L(`${id}-m1`, cx + ar + 16, py - ar * 0.62 - 30, 40, 40, "1") : "";
    return { svg: g(`${id}-body`, body) + needle, marks };
  }
  // A travelling light wave: "teeth" from the beam line that swell and shrink as the wave moves on.
  // ang is the wiggle direction from upright (0 = up and down, 45 = on a slant).
  const WAVES = [];
  function wave(id, x0, x1, y, amp, ang, color, op = 1) {
    const step = 15, xs = [];
    for (let x = x0; x <= x1; x += step) xs.push(x);
    WAVES.push({ id, x0, x1, y, amp, ang, n: xs.length, step });
    return `<g id="${id}" style="opacity:${op}">` +
      `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" class="wv-axis" stroke="${color}" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="6 9"/>` +
      xs.map((x) => `<line class="wv-t" x1="${x}" y1="${y}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="3.4" stroke-linecap="round"/>`).join("") +
      `</g>`;
  }

  // =====================================================================
  // A. The puzzle: two sealed qubits that read the same
  // =====================================================================
  const BX = [560, 1360];
  const DIG = ["011010", "100101"];
  const DT = 0.33, D0 = T.zero1;
  const digT = (b, i) => +(D0 + b * 0.14 + i * DT).toFixed(3);
  let aSvg = "", aLab = "";
  BX.forEach((cx, b) => {
    const m = meter(`b-am${b}`, cx, 385, 260, 170);
    aSvg +=
      g(`b-abox${b}`, r.rect(cx - 34, 284, 68, 16, thin()) + r.line(cx - 126, 322, cx + 126, 320, thin({ roughness: 0.8 }))) +
      m.svg +
      bar(`b-ab${b}0`, cx - 100, 770, 80, 170) + bar(`b-ab${b}1`, cx + 20, 770, 80, 170);
    aLab += m.marks +
      L(`b-aname${b}`, cx, 202, 300, 56, `qubit ${b ? "B" : "A"}`) +
      DIG[b].split("").map((d, i) => L(`b-ad${b}${i}`, cx - 100 + i * 40, 484, 40, 56, d)).join("") +
      L(`b-abl${b}0`, cx - 60, 772, 80, 44, "0") + L(`b-abl${b}1`, cx + 60, 772, 80, 44, "1") +
      L(`b-ahalf${b}0`, cx - 60, 606, 90, 40, "half") + L(`b-ahalf${b}1`, cx + 60, 606, 90, 40, "half");
  });
  aLab += L("b-aq", 960, 300, 160, 140, "?") + L("b-aeq", 960, 640, 120, 96, "=");
  const sceneA = sheet("b-sA", aSvg, aLab);
  // Count-driven bar heights: each bar rises one sixth when its digit lands.
  const aBarSegs = {};
  BX.forEach((_, b) => {
    const n = [0, 0];
    DIG[b].split("").forEach((d, i) => {
      const t = digT(b, i), j = +d;
      (aBarSegs[`b-ab${b}${j}`] ??= []).push([t, t + 0.25, n[j] / 6, (n[j] + 1) / 6]);
      n[j]++;
    });
  });

  // =====================================================================
  // B. Polarized sunglasses
  // =====================================================================
  const BY = 540, LC = [960, 540];
  const lensShape = r.path(rrPath(870, 370, 180, 340, 34), pen({ strokeWidth: 3.6, roughness: 1 }));
  const lensHatch = (o) => Array.from({ length: 7 }, (_, i) => r.line(893 + i * 22.4, 392, 893 + i * 22.4, 688, o(i))).join("");
  const bSvg =
    g("b-torch", r.rect(190, 505, 170, 70, pen({ strokeWidth: 3.2 })) + r.poly([[360, 497], [425, 470], [425, 610], [360, 583]], pen({ strokeWidth: 3.2 })) +
      r.rect(240, 492, 36, 13, thin()) + r.line(210, 525, 340, 524, dim()) + r.line(210, 556, 340, 557, dim())) +
    `<g id="b-lensrot">` +
    g("b-lens", lensShape) + g("b-arms", r.curve([[870, 420], [850, 404], [826, 404]], pen({ strokeWidth: 3 })) +
      r.curve([[1050, 405], [1110, 396], [1170, 392], [1186, 412]], pen({ strokeWidth: 3 }))) +
    g("b-hatch", lensHatch((i) => thin({ seed: 700 + i }))) +
    g("b-hatchg", lensHatch((i) => goldPen({ strokeWidth: 3.2, seed: 720 + i })), 'style="opacity:0"') +
    `</g>` +
    g("b-lmeter", r.rect(1590, 380, 80, 320, pen({ strokeWidth: 3 })) +
      r.line(1580, 540, 1600, 540, thin()) + r.line(1580, 380, 1600, 380, thin()) + r.line(1580, 700, 1600, 700, thin())) +
    `<clipPath id="b-lm-cp"><rect id="b-lm-cr" x="1584" y="700" width="92" height="0"/></clipPath>` +
    `<g clip-path="url(#b-lm-cp)">${r.rect(1594, 384, 72, 312, hatch(GOLD, 8))}</g>` +
    wave("b-w0", 440, 1540, BY, 62, 0, GOLD) +
    wave("b-w1", 440, 860, BY, 70, 45, INK) +
    wave("b-w2", 1062, 1560, BY, 50, 0, GOLD, 0.6) +
    wave("b-w3", 1062, 1560, BY, 70, 45, GOLD) +
    g("b-bub", r.ellipse(960, 252, 600, 124, pen({ strokeWidth: 3 })) + r.linear([[930, 312], [944, 352], [972, 313]], pen({ strokeWidth: 3 }))) +
    g("b-strike", r.line(704, 262, 900, 244, pen({ strokeWidth: 4 })));
  const bLab =
    L("b-polar", 960, 744, 600, 48, "polarized sunglasses") +
    LL("b-wud", 470, 386, 420, 44, "wiggles up and down", GC) +
    L("b-slantl", 640, 382, 300, 48, "on a slant") +
    LL("b-upr", 1084, 640, 200, 48, "upright") + LL("b-slt", 1084, 640, 200, 48, "slanted") +
    LL("b-p100", 1684, 352, 100, 40, "100%") + LL("b-p0", 1684, 668, 100, 40, "0%") +
    LR("b-half", 1568, 290, 220, 56, "half", GC) + LR("b-allof", 1568, 290, 240, 56, "all of it", GC) +
    L("b-same", 300, 404, 260, 44, "same light") +
    L("b-qup", 800, 214, 200, 48, "upright?") + L("b-qsl", 1090, 214, 220, 48, "slanted?", GC);
  const sceneB = sheet("b-sB", bSvg, bLab);

  // =====================================================================
  // C and D. The arrow in a ball (centre 640, 470, radius 260)
  // =====================================================================
  const C = { x: 640, y: 470, R: 260 };
  const EX = [-183.8, 49.5]; // the front direction on screen (equator point at 135 degrees)
  const cSvg =
    g("b-ball", r.circle(C.x, C.y, C.R * 2, pen({ strokeWidth: 3.2, roughness: 0.7, seed: 4242 })) +
      r.arc(C.x, C.y, 470, 470, PI * 1.08, PI * 1.42, false, dim({ strokeWidth: 2.6 }))) +
    g("b-eq", r.arc(C.x, C.y, 520, 140, PI, 2 * PI, false, dim({ strokeWidth: 2 })) + r.arc(C.x, C.y, 520, 140, 0, PI, false, pen({ strokeWidth: 2.6 }))) +
    g("b-vax", dashed(C.x, 186, C.x, 754) + r.circle(C.x, C.y - C.R, 16, solid(INK)) + r.circle(C.x, C.y + C.R, 16, solid(INK))) +
    g("b-vaxg", dashed(C.x, 186, C.x, 754, { stroke: GOLD, strokeWidth: 3.4 }), 'style="opacity:0"') +
    g("b-mid", r.line(C.x - 22, C.y, C.x + 22, C.y, pen({ strokeWidth: 3 }))) +
    `<line id="b-fbax" x1="${C.x}" y1="${C.y}" x2="${C.x}" y2="${C.y}" stroke="${INK}" stroke-width="2.8" stroke-dasharray="16 12" stroke-linecap="round"/>` +
    `<line id="b-fbaxg" x1="${C.x}" y1="${C.y}" x2="${C.x}" y2="${C.y}" stroke="${GOLD}" stroke-width="3.6" stroke-dasharray="16 12" stroke-linecap="round" style="opacity:0"/>` +
    `<path id="b-glowP" d="" stroke="${GOLD}" stroke-opacity="0.25" stroke-width="22" stroke-linecap="round" fill="none"/>` +
    `<path id="b-arM" d="" stroke="${INK}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
    `<path id="b-arP" d="" stroke="${GOLD}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
    `<circle id="b-hub" cx="${C.x}" cy="${C.y}" r="11" fill="${GOLD}" style="opacity:0"/>` +
    g("b-swapL", r.curve([[392, 590], [300, 440], [360, 290], [478, 206]], pen({ strokeWidth: 3 })) +
      r.line(478, 206, 452, 208, pen({ strokeWidth: 3 })) + r.line(478, 206, 466, 228, pen({ strokeWidth: 3 }))) +
    g("b-swapR", r.curve([[888, 352], [952, 520], [900, 680], [792, 758]], pen({ strokeWidth: 3 })) +
      r.line(792, 758, 818, 760, pen({ strokeWidth: 3 })) + r.line(792, 758, 802, 734, pen({ strokeWidth: 3 })));
  const cLab =
    L("b-k0", C.x, 98, 140, 56, "|0⟩") + L("b-k1", C.x, 752, 140, 56, "|1⟩") +
    LL("b-axisl", 662, 584, 140, 48, "axis") +
    LL("b-halfw", 662, 478, 180, 44, "halfway") +
    L("b-front", 316, 512, 130, 50, "front") + L("b-back", 940, 368, 120, 50, "back") +
    L("b-kp", 0, 0, 120, 56, "|+⟩", GC) + L("b-km", 0, 0, 120, 56, "|−⟩");
  const sceneC = sheet("b-sC", cSvg, cLab, `transform-origin:${C.x}px ${C.y}px`);

  // Line 8: the odds follow the arrow
  const c8Svg = bar("b-cb0", 1200, 700, 110, 340, true) + bar("b-cb1", 1420, 700, 110, 340, true) +
    g("b-cbase", r.line(1160, 700, 1570, 700, pen({ strokeWidth: 3.2 })));
  const c8Lab =
    L("b-cbl0", 1255, 706, 80, 48, "0") + L("b-cbl1", 1475, 706, 80, 48, "1") +
    L("b-cpc0", 1255, 282, 140, 48, `<span id="b-cpv0">100</span>%`) + L("b-cpc1", 1475, 282, 140, 48, `<span id="b-cpv1">0</span>%`) +
    L("b-near", 1365, 196, 600, 48, "nearer an end, more likely");
  const sceneC8 = sheet("b-sC8", c8Svg, c8Lab);

  // Lines 10 and 11: the two qubits asked two ways
  const ROWS = [{ k: "|+⟩", base: 470 }, { k: "|−⟩", base: 730 }];
  let rSvg = "", rLab = L("b-tagud", 1400, 182, 520, 56, "up or down?", GC) + L("b-tagfb", 1400, 182, 520, 56, "front or back?", GC);
  ROWS.forEach((row, i) => {
    rSvg += bar(`b-rb${i}0`, 1240, row.base, 80, 150, true) + bar(`b-rb${i}1`, 1370, row.base, 80, 150, true) +
      g(`b-rbase${i}`, r.line(1215, row.base, 1475, row.base, pen({ strokeWidth: 3 })));
    rLab += L(`b-rk${i}`, 1140, row.base - 120, 120, 56, row.k, i === 0 ? GC : "") +
      L(`b-r01a${i}`, 1280, row.base + 4, 70, 44, "0") + L(`b-r01b${i}`, 1410, row.base + 4, 70, 44, "1") +
      L(`b-rfba${i}`, 1280, row.base + 4, 110, 44, "front") + L(`b-rfbb${i}`, 1410, row.base + 4, 110, 44, "back") +
      LL(`b-r50${i}`, 1500, row.base - 96, 160, 48, "50/50") + LL(`b-ralw${i}`, 1500, row.base - 96, 200, 48, "always", GC);
  });
  const sceneR = sheet("b-sR", rSvg, rLab);

  // D. The hardware only asks up or down
  const dm = meter("b-dm", 1540, 520, 260, 170);
  const dSvg = dm.svg +
    g("b-dwire", r.line(1000, 520, 1125, 520, pen({ strokeWidth: 3 })) + r.line(1235, 520, 1410, 520, pen({ strokeWidth: 3 }))) +
    g("b-dh", r.rect(1125, 465, 110, 110, goldPen({ strokeWidth: 4 }))) +
    g("b-dout", arrow(1678, 520, 1750, 520, { strokeWidth: 2.8 }, 16)) +
    g("b-dtick", tick(1488, 712, 54, goldPen({ strokeWidth: 4.6 })));
  const ROWD = [{ k: "|+⟩", d: "0", top: 628 }, { k: "|−⟩", d: "1", top: 724 }];
  const dDigT = (rIdx, i) => +((rIdx ? T.minus14 + 0.1 : T.plus14 + 0.12) + i * 0.17).toFixed(3);
  const dLab = dm.marks +
    L("b-dhw", 1540, 282, 300, 44, "the hardware") + L("b-dtag", 1540, 350, 520, 48, "only asks: up or down?") +
    L("b-dH", 1180, 466, 110, 80, "H", GC) + LR("b-dq", 990, 486, 140, 44, "qubit") +
    ROWD.map((row, rI) => LL(`b-drk${rI}`, 1080, row.top, 160, 56, `${row.k} →`) +
      [0, 1, 2, 3].map((i) => L(`b-dd${rI}${i}`, 1270 + i * 54, row.top, 50, 56, row.d, GC)).join("")).join("");
  const sceneD = sheet("b-sD", dSvg, dLab);

  // =====================================================================
  // E. Where the picture breaks; 50/50 is not random
  // =====================================================================
  const EY = 470;
  const e1Svg =
    g("b-etorch", r.rect(260, 435, 160, 70, pen({ strokeWidth: 3.2 })) + r.poly([[420, 427], [470, 405], [470, 535], [420, 513]], pen({ strokeWidth: 3.2 })) +
      r.rect(300, 422, 34, 13, thin())) +
    g("b-elens", r.path(rrPath(860, 330, 120, 280, 28), pen({ strokeWidth: 3.4 })) +
      Array.from({ length: 5 }, (_, i) => r.line(880 + i * 20, 350, 880 + i * 20, 590, thin({ seed: 760 + i }))).join("")) +
    g("b-crack", r.linear([[990, 318], [966, 344], [982, 360], [956, 384]], pen({ strokeWidth: 3.4 }))) +
    wave("b-w4", 490, 850, EY, 62, 45, INK) +
    wave("b-w5", 992, 1420, EY, 44, 0, GOLD, 0.6) +
    `<circle id="b-photon" cx="480" cy="${EY}" r="15" fill="${GOLD}" style="opacity:0"/>` +
    `<circle id="b-ghost" cx="480" cy="${EY}" r="15" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="6 6" style="opacity:0"/>` +
    g("b-stopbar", r.line(850, 432, 850, 508, pen({ strokeWidth: 5 })));
  const e1Lab =
    L("b-ebeam", 1200, 316, 420, 44, "a beam: part passes") +
    L("b-eone", 670, 528, 400, 44, "one particle of light", GC) +
    L("b-epass", 1250, 508, 300, 48, "passes, whole", GC) +
    L("b-estop", 660, 528, 300, 48, "or stopped");
  const sceneE1 = sheet("b-sE1", e1Svg, e1Lab);

  const E = { x: 600, y: 460, R: 230 };
  const EF = [E.x - 162.6, E.y + 43.8];
  const fu = [(EF[0] - E.x) / E.R, (EF[1] - E.y) / E.R];
  const RA = 36;
  const ra = [[E.x, E.y - RA], [E.x + fu[0] * RA, E.y - RA + fu[1] * RA], [E.x + fu[0] * RA, E.y + fu[1] * RA]];
  const e2Svg =
    g("b-eball", r.circle(E.x, E.y, E.R * 2, pen({ strokeWidth: 3.2, roughness: 0.7, seed: 4343 })) +
      r.arc(E.x, E.y, 460, 124, PI, 2 * PI, false, dim({ strokeWidth: 2 })) + r.arc(E.x, E.y, 460, 124, 0, PI, false, pen({ strokeWidth: 2.6 }))) +
    g("b-evax", dashed(E.x, 200, E.x, 720)) +
    g("b-eglow", `<line x1="${E.x}" y1="${E.y}" x2="${EF[0]}" y2="${EF[1]}" stroke="${GOLD}" stroke-opacity="0.3" stroke-width="24" stroke-linecap="round"/>`, 'style="opacity:0"') +
    g("b-earrow", arrow(E.x, E.y, EF[0], EF[1], { stroke: GOLD, strokeWidth: 6, roughness: 0.8 }, 28) + r.circle(E.x, E.y, 20, solid(GOLD))) +
    g("b-eright", r.linear(ra, pen({ strokeWidth: 3.2, roughness: 0.4 }))) +
    g("b-erightg", r.linear(ra, goldPen({ strokeWidth: 4, roughness: 0.4 })), 'style="opacity:0"') +
    bar("b-eb0", 1210, 640, 100, 224) + bar("b-eb1", 1390, 640, 100, 224) +
    g("b-ebase", r.line(1170, 640, 1530, 640, pen({ strokeWidth: 3.2 }))) +
    g("b-ecross", r.line(1226, 346, 1474, 324, pen({ strokeWidth: 3.4 })));
  const e2Lab =
    L("b-etag", 1350, 186, 400, 56, "up or down?") +
    L("b-ebl0", 1260, 646, 80, 48, "0") + L("b-ebl1", 1440, 646, 80, 48, "1") +
    L("b-erand", 1350, 290, 300, 56, "random?") +
    L("b-edef", 600, 736, 640, 48, "|+⟩: a definite direction", GC);
  const sceneE2 = sheet("b-sE2", e2Svg, e2Lab);

  // =====================================================================
  // F. Closing card
  // =====================================================================
  const fm = meter("b-fm", 1240, 500, 200, 150, false);
  const S = { x: 330, y: 500, R: 92 };
  const fSvg =
    g("b-fball", r.circle(S.x, S.y, S.R * 2, pen({ strokeWidth: 3 })) + r.arc(S.x, S.y, 184, 48, PI, 2 * PI, false, dim({ strokeWidth: 2 })) +
      r.arc(S.x, S.y, 184, 48, 0, PI, false, thin()) + dashed(S.x, 392, S.x, 608, {}, 12, 9) +
      dashed(S.x + 1.3 * -65, S.y + 1.3 * 17, S.x + 1.3 * 65, S.y - 1.3 * 17, { strokeWidth: 2.2 }, 10, 8)) +
    g("b-fturn", r.curve([[238, 532], [214, 470], [244, 418], [312, 396]], goldPen({ strokeWidth: 4 })) +
      r.line(312, 396, 288, 392, goldPen({ strokeWidth: 3.6 })) + r.line(312, 396, 294, 412, goldPen({ strokeWidth: 3.6 }))) +
    g("b-fwire", r.line(436, 500, 770, 500, pen({ strokeWidth: 3 })) + r.line(890, 500, 1140, 500, pen({ strokeWidth: 3 }))) +
    g("b-fh", r.rect(770, 440, 120, 120, goldPen({ strokeWidth: 4.4 }))) +
    fm.svg +
    g("b-fout", arrow(1348, 500, 1450, 500, { strokeWidth: 2.8 }, 18)) +
    g("b-fund", r.curve([[1196, 266], [1270, 260], [1345, 264], [1418, 256]], goldPen({ strokeWidth: 4.4, roughness: 1 })));
  const fLab =
    L("b-fhead", 960, 164, 1300, 72, `A measurement asks about <span class="gold">one axis</span>.`) +
    L("b-fH", 830, 440, 120, 92, "H", GC) +
    L("b-flab1", 880, 606, 900, 64, "turn, then measure") +
    L("b-flab2", 880, 708, 1000, 48, "H, then measure = asks front or back?");
  const sceneF = sheet("b-sF", fSvg, fLab);

  const html = [sceneA, sceneB, sceneC, sceneC8, sceneR, sceneD, sceneE1, sceneE2, sceneF].join("\n");

  // =====================================================================
  // Timeline
  // =====================================================================
  const script = `
    const T = ${JSON.stringify(T)};
    const GOLDC = "${GOLD}", INKC = "${INK}";
    const toGold = (sel, t, d = 0.25) => tl.to(all(sel), { color: GOLDC, duration: d }, t);
    const toInk = (sel, t, d = 0.3) => tl.to(all(sel), { color: INKC, duration: d }, t);
    const DIG = ${JSON.stringify(DIG)};
    const digT = (b, i) => ${JSON.stringify(DIG.map((_, b) => DIG[b].split("").map((__, i) => digT(b, i))))}[b][i];
    const dDigT = (rI, i) => ${JSON.stringify([0, 1].map((rI) => [0, 1, 2, 3].map((i) => dDigT(rI, i))))}[rI][i];

    hide(["#b-kp", "#b-km", "#b-photon", "#b-ghost"]);

    // ---------- A. The puzzle ----------
    write("#b-aq", T.puzzle, 0.3);
    draw(["#b-am0-body", "#b-abox0", "#b-am0-nd"], T.two, 1.2);
    draw(["#b-am1-body", "#b-abox1", "#b-am1-nd"], T.two + 0.3, 1.2);
    write(["#b-am0-m0", "#b-am0-m1"], T.two + 1.1, 0.2); write(["#b-am1-m0", "#b-am1-m1"], T.two + 1.4, 0.2);
    blurOut("#b-title", 3.0);
    write("#b-aname0", 3.2, 0.45); write("#b-aname1", 3.4, 0.45);
    DIG.forEach((s, b) => s.split("").forEach((_, i) => write("#b-ad" + b + i, digT(b, i) - 0.04, 0.14)));
    draw(["#b-ab00-fr", "#b-ab01-fr"], T.zero1 - 0.45, 0.5); draw(["#b-ab10-fr", "#b-ab11-fr"], T.zero1 - 0.3, 0.5);
    write(["#b-abl00", "#b-abl01", "#b-abl10", "#b-abl11"], T.zero1, 0.25);
    write(["#b-ahalf00", "#b-ahalf01"], T.time1b - 0.2, 0.35); write(["#b-ahalf10", "#b-ahalf11"], T.time1b, 0.35);
    write("#b-aeq", T.tell - 0.1, 0.3);
    toGold("#b-aq", T.apart - 0.3, 0.2);
    tl.fromTo("#b-aq", { scale: 1 }, { scale: 1.4, duration: 0.3, ease: "back.out(2)" }, T.apart - 0.3);
    blurOut("#b-sA", T.endA);

    // ---------- B. Polarized sunglasses ----------
    draw("#b-lens", T.think, 1.5); draw("#b-arms", T.think + 0.9, 0.5); fade("#b-arms", 0, T.tilt - 0.1, 0.3); draw("#b-hatch", T.think + 1.1, 0.6);
    write("#b-polar", T.sung - 0.1, 0.9);
    write("#b-wud", T.light2 - 0.05, 0.7);
    fade(["#b-w0", "#b-wud"], 0, T.l3 + 0.15, 0.3);
    draw("#b-torch", T.send - 0.1, 0.8);
    write("#b-slantl", T.slant3 - 0.1, 0.5);
    tl.to("#b-hatchg", { opacity: 1, duration: 0.15 }, T.upright); tl.to("#b-hatchg", { opacity: 0, duration: 0.3 }, T.upright + 0.5);
    write("#b-upr", T.upright, 0.45);
    draw("#b-lmeter", T.upright + 0.3, 0.6);
    write(["#b-p100", "#b-p0"], T.upright + 0.7, 0.3);
    write("#b-half", T.half4 - 0.1, 0.3);
    fade("#b-upr", 0, T.tilt, 0.25); write("#b-slt", T.slant4 - 0.15, 0.45);
    fade("#b-w2", 0, T.all4 - 0.1, 0.2);
    fade("#b-half", 0, T.all4 - 0.1, 0.2); write("#b-allof", T.all4, 0.5);
    tl.to("#b-w1", { opacity: 0.4, duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.light5);
    write("#b-same", T.light5, 0.6);
    draw("#b-bub", T.question5 - 0.25, 0.5);
    write("#b-qup", T.question5 - 0.05, 0.4); draw("#b-strike", T.question5 + 0.45, 0.25);
    write("#b-qsl", T.question5 + 0.8, 0.45);
    blurOut("#b-sB", T.endB);

    // ---------- C. An arrow inside a ball ----------
    draw("#b-ball", T.qubit6, 1.5);
    draw("#b-eq", T.ball6 - 0.2, 0.8);
    draw("#b-vax", T.line7, 1.1);
    write("#b-axisl", T.axis7 - 0.05, 0.35);
    write("#b-k0", T.zero7 - 0.05, 0.35); write("#b-k1", T.one7 - 0.05, 0.35);
    draw(["#b-cb0-fr", "#b-cb1-fr", "#b-cbase"], T.nearer - 0.1, 0.6);
    write(["#b-cbl0", "#b-cbl1"], T.nearer + 0.3, 0.2); write(["#b-cpc0", "#b-cpc1"], T.nearer + 0.3, 0.3);
    write("#b-near", T.likely - 0.1, 0.9);
    blurOut("#b-sC8", ${f1(k.lines[8].end + 0.1)});
    fade("#b-axisl", 0, T.sideways - 0.6, 0.3);
    write(["#b-front", "#b-back"], T.sideways + 0.5, 0.3);
    fade("#b-kp", 1, T.plus9, 0.01); write("#b-kp", T.plus9, 0.35);
    fade("#b-km", 1, T.minus9 + 0.3, 0.01); write("#b-km", T.minus9 + 0.3, 0.35);
    draw("#b-mid", T.halfway, 0.3); write("#b-halfw", T.halfway + 0.1, 0.5);
    fade("#b-vaxg", 1, T.up10, 0.2);
    write("#b-tagud", T.up10, 0.45);
    ["#b-rb00-fr", "#b-rb01-fr", "#b-rbase0"].forEach((s) => draw(s, T.gives - 0.15, 0.4));
    ["#b-rb10-fr", "#b-rb11-fr", "#b-rbase1"].forEach((s) => draw(s, T.gives, 0.4));
    write(["#b-rk0", "#b-r01a0", "#b-r01b0"], T.gives - 0.1, 0.3); write(["#b-rk1", "#b-r01a1", "#b-r01b1"], T.gives + 0.1, 0.3);
    write(["#b-r500", "#b-r501"], T.gives + 0.4, 0.4);
    fade("#b-halfw", 0, T.gives, 0.3);
    // the question moves: the gold jumps from up and down to front and back
    fade("#b-vaxg", 0, T.front11, 0.25);
    fade("#b-tagud", 0, T.front11, 0.2); write("#b-tagfb", T.front11 + 0.1, 0.5);
    fade(["#b-r01a0", "#b-r01b0", "#b-r01a1", "#b-r01b1"], 0, T.axis11 - 0.15, 0.2);
    write(["#b-rfba0", "#b-rfbb0", "#b-rfba1", "#b-rfbb1"], T.axis11, 0.35);
    fade(["#b-r500", "#b-r501"], 0, T.always11 - 0.2, 0.2);
    write("#b-ralw0", T.always11, 0.4); write("#b-ralw1", T.minus11 + 0.3, 0.4);
    toGold("#b-rk1", T.minus11, 0.2);
    blurOut("#b-sR", T.endC);
    fade("#b-mid", 0, T.endC, 0.3);
    move("#b-sC", { x: 0, scale: 1 }, { x: -140, scale: 0.8 }, T.endC, 0.8);

    // ---------- D. Hardware asks up or down, so turn first ----------
    draw(["#b-dm-body", "#b-dm-nd"], T.hardware - 0.1, 1.0); write(["#b-dm-m0", "#b-dm-m1"], T.hardware + 0.8, 0.2);
    write("#b-dhw", T.hardware + 0.2, 0.6);
    write("#b-dtag", T.up12 - 0.3, 0.8);
    fade("#b-vaxg", 1, T.up12, 0.2);
    draw("#b-dwire", T.turn13 - 0.05, 0.7); write("#b-dq", T.turn13, 0.4);
    draw("#b-dh", T.hgate - 0.15, 0.45); write("#b-dH", T.hgate + 0.1, 0.25);
    fade(["#b-front", "#b-back"], 0, T.swaps, 0.25);
    draw("#b-swapL", T.swaps + 0.1, 0.6); draw("#b-swapR", T.swaps + 0.4, 0.6);
    fade(["#b-swapL", "#b-swapR"], 0, T.down13 + 0.4, 0.3);
    draw("#b-dout", T.plus14 - 0.3, 0.25);
    write("#b-drk0", T.plus14 - 0.1, 0.3); write("#b-drk1", T.minus14 - 0.1, 0.3);
    [0, 1].forEach((rI) => [0, 1, 2, 3].forEach((i) => write("#b-dd" + rI + i, dDigT(rI, i), 0.12)));
    draw("#b-dtick", T.every, 0.35);
    blurOut(["#b-sD", "#b-sC"], T.endD);

    // ---------- E. Where the picture breaks ----------
    draw("#b-etorch", T.here15 - 0.1, 0.6); draw("#b-elens", T.here15 + 0.2, 0.7);
    draw("#b-crack", T.breaks, 0.35);
    write("#b-ebeam", T.beam + 0.2, 0.7);
    fade(["#b-w4", "#b-w5", "#b-ebeam"], 0, T.particle - 0.2, 0.25);
    write("#b-eone", T.particle, 0.7);
    write("#b-epass", T.passes15 + 0.1, 0.5);
    fade("#b-eone", 0, T.passes15 + 0.3, 0.2);
    write("#b-estop", T.doesnt - 0.05, 0.35);
    draw("#b-stopbar", T.doesnt, 0.2);
    blurOut("#b-sE1", T.endE1);

    draw("#b-eball", T.l16 - 0.05, 1.0); draw("#b-evax", T.l16 + 0.3, 0.6); draw("#b-earrow", T.l16 + 0.6, 0.5);
    draw(["#b-eb0-fr", "#b-eb1-fr", "#b-ebase"], T.l16 + 0.5, 0.6);
    write(["#b-ebl0", "#b-ebl1"], T.l16 + 0.9, 0.2); write("#b-etag", T.l16 + 0.8, 0.5);
    write("#b-erand", T.random - 0.1, 0.45); draw("#b-ecross", T.random + 0.45, 0.25);
    tl.to("#b-eglow", { opacity: 1, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.perfectly);
    write("#b-edef", T.perfectly + 0.1, 0.9);
    draw("#b-eright", T.lined - 0.1, 0.3);
    tl.to("#b-erightg", { opacity: 1, duration: 0.15 }, T.lined + 0.2); tl.to("#b-erightg", { opacity: 0, duration: 0.3 }, T.lined + 0.9);
    blurOut("#b-sE2", T.endE);

    // ---------- F. Closing card ----------
    write("#b-fhead", T.measurement - 0.05, 1.5);
    draw("#b-fball", T.another - 0.4, 0.8);
    draw("#b-fwire", T.another - 0.1, 0.5); draw("#b-fh", T.another + 0.1, 0.4); write("#b-fH", T.another + 0.3, 0.2);
    draw(["#b-fm-body", "#b-fm-nd"], T.another + 0.4, 0.5); draw("#b-fout", T.another + 0.8, 0.25);
    draw("#b-fturn", T.turn17, 0.7);
    write("#b-flab1", T.turn17 + 0.2, 0.9);
    write("#b-flab2", T.first - 0.6, 1.1);
    draw("#b-fund", T.lastEnd + 0.3, 1.6);

    // ---------- Continuous values ----------
    const R2D = Math.PI / 180;
    const C = ${JSON.stringify(C)}, EX = ${JSON.stringify(EX)};
    const BARS = ${JSON.stringify(Object.fromEntries(BARS.map((b) => [b.id, b])))};
    const WAVES = ${JSON.stringify(WAVES)};
    function setBar(id, v, goldOn) {
      const b = BARS[id], h = b.h * Math.max(0, Math.min(1, v));
      const cr = $(id + "-cr");
      cr.setAttribute("y", (b.base - h).toFixed(2)); cr.setAttribute("height", h.toFixed(2));
      const fg = $(id + "-fg");
      if (fg) { fg.style.opacity = goldOn ? "1" : "0"; $(id + "-fi").style.opacity = goldOn ? "0" : "1"; }
    }
    // A point on the ball: a = degrees from the top, positive toward the front.
    const proj = (a, s = 1) => [C.x + Math.sin(a * R2D) * EX[0] * s, C.y + Math.sin(a * R2D) * EX[1] * s - Math.cos(a * R2D) * C.R * s];
    function arrowD(x0, y0, x1, y1, head) {
      const a = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0);
      if (len < 2) return "";
      const hh = Math.min(head, len * 0.5);
      const mx = (x0 + x1) / 2 - Math.sin(a) * 2.5, my = (y0 + y1) / 2 + Math.cos(a) * 2.5;
      const h1 = [x1 - hh * Math.cos(a + 0.45), y1 - hh * Math.sin(a + 0.45)], h2 = [x1 - hh * Math.cos(a - 0.45), y1 - hh * Math.sin(a - 0.45)];
      const f = (v) => v.toFixed(1);
      return "M" + f(x0) + " " + f(y0) + " Q" + f(mx) + " " + f(my) + " " + f(x1) + " " + f(y1) + " M" + f(h1[0]) + " " + f(h1[1]) + " L" + f(x1) + " " + f(y1) + " L" + f(h2[0]) + " " + f(h2[1]);
    }
    const A_P = [[T.nearer, T.nearer + 0.9, 0, 30], [T.end8 - 0.2, T.end8 + 0.7, 30, 150], [T.likely + 0.1, T.likely + 0.95, 150, 0],
      [T.sideways, T.sideways + 0.9, 0, 90], [T.swaps, T.swaps + 1.6, 90, 0]];
    const A_M = [[T.swaps, T.swaps + 1.6, -90, -180]];
    const REV_P = [[T.arrow6 - 0.05, T.arrow6 + 0.5, 0, 1]];
    const REV_M = [[T.minus9, T.minus9 + 0.5, 0, 1]];
    const FB_REV = [[T.sideways, T.sideways + 0.8, 0, 1], [T.down13 + 0.1, T.down13 + 0.5, 1, 0]];
    const FB_ANG = [[T.swaps, T.swaps + 1.6, 90, 0]];
    const FB_GOLD = [[T.front11 - 0.05, T.front11 + 0.25, 0, 1], [T.endC, T.endC + 0.3, 1, 0]];
    const C8_GROW = [[T.nearer, T.nearer + 0.5, 0, 1]];
    const ROWV = {
      "b-rb00": [[T.gives, T.gives + 0.6, 0, 0.5], [T.always11, T.always11 + 0.8, 0.5, 1]],
      "b-rb01": [[T.gives, T.gives + 0.6, 0, 0.5], [T.always11, T.always11 + 0.8, 0.5, 0]],
      "b-rb10": [[T.gives + 0.15, T.gives + 0.75, 0, 0.5], [T.minus11 + 0.1, T.minus11 + 0.9, 0.5, 0]],
      "b-rb11": [[T.gives + 0.15, T.gives + 0.75, 0, 0.5], [T.minus11 + 0.1, T.minus11 + 0.9, 0.5, 1]],
    };
    const A_BARS = ${JSON.stringify(aBarSegs)};
    const E_BARS = [[T.l16 + 0.8, T.l16 + 1.4, 0, 0.5]];
    const LENS = [[T.tilt, T.tilt + 1.1, 0, 45]];
    const METER = [[T.only, T.only + 0.6, 0, 0.5], [T.all4, T.all4 + 0.7, 0.5, 1]];
    const WREV = {
      "b-w0": [[T.light2, T.light2 + 1.1, 0, 1]],
      "b-w1": [[T.slant3, T.slant3 + 0.6, 0, 1]],
      "b-w2": [[T.only, T.only + 0.45, 0, 1]],
      "b-w3": [[T.all4, T.all4 + 0.45, 0, 1]],
      "b-w4": [[T.beam - 0.1, T.beam + 0.4, 0, 1]],
      "b-w5": [[T.partly, T.partly + 0.4, 0, 1]],
    };
    const PHOTON_X = [[T.particle, T.particle + 0.8, 480, 846], [T.passes15 - 0.05, T.passes15 + 0.5, 846, 1250]];
    const GHOST_X = [[T.passes15 + 0.3, T.doesnt + 0.05, 480, 832]];
    const waveEls = {};
    const waveAx = {};
    WAVES.forEach((w) => { waveEls[w.id] = Array.from($(w.id).querySelectorAll(".wv-t")); waveAx[w.id] = $(w.id).querySelector(".wv-axis"); });
    const kW = (2 * Math.PI) / 120, vW = 190;
    function drawWave(w, t, rev) {
      const front = w.x0 + (w.x1 - w.x0) * rev, s = Math.sin(w.ang * R2D), c = Math.cos(w.ang * R2D);
      const ax = waveAx[w.id];
      ax.style.opacity = rev > 0 ? "1" : "0"; ax.setAttribute("x2", front.toFixed(1));
      waveEls[w.id].forEach((el, i) => {
        const x = w.x0 + i * w.step;
        if (rev <= 0 || x > front) { el.style.opacity = "0"; return; }
        const edge = Math.min(1, (front - x) / 40);
        const d = w.amp * edge * Math.sin(kW * (x - vW * t));
        el.style.opacity = "1";
        el.setAttribute("x2", (x + d * s).toFixed(1)); el.setAttribute("y2", (w.y - d * c).toFixed(1));
      });
    }
    function needleA(b, t) {
      let a = 0;
      if (t > T.measure && t < T.usual + 0.1) a = 42 * Math.sin(16 * (t - T.measure)) * (1 - (t - T.measure) / (T.usual + 0.1 - T.measure));
      DIG[b].split("").forEach((d, i) => {
        const td = digT(b, i);
        if (t >= td) { const prev = a, to = d === "0" ? -52 : 52; a = prev + (to - prev) * Math.min(1, (t - td) / 0.12); }
      });
      return a + 1.5 * Math.sin(t * 5.3 + b);
    }
    function needleD(t) {
      let a = 30 * Math.sin(t * 2.7) + 10 * Math.sin(t * 5.9);
      const r0 = dDigT(0, 0), r1 = dDigT(1, 0);
      if (t >= r0 - 0.1 && t < r1 - 0.1) a = -52 + 3 * Math.sin(t * 9);
      else if (t >= r1 - 0.1) a = 52 + 3 * Math.sin(t * 9);
      return a;
    }
    const kp = $("b-kp"), km = $("b-km");
    function rideLabel(el, tip, side) {
      const dx = tip[0] - C.x, dy = tip[1] - C.y, len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const px = side > 0 ? -uy : uy, py = side > 0 ? ux : -ux;
      const cx = tip[0] + px * 76 - ux * 55, cy = tip[1] + py * 76 - uy * 55;
      el.style.left = (cx - 60).toFixed(1) + "px"; el.style.top = (cy - 42).toFixed(1) + "px";
    }
    onFrame((t) => {
      // A: needles and count bars
      [0, 1].forEach((b) => {
        const cx = ${JSON.stringify(BX)}[b];
        $("b-am" + b + "-rot").setAttribute("transform", "translate(" + cx + " 439.4) rotate(" + needleA(b, t).toFixed(2) + ")");
        [0, 1].forEach((j) => setBar("b-ab" + b + j, sched(A_BARS["b-ab" + b + j], t, 0), false));
      });
      // B: lens tilt, waves, light meter
      $("b-lensrot").setAttribute("transform", "rotate(" + sched(LENS, t, 0).toFixed(2) + " ${LC[0]} ${LC[1]})");
      const m = sched(METER, t, 0) * 312;
      $("b-lm-cr").setAttribute("y", (700 - m).toFixed(1)); $("b-lm-cr").setAttribute("height", m.toFixed(1));
      WAVES.forEach((w) => drawWave(w, t, sched(WREV[w.id], t, 0)));
      // C and D: the arrows on the ball
      const aP = sched(A_P, t, 0), aM = sched(A_M, t, -90);
      const rP = sched(REV_P, t, 0), rM = sched(REV_M, t, 0);
      const tipP = proj(aP), tipM = proj(aM);
      const eP = [C.x + (tipP[0] - C.x) * rP, C.y + (tipP[1] - C.y) * rP], eM = [C.x + (tipM[0] - C.x) * rM, C.y + (tipM[1] - C.y) * rM];
      $("b-arP").setAttribute("d", rP > 0.01 ? arrowD(C.x, C.y, eP[0], eP[1], 30) : "");
      $("b-arM").setAttribute("d", rM > 0.01 ? arrowD(C.x, C.y, eM[0], eM[1], 24) : "");
      $("b-hub").style.opacity = rP > 0.01 ? "1" : "0";
      const glow = t > T.plus9 && t < T.plus9 + 0.9 ? Math.sin(Math.PI * (t - T.plus9) / 0.9) : 0;
      $("b-glowP").setAttribute("d", glow > 0.01 ? "M" + C.x + " " + C.y + " L" + eP[0].toFixed(1) + " " + eP[1].toFixed(1) : "");
      $("b-glowP").style.opacity = String(glow);
      rideLabel(kp, tipP, 1); rideLabel(km, tipM, -1);
      const fr = sched(FB_REV, t, 0), fa = sched(FB_ANG, t, 90), fg = sched(FB_GOLD, t, 0);
      const fs = 1.06 + 0.19 * Math.sin(fa * R2D), fe = proj(fa, fs), fb = proj(fa + 180, fs);
      ["b-fbax", "b-fbaxg"].forEach((id) => {
        const el = $(id);
        el.setAttribute("x1", (C.x + (fb[0] - C.x) * fr).toFixed(1)); el.setAttribute("y1", (C.y + (fb[1] - C.y) * fr).toFixed(1));
        el.setAttribute("x2", (C.x + (fe[0] - C.x) * fr).toFixed(1)); el.setAttribute("y2", (C.y + (fe[1] - C.y) * fr).toFixed(1));
      });
      $("b-fbax").style.opacity = fr > 0.01 ? String(1 - fg) : "0";
      $("b-fbaxg").style.opacity = fr > 0.01 ? String(fg) : "0";
      // line 8 chart follows the arrow
      const p0 = Math.cos((aP * R2D) / 2) ** 2, grow = sched(C8_GROW, t, 0);
      setBar("b-cb0", p0 * grow, p0 > 0.52); setBar("b-cb1", (1 - p0) * grow, p0 < 0.48);
      $("b-cpv0").textContent = String(Math.round(p0 * 100)); $("b-cpv1").textContent = String(Math.round((1 - p0) * 100));
      $("b-cpc0").style.color = p0 > 0.52 ? GOLDC : INKC; $("b-cpc1").style.color = p0 < 0.48 ? GOLDC : INKC;
      $("b-cbl0").style.color = p0 > 0.52 ? GOLDC : INKC; $("b-cbl1").style.color = p0 < 0.48 ? GOLDC : INKC;
      // rows: asked up or down, then front or back
      Object.entries(ROWV).forEach(([id, segs]) => { const v = sched(segs, t, 0); setBar(id, v, v > 0.75); });
      // D: meter needle
      $("b-dm-rot").setAttribute("transform", "translate(1540 574.4) rotate(" + needleD(t).toFixed(2) + ")");
      // E: beam, photon, ghost, bars
      const px = sched(PHOTON_X, t, 480);
      $("b-photon").style.opacity = t >= T.particle - 0.05 && px < 1495 ? "1" : "0";
      $("b-photon").setAttribute("cx", px.toFixed(1));
      const gx = sched(GHOST_X, t, 480);
      $("b-ghost").style.opacity = t >= T.passes15 + 0.3 ? "1" : "0";
      $("b-ghost").setAttribute("cx", gx.toFixed(1));
      [0, 1].forEach((j) => setBar("b-eb" + j, sched(E_BARS, t, 0), false));
      // F: the closing meter keeps swinging gently
      $("b-fm-rot").setAttribute("transform", "translate(1240 548) rotate(" + (26 * Math.sin(t * 1.9) + 8 * Math.sin(t * 4.1)).toFixed(2) + ")");
    });
  `;
  return { html, script, css: "" };
}
