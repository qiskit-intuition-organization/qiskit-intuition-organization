// Lesson 17, "Your first algorithm: Grover search". Follows plan.md: four sealed boxes and a helper
// who marks the prize, the swing analogy, then the real thing on an amplitude chart under a circuit
// strip (H spreads, the oracle flips the prize's sign, the diffuser reflects every bar about the
// average), sixteen boxes over five rounds with the swing tracking the prize's chance, where the
// swing breaks (the total stays one), the misconception, and the closing circuit with the rule.
// Gold is the prize (its mark, bar, chance) or the step that is running right now.
export const phrases = [
  ["pi over four root N", "(π/4)√N"],
  ["minus one half", "−½"],
  ["one half", "½"],
  ["one quarter", "¼"],
  ["three quarters", "¾"],
  ["one in four", "1 in 4"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, INK, GOLD, GROUND } = k;
  const DIMINK = "rgba(232,232,232,0.45)";
  const fx = (n) => +(+n).toFixed(1);
  // Label centred on (cx, cy).
  const C = (id, cx, cy, w, size, html, extra = "") => lbl(id, fx(cx - w / 2), fx(cy - size * 0.76), w, size, html, extra);
  const cc = (svg) => svg.replaceAll(`stroke="${INK}"`, 'stroke="currentColor"');
  const G = (id, inner, extra = "") => `<g id="${id}"${extra}>${inner}</g>`;
  const full = (id, svg, inner = "") => `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${inner}</div>`;
  const solidBox = (x, y, w, h, o = {}) => r.rect(x, y, w, h, pen({ strokeWidth: 3.2, roughness: 1, fill: GROUND, fillStyle: "solid", ...o }));
  const MINUS = "−";

  // ---------- Times, cued to the voice ----------
  const T = {
    boxes: cue(0, "Four", 0, -0.05), prize0: cue(0, "prize", 0, -0.05), titleOut: cue(0, "prize", 0, 0.5), look0: cue(0, "one", 1, -0.15),
    helper: cue(1, "helper", 0, -0.05), wont: cue(1, "won't", 0, -0.05), mark: cue(1, "mark", 0, -0.15),
    grover: cue(2, "Grover", 0, -0.1), pushing: cue(2, "pushing", 0, -0.15), push: cue(2, "push", 1), higher: cue(2, "higher", 0, -0.1),
    l3: cue(3, "Each", 0, 0.1), box3: cue(3, "box", 0, -0.1), amp3: cue(3, "amplitude", 0, -0.1), square: cue(3, "square", 0, -0.1), chance3: cue(3, "chance", 0, -0.1),
    qubits: cue(4, "qubits", 0, -0.3), quantum: cue(4, "quantum", 0, -0.1), name: cue(4, "name", 0, -0.1), gate: cue(4, "gate", 0, -0.35), spreads: cue(4, "spreads", 0, -0.1),
    l5: cue(5, "Every"), amp5: cue(5, "amplitude", 0, -0.1), four5: cue(5, "four", 0, -0.1),
    oracle: cue(6, "oracle", 0, -0.15), sign6: cue(6, "sign", 0, -0.1), prize6: cue(6, "prize", 0, -0.1), minus6: cue(6, "minus", 0, -0.1),
    squared: cue(6, "squared", 0, -0.1), l7: cue(7), odds: cue(7, "odds", 0, -0.1), changed: cue(7, "changed", 0, -0.1),
    next: cue(7, "Next"), diffuser: cue(8, "diffuser", 0, -0.15), reflects: cue(8, "reflects", 0, -0.1), average: cue(8, "average", 0, -0.15), quarter8: cue(8, "quarter", 0, -0.2),
    three9: cue(9, "three", 0, -0.15), above9: cue(9, "above", 0, -0.1), land: cue(9, "land", 0, -0.1), zero9: cue(9, "zero", 0, -0.1),
    prize9: cue(9, "prize", 0, -0.15), flung: cue(10, "flung", 0, -0.1), one10: cue(10, "one", 0, -0.1),
    intf: cue(11, "interference", 0, -0.15), combine: cue(11, "combine", 0, -0.15), grows11: cue(11, "grows", 0, -0.1), cancel11: cue(11, "cancel", 0, -0.1), look11: cue(11, "look", 0, -0.1), finds: cue(11, "finds", 0, -0.1),
    l12: cue(12, "With", 0, 0.05), sixteen: cue(12, "sixteen", 0, -0.15), repeat12: cue(12, "repeat", 0, -0.1), push12: cue(12, "push", 0, -0.1),
    r2: cue(13, "For", 0, 0.05), sweet: cue(13, "sweet", 0, -0.1), pi13: cue(13, "pi", 0, -0.1), three13: cue(13, "three", 0, -0.1), push13: cue(13, "push", 0, -0.1), swings13: cue(13, "swings", 0, -0.1),
    but: cue(13, "But", 0, -0.05), energy: cue(14, "energy", 0, -0.1), never14: cue(14, "never", 0, -0.1), always: cue(14, "always", 0, -0.1), one14: cue(14, "one", 0, -0.1),
    grows15: cue(15, "grows", 0, -0.05), shrinks: cue(15, "shrinks", 0, -0.2), out15: cue(15, "It", 0, -0.05),
    opens: cue(16, "opens", 0, -0.15), once: cue(16, "once", 0, -0.1), reshapes: cue(16, "reshapes", 0, -0.1), look16: cue(16, "look", 0, -0.15), likely: cue(16, "likely", 0, -0.05),
    so: cue(16, "So", 1, -0.05), mark17: cue(16, "mark", 0, -0.1), sign17: cue(17, "sign", 0, -0.1), reflect17: cue(17, "reflect", 0, -0.1), repeat17: cue(17, "repeat", 0, -0.1), pi17: cue(17, "pi", 0, -0.15),
  };

  // ===================== Drawing helpers =====================
  // A sealed crate centred on cx, from y0 (lid top) to y1 (bottom), with a ribbon and a bow.
  function crate(cx, y0, y1, w, o = {}) {
    const lidH = (y1 - y0) * 0.22, sw = o.sw ?? 3.2;
    const ribbon = o.ribbon ?? true;
    let s = solidBox(cx - w / 2, y0 + lidH, w, y1 - y0 - lidH, { strokeWidth: sw });
    if (o.lid ?? true) s += r.rect(cx - w / 2 - 8, y0, w + 16, lidH, pen({ strokeWidth: sw, roughness: 1 }));
    if (ribbon) {
      const ym = y0 + lidH + (y1 - y0 - lidH) * 0.5;
      s += r.line(cx - 5, y0, cx - 5, y1, pen({ strokeWidth: 2.2 })) + r.line(cx + 5, y0, cx + 5, y1, pen({ strokeWidth: 2.2 }));
      s += r.line(cx - w / 2, ym - 5, cx + w / 2, ym - 5, pen({ strokeWidth: 2.2 })) + r.line(cx - w / 2, ym + 5, cx + w / 2, ym + 5, pen({ strokeWidth: 2.2 }));
      s += r.ellipse(cx - 18, y0 - 10, 34, 20, pen({ strokeWidth: 2.4 })) + r.ellipse(cx + 18, y0 - 10, 34, 20, pen({ strokeWidth: 2.4 }));
    }
    return s;
  }
  // An eye centred on (cx, cy), w wide; strokes follow the group's colour.
  const eye = (cx, cy, w, sw = 3.2) => cc(
    r.curve([[cx - w / 2, cy], [cx - w * 0.2, cy - w * 0.3], [cx + w * 0.2, cy - w * 0.3], [cx + w / 2, cy]], pen({ strokeWidth: sw })) +
    r.curve([[cx - w / 2, cy], [cx - w * 0.2, cy + w * 0.3], [cx + w * 0.2, cy + w * 0.3], [cx + w / 2, cy]], pen({ strokeWidth: sw })) +
    r.circle(cx, cy, w * 0.36, pen({ strokeWidth: sw * 0.8 })) +
    r.circle(cx, cy, w * 0.14, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" })));
  // A curved arrow through pts with a head at the last point.
  function curveArrow(pts, o = {}, head = 16) {
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const hp = (da) => [b[0] - head * Math.cos(ang + da), b[1] - head * Math.sin(ang + da)];
    const [h1, h2] = [hp(0.5), hp(-0.5)];
    return r.curve(pts, pen(o)) + r.line(b[0], b[1], h1[0], h1[1], pen(o)) + r.line(b[0], b[1], h2[0], h2[1], pen(o));
  }
  // A two-headed vertical arrow.
  const dbl = (x, y1, y2, o = {}, head = 11) => arrow(x, (y1 + y2) / 2, x, y1, o, head) + arrow(x, (y1 + y2) / 2, x, y2, o, head);
  // A five-point star.
  const starPts = (cx, cy, R) => Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? R * 0.45 : R;
    return [fx(cx + rr * Math.cos(a)), fx(cy + rr * Math.sin(a))];
  });
  // Dashes from x1 to x2 at y, each its own stroke so draw() pens them left to right.
  const dashes = (x1, x2, y, o, len = 20, gap = 14) => {
    let s = "";
    for (let x = x1; x < x2; x += len + gap) s += r.line(x, y, Math.min(x + len, x2), y, o);
    return s;
  };
  // A bar whose size the timeline sets: an ink and a gold hachure, clipped, plus an outline.
  function vbar(id, x, w, yTop, yBot, gap = 9) {
    const hatch = (c) => r.rect(x + 3, yTop, w - 6, yBot - yTop, pen({ fill: c, fillStyle: "hachure", hachureGap: gap, fillWeight: 2, stroke: "none", roughness: 1.1 }));
    return `<defs><clipPath id="${id}-c"><rect id="${id}-cr" x="${x - 4}" y="0" width="${w + 8}" height="0"/></clipPath></defs>` +
      `<g id="${id}"><g clip-path="url(#${id}-c)"><g id="${id}-fi">${hatch(INK)}</g><g id="${id}-fg" style="opacity:0">${hatch(GOLD)}</g></g>` +
      `<path id="${id}-o" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }
  // Side view of an A-frame swing: apex pivot (960, 210), seat 420 below. The seat group turns about the pivot.
  function swing(p) {
    const frame =
      r.line(960, 200, 700, 800, pen({ strokeWidth: 4.2 })) + r.line(960, 200, 1220, 800, pen({ strokeWidth: 4.2 })) +
      r.line(752, 748, 1168, 748, pen({ strokeWidth: 3 })) +
      r.line(620, 802, 1300, 802, pen({ strokeWidth: 2.4, stroke: DIMINK })) +
      r.circle(960, 210, 22, pen({ strokeWidth: 3, fill: INK, fillStyle: "solid" }));
    const seat =
      r.line(940, 212, 932, 628, pen({ strokeWidth: 2.6 })) + r.line(980, 212, 990, 628, pen({ strokeWidth: 2.6 })) +
      r.rect(905, 626, 112, 14, pen({ strokeWidth: 2.8, fill: INK, fillStyle: "hachure", hachureGap: 5, fillWeight: 1.4 })) +
      r.circle(962, 538, 48, pen({ strokeWidth: 3 })) +
      r.line(962, 562, 960, 622, pen({ strokeWidth: 3.2 })) +
      r.line(961, 580, 936, 560, pen({ strokeWidth: 2.8 })) + r.line(961, 580, 988, 560, pen({ strokeWidth: 2.8 })) +
      r.line(960, 622, 1012, 622, pen({ strokeWidth: 3.2 })) + r.line(1012, 622, 1024, 684, pen({ strokeWidth: 3.2 }));
    return G(`${p}-frame`, frame) + `<g id="${p}-rot">${G(`${p}-seat`, seat)}</g>`;
  }

  // ===================== Scene A: boxes and the helper (lines 0 and 1) =====================
  const BX = [480, 780, 1080, 1380];
  const aSvg =
    BX.map((x, i) => G(`b-box${i}`, crate(x, 440, 620, 200))).join("") +
    G("b-eye0", eye(960, 330, 130), ` style="color:${INK}"`) +
    G("b-eyear", r.line(960, 375, 960, 422, pen({ strokeWidth: 2.4, strokeLineDash: [4, 9] })) + r.line(960, 424, 950, 410, pen({ strokeWidth: 2.4 })) + r.line(960, 424, 970, 410, pen({ strokeWidth: 2.4 }))) +
    G("b-helper",
      r.circle(1655, 445, 58, pen({ strokeWidth: 3.2 })) + r.circle(1645, 440, 4, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" })) + r.circle(1666, 440, 4, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" })) +
      r.line(1655, 474, 1655, 578, pen({ strokeWidth: 3.4 })) +
      r.line(1655, 578, 1620, 660, pen({ strokeWidth: 3.2 })) + r.line(1655, 578, 1692, 660, pen({ strokeWidth: 3.2 })) +
      r.line(1655, 508, 1606, 536, pen({ strokeWidth: 3 })) + r.line(1655, 508, 1702, 548, pen({ strokeWidth: 3 })) +
      r.line(1608, 538, 1586, 500, pen({ strokeWidth: 6, roughness: 0.6 })) + r.line(1586, 500, 1580, 488, pen({ strokeWidth: 3 }))) +
    G("b-bubble", r.ellipse(1705, 362, 130, 74, pen({ strokeWidth: 2.6 })) + r.line(1688, 397, 1676, 414, pen({ strokeWidth: 2.4 }))) +
    G("b-pencil", curveArrow([[1572, 492], [1530, 462], [1494, 470]], { strokeWidth: 2.8 }, 14)) +
    G("b-tick0", r.linear([[1406, 532], [1424, 556], [1462, 502]], goldPen({ strokeWidth: 5.4, roughness: 0.8 })));
  const aHtml =
    C("b-prize", 960, 690, 260, 56, "1 prize", `color:${GOLD}`) +
    lbl("b-look1", 1050, 296, 200, 48, "1 look", `text-align:left;color:${GOLD}`) +
    C("b-shh", 1705, 362, 110, 44, "shh");

  // ===================== Scene B: the swing (line 2) =====================
  const bSvg = swing("b-sw") + `<path id="b-swarc" fill="none" stroke="${GOLD}" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="2 15"/>` +
    G("b-hand", arrow(742, 646, 892, 640, { strokeWidth: 3.6 }, 18));

  // ===================== Scene C: circuit strip and amplitude chart (lines 3 to 11) =====================
  const W0 = 150, W1 = 220; // wire y
  const B = 530, U = 220; // chart baseline and px per unit amplitude
  const ya = (a) => B - U * a;
  const CX = [560, 840, 1120, 1400], BW = 130;
  const circSvg =
    G("b-wires", r.line(235, W0, 1066, W0, pen({ strokeWidth: 3 })) + r.line(235, W1, 1066, W1, pen({ strokeWidth: 3 }))) +
    G("b-cH", cc(solidBox(268, W0 - 30, 64, 60) + solidBox(268, W1 - 30, 64, 60)), ` style="color:${INK}"`) +
    G("b-cO", cc(solidBox(480, 118, 200, 134)), ` style="color:${INK}"`) +
    G("b-cOh", r.circle(580, 100, 34, pen({ strokeWidth: 2.6 })) + r.line(570, 96, 571, 98, pen({ strokeWidth: 3 })) + r.line(590, 96, 591, 98, pen({ strokeWidth: 3 }))) +
    G("b-cD", cc(solidBox(780, 118, 230, 134)), ` style="color:${INK}"`) +
    G("b-mirror", r.line(895, 266, 895, 342, pen({ strokeWidth: 2.4, strokeLineDash: [6, 8] })) +
      curveArrow([[858, 292], [895, 270], [932, 292]], { strokeWidth: 2.6 }, 11) + curveArrow([[932, 318], [895, 340], [858, 318]], { strokeWidth: 2.6 }, 11)) +
    G("b-cM", eye(1120, 185, 96, 3), ` style="color:${INK}"`);
  const circHtml =
    C("b-k0", 185, W0, 90, 44, "|0⟩") + C("b-k1", 185, W1, 90, 44, "|0⟩") +
    C("b-hL0", 300, W0, 60, 44, "H") + C("b-hL1", 300, W1, 60, 44, "H") +
    C("b-oL", 580, 185, 190, 44, "oracle") + C("b-dL", 895, 185, 220, 44, "diffuser") +
    C("b-qnote", 1480, 185, 420, 40, "qubit = quantum bit") +
    C("b-sgn", 580, 290, 160, 44, `+ → ${MINUS}`, `color:${GOLD}`) +
    C("b-plus", 730, 185, 60, 52, "+");

  const chartSvg =
    G("b-base", r.line(420, B, 1560, B, pen({ strokeWidth: 3.4 }))) +
    CX.map((x, i) => vbar(`b-bar${i}`, x - BW / 2, BW, 290, 650)).join("") +
    G("b-minis", CX.map((x, i) => crate(x, 712, 778, 92, { ribbon: false, sw: 2.6, lid: i !== 3 })).join("")) +
    `<g id="b-lid3">${r.rect(CX[3] - 54, 712, 108, 14, pen({ strokeWidth: 2.6, roughness: 1, fill: GROUND, fillStyle: "solid" }))}</g>` +
    G("b-sq", r.rect(652, 420, 110, 110, pen({ stroke: GOLD, strokeWidth: 3, fill: GOLD, fillStyle: "hachure", hachureGap: 8, fillWeight: 1.8 }))) +
    G("b-sqar", curveArrow([[700, 548], [664, 690], [628, 796]], { strokeWidth: 2.6 }, 14)) +
    G("b-avg", dashes(420, 1560, ya(0.25), goldPen({ strokeWidth: 4, roughness: 0.7 }))) +
    [0, 1, 2].map((i) => G(`b-up${i}`, dbl(CX[i] + 84, ya(0.5) + 3, ya(0.25) - 3, { strokeWidth: 2.4 }))).join("") +
    [0, 1, 2].map((i) => G(`b-dn${i}`, dbl(CX[i] + 84, ya(0.25) + 3, ya(0) - 3, { strokeWidth: 2.4 }))).join("") +
    [0, 1, 2].map((i) => G(`b-gh${i}`, dashes(CX[i] - 65, CX[i] + 65, ya(0.5), pen({ strokeWidth: 2.2, stroke: DIMINK, roughness: 0.6 }), 12, 10))).join("") +
    G("b-brk0", r.line(1494, ya(-0.5), 1494, ya(0.25), goldPen({ strokeWidth: 3.2 })) + r.line(1482, ya(-0.5), 1506, ya(-0.5), goldPen({ strokeWidth: 3 })) + r.line(1482, ya(0.25), 1506, ya(0.25), goldPen({ strokeWidth: 3 }))) +
    G("b-brk1", r.line(1494, ya(0.25), 1494, ya(1), goldPen({ strokeWidth: 3.2 })) + r.line(1482, ya(0.25), 1506, ya(0.25), goldPen({ strokeWidth: 3 })) + r.line(1482, ya(1), 1506, ya(1), goldPen({ strokeWidth: 3 }))) +
    G("b-grow", arrow(1268, 500, 1268, 330, { strokeWidth: 4, stroke: GOLD }, 20)) +
    [0, 1, 2].map((i) => G(`b-zc${i}`, r.ellipse(CX[i], 584, 76, 70, pen({ strokeWidth: 2.4, stroke: DIMINK })))).join("") +
    `<g id="b-star" style="opacity:0">${r.poly(starPts(CX[3], 628, 34), goldPen({ strokeWidth: 3, fill: GOLD, fillStyle: "hachure", hachureGap: 6, fillWeight: 1.8 }))}</g>`;
  const chartHtml =
    C("b-amph", 280, 470, 230, 48, "amplitude") + C("b-chh", 260, 826, 200, 44, "chance") +
    CX.map((x, i) => C(`b-v${i}`, x, ya(0.5) - 30, 80, 48, "½")).join("") +
    [0, 1, 2].map((i) => C(`b-z${i}`, CX[i], 584, 60, 48, "0")).join("") +
    C("b-vm", CX[3], ya(-0.5) + 30, 90, 48, `${MINUS}½`, `color:${GOLD}`) +
    C("b-vone", CX[3], ya(1) - 30, 60, 52, "1", `color:${GOLD}`) +
    ["00", "01", "10", "11"].map((s, i) => C(`b-n${i}`, CX[i], 752, 80, 44, s)).join("") +
    CX.map((x, i) => C(`b-ch${i}`, x, 826, 120, 44, "25%")).join("") +
    [0, 1, 2].map((i) => C(`b-c0${i}`, CX[i], 826, 100, 44, "0%")).join("") +
    C("b-c100", CX[3], 826, 120, 44, "100%", `color:${GOLD}`) +
    C("b-sql", 748, 386, 220, 48, "½ × ½ = ¼", `color:${GOLD}`) +
    lbl("b-sqd", 1490, 596, 280, 48, `(${MINUS}½)² = ¼`, `text-align:left;color:${GOLD}`) +
    lbl("b-same", 1490, 826 - 33, 220, 44, "same odds", "text-align:left") +
    lbl("b-avgl", 1572, ya(0.25) - 34, 200, 44, "average ¼", `text-align:left;color:${GOLD}`) +
    C("b-sum", 1460, 318, 440, 40, `(½ + ½ + ½ ${MINUS} ½) ÷ 4 = ¼`) +
    C("b-q9a", CX[0] + 116, (ya(0.5) + ya(0.25)) / 2, 50, 40, "¼") +
    C("b-q9b", CX[0] + 116, (ya(0.25) + ya(0)) / 2, 50, 40, "¼") +
    C("b-q10a", 1534, (ya(-0.5) + ya(0.25)) / 2, 50, 48, "¾", `color:${GOLD}`) +
    C("b-q10b", 1534, (ya(0.25) + ya(1)) / 2, 50, 48, "¾", `color:${GOLD}`) +
    C("b-intf", 960, 306, 400, 64, "interference");

  // ===================== Scene D: sixteen boxes, five rounds (lines 12 and 13) =====================
  const NB = 16, PZ = 11, B16 = 580, U16 = 380;
  const X16 = Array.from({ length: NB }, (_, i) => 906 + 52 * i), W16 = 34;
  const dSvg =
    G("b-base16", r.line(866, B16, 1720, B16, pen({ strokeWidth: 3.2 }))) +
    X16.map((x, i) => vbar(`b-s${i}`, x - W16 / 2, W16, 190, 700, 6)).join("") +
    G("b-loop", curveArrow([[1092, 140], [1072, 118], [1090, 98], [1118, 104], [1126, 130], [1108, 146]], { strokeWidth: 2.8 }, 11)) +
    G("b-sweetar", arrow(1598, 262, 1516, 216, { strokeWidth: 3, stroke: GOLD }, 15)) +
    G("b-sweetmk", r.line(1452, B16 - U16 * 0.98, 1504, B16 - U16 * 0.98, goldPen({ strokeWidth: 3, strokeLineDash: [6, 7] })));
  const dHtml =
    lbl("b-16", 870, 120 - 36, 220, 48, "16 boxes", "text-align:left") +
    lbl("b-loopl", 1142, 122 - 31, 360, 40, "oracle + diffuser", "text-align:left") +
    C("b-pc", X16[PZ], 400, 110, 44, "6%", `color:${GOLD}`) +
    C("b-sweet", 1660, 290, 220, 44, "sweet spot", `color:${GOLD}`) +
    C("b-form13", 1290, 730, 640, 72, "rounds ≈ (π/4)√N", `color:${GOLD}`) +
    C("b-n16", 1290, 815, 400, 40, "N = 16: about 3") +
    C("b-round", 460, 660, 220, 48, "round 1");

  // ===================== Swing again (lines 12 to 15) and the total column (lines 14 and 15) =====================
  const swing2Svg = `<g id="b-sw2pos">${swing("b-sw2")}</g>` + `<path id="b-sw2arc" fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 15"/>`;
  const COL = { x: 1240, w: 200, top: 260, bot: 760 };
  const eSvg =
    G("b-energyar", arrow(706, 172, 706, 104, { strokeWidth: 3.2 }, 15)) +
    `<defs><clipPath id="b-gsc"><rect id="b-gscr" x="${COL.x}" y="${COL.bot}" width="${COL.w}" height="0"/></clipPath></defs>` +
    `<g id="b-slices">` +
    Array.from({ length: 15 }, (_, i) => `<rect id="b-sl${i}" x="${COL.x + 6}" y="0" width="${COL.w - 12}" height="0" rx="3" fill="rgba(232,232,232,0.10)" stroke="${INK}" stroke-width="2.2"/>`).join("") +
    `<g clip-path="url(#b-gsc)">${r.rect(COL.x + 4, COL.top, COL.w - 8, COL.bot - COL.top, pen({ fill: GOLD, fillStyle: "hachure", hachureGap: 8, fillWeight: 2, stroke: "none" }))}</g>` +
    `<rect id="b-gslice" x="${COL.x + 4}" y="${COL.bot}" width="${COL.w - 8}" height="0" fill="none" stroke="${GOLD}" stroke-width="3.4" rx="3"/></g>` +
    G("b-col", r.rect(COL.x, COL.top, COL.w, COL.bot - COL.top, pen({ strokeWidth: 3.4, roughness: 1 }))) +
    G("b-coltop", dashes(1196, 1484, COL.top, pen({ strokeWidth: 3, roughness: 0.6 }), 16, 11)) +
    G("b-totu", r.line(1206, 248 - 2, 1374, 248 + 2, goldPen({ strokeWidth: 3.6 }))) +
    G("b-shr", [0, 1, 2].map((i) => arrow(1206, 262 + i * 40, 1206, 292 + i * 40, { strokeWidth: 2.6 }, 10)).join(""));
  const eHtml =
    C("b-energy", 520, 140, 300, 48, "energy grows") +
    C("b-total", 1290, 212, 190, 48, "total = 1") +
    C("b-pct", 1448, 212, 140, 48, "(100%)", `color:${GOLD}`) +
    lbl("b-prl", 1060, 0, 170, 44, "prize", `text-align:right;color:${GOLD}`) +
    lbl("b-oth", 1018, 270 - 34, 170, 44, "others", "text-align:right");

  // ===================== Scene F: not all at once (line 16) =====================
  const FX = [690, 870, 1050, 1230];
  const fSvg =
    G("b-frow", FX.map((x) => crate(x, 314, 430, 130, { sw: 2.8, ribbon: false, lid: false })).join("")) +
    FX.map((x, i) => `<g id="b-flid${i}">${r.rect(x - 73, 314, 146, 22, pen({ strokeWidth: 2.8, roughness: 1, fill: GROUND, fillStyle: "solid" }))}</g>`).join("") +
    G("b-fx", r.line(590, 270, 1340, 470, pen({ strokeWidth: 6 })) + r.line(1340, 270, 590, 470, pen({ strokeWidth: 6 }))) +
    G("b-fbase", r.line(600, 700, 1320, 700, pen({ strokeWidth: 3.2 }))) +
    FX.map((x, i) => vbar(`b-fb${i}`, x - 50, 100, 380, 700, 8)).join("") +
    G("b-feye", eye(1230, 320, 120), ` style="color:${INK}"`) +
    G("b-ftick", r.linear([[1316, 316], [1334, 340], [1372, 286]], goldPen({ strokeWidth: 5.4, roughness: 0.8 })));
  const fHtml = C("b-notthis", 1480, 370, 200, 48, "not this") +
    ["00", "01", "10", "11"].map((s, i) => C(`b-fn${i}`, FX[i], 746, 80, 44, s)).join("");

  // ===================== Scene G: closing card (line 17) =====================
  const GW0 = 250, GW1 = 370;
  const loopD = "M1172 182 Q830 62 488 182";
  const gSvg =
    G("b-gwires", r.line(235, GW0, 1376, GW0, pen({ strokeWidth: 3.2 })) + r.line(235, GW1, 1376, GW1, pen({ strokeWidth: 3.2 }))) +
    G("b-gH", solidBox(292, GW0 - 38, 76, 76) + solidBox(292, GW1 - 38, 76, 76)) +
    G("b-gO", solidBox(480, 196, 260, 228)) +
    G("b-gD", solidBox(900, 196, 280, 228) + r.line(1040, 300, 1040, 400, pen({ strokeWidth: 2.4, strokeLineDash: [6, 8] })) +
      curveArrow([[1000, 330], [1040, 308], [1080, 330]], { strokeWidth: 2.6 }, 11) + curveArrow([[1080, 372], [1040, 394], [1000, 372]], { strokeWidth: 2.6 }, 11)) +
    G("b-gM", eye(1440, 310, 124)) +
    `<g id="b-gm">${r.line(574, 350, 646, 348, goldPen({ strokeWidth: 8, roughness: 0.7 }))}</g>` +
    G("b-gloop", r.path(loopD, goldPen({ strokeWidth: 4 })) + r.line(488, 182, 492, 160, goldPen({ strokeWidth: 3.4 })) + r.line(488, 182, 510, 172, goldPen({ strokeWidth: 3.4 }))) +
    `<path id="b-gloopP" d="${loopD}" fill="none" stroke="none"/>` +
    `<circle id="b-gdot" r="9" fill="${GOLD}" style="opacity:0"/>` +
    G("b-gund", r.curve([[540, 712], [800, 704], [1100, 714], [1380, 704]], goldPen({ strokeWidth: 4.6, roughness: 1 })));
  const gHtml =
    C("b-gk0", 185, GW0, 90, 52, "|0⟩") + C("b-gk1", 185, GW1, 90, 52, "|0⟩") +
    C("b-gHl0", 330, GW0, 70, 52, "H") + C("b-gHl1", 330, GW1, 70, 52, "H") +
    C("b-gOl", 610, 250, 240, 52, "oracle") +
    C("b-gDl", 1040, 250, 260, 52, "diffuser") +
    C("b-gOs", 610, 474, 280, 44, "flip the sign") +
    C("b-gDs", 1040, 474, 460, 44, "reflect around the average") +
    C("b-grep", 830, 92, 200, 48, "repeat", `color:${GOLD}`) +
    C("b-gform", 960, 640, 1000, 110, "rounds ≈ (π/4)√N");

  // ===================== HTML =====================
  const html = `
    ${full("b-sa", aSvg, aHtml)}
    ${lbl("b-head", 192, 110, 600, 64, "Grover search", "text-align:left")}
    ${full("b-sb", bSvg)}
    ${full("b-sc", circSvg + chartSvg, circHtml + chartHtml)}
    ${full("b-sw2wrap", swing2Svg)}
    ${full("b-sd", dSvg, dHtml)}
    ${full("b-se", eSvg, eHtml)}
    ${full("b-sf", fSvg, fHtml)}
    ${full("b-sg", gSvg, gHtml)}
  `;

  // ===================== Timeline =====================
  const script = `
    const T = ${JSON.stringify(T)};
    const INK = "${INK}", GOLD = "${GOLD}";
    const B = ${B}, U = ${U}, CX = ${JSON.stringify(CX)}, BW = ${BW};
    const B16 = ${B16}, U16 = ${U16}, X16 = ${JSON.stringify(X16)}, W16 = ${W16}, PZ = ${PZ};
    const COL = ${JSON.stringify(COL)}, FX = ${JSON.stringify(FX)};
    const f1 = (v) => v.toFixed(1);
    const S = (segs, t, init) => sched(segs, t, init);
    const DEG = Math.PI / 180;
    // A bar from the baseline to amplitude a: clip rect, outline and colour.
    function setBar(id, x, w, base, unit, a, g, op) {
      const top = base - unit * a, y0 = Math.min(top, base), h = Math.abs(base - top);
      const cr = $(id + "-cr"); cr.setAttribute("y", f1(y0)); cr.setAttribute("height", f1(h));
      const o = $(id + "-o");
      o.setAttribute("d", h < 1 ? "" : "M" + f1(x) + " " + base + " L" + f1(x + 0.6) + " " + f1(top) + " L" + f1(x + w - 0.6) + " " + f1(top + 0.8) + " L" + f1(x + w) + " " + base);
      o.setAttribute("stroke", g > 0.5 ? GOLD : INK);
      $(id + "-fg").style.opacity = String(g); $(id + "-fi").style.opacity = String(1 - g);
      if (op != null) $(id).style.opacity = String(op);
    }
    // Arc of radius rad about (px, py) from -A to +A degrees around straight down.
    function arcD(px, py, rad, A) {
      if (A < 0.5) return "";
      let d = "";
      for (let i = 0; i <= 40; i++) { const a = (-A + (2 * A * i) / 40) * DEG; d += (i ? " L" : "M") + f1(px + rad * Math.sin(a)) + " " + f1(py + rad * Math.cos(a)); }
      return d;
    }
    // ----- Grover with sixteen boxes: prize and other amplitudes after k rounds -----
    const TH = Math.asin(0.25);
    const ampP = (k) => Math.sin((2 * k + 1) * TH), ampO = (k) => Math.cos((2 * k + 1) * TH) / Math.sqrt(15);
    const RT = [T.push12, T.r2, T.sweet, T.push13, T.swings13];
    const kOf = (t) => { let k = 0; for (let i = 0; i < 5; i++) if (t >= RT[i]) k = i + 1; return k; };
    const kCont = (t) => S(RT.map((r0, i) => [r0, r0 + 0.7, i, i + 1]), t, 0);
    const lerpAmp = (f, kc) => { const k0 = Math.floor(kc), u = kc - k0; return k0 >= 5 ? f(5) : f(k0) + (f(k0 + 1) - f(k0)) * u; };

    onFrame((t) => {
      // ===== Line 2: the swing, pushed twice =====
      const A1 = S([[T.push, T.push + 0.5, 0, 14], [T.higher, T.higher + 0.6, 14, 28]], t, 0);
      const ang1 = t < T.push ? 0 : A1 * Math.sin((2 * Math.PI * (t - T.push)) / 1.6);
      $("b-sw-rot").setAttribute("transform", "rotate(" + ang1.toFixed(2) + " 960 210)");
      $("b-swarc").setAttribute("d", t < T.higher ? "" : arcD(960, 210, 470, S([[T.higher, T.higher + 0.6, 14, 28]], t, 14)));

      // ===== Chart (lines 3 to 11) =====
      const a0 = S([[T.amp3 + 0.1, T.amp3 + 0.9, 0, 0.5], [T.land, T.land + 0.9, 0.5, 0]], t, 0);
      const a12 = S([[T.spreads, T.spreads + 0.9, 0, 0.5], [T.land, T.land + 0.9, 0.5, 0]], t, 0);
      let a3 = S([[T.spreads, T.spreads + 0.9, 0, 0.5], [T.prize6, T.prize6 + 0.9, 0.5, -0.5]], t, 0);
      if (t > T.flung) a3 = S([[T.flung, T.flung + 0.75, -0.5, 1.06], [T.flung + 0.75, T.flung + 1.05, 1.06, 1]], t, -0.5);
      const g3 = S([[T.prize6, T.prize6 + 0.3, 0, 1], [T.diffuser, T.diffuser + 0.3, 1, 0], [T.prize9, T.prize9 + 0.3, 0, 1]], t, 0);
      const dimO = 1 - 0.35 * S([[T.diffuser, T.diffuser + 0.3, 0, 1], [T.three9, T.three9 + 0.3, 1, 0]], t, 0);
      const dim3 = 1 - 0.5 * S([[T.three9, T.three9 + 0.3, 0, 1], [T.prize9, T.prize9 + 0.3, 1, 0]], t, 0);
      setBar("b-bar0", CX[0] - BW / 2, BW, B, U, a0, 0, dimO);
      setBar("b-bar1", CX[1] - BW / 2, BW, B, U, a12, 0, dimO);
      setBar("b-bar2", CX[2] - BW / 2, BW, B, U, a12, 0, dimO);
      setBar("b-bar3", CX[3] - BW / 2, BW, B, U, a3, g3, dim3);

      // ===== Sixteen boxes (lines 12 and 13) =====
      const kc = kCont(t), aP = lerpAmp(ampP, kc), aO = lerpAmp(ampO, kc);
      for (let i = 0; i < 16; i++) setBar("b-s" + i, X16[i] - W16 / 2, W16, B16, U16, i === PZ ? aP : aO, i === PZ ? 1 : 0);
      const pc = $("b-pc"); pc.textContent = Math.round(aP * aP * 100) + "%";
      pc.style.top = f1(B16 - U16 * aP - 32 - 44 * 0.76) + "px";
      $("b-round").textContent = "round " + Math.max(1, kOf(t));

      // ===== Swing again: tracks the prize's chance, then gains energy =====
      let px = 460, py = 200, sc = 0.6;
      const mv = S([[T.but, T.but + 0.9, 0, 1]], t, 0);
      px += (550 - 460) * mv; py += (232 - 200) * mv; sc += (0.8 - 0.6) * mv;
      $("b-sw2pos").setAttribute("transform", "translate(" + f1(px) + " " + f1(py) + ") scale(" + sc.toFixed(3) + ") translate(-960 -210)");
      const A2 = t < T.but ? 45 * aP * aP : S([[T.but, T.but + 1.0, 45 * aP * aP, 20], [T.energy, T.energy + 2.6, 20, 40]], t, 20);
      const ang2 = A2 * Math.sin((2 * Math.PI * (t - T.l12)) / 1.7);
      $("b-sw2-rot").setAttribute("transform", "rotate(" + ang2.toFixed(2) + " 960 210)");
      const arcA = S([[T.energy, T.energy + 2.6, 20, 40]], t, 20);
      $("b-sw2arc").setAttribute("d", t < T.but + 0.9 ? "" : arcD(px, py, 470 * sc, arcA));

      // ===== The total column (lines 14 and 15) =====
      const p = S([[T.grows15, T.grows15 + 1.4, 1 / 16, 0.96]], t, 1 / 16);
      const H = COL.bot - COL.top, hg = H * p, hs = (H - hg) / 15;
      $("b-gscr").setAttribute("y", f1(COL.bot - hg)); $("b-gscr").setAttribute("height", f1(hg));
      $("b-gslice").setAttribute("y", f1(COL.bot - hg + 2)); $("b-gslice").setAttribute("height", f1(Math.max(0, hg - 4)));
      for (let i = 0; i < 15; i++) {
        const y = COL.bot - hg - (i + 1) * hs;
        const sl = $("b-sl" + i); sl.setAttribute("y", f1(y + Math.min(2, hs * 0.2))); sl.setAttribute("height", f1(Math.max(0.5, hs - Math.min(4, hs * 0.4))));
      }
      $("b-prl").style.top = f1(COL.bot - hg / 2 - 34) + "px";

      // ===== Line 16: lids pop, then the bars reshape =====
      const lid = S([[T.opens, T.opens + 0.35, 0, -118]], t, 0);
      FX.forEach((x, i) => $("b-flid" + i).setAttribute("transform", "rotate(" + lid.toFixed(1) + " " + (x - 73) + " 336)"));
      const rs = S([[T.reshapes + 0.2, T.reshapes + 1.4, 0, 1]], t, 0);
      for (let i = 0; i < 4; i++) setBar("b-fb" + i, FX[i] - 50, 100, 700, 300, i < 3 ? 0.5 - 0.5 * rs : 0.5 + 0.5 * rs, i === 3 ? rs : 0);

      // ===== Line 17: a gold dot keeps going round the loop =====
      const lp = $("b-gloopP"), L = lp.getTotalLength(), t0 = T.repeat17 + 0.8;
      if (t >= t0) {
        const u = ((t - t0) / 2.4) % 1, pt = lp.getPointAtLength(L * u);
        const gd = $("b-gdot"); gd.setAttribute("cx", f1(pt.x)); gd.setAttribute("cy", f1(pt.y));
        gd.style.opacity = String(Math.min(1, (t - t0) / 0.3) * Math.min(1, Math.sin(Math.PI * u) * 4));
      } else $("b-gdot").style.opacity = "0";
    });

    // ===== Line 0: four boxes, one prize, one look =====
    [0, 1, 2, 3].forEach((i) => draw("#b-box" + i, T.boxes + i * 0.25, 0.8));
    write("#b-prize", T.prize0, 0.45);
    blurOut("#b-title", T.titleOut);
    draw("#b-eye0", T.look0, 0.5);
    draw("#b-eyear", T.look0 + 0.35, 0.3);
    write("#b-look1", T.look0 + 0.25, 0.4);

    // ===== Line 1: the helper marks the prize =====
    draw("#b-helper", T.helper, 1.0);
    blurOut(["#b-eye0", "#b-eyear", "#b-look1"], T.wont - 0.2);
    draw("#b-bubble", T.wont, 0.4);
    write("#b-shh", T.wont + 0.2, 0.3);
    fade("#b-prize", 0, T.mark - 0.3, 0.3);
    draw("#b-pencil", T.mark - 0.3, 0.35);
    draw("#b-tick0", T.mark + 0.05, 0.3);
    tl.to("#b-tick0", { scale: 1.25, svgOrigin: "1434 528", duration: 0.18, yoyo: true, repeat: 1 }, T.mark + 0.4);
    tl.to("#b-tick0", { scale: 1.25, svgOrigin: "1434 528", duration: 0.18, yoyo: true, repeat: 1 }, T.grover + 0.5);
    blurOut("#b-sa", T.pushing - 0.25);

    // ===== Line 2: Grover search is like pushing a swing =====
    write("#b-head", T.grover, 0.8);
    draw("#b-sw-frame", T.pushing, 0.8);
    draw("#b-sw-seat", T.pushing + 0.4, 0.6);
    hide("#b-hand");
    fade("#b-hand", 1, T.push - 0.35, 0.12);
    move("#b-hand", { x: -30 }, { x: 0 }, T.push - 0.35, 0.3, "power2.out");
    fade("#b-hand", 0, T.push + 0.05, 0.15);
    tl.to("#b-hand", { opacity: 1, x: -30, duration: 0.01 }, T.higher - 0.25);
    tl.to("#b-hand", { x: 0, duration: 0.3, ease: "power2.out" }, T.higher - 0.24);
    fade("#b-hand", 0, T.higher + 0.2, 0.2);
    blurOut(["#b-head", "#b-sb"], T.l3 + 0.2);

    // ===== Line 3: amplitude, a number whose square is the chance =====
    draw("#b-minis", T.box3, 0.7);
    draw("#b-lid3", T.box3 + 0.5, 0.2);
    draw("#b-base", T.amp3, 0.6);
    write("#b-amph", T.amp3 + 0.1, 0.5);
    write("#b-v0", T.amp3 + 0.8, 0.2);
    draw("#b-sq", T.square, 0.5);
    write("#b-sql", T.square + 0.2, 0.55);
    draw("#b-sqar", T.chance3 - 0.1, 0.35);
    write("#b-ch0", T.chance3 + 0.2, 0.3);
    write("#b-chh", T.chance3, 0.4);
    blurOut(["#b-sq", "#b-sql", "#b-sqar"], T.qubits);

    // ===== Line 4: two qubits name the boxes; H spreads them evenly =====
    draw("#b-wires", T.qubits, 0.8);
    write(["#b-k0", "#b-k1"], T.qubits + 0.1, 0.3);
    write("#b-qnote", T.quantum, 0.7);
    [0, 1, 2, 3].forEach((i) => write("#b-n" + i, T.name + i * 0.2, 0.18));
    draw("#b-cH", T.gate, 0.4);
    tl.set("#b-cH", { color: GOLD }, T.gate);
    write(["#b-hL0", "#b-hL1"], T.gate + 0.15, 0.15);
    tl.set(["#b-hL0", "#b-hL1"], { color: GOLD }, T.gate);
    fade("#b-qnote", 0, T.l5, 0.3);

    // ===== Line 5: every box gets one half: one in four =====
    [1, 2, 3].forEach((i) => write("#b-v" + i, T.amp5 + (i - 1) * 0.18, 0.2));
    tl.to("#b-v0", { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 }, T.amp5 + 0.1);
    [1, 2, 3].forEach((i) => write("#b-ch" + i, T.four5 + (i - 1) * 0.15, 0.25));
    tl.to(["#b-cH", "#b-hL0", "#b-hL1"], { color: INK, duration: 0.3 }, T.four5);

    // ===== Line 6: the oracle flips the prize's sign =====
    draw("#b-cO", T.oracle, 0.5);
    tl.set("#b-cO", { color: GOLD }, T.oracle);
    write("#b-oL", T.oracle + 0.3, 0.35);
    tl.set("#b-oL", { color: GOLD }, T.oracle);
    draw("#b-cOh", T.oracle + 0.45, 0.35);
    write("#b-sgn", T.sign6, 0.4);
    fade("#b-v3", 0, T.prize6, 0.2);
    tl.to("#b-ch3", { color: GOLD, duration: 0.2 }, T.prize6);
    write("#b-vm", T.minus6, 0.35);

    // ===== Line 7: squared, still a quarter; same odds =====
    write("#b-sqd", T.squared, 0.6);
    tl.to(["#b-cO", "#b-oL"], { color: INK, duration: 0.3 }, T.l7 - 0.2);
    tl.to(["#b-ch0", "#b-ch1", "#b-ch2", "#b-ch3"], { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1 }, T.odds);
    write("#b-same", T.changed, 0.5);
    blurOut(["#b-sqd", "#b-sgn", "#b-same"], T.next);
    tl.to("#b-ch3", { color: INK, duration: 0.3 }, T.next);

    // ===== Line 8: the diffuser reflects about the average =====
    draw("#b-cD", T.diffuser, 0.5);
    tl.set("#b-cD", { color: GOLD }, T.diffuser);
    write("#b-dL", T.diffuser + 0.3, 0.4);
    tl.set("#b-dL", { color: GOLD }, T.diffuser);
    tl.to("#b-vm", { color: INK, duration: 0.3 }, T.diffuser);
    draw("#b-mirror", T.reflects, 0.6);
    draw("#b-avg", T.average, 0.8);
    write("#b-avgl", T.average + 0.6, 0.45);
    tl.to(["#b-cD", "#b-dL"], { color: INK, duration: 0.3 }, T.average + 0.2);
    write("#b-sum", T.quarter8 - 0.3, 0.9);
    fade(["#b-sum", "#b-mirror"], 0, T.three9 - 0.15, 0.3);

    // ===== Line 9: the other three land at zero =====
    draw(["#b-up0", "#b-up1", "#b-up2"], T.above9, 0.4);
    write("#b-q9a", T.above9 + 0.25, 0.2);
    hide(["#b-gh0", "#b-gh1", "#b-gh2"]);
    show(["#b-gh0", "#b-gh1", "#b-gh2"], T.land);
    fade(["#b-gh0", "#b-gh1", "#b-gh2"], 0, T.land + 1.4, 0.4);
    fade(["#b-v0", "#b-v1", "#b-v2"], 0, T.land, 0.25);
    draw(["#b-dn0", "#b-dn1", "#b-dn2"], T.land + 0.45, 0.4);
    write("#b-q9b", T.land + 0.7, 0.2);
    write(["#b-z0", "#b-z1", "#b-z2"], T.land + 0.8, 0.2);
    fade(["#b-ch0", "#b-ch1", "#b-ch2"], 0, T.zero9 - 0.1, 0.2);
    write(["#b-c00", "#b-c01", "#b-c02"], T.zero9 + 0.05, 0.3);
    fade(["#b-up0", "#b-up1", "#b-up2", "#b-dn0", "#b-dn1", "#b-dn2", "#b-q9a", "#b-q9b"], 0, T.prize9 - 0.1, 0.3);

    // ===== Line 10: the prize is flung to one =====
    tl.to("#b-vm", { color: GOLD, duration: 0.3 }, T.prize9);
    draw("#b-brk0", T.prize9, 0.5);
    write("#b-q10a", T.prize9 + 0.4, 0.2);
    fade(["#b-brk0", "#b-q10a"], 0, T.flung, 0.25);
    fade("#b-vm", 0, T.flung, 0.25);
    draw("#b-brk1", T.flung + 0.5, 0.5);
    write("#b-q10b", T.flung + 0.8, 0.2);
    write("#b-vone", T.flung + 0.8, 0.25);
    fade("#b-ch3", 0, T.one10 - 0.1, 0.2);
    write("#b-c100", T.one10, 0.35);
    fade(["#b-brk1", "#b-q10b"], 0, T.intf - 0.1, 0.3);

    // ===== Line 11: interference =====
    write("#b-intf", T.intf, 0.8);
    hide("#b-plus");
    fade("#b-plus", 1, T.combine, 0.2);
    tl.to("#b-plus", { scale: 1.4, duration: 0.2, yoyo: true, repeat: 1 }, T.combine);
    fade("#b-plus", 0, T.combine + 1.1, 0.3);
    draw("#b-grow", T.grows11, 0.4);
    draw(["#b-zc0", "#b-zc1", "#b-zc2"], T.cancel11, 0.45);
    draw("#b-cM", T.look11, 0.4);
    tl.to("#b-cM", { color: GOLD, duration: 0.25 }, T.look11 + 0.3);
    tl.to("#b-lid3", { rotation: 70, svgOrigin: "${CX[3] + 54} 726", duration: 0.35, ease: "power2.out" }, T.finds);
    tl.fromTo("#b-star", { opacity: 0, scale: 0.2, y: 40, svgOrigin: "${CX[3]} 628" }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, T.finds + 0.15);
    tl.to("#b-star", { rotation: 18, svgOrigin: "${CX[3]} 628", duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.finds + 0.7);
    blurOut(["#b-sc"], T.l12);

    // ===== Line 12: sixteen boxes, one push per round =====
    draw("#b-sw2-frame", T.l12 + 0.1, 0.8);
    draw("#b-sw2-seat", T.l12 + 0.5, 0.6);
    hide("#b-s0, #b-s1, #b-s2, #b-s3, #b-s4, #b-s5, #b-s6, #b-s7, #b-s8, #b-s9, #b-s10, #b-s11, #b-s12, #b-s13, #b-s14, #b-s15");
    draw("#b-base16", T.sixteen, 0.5);
    X16.forEach((x, i) => fade("#b-s" + i, 1, T.sixteen + 0.2 + i * 0.03, 0.2));
    write("#b-16", T.sixteen + 0.1, 0.5);
    draw("#b-loop", T.repeat12, 0.5);
    write("#b-loopl", T.repeat12 + 0.2, 0.8);
    hide("#b-pc");
    fade("#b-pc", 1, T.sixteen + 0.7, 0.3);
    write("#b-round", T.push12, 0.4);

    // ===== Line 13: the sweet spot, then it swings back =====
    draw("#b-sweetar", T.sweet + 0.3, 0.3);
    write("#b-sweet", T.sweet + 0.2, 0.45);
    draw("#b-sweetmk", T.sweet + 0.75, 0.25);
    write("#b-form13", T.pi13, 1.2);
    write("#b-n16", T.three13 - 0.1, 0.6);
    blurOut(["#b-sd"], T.but);

    // ===== Line 14: a real swing gains energy; this never does =====
    write("#b-energy", T.energy, 0.6);
    draw("#b-energyar", T.energy + 0.4, 0.3);
    draw("#b-col", T.never14, 0.6);
    draw("#b-coltop", T.never14 + 0.2, 0.4);
    hide(["#b-slices", "#b-prl"]);
    fade(["#b-slices", "#b-prl"], 1, T.never14 + 0.5, 0.35);
    write("#b-total", T.never14 + 0.4, 0.5);
    tl.to("#b-total", { color: GOLD, duration: 0.3 }, T.always);
    draw("#b-totu", T.always + 0.1, 0.35);
    write("#b-pct", T.one14, 0.45);
    tl.to("#b-energy", { opacity: 0.45, duration: 0.3 }, T.always);
    tl.to("#b-energyar", { opacity: 0.45, duration: 0.3 }, T.always);

    // ===== Line 15: the prize grows only because the others shrink =====
    draw("#b-shr", T.shrinks, 0.4);
    write("#b-oth", T.shrinks + 0.1, 0.35);
    blurOut(["#b-se", "#b-sw2wrap"], T.out15);

    // ===== Line 16: it never opens every box at once =====
    draw("#b-frow", T.out15 + 0.05, 0.4);
    draw(["#b-flid0", "#b-flid1", "#b-flid2", "#b-flid3"], T.out15 + 0.3, 0.2);
    draw("#b-fx", T.once, 0.4);
    write("#b-notthis", T.once + 0.25, 0.4);
    blurOut(["#b-frow", "#b-flid0", "#b-flid1", "#b-flid2", "#b-flid3", "#b-fx", "#b-notthis"], T.reshapes);
    hide(["#b-fb0", "#b-fb1", "#b-fb2", "#b-fb3"]);
    draw("#b-fbase", T.reshapes, 0.35);
    fade(["#b-fb0", "#b-fb1", "#b-fb2", "#b-fb3"], 1, T.reshapes + 0.05, 0.2);
    write(["#b-fn0", "#b-fn1", "#b-fn2", "#b-fn3"], T.reshapes + 0.1, 0.3);
    draw("#b-feye", T.look16, 0.4);
    draw("#b-ftick", T.likely, 0.3);
    blurOut("#b-sf", T.so);

    // ===== Line 17: closing card =====
    draw("#b-gwires", T.so + 0.05, 0.6);
    write(["#b-gk0", "#b-gk1"], T.so + 0.05, 0.3);
    draw("#b-gH", T.so + 0.15, 0.4);
    write(["#b-gHl0", "#b-gHl1"], T.so + 0.4, 0.15);
    draw("#b-gO", T.mark17, 0.5);
    write("#b-gOl", T.mark17 + 0.3, 0.35);
    write("#b-gOs", T.mark17 + 0.5, 0.6);
    tl.fromTo("#b-gm", { scale: 0.2, opacity: 0, svgOrigin: "610 349" }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.5)" }, T.sign17);
    draw("#b-gD", T.reflect17, 0.6);
    write("#b-gDl", T.reflect17 + 0.3, 0.35);
    write("#b-gDs", T.reflect17 + 0.5, 0.9);
    draw("#b-gM", T.reflect17 + 1.0, 0.4);
    draw("#b-gloop", T.repeat17, 0.6);
    write("#b-grep", T.repeat17 + 0.2, 0.35);
    write("#b-gform", T.pi17, 1.2);
    draw("#b-gund", T.pi17 + 1.3, 0.5);
  `;

  return { html, script };
}
