// Lesson 8, "Interference". Noise-cancelling headphones first (a wave and its mirror image cancel,
// waves in step grow), then the same idea with amplitudes: a qubit split by H into two paths,
// each carrying an arrow, recombined by a second H where the arrows add. See plan.md.
export const phrases = [
  ["noise cancelling", "noise-cancelling"],
  ["H then H", "H → H"],
  ["H, Z, H", "H Z H"],
];

const PI = Math.PI;

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, INK, GOLD, GROUND } = k;
  const DIMINK = "rgba(232,232,232,0.5)";
  // Label centred on (cx, cy): Caveat at line-height 1.25 plus padding sits about 0.75em above its middle.
  const C = (id, cx, cy, w, size, html, extra = "") => lbl(id, cx - w / 2, cy - size * 0.76, w, size, html, extra);
  // Strokes that follow the group's CSS colour, so a whole sketch can turn gold.
  const cc = (svg) => svg.replaceAll(`stroke="${INK}"`, 'stroke="currentColor"');
  const G = (id, inner, extra = "") => `<g id="${id}"${extra}>${inner}</g>`;
  const box = (x, y, w, h, o = {}) => r.rect(x, y, w, h, pen({ strokeWidth: 3.2, roughness: 1, fill: GROUND, fillStyle: "solid", ...o }));
  const MINUS = "−";

  // ---------- Times, cued to the voice ----------
  const T = {
    qubit0: cue(0, "qubit", 0, -0.25), one0: cue(0, "one", 0, -0.05), time0: cue(0, "time"), xgate: cue(0, "without", 0, 0.4), titleOut: 3.45,
    intf: cue(1, "interference", 0, -0.1), phones: cue(1, "noise", 0, -0.05), hookOut: cue(1, "headphones", 0, -0.4),
    l2: cue(2), noise: cue(2, "noise", 0, -0.1), mirror: cue(2, "mirror", 0, -0.15),
    rises: cue(3, "rises", 0, -0.1), dips: cue(3, "dips", 0, -0.1), cancel3: cue(3, "cancel", 0, -0.1), gone: cue(3, "disappears", 0, -0.05),
    l4: cue(4), together: cue(4, "together", 0, -0.1), louder: cue(4, "louder", 0, -0.1),
    l5: cue(5, "qubit", 0, -0.3), zero5: cue(5, "zero", 0, -0.1), h1: cue(5, "an", 0, -0.1), paths: cue(5, "paths", 0, -0.15), p0: cue(5, "zero", 1, -0.1), p1: cue(5, "and", 0, 0.2),
    l6: cue(6), amp: cue(6, "amplitude", 0, -0.1), chance: cue(6, "chance", 0, -0.1), neg: cue(6, "negative", 0, -0.1), drawn: cue(6, "drawn", 0, -0.1),
    l7: cue(7), second: cue(7, "second", 0, -0.1), together7: cue(7, "together", 0, -0.1), result: cue(7, "result", 0, -0.1), FA: cue(7, "arrows", 0, -0.15),
    zero8: cue(8, "zero", 0, -0.1), growA: cue(8, "grow", 0, -0.1), flipA: cue(8, "path", 0, -0.3), canA: cue(8, "cancel", 0, -0.05),
    l9: cue(9), endA: cue(10, "add", 0, -0.1), half: cue(10, "half", 0, -0.1), flipZ: cue(10, "flipping", 0, -0.1), sign: cue(10, "its", 0, -0.05),
    l11: cue(11), hp: cue(11, "headphone", 0, -0.1), FB: cue(11, "now", 0, -0.2), canB: cue(11, "cancel"), flipB: cue(11, "zero", 0, -0.25), addB: cue(11, "add", 0, -0.1),
    l12: cue(12), one12: cue(12, "one", 0, -0.1), no12: cue(12, "no", 0, -0.1),
    l13: cue(13), quarter: cue(13, "quarter", 0, -0.1), FC: cue(13, "instead", 0, 0.05), halfway: cue(13, "halfway", 0, -0.05), at13: cue(13, "at", 0, -0.1),
    dgOut: cue(14, "unlike", 0, -0.3), ph14: cue(14, "headphones", 0, -0.2), nothing: cue(14, "nothing", 0, -0.1), lost: cue(14, "lost", 0, -0.1), van: cue(14, "vanishes", 0, -0.1), reapp: cue(14, "reappears", 0, -0.1),
    l15: cue(15), part: cue(15, "particles", 0, -0.2), coll: cue(15, "colliding", 0, -0.1), amps: cue(15, "amplitudes", 0, -0.2), adding: cue(15, "adding", 0, -0.2), zero15: cue(15, "zero", 0, -0.1),
    l16: cue(16), alone: cue(16, "alone", 0, -0.1), could: cue(16, "could", 0, -0.1), cancel16: cue(16, "cancel", 0, -0.1), because: cue(16, "because", 0, -0.1), chance16: cue(16, "chance", 0, -0.1), neg16: cue(16, "negative", 0, -0.1),
    l17: cue(17), algo: cue(17, "algorithm", 0, -0.2), pattern: cue(17, "pattern", 0, -0.1), cancs: cue(17, "cancellations", 0, 0.1),
    l18: cue(18), remember: cue(18, "remember", 0, -0.2), ampl18: cue(18, "amplitudes", 0, -0.05), instep: cue(18, "in", 0, -0.15), outstep: cue(18, "out", 0, -0.15),
  };

  // ---------- Headphones: 400x400 local box, centre (200, 215) ----------
  function phones(p) {
    const band = r.arc(200, 215, 300, 300, PI, 2 * PI, false, pen({ strokeWidth: 5.2 })) + r.arc(200, 215, 266, 262, PI + 0.14, 2 * PI - 0.14, false, pen({ strokeWidth: 2.2 }));
    const cup = (x, px) =>
      r.ellipse(x, 268, 76, 142, pen({ strokeWidth: 3.8 })) +
      r.ellipse(px, 268, 30, 112, pen({ strokeWidth: 2.4, fill: INK, fillStyle: "hachure", hachureGap: 7, fillWeight: 1.6 })) +
      r.line(x - 4, 200, x + 2, 186, pen({ strokeWidth: 3 }));
    const snd = [72, 98].map((rad) => r.arc(70, 268, 2 * rad, 2 * rad, PI * 0.84, PI * 1.16, false, pen({ strokeWidth: 3 })) + r.arc(330, 268, 2 * rad, 2 * rad, -PI * 0.16, PI * 0.16, false, pen({ strokeWidth: 3 }))).join("");
    return cc(G(`${p}-main`, band + cup(70, 98) + cup(330, 302)) + G(`${p}-snd`, snd));
  }

  // ---------- Odds bars: clip rect sets the height; an ink and a gold hachure fill ----------
  function bar(id, x, base, w, H) {
    const fill = (c) => r.rect(x + 3, base - H, w - 6, H, pen({ fill: c, fillStyle: "hachure", hachureGap: 9, fillWeight: 2, stroke: "none", roughness: 1.1 }));
    return `<defs><clipPath id="${id}-c"><rect id="${id}-cr" x="${x - 4}" y="${base}" width="${w + 8}" height="0"/></clipPath></defs>` +
      G(`${id}-frame`, r.rect(x, base - H, w, H, pen({ strokeWidth: 2.2, roughness: 0.9, stroke: DIMINK })) + r.line(x - 16, base, x + w + 16, base, pen({ strokeWidth: 3 }))) +
      `<g id="${id}-fill"><g clip-path="url(#${id}-c)"><g id="${id}-fi">${fill(INK)}</g><g id="${id}-fg">${fill(GOLD)}</g></g>` +
      `<line id="${id}-top" x1="${x}" x2="${x + w}" y1="${base}" y2="${base}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/></g>`;
  }

  // A rough arrow centred on (0,0), pointing up, for groups moved and turned by onFrame.
  const upArrow = (len, sw, head) => cc(arrow(0, len / 2, 0, -len / 2, { strokeWidth: sw }, head));

  // ---------- Circuit row ----------
  function circuit(p, y, wire0, wire1, gates, s, ls, extraSeg = []) {
    const xs = gates.map((g) => g[0]);
    const cuts = [wire0, ...xs.flatMap((x) => [x - s / 2, x + s / 2]), wire1];
    let w = "";
    for (let i = 0; i < cuts.length; i += 2) w += r.line(cuts[i], y, cuts[i + 1], y, pen({ strokeWidth: 3 }));
    extraSeg.forEach(([a, b]) => { w += r.line(a, y, b, y, pen({ strokeWidth: 3 })); });
    const svg = G(`${p}-wire`, w) + G(`${p}-boxes`, gates.map(([x]) => r.rect(x - s / 2, y - s / 2, s, s, pen({ strokeWidth: 3.2, roughness: 1 }))).join(""));
    const html = gates.map(([x, L], i) => C(`${p}-g${i}`, x, y, s, ls, L)).join("");
    return { svg, html };
  }

  // ===================== Geometry =====================
  // Path diagram (lines 5 to 13), all inside #b-dg so it can shrink as one.
  const UP = "M450 450 C492 330 540 300 620 300 L1030 300 C1082 300 1112 338 1130 450";
  const LO = "M450 450 C492 570 540 600 620 600 L1030 600 C1082 600 1112 562 1130 450";
  const AX = 1000; // amplitude arrows ride here on both paths
  const SX = 1480; // arrow-sum stage
  const BX = 1630, BW = 70, BH = 200; // chance bars (base 400 and 700)
  const out0 = r.curve([[1250, 450], [1268, 360], [1284, 314], [1298, 300]], pen({ strokeWidth: 3 }));
  const out1 = r.curve([[1250, 450], [1268, 540], [1284, 586], [1298, 600]], pen({ strokeWidth: 3 }));
  const dgSvg =
    `<path id="b-gU" d="${UP}" fill="none" stroke="none"/><path id="b-gL" d="${LO}" fill="none" stroke="none"/>` +
    G("b-h1", box(330, 400, 120, 100)) +
    G("b-pU", r.path(UP, pen({ strokeWidth: 3 }))) + G("b-pL", r.path(LO, pen({ strokeWidth: 3 }))) +
    G("b-h2", box(1130, 400, 120, 100)) +
    G("b-out", out0 + out1) +
    G("b-zbox", box(730, 550, 100, 100)) +
    `<path id="b-hw" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` +
    G("b-sk", cc(arrow(1350, 196, 1350, 116, { strokeWidth: 3.4 }, 14) + arrow(1440, 116, 1440, 196, { strokeWidth: 3.4 }, 14)), ` style="color:${INK}"`) +
    bar("b-br0", BX, 400, BW, BH) + bar("b-br1", BX, 700, BW, BH) +
    `<g id="b-dots" fill="${GOLD}"><circle id="b-dt0" r="9"/><circle id="b-dt1" r="9"/><circle id="b-dt2" r="9"/></g>` +
    `<g id="b-amp0" transform="translate(${AX} 300)" style="color:${INK}">${upArrow(110, 5, 22)}</g>` +
    `<g id="b-amp1" transform="translate(${AX} 600)" style="color:${INK}">${upArrow(110, 5, 22)}</g>` +
    ["c00", "c10", "c01", "c11"].map((c) => `<g id="b-${c}" style="opacity:0;color:${INK}">${upArrow(110, 4.6, 20)}</g>`).join("") +
    `<path id="b-R0" fill="none" stroke="${GOLD}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path id="b-R1" fill="none" stroke="${GOLD}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle id="b-z0" cx="${SX}" cy="300" r="10" fill="${INK}" style="opacity:0"/><circle id="b-z1" cx="${SX}" cy="600" r="10" fill="${INK}" style="opacity:0"/>`;
  const dgHtml =
    C("b-ket0", 210, 450, 130, 60, "|0⟩") +
    C("b-h1l", 390, 450, 120, 64, "H", `color:${GOLD}`) +
    C("b-h2l", 1190, 450, 120, 64, "H") +
    C("b-zl", 780, 600, 100, 60, "Z", `color:${GOLD}`) +
    C("b-ql", 780, 600, 100, 60, "¼", `color:${GOLD}`) +
    C("b-pl0", 720, 262, 200, 44, "path 0") +
    C("b-pl1", 600, 652, 170, 44, "path 1") +
    C("b-o0", 1322, 300, 70, 56, "0") + C("b-o1", 1322, 600, 70, 56, "1") +
    C("b-chl", BX + BW / 2, 158, 180, 40, "chance") +
    C("b-pc0", BX + BW / 2, 428, 140, 40, "50%") + C("b-pc1", BX + BW / 2, 728, 140, 40, "50%") +
    C("b-skp", 1384, 136, 50, 44, "+") + C("b-skm", 1476, 176, 50, 44, MINUS) +
    C("b-hwl", 883, 534, 150, 40, "half wave", `color:${GOLD}`) +
    C("b-qwl", 900, 534, 200, 40, "quarter wave", `color:${GOLD}`) +
    C("b-sgl", 1000, 694, 200, 54, `+ → ${MINUS}`) +
    C("b-e0", SX + 62, 300, 90, 44, "= 0", "opacity:0") + C("b-e1", SX + 62, 600, 90, 44, "= 0", "opacity:0");

  // Hook (line 0)
  const CARDX = [950, 1075, 1200, 1325];
  const hookSvg =
    G("b-qd", r.circle(560, 560, 190, pen({ strokeWidth: 3.6 })) + r.circle(560, 560, 160, pen({ strokeWidth: 1.6, roughness: 1.8 }))) +
    G("b-har", arrow(680, 560, 860, 560, { strokeWidth: 3.4 }, 20)) +
    G("b-cards", CARDX.map((x) => r.rect(x - 50, 495, 100, 130, pen({ strokeWidth: 2.8, roughness: 1 }))).join("")) +
    G("b-xb", r.rect(1460, 515, 90, 90, pen({ strokeWidth: 3.2, roughness: 1 }))) +
    G("b-xx", r.line(1438, 492, 1572, 628, pen({ strokeWidth: 5 })) + r.line(1572, 494, 1440, 626, pen({ strokeWidth: 5 })));
  const hookHtml =
    C("b-q0", 560, 560, 160, 64, "|0⟩") + C("b-ql0", 560, 690, 160, 44, "qubit") +
    CARDX.map((x, i) => C(`b-one${i}`, x, 560, 90, 84, "1", `color:${GOLD}`)).join("") +
    C("b-xl", 1505, 560, 90, 60, "X");

  // Waves (lines 2 to 4)
  const wvSvg =
    `<path id="b-wN" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path id="b-wM" fill="none" stroke="${GOLD}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path id="b-wS" fill="none" stroke="${GOLD}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>` +
    G("b-mk0", r.circle(841, 310, 18, pen({ strokeWidth: 2.6, fill: INK, fillStyle: "solid" }))) +
    G("b-mk1", r.circle(841, 670, 18, pen({ strokeWidth: 2.6, fill: INK, fillStyle: "solid" }))) +
    `<g id="b-mkl"><path d="M841 326 L841 654" fill="none" stroke="${INK}" stroke-opacity=".6" stroke-width="3" stroke-dasharray="3 11" stroke-linecap="round"/></g>`;
  const wvHtml =
    lbl("b-nl", 1484, 346, 260, 44, "noise", "text-align:left") +
    lbl("b-ml", 1484, 566, 300, 44, "mirror image", `text-align:left;color:${GOLD}`) +
    C("b-rl", 760, 290, 140, 40, "rises") + C("b-dl", 760, 690, 140, 40, "dips") +
    C("b-sil", 1010, 566, 300, 56, "silence", `color:${GOLD}`) +
    C("b-loud", 1010, 690, 300, 56, "louder", `color:${GOLD}`);

  // Circuit row (line 12)
  const CR = circuit("b-cr", 768, 300, 1010, [[500, "H"], [700, "Z"], [900, "H"]], 84, 56);
  const crSvg = CR.svg + G("b-cra", arrow(1036, 768, 1116, 768, { strokeWidth: 3.4 }, 18)) +
    G("b-crx", r.rect(1520, 728, 80, 80, pen({ strokeWidth: 3, roughness: 1 })) + r.line(1504, 712, 1616, 824, pen({ strokeWidth: 4.4 })) + r.line(1616, 712, 1504, 824, pen({ strokeWidth: 4.4 })));
  const crHtml = CR.html + C("b-crk", 230, 768, 120, 56, "|0⟩") + C("b-crr", 1290, 768, 300, 72, "1 1 1 1", `color:${GOLD}`) + C("b-crxl", 1560, 768, 80, 52, "X");

  // Line 14: headphones lose the sound; the qubit's chance moves
  const s14Svg =
    G("b-s14f", r.line(300, 640, 700, 640, pen({ strokeWidth: 4 }))) +
    `<g id="b-s14d"><path d="M880 210 L880 770" fill="none" stroke="${INK}" stroke-opacity=".3" stroke-width="3" stroke-dasharray="6 14" stroke-linecap="round"/></g>` +
    bar("b-rb0", 1100, 760, 140, 360) + bar("b-rb1", 1400, 760, 140, 360) +
    G("b-arch", r.curve([[1170, 384], [1240, 318], [1320, 296], [1400, 318], [1462, 376]], goldPen({ strokeWidth: 4 })) + r.line(1462, 376, 1440, 368, goldPen({ strokeWidth: 3.6 })) + r.line(1462, 376, 1458, 352, goldPen({ strokeWidth: 3.6 })));
  const s14Html =
    C("b-s14s", 500, 694, 300, 56, "silence") +
    C("b-tot", 1320, 142, 360, 52, "total: 100%") +
    C("b-mv", 1320, 226, 420, 48, "moves, never lost", `color:${GOLD}`) +
    C("b-rl0", 1170, 800, 80, 56, "0") + C("b-rl1", 1470, 800, 80, 56, "1") +
    lbl("b-rp0", 950, 0, 130, 44, "100%", "text-align:right") + lbl("b-rp1", 1550, 0, 130, 44, "0%", "text-align:left");

  // Line 15: not particles; amplitudes adding to zero
  const ball = (cx) => r.circle(cx, 380, 96, pen({ strokeWidth: 3.4, fill: INK, fillStyle: "hachure", hachureGap: 8, fillWeight: 1.6 }));
  const s15Svg =
    `<g id="b-balls"><g id="b-ballA">${ball(0)}${r.line(-80, 360, -130, 360, pen({ strokeWidth: 2.4 }))}${r.line(-74, 400, -116, 400, pen({ strokeWidth: 2.4 }))}</g>` +
    `<g id="b-ballB">${ball(0)}${r.line(80, 360, 130, 360, pen({ strokeWidth: 2.4 }))}${r.line(74, 400, 116, 400, pen({ strokeWidth: 2.4 }))}</g></g>` +
    G("b-bx", r.line(830, 270, 1090, 490, pen({ strokeWidth: 6 })) + r.line(1090, 272, 832, 488, pen({ strokeWidth: 6 }))) +
    `<g id="b-aU" style="color:${INK}">${upArrow(120, 5, 22)}</g><g id="b-aD" style="color:${INK}">${upArrow(120, 5, 22)}</g>` +
    `<circle id="b-a0" cx="960" cy="330" r="11" fill="${GOLD}" style="opacity:0"/>`;
  const s15Html =
    C("b-aUl", 750, 330, 140, 64, "+½") + C("b-aDl", 1170, 330, 140, 64, `${MINUS}½`) +
    C("b-sum", 960, 500, 760, 80, `+½ + ${MINUS}½ = <span style="color:${GOLD}">0</span>`);

  // Line 16: chances on a number line
  const NL = { x0: 500, x1: 1420, y: 700 };
  const s16Svg =
    G("b-nln", r.line(160, NL.y, NL.x1 + 40, NL.y, pen({ strokeWidth: 3.2 })) + [NL.x0, 960, NL.x1].map((x) => r.line(x, NL.y - 12, x, NL.y + 12, pen({ strokeWidth: 3 }))).join("")) +
    G("b-bk0", r.rect(NL.x0 + 4, NL.y - 62, 452, 56, pen({ strokeWidth: 2.8, roughness: 1 }))) +
    G("b-bk1", r.rect(964, NL.y - 62, 452, 56, pen({ strokeWidth: 2.8, roughness: 1 }))) +
    G("b-ngz", r.rect(170, NL.y - 62, 326, 56, pen({ strokeWidth: 2, stroke: DIMINK, fill: DIMINK, fillStyle: "hachure", hachureGap: 12, fillWeight: 1.4 }))) +
    G("b-nbk", r.rect(250, NL.y - 54, 220, 40, pen({ strokeWidth: 2.6, roughness: 1.2, fill: GROUND, fillStyle: "solid" }))) +
    G("b-nbx", r.line(236, NL.y - 74, 484, NL.y + 4, pen({ strokeWidth: 4.4 })) + r.line(484, NL.y - 74, 236, NL.y + 4, pen({ strokeWidth: 4.4 })));
  const s16Html =
    C("b-n0", NL.x0, NL.y + 40, 80, 40, "0") + C("b-n50", 960, NL.y + 40, 120, 40, "50%") + C("b-n100", NL.x1, NL.y + 40, 140, 40, "100%") +
    C("b-bk0l", 730, NL.y - 34, 160, 44, "50%") + C("b-bk1l", 1190, NL.y - 34, 160, 44, "50%") +
    C("b-only", 960, 588, 360, 44, "chances only add") +
    C("b-noch", 333, 588, 330, 44, "no chances here") +
    C("b-nbkl", 360, NL.y - 34, 160, 40, `${MINUS}50%`);

  // Line 17: many paths, a pattern of cancellations
  const SY = [300, 380, 460, 540, 620, 700], WIN = 2;
  const s17Svg =
    G("b-mh", box(296, 450, 92, 100)) +
    G("b-mp", SY.map((y, i) => r.curve([[388, 470 + i * 12], [560, 470 + i * 12], [660, y], [800, y], [1240, y]], pen({ strokeWidth: 2, roughness: 0.9 }))).join("")) +
    G("b-mg", SY.map((y) => box(782, y - 18, 36, 36, { strokeWidth: 2.2 })).join("")) +
    G("b-mbf", SY.map((y) => r.rect(1420, y - 15, 300, 30, pen({ strokeWidth: 2, stroke: DIMINK, roughness: 0.8 }))).join("")) +
    `<defs><clipPath id="b-mwc"><rect id="b-mwcr" x="1418" y="${SY[WIN] - 20}" width="0" height="40"/></clipPath></defs>` +
    `<g clip-path="url(#b-mwc)">${r.rect(1423, SY[WIN] - 12, 294, 24, pen({ fill: GOLD, fillStyle: "hachure", hachureGap: 7, fillWeight: 2, stroke: GOLD, strokeWidth: 3 }))}</g>` +
    SY.map((y, i) => `<g id="b-ma${i}" style="color:${INK}">${upArrow(52, 3.6, 13)}</g><g id="b-mb${i}" style="color:${INK}">${upArrow(52, 3.6, 13)}</g>` +
      `<circle id="b-md${i}" cx="1310" cy="${y}" r="7" fill="${INK}" style="opacity:0"/>`).join("");
  const s17Html = C("b-mhl", 342, 500, 92, 60, "H");

  // Line 18: closing card
  const CL = circuit("b-cl", 236, 500, 1250, [[650, "H"], [850, "Z"], [1050, "H"]], 96, 68);
  const fUnder = r.curve([[4, 14], [260, 8], [520, 15], [760, 8]], goldPen({ strokeWidth: 4.6, roughness: 1 }));
  const s18Svg = CL.svg + G("b-cla", arrow(1272, 236, 1362, 236, { strokeWidth: 3.6 }, 20)) +
    `<path id="b-fa1" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path id="b-fa2" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>` +
    `<path id="b-faS" fill="none" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/>` +
    `<path id="b-fb1" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path id="b-fb2" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>` +
    `<path id="b-fbS" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  const s18Html = CL.html + C("b-clk", 425, 236, 140, 70, "|0⟩") + C("b-cl1", 1410, 236, 80, 76, "1", `color:${GOLD}`) +
    C("b-fal", 580, 682, 480, 56, "in step: grow", `color:${GOLD}`) + C("b-fbl", 1340, 682, 520, 56, "out of step: cancel") +
    C("b-take", 960, 800, 1100, 64, "Amplitudes add like waves.") +
    `<div class="obj" id="b-takeu" style="left:580px;top:846px;width:770px;height:30px"><svg class="sk" width="770" height="30" viewBox="0 0 770 30"><g id="b-takeug">${fUnder}</g></svg></div>`;

  // ===================== HTML =====================
  const full = (id, svg, inner = "") => `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${inner}</div>`;
  const html = `
    ${full("b-hook", hookSvg, hookHtml)}
    ${lbl("b-intf", 560, 116, 800, 72, "interference", `color:${GOLD}`)}
    ${full("b-wv", wvSvg, wvHtml)}
    <div class="obj" id="b-phones" style="left:760px;top:255px;width:400px;height:400px;color:${INK}"><svg class="sk" width="400" height="400" viewBox="0 0 400 400">${phones("b-ph")}</svg></div>
    ${full("b-dg", dgSvg, dgHtml)}
    ${lbl("b-amph", 560, 112, 800, 60, `<span style="color:${GOLD}">amplitude</span> = a number`)}
    ${C("b-card", 960, 800, 640, 56, `H → H → always <span style="color:${GOLD}">0</span>`)}
    <div class="obj" id="b-cardb" style="left:640px;top:752px;width:640px;height:96px"><svg class="sk" width="640" height="96" viewBox="0 0 640 96"><g id="b-cardg">${r.rect(4, 4, 632, 88, pen({ strokeWidth: 2.4, roughness: 1.2, stroke: DIMINK }))}</g></svg></div>
    ${full("b-cr", crSvg, crHtml)}
    <div class="obj" id="b-ph2" style="left:300px;top:200px;width:400px;height:400px;transform:scale(0.8);color:${INK}"><svg class="sk" width="400" height="400" viewBox="0 0 400 400">${phones("b-pq")}</svg></div>
    ${full("b-s14", s14Svg, s14Html)}
    ${full("b-s15", s15Svg, s15Html)}
    ${full("b-s16", s16Svg, s16Html)}
    ${full("b-s17", s17Svg, s17Html)}
    ${full("b-s18", s18Svg, s18Html)}
  `;
  const css = `
    #b-phones { transform-origin: 50% 50%; }
    #b-ph2 { transform-origin: 50% 50%; }
  `;

  // ===================== Timeline =====================
  const script = `
    const T = ${JSON.stringify(T)};
    const PI = Math.PI, INK = "${INK}", GOLD = "${GOLD}";
    const AX = ${AX}, SX = ${SX}, SY = ${JSON.stringify(SY)}, WIN = ${WIN};
    const clamp = (u) => Math.min(1, Math.max(0, u));
    const f1 = (v) => v.toFixed(1);
    const S = (segs, t, init) => sched(segs, t, init);
    // A hand wave from x0 to x1 (shown up to the share rev), positive amp rises on screen.
    function waveD(x0, x1, yb, amp, ph, rev, lam, seed) {
      if (rev <= 0.002) return "";
      const xe = x0 + (x1 - x0) * rev;
      let d = "";
      for (let x = x0; ; x += 5) {
        const xx = Math.min(x, xe);
        const y = yb - amp * Math.sin((2 * PI * (xx - x0)) / lam + ph) + 1.2 * Math.sin(xx * 0.071 + seed) + 0.7 * Math.sin(xx * 0.19 + seed * 1.7);
        d += (d ? " L" : "M") + f1(xx) + " " + f1(y);
        if (xx >= xe) break;
      }
      return d;
    }
    function arrowD(x1, y1, x2, y2) {
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
      if (L < 3) return "";
      const ux = dx / L, uy = dy / L, nx = -uy, ny = ux, bow = Math.min(4, L * 0.02);
      const mx = (x1 + x2) / 2 + nx * bow, my = (y1 + y2) / 2 + ny * bow;
      const h = Math.min(24, L * 0.3), a = 0.45, bx = -ux, by = -uy;
      const h1 = [x2 + h * (bx * Math.cos(a) - by * Math.sin(a)), y2 + h * (bx * Math.sin(a) + by * Math.cos(a))];
      const h2 = [x2 + h * (bx * Math.cos(-a) - by * Math.sin(-a)), y2 + h * (bx * Math.sin(-a) + by * Math.cos(-a))];
      return "M" + f1(x1) + " " + f1(y1) + " Q" + f1(mx) + " " + f1(my) + " " + f1(x2) + " " + f1(y2) + " M" + f1(h1[0]) + " " + f1(h1[1]) + " L" + f1(x2) + " " + f1(y2) + " L" + f1(h2[0]) + " " + f1(h2[1]);
    }
    const place = (id, x, y, a, s = 1) => $(id).setAttribute("transform", "translate(" + f1(x) + " " + f1(y) + ") rotate(" + a.toFixed(2) + ") scale(" + s.toFixed(3) + ")");
    function setBar(id, v, g, base, H) {
      const h = H * v, rc = $(id + "-cr");
      rc.setAttribute("y", f1(base - h)); rc.setAttribute("height", f1(h));
      $(id + "-fg").style.opacity = String(g); $(id + "-fi").style.opacity = String(1 - g);
      const tp = $(id + "-top");
      tp.setAttribute("y1", f1(base - h)); tp.setAttribute("y2", f1(base - h));
      tp.setAttribute("stroke", g > 0.5 ? GOLD : INK); tp.style.opacity = v > 0.004 ? "1" : "0";
    }
    const pop = (t, t0, amt = 0.12, dur = 0.5) => (t < t0 || t > t0 + dur ? 1 : 1 + amt * Math.sin((PI * (t - t0)) / dur));

    // ----- The arrow copies in the sum stage, one phase per experiment -----
    const FLY = 0.85;
    function phaseOf(t) { return t < T.FB - 0.1 ? 0 : t < T.FC - 0.1 ? 1 : 2; }
    function copies(t) {
      const ph = phaseOf(t);
      // [x, y, angle, scale, opacity] for c00, c10, c01, c11 (path, slot)
      if (ph === 0) {
        const F = T.FA, oS0 = S([[F, F + 0.15, 0, 1], [T.growA + 0.3, T.growA + 0.6, 1, 0.3], [T.endA, T.endA + 0.3, 0.3, 0]], t, 0);
        const oS1 = S([[F, F + 0.15, 0, 1], [T.endA, T.endA + 0.3, 1, 0]], t, 0);
        const xx = S([[F, F + FLY, AX, SX]], t, AX), sc1 = S([[T.canA + 0.35, T.canA + 0.7, 1, 0]], t, 1);
        return [
          [xx, S([[F, F + FLY, 300, 355]], t, 300), 0, 1, oS0],
          [xx, S([[F, F + FLY, 600, 245]], t, 600), 0, 1, oS0],
          [xx, S([[F, F + FLY, 300, 655], [T.canA, T.canA + 0.35, 655, 600]], t, 300), 0, sc1, oS1],
          [xx, S([[F, F + FLY, 600, 545], [T.canA, T.canA + 0.35, 545, 600]], t, 600), S([[T.flipA, T.flipA + 0.6, 0, 180]], t, 0), sc1, oS1],
        ];
      }
      if (ph === 1) {
        const F = T.FB, oS0 = S([[F, F + 0.15, 0, 1], [T.l13, T.l13 + 0.3, 1, 0]], t, 0);
        const oS1 = S([[F, F + 0.15, 0, 1], [T.addB + 0.3, T.addB + 0.6, 1, 0.3], [T.l13, T.l13 + 0.3, 0.3, 0]], t, 0);
        const xx = S([[F, F + FLY, AX, SX]], t, AX), sc0 = S([[T.canB + 0.35, T.canB + 0.7, 1, 0]], t, 1);
        return [
          [xx, S([[F, F + FLY, 300, 355], [T.canB, T.canB + 0.35, 355, 300]], t, 300), 0, sc0, oS0],
          [xx, S([[F, F + FLY, 600, 245], [T.canB, T.canB + 0.35, 245, 300]], t, 600), 180, sc0, oS0],
          [xx, S([[F, F + FLY, 300, 655]], t, 300), 0, 1, oS1],
          [xx, S([[F, F + FLY, 600, 545]], t, 600), S([[T.flipB, T.flipB + 0.6, 180, 360]], t, 180), 1, oS1],
        ];
      }
      const F = T.FC, FL = F + FLY + 0.05;
      const oS0 = S([[F, F + 0.15, 0, 1], [T.halfway + 0.3, T.halfway + 0.6, 1, 0.3]], t, 0);
      const oS1 = S([[F, F + 0.15, 0, 1], [T.halfway + 0.6, T.halfway + 0.9, 1, 0.3]], t, 0);
      const xx = S([[F, F + FLY, AX, SX]], t, AX);
      return [
        [xx, S([[F, F + FLY, 300, 355]], t, 300), 0, 1, oS0],
        [S([[F, F + FLY, AX, SX + 55]], t, AX), S([[F, F + FLY, 600, 300]], t, 600), 90, 1, oS0],
        [xx, S([[F, F + FLY, 300, 655]], t, 300), 0, 1, oS1],
        [S([[F, F + FLY, AX, SX + 55], [FL, FL + 0.5, SX + 55, SX - 55]], t, AX), 600, S([[FL, FL + 0.5, 90, 270]], t, 90), 1, oS1],
      ];
    }
    // Resultant arrows: [x1, y1, x2, y2, reveal, opacity]
    function results(t) {
      const ph = phaseOf(t);
      if (ph === 0) return [[SX + 28, 410, SX + 28, 190, S([[T.growA, T.growA + 0.5, 0, 1]], t, 0), S([[T.endA, T.endA + 0.3, 1, 0]], t, 1), pop(t, T.growA + 0.5)], [0, 0, 0, 0, 0, 0, 1]];
      if (ph === 1) return [[0, 0, 0, 0, 0, 0, 1], [SX + 28, 710, SX + 28, 490, S([[T.addB, T.addB + 0.5, 0, 1]], t, 0), S([[T.l13, T.l13 + 0.3, 1, 0]], t, 1), pop(t, T.addB + 0.5)]];
      return [[SX, 410, SX + 110, 300, S([[T.halfway, T.halfway + 0.5, 0, 1]], t, 0), 1, 1], [SX, 710, SX - 110, 600, S([[T.halfway + 0.35, T.halfway + 0.85, 0, 1]], t, 0), 1, 1]];
    }
    const a1 = (t) => S([[T.flipZ, T.flipZ + 0.8, 0, 180], [T.quarter, T.quarter + 0.8, 180, 90]], t, 0);
    // Chance bars in the diagram
    const pb0 = (t) => S([[T.chance + 0.5, T.chance + 1.3, 0, 0.5], [T.growA, T.growA + 0.8, 0.5, 1], [T.endA, T.endA + 0.8, 1, 0.5], [T.canB + 0.05, T.canB + 0.95, 0.5, 0], [T.at13, T.at13 + 0.8, 0, 0.5]], t, 0);
    const pb1 = (t) => S([[T.chance + 0.5, T.chance + 1.3, 0, 0.5], [T.canA, T.canA + 0.8, 0.5, 0], [T.endA, T.endA + 0.8, 0, 0.5], [T.addB, T.addB + 0.8, 0.5, 1], [T.at13, T.at13 + 0.8, 1, 0.5]], t, 0);
    const gb0 = (t) => S([[T.growA, T.growA + 0.3, 0, 1], [T.endA, T.endA + 0.3, 1, 0], [T.at13, T.at13 + 0.3, 0, 1]], t, 0);
    const gb1 = (t) => S([[T.addB, T.addB + 0.3, 0, 1]], t, 0);

    onFrame((t) => {
      // ===== Waves (lines 2 to 4) =====
      const yN = S([[T.cancel3, T.cancel3 + 0.8, 380, 490]], t, 380), yM = S([[T.cancel3, T.cancel3 + 0.8, 600, 490]], t, 600);
      const aN = S([[T.cancel3 + 0.8, T.cancel3 + 2.0, 70, 0], [T.together, T.together + 0.8, 0, 70]], t, 70);
      const mM = S([[T.cancel3 + 0.8, T.cancel3 + 2.0, -70, 0], [T.together, T.together + 0.8, 0, 70]], t, -70);
      $("b-wN").setAttribute("d", waveD(560, 1460, yN, aN, 0, S([[T.noise, T.noise + 1.2, 0, 1]], t, 0), 225, 1.3));
      $("b-wM").setAttribute("d", waveD(560, 1460, yM, mM, 0, S([[T.mirror, T.mirror + 0.65, 0, 1]], t, 0), 225, 4.1));
      const aS = S([[T.louder, T.louder + 0.8, 0, 140]], t, 0);
      $("b-wS").setAttribute("d", t < T.louder ? "" : waveD(560, 1460, 490, aS, 0, 1, 225, 2.7));
      const dimW = String(1 - 0.65 * S([[T.louder, T.louder + 0.6, 0, 1]], t, 0));
      $("b-wN").style.opacity = dimW; $("b-wM").style.opacity = dimW;

      // ===== Path diagram =====
      // A dot leaves |0⟩, enters H and splits onto both paths (line 5).
      const gU = $("b-gU"), gL = $("b-gL"), LU = gU.getTotalLength(), LL = gL.getTotalLength();
      const u0 = S([[T.paths - 0.7, T.paths - 0.15, 0, 1]], t, 0), u1 = S([[T.paths, T.paths + 1.25, 0, 1]], t, 0);
      const d0 = $("b-dt0");
      d0.setAttribute("cx", f1(270 + 60 * u0)); d0.setAttribute("cy", "450");
      d0.style.opacity = u0 > 0 && u0 < 1 ? "1" : "0";
      const pu = gU.getPointAtLength(LU * u1 * 0.86), pl = gL.getPointAtLength(LL * u1 * 0.86);
      const dop = u1 > 0 ? String(1 - clamp((u1 - 0.8) / 0.2)) : "0";
      [["b-dt1", pu], ["b-dt2", pl]].forEach(([id, p]) => { $(id).setAttribute("cx", f1(p.x)); $(id).setAttribute("cy", f1(p.y)); $(id).style.opacity = dop; });
      // Path one's arrow: up, then down after Z, then sideways for the quarter wave.
      place("b-amp1", AX, 600, a1(t));
      // The half wave next to Z slides half a wavelength (line 10).
      const hs = S([[T.half, T.half + 0.8, 0, PI]], t, 0);
      $("b-hw").setAttribute("d", waveD(838, 928, 600, 16, hs, 1, 72, 0.6));
      // Copies and their sums
      copies(t).forEach(([x, y, a, s, o], i) => { const id = ["b-c00", "b-c10", "b-c01", "b-c11"][i]; place(id, x, y, a, s); $(id).style.opacity = String(o); });
      results(t).forEach(([x1, y1, x2, y2, rv, o, k], i) => {
        const R = $("b-R" + i);
        const mx = x1 + (x2 - x1) * rv * k, my = y1 + (y2 - y1) * rv * k;
        R.setAttribute("d", rv <= 0 ? "" : arrowD(x1, y1, mx, my)); R.style.opacity = String(o);
      });
      const z1o = S([[T.canA + 0.6, T.canA + 0.8, 0, 1], [T.endA, T.endA + 0.3, 1, 0]], t, 0);
      const z0o = S([[T.canB + 0.6, T.canB + 0.8, 0, 1], [T.l13, T.l13 + 0.3, 1, 0]], t, 0);
      $("b-z1").style.opacity = String(z1o); $("b-e1").style.opacity = String(z1o);
      $("b-z0").style.opacity = String(z0o); $("b-e0").style.opacity = String(z0o);
      // Bars
      const v0 = pb0(t), v1 = pb1(t), g0 = gb0(t), g1 = gb1(t);
      setBar("b-br0", v0, g0, 400, ${BH}); setBar("b-br1", v1, g1, 700, ${BH});
      [["b-pc0", v0, g0], ["b-pc1", v1, g1]].forEach(([id, v, g]) => { const L = $(id); L.textContent = Math.round(v * 100) + "%"; L.style.color = g > 0.5 ? GOLD : INK; });

      // ===== Line 14: the chance moves from 0 to 1 =====
      const mv = S([[T.van, T.van + 1.4, 1, 0]], t, 1);
      setBar("b-rb0", mv, 1, 760, 360); setBar("b-rb1", 1 - mv, 1, 760, 360);
      $("b-rp0").style.top = f1(760 - 360 * mv - 34) + "px"; $("b-rp0").textContent = Math.round(mv * 100) + "%";
      $("b-rp1").style.top = f1(760 - 360 * (1 - mv) - 34) + "px"; $("b-rp1").textContent = Math.round((1 - mv) * 100) + "%";

      // ===== Line 15: balls rush in; then two amplitudes add to zero =====
      const rush = S([[T.part, T.part + 0.65, 0, 1]], t, 0);
      place("b-ballA", 520 + 330 * rush * rush, 0, 0); place("b-ballB", 1400 - 330 * rush * rush, 0, 0);
      const meet = S([[T.adding, T.adding + 0.7, 0, 1]], t, 0), shrink = S([[T.zero15, T.zero15 + 0.4, 1, 0]], t, 1);
      place("b-aU", 840 + 120 * meet, 330, 0, shrink); place("b-aD", 1080 - 120 * meet, 330, 180, shrink);
      $("b-a0").style.opacity = String(S([[T.zero15 + 0.3, T.zero15 + 0.5, 0, 1]], t, 0));

      // ===== Line 17: five slots cancel, one grows =====
      SY.forEach((y, i) => {
        const tc = i === WIN ? T.cancs : T.pattern + 0.25 * [0, 1, 0, 2, 3, 4][i];
        const m = S([[tc, tc + 0.35, 0, 1]], t, 0);
        if (i === WIN) {
          place("b-ma" + i, 1290 + 20 * m, y + 26 * m, 0); place("b-mb" + i, 1330 - 20 * m, y - 26 * m, 0);
          const c = m > 0.5 ? GOLD : INK; $("b-ma" + i).style.color = c; $("b-mb" + i).style.color = c;
        } else {
          const s = S([[tc + 0.35, tc + 0.6, 1, 0]], t, 1);
          place("b-ma" + i, 1290 + 20 * m, y, 0, s); place("b-mb" + i, 1330 - 20 * m, y, 180, s);
          $("b-md" + i).style.opacity = String(S([[tc + 0.5, tc + 0.65, 0, 1]], t, 0));
        }
      });
      $("b-mwcr").setAttribute("width", f1(304 * S([[T.cancs + 0.35, T.cancs + 1.0, 0, 1]], t, 0)));

      // ===== Line 18: in step they grow, out of step they cancel (drifting through the hold) =====
      const drift = -1.4 * (t - T.l18);
      const ca = S([[T.instep + 0.3, T.instep + 0.9, 0, 1]], t, 0), ga = S([[T.instep + 0.7, T.instep + 1.3, 0, 1]], t, 0);
      const ra = S([[T.instep - 0.1, T.instep + 0.4, 0, 1]], t, 0);
      $("b-fa1").setAttribute("d", waveD(300, 860, 470 + 50 * ca, 34, drift, ra, 186, 0.4));
      $("b-fa2").setAttribute("d", waveD(300, 860, 570 - 50 * ca, 34, drift, ra, 186, 2.2));
      $("b-faS").setAttribute("d", ga <= 0 ? "" : waveD(300, 860, 520, 68 * ga, drift, 1, 186, 3.1));
      const dimA = String(1 - 0.7 * ga); $("b-fa1").style.opacity = dimA; $("b-fa2").style.opacity = dimA;
      const cb = S([[T.outstep + 0.3, T.outstep + 0.9, 0, 1]], t, 0), fb = S([[T.outstep + 0.9, T.outstep + 1.6, 34, 0]], t, 34);
      const rb = S([[T.outstep - 0.1, T.outstep + 0.4, 0, 1]], t, 0);
      $("b-fb1").setAttribute("d", waveD(1060, 1620, 470 + 50 * cb, fb, drift, rb, 186, 1.1));
      $("b-fb2").setAttribute("d", waveD(1060, 1620, 570 - 50 * cb, -fb, drift, rb, 186, 5.3));
      $("b-fbS").setAttribute("d", fb > 0.5 ? "" : waveD(1060, 1620, 520, 2.5 * Math.sin(2.2 * t), drift, 1, 186, 0.9));
    });

    // ===== Line 0: the challenge =====
    draw("#b-qd", T.qubit0, 0.7);
    write("#b-q0", T.qubit0 + 0.3, 0.4);
    write("#b-ql0", T.qubit0 + 0.35, 0.3);
    draw("#b-har", T.qubit0 + 0.6, 0.3);
    draw("#b-cards", T.qubit0 + 0.55, 0.55);
    [0, 1, 2, 3].forEach((i) => write("#b-one" + i, T.one0 + i * 0.18, 0.18));
    blurOut("#b-title", T.titleOut);
    draw("#b-xb", T.xgate, 0.35);
    write("#b-xl", T.xgate + 0.1, 0.2);
    draw("#b-xx", T.xgate + 0.35, 0.35);
    tl.to("#b-cards", { y: -6, duration: 0.15, yoyo: true, repeat: 1 }, T.time0);

    // ===== Line 1: interference; the headphones =====
    write("#b-intf", T.intf, 0.8);
    draw(["#b-ph-main", "#b-ph-snd"], T.phones, 1.8);
    blurOut("#b-hook", T.hookOut);

    // ===== Line 2: noise and its mirror image =====
    tl.to("#b-intf", { color: INK, duration: 0.4 }, T.l2);
    move("#b-phones", { x: 0, y: 0, scale: 1 }, { x: -660, y: 0, scale: 0.5 }, T.l2 + 0.05, 0.8);
    write("#b-nl", T.noise + 0.5, 0.35);
    write("#b-ml", T.mirror + 0.15, 0.45);

    // ===== Line 3: crest meets trough, they cancel =====
    draw("#b-mk0", T.rises, 0.25); write("#b-rl", T.rises + 0.05, 0.3);
    draw("#b-mk1", T.dips, 0.25); write("#b-dl", T.dips + 0.05, 0.25);
    draw("#b-mkl", T.dips + 0.1, 0.35);
    fade(["#b-mk0", "#b-mk1", "#b-mkl", "#b-rl", "#b-dl", "#b-nl", "#b-ml"], 0, T.cancel3, 0.3);
    fade("#b-ph-snd", 0, T.gone, 0.4);
    write("#b-sil", T.gone + 0.15, 0.5);

    // ===== Line 4: in step they grow =====
    fade("#b-sil", 0, T.together - 0.2, 0.3);
    write("#b-loud", T.louder, 0.45);
    fade("#b-ph-snd", 1, T.louder, 0.3);
    tl.to("#b-ph-snd", { scale: 1.06, transformOrigin: "50% 50%", duration: 0.2, yoyo: true, repeat: 3 }, T.louder);
    blurOut(["#b-wv", "#b-intf"], T.l5);
    fade("#b-ph-snd", 0, T.l5, 0.25);
    move("#b-phones", { x: -660, y: 0, scale: 0.5 }, { x: -730, y: -305, scale: 0.22 }, T.l5, 0.9);

    // ===== Line 5: H splits a qubit into two paths =====
    hide(["#b-zl", "#b-ql", "#b-hw", "#b-sk", "#b-pq-snd"]);
    tl.set("#b-dg", { transformOrigin: "960px 150px" }, 0);
    write("#b-ket0", T.zero5, 0.35);
    draw("#b-h1", T.h1, 0.5);
    write("#b-h1l", T.h1 + 0.15, 0.2);
    tl.to("#b-h1l", { color: INK, duration: 0.3 }, T.h1 + 1.0);
    draw("#b-pU", T.paths - 0.1, 1.2); draw("#b-pL", T.paths - 0.1, 1.2);
    write("#b-pl0", T.p0, 0.4);
    write("#b-pl1", T.p1, 0.4);

    // ===== Line 6: each path carries an amplitude, drawn as an arrow =====
    write("#b-amph", T.amp, 0.9);
    draw("#b-br0-frame", T.chance - 0.1, 0.5); draw("#b-br1-frame", T.chance, 0.5);
    write("#b-chl", T.chance, 0.35);
    write(["#b-pc0", "#b-pc1"], T.chance + 0.5, 0.3);
    show("#b-sk", T.neg - 0.05); draw("#b-sk", T.neg - 0.05, 0.45);
    write("#b-skp", T.neg + 0.15, 0.15); write("#b-skm", T.neg + 0.35, 0.15);
    draw(["#b-amp0", "#b-amp1"], T.drawn, 0.6);
    tl.set(["#b-amp0", "#b-amp1"], { color: GOLD }, T.drawn);
    fade(["#b-sk", "#b-skp", "#b-skm"], 0, T.l7, 0.3);
    tl.to(["#b-amp0", "#b-amp1"], { color: INK, duration: 0.3 }, T.l7);

    // ===== Line 7: a second H; the arrows add on each result =====
    draw("#b-h2", T.second, 0.5);
    write("#b-h2l", T.second + 0.15, 0.2);
    draw("#b-out", T.together7, 0.5);
    write(["#b-o0", "#b-o1"], T.result, 0.25);

    // ===== Lines 8 and 9: same way grows, opposite cancels; H then H reads zero =====
    tl.to("#b-h2l", { color: GOLD, duration: 0.2 }, T.flipA);
    tl.to("#b-h2l", { color: INK, duration: 0.3 }, T.flipA + 0.9);
    tl.to("#b-h2l", { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1 }, T.flipA);
    write("#b-card", T.l9 + 0.1, 0.9);
    draw("#b-cardg", T.l9, 0.6);
    blurOut(["#b-card", "#b-cardb"], T.endA);

    // ===== Line 10: a Z gate shifts path one half a wave, flipping its sign =====
    draw("#b-zbox", T.endA, 0.45);
    show("#b-zl", T.endA + 0.1); write("#b-zl", T.endA + 0.1, 0.2);
    show("#b-hw", T.half - 0.25); write("#b-hwl", T.half - 0.1, 0.4);
    tl.to("#b-amp1", { color: GOLD, duration: 0.25 }, T.flipZ);
    write("#b-sgl", T.sign, 0.45);
    tl.to("#b-zl", { color: INK, duration: 0.3 }, T.flipZ + 1.0);
    fade(["#b-hw", "#b-hwl"], 0, T.l11, 0.3);

    // ===== Line 11: the headphone trick; cancel on zero, add on one =====
    tl.to("#b-phones", { color: GOLD, duration: 0.25 }, T.hp);
    tl.to("#b-phones", { keyframes: [{ rotation: -10, duration: 0.12 }, { rotation: 9, duration: 0.14 }, { rotation: -6, duration: 0.12 }, { rotation: 0, duration: 0.14 }] }, T.hp);
    tl.to("#b-phones", { color: INK, duration: 0.3 }, T.hp + 1.0);
    tl.to("#b-amp1", { color: INK, duration: 0.3 }, T.FB);
    fade("#b-sgl", 0, T.FB, 0.3);

    // ===== Line 12: H, Z, H reads one every time =====
    move("#b-dg", { scale: 1, y: 0 }, { scale: 0.75, y: -10 }, T.l12, 1.0);
    move("#b-amph", { scale: 1, y: 0, opacity: 1 }, { scale: 0.8, y: -18, opacity: 0.6 }, T.l12, 1.0);
    draw("#b-cr-wire", T.l12 + 0.3, 0.8); draw("#b-cr-boxes", T.l12 + 0.4, 0.8);
    write("#b-crk", T.l12 + 0.3, 0.3);
    write(["#b-cr-g0", "#b-cr-g1", "#b-cr-g2"], T.l12 + 0.7, 0.4);
    draw("#b-cra", T.one12 - 0.3, 0.3);
    write("#b-crr", T.one12, 0.7);
    draw("#b-crx", T.no12, 0.5); write("#b-crxl", T.no12 + 0.05, 0.2);

    // ===== Line 13: a quarter wave lands halfway =====
    blurOut("#b-cr", T.l13);
    tl.to("#b-dg", { scale: 1, y: 0, duration: 0.9, ease: "power2.inOut" }, T.l13 + 0.05);
    tl.to("#b-amph", { scale: 1, y: 0, opacity: 1, duration: 0.9, ease: "power2.inOut" }, T.l13 + 0.05);
    fade("#b-zl", 0, T.quarter - 0.1, 0.25);
    show("#b-ql", T.quarter); write("#b-ql", T.quarter, 0.3);
    write("#b-qwl", T.quarter + 0.1, 0.5);
    fade("#b-qwl", 0, T.halfway, 0.3);
    tl.to("#b-amp1", { color: GOLD, duration: 0.25 }, T.quarter);
    tl.to("#b-amp1", { color: INK, duration: 0.3 }, T.FC);

    // ===== Line 14: nothing is lost =====
    blurOut(["#b-dg", "#b-phones", "#b-amph"], T.dgOut);
    draw(["#b-pq-main"], T.ph14, 1.0);
    draw("#b-s14f", T.ph14 + 0.6, 0.5);
    write("#b-s14s", T.ph14 + 0.8, 0.45);
    draw("#b-s14d", T.ph14 + 0.2, 0.5);
    draw(["#b-rb0-frame", "#b-rb1-frame"], T.nothing - 0.2, 0.6);
    hide(["#b-rb0-fill", "#b-rb1-fill", "#b-rp0", "#b-rp1"]);
    fade(["#b-rb0-fill", "#b-rp0", "#b-rp1"], 1, T.nothing + 0.3, 0.3);
    fade("#b-rb1-fill", 1, T.nothing + 0.3, 0.01);
    write(["#b-rl0", "#b-rl1"], T.nothing + 0.1, 0.25);
    write("#b-tot", T.lost, 0.6);
    draw("#b-arch", T.reapp, 0.6);
    write("#b-mv", T.reapp + 0.1, 0.5);

    // ===== Line 15: not particles colliding; amplitudes adding to zero =====
    blurOut(["#b-ph2", "#b-s14"], T.l15);
    draw("#b-balls", T.l15 + 0.1, 0.6);
    draw("#b-bx", T.coll, 0.4);
    blurOut(["#b-balls", "#b-bx"], T.amps);
    hide(["#b-aU", "#b-aD"]);
    show(["#b-aU", "#b-aD"], T.amps + 0.2);
    draw(["#b-aU", "#b-aD"], T.amps + 0.2, 0.5);
    write("#b-aUl", T.amps + 0.35, 0.25); write("#b-aDl", T.amps + 0.55, 0.25);
    write("#b-sum", T.adding - 0.1, 1.1);

    // ===== Line 16: chances alone can never cancel =====
    draw("#b-nln", T.l16, 0.8);
    write(["#b-n0", "#b-n50", "#b-n100"], T.l16 + 0.4, 0.3);
    draw("#b-bk0", T.alone, 0.4); write("#b-bk0l", T.alone + 0.15, 0.25);
    move(["#b-bk0", "#b-bk0l"], { y: -40 }, { y: 0 }, T.alone, 0.45, "power2.out");
    draw("#b-bk1", T.could, 0.4); write("#b-bk1l", T.could + 0.15, 0.25);
    move(["#b-bk1", "#b-bk1l"], { y: -40 }, { y: 0 }, T.could, 0.45, "power2.out");
    write("#b-only", T.cancel16, 0.6);
    draw("#b-ngz", T.because, 0.6);
    write("#b-noch", T.chance16 - 0.2, 0.6);
    draw("#b-nbk", T.neg16 - 0.35, 0.3); write("#b-nbkl", T.neg16 - 0.25, 0.25);
    move(["#b-nbk", "#b-nbkl"], { x: -60 }, { x: 0 }, T.neg16 - 0.35, 0.4, "power2.out");
    draw("#b-nbx", T.neg16 + 0.15, 0.3);

    // ===== Line 17: a careful pattern of cancellations =====
    blurOut(["#b-s15", "#b-s16"], T.l17);
    draw("#b-mh", T.algo - 0.2, 0.4); write("#b-mhl", T.algo - 0.05, 0.2);
    draw("#b-mp", T.algo + 0.1, 0.9);
    draw("#b-mg", T.algo + 0.5, 0.5);
    draw("#b-mbf", T.algo + 0.6, 0.5);
    hide(["#b-s17 [id^=b-ma]", "#b-s17 [id^=b-mb]"]);
    fade(["#b-s17 [id^=b-ma]", "#b-s17 [id^=b-mb]"], 1, T.algo + 0.8, 0.3);

    // ===== Line 18: closing card =====
    blurOut("#b-s17", T.l18);
    draw("#b-cl-wire", T.l18 + 0.15, 0.8); draw("#b-cl-boxes", T.l18 + 0.25, 0.8);
    write("#b-clk", T.l18 + 0.2, 0.3);
    write(["#b-cl-g0", "#b-cl-g1", "#b-cl-g2"], T.remember, 0.4);
    draw("#b-cla", T.remember + 0.3, 0.3);
    write("#b-cl1", T.remember + 0.55, 0.2);
    write("#b-take", T.ampl18, 1.3);
    draw("#b-takeug", T.ampl18 + 1.35, 0.5);
    write("#b-fal", T.instep + 0.1, 0.6);
    write("#b-fbl", T.outstep + 0.1, 0.8);
  `;

  return { html, script, css };
}
