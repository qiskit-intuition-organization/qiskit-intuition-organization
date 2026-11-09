// Lesson 11, "Entanglement". Follows plan.md: two coins that always match, the two dancers
// sharing one routine, the CNOT circuit acting on each part of a superposition, the shots chart
// (only 00 and 11), each qubit alone a coin flip with no arrow, the shared loop, where the
// dancers mislead us (Bell tests), no faster-than-light messages (lists only match when
// compared), and the Bell state formula with the closing card.
export const phrases = [
  ["ket zero zero plus ket one one, over root two", "(|00⟩ + |11⟩)/√2"],
  ["Zero zero", "00"], ["zero zero", "00"],
  ["one zero", "10"], ["zero one", "01"], ["one one", "11"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, lines, INK, GOLD, DIM, mulberry32 } = k;
  const fx = (n) => +n.toFixed(3);
  // A word's start by its transcript spelling (for digits such as "00" or "50-50").
  const wd = (li, prefix, nth = 0) => fx(lines[li].words.filter((w) => w.w.startsWith(prefix))[nth].start);

  // ---------- drawing helpers ----------
  // A div whose svg uses board coordinates (viewBox at x,y), so sketches are written in board space.
  const obj = (id, x, y, w, h, svg, inner = "", extra = "") =>
    `<div id="${id}" class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">` +
    (svg ? `<svg class="sk" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}">${svg}</svg>` : "") + inner + `</div>`;
  const ctr = (size) => fx(size * 0.745); // label top offset that centres its text on a y
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
  const bez = (p0, p1, p2, n = 40) => Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n, a = (1 - u) ** 2, b = 2 * u * (1 - u), c = u * u;
    return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
  });
  const headAt = (pts, o, size = 16) => {
    const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1];
    const a = Math.atan2(y2 - y1, x2 - x1), w = (o.strokeWidth ?? 3) * 0.85;
    return [0.45, -0.45].map((da) => r.line(x2, y2, x2 - size * Math.cos(a + da), y2 - size * Math.sin(a + da), pen({ ...o, strokeWidth: w }))).join("");
  };
  const hatch = (x, y, w, h, color, seed, gap = 9) =>
    r.rect(x, y, w, h, { ...pen({ seed }), fill: color, fillStyle: "hachure", hachureGap: gap, fillWeight: 2, stroke: color, strokeWidth: 2, roughness: 1 });
  const chipBox = (x, y, w, h, seed, o = {}) => r.rect(x, y, w, h, pen({ strokeWidth: 2.6, roughness: 1, seed, ...o }));
  // Two digits centred in a chip (cx, cy); returns labels with ids pfx-a, pfx-b.
  const chipDigits = (pfx, cx, cy, size, a, b, extraB = "") =>
    lbl(`${pfx}-a`, cx - 58, cy - ctr(size), 56, size, a) + lbl(`${pfx}-b`, cx + 2, cy - ctr(size), 56, size, b, extraB);

  // ---------- coins (a qubit read out: a face 0 or 1 that flips) ----------
  const COINS = [];
  // steps: [start, dur, toFace, minHalfTurns]; half turns get the parity that lands on toFace.
  function coin(id, cx, cy, d, seed, steps, showAt, face0 = 0, size) {
    let face = face0;
    const flips = steps.map(([a, dur, to, minHalf]) => {
      const half = minHalf + (((face ^ to) !== minHalf % 2) ? 1 : 0);
      const f = [fx(a), fx(a + dur), face, half];
      face = to;
      return f;
    });
    COINS.push({ id, flips, showAt: fx(showAt), face0 });
    const fs = size ?? Math.round(d * 0.52), D = d + 10;
    const rim = `<g id="${id}-rim">${r.circle(D / 2, D / 2, d, pen({ strokeWidth: 3.4, seed }))}${r.circle(D / 2, D / 2, d - 22, pen({ strokeWidth: 1.6, stroke: DIM, roughness: 1.7, seed: seed + 1 }))}</g>`;
    const faces = [0, 1].map((f) => lbl(`${id}-f${f}`, 0, fx(D / 2 - ctr(fs)), D, fs, String(f), "opacity:0")).join("");
    return `<div id="${id}" class="obj" style="left:${fx(cx - D / 2)}px;top:${fx(cy - D / 2)}px;width:${D}px;height:${D}px">` +
      `<div id="${id}-spin" class="obj" style="left:0;top:0;width:${D}px;height:${D}px;transform-origin:50% 50%">` +
      `<svg class="sk" width="${D}" height="${D}" viewBox="0 0 ${D} ${D}">${rim}</svg>${faces}</div></div>`;
  }

  // ---------- dancers (stick figures whose limbs turn at shoulder and hip) ----------
  // Local drawing 300 x 420, feet at y 410; placed with its feet centre at (x, floorY), scaled s.
  const SH = { l: [128, 112], r: [172, 112] }, HP = { l: [141, 234], r: [159, 234] };
  const HAND = { l: [-4, 124], r: [4, 124] };
  function dancer(id, x, floorY, s, seed, bun) {
    const P = (o = {}) => pen({ strokeWidth: 3.6 / Math.max(0.7, s) * 0.9, ...o });
    const body =
      r.circle(150, 54, 68, P({ seed })) +
      (bun ? r.circle(150, 14, 22, P({ strokeWidth: 2.6, seed: seed + 1 })) : r.curve([[122, 40], [136, 22], [158, 20], [178, 36]], P({ strokeWidth: 2.4, seed: seed + 1 }))) +
      r.curve([[150, 88], [148, 150], [151, 200], [150, 236]], P({ seed: seed + 2 })) +
      r.line(128, 112, 172, 112, P({ strokeWidth: 3, seed: seed + 3 })) +
      r.line(140, 234, 160, 234, P({ strokeWidth: 3, seed: seed + 4 })) +
      (bun ? r.poly([[150, 214], [124, 270], [176, 270]], P({ strokeWidth: 2.4, seed: seed + 5 })) : "");
    const arm = (side, sd) => {
      const [sx, sy] = SH[side], m = side === "l" ? -1 : 1;
      return r.linear([[sx, sy], [sx + m * 8, sy + 62], [sx + m * 4, sy + 124]], P({ seed: sd })) + r.circle(sx + m * 4, sy + 126, 14, P({ strokeWidth: 2.4, seed: sd + 1 }));
    };
    const leg = (side, sd) => {
      const [hx, hy] = HP[side], m = side === "l" ? -1 : 1;
      return r.linear([[hx, hy], [hx + m * 8, hy + 86], [hx + m * 4, hy + 170], [hx + m * 26, hy + 174]], P({ seed: sd }));
    };
    const svg =
      `<g id="${id}-body">${body}</g>` +
      `<g id="${id}-laR"><g id="${id}-la">${arm("l", seed + 10)}</g></g>` +
      `<g id="${id}-raR"><g id="${id}-ra">${arm("r", seed + 12)}</g></g>` +
      `<g id="${id}-llR"><g id="${id}-ll">${leg("l", seed + 14)}</g></g>` +
      `<g id="${id}-rlR"><g id="${id}-rl">${leg("r", seed + 16)}</g></g>`;
    return `<div id="${id}" class="obj" style="left:${x - 150}px;top:${floorY - 410}px;width:300px;height:420px;transform:scale(${s});transform-origin:150px 410px">` +
      `<svg class="sk" width="300" height="420" viewBox="0 0 300 420">${svg}</svg></div>`;
  }
  const dParts = (id) => [`#${id}-body`, `#${id}-la`, `#${id}-ra`, `#${id}-ll`, `#${id}-rl`];
  // An irregular routine: keyframes of [lArm, rArm, lLeg, rLeg] in degrees (left limbs + = outward).
  function routine(t0, t1, seed, fixedL) {
    const rnd = mulberry32(seed);
    const keys = [[t0, fixedL ?? 12, -12, 4, -4]];
    let t = t0, side = 0;
    while (t < t1) {
      t += 0.42 + rnd() * 0.4;
      side ^= rnd() < 0.6 ? 1 : 0;
      const lift = () => 6 + rnd() * 26;
      keys.push([t, fixedL ?? (-10 + rnd() * 170), -(-10 + rnd() * 170), side ? lift() : 2 + rnd() * 5, side ? -(2 + rnd() * 5) : -lift()]);
    }
    const segs = [1, 2, 3, 4].map((c) => keys.slice(1).map((kk, i) => {
      const prev = keys[i], d = Math.min(0.26, 0.6 * (kk[0] - prev[0]));
      return [fx(kk[0] - d), fx(kk[0]), fx(prev[c]), fx(kk[c])];
    }));
    return { segs, steps: keys.slice(1).map((kk) => fx(kk[0])), init: keys[0].slice(1) };
  }

  // ---------- times ----------
  const T = {
    coins0: 0.4, two0: cue(0, "two", 0, -0.1), match0: cue(0, "match", 0, -0.1), fair0: cue(0, "fair", 0, -0.1),
    off0: cue(1, null, 0, -0.05), dancers1: cue(1, "dancers", 0, -0.15), routine1: cue(1, "routine", 0, -0.15),
    either1: cue(1, "either", 0, -0.1), made1: cue(1, "made", 0, -0.1),
    off1: cue(2, null, 0, -0.1), both2: cue(2, "both", 0, -0.1), step2: cue(2, "step", 0, -0.1), pair2: cue(2, "pair", 0, -0.15),
    off2: cue(3, null, 0, -0.05), qubits3: cue(3, "qubits", 0, -0.1), gate3: cue(3, "gate", 0, -0.1), if3: cue(3, "if", 0, -0.1), flips3: cue(3, "flips", 0, -0.1),
    zero4: cue(4, "zero", 0, -0.15), h4: cue(4, "use", 0, 0.12), fifty4: wd(4, "50") - 0.1,
    apply5: cue(5, "apply", 0, -0.05), part5: cue(5, "part", 0, -0.1), zz5: wd(5, "00", 0) - 0.1, stays5: cue(5, "stays"), zz5b: wd(5, "00", 1) - 0.1,
    oz5: wd(5, "10") - 0.1, becomes5: cue(5, "becomes", 0, -0.1), oo5: wd(5, "11") - 0.2,
    measure6: cue(5, "measure", 0, -0.1), half6: cue(6, "half", 0, -0.1), half6b: cue(6, "half", 1, -0.1),
    never7: cue(7, "never", 0, -0.05), never7b: cue(7, "never", 1, -0.05), always7: cue(7, "always", 0, -0.1),
    off7: cue(8, null, 0, -0.1), either8: cue(8, "either", 0, -0.15), coin8: cue(8, "coin", 0, -0.2), own8: cue(8, "own", 0, -0.2), arrow8: cue(8, "arrow", 0, -0.05),
    shrinks8: cue(8, "shrinks", 0, -0.05), nothing8: cue(8, "nothing", 0, -0.1),
    off8: cue(9, null, 0, -0.1), ent9: cue(9, "entanglement", 0, -0.2), pair9: cue(9, "pair", 0, -0.15), shared9: cue(9, "shared", 0, -0.1),
    info9: cue(9, "information", 0, -0.1), lives9: cue(9, "lives", 0, -0.1),
    off9: cue(10, null, 0, -0.1), dancers10: cue(10, "dancers", 0, -0.25), steps10: cue(10, "steps", 0, -0.1), written10: cue(10, "written", 0, -0.1),
    bell11: cue(11, "bell", 0, -0.15), cant11: cue(11, "can't", 0, -0.1),
    off11: cue(12, null, 0, -0.1), message12: cue(12, "message", 0, -0.15), faster12: cue(12, "faster", 0, -0.1), light12: cue(12, "light", 0, -0.05),
    each12: cue(12, "each", 0, 0), random12: cue(12, "random", 0, -0.1),
    match13: cue(13, "match", 0, -0.1), compared13: cue(13, "compared", 0, -0.05),
    off13: cue(14, "called", 0, -0.25), bell14: cue(14, "bell", 0, -0.15), ket14: cue(14, "ket", 0, -0.08), plus14: cue(14, "plus", 0, -0.08),
    ket14b: cue(14, "ket", 1, -0.08), root14: cue(14, "root", 0, -0.15),
    so15: cue(15, null, 0, -0.35), alone15: cue(15, "alone", 0, -0.15), together15: cue(15, "together", 0, -0.15), agree15: cue(15, "agree", 0, -0.6),
  };

  // ---------- 0. hook: two coins that always match ----------
  const C0 = { a: [700, 470], b: [1220, 470], d: 150 };
  const R0 = [0, 1, 1, 0]; // results 00, 11, 11, 00
  const flips0 = R0.map((v, i) => [T.two0 + 0.05 + i * 0.5, 0.42, v, 2]);
  const coins0 = coin("b-c0a", ...C0.a, C0.d, 40, flips0, T.coins0 + 1.0) + coin("b-c0b", ...C0.b, C0.d, 50, flips0, T.coins0 + 1.0);
  const hook0 =
    lbl("b-qa", 560, 552, 280, 48, "qubit A") + lbl("b-qb", 1080, 552, 280, 48, "qubit B") +
    obj("b-eq0", 900, 440, 120, 60, `<g id="b-eq">${r.line(915, 458, 1005, 456, goldPen({ strokeWidth: 4.4 }))}${r.line(915, 482, 1005, 480, goldPen({ strokeWidth: 4.4 }))}</g>`) +
    R0.map((v, i) => {
      const cx = 690 + i * 180;
      return obj(`b-ch0-${i}`, cx - 75, 640, 150, 84, `<g id="b-chb0-${i}">${chipBox(cx - 70, 644, 140, 76, 60 + i)}</g>`) +
        chipDigits(`b-chd0-${i}`, cx, 682, 52, String(v), String(v));
    }).join("") +
    lbl("b-always0", 660, 744, 600, 60, "always match", `color:${GOLD}`) +
    lbl("b-ff0a", 430, 440, 180, 52, "50/50", "text-align:right") + lbl("b-ff0b", 1310, 440, 180, 52, "50/50", "text-align:left");

  // ---------- 1 to 2. two dancers sharing one routine ----------
  const D1 = { l: 720, r: 1200, floor: 760 };
  const RT1 = routine(T.dancers1 + 1.6, T.off2 + 0.3, 7);
  const coneSvg = (id, xl, xr) =>
    `<g id="${id}">${r.poly([[945, 112], [975, 112], [xr, 768], [xl, 768]], { ...pen({ seed: id.length * 7 + xl }), stroke: "none", fill: "rgba(232,232,232,0.16)", fillStyle: "hachure", hachureGap: 16, fillWeight: 1.4 })}` +
    dashed([[945, 112], [xl, 768]], 16, 12, { strokeWidth: 2.2, stroke: DIM }) + dashed([[975, 112], [xr, 768]], 16, 12, { strokeWidth: 2.2, stroke: DIM }) + `</g>`;
  const sheet = (x, y, w, h, seed) =>
    r.rect(x, y, w, h, pen({ strokeWidth: 2.8, seed })) +
    [0.24, 0.46, 0.68].map((u, i) => r.curve(Array.from({ length: 7 }, (_, j) => [x + 16 + (j * (w - 32)) / 6, y + u * h + (j % 2 ? -5 : 5)]), pen({ strokeWidth: 2, seed: seed + 2 + i }))).join("") +
    [0.2, 0.42, 0.64, 0.84].map((u, i) => r.circle(x + u * w, y + (0.24 + 0.22 * (i % 3)) * h - 6, 11, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1, seed: seed + 6 + i }))).join("");
  const stage1 =
    obj("b-floor1", 340, 740, 1240, 50, `<g id="b-fl1">${r.line(360, 762, 1560, 760, pen({ strokeWidth: 3, seed: 80 }))}</g>`) +
    obj("b-lamp", 880, 60, 160, 60, `<g id="b-lampg">${r.rect(930, 78, 60, 34, pen({ strokeWidth: 2.8, seed: 82 }))}${r.line(960, 62, 960, 78, pen({ strokeWidth: 2.4, seed: 83 }))}</g>`) +
    obj("b-cone1", 520, 100, 500, 680, coneSvg("b-cn1", 560, 880)) +
    obj("b-cone2", 440, 100, 1040, 680, coneSvg("b-cn2", 480, 1440)) +
    dancer("b-d1", D1.l, D1.floor, 1, 100, false) + dancer("b-d2", D1.r, D1.floor, 1, 140, true) +
    `<svg id="b-ties" class="sk" width="1920" height="1080" viewBox="0 0 1920 1080" style="opacity:0">` +
    `<line id="b-tie1" x1="0" y1="0" x2="0" y2="0" stroke="${GOLD}" stroke-width="3.4" stroke-dasharray="12 10" stroke-linecap="round"/>` +
    `<line id="b-tie2" x1="0" y1="0" x2="0" y2="0" stroke="${GOLD}" stroke-width="3.4" stroke-dasharray="12 10" stroke-linecap="round"/></svg>` +
    obj("b-sheet1", 1460, 120, 240, 160, `<g id="b-sh1">${sheet(1470, 130, 220, 140, 90)}</g>`) +
    lbl("b-oner", 1400, 284, 360, 52, "one routine") +
    lbl("b-madeup", 170, 420, 380, 52, "looks made up", "text-align:left") +
    obj("b-loop1", 380, 280, 1160, 560, `<g id="b-lp1">${r.ellipse(960, 556, 1120, 500, goldPen({ strokeWidth: 4, seed: 96 }))}</g>`) +
    lbl("b-belongs", 170, 150, 640, 60, "belongs to the pair", `color:${GOLD};text-align:left`);
  const d1Hand = (rA) => { // board point of the left dancer's right hand (scene 1-2, scale 1)
    const a = (rA * Math.PI) / 180, [dx, dy] = HAND.r;
    return [D1.l - 150 + SH.r[0] + dx * Math.cos(a) - dy * Math.sin(a), D1.floor - 410 + SH.r[1] + dx * Math.sin(a) + dy * Math.cos(a)];
  };

  // ---------- 3 to 5. the CNOT circuit (container at 140,230) ----------
  const CO = { x: 140, y: 230 };
  const cl = (x, y) => [fx(x - CO.x), fx(y - CO.y)];
  const WY = { c: 420, t: 600 }, CNX = 1060, HX = 760;
  const plusT = (cx, cy, d, o) => r.circle(cx, cy, d, pen(o)) + r.line(cx - d / 2 + 4, cy, cx + d / 2 - 4, cy, pen(o)) + r.line(cx, cy - d / 2 + 4, cx, cy + d / 2 - 4, pen(o));
  const cnot = (o) => r.circle(CNX, WY.c, 30, pen({ fill: o.stroke ?? INK, fillStyle: "solid", strokeWidth: 2, ...o })) + r.line(CNX, WY.c, CNX, WY.t + 38, pen({ strokeWidth: 3.2, ...o })) + plusT(CNX, WY.t, 76, { strokeWidth: 3.2, ...o });
  const circSvg =
    `<g id="b-wc">${r.line(540, WY.c, 1500, WY.c, pen({ strokeWidth: 3, seed: 120 }))}</g>` +
    `<g id="b-wt">${r.line(540, WY.t, 1500, WY.t, pen({ strokeWidth: 3, seed: 121 }))}</g>` +
    `<g id="b-cx">${cnot({ seed: 122 })}</g>` +
    `<g id="b-cxg" style="opacity:0">${cnot({ stroke: GOLD, strokeWidth: 4.2, seed: 130 })}</g>` +
    `<g id="b-hb">${r.rect(HX - 46, WY.c - 46, 92, 92, pen({ strokeWidth: 3.2, seed: 140 }))}</g>`;
  const circInner =
    lbl("b-nc", ...cl(170, WY.c - ctr(56)), 250, 56, "control", "text-align:right") +
    lbl("b-nt", ...cl(170, WY.t - ctr(56)), 250, 56, "target", "text-align:right") +
    lbl("b-z0c", ...cl(440, WY.c - ctr(64)), 80, 64, "0") + lbl("b-z0t", ...cl(440, WY.t - ctr(64)), 80, 64, "0") +
    lbl("b-hl", ...cl(HX - 46, WY.c - ctr(60)), 92, 60, "H") +
    coin("b-cc", ...cl(915, 296), 96, 150, [[T.fifty4 + 0.6, T.measure6 - T.fifty4, 1, 26]], T.fifty4 + 0.5) +
    lbl("b-ff4", ...cl(978, 296 - ctr(56)), 200, 56, "50/50", `color:${GOLD};text-align:left`);
  const circHtml = obj("b-circ", CO.x, CO.y, 1640, 470, circSvg, circInner, "transform-origin:820px 0px");
  const ruleHtml =
    obj("b-rule", 1170, 700, 580, 150, `<g id="b-rb">${r.rect(1180, 710, 560, 130, pen({ strokeWidth: 2.8, seed: 150 }))}</g>`,
      `<div class="lbl hand" id="b-rt" style="left:10px;top:${fx(65 - ctr(50))}px;width:560px;font-size:50px">control 1 ${k.hand("→")} <span id="b-rflip">flip</span> target</div>`);
  // rows: each part of the superposition
  const ROW = [530, 690], IN = 695, OUT = 1135;
  const rowsHtml = ROW.map((y, i) =>
    obj(`b-row${i}`, 560, y - 60, 720, 120,
      `<g id="b-rib${i}">${chipBox(IN - 95, y - 45, 190, 90, 160 + i * 4)}</g>` +
      `<g id="b-rar${i}">${arrow(IN + 120, y, OUT - 120, y, { strokeWidth: 3, seed: 162 + i * 4 }, 18)}</g>` +
      `<g id="b-rob${i}">${chipBox(OUT - 95, y - 45, 190, 90, 164 + i * 4, i ? { stroke: GOLD, strokeWidth: 3.2 } : {})}</g>`)
  ).join("") +
    chipDigits("b-ri0", IN, ROW[0], 60, "0", "0") + chipDigits("b-ro0", OUT, ROW[0], 60, "0", "0") +
    chipDigits("b-ri1", IN, ROW[1], 60, "1", "0") +
    lbl("b-ro1-a", OUT - 58, ROW[1] - ctr(60), 56, 60, "1") +
    `<div id="b-ro1-b" class="obj" style="left:${OUT + 2}px;top:${fx(ROW[1] - ctr(60))}px;width:56px;height:90px;transform-origin:28px ${ctr(60)}px">` +
    lbl("b-ro1-b0", 0, 0, 56, 60, "0") + lbl("b-ro1-b1", 0, 0, 56, 60, "1", `color:${GOLD}`) + `</div>` +
    lbl("b-tc", IN - 58, ROW[0] - 106, 56, 42, "c", "color:rgba(232,232,232,0.6)") + lbl("b-tt", IN + 2, ROW[0] - 106, 56, 42, "t", "color:rgba(232,232,232,0.6)") +
    obj("b-parts", 560, 120, 420, 640,
      `<g id="b-pa0">${dashed(bez([906, 146], [890, 400], [IN + 80, ROW[0] - 52]), 14, 10, { stroke: GOLD, strokeWidth: 2.8 })}${headAt(bez([906, 146], [890, 400], [IN + 80, ROW[0] - 52]), { stroke: GOLD, strokeWidth: 2.8 })}</g>` +
      `<g id="b-pa1">${dashed(bez([936, 146], [905, 610], [IN + 60, ROW[1] - 52]), 14, 10, { stroke: GOLD, strokeWidth: 2.8 })}${headAt(bez([936, 146], [905, 610], [IN + 60, ROW[1] - 52]), { stroke: GOLD, strokeWidth: 2.8 })}</g>`);

  // ---------- 6 to 7. shots chart (container at 300,120) ----------
  const CH = { x: 300, y: 120, base: 760, H: 560, X: [555, 825, 1095, 1365], bw: 150 };
  const chl = (x, y) => [fx(x - CH.x), fx(y - CH.y)];
  const NSHOT = 200, rs = mulberry32(2024);
  const CUM00 = [0];
  for (let i = 0; i < NSHOT; i++) CUM00.push(CUM00[i] + (rs() < 0.5 ? 1 : 0));
  const half = CH.base - CH.H / 2;
  const chartSvg =
    `<g id="b-axes">${r.line(400, CH.base, 1520, CH.base, pen({ seed: 200 }))}${r.line(420, CH.base + 16, 420, 200, pen({ seed: 201 }))}${headAt([[420, 260], [420, 196]], { strokeWidth: 3 })}</g>` +
    `<g id="b-halfl">${dashed([[432, half], [1500, half]], 14, 12, { stroke: DIM, strokeWidth: 2.2 })}</g>` +
    CH.X.map((x, i) => `<line id="b-cap${i}" x1="${x - CH.bw / 2}" y1="${CH.base}" x2="${x + CH.bw / 2}" y2="${CH.base}" stroke="${GOLD}" stroke-width="4" stroke-linecap="round" style="opacity:0"/>`).join("") +
    [1, 2].map((i) => `<g id="b-x${i}">${r.line(CH.X[i] - 40, CH.base - 14, CH.X[i] + 40, CH.base - 84, pen({ strokeWidth: 3.6, seed: 210 + i }))}</g>`).join("");
  const chartInner =
    CH.X.map((x, i) => `<div id="b-bar${i}" class="obj" style="left:${fx(x - CH.bw / 2 - CH.x)}px;top:${fx(CH.base - CH.H - CH.y)}px;width:${CH.bw}px;height:${CH.H}px;clip-path:inset(100% 0 0 0)">` +
      `<svg class="sk" width="${CH.bw}" height="${CH.H}" viewBox="0 0 ${CH.bw} ${CH.H}">${hatch(4, 2, CH.bw - 8, CH.H - 4, GOLD, 220 + i, 10)}</svg></div>`).join("") +
    ["00", "01", "10", "11"].map((s, i) => lbl(`b-sl${i}`, ...chl(CH.X[i] - 80, CH.base + 6), 160, 56, s)).join("") +
    lbl("b-shots", ...chl(440, 150), 420, 52, `shots: <span id="b-shotn">0</span>`, "text-align:left") +
    lbl("b-half0", ...chl(CH.X[0] - 80, half - 84), 160, 52, "half") + lbl("b-half3", ...chl(CH.X[3] - 80, half - 84), 160, 52, "half") +
    [1, 2].map((i) => lbl(`b-zero${i}`, ...chl(CH.X[i] - 50, CH.base - 90), 100, 56, "0")).join("");
  const chartHtml = obj("b-chart", CH.x, CH.y, 1300, 760, chartSvg, chartInner, `transform-origin:${420 - CH.x}px ${CH.base - CH.y}px`) +
    obj("b-tick", 1010, 140, 90, 100, `<g id="b-tk">${r.linear([[1024, 196], [1046, 222], [1088, 154]], goldPen({ strokeWidth: 5 }))}</g>`) +
    lbl("b-agree7", 1100, 150, 460, 64, "always agree", `color:${GOLD};text-align:left`);

  // ---------- 8. each qubit alone ----------
  const TB = { base: 760, H: 400, X: [1060, 1190], bw: 96 };
  const coinA8 = coin("b-c8", 1125, 330, 120, 240,
    [[T.either8 + 0.3, 0.4, 1, 2], [T.either8 + 0.85, 0.4, 0, 2], [T.either8 + 1.4, 0.4, 0, 2], [T.either8 + 1.95, 0.4, 1, 2], [T.either8 + 2.5, 0.4, 0, 2]], T.either8 + 0.25, 0, 62);
  const ballC = [1530, 520];
  const tallyHtml =
    lbl("b-alone8", 885, 170, 480, 56, "A alone: 50/50") + coinA8 +
    obj("b-tally", 980, 340, 300, 440, `<g id="b-tax">${r.line(995, TB.base, 1260, TB.base, pen({ seed: 250 }))}</g>`,
      TB.X.map((x, i) => `<div id="b-tb${i}" class="obj" style="left:${x - TB.bw / 2 - 980}px;top:${TB.base - TB.H - 340}px;width:${TB.bw}px;height:${TB.H}px;clip-path:inset(100% 0 0 0)">` +
        `<svg class="sk" width="${TB.bw}" height="${TB.H}" viewBox="0 0 ${TB.bw} ${TB.H}">${hatch(4, 2, TB.bw - 8, TB.H - 4, INK, 252 + i, 10)}</svg></div>`).join("") +
      TB.X.map((x, i) => lbl(`b-tl${i}`, x - 60 - 980, TB.base + 6 - 340, 120, 56, String(i))).join("")) +
    obj("b-ball", 1380, 370, 300, 300,
      `<g id="b-bc">${r.circle(...ballC, 260, pen({ strokeWidth: 3.2, seed: 260 }))}${dashed(Array.from({ length: 41 }, (_, i) => [ballC[0] + 130 * Math.cos(Math.PI * i / 40), ballC[1] + 34 * Math.sin(Math.PI * i / 40)]), 12, 10, { stroke: DIM, strokeWidth: 2 })}</g>` +
      `<g id="b-barw"><g id="b-barg">${arrow(ballC[0], ballC[1], ballC[0], ballC[1] - 112, { stroke: GOLD, strokeWidth: 5, seed: 262 }, 22)}</g></g>` +
      `<circle id="b-bdot" cx="${ballC[0]}" cy="${ballC[1]}" r="9" fill="${GOLD}" style="opacity:0"/>`) +
    lbl("b-noarrow", 1300, 690, 460, 52, "no arrow of its own");

  // ---------- 9. entanglement: one shared state ----------
  const flips9 = [[T.pair9 + 0.1, 0.55, 1, 2], [T.shared9 + 0.5, 0.55, 0, 2], [T.lives9 + 0.15, 0.55, 1, 2]];
  const ent9 =
    lbl("b-ent", 560, 120, 800, 84, "entanglement", `color:${GOLD}`) +
    coin("b-c9a", 720, 520, 150, 300, flips9, T.pair9 - 0.1) + coin("b-c9b", 1200, 520, 150, 310, flips9, T.pair9 - 0.1) +
    obj("b-loop9", 470, 318, 980, 412, `<g id="b-lp9">${r.ellipse(960, 524, 940, 372, goldPen({ strokeWidth: 4, seed: 320 }))}</g>`) +
    lbl("b-shared", 660, 606, 600, 56, "one shared state") +
    obj("b-or9", 815, 470, 290, 100, `<g id="b-orb">${chipBox(822, 478, 276, 84, 330)}</g>`, lbl("b-ort", 0, fx(50 - ctr(52)), 290, 52, "00 or 11")) +
    lbl("b-lives", 460, 712, 1000, 56, "the information lives in the pair");

  // ---------- 10 to 11. the dancers mislead us ----------
  const D2 = { l: 760, r: 1160, floor: 700, s: 0.66 };
  const RT2 = routine(T.dancers10 + 1.0, T.off11 + 0.2, 31, 60);
  const sheetsSvg = (pfx) =>
    `<g id="${pfx}a">${sheet(560, 470, 108, 136, 400)}</g><g id="${pfx}b">${sheet(1252, 470, 108, 136, 410)}</g>`;
  const mislead =
    obj("b-floor2", 500, 680, 920, 40, `<g id="b-fl2">${r.line(520, 702, 1400, 700, pen({ strokeWidth: 3, seed: 420 }))}</g>`) +
    dancer("b-e1", D2.l, D2.floor, D2.s, 430, false) + dancer("b-e2", D2.r, D2.floor, D2.s, 470, true) +
    obj("b-sheets", 540, 450, 840, 180, sheetsSvg("b-ss")) +
    lbl("b-written", 560, 728, 800, 54, "steps written in advance") +
    lbl("b-bell", 560, 150, 420, 64, "Bell tests", "text-align:right") +
    obj("b-lab", 1000, 120, 360, 170,
      `<g id="b-labg">${r.rect(1010, 140, 330, 120, pen({ strokeWidth: 2.8, seed: 440 }))}` +
      `${r.arc(1060, 200, 56, 70, Math.PI / 2, Math.PI * 1.5, false, pen({ strokeWidth: 3, seed: 441 }))}${r.arc(1290, 200, 56, 70, -Math.PI / 2, Math.PI / 2, false, pen({ strokeWidth: 3, seed: 442 }))}` +
      `${r.circle(1175, 200, 18, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1.4, seed: 443 }))}${dashed([[1160, 200], [1066, 200]], 10, 8, { strokeWidth: 2.2 })}${dashed([[1190, 200], [1284, 200]], 10, 8, { strokeWidth: 2.2 })}</g>`) +
    obj("b-xs", 530, 440, 860, 200,
      `<g id="b-x1s">${r.line(548, 458, 682, 618, pen({ strokeWidth: 5, seed: 450 }))}${r.line(682, 458, 548, 618, pen({ strokeWidth: 5, seed: 451 }))}</g>` +
      `<g id="b-x2s">${r.line(1240, 458, 1374, 618, pen({ strokeWidth: 5, seed: 452 }))}${r.line(1374, 458, 1240, 618, pen({ strokeWidth: 5, seed: 453 }))}</g>`) +
    lbl("b-noans", 510, 728, 900, 56, "no answers settled in advance", `color:${GOLD}`);

  // ---------- 12 to 13. no faster-than-light messages ----------
  const LAB = { a: [260, 700], b: [1220, 1660], y0: 330, y1: 810 };
  const LIST = [0, 1, 1, 0, 1, 0], LX = { a: 480, b: 1440 }, LROW = (i) => 448 + i * 60;
  const listHtml = (side) => `<div id="b-l${side}" class="obj" style="left:${LX[side] - 50}px;top:400px;width:100px;height:400px">` +
    LIST.map((v, i) => lbl(`b-l${side}${i}`, 0, fx(LROW(i) - 400 - ctr(54)), 100, 54, String(v))).join("") + `</div>`;
  const labsHtml =
    ["a", "b"].map((s, i) => obj(`b-lab${s}`, LAB[s][0] - 10, LAB.y0 - 10, 460, 500, `<g id="b-lb${s}">${r.rect(LAB[s][0], LAB.y0, 440, LAB.y1 - LAB.y0, pen({ strokeWidth: 3, seed: 500 + i }))}</g>`)).join("") +
    lbl("b-sa", 330, 252, 300, 56, "side A") + lbl("b-sb", 1290, 252, 300, 56, "side B") +
    obj("b-wave", 690, 340, 540, 90, `<g id="b-wv">${dashed(Array.from({ length: 61 }, (_, i) => [705 + i * 8.5, 385 + 16 * Math.sin(i / 3.2)]), 10, 9, { strokeWidth: 2.4, stroke: DIM })}</g>`) +
    obj("b-env", 690, 500, 520, 120,
      `<g id="b-envg">${r.rect(745, 532, 96, 62, pen({ strokeWidth: 2.8, seed: 520 }))}${r.linear([[745, 534], [793, 568], [841, 534]], pen({ strokeWidth: 2.4, seed: 521 }))}` +
      `${[540, 562, 584].map((y, i) => r.line(700, y, 730, y, pen({ strokeWidth: 2.2, seed: 522 + i }))).join("")}${arrow(856, 563, 1190, 563, { strokeWidth: 3, seed: 526 }, 18)}</g>` +
      `<g id="b-envx">${r.line(740, 515, 1180, 610, pen({ strokeWidth: 4.6, seed: 530 }))}${r.line(740, 610, 1180, 515, pen({ strokeWidth: 4.6, seed: 531 }))}</g>`) +
    lbl("b-ftl", 760, 608, 420, 50, "faster than light?") +
    listHtml("a") + listHtml("b") +
    lbl("b-ra", 330, 340, 300, 48, "random") + lbl("b-rb2", 1290, 340, 300, 48, "random") +
    obj("b-ties13", 900, 420, 140, 360, LIST.map((_, i) => `<g id="b-t13-${i}">${r.line(934, LROW(i), 1006, LROW(i), goldPen({ strokeWidth: 3.4, seed: 540 + i }))}</g>`).join("")) +
    lbl("b-theym", 660, 280, 600, 60, "they match", `color:${GOLD}`);

  // ---------- 14 to 15. the Bell state and the closing card ----------
  const piece = (id, html, note) =>
    `<span style="display:inline-block;position:relative"><span id="${id}" style="display:inline-block">${k.hand(html)}</span>` +
    (note ? `<div class="lbl hand" id="${id}-n" style="left:50%;top:92%;transform:translateX(-50%);font-size:44px;line-height:1.2">${note}</div>` : "") + `</span>`;
  const formHtml =
    lbl("b-bstate", 660, 140, 600, 66, "Bell state") +
    `<div id="b-form" class="obj" style="left:160px;top:380px;width:1600px;height:300px;transform-origin:800px 150px">` +
    `<div class="lbl hand" id="b-fl" style="left:0;top:20px;width:1600px;font-size:120px">` +
    piece("b-fa", "(") + piece("b-fb", "|00⟩", "both 0") + piece("b-fc", "&nbsp;+&nbsp;") + piece("b-fd", "|11⟩", "both 1") + piece("b-fe", ")/√2") + `</div>` +
    `<svg class="sk" width="1600" height="300" viewBox="0 0 1600 300"><g id="b-fund">${r.curve([[400, 182], [640, 174], [900, 180], [1200, 172]], goldPen({ strokeWidth: 4.6, roughness: 1 }))}</g></svg></div>`;
  const F3 = { c: 540, t: 680, cx: 610, hx: 400 };
  const closeHtml =
    obj("b-circ3", 190, 470, 600, 290,
      `<g id="b-w3">${r.line(270, F3.c, 760, F3.c, pen({ seed: 600 }))}${r.line(270, F3.t, 760, F3.t, pen({ seed: 601 }))}</g>` +
      `<g id="b-h3">${r.rect(F3.hx - 40, F3.c - 40, 80, 80, pen({ strokeWidth: 3, seed: 602 }))}</g>` +
      `<g id="b-cx3">${r.circle(F3.cx, F3.c, 26, pen({ fill: INK, fillStyle: "solid", strokeWidth: 2, seed: 603 }))}${r.line(F3.cx, F3.c, F3.cx, F3.t + 32, pen({ strokeWidth: 3, seed: 604 }))}${plusT(F3.cx, F3.t, 64, { strokeWidth: 3, seed: 605 })}</g>`,
      lbl("b-h3l", F3.hx - 40 - 190, F3.c - ctr(54) - 470, 80, 54, "H") +
      lbl("b-c3z0", 10, F3.c - ctr(56) - 470, 70, 56, "0") + lbl("b-c3z1", 10, F3.t - ctr(56) - 470, 70, 56, "0")) +
    lbl("b-each15", 880, 420, 820, 58, "each alone: random", "text-align:left") +
    lbl("b-tog15", 880, 505, 860, 66, "together: always agree", `color:${GOLD};text-align:left`) +
    coin("b-c15a", 1100, 718, 112, 620, [[T.alone15 + 0.1, 0.5, 1, 2], [T.together15 - 0.05, 0.5, 0, 2], [T.agree15, 0.6, 1, 2]], T.so15 + 0.9) +
    coin("b-c15b", 1360, 718, 112, 630, [[T.alone15 + 0.1, 0.5, 1, 2], [T.together15 - 0.05, 0.5, 0, 2], [T.agree15, 0.6, 1, 2]], T.so15 + 0.9) +
    obj("b-loop15", 930, 620, 600, 200, `<g id="b-lp15">${r.ellipse(1230, 718, 560, 184, goldPen({ strokeWidth: 4, seed: 640 }))}</g>`);

  const html = hook0 + coins0 + stage1 + circHtml + ruleHtml + rowsHtml + chartHtml + tallyHtml + ent9 + mislead + labsHtml + formHtml + closeHtml;

  // ---------- timeline ----------
  const script = `
    const COINS = ${JSON.stringify(COINS)};
    const RT1 = ${JSON.stringify(RT1)};
    const RT2 = ${JSON.stringify(RT2)};
    const CUM00 = ${JSON.stringify(CUM00)};
    const T = ${JSON.stringify(T)};
    // coins: scaleX through each flip, the face swaps when edge-on
    onFrame((t) => COINS.forEach((c) => {
      let face = c.face0, sx = 1;
      for (const [a, b, from, half] of c.flips) {
        if (t <= a) { break; }
        if (t >= b) { face = from ^ (half % 2); continue; }
        const ang = ease.inOut((t - a) / (b - a)) * half * Math.PI;
        face = from ^ (Math.floor((ang + Math.PI / 2) / Math.PI) % 2);
        sx = Math.max(0.06, Math.abs(Math.cos(ang)));
        break;
      }
      $(c.id + "-spin").style.transform = "scaleX(" + sx.toFixed(3) + ")";
      const vis = t >= c.showAt;
      $(c.id + "-f0").style.opacity = vis && face === 0 ? "1" : "0";
      $(c.id + "-f1").style.opacity = vis && face === 1 ? "1" : "0";
    }));
    // dancers: one routine, the right dancer its mirror image
    const SH = ${JSON.stringify(SH)}, HP = ${JSON.stringify(HP)};
    function pose(id, p) {
      $(id + "-laR").setAttribute("transform", "rotate(" + p[0].toFixed(2) + " " + SH.l[0] + " " + SH.l[1] + ")");
      $(id + "-raR").setAttribute("transform", "rotate(" + p[1].toFixed(2) + " " + SH.r[0] + " " + SH.r[1] + ")");
      $(id + "-llR").setAttribute("transform", "rotate(" + p[2].toFixed(2) + " " + HP.l[0] + " " + HP.l[1] + ")");
      $(id + "-rlR").setAttribute("transform", "rotate(" + p[3].toFixed(2) + " " + HP.r[0] + " " + HP.r[1] + ")");
    }
    const at = (rt, t) => rt.segs.map((s, i) => sched(s, t, rt.init[i]));
    const mirror = (p) => [-p[1], -p[0], -p[3], -p[2]];
    const pulse = (rt, t) => { let last = -9; for (const s of rt.steps) { if (s <= t) last = s; else break; } return Math.exp(-(t - last) * 3.2); };
    onFrame((t) => {
      const p = at(RT1, t);
      pose("b-d1", p); pose("b-d2", mirror(p));
      // gold ties between the matching inner hands and inner feet
      const ra = p[1] * Math.PI / 180, rl = p[3] * Math.PI / 180;
      const hx = ${D1.l - 150} + SH.r[0] + 4 * Math.cos(ra) - 124 * Math.sin(ra), hy = ${D1.floor - 410} + SH.r[1] + 4 * Math.sin(ra) + 124 * Math.cos(ra);
      const fxp = ${D1.l - 150} + HP.r[0] + 26 * Math.cos(rl) - 174 * Math.sin(rl), fyp = ${D1.floor - 410} + HP.r[1] + 26 * Math.sin(rl) + 174 * Math.cos(rl);
      const set = (id, x1, y1, x2, y2) => { const l = $(id); l.setAttribute("x1", x1.toFixed(1)); l.setAttribute("y1", y1.toFixed(1)); l.setAttribute("x2", x2.toFixed(1)); l.setAttribute("y2", y2.toFixed(1)); };
      set("b-tie1", hx + 10, hy, ${2 * 960} - hx - 10, hy);
      set("b-tie2", fxp + 8, fyp - 6, ${2 * 960} - fxp - 8, fyp - 6);
      const pu = 0.45 + 0.55 * pulse(RT1, t);
      $("b-tie1").style.opacity = pu.toFixed(3); $("b-tie2").style.opacity = pu.toFixed(3);
      const q = at(RT2, t);
      pose("b-e1", q); pose("b-e2", mirror(q));
    });
    // shots chart: 00 and 11 grow together toward half
    onFrame((t) => {
      const n = Math.round(sched([[T.measure6 + 0.6, T.half6b + 0.4, 0, ${NSHOT}]], t, 0));
      const c00 = CUM00[n], c11 = n - c00, ramp = Math.min(1, n / 24);
      const f = [n ? (c00 / n) * ramp : 0, 0, 0, n ? (c11 / n) * ramp : 0];
      [0, 3].forEach((i) => {
        $("b-bar" + i).style.clipPath = "inset(" + ((1 - f[i]) * 100).toFixed(2) + "% 0 0 0)";
        const y = (${CH.base} - ${CH.H} * f[i]).toFixed(1), cap = $("b-cap" + i);
        cap.setAttribute("y1", y); cap.setAttribute("y2", y); cap.style.opacity = n ? "1" : "0";
      });
      $("b-shotn").textContent = String(n);
      // qubit A alone: its own tally, half and half
      const m = Math.round(sched([[T.either8 + 0.5, T.own8, 0, ${NSHOT}]], t, 0)), a0 = CUM00[m], rp = Math.min(1, m / 24);
      const g = [m ? (a0 / m) * rp : 0, m ? ((m - a0) / m) * rp : 0];
      [0, 1].forEach((i) => { $("b-tb" + i).style.clipPath = "inset(" + ((1 - g[i]) * 100).toFixed(2) + "% 0 0 0)"; });
      // its own arrow shrinks to nothing
      const s = sched([[T.shrinks8, T.nothing8 + 0.45, 1, 0.02]], t, 1);
      $("b-barg").setAttribute("transform", "translate(${ballC[0]} ${ballC[1]}) scale(" + s.toFixed(3) + ") translate(${-ballC[0]} ${-ballC[1]})");
      $("b-bdot").style.opacity = t >= T.shrinks8 + 0.3 ? "1" : "0";
    });

    // 0. hook
    draw(["#b-c0a-rim", "#b-c0b-rim"], T.coins0, 1.1);
    write("#b-qa", 1.25, 0.4); write("#b-qb", 1.45, 0.4);
    blurOut("#b-title", 3.0);
    ${R0.map((_, i) => `draw("#b-chb0-${i}", ${fx(flips0[i][0] + 0.25)}, 0.3); write(["#b-chd0-${i}-a", "#b-chd0-${i}-b"], ${fx(flips0[i][0] + 0.42)}, 0.18);`).join("\n    ")}
    draw("#b-eq", T.match0, 0.35);
    write("#b-always0", T.match0 + 0.15, 0.7);
    write(["#b-ff0a", "#b-ff0b"], T.fair0, 0.35);
    blurOut(["#b-c0a", "#b-c0b", "#b-qa", "#b-qb", "#b-eq0", ${R0.map((_, i) => `"#b-ch0-${i}", "#b-chd0-${i}-a", "#b-chd0-${i}-b"`).join(", ")}, "#b-always0", "#b-ff0a", "#b-ff0b"], T.off0);

    // 1. two dancers sharing one routine
    draw("#b-fl1", T.dancers1 - 0.1, 0.6);
    draw(${JSON.stringify(dParts("b-d1"))}, T.dancers1, 1.4);
    draw(${JSON.stringify(dParts("b-d2"))}, T.dancers1 + 0.15, 1.4);
    draw("#b-sh1", T.routine1 - 0.1, 0.8); write("#b-oner", T.routine1 + 0.1, 0.55);
    hide(["#b-cone1", "#b-cone2", "#b-lamp"]);
    fade("#b-lamp", 1, T.either1 - 0.3, 0.2);
    fade("#b-cone1", 1, T.either1 - 0.1, 0.35);
    fade("#b-d2", 0.2, T.either1, 0.4);
    write("#b-madeup", T.made1 - 0.2, 0.7);
    // 2. watch both
    fade("#b-madeup", 0, T.off1, 0.3);
    fade("#b-cone1", 0, T.both2, 0.3); fade("#b-cone2", 1, T.both2, 0.4);
    fade("#b-d2", 1, T.both2, 0.4);
    fade("#b-ties", 1, T.step2, 0.3);
    fade(["#b-cone2", "#b-lamp", "#b-oner"], 0, T.pair2 - 0.3, 0.3);
    move("#b-sheet1", { x: 0, y: 0 }, { x: -610, y: 18 }, T.pair2 - 0.3, 0.9);
    draw("#b-lp1", T.pair2, 1.0);
    write("#b-belongs", T.pair2 + 0.3, 0.9);
    blurOut(["#b-floor1", "#b-d1", "#b-d2", "#b-ties", "#b-sheet1", "#b-loop1", "#b-belongs"], T.off2);

    // 3. CNOT
    write(["#b-nc", "#b-nt"], T.qubits3 - 0.1, 0.45);
    draw(["#b-wc", "#b-wt"], T.qubits3, 0.8);
    draw("#b-cx", T.gate3, 0.8);
    draw("#b-rb", T.if3, 0.5); write("#b-rt", T.if3 + 0.2, 1.0);
    tl.fromTo("#b-rflip", { color: "${INK}" }, { color: "${GOLD}", duration: 0.25 }, T.flips3);
    // 4. start at zero, H gives a 50/50 control
    write(["#b-z0c", "#b-z0t"], T.zero4, 0.25);
    draw("#b-hb", T.h4, 0.45); write("#b-hl", T.h4 + 0.3, 0.2);
    draw("#b-cc-rim", T.fifty4 - 0.1, 0.5); write("#b-ff4", T.fifty4 + 0.1, 0.4);
    fade("#b-rule", 0.35, T.fifty4 + 0.2, 0.4);
    // 5. CNOT acts on each part
    tl.to("#b-cxg", { opacity: 1, duration: 0.2 }, T.apply5);
    tl.to("#b-cxg", { opacity: 0, duration: 0.3 }, T.apply5 + 0.7);
    fade("#b-rule", 0, T.apply5, 0.3);
    move("#b-circ", { x: 0, y: 0, scale: 1 }, { x: 0, y: -176, scale: 0.75 }, T.apply5 + 0.3, 1.0);
    draw("#b-pa0", T.part5, 0.5); draw("#b-pa1", T.part5 + 0.2, 0.55);
    draw(["#b-rib0", "#b-rib1"], T.part5 + 0.3, 0.6);
    write(["#b-tc", "#b-tt"], T.part5 + 0.7, 0.2);
    write(["#b-ri0-a", "#b-ri0-b"], T.zz5, 0.3);
    draw("#b-rar0", T.stays5, 0.35); draw("#b-rob0", T.stays5 + 0.2, 0.3);
    write(["#b-ro0-a", "#b-ro0-b"], T.zz5b, 0.3);
    write(["#b-ri1-a", "#b-ri1-b"], T.oz5, 0.3);
    draw("#b-rar1", T.becomes5, 0.35); draw("#b-rob1", T.becomes5 + 0.2, 0.3);
    write(["#b-ro1-a", "#b-ro1-b0"], T.becomes5 + 0.3, 0.25);
    hide("#b-ro1-b1");
    tl.fromTo("#b-ro1-b", { scaleY: 1 }, { scaleY: 0, duration: 0.16, ease: "power2.in" }, T.oo5);
    tl.set("#b-ro1-b0", { opacity: 0 }, T.oo5 + 0.16); tl.set("#b-ro1-b1", { opacity: 1 }, T.oo5 + 0.16);
    tl.to("#b-ro1-b", { scaleY: 1, duration: 0.2, ease: "power2.out" }, T.oo5 + 0.16);

    // 6. measure the pair
    blurOut(["#b-circ", "#b-row0", "#b-row1", "#b-parts", "#b-ri0-a", "#b-ri0-b", "#b-ro0-a", "#b-ro0-b", "#b-ri1-a", "#b-ri1-b", "#b-ro1-a", "#b-ro1-b", "#b-tc", "#b-tt"], T.measure6 - 0.15);
    draw("#b-axes", T.measure6, 0.8);
    write(["#b-sl0", "#b-sl1", "#b-sl2", "#b-sl3"], T.measure6 + 0.4, 0.5);
    write("#b-shots", T.measure6 + 0.3, 0.5);
    hide("#b-halfl"); fade("#b-halfl", 1, T.measure6 + 0.7, 0.4);
    write("#b-half0", T.half6, 0.35); write("#b-half3", T.half6b, 0.35);
    // 7. never 01 or 10
    write("#b-zero1", T.never7, 0.2); draw("#b-x1", T.never7 + 0.25, 0.3);
    write("#b-zero2", T.never7b, 0.2); draw("#b-x2", T.never7b + 0.25, 0.3);
    draw("#b-tk", T.always7, 0.35); write("#b-agree7", T.always7 + 0.15, 0.7);

    // 8. each qubit alone
    fade(["#b-tick", "#b-agree7", "#b-zero1", "#b-zero2", "#b-x1", "#b-x2"], 0, T.off7, 0.3);
    move("#b-chart", { x: 0, scale: 1 }, { x: -260, scale: 0.66 }, T.either8 - 0.1, 0.9);
    write("#b-alone8", T.either8 + 0.3, 0.7);
    draw("#b-c8-rim", T.either8 - 0.05, 0.4);
    draw("#b-tax", T.either8 + 0.3, 0.4); write(["#b-tl0", "#b-tl1"], T.either8 + 0.5, 0.25);
    draw("#b-bc", T.own8, 0.6);
    draw("#b-barg", T.arrow8 - 0.1, 0.3);
    write("#b-noarrow", T.nothing8, 0.7);

    // 9. entanglement
    blurOut(["#b-chart", "#b-alone8", "#b-c8", "#b-tally", "#b-ball"], T.off8);
    fade("#b-noarrow", 0, T.off8 + 0.8, 0.3);
    write("#b-ent", T.ent9, 0.8);
    draw(["#b-c9a-rim", "#b-c9b-rim"], T.pair9 - 0.4, 0.5);
    draw("#b-lp9", T.pair9 + 0.1, 0.8);
    write("#b-shared", T.shared9, 0.7);
    hide("#b-or9");
    tl.fromTo("#b-or9", { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.inOut" }, T.info9 - 0.1);
    write("#b-lives", T.lives9, 0.9);

    // 10. the dancers mislead us
    blurOut(["#b-ent", "#b-c9a", "#b-c9b", "#b-loop9", "#b-shared", "#b-or9", "#b-lives"], T.off9);
    draw("#b-fl2", T.dancers10 - 0.1, 0.5);
    draw(${JSON.stringify([...dParts("b-e1"), ...dParts("b-e2")])}, T.dancers10, 1.1);
    draw(["#b-ssa", "#b-ssb"], T.steps10, 0.6);
    write("#b-written", T.written10, 0.9);
    // 11. Bell tests
    write("#b-bell", T.bell11, 0.5); draw("#b-labg", T.bell11 + 0.2, 0.9);
    fade("#b-written", 0, T.cant11 - 0.1, 0.25);
    draw("#b-x1s", T.cant11, 0.25); draw("#b-x2s", T.cant11 + 0.25, 0.25);
    write("#b-noans", T.cant11 + 0.4, 1.0);

    // 12. no faster-than-light messages
    blurOut(["#b-floor2", "#b-e1", "#b-e2", "#b-sheets", "#b-xs", "#b-noans", "#b-bell", "#b-lab"], T.off11);
    draw(["#b-lba", "#b-lbb"], T.off11 + 0.2, 0.9);
    write(["#b-sa", "#b-sb"], T.off11 + 0.5, 0.4);
    draw("#b-wv", T.off11 + 0.9, 0.6);
    draw("#b-envg", T.message12, 0.6);
    write("#b-ftl", T.faster12, 0.6);
    draw("#b-envx", T.light12, 0.35);
    fade(["#b-env", "#b-ftl"], 0, T.light12 + 0.8, 0.3);
    ${LIST.map((_, i) => `write("#b-la${i}", ${fx(T.each12 + 0.1 + i * 0.22)}, 0.15); write("#b-lb${i}", ${fx(T.each12 + 0.2 + i * 0.22)}, 0.15);`).join("\n    ")}
    write(["#b-ra", "#b-rb2"], T.random12, 0.4);
    // 13. the match only shows when the lists are compared
    fade(["#b-ra", "#b-rb2", "#b-wave"], 0, T.match13 - 0.1, 0.25);
    fade(["#b-laba", "#b-labb", "#b-sa", "#b-sb"], 0.25, T.match13, 0.4);
    move("#b-la", { x: 0 }, { x: ${fx(910 - LX.a)} }, T.match13, 1.0);
    move("#b-lb", { x: 0 }, { x: ${fx(1030 - LX.b)} }, T.match13, 1.0);
    ${LIST.map((_, i) => `draw("#b-t13-${i}", ${fx(T.compared13 - 0.3 + i * 0.1)}, 0.16);`).join(" ")}
    write("#b-theym", T.compared13 + 0.1, 0.6);

    // 14. the Bell state
    blurOut(["#b-laba", "#b-labb", "#b-sa", "#b-sb", "#b-la", "#b-lb", "#b-ties13", "#b-theym"], T.off13);
    write("#b-bstate", T.bell14, 0.6);
    write("#b-fa", T.ket14 - 0.1, 0.12);
    write("#b-fb", T.ket14, 0.45); write("#b-fb-n", T.ket14 + 0.4, 0.4);
    write("#b-fc", T.plus14, 0.25);
    write("#b-fd", T.ket14b, 0.45); write("#b-fd-n", T.ket14b + 0.4, 0.4);
    write("#b-fe", T.root14, 0.5);
    // 15. closing card
    fade(["#b-fb-n", "#b-fd-n"], 0, T.so15 - 0.35, 0.25);
    draw("#b-fund", T.so15 - 0.1, 0.5);
    move("#b-form", { y: 0, scale: 1 }, { y: -174, scale: 0.8 }, T.so15 + 0.15, 0.9);
    draw(["#b-w3", "#b-h3", "#b-cx3"], T.so15 + 0.5, 1.3);
    write(["#b-c3z0", "#b-c3z1"], T.so15 + 0.5, 0.2); write("#b-h3l", T.so15 + 1.0, 0.2);
    draw(["#b-c15a-rim", "#b-c15b-rim"], T.so15 + 0.5, 0.5);
    write("#b-each15", T.alone15 - 0.2, 0.9);
    write("#b-tog15", T.together15, 1.0);
    draw("#b-lp15", T.together15 + 0.4, 0.8);
  `;
  const css = `#root .bits span { display:inline-block; }`;
  return { html, script, css };
}
