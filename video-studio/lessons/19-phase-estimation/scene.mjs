// Lesson 19, "Phase estimation: reading a hidden angle". Follows plan.md: a gate secretly turns a
// special state by a fraction of a turn (the phase). A clock photographed after 1, 2 and 4 ticks is
// the analogy; then the circuit: counting qubits in |+⟩ control U, U², U⁴ and kickback turns their
// hands by φ, 2φ, 4φ (worked example φ = 0.101 = 5/8 turn). Doubling slides the binary digits, the
// S example reads 01, where the photo picture breaks, the eigenstate rule, and the closing circuit.
// Gold is the thing the voice is naming right now.
export const phrases = [
  ["four tick", "4-tick"],
  ["two phi", "2φ"], ["four phi", "4φ"], ["phi's", "φ's"], ["phi", "φ"],
  ["ket plus", "|+⟩"],
  ["ket one", "|1⟩"],
  ["zero point zero one", "0.01"],
  ["digits zero one", "digits 01"],
  ["Q F T", "QFT"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, lines, INK, GOLD, GROUND } = k;
  // A gate box whose inside is painted with the ground, so the target wire stops at its edges.
  const gateBox = (x, y, w, h, o) => `<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" fill="${GROUND}"/>` + r.rect(x, y, w, h, pen(o));
  const fx = (n) => +(+n).toFixed(1);
  const DEG = Math.PI / 180;
  // Label centred on (cx, cy).
  const C = (id, cx, cy, w, size, html, extra = "") => lbl(id, fx(cx - w / 2), fx(cy - size * 0.76), w, size, html, extra);
  // Label whose left edge is x, vertically centred on cy.
  const L = (id, x, cy, w, size, html, extra = "") => lbl(id, fx(x), fx(cy - size * 0.76), w, size, html, `text-align:left;${extra}`);
  const TYPE = "font-family:'TASA Orbiter','Inter',sans-serif;font-weight:600;";
  const gold = (s) => `<span style="color:${GOLD}">${s}</span>`;
  // Strokes and fills follow the group's colour, so a group can turn gold and back.
  const cur = (svg) => svg
    .replaceAll(`stroke="${INK}"`, 'stroke="currentColor"').replaceAll(`stroke="${GOLD}"`, 'stroke="currentColor"')
    .replaceAll(`fill="${INK}"`, 'fill="currentColor"').replaceAll(`fill="${GOLD}"`, 'fill="currentColor"');
  const G = (id, inner, extra = "") => `<g id="${id}"${extra}>${inner}</g>`;
  const CG = (id, inner, color = INK, extra = "") => `<g id="${id}" style="color:${color}"${extra}>${cur(inner)}</g>`;
  const full = (id, svg, inner = "") => `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${inner}</div>`;
  const pt = (cx, cy, a, rad) => [fx(cx + Math.sin(a * DEG) * rad), fx(cy - Math.cos(a * DEG) * rad)];

  // A curved arrow through pts with a head at the last point.
  function curveArrow(pts, o = {}, head = 16) {
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const hp = (da) => [b[0] - head * Math.cos(ang + da), b[1] - head * Math.sin(ang + da)];
    const [h1, h2] = [hp(0.5), hp(-0.5)];
    return r.curve(pts, pen(o)) + r.line(b[0], b[1], h1[0], h1[1], pen(o)) + r.line(b[0], b[1], h2[0], h2[1], pen(o));
  }
  // Dashes from (x1, y1) to (x2, y2), each its own stroke, optionally with an arrow head.
  function dashLine(x1, y1, x2, y2, o, len = 14, gap = 10, head = 0) {
    const Ln = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / Ln, uy = (y2 - y1) / Ln;
    let s = "";
    for (let d = 0; d < Ln; d += len + gap) { const e = Math.min(d + len, Ln); s += r.line(fx(x1 + ux * d), fx(y1 + uy * d), fx(x1 + ux * e), fx(y1 + uy * e), pen(o)); }
    if (head) {
      const ang = Math.atan2(uy, ux);
      [0.5, -0.5].forEach((da) => { s += r.line(x2, y2, fx(x2 - head * Math.cos(ang + da)), fx(y2 - head * Math.sin(ang + da)), pen(o)); });
    }
    return s;
  }
  // An almond eye centred on (cx, cy), w wide.
  const eye = (cx, cy, w, sw = 3) =>
    r.curve([[cx - w / 2, cy], [cx - w * 0.2, cy - w * 0.3], [cx + w * 0.2, cy - w * 0.3], [cx + w / 2, cy]], pen({ strokeWidth: sw })) +
    r.curve([[cx - w / 2, cy], [cx - w * 0.2, cy + w * 0.3], [cx + w * 0.2, cy + w * 0.3], [cx + w / 2, cy]], pen({ strokeWidth: sw })) +
    r.circle(cx, cy, w * 0.34, pen({ strokeWidth: sw * 0.8 })) +
    r.circle(cx, cy, w * 0.13, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" }));
  // A hand pointing up from (cx, cy), len long.
  const handUp = (cx, cy, len, sw, head) =>
    r.line(cx, cy, cx, fx(cy - len), pen({ strokeWidth: sw, roughness: 0.6 })) +
    r.line(cx, fx(cy - len), fx(cx - head * 0.6), fx(cy - len + head), pen({ strokeWidth: sw * 0.85, roughness: 0.5 })) +
    r.line(cx, fx(cy - len), fx(cx + head * 0.6), fx(cy - len + head), pen({ strokeWidth: sw * 0.85, roughness: 0.5 }));

  // ---------- Times, cued to the voice ----------
  const T = {
    gate0: cue(0, "gate", 0, -0.1), secretly: cue(0, "secretly", 0, -0.05), turns0: cue(0, "turns", 0, -0.1),
    special0: cue(0, "special"), fraction0: cue(0, "fraction", 0, -0.1),
    l1: cue(1), phase1: cue(1, "phase", 0, -0.15), chem: cue(1, "chemistry", 0, -0.15), number: cue(1, "number", 0, -0.1),
    l2: cue(2), clock2: cue(2, "clock", 0, -0.15), moving: cue(2, "moving", 0, -0.05), same: cue(2, "same", 0, -0.05),
    tick2: cue(2, "every", 0, -0.05), secret2: cue(2, "secret", 0, -0.1),
    photo: cue(3, "Photograph", 0, -0.1), one3: cue(3, "one", 0, -0.1), two3: cue(3, "two", 0, -0.1), four3: cue(3, "four", 0, -0.05),
    magn: cue(3, "magnifies", 0, -0.1), diff: cue(3, "differences", 0, -0.1),
    phase4: cue(4, "Phase", 0, -0.1), counting4: cue(4, "counting", 0, -0.1), gate4: cue(4, "gate", 0, -0.1), U4: cue(4, "gate", 0, 0.28),
    fraction4: cue(4, "fraction", 0, -0.1),
    ket5: cue(5, "ket", 0, -0.1), even: cue(5, "even", 0, -0.1), controls: cue(5, "controls", 0, -0.1),
    l6: cue(6), kick: cue(6, "kickback", 0, -0.35), lesson6: cue(6, "lesson", 0, -0.1), turn6: cue(6, "turn", 0, -0.05), qubits6: cue(6, "qubit's", 0, -0.1),
    run7: cue(7, "Run", 0, -0.05), turns7: cue(7, "turns", 0, -0.1), phi7: cue(7, "phi"), twice: cue(7, "twice", 0, -0.1),
    twophi: cue(7, "two"), four7: cue(7, "four", 0, -0.1), four7b: cue(7, "four", 1, -0.05),
    dbl: cue(8, "Doubling", 0, 0.2), binary8: cue(8, "binary", 0, -0.1), zeros: cue(8, "zeros", 0, -0.1), left8: cue(8, "left", 0, -0.1),
    whole: cue(8, "whole", 0, -0.1), vanish: cue(8, "vanish", 0, -0.05), finer: cue(8, "finer", 0, -0.15),
    l9: cue(9), try9: cue(9, "Try"), ket9: cue(9, "ket", 0, -0.1), quarter9: cue(9, "quarter", 0, -0.1), zero9: cue(9, "zero", 0, -0.1),
    l10: cue(10), two10: cue(10, "two", 0, -0.1), quarter10: cue(10, "quarter", 0, -0.15), half10: cue(10, "half", 0, -0.15),
    l11: cue(11), picture: cue(11, "picture", 0, -0.1), breaks: cue(11, "breaks", 0, -0.1), measuring: cue(11, "Measuring", 0, -0.1),
    zero11: cue(11, "zero", 0, -0.1), never: cue(11, "never", 0, -0.1),
    l12: cue(12), instead: cue(12, "Instead", 0, 0.05), inverse12: cue(12, "inverse", 0, -0.1), lesson12: cue(12, "lesson", 0, -0.1),
    combines: cue(12, "combines", 0, -0.1), hands12: cue(12, "hands", 0, -0.1), digits12: cue(12, "digits", 0, -0.1), one12: cue(12, "one", 0, -0.1),
    l13: cue(13), input13: cue(13, "input", 0, -0.1), turns13: cue(13, "turns", 0, -0.1), eigen: cue(13, "eigenstate", 0, -0.1), ket13: cue(13, "ket", 0, -0.1),
    l14: cue(14), other: cue(14, "other", 0, -0.1), random: cue(14, "random", 0, -0.1), phases: cue(14, "phases", 0, -0.1),
    l15: cue(15), kick15: cue(15, "kick", 0, -0.1), u15a: cue(15, "kick", 0, 0.15), u15b: cue(15, "Utwice", 0, 0.05), u15c: cue(15, "times", 0, -0.3),
    counting15: cue(15, "counting", 0, -0.1), inverse15: cue(15, "inverse", 0, -0.1), reads: cue(15, "reads", 0, -0.1), binary15: cue(15, "binary", 0, -0.1),
    end: lines[15].end,
  };

  // ===================== Dials =====================
  // Every dial: a face, then a coloured group (dotted arc from 12 o'clock + a hand) whose angle the
  // timeline drives in degrees, clockwise from up. Whole turns are drawn as the hand going round.
  const DIALS = {};
  function dial(id, cx, cy, R, o = {}) {
    const { n = 8, color = INK, segs = [], init = 0, knob = false, sw = R > 100 ? 3.4 : 3 } = o;
    const ra = fx(o.ra ?? R * 0.62);
    DIALS[id] = { cx, cy, ra, s: segs, i: init };
    const ticks = Array.from({ length: n }, (_, i) => {
      const a = (360 * i) / n, major = n === 12 && i % 3 === 0;
      const [p, q] = [pt(cx, cy, a, R * (major ? 0.8 : 0.86)), pt(cx, cy, a, R * 0.97)];
      return r.line(p[0], p[1], q[0], q[1], pen({ strokeWidth: major ? 3.2 : 2.4, roughness: 0.6 }));
    }).join("");
    const knobSvg = knob ? r.rect(cx - 16, cy - R - 30, 32, 24, pen({ strokeWidth: 2.8, roughness: 0.9 })) + r.circle(cx, cy - R - 42, 20, pen({ strokeWidth: 2.6 })) : "";
    const face = r.circle(cx, cy, 2 * R, pen({ strokeWidth: sw })) + (R > 90 ? r.circle(cx, cy, 2 * R - 18, pen({ strokeWidth: 1.4, roughness: 1.6 })) : "") +
      ticks + knobSvg + r.circle(cx, cy, Math.max(12, R * 0.1), pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" }));
    const hw = Math.max(3.6, R * 0.028);
    const hand = handUp(cx, cy, R * 0.78, hw + 1, Math.max(14, R * 0.13));
    const arcW = fx(Math.max(4, R * 0.03)), gap = fx(Math.max(10, R * 0.07));
    return `<g id="${id}"><g id="${id}-f">${face}</g><g id="${id}-c" style="color:${color}"><g id="${id}-v">` +
      `<path id="${id}-arc" d="" fill="none" stroke="currentColor" stroke-width="${arcW}" stroke-linecap="round" stroke-dasharray="0.1 ${gap}" opacity="0.9"/>` +
      `<g id="${id}-h">${cur(hand)}</g></g></g></g>`;
  }
  const dialOn = (id) => [`#${id}-f`, `#${id}-v`];

  // ===================== Scene A: the secret turn (lines 0 and 1) =====================
  const aSvg =
    dial("b-dA", 700, 520, 170, { segs: [[T.turns0, T.turns0 + 1.2, 0, 225]], ra: 112 }) +
    G("b-aGateBox", r.rect(1150, 430, 250, 180, pen({ strokeWidth: 3.6, roughness: 1 }))) +
    G("b-aLock", r.curve([[1258, 402], [1258, 376], [1277, 364], [1296, 376], [1296, 402]], pen({ strokeWidth: 3 })) +
      r.rect(1248, 400, 58, 46, pen({ strokeWidth: 3, fill: INK, fillStyle: "hachure", hachureGap: 7, fillWeight: 1.4 }))) +
    G("b-aArr", arrow(1138, 520, 892, 520, { strokeWidth: 3.2 }, 18)) +
    G("b-aMol", r.line(1330, 528, 1384, 484, pen({ strokeWidth: 3.4 })) + r.line(1416, 484, 1470, 528, pen({ strokeWidth: 3.4 })) +
      r.circle(1310, 540, 64, pen({ strokeWidth: 3 })) + r.circle(1400, 470, 84, pen({ strokeWidth: 3.2, fill: INK, fillStyle: "hachure", hachureGap: 8, fillWeight: 1.4 })) +
      r.circle(1490, 540, 64, pen({ strokeWidth: 3 }))) +
    G("b-aDot", dashLine(1262, 520, 900, 566, { strokeWidth: 2.8, roughness: 0.5 }, 14, 11, 16));
  const aHtml =
    C("b-aGate", 1275, 520, 200, 56, "gate") +
    C("b-aSS", 700, 748, 320, 48, "special state") +
    C("b-aQ", 340, 380, 300, 56, "? of a turn", `color:${GOLD}`) +
    C("b-aPh", 340, 380, 240, 64, "phase", `color:${GOLD}`) +
    C("b-aFr", 340, 452, 400, 44, "a fraction of a turn") +
    C("b-aChem", 1400, 640, 260, 48, "chemistry") +
    C("b-aAns", 1085, 470, 240, 44, "the answer");

  // ===================== Scene B: the clock (line 2) =====================
  const STEP = 65;
  const tickAt = [STEP, 2 * STEP, 3 * STEP].map((a) => pt(960, 480, a, 300));
  const bSvg = dial("b-clk", 960, 480, 240, {
    n: 12, knob: true, ra: 160,
    segs: [[T.moving, T.moving + 0.25, 0, STEP], [T.same, T.same + 0.25, STEP, 2 * STEP], [T.tick2, T.tick2 + 0.25, 2 * STEP, 3 * STEP]],
  });
  const bHtml =
    tickAt.map(([x, y], i) => C(`b-tk${i}`, x, y, 110, 44, "tick")).join("") +
    C("b-clkQ", 470, 480, 280, 56, "? per tick", `color:${GOLD}`);

  // ===================== Scene C: three photos (line 3) =====================
  const PX = [480, 960, 1440], PA = [65, 130, 260], PG = [72, 144, 288], PCAP = ["1 tick", "2 ticks", "4 ticks"];
  const wedge = (cx, cy, a1, a2, rad) => {
    const [p, q] = [pt(cx, cy, a1, rad), pt(cx, cy, a2, rad)];
    return `<path d="M${cx} ${cy} L${p[0]} ${p[1]} A${rad} ${rad} 0 0 1 ${q[0]} ${q[1]} Z" fill="${GOLD}" opacity="0.5"/>`;
  };
  const ghost = (cx, cy, a) => `<g transform="rotate(${a} ${cx} ${cy})">${dashLine(cx, cy - 14, cx, cy - 90, { strokeWidth: 3.4, roughness: 0.4 }, 11, 8)}` +
    r.line(cx, cy - 94, cx - 9, cy - 80, pen({ strokeWidth: 3, roughness: 0.4 })) + r.line(cx, cy - 94, cx + 9, cy - 80, pen({ strokeWidth: 3, roughness: 0.4 })) + `</g>`;
  const flash = (x, y) => [-160, -125, -90, -55, -20, 15].map((a) => {
    const t = a * DEG;
    return r.line(fx(x + Math.cos(t) * 14), fx(y + Math.sin(t) * 14), fx(x + Math.cos(t) * 36), fx(y + Math.sin(t) * 36), pen({ strokeWidth: 2.6, roughness: 0.6 }));
  }).join("");
  const photos = PX.map((cx, i) =>
    full(`b-pW${i}`,
      G(`b-pf${i}`, r.rect(cx - 170, 280, 340, 400, pen({ strokeWidth: 3.4, roughness: 1 })) + r.rect(cx - 145, 305, 290, 290, pen({ strokeWidth: 2, roughness: 1.2 }))) +
      G(`b-fl${i}`, flash(cx + 168, 282)) +
      dial(`b-pc${i}`, cx, 450, 120, { n: 12, init: PA[i], ra: 74 }) +
      `<g id="b-wg${i}">${wedge(cx, 450, PA[i], PG[i], 100)}</g>` +
      CG(`b-gh${i}`, ghost(cx, 450, PG[i]), GOLD),
      C(`b-pcap${i}`, cx, 640, 220, 48, PCAP[i]))).join("");
  const cHtml = C("b-gap", 1440, 745, 320, 48, "4× the gap", `color:${GOLD}`);

  // ===================== Scene D: the circuit and the digits (lines 4 to 8) =====================
  const WY = [280, 420, 560], TY = 720, DX = 1350, DR = 62, UX = [470, 720, 970];
  const ROWX = 560, ROWR = 62, OX = 140; // OX shifts the digit rows right // where the dials go on "Doubling"
  const dSvg =
    WY.map((y, j) => G(`b-w${j + 1}`, r.line(300, y, DX - DR - 6, y, pen({ strokeWidth: 3, roughness: 0.8 })))).join("") +
    WY.map((y, j) => dial(`b-d${j + 1}`, DX, y, DR, {
      ra: 40,
      segs: [
        [[T.turns7, T.turns7 + 1, 0, 225]],
        [[T.twice, T.twice + 1.2, 0, 450], [T.whole + 0.1, T.whole + 0.7, 450, 810]],
        [[T.four7, T.four7 + 1.2, 0, 900], [T.whole + 0.2, T.whole + 0.8, 900, 1260]],
      ][j],
    })).join("") +
    G("b-cam", r.rect(300, 182, 92, 62, pen({ strokeWidth: 2.8, roughness: 1 })) + r.rect(318, 168, 30, 14, pen({ strokeWidth: 2.4, roughness: 0.8 })) +
      r.circle(346, 213, 36, pen({ strokeWidth: 2.6 })) + r.circle(346, 213, 12, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" }))) +
    G("b-wt", r.line(300, TY, 1150, TY, pen({ strokeWidth: 3, roughness: 0.8 }))) +
    UX.map((x, j) => G(`b-U${j + 1}`, gateBox(x - 65, TY - 50, 130, 100, { strokeWidth: 3.2, roughness: 1 }))).join("") +
    UX.map((x, j) => CG(`b-ct${j + 1}`, r.circle(x, WY[j], 22, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" })) + r.line(x, WY[j], x, TY - 52, pen({ strokeWidth: 2.8, roughness: 0.6 })), j === 0 ? GOLD : INK)).join("") +
    CG("b-kick", curveArrow([[542, 664], [598, 450], [700, 268], [980, 232], [1272, 262]], goldPen({ strokeWidth: 3.8 }), 18), GOLD) +
    G("b-sh1", curveArrow([[812 + OX, 318], [800 + OX, 352], [772 + OX, 384]], { strokeWidth: 2.6 }, 12)) +
    G("b-sh2", curveArrow([[812 + OX, 458], [800 + OX, 492], [772 + OX, 524]], { strokeWidth: 2.6 }, 12)) +
    G("b-st2", r.line(738 + OX, 428, 776 + OX, 412, pen({ strokeWidth: 3.6, roughness: 0.5 }))) +
    G("b-st3", r.line(708 + OX, 568, 778 + OX, 552, pen({ strokeWidth: 3.6, roughness: 0.5 }))) +
    WY.map((y, j) => G(`b-da${j + 1}`, arrow(930 + OX, y, 1080 + OX, y, { strokeWidth: 2.6 }, 13))).join("");
  const INT = ["0", "1", "10"], FRAC = [["1", "01"], ["0", "1"], ["1", ""]], VAL = ["φ", "2φ", "4φ"], NTH = ["1st", "2nd", "3rd"];
  const dHtml =
    lbl("b-dHead", 192, 78, 700, 60, "Phase estimation", `text-align:left;${TYPE}`) +
    L("b-camL", 408, 212, 360, 44, "counting qubits") +
    lbl("b-dSS", 160, 640, 300, 40, "special state", "text-align:left") +
    UX.map((x, j) => C(`b-UL${j + 1}`, x, TY, 130, 56, ["U", "U<sup>2</sup>", "U<sup>4</sup>"][j])).join("") +
    C("b-dHid", 470, 812, 300, 44, "hidden turn φ", `color:${GOLD}`) +
    WY.map((y, j) => C(`b-kp${j + 1}`, 225, y, 130, 48, "|+⟩")).join("") +
    L("b-even", 560, 350, 520, 40, "|+⟩ = an even mix of 0 and 1") +
    C("b-kickL", 980, 182, 300, 44, "phase kickback") +
    L("b-l15", 1136, 182, 240, 40, "(lesson 15)") +
    WY.map((y, j) => L(`b-v${j + 1}`, DX + DR + 28, y, 130, 64, VAL[j])).join("") +
    WY.map((y, j) => C(`b-re${j + 1}`, 655 + OX, y, 50, 64, "=")).join("") +
    WY.map((y, j) => lbl(`b-ri${j + 1}`, 672 + OX, fx(y - 64 * 0.76), 106, 64, INT[j], "text-align:right")).join("") +
    WY.map((y, j) => C(`b-rp${j + 1}`, 784 + OX, y, 22, 64, ".")).join("") +
    WY.map((y, j) => L(`b-rf${j + 1}`, 790 + OX, y, 140, 64, `<span id="b-rfd${j + 1}">${FRAC[j][0]}</span>${FRAC[j][1]}`)).join("") +
    L("b-bin", 520 + OX, 188, 520, 40, "binary: only 0s and 1s") +
    C("b-full", 742 + OX, 640, 220, 40, "full turns") +
    WY.map((y, j) => L(`b-dg${j + 1}`, 1096 + OX, y, 240, 44, `${NTH[j]} digit`)).join("");

  // ===================== Scene F: the S gate (line 9) =====================
  const fSvg =
    dial("b-dS", 700, 460, 180, { segs: [[T.quarter9, T.quarter9 + 0.9, 0, 90]], ra: 120 }) +
    G("b-Sbox", r.rect(1120, 380, 180, 160, pen({ strokeWidth: 3.6, roughness: 1 }))) +
    G("b-Sarr", arrow(1108, 460, 902, 460, { strokeWidth: 3.2 }, 18));
  const fHtml =
    C("b-SL", 1210, 460, 120, 80, "S") +
    C("b-S1", 420, 460, 140, 64, "|1⟩") +
    C("b-Sq", 985, 300, 200, 56, "¼ turn", `color:${GOLD}`) +
    C("b-Sbin", 960, 765, 640, 64, `¼ = ${gold("0.01")} in binary`);

  // ===================== Scene G: two counting qubits (line 10) =====================
  const gSvg =
    dial("b-g1", 620, 400, 150, { segs: [[T.quarter10, T.quarter10 + 0.7, 0, 90]], ra: 100 }) +
    dial("b-g2", 1300, 400, 150, { segs: [[T.half10, T.half10 + 0.5, 0, 180]], ra: 100 });
  const gHtml =
    C("b-gL1", 620, 200, 520, 44, "counting qubit 1: S once") +
    C("b-gL2", 1300, 200, 520, 44, "counting qubit 2: S twice") +
    C("b-gq", 620, 615, 100, 64, "¼") + C("b-gh", 1300, 615, 100, 64, "½");

  // ===================== Scene H: where the picture breaks (line 11) =====================
  const hSvg =
    G("b-hP", r.rect(300, 300, 200, 240, pen({ strokeWidth: 3, roughness: 1 })) + r.rect(316, 316, 168, 168, pen({ strokeWidth: 1.8, roughness: 1.2 }))) +
    dial("b-hc", 400, 400, 62, { n: 12, init: 65, ra: 38 }) +
    CG("b-hX", r.line(282, 290, 518, 552, goldPen({ strokeWidth: 6 })) + r.line(518, 290, 282, 552, goldPen({ strokeWidth: 6 })), GOLD) +
    dial("b-hD", 860, 460, 160, { init: 90, ra: 105 }) +
    G("b-hEye", eye(1300, 400, 200, 3.2)) +
    G("b-hArr", dashLine(1186, 412, 1040, 444, { strokeWidth: 2.8, roughness: 0.5 }, 12, 9, 15));
  const hHtml =
    C("b-h01", 1300, 545, 300, 80, "0 or 1", `color:${GOLD}`) +
    C("b-h55", 1300, 630, 560, 40, "fifty fifty, whatever the hand") +
    C("b-hQ", 930, 385, 80, 64, "?");

  // ===================== Scene I: the inverse QFT reads 01 (line 12) =====================
  const iSvg =
    dial("b-i1", 620, 340, 110, { init: 90, ra: 72 }) +
    dial("b-i2", 1300, 340, 110, { init: 180, ra: 72 }) +
    G("b-iBox", r.rect(760, 520, 400, 110, pen({ strokeWidth: 3.6, roughness: 1 }))) +
    G("b-iA1", arrow(690, 448, 812, 512, { strokeWidth: 3 }, 15)) +
    G("b-iA2", arrow(1230, 448, 1108, 512, { strokeWidth: 3 }, 15));
  const iHtml =
    C("b-iq", 785, 340, 80, 56, "¼") + C("b-ih", 1465, 340, 80, 56, "½") +
    C("b-iL", 960, 575, 380, 48, "inverse QFT") +
    L("b-i18", 1180, 575, 240, 40, "(lesson 18)") +
    C("b-iR", 960, 745, 360, 80, `reads ${gold("01")}`) +
    L("b-iEq", 1140, 745, 240, 44, "= φ = ¼");

  // ===================== Scene J: the eigenstate rule (lines 13 and 14) =====================
  const pip = (x, y) => r.circle(x, y, 26, goldPen({ fill: GOLD, fillStyle: "solid", strokeWidth: 2 }));
  const jSvg =
    dial("b-jIn", 560, 420, 140, { ra: 92 }) +
    G("b-jS", r.rect(890, 370, 140, 100, pen({ strokeWidth: 3.4, roughness: 1 }))) +
    G("b-jA1", arrow(712, 420, 878, 420, { strokeWidth: 3 }, 16)) +
    G("b-jA2", arrow(1042, 420, 1206, 420, { strokeWidth: 3 }, 16)) +
    dial("b-jOut", 1360, 420, 140, { init: 90, ra: 92, color: GOLD }) +
    CG("b-jDie", r.rect(1282, 342, 156, 156, goldPen({ strokeWidth: 4, roughness: 1 })) + r.line(1282, 342, 1306, 318, goldPen({ strokeWidth: 3 })) +
      r.line(1306, 318, 1460, 318, goldPen({ strokeWidth: 3 })) + r.line(1460, 318, 1438, 342, goldPen({ strokeWidth: 3 })) +
      r.line(1460, 318, 1460, 474, goldPen({ strokeWidth: 3 })) + r.line(1460, 474, 1438, 498, goldPen({ strokeWidth: 3 })) +
      pip(1318, 378) + pip(1360, 420) + pip(1402, 462), GOLD);
  const jHtml =
    C("b-jInL", 560, 240, 200, 44, "input") + C("b-jAny", 560, 240, 340, 44, "any other state") +
    C("b-jSL", 960, 420, 100, 64, "S") +
    C("b-j1a", 560, 615, 120, 56, "|1⟩") + C("b-jPlus", 560, 615, 120, 56, "|+⟩") +
    C("b-j1b", 1360, 615, 120, 56, "|1⟩") +
    C("b-jSame", 1360, 692, 440, 44, "same state, just turned") +
    C("b-jEig", 960, 640, 340, 72, "eigenstate", `color:${GOLD}`) +
    C("b-jO0", 1290, 600, 80, 64, "0") + C("b-jO1", 1430, 600, 80, 64, "¼") +
    C("b-jHalf", 1360, 672, 380, 40, "half the time each") +
    C("b-jPh", 1360, 748, 520, 44, "a random one of S's phases");

  // ===================== Scene K: closing circuit (line 15) =====================
  const KY = [300, 430, 560], KX = [470, 700, 930];
  const kSvg =
    KY.map((y, j) => G(`b-kw${j + 1}`, r.line(300, y, 1040, y, pen({ strokeWidth: 3, roughness: 0.8 })))).join("") +
    KY.map((y, j) => G(`b-kr${j + 1}`, r.line(1260, y, 1400, y, pen({ strokeWidth: 3, roughness: 0.8 })))).join("") +
    G("b-kwt", r.line(300, TY, 1160, TY, pen({ strokeWidth: 3, roughness: 0.8 }))) +
    KX.map((x, j) => G(`b-kU${j + 1}`, gateBox(x - 65, TY - 50, 130, 100, { strokeWidth: 3.2, roughness: 1 }))).join("") +
    KX.map((x, j) => G(`b-kc${j + 1}`, r.circle(x, KY[j], 22, pen({ strokeWidth: 2, fill: INK, fillStyle: "solid" })) + r.line(x, KY[j], x, TY - 52, pen({ strokeWidth: 2.8, roughness: 0.6 })))).join("") +
    KX.map((x, j) => CG(`b-kf${j + 1}`, arrow(x + 44, 662, x + 44, 600, goldPen({ strokeWidth: 3.4 }), 13), GOLD)).join("") +
    G("b-kQ", r.rect(1040, 250, 220, 360, pen({ strokeWidth: 3.6, roughness: 1 }))) +
    CG("b-kBr", r.curve([[1478, 274], [1500, 286], [1502, 410], [1524, 430], [1502, 450], [1500, 574], [1478, 586]], goldPen({ strokeWidth: 3.6, roughness: 0.8 })), GOLD);
  const kHtml =
    lbl("b-kHead", 192, 78, 700, 56, "Phase estimation", `text-align:left;${TYPE}`) +
    L("b-kCQ", 300, 240, 360, 44, "counting qubits") +
    KY.map((y, j) => C(`b-kk${j + 1}`, 225, y, 130, 48, "|+⟩")).join("") +
    lbl("b-kSS", 160, 640, 300, 40, "special state", "text-align:left") +
    KX.map((x, j) => C(`b-kUL${j + 1}`, x, TY, 130, 56, ["U", "U<sup>2</sup>", "U<sup>4</sup>"][j])).join("") +
    C("b-kQL1", 1150, 405, 200, 48, "inverse") + C("b-kQL2", 1150, 462, 200, 48, "QFT") +
    KY.map((y, j) => C(`b-kd${j + 1}`, 1440, y, 60, 72, ["1", "0", "1"][j])).join("") +
    C("b-kP1", 1650, 372, 220, 90, "φ =", `color:${GOLD}`) +
    C("b-kP2", 1650, 482, 260, 90, "0.101", `color:${GOLD}`);

  // ===================== HTML =====================
  const html = `
    ${full("b-sA", aSvg, aHtml)}
    ${full("b-sB", bSvg, bHtml)}
    ${photos}
    <div class="obj" id="b-sC" style="left:0;top:0;width:1920px;height:1080px">${cHtml}</div>
    ${full("b-sD", dSvg, dHtml)}
    ${full("b-sF", fSvg, fHtml)}
    ${full("b-sG", gSvg, gHtml)}
    ${full("b-sH", hSvg, hHtml)}
    ${full("b-sI", iSvg, iHtml)}
    ${full("b-sJ", jSvg, jHtml)}
    ${full("b-sK", kSvg, kHtml)}
  `;

  // ===================== Timeline =====================
  const script = `
    const T = ${JSON.stringify(T)};
    const INK = "${INK}", GOLD = "${GOLD}";
    const DIALS = ${JSON.stringify(DIALS)};
    const WY = ${JSON.stringify(WY)}, DX = ${DX}, DR = ${DR}, ROWX = ${ROWX}, ROWR = ${ROWR};
    const f1 = (v) => v.toFixed(1);

    onFrame((t) => {
      // Every dial: hand angle and the dotted arc of the turn so far (whole turns drop off).
      for (const id in DIALS) {
        const D = DIALS[id];
        const a = sched(D.s, t, D.i);
        $(id + "-h").setAttribute("transform", "rotate(" + a.toFixed(2) + " " + D.cx + " " + D.cy + ")");
        const m = ((a % 360) + 360) % 360;
        let d = "";
        if (m > 0.5) {
          const rad = (m * Math.PI) / 180, ex = D.cx + D.ra * Math.sin(rad), ey = D.cy - D.ra * Math.cos(rad);
          d = "M" + D.cx + " " + f1(D.cy - D.ra) + " A" + D.ra + " " + D.ra + " 0 " + (m > 180 ? 1 : 0) + " 1 " + f1(ex) + " " + f1(ey);
        }
        $(id + "-arc").setAttribute("d", d);
      }
      // Line 8: the three circuit dials slide left and grow.
      const s = sched([[T.dbl, T.dbl + 0.8, 0, 1]], t, 0), sc = 1 + (ROWR / DR - 1) * s, x = DX + (ROWX - DX) * s;
      for (let j = 0; j < 3; j++) {
        $("b-d" + (j + 1)).setAttribute("transform", "translate(" + f1(x) + " " + WY[j] + ") scale(" + sc.toFixed(4) + ") translate(" + -DX + " " + -WY[j] + ")");
      }
    });

    // ===== Line 0: a gate secretly turns a special state =====
    draw("#b-aGateBox", T.gate0, 0.6);
    write("#b-aGate", T.gate0 + 0.25, 0.3);
    draw(${JSON.stringify(dialOn("b-dA"))}, T.gate0, 0.9);
    draw("#b-aArr", T.gate0 + 0.5, 0.4);
    draw("#b-aLock", T.secretly, 0.4);
    tl.to("#b-dA-c", { color: GOLD, duration: 0.2 }, T.turns0);
    blurOut("#b-title", T.special0);
    write("#b-aSS", T.special0, 0.6);
    write("#b-aQ", T.fraction0, 0.6);

    // ===== Line 1: that fraction is its phase; chemistry wants it =====
    fade("#b-aQ", 0, T.phase1 - 0.05, 0.2);
    write("#b-aPh", T.phase1, 0.35);
    write("#b-aFr", T.phase1 + 0.35, 0.8);
    blurOut(["#b-aGateBox", "#b-aLock", "#b-aArr", "#b-aGate"], T.chem - 0.25);
    draw("#b-aMol", T.chem, 0.8);
    write("#b-aChem", T.chem + 0.3, 0.5);
    tl.to("#b-aMol", { rotation: 8, svgOrigin: "1400 500", duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, T.chem + 0.8);
    draw("#b-aDot", T.number, 0.6);
    write("#b-aAns", T.number + 0.2, 0.5);
    blurOut("#b-sA", T.l2);

    // ===== Line 2: a clock hand moving the same secret amount every tick =====
    draw(${JSON.stringify(dialOn("b-clk"))}, T.clock2, 1.2);
    tl.to("#b-clk-c", { color: GOLD, duration: 0.15 }, T.moving - 0.1);
    [T.moving, T.same, T.tick2].forEach((t0, i) => {
      tl.fromTo("#b-tk" + i, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2.5)" }, t0 + 0.12);
    });
    write("#b-clkQ", T.secret2, 0.6);
    blurOut("#b-sB", T.photo - 0.15);

    // ===== Line 3: photos after 1, 2 and 4 ticks; the 4 tick one magnifies =====
    [0, 1, 2].forEach((i) => {
      draw("#b-pf" + i, T.photo + 0.2 * i, 0.8);
      draw("#b-fl" + i, T.photo + 0.2 * i + 0.6, 0.15);
      fade("#b-fl" + i, 0, T.photo + 0.2 * i + 1.0, 0.2);
    });
    [T.one3, T.two3, T.four3].forEach((t0, i) => {
      draw(["#b-pc" + i + "-f", "#b-pc" + i + "-v"], t0, 0.55);
      write("#b-pcap" + i, t0 + 0.15, 0.35);
    });
    hide(["#b-gh0", "#b-gh1", "#b-gh2", "#b-wg0", "#b-wg1", "#b-wg2"]);
    [0, 1, 2].forEach((i) => {
      fade("#b-gh" + i, 1, T.magn + 0.15 * i, 0.3);
      fade("#b-wg" + i, 1, T.magn + 0.35 + 0.15 * i, 0.3);
    });
    tl.to("#b-pW2", { scale: 1.08, transformOrigin: "1440px 480px", duration: 0.6, ease: "power2.inOut" }, T.diff - 0.2);
    write("#b-gap", T.diff, 0.6);
    blurOut(["#b-pW0", "#b-pW1", "#b-pW2", "#b-sC"], T.phase4);

    // ===== Line 4: counting qubits take the photos; the gate U and its fraction φ =====
    write("#b-dHead", T.phase4, 0.9);
    [0, 1, 2].forEach((j) => {
      draw("#b-w" + (j + 1), T.counting4 + 0.15 * j, 1.0);
      draw(["#b-d" + (j + 1) + "-f", "#b-d" + (j + 1) + "-v"], T.counting4 + 0.4 + 0.15 * j, 0.6);
    });
    draw("#b-cam", T.counting4, 0.5);
    write("#b-camL", T.counting4 + 0.3, 0.6);
    draw("#b-wt", T.gate4, 0.8);
    write("#b-dSS", T.gate4 + 0.1, 0.6);
    draw("#b-U1", T.U4, 0.4);
    write("#b-UL1", T.U4 + 0.15, 0.2);
    write("#b-dHid", T.fraction4, 0.6);

    // ===== Line 5: each counting qubit starts in |+⟩ and controls U =====
    [1, 2, 3].forEach((j) => write("#b-kp" + j, T.ket5 + 0.12 * (j - 1), 0.3));
    write("#b-even", T.even + 0.1, 0.9);
    draw("#b-ct1", T.controls, 0.4);

    // ===== Line 6: phase kickback moves the turn onto the qubit's hand =====
    fade(["#b-even", "#b-cam", "#b-camL"], 0, T.kick, 0.3);
    tl.to("#b-ct1", { color: INK, duration: 0.3 }, T.kick);
    draw("#b-kick", T.kick, 0.8);
    write("#b-kickL", T.kick + 0.3, 0.6);
    write("#b-l15", T.lesson6, 0.5);
    tl.to("#b-dHid", { color: INK, duration: 0.35 }, T.turn6);
    tl.to("#b-d1-c", { color: GOLD, duration: 0.2 }, T.qubits6);

    // ===== Line 7: U once turns φ, twice 2φ, four times 4φ =====
    blurOut(["#b-kick", "#b-kickL", "#b-l15"], T.run7);
    tl.to("#b-U1", { scale: 1.08, svgOrigin: "470 720", duration: 0.18, yoyo: true, repeat: 1 }, T.run7);
    tl.to("#b-UL1", { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, T.run7);
    write("#b-v1", T.phi7, 0.3);
    draw(["#b-U2", "#b-ct2"], T.twice, 0.4);
    write("#b-UL2", T.twice + 0.15, 0.25);
    tl.to("#b-d1-c", { color: INK, duration: 0.2 }, T.twice);
    tl.to("#b-d2-c", { color: GOLD, duration: 0.15 }, T.twice);
    write("#b-v2", T.twophi, 0.3);
    draw(["#b-U3", "#b-ct3"], T.four7, 0.4);
    write("#b-UL3", T.four7 + 0.15, 0.25);
    tl.to("#b-d2-c", { color: INK, duration: 0.2 }, T.four7);
    tl.to("#b-d3-c", { color: GOLD, duration: 0.15 }, T.four7);
    write("#b-v3", T.four7b, 0.3);

    // ===== Line 8: doubling slides the binary digits; whole turns vanish =====
    blurOut(["#b-dHead", "#b-w1", "#b-w2", "#b-w3", "#b-wt", "#b-U1", "#b-U2", "#b-U3", "#b-UL1", "#b-UL2", "#b-UL3",
      "#b-ct1", "#b-ct2", "#b-ct3", "#b-kp1", "#b-kp2", "#b-kp3", "#b-dSS", "#b-dHid"], T.dbl - 0.2);
    tl.to("#b-d3-c", { color: INK, duration: 0.3 }, T.dbl);
    tl.to(["#b-v1", "#b-v2", "#b-v3"], { x: ${ROWX + ROWR + 30 - (DX + DR + 28)}, duration: 0.8, ease: "power2.inOut" }, T.dbl);
    [1, 2, 3].forEach((j) => {
      const t0 = T.binary8 + 0.25 * (j - 1);
      write("#b-re" + j, t0, 0.15);
      write("#b-ri" + j, t0 + 0.1, 0.2);
      write("#b-rp" + j, t0 + 0.2, 0.08);
      write("#b-rf" + j, t0 + 0.25, 0.3);
    });
    write("#b-bin", T.zeros, 0.7);
    tl.to("#b-rf1", { color: GOLD, duration: 0.15, yoyo: true, repeat: 1, repeatDelay: 0.3 }, T.zeros + 0.2);
    draw("#b-sh1", T.left8 - 0.2, 0.35);
    draw("#b-sh2", T.left8 + 0.15, 0.35);
    draw(["#b-st2", "#b-st3"], T.whole, 0.3);
    write("#b-full", T.whole + 0.3, 0.5);
    fade(["#b-ri2", "#b-ri3", "#b-st2", "#b-st3"], 0.25, T.vanish, 0.4);
    fade(["#b-sh1", "#b-sh2", "#b-bin"], 0.35, T.vanish, 0.4);
    [1, 2, 3].forEach((j) => {
      const t0 = T.finer + 0.15 * (j - 1);
      tl.to("#b-rfd" + j, { color: GOLD, duration: 0.15 }, t0);
      draw("#b-da" + j, t0, 0.25);
      write("#b-dg" + j, t0 + 0.08, 0.3);
      tl.to("#b-d" + j + "-c", { color: GOLD, duration: 0.12 }, t0);
      tl.to("#b-d" + j + "-c", { color: INK, duration: 0.2 }, t0 + 0.45);
    });
    blurOut("#b-sD", T.l9);

    // ===== Line 9: the S gate turns |1⟩ a quarter turn, 0.01 in binary =====
    draw(${JSON.stringify(dialOn("b-dS"))}, T.try9, 1.0);
    draw("#b-Sbox", T.try9 + 0.15, 0.5);
    write("#b-SL", T.try9 + 0.45, 0.25);
    draw("#b-Sarr", T.try9 + 0.6, 0.35);
    write("#b-S1", T.ket9, 0.4);
    tl.to("#b-dS-c", { color: GOLD, duration: 0.2 }, T.quarter9);
    write("#b-Sq", T.quarter9 + 0.4, 0.5);
    write("#b-Sbin", T.zero9, 1.0);
    tl.to(["#b-dS-c", "#b-Sq"], { color: INK, duration: 0.3 }, T.zero9);
    blurOut("#b-sF", T.l10);

    // ===== Line 10: two counting qubits, a quarter and a half =====
    draw(${JSON.stringify(dialOn("b-g1"))}, T.two10, 0.7);
    draw(${JSON.stringify(dialOn("b-g2"))}, T.two10 + 0.2, 0.7);
    write("#b-gL1", T.two10 + 0.2, 0.8);
    write("#b-gL2", T.two10 + 0.5, 0.8);
    tl.to("#b-g1-c", { color: GOLD, duration: 0.15 }, T.quarter10);
    write("#b-gq", T.quarter10 + 0.3, 0.3);
    tl.to("#b-g1-c", { color: INK, duration: 0.2 }, T.half10);
    tl.to("#b-g2-c", { color: GOLD, duration: 0.15 }, T.half10);
    write("#b-gh", T.half10 + 0.25, 0.3);
    blurOut("#b-sG", T.l11 - 0.1);

    // ===== Line 11: the picture breaks: measuring gives 0 or 1, never the hand =====
    draw(["#b-hP", "#b-hc-f", "#b-hc-v"], T.picture, 0.6);
    draw("#b-hX", T.breaks, 0.35);
    blurOut(["#b-hP", "#b-hc", "#b-hX"], T.measuring);
    draw(${JSON.stringify(dialOn("b-hD"))}, T.measuring, 0.8);
    draw("#b-hEye", T.measuring + 0.3, 0.5);
    draw("#b-hArr", T.measuring + 0.7, 0.4);
    write("#b-h01", T.zero11, 0.5);
    write("#b-h55", T.zero11 + 0.3, 0.9);
    fade("#b-hD-v", 0.2, T.never, 0.3);
    write("#b-hQ", T.never + 0.1, 0.25);
    blurOut("#b-sH", T.l12 - 0.1);

    // ===== Line 12: the inverse QFT combines the hands into the digits 01 =====
    draw(${JSON.stringify(dialOn("b-i1"))}, T.instead, 0.6);
    draw(${JSON.stringify(dialOn("b-i2"))}, T.instead + 0.15, 0.6);
    write("#b-iq", T.instead + 0.5, 0.25);
    write("#b-ih", T.instead + 0.65, 0.25);
    draw("#b-iBox", T.inverse12, 0.5);
    write("#b-iL", T.inverse12 + 0.2, 0.6);
    write("#b-i18", T.lesson12, 0.5);
    draw("#b-iA1", T.combines, 0.4);
    draw("#b-iA2", T.combines + 0.4, 0.4);
    tl.to("#b-iBox", { scale: 1.04, svgOrigin: "960 575", duration: 0.2, yoyo: true, repeat: 1 }, T.hands12);
    write("#b-iR", T.digits12, 0.6);
    write("#b-iEq", T.one12 + 0.1, 0.5);
    blurOut("#b-sI", T.l13);

    // ===== Line 13: the input must be a state U only turns: an eigenstate =====
    draw(${JSON.stringify(dialOn("b-jIn"))}, T.input13, 0.7);
    write("#b-jInL", T.input13 + 0.1, 0.4);
    draw("#b-jA1", T.input13 + 0.4, 0.3);
    draw("#b-jS", T.input13 + 0.5, 0.4);
    write("#b-jSL", T.input13 + 0.7, 0.2);
    draw("#b-jA2", T.input13 + 0.8, 0.3);
    draw("#b-jOut-f", T.input13 + 0.9, 0.5);
    draw("#b-jOut-v", T.turns13, 0.4);
    write("#b-jSame", T.turns13 + 0.3, 0.8);
    write("#b-jEig", T.eigen, 0.6);
    write(["#b-j1a", "#b-j1b"], T.ket13, 0.35);
    tl.to("#b-jEig", { color: INK, duration: 0.3 }, T.ket13);

    // ===== Line 14: any other state gives a random one of U's phases =====
    blurOut(["#b-jOut", "#b-jSame", "#b-j1b", "#b-jEig"], T.l14 - 0.2);
    fade(["#b-j1a", "#b-jInL"], 0, T.other - 0.1, 0.2);
    write("#b-jPlus", T.other, 0.35);
    write("#b-jAny", T.other + 0.2, 0.6);
    draw("#b-jDie", T.random - 0.1, 0.5);
    tl.to("#b-jDie", { rotation: 9, svgOrigin: "1360 420", duration: 0.1, yoyo: true, repeat: 5, ease: "sine.inOut" }, T.random + 0.3);
    write("#b-jO0", T.random + 0.4, 0.25);
    write("#b-jO1", T.random + 0.6, 0.25);
    write("#b-jHalf", T.random + 0.75, 0.5);
    write("#b-jPh", T.phases - 0.35, 0.6);
    blurOut("#b-sJ", T.l15 + 0.1);

    // ===== Line 15: the closing circuit =====
    write("#b-kHead", T.l15 + 0.1, 0.7);
    draw(["#b-kw1", "#b-kw2", "#b-kw3", "#b-kwt"], T.kick15, 0.8);
    write(["#b-kk1", "#b-kk2", "#b-kk3"], T.kick15 + 0.2, 0.3);
    write("#b-kSS", T.kick15 + 0.3, 0.5);
    [T.u15a, T.u15b, T.u15c].forEach((t0, i) => {
      const j = i + 1;
      draw(["#b-kU" + j, "#b-kc" + j], t0, 0.35);
      write("#b-kUL" + j, t0 + 0.1, 0.2);
      draw("#b-kf" + j, t0 + 0.3, 0.2);
      tl.to("#b-kf" + j, { color: INK, duration: 0.3 }, t0 + 0.8);
    });
    write("#b-kCQ", T.counting15, 0.6);
    draw(["#b-kQ", "#b-kr1", "#b-kr2", "#b-kr3"], T.inverse15, 0.6);
    write("#b-kQL1", T.inverse15 + 0.2, 0.3);
    write("#b-kQL2", T.inverse15 + 0.45, 0.25);
    [1, 2, 3].forEach((j) => write("#b-kd" + j, T.reads + 0.12 * (j - 1), 0.2));
    draw("#b-kBr", T.binary15 - 0.1, 0.4);
    write("#b-kP1", T.binary15, 0.3);
    write("#b-kP2", T.binary15 + 0.25, 0.5);
    tl.to("#b-kP2", { scale: 1.06, duration: 0.55, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.end + 0.1);
  `;

  return { html, script };
}
