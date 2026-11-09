// Lesson 16, "A secret string in one question" (Bernstein Vazirani). Follows plan.md: a locked box
// hiding 101, the wall of three switches with hidden wiring to a buzzer that only tells odd or even,
// testing one switch at a time (three questions), the circuit (three qubits, H to plus, a buzzer
// qubit in minus, the box asked once), phase kickback swinging the wired qubits' bars to minus,
// fifty fifty if measured now, the second H merging the bars into 1 0 1, the misconception (no
// secret trial of all eight settings), interference leaving only 101, where the switch wall breaks,
// the parity-only rule, and the closing circuit. Gold always marks the secret (wired switches, the
// kicked-back minus signs, the 1s of the answer).
export const phrases = [
  ["one zero one", "101"],
  ["Bernstein Vazirani", "Bernstein-Vazirani"],
];

export default function scene(k) {
  const { r, pen, goldPen, lbl, cue, lines, INK, GOLD, DIM, GROUND } = k;
  const fx = (n) => +(+n).toFixed(2);
  const G = `color:${GOLD}`;
  const D = `color:${DIM}`;
  const ctr = (size) => fx(size * 0.745); // label top offset that centres its text on a y
  const lc = (id, cx, cy, w, size, html, extra = "") => lbl(id, fx(cx - w / 2), fx(cy - ctr(size)), w, size, html, extra);
  // Safe-area layer: a div over x 140..1780, y 60..860 whose svg uses board coordinates.
  const OX = 140, OY = 60;
  const svgL = (inner) => `<svg class="sk" width="1640" height="800" viewBox="${OX} ${OY} 1640 800">${inner}</svg>`;
  const layer = (id, inner, labels = "") => `<div id="${id}" class="obj" style="left:${OX}px;top:${OY}px;width:1640px;height:800px">${svgL(inner)}${labels}</div>`;
  // A label inside a layer, placed by board coordinates.
  const ll = (id, cx, cy, w, size, html, extra = "") => lc(id, cx - OX, cy - OY, w, size, html, extra);
  const g = (id, inner, extra = "") => `<g id="${id}"${extra}>${inner}</g>`;

  // ---------- drawing helpers ----------
  const hach = (o = {}) => pen({ fill: INK, fillStyle: "hachure", hachureGap: 7, fillWeight: 1.6, strokeWidth: 2.6, ...o });
  const ghach = (o = {}) => goldPen({ fill: GOLD, fillStyle: "hachure", hachureGap: 7, fillWeight: 1.8, strokeWidth: 3, ...o });
  const bez = (pts, n = 40) => Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    if (pts.length === 3) {
      const [p0, p1, p2] = pts, a = (1 - u) ** 2, b = 2 * u * (1 - u), c = u * u;
      return [fx(a * p0[0] + b * p1[0] + c * p2[0]), fx(a * p0[1] + b * p1[1] + c * p2[1])];
    }
    const [p0, p1, p2, p3] = pts, a = (1 - u) ** 3, b = 3 * u * (1 - u) ** 2, c = 3 * u * u * (1 - u), d = u ** 3;
    return [fx(a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0]), fx(a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1])];
  });
  const headAt = (pts, P, o, size = 20) => {
    const [x1, y1] = pts[pts.length - 3], [x2, y2] = pts[pts.length - 1];
    const a = Math.atan2(y2 - y1, x2 - x1), w = (o.strokeWidth ?? 3) * 0.85;
    return [0.45, -0.45].map((da) => r.line(x2, y2, fx(x2 - size * Math.cos(a + da)), fx(y2 - size * Math.sin(a + da)), P({ ...o, strokeWidth: w }))).join("");
  };
  const curveArrow = (pts, P = goldPen, o = { strokeWidth: 4 }) => {
    const c = bez(pts);
    return r.linear(c, P({ roughness: 0.6, ...o })) + headAt(c, P, o);
  };
  function dashed(pts, dash, gap, o) {
    let out = "", on = true, left = dash, cur = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const L = Math.hypot(x1 - x0, y1 - y0) || 1e-6, ux = (x1 - x0) / L, uy = (y1 - y0) / L;
      let pos = 0;
      while (L - pos > left) {
        pos += left;
        const p = [fx(x0 + ux * pos), fx(y0 + uy * pos)];
        if (on) { cur.push(p); out += r.linear(cur, pen({ roughness: 0.5, disableMultiStroke: true, ...o })); }
        on = !on; cur = [p]; left = on ? dash : gap;
      }
      left -= L - pos;
      cur.push([x1, y1]);
    }
    if (on && cur.length > 1) out += r.linear(cur, pen({ roughness: 0.5, disableMultiStroke: true, ...o }));
    return out;
  }
  const cross = (cx, cy, sx, sy, o = {}) =>
    r.line(cx - sx, cy - sy, cx + sx, cy + sy, pen({ strokeWidth: 5, ...o })) + r.line(cx + sx, cy - sy, cx - sx, cy + sy, pen({ strokeWidth: 5, ...o }));
  const tick = (cx, cy, s, P = pen, o = {}) => r.linear([[cx - s, cy], [fx(cx - s * 0.3), fx(cy + s * 0.7)], [cx + s, fx(cy - s * 0.9)]], P({ strokeWidth: 4, roughness: 0.8, ...o }));
  // A bell: dome, lip, clapper and a knob on top; (cx, cy) is the dome's middle.
  const bell = (cx, cy, R, P = pen) =>
    r.path(`M${cx - R} ${cy + 45 * R / 62} C${cx - R} ${fx(cy - R * 1.3)} ${cx + R} ${fx(cy - R * 1.3)} ${cx + R} ${cy + 45 * R / 62}`, P({ strokeWidth: 3.4 })) +
    r.line(fx(cx - R - 14 * R / 62), fx(cy + 50 * R / 62), fx(cx + R + 14 * R / 62), fx(cy + 50 * R / 62), P({ strokeWidth: 3.4 })) +
    r.circle(cx, fx(cy + 64 * R / 62), fx(22 * R / 62), P({ strokeWidth: 2.6 })) +
    r.circle(cx, fx(cy - 56 * R / 62), fx(16 * R / 62), P({ strokeWidth: 2.4 }));
  const soundArcs = (cx, cy, radii, a0 = -0.6, a1 = 0.6) => radii.map((rad) => r.arc(cx, cy, rad * 2, rad * 2, a0, a1, false, goldPen({ strokeWidth: 3.4 }))).join("");
  // A small toggle switch icon (plate + lever up) centred on (cx, cy).
  const miniSwitch = (cx, cy) =>
    r.rect(cx - 15, cy - 24, 30, 48, pen({ strokeWidth: 2.4, roughness: 0.9 })) + r.line(cx, cy + 2, cx, cy - 14, pen({ strokeWidth: 3.4, roughness: 0.5 })) + r.circle(cx, cy - 16, 9, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" }));
  const hBox = (cx, cy, s = 66) => r.rect(cx - s / 2, cy - s / 2, s, s, pen({ strokeWidth: 3, roughness: 1, fill: GROUND, fillStyle: "solid" }));
  // A meter: box, dial arc and a needle group (id) that can swing about (x, y + h*0.28).
  const meter = (x, y, nid, a0 = -40, w = 90, h = 66) =>
    r.rect(x - w / 2, y - h / 2, w, h, pen({ strokeWidth: 3, fill: GROUND, fillStyle: "solid" })) +
    r.arc(x, fx(y + h * 0.28), fx(w * 0.66), fx(w * 0.66), Math.PI, 2 * Math.PI, false, pen({ strokeWidth: 2.4 })) +
    `<g id="${nid}" transform="rotate(${a0} ${x} ${fx(y + h * 0.28)})">${r.line(x, fx(y + h * 0.28), x, fx(y - h * 0.3), pen({ strokeWidth: 3 }))}</g>`;
  // A sign bar of height h rising from baseline y (dir -1 draws it downward). Ink and gold versions.
  const barRect = (x, y, h, wdt, P) => r.rect(fx(x - wdt / 2), y - h, wdt, h, P === "g" ? ghach() : hach());
  const barRectDown = (x, y, h, wdt, P) => r.rect(fx(x - wdt / 2), y, wdt, h, P === "g" ? ghach() : hach());
  const BH = 50, BW = 22;
  // A bar pair group: <g id> (transform driven) holding <g id-i> ink and <g id-g> gold.
  const bar = (id, x, y, opts = {}) => {
    const { h = BH, w = BW, down = false, ink = true, gold = true } = opts;
    const R = down ? barRectDown : barRect;
    return `<g id="${id}">${ink ? g(id + "i", R(x, y, h, w, "i")) : ""}${gold ? g(id + "g", R(x, y, h, w, "g")) : ""}</g>`;
  };

  // ---------- times ----------
  const T = {
    box0: cue(0, "box"), secret0: cue(0, "secret"), s101: cue(0, "one"), how0: cue(0, "how"),
    s1: cue(1), wall1: cue(1, "wall"), three1: cue(1, "three"), secretly1: cue(1, "secretly"), wired1: cue(1, "wired"), buzzer1: cue(1, "buzzer"),
    odd2: cue(2, "odd"), wired2: cue(2, "wired"),
    s3: cue(3), one3: cue(3, "one"), three3: cue(3, "three", 1),
    s4: cue(4), quantum4: cue(4, "quantum"), one4: cue(4, "one"),
    s5: cue(5), switch5: cue(5, "switch"), qubit5: cue(5, "qubit"), zero5: cue(5, "zero"),
    s6: cue(6), hgate6: cue(6, "hgate"), plus6: cue(6, "plus"), even6: cue(6, "even"), zero6: cue(6, "zero"), one6: cue(6, "one"),
    s7: cue(7), extra7: cue(7, "extra"), minus7: cue(7, "minus"), minus7b: cue(7, "minus", 1), ask7: cue(7, "ask"), once7: cue(7, "once"),
    s8: cue(8), wired8: cue(8, "wired"), kicks8: cue(8, "kicks"), turning8: cue(8, "turning"), plus8: cue(8, "plus"), minus8b: cue(8, "minus", 1),
    s9: cue(9), phase9: cue(9, "phase"), phase9b: cue(9, "phase", 1),
    s10: cue(10), measure10: cue(10, "measure"), fifty10: lines[10].words.find((w) => w.w.startsWith("50")).start, hides10: cue(10, "hides"),
    s11: cue(11), more11: cue(11, "more"), turns11: cue(11, "turns"), back11: cue(11, "back"), zero11: cue(11, "zero"), minus11: cue(11, "minus"), one11: cue(11, "one", 1),
    s12: cue(12), measure12: lines[12].words[0].start, d1: lines[12].words[4].start, d2: lines[12].words[5].start, d3: lines[12].words[6].start, every12: cue(12, "every"), single12: cue(12, "single"),
    s13: cue(13), every13: cue(13, "every"), collect13: cue(13, "collect"),
    s14: cue(14), interference14: cue(14, "interference"), add14: cue(14, "add"), ripples14: cue(14, "ripples"), only14: cue(14, "only"), secret14: cue(14, "secret"),
    s15: cue(15), switch15: cue(15, "switch"), on15: cue(15, "on"), off15: cue(15, "off"), never15: cue(15, "never"),
    s16: cue(16), odd16: cue(16, "odd"), rule16: cue(16, "rule"), unpick16: cue(16, "unpick"), most16: cue(16, "most"),
    s17: cue(17), bern17: cue(17, "bernstein"), phase17: cue(17, "phase"), every17: cue(17, "every"), oneq17: cue(17, "one"), whole17: cue(17, "whole"),
  };

  // ================= 0: the locked box =================
  const BOX = { x: 760, y: 420, w: 400, h: 300 };
  const boxSvg =
    g("b-box0", r.rect(BOX.x, BOX.y, BOX.w, BOX.h, pen({ strokeWidth: 3.4 })) + r.line(BOX.x - 14, BOX.y + 52, BOX.x + BOX.w + 14, BOX.y + 52, pen({ strokeWidth: 3 })) +
      r.line(BOX.x - 14, BOX.y + 52, BOX.x - 6, BOX.y, pen({ strokeWidth: 2.6 })) + r.line(BOX.x + BOX.w + 14, BOX.y + 52, BOX.x + BOX.w + 6, BOX.y, pen({ strokeWidth: 2.6 }))) +
    g("b-lock0", r.arc(960, 472, 40, 44, Math.PI, 2 * Math.PI, false, pen({ strokeWidth: 3.4 })) + r.rect(936, 470, 48, 40, hach({ hachureGap: 6 })) ) +
    g("b-cards0", [860, 960, 1060].map((x) => r.rect(x - 36, 545, 72, 96, pen({ strokeWidth: 2.6, roughness: 1 }))).join(""));
  const tagSvg = `<svg class="sk" width="340" height="110" viewBox="0 0 340 110">${g("b-tagr", r.rect(10, 10, 320, 90, goldPen({ strokeWidth: 3 })) + r.circle(36, 55, 14, goldPen({ strokeWidth: 2.4 })))}</svg>`;
  const html0 =
    `<div id="b-s0" class="obj" style="left:${OX}px;top:${OY}px;width:1640px;height:800px">${svgL(boxSvg)}` +
    [860, 960, 1060].map((x, i) => ll("b-q0-" + i, x, 593, 70, 64, "?")).join("") +
    ll("b-how0", 960, 790, 520, 56, "how many questions?") +
    `</div>` +
    `<div id="b-tag0" class="obj" style="left:790px;top:300px;width:340px;height:110px">${tagSvg}${lc("b-tagt", 186, 55, 280, 56, "secret: 101", G)}</div>`;

  // ================= 1-3: the switch wall and the buzzer =================
  const SW = [520, 810, 1100], PIV = 520, BELL = { x: 1500, y: 460 };
  const swPlate = (x) => r.rect(x - 55, 440, 110, 160, pen({ strokeWidth: 3, roughness: 1.1 })) + r.rect(x - 16, 470, 32, 100, pen({ strokeWidth: 2.4, roughness: 1 })) + r.circle(x, 452, 8, pen({ strokeWidth: 1.8 })) + r.circle(x, 588, 8, pen({ strokeWidth: 1.8 }));
  const lever = (x, y, len, kd, sw) => r.line(x, y, x, y - len, pen({ strokeWidth: sw, roughness: 0.6 })) + r.circle(x, y - len - kd / 2 + 6, kd, hach({ hachureGap: 5 }));
  const wire1 = dashed([[520, 440], [520, 360], [1500, 360], [1500, 392]], 16, 11, { stroke: DIM, strokeWidth: 3 });
  const wire3 = dashed([[1100, 440], [1100, 398], [1385, 398], [1442, 462]], 16, 11, { stroke: DIM, strokeWidth: 3 });
  const wallSvg =
    g("b-panel", r.rect(360, 300, 900, 420, pen({ strokeWidth: 3.4, roughness: 1.2 })) + [[380, 320], [1240, 320], [380, 700], [1240, 700]].map(([x, y]) => r.circle(x, y, 10, pen({ strokeWidth: 1.8 }))).join("")) +
    SW.map((x, i) => g("b-plate" + i, swPlate(x))).join("") +
    SW.map((x, i) => g("b-lev" + i, lever(x, PIV, 58, 30, 7), ` transform="translate(0 ${2 * PIV}) scale(1 -1)"`)).join("") +
    g("b-wire1", wire1) + g("b-wire3", wire3) +
    `<g id="b-bellsh">${g("b-bell", bell(BELL.x, BELL.y, 62))}</g>` +
    g("b-sign", r.rect(1420, 560, 160, 84, pen({ strokeWidth: 2.8 })) + r.line(1500, 540, 1500, 560, pen({ strokeWidth: 2.4 }))) +
    ["A", "B", "C"].map((s) => g("b-arcs" + s, soundArcs(BELL.x, BELL.y, [100, 130, 160]))).join("") +
    [0, 1, 2].map((i) => g("b-tm" + i, r.line(1588 + i * 18, 680, 1584 + i * 18, 722, pen({ strokeWidth: 3.4 })))).join("");
  const wallLabels =
    SW.map((x, i) => ll("b-n" + i, x, 650, 50, 44, String(i + 1))).join("") +
    ll("b-hidden", 810, 268, 300, 40, "hidden wiring", D) +
    ll("b-odd", 1500, 602, 140, 56, "ODD", G) + ll("b-even", 1500, 602, 150, 56, "EVEN") +
    ll("b-cnt", 760, 770, 240, 44, "wired + on:", "text-align:right") + ll("b-cnt1", 905, 770, 40, 44, "1", G) + ll("b-cnt2", 905, 770, 40, 44, "2") +
    ["1", "0", "1"].map((d, i) => ll("b-dg" + i, SW[i], 780, 60, 64, d, d === "1" ? G : "")).join("") +
    ll("b-qs", 1490, 700, 180, 44, "questions:", "text-align:right") + ll("b-q3", 1690, 700, 70, 44, "= 3");
  const html1 = layer("b-wall", wallSvg, wallLabels);

  // ================= 4: three questions vs one =================
  const chip = (cx, cy) => r.rect(cx - 50, cy - 50, 100, 100, pen({ strokeWidth: 3 })) + r.rect(cx - 24, cy - 24, 48, 48, pen({ strokeWidth: 2.2 })) +
    [-30, 0, 30].map((d) => r.line(cx + d, cy - 50, cx + d, cy - 68, pen({ strokeWidth: 2.4 })) + r.line(cx + d, cy + 50, cx + d, cy + 68, pen({ strokeWidth: 2.4 })) + r.line(cx - 50, cy + d, cx - 68, cy + d, pen({ strokeWidth: 2.4 })) + r.line(cx + 50, cy + d, cx + 68, cy + d, pen({ strokeWidth: 2.4 }))).join("");
  const html4 = layer("b-s4", g("b-chip", chip(720, 590)) + g("b-strike", r.line(820, 436, 1180, 424, pen({ strokeWidth: 5 }))),
    ll("b-3q", 1000, 430, 420, 72, "3 questions") + ll("b-1q", 1010, 590, 380, 80, "1 question", G));

  // ================= 5-12: the circuit =================
  const WY = [250, 390, 530, 690];
  const XA = [492, 532], XB = [980, 1020], XC = [1270, 1310], DXC = XC[0] - XB[0];
  const cnot = (x, wy) => r.circle(x, wy, 18, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1 })) + r.line(x, wy, x, WY[3] - 18, pen({ strokeWidth: 3 })) + r.circle(x, WY[3], 36, pen({ strokeWidth: 3 })) + r.line(x - 18, WY[3], x + 18, WY[3], pen({ strokeWidth: 2.4 }));
  const kickPts = [[[896, 676], [962, 520], [944, 380], [950, 268]], [[912, 676], [940, 610], [946, 580], [950, 548]]];
  const circSvg =
    [0, 1, 2].map((i) => g("b-cw" + i, r.line(345, WY[i], 1435, WY[i], pen({ strokeWidth: 2.8, roughness: 0.9 })) + miniSwitch(172, WY[i]))).join("") +
    g("b-cw3", r.line(345, WY[3], 1110, WY[3], pen({ strokeWidth: 2.8, roughness: 0.9 })) + bell(178, WY[3] - 4, 24)) +
    [0, 1, 2].map((i) => g("b-h1-" + i, hBox(420, WY[i]))).join("") +
    [0, 1, 2].map((i) => g("b-h2-" + i, hBox(1190, WY[i]))).join("") +
    g("b-orc", r.rect(680, 190, 200, 560, pen({ strokeWidth: 3.6, roughness: 1.2 }))) +
    g("b-cn0", cnot(740, WY[0])) + g("b-cn2", cnot(820, WY[2])) +
    kickPts.map((p, i) => g("b-kick" + i, curveArrow(p))).join("") +
    // column A: wires 0-2 plus, buzzer minus
    [0, 1, 2].map((i) => bar(`b-a${i}-0`, XA[0], WY[i]) + bar(`b-a${i}-1`, XA[1], WY[i])).join("") +
    bar("b-a3-0", XA[0], WY[3]) + bar("b-a3-1", XA[1], WY[3], { down: true }) +
    // column B: after the box
    [0, 1, 2].map((i) => bar(`b-b${i}-0`, XB[0], WY[i], { gold: false }) + bar(`b-b${i}-1`, XB[1], WY[i])).join("") +
    // column C: copies that flow through the second H and merge
    [0, 1, 2].map((i) => bar(`b-c${i}-0`, XC[0], WY[i], { gold: false }) + bar(`b-c${i}-1`, XC[1], WY[i], i === 1 ? { gold: false } : { ink: false })).join("") +
    [0, 2].map((i) => g("b-ring" + i, r.ellipse(XB[1], WY[i] + 26, 58, 96, goldPen({ strokeWidth: 3.2 })))).join("") +
    [0, 1, 2].map((i) => g("b-m1-" + i, meter(1190, WY[i], "b-nd1-" + i))).join("") +
    [0, 1, 2].map((i) => g("b-m2-" + i, meter(1480, WY[i], "b-nd2-" + i, 0))).join("") +
    g("b-brk", r.rect(1556, 196, 92, 390, goldPen({ strokeWidth: 3.2, roughness: 1.3 })));
  const circLabels =
    [0, 1, 2].map((i) => ll("b-num" + i, 216, WY[i], 34, 40, String(i + 1))).join("") +
    [0, 1, 2].map((i) => ll("b-k0-" + i, 290, WY[i], 90, 44, "|0⟩") + ll("b-k0g-" + i, 290, WY[i], 90, 44, "|0⟩", G)).join("") +
    ll("b-km3", 290, WY[3], 90, 44, "|-⟩") +
    [0, 1, 2].map((i) => ll("b-hl1-" + i, 420, WY[i] - 4, 50, 44, "H", "font-family:'TASA Orbiter','Inter',sans-serif;font-weight:600") + ll("b-hl2-" + i, 1190, WY[i] - 4, 50, 44, "H", "font-family:'TASA Orbiter','Inter',sans-serif;font-weight:600")).join("") +
    ll("b-qdef", 1400, 120, 440, 48, "qubit = quantum bit") + ll("b-hdef", 1400, 120, 480, 44, "H gate = a quantum step") +
    [0, 1, 2].map((i) => ll("b-ka" + i, 590, WY[i] - 20, 80, 48, "|+⟩")).join("") + ll("b-ka3", 590, WY[3] - 20, 80, 48, "|-⟩") +
    [["a", XA], ["c", XC]].map(([c, X]) => ll(`b-lg${c}0`, X[0], 160, 34, 40, "0") + ll(`b-lg${c}1`, X[1], 160, 34, 40, "1")).join("") +
    ll("b-orcl", 725, 145, 100, 56, "box") + ll("b-once", 880, 147, 200, 48, "asked once", G) +
    [0, 1, 2].map((i) => ll("b-kb" + i, 1078, WY[i] - 20, 80, 48, "|+⟩") + (i !== 1 ? ll("b-kbm" + i, 1078, WY[i] - 20, 80, 48, "|-⟩", G) : "")).join("") +
    ll("b-phdef", 780, 805, 460, 48, "phase = a hidden sign") + ll("b-pk", 1400, 115, 400, 56, "phase kickback", G) +
    [0, 1, 2].map((i) => ll("b-fl" + i, 1272, WY[i] - 28, 44, 56, "0") + ll("b-ff" + i, 1366, WY[i] - 24, 120, 44, "50/50")).join("") +
    ll("b-kc0", 1380, WY[0] - 20, 80, 48, "|1⟩", G) + ll("b-kc1", 1380, WY[1] - 20, 80, 48, "|0⟩") + ll("b-kc2", 1380, WY[2] - 20, 80, 48, "|1⟩", G) +
    ["1", "0", "1"].map((d, i) => ll("b-rd" + i, 1602, WY[i], 70, 80, d, (d === "1" ? G : "") + ";line-height:1")).join("") +
    ll("b-s101", 1610, 650, 260, 64, "s = 101", G);
  const html5 = layer("b-circ", circSvg, circLabels);

  // ================= 13-14: eight settings, then interference =================
  const SETS = ["000", "001", "010", "011", "100", "101", "110", "111"];
  const GX = [520, 800, 1080, 1360], GY = [380, 560];
  const gridPos = (i) => [GX[i % 4], GY[Math.floor(i / 4)]];
  const rowX = (i) => 382 + 165 * i, ROWY = 710, BASE = 660;
  const cards = SETS.map((s, i) => {
    const [cx, cy] = gridPos(i);
    return `<div id="b-card${i}" class="obj" style="left:${cx - 90}px;top:${cy - 50}px;width:180px;height:100px">` +
      `<svg class="sk" width="180" height="100" viewBox="0 0 180 100">${g("b-cr" + i, r.rect(6, 6, 168, 88, pen({ strokeWidth: 2.8, roughness: 1 })))}</svg>` +
      lc("b-ct" + i, 90, 50, 150, 56, s) + (i === 5 ? lc("b-ctg", 90, 50, 150, 56, s, G) : "") + `</div>`;
  }).join("");
  const ripple = (cx, cy) => [56, 100, 144].map((rad) => r.arc(cx, cy, rad * 2, rad * 2, 0.15, Math.PI - 0.15, false, pen({ stroke: DIM, strokeWidth: 3 }))).join("");
  const chartSvg =
    g("b-ticks", SETS.map((_, i) => { const [cx, cy] = gridPos(i); return tick(cx + 116, cy, 13); }).join("")) +
    g("b-bigx", cross(940, 470, 560, 190)) +
    g("b-base", r.line(300, BASE, 1620, BASE, pen({ strokeWidth: 2.4 }))) +
    SETS.map((_, i) => g("b-ib" + i, r.rect(rowX(i) - 35, BASE - 120, 70, 120, hach({ hachureGap: 9 })))).join("") +
    g("b-gb", r.rect(rowX(5) - 35, BASE - 380, 70, 380, ghach({ hachureGap: 9 }))) +
    g("b-rip0", ripple(720, 250)) + g("b-rip1", ripple(1160, 250));
  const html13 = layer("b-s13", chartSvg, ll("b-only", rowX(5), 225, 280, 64, "only 101", G)) + cards;

  // ================= 15-16: where the analogy breaks =================
  const bigSw = r.rect(500, 300, 260, 400, pen({ strokeWidth: 3.4, roughness: 1.1 })) + r.rect(595, 380, 70, 240, pen({ strokeWidth: 2.8 })) + r.circle(630, 330, 14, pen({ strokeWidth: 2 })) + r.circle(630, 670, 14, pen({ strokeWidth: 2 }));
  const breakSvg =
    g("b-bsw", bigSw) + g("b-blev", lever(630, 500, 96, 50, 10), ` transform="translate(0 1000) scale(1 -1)"`) +
    g("b-bp", r.line(1130, 560, 1350, 560, pen({ strokeWidth: 2.6 })) + barRect(1190, 560, 100, 50, "i") + barRect(1290, 560, 100, 50, "i")) +
    g("b-bx", cross(1300, 520, 200, 150)) +
    // 16: the parity bell and the other rules
    `<g id="b-pbsh">${g("b-pbell", bell(590, 410, 70))}</g>` + g("b-psign", r.rect(470, 520, 240, 80, pen({ strokeWidth: 2.8 })) + r.line(590, 490, 590, 520, pen({ strokeWidth: 2.4 }))) +
    g("b-parcs", soundArcs(590, 410, [110, 140], -0.7, 0.5)) + g("b-ptick", tick(810, 420, 34, goldPen, { strokeWidth: 5 })) +
    g("b-lump", r.curve([[1110, 360], [1200, 320], [1330, 345], [1440, 330], [1460, 450], [1430, 570], [1300, 590], [1180, 575], [1100, 560], [1090, 450], [1110, 360]], pen({ strokeWidth: 3.4 }))) +
    g("b-lx", cross(1275, 455, 200, 150));
  const breakLabels =
    ll("b-on", 630, 255, 90, 56, "on") + ll("b-off", 630, 748, 100, 56, "off") +
    ll("b-bl0", 1190, 600, 40, 44, "0") + ll("b-bl1", 1290, 600, 40, 44, "1") + ll("b-bk", 1240, 395, 110, 64, "|+⟩") +
    ll("b-noreal", 1290, 720, 480, 44, "no real switch does this") +
    ll("b-pt", 590, 560, 230, 48, "ODD / EVEN") + ll("b-prule", 600, 690, 420, 56, "odd or even rule", G) +
    ll("b-qm", 1275, 455, 80, 96, "?") + ll("b-other", 1275, 665, 300, 56, "other rules");
  const html15 = layer("b-s15", breakSvg, breakLabels);

  // ================= 17: closing card =================
  const CW = [330, 420, 510, 610];
  const ck = [[[1020, 598], [1086, 480], [1066, 380], [1070, 338]], [[1036, 598], [1062, 560], [1066, 540], [1070, 518]]];
  const endSvg =
    [0, 1, 2].map((i) => r.line(540, CW[i], 1260, CW[i], pen({ strokeWidth: 2.8, roughness: 0.9 }))).join("") + r.line(540, CW[3], 1110, CW[3], pen({ strokeWidth: 2.8, roughness: 0.9 })) +
    [0, 1, 2].map((i) => hBox(640, CW[i], 56) + hBox(1160, CW[i], 56) + meter(1300, CW[i], "b-endnd" + i, -30, 80, 56)).join("") +
    r.rect(820, 290, 200, 360, pen({ strokeWidth: 3.4, roughness: 1.2 }));
  const endLabels =
    [0, 1, 2].map((i) => ll("b-ek" + i, 490, CW[i], 90, 44, "|0⟩") + ll("b-eh1" + i, 640, CW[i] - 4, 40, 40, "H", "font-family:'TASA Orbiter','Inter',sans-serif;font-weight:600") + ll("b-eh2" + i, 1160, CW[i] - 4, 40, 40, "H", "font-family:'TASA Orbiter','Inter',sans-serif;font-weight:600")).join("") +
    ll("b-ekm", 490, CW[3], 90, 44, "|-⟩") +
    ll("b-e1q", 920, 245, 280, 56, "1 question", G) +
    ["1", "0", "1"].map((d, i) => ll("b-erd" + i, 1420, CW[i], 70, 80, d, G + ";line-height:1;padding:0")).join("");
  const html17 =
    lc("b-etitle", 960, 128, 760, 72, "Bernstein-Vazirani", "font-family:'TASA Orbiter','Inter',sans-serif;font-weight:600") +
    layer("b-end", g("b-ecirc", endSvg) + ck.map((p, i) => g("b-ekick" + i, curveArrow(p))).join("") + g("b-eund", r.curve([[620, 800], [900, 792], [1150, 798], [1320, 790]], goldPen({ strokeWidth: 4.4, roughness: 1 }))), endLabels) +
    lc("b-eline", 960, 745, 900, 64, `one question → the <span style="${G}">whole secret</span>`);

  const html = html0 + html1 + html4 + html5 + html13 + html15 + html17;


  const script = `
    const T = ${JSON.stringify(T)};
    const RINGS = [[T.odd2, T.wired2 - 0.05], [T.one3 + 0.1, T.one3 + 0.55], [T.one3 + 1.5, T.one3 + 1.95]];
    const setT = (id, v) => $(id).setAttribute("transform", v);
    const sc = (x, y, sx, sy, dx) => "translate(" + (x + (dx || 0)).toFixed(2) + " " + y + ") scale(" + sx.toFixed(3) + " " + sy.toFixed(3) + ") translate(" + (-x) + " " + (-y) + ")";

    // ---- 0: the locked box hides 101 ----
    tl.to("#b-title", { opacity: 0, filter: "blur(8px)", duration: 0.25, ease: "power3.in" }, 3.0);
    draw("#b-box0", T.box0 + 0.05, 1.1);
    draw("#b-lock0", T.box0 + 0.9, 0.5);
    draw("#b-cards0", T.secret0 - 0.1, 0.6);
    write(["#b-q0-0", "#b-q0-1", "#b-q0-2"], T.secret0 + 0.2, 0.4);
    hide("#b-tag0");
    draw("#b-tagr", T.s101 - 0.3, 0.4);
    write("#b-tagt", T.s101 - 0.15, 0.6);
    move("#b-tag0", { y: 110, opacity: 0 }, { y: 0, opacity: 1 }, T.s101 - 0.3, 0.5);
    tl.to("#b-tag0", { y: 120, opacity: 0, duration: 0.6, ease: "power2.in" }, T.how0 - 0.1);
    write("#b-how0", T.how0 - 0.05, 0.8);
    blurOut("#b-s0", T.s1 - 0.1);

    // ---- 1-3: the switch wall ----
    draw("#b-panel", T.wall1 - 0.1, 1.2);
    [0, 1, 2].forEach((i) => { draw(["#b-plate" + i, "#b-lev" + i], T.three1 + 0.3 * i, 0.5); write("#b-n" + i, T.three1 + 0.3 * i + 0.3, 0.2); });
    draw(["#b-wire1", "#b-wire3"], T.secretly1 - 0.05, 0.9);
    write("#b-hidden", T.secretly1 + 0.2, 0.7);
    draw("#b-bell", T.buzzer1 - 0.2, 0.7);
    draw("#b-sign", T.buzzer1 + 0.3, 0.4);
    // ring A: one wired switch on
    draw("#b-arcsA", RINGS[0][0], 0.3); fade("#b-arcsA", 0, RINGS[0][1], 0.2);
    write("#b-odd", T.odd2 + 0.02, 0.35);
    write("#b-cnt", T.odd2 - 0.1, 0.6); write("#b-cnt1", T.odd2 + 0.15, 0.2);
    fade(["#b-odd", "#b-cnt1"], 0, T.wired2, 0.2);
    write(["#b-even", "#b-cnt2"], T.wired2 + 0.1, 0.4);
    fade(["#b-even", "#b-cnt", "#b-cnt2", "#b-hidden"], 0, T.s3 - 0.15, 0.3);
    // tests one at a time
    draw("#b-arcsB", RINGS[1][0], 0.2); fade("#b-arcsB", 0, RINGS[1][1], 0.2);
    draw("#b-arcsC", RINGS[2][0], 0.2); fade("#b-arcsC", 0, RINGS[2][1], 0.2);
    write("#b-dg0", T.one3 + 0.15, 0.3); write("#b-dg1", T.one3 + 0.85, 0.3); write("#b-dg2", T.one3 + 1.55, 0.3);
    write("#b-qs", T.one3 - 0.1, 0.5);
    [0, 1, 2].forEach((i) => draw("#b-tm" + i, T.one3 + 0.15 + 0.7 * i, 0.2));
    write("#b-q3", T.three3 + 0.05, 0.3);
    fade(["#b-qs", "#b-q3", "#b-tm0", "#b-tm1", "#b-tm2", "#b-sign"], 0, T.s4 - 0.6, 0.3);
    move("#b-wall", { x: 0, y: 0, scale: 1, transformOrigin: "0px 0px" }, { x: -68, y: -62, scale: 0.4, transformOrigin: "0px 0px" }, T.s4 - 0.4, 1.0);

    // ---- 4: three questions vs one ----
    write("#b-3q", T.s4 + 0.1, 0.6);
    draw("#b-chip", T.quantum4 - 0.1, 0.8);
    draw("#b-strike", T.one4 - 0.25, 0.3);
    write("#b-1q", T.one4 + 0.05, 0.6);
    blurOut(["#b-wall", "#b-s4"], T.s5 - 0.15);

    // ---- 5-7: the circuit ----
    [0, 1, 2].forEach((i) => { draw("#b-cw" + i, T.switch5 - 0.15 + 0.2 * i, 0.8); write("#b-num" + i, T.switch5 + 0.2 * i, 0.2); });
    write("#b-qdef", T.qubit5 - 0.05, 0.9);
    [0, 1, 2].forEach((i) => { write(["#b-k0-" + i, "#b-k0g-" + i], T.zero5 - 0.1 + 0.1 * i, 0.3); });
    fade(["#b-k0g-0", "#b-k0g-1", "#b-k0g-2"], 0, T.s6 + 0.3, 0.5);
    fade("#b-qdef", 0, T.s6, 0.3);
    [0, 1, 2].forEach((i) => { draw("#b-h1-" + i, T.hgate6 - 0.05 + 0.15 * i, 0.3); write("#b-hl1-" + i, T.hgate6 + 0.15 + 0.15 * i, 0.15); });
    write("#b-hdef", T.hgate6 + 0.1, 0.9);
    hide(["#b-a0-0g", "#b-a0-1g", "#b-a1-0g", "#b-a1-1g", "#b-a2-0g", "#b-a2-1g", "#b-a3-0g", "#b-a3-1g"]);
    [0, 1, 2].forEach((i) => { draw(["#b-a" + i + "-0i", "#b-a" + i + "-1i"], T.plus6 - 0.15 + 0.12 * i, 0.4); write("#b-ka" + i, T.plus6 + 0.1 + 0.12 * i, 0.25); });
    fade(["#b-a0-0g", "#b-a0-1g"], 1, T.even6 - 0.05, 0.3); fade(["#b-a0-0g", "#b-a0-1g"], 0, T.even6 + 0.75, 0.4);
    write("#b-lga0", T.zero6 - 0.05, 0.2); write("#b-lga1", T.one6 - 0.05, 0.2);
    fade("#b-hdef", 0, T.s7 - 0.2, 0.3);
    draw("#b-cw3", T.extra7 - 0.1, 0.8);
    write("#b-km3", T.minus7 - 0.1, 0.3);
    draw(["#b-a3-0i", "#b-a3-1i"], T.minus7 - 0.05, 0.45); write("#b-ka3", T.minus7 + 0.2, 0.25);
    fade("#b-a3-1g", 1, T.minus7b - 0.05, 0.25); fade("#b-a3-1g", 0, T.minus7b + 0.8, 0.4);
    draw("#b-orc", T.ask7 - 0.15, 1.1);
    write("#b-once", T.once7 - 0.05, 0.6);
    write("#b-orcl", T.ask7 + 0.6, 0.3);

    // ---- 8-9: phase kickback ----
    draw("#b-cn0", T.wired8 - 0.1, 0.5); draw("#b-cn2", T.wired8 + 0.2, 0.5);
    draw("#b-kick0", T.kicks8 - 0.1, 0.8); draw("#b-kick1", T.kicks8 + 0.3, 0.6);
    hide(["#b-b0-1g", "#b-b1-1g", "#b-b2-1g"]);
    [0, 1, 2].forEach((i) => { draw(["#b-b" + i + "-0i", "#b-b" + i + "-1i"], T.turning8 - 0.1 + 0.1 * i, 0.4); write("#b-kb" + i, T.turning8 + 0.15 + 0.1 * i, 0.25); });
    [0, 2].forEach((i) => { fade("#b-b" + i + "-1g", 1, T.plus8 + 0.1, 0.4); fade("#b-b" + i + "-1i", 0, T.plus8 + 0.1, 0.4); fade("#b-kb" + i, 0, T.minus8b - 0.1, 0.2); write("#b-kbm" + i, T.minus8b, 0.3); });
    write("#b-phdef", T.phase9 - 0.05, 0.9);
    write("#b-pk", T.phase9b - 0.05, 0.7);

    // ---- 10: measuring now gives fifty fifty ----
    fade("#b-phdef", 0, T.measure10 - 0.1, 0.3);
    [0, 1, 2].forEach((i) => draw("#b-m1-" + i, T.measure10 - 0.1 + 0.15 * i, 0.4));
    [0, 1, 2].forEach((i) => { write("#b-fl" + i, T.fifty10 - 0.05, 0.15); write("#b-ff" + i, T.fifty10 + 0.05 + 0.1 * i, 0.4); });
    fade(["#b-fl0", "#b-fl1", "#b-fl2", "#b-ff0", "#b-ff1", "#b-ff2"], 0, T.hides10, 0.3);
    draw("#b-ring0", T.hides10 - 0.05, 0.5); draw("#b-ring2", T.hides10 + 0.25, 0.5);
    blurOut(["#b-m1-0", "#b-m1-1", "#b-m1-2"], T.s11 - 0.25);
    fade(["#b-ring0", "#b-ring2", "#b-pk"], 0, T.s11 + 0.1, 0.35);

    // ---- 11: second H merges the bars ----
    [0, 1, 2].forEach((i) => { draw("#b-h2-" + i, T.more11 - 0.1 + 0.15 * i, 0.3); write("#b-hl2-" + i, T.more11 + 0.1 + 0.15 * i, 0.15); });
    const CBARS = [0, 1, 2].flatMap((i) => ["#b-c" + i + "-0", "#b-c" + i + "-1"]);
    hide(CBARS);
    fade(CBARS, 1, T.more11 + 0.5, 0.25);
    write(["#b-lgc0", "#b-lgc1"], T.turns11, 0.3);
    write("#b-kc1", T.zero11 - 0.05, 0.3);
    write(["#b-kc0", "#b-kc2"], T.one11 - 0.1, 0.35);

    // ---- 12: read 101 ----
    [0, 1, 2].forEach((i) => draw("#b-m2-" + i, T.measure12 - 0.05 + 0.12 * i, 0.4));
    write("#b-rd0", T.d1 - 0.05, 0.25); write("#b-rd1", T.d2 - 0.05, 0.2); write("#b-rd2", T.d3 - 0.05, 0.2);
    draw("#b-brk", T.every12 - 0.1, 0.5); write("#b-s101", T.every12 + 0.25, 0.5);
    tl.to("#b-once", { scale: 1.18, duration: 0.25, ease: "power2.out" }, T.single12 - 0.05);
    tl.to("#b-once", { scale: 1, duration: 0.35, ease: "power2.in" }, T.single12 + 0.25);
    blurOut("#b-circ", T.s13 - 0.1);

    // ---- 13: no secret trial of every setting ----
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => { draw("#b-cr" + i, T.every13 - 0.1 + 0.08 * i, 0.3); write("#b-ct" + i, T.every13 + 0.08 * i, 0.25); });
    draw("#b-ticks", T.collect13 - 0.1, 0.5);
    draw("#b-bigx", T.s14 - 0.65, 0.5);
    blurOut(["#b-ticks", "#b-bigx"], T.s14 + 0.05);

    // ---- 14: interference leaves only 101 ----
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => {
      const [gx, gy] = ${JSON.stringify(SETS.map((_, i) => gridPos(i)))}[i];
      const dx = ${JSON.stringify(SETS.map((_, i) => rowX(i)))}[i] - gx, dy = ${ROWY} - gy;
      if (i >= 4) move("#b-card" + i, { x: 0, y: 0, scale: 1 }, { x: dx, y: dy, scale: 0.8 }, T.interference14 - 0.25 + 0.04 * (i - 4), 0.7);
      else {
        move("#b-card" + i, { x: 0, scale: 1 }, { x: dx, scale: 0.8 }, T.interference14 + 0.2 + 0.03 * i, 0.5);
        tl.fromTo("#b-card" + i, { y: 0 }, { y: dy, duration: 0.5, ease: "power2.inOut" }, T.interference14 + 0.65 + 0.03 * i);
      }
    });
    draw("#b-base", T.interference14 + 0.7, 0.5);
    hide(["#b-ctg", "#b-gb"]);
    show(["#b-ib0", "#b-ib1", "#b-ib2", "#b-ib3", "#b-ib4", "#b-ib5", "#b-ib6", "#b-ib7"], 0);
    fade("#b-ib5", 0, T.add14 - 0.05, 0.5);
    fade("#b-gb", 1, T.add14 - 0.05, 0.5);
    fade("#b-ctg", 1, T.only14 - 0.2, 0.4); fade("#b-ct5", 0, T.only14 - 0.2, 0.4);
    draw("#b-rip0", T.ripples14 - 0.25, 0.7); draw("#b-rip1", T.ripples14 - 0.05, 0.7);
    fade(["#b-rip0", "#b-rip1"], 0, T.only14 - 0.1, 0.5);
    write("#b-only", T.only14 - 0.05, 0.5);
    blurOut(["#b-s13", "#b-card0", "#b-card1", "#b-card2", "#b-card3", "#b-card4", "#b-card5", "#b-card6", "#b-card7"], T.s15 - 0.1);

    // ---- 15: a real switch is only on or off ----
    draw(["#b-bsw", "#b-blev"], T.switch15 - 0.2, 1.1);
    write("#b-on", T.switch15 + 0.6, 0.25); write("#b-off", T.switch15 + 0.8, 0.3);
    draw("#b-bp", T.never15 - 0.15, 0.5); write(["#b-bl0", "#b-bl1"], T.never15 + 0.15, 0.2); write("#b-bk", T.never15 + 0.25, 0.3);
    draw("#b-bx", T.never15 + 0.35, 0.35);
    write("#b-noreal", T.never15 + 0.45, 0.6);
    blurOut(["#b-bsw", "#b-blev", "#b-bp", "#b-bx", "#b-on", "#b-off", "#b-bl0", "#b-bl1", "#b-bk", "#b-noreal"], T.s16 + 0.35);

    // ---- 16: only a parity rule ----
    draw("#b-pbell", T.odd16 - 0.25, 0.6); draw("#b-psign", T.odd16 + 0.1, 0.3);
    write("#b-pt", T.odd16 + 0.2, 0.5);
    draw("#b-ptick", T.rule16 - 0.1, 0.35); write("#b-prule", T.rule16, 0.8);
    draw("#b-parcs", T.unpick16 - 0.2, 0.3); fade("#b-parcs", 0, T.unpick16 + 0.7, 0.3);
    draw("#b-lump", T.most16 - 0.2, 0.7); write("#b-qm", T.most16 + 0.1, 0.2); write("#b-other", T.most16 + 0.2, 0.4);
    draw("#b-lx", T.s17 - 0.6, 0.4);
    blurOut(["#b-pbell", "#b-psign", "#b-pt", "#b-ptick", "#b-prule", "#b-lump", "#b-qm", "#b-other", "#b-lx"], T.s17 - 0.05);

    // ---- 17: closing card ----
    write("#b-etitle", T.bern17 - 0.1, 0.9);
    draw("#b-ecirc", T.phase17 - 0.15, 1.5);
    write(["#b-ek0", "#b-ek1", "#b-ek2", "#b-ekm"], T.phase17 + 0.1, 0.4);
    write(["#b-eh10", "#b-eh11", "#b-eh12"], T.phase17 + 0.6, 0.2); write(["#b-eh20", "#b-eh21", "#b-eh22"], T.phase17 + 1.1, 0.2);
    draw("#b-ekick0", T.every17 - 0.1, 0.5); draw("#b-ekick1", T.every17 + 0.2, 0.4);
    write("#b-e1q", T.oneq17 - 0.05, 0.5);
    write("#b-erd0", T.whole17 - 0.2, 0.2); write("#b-erd1", T.whole17, 0.2); write("#b-erd2", T.whole17 + 0.2, 0.2);
    write("#b-eline", T.whole17 + 0.1, 1.0);
    draw("#b-eund", T.whole17 + 1.0, 0.5);

    // ---- continuous values ----
    const LEV = [
      [[T.odd2 - 0.35, T.odd2 - 0.1, -1, 1], [T.s3 - 0.3, T.s3, 1, -1], [T.one3 - 0.12, T.one3 + 0.08, -1, 1], [T.one3 + 0.5, T.one3 + 0.68, 1, -1]],
      [[T.odd2 - 0.25, T.odd2, -1, 1], [T.s3 - 0.3, T.s3, 1, -1], [T.one3 + 0.6, T.one3 + 0.78, -1, 1], [T.one3 + 1.2, T.one3 + 1.38, 1, -1]],
      [[T.wired2 - 0.2, T.wired2 + 0.05, -1, 1], [T.s3 - 0.3, T.s3, 1, -1], [T.one3 + 1.3, T.one3 + 1.48, -1, 1], [T.one3 + 1.9, T.one3 + 2.08, 1, -1]],
    ];
    const SWX = ${JSON.stringify(SW)};
    const ringing = (t) => RINGS.some(([a, b]) => t >= a && t <= b);
    // a seeded flicker: 0 or 1, about six changes a second
    const coin = (i, kk) => { const v = Math.sin(i * 12.9898 + kk * 78.233) * 43758.5453; return v - Math.floor(v) > 0.5 ? 1 : 0; };
    onFrame((t) => {
      SWX.forEach((x, i) => setT("b-lev" + i, sc(x, ${PIV}, 1, sched(LEV[i], t, -1))));
      const amp = ringing(t) ? 6 : 0;
      setT("b-bellsh", "rotate(" + (amp * Math.sin(t * 46)).toFixed(2) + " ${BELL.x} ${BELL.y - 60})");
      const pa = t >= T.unpick16 - 0.2 && t <= T.unpick16 + 0.8 ? 6 : 0;
      setT("b-pbsh", "rotate(" + (pa * Math.sin(t * 46)).toFixed(2) + " 590 345)");
      setT("b-blev", sc(630, 500, 1, sched([[T.on15 - 0.1, T.on15 + 0.12, -1, 1], [T.off15 - 0.02, T.off15 + 0.2, 1, -1]], t, -1)));
      // column B: kicked-back minus swings the 1 bar down on wires 1 and 3
      const swing = sched([[T.plus8 + 0.05, T.minus8b + 0.35, 1, -1]], t, 1);
      [0, 2].forEach((i) => setT("b-b" + i + "-1", sc(${XB[1]}, ${WY[0]} + ${WY[1] - WY[0]} * i, 1, swing)));
      // column C: copies flow through the second H, then merge
      const slide = sched([[T.more11 + 0.5, T.turns11 + 0.3, -${DXC}, 0]], t, -${DXC});
      const m0 = sched([[T.back11 - 0.05, T.zero11 + 0.2, 0, 1]], t, 0);
      const m1 = sched([[T.minus11 - 0.1, T.one11 + 0.1, 0, 1]], t, 0);
      const WYS = ${JSON.stringify(WY)};
      [0, 1, 2].forEach((i) => {
        const y = WYS[i];
        if (i === 1) {
          setT("b-c1-0", sc(${XC[0]}, y, 1, 1 + 0.42 * m0, slide));
          setT("b-c1-1", sc(${XC[1]}, y, 1 - m0 * 0.6, 1 - m0, slide - 40 * m0));
        } else {
          setT("b-c" + i + "-0", sc(${XC[0]}, y, 1 - m1 * 0.6, 1 - m1, slide + 40 * m1));
          setT("b-c" + i + "-1", sc(${XC[1]}, y, 1, -1 + 2.42 * m1, slide));
        }
      });
      // measuring too early: flickering digits and needles
      const live = t >= T.fifty10 - 0.05 && t < T.hides10;
      const kk = Math.floor(t * 6);
      [0, 1, 2].forEach((i) => {
        const d = live ? coin(i + 1, kk) : 0;
        const el = $("b-fl" + i); if (el.textContent !== String(d)) el.textContent = String(d);
        const a = live ? (d ? 34 : -34) + 6 * Math.sin(t * 9 + i) : -40;
        setT("b-nd1-" + i, "rotate(" + a.toFixed(2) + " 1190 " + (${WY[0]} + ${WY[1] - WY[0]} * i + 18.48).toFixed(2) + ")");
      });
      // line 12 meters settle on 1 0 1
      const RD = [T.d1, T.d2, T.d3];
      [0, 1, 2].forEach((i) => {
        const target = i === 1 ? -40 : 40;
        const a = sched([[RD[i] - 0.3, RD[i] + 0.1, 0, target]], t, 0);
        setT("b-nd2-" + i, "rotate(" + a.toFixed(2) + " 1480 " + (${WY[0]} + ${WY[1] - WY[0]} * i + 18.48).toFixed(2) + ")");
      });
      // interference chart: equal bars, then all but 101 cancel
      for (let i = 0; i < 8; i++) {
        const x = ${JSON.stringify(SETS.map((_, i) => rowX(i)))}[i];
        const o = 0.05 * i;
        const grow = sched([[T.interference14 + 1.0 + o, T.interference14 + 1.55 + o, 0, 1]], t, 0);
        const v = i === 5 ? grow : grow * sched([[T.add14 + o, T.add14 + 0.55 + o, 1, 1.25], [T.add14 + 0.6 + o, T.ripples14 + 0.2 + o, 1.25, 0.4], [T.ripples14 + 0.3 + o, T.only14 + o * 0.5, 0.4, 0]], t, 1);
        setT("b-ib" + i, sc(x, ${BASE}, 1, Math.max(0.0001, v)));
      }
      const gv = sched([[T.add14, T.ripples14, 0.316, 0.62], [T.ripples14 + 0.1, T.only14 + 0.3, 0.62, 1]], t, 0.316);
      setT("b-gb", sc(${rowX(5)}, ${BASE}, 1, gv));
    });
  `;
  const css = `#root #b-once, #root #b-tag0 { transform-origin: 50% 50%; }`;
  return { html, script, css };
}
