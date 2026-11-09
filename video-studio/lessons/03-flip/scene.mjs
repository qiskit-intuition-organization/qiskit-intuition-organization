// Lesson 3, "Flipping a qubit with X". Follows plan.md: readout cards, the qubit dial,
// the pancake, the X half turn (seen with a slight 3D tilt so the tip sweeps an arc),
// probability bars that follow the flip, and the ket formula.
export const phrases = [
  ["ket zero", "|0⟩"],
  ["ket one", "|1⟩"],
  ["not gate", "NOT gate"],
];

// The 3D view: a point (x right, y toward the viewer, z up) lands on the board at
// X = x + A*y and Ydown = -z - B*y. X turns the arrow about the left to right line.
const A = 0.3;
const B = 0.22;
const RAD = 250;
const LEAN = 53.13; // degrees from up: cos = 0.6, so it reads 0 eight times in ten

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, INK, GOLD, DIM } = k;
  const NS = (s) => s.replaceAll("<path ", '<path vector-effect="non-scaling-stroke" ');
  const fx = (n) => +n.toFixed(2);

  // ---------- small drawing helpers ----------
  function dashed(pts, dash, gap, o) {
    let out = "", on = true, left = dash, cur = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const L = Math.hypot(x1 - x0, y1 - y0) || 1e-6, ux = (x1 - x0) / L, uy = (y1 - y0) / L;
      let pos = 0;
      while (L - pos > left) {
        pos += left;
        const p = [x0 + ux * pos, y0 + uy * pos];
        if (on) { cur.push(p); out += r.linear(cur, pen({ roughness: 0.5, disableMultiStroke: true, ...o })); }
        on = !on; cur = [p]; left = on ? dash : gap;
      }
      left -= L - pos;
      cur.push([x1, y1]);
    }
    if (on && cur.length > 1) out += r.linear(cur, pen({ roughness: 0.5, disableMultiStroke: true, ...o }));
    return out;
  }
  const headAt = (pts, o, size = 20) => {
    const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1];
    const a = Math.atan2(y2 - y1, x2 - x1), w = (o.strokeWidth ?? 3) * 0.85;
    return [0.45, -0.45].map((da) => r.line(x2, y2, x2 - size * Math.cos(a + da), y2 - size * Math.sin(a + da), pen({ ...o, strokeWidth: w }))).join("");
  };
  const curvedArrow = (pts, o = {}, size = 20, both = false) =>
    r.curve(pts, pen(o)) + headAt(pts, o, size) + (both ? headAt([...pts].reverse(), o, size) : "");
  const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  const tick = (x, y, s, o) => r.linear([[x, y], [x + s * 0.35, y + s * 0.4], [x + s, y - s * 0.45]], o);
  const ellPts = (cx, cy, rad, from, to, n = 120) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const a = from + ((to - from) * i) / n;
      return [cx + rad * Math.cos(a) + A * rad * Math.sin(a), cy - B * rad * Math.sin(a)];
    });
  // A pancake seen from the side, centred on (cx, cy): golden crust on top or underneath.
  function cake(cx, cy, w, h, crustTop) {
    const hw = w / 2, hh = h / 2;
    const body = `M ${cx - hw + 14} ${cy - hh} C ${cx - hw / 2} ${cy - hh - 4} ${cx + hw / 2} ${cy - hh - 3} ${cx + hw - 14} ${cy - hh} C ${cx + hw + 5} ${cy - hh + 2} ${cx + hw + 5} ${cy + hh - 2} ${cx + hw - 14} ${cy + hh} C ${cx + hw / 2} ${cy + hh + 3} ${cx - hw / 2} ${cy + hh + 4} ${cx - hw + 14} ${cy + hh} C ${cx - hw - 5} ${cy + hh - 2} ${cx - hw - 5} ${cy - hh + 2} ${cx - hw + 14} ${cy - hh} Z`;
    const band = h * 0.34;
    const s = crustTop ? 1 : -1;
    const face = cy - s * hh, inner = cy - s * (hh - band);
    const crust = r.poly([[cx - hw + 6, face + s * 2], [cx + hw - 6, face + s * 2], [cx + hw - 2, inner], [cx - hw + 2, inner]],
      { fill: GOLD, fillStyle: "hachure", hachureGap: 7, fillWeight: 2, stroke: "none", roughness: 1 });
    const edge = r.curve([[cx - hw + 10, face], [cx, face - s * 3], [cx + hw - 10, face]], goldPen({ strokeWidth: 3.4, roughness: 0.8 }));
    const back = cy + s * (hh - band * 0.55);
    const bubbles = [-0.62, -0.3, 0.05, 0.36, 0.66].map((u, i) => r.circle(cx + u * hw, back + (i % 2 ? 2 : -2), 7, pen({ strokeWidth: 1.8, roughness: 0.6 }))).join("");
    return r.path(body, pen({ strokeWidth: 3 })) + crust + edge + bubbles;
  }

  // ---------- times ----------
  const T = {
    cards: cue(0, "reads", 0, -0.1), z0: cue(0, "zero"), make: cue(0, "make"), q1: cue(0, "read", 1),
    off0: 6.0,
    circle: cue(1, "Picture", 0, -0.1), arrow: cue(1, "arrow", 0, -0.1), up: cue(1, "Up"), down: cue(1, "down", 0, -0.1),
    gate: cue(2, "gate", 0, -0.15), turns: cue(2, "turns"), stretch: cue(2, "stretching", 0, -0.1), off2: 13.5,
    xgate: cue(3, "gate"), xcalled: cue(3, "X"), flipping: cue(3, "flipping", 0, -0.1), pancake: cue(3, "pancake"),
    flip1: cue(4, "Flip", 0, -0.06), top: cue(4, "top"), ends: cue(4, "ends"), bottom: cue(4, "bottom"),
    flip2: cue(5, "Flip", 0, 0.2), back: cue(5, "back"), off5: 23.35,
    same: cue(6, "same"), half6: cue(6, "half"), line6: cue(6, "line", 0, -0.1), running: cue(6, "running", 0, -0.05),
    zero7: cue(7, "zero"), lands: cue(7, "lands", 0, -0.08), one7: cue(7, "one"),
    l8: cue(8), not: cue(8, "gate", 0, -0.25), ordinary: cue(8, "ordinary"), swapping: cue(8, "swapping"), one8: cue(8, "one", 0, -0.1), chance: cue(8, "chance", 0, -0.1),
    off8: cue(8, null, 0, 0) + 5.8,
    half9: cue(9, "half", 0, -0.12), full: cue(9, "full", 0, -0.05), home: cue(9, "home"),
    off9: cue(10, null, 0, -0.1), pancake10: cue(10, "pancake"), always: cue(10, "always"), point: cue(10, "point"),
    leans: cue(11, "leans"), reads11: cue(11, "reads", 0, -0.05), eight11: cue(11, "eight"),
    half12: cue(12, "half", 0, -0.05), one12: cue(12, "one"),
    swapped: cue(13, "swapped"), much: cue(13, "much"),
    off13: cue(14, null, 0, -0.05), read14: cue(14, "read", 0, -0.05), turns14: cue(14, "turns", 0, -0.05), whole: cue(14, "whole", 0, -0.05),
    off14: cue(15, null, 0, -0.08), up15: cue(15, "Up", 0, 0.12), zero15: cue(15, "zero"), down15: cue(15, "down", 0, -0.05), one15: cue(15, "one"),
    so15: cue(15, "So", 0, 0.08), one15b: cue(15, "one", 1), ket15c: cue(15, "ket", 4, -0.05), zero15c: cue(15, "zero", 2),
    off15: cue(16, null, 0, -0.15), remember: cue(16, "remember"), gates: cue(16, "gates"), half16: cue(16, "half"), swaps: cue(16, "swaps"),
  };
  const FLIP = 1.2;
  const PHI = [
    [T.lands, T.lands + FLIP, 0, Math.PI],
    [T.half9, T.half9 + FLIP, Math.PI, 2 * Math.PI],
    [T.leans - 0.2, T.leans - 0.19, 2 * Math.PI, 0],
    [T.half12, T.half12 + FLIP, 0, Math.PI],
    [T.turns14, T.turns14 + FLIP, Math.PI, 2 * Math.PI],
  ].map((s) => s.map(fx));
  const TILT = [
    [T.turns, T.turns + 0.45, 0, 35], [T.turns + 0.45, T.turns + 0.95, 35, 0],
    [T.leans, T.leans + 0.9, 0, LEAN],
  ].map((s) => s.map(fx));
  const TOSS = [[T.flip1 + 0.08, T.flip1 + 0.08 + FLIP, 0], [T.flip2, T.flip2 + FLIP, 1]].map(([a, b, n]) => [fx(a), fx(b), n]);
  const MINI = [[T.half16, T.half16 + 1.1, 0, Math.PI]].map((s) => s.map(fx));

  // ---------- 0. readout cards (div at 400,430) ----------
  const CX = [120, 360, 600];
  const cardsSvg =
    `<g id="b-cardbox">${CX.map((c, i) => r.rect(c - 85, 30, 170, 200, pen({ strokeWidth: 2.8, seed: 40 + i })) + r.line(c - 60, 205, c + 60, 205, pen({ strokeWidth: 1.8 }))).join("")}</g>` +
    `<g id="b-hand">${curvedArrow([[705, 140], [760, 112], [830, 128]], { stroke: GOLD, strokeWidth: 3.8 }, 22)}</g>` +
    `<g id="b-card4">${dashed(rectPts(855, 30, 170, 200), 16, 12, { stroke: GOLD, strokeWidth: 2.8 })}</g>`;
  const cardsHtml = `<div id="b-cards" class="obj" style="left:400px;top:430px;width:1100px;height:290px">
    <svg class="sk" width="1100" height="290" viewBox="0 0 1100 290">${cardsSvg}</svg>
    ${CX.map((c, i) => lbl(`b-c0-${i}`, c - 60, 58, 120, 96, "0")).join("")}
    ${CX.map((c, i) => lbl(`b-chk-${i}`, c - 90, 238, 180, 40, `check ${i + 1}`)).join("")}
    ${lbl("b-q1", 880, 58, 120, 96, "1?", `color:${GOLD}`)}
  </div>`;

  // ---------- 1. the qubit dial (div at 560,90; centre 400,380 = board 960,470) ----------
  const C = { x: 400, y: 380 };
  const arrowSvg = (o, head) => NS(arrow(0, 0, 0, -RAD + 8, o, head) + r.circle(0, 0, 18, goldPen({ fill: GOLD, fillStyle: "solid", strokeWidth: 2 })));
  const fan = [30, 60, 90, 120, 150].map((deg, i) => {
    const a = (deg * Math.PI) / 180, L = RAD - 30;
    const x2 = C.x + L * Math.sin(a), y2 = C.y - L * Math.cos(a);
    return `<g id="b-fan${i}">${dashed([[C.x, C.y], [x2, y2]], 14, 10, { stroke: INK, strokeWidth: 2.4 })}${headAt([[C.x, C.y], [x2, y2]], { stroke: INK, strokeWidth: 2.4 }, 18)}</g>`;
  }).join("");
  const dialSvg =
    `<defs><filter id="b-glowf" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter></defs>` +
    `<g id="b-circ">${r.circle(C.x, C.y, RAD * 2, pen({ strokeWidth: 3.4 }))}${r.circle(C.x, C.y, RAD * 2 - 22, pen({ strokeWidth: 1.4, roughness: 1.8, stroke: DIM }))}</g>` +
    `<g id="b-eq">${dashed(ellPts(C.x, C.y, RAD, 0, 2 * Math.PI), 12, 11, { stroke: DIM, strokeWidth: 2.2 })}</g>` +
    `<g id="b-ghost">${dashed([[C.x, C.y], [C.x, C.y + RAD - 12]], 14, 10, { stroke: INK, strokeWidth: 3 })}${headAt([[C.x, C.y], [C.x, C.y + RAD - 12]], { stroke: INK, strokeWidth: 3 }, 24)}</g>` +
    `<g id="b-ruler">${r.line(C.x - 46, C.y - 4, C.x - 46, C.y - RAD + 10, pen({ strokeWidth: 2.2 }))}${r.line(C.x - 58, C.y - 4, C.x - 34, C.y - 4, pen({ strokeWidth: 2.2 }))}${r.line(C.x - 58, C.y - RAD + 10, C.x - 34, C.y - RAD + 10, pen({ strokeWidth: 2.2 }))}</g>` +
    `<g id="b-axle">${dashed([[C.x - 300, C.y], [C.x + 300, C.y]], 18, 12, { stroke: GOLD, strokeWidth: 3.2 })}</g>` +
    `<g id="b-spin">${r.arc(C.x + 280, C.y, 46, 112, -1.2, 4.1, false, pen({ strokeWidth: 2.8, roughness: 0.8 }))}${headAt([[C.x + 280 + 23 * Math.cos(3.8), C.y + 56 * Math.sin(3.8)], [C.x + 280 + 23 * Math.cos(4.1), C.y + 56 * Math.sin(4.1)]], { strokeWidth: 2.8 }, 16)}</g>` +
    fan +
    `<path id="b-trA" fill="none" stroke="${GOLD}" stroke-width="3.4" stroke-dasharray="11 9" stroke-linecap="round"/>` +
    `<path id="b-trB" fill="none" stroke="${GOLD}" stroke-width="3.4" stroke-dasharray="11 9" stroke-linecap="round"/>` +
    `<path id="b-trC" fill="none" stroke="${GOLD}" stroke-width="3.4" stroke-dasharray="11 9" stroke-linecap="round"/>` +
    `<g id="b-arrT" transform="translate(${C.x} ${C.y})"><g id="b-glow" filter="url(#b-glowf)">${arrowSvg({ stroke: GOLD, strokeWidth: 16, roughness: 0.6 }, 36)}</g><g id="b-arrow">${arrowSvg({ stroke: GOLD, strokeWidth: 6, roughness: 0.9 }, 34)}</g></g>` +
    `<g id="b-hometick">${tick(C.x + 62, C.y - RAD - 64, 40, goldPen({ strokeWidth: 4 }))}</g>`;
  const dialHtml = `<div id="b-dial" class="obj" style="left:560px;top:90px;width:800px;height:780px">
    <svg class="sk" width="800" height="780" viewBox="0 0 800 780">${dialSvg}</svg>
    ${lbl("b-p0", C.x - 50, C.y - RAD - 108, 100, 64, "0")}
    ${lbl("b-p1", C.x - 50, C.y + RAD + 6, 100, 64, "1")}
    ${lbl("b-xmini", C.x + 240, C.y - 150, 80, 56, "X")}
  </div>`;

  // ---------- 2. a gate (div at 200,380) ----------
  const gateHtml = `<div id="b-gate" class="obj" style="left:200px;top:380px;width:520px;height:300px">
    <svg class="sk" width="520" height="300" viewBox="0 0 520 300"><g id="b-gbox">${r.rect(25, 15, 150, 150, pen({ strokeWidth: 3.2 }))}</g><g id="b-glink">${arrow(188, 90, 488, 90, { strokeWidth: 3 }, 20)}</g></svg>
    ${lbl("b-glbl", 25, 48, 150, 56, "gate")}
    ${lbl("b-gturn", -20, 170, 240, 48, "turns")}
    ${lbl("b-glen", -60, 228, 320, 48, "same length")}
  </div>`;

  // ---------- 3 to 5. the X box, the pan and the pancake ----------
  const xboxHtml = `<div id="b-xbox" class="obj" style="left:880px;top:120px;width:160px;height:160px">
    <svg class="sk" width="160" height="160" viewBox="0 0 160 160"><g id="b-xrect">${r.rect(15, 15, 130, 130, pen({ strokeWidth: 3.2 }))}</g></svg>
    ${lbl("b-xlbl", 20, 12, 120, 90, "X", `color:${GOLD}`)}
  </div>`;
  const xlinkHtml = `<div id="b-xlink" class="obj" style="left:380px;top:440px;width:280px;height:60px">
    <svg class="sk" width="280" height="60" viewBox="0 0 280 60"><g id="b-xl">${arrow(6, 30, 262, 30, { strokeWidth: 3 }, 20)}</g></svg></div>`;
  // pan div at 380,560; grip at local (60,137)
  const panSvg =
    `<g id="b-pang">` +
    r.curve([[298, 138], [316, 168], [440, 176], [580, 178], [720, 176], [846, 168], [866, 138]], pen({ strokeWidth: 3.4 })) +
    r.curve([[304, 140], [326, 160], [580, 164], [836, 160], [860, 140]], pen({ strokeWidth: 2.4 })) +
    r.line(300, 148, 44, 126, pen({ strokeWidth: 3.2 })) + r.line(302, 162, 46, 148, pen({ strokeWidth: 3.2 })) +
    r.curve([[44, 126], [30, 136], [46, 148]], pen({ strokeWidth: 3.2 })) +
    r.poly([[60, 130], [190, 140], [190, 154], [60, 146]], { fill: INK, fillStyle: "hachure", hachureGap: 8, fillWeight: 1.6, stroke: "none" }) +
    r.circle(270, 150, 9, pen({ strokeWidth: 2 })) +
    `</g>`;
  const panHtml = `<div id="b-pan" class="obj" style="left:380px;top:500px;width:900px;height:220px">
    <svg class="sk" width="900" height="220" viewBox="0 0 900 220">${panSvg}</svg></div>`;
  // pancake box at 700,380; the cake rests at local (260,318) = board (960,698)
  const steam = [180, 260, 340].map((x, i) => r.curve([[x, 262], [x - 10, 240], [x + 8, 220], [x - 6, 198]], pen({ strokeWidth: 2.2, stroke: DIM, seed: 70 + i }))).join("");
  const cakeHtml = `<div id="b-cakebox" class="obj" style="left:700px;top:320px;width:520px;height:380px">
    <svg class="sk" width="520" height="380" viewBox="0 0 520 380">
      <g id="b-steam">${steam}</g>
      <g id="b-arcA">${curvedArrow([[505, 296], [562, 190], [515, 78], [400, 38]], { strokeWidth: 3 }, 20)}</g>
      <g id="b-arcB">${curvedArrow([[505, 296], [562, 190], [515, 78], [400, 38]], { strokeWidth: 3 }, 20)}</g>
      <g id="b-cakeT" transform="translate(260 310)"><g id="b-cake">${NS(cake(0, 0, 420, 60, true))}</g></g>
    </svg></div>`;
  const ptr = (id, y) => `<g id="${id}">${arrow(1290, y, 1185, y + 4, { stroke: GOLD, strokeWidth: 3 }, 16)}</g>`;
  const sideHtml = `<div id="b-side" class="obj" style="left:1140px;top:250px;width:620px;height:580px">
    <svg class="sk" width="620" height="580" viewBox="1140 250 620 580">${ptr("b-ptrA", 608)}${ptr("b-ptrB", 650)}${ptr("b-ptrC", 608)}<g id="b-tick5">${tick(1300, 410, 44, goldPen({ strokeWidth: 4 }))}</g></svg>
    ${lbl("b-top", 160, 318, 140, 52, "top", `color:${GOLD};text-align:left`)}
    ${lbl("b-top2", 160, 318, 140, 52, "top", `color:${GOLD};text-align:left`)}
    ${lbl("b-nowbot", 160, 440, 440, 48, "now on the bottom", "text-align:left")}
    ${lbl("b-tally1", 160, 20, 300, 56, "flips: 1", "text-align:left")}
    ${lbl("b-tally2", 160, 20, 300, 56, "flips: 2", "text-align:left")}
    ${lbl("b-backlbl", 215, 116, 380, 48, "back to the start", "text-align:left")}
  </div>`;

  // ---------- 6 to 9. X on the dial: labels, NOT table, die ----------
  const rightHtml = `
    ${lbl("b-halfturn", 1360, 288, 300, 56, "half turn")}
    ${lbl("b-hh1", 1320, 280, 400, 56, "half + half")}
    ${lbl("b-hh2", 1320, 362, 400, 56, "= full turn", `color:${GOLD}`)}`;
  const notHtml = `<div id="b-not" class="obj" style="left:1290px;top:270px;width:440px;height:340px">
    <svg class="sk" width="440" height="340" viewBox="0 0 440 340"><g id="b-notframe">${r.rect(10, 10, 420, 320, pen({ strokeWidth: 2.8 }))}${r.line(30, 160, 410, 158, pen({ strokeWidth: 2 }))}</g></svg>
    ${lbl("b-nothead", 70, 14, 300, 64, "NOT")}
    ${lbl("b-notsub", 40, 98, 360, 40, "ordinary computer")}
    ${lbl("b-row1", 70, 168, 300, 56, "0 → 1")}
    ${lbl("b-row2", 70, 240, 300, 56, "1 → 0")}
  </div>`;
  const pips = [[45, 45], [85, 85], [65, 65], [45, 85], [85, 45]].map(([x, y], i) => r.circle(x, y + 2, 13, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1, seed: 90 + i }))).join("");
  const dieHtml = `<div id="b-die" class="obj" style="left:1300px;top:630px;width:440px;height:150px">
    <svg class="sk" width="440" height="150" viewBox="0 0 440 150"><g id="b-diebox">${r.rect(20, 20, 90, 90, pen({ strokeWidth: 3 }))}${pips}</g><g id="b-diex">${r.line(6, 8, 124, 124, goldPen({ strokeWidth: 4.4 }))}${r.line(124, 8, 6, 124, goldPen({ strokeWidth: 4.4 }))}</g></svg>
    ${lbl("b-nochance", 145, 34, 280, 48, "no chance", "text-align:left")}
  </div>`;

  // ---------- 10. the pancake falls short (div at 1060,250) ----------
  const psHtml = `<div id="b-ps" class="obj" style="left:1060px;top:250px;width:600px;height:360px">
    <svg class="sk" width="600" height="360" viewBox="0 0 600 360"><g id="b-ps1">${cake(300, 50, 320, 46, true)}</g><g id="b-ps2">${cake(300, 200, 320, 46, false)}</g></svg>
    ${lbl("b-psor", 250, 94, 100, 52, "or")}
    ${lbl("b-psl", 20, 256, 560, 52, "always one side up")}
  </div>`;

  // ---------- 11 to 13. probability bars (div at 1240,200; baseline local y 520) ----------
  const BX = [80, 250], BW = 110, BASE = 520, FULL = 400;
  const barSvg = BX.map((x, i) =>
    `<clipPath id="b-clip${i}"><rect id="b-clipr${i}" x="${x - 10}" y="${BASE}" width="${BW + 20}" height="0"/></clipPath>` +
    `<g id="b-bin${i}">${dashed(rectPts(x, BASE - FULL, BW, FULL), 10, 10, { stroke: DIM, strokeWidth: 2 })}</g>` +
    `<g clip-path="url(#b-clip${i})"><g id="b-fg${i}">${r.rect(x + 4, BASE - FULL + 2, BW - 8, FULL - 2, { ...pen(), fill: GOLD, fillStyle: "hachure", hachureGap: 9, fillWeight: 2.2, stroke: "none" })}</g>` +
    `<g id="b-fi${i}">${r.rect(x + 4, BASE - FULL + 2, BW - 8, FULL - 2, { ...pen(), fill: INK, fillStyle: "hachure", hachureGap: 9, fillWeight: 1.8, stroke: "none" })}</g></g>` +
    `<line id="b-lv${i}" x1="${x - 4}" x2="${x + BW + 4}" y1="${BASE}" y2="${BASE}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  ).join("");
  const barsHtml = `<div id="b-bars" class="obj" style="left:1240px;top:200px;width:460px;height:620px">
    <svg class="sk" width="460" height="620" viewBox="0 0 460 620">
      <g id="b-base">${r.line(30, BASE, 420, BASE + 2, pen({ strokeWidth: 3.2 }))}</g>${barSvg}
      <g id="b-swap">${curvedArrow([[148, 426], [162, 330], [200, 252], [242, 222]], { stroke: GOLD, strokeWidth: 3.6 }, 18, true)}</g>
    </svg>
    ${lbl("b-bl0", BX[0] + BW / 2 - 50, BASE + 4, 100, 56, "0")}
    ${lbl("b-bl1", BX[1] + BW / 2 - 50, BASE + 4, 100, 56, "1")}
    ${lbl("b-tag0", BX[0] + BW / 2 - 100, 118, 200, 52, "8 in 10", `color:${GOLD}`)}
    ${lbl("b-tag1", BX[1] + BW / 2 - 100, 118, 200, 52, "8 in 10", `color:${GOLD}`)}
    ${lbl("b-swaplbl", 0, 20, 460, 48, "X swaps the amounts")}
  </div>`;

  // ---------- 14. no reading first (div at 1220,280) ----------
  const eyeSvg =
    `<g id="b-eyeg">${r.curve([[90, 120], [150, 62], [220, 50], [290, 62], [350, 120]], pen({ strokeWidth: 3.2 }))}${r.curve([[90, 120], [150, 172], [220, 184], [290, 172], [350, 120]], pen({ strokeWidth: 3.2 }))}` +
    `${r.circle(220, 118, 84, pen({ strokeWidth: 2.8 }))}${r.circle(220, 118, 32, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1 }))}` +
    [[150, 66, 138, 40], [220, 50, 220, 22], [290, 66, 302, 40]].map(([a, b, c, d]) => r.line(a, b, c, d, pen({ strokeWidth: 2.4 }))).join("") + `</g>` +
    `<g id="b-eyex">${r.line(110, 215, 330, 25, goldPen({ strokeWidth: 4.6 }))}</g>`;
  const eyeHtml = `<div id="b-eye" class="obj" style="left:1220px;top:280px;width:440px;height:330px">
    <svg class="sk" width="440" height="330" viewBox="0 0 440 330">${eyeSvg}</svg>
    ${lbl("b-eyelbl", 0, 236, 440, 48, "no reading first")}
  </div>`;

  // ---------- 15. kets and the formula ----------
  const keyHtml = `<div id="b-key" class="obj" style="left:160px;top:240px;width:400px;height:360px">
    <svg class="sk" width="400" height="360" viewBox="0 0 400 360"><g id="b-kup">${arrow(80, 128, 80, 52, { stroke: INK, strokeWidth: 4 }, 20)}</g><g id="b-kdn">${arrow(80, 222, 80, 298, { stroke: INK, strokeWidth: 4 }, 20)}</g></svg>
    ${lbl("b-k0", 125, 22, 220, 90, "|0⟩", "text-align:left")}
    ${lbl("b-k1", 125, 192, 220, 90, "|1⟩", "text-align:left")}
  </div>`;
  const formula = (id, top, l, rr) => `<div id="${id}" class="obj" style="left:760px;top:${top}px;width:700px;height:170px">
    ${lbl(id + "a", 0, 0, 330, 110, l, "text-align:right")}
    ${lbl(id + "b", 350, 0, 300, 110, rr, `color:${GOLD};text-align:left`)}
  </div>`;
  const formHtml = formula("b-f1", 248, "X |0⟩ =", "|1⟩") + formula("b-f2", 418, "X |1⟩ =", "|0⟩");

  // ---------- 16. the closing picture ----------
  const M = { x: 130, y: 130, r: 105 };
  const miniHtml = `<div id="b-mini" class="obj" style="left:330px;top:520px;width:260px;height:260px">
    <svg class="sk" width="260" height="260" viewBox="0 0 260 260">
      <g id="b-mcirc">${r.circle(M.x, M.y, M.r * 2, pen({ strokeWidth: 3 }))}${dashed(ellPts(M.x, M.y, M.r, 0, 2 * Math.PI, 80), 9, 9, { stroke: DIM, strokeWidth: 1.8 })}</g>
      <path id="b-mtr" fill="none" stroke="${GOLD}" stroke-width="3" stroke-dasharray="9 8" stroke-linecap="round"/>
      <g id="b-mT" transform="translate(${M.x} ${M.y})"><g id="b-marr">${NS(arrow(0, 0, 0, -M.r + 6, { stroke: GOLD, strokeWidth: 5, roughness: 0.8 }, 22) + r.circle(0, 0, 12, goldPen({ fill: GOLD, fillStyle: "solid", strokeWidth: 1.5 })))}</g></g>
    </svg></div>`;
  const uline = `<svg class="sk" viewBox="0 0 300 24" preserveAspectRatio="none" style="left:0;top:auto;bottom:-0.08em;width:100%;height:22px"><g id="b-uline">${NS(r.curve([[4, 14], [100, 8], [200, 14], [296, 8]], goldPen({ strokeWidth: 4.4, roughness: 0.9 })))}</g></svg>`;
  const takeHtml = `<div id="b-take" class="obj" style="left:640px;top:560px;width:1130px;height:210px">
    ${lbl("b-tk1", 0, 0, 1120, 66, "Gates turn the arrow.", "text-align:left")}
    ${lbl("b-tk2", 0, 100, 1120, 66, `X is a <span style="position:relative;display:inline-block">half turn${uline}</span> that swaps 0 and 1.`, "text-align:left")}
  </div>`;

  const html = [cardsHtml, gateHtml, dialHtml, xboxHtml, xlinkHtml, panHtml, cakeHtml, sideHtml, rightHtml, notHtml, dieHtml, psHtml, barsHtml, eyeHtml, keyHtml, formHtml, miniHtml, takeHtml].join("\n");

  const wr = (n) => Math.min(1, Math.max(0.15, n * 0.06));
  const script = `
    const A = ${A}, B = ${B}, RAD = ${RAD}, DEG = Math.PI / 180, GOLD = "${GOLD}", INK = "${INK}";
    const PHI = ${JSON.stringify(PHI)}, TILT = ${JSON.stringify(TILT)}, TOSS = ${JSON.stringify(TOSS)}, MINI = ${JSON.stringify(MINI)};
    const T = ${JSON.stringify(T)};
    // Board matrix for an arrow tilted th (in the picture) and turned ph about the left to right line.
    function mat(th, ph) {
      const s = Math.sin(ph); let D = Math.cos(ph) - B * s;
      if (Math.abs(D) < 0.012) D = D < 0 ? -0.012 : 0.012;
      const ct = Math.cos(th), st = Math.sin(th);
      return [ct + A * s * st, D * st, -st + A * s * ct, D * ct];
    }
    const tipAt = (th, ph, rad) => { const m = mat(th, ph); return [-rad * m[2], -rad * m[3]]; };
    function trace(th, p0, p1, cx, cy, rad) {
      if (p1 <= p0 + 0.002) return "M0 0";
      const n = Math.max(2, Math.ceil((p1 - p0) / 0.04));
      let d = "";
      for (let i = 0; i <= n; i++) { const [x, y] = tipAt(th, p0 + ((p1 - p0) * i) / n, rad); d += (i ? " L" : "M") + (cx + x).toFixed(1) + " " + (cy + y).toFixed(1); }
      return d;
    }
    const mstr = (m) => "matrix(" + m.map((v) => v.toFixed(4)).join(" ") + " 0 0)";

    // ---------- 0. hook: it always reads 0 ----------
    hide(["#b-glow", "#b-trA", "#b-trB", "#b-trC"]);
    draw("#b-cardbox", ${T.cards}, 0.75);
    [0, 1, 2].forEach((i) => { write("#b-c0-" + i, ${T.z0} + i * 0.25, 0.2); write("#b-chk-" + i, ${T.z0} + i * 0.25 + 0.05, 0.4); });
    draw("#b-hand", ${T.make - 0.05}, 0.4);
    draw("#b-card4", ${T.make + 0.1}, 0.5);
    write("#b-q1", ${T.q1}, 0.35);
    blurOut(["#b-title", "#b-cards"], ${T.off0});

    // ---------- 1. the qubit as an arrow ----------
    draw("#b-circ", ${T.circle}, 1.1);
    draw("#b-eq", ${T.circle + 0.85}, 0.5);
    draw("#b-arrow", ${T.arrow}, 0.45);
    tl.set("#b-p0", { color: GOLD }, 0);
    write("#b-p0", ${T.up}, 0.2);
    tl.to("#b-p0", { color: INK, duration: 0.4 }, ${T.up + 0.8});
    draw("#b-ghost", ${T.down}, 0.4);
    write("#b-p1", ${T.down + 0.45}, 0.2);
    fade("#b-ghost", 0, ${T.down + 1.0}, 0.4);

    // ---------- 2. a gate turns the arrow, never stretches it ----------
    draw("#b-gbox", ${T.gate - 0.1}, 0.45);
    write("#b-glbl", ${T.gate}, 0.3);
    draw("#b-glink", ${T.gate + 0.2}, 0.35);
    write("#b-gturn", ${T.turns}, 0.3);
    draw("#b-ruler", ${T.stretch}, 0.35);
    write("#b-glen", ${T.stretch + 0.05}, 0.6);
    blurOut("#b-gate", ${T.off2});
    blurOut("#b-dial", ${T.off2 + 0.05});
    fade("#b-ruler", 0, ${T.off2 + 0.35}, 0.01);

    // ---------- 3 to 5. X is like flipping a pancake ----------
    draw("#b-xrect", ${T.xgate}, 0.45);
    write("#b-xlbl", ${T.xcalled - 0.1}, 0.3);
    draw("#b-pang", ${T.flipping}, 1.1);
    hide("#b-cakebox"); show("#b-cakebox", ${T.pancake - 0.05});
    draw("#b-steam", ${T.pancake + 0.35}, 0.4);
    fade("#b-steam", 0, ${T.flip1 - 0.1}, 0.2);
    write("#b-top", ${T.pancake + 0.25}, 0.25);
    draw("#b-ptrA", ${T.pancake + 0.4}, 0.25);
    fade("#b-ptrA", 0, ${T.flip1}, 0.2);
    // tip the pan, then the toss (onFrame) flips the cake
    tl.fromTo("#b-pan", { rotation: 0, transformOrigin: "60px 137px" }, { rotation: -9, duration: 0.28, ease: "power2.out" }, ${T.flip1 - 0.04});
    tl.to("#b-pan", { rotation: 0, duration: 0.4, ease: "power2.inOut" }, ${T.flip1 + 0.26});
    draw("#b-arcA", ${T.flip1 + 0.05}, 0.45);
    fade("#b-arcA", 0, ${TOSS[0][1] + 0.1}, 0.3);
    write("#b-tally1", ${TOSS[0][1] - 0.05}, 0.4);
    move("#b-top", { y: 0 }, { y: 42 }, ${T.top - 0.15}, 0.5);
    draw("#b-ptrB", ${T.top + 0.1}, 0.25);
    write("#b-nowbot", ${T.ends}, 0.8);
    // second flip
    fade(["#b-top", "#b-ptrB", "#b-nowbot"], 0, ${T.flip2 - 0.15}, 0.25);
    tl.to("#b-pan", { rotation: -9, duration: 0.28, ease: "power2.out" }, ${T.flip2 - 0.12});
    tl.to("#b-pan", { rotation: 0, duration: 0.4, ease: "power2.inOut" }, ${T.flip2 + 0.18});
    draw("#b-arcB", ${T.flip2 - 0.05}, 0.45);
    fade("#b-arcB", 0, ${TOSS[1][1] + 0.1}, 0.3);
    fade("#b-tally1", 0, ${TOSS[1][1] - 0.15}, 0.15);
    write("#b-tally2", ${TOSS[1][1] - 0.05}, 0.4);
    write("#b-top2", ${TOSS[1][1] + 0.05}, 0.25);
    draw("#b-ptrC", ${TOSS[1][1] + 0.2}, 0.25);
    draw("#b-tick5", ${T.back - 0.05}, 0.3);
    write("#b-backlbl", ${T.back + 0.15}, 0.7);
    blurOut(["#b-pan", "#b-cakebox", "#b-side"], ${T.off5});

    // ---------- 6. X on the arrow: a half turn about a left to right line ----------
    move("#b-xbox", { x: 0, y: 0 }, { x: -660, y: 270 }, ${T.off5 + 0.05}, 0.9);
    tl.to("#b-dial", { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }, ${T.off5 + 0.5});
    hide(["#b-axle", "#b-spin", "#b-xmini", "#b-hometick"]);
    draw("#b-xl", ${T.same}, 0.4);
    write("#b-halfturn", ${T.half6}, 0.5);
    show("#b-axle", ${T.line6}); draw("#b-axle", ${T.line6}, 0.6);
    show("#b-spin", ${T.running}); draw("#b-spin", ${T.running}, 0.4);

    // ---------- 7. up at 0 lands down at 1 ----------
    tl.to("#b-p0", { color: GOLD, duration: 0.25 }, ${T.zero7});
    show("#b-trA", ${T.lands});
    tl.to("#b-p1", { color: GOLD, duration: 0.25 }, ${T.one7 - 0.1});
    tl.to("#b-p0", { color: INK, duration: 0.25 }, ${T.one7 - 0.1});

    // ---------- 8. the NOT gate of ordinary computers ----------
    fade(["#b-axle", "#b-spin", "#b-trA"], 0.3, ${T.l8}, 0.3);
    fade("#b-halfturn", 0, ${T.l8}, 0.3);
    tl.to("#b-p1", { color: INK, duration: 0.3 }, ${T.l8});
    draw("#b-notframe", ${T.not}, 0.5);
    write("#b-nothead", ${T.not + 0.1}, 0.3);
    write("#b-notsub", ${T.ordinary}, 0.7);
    write("#b-row1", ${T.swapping}, 0.4);
    write("#b-row2", ${T.one8}, 0.4);
    draw("#b-diebox", ${T.chance - 0.1}, 0.35);
    draw("#b-diex", ${T.chance + 0.2}, 0.3);
    write("#b-nochance", ${T.chance + 0.3}, 0.5);
    blurOut(["#b-not", "#b-die"], ${T.off8});

    // ---------- 9. twice: a full turn, back home ----------
    fade(["#b-axle", "#b-spin", "#b-trA"], 1, ${T.half9 - 0.3}, 0.3);
    write("#b-hh1", ${T.half9 + 0.05}, 0.55);
    write("#b-hh2", ${T.full}, 0.6);
    tl.to("#b-p0", { color: GOLD, duration: 0.25 }, ${T.home - 0.05});
    show("#b-hometick", ${T.home}); draw("#b-hometick", ${T.home}, 0.3);

    // ---------- 10. where the pancake falls short ----------
    blurOut(["#b-xbox", "#b-xlink", "#b-hh1", "#b-hh2", "#b-hometick"], ${T.off9});
    fade("#b-trA", 0, ${T.off9}, 0.25);
    tl.to("#b-p0", { color: INK, duration: 0.3 }, ${T.off9});
    move("#b-dial", { x: 0 }, { x: -340 }, ${T.pancake10 - 0.1}, 0.9);
    draw("#b-ps1", ${T.pancake10 + 0.2}, 0.6);
    write("#b-psor", ${T.pancake10 + 0.8}, 0.2);
    draw("#b-ps2", ${T.pancake10 + 1.0}, 0.6);
    write("#b-psl", ${T.always}, 0.9);
    blurOut("#b-ps", ${T.point - 0.15});
    [0, 1, 2, 3, 4].forEach((i) => draw("#b-fan" + i, ${T.point} + i * 0.18, 0.28));

    // ---------- 11. a lean: 8 in 10 reads 0 ----------
    fade(["#b-fan0", "#b-fan1", "#b-fan2", "#b-fan3", "#b-fan4"], 0, ${T.leans - 0.15}, 0.3);
    draw("#b-base", ${T.reads11}, 0.4);
    draw(["#b-bin0", "#b-bin1"], ${T.reads11 + 0.2}, 0.5);
    write("#b-bl0", ${T.reads11 + 0.3}, 0.15); write("#b-bl1", ${T.reads11 + 0.45}, 0.15);
    write("#b-tag0", ${T.eight11 + 0.3}, 0.45);

    // ---------- 12. the same half turn: 8 in 10 reads 1 ----------
    fade("#b-tag0", 0, ${T.half12 - 0.1}, 0.25);
    show("#b-xmini", ${T.half12 - 0.15}); write("#b-xmini", ${T.half12 - 0.15}, 0.2);
    show("#b-trB", ${T.half12});
    write("#b-tag1", ${T.one12}, 0.45);

    // ---------- 13. X swaps how much 0 and how much 1 ----------
    write("#b-swaplbl", ${T.swapped}, 0.9);
    draw("#b-swap", ${T.much}, 0.55);

    // ---------- 14. not read-then-flip: it turns the whole arrow ----------
    blurOut("#b-bars", ${T.off13});
    fade("#b-trB", 0, ${T.off13}, 0.25);
    draw("#b-eyeg", ${T.read14}, 0.6);
    draw("#b-eyex", ${T.read14 + 0.55}, 0.3);
    write("#b-eyelbl", ${T.read14 + 0.7}, 0.7);
    show("#b-trC", ${T.turns14});
    tl.fromTo("#b-glow", { opacity: 0 }, { opacity: 0.85, duration: 0.25, ease: "power2.out", immediateRender: false }, ${T.whole});
    tl.to("#b-glow", { opacity: 0, duration: 0.45, ease: "power2.in" }, ${T.whole + 0.4});

    // ---------- 15. kets and the formula ----------
    blurOut(["#b-dial", "#b-eye"], ${T.off14});
    draw("#b-kup", ${T.up15}, 0.3);
    write("#b-k0", ${T.zero15 - 0.05}, 0.35);
    draw("#b-kdn", ${T.down15}, 0.3);
    write("#b-k1", ${T.one15 - 0.05}, 0.35);
    write("#b-f1a", ${T.so15}, 0.7);
    write("#b-f1b", ${T.one15b - 0.05}, 0.3);
    write("#b-f2a", ${T.ket15c}, 0.6);
    write("#b-f2b", ${T.zero15c - 0.05}, 0.3);
    blurOut("#b-key", ${T.off15});

    // ---------- 16. takeaway ----------
    move("#b-f1", { x: 0, y: 0, scale: 1 }, { x: -140, y: -100, scale: 0.92 }, ${T.off15 + 0.1}, 0.9);
    move("#b-f2", { x: 0, y: 0, scale: 1 }, { x: -140, y: -146, scale: 0.92 }, ${T.off15 + 0.1}, 0.9);
    draw("#b-mcirc", ${T.remember}, 0.6);
    draw("#b-marr", ${T.gates - 0.1}, 0.35);
    write("#b-tk1", ${T.gates}, 0.9);
    write("#b-tk2", ${T.half16 - 0.4}, 1.0);
    draw("#b-uline", ${T.half16 + 0.4}, 0.4);
    hide("#b-mtr"); show("#b-mtr", ${T.half16});

    // ---------- live drawings: the arrow, the tip trace, the pancake, the bars ----------
    const grow = (t) => sched([[T.eight11 - 0.05, T.eight11 + 0.75, 0, 1]], t);
    onFrame((t) => {
      const ph = sched(PHI, t), th = sched(TILT, t) * DEG, m = mat(th, ph);
      $("b-arrT").setAttribute("transform", "translate(400 380) " + mstr(m));
      $("b-trA").setAttribute("d", t >= T.lands && t < T.off9 + 0.4 ? trace(0, 0, Math.min(ph, 2 * Math.PI), 400, 380, RAD - 8) : "M0 0");
      $("b-trB").setAttribute("d", t >= T.half12 ? trace(${LEAN} * DEG, 0, t < T.turns14 ? Math.min(ph, Math.PI) : Math.PI, 400, 380, RAD - 8) : "M0 0");
      $("b-trC").setAttribute("d", t >= T.turns14 ? trace(${LEAN} * DEG, Math.PI, ph, 400, 380, RAD - 8) : "M0 0");
      // pancake: dropped in, then tossed and turned about a left to right line
      let lift = sched([[T.pancake - 0.05, T.pancake + 0.35, -240, 0]], t, -240), cph = 0;
      for (const [a, b, n] of TOSS) {
        if (t >= b) cph = (n + 1) * Math.PI;
        else if (t > a) { const u = (t - a) / (b - a); lift = -230 * 4 * u * (1 - u); cph = (n + ease.inOut(u)) * Math.PI; }
      }
      let sy = Math.cos(cph); if (Math.abs(sy) < 0.03) sy = sy < 0 ? -0.03 : 0.03;
      $("b-cakeT").setAttribute("transform", "translate(260 " + (310 + lift).toFixed(1) + ") scale(1 " + sy.toFixed(4) + ")");
      // bars: P(0) = (1 + z) / 2 with z the arrow's height
      const z = Math.cos(th) * Math.cos(ph), g = grow(t);
      [(1 + z) / 2, (1 - z) / 2].forEach((p, i) => {
        const h = ${FULL} * p * g, y = ${BASE} - h, tall = p > 0.5;
        $("b-clipr" + i).setAttribute("y", y.toFixed(1)); $("b-clipr" + i).setAttribute("height", h.toFixed(1));
        $("b-lv" + i).setAttribute("y1", y.toFixed(1)); $("b-lv" + i).setAttribute("y2", y.toFixed(1));
        $("b-lv" + i).setAttribute("stroke", tall ? GOLD : INK);
        $("b-lv" + i).style.opacity = g > 0.001 ? "1" : "0";
        $("b-fg" + i).style.opacity = tall ? "1" : "0"; $("b-fi" + i).style.opacity = tall ? "0" : "0.75";
      });
      // closing mini dial
      const mp = sched(MINI, t), mm = mat(0, mp);
      $("b-mT").setAttribute("transform", "translate(${M.x} ${M.y}) " + mstr(mm));
      $("b-mtr").setAttribute("d", t >= T.half16 ? trace(0, 0, mp, ${M.x}, ${M.y}, ${M.r - 6}) : "M0 0");
    });
  `;
  return { html, script, css: "" };
}
