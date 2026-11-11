// Lesson 18, "The quantum Fourier transform". Follows plan.md: a piano chord reaches the ear as one
// tangled wave and the ear hears three notes (a Fourier transform); the QFT does that to amplitudes.
// A three tier board (input amplitudes, the transform, output chances) shows a pattern on 0 and 2
// coming out as peaks on 0 and 2, then clock hands show why (they add on 0 and 2, cancel on 1 and 3),
// and the slid pattern keeps the peaks. Then where the chord picture breaks (one reading per run),
// Shor's algorithm, and the closing card: rhythm into position, multiples of N over r.
// Gold is the thing the voice is naming right now.
export const phrases = [
  ["Q F T", "QFT"],
  ["N over r", "N/r"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, wobbly, lbl, cue, lines, TOTAL, INK, GOLD, GROUND } = k;
  const fx = (n) => +(+n).toFixed(1);
  // Label centred on (cx, cy).
  const C = (id, cx, cy, w, size, html, extra = "") => lbl(id, fx(cx - w / 2), fx(cy - size * 0.76), w, size, html, extra);
  // Strokes and fills follow the group's colour, so a group can turn gold and back.
  const cur = (svg) => svg
    .replaceAll(`stroke="${INK}"`, 'stroke="currentColor"').replaceAll(`stroke="${GOLD}"`, 'stroke="currentColor"')
    .replaceAll(`fill="${INK}"`, 'fill="currentColor"').replaceAll(`fill="${GOLD}"`, 'fill="currentColor"');
  const G = (id, inner, extra = "") => `<g id="${id}"${extra}>${inner}</g>`;
  const CG = (id, inner, color = INK, extra = "") => `<g id="${id}" style="color:${color}"${extra}>${cur(inner)}</g>`;
  const full = (id, svg, inner = "") => `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${inner}</div>`;
  const pathEl = (d, sw, color = INK, extra = "") => `<path class="ink" pathLength="1" d="${d}" stroke="${color}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  const hatch = (c, gap = 9) => pen({ fill: c, fillStyle: "hachure", hachureGap: gap, fillWeight: 2, stroke: "none", roughness: 1.1 });

  // ---------- Times, cued to the voice ----------
  const T = {
    piano: cue(0, "piano", 0, -0.1), chord0: cue(0, "chord", 0, -0.05), ear0: cue(0, "ear", 0, -0.1), pick: cue(0, "pick"),
    l1: cue(1), tangled: cue(1, "tangled", 0, -0.1), wave1: cue(1, "wave", 0, -0.05), yet: cue(1, "yet"), three1: cue(1, "three", 0, -0.1),
    splits: cue(2, "splits", 0, -0.05), freq2: cue(2, "frequencies", 0, -0.1), how: cue(2, "how"), fast: cue(2, "fast"), each2: cue(2, "each"),
    note2: cue(2, "note", 1), fourier: cue(2, "Fourier", 0, -0.3), transform2: cue(2, "transform"),
    outA: cue(3, null, 0, -0.15), quantum3: cue(3, "quantum", 0, -0.1), qft3: cue(3, "QFT", 0, -0.05), amps: cue(3, "amplitudes", 0, -0.1),
    numbers: cue(3, "numbers", 0, -0.05), chance3: cue(3, "chance", 0, -0.1), when3: cue(3, "when", 0, -0.05), you3: cue(3, "you", 0, 0.2),
    l4: cue(4, null, 0, -0.1), two4: cue(4, null, 0, 0.1), bits: cue(4, "bits", 0, -0.05), four4: cue(4, "four", 0, -0.05), zero4: cue(4, "zero", 0, -0.05),
    l5: cue(5), equal: cue(5, "equal", 0, -0.1), two5: cue(5, "two"), leaving: cue(5, "leaving", 0, -0.05), empty: cue(5, "empty", 0, -0.05),
    pattern5: cue(5, "pattern", 0, -0.05), repeats: cue(5, "repeats", 0, -0.05), two5b: cue(5, "two", 1, -0.05),
    run: cue(6, "run", 0, -0.05), chance6: cue(6, "chance", 0, -0.1), peaks6: cue(6, "peaks", 0, -0.05), freq6: cue(6, "frequencies", 0, -0.05),
    zero6: cue(6, "zero", 0, -0.05), two6: cue(6, "and", 1, 0.2),
    heres: cue(7, "Here's", 0, -0.05), input7: cue(7, "input", 0, -0.05), sends: cue(7, "sends", 0, -0.05), output7: cue(7, "output", 0, -0.05),
    clock: cue(7, "clock", 0, -0.1), where: cue(7, "where", 0, -0.05), phase7: cue(7, "phase", 0, -0.3),
    l8: cue(8), zero8: cue(8, "zero", 0, -0.05), every8: cue(8, "every", 0, -0.05), up8: cue(8, "up"), from2: cue(8, "From", 1, -0.05),
    two8: cue(8, "two", 0, -0.05), turns: cue(8, "turns"),
    l9: cue(9), outputs: cue(9, "outputs", 0, -0.05), up9: cue(9, "up", 0, -0.05), cancels: cue(9, "cancels", 0, -0.05), pop: cue(9, "down", 0, 0.18),
    while9: cue(9, "while", 0, -0.05), zero9: cue(9, "zero", 0, -0.05), add: cue(9, "add", 0, -0.2), intf: cue(9, "interference", 0, -0.3),
    slide: cue(10, "Slide", 0, -0.05), three10: cue(10, "three"), peaks10: cue(10, "peaks", 0, -0.05), stay: cue(10, "stay"), put: cue(10, "put"),
    hears: cue(10, "hears", 0, -0.05), rhythm10: cue(10, "rhythm", 0, -0.05), wherever: cue(10, "wherever"), starts: cue(10, "starts", 0, 0.2),
    l11: cue(11, null, 0, -0.1), chord11: cue(11, "chord", 0, -0.1), breaks: cue(11, "breaks", 0, -0.05), every11: cue(11, "every", 0, -0.05),
    at11: cue(11, "at", 0, 0.25),
    l12: cue(12), measuring: cue(12, "measuring", 0, -0.05), gives: cue(12, "gives", 0, -0.05),
    runs: [cue(12, "one"), cue(12, "per"), cue(12, "picked"), cue(12, "random")], peaks12: cue(12, "the", 0, 0.12),
    l13: cue(13, null, 0, -0.25), good: cue(13, "good", 0, 0.15), every13: cue(13, "every", 0, -0.05), your13: cue(13, "your", 0, -0.05),
    plenty: cue(13, "plenty", 0, -0.05), one13: cue(13, "one", 0, -0.05),
    l14: cue(14, null, 0, -0.1), shors: cue(14, "algorithm", 0, -0.6), finds: cue(14, "finds", 0, -0.05), one14: cue(14, "one", 0, -0.05),
    uses: cue(14, "uses", 0, -0.05), break14: cue(14, "break", 0, -0.05), huge: cue(14, "huge", 0, -0.05), factors: cue(14, "factors", 0, -0.3),
    l15: cue(15, null, 0, -0.1), qft15: cue(15, "QFT", 0, -0.05), rhythm15: cue(15, "rhythm", 0, -0.05), arrow15: cue(15, "rhythm", 0, 0.45),
    position: cue(15, "position", 0, -0.1),
    nRead: cue(16, "With", 0, 0.3), pattern16: cue(16, "pattern", 0, -0.05), repeating: cue(16, "repeating", 0, -0.05), every16: cue(16, "every", 0, -0.05),
    steps16: cue(16, "every", 0, 0.35), lands: cue(16, "lands", 0, -0.05), multiples: cue(16, "multiples", 0, -0.05), nr: cue(16, "of", 0, 0.15),
    end: lines[16].end,
  };

  // ===================== Drawing helpers =====================
  // An ear centred on (cx, cy), about 180 x 260 at s = 1, open towards the left.
  const ear = (cx, cy, s, sw = 3.2) => {
    const P = (pts) => pts.map(([x, y]) => [fx(cx + x * s), fx(cy + y * s)]);
    return r.curve(P([[-40, -100], [0, -128], [55, -118], [85, -80], [88, -30], [70, 10], [45, 45], [35, 80], [20, 112], [-8, 128], [-34, 114]]), pen({ strokeWidth: sw })) +
      r.curve(P([[-22, -62], [12, -82], [46, -62], [52, -24], [34, 6], [8, 24], [0, 52]]), pen({ strokeWidth: sw * 0.8 })) +
      r.curve(P([[-42, 6], [-56, 28], [-40, 52]]), pen({ strokeWidth: sw * 0.8 })) +
      r.circle(fx(cx - 14 * s), fx(cy + 30 * s), fx(14 * s), pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" }));
  };
  // An almond eye centred on (cx, cy), w wide.
  const eye = (cx, cy, w, sw = 3) =>
    r.curve([[cx - w / 2, cy], [cx - w * 0.2, cy - w * 0.3], [cx + w * 0.2, cy - w * 0.3], [cx + w / 2, cy]], pen({ strokeWidth: sw })) +
    r.curve([[cx - w / 2, cy], [cx - w * 0.2, cy + w * 0.3], [cx + w * 0.2, cy + w * 0.3], [cx + w / 2, cy]], pen({ strokeWidth: sw })) +
    r.circle(cx, cy, w * 0.34, pen({ strokeWidth: sw * 0.8 })) +
    r.circle(cx, cy, w * 0.13, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" }));
  // A sum of sines from x0 to x1 (cycles per span in comps), as a smooth stroke.
  const wavePts = (x0, x1, cy, amp, comps, n = 180) => Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    return [x0 + (x1 - x0) * u, cy - amp * comps.reduce((s, c) => s + Math.sin(2 * Math.PI * c * u), 0)];
  });
  const wave = (x0, x1, cy, amp, comps, sw, seed, color = INK) => pathEl(wobbly(wavePts(x0, x1, cy, amp, comps), 0.7, seed).d, sw, color);
  // A curved arrow through pts with a head at the last point.
  function curveArrow(pts, o = {}, head = 16) {
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const hp = (da) => [b[0] - head * Math.cos(ang + da), b[1] - head * Math.sin(ang + da)];
    const [h1, h2] = [hp(0.5), hp(-0.5)];
    return r.curve(pts, pen(o)) + r.line(b[0], b[1], h1[0], h1[1], pen(o)) + r.line(b[0], b[1], h2[0], h2[1], pen(o));
  }
  // Dashes from (x1, y1) to (x2, y2), each its own stroke.
  const dashLine = (x1, y1, x2, y2, o, len = 14, gap = 10) => {
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    let s = "";
    for (let d = 0; d < L; d += len + gap) { const e = Math.min(d + len, L); s += r.line(fx(x1 + ux * d), fx(y1 + uy * d), fx(x1 + ux * e), fx(y1 + uy * e), o); }
    return s;
  };
  // A bar whose height the timeline sets: an ink and a gold hachure, clipped, plus an outline.
  function vbar(id, x, w, yTop, yBot, gap = 9) {
    const h = (c) => r.rect(x + 3, yTop, w - 6, yBot - yTop, hatch(c, gap));
    return `<defs><clipPath id="${id}-c"><rect id="${id}-cr" x="${x - 4}" y="0" width="${w + 8}" height="0"/></clipPath></defs>` +
      `<g id="${id}"><g clip-path="url(#${id}-c)"><g id="${id}-fi">${h(INK)}</g><g id="${id}-fg" style="opacity:0">${h(GOLD)}</g></g>` +
      `<path id="${id}-o" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }

  // ===================== Scene A: the chord and the ear (lines 0 to 2) =====================
  const KX = Array.from({ length: 7 }, (_, i) => 170 + 62 * i);
  const piano =
    KX.map((x) => r.rect(x, 400, 62, 240, pen({ strokeWidth: 2.8, roughness: 1 }))).join("") +
    [0, 1, 3, 4, 5].map((i) => r.rect(KX[i] + 62 - 18, 400, 36, 145, pen({ strokeWidth: 2.4, roughness: 1, fill: INK, fillStyle: "hachure", hachureGap: 5, fillWeight: 1.6 }))).join("");
  const pressed = [0, 2, 4].map((i, j) => CG(`b-kp${j}`,
    r.rect(KX[i] + 3, 403, 56, 234, goldPen({ strokeWidth: 3.4, roughness: 0.9 })) +
    r.rect(KX[i] + 9, 556, 44, 74, goldPen({ fill: GOLD, fillStyle: "hachure", hachureGap: 7, fillWeight: 2, stroke: "none" })), GOLD)).join("");
  const soundTicks = CG("b-ticks", [0, 2, 4].map((i, j) => {
    const x = KX[i] + 31, a = [-0.35, 0, 0.35][j];
    return r.line(fx(x + Math.sin(a) * 14), 384, fx(x + Math.sin(a) * 40), 352, goldPen({ strokeWidth: 3 }));
  }).join(""), GOLD);
  const tangle = wavePts(640, 1100, 520, 35, [1.5, 3, 5]);
  const WAVES = [[1.5, 400], [3, 520], [5, 640]];
  const aSvg =
    G("b-piano", piano) + pressed + soundTicks +
    G("b-ear", ear(1210, 520, 1)) +
    G("b-tangle", pathEl(wobbly(tangle, 0.8, 5).d, 3.4)) +
    WAVES.map(([c, y], i) => CG(`b-w${i + 1}`, wave(1400, 1640, y, 36, [c], 3.6, 30 + i, GOLD), GOLD)).join("") +
    G("b-fanE", WAVES.map(([, y]) => arrow(1312, 520, 1390, y, { strokeWidth: 2.6 }, 13)).join("")) +
    G("b-fund", r.curve([[600, 262], [820, 254], [1080, 262], [1330, 254]], goldPen({ strokeWidth: 4.4, roughness: 1 }))) +
    [0, 1, 2].map((i) => `<circle id="b-ride${i}" r="11" fill="${GOLD}" stroke="${GROUND}" stroke-width="3" style="opacity:0"/>`).join("");
  const aHtml =
    C("b-q0", 1210, 335, 90, 90, "?", `color:${GOLD}`) +
    C("b-chordL", 387, 685, 200, 48, "chord", `color:${GOLD}`) +
    C("b-oneWave", 870, 685, 240, 44, "one wave") +
    C("b-freqs", 1520, 737, 340, 56, "frequencies", `color:${GOLD}`) +
    ["slow", "faster", "fastest"].map((s, i) => lbl(`b-tag${i}`, 1652, WAVES[i][1] - 30, 126, 40, s, "text-align:left")).join("") +
    C("b-fourier", 960, 200, 860, 84, "Fourier transform");

  // ===================== Scene B: the three tier board (lines 3 to 10) =====================
  const COL = [600, 890, 1180, 1470], BW = 90;
  const IN_B = 220, IN_U = 140, OUT_B = 780, OUT_U = 280, CY = 440, HR = 70;
  const face = (cx) => r.circle(cx, CY, 180, pen({ strokeWidth: 3.2 })) +
    [0, 90, 180, 270].map((a) => { const t = (a * Math.PI) / 180; return r.line(fx(cx + Math.sin(t) * 76), fx(CY - Math.cos(t) * 76), fx(cx + Math.sin(t) * 90), fx(CY - Math.cos(t) * 90), pen({ strokeWidth: 2.4, roughness: 0.6 })); }).join("") +
    r.circle(cx, CY, 13, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" }));
  const headAt = (cx, tipY, o) => r.line(cx, tipY, cx - 9, tipY + 15, pen(o)) + r.line(cx, tipY, cx + 9, tipY + 15, pen(o));
  const solidHand = (cx) => r.line(cx, CY, cx, CY - HR, pen({ strokeWidth: 5, roughness: 0.6 })) + headAt(cx, CY - HR, { strokeWidth: 4, roughness: 0.5 });
  const dashedHand = (cx) => dashLine(cx, CY - 2, cx, CY - HR + 2, pen({ strokeWidth: 4.4, roughness: 0.4 }), 13, 9) + headAt(cx, CY - HR, { strokeWidth: 3.6, roughness: 0.5 });
  const bandD = "M542 395 L1538 395 Q1560 395 1560 417 L1560 463 Q1560 485 1538 485 L542 485 Q520 485 520 463 L520 417 Q520 395 542 395 Z";
  const halfHop = (k) => {
    const a = COL[k - 1] + 40, b = COL[k] - 40, m = (a + b) / 2;
    return curveArrow([[a, 352], [m, 326], [b, 352]], { strokeWidth: 2.6 }, 12);
  };
  const rockArc = (() => {
    const pts = Array.from({ length: 9 }, (_, i) => { const a = ((-28 + 7 * i) * Math.PI) / 180; return [fx(COL[3] + Math.sin(a) * 108), fx(CY - Math.cos(a) * 108)]; });
    return curveArrow(pts, { strokeWidth: 2.6 }, 12) + curveArrow([...pts].reverse(), { strokeWidth: 2.6 }, 12);
  })();
  const bSvg =
    // Tier 1
    G("b-inBase", r.line(520, IN_B, 1560, IN_B, pen({ strokeWidth: 3.4 }))) +
    `<g id="b-inBars">${COL.map((x, i) => vbar(`b-in${i}`, x - BW / 2, BW, 90, IN_B)).join("")}</g>` +
    G("b-level", dashLine(555, 120, 1225, 120, pen({ strokeWidth: 2.4, roughness: 0.5 }), 16, 12)) +
    `<g id="b-rhythmW"><g id="b-rhythm" style="color:${GOLD}">${cur(curveArrow([[600, 112], [890, 62], [1180, 112]], goldPen({ strokeWidth: 3.4 }), 18))}</g></g>` +
    G("b-arIn", COL.map((x) => arrow(x, 290, x, 386, { strokeWidth: 2.6 }, 13)).join("")) +
    // Tier 2
    CG("b-band", r.path(bandD, pen({ strokeWidth: 3.4, roughness: 0.9 }))) +
    `<path id="b-swT" d="M530 395 L1550 395" pathLength="1" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" fill="none" style="opacity:0;stroke-dasharray:0.22 1.3"/>` +
    `<path id="b-swB" d="M530 485 L1550 485" pathLength="1" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" fill="none" style="opacity:0;stroke-dasharray:0.22 1.3"/>` +
    G("b-arOut", COL.map((x) => arrow(x, 494, x, 594, { strokeWidth: 2.6 }, 13)).join("")) +
    G("b-fanA", COL.map((x) => r.line(600, 282, x, 344, pen({ strokeWidth: 2 }))).join("")) +
    G("b-fanB", COL.map((x) => dashLine(1180, 282, x, 344, pen({ strokeWidth: 2, roughness: 0.4 }), 10, 8)).join("")) +
    COL.map((x, i) => `<g id="b-ckw${i}">${G(`b-ck${i}`, face(x))}${CG(`b-hs${i}`, solidHand(x), GOLD)}${CG(`b-hd${i}`, dashedHand(x), GOLD)}</g>`).join("") +
    [1, 2, 3].map((k) => G(`b-hop${k}`, halfHop(k))).join("") +
    G("b-rock", rockArc) +
    // Tier 3
    G("b-outBase", r.line(520, OUT_B, 1560, OUT_B, pen({ strokeWidth: 3.4 }))) +
    `<g id="b-outBars">${COL.map((x, i) => vbar(`b-out${i}`, x - BW / 2, BW, 600, OUT_B)).join("")}</g>` +
    [0, 2].map((i) => CG(`b-ring${i}`, r.ellipse(COL[i], 814, 74, 70, goldPen({ strokeWidth: 3.2 })), GOLD)).join("") +
    G("b-ear2", ear(310, 445, 0.56, 2.8)) +
    G("b-intfU", r.curve([[180, 486], [300, 480], [460, 486]], goldPen({ strokeWidth: 3.4 }))) +
    // Right margin doodles
    G("b-eyeS", eye(1678, 140, 130, 2.8)) +
    G("b-q", r.circle(1640, 150, 60, pen({ strokeWidth: 2.8 })) + r.circle(1720, 150, 60, pen({ strokeWidth: 2.8 })));
  const pcts = ["64%", "16%", "4%", "16%"], amps0 = [0.8, 0.4, 0.2, 0.4];
  const bHtml =
    C("b-hAmp", 315, 164, 330, 56, "amplitude") + C("b-hSets", 315, 226, 330, 40, "sets the chance", `color:${GOLD}`) +
    C("b-tagIn", 315, 105, 200, 44, "input") +
    COL.map((x, i) => C(`b-pc${i}`, x, IN_B - IN_U * amps0[i] - 30, 110, 40, pcts[i], i === 0 ? `color:${GOLD}` : "")).join("") +
    COL.map((x, i) => C(`b-inN${i}`, x, 251, 60, 44, String(i))).join("") +
    [1, 3].map((i) => C(`b-z${i}`, COL[i], 192, 50, 40, "0")).join("") +
    `<div id="b-rhyLW" class="obj" style="left:0;top:0">${C("b-rhyL", 890, 159, 280, 44, "every 2 steps", `color:${GOLD}`)}</div>` +
    C("b-bandL", 1040, 440, 900, 56, "quantum Fourier transform") +
    C("b-qftL", 1040, 440, 200, 80, "QFT", `color:${GOLD}`) +
    C("b-inside", 315, 442, 330, 40, "inside the QFT") +
    C("b-intfL", 320, 444, 340, 56, "interference", `color:${GOLD}`) +
    C("b-phase", 1680, 437, 190, 56, "phase", `color:${GOLD}`) +
    [1, 2, 3].map((k) => C(`b-ht${k}`, (COL[k - 1] + COL[k]) / 2, 296, 170, 40, "half turn")).join("") +
    [1, 3].map((i) => C(`b-pop${i}`, COL[i] + 44, CY + 40, 50, 44, "0")).join("") +
    C("b-tagOut", 315, 622, 200, 44, "output") +
    C("b-hCh", 315, 681, 330, 56, "chance") + C("b-hFr", 315, 738, 330, 40, "of each frequency") +
    COL.map((x, i) => C(`b-outN${i}`, x, 814, 60, 44, String(i))).join("") +
    [0, 2].map((i) => lbl(`b-p50${i}`, COL[i] + 50, 674, 120, 44, "50%", `text-align:left;color:${GOLD}`)).join("") +
    [1, 3].map((i) => C(`b-p0${i}`, COL[i], 748, 80, 40, "0%")).join("") +
    C("b-lenA", 1680, 415, 196, 40, "length sets") + C("b-lenB", 1680, 465, 196, 40, "the chance") +
    C("b-meas", 1680, 214, 180, 40, "measure") +
    C("b-qlab", 1680, 214, 180, 40, "2 qubits") +
    [0, 1].map((i) => C(`b-qd${i}`, 1640 + 80 * i, 150, 50, 48, `<span id="b-qds${i}">0</span>`)).join("");

  // ===================== Scene C: where the chord picture breaks (lines 11 to 13) =====================
  const RC = [1110, 1290, 1470, 1650], RB = 660, RW = 100, RH = 200;
  const crackPts = [[880, 130], [868, 200], [894, 262], [872, 330], [898, 400], [866, 470], [892, 540], [870, 610], [896, 680], [874, 742], [886, 800]];
  const rays = [-150, -120, -90, -60, -30].map((a) => {
    const t = (a * Math.PI) / 180, cx = RC[2], cy = RB - RH + 8;
    return r.line(fx(cx + Math.cos(t) * 64), fx(cy + Math.sin(t) * 58), fx(cx + Math.cos(t) * 92), fx(cy + Math.sin(t) * 84), goldPen({ strokeWidth: 3 }));
  }).join("");
  const SPEC = [120, 220, 90, 255, 150, 200, 70, 180];
  const cSvg =
    `<g id="b-cl">` +
    G("b-ear3", ear(540, 450, 1.12)) +
    [[1.5, 360], [3, 450], [5, 540]].map(([c, y], i) => CG(`b-cw${i}`, wave(170, 400, y, 26, [c], 3.4, 60 + i))).join("") +
    `</g>` +
    G("b-crack", r.linear(crackPts, pen({ strokeWidth: 3.6, roughness: 0.8 }))) +
    G("b-crBase", r.line(1030, RB, 1730, RB, pen({ strokeWidth: 3.4 }))) +
    [0, 2].map((i) => G(`b-cb${i}`, r.rect(RC[i] - RW / 2, RB - RH, RW, RH, pen({ strokeWidth: 3.2, roughness: 1 })) + r.rect(RC[i] - RW / 2 + 4, RB - RH + 4, RW - 8, RH - 8, hatch(INK)))).join("") +
    [0, 2].map((i) => `<g id="b-cbs${i}" style="opacity:0"><rect x="${RC[i] - RW / 2 + 2}" y="${RB - RH + 2}" width="${RW - 4}" height="${RH - 3}" fill="${GOLD}"/>${r.rect(RC[i] - RW / 2 + 3, RB - RH + 3, RW - 6, RH - 6, pen({ fill: GOLD, fillStyle: "solid", stroke: GOLD, strokeWidth: 3 }))}</g>`).join("") +
    G("b-pk", [0, 2].map((i) => r.rect(RC[i] - RW / 2 - 12, RB - RH - 12, RW + 24, RH + 12, goldPen({ strokeWidth: 2.6, roughness: 1.2 }))).join("")) +
    G("b-rays", rays) +
    `<g id="b-eyeBW">${G("b-eyeB", eye(1380, 150, 140, 3))}</g>` +
    `<g id="b-tbW">${G("b-tb", RC.map((x) => r.rect(x - 50, 290, 100, 80, pen({ strokeWidth: 2.8, roughness: 1 }))).join(""))}</g>` +
    `<circle id="b-cdot" r="12" fill="${GOLD}" stroke="${GROUND}" stroke-width="3" style="opacity:0"/>` +
    G("b-spec", r.line(240, 570, 760, 570, pen({ strokeWidth: 3 })) + SPEC.map((h, i) => r.rect(258 + 65 * i, 570 - h, 30, h, pen({ strokeWidth: 2.4, roughness: 1, fill: INK, fillStyle: "hachure", hachureGap: 7, fillWeight: 1.4 }))).join("")) +
    G("b-x", r.line(220, 290, 780, 590, pen({ strokeWidth: 7 })) + r.line(780, 290, 220, 590, pen({ strokeWidth: 7 })));
  const RUNS = [2, 0, 0, 2];
  const cHtml =
    C("b-every", 435, 670, 560, 48, "every note at once", `color:${GOLD}`) +
    RC.map((x, i) => C(`b-crN${i}`, x, 698, 60, 48, String(i))).join("") +
    C("b-crF", 1380, 762, 260, 44, "frequency") +
    lbl("b-meas2", 1464, 150 - 33, 200, 44, "measure", "text-align:left") +
    `<div id="b-tally" class="obj" style="left:0;top:0">` +
    RC.map((x, i) => C(`b-rl${i}`, x, 265, 110, 40, `run ${i + 1}`)).join("") +
    RC.map((x, i) => C(`b-rn${i}`, x, 330, 70, 56, String(RUNS[i]), `color:${GOLD}`)).join("") +
    `</div>` +
    lbl("b-ev", 196, 630 - 36, 300, 48, "every note", "text-align:right") +
    lbl("b-iyd", 506, 630 - 36, 300, 48, "in your data", "text-align:left") +
    C("b-ohr", 1380, 325, 700, 56, "one hidden rhythm", `color:${GOLD}`);

  // ===================== Scene D: Shor's algorithm (line 14) =====================
  const dSvg =
    CG("b-dBox", r.rect(850, 380, 220, 120, pen({ strokeWidth: 3.4, roughness: 1 })), GOLD) +
    CG("b-beat", r.line(860, 610, 1060, 610, pen({ strokeWidth: 2 })) +
      [0, 1, 2, 3].map((i) => r.line(870 + 60 * i, 596, 870 + 60 * i, 624, goldPen({ strokeWidth: 3.4 }))).join("") +
      [0, 1, 2].map((i) => r.curve([[876 + 60 * i, 590], [900 + 60 * i, 572], [924 + 60 * i, 590]], goldPen({ strokeWidth: 2.4 }))).join(""), GOLD) +
    G("b-dArIn", arrow(650, 440, 830, 440, { strokeWidth: 3.4 }, 18)) +
    G("b-dArOut", arrow(1090, 440, 1250, 440, { strokeWidth: 3.4 }, 18));
  const dHtml =
    C("b-shor", 960, 245, 700, 72, "Shor's algorithm") +
    C("b-dQft", 960, 440, 200, 72, "QFT", `color:${GOLD}`) +
    C("b-dFinds", 960, 544, 420, 40, "finds a hidden rhythm") +
    C("b-num", 475, 440, 300, 100, "3233") +
    C("b-fac", 1455, 440, 380, 100, "61 × 53", `color:${GOLD}`);

  // ===================== Scene E: closing card (lines 15 and 16) =====================
  const EIN = [390, 510, 630, 750], EOUT = [1180, 1300, 1420, 1540], EB = 500, EH = 110, EW = 60;
  const ehopPts = [[390, 382], [510, 326], [630, 382]];
  const eSvg =
    G("b-eArr", arrow(985, 135, 1085, 135, { strokeWidth: 4 }, 20)) +
    G("b-eInBase", r.line(330, EB, 810, EB, pen({ strokeWidth: 3.2 }))) +
    `<g id="b-eInBars">${[0, 2].map((i) => r.rect(EIN[i] - EW / 2, EB - EH, EW, EH, pen({ strokeWidth: 3, roughness: 1, fill: INK, fillStyle: "hachure", hachureGap: 8, fillWeight: 1.8 }))).join("")}</g>` +
    G("b-eBox", r.rect(870, 370, 180, 100, pen({ strokeWidth: 3.2, roughness: 1 })) + arrow(818, 420, 862, 420, { strokeWidth: 3 }, 12) + arrow(1058, 420, 1108, 420, { strokeWidth: 3 }, 12)) +
    G("b-eOutBase", r.line(1120, EB, 1600, EB, pen({ strokeWidth: 3.2 }))) +
    `<g id="b-eOutBars">${EOUT.map((x, i) => vbar(`b-eo${i}`, x - EW / 2, EW, EB - EH - 20, EB, 8)).join("")}</g>` +
    G("b-brace", r.curve([[340, 562], [348, 576], [560, 574], [570, 588], [580, 574], [792, 576], [800, 562]], pen({ strokeWidth: 2.8 }))) +
    CG("b-ehop", curveArrow(ehopPts, goldPen({ strokeWidth: 3.4 }), 15), GOLD) +
    `<g id="b-ehop2" style="opacity:0">${pathEl(wobbly(Array.from({ length: 41 }, (_, i) => { const u = i / 40; return [390 + 240 * u, 382 - 224 * u * (1 - u)]; }), 0.6, 9).d, 3.4, INK, ' id="b-ehop2p" style="stroke-dasharray:1 2;stroke-dashoffset:1"')}` +
    `<g id="b-ehop2h" style="opacity:0">${r.line(630, 382, 614, 368, pen({ strokeWidth: 3 })) + r.line(630, 382, 610, 384, pen({ strokeWidth: 3 }))}</g></g>` +
    G("b-eFArr", arrow(842, 732, 962, 732, { strokeWidth: 4.4 }, 22)) +
    G("b-eUnd", r.curve([[1394, 800], [1460, 794], [1536, 800]], goldPen({ strokeWidth: 4.4, roughness: 1 })));
  const eHtml =
    lbl("b-eQft", 520, 135 - 64, 200, 84, "QFT:", "text-align:right") +
    lbl("b-eRhy", 740, 135 - 64, 230, 84, "rhythm", "text-align:left") +
    lbl("b-ePos", 1105, 135 - 64, 320, 84, "position", `text-align:left;color:${GOLD}`) +
    C("b-eQL", 960, 420, 170, 56, "QFT") +
    EIN.map((x, i) => C(`b-eiN${i}`, x, 529, 50, 40, String(i))).join("") +
    EOUT.map((x, i) => C(`b-eoN${i}`, x, 529, 50, 40, String(i))).join("") +
    C("b-eN", 570, 612, 360, 44, "N = 4 readings") +
    C("b-eR", 510, 280, 280, 44, "r = 2 steps", `color:${GOLD}`) +
    C("b-eNr", 1360, 612, 400, 44, "N/r = 4/2 = 2") +
    lbl("b-eF1", 200, 732 - 76, 620, 100, "every r steps", "text-align:right") +
    lbl("b-eF2", 980, 732 - 76, 680, 100, "multiples of N/r", `text-align:left;color:${GOLD}`);

  // ===================== HTML =====================
  const html = `
    ${full("b-sa", aSvg, aHtml)}
    ${full("b-sm", bSvg, bHtml)}
    ${full("b-sc", cSvg, cHtml)}
    ${full("b-sd", dSvg, dHtml)}
    ${full("b-se", eSvg, eHtml)}
  `;

  // ===================== Timeline =====================
  const script = `
    const T = ${JSON.stringify(T)};
    const INK = "${INK}", GOLD = "${GOLD}";
    const COL = ${JSON.stringify(COL)}, BW = ${BW}, IN_B = ${IN_B}, IN_U = ${IN_U}, OUT_B = ${OUT_B}, OUT_U = ${OUT_U}, CY = ${CY}, HR = ${HR};
    const WAVES = ${JSON.stringify(WAVES)}, RC = ${JSON.stringify(RC)}, RB = ${RB}, RH = ${RH}, RUNS = ${JSON.stringify(RUNS)};
    const EOUT = ${JSON.stringify(EOUT)}, EB = ${EB}, EH = ${EH}, EW = ${EW};
    const f1 = (v) => v.toFixed(1);
    const S = (segs, t, init) => sched(segs, t, init);
    const DEG = Math.PI / 180;
    const clamp = (u) => Math.min(1, Math.max(0, u));
    // 1 inside [a, b], with soft edges of r seconds.
    const win = (t, a, b, r) => clamp((t - a) / r) * clamp((b - t) / r);
    const bump = (t, a, d) => (t > a && t < a + d ? Math.sin((Math.PI * (t - a)) / d) : 0);
    function setBar(id, x, w, base, unit, a, g) {
      const top = base - unit * a, y0 = Math.min(top, base), h = Math.abs(base - top);
      const cr = $(id + "-cr"); cr.setAttribute("y", f1(y0)); cr.setAttribute("height", f1(h));
      const o = $(id + "-o");
      o.setAttribute("d", h < 1 ? "" : "M" + f1(x) + " " + base + " L" + f1(x + 0.6) + " " + f1(top) + " L" + f1(x + w - 0.6) + " " + f1(top + 0.8) + " L" + f1(x + w) + " " + base);
      o.setAttribute("stroke", g > 0.5 ? GOLD : INK);
      $(id + "-fg").style.opacity = String(g); $(id + "-fi").style.opacity = String(1 - g);
    }
    const PAIRS = ["00", "01", "10", "11"];

    onFrame((t) => {
      // ===== Line 2: a dot rides along each pure wave, all at the same sideways speed =====
      const ride = t >= T.how;
      for (let i = 0; i < 3; i++) {
        const d = $("b-ride" + i);
        if (!ride) { d.style.opacity = "0"; continue; }
        const u = ((t - T.how) / 1.6) % 1;
        d.setAttribute("cx", f1(1400 + 240 * u));
        d.setAttribute("cy", f1(WAVES[i][1] - 36 * Math.sin(2 * Math.PI * WAVES[i][0] * u)));
        d.style.opacity = String(Math.min(1, (t - T.how) / 0.2) * Math.min(1, Math.sin(Math.PI * u) * 6));
      }

      // ===== Tier 1: the input amplitudes =====
      const st = (i) => T.amps + 0.1 * i;
      let a0 = S([[st(0), st(0) + 0.7, 0, 0.8], [T.equal, T.equal + 0.8, 0.8, 0.71]], t, 0);
      const a1 = S([[st(1), st(1) + 0.7, 0, 0.4], [T.leaving, T.leaving + 0.7, 0.4, 0]], t, 0);
      let a2 = S([[st(2), st(2) + 0.7, 0, 0.2], [T.equal, T.equal + 0.8, 0.2, 0.71]], t, 0);
      const a3 = S([[st(3), st(3) + 0.7, 0, 0.4], [T.leaving, T.leaving + 0.7, 0.4, 0]], t, 0);
      if (t > T.numbers && t < T.numbers + 0.6) a0 += (6 / IN_U) * Math.sin((2 * Math.PI * (t - T.numbers)) / 0.2) * (1 - (t - T.numbers) / 0.6);
      a0 *= 1 + 0.08 * bump(t, T.zero8, 0.35);
      a2 *= 1 + 0.08 * bump(t, T.from2, 0.35);
      const fl = (i) => win(t, T.four4 + 0.34 * i, T.four4 + 0.34 * (i + 1), 0.06);
      const g0 = Math.max(win(t, T.numbers, T.l4, 0.2), win(t, T.equal, T.pattern5, 0.2), win(t, T.input7, T.from2, 0.2), fl(0));
      const g2 = Math.max(win(t, T.equal, T.pattern5, 0.2), win(t, T.from2, T.l9, 0.2), fl(2));
      [a0, a1, a2, a3].forEach((a, i) => setBar("b-in" + i, COL[i] - BW / 2, BW, IN_B, IN_U, a, [g0, fl(1), g2, fl(3)][i]));

      // Line 4: the two qubits step through 00, 01, 10, 11
      const step = Math.max(0, Math.min(3, Math.floor((t - T.four4) / 0.34)));
      const pair = t < T.four4 ? "00" : PAIRS[step];
      const sw = t < T.four4 || t > T.four4 + 1.36 ? 1 : clamp(((t - T.four4) % 0.34) / 0.08);
      for (let q = 0; q < 2; q++) { const el = $("b-qds" + q); el.textContent = pair[q]; el.style.opacity = String(step === 0 && t < T.four4 + 0.34 ? 1 : sw); }

      // ===== Line 10: one number slides the pattern =====
      const s = S([[T.slide, T.three10, 0, 1], [T.wherever, T.starts, 1, 0]], t, 0);
      $("b-inBars").setAttribute("transform", "translate(" + f1(290 * s) + " 0)");
      $("b-rhythmW").setAttribute("transform", "translate(" + f1(290 * s) + " 0)");
      $("b-rhyLW").style.transform = "translateX(" + f1(290 * s) + "px)";

      // ===== Tier 2: clock hands (degrees clockwise from up) =====
      const rock = t > T.where && t < T.where + 1.1 ? 25 * Math.sin((2 * Math.PI * (t - T.where)) / 1.1) : 0;
      for (let k = 0; k < 4; k++) {
        const aS = 90 * s * k + (k === 3 ? rock : 0);
        const aD = Math.min(180 * k, Math.max(0, (t - T.turns) * 540)) + 90 * s * k;
        const u = k % 2 === 0 ? S([[T.add, T.add + 0.5, 0, 1]], t, 0) : S([[T.cancels, T.cancels + 0.4, 0, 1], [T.pop + 0.15, T.pop + 0.55, 1, 0]], t, 0);
        const rad = aS * DEG, ux = Math.sin(rad), uy = -Math.cos(rad), po = 6 * (1 - u);
        $("b-hs" + k).setAttribute("transform", "rotate(" + aS.toFixed(2) + " " + COL[k] + " " + CY + ")");
        $("b-hd" + k).setAttribute("transform", "translate(" + f1(ux * HR * u + Math.cos(rad) * po) + " " + f1(uy * HR * u + Math.sin(rad) * po) + ") rotate(" + aD.toFixed(2) + " " + COL[k] + " " + CY + ")");
      }

      // ===== Tier 3: the output chances, only ever 50%, 0%, 50%, 0% =====
      const p = 0.5 * S([[T.peaks6, T.peaks6 + 0.9, 0, 1]], t, 0) * (1 + 0.06 * bump(t, T.stay, 0.3));
      setBar("b-out0", COL[0] - BW / 2, BW, OUT_B, OUT_U, p, 1);
      setBar("b-out2", COL[2] - BW / 2, BW, OUT_B, OUT_U, p * (1 + 0.06 * bump(t, T.put, 0.4)), 1);
      setBar("b-out1", COL[1] - BW / 2, BW, OUT_B, OUT_U, 0, 1);
      setBar("b-out3", COL[3] - BW / 2, BW, OUT_B, OUT_U, 0, 1);

      // ===== Line 12: four runs, one reading each =====
      for (let i = 0; i < 2; i++) {
        const col = i * 2;
        let g = 0;
        T.runs.forEach((r0, j) => { if (RUNS[j] === col) g = Math.max(g, win(t, r0, r0 + 0.45, 0.06)); });
        if (col === 2) g = Math.max(g, clamp((t - T.plenty) / 0.25));
        $("b-cbs" + col).style.opacity = String(g);
      }
      const dot = $("b-cdot");
      let shown = false;
      T.runs.forEach((r0, j) => {
        const u = (t - r0 - 0.05) / 0.4;
        if (u < 0 || u > 1) return;
        const e = ease.inOut(u), x0 = RC[RUNS[j]], y0 = RB - RH - 8, x1 = RC[j], y1 = 330;
        const x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e - 150 * Math.sin(Math.PI * e);
        dot.setAttribute("cx", f1(x)); dot.setAttribute("cy", f1(y));
        dot.style.opacity = String(Math.min(1, (1 - u) * 5)); shown = true;
      });
      if (!shown) dot.style.opacity = "0";

      // ===== Closing card: output bars rise on "position", bounce on "lands", breathe in the hold =====
      const eh = S([[T.position, T.position + 0.7, 0, 1]], t, 0) * (1 + 0.07 * bump(t, T.lands, 0.35)) + (t > T.end ? (4 / EH) * Math.sin((2 * Math.PI * (t - T.end)) / 1.6) : 0);
      for (let i = 0; i < 4; i++) setBar("b-eo" + i, EOUT[i] - EW / 2, EW, EB, EH, i % 2 === 0 ? eh : 0, 1);
      // The hop on the input chart redraws every 1.2 s through the hold.
      const h2 = $("b-ehop2"), hp = $("b-ehop2p");
      if (t > T.end) {
        const u = ((t - T.end) % 1.2) / 1.2;
        hp.style.strokeDashoffset = String(1 - clamp(u / 0.45));
        $("b-ehop2h").style.opacity = u > 0.45 ? "1" : "0";
        h2.style.opacity = String(Math.min(1, (1 - u) * 5));
      } else h2.style.opacity = "0";
    });

    // ===== Line 0: a piano chord and an ear =====
    draw("#b-piano", T.piano, 1.0);
    hide(["#b-kp0", "#b-kp1", "#b-kp2"]);
    [0, 1, 2].forEach((j) => {
      tl.fromTo("#b-kp" + j, { opacity: 0, y: 0 }, { opacity: 1, y: 8, duration: 0.15, ease: "power2.out" }, T.chord0 + 0.12 * j);
    });
    draw("#b-ticks", T.chord0 + 0.3, 0.3);
    write("#b-chordL", T.chord0 + 0.1, 0.35);
    draw("#b-ear", T.ear0, 0.8);
    blurOut("#b-title", T.pick);
    write("#b-q0", T.pick, 0.3);
    fade("#b-q0", 0, T.l1, 0.3);
    fade("#b-ticks", 0, T.l1, 0.3);

    // ===== Line 1: one tangled wave, three notes =====
    draw("#b-tangle", T.tangled, 1.3);
    write("#b-oneWave", T.wave1, 0.5);
    tl.to(["#b-kp0", "#b-kp1", "#b-kp2", "#b-chordL"], { color: INK, duration: 0.3 }, T.yet);
    [1, 2, 3].forEach((i) => draw("#b-w" + i, T.three1 + 0.25 * (i - 1), 0.5));

    // ===== Line 2: the ear splits it into frequencies =====
    tl.to("#b-ear", { scale: 1.06, svgOrigin: "1210 520", duration: 0.16, yoyo: true, repeat: 1 }, T.splits);
    draw("#b-fanE", T.splits + 0.05, 0.5);
    tl.to("#b-tangle", { opacity: 0.35, duration: 0.12, yoyo: true, repeat: 1 }, T.splits + 0.1);
    write("#b-freqs", T.freq2, 0.65);
    tl.to(["#b-w1", "#b-w2", "#b-w3"], { color: INK, duration: 0.3 }, T.how);
    write("#b-tag0", T.fast, 0.25);
    write("#b-tag1", T.each2, 0.3);
    write("#b-tag2", T.note2, 0.35);
    write("#b-fourier", T.fourier, 0.9);
    draw("#b-fund", T.transform2, 0.5);
    tl.to("#b-freqs", { color: INK, duration: 0.3 }, T.transform2);
    blurOut("#b-sa", T.outA);

    // ===== Line 3: the QFT does the same to amplitudes =====
    draw("#b-band", T.quantum3, 0.9);
    write("#b-bandL", T.quantum3 + 0.3, 1.0);
    fade("#b-bandL", 0, T.qft3, 0.25);
    write("#b-qftL", T.qft3 + 0.1, 0.4);
    draw("#b-inBase", T.amps, 0.5);
    write("#b-hAmp", T.amps + 0.1, 0.55);
    draw("#b-arIn", T.amps + 0.5, 0.5);
    tl.to("#b-qftL", { color: INK, duration: 0.3 }, T.amps);
    [0, 1, 2, 3].forEach((i) => write("#b-pc" + i, T.chance3 + 0.1 * i, 0.25));
    write("#b-hSets", T.chance3 + 0.1, 0.6);
    draw("#b-eyeS", T.when3, 0.35);
    write("#b-meas", T.you3, 0.45);
    fade(["#b-pc0", "#b-pc1", "#b-pc2", "#b-pc3", "#b-hSets", "#b-eyeS", "#b-meas"], 0, T.l4, 0.3);

    // ===== Line 4: two qubits, four readings =====
    draw("#b-q", T.two4, 0.45);
    write("#b-qlab", T.two4 + 0.3, 0.5);
    write(["#b-qd0", "#b-qd1"], T.bits, 0.2);
    [0, 1, 2, 3].forEach((i) => write("#b-inN" + i, T.zero4 + 0.15 * i, 0.15));
    fade(["#b-q", "#b-qlab", "#b-qd0", "#b-qd1"], 0, T.l5, 0.3);

    // ===== Line 5: equal amplitudes on 0 and 2, repeating every two steps =====
    draw("#b-level", T.two5, 0.4);
    fade("#b-level", 0, T.two5 + 1.2, 0.3);
    write(["#b-z1", "#b-z3"], T.empty, 0.2);
    draw("#b-rhythm", T.repeats, 0.5);
    write("#b-rhyL", T.two5b, 0.5);
    fade("#b-z1", 0, T.two5b, 0.25);
    fade("#b-z3", 0, T.two5b, 0.25);

    // ===== Line 6: run the QFT; peaks at 0 and 2 =====
    tl.to(["#b-rhythm", "#b-rhyL"], { color: INK, duration: 0.3 }, T.run);
    tl.to(["#b-band", "#b-qftL"], { color: GOLD, duration: 0.2 }, T.run);
    tl.set(["#b-swT", "#b-swB"], { opacity: 1 }, T.run);
    tl.fromTo(["#b-swT", "#b-swB"], { strokeDashoffset: 0.22 }, { strokeDashoffset: -1, duration: 0.9, ease: "power1.inOut" }, T.run);
    tl.set(["#b-swT", "#b-swB"], { opacity: 0 }, T.run + 0.92);
    tl.to("#b-arIn", { y: 10, duration: 0.18, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.run + 0.1);
    tl.to(["#b-band", "#b-qftL"], { color: INK, duration: 0.3 }, T.chance6 - 0.15);
    draw("#b-outBase", T.chance6, 0.5);
    write("#b-hCh", T.chance6, 0.4);
    draw("#b-arOut", T.chance6 + 0.1, 0.35);
    write("#b-hFr", T.freq6, 0.6);
    [0, 1, 2, 3].forEach((i) => write("#b-outN" + i, T.freq6 + 0.12 * i, 0.15));
    write("#b-p500", T.zero6, 0.3);
    write("#b-p502", T.two6, 0.3);

    // ===== Line 7: clock hands inside the QFT =====
    blurOut(["#b-band", "#b-qftL", "#b-arIn", "#b-arOut"], T.heres);
    fade(["#b-outBars", "#b-p500", "#b-p502"], 0.3, T.heres, 0.4);
    [0, 1, 2, 3].forEach((i) => draw("#b-ck" + i, T.heres + 0.15 + 0.12 * i, 0.5));
    write("#b-inside", T.heres + 0.3, 0.6);
    write("#b-tagIn", T.input7, 0.3);
    draw("#b-fanA", T.sends, 0.6);
    write("#b-tagOut", T.output7, 0.35);
    [0, 1, 2, 3].forEach((i) => draw("#b-hs" + i, T.clock + 0.1 * i, 0.25));
    fade("#b-fanA", 0.25, T.clock + 0.2, 0.3);
    draw("#b-rock", T.where, 0.4);
    write("#b-phase", T.phase7, 0.45);
    fade(["#b-phase", "#b-rock", "#b-fanA"], 0, T.l8, 0.3);

    // ===== Line 8: from 0 every hand points up; from 2 each turns half a circle more =====
    tl.to(["#b-hs0", "#b-hs1", "#b-hs2", "#b-hs3"], { color: INK, duration: 0.3 }, T.l8);
    [0, 1, 2, 3].forEach((i) => {
      tl.to("#b-hs" + i, { color: GOLD, duration: 0.12 }, T.every8 + 0.15 * i);
      tl.to("#b-hs" + i, { color: INK, duration: 0.25 }, T.up8 - 0.15);
    });
    draw("#b-fanB", T.from2 + 0.05, 0.4);
    [0, 1, 2, 3].forEach((i) => draw("#b-hd" + i, T.two8 + 0.05 * i, 0.25));
    fade("#b-fanB", 0.2, T.two8 + 0.3, 0.3);
    fade("#b-fanB", 0, T.turns + 0.3, 0.3);
    [1, 2, 3].forEach((k) => {
      draw("#b-hop" + k, T.turns + k / 3, 0.3);
      write("#b-ht" + k, T.turns + k / 3 + 0.05, 0.35);
    });
    fade(["#b-hop1", "#b-hop2", "#b-hop3", "#b-ht1", "#b-ht2", "#b-ht3"], 0, T.l9 + 0.2, 0.3);
    tl.to(["#b-hd0", "#b-hd1", "#b-hd2", "#b-hd3"], { color: INK, duration: 0.3 }, T.l9);

    // ===== Line 9: they cancel at 1 and 3, they add at 0 and 2 =====
    fade(["#b-ckw0", "#b-ckw2"], 0.35, T.outputs, 0.3);
    fade("#b-inside", 0, T.outputs, 0.3);
    [1, 3].forEach((k) => {
      tl.to("#b-hs" + k, { color: GOLD, duration: 0.1 }, T.up9);
      tl.to("#b-hs" + k, { color: INK, duration: 0.15 }, T.up9 + 0.3);
      tl.to("#b-hd" + k, { color: GOLD, duration: 0.1 }, T.cancels);
      tl.to("#b-hd" + k, { color: INK, duration: 0.2 }, T.pop + 0.15);
      tl.fromTo("#b-pop" + k, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2.5)" }, T.pop);
      fade("#b-pop" + k, 0, T.pop + 1.9, 0.3);
      fade(["#b-hs" + k, "#b-hd" + k], 0.3, T.pop + 0.15, 0.4);
      write("#b-p0" + k, T.pop + 0.3, 0.3);
    });
    fade(["#b-ckw1", "#b-ckw3"], 0.35, T.while9, 0.3);
    fade(["#b-ckw0", "#b-ckw2"], 1, T.zero9, 0.3);
    tl.to(["#b-hs0", "#b-hd0", "#b-hs2", "#b-hd2"], { color: GOLD, duration: 0.2 }, T.add);
    fade(["#b-outBars", "#b-p500", "#b-p502"], 1, T.add, 0.4);
    write("#b-intfL", T.intf, 0.75);
    draw("#b-intfU", T.intf + 0.6, 0.35);
    fade(["#b-ckw1", "#b-ckw3"], 1, T.intf, 0.3);

    // ===== Line 10: slide the pattern, the peaks stay put =====
    fade(["#b-intfL", "#b-intfU"], 0, T.slide, 0.3);
    [0, 2].forEach((i) => draw("#b-ring" + i, T.peaks10 + 0.1 * i, 0.4));
    write("#b-lenA", T.put, 0.45);
    write("#b-lenB", T.put + 0.35, 0.45);
    tl.fromTo(["#b-hs2", "#b-hd2", "#b-out2"], { filter: "drop-shadow(0 0 0px rgba(217,180,99,0))" }, { filter: "drop-shadow(0 0 14px rgba(217,180,99,1))", duration: 0.25, yoyo: true, repeat: 1 }, T.put + 0.1);
    draw("#b-ear2", T.hears, 0.6);
    tl.to(["#b-rhythm", "#b-rhyL"], { color: GOLD, duration: 0.3 }, T.rhythm10);
    blurOut("#b-sm", T.l11);

    // ===== Line 11: your ear hears every note at once =====
    draw("#b-ear3", T.chord11, 0.8);
    [0, 1, 2].forEach((i) => draw("#b-cw" + i, T.chord11 + 0.2 * i, 0.6));
    draw("#b-crack", T.breaks, 0.5);
    tl.to(["#b-cw0", "#b-cw1", "#b-cw2"], { color: GOLD, duration: 0.15 }, T.every11);
    tl.to("#b-ear3", { scale: 1.06, svgOrigin: "540 450", duration: 0.16, yoyo: true, repeat: 1 }, T.every11);
    write("#b-every", T.every11, T.at11 - T.every11);

    // ===== Line 12: measuring gives one frequency per run =====
    fade("#b-cl", 0.4, T.l12, 0.3);
    fade("#b-every", 0.4, T.l12, 0.3);
    tl.to("#b-every", { color: INK, duration: 0.3 }, T.l12);
    tl.to(["#b-cw0", "#b-cw1", "#b-cw2"], { color: INK, duration: 0.3 }, T.l12);
    fade("#b-crack", 0.35, T.l12, 0.3);
    draw("#b-crBase", T.l12 + 0.1, 0.3);
    draw(["#b-cb0", "#b-cb2"], T.l12 + 0.2, 0.4);
    write(["#b-crN0", "#b-crN1", "#b-crN2", "#b-crN3"], T.l12 + 0.3, 0.3);
    write("#b-crF", T.l12 + 0.45, 0.4);
    draw("#b-eyeB", T.measuring, 0.3);
    write("#b-meas2", T.measuring + 0.1, 0.35);
    draw("#b-tb", T.gives, 0.3);
    write(["#b-rl0", "#b-rl1", "#b-rl2", "#b-rl3"], T.gives + 0.05, 0.25);
    T.runs.forEach((r0, j) => {
      write("#b-rn" + j, r0 + 0.4, 0.2);
      tl.to("#b-rn" + j, { color: INK, duration: 0.25 }, (j < 3 ? T.runs[j + 1] : r0 + 0.8));
    });
    draw("#b-pk", T.peaks12 - 0.05, 0.3);
    fade("#b-pk", 0, T.peaks12 + 0.6, 0.3);

    // ===== Line 13: no good for every note, plenty for one hidden rhythm =====
    blurOut(["#b-cl", "#b-every"], T.l13);
    draw("#b-spec", T.l13 + 0.2, 0.5);
    draw("#b-x", T.good, 0.4);
    write("#b-ev", T.every13, 0.4);
    write("#b-iyd", T.your13, 0.5);
    blurOut(["#b-tally", "#b-tbW", "#b-eyeBW", "#b-meas2"], T.plenty);
    draw("#b-rays", T.plenty + 0.15, 0.35);
    write("#b-ohr", T.one13, 0.7);
    blurOut("#b-sc", T.l14);

    // ===== Line 14: Shor's algorithm =====
    write("#b-shor", T.shors, 0.8);
    draw("#b-dBox", T.finds, 0.4);
    write("#b-dQft", T.finds + 0.2, 0.3);
    write("#b-dFinds", T.one14, 0.6);
    draw("#b-beat", T.one14 + 0.2, 0.5);
    tl.to(["#b-dBox", "#b-dQft"], { color: INK, duration: 0.3 }, T.uses);
    draw("#b-dArOut", T.uses + 0.1, 0.35);
    write("#b-num", T.break14, T.huge + 0.26 - T.break14);
    draw("#b-dArIn", T.huge, 0.35);
    write("#b-fac", T.factors, 0.5);
    tl.to("#b-beat", { color: INK, duration: 0.3 }, T.factors);
    blurOut("#b-sd", T.l15 + 0.5);

    // ===== Line 15: the QFT turns rhythm into position =====
    draw("#b-eInBase", T.l15 + 0.75, 0.3);
    draw("#b-eInBars", T.l15 + 0.9, 0.4);
    write(["#b-eiN0", "#b-eiN1", "#b-eiN2", "#b-eiN3"], T.l15 + 1.0, 0.3);
    draw("#b-eBox", T.l15 + 1.15, 0.45);
    write("#b-eQL", T.l15 + 1.3, 0.25);
    draw("#b-eOutBase", T.l15 + 1.4, 0.3);
    write(["#b-eoN0", "#b-eoN1", "#b-eoN2", "#b-eoN3"], T.l15 + 1.5, 0.3);
    write("#b-eQft", T.qft15, 0.3);
    write("#b-eRhy", T.rhythm15, 0.45);
    draw("#b-eArr", T.arrow15, 0.25);
    write("#b-ePos", T.position, 0.5);

    // ===== Line 16: every r steps lands on multiples of N over r =====
    draw("#b-brace", T.nRead, 0.35);
    write("#b-eN", T.nRead + 0.15, 0.55);
    tl.to("#b-eInBars", { scaleY: 1.07, svgOrigin: "570 500", duration: 0.15, yoyo: true, repeat: 1 }, T.pattern16);
    draw("#b-ehop", T.repeating, 0.3);
    write("#b-eR", T.every16, 0.3);
    write("#b-eF1", T.steps16, 0.4);
    draw("#b-eFArr", T.lands, 0.3);
    write("#b-eF2", T.multiples, 0.6);
    tl.to(["#b-ehop", "#b-eR"], { color: INK, duration: 0.3 }, T.multiples);
    draw("#b-eUnd", T.nr, 0.3);
    write("#b-eNr", T.nr, 0.3);
    fade("#b-ehop", 0, T.end, 0.15);
  `;

  return { html, script };
}
