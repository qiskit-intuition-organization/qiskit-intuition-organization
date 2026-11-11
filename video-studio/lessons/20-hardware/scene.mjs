// Lesson 20, "Noise and real hardware". Follows plan.md: the X X hook (ideal says 0, a chip sometimes
// says 1), the whispering line, gates that whisper and a waiting qubit that leaks, transpiling (two gates
// become ten), the Bloch arrow that shrinks toward the centre with live readout bars, (1 − λ) per gate
// counted for ten and a hundred gates, shot wobble on a 10 by 10 grid, the ideal vs chip comparison,
// mitigation vs correction, and the closing ball whose arrow keeps shrinking through the hold.
// Gold is the thing that matters right now: the wrong reading, the changed letter, the arrow, the gap.
export const phrases = [
  ["one minus lambda", "1 − λ"],
  ["lambda", "λ"],
  ["one percent", "1%"],
  ["ninety percent", "90%"],
  ["one time in twenty", "1 in 20"],
  ["one time in three", "1 in 3"],
  ["forty seven", "47"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, mulberry32, INK, GOLD, GROUND } = k;
  const DIMINK = "rgba(232,232,232,0.35)";
  const f1 = (n) => +(+n).toFixed(1);
  // Label centred on (cx, cy), and a left-aligned label whose text is centred on cy.
  const C = (id, cx, cy, w, size, html, extra = "") => lbl(id, f1(cx - w / 2), f1(cy - size * 0.76), w, size, html, extra);
  const LL = (id, x, cy, w, size, html, extra = "") => lbl(id, f1(x), f1(cy - size * 0.76), w, size, html, `text-align:left;${extra}`);
  const G = (id, inner, extra = "") => `<g id="${id}"${extra}>${inner}</g>`;
  const full = (id, svg, inner = "") => `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${inner}</div>`;
  const wrap = (id, inner) => `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px">${inner}</div>`;
  const cc = (svg) => svg.replaceAll(`stroke="${INK}"`, 'stroke="currentColor"').replaceAll(`stroke="${GOLD}"`, 'stroke="currentColor"');
  const solidBox = (x, y, w, h, o = {}) => r.rect(x, y, w, h, pen({ strokeWidth: 3.2, roughness: 1, fill: GROUND, fillStyle: "solid", ...o }));
  const hatch = (c, gap = 9) => ({ fill: c, fillStyle: "hachure", hachureGap: gap, fillWeight: 2 });
  const GS = (s) => `<span style="color:${GOLD}">${s}</span>`;
  // Glyphs Caveat lacks: lambda and not-equal, drawn by hand (they follow the label's colour).
  const LAM = `<svg class="gl" viewBox="0 0 60 100" style="width:0.5em"><path d="M12 10 C24 32 38 62 54 92 M33 48 C24 63 16 78 8 92"/></svg>`;
  const NEQ = `<svg class="gl" viewBox="0 0 70 100" style="width:0.7em;height:0.6em;vertical-align:0"><path d="M6 40 C24 39 44 40 64 39 M6 64 C24 63 44 64 64 63 M48 14 C40 42 32 70 22 94"/></svg>`;
  const M = "−";

  // ---------- Times, cued to the voice ----------
  const T = {
    qubit: cue(0, "qubit"), quantum: cue(0, "quantum"), flip: cue(0, "flip"), twice: cue(0, "twice"), always0: cue(0, "always"), read0: cue(0, "read"),
    l1: cue(1), sim: cue(1, "simulator"), laptop: cue(1, "laptop"), agrees: cue(1, "agrees"), chip: cue(1, "chip"), sometimes: cue(1, "sometimes"), reads1: cue(1, "reads"), one1: cue(1, "one"),
    why: cue(2, "why"), think: cue(2, "think"), whispering: cue(2, "whispering"), message: cue(2, "message"), each2: cue(2, "each"), mistake: cue(2, "mistake"),
    short: cue(3, "short"), through: cue(3, "through"), long: cue(3, "long"), turns: cue(3, "turns"), mush: cue(4, "mush"),
    gates4: cue(4, "gates"), steps: cue(4, "steps"), whisper4: cue(4, "whisper"), off: cue(4, "off"), waiting: cue(4, "waiting"), leaks: cue(4, "leaks"), noise5: cue(5, "noise"),
    your: cue(5, "your"), circuit5: cue(5, "circuit"), transpiled: cue(5, "transpiled"), rewritten: cue(5, "rewritten"), few: cue(5, "few"), wiring: cue(5, "wiring"),
    two5: cue(5, "two"), become: cue(5, "become"), ten5: cue(5, "ten"),
    qubit6: cue(6, "qubit"), arrow6: cue(6, "arrow"), ball: cue(6, "ball"), zero6: cue(6, "zero"), one6: cue(6, "one"),
    breaks: cue(7, "breaks"), new7: cue(7, "new"), shrinks7: cue(7, "shrinks"), f50: cue(7, "50-50"), center: cue(7, "center"),
    l8: cue(8), gate8: cue(8, "gate"), random8: cue(8, "random"), chance8: cue(8, "chance"), lambda8: cue(8, "lambda"), keeps: cue(8, "keeps"), one8: cue(8, "one"),
    l9: cue(9), pct9: cue(9, "one"), ten9: cue(9, "ten"), ninety: cue(9, "ninety"), reads9: cue(9, "reads"), twenty: cue(9, "twenty"),
    hundred: cue(10, "hundred"), nearly: cue(10, "nearly"), about9: cue(9, "about", 1), third: cue(10, "third"), reads10: cue(10, "reads"), three: cue(11, "three"),
    wobble11: cue(11, "wobble"), chance11: cue(11, "chance"), runs: cue(11, "runs"), shots: cue(11, "shots"), give: cue(11, "give"), forty: cue(11, "forty"),
    always12: cue(12, "always"), compare: cue(12, "compare"), ideal12: cue(12, "ideal"), same: cue(12, "same"), gap: cue(12, "gap"), wobble12: cue(12, "wobble"), device: cue(12, "device"),
    careful: cue(13, "careful"), mitigation: cue(13, "mitigation"), estimates: cue(13, "estimates"), results: cue(13, "results"), protecting: cue(13, "protecting"),
    correction: cue(13, "correction"), extra: cue(13, "extra"),
    every: cue(14, "every"), gate14: cue(14, "gate"), noise14: cue(14, "noise"), shrinks14: cue(14, "shrinks"), random14: cue(14, "random"),
  };

  // ===================== Shared drawing helpers =====================
  // A curved arrow through pts with a head at the last point.
  function curveArrow(pts, o = {}, head = 14) {
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const hp = (da) => [b[0] - head * Math.cos(ang + da), b[1] - head * Math.sin(ang + da)];
    const [h1, h2] = [hp(0.5), hp(-0.5)];
    const p = o.gold ? goldPen : pen;
    const oo = { ...o }; delete oo.gold;
    return r.curve(pts, p(oo)) + r.line(b[0], b[1], h1[0], h1[1], p(oo)) + r.line(b[0], b[1], h2[0], h2[1], p(oo));
  }
  // A dotted arrow: short strokes along the line, then a head.
  function dottedArrow(x1, y1, x2, y2, o = {}) {
    const L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.floor(L / 16));
    let s = "";
    for (let i = 0; i < n; i += 2) {
      const a = i / n, b = Math.min(1, (i + 1) / n);
      s += r.line(x1 + (x2 - x1) * a, y1 + (y2 - y1) * a, x1 + (x2 - x1) * b, y1 + (y2 - y1) * b, pen({ strokeWidth: 2.4, roughness: 0.5, ...o }));
    }
    const ang = Math.atan2(y2 - y1, x2 - x1), hd = 12;
    s += r.line(x2, y2, x2 - hd * Math.cos(ang + 0.5), y2 - hd * Math.sin(ang + 0.5), pen({ strokeWidth: 2.4, ...o }));
    s += r.line(x2, y2, x2 - hd * Math.cos(ang - 0.5), y2 - hd * Math.sin(ang - 0.5), pen({ strokeWidth: 2.4, ...o }));
    return s;
  }
  // Dashes from x1 to x2 at y.
  const dashes = (x1, x2, y, o = {}, len = 14, gap = 11) => {
    let s = "";
    for (let x = x1; x < x2; x += len + gap) s += r.line(x, y, Math.min(x + len, x2), y, pen({ strokeWidth: 2.2, roughness: 0.5, ...o }));
    return s;
  };
  const vdashes = (x, y1, y2, o = {}, len = 14, gap = 11) => {
    let s = "";
    for (let y = y1; y < y2; y += len + gap) s += r.line(x, y, x, Math.min(y + len, y2), pen({ strokeWidth: 2.2, roughness: 0.5, ...o }));
    return s;
  };
  // A bracket under (x1..x2) at y with end ticks pointing up.
  const bracket = (x1, x2, y, o = {}, tick = 16, p = pen) =>
    r.line(x1, y, x2, y, p({ strokeWidth: 2.8, ...o })) + r.line(x1, y, x1, y - tick, p({ strokeWidth: 2.6, ...o })) + r.line(x2, y, x2, y - tick, p({ strokeWidth: 2.6, ...o }));
  // A vertical bar whose height the timeline sets (clip rect id-cr), with an outline path id-o.
  function vbar(id, x, w, yBot, hMax, color, style = "hachure") {
    const fill = style === "solid" ? { fill: color, fillStyle: "solid" } : hatch(color, 9);
    const body = r.rect(x + 3, yBot - hMax, w - 6, hMax, pen({ ...fill, stroke: "none", roughness: 1.1 }));
    return `<defs><clipPath id="${id}-c"><rect id="${id}-cr" x="${x - 4}" y="${yBot}" width="${w + 8}" height="0"/></clipPath></defs>` +
      `<g id="${id}"><g clip-path="url(#${id}-c)">${body}</g>` +
      `<path id="${id}-o" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }
  // A horizontal bar whose length the timeline sets, over a faint full-length track.
  function hbar(id, x, y, h, wMax, color) {
    const body = r.rect(x + 2, y + 3, wMax - 4, h - 6, pen({ ...hatch(color, 8), stroke: "none", roughness: 1.1 }));
    return G(`${id}-tr`, r.rect(x, y, wMax, h, pen({ strokeWidth: 1.8, stroke: DIMINK, roughness: 0.8 }))) +
      `<defs><clipPath id="${id}-c"><rect id="${id}-cr" x="${x}" y="${y - 4}" width="0" height="${h + 8}"/></clipPath></defs>` +
      `<g id="${id}"><g clip-path="url(#${id}-c)">${body}</g>` +
      `<path id="${id}-o" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }
  // Bloch ball: circle, equator (front solid, back dashed), small 0 and 1, centre dot.
  function ball(p, cx, cy, R, size = 52) {
    const ry = R * 0.26;
    let back = "";
    for (let i = 0; i < 9; i++) {
      const a0 = Math.PI + (i * Math.PI) / 9 + 0.04;
      back += r.arc(cx, cy, 2 * R, 2 * ry, a0, a0 + Math.PI / 18, false, pen({ strokeWidth: 2, roughness: 0.5, stroke: DIMINK }));
    }
    const svg = G(`${p}-c`, r.circle(cx, cy, 2 * R, pen({ strokeWidth: 3.2, roughness: 1.1 }))) +
      G(`${p}-eq`, r.arc(cx, cy, 2 * R, 2 * ry, 0, Math.PI, false, pen({ strokeWidth: 2.4, roughness: 0.8 })) + back) +
      `<circle id="${p}-dot" cx="${cx}" cy="${cy}" r="8" fill="${INK}"/>`;
    const html = C(`${p}-0`, cx, cy - R - 36, 80, size, "0") + C(`${p}-1`, cx, cy + R + 40, 80, size, "1");
    return { svg, html };
  }
  // The gold arrow from the centre straight up. Its length is set every frame:
  // the shaft group scales about the centre, the head rides on the tip at a fixed size.
  function blochArrow(p, cx, cy, len) {
    const shaft = r.line(cx, cy, cx, cy - len + 6, goldPen({ strokeWidth: 6, roughness: 0.7 }));
    const head = r.line(cx, cy - len, cx - 17, cy - len + 28, goldPen({ strokeWidth: 5, roughness: 0.6 })) +
      r.line(cx, cy - len, cx + 17, cy - len + 28, goldPen({ strokeWidth: 5, roughness: 0.6 }));
    return `<g id="${p}-sT">${G(`${p}-s`, shaft)}</g><g id="${p}-hT">${G(`${p}-h`, head)}</g>`;
  }
  // The hook circuit, |0⟩ then X X then a meter, in local units with the wire start at (ox, oy), scale s.
  function hook(p, ox, oy, s, withZero) {
    const X = (x) => f1(ox + x * s), Y = (y) => f1(oy + y * s), S = (v) => f1(v * s);
    const svg = G(`${p}-w`, r.line(X(0), Y(0), X(585), Y(0), pen({ strokeWidth: 3 }))) +
      G(`${p}-x1`, solidBox(X(185), Y(-55), S(110), S(110))) +
      G(`${p}-x2`, solidBox(X(385), Y(-55), S(110), S(110))) +
      G(`${p}-m`, solidBox(X(585), Y(-50), S(110), S(100)) +
        r.arc(X(640), Y(30), S(80), S(80), Math.PI, 2 * Math.PI, false, pen({ strokeWidth: 2.6, roughness: 0.8 })) +
        r.line(X(640), Y(30), X(668), Y(-16), pen({ strokeWidth: 2.8, roughness: 0.6 })));
    const html = C(`${p}-k0`, X(-72), Y(0), S(150), S(64), "|0⟩") +
      C(`${p}-xl1`, X(240), Y(0), S(80), S(64), "X") + C(`${p}-xl2`, X(440), Y(0), S(80), S(64), "X") +
      (withZero ? C(`${p}-z`, X(770), Y(0), S(110), S(90), "0", `color:${GOLD}`) : "");
    return { svg, html };
  }

  // ===================== Scene A: the hook (lines 0 and 1) =====================
  const hA = hook("b-h", 560, 560, 1, true);
  const hookObj = full("b-hc", hA.svg, hA.html + C("b-qnote", 490, 648, 380, 44, "qubit = quantum bit") + C("b-xflip", 800, 655, 200, 40, "X = flip"));
  const simSvg =
    G("b-lap",
      r.rect(352, 362, 236, 134, pen({ strokeWidth: 3 })) +
      r.line(378, 398, 470, 398, pen({ strokeWidth: 2.2 })) + r.line(378, 428, 548, 428, pen({ strokeWidth: 2.2 })) + r.line(378, 458, 500, 458, pen({ strokeWidth: 2.2 })) +
      r.poly([[334, 502], [606, 502], [632, 530], [308, 530]], pen({ strokeWidth: 3 }))) +
    G("b-sch", r.line(650, 760, 905, 760, pen({ strokeWidth: 3 })) +
      r.rect(680, 580, 70, 180, pen({ ...hatch(INK), strokeWidth: 2.8 })) +
      r.line(800, 757, 870, 757, pen({ strokeWidth: 4, roughness: 0.4 }))) +
    G("b-stick", r.linear([[692, 548], [710, 566], [742, 520]], pen({ strokeWidth: 4.6, roughness: 0.7 })));
  const simHtml = C("b-siml", 470, 588, 340, 48, "ideal simulator") + C("b-sl0", 715, 800, 60, 44, "0") + C("b-sl1", 835, 800, 60, 44, "1");
  let pins = "";
  for (let x = 1058; x <= 1246; x += 37) pins += r.line(x, 380, x, 360, pen({ strokeWidth: 2.4 })) + r.line(x, 560, x, 580, pen({ strokeWidth: 2.4 }));
  for (let y = 408; y <= 536; y += 32) pins += r.line(1030, y, 1010, y, pen({ strokeWidth: 2.4 })) + r.line(1270, y, 1290, y, pen({ strokeWidth: 2.4 }));
  const QD = [[1112, 448], [1150, 448], [1188, 448], [1112, 492], [1150, 492], [1188, 492]];
  const chipSvg =
    G("b-chipb", r.rect(1030, 380, 240, 180, pen({ strokeWidth: 3.2 })) + pins) +
    G("b-chipd", r.rect(1082, 420, 136, 100, pen({ strokeWidth: 2.2 })) +
      r.line(1112, 448, 1188, 448, pen({ strokeWidth: 1.8 })) + r.line(1112, 492, 1188, 492, pen({ strokeWidth: 1.8 })) +
      r.line(1112, 448, 1112, 492, pen({ strokeWidth: 1.8 })) + r.line(1188, 448, 1188, 492, pen({ strokeWidth: 1.8 })) +
      QD.map(([x, y]) => r.circle(x, y, 15, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" }))).join("")) +
    G("b-cch", r.line(1320, 760, 1580, 760, pen({ strokeWidth: 3 })) + r.rect(1350, 589, 70, 171, pen({ ...hatch(INK), strokeWidth: 2.8 }))) +
    vbar("b-cb1", 1470, 70, 760, 40, GOLD, "solid");
  const chipHtml = C("b-chipl", 1150, 628, 240, 48, "real chip") + C("b-cl0", 1385, 800, 60, 44, "0") + C("b-cl1", 1505, 800, 60, 44, "1");
  const sA = wrap("b-sA", hookObj + full("b-simP", simSvg, simHtml) + full("b-chipP", chipSvg, chipHtml) + C("b-why", 960, 560, 140, 120, "?", `color:${GOLD}`));

  // ===================== Scene B: whispering down a line (lines 2 and 3) =====================
  const PX = Array.from({ length: 8 }, (_, i) => 240 + i * 200);
  const person = (x) =>
    r.circle(x, 450, 60, pen({ strokeWidth: 3 })) + r.curve([[x + 12, 462], [x + 20, 466], [x + 26, 460]], pen({ strokeWidth: 2.2 })) +
    r.circle(x + 12, 442, 6, pen({ strokeWidth: 1.6, fill: INK, fillStyle: "solid" })) +
    r.line(x, 481, x, 570, pen({ strokeWidth: 3.2 })) +
    r.line(x, 505, x - 30, 548, pen({ strokeWidth: 2.8 })) + r.line(x, 505, x + 30, 548, pen({ strokeWidth: 2.8 })) +
    r.line(x, 570, x - 28, 640, pen({ strokeWidth: 3 })) + r.line(x, 570, x + 28, 640, pen({ strokeWidth: 3 }));
  const bubble = (cx, cy, w, h, o = {}) =>
    r.ellipse(cx, cy, w, h, pen({ strokeWidth: 2.6, ...o })) + r.line(cx - 14, cy + h / 2 - 2, cx - 6, cy + h / 2 + 26, pen({ strokeWidth: 2.4, ...o }));
  const BUB = [0, 1, 2, 4, 7];
  const bSvg =
    PX.map((x, i) => G(`b-p${i}`, person(x))).join("") +
    PX.slice(0, 7).map((x, i) => G(`b-wa${i}`, curveArrow([[x + 36, 424], [x + 102, 398], [x + 168, 424]], { strokeWidth: 2.2 }, 12))).join("") +
    BUB.map((i) => G(`b-bb${i}`, bubble(PX[i], 336, 190, 84))).join("") +
    G("b-btick", r.linear([[PX[1] + 66, 282], [PX[1] + 80, 298], [PX[1] + 104, 262]], pen({ strokeWidth: 4, roughness: 0.7 }))) +
    G("b-scrib", r.linear([[1572, 318], [1600, 352], [1622, 316], [1648, 354], [1672, 318], [1698, 350]], pen({ strokeWidth: 3, roughness: 1.2 }))) +
    G("b-mush", r.curve([[1572, 340], [1590, 312], [1610, 360], [1624, 318], [1636, 352], [1654, 314], [1668, 362], [1684, 322], [1702, 346]], goldPen({ strokeWidth: 4, roughness: 1.6 }))) +
    G("b-brs", bracket(190, 480, 672)) + G("b-brl", bracket(190, 1690, 754));
  const word = (a, g, b) => `${a}<span class="b-gl" style="color:${GOLD};display:inline-block">${g}</span>${b}`;
  const bHtml =
    C("b-w0", PX[0], 336, 190, 48, "blue cat") + C("b-w1", PX[1], 336, 190, 48, "blue cat") +
    C("b-w2", PX[2], 336, 190, 48, word("blue ", "h", "at")) + C("b-w4", PX[4], 336, 190, 48, word("", "g", "lue hat")) +
    C("b-w7", PX[7], 336, 190, 48, word("glue ", "m", "at")) +
    C("b-shortl", 335, 708, 260, 44, "short line") + C("b-longl", 940, 792, 300, 44, "long line");
  const sB = full("b-sB", bSvg, bHtml);

  // ===================== Scene C: gates whisper too (line 4) =====================
  const GX = [340, 495, 650, 805, 960];
  const tilde = (cx, cy) => r.curve([[cx - 26, cy + 4], [cx - 13, cy - 9], [cx, cy + 3], [cx + 13, cy + 12], [cx + 26, cy - 3]], goldPen({ strokeWidth: 4, roughness: 0.6 }));
  const cSvg =
    G("b-cw", r.line(220, 420, 1700, 420, pen({ strokeWidth: 3 }))) +
    GX.map((x, i) => G(`b-gb${i}`, solidBox(x - 45, 375, 90, 90))).join("") +
    GX.map((x, i) => G(`b-gw${i}`, curveArrow([[x - 32, 362], [x, 340], [x + 32, 360]], { strokeWidth: 2.2 }, 11))).join("") +
    `<g id="b-tildes" style="color:${GOLD}">${GX.map((x, i) => G(`b-td${i}`, cc(tilde(x, 420)))).join("")}</g>` +
    G("b-hg",
      r.line(1356, 212, 1444, 212, pen({ strokeWidth: 3.2 })) + r.line(1356, 348, 1444, 348, pen({ strokeWidth: 3.2 })) +
      r.curve([[1364, 214], [1372, 258], [1398, 280], [1372, 302], [1364, 346]], pen({ strokeWidth: 2.8 })) +
      r.curve([[1436, 214], [1428, 258], [1402, 280], [1428, 302], [1436, 346]], pen({ strokeWidth: 2.8 })) +
      r.poly([[1374, 344], [1426, 344], [1400, 318]], pen({ ...hatch(INK, 6), strokeWidth: 1.6 })) +
      r.line(1400, 282, 1400, 316, pen({ strokeWidth: 1.6, strokeLineDash: [3, 5] }))) +
    G("b-lk", dottedArrow(1232, 404, 1206, 338) + dottedArrow(1420, 438, 1446, 506) + dottedArrow(1590, 404, 1624, 340)) +
    `<circle id="b-leak" cx="1110" cy="420" r="12" fill="${GOLD}" style="opacity:0"/>` +
    G("b-nbr", bracket(220, 1700, 604, {}, 18));
  const cHtml =
    C("b-gate1", 650, 532, 600, 44, "gate = one step of a circuit") + C("b-soff", 650, 286, 300, 44, "slightly off") +
    LL("b-waitl", 1466, 282, 220, 44, "waiting") + C("b-noisel", 960, 664, 320, 64, "= noise", `color:${GOLD}`);
  const sC = full("b-sC", cSvg, cHtml);

  // ===================== Scene D: transpiling, two gates become ten (line 5) =====================
  const QY = [230, 290, 350];
  const BY = [600, 680, 760];
  const gbox = (x, y1, y2, w = 64) => solidBox(x - w / 2, y1, w, y2 - y1, { strokeWidth: 2.8 });
  // The ten native gates: [x, top wire, bottom wire, label]
  const TEN = [
    [290, 0, 0, "rz"], [370, 0, 0, "sx"], [450, 0, 0, "rz"],
    [565, 0, 1, "cx"], [655, 0, 1, "cx"], [745, 0, 1, "cx"],
    [860, 1, 2, "cx"],
    [975, 0, 1, "cx"], [1065, 0, 1, "cx"], [1155, 0, 1, "cx"],
  ];
  const dSvg =
    G("b-qw", QY.map((y) => r.line(262, y, 900, y, pen({ strokeWidth: 2.8 }))).join("")) +
    G("b-qH", gbox(420, QY[0] - 30, QY[0] + 30, 60)) +
    G("b-qC", r.line(620, QY[0], 620, QY[2] + 22, pen({ strokeWidth: 2.8 })) + r.circle(620, QY[0], 18, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" })) +
      r.circle(620, QY[2], 44, pen({ strokeWidth: 2.8, fill: GROUND, fillStyle: "solid" })) + r.line(598, QY[2], 642, QY[2], pen({ strokeWidth: 2.6 }))) +
    G("b-tar", arrow(960, 380, 960, 478, { stroke: GOLD, strokeWidth: 4.4 }, 20)) +
    G("b-wire3", r.circle(1430, 225, 18, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" })) + r.circle(1545, 225, 18, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" })) +
      r.circle(1660, 225, 18, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" })) + r.line(1440, 225, 1535, 225, pen({ strokeWidth: 2.6 })) + r.line(1555, 225, 1650, 225, pen({ strokeWidth: 2.6 }))) +
    G("b-bw", BY.map((y) => r.line(232, y, 1300, y, pen({ strokeWidth: 2.8 }))).join("")) +
    TEN.map(([x, a, b], i) => `<g id="b-tg${i}" style="color:${INK}">${cc(gbox(x, BY[a] - 32, BY[b] + 32))}</g>`).join("");
  const dHtml =
    LL("b-yc", 200, 136, 300, 48, "your circuit") + LL("b-2g", 470, 136, 200, 48, "2 gates") +
    QY.map((y, i) => C(`b-qk${i}`, 218, y, 70, 40, "q" + i)).join("") + C("b-qHl", 420, QY[0], 60, 44, "H") +
    LL("b-tpl", 1000, 402, 300, 48, "transpiled") + LL("b-tpl2", 1000, 456, 440, 40, "= rewritten for the chip") +
    LL("b-cgates", 1180, 146, 560, 40, "chip's gates: rz sx cx") + LL("b-cwl", 1180, 222, 240, 40, "chip wiring:") +
    [1430, 1545, 1660].map((x, i) => C(`b-ck${i}`, x, 272, 60, 40, "q" + i)).join("") +
    LL("b-cnj", 1180, 330, 560, 40, "q0 and q2 not joined") +
    BY.map((y, i) => C(`b-bk${i}`, 190, y, 70, 40, "q" + i)).join("") +
    TEN.map(([x, a, b, t], i) => C(`b-tl${i}`, x, (BY[a] + BY[b]) / 2, 60, 40, t, `color:${INK}`)).join("") +
    C("b-sw1", 655, 534, 200, 40, "swap") + C("b-sw2", 1065, 534, 200, 40, "swap") +
    LL("b-10g", 1360, 680, 360, 56, "10 gates", `color:${GOLD}`);
  const sD = full("b-sD", dSvg, dHtml);

  // ===================== Scene E: the Bloch ball and the readout (lines 6 to 10) =====================
  const BC = { cx: 640, cy: 470, R: 270, len: 250 };
  const bl = ball("b-bl", BC.cx, BC.cy, BC.R);
  const RB = { x: 1290, w: 340, h: 44, y0: 358, y1: 458 };
  const TK = Array.from({ length: 10 }, (_, i) => 1092 + i * 62);
  const dice = r.rect(1085, 125, 50, 50, pen({ strokeWidth: 2.6, roughness: 0.8 })) +
    [[1097, 137], [1110, 150], [1123, 163]].map(([x, y]) => r.circle(x, y, 9, pen({ strokeWidth: 1.4, fill: INK, fillStyle: "solid" }))).join("");
  const eSvg =
    bl.svg + blochArrow("b-ar", BC.cx, BC.cy, BC.len) +
    hbar("b-r0", RB.x, RB.y0, RB.h, RB.w, INK) + hbar("b-r1", RB.x, RB.y1, RB.h, RB.w, GOLD) +
    G("b-bub7", bubble(1425, 160, 350, 84)) +
    G("b-x7", r.line(1290, 120, 1560, 205, pen({ strokeWidth: 3.6 })) + r.line(1290, 205, 1560, 118, pen({ strokeWidth: 3.6 }))) +
    G("b-g8", solidBox(1060, 100, 100, 100)) + G("b-dice", dice) +
    G("b-tw", r.line(1060, 680, 1720, 680, pen({ strokeWidth: 2.6 }))) +
    TK.map((x, i) => `<g id="b-tk${i}" style="opacity:0">${solidBox(x - 12, 668, 24, 24, { strokeWidth: 2.2 })}</g>`).join("") +
    `<defs><clipPath id="b-band-c"><rect id="b-band-cr" x="1072" y="650" width="0" height="60"/></clipPath></defs>` +
    `<g id="b-band" clip-path="url(#b-band-c)">${r.rect(1074, 666, 636, 28, pen({ ...hatch(INK, 5), strokeWidth: 2.2 }))}</g>`;
  const eHtml =
    bl.html +
    LL("b-rl0", 1060, RB.y0 + 22, 220, 48, "reads 0") + LL("b-rl1", 1060, RB.y1 + 22, 220, 48, "reads 1") +
    LL("b-rp0", RB.x + RB.w + 14, RB.y0 + 22, 120, 44, "100%") + LL("b-rp1", RB.x + 14, RB.y1 + 22, 120, 44, "0%", `color:${GOLD}`) +
    LL("b-5050", 668, 470, 160, 48, "50/50", `color:${GOLD}`) +
    C("b-gm7", 1425, 160, 300, 44, "glue mat") +
    C("b-lamc", 1143, 118, 34, 40, LAM) + LL("b-lams", 1190, 150, 380, 44, `${LAM} = small chance`) +
    `<div class="obj" id="b-fw" style="left:1060px;top:0;width:700px;height:400px;transform-origin:0 0">` +
    LL("b-form", 0, 258, 640, 56, `length × <span id="b-fg">(1 ${M} ${LAM})</span>`) + `</div>` +
    LL("b-lam1", 1460, 140, 260, 48, `${LAM} = 1%`) +
    LL("b-cnt", 1060, 222, 340, 56, `gates: <span id="b-cntn">0</span>`) +
    LL("b-len", 1400, 224, 340, 48, `length: <span id="b-lenn">100%</span>`) +
    LL("b-n20", RB.x, 566, 460, 44, "≈ 5%, 1 in 20", `color:${GOLD}`) +
    LL("b-n3", RB.x, 566, 460, 44, "≈ 32%, nearly 1 in 3", `color:${GOLD}`);
  const sE = full("b-sE", eSvg, eHtml);

  // ===================== Scene F: shot wobble (line 11) =====================
  // A fixed 10 by 10 pattern with exactly 47 ones.
  const rnd = mulberry32(2047);
  const order = Array.from({ length: 100 }, (_, i) => i);
  for (let i = 99; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const ONES = new Set(order.slice(0, 47));
  const PAT = Array.from({ length: 100 }, (_, i) => (ONES.has(i) ? 1 : 0));
  const cell = (i) => [648 + (i % 10) * 56, 258 + Math.floor(i / 10) * 56];
  const fSvg =
    `<g id="b-coinT">${G("b-coin", r.circle(300, 450, 180, pen({ strokeWidth: 3.4 })) + r.circle(300, 450, 146, pen({ strokeWidth: 1.8, roughness: 1.4 })))}</g>` +
    PAT.map((v, i) => {
      const [x, y] = cell(i);
      return `<g id="b-sh${i}" style="opacity:0">${v ? r.circle(x, y, 34, goldPen({ strokeWidth: 2, fill: GOLD, fillStyle: "solid" })) : r.circle(x, y, 32, pen({ strokeWidth: 2.4, roughness: 0.8 }))}</g>`;
    }).join("");
  const fHtml =
    C("b-coinf", 300, 450, 120, 80, `<span id="b-coinv" style="display:inline-block">0</span>`) +
    C("b-c5050", 300, 590, 200, 48, "50/50") +
    LL("b-shot", 1290, 262, 440, 44, "1 run = 1 shot") +
    LL("b-ones", 1290, 450, 440, 56, `ones: <span id="b-onesn">0</span>`) +
    LL("b-not50", 1290, 530, 440, 44, "not exactly 50");
  const sF = full("b-sF", fSvg, fHtml);

  // ===================== Scene G: compare with the ideal (line 12) =====================
  const hG = hook("b-k", 767, 150, 0.7, false);
  const CH = { yb: 770, h: 440, w: 110 };
  const GB = { i0: 420, i1: 640, c0: 1100, c1: 1300 };
  const gSvg =
    hG.svg +
    G("b-lnk", r.line(880, 205, 640, 250, pen({ strokeWidth: 2.2 })) + r.line(1040, 205, 1300, 250, pen({ strokeWidth: 2.2 }))) +
    G("b-ax1", r.line(370, CH.yb, 810, CH.yb, pen({ strokeWidth: 3 }))) + G("b-ax2", r.line(1050, CH.yb, 1490, CH.yb, pen({ strokeWidth: 3 }))) +
    vbar("b-gi0", GB.i0, CH.w, CH.yb, CH.h, INK) + vbar("b-gc0", GB.c0, CH.w, CH.yb, CH.h, INK) + vbar("b-gc1", GB.c1, CH.w, CH.yb, CH.h, GOLD, "solid") +
    // A zoom box on the chip's small "1" bar: the gold gap is far bigger than the shot wobble.
    G("b-zoom", r.rect(1250, 400, 240, 240, pen({ strokeWidth: 2.4, roughness: 0.8 })) +
      r.line(GB.c1 + 2, CH.yb - 24, 1250, 640, pen({ strokeWidth: 1.6, stroke: DIMINK })) + r.line(GB.c1 + CH.w - 2, CH.yb - 24, 1490, 640, pen({ strokeWidth: 1.6, stroke: DIMINK })) +
      r.line(1266, 620, 1474, 620, pen({ strokeWidth: 2.6 }))) +
    G("b-zbar", r.rect(1300, 488, 100, 132, pen({ ...hatch(GOLD, 9), stroke: GOLD, strokeWidth: 2.8 }))) +
    G("b-gapb", r.line(1432, 618, 1432, 490, goldPen({ strokeWidth: 4.4, roughness: 0.4 })) +
      r.line(1420, 618, 1444, 618, goldPen({ strokeWidth: 3.2, roughness: 0.3 })) + r.line(1420, 490, 1444, 490, goldPen({ strokeWidth: 3.2, roughness: 0.3 }))) +
    G("b-whisk", r.line(1350, 472, 1350, 504, pen({ strokeWidth: 2.8, roughness: 0.2 })) +
      r.line(1336, 472, 1364, 472, pen({ strokeWidth: 2.8, roughness: 0.2 })) + r.line(1336, 504, 1364, 504, pen({ strokeWidth: 2.8, roughness: 0.2 })));
  const gHtml =
    hG.html +
    C("b-gti", 590, 286, 420, 48, "ideal simulation") + C("b-gtc", 1270, 286, 300, 48, "real chip") +
    C("b-gx0", GB.i0 + 55, 808, 60, 44, "0") + C("b-gx1", GB.i1 + 55, 808, 60, 44, "1") +
    C("b-gx2", GB.c0 + 55, 808, 60, 44, "0") + C("b-gx3", GB.c1 + 55, 808, 60, 44, "1") +
    C("b-wobl", 1350, 438, 160, 40, "wobble") +
    LL("b-devn", 1502, 556, 280, 44, "device noise", `color:${GOLD}`);
  const sG = full("b-sG", gSvg, gHtml);

  // ===================== Scene H: mitigation is not correction (line 13) =====================
  const rag = (x0, hs, o = {}) => hs.map((h, i) => r.rect(x0 + i * 58, 560 - h, 42, h, pen({ strokeWidth: 2.6, roughness: 2.2, ...o }))).join("");
  const dotRect = (x, y, w, h) => dashes(x, x + w, y, {}, 10, 8) + vdashes(x, y, y + h, {}, 10, 8) + vdashes(x + w, y, y + h, {}, 10, 8);
  const HELP = Array.from({ length: 8 }, (_, i) => [1390 + 96 * Math.cos((i * Math.PI) / 4), 455 + 96 * Math.sin((i * Math.PI) / 4)]);
  const hSvg =
    G("b-mc1", r.line(232, 560, 480, 560, pen({ strokeWidth: 2.8 })) + rag(240, [170, 70, 58, 150], { ...hatch(INK, 10), fillWeight: 1.4 })) +
    G("b-mpen", curveArrow([[494, 470], [540, 440], [590, 470]], { strokeWidth: 3 }, 14)) +
    G("b-mc2", r.line(602, 560, 850, 560, pen({ strokeWidth: 2.8 })) + [205, 18, 18, 195].map((h, i) => dotRect(610 + i * 58, 560 - h, 42, h)).join("")) +
    G("b-clock", r.circle(848, 630, 44, pen({ strokeWidth: 2.4 })) + r.line(848, 630, 848, 614, pen({ strokeWidth: 2.2 })) + r.line(848, 630, 860, 636, pen({ strokeWidth: 2.2 }))) +
    G("b-shield", r.path("M1390 300 C1440 324 1480 330 1524 326 C1530 430 1500 540 1390 606 C1280 540 1250 430 1256 326 C1300 330 1340 324 1390 300 Z", goldPen({ strokeWidth: 4.2, roughness: 0.9 }))) +
    `<circle id="b-q13" cx="1390" cy="455" r="20" fill="${INK}"/>` +
    HELP.map(([x, y], i) => G(`b-hp${i}`, r.circle(f1(x), f1(y), 20, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" })))).join("");
  const hHtml =
    C("b-hm", 530, 200, 560, 56, "error mitigation") + C("b-neq", 960, 200, 80, 64, NEQ) + C("b-hc2", 1390, 200, 600, 56, "error correction") +
    C("b-mest", 530, 630, 560, 40, "a better estimate, after the run") +
    C("b-prot", 1390, 652, 640, 40, "protects the qubit, during the run") + C("b-xq", 1390, 712, 400, 40, "many extra qubits");
  const sH = full("b-sH", hSvg, hHtml);

  // ===================== Scene I: the closing picture (line 14 and the hold) =====================
  const IB = { cx: 520, cy: 470, R: 220, len: 200 };
  const bi = ball("b-bi", IB.cx, IB.cy, IB.R);
  const IX = Array.from({ length: 11 }, (_, i) => 252 + i * 54);
  const IR = { x: 1170, w: 300, h: 40, y0: 582, y1: 662 };
  const iSvg =
    bi.svg + blochArrow("b-ai", IB.cx, IB.cy, IB.len) +
    G("b-iw", r.line(220, 800, 822, 800, pen({ strokeWidth: 2.8 }))) +
    IX.map((x, i) => `<g id="b-ig${i}" style="opacity:0">${solidBox(x - 20, 780, 40, 40, { strokeWidth: 2.4 })}</g>`).join("") +
    hbar("b-i0", IR.x, IR.y0, IR.h, IR.w, INK) + hbar("b-i1", IR.x, IR.y1, IR.h, IR.w, GOLD);
  const iHtml =
    bi.html +
    LL("b-take1", 980, 262, 800, 72, "Every gate adds") + LL("b-take2", 980, 350, 800, 72, "a little noise.") +
    LL("b-tf", 980, 462, 800, 56, `length × ${GS(`(1 ${M} ${LAM})`)} per gate`) +
    LL("b-il0", 980, IR.y0 + 20, 190, 44, "reads 0") + LL("b-il1", 980, IR.y1 + 20, 190, 44, "reads 1") +
    LL("b-ip0", IR.x + 14, IR.y0 + 20, 110, 40, "100%") + LL("b-ip1", IR.x + 14, IR.y1 + 20, 110, 40, "0%", `color:${GOLD}`) +
    LL("b-rand", 1170, 742, 260, 48, "→ random");
  const sI = full("b-sI", iSvg, iHtml);

  const html = sA + sB + sC + sD + sE + sF + sG + sH + sI;

  // ===================== Timeline =====================
  const IGT = IX.map((_, i) => +(T.every + 0.15 + i * 0.6).toFixed(3));
  const script = `
    const T = ${JSON.stringify(T)};
    const BC = ${JSON.stringify(BC)}, RB = ${JSON.stringify(RB)}, IB = ${JSON.stringify(IB)}, IR = ${JSON.stringify(IR)};
    const PAT = ${JSON.stringify(PAT)};
    const IGT = ${JSON.stringify(IGT)};
    const IX = ${JSON.stringify(IX)};
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const f1 = (n) => (+n).toFixed(1);
    const ONESUM = PAT.reduce((acc, v) => (acc.push(acc[acc.length - 1] + v), acc), [0]);

    // The kit's draw() with autoRound off. GSAP rounds px values by default, so the kit's
    // strokeDashoffset 1 -> 0 (on pathLength 1) snaps from hidden to whole at mid-tween
    // instead of penning the stroke on. Same timing and behaviour otherwise.
    function drawP(sel, start, dur) {
      const groups = all(sel);
      if (!groups.length) throw new Error("drawP: nothing matches " + sel);
      const paths = groups.flatMap((g) => (g.matches("path.ink") ? [g] : Array.from(g.querySelectorAll("path.ink"))));
      const lens = paths.map((p) => Math.max(8, p.getTotalLength()));
      const sum = lens.reduce((a, b) => a + b, 0) || 1;
      groups.forEach((g) => tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.01 }, start));
      let t = start;
      paths.forEach((p, k) => {
        const d = (dur * lens[k]) / sum;
        p.style.strokeDasharray = "1 2";
        tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: "power1.inOut", autoRound: false }, t);
        t += d;
      });
      groups.flatMap((g) => Array.from(g.querySelectorAll("path.solid"))).forEach((p) => tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.25 }, start + Math.max(0, dur - 0.2)));
    }

    function setArrow(p, cx, cy, len, L) {
      const s = Math.max(0.002, L);
      $(p + "-sT").setAttribute("transform", "translate(0 " + f1(cy * (1 - s)) + ") scale(1 " + s.toFixed(4) + ")");
      $(p + "-hT").setAttribute("transform", "translate(0 " + f1(len * (1 - L)) + ")");
      $(p + "-hT").style.opacity = String(clamp(L / 0.1));
      $(p + "-sT").style.opacity = String(clamp(L / 0.04));
    }
    function setH(id, x, y, h, wMax, frac, pctId) {
      const w = wMax * clamp(frac);
      $(id + "-cr").setAttribute("width", f1(w));
      $(id + "-o").setAttribute("d", w < 2 ? "" : "M" + f1(x + w) + " " + (y + 1) + " L" + f1(x + w - 1) + " " + (y + h - 1));
      if (pctId) { const el = $(pctId); el.textContent = Math.round(frac * 100) + "%"; el.style.left = f1(x + w + 14) + "px"; }
    }
    function setV(id, x, w, yb, h) {
      $(id + "-cr").setAttribute("y", f1(yb - h)); $(id + "-cr").setAttribute("height", h < 0.5 ? "0" : f1(h + 2));
      $(id + "-o").setAttribute("d", h < 1.5 ? "" : "M" + x + " " + yb + " L" + (x + 1) + " " + f1(yb - h) + " L" + (x + w - 1) + " " + f1(yb - h + 1) + " L" + (x + w) + " " + yb);
    }
    // Gates counted in lines 9 and 10, and the arrow's length.
    const nGates = (t) => sched([[T.ten9, T.ten9 + 1.2, 0, 10], [T.hundred, T.hundred + 1.6, 10, 100]], t, 0);
    function Lmain(t) {
      if (t >= T.ten9) return Math.pow(0.99, Math.floor(nGates(t) + 1e-6));
      return sched([[T.shrinks7, T.shrinks7 + 1.2, 1, 0.4], [T.f50 - 0.1, T.f50 + 0.6, 0.4, 0], [T.l8, T.l8 + 0.6, 0, 1], [T.keeps, T.keeps + 0.4, 1, 0.9], [T.l9, T.l9 + 0.6, 0.9, 1]], t, 1);
    }
    // Closing: one more gate every 0.6 s, each keeping 0.9 of the length.
    function Lend(t) {
      let L = 1;
      IGT.forEach((g) => { L *= 1 - 0.1 * ease.inOut((t - g - 0.15) / 0.3); });
      return L;
    }

    onFrame((t) => {
      // ===== Line 1: the chip's small wrong bar =====
      setV("b-cb1", 1470, 70, 760, sched([[T.sometimes, T.sometimes + 0.6, 0, 9]], t, 0));

      // ===== Line 4: the waiting qubit's state leaks away =====
      const lu = (t - T.leaks) / 1.4, lk = $("b-leak");
      lk.setAttribute("cx", f1(1110 + 550 * clamp(lu)));
      lk.style.opacity = lu < 0 ? "0" : String(1 - 0.7 * clamp(lu));

      // ===== Lines 6 to 10: arrow and readout =====
      const L = Lmain(t);
      setArrow("b-ar", BC.cx, BC.cy, BC.len, L);
      setH("b-r0", RB.x, RB.y0, RB.h, RB.w, (1 + L) / 2, "b-rp0");
      setH("b-r1", RB.x, RB.y1, RB.h, RB.w, (1 - L) / 2, "b-rp1");
      const cg = sched([[T.f50, T.f50 + 0.5, 0, 1], [T.l8, T.l8 + 0.4, 1, 0]], t, 0);
      const dot = $("b-bl-dot");
      dot.setAttribute("r", f1(8 + 8 * cg)); dot.setAttribute("fill", cg > 0.5 ? "${GOLD}" : "${INK}");
      const n = nGates(t);
      $("b-cntn").textContent = String(Math.floor(n + 1e-6));
      $("b-lenn").textContent = Math.round(Math.pow(0.99, Math.floor(n + 1e-6)) * 100) + "%";
      const tkOut = clamp((t - T.hundred) / 0.3);
      for (let i = 0; i < 10; i++) $("b-tk" + i).style.opacity = String((n >= i + 1 - 1e-6 ? 1 : 0) * (1 - tkOut));
      $("b-band-cr").setAttribute("width", f1(640 * clamp((n - 10) / 90)));

      // ===== Line 11: a hundred shots fill the grid =====
      const c = 100 * clamp((t - T.runs) / (T.give + 0.4 - T.runs));
      for (let i = 0; i < 100; i++) $("b-sh" + i).style.opacity = String(clamp(c - i));
      const shown = Math.min(100, Math.floor(c + 0.5));
      $("b-onesn").textContent = String(ONESUM[shown]);
      const ft0 = T.runs, nFlip = Math.round((T.give + 0.4 - T.runs) / 0.5);
      const ph = clamp((t - ft0) / 0.5, 0, nFlip);
      const cs = Math.cos(Math.PI * ph);
      const sx = Math.max(0.06, Math.abs(cs));
      $("b-coinT").setAttribute("transform", "translate(300 0) scale(" + sx.toFixed(3) + " 1) translate(-300 0)");
      $("b-coinv").style.transform = "scaleX(" + sx.toFixed(3) + ")";
      $("b-coinv").textContent = cs >= 0 ? "0" : "1";

      // ===== Line 12: the two charts fill in =====
      const rise = sched([[T.ideal12, T.ideal12 + 0.9, 0, 1]], t, 0);
      setV("b-gi0", ${GB.i0}, ${CH.w}, ${CH.yb}, ${CH.h} * rise);
      setV("b-gc0", ${GB.c0}, ${CH.w}, ${CH.yb}, ${CH.h} * 0.95 * rise);
      setV("b-gc1", ${GB.c1}, ${CH.w}, ${CH.yb}, ${CH.h} * 0.05 * rise);

      // ===== Line 14: gates keep arriving; the arrow keeps shrinking =====
      IGT.forEach((g, i) => {
        const u = clamp((t - g) / 0.3);
        const el = $("b-ig" + i);
        el.style.opacity = String(u);
        el.setAttribute("transform", "translate(" + f1(28 * (1 - ease.inOut(u))) + " 0)");
      });
      const L2 = Lend(t);
      setArrow("b-ai", IB.cx, IB.cy, IB.len, L2);
      setH("b-i0", IR.x, IR.y0, IR.h, IR.w, (1 + L2) / 2, "b-ip0");
      setH("b-i1", IR.x, IR.y1, IR.h, IR.w, (1 - L2) / 2, "b-ip1");
    });

    // ===== Line 0: start at zero, flip twice =====
    drawP("#b-h-w", T.qubit - 0.05, 0.8);
    write("#b-h-k0", T.qubit, 0.3);
    write("#b-qnote", T.quantum - 0.05, 0.8);
    blurOut("#b-title", T.flip - 0.05);
    drawP("#b-h-x1", T.flip - 0.1, 0.45);
    write("#b-h-xl1", T.flip + 0.2, 0.15);
    write("#b-xflip", T.flip + 0.1, 0.4);
    drawP("#b-h-x2", T.twice - 0.1, 0.45);
    write("#b-h-xl2", T.twice + 0.2, 0.15);
    move("#b-hc", { y: 0 }, { y: -350 }, T.twice + 0.45, 0.9);
    drawP("#b-h-m", T.always0 - 0.15, 0.6);
    write("#b-h-z", T.read0, 0.3);
    tl.fromTo("#b-h-z", { scale: 1 }, { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, T.read0 + 0.35);
    fade("#b-qnote", 0, T.l1, 0.3);

    // ===== Line 1: the simulator agrees, the chip sometimes reads one =====
    write("#b-siml", T.sim - 0.1, 0.8);
    drawP("#b-lap", T.laptop - 0.25, 0.8);
    drawP("#b-sch", T.laptop + 0.2, 0.6);
    write(["#b-sl0", "#b-sl1"], T.laptop + 0.5, 0.15);
    drawP("#b-stick", T.agrees, 0.3);
    drawP("#b-chipb", T.chip - 0.2, 0.9);
    drawP("#b-chipd", T.chip + 0.3, 0.6);
    write("#b-chipl", T.chip, 0.5);
    drawP("#b-cch", T.chip + 0.3, 0.5);
    write(["#b-cl0", "#b-cl1"], T.chip + 0.5, 0.15);
    tl.to("#b-cb1", { opacity: 0.4, duration: 0.14, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.one1 - 0.1);
    write("#b-why", T.why - 0.3, 0.3);
    tl.fromTo("#b-why", { scale: 1 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, T.why + 0.05);
    blurOut("#b-sA", T.think + 0.05);

    // ===== Line 2: whispering down a line =====
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => drawP("#b-p" + i, T.whispering - 0.25 + i * 0.15, 0.6));
    [0, 1, 2, 3, 4, 5, 6].forEach((i) => drawP("#b-wa" + i, T.whispering + 0.35 + i * 0.15, 0.35));
    drawP("#b-bb0", T.message - 0.15, 0.35);
    write("#b-w0", T.message, 0.45);
    [[2, 0], [4, 1], [7, 2]].forEach(([i, k]) => { drawP("#b-bb" + i, T.each2 - 0.1 + k * 0.4, 0.3); write("#b-w" + i, T.each2 + 0.05 + k * 0.4, 0.4); });
    tl.to("#b-w7 .b-gl", { scale: 1.5, duration: 0.18, yoyo: true, repeat: 1 }, T.mistake);

    // ===== Line 3: short gets through, long turns to mush =====
    drawP("#b-brs", T.short - 0.05, 0.4);
    write("#b-shortl", T.short + 0.15, 0.5);
    drawP("#b-bb1", T.short + 0.3, 0.3);
    write("#b-w1", T.short + 0.5, 0.4);
    drawP("#b-btick", T.through, 0.3);
    drawP("#b-brl", T.long - 0.1, 0.8);
    write("#b-longl", T.long + 0.3, 0.5);
    drawP("#b-scrib", T.turns + 0.1, 0.35);
    fade(["#b-w7", "#b-scrib"], 0, T.mush - 0.1, 0.2);
    drawP("#b-mush", T.mush - 0.05, 0.4);
    blurOut("#b-sB", T.gates4 - 0.15);

    // ===== Line 4: gates whisper too, a waiting qubit leaks =====
    drawP("#b-cw", T.gates4, 0.7);
    [0, 1, 2, 3, 4].forEach((i) => drawP("#b-gb" + i, T.gates4 + 0.1 + i * 0.12, 0.35));
    write("#b-gate1", T.steps - 0.1, 0.9);
    [0, 1, 2, 3, 4].forEach((i) => drawP("#b-gw" + i, T.whisper4 + i * 0.1, 0.25));
    [0, 1, 2, 3, 4].forEach((i) => drawP("#b-td" + i, T.off - 0.1 + i * 0.12, 0.25));
    write("#b-soff", T.off - 0.2, 0.6);
    drawP("#b-hg", T.waiting - 0.15, 0.7);
    write("#b-waitl", T.waiting + 0.2, 0.4);
    drawP("#b-lk", T.leaks + 0.3, 1.0);
    drawP("#b-nbr", T.noise5 - 0.4, 0.4);
    write("#b-noisel", T.noise5 - 0.3, 0.35);
    tl.to("#b-tildes", { color: "${INK}", duration: 0.3 }, T.noise5 - 0.05);
    blurOut("#b-sC", T.your + 0.05);

    // ===== Line 5: transpiled, two gates become ten =====
    write("#b-yc", T.your + 0.1, 0.6);
    drawP("#b-qw", T.circuit5 - 0.2, 0.6);
    write(["#b-qk0", "#b-qk1", "#b-qk2"], T.circuit5 - 0.1, 0.2);
    drawP("#b-qH", T.circuit5 + 0.05, 0.3);
    write("#b-qHl", T.circuit5 + 0.25, 0.15);
    drawP("#b-qC", T.circuit5 + 0.25, 0.4);
    drawP("#b-tar", T.transpiled - 0.05, 0.4);
    write("#b-tpl", T.transpiled, 0.6);
    write("#b-tpl2", T.rewritten, 1.0);
    tl.to("#b-tar", { opacity: 0.45, duration: 0.4 }, T.wiring + 0.4);
    write("#b-cgates", T.few - 0.2, 1.0);
    drawP("#b-bw", T.few - 0.1, 0.6);
    write(["#b-bk0", "#b-bk1", "#b-bk2"], T.few, 0.2);
    ${JSON.stringify(TEN.map((_, i) => i))}.forEach((i) => { drawP("#b-tg" + i, T.few + 0.15 + i * 0.19, 0.3); write("#b-tl" + i, T.few + 0.3 + i * 0.19, 0.15); });
    write("#b-cwl", T.wiring - 0.4, 0.5);
    drawP("#b-wire3", T.wiring - 0.1, 0.5);
    write(["#b-ck0", "#b-ck1", "#b-ck2"], T.wiring + 0.1, 0.2);
    write("#b-cnj", T.wiring + 0.3, 0.9);
    write(["#b-sw1", "#b-sw2"], T.wiring + 0.1, 0.3);
    write("#b-2g", T.two5 - 0.05, 0.4);
    ${JSON.stringify(TEN.map((_, i) => i))}.forEach((i) => tl.to(["#b-tg" + i, "#b-tl" + i], { color: "${GOLD}", duration: 0.1, yoyo: true, repeat: 1 }, T.become + i * 0.07));
    write("#b-10g", T.become - 0.1, 0.5);
    blurOut("#b-sD", T.qubit6 - 0.2);

    // ===== Line 6: the arrow in a ball =====
    drawP("#b-bl-c", T.qubit6 - 0.1, 1.3);
    drawP("#b-ar-s", T.arrow6 + 0.05, 0.5);
    drawP("#b-ar-h", T.arrow6 + 0.5, 0.2);
    drawP("#b-bl-eq", T.ball - 0.05, 0.7);
    hide("#b-bl-dot");
    fade("#b-bl-dot", 1, T.ball + 0.3, 0.2);
    write("#b-bl-0", T.zero6 - 0.05, 0.2);
    write("#b-bl-1", T.one6 - 0.05, 0.2);
    write(["#b-rl0", "#b-rl1"], T.zero6 + 0.1, 0.4);
    drawP(["#b-r0-tr", "#b-r1-tr"], T.zero6 + 0.3, 0.5);
    hide(["#b-r0", "#b-r1", "#b-rp0", "#b-rp1"]);
    fade(["#b-r0", "#b-r1", "#b-rp0", "#b-rp1"], 1, T.one6 + 0.05, 0.3);

    // ===== Line 7: noise shrinks the arrow toward the centre =====
    drawP("#b-bub7", T.breaks - 0.1, 0.4);
    write("#b-gm7", T.breaks + 0.1, 0.4);
    drawP("#b-x7", T.new7 - 0.05, 0.3);
    fade(["#b-bub7", "#b-gm7", "#b-x7"], 0, T.shrinks7 + 1.4, 0.4);
    write("#b-5050", T.f50 + 0.4, 0.35);
    fade("#b-5050", 0, T.l8, 0.3);

    // ===== Line 8: each gate keeps (1 − λ) =====
    drawP("#b-g8", T.gate8 - 0.1, 0.4);
    drawP("#b-dice", T.random8 - 0.1, 0.35);
    write("#b-lamc", T.lambda8 - 0.1, 0.15);
    write("#b-lams", T.chance8, 0.7);
    write("#b-form", T.keeps - 0.1, 0.9);
    tl.to("#b-fg", { color: "${GOLD}", duration: 0.25 }, T.one8 - 0.05);
    fade(["#b-dice", "#b-lams", "#b-g8", "#b-lamc"], 0, T.l9, 0.3);
    tl.to("#b-fg", { color: "${INK}", duration: 0.3 }, T.l9 + 0.1);
    tl.to("#b-fw", { y: -66, scale: 0.8, duration: 0.7, ease: "power2.inOut" }, T.l9 + 0.1);

    // ===== Line 9: one percent, ten gates =====
    write("#b-lam1", T.pct9 - 0.1, 0.4);
    write("#b-cnt", T.ten9 - 0.15, 0.4);
    write("#b-len", T.ten9 + 0.1, 0.5);
    drawP("#b-tw", T.ten9 - 0.2, 0.5);
    tl.to("#b-lenn", { color: "${GOLD}", duration: 0.2, yoyo: true, repeat: 1 }, T.ninety);
    write("#b-n20", T.about9 - 0.1, 0.6);

    // ===== Line 10: a hundred gates =====
    tl.to("#b-lenn", { color: "${GOLD}", duration: 0.2, yoyo: true, repeat: 1 }, T.third);
    fade("#b-n20", 0, T.hundred - 0.15, 0.25);
    write("#b-n3", T.nearly - 0.2, 0.8);
    blurOut("#b-sE", T.wobble11 - 0.2);

    // ===== Line 11: shot wobble =====
    drawP("#b-coin", T.wobble11 - 0.05, 0.8);
    write("#b-coinf", T.chance11 + 0.2, 0.2);
    write("#b-c5050", T.chance11 + 0.3, 0.3);
    write("#b-shot", T.shots - 0.1, 0.7);
    write("#b-ones", T.runs + 0.1, 0.4);
    tl.to("#b-onesn", { color: "${GOLD}", scale: 1.3, duration: 0.25 }, T.forty - 0.05);
    tl.to("#b-onesn", { scale: 1, duration: 0.25 }, T.forty + 0.25);
    write("#b-not50", T.forty - 0.1, 0.5);
    blurOut("#b-sF", T.compare - 0.3);

    // ===== Line 12: compare with the ideal; the gap beyond the wobble =====
    drawP(["#b-k-w", "#b-k-x1", "#b-k-x2", "#b-k-m"], T.compare - 0.2, 0.9);
    write(["#b-k-k0", "#b-k-xl1", "#b-k-xl2"], T.compare + 0.2, 0.2);
    drawP(["#b-ax1", "#b-ax2"], T.compare + 0.3, 0.5);
    write(["#b-gx0", "#b-gx1", "#b-gx2", "#b-gx3"], T.compare + 0.6, 0.15);
    write("#b-gti", T.ideal12 - 0.1, 0.9);
    write("#b-gtc", T.ideal12 + 0.6, 0.5);
    drawP("#b-lnk", T.same - 0.1, 0.5);
    drawP("#b-zoom", T.gap - 0.45, 0.5);
    drawP("#b-zbar", T.gap - 0.05, 0.3);
    drawP("#b-gapb", T.gap + 0.2, 0.4);
    drawP("#b-whisk", T.wobble12 - 0.1, 0.4);
    write("#b-wobl", T.wobble12, 0.4);
    write("#b-devn", T.device - 0.25, 0.6);
    blurOut("#b-sG", T.careful + 0.15);

    // ===== Line 13: mitigation estimates; correction protects =====
    write("#b-hm", T.careful + 0.3, 0.8);
    write("#b-neq", T.mitigation + 0.3, 0.25);
    write("#b-hc2", T.mitigation + 0.4, 0.9);
    drawP("#b-mc1", T.estimates - 0.15, 0.7);
    drawP("#b-mpen", T.estimates + 0.5, 0.35);
    drawP("#b-mc2", T.estimates + 0.8, 0.8);
    write("#b-mest", T.estimates + 1.3, 1.0);
    drawP("#b-clock", T.results - 0.05, 0.5);
    hide("#b-q13");
    fade("#b-q13", 1, T.protecting - 0.15, 0.25);
    drawP("#b-shield", T.protecting, 0.9);
    write("#b-prot", T.protecting + 0.5, 1.0);
    ${JSON.stringify(HELP.map((_, i) => i))}.forEach((i) => { hide("#b-hp" + i); fade("#b-hp" + i, 1, T.correction + 0.35 + i * 0.07, 0.15); });
    write("#b-xq", T.extra - 0.3, 0.5);
    blurOut("#b-sH", T.every - 0.05);

    // ===== Line 14: closing picture, holds to the end =====
    drawP("#b-bi-c", T.every - 0.05, 0.8);
    drawP("#b-bi-eq", T.every + 0.4, 0.5);
    drawP("#b-ai-s", T.every + 0.1, 0.35);
    drawP("#b-ai-h", T.every + 0.4, 0.15);
    hide("#b-bi-dot");
    fade("#b-bi-dot", 1, T.every + 0.5, 0.2);
    write(["#b-bi-0", "#b-bi-1"], T.every + 0.4, 0.15);
    drawP("#b-iw", T.every, 0.6);
    write("#b-take1", T.every, 0.8);
    write("#b-take2", T.noise14 - 0.4, 0.8);
    write("#b-tf", T.shrinks14 - 0.1, 1.2);
    write(["#b-il0", "#b-il1"], T.shrinks14 + 0.6, 0.4);
    drawP(["#b-i0-tr", "#b-i1-tr"], T.shrinks14 + 0.7, 0.5);
    hide(["#b-i0", "#b-i1", "#b-ip0", "#b-ip1"]);
    fade(["#b-i0", "#b-i1", "#b-ip0", "#b-ip1"], 1, T.shrinks14 + 0.9, 0.3);
    write("#b-rand", T.random14 - 0.1, 0.5);
  `;

  return { html, script };
}
