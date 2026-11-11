// Lesson 21, "Running on a real chip". Follows plan.md: your circuit heads for a chip; the chip's qubits are
// wired only to neighbours; the long dinner table where guests swap seats; the coupling map and a CNOT along a
// wire; the transpiler adds SWAPs; a SWAP trades states; four qubits in a row, two SWAPs, then the CNOT; each
// SWAP opens into three CNOTs (one gate became seven); noise grows with the count; the table's shout vs the
// chip's no shortcut; before and after compute the same thing; think like the chip; the closing card.
// Gold is the travelling state (the gold guest, token A) or the number that matters right now.
export const phrases = [["Kiss kit's", "Qiskit's"], ["C NOTs", "CNOTs"]];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, lines, INK, GOLD, GROUND } = k;
  const DIMINK = "rgba(232,232,232,0.35)";
  const f1 = (n) => +(+n).toFixed(1);
  const C = (id, cx, cy, w, size, html, extra = "") => lbl(id, f1(cx - w / 2), f1(cy - size * 0.745), w, size, html, extra);
  const G = (id, inner) => `<g id="${id}">${inner}</g>`;
  const full = (id, svg, inner = "") => `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${inner}</div>`;
  const wrap = (id, inner) => `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px">${inner}</div>`;
  const hatch = (c, gap = 9) => ({ fill: c, fillStyle: "hachure", hachureGap: gap, fillWeight: 2 });
  const P = (gold) => (gold ? goldPen : pen);

  // ---------- Times, cued to the voice ----------
  const T = {
    circuit0: cue(0, "circuit"), run0: cue(0, "run"), real0: cue(0, "real"), chip0: cue(0, "chip"),
    catch1: cue(1, "catch"), chip1: cue(1, "chip"), qubit1: cue(1, "qubit"), wired1: cue(1, "wired"), other1: cue(1, "other"),
    picture2: cue(2, "picture"), dinner2: cue(2, "dinner"), guests2: cue(2, "guests"), chat2: cue(2, "chat"), neigh2: cue(2, "neighbo"),
    reach3: cue(3, "reach"), far3: cue(3, "far"), swap3: cue(3, "swap"), swap3b: cue(3, "swap", 1), spilled3: cue(3, "spilled"), drink3: cue(3, "drink"),
    chip4: cue(4, "chip"), wires4: cue(4, "wires"), join4: cue(4, "join"), neigh4: cue(4, "neighbo"), coupling4: cue(4, "coupling"),
    l5: cue(5), gate5: cue(5, "gate"), cnot5: cue(5, "CNOT"), wire5: cue(5, "wire"),
    l6: cue(6), circuit6: cue(6, "circuit"), cnot6: cue(6, "CNOT"), neigh6: cue(6, "neighbo"),
    kiss7: cue(7, "kiss"), transpiler7: cue(7, "transpiler"), fits7: cue(7, "fits"), chip7: cue(7, "chip"), add7: cue(7, "add"), swap7: cue(7, "swap"), end7: lines[7].end,
    swap8: cue(8, "swap"), trades8: cue(8, "trades"), states8: cue(8, "states"), guests8: cue(8, "guests"), trading8: cue(8, "trading"), routing8: cue(8, "routing"),
    take9: cue(9, "take"), four9: cue(9, "four"), row9: cue(9, "row"), cnot9: cue(9, "CNOT"), last9: cue(9, "last"), two9: cue(9, "two"),
    walk10: cue(10, "walk"), next10: cue(10, "next"), cnot10: cue(10, "CNOT"),
    swap11: cue(11, "swap"), three11: cue(11, "three"), one11: cue(11, "one"), seven11: cue(11, "seven"),
    cnot12: cue(12, "CNOT"), error12: cue(12, "error"), noise12: cue(12, "noise"), more12: cue(12, "more"), noisier12: cue(12, "noisier"),
    heres13: cue(13, "here's"), dinner13: cue(13, "dinner"), breaks13: cue(13, "breaks"), always13: cue(13, "always"), just13: cue(13, "just"), shout13: cue(13, "shout"),
    chip14: cue(14, "chip"), shortcut14: cue(14, "shortcut"), distant14: cue(14, "distant"), interact14: cue(14, "interact"),
    state14: cue(14, "state"), side14: cue(14, "side"), side14b: cue(14, "side", 1), the15: cue(14, "the"),
    rewritten15: cue(15, "rewritten"), different15: cue(15, "different"), computes15: cue(15, "computes"), noise15: cue(15, "noise"),
    think16: cue(16, "think"), together16: cue(16, "together"), circuits16: cue(16, "circuits"), short16: cue(16, "short"),
    chips17: cue(17, "chips"), connect17: cue(17, "connect"), routing17: cue(17, "routing"), every17: cue(17, "every"), noise17: cue(17, "noise"),
  };

  // ===================== Shared drawing helpers =====================
  const solidBox = (x, y, w, h, o = {}) => r.rect(x, y, w, h, pen({ strokeWidth: 3, roughness: 1, fill: GROUND, fillStyle: "solid", ...o }));
  function curveArrow(pts, o = {}, head = 14) {
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const hp = (da) => [b[0] - head * Math.cos(ang + da), b[1] - head * Math.sin(ang + da)];
    const [h1, h2] = [hp(0.5), hp(-0.5)];
    const p = P(o.gold);
    const oo = { ...o }; delete oo.gold;
    return r.curve(pts, p(oo)) + r.line(b[0], b[1], h1[0], h1[1], p(oo)) + r.line(b[0], b[1], h2[0], h2[1], p(oo));
  }
  const quad = (p0, c, p1, n = 48) => Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    return [(1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * c[0] + u * u * p1[0], (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * c[1] + u * u * p1[1]];
  });
  // Dashes along a polyline.
  function dotted(pts, o = {}, dash = 14, gap = 11) {
    const p = P(o.gold);
    const oo = { strokeWidth: 2.6, roughness: 0.5, ...o }; delete oo.gold;
    let s = "", acc = 0, on = true, cur = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      let [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      let seg = Math.hypot(x1 - x0, y1 - y0);
      while (seg > 0) {
        const need = (on ? dash : gap) - acc;
        if (seg < need) { acc += seg; seg = 0; if (on) cur.push([x1, y1]); break; }
        const u = need / seg, nx = x0 + (x1 - x0) * u, ny = y0 + (y1 - y0) * u;
        if (on) { cur.push([nx, ny]); s += r.linear(cur, p(oo)); }
        on = !on; acc = 0; cur = [[nx, ny]];
        seg -= need; x0 = nx; y0 = ny;
      }
    }
    if (on && cur.length > 1) s += r.linear(cur, p(oo));
    return s;
  }
  // A CNOT from (x1,y1) (control dot) to (x2,y2) (target ⊕), along any direction.
  function cnot(x1, y1, x2, y2, o = {}) {
    const p = P(o.gold), sw = o.sw ?? 3, rT = o.rT ?? 17, dot = o.dot ?? 17;
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    const col = o.gold ? GOLD : o.stroke ?? INK;
    const extra = o.stroke ? { stroke: o.stroke } : {};
    return r.line(x1, y1, x2 + ux * rT, y2 + uy * rT, p({ strokeWidth: sw, roughness: 0.6, ...extra })) +
      r.circle(x1, y1, dot, p({ fill: col, fillStyle: "solid", strokeWidth: 2, roughness: 0.5, ...extra })) +
      r.circle(x2, y2, 2 * rT, p({ strokeWidth: sw, roughness: 0.7, ...extra })) +
      r.line(x2 - uy * rT, y2 + ux * rT, x2 + uy * rT, y2 - ux * rT, p({ strokeWidth: sw * 0.85, roughness: 0.5, ...extra }));
  }
  // A SWAP: two small crosses joined by a line (vertical, on two circuit wires).
  function swapV(x, y1, y2, o = {}, s = 12) {
    const p = P(o.gold), sw = o.sw ?? 3;
    const xm = (y) => r.line(x - s, y - s, x + s, y + s, p({ strokeWidth: sw, roughness: 0.5 })) + r.line(x - s, y + s, x + s, y - s, p({ strokeWidth: sw, roughness: 0.5 }));
    return r.line(x, y1, x, y2, p({ strokeWidth: sw, roughness: 0.6 })) + xm(y1) + xm(y2);
  }
  function meter(x, y, w = 56, h = 46) {
    return solidBox(x - w / 2, y - h / 2, w, h, { strokeWidth: 2.6 }) +
      r.arc(x, y + h * 0.3, w * 0.7, w * 0.7, Math.PI, 2 * Math.PI, false, pen({ strokeWidth: 2.2, roughness: 0.7 })) +
      r.line(x, y + h * 0.3, x + w * 0.24, y - h * 0.28, pen({ strokeWidth: 2.4, roughness: 0.5 }));
  }
  // A circuit: wires at ys from x0 to x1, then gates. Returns per-gate groups and labels.
  function circuit(p, x0, x1, ys, gates, o = {}) {
    const bw = o.box ?? 54, ls = o.lsize ?? 44;
    let svg = G(`${p}-w`, ys.map((y) => r.line(x0, y, x1, y, pen({ strokeWidth: 2.8, roughness: 0.9 }))).join(""));
    let html = "";
    gates.forEach((g, i) => {
      const id = `${p}-g${i}`;
      if (g.t === "H") { svg += G(id, solidBox(g.x - bw / 2, ys[g.q] - bw / 2, bw, bw, g.gold ? { stroke: GOLD } : {})); html += C(`${id}-l`, g.x, ys[g.q], 60, ls, "H"); }
      if (g.t === "cx") svg += G(id, cnot(g.x, ys[g.c], g.x, ys[g.q], { gold: g.gold, rT: o.rT ?? 15, sw: 2.8, dot: o.dot ?? 15 }));
      if (g.t === "sw") svg += G(id, swapV(g.x, ys[g.a], ys[g.b], { gold: g.gold, sw: 3 }, o.xs ?? 11));
      if (g.t === "m") svg += G(id, ys.map((y) => meter(g.x, y, bw, bw * 0.82)).join(""));
    });
    return { svg, html };
  }
  // A microchip: body, inner border, notch, pins on all sides, eight qubits in two rows of four, wires.
  const WIRES = [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [0, 4], [3, 7]];
  function chip(p, X0, Y0, W, H, s, o = {}) {
    const n = o.pins ?? 12, pl = 30 * s, psw = 2.4;
    let pins = "";
    for (let i = 0; i < n; i++) {
      const x = X0 + (W * (i + 0.5)) / n, y = Y0 + (H * (i + 0.5)) / n;
      pins += r.line(x, Y0, x, Y0 - pl, pen({ strokeWidth: psw, roughness: 0.6 })) + r.line(x, Y0 + H, x, Y0 + H + pl, pen({ strokeWidth: psw, roughness: 0.6 }));
      pins += r.line(X0, y, X0 - pl, y, pen({ strokeWidth: psw, roughness: 0.6 })) + r.line(X0 + W, y, X0 + W + pl, y, pen({ strokeWidth: psw, roughness: 0.6 }));
    }
    const body = r.rect(X0, Y0, W, H, pen({ strokeWidth: 3.6, roughness: 1 })) +
      r.rect(X0 + 18 * s, Y0 + 18 * s, W - 36 * s, H - 36 * s, pen({ strokeWidth: 1.6, stroke: DIMINK, roughness: 0.8 })) +
      r.circle(X0 + 44 * s, Y0 + 44 * s, 16 * s, pen({ strokeWidth: 2 }));
    const QX = [140, 320, 480, 660].map((v) => X0 + v * s), QY = [140, 380].map((v) => Y0 + v * s), R = 38 * s;
    const Q = [...QX.map((x) => [x, QY[0]]), ...QX.map((x) => [x, QY[1]])];
    let svg = G(`${p}-body`, body) + G(`${p}-pins`, pins);
    const wireLine = (a, b, pp) => {
      const [ax, ay] = Q[a], [bx, by] = Q[b], L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, g = R + 3;
      return r.line(ax + ux * g, ay + uy * g, bx - ux * g, by - uy * g, pp);
    };
    svg += WIRES.map(([a, b], i) => G(`${p}-w${i}`, wireLine(a, b, pen({ strokeWidth: 3 * Math.max(0.8, s), roughness: 0.8 })))).join("");
    if (o.goldWires) svg += WIRES.map(([a, b], i) => G(`${p}-wg${i}`, wireLine(a, b, goldPen({ strokeWidth: 4.4, roughness: 0.6 })))).join("");
    svg += Q.map(([x, y], i) => G(`${p}-q${i}`, r.circle(x, y, 2 * R, pen({ strokeWidth: 3.2 * Math.max(0.8, s), roughness: 1 })))).join("");
    // Gold highlight discs for "this qubit matters now".
    if (o.lit) svg += o.lit.map((i) => G(`${p}-lit${i}`, r.circle(Q[i][0], Q[i][1], 2 * R - 10 * s, { ...hatch(GOLD, 8 * s + 2), stroke: GOLD, strokeWidth: 4, roughness: 0.9, seed: 900 + i }))).join("");
    return { svg, Q, R };
  }
  // A stick guest seen behind the table: head, body, arms reaching the table top.
  function guest(x, hy, hr, gold, o = {}) {
    const p = P(gold), sw = gold ? 3.6 : 3;
    const top = hy + hr, table = o.table ?? hy + 130;
    return r.circle(x, hy, 2 * hr, p({ strokeWidth: sw })) +
      r.circle(x - hr * 0.35, hy - hr * 0.12, hr * 0.16, p({ fill: gold ? GOLD : INK, fillStyle: "solid", strokeWidth: 1 })) +
      r.circle(x + hr * 0.35, hy - hr * 0.12, hr * 0.16, p({ fill: gold ? GOLD : INK, fillStyle: "solid", strokeWidth: 1 })) +
      r.arc(x, hy + hr * 0.25, hr * 0.8, hr * 0.5, 0.2, Math.PI - 0.2, false, p({ strokeWidth: 2.2, roughness: 0.6 })) +
      r.line(x, top, x, table, p({ strokeWidth: sw })) +
      r.line(x, top + hr * 0.75, x - hr * 1.1, table - 6, p({ strokeWidth: sw * 0.9 })) +
      r.line(x, top + hr * 0.75, x + hr * 1.1, table - 6, p({ strokeWidth: sw * 0.9 }));
  }
  // The long dinner table seen from the front, shifted by dy. The top hides what is behind it.
  function table(p, dy, gx) {
    const ty = 560 + dy;
    const top = r.rect(220, ty, 1480, 40, pen({ strokeWidth: 3.4, roughness: 1, fill: GROUND, fillStyle: "solid" }));
    const legs = r.line(290, ty + 40, 296, ty + 200, pen({ strokeWidth: 3.4 })) + r.line(1630, ty + 40, 1624, ty + 200, pen({ strokeWidth: 3.4 }));
    let fringe = "";
    for (let x = 240; x < 1690; x += 36) fringe += r.curve([[x, ty + 42], [x + 9, ty + 58], [x + 18, ty + 46], [x + 27, ty + 58], [x + 36, ty + 42]], pen({ strokeWidth: 1.8, roughness: 0.6 }));
    const cups = gx.map((x, i) => G(`${p}-cup${i}`, r.poly([[x + 42, ty - 44], [x + 82, ty - 44], [x + 76, ty - 2], [x + 48, ty - 2]], pen({ strokeWidth: 2.6, roughness: 0.8 })) +
      r.line(x + 46, ty - 32, x + 78, ty - 32, pen({ strokeWidth: 1.6, stroke: DIMINK, roughness: 0.5 })))).join("");
    return { top: G(`${p}-top`, top + legs), fringe: G(`${p}-fr`, fringe), cups };
  }
  // A token: a disc with a letter. The outer div is moved every frame, the inner one pops.
  function token(id, cx, cy, R, letter, gold) {
    const D = 2 * R, S = Math.round(R * 1.3);
    const disc = gold
      ? r.circle(R, R, D - 8, pen({ stroke: GOLD, strokeWidth: 3, fill: GOLD, fillStyle: "solid", roughness: 0.9 }))
      : r.circle(R, R, D - 8, pen({ strokeWidth: 2.8, fill: GROUND, fillStyle: "solid", roughness: 0.9 }));
    return `<div class="obj" id="${id}" style="left:${cx - R}px;top:${cy - R}px;width:${D}px;height:${D}px"><div class="obj" id="${id}-i" style="left:0;top:0;width:${D}px;height:${D}px">` +
      `<svg class="sk" width="${D}" height="${D}" viewBox="0 0 ${D} ${D}">${disc}</svg>${lbl(id + "-l", 0, f1(R - S * 0.745), D, S, letter, `color:${gold ? GROUND : INK};font-weight:700`)}</div></div>`;
  }
  // A bar whose height the timeline sets (clip rect id-cr) with outline id-o.
  function vbar(id, x, w, yBot, hMax, color, gap = 9) {
    const body = r.rect(x + 3, yBot - hMax, w - 6, hMax, pen({ ...hatch(color, gap), stroke: "none", roughness: 1.1 }));
    return `<defs><clipPath id="${id}-c"><rect id="${id}-cr" x="${x - 4}" y="${yBot}" width="${w + 8}" height="0"/></clipPath></defs>` +
      `<g id="${id}"><g clip-path="url(#${id}-c)">${body}</g><path id="${id}-o" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }
  const bracketUp = (x1, x2, y, o = {}, tick = 16) => {
    const p = P(o.gold);
    return r.line(x1, y, x2, y, p({ strokeWidth: 3 })) + r.line(x1, y, x1, y - tick, p({ strokeWidth: 2.8 })) + r.line(x2, y, x2, y - tick, p({ strokeWidth: 2.8 }));
  };
  // An arrow head at the end of a polyline.
  const headAt = (pts, hd = 16, gold = false) => {
    const [a, b] = [pts[pts.length - 3], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    return [0.5, -0.5].map((da) => r.line(b[0], b[1], b[0] - hd * Math.cos(ang + da), b[1] - hd * Math.sin(ang + da), P(gold)({ strokeWidth: 3.2, roughness: 0.5 }))).join("");
  };
  const cross = (x, y, s, o = {}) => r.line(x - s, y - s, x + s, y + s, pen({ strokeWidth: 4.4, roughness: 0.8, ...o })) + r.line(x + s, y - s, x - s, y + s, pen({ strokeWidth: 4.4, roughness: 0.8, ...o }));
  const tick = (x, y, s, o = {}) => r.linear([[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.9]], P(o.gold)({ strokeWidth: 4.2, roughness: 0.6 }));
  // Small specks (plain circles, moved every frame).
  const specks = (id, n, col = INK) => Array.from({ length: n }, (_, i) => `<circle id="${id}${i}" cx="0" cy="0" r="5" fill="${col}" opacity="0"/>`).join("");

  // ===================== Scene 0: your circuit heads for a chip (line 0) =====================
  const c0 = circuit("b-c0", 300, 800, [440, 500, 560, 620], [{ t: "H", x: 400, q: 0 }, { t: "cx", x: 540, c: 0, q: 3 }, { t: "m", x: 700 }], { box: 54 });
  let miniPins = "";
  for (let i = 0; i < 8; i++) {
    const x = 1150 + (400 * (i + 0.5)) / 8, y = 380 + (300 * (i + 0.5)) / 8;
    miniPins += r.line(x, 380, x, 356, pen({ strokeWidth: 2.2, roughness: 0.5 })) + r.line(x, 680, x, 704, pen({ strokeWidth: 2.2, roughness: 0.5 }));
    miniPins += r.line(1150, y, 1126, y, pen({ strokeWidth: 2.2, roughness: 0.5 })) + r.line(1550, y, 1574, y, pen({ strokeWidth: 2.2, roughness: 0.5 }));
  }
  const MQ = [1250, 1316, 1384, 1450].flatMap((x) => [[x, 480], [x, 580]]);
  const miniChip =
    G("b-mc-body", r.rect(1150, 380, 400, 300, pen({ strokeWidth: 3.4 })) + miniPins) +
    G("b-mc-in", r.line(1250, 480, 1450, 480, pen({ strokeWidth: 2 })) + r.line(1250, 580, 1450, 580, pen({ strokeWidth: 2 })) +
      r.line(1250, 480, 1250, 580, pen({ strokeWidth: 2 })) + r.line(1450, 480, 1450, 580, pen({ strokeWidth: 2 })) +
      MQ.map(([x, y]) => r.circle(x, y, 26, pen({ strokeWidth: 2.2, fill: INK, fillStyle: "solid" }))).join(""));
  const spark = `<g id="b-sparkT">${G("b-spark", [-80, -45, -10].map((a) => {
    const t = (a * Math.PI) / 180;
    return r.line(1572 + Math.cos(t) * 14, 358 + Math.sin(t) * 14, 1572 + Math.cos(t) * 50, 358 + Math.sin(t) * 50, goldPen({ strokeWidth: 4.2, roughness: 0.6 }));
  }).join(""))}</g>`;
  const s0 = wrap("b-s0",
    full("b-s0a", c0.svg + G("b-run", arrow(850, 530, 1060, 530, { strokeWidth: 3.4 }, 22)), c0.html + C("b-yc0", 550, 700, 320, 48, "your circuit")) +
    full("b-s0chip", miniChip + spark, C("b-chiplbl", 1350, 760, 300, 48, "real chip")));

  // ===================== Scene 1: a chip, wired only to neighbours (line 1) =====================
  const ch1 = chip("b-k1", 560, 280, 800, 520, 1);
  const [q0x, q0y] = ch1.Q[0], [q7x, q7y] = ch1.Q[7];
  const dl = Math.hypot(q7x - q0x, q7y - q0y), dux = (q7x - q0x) / dl, duy = (q7y - q0y) / dl;
  const s1 = wrap("b-s1", full("b-s1a",
    ch1.svg + G("b-qptr", arrow(392, 420, 652, 420, { strokeWidth: 2.8 }, 16)) +
    G("b-k1-try", dotted([[q0x + dux * 44, q0y + duy * 44], [q7x - dux * 44, q7y - duy * 44]], { strokeWidth: 2.8 })) +
    G("b-k1-x", cross(960, 540, 34)),
    C("b-qlbl", 300, 420, 180, 52, "qubit")));

  // ===================== Scene 2: the long dinner table (lines 2 and 3) =====================
  const GX = [360, 670, 960, 1250, 1560];
  const tb = table("b-t", 0, GX);
  const bub = (cx) => r.ellipse(cx, 320, 130, 72, pen({ strokeWidth: 2.6 })) + r.line(cx - 12, 355, cx - 22, 382, pen({ strokeWidth: 2.4 })) +
    [-26, 0, 26].map((d) => r.circle(cx + d, 320, 9, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1 }))).join("");
  const dArrow = (x1, x2, y) => arrow(x1, y, x2, y, { strokeWidth: 2.6 }, 14) + arrow(x2, y, x1, y, { strokeWidth: 2.6 }, 14);
  const swapArrows = (x1, x2, y) => curveArrow([[x1 + 30, y], [(x1 + x2) / 2, y - 26], [x2 - 30, y]], { strokeWidth: 2.6 }, 13) +
    curveArrow([[x2 - 30, y + 26], [(x1 + x2) / 2, y + 52], [x1 + 30, y + 26]], { strokeWidth: 2.6 }, 13);
  const splash = r.curve([[748, 556], [790, 548], [840, 554], [880, 549], [905, 556]], pen({ strokeWidth: 3 })) +
    r.circle(806, 520, 12, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1 })) + r.circle(842, 500, 10, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1 })) +
    r.circle(878, 524, 9, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1 })) +
    r.curve([[770, 540], [790, 515], [812, 532]], pen({ strokeWidth: 2.2 })) + r.curve([[850, 540], [866, 512], [890, 530]], pen({ strokeWidth: 2.2 }));
  const s2svg =
    GX.map((x, i) => `<g id="b-gm${i}">${G(`b-gst${i}`, guest(x, 430, 34, i === 0))}</g>`).join("") +
    tb.top + tb.fringe + tb.cups +
    [0, 1, 2, 3].map((i) => G(`b-bub${i}`, bub((GX[i] + GX[i + 1]) / 2))).join("") +
    [0, 1, 2, 3].map((i) => G(`b-nar${i}`, dArrow(GX[i] + 40, GX[i + 1] - 40, 660))).join("") +
    G("b-far", dotted(quad([360, 380], [960, 150], [1540, 380]), { gold: true, strokeWidth: 3.2 })) +
    G("b-sa1", swapArrows(360, 670, 650)) + G("b-sa2", swapArrows(670, 960, 650)) +
    G("b-splash", splash);
  const s2 = wrap("b-s2", full("b-s2a", s2svg,
    C("b-neighl", 960, 742, 300, 48, "neighbours") + C("b-farq", 1630, 330, 80, 72, "?", `color:${GOLD}`) +
    C("b-risk", 830, 760, 360, 48, "every swap: a risk")));

  // ===================== Scene 3: the coupling map; a CNOT along a wire (lines 4 to 6) =====================
  const ch3 = chip("b-k3", 560, 280, 800, 520, 1, { goldWires: true, lit: [0, 1, 7] });
  const Q3 = ch3.Q;
  const ql = Math.hypot(Q3[7][0] - Q3[0][0], Q3[7][1] - Q3[0][1]);
  const qux = (Q3[7][0] - Q3[0][0]) / ql, quy = (Q3[7][1] - Q3[0][1]) / ql;
  const along = (f) => [Q3[0][0] + qux * ql * f, Q3[0][1] + quy * ql * f];
  const s3svg = ch3.svg +
    G("b-k3-nb", bracketUp(668, 912, 716)) +
    G("b-k3-cx", cnot(760, 420, 818, 420, { gold: true, rT: 17 })) +
    G("b-k3-tk", tick(948, 320, 18, { gold: true })) +
    G("b-k3-far", dotted([along(0.09), along(0.91)], { strokeWidth: 2.8 })) +
    `<g id="b-k3-fcx" opacity="0.6">${cnot(...along(0.36), ...along(0.64), { rT: 17 })}</g>`;
  const s3 = wrap("b-s3", full("b-s3a", s3svg,
    C("b-k3-nbl", 790, 758, 260, 44, "neighbours") + C("b-cmap", 960, 190, 520, 72, "coupling map", `color:${GOLD}`) +
    C("b-k3-cxl", 790, 330, 200, 56, "CNOT") + C("b-k3-q", 1140, 505, 80, 84, "?")));

  // ===================== Scene 4: the transpiler adds SWAPs (line 7) =====================
  const c4 = circuit("b-c4", 200, 560, [400, 460, 520, 580], [{ t: "H", x: 280, q: 0 }, { t: "cx", x: 440, c: 0, q: 3 }], { box: 48, lsize: 40 });
  const c4b = circuit("b-c4b", 1250, 1730, [400, 460, 520, 580],
    [{ t: "H", x: 1310, q: 0 }, { t: "sw", x: 1420, a: 0, b: 1, gold: true }, { t: "sw", x: 1530, a: 1, b: 2, gold: true }, { t: "cx", x: 1650, c: 2, q: 3 }], { box: 48, lsize: 40 });
  const GC = [960, 466], GR = 84;
  let gear = r.circle(GC[0], GC[1], GR * 1.5, pen({ strokeWidth: 3.2 })) + r.circle(GC[0], GC[1], 34, pen({ strokeWidth: 2.6 }));
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI * 2) / 10, c = Math.cos(a), s = Math.sin(a), pc = -s, ps = c, hw = 11;
    const r0 = GR * 0.75, r1 = GR * 1.0;
    gear += r.linear([[GC[0] + c * r0 + pc * hw, GC[1] + s * r0 + ps * hw], [GC[0] + c * r1 + pc * hw, GC[1] + s * r1 + ps * hw], [GC[0] + c * r1 - pc * hw, GC[1] + s * r1 - ps * hw], [GC[0] + c * r0 - pc * hw, GC[1] + s * r0 - ps * hw]], pen({ strokeWidth: 2.8, roughness: 0.6 }));
  }
  let tPins = "";
  for (let i = 0; i < 6; i++) { const x = 908 + i * 21; tPins += r.line(x, 574, x, 562, pen({ strokeWidth: 2, roughness: 0.4 })) + r.line(x, 616, x, 628, pen({ strokeWidth: 2, roughness: 0.4 })); }
  const s4svg = c4.svg + c4b.svg +
    G("b-tin", arrow(590, 490, 748, 490, { strokeWidth: 3.2 }, 18)) +
    G("b-tbox", r.rect(760, 340, 400, 300, pen({ strokeWidth: 3.6, roughness: 1 }))) +
    `<g id="b-gearR">${G("b-gear", gear)}</g>` +
    G("b-tchip", r.rect(896, 574, 128, 42, pen({ strokeWidth: 2.6 })) + tPins) +
    G("b-tout", arrow(1172, 490, 1236, 490, { strokeWidth: 3.2 }, 16));
  const s4 = wrap("b-s4", full("b-s4a", s4svg,
    c4.html + c4b.html + C("b-yc4", 380, 650, 300, 44, "your circuit") + C("b-tpl", 960, 290, 320, 56, "transpiler") +
    C("b-swl", 1475, 650, 220, 48, "SWAPs", `color:${GOLD}`)));

  // ===================== Scene 5: a SWAP trades states (line 8) =====================
  const S5 = { l: 700, r: 1220, y: 380, R: 70 };
  const s5svg =
    G("b-s5c", r.circle(S5.l, S5.y, 2 * S5.R, pen({ strokeWidth: 3.4 })) + r.circle(S5.r, S5.y, 2 * S5.R, pen({ strokeWidth: 3.4 }))) +
    G("b-s5w", r.line(S5.l + S5.R + 4, S5.y, S5.r - S5.R - 4, S5.y, pen({ strokeWidth: 3 })) +
      [930, 990].map((x) => r.line(x - 13, S5.y - 13, x + 13, S5.y + 13, pen({ strokeWidth: 3.2, roughness: 0.5 })) + r.line(x - 13, S5.y + 13, x + 13, S5.y - 13, pen({ strokeWidth: 3.2, roughness: 0.5 }))).join("")) +
    G("b-s5top", curveArrow([[740, 262], [960, 150], [1180, 262]], { strokeWidth: 2.8 }, 16)) +
    G("b-s5bot", curveArrow([[1180, 498], [960, 610], [740, 498]], { strokeWidth: 2.8 }, 16)) +
    `<g id="b-mg0">${G("b-mgst0", guest(870, 724, 22, true, { table: 790 }))}</g>` +
    `<g id="b-mg1">${G("b-mgst1", guest(1050, 724, 22, false, { table: 790 }))}</g>` +
    G("b-mtab", r.rect(780, 790, 360, 22, pen({ strokeWidth: 3, fill: GROUND, fillStyle: "solid" })) + r.line(800, 812, 802, 846, pen({ strokeWidth: 3 })) + r.line(1120, 812, 1118, 846, pen({ strokeWidth: 3 })));
  const s5 = wrap("b-s5", full("b-s5a", s5svg,
    C("b-s5st", 960, 650, 520, 48, "states move, qubits stay") + C("b-routing", 960, 190, 400, 84, "routing", `color:${GOLD}`) +
    C("b-s5ql", S5.l, S5.y + S5.R + 40, 200, 44, "qubit") + C("b-s5qr", S5.r, S5.y + S5.R + 40, 200, 44, "qubit")) +
    token("b-vA", S5.l, S5.y, 48, "A", true) + token("b-vB", S5.r, S5.y, 48, "B", false));

  // ===================== Scenes 6 and 8: four qubits in a row =====================
  const RX = [380, 760, 1140, 1520], RY = 380, RR = 52;
  function row(p) {
    const svg = G(`${p}-c`, RX.map((x) => r.circle(x, RY, 2 * RR, pen({ strokeWidth: 3.4 }))).join("")) +
      G(`${p}-w`, [0, 1, 2].map((i) => r.line(RX[i] + RR + 4, RY, RX[i + 1] - RR - 4, RY, pen({ strokeWidth: 3 }))).join(""));
    const html = RX.map((x, i) => C(`${p}-l${i}`, x, RY + RR + 44, 90, 44, `q${i}`)).join("");
    return { svg, html };
  }
  const tokens = (p, gold = true) => ["A", "B", "C", "D"].map((L, i) => token(`${p}${L}`, RX[i], RY, 38, L, L === "A" && gold)).join("");
  const longArc = quad([400, 318], [950, 120], [1500, 318]);

  // ----- Scene 6 (lines 9 to 12): two swaps, then the CNOT; seven CNOTs; noise -----
  const r6 = row("b-r6");
  const SY = [620, 680, 740, 800];
  const SG = [460, 780, 1000];
  const CX7 = [360, 460, 560, 680, 780, 880, 1000];
  const CX7P = [[0, 1], [1, 0], [0, 1], [1, 2], [2, 1], [1, 2], [2, 3]];
  const strip =
    G("b-sw", SY.map((y) => r.line(260, y, 1100, y, pen({ strokeWidth: 2.6, roughness: 0.8 }))).join("")) +
    G("b-ss1", swapV(SG[0], SY[0], SY[1], { sw: 3 }, 12)) + G("b-ss1g", swapV(SG[0], SY[0], SY[1], { gold: true, sw: 3.6 }, 12)) +
    G("b-ss2", swapV(SG[1], SY[1], SY[2], { sw: 3 }, 12)) + G("b-ss2g", swapV(SG[1], SY[1], SY[2], { gold: true, sw: 3.6 }, 12)) +
    CX7.map((x, i) => G(`b-x7-${i}`, cnot(x, SY[CX7P[i][0]], x, SY[CX7P[i][1]], { rT: 15, dot: 15, sw: 2.8 }))).join("") +
    G("b-cnar", arrow(1306, 700, 1392, 700, { strokeWidth: 3 }, 16)) +
    CX7.map((_, i) => specks(`b-sp${i}-`, 3)).join("");
  const stripHtml = SY.map((y, i) => C(`b-sl${i}`, 214, y, 70, 40, `q${i}`)).join("") +
    C("b-cnt1", 1430, 700, 420, 48, "2 SWAPs + 1 CNOT") + C("b-cnt2", 1215, 700, 150, 48, "1 CNOT") + C("b-cnt3", 1560, 700, 260, 72, "7 CNOTs", `color:${GOLD}`);
  const s6row = r6.svg +
    G("b-r6-arc", dotted(longArc, { strokeWidth: 2.8 })) +
    `<g id="b-r6-acx" opacity="0.6">${cnot(920, 170, 980, 170, { rT: 15, dot: 15 })}</g>` +
    G("b-r6-x", cross(950, 172, 30)) +
    G("b-r6-br", bracketUp(1100, 1560, 512, { gold: true })) +
    G("b-r6-cx", cnot(1212, RY, 1438, RY, { gold: true, rT: 20, dot: 18, sw: 3.4 }));
  // Noise chart (line 12)
  const NB = { yb: 780, lx: 620, rx: 1140, w: 160, h: 190 };
  const s6noise =
    G("b-nbase", r.line(560, NB.yb, 1360, NB.yb, pen({ strokeWidth: 3 }))) +
    vbar("b-nb1", NB.lx, NB.w, NB.yb, NB.h, INK) + vbar("b-nb7", NB.rx, NB.w, NB.yb, NB.h, GOLD) +
    G("b-abase", r.line(1530, NB.yb, 1720, NB.yb, pen({ strokeWidth: 2.6 }))) +
    [0, 1, 2, 3].map((i) => vbar(`b-ans${i}`, 1546 + i * 44, 34, NB.yb, 170, INK, 7)).join("");
  const s6 = wrap("b-s6",
    full("b-s6row", s6row, r6.html + C("b-need", 950, 112, 200, 44, "needed") + C("b-nowire", 950, 250, 200, 40, "no wire") +
      C("b-nbnow", 1330, 556, 340, 44, "neighbours now", `color:${GOLD}`) + tokens("b-u")) +
    `<div class="obj" id="b-strip" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${strip}</svg>${stripHtml}</div>` +
    full("b-s6n", s6noise, C("b-nhead", 900, 520, 360, 48, "chance of error") + C("b-nnoise", 1112, 520, 200, 52, "= noise", `color:${GOLD}`) +
      C("b-nl1", NB.lx + NB.w / 2, 822, 200, 40, "1 CNOT") + C("b-nl7", NB.rx + NB.w / 2, 822, 200, 40, "7 CNOTs") + C("b-nans", 1625, 822, 200, 40, "answer")));

  // ----- Scene 7 (line 13): the table's shout -----
  const tb7 = table("b-t7", -120, GX);
  const shoutArc = (i) => `<g id="b-sh${i}">${r.arc(470, 230, 70, 110, -0.9, 0.9, false, goldPen({ strokeWidth: 4, roughness: 0.6 }))}</g>`;
  const s7svg =
    GX.map((x, i) => G(`b-g7${i}`, guest(x, 310, 34, i === 0))).join("") +
    tb7.top + tb7.fringe + tb7.cups +
    G("b-crack", r.linear([[972, 418], [948, 436], [976, 452], [944, 468], [970, 484], [952, 500]], pen({ strokeWidth: 4.6, roughness: 0.6 })) + r.line(948, 436, 918, 426, pen({ strokeWidth: 3 })) + r.line(976, 452, 1004, 446, pen({ strokeWidth: 3 }))) +
    G("b-mouth", r.ellipse(360, 322, 22, 18, goldPen({ fill: GOLD, fillStyle: "solid", strokeWidth: 2 }))) +
    [0, 1, 2].map(shoutArc).join("") +
    G("b-g5tick", tick(1626, 250, 20));
  const s7 = wrap("b-s7", full("b-s7a", s7svg, C("b-hey", 960, 150, 300, 72, "HEY!", `color:${GOLD}`)));

  // ----- Scene 8 (line 14): no shortcut on a chip -----
  const r8 = row("b-r8");
  const s8svg = r8.svg +
    G("b-r8-arc", dotted(longArc, { gold: true, strokeWidth: 3.4 }) + headAt(longArc, 18, true)) +
    G("b-r8-x", cross(950, 216, 40, { strokeWidth: 5 })) +
    G("b-r8-far", dotted([[380, 556], [1520, 556]], { strokeWidth: 2.6 }) + arrow(420, 556, 380, 556, { strokeWidth: 2.6 }, 16) + arrow(1480, 556, 1520, 556, { strokeWidth: 2.6 }, 16)) +
    G("b-r8-br", bracketUp(1100, 1560, 512, { gold: true })) +
    G("b-r8-cx", cnot(1212, RY, 1438, RY, { gold: true, rT: 20, dot: 18, sw: 3.4 }));
  const s8 = wrap("b-s8", full("b-s8a", s8svg, r8.html + C("b-nosc", 950, 120, 360, 56, "no shortcut") +
    C("b-distl", 950, 606, 200, 44, "distant") + C("b-sbs", 1330, 556, 300, 44, "side by side", `color:${GOLD}`) + tokens("b-w")));

  // ===================== Scene 9 (line 15): before and after compute the same thing =====================
  const SYB = [230, 290, 350, 410];
  const cb = circuit("b-cb", 220, 700, SYB, [{ t: "H", x: 300, q: 0 }, { t: "cx", x: 480, c: 0, q: 3 }], { box: 46, lsize: 40, rT: 14, dot: 14 });
  const ca = circuit("b-ca", 1080, 1660, SYB, [{ t: "H", x: 1150, q: 0 }, { t: "sw", x: 1270, a: 0, b: 1 }, { t: "sw", x: 1390, a: 1, b: 2 }, { t: "cx", x: 1520, c: 2, q: 3 }], { box: 46, lsize: 40, rT: 14, dot: 14, xs: 10 });
  const RB9 = { yb: 700, h: 240 };
  const BX9 = [360, 480, 1250, 1370];
  const s9svg = cb.svg + ca.svg +
    G("b-cbase", r.line(310, RB9.yb, 590, RB9.yb, pen({ strokeWidth: 3 })) + r.line(1200, RB9.yb, 1480, RB9.yb, pen({ strokeWidth: 3 }))) +
    BX9.map((x, i) => vbar(`b-rb${i}`, x, 90, RB9.yb, RB9.h, INK)).join("") +
    specks("b-nz", 14);
  const s9 = wrap("b-s9", full("b-s9a", s9svg,
    cb.html + ca.html + C("b-bef", 460, 165, 200, 48, "before") + C("b-aft", 1370, 165, 200, 48, "after") +
    C("b-diffq", 890, 320, 90, 84, "?") +
    BX9.map((x, i) => C(`b-rl${i}`, x + 45, 740, 130, 40, i % 2 ? "both 1" : "both 0")).join("") +
    C("b-eq", 895, 620, 100, 96, "=") + C("b-same", 895, 520, 300, 56, "same answer", `color:${GOLD}`) +
    C("b-pnoise", 1600, 600, 200, 44, "+ noise")));

  // ===================== Scene 10 (line 16): think like the chip =====================
  const ch10 = chip("b-k10", 330, 300, 560, 364, 0.7, { pins: 10, lit: [0, 1] });
  const Q10 = ch10.Q;
  const c10 = circuit("b-c10", 1100, 1520, [420, 500], [{ t: "H", x: 1190, q: 0 }, { t: "cx", x: 1310, c: 0, q: 1 }, { t: "m", x: 1430 }], { box: 54 });
  let ruler = r.line(1100, 590, 1520, 590, pen({ strokeWidth: 2.8 }));
  for (let i = 0; i <= 14; i++) { const x = 1100 + i * 30; ruler += r.line(x, 590, x, 590 - (i % 5 === 0 ? 26 : 13), pen({ strokeWidth: 2, roughness: 0.4 })); }
  const s10svg = ch10.svg +
    G("b-k10-cx", cnot(Q10[0][0] + 36, Q10[0][1], Q10[1][0] - 40, Q10[1][1], { rT: 11, dot: 13, sw: 2.6 })) +
    G("b-k10-tk", tick(491, 340, 14)) + c10.svg + G("b-ruler", ruler);
  const s10 = wrap("b-s10", full("b-s10a", s10svg, C("b-close", 491, 222, 200, 56, "close") + c10.html + C("b-short", 1310, 662, 200, 64, "short", `color:${GOLD}`)));

  // ===================== Scene 11 (line 17): the closing card =====================
  const ERX = [225, 365, 505, 645], ERY = 360;
  const e1 = G("b-e-row", ERX.map((x) => r.circle(x, ERY, 52, pen({ strokeWidth: 3 }))).join("") +
    [0, 1, 2].map((i) => r.line(ERX[i] + 30, ERY, ERX[i + 1] - 30, ERY, pen({ strokeWidth: 2.8 }))).join(""));
  const EW = [320, 420];
  const eqSvg =
    G("b-e-sw", EW.map((y) => r.line(740, y, 840, y, pen({ strokeWidth: 2.8 }))).join("") + swapV(790, EW[0], EW[1], { sw: 3.2 }, 13)) +
    G("b-e-cw", EW.map((y) => r.line(950, y, 1310, y, pen({ strokeWidth: 2.8 }))).join("")) +
    [[1010, 0, 1], [1130, 1, 0], [1250, 0, 1]].map(([x, c, t], i) => G(`b-e-cx${i}`, cnot(x, EW[c], x, EW[t], { rT: 17, dot: 16, sw: 3 }))).join("");
  const noiseBar = G("b-e-nb", r.rect(1600, 300, 110, 180, pen({ ...hatch(INK, 10), strokeWidth: 3 }))) + specks("b-en", 9);
  const ul = r.curve([[6, 8], [160, 4], [340, 9], [520, 5], [594, 8]], goldPen({ strokeWidth: 4.2, roughness: 0.9 }));
  const take2 = `routing adds SWAPs, and <span style="position:relative;display:inline-block">every SWAP adds noise<svg class="sk" style="left:0;top:68px;width:100%;height:14px" width="100%" height="14" viewBox="0 0 600 14" preserveAspectRatio="none">${G("b-ul", ul)}</svg></span>`;
  const s11 = wrap("b-s11", full("b-s11a", e1 + eqSvg + noiseBar,
    C("b-e-rl", 435, 446, 360, 48, "neighbours only") + C("b-e-eq", 895, 370, 80, 80, "=") + C("b-e-lbl", 1025, 530, 520, 64, "SWAP = 3 CNOTs") +
    C("b-e-nl", 1655, 530, 200, 44, "+ noise") +
    C("b-take1", 960, 680, 1300, 64, "Chips connect only neighbours;") + C("b-take2", 960, 770, 1400, 64, take2)));

  const html = s0 + s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8 + s9 + s10 + s11;

  // ===================== Moves (token and guest positions, applied every frame) =====================
  // [start, dur, fromDx, toDx, arcUp] in px relative to the drawn position.
  const sw1 = T.two9, sw2 = T.walk10, d1 = 0.62, d2 = 0.8;
  const ts1 = T.state14, ts2 = T.state14 + 0.62;
  const MOVES = {
    "b-gm0": [[T.swap3 - 0.05, 0.9, 0, 310, 80], [T.swap3b - 0.05, 0.9, 310, 600, 80]],
    "b-gm1": [[T.swap3 - 0.05, 0.9, 0, -310, -50]],
    "b-gm2": [[T.swap3b - 0.05, 0.9, 0, -290, -50]],
    "b-vA": [[T.trades8, 1.0, 0, 520, 110]],
    "b-vB": [[T.trades8, 1.0, 0, -520, -110]],
    "b-mg0": [[T.trading8, 0.9, 0, 180, 30]],
    "b-mg1": [[T.trading8, 0.9, 0, -180, -14]],
    "b-uA": [[sw1, d1, 0, 380, 0], [sw2, d2, 380, 760, 0]],
    "b-uB": [[sw1, d1, 0, -380, -100]],
    "b-uC": [[sw2, d2, 0, -380, -100]],
    "b-wA": [[ts1, 0.6, 0, 380, 0], [ts2, 0.6, 380, 760, 0]],
    "b-wB": [[ts1, 0.6, 0, -380, -100]],
    "b-wC": [[ts2, 0.6, 0, -380, -100]],
  };
  // Seven CNOTs on the strip: where their specks sit (strip coordinates).
  const SPK = CX7.map((x, i) => [x + 30, SY[Math.min(...CX7P[i])] - 26]);

  const script = `
    const T = ${JSON.stringify(T)};
    const MOVES = ${JSON.stringify(MOVES)};
    const SPK = ${JSON.stringify(SPK)};
    const NB = ${JSON.stringify(NB)};
    const RB9 = ${JSON.stringify(RB9)};
    const BX9 = ${JSON.stringify(BX9)};
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const f1 = (n) => (+n).toFixed(1);

    // The kit's draw() with autoRound off: GSAP rounds the dash offset by default, so a stroke on
    // pathLength 1 would snap from hidden to whole instead of penning on.
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
    const pop = (sel, t) => tl.fromTo(all(sel), { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, t);
    const pulse = (sel, t, to = 0.25) => tl.to(all(sel), { opacity: to, duration: 0.12, yoyo: true, repeat: 1, ease: "sine.inOut" }, t);
    function setV(id, x, w, yb, h) {
      $(id + "-cr").setAttribute("y", f1(yb - h)); $(id + "-cr").setAttribute("height", h < 0.5 ? "0" : f1(h + 2));
      $(id + "-o").setAttribute("d", h < 1.5 ? "" : "M" + x + " " + yb + " L" + (x + 1) + " " + f1(yb - h) + " L" + (x + w - 1) + " " + f1(yb - h + 1) + " L" + (x + w) + " " + yb);
    }
    function posAt(ms, t) {
      let x = ms.length ? ms[0][2] : 0, y = 0;
      for (const [a, d, f, to, amp] of ms) {
        if (t <= a) break;
        const e = ease.inOut((t - a) / d);
        x = f + (to - f) * e; y = -amp * Math.sin(Math.PI * e);
      }
      return [x, y];
    }
    const jit = (t, i, k) => Math.sin(t * (2.1 + (i % 5) * 0.37) + i * 1.7 + k) * 0.6 + Math.sin(t * (3.3 + (i % 3) * 0.5) + i * 0.9 + k * 2) * 0.4;

    onFrame((t) => {
      // Tokens and guests
      for (const id in MOVES) {
        const [x, y] = posAt(MOVES[id], t), el = $(id);
        if (el instanceof SVGElement) el.setAttribute("transform", "translate(" + f1(x) + " " + f1(y) + ")");
        else el.style.transform = "translate(" + f1(x) + "px, " + f1(y) + "px)";
      }
      // Line 0: the spark twinkles
      const sp = 1 + 0.18 * Math.sin(t * 7);
      $("b-sparkT").setAttribute("transform", "translate(1572 358) scale(" + sp.toFixed(3) + ") translate(-1572 -358)");
      // Line 7: the gear turns from "fits" to the end of the line
      const ga = 160 * clamp(t - T.fits7, 0, T.end7 - T.fits7 + 0.2);
      $("b-gearR").setAttribute("transform", "rotate(" + f1(ga) + " 960 466)");
      // Line 12: specks beside each CNOT, the two error bars, the wobbling answer
      SPK.forEach(([x, y], i) => {
        const o = clamp((t - T.cnot12 - i * 0.12) / 0.15);
        for (let k = 0; k < 3; k++) {
          const c = $("b-sp" + i + "-" + k);
          c.setAttribute("cx", f1(x + k * 12 + 4 * jit(t, i, k)));
          c.setAttribute("cy", f1(y - (k % 2) * 12 + 4 * jit(t, i + 3, k)));
          c.setAttribute("r", k === 1 ? "4" : "5");
          c.setAttribute("opacity", f1(o * 0.9));
        }
      });
      setV("b-nb1", NB.lx, NB.w, NB.yb, sched([[T.error12 + 0.1, T.error12 + 0.7, 0, 24]], t, 0));
      const n7 = 7 * clamp((t - T.more12) / 1.2), fl = Math.floor(n7 + 1e-6);
      setV("b-nb7", NB.rx, NB.w, NB.yb, t < T.more12 ? 0 : 24 * Math.min(7, fl + ease.inOut(clamp((n7 - fl) / 0.6))));
      const wob = clamp((t - T.noisier12) / 0.3);
      [120, 46, 70, 30].forEach((h, i) => setV("b-ans" + i, 1546 + i * 44, 34, NB.yb, wob * Math.max(6, h + 26 * jit(t * 2.2, i, 0))));
      // Line 13: the shout flies down the table
      [0, 1, 2].forEach((i) => {
        const u = clamp((t - T.always13 - 0.25 - i * 0.12) / 0.55);
        const el = $("b-sh" + i);
        el.setAttribute("transform", "translate(" + f1(1000 * ease.inOut(u)) + " 0)");
        el.style.opacity = String(u <= 0 || u >= 1 ? 0 : 1);
      });
      // Line 15: the ideal results rise; noise drifts over the right chart only
      const rise = sched([[T.computes15, T.computes15 + 0.8, 0, 0.5]], t, 0);
      BX9.forEach((x, i) => setV("b-rb" + i, x, 90, RB9.yb, RB9.h * rise));
      const nz = clamp((t - T.noise15) / 0.4);
      for (let i = 0; i < 14; i++) {
        const c = $("b-nz" + i);
        c.setAttribute("cx", f1(1215 + ((i * 97) % 250) + 14 * jit(t, i, 1)));
        c.setAttribute("cy", f1(470 + ((i * 53) % 210) + 14 * jit(t, i, 4)));
        c.setAttribute("opacity", f1(nz * 0.65));
      }
      // Closing: specks jitter on the noise bar to the end
      const en = clamp((t - T.noise17 - 0.3) / 0.3);
      for (let i = 0; i < 9; i++) {
        const c = $("b-en" + i);
        c.setAttribute("cx", f1(1615 + ((i * 41) % 90) + 7 * jit(t, i, 2)));
        c.setAttribute("cy", f1(270 + ((i * 29) % 40) + 7 * jit(t, i, 5)));
        c.setAttribute("opacity", f1(en * 0.9));
      }
    });

    // ===== Line 0: your circuit, run it on a chip =====
    drawP("#b-c0-w", T.circuit0 - 0.05, 0.6);
    drawP("#b-c0-g0", T.circuit0 + 0.45, 0.3);
    write("#b-c0-g0-l", T.circuit0 + 0.7, 0.15);
    drawP("#b-c0-g1", T.circuit0 + 0.85, 0.45);
    drawP("#b-c0-g2", T.circuit0 + 1.3, 0.5);
    write("#b-yc0", T.circuit0 + 1.2, 0.7);
    drawP("#b-run", T.run0 - 0.1, 0.5);
    blurOut("#b-title", T.real0 - 0.1);
    drawP("#b-mc-body", T.chip0 - 0.3, 1.0);
    drawP("#b-mc-in", T.chip0 + 0.3, 0.5);
    write("#b-chiplbl", T.chip0, 0.4);
    drawP("#b-spark", T.chip0 + 0.6, 0.3);
    blurOut("#b-s0a", T.catch1);
    tl.to("#b-s0chip", { scale: 0.35, opacity: 0, filter: "blur(8px)", transformOrigin: "1350px 530px", duration: 0.45, ease: "power2.in" }, T.catch1);

    // ===== Line 1: a big chip; not every qubit is wired to every other =====
    drawP("#b-k1-body", T.chip1 - 0.15, 0.7);
    drawP("#b-k1-pins", T.chip1 + 0.2, 0.6);
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => drawP("#b-k1-q" + i, T.chip1 + 0.45 + i * 0.06, 0.25));
    write("#b-qlbl", T.qubit1 - 0.1, 0.35);
    drawP("#b-qptr", T.qubit1, 0.3);
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => drawP("#b-k1-w" + i, T.wired1 + i * 0.1, 0.25));
    drawP("#b-k1-try", T.other1 - 0.3, 0.3);
    drawP("#b-k1-x", T.other1 + 0.05, 0.25);
    blurOut("#b-s1", T.picture2 + 0.25);

    // ===== Line 2: the dinner table; neighbours chat =====
    drawP("#b-t-top", T.dinner2 - 0.3, 1.1);
    drawP("#b-t-fr", T.dinner2 + 0.6, 0.6);
    [0, 1, 2, 3, 4].forEach((i) => drawP("#b-t-cup" + i, T.dinner2 + 0.8 + i * 0.08, 0.2));
    [0, 1, 2, 3, 4].forEach((i) => drawP("#b-gst" + i, T.guests2 - 0.2 + i * 0.12, 0.45));
    [0, 1, 2, 3].forEach((i) => drawP("#b-bub" + i, T.chat2 - 0.05 + i * 0.12, 0.3));
    [0, 1, 2, 3].forEach((i) => drawP("#b-nar" + i, T.neigh2 - 0.25 + i * 0.08, 0.3));
    write("#b-neighl", T.neigh2, 0.45);

    // ===== Line 3: swap seats to reach the far end; a spilled drink =====
    fade(["#b-bub0", "#b-bub1", "#b-bub2", "#b-bub3", "#b-nar0", "#b-nar1", "#b-nar2", "#b-nar3", "#b-neighl"], 0, T.reach3 - 0.2, 0.3);
    drawP("#b-far", T.far3 - 0.1, 0.6);
    write("#b-farq", T.far3 + 0.4, 0.2);
    fade("#b-far", 0, T.swap3 - 0.15, 0.25);
    drawP("#b-sa1", T.swap3 - 0.05, 0.35);
    fade("#b-sa1", 0, T.swap3 + 0.95, 0.25);
    drawP("#b-sa2", T.swap3b - 0.05, 0.35);
    fade("#b-sa2", 0, T.swap3b + 0.95, 0.25);
    tl.to("#b-t-cup1", { rotation: 78, svgOrigin: "752 560", duration: 0.35, ease: "power2.in" }, T.spilled3 - 0.15);
    drawP("#b-splash", T.spilled3 + 0.15, 0.4);
    write("#b-risk", T.drink3 - 0.1, 0.5);
    blurOut("#b-s2", T.chip4 - 0.2);

    // ===== Line 4: the chip again; wires join only neighbours: the coupling map =====
    drawP("#b-k3-body", T.chip4 - 0.05, 0.5);
    drawP("#b-k3-pins", T.chip4 + 0.15, 0.45);
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => drawP("#b-k3-q" + i, T.chip4 + 0.3 + i * 0.05, 0.2));
    drawP(["#b-k3-w0", "#b-k3-w1", "#b-k3-w2", "#b-k3-w3", "#b-k3-w4", "#b-k3-w5", "#b-k3-w6", "#b-k3-w7"], T.wires4 - 0.1, 0.7);
    hide(["#b-k3-wg0", "#b-k3-wg1", "#b-k3-wg2", "#b-k3-wg3", "#b-k3-wg4", "#b-k3-wg5", "#b-k3-wg6", "#b-k3-wg7"]);
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => { fade("#b-k3-wg" + i, 1, T.join4 + i * 0.08, 0.12); fade("#b-k3-wg" + i, 0, T.join4 + i * 0.08 + 0.25, 0.2); });
    drawP("#b-k3-nb", T.neigh4 - 0.15, 0.35);
    write("#b-k3-nbl", T.neigh4, 0.45);
    fade(["#b-k3-nb", "#b-k3-nbl"], 0, T.coupling4 - 0.2, 0.3);
    write("#b-cmap", T.coupling4 - 0.1, 0.7);
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => { fade("#b-k3-wg" + i, 1, T.coupling4 + 0.1, 0.25); fade("#b-k3-wg" + i, 0, T.coupling4 + 1.1, 0.35); });

    // ===== Line 5: a two-qubit gate works along a wire =====
    tl.to("#b-cmap", { color: "${INK}", duration: 0.3 }, T.l5);
    hide(["#b-k3-lit0", "#b-k3-lit1", "#b-k3-lit7"]);
    fade(["#b-k3-lit0", "#b-k3-lit1"], 1, T.gate5 - 0.05, 0.3);
    write("#b-k3-cxl", T.cnot5 - 0.1, 0.35);
    drawP("#b-k3-cx", T.cnot5 - 0.05, 0.45);
    drawP("#b-k3-tk", T.wire5 - 0.05, 0.3);
    fade(["#b-k3-lit0", "#b-k3-lit1"], 0, T.l6 - 0.1, 0.3);
    blurOut(["#b-k3-cx", "#b-k3-cxl", "#b-k3-tk"], T.l6 - 0.1);

    // ===== Line 6: what if the two qubits aren't neighbours? =====
    fade(["#b-k3-lit0", "#b-k3-lit7"], 1, T.circuit6 - 0.05, 0.3);
    drawP("#b-k3-far", T.cnot6 - 0.1, 0.5);
    drawP("#b-k3-fcx", T.cnot6 + 0.3, 0.4);
    write("#b-k3-q", T.neigh6 - 0.15, 0.3);
    blurOut("#b-s3", T.kiss7 - 0.05);

    // ===== Line 7: the transpiler fits your circuit to the chip and adds SWAPs =====
    drawP("#b-c4-w", T.kiss7 + 0.25, 0.4);
    drawP("#b-c4-g0", T.kiss7 + 0.45, 0.2);
    write("#b-c4-g0-l", T.kiss7 + 0.6, 0.12);
    drawP("#b-c4-g1", T.kiss7 + 0.6, 0.3);
    write("#b-yc4", T.kiss7 + 0.5, 0.5);
    drawP("#b-tbox", T.transpiler7 - 0.05, 0.6);
    write("#b-tpl", T.transpiler7 + 0.1, 0.5);
    drawP("#b-tin", T.transpiler7 + 0.3, 0.3);
    drawP("#b-gear", T.transpiler7 + 0.5, 0.7);
    drawP("#b-tchip", T.chip7 - 0.15, 0.4);
    drawP("#b-tout", T.add7 - 0.1, 0.25);
    drawP("#b-c4b-w", T.add7 + 0.05, 0.35);
    drawP("#b-c4b-g0", T.add7 + 0.2, 0.15);
    write("#b-c4b-g0-l", T.add7 + 0.3, 0.1);
    drawP("#b-c4b-g1", T.swap7 - 0.1, 0.25);
    drawP("#b-c4b-g2", T.swap7 + 0.12, 0.25);
    write("#b-swl", T.swap7 + 0.05, 0.3);
    drawP("#b-c4b-g3", T.swap7 + 0.35, 0.25);
    blurOut("#b-s4", T.swap8 - 0.25);

    // ===== Line 8: a SWAP trades the states; routing =====
    drawP("#b-s5c", T.swap8, 0.4);
    drawP("#b-s5w", T.swap8 + 0.15, 0.3);
    hide(["#b-vA-i", "#b-vB-i"]);
    pop("#b-vA-i", T.swap8 + 0.12);
    pop("#b-vB-i", T.swap8 + 0.18);
    drawP("#b-s5top", T.trades8 - 0.05, 0.4);
    drawP("#b-s5bot", T.trades8 + 0.2, 0.4);
    write(["#b-s5ql", "#b-s5qr"], T.trades8 + 0.4, 0.3);
    write("#b-s5st", T.states8, 0.9);
    fade(["#b-s5top", "#b-s5bot"], 0, T.guests8 - 0.2, 0.3);
    drawP("#b-mtab", T.guests8 - 0.15, 0.4);
    drawP(["#b-mgst0", "#b-mgst1"], T.guests8 + 0.05, 0.4);
    write("#b-routing", T.routing8 - 0.15, 0.5);
    blurOut("#b-s5", T.take9);

    // ===== Line 9: four qubits in a row; a CNOT from first to last =====
    drawP("#b-r6-c", T.four9 - 0.1, 0.8);
    drawP("#b-r6-w", T.four9 + 0.4, 0.4);
    write(["#b-r6-l0", "#b-r6-l1", "#b-r6-l2", "#b-r6-l3"], T.four9 + 0.3, 0.3);
    hide(["#b-uA-i", "#b-uB-i", "#b-uC-i", "#b-uD-i"]);
    ["A", "B", "C", "D"].forEach((L, i) => pop("#b-u" + L + "-i", T.four9 + 0.6 + i * 0.08));
    drawP("#b-sw", T.row9 - 0.05, 0.6);
    write(["#b-sl0", "#b-sl1", "#b-sl2", "#b-sl3"], T.row9 + 0.2, 0.2);
    drawP("#b-r6-arc", T.cnot9 - 0.15, 0.6);
    drawP("#b-r6-acx", T.cnot9 + 0.2, 0.3);
    write("#b-need", T.cnot9 + 0.3, 0.35);
    drawP("#b-r6-x", T.last9 - 0.05, 0.25);
    write("#b-nowire", T.last9 + 0.05, 0.35);

    // ===== Line 10: two swaps walk A next to D, then the CNOT runs =====
    hide(["#b-ss1", "#b-ss2"]);
    drawP("#b-ss1g", T.two9 - 0.05, 0.3);
    show("#b-ss1", T.two9 + d1Done);
    fade("#b-ss1g", 0, T.two9 + d1Done, 0.25);
    drawP("#b-ss2g", T.walk10 - 0.05, 0.3);
    show("#b-ss2", T.walk10 + 0.8);
    fade("#b-ss2g", 0, T.walk10 + 0.8, 0.25);
    fade(["#b-r6-arc", "#b-r6-acx", "#b-r6-x", "#b-need", "#b-nowire"], 0.3, T.two9, 0.3);
    drawP("#b-r6-br", T.next10 - 0.1, 0.35);
    write("#b-nbnow", T.next10 + 0.1, 0.5);
    drawP("#b-r6-cx", T.cnot10 - 0.1, 0.4);
    hide(["#b-x7-0", "#b-x7-1", "#b-x7-2", "#b-x7-3", "#b-x7-4", "#b-x7-5"]);
    drawP("#b-x7-6", T.cnot10, 0.3);
    fade(["#b-r6-arc", "#b-r6-acx", "#b-r6-x", "#b-need", "#b-nowire"], 0, T.cnot10, 0.3);
    write("#b-cnt1", T.cnot10 + 0.2, 0.6);

    // ===== Line 11: each SWAP is three CNOTs; one gate became seven =====
    fade(["#b-r6-br", "#b-nbnow"], 0, T.swap11 - 0.2, 0.3);
    tl.to("#b-r6-cx", { opacity: 0.45, duration: 0.3 }, T.swap11 - 0.2);
    fade("#b-ss1g", 1, T.swap11, 0.15);
    pulse("#b-ss1g", T.swap11 + 0.25, 0.3);
    fade(["#b-ss1", "#b-ss1g"], 0, T.three11 - 0.1, 0.2);
    [0, 1, 2].forEach((i) => drawP("#b-x7-" + i, T.three11 + i * 0.22, 0.25));
    fade("#b-ss2g", 1, T.three11 + 0.4, 0.15);
    fade(["#b-ss2", "#b-ss2g"], 0, T.three11 + 0.6, 0.2);
    [3, 4, 5].forEach((i) => drawP("#b-x7-" + i, T.three11 + 0.65 + (i - 3) * 0.22, 0.25));
    fade("#b-cnt1", 0, T.one11 - 0.2, 0.2);
    write("#b-cnt2", T.one11 - 0.05, 0.35);
    drawP("#b-cnar", T.seven11 - 0.3, 0.3);
    write("#b-cnt3", T.seven11 - 0.05, 0.4);
    blurOut("#b-s6row", T.seven11 + 0.45);
    move("#b-strip", { y: 0 }, { y: -360 }, T.seven11 + 0.45, 0.6);

    // ===== Line 12: every CNOT adds a chance of error, called noise =====
    tl.to("#b-cnt3", { color: "${INK}", duration: 0.3 }, T.error12);
    write("#b-nhead", T.error12 - 0.1, 0.6);
    drawP("#b-nbase", T.error12 - 0.05, 0.5);
    write("#b-nl1", T.error12 + 0.3, 0.3);
    write("#b-nnoise", T.noise12 - 0.05, 0.4);
    write("#b-nl7", T.more12 - 0.05, 0.35);
    drawP("#b-abase", T.noisier12 - 0.15, 0.3);
    write("#b-nans", T.noisier12, 0.35);
    blurOut("#b-s6", T.heres13);

    // ===== Line 13: at the table, a guest could just shout =====
    drawP("#b-t7-top", T.dinner13 - 0.15, 0.7);
    drawP("#b-t7-fr", T.dinner13 + 0.3, 0.4);
    [0, 1, 2, 3, 4].forEach((i) => drawP("#b-t7-cup" + i, T.dinner13 + 0.4 + i * 0.05, 0.15));
    [0, 1, 2, 3, 4].forEach((i) => drawP("#b-g7" + i, T.dinner13 + i * 0.08, 0.4));
    drawP("#b-crack", T.breaks13 - 0.1, 0.4);
    hide("#b-mouth");
    fade("#b-mouth", 1, T.always13 + 0.1, 0.15);
    write("#b-hey", T.shout13 - 0.2, 0.25);
    drawP("#b-g5tick", T.shout13 + 0.05, 0.2);
    blurOut("#b-s7", T.chip14 - 0.2);

    // ===== Line 14: a chip has no shortcut; the states must sit side by side =====
    drawP("#b-r8-c", T.chip14, 0.5);
    drawP("#b-r8-w", T.chip14 + 0.25, 0.3);
    write(["#b-r8-l0", "#b-r8-l1", "#b-r8-l2", "#b-r8-l3"], T.chip14 + 0.2, 0.25);
    hide(["#b-wA-i", "#b-wB-i", "#b-wC-i", "#b-wD-i"]);
    ["A", "B", "C", "D"].forEach((L, i) => pop("#b-w" + L + "-i", T.chip14 + 0.35 + i * 0.06));
    drawP("#b-r8-arc", T.shortcut14 - 0.1, 0.5);
    drawP("#b-r8-x", T.shortcut14 + 0.45, 0.25);
    write("#b-nosc", T.shortcut14 + 0.5, 0.4);
    drawP("#b-r8-far", T.distant14 - 0.1, 0.5);
    write("#b-distl", T.distant14 + 0.1, 0.35);
    fade(["#b-r8-arc", "#b-r8-x", "#b-nosc"], 0, T.interact14, 0.35);
    fade(["#b-r8-far", "#b-distl"], 0, T.state14 - 0.3, 0.3);
    drawP("#b-r8-br", T.side14 - 0.1, 0.35);
    write("#b-sbs", T.side14 + 0.05, 0.45);
    drawP("#b-r8-cx", T.side14b - 0.1, 0.35);
    blurOut("#b-s8", T.the15);

    // ===== Line 15: the rewritten circuit computes the same thing; only the noise grows =====
    drawP(["#b-cb-w", "#b-ca-w"], T.rewritten15 - 0.15, 0.6);
    write(["#b-bef", "#b-aft"], T.rewritten15, 0.4);
    drawP(["#b-cb-g0", "#b-ca-g0"], T.rewritten15 + 0.3, 0.2);
    write(["#b-cb-g0-l", "#b-ca-g0-l"], T.rewritten15 + 0.45, 0.1);
    drawP("#b-cb-g1", T.rewritten15 + 0.5, 0.3);
    drawP("#b-ca-g1", T.rewritten15 + 0.5, 0.2);
    drawP("#b-ca-g2", T.rewritten15 + 0.7, 0.2);
    drawP("#b-ca-g3", T.rewritten15 + 0.9, 0.25);
    write("#b-diffq", T.different15 - 0.1, 0.25);
    fade("#b-diffq", 0, T.computes15 - 0.1, 0.25);
    drawP("#b-cbase", T.computes15 - 0.1, 0.4);
    write(["#b-rl0", "#b-rl1", "#b-rl2", "#b-rl3"], T.computes15 + 0.1, 0.35);
    write("#b-eq", T.computes15 + 0.5, 0.2);
    write("#b-same", T.computes15 + 0.6, 0.6);
    write("#b-pnoise", T.noise15, 0.4);
    blurOut("#b-s9", T.think16 - 0.3);

    // ===== Line 16: think like the chip: keep partners close and circuits short =====
    drawP("#b-k10-body", T.think16 - 0.1, 0.5);
    drawP("#b-k10-pins", T.think16 + 0.2, 0.4);
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => drawP("#b-k10-q" + i, T.think16 + 0.35 + i * 0.05, 0.2));
    drawP(["#b-k10-w0", "#b-k10-w1", "#b-k10-w2", "#b-k10-w3", "#b-k10-w4", "#b-k10-w5", "#b-k10-w6", "#b-k10-w7"], T.think16 + 0.7, 0.5);
    hide(["#b-k10-lit0", "#b-k10-lit1"]);
    fade(["#b-k10-lit0", "#b-k10-lit1"], 1, T.together16 - 0.1, 0.3);
    drawP("#b-k10-cx", T.together16 + 0.1, 0.35);
    drawP("#b-k10-tk", T.together16 + 0.45, 0.25);
    write("#b-close", T.together16 + 0.3, 0.35);
    drawP("#b-c10-w", T.circuits16 - 0.15, 0.3);
    drawP(["#b-c10-g0", "#b-c10-g1", "#b-c10-g2"], T.circuits16, 0.4);
    write("#b-c10-g0-l", T.circuits16 + 0.1, 0.1);
    drawP("#b-ruler", T.circuits16 + 0.2, 0.3);
    write("#b-short", T.short16 - 0.05, 0.35);
    fade(["#b-k10-lit0", "#b-k10-lit1"], 0, T.short16, 0.3);
    blurOut("#b-s10", T.chips17 - 0.05);

    // ===== Line 17: the closing card, held to the end =====
    write("#b-take1", T.chips17 + 0.1, 1.5);
    drawP("#b-e-row", T.connect17 - 0.1, 0.7);
    write("#b-e-rl", T.connect17 + 0.4, 0.5);
    drawP("#b-e-sw", T.routing17 - 0.1, 0.4);
    write("#b-e-eq", T.routing17 + 0.3, 0.15);
    drawP("#b-e-cw", T.routing17 + 0.35, 0.3);
    [0, 1, 2].forEach((i) => drawP("#b-e-cx" + i, T.routing17 + 0.55 + i * 0.2, 0.25));
    write("#b-e-lbl", T.routing17 + 0.9, 0.7);
    write("#b-take2", T.routing17 - 0.05, 2.4);
    drawP("#b-ul", T.every17 + 0.15, 1.1);
    drawP("#b-e-nb", T.noise17 - 0.15, 0.4);
    write("#b-e-nl", T.noise17 + 0.1, 0.35);
  `.replaceAll("d1Done", String(d1));

  return { html, script };
}
