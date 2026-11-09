// Lesson 14, "Superdense coding". Follows plan.md: the question (two bits, one qubit), a bit card
// that a lone qubit carries alone, the safe with two keys (Bob's plain key, Alice's dial key set to
// one of four positions and posted over the safe), the keys becoming a Bell pair whose readings
// match, the pair split in advance, Alice's four twists and their messages 00 01 10 11, the four
// Bell patterns that only show when both qubits are read together, the posted qubit, Bob's
// CNOT then H and two meters reading 11, where the safe breaks (a posted key shows its position,
// a lone qubit looks random), the message living in the pair, no faster than light, and the
// closing circuit with the takeaway. Gold always marks the message (11, the "both" twist).
export const phrases = [["zero zero", "00"], ["zero one", "01"], ["one zero", "10"], ["one one", "11"]];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, lines, INK, GOLD, DIM, GROUND } = k;
  const fx = (n) => +(+n).toFixed(2);
  // A word's start by its transcript spelling (for words the transcriber merged or wrote differently).
  const wd = (li, prefix, nth = 0) => {
    const hit = lines[li].words.filter((w) => w.w.toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(prefix))[nth];
    if (!hit) throw new Error(`wd: no "${prefix}" in line ${li}`);
    return fx(hit.start);
  };
  const G = `color:${GOLD}`;
  const ctr = (size) => fx(size * 0.745); // label top offset that centres its text on a y
  const lc = (id, cx, cy, w, size, html, extra = "") => lbl(id, fx(cx - w / 2), fx(cy - ctr(size)), w, size, html, extra);
  // A layer over the safe area whose svg uses board coordinates.
  const layer = (id, svg) =>
    `<div id="${id}" class="obj" style="left:140px;top:60px;width:1640px;height:800px"><svg class="sk" width="1640" height="800" viewBox="140 60 1640 800">${svg}</svg></div>`;
  const g = (id, inner, tf) => `<g${id ? ` id="${id}"` : ""}${tf ? ` transform="${tf}"` : ""}>${inner}</g>`;
  const at = (x, y, a = 0, s = 1) => `translate(${fx(x)} ${fx(y)}) rotate(${fx(a)}) scale(${s})`;

  // ---------- drawing helpers ----------
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
  const bez = (p0, p1, p2, n = 40, u0 = 0, u1 = 1) => Array.from({ length: n + 1 }, (_, i) => {
    const u = u0 + ((u1 - u0) * i) / n, a = (1 - u) ** 2, b = 2 * u * (1 - u), c = u * u;
    return [fx(a * p0[0] + b * p1[0] + c * p2[0]), fx(a * p0[1] + b * p1[1] + c * p2[1])];
  });
  const headAt = (pts, o, size = 18) => {
    const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1];
    const a = Math.atan2(y2 - y1, x2 - x1), w = (o.strokeWidth ?? 3) * 0.85;
    return [0.45, -0.45].map((da) => r.line(x2, y2, fx(x2 - size * Math.cos(a + da)), fx(y2 - size * Math.sin(a + da)), pen({ ...o, strokeWidth: w }))).join("");
  };
  const arcPts = (cx, cy, R, a0, a1, n = 40) => Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [fx(cx + R * Math.cos(a)), fx(cy + R * Math.sin(a))];
  });
  const ellPts = (cx, cy, rx, ry, n = 72) => Array.from({ length: n + 1 }, (_, i) => [fx(cx + rx * Math.cos((i * 2 * Math.PI) / n)), fx(cy + ry * Math.sin((i * 2 * Math.PI) / n))]);
  const dashedRect = (x, y, w, h, o) => dashed([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], 14, 10, o);
  const dotS = (cx, cy, d, o = {}) => r.circle(cx, cy, d, pen({ fill: o.stroke ?? INK, fillStyle: "solid", strokeWidth: 1, ...o }));
  const plusT = (cx, cy, d, o = {}) => r.circle(cx, cy, d, pen(o)) + r.line(cx - d / 2 + 4, cy, cx + d / 2 - 4, cy, pen(o)) + r.line(cx, cy - d / 2 + 4, cx, cy + d / 2 - 4, pen(o));
  const cross = (cx, cy, s, o = {}) =>
    r.line(cx - s, cy - s * 0.8, cx + s, cy + s * 0.8, pen({ strokeWidth: 4.4, ...o })) + r.line(cx + s, cy - s * 0.8, cx - s, cy + s * 0.8, pen({ strokeWidth: 4.4, ...o }));
  const tick = (cx, cy, s, o = {}) => r.linear([[cx - s, cy], [fx(cx - s * 0.3), fx(cy + s * 0.7)], [cx + s, fx(cy - s * 0.9)]], pen({ strokeWidth: 4, roughness: 0.8, ...o }));
  // An envelope: body and a flap that dips `flap` of the height.
  const env = (cx, cy, w, h, o = {}, flap = 0.45) =>
    r.rect(fx(cx - w / 2), fx(cy - h / 2), w, h, pen({ strokeWidth: 3, ...o })) +
    r.linear([[fx(cx - w / 2 + 4), fx(cy - h / 2 + 4)], [cx, fx(cy - h / 2 + h * flap)], [fx(cx + w / 2 - 4), fx(cy - h / 2 + 4)]], pen({ strokeWidth: 2.4, roughness: 0.9, ...o }));
  // A qubit: a plain ball (circle with a faint highlight), centred on the origin.
  const ball = (rad, seed, o = {}) =>
    r.circle(0, 0, rad * 2, pen({ strokeWidth: 3.4, seed, ...o })) +
    r.arc(0, 0, fx(rad * 1.3), fx(rad * 1.3), Math.PI * 1.1, Math.PI * 1.45, false, pen({ strokeWidth: 2.4, stroke: DIM, seed: seed + 1 }));
  // A key with its round head on the origin and its tip at (220, 0). Alice's head is a dial.
  const key = (dial, seed) =>
    r.circle(0, 0, 100, pen({ strokeWidth: 3.4, seed })) +
    (dial
      ? [0, 90, 180, 270].map((a) => { const t = (a * Math.PI) / 180; return r.line(fx(32 * Math.cos(t)), fx(32 * Math.sin(t)), fx(44 * Math.cos(t)), fx(44 * Math.sin(t)), pen({ strokeWidth: 3.2, roughness: 0.6 })); }).join("")
      : r.circle(0, 0, 30, pen({ strokeWidth: 2.6 }))) +
    r.line(49, -9, 220, -9, pen({ strokeWidth: 3 })) + r.line(49, 9, 178, 9, pen({ strokeWidth: 3 })) +
    r.linear([[178, 9], [178, 34], [192, 34], [192, 22], [205, 22], [205, 34], [220, 34], [220, -9]], pen({ strokeWidth: 3, roughness: 0.7 }));
  const pointer = (len = 36, w = 5) => r.line(0, 0, len, 0, goldPen({ strokeWidth: w, roughness: 0.5 })) + dotS(0, 0, 14, { stroke: GOLD });
  // A meter: box, dial arc and a needle (its group id given so it can swing).
  const meter = (x, y, nid, a0 = -50, w = 120, h = 90) =>
    r.rect(x - w / 2, y - h / 2, w, h, pen({ strokeWidth: 3 })) +
    r.arc(x, fx(y + h * 0.28), fx(w * 0.62), fx(w * 0.62), Math.PI, 2 * Math.PI, false, pen({ strokeWidth: 2.4 })) +
    `<g id="${nid}" transform="rotate(${a0} ${x} ${fx(y + h * 0.28)})">${r.line(x, fx(y + h * 0.28), x, fx(y - h * 0.26), pen({ strokeWidth: 3 }))}</g>`;
  const miniDial = (cx, cy, dir, P) => {
    const a = ([-90, 0, 90, 180][dir] * Math.PI) / 180;
    return r.circle(cx, cy, 44, P({ strokeWidth: 2.6 })) + r.line(cx, cy, fx(cx + 17 * Math.cos(a)), fx(cy + 17 * Math.sin(a)), P({ strokeWidth: 3.4, roughness: 0.5 }));
  };
  const keyhole = (x, y) => r.circle(x, y, 22, pen({ strokeWidth: 2.6 })) + r.poly([[x - 6, y + 9], [x + 6, y + 9], [x + 10, y + 32], [x - 10, y + 32]], pen({ strokeWidth: 2.4, roughness: 0.6 }));
  // A magnifying glass with its lens on the origin.
  const glass = (R, seed) => r.circle(0, 0, R * 2, pen({ strokeWidth: 3.6, seed })) + r.line(fx(R * 0.72), fx(R * 0.72), fx(R * 0.72 + 70), fx(R * 0.72 + 70), pen({ strokeWidth: 8, roughness: 0.6 }));
  // A tiny Bell-pair icon: two circles and a link drawn in one of four styles.
  const miniPair = (cx, cy, kind, gold, seed) => {
    const P = gold ? goldPen : pen;
    const lo = { strokeWidth: 2.8, roughness: 0.3, disableMultiStroke: true };
    const x0 = cx - 34, x1 = cx + 34, N = 48;
    const S = (f) => Array.from({ length: N + 1 }, (_, i) => f(i / N));
    let link;
    if (kind === 0) link = r.linear(S((u) => [fx(x0 + 68 * u), fx(cy + 9 * Math.sin(u * Math.PI * 3))]), P(lo));
    else if (kind === 1) link = r.linear(Array.from({ length: 7 }, (_, i) => [fx(x0 + (68 * i) / 6), cy + (i % 2 ? -10 : 10)]), P(lo));
    else if (kind === 2) link = r.linear(S((u) => { const th = u * 6 * Math.PI; return [fx(x0 + 3.6 * th - 9 * Math.sin(th)), fx(cy + 9 * Math.cos(th))]; }), P(lo));
    else link = [-6, 6].map((d) => r.linear(S((u) => [fx(x0 + 68 * u), fx(cy + d + 5 * Math.sin(u * Math.PI * 4))]), P(lo))).join("");
    return r.circle(cx - 58, cy, 40, P({ strokeWidth: 2.8, seed })) + r.circle(cx + 58, cy, 40, P({ strokeWidth: 2.8, seed: seed + 1 })) + link;
  };
  const vWave = (x, y0, y1, amp, waves, ph = 0) =>
    "M" + Array.from({ length: 41 }, (_, i) => { const u = i / 40; return fx(x + amp * Math.sin(u * Math.PI * 2 * waves + ph) * Math.sin(Math.PI * u)) + " " + fx(y0 + (y1 - y0) * u); }).join(" L");

  // ---------- times ----------
  const T = {
    alice0: cue(0, "alice"), bob0: cue(0, "bob"), two0: cue(0, "two"), posting0: cue(0, "posting"), one0: cue(0, "one"), qubit0: cue(0, "qubit"),
    s1: cue(1), zero1: cue(1, "zero"), one1: cue(1, "one"), lone1: cue(1, "lone"), only1: cue(1, "only"), carry1: cue(1, "carry"), oneb1: cue(1, "one", 1),
    off1: cue(2, null, 0, -0.25),
    picture2: cue(2, "picture"), opens2: cue(2, "opens"), two2: cue(2, "two"),
    s3: cue(3), bob3: cue(3, "bob"), alice3: cue(3, "alice"), sets3: cue(3, "sets"), four3: cue(3, "four"), positions3: cue(3, "positions"), posts3: cue(3, "posts"),
    both4: cue(4, "both"), tell4: cue(4, "tell"), position4: cue(4, "position"), chose4: cue(4, "chose"),
    off4: cue(5, null, 0, -0.2),
    quantum5: cue(5, "quantum"), keys5: cue(5, "keys"), bell5: cue(5, "bell"), ent5: cue(5, "entangled"), readings5: cue(5, "readings"), random5: cue(5, "random"), always5: cue(5, "always"),
    s6: cue(6), advance6: cue(6, "advance"), alice6: cue(6, "alice"), bob6: cue(6, "bob"),
    s7: cue(7), twists7: cue(7, "twists"), nothing7: cue(7, "nothing"), z7: cue(7, "z"), x7: wd(7, "xor"), both7: cue(7, "both"),
    s8: cue(8), half8: cue(8, "half"), zz8: cue(8, "zero", 0), zo8: cue(8, "zero", 2), oz8: cue(8, "one", 1), oo8: cue(8, "one", 2),
    s9: cue(9), different9: cue(9, "different"), bell9: cue(9, "bell"),
    told10: cue(10, "told"), both10: cue(10, "both"), together10: cue(10, "together"),
    off10: cue(11, "posts", 0, -0.45),
    posts11: cue(11, "posts"), qubit11: cue(11, "qubit"), both11: cue(11, "both"),
    s12: cue(12), link12: cue(12, "link"), recipe12: cue(12, "recipe"), back12: cue(12, "backwards"), cnot12: wd(12, "cnot"), h12: cue(13, "h"),
    s13: cue(13), measures13: cue(13, "measures"), two13: cue(13, "two"), certain13: cue(13, "certain"),
    off13: cue(14, "safe", 0, -0.45),
    safe14: cue(14, "safe"), breaks14: cue(14, "breaks"), posted14: cue(14, "posted"), key14: cue(14, "key"), see14: cue(14, "see"), position14: cue(14, "position"),
    alone15: cue(15, "alone"), random15: cue(15, "random"), spy15: cue(15, "spy"), learns15: cue(15, "learns"), nothing15: cue(15, "nothing"),
    off15: cue(16, null, 0, -0.2),
    s16: cue(16), message16: cue(16, "message"), only16: cue(16, "only"),
    s17: cue(17), not17: cue(17, "not"), shared17: cue(17, "shared"), her17: cue(17, "her"), travels17: cue(17, "travels"), no17: cue(17, "no"),
    off17: cue(18, "with", 0, -0.05),
    shared18: cue(18, "shared"), pair18: cue(18, "pair"), qubit18: cue(18, "qubit"), delivers18: cue(18, "delivers"), two18: cue(18, "two"), ent18: cue(18, "entanglement"),
  };

  // ---------- 0 to 1. Two bits, one qubit; a lone qubit carries one bit ----------
  const card = (n, x, digits) =>
    `<div id="b-card${n}" class="obj" style="left:${x}px;top:480px;width:110px;height:140px">` +
    `<div id="b-card${n}i" class="obj" style="left:0;top:0;width:110px;height:140px">` +
    `<svg class="sk" width="110" height="140" viewBox="0 0 110 140">${g(`b-c${n}r`, r.rect(5, 5, 100, 130, goldPen({ strokeWidth: 3.4 })))}</svg>${digits}</div></div>`;
  const dig = (id, d) => lbl(id, 0, fx(70 - ctr(80)), 110, 80, d, G);
  const s0 =
    layer("b-s0",
      g("b-path0", dashed([[700, 720], [1400, 720]], 18, 14, { strokeWidth: 2.8 }) + headAt([[1380, 720], [1410, 720]], { strokeWidth: 2.8 }, 20)) +
      g("b-env0", env(600, 720, 170, 110)) +
      g("b-q0p", g("b-q0", ball(40, 31)), at(600, 560))) +
    layer("b-s1",
      g("b-q1", ball(80, 41), at(1180, 520)) +
      g("b-ar1", arrow(1085, 520, 800, 520, { strokeWidth: 3.4 }, 22)) +
      g("b-ghost", dashedRect(448, 429, 144, 182, { strokeWidth: 2.6, stroke: DIM })) +
      g("b-gx", cross(520, 520, 50))) +
    card(1, 300, dig("b-c1v1", "1") + dig("b-c1v0", "0")) + card(2, 430, dig("b-c2v1", "1")) +
    lc("b-nmA0", 360, 380, 220, 56, "Alice") + lc("b-nmB0", 1560, 380, 220, 56, "Bob") + lc("b-qm0", 1050, 630, 100, 80, "?", G) +
    lc("b-bitdef", 700, 690, 360, 48, "bit = 0 or 1") + lc("b-lone", 1180, 690, 480, 48, "1 qubit alone → 1 bit");

  // ---------- 2 to 4. The safe with two keys ----------
  const ENV = { P0: [380, 640], P1: [940, -330], P2: [1500, 620] };
  const safeSvg =
    g("b-safe",
      r.rect(760, 330, 400, 400, pen({ strokeWidth: 4.2 })) + r.rect(795, 365, 330, 330, pen({ strokeWidth: 2.6 })) +
      r.rect(768, 400, 16, 44, pen({ strokeWidth: 2.6 })) + r.rect(768, 616, 16, 44, pen({ strokeWidth: 2.6 })) +
      r.rect(790, 730, 56, 18, pen({ strokeWidth: 2.6 })) + r.rect(1074, 730, 56, 18, pen({ strokeWidth: 2.6 }))) +
    g("b-wheelp",
      g("b-wheel", r.circle(960, 545, 90, pen({ strokeWidth: 3.2 })) + r.circle(960, 545, 22, pen({ strokeWidth: 2.4 })) +
        [0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + Math.PI / 4; return r.line(fx(960 + 11 * Math.cos(a)), fx(545 + 11 * Math.sin(a)), fx(960 + 56 * Math.cos(a)), fx(545 + 56 * Math.sin(a)), pen({ strokeWidth: 3 })) + dotS(fx(960 + 58 * Math.cos(a)), fx(545 + 58 * Math.sin(a)), 12); }).join("")),
      "rotate(0 960 545)") +
    g("b-kh", keyhole(870, 640) + keyhole(1050, 640)) +
    g("b-khg1", r.circle(870, 650, 72, goldPen({ strokeWidth: 3.4 }))) + g("b-khg2", r.circle(1050, 650, 72, goldPen({ strokeWidth: 3.4 }))) +
    g("b-win", r.rect(830, 370, 260, 110, pen({ strokeWidth: 2.8 }))) +
    g("b-wic", [0, 1, 2, 3].map((i) => miniDial(868 + 62 * i, 410, i, pen)).join("")) +
    g("b-wicg", miniDial(930, 410, 1, goldPen)) +
    g("b-wtk", tick(930, 458, 12, { stroke: GOLD, strokeWidth: 3.6 }));
  const keysSvg =
    g("b-postP", dashed(bez(ENV.P0, ENV.P1, ENV.P2, 60, 0.1, 0.9), 16, 13, { strokeWidth: 2.6 })) +
    g("b-envKp", g("b-envK", env(0, 0, 170, 110)), at(...ENV.P0)) +
    g("b-kBp", g("b-kB", key(false, 61)), at(1650, 430, 180)) +
    g("b-kAp", g("b-kA", key(true, 71)) + g("b-ptrp", g("b-ptr", pointer()), "rotate(-90)"), at(270, 450));
  const safeHtml =
    layer("b-safeL", safeSvg) + layer("b-keysL", keysSvg) +
    lc("b-open2", 960, 785, 420, 48, "opens with 2 keys") +
    lc("b-nmA3", 360, 330, 200, 56, "Alice") + lc("b-nmB3", 1560, 330, 200, 56, "Bob") +
    lc("b-pos4", 330, 540, 300, 40, "4 positions");

  // ---------- 5 to 13. The Bell pair: twists, patterns, the post, Bob's undo and reading ----------
  const CX = [655, 892, 1128, 1365];
  const clockSvg =
    g("b-clk", r.circle(780, 250, 80, pen({ strokeWidth: 3 })) +
      [0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2; return r.line(fx(780 + 30 * Math.cos(a)), fx(250 + 30 * Math.sin(a)), fx(780 + 37 * Math.cos(a)), fx(250 + 37 * Math.sin(a)), pen({ strokeWidth: 2.4 })); }).join("") +
      r.line(780, 250, 796, 250, pen({ strokeWidth: 3.4 })) + dotS(780, 250, 9)) +
    g("b-clkh", g("b-clkhg", r.line(780, 250, 780, 222, pen({ strokeWidth: 2.8 }))), "rotate(0 780 250)");
  const twPts = arcPts(420, 520, 120, -200, 35, 50);
  const qsSvg =
    `<path id="b-link" d="" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/>` +
    g("b-sk", g("", key(false, 81), at(777.5, 500, 0, 0.5)) + g("", key(true, 91), at(1057.5, 500, 0, 0.5))) +
    g("b-qAp", g("b-qA", ball(80, 101)), at(820, 500)) +
    g("b-qBp", g("b-qB", ball(80, 111)), at(1100, 500)) +
    g("b-envAp", g("b-envA", env(0, 0, 200, 140, {}, 0.3)), at(420, 520)) +
    clockSvg +
    g("b-twp", g("b-tw", r.linear(twPts, goldPen({ strokeWidth: 4, roughness: 0.6 })) + headAt(twPts, { stroke: GOLD, strokeWidth: 4 }, 22)), "rotate(0 420 520)") +
    CX.map((cx, i) => g(`b-cd${i}`, r.rect(cx - 95, 640, 190, 110, pen({ strokeWidth: 3, seed: 200 + i })))).join("") +
    g("b-cdg", r.rect(CX[3] - 95, 640, 190, 110, goldPen({ strokeWidth: 3.8 }))) +
    // Z: a half turn round the up-down axis; X: a half turn that flips top to bottom.
    g("b-hz", r.circle(892, 560, 56, pen({ strokeWidth: 2.6 })) + r.line(892, 520, 892, 600, pen({ strokeWidth: 1.8, stroke: DIM })) +
      r.linear(ellPts(892, 560, 46, 13, 36).slice(4, 32), pen({ strokeWidth: 2.8, roughness: 0.5 })) + headAt(ellPts(892, 560, 46, 13, 36).slice(28, 32), { strokeWidth: 2.8 }, 13)) +
    g("b-hx", r.circle(1128, 560, 56, pen({ strokeWidth: 2.6 })) +
      r.linear(arcPts(1128, 560, 44, -80, 80, 30), pen({ strokeWidth: 2.8, roughness: 0.5 })) + headAt(arcPts(1128, 560, 44, 60, 80, 6), { strokeWidth: 2.8 }, 13)) +
    CX.map((cx, i) => g(`b-pi${i}`, miniPair(cx, 585, i, i === 3, 220 + i * 3))).join("") +
    g("b-dv", [773.5, 1010, 1246.5].map((x) => r.line(x, 570, x, 840, pen({ strokeWidth: 2, stroke: DIM }))).join("")) +
    CX.map((cx, i) => g(`b-tk${i}`, tick(cx + 64, 805, 12, { strokeWidth: 3.4 }))).join("") +
    g("b-gl", glass(116, 250), at(420, 520, 90)) +
    g("b-glx", cross(420, 520, 66)) +
    g("b-ov", r.ellipse(CX[3], 585, 244, 96, goldPen({ strokeWidth: 3.4 }))) +
    g("b-ovtk", tick(1170, 505, 14, { stroke: GOLD, strokeWidth: 4 })) +
    g("b-path11", dashed([[560, 560], [1250, 560]], 18, 14, { strokeWidth: 2.6 })) +
    // Bob's circuit: wires, the backwards arrow, CNOT, H, two meters, the read bits.
    g("b-wr", r.line(250, 460, 1240, 460, pen()) + r.line(250, 660, 1240, 660, pen())) +
    g("b-back", r.curve([[1010, 380], [800, 404], [610, 382]], goldPen({ strokeWidth: 3.6 })) + headAt([[630, 384], [604, 381]], { stroke: GOLD, strokeWidth: 3.6 }, 20)) +
    g("b-cn", dotS(800, 460, 22) + r.line(800, 460, 800, 684, pen()) + plusT(800, 660, 48, { strokeWidth: 3 })) +
    g("b-hb", r.rect(1015, 425, 70, 70, pen({ strokeWidth: 3, fill: GROUND, fillStyle: "solid" }))) +
    g("b-mt", meter(1300, 460, "b-nd1") + meter(1300, 660, "b-nd2")) +
    g("b-br", r.curve([[1488, 420], [1508, 432], [1508, 540], [1530, 560], [1508, 580], [1508, 688], [1488, 700]], goldPen({ strokeWidth: 3.6, roughness: 0.7 })));
  const qsHtml =
    layer("b-qs", qsSvg) +
    lc("b-bellp", 960, 350, 360, 64, "Bell pair") +
    lc("b-rdA", 820, 650, 90, 64, `<span id="b-rdAt">0</span>`) + lc("b-rdB", 1100, 650, 90, 64, `<span id="b-rdBt">0</span>`) +
    lc("b-eq5", 960, 650, 80, 64, "=", G) +
    lc("b-rand", 960, 745, 300, 40, "random") + lc("b-match", 960, 745, 560, 40, "random, but always match") +
    lc("b-adv", 1010, 250, 360, 40, "before any message") +
    CX.map((cx, i) => lc(`b-ct${i}`, cx, 695, 184, 56, ["nothing", "Z", "X", "Z + X"][i])).join("") + lc("b-ct3g", CX[3], 695, 184, 56, "Z + X", G) +
    CX.map((cx, i) => lc(`b-dg${i}`, cx, 805, 120, 64, ["00", "01", "10", "11"][i])).join("") + lc("b-dg3g", CX[3], 805, 120, 64, "11", G) +
    lc("b-half", 1010, 490, 260, 40, "half turns") +
    lc("b-4bs", 960, 470, 400, 64, "4 Bell states") +
    lc("b-glq", 420, 520, 100, 80, "?") +
    lc("b-btog", 1322, 505, 300, 48, "both together") +
    lc("b-tag", 420, 665, 160, 48, "Z + X", G) +
    lc("b-bh", 1450, 440, 300, 48, "both halves") +
    lc("b-note", 800, 330, 520, 40, "made with: H, then CNOT", "opacity:0.6") +
    lc("b-hL", 1050, 460, 60, 48, "H") +
    lc("b-o1", 1440, 460, 80, 80, "1", G) + lc("b-o2", 1440, 660, 80, 80, "1", G) +
    lc("b-o11", 1612, 560, 140, 80, "11", G) +
    lc("b-every", 1520, 780, 260, 48, "every time");

  // ---------- 14 to 15. Where the safe breaks ----------
  const eye = r.curve([[-36, 0], [0, -22], [36, 0]], pen({ strokeWidth: 2.8 })) + r.curve([[-36, 0], [0, 22], [36, 0]], pen({ strokeWidth: 2.8 })) + dotS(0, 0, 18);
  const brSvg =
    g("b-ss", r.rect(230, 370, 200, 200, pen({ strokeWidth: 3.6 })) + r.rect(250, 390, 160, 160, pen({ strokeWidth: 2.2 })) +
      r.circle(330, 450, 50, pen({ strokeWidth: 2.6 })) + keyhole(295, 505) + keyhole(365, 505) +
      r.rect(244, 570, 34, 12, pen({ strokeWidth: 2.2 })) + r.rect(382, 570, 34, 12, pen({ strokeWidth: 2.2 }))) +
    g("b-crack", r.linear([[214, 372], [262, 418], [296, 402], [336, 470], [370, 452], [410, 522], [448, 568]], pen({ strokeWidth: 4.6, roughness: 0.6 }))) +
    g("b-benv", env(800, 520, 380, 240, {}, 0.22)) +
    g("", g("b-k14", key(true, 141)) + g("b-p14p", g("b-p14", pointer(36, 5.4))), at(698, 520, 0, 1.2)) +
    g("b-g14p", g("b-g14", glass(84, 151)), at(470, 720)) +
    g("b-e15", env(1350, 500, 280, 220, {}, 0.14)) +
    g("", g("b-q15", ball(80, 161)), at(1350, 510)) +
    g("b-spyp", g("b-spy", glass(76, 171)) + g("b-eye", eye), at(1650, 250)) +
    g("b-spyx", cross(1350, 510, 62));
  const brHtml =
    layer("b-brL", brSvg) +
    lc("b-ssl", 330, 640, 380, 48, "the picture breaks") +
    lc("b-see", 800, 700, 320, 48, "you can see it") +
    lc("b-tk15", 1350, 665, 90, 64, `<span id="b-tk15t">0</span>`) + lc("b-rnd15", 1350, 768, 220, 48, "random") +
    lc("b-spyq", 1350, 510, 100, 90, "?") + lc("b-ln", 1350, 338, 340, 48, "learns nothing");

  // ---------- 16 to 17. The message lives in the pair; no faster than light ----------
  const l16 = Array.from({ length: 41 }, (_, i) => [fx(920 + 80 * (i / 40)), fx(520 + 10 * Math.sin((i / 40) * Math.PI * 3))]);
  const p16 =
    `<div id="b-p16" class="obj" style="left:700px;top:380px;width:520px;height:280px">` +
    `<svg class="sk" width="520" height="280" viewBox="700 380 520 280">` +
    g("", g("b-q16a", ball(80, 181)), at(830, 520)) + g("", g("b-q16b", ball(80, 191)), at(1090, 520)) +
    g("b-l16", r.linear(l16, goldPen({ strokeWidth: 4, roughness: 0.4, disableMultiStroke: true }))) +
    g("b-ov16", dashed(ellPts(960, 520, 240, 114, 90), 16, 12, { stroke: GOLD, strokeWidth: 3.4 })) +
    `</svg></div>`;
  const sun = r.circle(820, 360, 40, pen({ strokeWidth: 3 })) + Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return r.line(fx(820 + 28 * Math.cos(a)), fx(360 + 28 * Math.sin(a)), fx(820 + 42 * Math.cos(a)), fx(360 + 42 * Math.sin(a)), pen({ strokeWidth: 2.4 })); }).join("");
  const ftlSvg =
    g("b-tarr", r.line(220, 600, 1700, 600, pen({ strokeWidth: 3.2 })) + headAt([[1680, 600], [1702, 600]], { strokeWidth: 3.2 }, 22) +
      r.line(520, 584, 520, 616, pen({ strokeWidth: 3 })) + r.line(1100, 584, 1100, 616, pen({ strokeWidth: 3 }))) +
    g("b-p17", dashed([[940, 470], [1540, 470]], 18, 14, { strokeWidth: 2.6 })) +
    g("b-e17p", g("b-e17", env(0, 0, 160, 100, {}, 0.28) + r.circle(0, 12, 60, pen({ strokeWidth: 3 }))), at(1000, 470)) +
    g("b-sun", sun) +
    g("b-ray", r.line(866, 360, 1692, 360, pen({ strokeWidth: 3 })) + headAt([[1670, 360], [1694, 360]], { strokeWidth: 3 }, 20));
  const ftlHtml =
    p16 + lc("b-m11", 960, 340, 140, 80, "11", G) + lc("b-onlyp", 960, 720, 420, 56, "only in the pair") +
    layer("b-ftl", ftlSvg) +
    lc("b-time", 1690, 645, 110, 40, "time") +
    lc("b-ear", 520, 660, 420, 40, "earlier: share the pair") + lc("b-then", 1100, 660, 360, 40, "then: post 1 qubit") +
    lc("b-nfl", 1260, 290, 460, 48, "no faster than light");

  // ---------- 18. The closing circuit and the takeaway ----------
  const Y1 = 360, Y2 = 540;
  const box = (cx, cy, o = {}) => r.rect(cx - 35, cy - 35, 70, 70, pen({ strokeWidth: 3, ...o }));
  const clSvg =
    g("b-cw", [[260, 345], [415, 685], [755, 805], [875, 1145], [1215, 1285]].map(([a, b]) => r.line(a, Y1, b, Y1, pen())).join("") + r.line(260, Y2, 1285, Y2, pen())) +
    g("b-cleft", box(380, Y1) + dotS(490, Y1, 22) + r.line(490, Y1, 490, Y2 + 24, pen()) + plusT(490, Y2, 48, { strokeWidth: 3 })) +
    g("b-csqg", `<path id="b-csq" class="ink" pathLength="1" d="${vWave(590, 386, 514, 8, 3)}" stroke="${GOLD}" stroke-width="4" fill="none" stroke-linecap="round"/>`) +
    g("b-cbr", r.linear([[300, 578], [300, 594], [620, 594], [620, 578]], pen({ strokeWidth: 2.6, roughness: 0.6 }))) +
    g("b-ctw", dashedRect(685, 325, 70, 70, { stroke: GOLD, strokeWidth: 3.2 }) + dashedRect(805, 325, 70, 70, { stroke: GOLD, strokeWidth: 3.2 })) +
    g("b-cpost", dashed([[950, 312], [950, 600]], 12, 10, { strokeWidth: 2.4 }) + env(950, 282, 58, 40, { strokeWidth: 2.4 })) +
    g("b-cright", dotS(1060, Y1, 22) + r.line(1060, Y1, 1060, Y2 + 24, pen()) + plusT(1060, Y2, 48, { strokeWidth: 3 }) + box(1180, Y1)) +
    g("b-cmt", meter(1340, Y1, "b-cn1", 35, 110, 80) + meter(1340, Y2, "b-cn2", 35, 110, 80)) +
    g("b-cbr2", r.curve([[1412, 336], [1428, 346], [1428, 440], [1444, 450], [1428, 460], [1428, 554], [1412, 564]], goldPen({ strokeWidth: 3.4, roughness: 0.6 }))) +
    g("b-tku", r.curve([[420, 826], [760, 816], [1140, 824], [1500, 814]], goldPen({ strokeWidth: 4.4, roughness: 1 })));
  const clHtml =
    layer("b-cl", clSvg) +
    lc("b-cH1", 380, Y1, 60, 48, "H") + lc("b-cH2", 1180, Y1, 60, 48, "H") +
    lc("b-cX", 720, Y1, 60, 48, "X", G) + lc("b-cZ", 840, Y1, 60, 48, "Z", G) +
    lc("b-lbell", 460, 636, 360, 40, "shared Bell pair") + lc("b-lal", 780, 636, 200, 40, "Alice") + lc("b-lbob", 1200, 636, 200, 40, "Bob") +
    lc("b-c2b", 1540, 450, 180, 56, "2 bits", G) +
    lc("b-take", 960, 745, 1400, 96, `1 qubit + shared pair → <span class="gold">2 bits</span>`);

  const html = s0 + safeHtml + qsHtml + brHtml + ftlHtml + clHtml;

  // ---------- timeline ----------
  const script = `
    const T = ${JSON.stringify(T)};
    const ENV = ${JSON.stringify(ENV)};
    const CXS = ${JSON.stringify(CX)};
    const clamp = (u) => Math.min(1, Math.max(0, u));
    const bump = (t, a, d) => (t > a && t < a + d) ? Math.sin(Math.PI * (t - a) / d) : 0;
    const lerp = (a, b, u) => a + (b - a) * u;
    const at = (x, y, a, s) => "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ") rotate(" + (a || 0).toFixed(2) + ") scale(" + (s == null ? 1 : s).toFixed(3) + ")";
    const setT = (id, v) => $(id).setAttribute("transform", v);
    const rot = (id, a, cx, cy) => setT(id, "rotate(" + a.toFixed(2) + " " + cx + " " + cy + ")");
    const qbez = (P0, P1, P2, u) => [(1 - u) * (1 - u) * P0[0] + 2 * u * (1 - u) * P1[0] + u * u * P2[0], (1 - u) * (1 - u) * P0[1] + 2 * u * (1 - u) * P1[1] + u * u * P2[1]];

    // ---- 0 to 1: the question; a bit card, a lone qubit ----
    write("#b-nmA0", T.alice0 - 0.05, 0.4); write("#b-nmB0", T.bob0 - 0.05, 0.3);
    draw("#b-c1r", T.two0 - 0.1, 0.4); draw("#b-c2r", T.two0 + 0.12, 0.4);
    write("#b-c1v1", T.two0 + 0.2, 0.25); write("#b-c2v1", T.two0 + 0.42, 0.25);
    draw("#b-path0", T.posting0 - 0.1, 0.7); draw("#b-env0", T.posting0 + 0.25, 0.6);
    draw("#b-q0", T.one0 - 0.3, 0.3);
    write("#b-qm0", T.one0, 0.3);
    blurOut("#b-title", T.qubit0 - 0.2);
    fade(["#b-path0", "#b-env0", "#b-q0", "#b-qm0", "#b-card2"], 0, T.s1 + 0.2, 0.3);
    move("#b-card1", { x: 0, y: 0, scale: 1 }, { x: 345, y: -30, scale: 1.3 }, T.s1 + 0.1, 0.8);
    write("#b-bitdef", T.zero1 - 0.1, 0.7);
    draw("#b-q1", T.lone1 - 0.1, 0.6);
    write("#b-lone", T.only1 - 0.15, 0.9);
    draw("#b-ar1", T.carry1 - 0.1, 0.4);
    draw("#b-ghost", T.oneb1 - 0.15, 0.3); draw("#b-gx", T.oneb1 + 0.2, 0.3);
    fade(["#b-nmA0", "#b-nmB0"], 0, T.off1 - 0.2, 0.3);
    blurOut(["#b-card1", "#b-s1", "#b-bitdef", "#b-lone"], T.off1);
    const FLIPS = [T.zero1 - 0.12, T.one1 - 0.12, T.lone1 + 0.2, T.carry1 - 0.15];
    onFrame((t) => {
      setT("b-q0p", at(600, sched([[T.one0 + 0.05, T.one0 + 0.5, 560, 720]], t, 560)));
      let n = 0, sx = 1;
      FLIPS.forEach((f) => { if (t >= f + 0.15) n++; if (t > f && t < f + 0.3) sx = Math.abs(Math.cos(Math.PI * (t - f) / 0.3)); });
      $("b-card1i").style.transform = "scaleX(" + Math.max(0.04, sx).toFixed(3) + ")";
      $("b-c1v1").style.opacity = n % 2 ? "0" : "1";
      $("b-c1v0").style.opacity = n % 2 ? "1" : "0";
    });

    // ---- 2 to 4: the safe, the two keys, the posted key ----
    draw(["#b-safe", "#b-wheel", "#b-kh"], T.picture2 - 0.1, 1.7);
    draw("#b-khg1", T.two2 - 0.05, 0.3); draw("#b-khg2", T.two2 + 0.2, 0.3);
    write("#b-open2", T.opens2 - 0.05, 0.8);
    fade(["#b-open2"], 0, T.s3 - 0.1);
    fade(["#b-khg1", "#b-khg2"], 0, T.bob3, 0.4);
    write("#b-nmB3", T.bob3 - 0.05, 0.3);
    draw("#b-kB", T.bob3 + 0.3, 0.8);
    write("#b-nmA3", T.alice3 - 0.05, 0.4);
    draw("#b-kA", T.alice3 + 0.05, 0.8);
    draw("#b-ptr", T.sets3 - 0.1, 0.3);
    write("#b-pos4", T.positions3 - 0.15, 0.6);
    fade("#b-pos4", 0, T.posts3 - 0.5, 0.3);
    draw("#b-envK", T.posts3 - 0.45, 0.35);
    draw("#b-postP", T.posts3 - 0.2, 0.5);
    fade(["#b-envK", "#b-postP"], 0, T.both4 + 0.2, 0.3);
    draw("#b-win", T.tell4 - 0.1, 0.4); draw("#b-wic", T.tell4 + 0.25, 0.5);
    draw("#b-wicg", T.position4 - 0.05, 0.3); draw("#b-wtk", T.chose4 - 0.05, 0.3);
    blurOut(["#b-safeL", "#b-keysL"], T.off4);
    const GO = T.posts3 + 0.1, ARR = T.posts3 + 1.05, KIN = T.posts3 - 0.26, INS = T.both4 - 0.05;
    onFrame((t) => {
      const wob = t > T.picture2 && t < T.tell4 ? 7 * Math.sin((t - T.picture2) * 1.6) : 0;
      rot("b-wheelp", wob + sched([[T.tell4, T.tell4 + 1.0, 0, 200]], t, 0), 960, 545);
      const [ex, ey] = qbez(ENV.P0, ENV.P1, ENV.P2, ease.inOut((t - GO) / (ARR - GO)));
      setT("b-envKp", at(ex, ey));
      const m1 = ease.inOut((t - KIN) / 0.3), m2 = ease.inOut((t - INS) / 0.8);
      const ax = lerp(lerp(270, ex - 47, m1), 870, m2), ay = lerp(lerp(450, ey, m1), 772, m2);
      const as = lerp(lerp(1, 0.55, m1), 0.6, m2), aa = lerp(0, -90, m2);
      setT("b-kAp", at(ax, ay, aa, as));
      setT("b-kBp", at(lerp(1650, 1050, m2), lerp(430, 772, m2), lerp(180, 270, m2), lerp(1, 0.6, m2)));
      const sweep = sched([[T.four3 - 0.1, T.four3 + 0.7, -90, 360]], t, -90);
      setT("b-ptrp", "rotate(" + (sweep - aa).toFixed(2) + ")");
    });

    // ---- 5 to 6: keys become a Bell pair; shared in advance ----
    draw("#b-sk", T.quantum5 - 0.15, 0.4);
    fade("#b-sk", 0, T.keys5 + 0.1, 0.35);
    draw(["#b-qA", "#b-qB"], T.keys5 + 0.05, 0.6);
    write("#b-bellp", T.bell5 - 0.05, 0.5);
    write(["#b-rdA", "#b-rdB"], T.readings5 - 0.1, 0.25);
    write("#b-rand", T.random5 - 0.05, 0.4);
    write("#b-eq5", T.always5 - 0.05, 0.3);
    fade("#b-rand", 0, T.always5 - 0.05, 0.2); write("#b-match", T.always5, 0.7);
    fade(["#b-rdA", "#b-rdB", "#b-eq5", "#b-match"], 0, T.alice6 - 0.2, 0.35);
    draw(["#b-clk", "#b-clkhg"], T.advance6 - 0.25, 0.6); write("#b-adv", T.advance6, 0.8);
    fade("#b-bellp", 0, T.alice6 - 0.15, 0.3);
    fade(["#b-clk", "#b-clkhg", "#b-adv"], 0, T.s7 - 0.1);

    // ---- 7 to 10: four twists, four messages, four Bell states ----
    draw("#b-tw", T.twists7 - 0.15, 0.4);
    draw("#b-cd0", T.nothing7 - 0.15, 0.35); write("#b-ct0", T.nothing7, 0.45);
    draw("#b-cd1", T.z7 - 0.2, 0.3); write("#b-ct1", T.z7 - 0.05, 0.2);
    draw("#b-cd2", T.x7 - 0.15, 0.25); write("#b-ct2", T.x7 - 0.05, 0.2);
    draw("#b-cd3", T.both7 - 0.05, 0.3); write("#b-ct3", T.both7 + 0.1, 0.35);
    fade("#b-tw", 0, T.s8 - 0.05);
    draw("#b-hz", T.half8 - 0.3, 0.6); draw("#b-hx", T.half8 + 0.05, 0.6); write("#b-half", T.half8 + 0.1, 0.6);
    write("#b-dg0", T.zz8 - 0.05, 0.3); write("#b-dg1", T.zo8 - 0.05, 0.3); write("#b-dg2", T.oz8 - 0.05, 0.3); write("#b-dg3", T.oo8 - 0.05, 0.3);
    draw("#b-cdg", T.oo8 + 0.05, 0.4);
    fade(["#b-ct3", "#b-dg3"], 0, T.oo8 + 0.3, 0.3); write(["#b-ct3g", "#b-dg3g"], T.oo8 + 0.25, 0.4);
    fade(["#b-hz", "#b-hx", "#b-half"], 0, T.s9 - 0.1);
    [0, 1, 2, 3].forEach((i) => draw("#b-pi" + i, T.different9 - 0.1 + i * 0.25, 0.4));
    write("#b-4bs", T.bell9 - 0.1, 0.7);
    draw("#b-dv", T.told10 - 0.1, 0.6);
    [0, 1, 2, 3].forEach((i) => draw("#b-tk" + i, T.told10 + 0.35 + i * 0.18, 0.3));
    draw("#b-gl", T.both10 - 0.3, 0.4); write("#b-glq", T.both10, 0.25); draw("#b-glx", T.both10 + 0.25, 0.3);
    draw("#b-ov", T.together10 - 0.4, 0.45); draw("#b-ovtk", T.together10 - 0.05, 0.25); write("#b-btog", T.together10 - 0.2, 0.5);
    const S10 = ["#b-cdg", "#b-ct3g", "#b-dg3g", "#b-dv", "#b-gl", "#b-glq", "#b-glx", "#b-ov", "#b-ovtk", "#b-btog", "#b-4bs"];
    [0, 1, 2, 3].forEach((i) => S10.push("#b-cd" + i, "#b-ct" + i, "#b-dg" + i, "#b-pi" + i, "#b-tk" + i));
    blurOut(S10, T.off10);
    write("#b-tag", T.off10 + 0.1, 0.4);

    // ---- 11 to 13: the post, Bob's undo, two bits read ----
    draw("#b-envA", T.posts11 - 0.05, 0.45);
    draw("#b-path11", T.posts11, 0.5);
    fade(["#b-envA", "#b-path11"], 0, T.both11, 0.35);
    fade("#b-nmA3", 0, T.qubit11 + 0.6);
    write("#b-bh", T.both11 - 0.05, 0.6);
    fade(["#b-tag", "#b-bh", "#b-nmB3"], 0, T.s12 - 0.1);
    draw("#b-wr", T.s12 + 0.3, 0.8);
    write("#b-note", T.recipe12 - 0.1, 0.9);
    draw("#b-back", T.back12 - 0.1, 0.5);
    draw("#b-cn", T.cnot12 - 0.15, 0.5);
    draw("#b-hb", T.h12 - 0.2, 0.3); write("#b-hL", T.h12 - 0.05, 0.2);
    fade(["#b-note", "#b-back"], 0, T.s13 - 0.05);
    fade(["#b-qA", "#b-qB"], 0, T.measures13 - 0.15, 0.3);
    draw("#b-mt", T.measures13 - 0.1, 0.6);
    write("#b-o1", T.two13 - 0.1, 0.25); write("#b-o2", T.two13 + 0.05, 0.25);
    draw("#b-br", T.two13 + 0.25, 0.35); write("#b-o11", T.two13 + 0.4, 0.35);
    write("#b-every", T.certain13 - 0.2, 0.45);
    blurOut(["#b-wr", "#b-cn", "#b-hb", "#b-hL", "#b-mt", "#b-o1", "#b-o2", "#b-br", "#b-o11", "#b-every"], T.off13);

    // The pair: two circles that move between scenes, and the gold link between them.
    const linkD = (L, R, rl, rr, rev, amp, ph) => {
      const dx = R[0] - L[0], dy = R[1] - L[1], dist = Math.hypot(dx, dy) || 1;
      const arch = Math.max(0, dist - 300) * 0.5, nx = dy / dist, ny = -dx / dist;
      const C = [(L[0] + R[0]) / 2 + nx * arch, (L[1] + R[1]) / 2 + ny * arch];
      const a0 = Math.atan2(C[1] - L[1], C[0] - L[0]), a1 = Math.atan2(C[1] - R[1], C[0] - R[0]);
      const P0 = [L[0] + (rl - 1) * Math.cos(a0), L[1] + (rl - 1) * Math.sin(a0)], P2 = [R[0] + (rr - 1) * Math.cos(a1), R[1] + (rr - 1) * Math.sin(a1)];
      const waves = Math.max(1.5, (Math.hypot(P2[0] - P0[0], P2[1] - P0[1]) + arch * 0.6) / 70);
      const N = 120, n = Math.round(N * rev);
      if (n < 2) return "";
      let d = "";
      for (let i = 0; i <= n; i++) {
        const u = i / N, A = (1 - u) * (1 - u), B = 2 * u * (1 - u), Cc = u * u;
        const x = A * P0[0] + B * C[0] + Cc * P2[0], y = A * P0[1] + B * C[1] + Cc * P2[1];
        const tx = 2 * (1 - u) * (C[0] - P0[0]) + 2 * u * (P2[0] - C[0]), ty = 2 * (1 - u) * (C[1] - P0[1]) + 2 * u * (P2[1] - C[1]);
        const tn = Math.hypot(tx, ty) || 1, w = amp * Math.sin(u * Math.PI * 2 * waves + ph) * Math.sin(Math.PI * u);
        d += (i ? " L" : "M") + (x - ty / tn * w).toFixed(1) + " " + (y + tx / tn * w).toFixed(1);
      }
      return d;
    };
    const A_X = [[T.alice6 - 0.05, T.alice6 + 0.85, 820, 380], [T.s7, T.s7 + 0.9, 380, 420], [T.qubit11 - 0.05, T.qubit11 + 1.05, 420, 1340], [T.s12, T.s12 + 0.9, 1340, 300], [T.cnot12 - 0.25, T.cnot12 + 0.45, 300, 900], [T.cnot12 + 0.45, T.cnot12 + 1.15, 900, 1180]];
    const A_Y = [[T.alice6 - 0.05, T.alice6 + 0.85, 500, 560], [T.s7, T.s7 + 0.9, 560, 520], [T.qubit11 - 0.05, T.qubit11 + 1.05, 520, 560], [T.s12, T.s12 + 0.9, 560, 460]];
    const A_S = [[T.s7, T.s7 + 0.9, 1, 1.25], [T.posts11, T.posts11 + 0.4, 1.25, 0.75], [T.s12, T.s12 + 0.9, 0.75, 0.6]];
    const B_X = [[T.bob6 - 0.05, T.bob6 + 0.85, 1100, 1560], [T.s12, T.s12 + 0.9, 1560, 300], [T.cnot12 - 0.25, T.cnot12 + 0.45, 300, 900], [T.cnot12 + 0.45, T.cnot12 + 1.15, 900, 1180]];
    const B_Y = [[T.bob6 - 0.05, T.bob6 + 0.85, 500, 560], [T.s12, T.s12 + 0.9, 560, 660]];
    const B_S = [[T.s7, T.s7 + 0.9, 1, 0.75], [T.s12, T.s12 + 0.9, 0.75, 0.6]];
    onFrame((t) => {
      const ax = sched(A_X, t), ay = sched(A_Y, t), as = sched(A_S, t), bx = sched(B_X, t), by = sched(B_Y, t), bs = sched(B_S, t);
      setT("b-qAp", at(ax, ay, 0, as)); setT("b-qBp", at(bx, by, 0, bs));
      setT("b-envAp", at(ax, ay));
      $("b-tag").style.transform = "translate(" + (ax - 420).toFixed(2) + "px," + (ay - 520).toFixed(2) + "px)";
      const rev = sched([[T.bell5 - 0.05, T.bell5 + 0.6, 0, 1]], t, 0);
      const sep = clamp((Math.hypot(bx - ax, by - ay) - 330) / 400);
      const pulse = bump(t, T.ent5 - 0.1, 0.55) + bump(t, T.ent5 + 0.45, 0.55) + bump(t, T.link12 - 0.1, 0.6);
      const link = $("b-link");
      link.setAttribute("d", t > T.measures13 ? "" : linkD([ax, ay], [bx, by], 80 * as, 80 * bs, rev, 10 - 4 * sep, t * 3.2));
      link.setAttribute("stroke-width", (4 + 4 * pulse - 1 * sep).toFixed(2));
      link.setAttribute("stroke-dasharray", sep > 0.5 ? "16 11" : "none");
      link.style.opacity = (t > T.s12 ? 1 - clamp((ax - 980) / 120) : 1).toFixed(3);
      // readings tick together: random, but always matching
      const kk = Math.max(0, Math.floor((t - T.readings5) / 0.5));
      const v = String([0, 1, 1, 0, 1, 0, 0, 1][kk % 8]);
      $("b-rdAt").textContent = v; $("b-rdBt").textContent = v;
      const pop = t > T.readings5 ? 1 + 0.14 * Math.max(0, 1 - ((t - T.readings5) % 0.5) / 0.18) : 1;
      $("b-rdA").style.transform = $("b-rdB").style.transform = "scale(" + pop.toFixed(3) + ")";
      // the clock's hand winds back: earlier
      rot("b-clkh", t > T.advance6 - 0.25 ? -(t - T.advance6 + 0.25) * 240 : 0, 780, 250);
      // the twist arrow circles Alice's qubit once
      rot("b-twp", sched([[T.twists7 - 0.15, T.twists7 + 0.75, 0, 360]], t, 0), 420, 520);
      // Bob's meters swing and then hold steady
      const sw = (t0) => sched([[t0, t0 + 0.35, -50, 45], [t0 + 0.35, t0 + 0.6, 45, 35]], t, -50);
      rot("b-nd1", sw(T.measures13 + 0.2), 1300, 485.2); rot("b-nd2", sw(T.measures13 + 0.35), 1300, 685.2);
    });

    // ---- 14 to 15: where the safe breaks ----
    draw("#b-ss", T.safe14 - 0.15, 0.7); draw("#b-crack", T.breaks14 - 0.1, 0.4); write("#b-ssl", T.breaks14 - 0.25, 0.8);
    draw("#b-benv", T.posted14 - 0.15, 0.6); draw(["#b-k14", "#b-p14"], T.key14 - 0.2, 0.7);
    draw("#b-g14", T.see14 - 0.5, 0.35);
    write("#b-see", T.position14 - 0.1, 0.6);
    fade(["#b-ss", "#b-crack", "#b-ssl"], 0, T.alone15 - 0.2);
    draw("#b-e15", T.alone15 - 0.05, 0.5); draw("#b-q15", T.alone15 + 0.3, 0.6);
    write("#b-tk15", T.random15 - 0.05, 0.2); write("#b-rnd15", T.random15 + 0.05, 0.5);
    draw(["#b-spy", "#b-eye"], T.spy15 - 0.35, 0.4);
    write("#b-ln", T.learns15 - 0.1, 0.7);
    fade("#b-eye", 0, T.nothing15 - 0.15, 0.2); write("#b-spyq", T.nothing15 - 0.1, 0.3); draw("#b-spyx", T.nothing15 + 0.1, 0.25);
    blurOut(["#b-brL", "#b-see", "#b-tk15", "#b-rnd15", "#b-spyq", "#b-ln"], T.off15);
    const RND = [1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0];
    onFrame((t) => {
      setT("b-g14p", at(sched([[T.see14 - 0.2, T.see14 + 0.5, 470, 698]], t, 470), sched([[T.see14 - 0.2, T.see14 + 0.5, 720, 520]], t, 720)));
      const ps = 1 + 0.35 * bump(t, T.position14 - 0.15, 0.7);
      setT("b-p14p", "scale(" + ps.toFixed(3) + ")");
      const hov = t > T.spy15 + 0.75 ? 7 * Math.sin((t - T.spy15) * 4.5) : 0;
      setT("b-spyp", at(sched([[T.spy15 - 0.05, T.spy15 + 0.75, 1650, 1350]], t, 1650) + hov, sched([[T.spy15 - 0.05, T.spy15 + 0.75, 250, 510]], t, 250)));
      const kk = Math.max(0, Math.floor((t - T.random15) / 0.3));
      $("b-tk15t").textContent = String(RND[kk % RND.length]);
    });

    // ---- 16 to 17: the message lives in the pair; no faster than light ----
    draw(["#b-q16a", "#b-q16b"], T.message16 - 0.35, 0.5); draw("#b-l16", T.message16, 0.4); write("#b-m11", T.message16 + 0.1, 0.4);
    draw("#b-ov16", T.only16 - 0.1, 0.8); write("#b-onlyp", T.only16, 0.8);
    fade(["#b-m11", "#b-onlyp"], 0, T.s17 - 0.15);
    move("#b-p16", { x: 0, y: 0, scale: 1 }, { x: -440, y: -50, scale: 0.6 }, T.s17, 0.9);
    draw("#b-tarr", T.not17 - 0.3, 0.9); write("#b-time", T.not17 + 0.5, 0.3);
    write("#b-ear", T.shared17 - 0.1, 0.9);
    draw("#b-p17", T.her17 - 0.1, 0.5); draw("#b-e17", T.her17 + 0.1, 0.5); write("#b-then", T.her17, 0.8);
    draw("#b-sun", T.no17 - 0.3, 0.3); draw("#b-ray", T.no17, 0.4); write("#b-nfl", T.no17 + 0.1, 0.8);
    blurOut(["#b-p16", "#b-ftl", "#b-time", "#b-ear", "#b-then", "#b-nfl"], T.off17);
    onFrame((t) => {
      setT("b-e17p", at(sched([[T.travels17, T.travels17 + 1.0, 1000, 1460]], t, 1000), 470));
    });

    // ---- 18: the closing circuit and the takeaway ----
    draw("#b-cw", T.shared18 - 0.1, 0.7);
    draw("#b-cleft", T.shared18 + 0.2, 0.5); write("#b-cH1", T.shared18 + 0.3, 0.2);
    draw("#b-csqg", T.pair18 - 0.1, 0.35);
    draw("#b-cbr", T.pair18 + 0.1, 0.3); write("#b-lbell", T.pair18 + 0.15, 0.6);
    draw("#b-ctw", T.qubit18 - 0.3, 0.4); write(["#b-cX", "#b-cZ"], T.qubit18 - 0.1, 0.25); write("#b-lal", T.qubit18, 0.4);
    draw("#b-cpost", T.qubit18 + 0.15, 0.35);
    draw("#b-cright", T.delivers18 - 0.1, 0.5); write("#b-cH2", T.delivers18 + 0.25, 0.2); write("#b-lbob", T.delivers18 + 0.2, 0.4);
    draw("#b-cmt", T.two18 - 0.3, 0.4);
    draw("#b-cbr2", T.two18, 0.3); write("#b-c2b", T.two18 + 0.1, 0.4);
    write("#b-take", T.two18 - 0.05, 1.0);
    draw("#b-tku", T.ent18 - 0.1, 0.6);
    onFrame((t) => {
      const amp = 8 + 9 * bump(t, T.ent18 - 0.1, 0.8);
      const ph = t * 3.6, csq = $("b-csq");
      let d = "";
      for (let i = 0; i <= 40; i++) { const u = i / 40; d += (i ? " L" : "M") + (590 + amp * Math.sin(u * Math.PI * 6 + ph) * Math.sin(Math.PI * u)).toFixed(1) + " " + (386 + 128 * u).toFixed(1); }
      csq.setAttribute("d", d);
      csq.setAttribute("stroke-width", (4 + 2.5 * bump(t, T.ent18 - 0.1, 0.8)).toFixed(2));
    });
  `;
  return { html, script, css: "" };
}
