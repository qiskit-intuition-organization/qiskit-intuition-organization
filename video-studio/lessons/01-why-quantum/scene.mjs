// Lesson 1, "Why quantum computers?". Four scenes, never stacked:
// A the myth (lines 0 to 2), B the harbour (3 to 6), C paths and amplitudes (7 to 14),
// D what it means (15 to 18). One visual language carries B to D: height above a baseline.
// A crest is a bar up, a trough a bar down; amplitudes are the same little up and down bars.
export const phrases = [
  ["plus a half", "+½"],
  ["minus a half", "−½"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, wobbly, lbl, cue, lines, INK, GOLD, GROUND, DIM } = k;

  // ---------- Timing ----------
  // The transcriber glues "H" to the next word ("Hmakes"), so look words up by substring.
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9']/g, "");
  const w = (line, word, nth = 0, off = 0) => {
    const hits = lines[line].words.filter((x) => norm(x.w).includes(norm(word)));
    return hits[nth] ? +(hits[nth].start + off).toFixed(3) : cue(line, word, nth, off);
  };
  const T = {
    // A
    qc: w(0, "quantum", 0, -0.05), laptop: w(0, "laptop", 0, -0.15), fast: w(0, "fast", 0, -0.1),
    aOut: w(1, "maybe", 0, 0.15), every: w(1, "every", 0, -0.15), once: cue(1, "once", 0, -0.1),
    looking: w(2, "looking", 0, -0.1), measuring: w(2, "measuring", 0, -0.05), one: w(2, "one", 0, -0.05),
    random: w(2, "random", 0, -0.05), guess: 10.0, sceneA: 11.4,
    // B
    interf: w(3, "interference", 0, -0.1), add: w(3, "adding", 0, -0.15), cancel: w(3, "cancelling", 0, -0.15),
    sceneB1: w(4, "picture", 0, 0),
    waves: w(4, "waves", 0, -0.1), through: w(4, "through", 0, -0.15), gaps: w(4, "two", 0, -0.05),
    harbour: w(4, "harbour", 0, -0.05), spread: w(4, "spreading", 0, -0.1), beach: w(4, "out", 1, -0.2),
    crest: w(5, "crest", 0, -0.08), trough: w(5, "trough", 0, -0.08), water: w(5, "water", 0, -0.05),
    flat: lines[5].end - 0.15,
    l6: lines[6].start, crests: w(6, "crests", 0, -0.1), meet: w(6, "meet", 0, -0.05), grows: w(6, "grows", 0, -0.2),
    move: w(6, "move", 0, 0), spots: w(6, "spots", 0, -0.05), sceneB2: w(7, "quantum", 0, -0.35),
    // C1
    start: w(7, "quantum", 0, -0.08), answers: w(7, "answers", 0, -0.1), paths: w(7, "paths", 0, -0.08),
    number: w(7, "number", 0, -0.08), amplitude: w(7, "amplitude", 0, -0.08),
    height: w(8, "wave", 0, -0.08), positive: w(8, "positive", 0, -0.08), negative: w(8, "negative", 0, -0.08),
    addup: w(8, "add", 0, -0.1),
    chance: w(9, "chance", 0, -0.08), size: w(9, "size", 0, -0.08), squared: 41.1, sceneC1: 42.55,
    // C2
    qubit: w(10, "qubit", 0, -0.1), reads: w(10, "reads", 0, -0.08), rz: w(10, "zero", 0, -0.08), ro: w(10, "one", 1, -0.08), starting: w(10, "starting", 0, -0.05), zero: lines[10].end - 0.55,
    step: w(11, "step", 0, -0.08), H1: w(11, "makes", 0, -0.15), makes: w(11, "makes", 0, 0.05), fifty: w(11, "50", 0, -0.05),
    coin: w(11, "coin", 0, -0.15), coinOut: w(12, "twice", 0, -0.15),
    twice: w(12, "twice", 0, -0.1), splits: w(12, "splits", 0, 0.0), four: w(12, "four", 0, -0.1),
    toOne: w(13, "paths", 0, -0.08), plusA: w(13, "plus", 0, -0.08), minusA: w(13, "minus", 0, -0.08), cancelC: w(13, "cancel", 0, -0.15),
    toZero: w(14, "paths", 0, -0.08), plusB: w(14, "plus", 0, -0.08), adding: w(14, "adding", 0, -0.08),
    always: w(14, "always", 0, -0.05), sceneC2: lines[15].start,
    // D
    dWater: w(15, "water", 0, -0.1), never: w(15, "never", 0, -0.15), see: w(15, "see", 0, 0),
    run: w(15, "run", 0, -0.1), oneAns: w(15, "answer", 0, -0.2), sceneD1: lines[16].start,
    algorithm: w(16, "algorithm", 0, -0.08), recipe: w(16, "recipe", 0, -0.08), puts: w(16, "puts", 0, -0.05),
    calm: w(16, "calm", 0, 0), wrong: w(16, "wrong", 0, -0.05), right: w(16, "right", 0, -0.1),
    likely: w(16, "likely", 0, -0.12), sceneD2: lines[17].start + 0.9,
    hidden: w(17, "hidden", 0, -0.1), factoring: w(17, "factoring", 0, -0.08), molecules: w(17, "molecules", 0, -0.12),
    everyday: w(17, "everyday", 0, -0.1), wins: w(17, "wins", 0, -0.15), sceneD3: lines[18].start + 0.65,
    speedups: w(18, "speed", 0, -0.05), interf2: w(18, "interference", 0, -0.08), wrong2: w(18, "wrong", 0, -0.08),
    cancel2: w(18, "cancel", 0, -0.12), right2: w(18, "right", 0, -0.06), reinforce: w(18, "reinforce", 0, -0.3),
  };

  // ---------- Shared drawing helpers ----------
  const hachure = (color = INK, o = {}) => pen({ stroke: "none", fill: color, fillStyle: "hachure", hachureGap: 9, fillWeight: 1.8, ...o });
  const rrPath = (x, y, wd, ht, rad = 14) =>
    `M${x + rad} ${y} L${x + wd - rad} ${y} Q${x + wd} ${y} ${x + wd} ${y + rad} L${x + wd} ${y + ht - rad} Q${x + wd} ${y + ht} ${x + wd - rad} ${y + ht} L${x + rad} ${y + ht} Q${x} ${y + ht} ${x} ${y + ht - rad} L${x} ${y + rad} Q${x} ${y} ${x + rad} ${y} Z`;
  const CARD = { w: 110, h: 140 };
  const cardSvg = (cx, cy, o = {}) => r.path(rrPath(cx - CARD.w / 2, cy - CARD.h / 2, CARD.w, CARD.h), pen({ roughness: 0.9, strokeWidth: 2.8, ...o }));
  const cardNum = (id, cx, cy, n, extra = "") => lbl(id, cx - 55, cy - 44, 110, 58, String(n), extra);
  const clbl = (id, cx, top, wd, size, html, extra = "") => lbl(id, cx - wd / 2, top, wd, size, html, extra);
  const BAR_W = 26;
  // A bar standing on (0,0): up bars rise to -h, down bars hang to +h.
  const barSvg = (h, color = INK, down = false) =>
    r.rect(-BAR_W / 2, down ? 0 : -h, BAR_W, h, pen({ stroke: color, strokeWidth: 2.6, fill: color, fillStyle: "hachure", hachureGap: 7, fillWeight: 1.6, roughness: 0.8 }));
  // A mover: outer group placed by onFrame, inner group drawn by the timeline.
  const mover = (id, inner) => `<g id="${id}-p"><g id="${id}">${inner}</g></g>`;
  const eyeSvg = (cx, cy, wd, ht) =>
    r.curve([[cx - wd / 2, cy], [cx - wd / 4, cy - ht * 0.85], [cx + wd / 4, cy - ht * 0.85], [cx + wd / 2, cy]], pen({ strokeWidth: 3 })) +
    r.curve([[cx - wd / 2, cy], [cx - wd / 4, cy + ht * 0.7], [cx + wd / 4, cy + ht * 0.7], [cx + wd / 2, cy]], pen({ strokeWidth: 3 })) +
    r.circle(cx, cy, ht * 1.25, pen({ strokeWidth: 2.4 })) +
    r.circle(cx, cy, ht * 0.55, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1.4 })) +
    [-0.3, 0, 0.3].map((a) => r.line(cx + a * wd * 0.7, cy - ht * 0.72, cx + a * wd * 0.85, cy - ht * 1.15, pen({ strokeWidth: 2 }))).join("");
  const laptopSvg = (ox, oy, screen = "") =>
    r.rect(ox + 30, oy, 360, 225, pen({ strokeWidth: 3.2 })) +
    r.rect(ox + 48, oy + 16, 324, 190, pen({ strokeWidth: 1.8, roughness: 1 })) +
    r.poly([[ox + 10, oy + 232], [ox + 410, oy + 232], [ox + 440, oy + 282], [ox - 20, oy + 282]], pen({ strokeWidth: 3 })) +
    r.line(ox + 30, oy + 250, ox + 390, oy + 250, pen({ strokeWidth: 1.6 })) +
    r.line(ox + 20, oy + 264, ox + 400, oy + 264, pen({ strokeWidth: 1.6 })) +
    screen;
  const tickSvg = (x, y, s = 1) => r.linear([[x, y], [x + 22 * s, y + 24 * s], [x + 64 * s, y - 34 * s]], goldPen({ strokeWidth: 6, roughness: 0.9 }));
  const PAD = `background:rgba(23,25,28,0.86);border-radius:10px;`;
  const G = `color:${GOLD};`;
  const svgBoard = (inner, extra = "") => `<svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080" ${extra}>${inner}</svg>`;
  const full = (id, inner) => `<div id="${id}" class="obj" style="left:0;top:0;width:1920px;height:1080px">${inner}</div>`;

  // =====================================================================
  // Scene A: the myth
  // =====================================================================
  const cyl = (cx, y, wd, ht = 44, th = 16) =>
    r.ellipse(cx, y, wd, ht, pen({ strokeWidth: 2.8 })) +
    r.line(cx - wd / 2, y, cx - wd / 2, y + th, pen({ strokeWidth: 2.4 })) +
    r.line(cx + wd / 2, y, cx + wd / 2, y + th, pen({ strokeWidth: 2.4 })) +
    r.arc(cx, y + th, wd, ht, 0, Math.PI, false, pen({ strokeWidth: 2.4 }));
  const wires = (cx, y1, y2, w1, w2, xs, coil = []) =>
    xs.map((a, i) => {
      const x1 = cx + (a * w1) / 2, x2 = cx + (a * w2) / 2;
      if (coil.includes(i)) {
        const pts = Array.from({ length: 13 }, (_, j) => [x1 + ((x2 - x1) * j) / 12 + (j % 2 ? 7 : -7) * (j > 2 && j < 10 ? 1 : 0), y1 + ((y2 - y1) * j) / 12]);
        return r.curve(pts, pen({ strokeWidth: 1.8, roughness: 0.7 }));
      }
      return r.curve([[x1, y1], [(x1 + x2) / 2 + (i % 2 ? 6 : -6), (y1 + y2) / 2], [x2, y2]], pen({ strokeWidth: 1.8, roughness: 0.8 }));
    }).join("");
  const qcSvg =
    r.rect(50, 0, 300, 22, pen({ strokeWidth: 2.8 })) +
    r.line(110, 22, 110, 70, pen({ strokeWidth: 2.4 })) + r.line(290, 22, 290, 70, pen({ strokeWidth: 2.4 })) + r.line(200, 22, 200, 66, pen({ strokeWidth: 2.4 })) +
    cyl(200, 80, 300) +
    wires(200, 120, 226, 300, 250, [-0.85, -0.6, -0.3, -0.05, 0.2, 0.45, 0.7, 0.9], [2, 5]) +
    cyl(200, 240, 250) +
    wires(200, 280, 376, 250, 200, [-0.8, -0.5, -0.2, 0.15, 0.45, 0.8], [1, 4]) +
    cyl(200, 390, 200) +
    wires(200, 428, 456, 200, 80, [-0.6, -0.2, 0.2, 0.6]) +
    r.rect(160, 456, 80, 42, pen({ strokeWidth: 2.8 })) +
    r.line(172, 470, 228, 470, pen({ strokeWidth: 1.6 })) + r.line(172, 484, 228, 484, pen({ strokeWidth: 1.6 }));
  const lapScreenA =
    r.line(80, 60, 220, 60, pen({ strokeWidth: 2 })) + r.line(80, 95, 330, 95, pen({ strokeWidth: 2 })) +
    r.line(80, 130, 280, 130, pen({ strokeWidth: 2 })) + r.line(80, 165, 300, 165, pen({ strokeWidth: 2 }));
  const streaks = [60, 112, 164].map((y, i) => r.line(-120 + i * 14, y, -40, y, pen({ strokeWidth: 2.6 }))).join("");

  const CXA = Array.from({ length: 8 }, (_, i) => 705 + 134 * i);
  const CYA = 370;
  const FAN0 = [500, 560];
  const cardsA = CXA.map((cx, i) => `<g id="b-cA${i}">${cardSvg(cx, CYA)}</g>`).join("");
  const fanA = CXA.map((cx, i) => `<g id="b-fan${i}">${arrow(FAN0[0], FAN0[1], cx, CYA + 82, { strokeWidth: 1.8 }, 13)}</g>`).join("");
  const EYE_A = [1170, 175];
  const dieSvg =
    r.rect(1605, 160, 70, 70, pen({ strokeWidth: 2.8 })) +
    r.poly([[1605, 160], [1627, 138], [1697, 138], [1675, 160]], pen({ strokeWidth: 2.4 })) +
    r.poly([[1675, 160], [1697, 138], [1697, 208], [1675, 230]], pen({ strokeWidth: 2.4 })) +
    [[1622, 177], [1640, 195], [1658, 213], [1658, 177], [1622, 213]].map(([x, y]) => r.circle(x, y, 11, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1 }))).join("");
  const sceneA =
    full("b-sA",
      svgBoard(
        `<g id="b-fan">${fanA}</g>${cardsA}` +
        `<g id="b-c5fill">${r.rect(CXA[4] - 48, CYA - 62, 96, 124, hachure(GOLD, { hachureGap: 12, fillWeight: 1.4 }))}${cardSvg(CXA[4], CYA, { stroke: GOLD, strokeWidth: 3.4 })}</g>` +
        mover("b-hop", r.path(rrPath(-68, -84, 136, 168, 18), goldPen({ strokeWidth: 4, roughness: 0.8 }))) +
        `<g id="b-eye">${eyeSvg(EYE_A[0], EYE_A[1], 150, 38)}</g>` +
        `<g id="b-gaze">${r.line(1150, 214, 1110, 280, pen({ strokeWidth: 1.6 }))}${r.line(1190, 214, 1230, 280, pen({ strokeWidth: 1.6 }))}</g>` +
        mover("b-die", dieSvg)
      ) +
      CXA.map((cx, i) => cardNum(`b-nA${i}`, cx, CYA, i + 1)).join("") +
      clbl("b-myth", 1175, 578, 960, 56, "“every answer at once?”") +
      lbl("b-measure", 1270, 140, 320, 52, "measuring", "text-align:left") +
      clbl("b-guess", 1175, 578, 960, 54, `<span class="gold">one answer</span>, just a guess`)
    ) +
    `<div id="b-lap" class="obj" style="left:330px;top:470px;width:420px;height:300px"><svg class="sk" width="420" height="300" viewBox="0 0 420 300"><g id="b-lapd">${laptopSvg(0, 0, lapScreenA)}</g><g id="b-streak">${streaks}</g></svg>${lbl("b-laplbl", 110, 292, 200, 46, "laptop")}</div>` +
    lbl("b-q", 850, 470, 160, 140, "?", G) +
    `<div id="b-qcbox" class="obj" style="left:1060px;top:270px;width:400px;height:560px"><svg class="sk" width="400" height="560" viewBox="0 0 400 560"><g id="b-qc">${qcSvg}</g></svg>${lbl("b-qclbl", -50, 500, 500, 46, "quantum computer")}</div>`;

  const scriptA = `
    // ---- Scene A: the myth ----
    hide(["#b-c5fill", "#b-hop", "#b-gaze"]);
    draw("#b-qc", ${T.qc}, 1.6);
    write("#b-qclbl", ${T.qc + 1.3}, 0.8);
    draw("#b-lapd", ${T.laptop}, 1.0);
    write("#b-laplbl", ${T.laptop + 0.5}, 0.4);
    draw("#b-streak", ${T.fast}, 0.3);
    write("#b-q", ${T.fast + 0.05}, 0.35);
    blurOut(["#b-title", "#b-lap", "#b-q"], ${T.aOut});
    fade("#b-qclbl", 0, ${T.aOut}, 0.25);
    move("#b-qcbox", { x: 0, y: 0, scale: 1 }, { x: -900, y: -20, scale: 0.7 }, ${T.aOut + 0.1}, 0.9);
    ${JSON.stringify(CXA)}.forEach((_, i) => { draw("#b-cA" + i, ${T.every} + i * 0.1, 0.35); write("#b-nA" + i, ${T.every} + 0.15 + i * 0.1, 0.2); });
    draw("#b-fan", ${T.every + 0.1}, 0.7);
    write("#b-myth", ${T.once}, 0.9);
    draw("#b-eye", ${T.looking}, 0.8);
    fade("#b-gaze", 1, ${T.looking + 0.6}, 0.3);
    write("#b-measure", ${T.measuring}, 0.6);
    blurOut("#b-myth", ${T.one});
    fade("#b-hop", 1, ${T.random}, 0.1);
    draw("#b-die", ${T.random}, 0.6);
    const OTHERS = [0, 1, 2, 3, 5, 6, 7];
    fade(OTHERS.flatMap((i) => ["#b-cA" + i, "#b-nA" + i, "#b-fan" + i]), 0.25, ${T.random + 0.85}, 0.35);
    fade("#b-c5fill", 1, ${T.random + 0.85}, 0.3);
    fade("#b-hop", 0, ${T.random + 1.1}, 0.3);
    write("#b-guess", ${T.guess}, 0.7);
    blurOut(["#b-sA", "#b-qcbox"], ${T.sceneA});
    const CXA = ${JSON.stringify(CXA)};
    const HOPS = [[${T.random}, 1], [${T.random + 0.24}, 6], [${T.random + 0.48}, 3], [${T.random + 0.72}, 4]];
    onFrame((t) => {
      if (t > ${T.sceneA + 0.5}) return;
      const segs = HOPS.slice(1).map(([a, c], j) => [a, a + 0.13, CXA[HOPS[j][1]], CXA[c]]);
      put("b-hop-p", sched(segs, t), ${CYA});
      const spin = sched([[${T.random}, ${T.random + 0.9}, 0, 1]], t);
      $("b-die-p").setAttribute("transform", "rotate(" + (spin * 360).toFixed(1) + " 1651 184) translate(0 " + (-28 * Math.abs(Math.sin(spin * Math.PI * 2))).toFixed(1) + ")");
    });
  `;

  // =====================================================================
  // Scene B1: interference named, adding and cancelling
  // =====================================================================
  const sceneB1 = full("b-sB1",
    svgBoard(`<path id="b-addc" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path id="b-canc" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`) +
    clbl("b-interf", 960, 196, 900, 100, "interference", G) +
    clbl("b-addlbl", 620, 690, 300, 54, "add up") +
    clbl("b-canlbl", 1300, 690, 320, 54, "cancel out")
  );
  const scriptB1 = `
    // ---- Scene B1: interference ----
    hide(["#b-addc", "#b-canc"]);
    write("#b-interf", ${T.interf}, 0.8);
    fade("#b-addc", 1, ${T.add}, 0.3);
    write("#b-addlbl", ${T.add + 0.6}, 0.4);
    fade("#b-canc", 1, ${T.cancel}, 0.3);
    write("#b-canlbl", ${T.cancel + 0.45}, 0.5);
    blurOut("#b-sB1", ${T.sceneB1});
    // Two bumps on a baseline slide together; the line drawn is their sum.
    function bumps(cx, d, sign, t) {
      let s = "";
      for (let i = 0; i <= 96; i++) {
        const x = cx - 260 + (520 * i) / 96;
        const g = (u) => Math.exp(-((u / 40) ** 2));
        const y = 600 + 2.5 * Math.sin(x * 0.045 - t * 3) - 80 * (g(x - (cx - d)) + sign * g(x - (cx + d)));
        s += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
      }
      return s;
    }
    onFrame((t) => {
      if (t < ${T.add - 0.5} || t > ${T.sceneB1 + 0.5}) return;
      $("b-addc").setAttribute("d", bumps(620, 130 * (1 - sched([[${T.add + 0.2}, ${T.add + 0.95}, 0, 1]], t)), 1, t));
      $("b-canc").setAttribute("d", bumps(1300, 130 * (1 - sched([[${T.cancel + 0.1}, ${T.cancel + 0.75}, 0, 1]], t)), -1, t));
    });
  `;

  // =====================================================================
  // Scene B2: the harbour
  // =====================================================================
  const HB = { X0: 756, XB: 1540, LAM: 70, Y0: 110, Y1: 850, NR: 14, G1: 360, G2: 600, G1b: 300, G2b: 680 };
  const seaLines = Array.from({ length: 8 }, (_, n) => {
    const pts = Array.from({ length: 37 }, (_, j) => [0, 120 + j * 20]);
    return `<path id="b-sea${n}" d="${wobbly(pts, 3, 40 + n).d}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
  }).join("");
  const arcEls = [0, 1].map((g) => Array.from({ length: HB.NR }, (_, n) =>
    `<path id="b-rc${g}_${n}" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path id="b-rt${g}_${n}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-dasharray="6 10" stroke-linecap="round"/>`).join("")).join("");
  const gapCover = (g) => `<g id="b-gap${g}"><rect x="711" y="-30" width="54" height="60" fill="${GROUND}"/>${r.line(714, -30, 762, -30, pen({ strokeWidth: 3.2, roughness: 0.6 }))}${r.line(714, 30, 762, 30, pen({ strokeWidth: 3.2, roughness: 0.6 }))}</g>`;
  const sceneB2 = full("b-sB2",
    svgBoard(
      `<defs><clipPath id="b-clipR"><rect x="758" y="110" width="782" height="740"/></clipPath><clipPath id="b-clipS"><rect x="150" y="110" width="560" height="740"/></clipPath></defs>` +
      `<g id="b-seaG" clip-path="url(#b-clipS)">${seaLines}</g>` +
      `<g id="b-wall">${r.rect(720, 110, 36, 740, pen({ strokeWidth: 3, fill: INK, fillStyle: "hachure", hachureGap: 9, fillWeight: 1.4, hachureAngle: 50 }))}</g>` +
      `<g id="b-gapsG">${gapCover(0)}${gapCover(1)}</g>` +
      `<g id="b-ripG" clip-path="url(#b-clipR)">${arcEls}</g>` +
      `<g id="b-nodalG" clip-path="url(#b-clipR)"><path id="b-nodal" fill="none" stroke="${GOLD}" stroke-width="2.6" stroke-dasharray="10 12" stroke-opacity="0.8"/></g>` +
      `<g id="b-hiG" clip-path="url(#b-clipR)">` +
      `<path id="b-hiA" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` +
      `<path id="b-hiB" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="12 10" stroke-linecap="round"/>` +
      `<path id="b-hiC0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` +
      `<path id="b-hiC1" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>` +
      `<g id="b-garr">${arrow(846, 284, 774, 346, { strokeWidth: 2.8 }, 16)}${arrow(846, 676, 774, 614, { strokeWidth: 2.8 }, 16)}</g>` +
      `<g id="b-beach">${r.line(1540, 110, 1540, 850, pen({ strokeWidth: 3.6 }))}</g>` +
      `<path id="b-prof" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<g id="b-dotsG">${Array.from({ length: 8 }, (_, i) => `<circle id="b-cd${i}" cx="1540" cy="-50" r="10" fill="${GOLD}" stroke="${GROUND}" stroke-width="3"/>`).join("")}</g>` +
      `<circle id="b-meet" cx="0" cy="0" r="17" fill="none" stroke="${GOLD}" stroke-width="4"/>` +
      `<circle id="b-meet2" cx="0" cy="0" r="17" fill="none" stroke="${INK}" stroke-width="4"/>` +
      `<path id="b-arA" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path id="b-arB" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
    ) +
    lbl("b-walllbl", 430, 52, 272, 46, "harbour wall", "text-align:right") +
    clbl("b-beachlbl", 1540, 52, 140, 46, "beach") +
    lbl("b-crestlbl", 1108, 108, 270, 46, "crest (high)", "text-align:left;" + PAD) +
    lbl("b-troughlbl", 1180, 772, 290, 46, "trough (low)", "text-align:left;" + PAD) +
    lbl("b-biglbl", 1176, 506, 190, 46, "big wave", "text-align:left;" + PAD) +
    lbl("b-calm", 0, 0, 110, 46, "calm", "text-align:right;" + G + PAD)
  );
  const scriptB2 = `
    // ---- Scene B2: the harbour ----
    const HB = ${JSON.stringify(HB)};
    hide(["#b-seaG", "#b-gapsG", "#b-ripG", "#b-nodalG", "#b-hiA", "#b-hiB", "#b-hiC0", "#b-hiC1", "#b-prof", "#b-dotsG", "#b-meet", "#b-meet2", "#b-arA", "#b-arB"]);
    fade("#b-seaG", 1, ${T.waves}, 0.5);
    draw("#b-wall", ${T.through}, 0.9);
    fade("#b-gapsG", 1, ${T.through}, 0.2);
    draw("#b-garr", ${T.gaps}, 0.45);
    write("#b-walllbl", ${T.harbour}, 0.7);
    fade("#b-ripG", 1, ${T.spread}, 0.3);
    fade("#b-garr", 0, ${T.spread}, 0.3);
    draw("#b-beach", ${T.beach}, 0.5);
    write("#b-beachlbl", ${T.beach + 0.3}, 0.4);
    // line 5: crest, trough, where they meet, the beach profile, the calm spots
    fade("#b-hiA", 1, ${T.crest}, 0.25);
    write("#b-crestlbl", ${T.crest + 0.05}, 0.6);
    fade("#b-arA", 1, ${T.crest + 0.35}, 0.25);
    fade("#b-hiB", 1, ${T.trough}, 0.25);
    write("#b-troughlbl", ${T.trough + 0.05}, 0.6);
    fade("#b-arB", 1, ${T.trough + 0.35}, 0.25);
    fade("#b-meet", 1, ${T.trough + 0.45}, 0.2);
    fade("#b-prof", 1, ${T.water}, 0.1);
    fade(["#b-dotsG", "#b-nodalG"], 1, ${T.flat}, 0.35);
    write("#b-calm", ${T.flat + 0.2}, 0.4);
    // line 6: crests meet, the wave grows; move the gaps and the calm spots move
    fade(["#b-hiA", "#b-hiB", "#b-arA", "#b-arB", "#b-meet", "#b-crestlbl", "#b-troughlbl"], 0, ${T.l6}, 0.3);
    fade(["#b-hiC0", "#b-hiC1"], 1, ${T.crests}, 0.25);
    fade("#b-meet2", 1, ${T.meet}, 0.2);
    write("#b-biglbl", ${T.grows}, 0.5);
    fade(["#b-hiC0", "#b-hiC1", "#b-meet2", "#b-biglbl"], 0, ${T.move - 0.2}, 0.3);
    blurOut("#b-sB2", ${T.sceneB2});

    const SPEED = [[0, 55], [${T.crest - 0.4}, 55], [${T.crest}, 7], [${T.move - 0.3}, 7], [${T.move + 0.2}, 45]];
    function speedAt(t) {
      for (let i = 1; i < SPEED.length; i++) if (t < SPEED[i][0]) { const [a, va] = SPEED[i - 1], [b, vb] = SPEED[i]; return va + ((vb - va) * (t - a)) / (b - a); }
      return SPEED[SPEED.length - 1][1];
    }
    function phaseAt(t) { let p = 0; for (let s = 0; s < t; s += 0.02) p += speedAt(s) * Math.min(0.02, t - s); return p; }
    const gapsAt = (t) => [sched([[${T.move}, ${T.move + 1.2}, HB.G1, HB.G1b]], t), sched([[${T.move}, ${T.move + 1.2}, HB.G2, HB.G2b]], t)];
    const delta = (x, y, g1, g2) => Math.hypot(x - HB.X0, y - g1) - Math.hypot(x - HB.X0, y - g2);
    function arcD(cx, cy, rad, seed) {
      const n = Math.max(14, Math.round(rad / 22));
      let s = "";
      for (let i = 0; i <= n; i++) {
        const a = -Math.PI / 2 + (Math.PI * i) / n, rr = rad + 1.8 * Math.sin(a * 5 + seed);
        s += (i ? " L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1);
      }
      return s;
    }
    function setArc(id, cy, rad, front, op0, seed) {
      const el = $(id);
      if (rad < 3 || rad > front) { el.setAttribute("opacity", "0"); return; }
      el.setAttribute("d", arcD(HB.X0, cy, rad, seed));
      el.setAttribute("opacity", (op0 * Math.max(0, 1 - rad / 1150) * Math.min(1, rad / 25)).toFixed(3));
    }
    // solve delta(x, y) = target for y (delta grows with y)
    function solveY(x, target, g1, g2) {
      let lo = HB.Y0 - 260, hi = HB.Y1 + 260;
      if (delta(x, lo, g1, g2) > target || delta(x, hi, g1, g2) < target) return null;
      for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (delta(x, m, g1, g2) < target) lo = m; else hi = m; }
      return (lo + hi) / 2;
    }
    const PH_CREST = phaseAt(${T.crest}), PH_C = phaseAt(${T.crests});
    const snap = (ph, R) => { const b = ((ph % HB.LAM) + HB.LAM) % HB.LAM; return b + HB.LAM * Math.round((R - b) / HB.LAM); };
    const RA0 = snap(PH_CREST, 330), RC0 = snap(PH_C, 400);
    const PULSE = [[${T.grows - 0.2}, ${T.grows + 0.3}, 0, 1], [${T.grows + 0.5}, ${T.grows + 1.1}, 1, 0]];
    let calmY = 0;
    onFrame((t) => {
      if (t < ${T.waves - 0.5} || t > ${T.sceneB2 + 0.5}) return;
      const ph = phaseAt(t), base = ((ph % HB.LAM) + HB.LAM) % HB.LAM, [g1, g2] = gapsAt(t);
      // sea: straight crests marching to the wall
      for (let n = 0; n < 8; n++) {
        const x = 160 + ((ph + n * HB.LAM) % 560);
        const el = $("b-sea" + n);
        el.setAttribute("transform", "translate(" + x.toFixed(1) + " 0)");
        el.setAttribute("opacity", (Math.min(1, (x - 160) / 50, (712 - x) / 30) * 0.9).toFixed(3));
      }
      $("b-gap0").setAttribute("transform", "translate(0 " + g1.toFixed(1) + ")");
      $("b-gap1").setAttribute("transform", "translate(0 " + g2.toFixed(1) + ")");
      // ripples: crests solid, troughs dashed, spreading from each gap
      const front = Math.max(0, (t - ${T.spread}) * 520);
      [g1, g2].forEach((gy, g) => {
        for (let n = 0; n < HB.NR; n++) {
          const rc = base + n * HB.LAM;
          setArc("b-rc" + g + "_" + n, gy, rc, front, 0.85, n + g * 3);
          setArc("b-rt" + g + "_" + n, gy, rc + HB.LAM / 2, front, 0.5, n * 2 + g);
        }
      });
      // a crest from the top gap meets a trough from the bottom gap
      const rA = RA0 + ph - PH_CREST, rB = rA + HB.LAM / 2;
      $("b-hiA").setAttribute("d", arcD(HB.X0, g1, rA, 1));
      $("b-hiB").setAttribute("d", arcD(HB.X0, g2, rB, 2));
      const my = (g1 + g2) / 2 + (rA * rA - rB * rB) / (2 * (g2 - g1)), mx = HB.X0 + Math.sqrt(Math.max(0, rA * rA - (my - g1) ** 2));
      $("b-meet").setAttribute("cx", mx.toFixed(1)); $("b-meet").setAttribute("cy", my.toFixed(1));
      const tipA = [HB.X0 + rA * Math.cos(-0.56), g1 + rA * Math.sin(-0.56)], tipB = [HB.X0 + rB * Math.cos(0.38), g2 + rB * Math.sin(0.38)];
      $("b-arA").setAttribute("d", arrowD(1116, 150, tipA[0] + 8, tipA[1] - 6));
      $("b-arB").setAttribute("d", arrowD(1186, 798, tipB[0] + 8, tipB[1] + 6));
      // two crests meet on the middle line
      const rC = RC0 + ph - PH_C;
      $("b-hiC0").setAttribute("d", arcD(HB.X0, g1, rC, 3));
      $("b-hiC1").setAttribute("d", arcD(HB.X0, g2, rC, 4));
      const cy2 = (g1 + g2) / 2, cx2 = HB.X0 + Math.sqrt(Math.max(0, rC * rC - ((g2 - g1) / 2) ** 2));
      $("b-meet2").setAttribute("cx", cx2.toFixed(1)); $("b-meet2").setAttribute("cy", cy2.toFixed(1));
      // the beach: wave height along it, |cos(pi * (d1 - d2) / wavelength)|
      const reveal = ease.clamp((t - ${T.water}) / 1.2), pulse = sched(PULSE, t);
      let s = "";
      const yEnd = HB.Y0 + 6 + reveal * (HB.Y1 - HB.Y0 - 12);
      for (let y = HB.Y0 + 6, i = 0; y <= yEnd + 0.01; y += 5, i++) {
        const amp = Math.abs(Math.cos((Math.PI * delta(HB.XB, y, g1, g2)) / HB.LAM));
        const boost = 1 + 0.3 * pulse * Math.exp(-(((y - cy2) / 60) ** 2));
        s += (i ? " L" : "M") + (HB.XB + 165 * amp * boost).toFixed(1) + " " + y.toFixed(1);
      }
      $("b-prof").setAttribute("d", reveal > 0 ? s : "M0 0");
      // calm spots on the beach and the calm lines that lead to them
      let nod = "";
      for (let m = -4; m < 4; m++) {
        const target = (m + 0.5) * HB.LAM, dot = $("b-cd" + (m + 4));
        const yb = Math.abs(target) < g2 - g1 ? solveY(HB.XB, target, g1, g2) : null;
        if (yb == null || yb < HB.Y0 + 10 || yb > HB.Y1 - 10) { dot.setAttribute("opacity", "0"); }
        else {
          dot.setAttribute("cy", yb.toFixed(1));
          dot.setAttribute("opacity", Math.min(1, (yb - HB.Y0 - 10) / 30, (HB.Y1 - 10 - yb) / 30).toFixed(3));
          dot.setAttribute("r", (10 + 4 * sched([[${T.spots}, ${T.spots + 0.25}, 0, 1], [${T.spots + 0.35}, ${T.spots + 0.7}, 1, 0]], t)).toFixed(1));
          if (m === -1) calmY = yb;
        }
        if (Math.abs(target) >= g2 - g1) continue;
        let first = true;
        for (let x = HB.X0 + 14; x <= HB.XB; x += 18) {
          const y = solveY(x, target, g1, g2);
          if (y == null) { first = true; continue; }
          nod += (first ? " M" : " L") + x.toFixed(1) + " " + y.toFixed(1); first = false;
        }
      }
      $("b-nodal").setAttribute("d", nod || "M0 0");
      $("b-calm").style.transform = "translate(" + (HB.XB - 136) + "px," + (calmY - 58).toFixed(1) + "px)";
    });
  `;

  // =====================================================================
  // Scene C1: paths and amplitudes
  // =====================================================================
  const P0 = [400, 470], P2 = [1440, 470], PT = [900, 50], PB = [900, 890];
  const qb = (c, u) => [(1 - u) ** 2 * P0[0] + 2 * u * (1 - u) * c[0] + u * u * P2[0], (1 - u) ** 2 * P0[1] + 2 * u * (1 - u) * c[1] + u * u * P2[1]];
  const pathArrow = (c) => {
    const [ex, ey] = qb(c, 1), [px, py] = qb(c, 0.96), a = Math.atan2(ey - py, ex - px);
    const hd = (da) => [ex - 20 * Math.cos(a + da), ey - 20 * Math.sin(a + da)];
    return r.path(`M${P0[0] + 40} ${P0[1] + (c[1] < 470 ? -6 : 6)} Q${c[0]} ${c[1]} ${ex} ${ey}`, pen({ strokeWidth: 3, roughness: 0.9 })) +
      r.line(ex, ey, ...hd(0.45), pen({ strokeWidth: 2.6 })) + r.line(ex, ey, ...hd(-0.45), pen({ strokeWidth: 2.6 }));
  };
  const TAG_H = 90;
  const tagBar = (id) => mover(id, `<g id="${id}i">${barSvg(TAG_H)}${r.line(-34, 0, 34, 0, pen({ strokeWidth: 2.4 }))}</g><g id="${id}g">${barSvg(TAG_H, GOLD)}</g>`);
  const CARD_C = [1500, 470];
  const SQ = { x: 1522, y: CARD_C[1] - 72 - 2 * TAG_H, s: 2 * TAG_H };
  const sceneC1 = full("b-sC1",
    svgBoard(
      `<g id="b-start">${r.circle(360, 470, 80, pen({ strokeWidth: 3.2 }))}</g>` +
      `<g id="b-card">${cardSvg(CARD_C[0], CARD_C[1])}</g>` +
      `<g id="b-pathT">${pathArrow(PT)}</g><g id="b-pathB">${pathArrow(PB)}</g>` +
      `<g id="b-amparr">${arrow(962, 150, 930, 172, { strokeWidth: 2.4 }, 12)}</g>` +
      `<g id="b-squig">${r.curve([[1300, 162], [1325, 124], [1350, 162], [1375, 198], [1400, 162], [1425, 124], [1450, 162]], pen({ strokeWidth: 2.6 }))}${r.line(1290, 162, 1460, 162, pen({ strokeWidth: 1.4 }))}${arrow(1325, 162, 1325, 128, { strokeWidth: 2 }, 9)}</g>` +
      `<g id="b-legbase">${r.line(186, 740, 360, 740, pen({ strokeWidth: 2.4 }))}</g>` +
      `<g id="b-legup"><g transform="translate(222 740)">${barSvg(80)}</g></g>` +
      `<g id="b-legdn"><g transform="translate(300 740)">${barSvg(80, INK, true)}</g></g>` +
      `<g id="b-sq-p"><g id="b-sq">${r.rect(SQ.x, SQ.y, SQ.s, SQ.s, pen({ stroke: GOLD, strokeWidth: 3.4, fill: GOLD, fillStyle: "hachure", hachureGap: 11, fillWeight: 1.6 }))}</g></g>` +
      tagBar("b-tagT") + tagBar("b-tagB") +
      `<g id="b-brk">${r.line(1468, SQ.y + 2, 1468, CARD_C[1] - 72, goldPen({ strokeWidth: 2.6 }))}${r.line(1458, SQ.y + 2, 1478, SQ.y + 2, goldPen({ strokeWidth: 2.6 }))}${r.line(1458, CARD_C[1] - 72, 1478, CARD_C[1] - 72, goldPen({ strokeWidth: 2.6 }))}</g>`
    ) +
    clbl("b-startlbl", 360, 516, 160, 46, "start") +
    cardNum("b-cardn", CARD_C[0], CARD_C[1], 5) +
    lbl("b-amplbl", 966, 104, 320, 62, "amplitude", "text-align:left;" + G) +
    lbl("b-plus", 244, 650, 70, 58, "+", "text-align:left") +
    lbl("b-minus", 322, 750, 70, 58, "−", "text-align:left") +
    clbl("b-chance", 1500, 556, 170, 58, "chance", PAD) +
    lbl("b-sizelbl", 1330, SQ.y + 50, 124, 50, "size", "text-align:right;" + G) +
    clbl("b-sqlbl", SQ.x + SQ.s / 2, SQ.y - 72, 300, 46, "size × size")
  );
  const tagU = 0.5;
  const scriptC1 = `
    // ---- Scene C1: paths and amplitudes ----
    hide(["#b-tagTg", "#b-tagBg", "#b-sq"]);
    draw("#b-start", ${T.start}, 0.5);
    write("#b-startlbl", ${T.start + 0.3}, 0.35);
    draw("#b-card", ${T.answers}, 0.6);
    write("#b-cardn", ${T.answers + 0.4}, 0.2);
    draw(["#b-pathT", "#b-pathB"], ${T.paths}, 1.0);
    draw(["#b-tagTi", "#b-tagBi"], ${T.number}, 0.5);
    write("#b-amplbl", ${T.amplitude}, 0.7);
    draw("#b-amparr", ${T.amplitude + 0.5}, 0.3);
    draw("#b-squig", ${T.height}, 0.8);
    draw(["#b-legbase", "#b-legup"], ${T.positive}, 0.4);
    write("#b-plus", ${T.positive + 0.2}, 0.2);
    draw("#b-legdn", ${T.negative}, 0.4);
    write("#b-minus", ${T.negative + 0.2}, 0.2);
    fade("#b-amparr", 0, ${T.addup}, 0.25);
    fade(["#b-tagTg", "#b-tagBg"], 1, ${T.addup + 0.85}, 0.3);
    fade(["#b-tagTi", "#b-tagBi"], 0, ${T.addup + 0.85}, 0.3);
    fade(["#b-amplbl", "#b-squig", "#b-legbase", "#b-legup", "#b-legdn", "#b-plus", "#b-minus"], 0, ${T.chance - 0.9}, 0.35);
    write("#b-chance", ${T.chance}, 0.5);
    draw("#b-brk", ${T.size}, 0.4);
    write("#b-sizelbl", ${T.size + 0.15}, 0.3);
    fade("#b-sq", 1, ${T.squared}, 0.1);
    write("#b-sqlbl", ${T.squared + 0.3}, 0.6);
    move("#b-chance", { x: 0, y: 0 }, { x: ${SQ.x + SQ.s / 2 - 1500}, y: ${SQ.y + SQ.s / 2 - 556 - 38} }, ${T.squared + 0.2}, 0.7);
    blurOut("#b-sC1", ${T.sceneC1});
    const PT = ${JSON.stringify(PT)}, PB = ${JSON.stringify(PB)}, P0 = ${JSON.stringify(P0)}, P2 = ${JSON.stringify(P2)};
    const qb = (c, u) => [(1 - u) ** 2 * P0[0] + 2 * u * (1 - u) * c[0] + u * u * P2[0], (1 - u) ** 2 * P0[1] + 2 * u * (1 - u) * c[1] + u * u * P2[1]];
    // slide along the path to its end, then hop onto the stack above the card
    function along(c, target, s) {
      if (s <= 0.65) return qb(c, ${tagU} + (1 - ${tagU}) * (s / 0.65));
      const [ex, ey] = qb(c, 1), u = ease.inOut((s - 0.65) / 0.35);
      return [ex + (target[0] - ex) * u, ey + (target[1] - ey) * u];
    }
    onFrame((t) => {
      if (t < ${T.start - 0.5} || t > ${T.sceneC1 + 0.5}) return;
      const s = ease.clamp((t - ${T.addup}) / 1.0);
      const a = along(PT, [${CARD_C[0]}, ${CARD_C[1] - 72 - TAG_H}], s), b = along(PB, [${CARD_C[0]}, ${CARD_C[1] - 72}], s);
      put("b-tagT-p", a[0], a[1]); put("b-tagB-p", b[0], b[1]);
      const g = sched([[${T.squared}, ${T.squared + 0.6}, 0, 1]], t);
      $("b-sq-p").setAttribute("transform", "translate(${SQ.x} 0) scale(" + Math.max(0.001, g).toFixed(3) + " 1) translate(-${SQ.x} 0)");
    });
  `;

  // =====================================================================
  // Scene C2: one qubit, one H, then H twice
  // =====================================================================
  const Q0 = [260, 470], H1 = { x: 560, w: 80 }, H2 = { x: 1100, w: 80 }, MID = [[870, 290], [870, 650]], END = [[1500, 290], [1500, 650]];
  const NODE_D = 64;
  const node = (x, y, d = NODE_D) => r.circle(x, y, d, pen({ strokeWidth: 3 }));
  const seg = (a, b, o = {}) => arrow(a[0], a[1], b[0], b[1], { strokeWidth: 3, ...o }, 16);
  // H2 outputs: [from mid i to end j]
  const OUT2 = { "00": [[1184, 290], [1462, 290]], "01": [[1184, 290], [1470, 622]], "10": [[1184, 650], [1470, 318]], "11": [[1184, 650], [1462, 650]] };
  const IN1 = [[644, 470], [838, 302]], IN1b = [[644, 470], [838, 638]];
  const MIDOUT = [[[902, 290], [1096, 290]], [[902, 650], [1096, 650]]];
  const hl = (path) => path.map(([a, b]) => r.line(a[0], a[1], b[0], b[1], pen({ strokeWidth: 7, roughness: 0.7 }))).join("");
  const onSeg = ([a, b], f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  const HALF = 70;
  const mbar = (id, down = false) => mover(id, `<g id="${id}i">${barSvg(HALF, INK, down)}${r.line(-28, 0, 28, 0, pen({ strokeWidth: 2.2 }))}</g><g id="${id}g">${barSvg(HALF, GOLD, down)}</g>`);
  const M = { m1: onSeg(OUT2["01"], 0.3), m2: onSeg(OUT2["11"], 0.4), m3: onSeg(OUT2["00"], 0.4), m4: onSeg(OUT2["10"], 0.7) };
  const coinSvg = r.circle(0, 0, 100, goldPen({ strokeWidth: 4 })) + r.circle(0, 0, 80, goldPen({ strokeWidth: 1.8 })) +
    `<text id="b-coinf" x="0" y="21" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="62" fill="${GOLD}">0</text>`;
  const sceneC2 = full("b-sC2",
    svgBoard(
      `<g id="b-q0">${node(Q0[0], Q0[1], 78)}</g>` +
      `<g id="b-h1">${r.rect(H1.x, 230, H1.w, 480, pen({ strokeWidth: 3.2 }))}${seg([Q0[0] + 42, 470], [H1.x - 4, 470])}</g>` +
      `<g id="b-split1">${seg(...IN1)}${seg(...IN1b)}</g>` +
      `<g id="b-mid">${node(...MID[0])}${node(...MID[1])}</g>` +
      mover("b-coin", coinSvg) +
      `<g id="b-h2">${r.rect(H2.x, 230, H2.w, 480, pen({ strokeWidth: 3.2 }))}</g>` +
      `<g id="b-midout">${seg(...MIDOUT[0])}${seg(...MIDOUT[1])}</g>` +
      Object.entries(OUT2).map(([kk, [a, b]]) => `<g id="b-o${kk}">${seg(a, b)}</g>`).join("") +
      `<g id="b-end0">${node(...END[0])}</g><g id="b-end1">${node(...END[1])}</g>` +
      `<g id="b-e0fill">${r.circle(END[0][0], END[0][1], NODE_D - 8, pen({ stroke: "none", fill: "rgba(217,180,99,0.28)", fillStyle: "solid" }))}${r.circle(END[0][0], END[0][1], NODE_D, goldPen({ strokeWidth: 3.6 }))}</g>` +
      `<g id="b-hl01">${hl([IN1, MIDOUT[0], OUT2["01"]])}</g><g id="b-hl11">${hl([IN1b, MIDOUT[1], OUT2["11"]])}</g>` +
      `<g id="b-hl00">${hl([IN1, MIDOUT[0], OUT2["00"]])}</g><g id="b-hl10">${hl([IN1b, MIDOUT[1], OUT2["10"]])}</g>` +
      mbar("b-m1") + mbar("b-m2", true) + mbar("b-m3") + mbar("b-m4")
    ) +
    clbl("b-q0lbl", Q0[0], 514, 160, 46, "qubit") +
    clbl("b-q0read", Q0[0], 572, 280, 46, "reads 0 or 1") +
    clbl("b-q0v", Q0[0], 422, 80, 64, "0") +
    clbl("b-q0one", Q0[0], 422, 80, 64, "1") +
    clbl("b-h1lbl", H1.x + H1.w / 2, 420, 80, 76, "H") +
    clbl("b-steplbl", H1.x + H1.w / 2, 160, 180, 44, "a step") +
    clbl("b-mid0", MID[0][0], 252, 70, 52, "0") + clbl("b-mid1", MID[1][0], 612, 70, 52, "1") +
    clbl("b-p50a", MID[0][0], 186, 120, 46, "50%") + clbl("b-p50b", MID[1][0], 690, 120, 46, "50%") +
    clbl("b-h2lbl", H2.x + H2.w / 2, 420, 80, 76, "H") +
    clbl("b-end0n", END[0][0], 252, 70, 52, "0") + clbl("b-end1n", END[1][0], 612, 70, 52, "1") +
    lbl("b-four", 1556, 438, 210, 50, "4 paths", "text-align:left") +
    lbl("b-m1l", M.m1[0] + 20, M.m1[1] - HALF - 26, 90, 48, "+½", "text-align:left") +
    lbl("b-m2l", M.m2[0] + 20, M.m2[1] + 18, 90, 48, "−½", "text-align:left") +
    lbl("b-m3l", M.m3[0] + 20, M.m3[1] - HALF - 26, 90, 48, "+½", "text-align:left") +
    lbl("b-m4l", M.m4[0] - 104, M.m4[1] - HALF - 6, 90, 48, "+½", "text-align:right") +
    lbl("b-zero1", END[1][0] + 46, 612, 110, 50, "0%", "text-align:left") +
    lbl("b-one", END[0][0] + 26, 94, 70, 52, "1", "text-align:left;" + G) +
    lbl("b-100", END[0][0] + 46, 252, 160, 58, "100%", "text-align:left;" + G) +
    [0, 1, 2, 3].map((i) => lbl(`b-tally${i}`, END[0][0] + 50 + i * 38, 330, 40, 48, "0", "text-align:left")).join("")
  );
  const scriptC2 = `
    // ---- Scene C2: one qubit, H, then H twice ----
    hide(["#b-coin", "#b-e0fill", "#b-m1g", "#b-m2g", "#b-m3g", "#b-m4g"]);
    draw("#b-q0", ${T.qubit}, 0.5);
    write("#b-q0lbl", ${T.qubit + 0.2}, 0.35);
    write("#b-q0read", ${T.reads}, 0.7);
    hide("#b-q0one");
    write("#b-q0v", ${T.rz}, 0.2);
    fade("#b-q0v", 0, ${T.ro - 0.05}, 0.12);
    fade("#b-q0one", 1, ${T.ro}, 0.12);
    fade("#b-q0one", 0, ${T.zero}, 0.2);
    fade("#b-q0v", 1, ${T.zero}, 0.25);
    draw("#b-h1", ${T.step}, 0.6);
    write("#b-steplbl", ${T.step + 0.15}, 0.4);
    write("#b-h1lbl", ${T.H1}, 0.2);
    draw("#b-split1", ${T.makes}, 0.5);
    draw("#b-mid", ${T.makes + 0.3}, 0.4);
    write(["#b-mid0", "#b-mid1"], ${T.makes + 0.55}, 0.15);
    write(["#b-p50a", "#b-p50b"], ${T.fifty}, 0.4);
    fade("#b-coin", 1, ${T.coin}, 0.15);
    blurOut(["#b-coin", "#b-p50a", "#b-p50b"], ${T.coinOut});
    draw("#b-h2", ${T.twice}, 0.5);
    write("#b-h2lbl", ${T.twice + 0.35}, 0.2);
    draw("#b-midout", ${T.twice + 0.4}, 0.4);
    draw(["#b-o00", "#b-o01", "#b-o10", "#b-o11"], ${T.splits}, 0.8);
    draw(["#b-end0", "#b-end1"], ${T.splits + 0.6}, 0.4);
    write(["#b-end0n", "#b-end1n"], ${T.splits + 0.85}, 0.15);
    write("#b-four", ${T.four}, 0.5);
    // paths to one: plus a half and minus a half cancel
    fade("#b-four", 0, ${T.toOne - 0.1}, 0.3);
    fade(["#b-o00", "#b-o10"], 0.3, ${T.toOne}, 0.3);
    draw(["#b-hl01", "#b-hl11"], ${T.toOne}, 0.7);
    draw("#b-m1i", ${T.plusA}, 0.3);
    write("#b-m1l", ${T.plusA + 0.15}, 0.3);
    draw("#b-m2i", ${T.minusA}, 0.3);
    write("#b-m2l", ${T.minusA + 0.15}, 0.3);
    fade(["#b-m1l", "#b-m2l"], 0, ${T.cancelC - 0.1}, 0.2);
    fade(["#b-m1g", "#b-m2g"], 1, ${T.cancelC}, 0.2);
    fade(["#b-m1i", "#b-m2i"], 0, ${T.cancelC}, 0.2);
    fade(["#b-end1", "#b-end1n", "#b-o01", "#b-o11", "#b-hl01", "#b-hl11"], 0.3, ${T.cancelC + 1.15}, 0.35);
    write("#b-zero1", ${T.cancelC + 1.1}, 0.3);
    // paths to zero: two plus halves add to one
    fade(["#b-o00", "#b-o10"], 1, ${T.toZero}, 0.3);
    draw(["#b-hl00", "#b-hl10"], ${T.toZero}, 0.7);
    draw(["#b-m3i", "#b-m4i"], ${T.plusB}, 0.3);
    write(["#b-m3l", "#b-m4l"], ${T.plusB + 0.15}, 0.3);
    fade(["#b-m3l", "#b-m4l"], 0, ${T.adding - 0.1}, 0.2);
    fade(["#b-m3g", "#b-m4g"], 1, ${T.adding}, 0.2);
    fade(["#b-m3i", "#b-m4i"], 0, ${T.adding}, 0.2);
    write("#b-one", ${T.adding + 0.7}, 0.25);
    fade("#b-e0fill", 1, ${T.always}, 0.3);
    write("#b-100", ${T.always + 0.1}, 0.4);
    [0, 1, 2, 3].forEach((i) => write("#b-tally" + i, ${T.always + 0.35} + i * 0.17, 0.12));
    blurOut("#b-sC2", ${T.sceneC2});
    const M = ${JSON.stringify(M)};
    const END = ${JSON.stringify(END)};
    const slide = (from, to, a, d, t) => { const u = sched([[a, a + d, 0, 1]], t); return [from[0] + (to[0] - from[0]) * u, from[1] + (to[1] - from[1]) * u]; };
    onFrame((t) => {
      if (t < ${T.qubit - 0.5} || t > ${T.sceneC2 + 0.5}) return;
      // coin toss: four flips showing 0, 1, 1, 0
      const c0 = ${T.coin + 0.05}, k = Math.floor((t - c0 + 0.15) / 0.3), flipping = t > c0 && k < 4;
      put("b-coin-p", ${MID[0][0]}, 470, 1, flipping ? Math.max(0.04, Math.abs(Math.cos((Math.PI * (t - c0)) / 0.3))) : 1);
      $("b-coinf").textContent = ["0", "1", "1", "0"][Math.max(0, Math.min(3, k))];
      // cancelling pair meets at the node "1", then shrinks to nothing
      const sh = 1 - sched([[${T.cancelC + 0.55}, ${T.cancelC + 1.1}, 0, 1]], t);
      const p1 = slide(M.m1, END[1], ${T.cancelC}, 0.55, t), p2 = slide(M.m2, END[1], ${T.cancelC}, 0.55, t);
      put("b-m1-p", p1[0], p1[1], 1, Math.max(0.001, sh)); put("b-m2-p", p2[0], p2[1], 1, Math.max(0.001, sh));
      // adding pair stacks on the node "0"
      const p3 = slide(M.m3, [END[0][0], END[0][1] - 36 - ${HALF}], ${T.adding}, 0.6, t), p4 = slide(M.m4, [END[0][0], END[0][1] - 36], ${T.adding}, 0.6, t);
      put("b-m3-p", p3[0], p3[1]); put("b-m4-p", p4[0], p4[1]);
    });
  `;

  // =====================================================================
  // Scene D1: you never see the wave
  // =====================================================================
  const MH = { X0: 440, G1: 380, G2: 480, LAM: 40, NR: 10 };
  const miniSea = Array.from({ length: 5 }, (_, n) => `<path id="b-ms${n}" d="${wobbly(Array.from({ length: 17 }, (_, j) => [0, 270 + j * 20]), 2, 80 + n).d}" fill="none" stroke="${INK}" stroke-width="2.2"/>`).join("");
  const miniArcs = [0, 1].map((g) => Array.from({ length: MH.NR }, (_, n) => `<path id="b-mr${g}_${n}" fill="none" stroke="${INK}" stroke-width="2"/>`).join("")).join("");
  const BOX = { x: 1180, y: 220, w: 400, h: 240 };
  const SLOT_X = 1380;
  const dropCard = (id, n) => mover(id, `${cardSvg(0, 0, { stroke: GOLD, strokeWidth: 3.4 })}<text x="0" y="20" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="58" fill="${GOLD}">${n}</text>`);
  const sceneD1 = full("b-sD1",
    svgBoard(
      `<defs><clipPath id="b-clipM"><rect x="444" y="250" width="380" height="340"/></clipPath><clipPath id="b-clipMS"><rect x="220" y="250" width="200" height="340"/></clipPath>` +
      `<clipPath id="b-clipLid"><rect x="${BOX.x - 4}" y="${BOX.y - 4}" width="${BOX.w + 8}" height="${BOX.h + 8}"/></clipPath><clipPath id="b-clipSlot"><rect x="1100" y="${BOX.y + BOX.h + 6}" width="600" height="300"/></clipPath></defs>` +
      `<g id="b-msG" clip-path="url(#b-clipMS)">${miniSea}</g>` +
      `<g id="b-mwall">${r.rect(420, 260, 20, 320, pen({ strokeWidth: 2.6, fill: INK, fillStyle: "hachure", hachureGap: 8, fillWeight: 1.2 }))}</g>` +
      `<g id="b-mgaps"><rect x="414" y="${MH.G1 - 18}" width="32" height="36" fill="${GROUND}"/><rect x="414" y="${MH.G2 - 18}" width="32" height="36" fill="${GROUND}"/></g>` +
      `<g id="b-mrG" clip-path="url(#b-clipM)">${miniArcs}</g>` +
      `<g id="b-eye2">${eyeSvg(600, 175, 130, 32)}</g>` +
      `<g id="b-gaze2">${r.line(580, 210, 540, 262, pen({ strokeWidth: 1.6 }))}${r.line(620, 210, 660, 262, pen({ strokeWidth: 1.6 }))}</g>` +
      `<g id="b-box">${r.rect(BOX.x, BOX.y, BOX.w, BOX.h, pen({ strokeWidth: 3.4 }))}${r.rect(SLOT_X - 50, BOX.y + BOX.h - 8, 100, 16, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1.6 }))}</g>` +
      `<g id="b-inwave">${r.curve(Array.from({ length: 15 }, (_, i) => [BOX.x + 30 + i * 24.3, BOX.y + 120 - 46 * Math.sin(i * 0.9)]), pen({ strokeWidth: 2.6, stroke: "rgba(232,232,232,0.6)" }))}</g>` +
      `<g clip-path="url(#b-clipLid)">${mover("b-lid", `<rect x="${BOX.x}" y="${BOX.y}" width="${BOX.w}" height="${BOX.h}" fill="${GROUND}"/>${r.rect(BOX.x, BOX.y, BOX.w, BOX.h, pen({ strokeWidth: 3.4, fill: INK, fillStyle: "hachure", hachureGap: 22, fillWeight: 1, hachureAngle: -40 }))}`)}</g>` +
      `<g clip-path="url(#b-clipSlot)">${dropCard("b-dc1", 3)}${dropCard("b-dc2", 6)}</g>`
    ) +
    lbl("b-lidq", SLOT_X - 70, BOX.y + 40, 140, 120, "?", PAD) +
    clbl("b-watch", 520, 640, 560, 48, "water: you watch it") +
    clbl("b-never", 1380, 640, 560, 48, "you never see the wave") +
    clbl("b-perrun", 1380, 716, 560, 48, `each run: <span class="gold">one answer</span>`)
  );
  const scriptD1 = `
    // ---- Scene D1: you never see the wave ----
    const MH = ${JSON.stringify(MH)};
    hide(["#b-msG", "#b-mrG", "#b-mgaps", "#b-gaze2", "#b-lid", "#b-dc1", "#b-dc2"]);
    draw("#b-mwall", ${T.dWater}, 0.6);
    fade(["#b-mgaps", "#b-msG", "#b-mrG"], 1, ${T.dWater + 0.2}, 0.4);
    draw("#b-eye2", ${T.dWater + 0.3}, 0.6);
    fade("#b-gaze2", 1, ${T.dWater + 0.8}, 0.3);
    write("#b-watch", ${T.dWater + 0.4}, 0.8);
    draw("#b-box", ${T.never - 0.2}, 0.6);
    draw("#b-inwave", ${T.never + 0.1}, 0.4);
    fade("#b-lid", 1, ${T.see}, 0.05);
    write("#b-never", ${T.see + 0.1}, 0.9);
    write("#b-lidq", ${T.see + 0.65}, 0.3);
    fade("#b-dc1", 1, ${T.run}, 0.05);
    write("#b-perrun", ${T.run + 0.05}, 0.8);
    fade("#b-dc2", 1, ${T.oneAns}, 0.05);
    fade("#b-dc1", 0.3, ${T.oneAns + 0.1}, 0.4);
    blurOut("#b-sD1", ${T.sceneD1});
    onFrame((t) => {
      if (t < ${T.dWater - 0.5} || t > ${T.sceneD1 + 0.5}) return;
      const ph = t * 34, base = ((ph % MH.LAM) + MH.LAM) % MH.LAM;
      for (let n = 0; n < 5; n++) {
        const x = 230 + ((ph + n * MH.LAM) % 200);
        const el = $("b-ms" + n);
        el.setAttribute("transform", "translate(" + x.toFixed(1) + " 0)");
        el.setAttribute("opacity", (Math.min(1, (x - 230) / 30, (420 - x) / 20) * 0.85).toFixed(3));
      }
      [MH.G1, MH.G2].forEach((gy, g) => {
        for (let n = 0; n < MH.NR; n++) {
          const rad = base + n * MH.LAM, el = $("b-mr" + g + "_" + n);
          let s = "";
          for (let i = 0; i <= 18; i++) { const a = -Math.PI / 2 + (Math.PI * i) / 18; s += (i ? " L" : "M") + (MH.X0 + rad * Math.cos(a)).toFixed(1) + " " + (gy + rad * Math.sin(a)).toFixed(1); }
          el.setAttribute("d", s);
          el.setAttribute("opacity", (0.8 * Math.max(0, 1 - rad / 420) * Math.min(1, rad / 15)).toFixed(3));
        }
      });
      put("b-lid-p", -(${BOX.w + 10}) * (1 - sched([[${T.see}, ${T.see + 0.6}, 0, 1]], t)), 0);
      const y1 = sched([[${T.run}, ${T.run + 0.45}, ${BOX.y + BOX.h - 80}, ${BOX.y + BOX.h + 86}]], t);
      const x1 = sched([[${T.oneAns}, ${T.oneAns + 0.5}, ${SLOT_X}, ${SLOT_X + 160}]], t);
      put("b-dc1-p", x1, y1);
      put("b-dc2-p", ${SLOT_X}, sched([[${T.oneAns}, ${T.oneAns + 0.45}, ${BOX.y + BOX.h - 80}, ${BOX.y + BOX.h + 86}]], t));
    });
  `;

  // =====================================================================
  // Scene D2: an algorithm puts calm spots on wrong answers
  // =====================================================================
  const CXD = Array.from({ length: 8 }, (_, i) => 340 + 180 * i);
  const CYD = 590, WBASE = 462, RIGHT = 4, CH_BASE = 836;
  const AMPS = [36, -30, 44, -38, 30, -42, 34, -28];
  const sceneD2 = full("b-sD2",
    svgBoard(
      `<g id="b-recipe">${r.rect(200, 118, 190, 172, pen({ strokeWidth: 3 }))}${[160, 206, 252].map((y, i) => r.line(254, y, 360 - (i % 2) * 30, y, pen({ strokeWidth: 2.2 }))).join("")}</g>` +
      CXD.map((cx, i) => `<g id="b-cD${i}">${cardSvg(cx, CYD)}</g>`).join("") +
      `<g id="b-c5D">${r.rect(CXD[RIGHT] - 48, CYD - 62, 96, 124, hachure(GOLD, { hachureGap: 12, fillWeight: 1.4 }))}${cardSvg(CXD[RIGHT], CYD, { stroke: GOLD, strokeWidth: 3.4 })}</g>` +
      CXD.map((cx, i) => (i === RIGHT ? "" : `<g id="b-x${i}">${r.line(cx - 34, CYD - 44, cx + 34, CYD + 44, pen({ strokeWidth: 3.2 }))}${r.line(cx + 34, CYD - 44, cx - 34, CYD + 44, pen({ strokeWidth: 3.2 }))}</g>`)).join("") +
      `<path id="b-dwave" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<g id="b-ddots">${CXD.map((cx, i) => (i === RIGHT ? "" : `<circle cx="${cx}" cy="${WBASE}" r="10" fill="${GOLD}" stroke="${GROUND}" stroke-width="3"/>`)).join("")}</g>` +
      `<g id="b-chbase">${r.line(270, CH_BASE, 1670, CH_BASE, pen({ strokeWidth: 2 }))}</g>` +
      CXD.map((cx, i) => `<g id="b-ch${i}-p"><g id="b-ch${i}">${r.rect(cx - 20, CH_BASE - 120, 40, 120, i === RIGHT ? pen({ stroke: GOLD, strokeWidth: 3, fill: GOLD, fillStyle: "hachure", hachureGap: 8, fillWeight: 1.6 }) : pen({ strokeWidth: 2.2, fill: INK, fillStyle: "solid" }))}</g></g>`).join("")
    ) +
    [1, 2, 3].map((n, i) => lbl(`b-rn${i}`, 212, 128 + i * 46, 40, 40, `${n}.`, "text-align:left")).join("") +
    lbl("b-alg", 418, 168, 240, 58, "algorithm", "text-align:left") +
    lbl("b-rec", 640, 168, 520, 58, "= a recipe of steps", "text-align:left") +
    CXD.map((cx, i) => cardNum(`b-nD${i}`, cx, CYD, i + 1)).join("") +
    lbl("b-chlbl", 168, CH_BASE - 64, 110, 44, "chance", "text-align:left")
  );
  const scriptD2 = `
    // ---- Scene D2: calm spots on wrong answers ----
    hide(["#b-c5D", "#b-ddots", "#b-dwave"]);
    draw("#b-recipe", ${T.algorithm}, 0.8);
    write("#b-alg", ${T.algorithm + 0.05}, 0.5);
    [0, 1, 2].forEach((i) => write("#b-rn" + i, ${T.algorithm + 0.3} + i * 0.15, 0.12));
    write("#b-rec", ${T.recipe}, 0.8);
    ${JSON.stringify(CXD)}.forEach((_, i) => { draw("#b-cD" + i, ${T.recipe + 0.35} + i * 0.06, 0.3); write("#b-nD" + i, ${T.recipe + 0.5} + i * 0.06, 0.15); });
    fade("#b-dwave", 1, ${T.puts - 0.1}, 0.1);
    fade("#b-ddots", 1, ${T.calm + 0.5}, 0.35);
    [0, 1, 2, 3, 5, 6, 7].forEach((i, j) => draw("#b-x" + i, ${T.wrong} + j * 0.07, 0.3));
    fade("#b-c5D", 1, ${T.right}, 0.35);
    draw("#b-chbase", ${T.likely - 0.2}, 0.3);
    ${JSON.stringify(CXD)}.forEach((_, i) => show("#b-ch" + i, ${T.likely}));
    hide(${JSON.stringify(CXD.map((_, i) => "#b-ch" + i))});
    write("#b-chlbl", ${T.likely}, 0.4);
    blurOut("#b-sD2", ${T.sceneD2});
    const CXD = ${JSON.stringify(CXD)}, AMPS = ${JSON.stringify(AMPS)};
    onFrame((t) => {
      if (t < ${T.algorithm - 0.5} || t > ${T.sceneD2 + 0.5}) return;
      const reveal = ease.clamp((t - ${T.puts - 0.1}) / 0.6);
      const mess = 1 - sched([[${T.calm}, ${T.calm + 0.7}, 0, 1]], t);
      const peak = sched([[${T.right - 0.05}, ${T.right + 0.55}, 0, 1]], t);
      const x0 = 260, x1 = x0 + reveal * 1420;
      let s = "";
      for (let x = x0, i = 0; x <= x1 + 0.01; x += 6, i++) {
        let y = ${WBASE} + 1.8 * Math.sin(x * 0.05 - t * 4);
        CXD.forEach((cx, j) => { const g = Math.exp(-(((x - cx) / 46) ** 2)); y -= mess * AMPS[j] * g * (0.85 + 0.15 * Math.sin(t * 5 + j)); if (j === ${RIGHT}) y -= peak * 150 * g; });
        s += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
      }
      $("b-dwave").setAttribute("d", reveal > 0 ? s : "M0 0");
      const grow = sched([[${T.likely}, ${T.likely + 0.6}, 0, 1]], t);
      CXD.forEach((_, i) => { const h = (i === ${RIGHT} ? 0.92 : 0.05) * grow; $("b-ch" + i + "-p").setAttribute("transform", "translate(0 ${CH_BASE}) scale(1 " + Math.max(0.001, h).toFixed(3) + ") translate(0 -${CH_BASE})"); });
    });
  `;

  // =====================================================================
  // Scene D3: where it helps, and where your laptop wins
  // =====================================================================
  const lapScreenD =
    r.rect(80, 50, 110, 74, pen({ strokeWidth: 2.4 })) + r.linear([[80, 50], [135, 92], [190, 50]], pen({ strokeWidth: 2.2 })) +
    r.rect(220, 40, 120, 130, pen({ strokeWidth: 2 })) +
    [83, 126].map((y) => r.line(220, y, 340, y, pen({ strokeWidth: 1.6 }))).join("") + r.line(270, 40, 270, 170, pen({ strokeWidth: 1.6 })) +
    r.line(80, 150, 190, 150, pen({ strokeWidth: 1.8 })) + r.line(80, 172, 160, 172, pen({ strokeWidth: 1.8 }));
  const molSvg =
    r.line(560, 600, 480, 676, pen({ strokeWidth: 4 })) + r.line(560, 600, 640, 676, pen({ strokeWidth: 4 })) +
    r.circle(560, 600, 78, pen({ strokeWidth: 3, fill: INK, fillStyle: "hachure", hachureGap: 8, fillWeight: 1.4 })) +
    r.circle(476, 680, 50, pen({ strokeWidth: 3 })) + r.circle(644, 680, 50, pen({ strokeWidth: 3 }));
  const sceneD3 = full("b-sD3",
    svgBoard(
      `<g id="b-div">${r.line(960, 190, 960, 800, pen({ strokeWidth: 1.8, stroke: "rgba(232,232,232,0.5)" }))}</g>` +
      `<g id="b-mol">${molSvg}</g>` +
      `<g id="b-lap2">${laptopSvg(1180, 330, "")}</g>` +
      `<g id="b-lap2s"><g transform="translate(1180 330)">${lapScreenD}</g></g>` +
      `<g id="b-tick">${tickSvg(1660, 440, 1.3)}</g>`
    ) +
    lbl("b-hidden", 210, 180, 640, 62, "hidden patterns", "text-align:left") +
    lbl("b-fact", 210, 300, 640, 70, `15 = <span class="gold">3 × 5</span>`, "text-align:left") +
    lbl("b-factlbl", 214, 392, 300, 46, "factoring", "text-align:left") +
    clbl("b-mollbl", 560, 726, 300, 46, "molecules") +
    clbl("b-everyday", 1390, 660, 360, 54, "everyday jobs")
  );
  const scriptD3 = `
    // ---- Scene D3: hidden patterns vs everyday jobs ----
    draw("#b-div", ${T.sceneD2 + 0.1}, 0.6);
    write("#b-hidden", ${T.hidden}, 0.8);
    write("#b-fact", ${T.factoring}, 0.7);
    write("#b-factlbl", ${T.factoring + 0.5}, 0.5);
    draw("#b-mol", ${T.molecules}, 1.0);
    write("#b-mollbl", ${T.molecules + 0.6}, 0.5);
    draw("#b-lap2", ${T.everyday}, 0.9);
    draw("#b-lap2s", ${T.everyday + 0.6}, 0.6);
    write("#b-everyday", ${T.everyday + 0.4}, 0.6);
    draw("#b-tick", ${T.wins}, 0.35);
    blurOut("#b-sD3", ${T.sceneD3});
  `;

  // =====================================================================
  // Scene D4: closing card
  // =====================================================================
  const D4L = { cx: 560, base: 600 }, D4R = { cx: 1360, base: 600 }, BH = 80;
  const sceneD4 = full("b-sD4",
    svgBoard(
      `<path id="b-ul" fill="none" stroke="${GOLD}" stroke-width="4.4" stroke-linecap="round"/>` +
      `<g id="b-lbase">${r.line(D4L.cx - 170, D4L.base, D4L.cx + 170, D4L.base, pen({ strokeWidth: 2.6 }))}</g>` +
      `<g id="b-rbase">${r.line(D4R.cx - 170, D4R.base, D4R.cx + 170, D4R.base, pen({ strokeWidth: 2.6 }))}</g>` +
      mover("b-lu", barSvg(BH)) + mover("b-ld", barSvg(BH, INK, true)) +
      mover("b-r1", `<g id="b-r1i">${barSvg(BH)}</g><g id="b-r1g">${barSvg(BH, GOLD)}</g>`) +
      mover("b-r2", `<g id="b-r2i">${barSvg(BH)}</g><g id="b-r2g">${barSvg(BH, GOLD)}</g>`)
    ) +
    clbl("b-speed", 960, 150, 900, 54, "quantum speed-ups come from") +
    clbl("b-interf2", 960, 214, 1000, 116, "interference", G) +
    clbl("b-lcap", D4L.cx, 684, 460, 50, "wrong answers cancel") +
    clbl("b-rcap", D4R.cx, 684, 460, 50, "right ones reinforce")
  );
  const scriptD4 = `
    // ---- Scene D4: closing card (holds to the end) ----
    hide(["#b-ul", "#b-r1g", "#b-r2g"]);
    write("#b-speed", ${T.speedups}, 0.9);
    write("#b-interf2", ${T.interf2}, 0.9);
    fade("#b-ul", 1, ${T.interf2 + 0.7}, 0.1);
    draw(["#b-lbase", "#b-lu", "#b-ld"], ${T.wrong2}, 0.6);
    write("#b-lcap", ${T.cancel2 + 0.05}, 0.9);
    draw(["#b-rbase", "#b-r1", "#b-r2"], ${T.right2}, 0.5);
    fade(["#b-r1g", "#b-r2g"], 1, ${T.reinforce + 0.45}, 0.3);
    fade(["#b-r1i", "#b-r2i"], 0, ${T.reinforce + 0.45}, 0.3);
    write("#b-rcap", ${T.reinforce + 0.05}, 0.9);
    onFrame((t) => {
      if (t < ${T.sceneD3 - 0.2}) return;
      const reveal = ease.clamp((t - ${T.interf2 + 0.7}) / 0.6);
      let s = "";
      for (let x = 700, i = 0; x <= 700 + reveal * 520 + 0.01; x += 8, i++) s += (i ? " L" : "M") + x.toFixed(1) + " " + (348 + 5 * Math.sin(x * 0.035 - t * 3.2)).toFixed(1);
      $("b-ul").setAttribute("d", reveal > 0 ? s : "M0 0");
      const c = sched([[${T.cancel2 - 0.1}, ${T.cancel2 + 0.4}, 0, 1]], t), shrink = 1 - sched([[${T.cancel2 + 0.4}, ${T.cancel2 + 0.9}, 0, 1]], t);
      put("b-lu-p", ${D4L.cx - 90} + 90 * c, ${D4L.base}, 1, Math.max(0.001, shrink));
      put("b-ld-p", ${D4L.cx + 90} - 90 * c, ${D4L.base}, 1, Math.max(0.001, shrink));
      const st = sched([[${T.reinforce - 0.25}, ${T.reinforce + 0.45}, 0, 1]], t);
      put("b-r1-p", ${D4R.cx - 90} + 90 * st, ${D4R.base});
      put("b-r2-p", ${D4R.cx + 90} - 90 * st, ${D4R.base} - ${BH} * st);
    });
  `;

  const helpers = `
    const put = (id, x, y, sx = 1, sy = 1) => $(id).setAttribute("transform", "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ") scale(" + sx.toFixed(3) + " " + sy.toFixed(3) + ")");
    function arrowD(x1, y1, x2, y2) {
      const a = Math.atan2(y2 - y1, x2 - x1), h = 15, mx = (x1 + x2) / 2 + (y2 - y1) * 0.12, my = (y1 + y2) / 2 - (x2 - x1) * 0.12;
      const p = (da) => (x2 - h * Math.cos(a + da)).toFixed(1) + " " + (y2 - h * Math.sin(a + da)).toFixed(1);
      return "M" + x1 + " " + y1 + " Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + x2.toFixed(1) + " " + y2.toFixed(1) + " M" + p(0.45) + " L" + x2.toFixed(1) + " " + y2.toFixed(1) + " L" + p(-0.45);
    }
  `;

  return {
    html: sceneA + sceneB1 + sceneB2 + sceneC1 + sceneC2 + sceneD1 + sceneD2 + sceneD3 + sceneD4,
    script: helpers + scriptA + scriptB1 + scriptB2 + scriptC1 + scriptC2 + scriptD1 + scriptD2 + scriptD3 + scriptD4,
    css: "",
  };
}
