// Lesson 22, "Trainable circuits and quantum ML". Follows plan.md: the lesson 6 knob turned by hand, then
// by a computer; tuning a guitar by ear (pluck, hear, nudge the peg); the peg becomes the RY knob of a
// trainable circuit; θ starts at π/2 with P(1) = 50% against a 25% target; the cost valley with a ball
// that rolls down it in shrinking steps; the update rule; the optimizer loop beside an AI model; where the
// guitar picture breaks (shots, parameter shift, many runs per listen); the balance scale (no automatic
// advantage); and the closing card whose ball keeps settling and whose knob keeps twitching through the hold.
// Gold is the thing that matters right now: the pointer, the peg, the ball, the P(1) bar, the answer.
export const phrases = [
  ["fifty percent", "50%"],
  ["twenty five", "25%"],
  ["a quarter of the time", "¼ of the time"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, wobbly, INK, GOLD, GROUND } = k;
  const DIMINK = "rgba(232,232,232,0.35)";
  const f1 = (n) => +(+n).toFixed(1);
  // Label centred on (cx, cy), and a left-aligned label whose text is centred on cy.
  const C = (id, cx, cy, w, size, html, extra = "") => lbl(id, f1(cx - w / 2), f1(cy - size * 0.76), w, size, html, extra);
  const LL = (id, x, cy, w, size, html, extra = "") => lbl(id, f1(x), f1(cy - size * 0.76), w, size, html, `text-align:left;${extra}`);
  const RL = (id, xr, cy, w, size, html, extra = "") => lbl(id, f1(xr - w), f1(cy - size * 0.76), w, size, html, `text-align:right;${extra}`);
  const G = (id, inner, extra = "") => `<g id="${id}"${extra}>${inner}</g>`;
  const full = (id, svg, inner = "") => `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${inner}</div>`;
  const wrap = (id, inner) => `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px">${inner}</div>`;
  const hatch = (c, gap = 9) => ({ fill: c, fillStyle: "hachure", hachureGap: gap, fillWeight: 2 });
  const solidBox = (x, y, w, h, o = {}) => r.rect(x, y, w, h, pen({ strokeWidth: 3.2, roughness: 1, fill: GROUND, fillStyle: "solid", ...o }));
  const P1 = (th) => Math.sin((Math.PI * th) / 2) ** 2; // th in units of π
  const COST = (th) => (P1(th) - 0.25) ** 2;
  const CMAX = COST(0.6);

  // ---------- Times, cued to the voice ----------
  const T = {
    knob: cue(0, "knob", 0, -0.2), hand: cue(0, "hand"), qubit: cue(0, "qubit"), read: cue(0, "read"), quarter: cue(0, "quarter"),
    this1: cue(1, "This"), computer: cue(1, "computer"), turn: cue(1, "turn"),
    its2: cue(2, "It's"), guitar: cue(2, "guitar"), ear: cue(2, "ear"), pluck: cue(2, "pluck"), here: cue(2, "here"), nudge2: cue(2, "nudge"), pluck2: cue(2, "pluck", 1),
    our: cue(3, "Our"), rotation: cue(3, "rotation"), theta3: cue(3, "theta"), free: cue(3, "free"), trainable: cue(3, "trainable"),
    l4: cue(4), start: cue(4, "Start"), theta4: cue(4, "theta"), pi4: cue(4, "pi"), comes: cue(4, "comes"), half: cue(4, "half"), want: cue(4, "want"),
    l5: cue(5), far: cue(5, "far"), cost5: cue(5, "cost"), plotted: cue(5, "Plotted"), theta5: cue(5, "theta"), valley: cue(5, "valley"), zero5: cue(5, "zero"), bottom: cue(5, "bottom"),
    l6: cue(6), slope6: cue(6, "slope"), gradient: cue(6, "gradient"), downhill: cue(6, "downhill"), nudge6: cue(6, "nudge"),
    run7: cue(7, "run"), measure: cue(7, "measure"), nudge7: cue(7, "nudge"), again7: cue(7, "again"), from7: cue(7, "from"), to7: cue(7, "to"),
    each8: cue(8, "Each"), new8: cue(8, "new"), old8: cue(8, "old"), minus: cue(8, "minus"), times: cue(8, "times"), slope8: cue(8, "slope"),
    l9: cue(9), ordinary: cue(9, "ordinary"), optimizer: cue(9, "optimizer"), loop: cue(9, "loop"), ai: cue(9, "AI"),
    l10: cue(10), guitar10: cue(10, "guitar"), breaks: cue(10, "breaks"), hear10: cue(10, "hear"), moment: cue(10, "moment"),
    run11: cue(11, "run"), zero11: cue(11, "zero"), one11: cue(11, "one"), estimate: cue(11, "estimate"), called11: cue(11, "called"),
    shots: cue(12, "shots"), even: cue(12, "Even"), slope12: cue(12, "slope"), theta12: cue(12, "theta"), each12: cue(12, "each"),
    listen: cue(13, "listen"), costs: cue(13, "costs"),
    q14: cue(14, "quantum"), auto: cue(14, "automatically"), matches: cue(14, "matches"), worse: cue(14, "worse"),
    point: cue(15, "point"), works: cue(15, "works"), where: cue(15, "where"),
    so16: cue(16, "So"), train16: cue(16, "trainable"), knobs: cue(16, "knobs"), opt16: cue(16, "optimizer"), down16: cue(16, "downhill"), measured: cue(16, "measured"), cost16: cue(16, "cost"),
  };
  // Training steps (plan.md table): θ in units of π. Each step is smaller than the last.
  const TH = [0.5, 0.38, 0.35, 0.34, 1 / 3];
  const STEPS = [
    [T.nudge6, T.nudge6 + 0.8],
    [T.again7, T.again7 + 0.8],
    [T.again7 + 0.95, T.again7 + 1.65],
    [T.again7 + 1.8, T.again7 + 2.4],
  ];
  // Line 11: when the estimate moves on to 100 and 1000 runs.
  const R10 = T.estimate + 0.75, R100 = T.estimate + 1.25, R1000 = T.estimate + 2.0;

  // ===================== Shared drawing helpers =====================
  function curveArrow(pts, o = {}, head = 14) {
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const hp = (da) => [b[0] - head * Math.cos(ang + da), b[1] - head * Math.sin(ang + da)];
    const [h1, h2] = [hp(0.5), hp(-0.5)];
    const p = o.gold ? goldPen : pen;
    const oo = { ...o };
    delete oo.gold;
    return r.curve(pts, p(oo)) + r.line(b[0], b[1], h1[0], h1[1], p(oo)) + r.line(b[0], b[1], h2[0], h2[1], p(oo));
  }
  function dottedArrow(pts, o = {}) {
    // Short strokes along a polyline of sample points, then a head.
    let s = "";
    for (let i = 0; i + 1 < pts.length; i += 2) s += r.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], pen({ strokeWidth: 2.6, roughness: 0.5, ...o }));
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), hd = 16;
    s += r.line(b[0], b[1], b[0] - hd * Math.cos(ang + 0.5), b[1] - hd * Math.sin(ang + 0.5), pen({ strokeWidth: 2.6, ...o }));
    s += r.line(b[0], b[1], b[0] - hd * Math.cos(ang - 0.5), b[1] - hd * Math.sin(ang - 0.5), pen({ strokeWidth: 2.6, ...o }));
    return s;
  }
  const quad = (p0, p1, p2, n) => Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    return [(1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
  });

  // The lesson 6 knob: body, inner ring, 7 ticks over the top half, a gold arc that follows the pointer,
  // the gold pointer (rotated every frame) and the labels 0, π/2, π.
  function dial(p, cx, cy, R, ls) {
    const ang = (th) => Math.PI * (1 + th);
    const pt = (th, rad) => [cx + Math.cos(ang(th)) * rad, cy + Math.sin(ang(th)) * rad];
    let ticks = "";
    for (let i = 0; i <= 6; i++) {
      const [a, b] = [pt(i / 6, 1.19 * R), pt(i / 6, 1.36 * R)];
      ticks += r.line(a[0], a[1], b[0], b[1], pen({ strokeWidth: i % 3 === 0 ? 3.4 : 2.4, roughness: 0.8 }));
    }
    const arc = wobbly(Array.from({ length: 121 }, (_, i) => pt(i / 120, 1.54 * R)), 1.4, 7 + Math.round(cx));
    const svg =
      G(`${p}-body`, r.circle(cx, cy, 2 * R, pen({ strokeWidth: 3.4 })) + r.circle(cx, cy, 1.6 * R, pen({ strokeWidth: 1.6, roughness: 1.8 }))) +
      G(`${p}-ticks`, ticks) +
      G(`${p}-arcG`, `<path id="${p}-arc" d="${arc.d}" pathLength="1" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>`) +
      G(`${p}-ptr`, r.line(cx, cy, cx + 0.82 * R, cy, goldPen({ strokeWidth: 6, roughness: 0.9 })) + r.circle(cx, cy, 0.36 * R, goldPen({ fill: GOLD, fillStyle: "solid" })));
    const lp = (th) => pt(th, 1.82 * R);
    const html =
      C(`${p}-l0`, lp(0)[0], lp(0)[1], 80, ls, "0") +
      C(`${p}-l1`, lp(0.5)[0], lp(0.5)[1], 120, ls, "π/2") +
      C(`${p}-l2`, lp(1)[0], lp(1)[1], 80, ls, "π");
    return { svg, html };
  }
  // A laptop: screen (x, y, w wide) and keyboard base.
  const laptop = (p, x, y, w, solid = false) => {
    const h = w * 0.6;
    const sf = solid ? { fill: GROUND, fillStyle: "solid" } : {};
    return G(p, r.rect(x, y, w, h, pen({ strokeWidth: 3, ...sf })) + r.rect(x + 12, y + 12, w - 24, h - 24, pen({ strokeWidth: 1.8, roughness: 0.8 })) +
      r.poly([[x - 20, y + h + 6], [x + w + 20, y + h + 6], [x + w + 46, y + h + 36], [x - 46, y + h + 36]], pen({ strokeWidth: 3, ...sf })));
  };
  // A one-qubit circuit: |0⟩, wire, RY box with a small knob on its top edge, meter. Local units with the
  // wire start at (ox, oy), scale s, label size ls.
  function circuit(p, ox, oy, s, ls, o = {}) {
    const X = (x) => f1(ox + x * s), Y = (y) => f1(oy + y * s), S = (v) => f1(v * s);
    const kx = X(285), ky = Y(-50), kr = Math.max(9, S(20));
    const svg =
      G(`${p}-w`, r.line(X(0), Y(0), X(525), Y(0), pen({ strokeWidth: 3 }))) +
      G(`${p}-box`, solidBox(X(185), Y(-50), S(200), S(100))) +
      G(`${p}-boxG`, r.rect(X(185), Y(-50), S(200), S(100), goldPen({ strokeWidth: 4, roughness: 1 }))) +
      G(`${p}-m`, solidBox(X(525), Y(-50), S(140), S(100)) + r.arc(X(595), Y(32), S(96), S(96), Math.PI, 2 * Math.PI, false, pen({ strokeWidth: 2.6, roughness: 0.8 }))) +
      G(`${p}-ndl`, r.line(X(595), Y(32), X(622), Y(-18), pen({ strokeWidth: 2.8, roughness: 0.6 }))) +
      `<g id="${p}-kT">` +
      G(`${p}-knob`, r.circle(kx, ky, kr * 2, pen({ strokeWidth: 2.6, fill: GROUND, fillStyle: "solid", roughness: 0.8 })) + r.line(kx, ky, kx + kr * 0.95, ky, pen({ strokeWidth: 3, roughness: 0.4 }))) +
      G(`${p}-knobG`, r.circle(kx, ky, kr * 2, goldPen({ strokeWidth: 3.4, fill: GROUND, fillStyle: "solid", roughness: 0.8 })) + r.line(kx, ky, kx + kr * 0.95, ky, goldPen({ strokeWidth: 3.6, roughness: 0.4 }))) +
      `</g>`;
    const html =
      (o.ket === false ? "" : C(`${p}-k0`, X(-60), Y(0), 120, ls, "|0⟩")) +
      C(`${p}-ry`, X(285), Y(0), S(200) + 40, ls, o.ry ?? `RY(<span id="${p}-th" style="display:inline-block">θ</span>)`);
    return { svg, html, kx, ky, X, Y };
  }
  // A coin: its own little div, so it can pop (scale) from its centre.
  const coin = (id, cx, cy, rr, digit, gold, ls) => {
    const d = 2 * rr + 12;
    const c = gold ? r.circle(d / 2, d / 2, 2 * rr, goldPen({ strokeWidth: 3.4 })) : r.circle(d / 2, d / 2, 2 * rr, pen({ strokeWidth: 2.8 }));
    return `<div class="obj" id="${id}" style="left:${f1(cx - d / 2)}px;top:${f1(cy - d / 2)}px;width:${d}px;height:${d}px"><svg class="sk" width="${d}" height="${d}" viewBox="0 0 ${d} ${d}">${c}</svg>` +
      C(`${id}-d`, d / 2, d / 2, d, ls, digit, gold ? `color:${GOLD};font-weight:700` : "") + `</div>`;
  };
  // Guitar lying on its side: headstock with 3 + 3 tuning pegs at left, neck with frets, body and sound
  // hole at right. Local coordinates are the big guitar's; (ox, oy, s) place a copy.
  function guitar(p, ox, oy, s, bigPeg) {
    const X = (x) => f1(ox + x * s), Y = (y) => f1(oy + y * s), S = (v) => f1(v * s);
    const P = (pts) => pts.map(([x, y]) => [X(x), Y(y)]);
    const topE = (x) => 415 + ((x - 250) * 25) / 310, botE = (x) => 565 - ((x - 250) * 25) / 310;
    const PX = [330, 410, 490];
    let head = r.poly(P([[250, 415], [560, 440], [560, 540], [250, 565]]), pen({ strokeWidth: 3.2 }));
    PX.forEach((x) => { head += r.circle(X(x), Y(topE(x) + 20), S(16), pen({ strokeWidth: 2 })) + r.circle(X(x), Y(botE(x) - 20), S(16), pen({ strokeWidth: 2 })); });
    let pegs = "";
    PX.forEach((x) => {
      if (!(bigPeg && x === 410)) pegs += r.line(X(x), Y(topE(x)), X(x), Y(topE(x) - 30), pen({ strokeWidth: 3 })) + r.ellipse(X(x), Y(topE(x) - 52), S(34), S(44), pen({ strokeWidth: 2.8 }));
      pegs += r.line(X(x), Y(botE(x)), X(x), Y(botE(x) + 30), pen({ strokeWidth: 3 })) + r.ellipse(X(x), Y(botE(x) + 52), S(34), S(44), pen({ strokeWidth: 2.8 }));
    });
    if (bigPeg) pegs += r.line(X(410), Y(topE(410)), X(410), Y(topE(410) - 30), pen({ strokeWidth: 3 }));
    const FR = [680, 790, 890, 980, 1062, 1136, 1203, 1263, 1317, 1366, 1410];
    const neck = r.line(X(560), Y(440), X(560), Y(540), pen({ strokeWidth: 6, roughness: 0.6 })) +
      r.line(X(560), Y(445), X(1470), Y(445), pen({ strokeWidth: 3 })) + r.line(X(560), Y(535), X(1470), Y(535), pen({ strokeWidth: 3 })) +
      FR.map((x) => r.line(X(x), Y(447), X(x), Y(533), pen({ strokeWidth: 2, roughness: 0.6 }))).join("");
    // One closed outline: upper bout, rounded end (kept inside x 1775), lower bout.
    const body = r.curve(P([[1470, 445], [1462, 400], [1500, 340], [1590, 302], [1690, 300], [1748, 334], [1772, 410], [1775, 490], [1772, 570], [1748, 646], [1690, 680], [1590, 678], [1500, 640], [1462, 580], [1470, 535]]), pen({ strokeWidth: 3.2 })) +
      r.circle(X(1608), Y(490), S(160), pen({ strokeWidth: 3 })) + r.circle(X(1608), Y(490), S(140), pen({ strokeWidth: 1.6, roughness: 1.6 })) +
      r.line(X(1722), Y(440), X(1722), Y(540), pen({ strokeWidth: 5, roughness: 0.6 }));
    const SY = [455, 470, 485, 500, 515, 530];
    const posts = [[330, topE(330) + 20], [410, topE(410) + 20], [490, topE(490) + 20], [490, botE(490) - 20], [410, botE(410) - 20], [330, botE(330) - 20]];
    let strings = "";
    SY.forEach((y, i) => {
      strings += r.line(X(posts[i][0]), Y(posts[i][1]), X(560), Y(y), pen({ strokeWidth: 1.6, roughness: 0.4 }));
      if (i > 0) strings += r.line(X(560), Y(y), X(1722), Y(y), pen({ strokeWidth: 1.6, roughness: 0.3 }));
    });
    const vib = `<path id="${p}-vib" class="ink" pathLength="1" d="M${X(560)} ${Y(455)} L${X(1722)} ${Y(455)}" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    return G(`${p}-head`, head + pegs) + G(`${p}-neck`, neck) + G(`${p}-body`, body) + G(`${p}-str`, strings + vib);
  }
  // An ear: outer rim, inner fold, lobe. Local coordinates are the big ear's.
  function earSvg(p, ox, oy, s) {
    const P = (pts) => pts.map(([x, y]) => [f1(ox + x * s), f1(oy + y * s)]);
    return G(p, r.curve(P([[1548, 196], [1572, 168], [1615, 172], [1638, 214], [1630, 262], [1604, 288], [1596, 314], [1572, 324], [1552, 306]]), pen({ strokeWidth: 3.2 })) +
      r.curve(P([[1572, 220], [1590, 206], [1610, 222], [1606, 250], [1588, 262], [1590, 282]]), pen({ strokeWidth: 2.4 })) +
      r.curve(P([[1560, 256], [1572, 244], [1580, 260]]), pen({ strokeWidth: 2.2 })));
  }
  // Clip-on tuner: box, meter arc, centre tick, side ticks, clamp. Needle `${p}-ndl` turns about (940, 300).
  function tuner(p, ox, oy, s) {
    const X = (x) => f1(ox + x * s), Y = (y) => f1(oy + y * s), S = (v) => f1(v * s);
    const tk = (deg, a, b, w) => { const t = ((deg - 90) * Math.PI) / 180; return r.line(X(940 + Math.cos(t) * a), Y(300 + Math.sin(t) * a), X(940 + Math.cos(t) * b), Y(300 + Math.sin(t) * b), pen({ strokeWidth: w, roughness: 0.5 })); };
    const svg = G(`${p}-b`, r.rect(X(790), Y(150), S(300), S(170), pen({ strokeWidth: 3.2 })) +
      r.arc(X(940), Y(300), S(220), S(220), Math.PI + 0.35, 2 * Math.PI - 0.35, false, pen({ strokeWidth: 2.6, roughness: 0.8 })) +
      tk(0, 92, 122, 3.4) + tk(-45, 100, 116, 2.2) + tk(45, 100, 116, 2.2) + tk(-22, 102, 114, 2) + tk(22, 102, 114, 2) +
      r.line(X(940), Y(320), X(940), Y(442), pen({ strokeWidth: 4, roughness: 0.6 }))) +
      `<g id="${p}-nT">${G(`${p}-ndl`, r.line(X(940), Y(300), X(940), Y(206), pen({ strokeWidth: 3.6, roughness: 0.5 })) + r.circle(X(940), Y(300), S(16), pen({ fill: INK, fillStyle: "solid", strokeWidth: 2 })))}</g>`;
    return { svg, px: X(940), py: Y(300) };
  }
  // A vertical bar whose height the timeline sets (clip rect id-cr), with an outline path id-o.
  function vbar(id, x, w, yBot, hMax, color) {
    const body = r.rect(x + 3, yBot - hMax, w - 6, hMax, pen({ ...hatch(color, 9), stroke: "none", roughness: 1.1 }));
    return `<defs><clipPath id="${id}-c"><rect id="${id}-cr" x="${x - 4}" y="${yBot}" width="${w + 8}" height="0"/></clipPath></defs>` +
      `<g id="${id}"><g clip-path="url(#${id}-c)">${body}</g><path id="${id}-o" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }
  // A horizontal bar whose length the timeline sets.
  function hbar(id, x, y, h, wMax, color) {
    const body = r.rect(x + 2, y + 3, wMax - 4, h - 6, pen({ ...hatch(color, 8), stroke: "none", roughness: 1.1 }));
    return `<defs><clipPath id="${id}-c"><rect id="${id}-cr" x="${x}" y="${y - 4}" width="0" height="${h + 8}"/></clipPath></defs>` +
      `<g id="${id}"><g clip-path="url(#${id}-c)">${body}</g><path id="${id}-o" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round"/></g>`;
  }
  const dashH = (x1, x2, y, o = {}, len = 14, gap = 10) => {
    let s = "";
    for (let x = x1; x < x2; x += len + gap) s += r.line(x, y, Math.min(x + len, x2), y, pen({ strokeWidth: 2.4, roughness: 0.5, ...o }));
    return s;
  };

  // ===================== Scene A: the knob by hand, then by a computer (lines 0 and 1) =====================
  const D1 = { cx: 960, cy: 560, R: 140 };
  const d1 = dial("b-d1", D1.cx, D1.cy, D1.R, 48);
  const handSvg = G("b-hand",
    r.curve([[1290, 600], [1200, 610], [1120, 630], [1082, 645]], pen({ strokeWidth: 3 })) +
    r.curve([[1082, 645], [1092, 662], [1130, 660], [1200, 650]], pen({ strokeWidth: 3 })) +
    r.curve([[1220, 742], [1150, 716], [1096, 690], [1080, 672]], pen({ strokeWidth: 3 })) +
    r.curve([[1080, 672], [1102, 666], [1160, 690]], pen({ strokeWidth: 2.6 })) +
    r.curve([[1290, 600], [1340, 640], [1360, 700], [1330, 760]], pen({ strokeWidth: 3 })) +
    r.curve([[1220, 742], [1270, 772], [1330, 760]], pen({ strokeWidth: 3 })) +
    r.curve([[1200, 650], [1232, 672], [1262, 668]], pen({ strokeWidth: 2.4 })) +
    r.curve([[1206, 692], [1240, 708], [1272, 702]], pen({ strokeWidth: 2.4 })) +
    r.line(1330, 760, 1372, 818, pen({ strokeWidth: 3 })) + r.line(1268, 772, 1306, 832, pen({ strokeWidth: 3 })));
  const lapA = laptop("b-lapA", 250, 470, 280);
  const lapArrow = G("b-lapAr", dottedArrow(quad([548, 470], [640, 380], [742, 446], 14)));
  const sA = full("b-sA", d1.svg + handSvg + lapA + lapArrow,
    d1.html +
    C("b-qnote", 1480, 400, 420, 48, "qubit = quantum bit") +
    C("b-roA", 960, 762, 360, 58, `P(1) = <span id="b-roAp">0%</span>`, `color:${GOLD}`) +
    C("b-in4", 960, 830, 200, 46, "1 in 4") +
    C("b-comp", 390, 730, 260, 46, "computer"));

  // ===================== Scene B: tuning a guitar by ear (lines 2 and 3) =====================
  const TUN = tuner("b-tun", 0, 0, 1);
  const GX = -40; // the big guitar sits 40 px left, so its body clears the phone edge
  const PEG = { x: 410 + GX, y: 376 }; // key centre of the peg we turn
  const pegArrow = curveArrow(Array.from({ length: 9 }, (_, i) => { const a = ((200 + (i * 140) / 8) * Math.PI) / 180; return [PEG.x + Math.cos(a) * 44, PEG.y + Math.sin(a) * 44]; }), { gold: true, strokeWidth: 3 }, 13);
  const soundSvg = [40, 70, 100].map((rr, i) => G(`b-snd${i}`, r.arc(1400 + GX, 440, 2 * rr, 2 * rr, (-120 * Math.PI) / 180, (-60 * Math.PI) / 180, false, pen({ strokeWidth: 2.6, roughness: 0.8 })))).join("");
  const sB = full("b-sB", guitar("b-g", GX, 0, 1, true) + earSvg("b-ear", -150 + GX, -50, 1) + TUN.svg + soundSvg + G("b-pegAr", pegArrow),
    LL("b-tbe", 192, 130, 420, 58, "tuning by ear") +
    C("b-tin", 940, 122, 200, 42, "in tune") + C("b-tfl", 846, 298, 90, 40, "flat") + C("b-tsh", 1034, 298, 100, 40, "sharp") +
    LL("b-low", 1112, 236, 240, 48, "too low", `color:${GOLD}`) + LL("b-closer", 1112, 236, 240, 48, "closer"));
  // The peg itself: outside the guitar's wrapper so it survives the guitar's blur and flies to the circuit.
  const pegSvg = `<g id="b-pegM"><g id="b-pegK">${G("b-pegI", r.ellipse(PEG.x, PEG.y, 34, 44, pen({ strokeWidth: 2.8 })))}${G("b-pegG", r.ellipse(PEG.x, PEG.y, 34, 44, goldPen({ strokeWidth: 3.6, ...hatch(GOLD, 6) })))}</g></g>`;
  const pegObj = full("b-pegObj", pegSvg);

  // ===================== Circuit strip (lines 3 to 7) =====================
  const CS = circuit("b-c", 255, 190, 1, 52);
  const ulTrain = r.curve([[1182, 232], [1300, 226], [1420, 230]], goldPen({ strokeWidth: 4, roughness: 1 }));
  const sCirc = full("b-sC", CS.svg + G("b-trU", ulTrain) + `<line id="b-wdash" x1="0" y1="190" x2="0" y2="190" stroke="${GOLD}" stroke-width="7" stroke-linecap="round" opacity="0"/>`,
    CS.html + LL("b-ptoP", 932, 190, 200, 52, "→ P(1)") +
    C("b-rotl", 540, 296, 300, 46, "rotation angle") + C("b-rotl2", 540, 296, 360, 46, "θ = rotation angle") +
    LL("b-train", 1180, 190, 300, 66, "trainable", `color:${GOLD}`));

  // ===================== Dial, P(1) bar and readouts (lines 4 to 7) =====================
  const D2 = { cx: 400, cy: 560, R: 120 };
  const d2 = dial("b-d2", D2.cx, D2.cy, D2.R, 44);
  const BAR = { x: 700, w: 70, yb: 780, h: 400 };
  const T25 = BAR.yb - BAR.h * 0.25;
  const tickSvg = r.linear([[812, T25 - 4], [826, T25 + 12], [852, T25 - 24]], goldPen({ strokeWidth: 4, roughness: 0.7 }));
  const sDial = full("b-sD",
    d2.svg +
    G("b-bart", r.rect(BAR.x, BAR.yb - BAR.h, BAR.w, BAR.h, pen({ strokeWidth: 1.8, stroke: DIMINK, roughness: 0.8 })) + r.line(BAR.x - 30, BAR.yb, BAR.x + BAR.w + 30, BAR.yb, pen({ strokeWidth: 3 }))) +
    vbar("b-bar", BAR.x, BAR.w, BAR.yb, BAR.h, GOLD) +
    G("b-tgt", dashH(BAR.x - 16, BAR.x + BAR.w + 24, T25)) +
    `<path id="b-gap" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>` +
    G("b-strk", r.line(698, 528, 772, 512, pen({ strokeWidth: 3 }))) + G("b-tick", tickSvg),
    d2.html +
    C("b-roth", D2.cx, 745, 300, 50, `θ = <span id="b-rothv">0.00</span>π`) + C("b-roth3", D2.cx, 745, 300, 50, "θ = π/3", `color:${GOLD}`) +
    C("b-rop", D2.cx, 806, 320, 54, `P(1) = <span id="b-ropv">0%</span>`, `color:${GOLD}`) +
    C("b-barl", BAR.x + BAR.w / 2, 0, 130, 46, "0%", `color:${GOLD}`) +
    RL("b-tgtl", 668, T25, 230, 42, "target 25%") +
    C("b-old50", BAR.x + BAR.w / 2, 520, 110, 44, "50%") +
    LL("b-howfar", 815, 612, 260, 46, "how far off") + LL("b-eqcost", 815, 672, 220, 54, "= cost", `color:${GOLD}`) +
    coin("b-coin1", 650, 384, 34, "1", true, 50));

  // ===================== Cost chart (lines 5 to 8) =====================
  const CH = { x0: 1080, y0: 780, w: 640, h: 420, thMax: 0.6 };
  const cxp = (th) => CH.x0 + (CH.w * th) / CH.thMax;
  const cyp = (th) => CH.y0 - (CH.h * COST(th)) / CMAX;
  const KX = CH.w / CH.thMax, KY = CH.h / CMAX;
  const curve = wobbly(Array.from({ length: 121 }, (_, i) => [cxp((CH.thMax * i) / 120), cyp((CH.thMax * i) / 120)]), 1.1, 23);
  const tanAt = (th, half) => {
    const dC = 2 * (P1(th) - 0.25) * (Math.PI / 2) * Math.sin(Math.PI * th);
    const m = -(KY * dC) / KX, n = Math.hypot(1, m);
    return [cxp(th) - half / n, cyp(th) - (half * m) / n, cxp(th) + half / n, cyp(th) + (half * m) / n];
  };
  const tg0 = tanAt(0.5, 100);
  // Gold "downhill" arrow along the curve, offset up and left of it.
  const dhPts = Array.from({ length: 8 }, (_, i) => {
    const th = 0.475 - (i * 0.085) / 7;
    const dC = 2 * (P1(th) - 0.25) * (Math.PI / 2) * Math.sin(Math.PI * th);
    const m = -(KY * dC) / KX, n = Math.hypot(1, m);
    return [cxp(th) + (m / n) * 34, cyp(th) - (1 / n) * 34];
  });
  const sChart = full("b-chartW",
    G("b-axes",
      r.line(CH.x0, CH.y0 + 12, CH.x0, CH.y0 - CH.h - 40, pen()) + r.line(CH.x0, CH.y0 - CH.h - 40, CH.x0 - 10, CH.y0 - CH.h - 24, pen({ strokeWidth: 2.6 })) + r.line(CH.x0, CH.y0 - CH.h - 40, CH.x0 + 10, CH.y0 - CH.h - 24, pen({ strokeWidth: 2.6 })) +
      r.line(CH.x0 - 12, CH.y0, CH.x0 + CH.w + 20, CH.y0, pen()) + r.line(CH.x0 + CH.w + 20, CH.y0, CH.x0 + CH.w + 4, CH.y0 - 10, pen({ strokeWidth: 2.6 })) + r.line(CH.x0 + CH.w + 20, CH.y0, CH.x0 + CH.w + 4, CH.y0 + 10, pen({ strokeWidth: 2.6 })) +
      [1 / 3, 0.5].map((th) => r.line(cxp(th), CH.y0 - 9, cxp(th), CH.y0 + 9, pen({ strokeWidth: 2.4, roughness: 0.6 }))).join("")) +
    G("b-curve", `<path class="ink" pathLength="1" d="${curve.d}" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`) +
    G("b-zarr", arrow(cxp(1 / 3), CH.y0 - 96, cxp(1 / 3), CH.y0 - 22, { strokeWidth: 2.8 }, 14)) +
    G("b-dharr", curveArrow(dhPts, { gold: true, strokeWidth: 3.6 }, 16)) +
    G("b-tan0", r.line(tg0[0], tg0[1], tg0[2], tg0[3], goldPen({ strokeWidth: 4.4, roughness: 0.6 }))) +
    `<line id="b-tan" x1="0" y1="0" x2="0" y2="0" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>` +
    TH.map((th, i) => `<circle id="b-dot${i}" cx="${f1(cxp(th))}" cy="${f1(cyp(th))}" r="7" fill="${GOLD}"/>`).join("") +
    `<circle id="b-ball" cx="0" cy="0" r="16" fill="${GOLD}" stroke="${GROUND}" stroke-width="4"/>`,
    C("b-cyl", CH.x0, CH.y0 - CH.h - 66, 140, 46, "cost") +
    C("b-cxl", CH.x0 + CH.w + 18, CH.y0 - 42, 70, 56, "θ") +
    C("b-cx0", CH.x0, CH.y0 + 36, 70, 44, "0") + C("b-cx1", cxp(1 / 3), CH.y0 + 36, 110, 44, "π/3") + C("b-cx2", cxp(0.5), CH.y0 + 36, 110, 44, "π/2") +
    C("b-zcost", cxp(1 / 3), CH.y0 - 124, 220, 44, "zero cost") +
    LL("b-slope", 1290, 520, 120, 48, "slope") + LL("b-grad", 1388, 520, 240, 48, "= gradient") +
    RL("b-dhl", 1488, 640, 220, 46, "downhill", `color:${GOLD}`));

  // ===================== The rule (line 8) =====================
  const ruleHtml = `<div class="lbl hand" id="b-rule" style="left:360px;top:${720 - 72 * 0.76}px;width:1200px;font-size:72px">` +
    ["new θ", "= old θ", "− step", "× slope"].map((s, i) => `<span id="b-r${i}" style="display:inline-block;margin:0 0.06em;padding:0 0.1em">${k.hand(s)}</span>`).join("") + `</div>`;
  const sRule = full("b-sR", G("b-rarr", curveArrow([[1228, 690], [1120, 642], [1096, 582], [1118, 506]], { gold: true, strokeWidth: 3.2 }, 16)), ruleHtml);

  // ===================== Scene: the optimizer loop (line 9, and again small in line 15) =====================
  const LP = { cx: 960, cy: 470, rx: 460, ry: 250 };
  const ell = (deg) => [LP.cx + LP.rx * Math.cos((deg * Math.PI) / 180), LP.cy + LP.ry * Math.sin((deg * Math.PI) / 180)];
  const arcPts = (a0, a1) => Array.from({ length: 10 }, (_, i) => ell(a0 + ((a1 - a0) * i) / 9));
  const BOX = [
    { id: "b-lb0", deg: -90, w: 270, text: "run circuit" },
    { id: "b-lb1", deg: 25, w: 290, text: "measure cost" },
    { id: "b-lb2", deg: 155, w: 230, text: "nudge θ" },
  ];
  const ARCS = [[-70, 8], [40, 140], [172, 252]];
  const loopSvg =
    ARCS.map(([a0, a1], i) => G(`b-la${i}`, curveArrow(arcPts(a0, a1), { strokeWidth: 3 }, 16))).join("") +
    laptop("b-lapL", 840, 396, 240) +
    BOX.map((b) => { const [x, y] = ell(b.deg); return G(`${b.id}b`, solidBox(x - b.w / 2, y - 38, b.w, 76)); }).join("") +
    `<circle id="b-ldot" cx="0" cy="0" r="13" fill="${GOLD}" stroke="${GROUND}" stroke-width="4"/>`;
  const loopHtml = C("b-optl", 960, 470, 220, 46, "optimizer") +
    BOX.map((b) => { const [x, y] = ell(b.deg); return C(b.id, x, y, b.w, 44, b.text); }).join("");
  const sLoop = full("b-loopW", loopSvg, loopHtml);
  const NN = [[1480, [222, 282, 342]], [1590, [196, 250, 304, 358]], [1700, [252, 312]]];
  let net = "";
  for (let l = 0; l < 2; l++) NN[l][1].forEach((y1) => NN[l + 1][1].forEach((y2) => { net += r.line(NN[l][0], y1, NN[l + 1][0], y2, pen({ strokeWidth: 1.6, roughness: 0.6 })); }));
  NN.forEach(([x, ys]) => ys.forEach((y) => { net += r.circle(x, y, 26, pen({ strokeWidth: 2.6, fill: GROUND, fillStyle: "solid" })); }));
  const sNet = full("b-netW", G("b-net", net), C("b-netl", 1590, 420, 220, 46, "AI model") + C("b-approx", 1405, 300, 90, 70, "≈"));

  // ===================== Scene E: the guitar picture breaks (line 10) =====================
  const TUN2 = tuner("b-tun2", 220 - 790 * 0.6, 250 - 150 * 0.6, 0.6);
  let crack = [];
  for (let i = 0; i <= 14; i++) crack.push([960 + (i % 2 ? 22 : -18) * (i === 0 || i === 14 ? 0 : 1), 200 + i * 40]);
  const sE = full("b-sE",
    guitar("b-g2", 180 - 240 * 0.42, 500 - 490 * 0.42, 0.42, false) + earSvg("b-ear2", 640 - 1500 * 0.6, 230 - 160 * 0.6, 0.6) + TUN2.svg +
    G("b-snd9", curveArrow([[520, 470], [600, 400], [668, 352]], { strokeWidth: 2.4 }, 12)) +
    G("b-crack", r.linear(crack, pen({ strokeWidth: 3.4, roughness: 1 }))),
    C("b-inst", 520, 302, 170, 50, "instant", `color:${GOLD}`));

  // ===================== Scene F: shots (line 11) =====================
  const CF = circuit("b-f", 1130, 230, 0.6, 42, { ry: "RY" });
  const ROW = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0];
  const EB = { x: 1080, y: 520, h: 44, w: 560 };
  const sF = full("b-sF",
    CF.svg + hbar("b-eb", EB.x, EB.y, EB.h, EB.w, GOLD) +
    G("b-ebt", r.rect(EB.x, EB.y, EB.w, EB.h, pen({ strokeWidth: 2, stroke: DIMINK, roughness: 0.8 }))) +
    G("b-eb50", `<line x1="${EB.x + EB.w / 2}" y1="${EB.y - 16}" x2="${EB.x + EB.w / 2}" y2="${EB.y + EB.h + 16}" stroke="${INK}" stroke-opacity=".55" stroke-width="2.4" stroke-dasharray="7 7"/>`) +
    `<path id="b-whisk" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
    CF.html +
    coin("b-c0", 1590, 340, 34, "0", false, 50) + coin("b-c1", 1690, 340, 34, "1", true, 50) +
    ROW.map((v, i) => coin(`b-rc${i}`, 1104 + i * 56, 440, 23, String(v), v === 1, 40)).join("") +
    C("b-est", 1360, 640, 600, 50, `<span id="b-estn">10</span> runs: P(1) ≈ <span id="b-estp">60</span>%`) +
    C("b-shots", 1360, 762, 360, 58, `<span style="color:${GOLD}">shots</span> = runs`));

  // ===================== Scene G: the slope is measured too (lines 12 and 13) =====================
  const DM = dial("b-dm", 960, 400, 90, 40), DL = dial("b-dl", 520, 400, 90, 40), DR = dial("b-dr", 1400, 400, 90, 40);
  const earG = earSvg("b-ear3", 760 - 1548 * 0.42, 752 - 168 * 0.42, 0.42);
  const sG = full("b-sG",
    DM.svg + DL.svg + DR.svg +
    G("b-cmp", solidBox(840, 650, 240, 84)) +
    G("b-ga0", arrow(578, 676, 830, 692, { stroke: GOLD, strokeWidth: 3.4 }, 16)) +
    G("b-ga1", arrow(1338, 676, 1090, 692, { stroke: GOLD, strokeWidth: 3.4 }, 16)) + earG,
    DM.html + DL.html + DR.html +
    C("b-dml", 960, 528, 120, 46, "θ") + C("b-dll", 520, 528, 220, 46, "θ − π/2") + C("b-drl", 1400, 528, 220, 46, "θ + π/2") +
    [0, 1, 2, 3, 4, 5].map((i) => coin(`b-lc${i}`, 400 + i * 48, 600, 20, "0", false, 40) + coin(`b-rk${i}`, 1280 + i * 48, 600, 20, "1", true, 40)).join("") +
    C("b-l0p", 520, 672, 110, 50, "0%") + C("b-r1p", 1400, 672, 130, 50, "100%") +
    C("b-cmpl", 960, 692, 220, 50, "slope") +
    C("b-cnt", 1010, 800, 300, 52, `runs: <span id="b-cntv">0</span>`, `color:${GOLD}`));

  // ===================== Scene H: not automatically better (line 14) =====================
  const PIV = { x: 960, y: 360, L: 400 };
  const pan = (cx) => (
    r.line(cx, PIV.y, cx - 140, 520, pen({ strokeWidth: 2.2, roughness: 0.6 })) + r.line(cx, PIV.y, cx + 140, 520, pen({ strokeWidth: 2.2, roughness: 0.6 })) +
    r.line(cx - 140, 520, cx + 140, 520, pen({ strokeWidth: 3 })) + r.curve([[cx - 140, 520], [cx - 90, 554], [cx + 90, 554], [cx + 140, 520]], pen({ strokeWidth: 3 })));
  const CP = circuit("b-pc", 427, 488, 0.4, 40, { ket: false, ry: "RY" });
  const panL = `<div class="obj" id="b-panL" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${G("b-panLs", pan(560))}${CP.svg}</svg>${CP.html}${C("b-qlab", 560, 596, 220, 48, "quantum")}</div>`;
  const panR = `<div class="obj" id="b-panR" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${G("b-panRs", pan(1360))}${laptop("b-lapR", 1270, 371, 180, true)}</svg>${C("b-olab", 1360, 596, 220, 48, "ordinary")}</div>`;
  const sH = wrap("b-sH",
    full("b-scale",
      G("b-post", r.line(960, 372, 960, 742, pen({ strokeWidth: 4.4 })) + r.line(870, 752, 1050, 752, pen({ strokeWidth: 4 })) + r.line(900, 752, 960, 712, pen({ strokeWidth: 2.6 })) + r.line(1020, 752, 960, 712, pen({ strokeWidth: 2.6 }))) +
      `<g id="b-beamT">${G("b-beam", r.line(560, 360, 1360, 360, pen({ strokeWidth: 5, roughness: 0.8 })) + r.circle(560, 360, 14, pen({ strokeWidth: 2.4 })) + r.circle(1360, 360, 14, pen({ strokeWidth: 2.4 })))}</g>` +
      `<circle id="b-piv" cx="960" cy="360" r="11" fill="${GOLD}"/>`,
      C("b-nab", 960, 170, 700, 60, "not automatically better") +
      C("b-tie", 960, 806, 200, 52, "tie") + C("b-worse", 960, 806, 240, 52, "or worse")) +
    panL + panR);

  // ===================== Scene I: how it works, where it might help (line 15) =====================
  const sI = full("b-sI",
    G("b-mag", r.circle(760, 450, 270, pen({ strokeWidth: 4 })) + r.circle(760, 450, 244, pen({ strokeWidth: 1.6, roughness: 1.6 })) +
      r.line(856, 546, 950, 640, pen({ strokeWidth: 9, roughness: 0.6 }))) +
    G("b-sign", r.line(1450, 400, 1450, 752, pen({ strokeWidth: 4.4 })) + r.line(1380, 756, 1520, 756, pen({ strokeWidth: 3 })) +
      r.poly([[1290, 300], [1580, 300], [1632, 350], [1580, 400], [1290, 400]], pen({ strokeWidth: 3.4 }))),
    C("b-howl", 760, 714, 300, 50, "how it works") +
    C("b-q", 1440, 352, 100, 84, "?", `color:${GOLD}`) +
    C("b-wherel", 1450, 806, 400, 48, "where it might help"));

  // ===================== Closing card (line 16) =====================
  const CC = circuit("b-k", 280, 230, 1.1, 56);
  const VA = { x0: 290, y0: 690, x1: 770, top: 420, cx0: 300, cw: 460, ch: 240 };
  const vx = (th) => VA.cx0 + (VA.cw * th) / CH.thMax, vy = (th) => VA.y0 - (VA.ch * COST(th)) / CMAX;
  const vcurve = wobbly(Array.from({ length: 81 }, (_, i) => [vx((CH.thMax * i) / 80), vy((CH.thMax * i) / 80)]), 1, 31);
  const sK = full("b-sK",
    CC.svg + laptop("b-lapK", 1450, 160, 220) +
    G("b-kar1", arrow(1032, 232, 1404, 236, { strokeWidth: 3 }, 16)) +
    G("b-kar2", curveArrow([[1530, 150], [1320, 96], [1000, 84], [730, 100], [612, 146]], { strokeWidth: 3 }, 16)) +
    G("b-vax", r.line(VA.x0, VA.y0 + 10, VA.x0, VA.top, pen()) + r.line(VA.x0, VA.top, VA.x0 - 9, VA.top + 15, pen({ strokeWidth: 2.4 })) + r.line(VA.x0, VA.top, VA.x0 + 9, VA.top + 15, pen({ strokeWidth: 2.4 })) +
      r.line(VA.x0 - 10, VA.y0, VA.x1, VA.y0, pen()) + r.line(VA.x1, VA.y0, VA.x1 - 15, VA.y0 - 9, pen({ strokeWidth: 2.4 })) + r.line(VA.x1, VA.y0, VA.x1 - 15, VA.y0 + 9, pen({ strokeWidth: 2.4 }))) +
    G("b-vcurve", `<path class="ink" pathLength="1" d="${vcurve.d}" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`) +
    G("b-vul", r.curve([[312, 446], [350, 442], [392, 446]], goldPen({ strokeWidth: 4, roughness: 0.8 }))) +
    `<circle id="b-vball" cx="0" cy="0" r="15" fill="${GOLD}" stroke="${GROUND}" stroke-width="4"/>`,
    CC.html + C("b-kopt", 1560, 372, 240, 46, "optimizer") +
    LL("b-vcost", 310, 418, 120, 46, "cost") + C("b-vth", 796, 656, 60, 52, "θ") +
    C("b-kr1", 1270, 506, 760, 96, "new θ = old θ") + C("b-kr2", 1270, 626, 760, 96, "− step × slope"));

  const html = sA + sB + pegObj + sCirc + sDial + sChart + sRule + sLoop + sNet + sE + sF + sG + sH + sI + sK;

  const script = `
    const T = ${JSON.stringify(T)};
    const TH = ${JSON.stringify(TH)};
    const STEPS = ${JSON.stringify(STEPS)};
    const CH = ${JSON.stringify(CH)};
    const VA = ${JSON.stringify(VA)};
    const LP = ${JSON.stringify(LP)};
    const BAR = ${JSON.stringify(BAR)};
    const EB = ${JSON.stringify(EB)};
    const CMAX = ${CMAX};
    const R10 = ${R10}, R100 = ${R100}, R1000 = ${R1000};
    const GOLD = "${GOLD}", INK = "${INK}";
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const f1 = (n) => (+n).toFixed(1);
    const P1 = (th) => Math.pow(Math.sin((Math.PI * th) / 2), 2);
    const COST = (th) => Math.pow(P1(th) - 0.25, 2);

    // The kit's draw() with autoRound off: GSAP rounds px values by default, so the kit's
    // strokeDashoffset 1 -> 0 (on pathLength 1) snaps from hidden to whole at mid-tween.
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
    const pop = (sel, start, dur = 0.35) => tl.fromTo(all(sel), { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: dur, ease: "back.out(2)" }, start);

    function setDial(p, cx, cy, th) {
      $(p + "-ptr").setAttribute("transform", "rotate(" + (180 + 180 * th).toFixed(2) + " " + cx + " " + cy + ")");
      const a = $(p + "-arc");
      a.style.strokeDasharray = "1 2";
      a.style.strokeDashoffset = String(1 - clamp(th));
      a.style.opacity = th > 0.004 ? "1" : "0";
    }
    function setV(id, x, w, yb, h) {
      $(id + "-cr").setAttribute("y", f1(yb - h)); $(id + "-cr").setAttribute("height", h < 0.5 ? "0" : f1(h + 2));
      $(id + "-o").setAttribute("d", h < 1.5 ? "" : "M" + x + " " + yb + " L" + (x + 1) + " " + f1(yb - h) + " L" + (x + w - 1) + " " + f1(yb - h + 1) + " L" + (x + w) + " " + yb);
    }
    function setH(id, x, y, h, wMax, frac) {
      const w = wMax * clamp(frac);
      $(id + "-cr").setAttribute("width", f1(w));
      $(id + "-o").setAttribute("d", w < 2 ? "" : "M" + f1(x + w) + " " + (y + 1) + " L" + f1(x + w - 1) + " " + (y + h - 1));
    }
    // A plucked string: a decaying standing wave between its ends.
    function stringD(x0, x1, y, amp) {
      let d = "M" + x0 + " " + y;
      for (let i = 1; i <= 40; i++) { const u = i / 40; d += " L" + f1(x0 + (x1 - x0) * u) + " " + f1(y + amp * Math.sin(Math.PI * u)); }
      return d;
    }
    const pluckAmp = (t, t0, a) => (t < t0 || t > t0 + 1.1 ? 0 : a * Math.exp(-(t - t0) * 2.6) * Math.sin(2 * Math.PI * 7 * (t - t0)));

    // θ on the scene A knob (lines 0 and 1).
    const th1 = (t) => sched([[T.hand, T.hand + 1.0, 0, 0.5], [T.quarter, T.quarter + 0.8, 0.5, 1 / 3], [T.this1, T.this1 + 0.6, 1 / 3, 0], [T.turn + 0.1, T.turn + 1.0, 0, 0.25]], t, 0);
    // θ through the training (lines 4 to 8).
    const th2 = (t) => sched([[T.pi4, T.pi4 + 0.7, 0, 0.5]].concat(STEPS.map((s, i) => [s[0], s[1], TH[i], TH[i + 1]])), t, 0);
    // The small knob on the RY box: wiggles in line 3, then follows θ.
    function knobTh(t) {
      if (t >= T.start) return th2(t);
      const w = t > T.free && t < T.free + 1.3 ? 0.11 * Math.sin(2 * Math.PI * (t - T.free) / 0.65) * (1 - (t - T.free) / 1.3) : 0;
      return sched([[T.start - 0.45, T.start - 0.05, 0.5, 0]], t, 0.5) + w;
    }
    // Balance beam angle (degrees, positive tips the ordinary side down).
    function beamA(t) {
      const t0 = T.q14 + 1.0, t1 = T.matches + 0.4;
      if (t < t0) return 0;
      if (t < t1) return 5 * Math.sin((2 * Math.PI * (t - t0)) / 1.7) * (1 - ease.inOut((t - t0) / (t1 - t0)));
      return sched([[T.worse, T.worse + 0.8, 0, 8]], t, 0);
    }
    // Closing ball on the small valley: rolls down, then settles with a small damped wobble.
    function thV(t) {
      const t1 = T.down16 + 1.2;
      const v = sched([[T.down16 + 0.2, t1, 0.56, 1 / 3]], t, 0.56);
      return t <= t1 ? v : v + 0.022 * Math.exp(-(t - t1) * 0.9) * Math.sin((2 * Math.PI * (t - t1)) / 0.9);
    }

    onFrame((t) => {
      // ===== Scene A knob =====
      const a1 = th1(t);
      setDial("b-d1", 960, 560, a1);
      $("b-roAp").textContent = Math.round(P1(a1) * 100) + "%";

      // ===== Guitar strings and tuner needles =====
      const amp = pluckAmp(t, T.pluck, 18) + pluckAmp(t, T.pluck2, 18);
      $("b-g-vib").setAttribute("d", stringD(${560 + GX}, ${1722 + GX}, 455, amp));
      const ta = sched([[T.here, T.here + 0.5, -45, -30], [T.pluck2 + 0.1, T.pluck2 + 0.7, -30, -8]], t, -45) + (t > T.here && t < T.here + 1 ? 4 * Math.exp(-(t - T.here - 0.5) * 4) * Math.sin(2 * Math.PI * 3 * (t - T.here - 0.5)) * (t > T.here + 0.5 ? 1 : 0) : 0);
      $("b-tun-nT").setAttribute("transform", "rotate(" + ta.toFixed(2) + " 940 300)");
      const amp2 = pluckAmp(t, T.hear10 - 0.15, 10);
      $("b-g2-vib").setAttribute("d", stringD(${f1(180 - 240 * 0.42 + 560 * 0.42)}, ${f1(180 - 240 * 0.42 + 1722 * 0.42)}, ${f1(500 - 490 * 0.42 + 455 * 0.42)}, amp2));
      const tb = t < T.moment ? -45 : -12;
      $("b-tun2-nT").setAttribute("transform", "rotate(" + tb + " ${TUN2.px} ${TUN2.py})");

      // ===== Circuit strip knob and the gold run dash =====
      $("b-c-kT").setAttribute("transform", "rotate(" + (180 + 180 * knobTh(t)).toFixed(2) + " ${CS.kx} ${CS.ky})");
      const du = (t - T.run7) / 0.5, wd = $("b-wdash");
      if (du > 0 && du < 1) { const x = 255 + 700 * du; wd.setAttribute("x1", f1(x)); wd.setAttribute("x2", f1(x + 60)); wd.setAttribute("opacity", "1"); }
      else wd.setAttribute("opacity", "0");

      // ===== Dial, bar and readouts =====
      const a2 = th2(t), p2 = P1(a2);
      setDial("b-d2", ${D2.cx}, ${D2.cy}, a2);
      $("b-rothv").textContent = a2.toFixed(2);
      $("b-ropv").textContent = Math.round(p2 * 100) + "%";
      const fill = sched([[T.half, T.half + 0.6, 0, 1]], t, 0);
      const bh = BAR.h * p2 * fill;
      setV("b-bar", BAR.x, BAR.w, BAR.yb, bh);
      const bl = $("b-barl");
      bl.style.top = f1(BAR.yb - bh - 64) + "px";
      bl.textContent = Math.round(p2 * fill * 100) + "%";
      const yTop = BAR.yb - bh, y25 = BAR.yb - BAR.h * 0.25, gp = $("b-gap");
      if (y25 - yTop > 40) gp.setAttribute("d", "M795 " + f1(yTop + 3) + " L795 " + f1(y25 - 3) + " M785 " + f1(yTop + 15) + " L795 " + f1(yTop + 3) + " L805 " + f1(yTop + 15) + " M785 " + f1(y25 - 15) + " L795 " + f1(y25 - 3) + " L805 " + f1(y25 - 15));
      else gp.setAttribute("d", "");
      gp.setAttribute("stroke", t >= T.far && t < T.l6 ? GOLD : INK);

      // ===== Chart: ball and tangent =====
      const bx = CH.x0 + (CH.w * a2) / CH.thMax, by = CH.y0 - (CH.h * COST(a2)) / CMAX;
      $("b-ball").setAttribute("cx", f1(bx)); $("b-ball").setAttribute("cy", f1(by));
      const dC = 2 * (p2 - 0.25) * (Math.PI / 2) * Math.sin(Math.PI * a2);
      const m = -((CH.h / CMAX) * dC) / (CH.w / CH.thMax), n = Math.hypot(1, m), hl = 100;
      const tn = $("b-tan");
      const clipAx = (x, y) => (y > CH.y0 && y !== by ? [bx + ((x - bx) * (CH.y0 - by)) / (y - by), CH.y0] : [x, y]);
      const e1 = clipAx(bx - hl / n, by - (hl * m) / n), e2 = clipAx(bx + hl / n, by + (hl * m) / n);
      tn.setAttribute("x1", f1(e1[0])); tn.setAttribute("y1", f1(e1[1]));
      tn.setAttribute("x2", f1(e2[0])); tn.setAttribute("y2", f1(e2[1]));

      // ===== Optimizer loop: a gold dot laps the loop every 1.6 s =====
      const ph = (-90 + (360 * (t - T.loop - 0.6)) / 1.6) * Math.PI / 180;
      $("b-ldot").setAttribute("cx", f1(LP.cx + LP.rx * Math.cos(ph))); $("b-ldot").setAttribute("cy", f1(LP.cy + LP.ry * Math.sin(ph)));

      // ===== Shots: the estimate settles as the runs grow =====
      const est = sched([[T.estimate + 0.1, R10, 0, 0.6], [R100, R100 + 0.45, 0.6, 0.47], [R1000, R1000 + 0.45, 0.47, 0.5]], t, 0);
      setH("b-eb", EB.x, EB.y, EB.h, EB.w, est);
      const sp = t < R100 ? 0.155 : t < R1000 ? 0.05 : 0.016;
      const ex = EB.x + EB.w * est, ew = EB.w * sp, ey = EB.y + EB.h / 2;
      $("b-whisk").setAttribute("d", t < R10 ? "" : "M" + f1(ex - ew) + " " + ey + " L" + f1(ex + ew) + " " + ey + " M" + f1(ex - ew) + " " + (ey - 12) + " L" + f1(ex - ew) + " " + (ey + 12) + " M" + f1(ex + ew) + " " + (ey - 12) + " L" + f1(ex + ew) + " " + (ey + 12));
      $("b-estn").textContent = t < R100 ? "10" : t < R1000 ? "100" : "1000";
      $("b-estp").textContent = String(Math.round(est * 100));

      // ===== Parameter shift: fixed dials, and the run counter =====
      setDial("b-dm", 960, 400, 0.5); setDial("b-dl", 520, 400, 0); setDial("b-dr", 1400, 400, 1);
      $("b-cntv").textContent = String(Math.round(sched([[T.listen + 0.1, T.listen + 1.0, 0, 3000]], t, 0)));

      // ===== Balance scale =====
      const ba = beamA(t), rad = (ba * Math.PI) / 180;
      $("b-beamT").setAttribute("transform", "rotate(" + ba.toFixed(3) + " 960 360)");
      const dx = 400 * (1 - Math.cos(rad)), dy = 400 * Math.sin(rad);
      $("b-panL").style.transform = "translate(" + f1(dx) + "px," + f1(-dy) + "px)";
      $("b-panR").style.transform = "translate(" + f1(-dx) + "px," + f1(dy) + "px)";

      // ===== Closing: ball on the valley, knob twitching every 1.2 s =====
      const av = thV(t);
      $("b-vball").setAttribute("cx", f1(VA.cx0 + (VA.cw * av) / CH.thMax)); $("b-vball").setAttribute("cy", f1(VA.y0 - (VA.ch * COST(av)) / CMAX));
      const u = t > T.knobs + 0.6 ? ((t - T.knobs - 0.6) % 1.2) / 1.2 : 1;
      const tw = u < 0.3 ? 16 * Math.sin((Math.PI * u) / 0.3) : 0;
      $("b-k-kT").setAttribute("transform", "rotate(" + (240 + tw).toFixed(2) + " ${CC.kx} ${CC.ky})");
    });

    // ===================== Line 0: the knob turned by hand =====================
    hide(["#b-d1-arcG", "#b-roA", "#b-in4"]);
    drawP("#b-d1-body", T.knob, 0.9);
    drawP("#b-d1-ticks", T.knob + 0.6, 0.5);
    drawP("#b-d1-ptr", T.knob + 0.8, 0.3);
    show("#b-d1-arcG", T.knob + 0.8);
    write(["#b-d1-l0", "#b-d1-l1", "#b-d1-l2"], T.knob + 0.8, 0.3);
    drawP("#b-hand", T.hand - 0.15, 0.9);
    blurOut("#b-title", T.qubit);
    write("#b-qnote", T.qubit + 0.1, 0.9);
    fade("#b-roA", 1, T.read - 0.1, 0.3);
    write("#b-in4", T.quarter + 0.4, 0.4);

    // ===================== Line 1: a computer turns it =====================
    blurOut(["#b-qnote", "#b-hand", "#b-in4"], T.this1 - 0.1);
    drawP("#b-lapA", T.computer - 0.1, 0.7);
    write("#b-comp", T.computer + 0.2, 0.5);
    drawP("#b-lapAr", T.turn - 0.2, 0.5);
    blurOut("#b-sA", T.its2);

    // ===================== Line 2: tuning a guitar by ear =====================
    hide(["#b-pegG", "#b-closer"]);
    drawP("#b-g-head", T.guitar - 0.1, 0.6);
    drawP("#b-pegI", T.guitar + 0.3, 0.2);
    drawP("#b-g-neck", T.guitar + 0.45, 0.45);
    drawP("#b-g-body", T.guitar + 0.85, 0.5);
    drawP("#b-g-str", T.guitar + 1.2, 0.4);
    write("#b-tbe", T.guitar, 0.8);
    drawP("#b-ear", T.ear - 0.1, 0.5);
    [0, 1, 2].forEach((i) => drawP("#b-snd" + i, T.pluck + 0.1 + i * 0.12, 0.2));
    fade(["#b-snd0", "#b-snd1", "#b-snd2"], 0.25, T.pluck + 0.9, 0.3);
    drawP("#b-tun-b", T.here - 0.15, 0.45);
    drawP("#b-tun-ndl", T.here - 0.05, 0.1);
    write(["#b-tin", "#b-tfl", "#b-tsh"], T.here + 0.1, 0.25);
    write("#b-low", T.here + 0.35, 0.4);
    fade("#b-pegG", 1, T.nudge2 - 0.05, 0.2);
    tl.fromTo("#b-pegK", { rotation: 0 }, { rotation: 40, svgOrigin: "${PEG.x} ${PEG.y}", duration: 0.6, ease: "power2.inOut" }, T.nudge2);
    drawP("#b-pegAr", T.nudge2, 0.4);
    tl.to("#b-low", { color: INK, duration: 0.3 }, T.nudge2);
    fade(["#b-snd0", "#b-snd1", "#b-snd2"], 1, T.pluck2 + 0.05, 0.15);
    fade("#b-low", 0, T.pluck2 + 0.3, 0.2);
    write("#b-closer", T.pluck2 + 0.45, 0.4);
    show("#b-closer", T.pluck2 + 0.45);

    // ===================== Line 3: the circuit's pegs are its angles =====================
    hide(["#b-c-boxG", "#b-c-knobG", "#b-rotl2"]);
    blurOut("#b-sB", T.our);
    blurOut("#b-pegAr", T.our);
    tl.fromTo("#b-pegM", { x: 0, y: 0, scale: 1 }, { x: ${CS.kx - PEG.x}, y: ${CS.ky - PEG.y}, scale: 0.8, svgOrigin: "${PEG.x} ${PEG.y}", duration: 0.9, ease: "power2.inOut" }, T.our);
    drawP("#b-c-w", T.our + 0.1, 0.6);
    write("#b-c-k0", T.our + 0.1, 0.3);
    drawP("#b-c-box", T.our + 0.35, 0.5);
    write("#b-c-ry", T.our + 0.6, 0.4);
    drawP("#b-c-knob", T.our + 0.8, 0.25);
    fade("#b-pegObj", 0, T.our + 0.95, 0.3);
    drawP("#b-c-m", T.our + 0.6, 0.5);
    drawP("#b-c-ndl", T.our + 0.95, 0.15);
    write("#b-ptoP", T.our + 0.9, 0.5);
    fade("#b-c-boxG", 1, T.rotation - 0.05, 0.25);
    write("#b-rotl", T.rotation + 0.1, 0.7);
    fade("#b-c-boxG", 0, T.theta3 - 0.05, 0.25);
    tl.to("#b-c-th", { color: GOLD, duration: 0.3 }, T.theta3 - 0.05);
    fade("#b-rotl", 0, T.theta3 - 0.05, 0.2);
    rewrite("#b-rotl2", T.theta3 + 0.15, 0.8);
    write("#b-train", T.trainable - 0.1, 0.7);
    drawP("#b-trU", T.trainable + 0.5, 0.35);

    // ===================== Line 4: start at π/2, we want a quarter =====================
    blurOut("#b-rotl2", T.l4);
    tl.to("#b-train", { color: INK, duration: 0.3 }, T.l4);
    fade("#b-trU", 0, T.l4, 0.3);
    blurOut("#b-train", T.plotted - 0.3);
    tl.to("#b-c-th", { color: INK, duration: 0.3 }, T.l4);
    hide(["#b-d2-arcG", "#b-roth3", "#b-gap", "#b-bar", "#b-barl", "#b-strk", "#b-old50"]);
    drawP("#b-d2-body", T.start - 0.1, 0.8);
    drawP("#b-d2-ticks", T.start + 0.4, 0.4);
    drawP("#b-d2-ptr", T.start + 0.5, 0.25);
    show("#b-d2-arcG", T.start + 0.5);
    write(["#b-d2-l0", "#b-d2-l1", "#b-d2-l2"], T.start + 0.5, 0.3);
    write("#b-roth", T.theta4, 0.6);
    pop("#b-coin1", T.comes - 0.1);
    drawP("#b-bart", T.half - 0.25, 0.35);
    show(["#b-bar", "#b-barl"], T.half);
    write("#b-rop", T.half + 0.1, 0.6);
    drawP("#b-tgt", T.want - 0.1, 0.4);
    write("#b-tgtl", T.want + 0.1, 0.5);
    fade("#b-gap", 1, T.want + 0.3, 0.3);

    // ===================== Line 5: the cost, a valley =====================
    fade("#b-coin1", 0, T.l5, 0.3);
    write("#b-howfar", T.far, 0.6);
    write("#b-eqcost", T.cost5 - 0.1, 0.4);
    drawP("#b-axes", T.plotted - 0.1, 0.8);
    write("#b-cyl", T.plotted + 0.3, 0.3);
    write("#b-cxl", T.theta5 - 0.05, 0.2);
    write(["#b-cx0", "#b-cx1", "#b-cx2"], T.plotted + 0.5, 0.3);
    drawP("#b-curve", T.valley - 0.1, 1.1);
    hide(["#b-ball", "#b-dot0", "#b-dot1", "#b-dot2", "#b-dot3", "#b-dot4", "#b-tan", "#b-tan0"]);
    fade("#b-ball", 1, T.valley + 0.8, 0.25);
    fade("#b-dot0", 1, T.valley + 1.0, 0.2);
    drawP("#b-zarr", T.zero5 - 0.1, 0.35);
    write("#b-zcost", T.bottom - 0.05, 0.5);

    // ===================== Line 6: slope, gradient, downhill, nudge =====================
    fade(["#b-howfar", "#b-eqcost", "#b-zcost", "#b-zarr"], 0, T.l6, 0.3);
    fade("#b-tan", 1, T.slope6, 0.3);
    write("#b-slope", T.slope6 + 0.1, 0.35);
    write("#b-grad", T.gradient, 0.6);
    drawP("#b-dharr", T.downhill - 0.1, 0.5);
    write("#b-dhl", T.downhill + 0.1, 0.5);
    fade(["#b-dharr", "#b-dhl"], 0, T.nudge6 + 0.3, 0.4);
    fade(["#b-slope", "#b-grad"], 0, STEPS[1][0] - 0.2, 0.3);
    STEPS.forEach((s, i) => fade("#b-dot" + (i + 1), 1, s[1] - 0.05, 0.2));

    // ===================== Line 7: run, measure, nudge, again =====================
    tl.fromTo("#b-c-ndl", { rotation: 0 }, { rotation: -55, svgOrigin: "${CS.X(595)} ${CS.Y(32)}", duration: 0.15, yoyo: true, repeat: 3, ease: "sine.inOut" }, T.measure - 0.1);
    fade("#b-old50", 1, T.from7 - 0.05, 0.25);
    drawP("#b-strk", T.from7 + 0.3, 0.25);
    fade("#b-roth", 0, T.to7, 0.15);
    rewrite("#b-roth3", T.to7 + 0.05, 0.4);
    drawP("#b-tick", T.to7 + 0.2, 0.35);

    // ===================== Line 8: the rule =====================
    blurOut(["#b-sD", "#b-sC"], T.each8);
    tl.fromTo("#b-chartW", { x: 0, y: 0 }, { x: -440, y: -220, duration: 0.9, ease: "power2.inOut" }, T.each8 + 0.05);
    write("#b-r0", T.new8 - 0.05, 0.45);
    write("#b-r1", T.old8 - 0.05, 0.5);
    write("#b-r2", T.minus - 0.05, 0.5);
    write("#b-r3", T.times - 0.05, 0.5);
    drawP("#b-tan0", T.slope8 - 0.1, 0.3);
    drawP("#b-rarr", T.slope8, 0.35);

    // ===================== Line 9: the optimizer loop, like training AI =====================
    blurOut(["#b-chartW", "#b-sR"], T.l9);
    drawP("#b-lapL", T.ordinary - 0.1, 0.8);
    write("#b-optl", T.optimizer - 0.05, 0.6);
    hide("#b-ldot");
    [0, 1, 2].forEach((i) => {
      drawP("#b-lb" + i + "b", T.loop - 0.15 + i * 0.22, 0.3);
      write("#b-lb" + i, T.loop + i * 0.22, 0.35);
      drawP("#b-la" + i, T.loop + 0.1 + i * 0.22, 0.35);
    });
    fade("#b-ldot", 1, T.loop + 0.6, 0.2);
    drawP("#b-net", T.ai - 0.1, 0.7);
    write("#b-netl", T.ai + 0.3, 0.5);
    write("#b-approx", T.ai + 0.1, 0.3);

    // ===================== Line 10: where the guitar picture breaks =====================
    blurOut(["#b-loopW", "#b-netW"], T.l10);
    drawP(["#b-g2-head", "#b-g2-neck", "#b-g2-body", "#b-g2-str"], T.guitar10 - 0.1, 1.0);
    drawP("#b-ear2", T.guitar10 + 0.4, 0.4);
    drawP(["#b-tun2-b", "#b-tun2-ndl"], T.guitar10 + 0.6, 0.5);
    drawP("#b-crack", T.breaks - 0.1, 0.5);
    drawP("#b-snd9", T.hear10, 0.35);
    write("#b-inst", T.moment + 0.05, 0.4);

    // ===================== Line 11: one run gives 0 or 1; shots =====================
    drawP(["#b-f-w", "#b-f-box", "#b-f-m", "#b-f-ndl", "#b-f-knob"], T.run11 - 0.1, 0.6);
    hide(["#b-f-boxG", "#b-f-knobG"]);
    write(["#b-f-k0", "#b-f-ry"], T.run11 + 0.2, 0.3);
    tl.fromTo("#b-c0", { x: -113, y: -110, scale: 0.2, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)" }, T.zero11 - 0.05);
    tl.fromTo("#b-c1", { x: -213, y: -110, scale: 0.2, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)" }, T.one11 - 0.05);
    ${JSON.stringify(ROW.map((_, i) => i))}.forEach((i) => pop("#b-rc" + i, T.estimate - 0.1 + i * 0.07, 0.25));
    drawP(["#b-ebt", "#b-eb50"], T.estimate, 0.4);
    hide(["#b-eb", "#b-est"]);
    show("#b-eb", T.estimate + 0.1);
    fade("#b-est", 1, T.estimate + 0.4, 0.25);
    write("#b-shots", T.shots - 0.05, 0.6);

    // ===================== Line 12: the slope is measured too =====================
    blurOut(["#b-sE", "#b-f-w", "#b-f-box", "#b-f-m", "#b-f-ndl", "#b-f-knob", "#b-f-k0", "#b-f-ry", "#b-c0", "#b-c1", "#b-eb", "#b-ebt", "#b-eb50", "#b-whisk", "#b-est"], T.even - 0.1);
    ${JSON.stringify(ROW.map((_, i) => i))}.forEach((i) => blurOut("#b-rc" + i, T.even - 0.1));
    tl.fromTo("#b-shots", { x: 0, y: 0, scale: 1 }, { x: -1040, y: -622, scale: 0.8, duration: 0.9, ease: "power2.inOut" }, T.even);
    hide(["#b-dm-arcG", "#b-dl-arcG", "#b-dr-arcG"]);
    drawP(["#b-dm-body", "#b-dm-ticks"], T.slope12 - 0.1, 0.8);
    drawP("#b-dm-ptr", T.slope12 + 0.5, 0.25);
    show("#b-dm-arcG", T.slope12 + 0.6);
    write(["#b-dm-l0", "#b-dm-l1", "#b-dm-l2"], T.slope12 + 0.6, 0.3);
    write("#b-dml", T.slope12 + 0.8, 0.25);
    drawP(["#b-dl-body", "#b-dl-ticks"], T.theta12 - 0.1, 0.6);
    drawP("#b-dl-ptr", T.theta12 + 0.4, 0.2);
    write(["#b-dl-l0", "#b-dl-l1", "#b-dl-l2"], T.theta12 + 0.4, 0.25);
    write("#b-dll", T.theta12 + 0.3, 0.5);
    drawP(["#b-dr-body", "#b-dr-ticks"], T.theta12 + 0.3, 0.6);
    drawP("#b-dr-ptr", T.theta12 + 0.8, 0.2);
    show("#b-dr-arcG", T.theta12 + 0.85);
    write(["#b-dr-l0", "#b-dr-l1", "#b-dr-l2"], T.theta12 + 0.8, 0.25);
    write("#b-drl", T.theta12 + 0.7, 0.5);
    [0, 1, 2].forEach((i) => { pop("#b-lc" + i, T.theta12 + 0.9 + i * 0.1, 0.25); pop("#b-rk" + i, T.theta12 + 1.1 + i * 0.1, 0.25); });
    write("#b-l0p", T.theta12 + 1.3, 0.25);
    write("#b-r1p", T.theta12 + 1.5, 0.35);
    drawP(["#b-ga0", "#b-ga1"], T.each12 - 0.2, 0.4);
    drawP("#b-cmp", T.each12 - 0.1, 0.4);
    write("#b-cmpl", T.each12 + 0.25, 0.4);

    // ===================== Line 13: every listen costs many runs =====================
    drawP("#b-ear3", T.listen - 0.1, 0.4);
    hide("#b-cnt");
    fade("#b-cnt", 1, T.listen, 0.2);
    [3, 4, 5].forEach((i, k) => { pop("#b-lc" + i, T.listen - 0.25 + k * 0.12, 0.25); pop("#b-rk" + i, T.listen - 0.15 + k * 0.12, 0.25); });

    // ===================== Line 14: not automatically better =====================
    blurOut(["#b-sG", "#b-shots"], T.q14 - 0.15);
    drawP("#b-post", T.q14, 0.5);
    drawP("#b-beam", T.q14 + 0.3, 0.5);
    hide("#b-piv");
    fade("#b-piv", 1, T.q14 + 0.5, 0.2);
    drawP(["#b-panLs", "#b-panRs"], T.q14 + 0.6, 0.5);
    drawP(["#b-pc-w", "#b-pc-box", "#b-pc-m", "#b-pc-ndl", "#b-pc-knob"], T.q14 + 0.8, 0.5);
    hide(["#b-pc-boxG", "#b-pc-knobG"]);
    write("#b-pc-ry", T.q14 + 1.0, 0.2);
    write("#b-qlab", T.q14 + 0.9, 0.4);
    drawP("#b-lapR", T.q14 + 1.0, 0.5);
    write("#b-olab", T.q14 + 1.2, 0.4);
    write("#b-nab", T.auto - 0.3, 1.0);
    hide("#b-worse");
    write("#b-tie", T.matches + 0.2, 0.3);
    fade("#b-tie", 0, T.worse - 0.6, 0.2);
    rewrite("#b-worse", T.worse - 0.45, 0.45);

    // ===================== Line 15: how it works, and where it might help =====================
    blurOut("#b-sH", T.point - 0.1);
    tl.set(["#b-optl", "#b-lb0", "#b-lb1", "#b-lb2", "#b-lb0b", "#b-lb1b", "#b-lb2b"], { opacity: 0 }, T.point);
    tl.set("#b-loopW", { filter: "blur(0px)", transformOrigin: "960px 470px" }, T.point);
    tl.fromTo("#b-loopW", { opacity: 0, scale: 0.45, x: -200 }, { opacity: 1, scale: 0.6, x: -200, duration: 0.5, ease: "power2.out", immediateRender: false }, T.point + 0.05);
    drawP("#b-mag", T.works - 0.2, 0.6);
    write("#b-howl", T.works + 0.1, 0.5);
    drawP("#b-sign", T.where - 0.1, 0.6);
    write("#b-q", T.where + 0.3, 0.2);
    write("#b-wherel", T.where + 0.2, 0.6);

    // ===================== Line 16: closing card, holds to the end =====================
    blurOut(["#b-loopW", "#b-sI"], T.so16 - 0.1);
    hide(["#b-k-boxG", "#b-k-knobG", "#b-vball"]);
    drawP("#b-k-w", T.train16 - 0.05, 0.5);
    write("#b-k-k0", T.train16, 0.3);
    drawP("#b-k-box", T.train16 + 0.15, 0.5);
    write("#b-k-ry", T.train16 + 0.4, 0.4);
    drawP("#b-k-m", T.train16 + 0.4, 0.4);
    drawP("#b-k-ndl", T.train16 + 0.7, 0.15);
    drawP("#b-k-knob", T.knobs - 0.2, 0.25);
    fade("#b-k-knobG", 1, T.knobs + 0.05, 0.25);
    drawP("#b-lapK", T.opt16 - 0.2, 0.6);
    write("#b-kopt", T.opt16 + 0.1, 0.5);
    drawP("#b-kar1", T.opt16 + 0.2, 0.3);
    drawP("#b-kar2", T.opt16 + 0.45, 0.6);
    drawP("#b-vax", T.down16 - 0.35, 0.4);
    drawP("#b-vcurve", T.down16 - 0.1, 0.5);
    write(["#b-vcost", "#b-vth"], T.down16, 0.25);
    fade("#b-vball", 1, T.down16 + 0.15, 0.2);
    write("#b-kr1", T.measured - 0.15, 0.6);
    write("#b-kr2", T.measured + 0.4, 0.6);
    drawP("#b-vul", T.cost16, 0.35);
  `;

  return { html, script };
}
