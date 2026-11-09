// Lesson 10, "Many qubits and bit order". Follows plan.md: one qubit and the question, the
// combination lock with rolling wheel drums and a doubling counter, the ten-wheel strip that
// counts to 1,024 and turns into ten qubits, the amplitude ledger that scrolls through all
// 1,024 rows, the doubling blocks, where the lock breaks (one setting vs every amplitude, one
// string out), and Qiskit's bit order (qubit 0 on the right, like the ones digit in 42).
export const phrases = [
  ["Kiss kit", "Qiskit"],
  ["one thousand and twenty four", "1,024"],
  ["two to the power of ten", "2 to the power of 10"],
  ["Zero zero", "00"], ["zero one", "01"], ["one zero", "10"], ["one one", "11"],
  ["qubit zero", "qubit 0"],
  ["ten qubits", "10 qubits"], ["ten wheels", "10 wheels"], ["ten zeros", "10 zeros"],
  ["forty two", "42"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, lines, INK, GOLD, DIM } = k;
  const fx = (n) => +n.toFixed(3);
  const wt = (li, wi) => fx(lines[li].words[wi].start);

  // ---------- small drawing helpers ----------
  const headAt = (pts, o, size = 18) => {
    const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1];
    const a = Math.atan2(y2 - y1, x2 - x1), w = (o.strokeWidth ?? 3) * 0.85;
    return [0.45, -0.45].map((da) => r.line(x2, y2, x2 - size * Math.cos(a + da), y2 - size * Math.sin(a + da), pen({ ...o, strokeWidth: w }))).join("");
  };
  const carrow = (pts, o = {}, size = 18) => r.curve(pts, pen(o)) + headAt(pts, o, size);
  // Quadratic bezier sampled into points, for dashed curves.
  const bez = (p0, p1, p2, n = 40) => Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n, a = (1 - u) ** 2, b = 2 * u * (1 - u), c = u * u;
    return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
  });
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
  const hatch = (x, y, w, h, color, seed) =>
    r.rect(x, y, w, h, { ...pen({ seed }), fill: color, fillStyle: "hachure", hachureGap: 8, fillWeight: 2, stroke: color, strokeWidth: 2, roughness: 1 });
  const obj = (id, x, y, w, h, svg, inner = "", extra = "") =>
    `<div id="${id}" class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">` +
    (svg ? `<svg class="sk" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svg}</svg>` : "") + inner + `</div>`;
  const bits = (s) => [...s].map((c) => `<span>${c}</span>`).join("");
  const VDOTS = `<svg class="vdots" width="14" height="40" viewBox="0 0 14 40"><circle cx="7" cy="6" r="4"/><circle cx="7" cy="20" r="4"/><circle cx="7" cy="34" r="4"/></svg>`;

  // A qubit: a circle with a needle; the needle's outer group is turned at runtime
  // (0 degrees = up = reads 0, 180 = down = reads 1).
  const qubit = (id, cx, cy, d, seed, o = {}) =>
    `<g id="${id}-c">${r.circle(cx, cy, d, pen({ strokeWidth: 3.2, seed, ...o }))}${r.circle(cx, cy, d - 16, pen({ strokeWidth: 1.4, roughness: 1.8, stroke: DIM, seed: seed + 1 }))}</g>` +
    `<g id="${id}-nr"><g id="${id}-n">${arrow(cx, cy, cx, cy - d / 2 + 14, { strokeWidth: 3.6, roughness: 0.7, ...o }, Math.max(10, d * 0.1))}${r.circle(cx, cy, Math.max(8, d * 0.1), pen({ fill: o.stroke ?? INK, fillStyle: "solid", strokeWidth: 1 }))}</g></g>`;

  // Wheel drums: a clipped column of digits that rolls (p = how many steps it has turned).
  const DRUMS = [];
  const OFF = 2;
  function drum(id, cx, cy, w, h, size, pitch, segs, gold, on, off) {
    const maxP = Math.max(0, ...segs.map((s) => s[3]));
    const n = Math.ceil(maxP) + OFF * 2 + 1;
    DRUMS.push({ id, pitch, segs: segs.map((s) => s.map(fx)), gold, on, off, n });
    const digits = Array.from({ length: n }, (_, j) =>
      `<div class="lbl hand dg" id="${id}-${j}" style="left:0;top:${fx(h / 2 - size * 0.56)}px;width:${w}px;font-size:${size}px">${(((j - OFF) % 2) + 2) % 2}</div>`).join("");
    return `<div id="${id}" class="obj" style="left:${cx - w / 2}px;top:${cy - h / 2}px;width:${w}px;height:${h}px;overflow:hidden">${digits}</div>`;
  }
  const drumBox = (cx, cy, w, h, seed) =>
    r.rect(cx - w / 2, cy - h / 2, w, h, pen({ strokeWidth: 2.8, seed, roughness: 1.1 })) +
    [-0.32, -0.16, 0, 0.16, 0.32].map((u, i) =>
      r.line(cx - w / 2 + 3, cy + u * h, cx - w / 2 + 11, cy + u * h, pen({ strokeWidth: 1.6, roughness: 0.5, seed: seed + 10 + i })) +
      r.line(cx + w / 2 - 11, cy + u * h, cx + w / 2 - 3, cy + u * h, pen({ strokeWidth: 1.6, roughness: 0.5, seed: seed + 20 + i }))).join("");
  // A padlock: shackle (two arcs), body with a bevel, a window for the wheels.
  function lock(pfx, bx, by, bw, bh, shW, shH, win, seed) {
    const cx = bx + bw / 2;
    const sh =
      r.arc(cx, by + 4, shW, shH * 2, Math.PI, 2 * Math.PI, false, pen({ strokeWidth: 5, seed })) +
      r.arc(cx, by + 4, shW - 64, (shH - 32) * 2, Math.PI, 2 * Math.PI, false, pen({ strokeWidth: 4, seed: seed + 1 })) +
      r.line(cx - shW / 2, by + 4, cx - shW / 2 + 32, by + 4, pen({ strokeWidth: 3, seed: seed + 2 })) +
      r.line(cx + shW / 2 - 32, by + 4, cx + shW / 2, by + 4, pen({ strokeWidth: 3, seed: seed + 3 }));
    const body =
      r.rect(bx, by, bw, bh, pen({ strokeWidth: 3.8, seed: seed + 4 })) +
      r.rect(bx + 14, by + 14, bw - 28, bh - 28, pen({ strokeWidth: 1.6, stroke: DIM, roughness: 1.8, seed: seed + 5 })) +
      [[bx + 30, by + 30], [bx + bw - 30, by + 30], [bx + 30, by + bh - 30], [bx + bw - 30, by + bh - 30]]
        .map(([x, y], i) => r.circle(x, y, 12, pen({ strokeWidth: 2, seed: seed + 6 + i }))).join("");
    const w = r.rect(win.x, win.y, win.w, win.h, pen({ strokeWidth: 3, seed: seed + 12 }));
    return `<g id="${pfx}-sh">${sh}</g><g id="${pfx}-body">${body}${w}</g>`;
  }

  // ---------- times ----------
  const T = {
    q: cue(0, "qubit", 0, -0.1), z0: cue(0, "zero", 0, -0.08), o0: cue(0, "one", 0, -0.12), so0: cue(0, "So"), many: cue(0, "many"),
    ten0: cue(0, "ten", 0, -0.08), qs0: cue(0, "qubits"), off0: cue(1, null, 0, -0.1),
    combo: cue(1, "combination", 0, -0.1), wheel1: cue(1, "wheel", 0, -0.1), pos1: cue(1, "positions", 0, -0.1), zero1: cue(1, "zero", 0, -0.05), and1: cue(1, "and", 0, 0.2),
    gives2: cue(2, "gives"), two2: cue(2, "two"), second2: cue(2, "second", 0, -0.08), makes2: cue(2, "makes", 0, -0.06), four2: wt(2, 10),
    s00: wt(3, 0), s01: wt(3, 2), s10: wt(3, 4), s11: wt(3, 6) - 0.15,
    third4: cue(4, "third"), makes4: cue(4, "makes"), eight4: cue(4, "eight", 0, -0.05), every4: cue(4, "every"), doubles4: cue(4, "doubles", 0, -0.08),
    off4: cue(5, null, 0, -0.12),
    ten5: cue(5, "ten", 0, -0.2), power5: cue(5, "power", 0, -0.05), land5: 24.3,
    qubits6: cue(6, "Qubits", 0, -0.1), have6: cue(6, "have", 0, -0.05), poss6: cue(6, "possible", 0, -0.08),
    off6: cue(7, null, 0, -0.1), quantum7: cue(7, "quantum", 0, -0.05), qubits7: cue(7, "qubits"), number7: cue(7, "number", 0, -0.05), result7: cue(7, "result", 0, -0.05), called7: cue(7, "called", 0, -0.05),
    amp8: cue(8, "amplitude", 0, -0.05), likely8: cue(8, "likely", 0, -0.1), result8: cue(8, "result"), carry8: cue(8, "carry", 0, -0.05),
    off8: cue(9, null, 0, -0.1), doubling9: cue(9, "doubling", 0, -0.05), room9: cue(9, "gets", 0, -0.05),
    off9: cue(10, "lock", 0, -0.1), lock10: cue(10, "lock", 0, 0.05), lock10b: cue(10, "lock", 1), set10: cue(10, "set", 0, -0.1), one10: cue(10, "one"),
    qubits11: cue(11, "Qubits", 0, -0.1), amp11: cue(11, "amplitude"), measuring11: cue(11, "measuring", 0, -0.08),
    off11: cue(12, null, 0, -0.05), read12: cue(12, "read", 0, -0.05), amps12: cue(12, "amplitudes"), string12: cue(12, "string", 0, -0.1), ten12: cue(12, "ten", 0, -0.05),
    off12: cue(13, null, 0, -0.1), habit13: cue(13, "habit", 0, -0.05), our13: cue(13, "our", 0, -0.05), numbers13: cue(13, "numbers", 0, -0.1), qubits13: cue(13, "qubits", 0, -0.05),
    off13: cue(14, null, 0, -0.05), result14: cue(14, "result", 0, -0.2), goes14: cue(14, "goes", 0, -0.08),
    two15: cue(15, "two", 0, -0.08), flip15: cue(15, "flip", 0, -0.1),
    shows16: cue(16, "shows", 0, 0.2), not16: cue(16, "not", 0, -0.05), with16: cue(16, "with", 0, -0.05), like16: cue(16, "like", 0, -0.08), ones16: cue(16, "ones", 0, -0.05),
    off16: cue(17, null, 0, -0.1), add17: cue(17, "add", 0, -0.1), doubles17: cue(17, "doubles"), meas17: cue(17, "measurement", 0, -0.1), shows17: cue(17, "shows"), string17: cue(17, "string"),
  };

  // ---------- 0. one qubit, then ten (hook) ----------
  const HQ = { x: 960, y: 500, d: 180 };
  const hqHtml = obj("b-hq", HQ.x - 100, HQ.y - 100, 200, 200, qubit("b-hqq", 100, 100, HQ.d, 30), "", "transform-origin:100px 100px");
  const hookLbls = lbl("b-hk0", 910, 300, 100, 72, "0") + lbl("b-hk1", 910, 598, 100, 72, "1", `color:${GOLD}`);
  const ROWX = (i) => 80 + 140 * i; // local x of wheel / qubit i (board x = 180 + this)
  const hrowSvg = Array.from({ length: 9 }, (_, k0) => `<g id="b-hr${k0 + 1}">${qubit(`b-hrq${k0 + 1}`, ROWX(k0 + 1), 80, 88, 40 + k0 * 3)}</g>`).join("");
  const hrowHtml = obj("b-hrow", 180, 480, 1560, 160, hrowSvg) + lbl("b-hqm", 1600, 478, 120, 110, "?", `color:${GOLD}`);

  // ---------- 1 to 4. the combination lock (div at 200,160) ----------
  const L1 = { ox: 200, oy: 160 };
  const L1D = [190, 340, 490];
  const roll = (a, from, to, d = 0.4) => [a, a + d, from, to];
  const drumSegs1 = [
    [roll(T.and1, 0, 1, 0.45), roll(10.6, 1, 2, 0.45), roll(T.s10, 2, 3, 0.35), roll(18.7, 3, 5, 1.4)],
    [roll(T.s01, 0, 1, 0.35), roll(T.s10, 1, 2, 0.35), roll(T.s11, 2, 3, 0.35), roll(18.9, 3, 6, 1.4)],
    [roll(19.1, 0, 3, 1.3)],
  ];
  const gold1 = [[[T.zero1, 11.3], [T.s00 - 0.1, 17.0]], [[T.s00 - 0.1, 17.0]], []];
  const lock1Svg =
    lock("b-l1", 40, 240, 600, 340, 380, 200, { x: 100, y: 310, w: 480, h: 200 }, 200) +
    L1D.map((x, i) => `<g id="b-l1d${i}">${drumBox(x, 410, 110, 190, 220 + i * 30)}</g>`).join("");
  const lock1Html = obj("b-lock1", L1.ox, L1.oy, 700, 620, lock1Svg,
    L1D.map((x, i) => drum(`b-l1w${i}`, x, 410, 104, 184, 72, 84, drumSegs1[i], gold1[i], 7, 21)).join(""));
  const crow = (n, y, text, num) =>
    lbl(`b-r${n}t`, 990, y - 4, 290, 62, text, "text-align:left") + lbl(`b-r${n}n`, 1262, y - 4, 90, 62, num, `color:${GOLD}`);
  const counterHtml =
    crow(1, 290, "1 wheel:", "2") + crow(2, 400, "2 wheels:", "4") + crow(3, 510, "3 wheels:", "8") +
    obj("b-carr", 1300, 280, 200, 360,
      `<g id="b-ca1">${carrow([[52, 62], [108, 110], [56, 160]], { strokeWidth: 2.8 }, 14)}</g>` +
      `<g id="b-ca2">${carrow([[52, 172], [108, 220], [56, 270]], { strokeWidth: 2.8 }, 14)}</g>`) +
    lbl("b-x1", 1415, 362, 90, 44, "×2", "text-align:left") + lbl("b-x2", 1415, 472, 90, 44, "×2", "text-align:left");
  const CHIPS = [[0, 0, "00"], [190, 0, "01"], [0, 96, "10"], [190, 96, "11"]];
  const chipsHtml = obj("b-chips", 1000, 618, 360, 180,
    CHIPS.map(([x, y], i) => `<g id="b-chb${i}">${r.rect(x + 4, y + 4, 142, 76, pen({ strokeWidth: 2.4, seed: 260 + i }))}</g>`).join(""),
    CHIPS.map(([x, y, s], i) => lbl(`b-cht${i}`, x + 4, y + 8, 142, 50, bits(s), `color:${GOLD}`).replace('class="lbl hand"', 'class="lbl hand bits"')).join(""));

  // ---------- 5 to 6. ten wheels, then ten qubits (strip div at 180,360) ----------
  const stripSegs = Array.from({ length: 10 }, (_, i) => [[fx(T.ten5 + 0.4 + i * 0.07), fx(T.qubits6 + 0.1), 0, 3 + ((i * 7) % 5)]]);
  const stripSvg =
    `<g id="b-sframe">${r.rect(14, 8, 1392, 184, pen({ strokeWidth: 3.4, seed: 300 }))}${r.rect(26, 18, 1368, 164, pen({ strokeWidth: 1.4, stroke: DIM, roughness: 1.8, seed: 301 }))}</g>` +
    Array.from({ length: 10 }, (_, i) => `<g id="b-sd${i}">${drumBox(ROWX(i), 100, 100, 156, 310 + i * 30)}</g>`).join("") +
    `<g id="b-sweep">${r.rect(ROWX(0) - 58, 14, 116, 172, goldPen({ strokeWidth: 4, seed: 330 }))}</g>`;
  const stripHtml = obj("b-strip", 180, 360, 1440, 210, stripSvg,
    Array.from({ length: 10 }, (_, i) => drum(`b-sw${i}`, ROWX(i), 100, 96, 150, 64, 70, stripSegs[i], [], 21, 26.5)).join(""));
  const twosHtml = obj("b-twos", 180, 562, 1440, 80, "",
    Array.from({ length: 10 }, (_, i) => lbl(`b-two${i}`, ROWX(i) - 30, 0, 60, 56, "2")).join("") +
    Array.from({ length: 9 }, (_, i) => lbl(`b-tim${i}`, ROWX(i) + 50, 4, 40, 48, "×")).join(""));
  const cntHtml = lbl("b-cnt", 660, 632, 600, 96, `<span id="b-cntn">2</span>`) + lbl("b-poss", 940, 660, 520, 60, "possible results", "text-align:left");
  const qrowSvg = Array.from({ length: 10 }, (_, i) => `<g id="b-qr${i}">${qubit(`b-qrq${i}`, ROWX(i), 80, 96, 360 + i * 3)}</g>`).join("");
  const qrowHtml = obj("b-qrow", 180, 380, 1440, 160, qrowSvg, "", "transform-origin:780px 80px");

  // ---------- 7 to 8. the amplitude ledger (div at 520,262) ----------
  const LG = { x: 520, y: 262, w: 880, h: 530, rowH: 62, top: 66, slots: 7, barX: 330, barW: 500 };
  const slotHtml = Array.from({ length: LG.slots }, (_, j) => {
    const init = ["0000000000", "0000000001", "0000000010", "0000000011", "0000000100", null, "1111111111"][j];
    return `<div id="b-ls${j}" class="obj" style="left:0;top:${j * LG.rowH}px;width:${LG.w}px;height:${LG.rowH}px">` +
      `<svg class="sk" width="${LG.w}" height="${LG.rowH}" viewBox="0 0 ${LG.w} ${LG.rowH}"><g id="b-lrule${j}">${r.line(22, LG.rowH - 1, LG.w - 22, LG.rowH - 1, pen({ strokeWidth: 1.4, stroke: DIM, roughness: 0.8, seed: 400 + j }))}</g></svg>` +
      `<div class="lbl hand bits" id="b-lstr${j}" style="left:36px;top:0;width:290px;font-size:48px;line-height:1.05;text-align:left">${init ? bits(init) : VDOTS}</div>` +
      `<div id="b-lbar${j}" class="obj" style="left:${LG.barX}px;top:15px;width:${LG.barW}px;height:34px;clip-path:inset(0 100% 0 0)">` +
      `<svg class="sk" width="${LG.barW}" height="34" viewBox="0 0 ${LG.barW} 34"><g>${hatch(2, 3, LG.barW - 4, 28, INK, 410 + j)}</g><g id="b-lbg${j}" style="opacity:0">${hatch(2, 3, LG.barW - 4, 28, GOLD, 420 + j)}</g></svg></div>` +
      `</div>`;
  }).join("");
  const ledgerHtml = obj("b-ledger", LG.x, LG.y, LG.w, LG.h,
    `<g id="b-lcard">${r.rect(4, 4, LG.w - 8, LG.h - 12, pen({ strokeWidth: 3.2, seed: 390 }))}${r.line(20, 60, LG.w - 20, 60, pen({ strokeWidth: 2, seed: 391 }))}</g>`,
    lbl("b-lhead", 30, 6, 300, 42, "result", "text-align:left") +
    `<div id="b-lview" class="obj" style="left:0;top:${LG.top}px;width:${LG.w}px;height:${LG.rowH * LG.slots}px;overflow:hidden">${slotHtml}</div>`);
  const rowY = (j) => LG.y + LG.top + j * LG.rowH + LG.rowH / 2;
  const ampHtml =
    lbl("b-amp", 1418, rowY(0) - 44, 320, 64, "amplitude", `color:${GOLD};text-align:left`) +
    obj("b-amparr", 1150, rowY(0) - 20, 270, 40, `<g id="b-ampa">${arrow(262, 20, 10, 20, { stroke: GOLD, strokeWidth: 3.2 }, 16)}</g>`) +
    lbl("b-more", 1418, rowY(3) - 34, 320, 50, "more likely", `color:${GOLD};text-align:left`) +
    lbl("b-less", 1418, rowY(6) - 34, 320, 50, "less likely", "text-align:left") +
    lbl("b-rowc", 560, 796, 800, 44, `row <span id="b-rowcn">1</span> of 1,024`);

  // ---------- 9. doubling blocks (div at 700,400) ----------
  const P = [[0, 0], [1, 0]];
  let cols = 2, rows = 1;
  const STEPS = [[2, 1]];
  for (let s = 2; s <= 5; s++) {
    const sh = s % 2 === 0 ? [0, rows] : [cols, 0];
    P.push(...P.map(([c, rr]) => [c + sh[0], rr + sh[1]]));
    if (s % 2 === 0) rows *= 2; else cols *= 2;
    STEPS.push([cols, rows]);
  }
  const CELL = 56, BLK = 48;
  const blocksSvg = P.map(([c, rr], i) => `<g id="b-blk${i}" class="b-blk">${r.rect(c * CELL + 2, rr * CELL + 2, BLK, BLK, { ...goldPen({ seed: 500 + i, strokeWidth: 2.8 }), fill: GOLD, fillStyle: "hachure", hachureGap: 10, fillWeight: 1.6 })}</g>`).join("");
  const GW = 8 * CELL - 8, GH = 4 * CELL - 8;
  const blockOff = STEPS.map(([c, rr]) => [fx((GW - (c * CELL - 8)) / 2), fx((GH - (rr * CELL - 8)) / 2)]);
  const blocksHtml = obj("b-blocks", 700, 400, GW + 8, GH + 8, blocksSvg) +
    lbl("b-blab", 620, 646, 600, 60, `<span id="b-blabt">1 qubit: 2</span>`) +
    obj("b-room", 1140, 290, 180, 130, `<g id="b-roomg">${dashed(bez([20, 120], [40, 30], [150, 26]), 14, 10, { strokeWidth: 2.8 })}${headAt([[130, 26], [150, 26]], { strokeWidth: 2.8 }, 16)}</g>`) +
    lbl("b-roomt", 1300, 282, 460, 50, "and on to 1,024 at ten", "text-align:left");

  // ---------- 10 to 12. the lock again, one string out ----------
  const L2D = Array.from({ length: 10 }, (_, i) => 74 + 48 * i);
  const COMBO = "0110100101";
  const drumSegs2 = L2D.map((_, i) => {
    const mid = 3 + (i % 3), fin = mid + 2 + ((+COMBO[i] - mid % 2 + 2) % 2);
    return [[fx(T.set10 - 1.2 + i * 0.03), fx(T.set10 - 0.1), 0, mid], [fx(T.set10), fx(T.set10 + 0.5 + i * 0.04), mid, fin]];
  });
  const gold2 = [[T.set10 + 0.5, T.qubits11]];
  const lock2Svg =
    lock("b-l2", 20, 220, 540, 240, 300, 170, { x: 45, y: 270, w: 490, h: 140 }, 600) +
    `<g id="b-l2d">${L2D.map((x, i) => r.rect(x - 21, 274, 42, 132, pen({ strokeWidth: 2.4, roughness: 1, seed: 620 + i }))).join("")}</g>`;
  const lock2Html = obj("b-lock2", 160, 200, 600, 560, lock2Svg,
    L2D.map((x, i) => drum(`b-l2w${i}`, x, 340, 40, 128, 50, 54, drumSegs2[i], gold2, 46, 59)).join("") +
    lbl("b-onesett", 20, 476, 540, 48, "one setting at a time"));
  const SROWS = ["0000000000", "0000000001", "0000000010", null, COMBO, null, "1111111111"];
  const SLEN = [0.5, 0.3, 0.68, 0, 0.45, 0, 0.36];
  const sledSvg =
    `<g id="b-scard">${r.rect(4, 4, 752, 392, pen({ strokeWidth: 3, seed: 700 }))}</g>` +
    SROWS.map((s, j) => (s ? `<g id="b-sbar${j}">${hatch(290, 22 + j * 52, 420 * SLEN[j], 26, INK, 710 + j)}</g>` : "")).join("");
  const sledHtml = obj("b-sled", 900, 250, 760, 400, sledSvg,
    SROWS.map((s, j) => `<div class="lbl hand bits" id="b-srow${j}" style="left:30px;top:${12 + j * 52}px;width:250px;font-size:42px;line-height:1.05;text-align:left">${s ? bits(s) : VDOTS}</div>`).join("")) +
    obj("b-sarr", 1250, 648, 60, 50, `<g id="b-sarrg">${arrow(30, 2, 30, 44, { strokeWidth: 3 }, 14)}</g>`);
  const BOX = { x: 1080, y: 690, w: 400, h: 130 };
  const DIGW = 32; // 0.5em at 64px
  const rboxHtml = obj("b-rbox", BOX.x, BOX.y, BOX.w, BOX.h,
    `<g id="b-rframe">${r.rect(4, 4, BOX.w - 8, BOX.h - 8, goldPen({ strokeWidth: 3.2, seed: 730 }))}</g>` +
    `<g id="b-rticks">${Array.from({ length: 10 }, (_, i) => r.line(40 + (i + 0.5) * DIGW, 98, 40 + (i + 0.5) * DIGW, 114, pen({ strokeWidth: 2.4, roughness: 0.6, seed: 740 + i }))).join("")}</g>`,
    `<div class="lbl hand bits" id="b-rstr" style="left:40px;top:6px;width:${10 * DIGW}px;font-size:64px;line-height:1.05;text-align:left;padding:0;color:${GOLD};transform-origin:0 0">${bits(COMBO)}</div>`,
    `transform-origin:${BOX.w / 2}px ${BOX.h / 2}px`);
  // where the chosen row's string sits in the small ledger, relative to b-rstr
  const LIFT = { x: 900 + 30 + 42 * 0.12 - (BOX.x + 40), y: 250 + 12 + 4 * 52 + 42 * 0.12 - (BOX.y + 6), s: 42 / 64 };
  const readHtml = obj("b-read", 1000, 400, 560, 110, `<g id="b-strike">${r.line(20, 64, 540, 48, pen({ strokeWidth: 4.4, seed: 750 }))}</g>`,
    lbl("b-readt", 0, 10, 560, 64, "read all 1,024?"));

  // ---------- 13 to 17. bit order ----------
  const qkHtml = lbl("b-qk", 760, 140, 400, 72, "Qiskit") +
    obj("b-qkb", 1160, 150, 120, 80, `<g id="b-qkbg">${r.linear([[34, 14], [12, 40], [34, 66]], pen({ strokeWidth: 3, seed: 760 }))}${r.line(70, 10, 52, 70, pen({ strokeWidth: 3, seed: 761 }))}${r.linear([[86, 14], [108, 40], [86, 66]], pen({ strokeWidth: 3, seed: 762 }))}</g>`) +
    lbl("b-qksub", 660, 236, 600, 44, "our coding toolkit");
  const pairSvg =
    `<g id="b-pw">${r.line(292, 100, 640, 100, pen({ strokeWidth: 2.6, seed: 770 }))}${r.line(292, 300, 640, 300, pen({ strokeWidth: 2.6, seed: 771 }))}</g>` +
    qubit("b-p0", 220, 100, 140, 772) + qubit("b-p1", 220, 300, 140, 776) +
    `<g id="b-xg">${r.rect(410, 54, 92, 92, pen({ strokeWidth: 3, seed: 780 }))}</g>`;
  const pairHtml = obj("b-pair", 160, 260, 680, 420, pairSvg,
    lbl("b-pq0", 20, 58, 100, 64, "q0", `color:${GOLD}`) + lbl("b-pq1", 20, 258, 100, 64, "q1") + lbl("b-xgl", 410, 58, 92, 64, "X"));
  const QARR = [[30, 180], [160, 70], [340, 40], [485, 128]];
  const qarrHtml = obj("b-qarr", 740, 160, 540, 220, `<g id="b-qa1">${carrow(QARR, { stroke: GOLD, strokeWidth: 3.8 }, 20)}</g><g id="b-qa2">${carrow(QARR, { stroke: GOLD, strokeWidth: 3.8, seed: 790 }, 20)}</g>`);
  const slotsHtml = obj("b-slots", 880, 280, 460, 290,
    `<g id="b-sbox">${r.rect(20, 20, 180, 180, pen({ strokeWidth: 3.2, seed: 800 }))}${r.rect(260, 20, 180, 180, pen({ strokeWidth: 3.2, seed: 801 }))}</g>`,
    lbl("b-s1", 20, 22, 180, 120, "0") + lbl("b-s0a", 260, 22, 180, 120, "0") + lbl("b-s0b", 260, 22, 180, 120, "1", `color:${GOLD}`) +
    lbl("b-sq1", 20, 206, 180, 48, "q1") + lbl("b-sq0", 260, 206, 180, 48, "q0"));
  const tenHtml = obj("b-ten", 1450, 330, 220, 130, `<g id="b-tenx">${r.line(36, 96, 184, 30, pen({ strokeWidth: 4, seed: 810 }))}</g>`,
    lbl("b-tent", 30, 8, 160, 90, "10"));
  const placeHtml = obj("b-place", 880, 562, 460, 220, `<g id="b-pund">${r.curve([[262, 186], [330, 180], [400, 184], [440, 178]], goldPen({ strokeWidth: 4.2, seed: 820 }))}</g>`,
    lbl("b-p4", 20, 0, 180, 90, "4") + lbl("b-p2", 260, 0, 180, 90, "2") + lbl("b-ptens", 20, 112, 180, 44, "tens") + lbl("b-pones", 260, 112, 180, 44, "ones"));
  const UND = [[10, 22], [200, 14], [420, 20], [620, 12]];
  const closeHtml =
    obj("b-cblk", 906, 186, 300, 100,
      `<g id="b-cb1">${hatch(4, 30, 40, 40, INK, 830)}${hatch(52, 30, 40, 40, INK, 831)}</g>` +
      `<g id="b-cba">${arrow(108, 50, 170, 50, { strokeWidth: 2.8 }, 14)}</g>` +
      `<g id="b-cb2">${[[190, 4], [238, 4], [190, 52], [238, 52]].map(([x, y], i) => hatch(x, y, 40, 40, i < 2 ? INK : GOLD, 832 + i)).join("")}</g>`) +
    lbl("b-cA", 900, 290, 860, 72, "+1 qubit → ×2 amplitudes", "text-align:left") +
    lbl("b-cB", 900, 470, 860, 72, "measure → one string", `color:${GOLD};text-align:left`) +
    obj("b-cund", 900, 576, 660, 40, `<g id="b-cundg">${r.curve(UND, goldPen({ strokeWidth: 4.4, seed: 840 }))}</g>` +
      `<path id="b-shim" d="M10 22 C 80 18 140 15 200 14 S 340 20 420 20 S 560 13 620 12" pathLength="1" fill="none" stroke="#f6e3a8" stroke-width="6" stroke-linecap="round" stroke-dasharray="0.08 1.2" style="opacity:0"/>`);

  const html = [hqHtml, hookLbls, hrowHtml, lock1Html, counterHtml, chipsHtml, stripHtml, twosHtml, qrowHtml, cntHtml,
    ledgerHtml, ampHtml, blocksHtml, lock2Html, sledHtml, rboxHtml, readHtml, qkHtml, pairHtml, qarrHtml, slotsHtml,
    tenHtml, placeHtml, closeHtml].join("\n");

  const css = `
    #root .bits span { display: inline-block; width: 0.5em; text-align: center; }
    #root .dg { line-height: 1; padding: 0; }
    #root .vdots { display: inline-block; margin-left: 2.25em; vertical-align: middle; fill: currentColor; }`;

  // Bars: lengths before and after "likely", by row index (0 to 1023)
  const script = `
    const T = ${JSON.stringify(T)};
    const GOLD = "${GOLD}", INK = "${INK}";
    const DR = ${JSON.stringify(DRUMS)};
    const OFF = ${OFF};
    const drumEls = DR.map((d) => Array.from({ length: d.n }, (_, j) => $(d.id + "-" + j)));
    onFrame((t) => DR.forEach((d, k) => {
      if (t < d.on - 0.5 || t > d.off + 0.5) return;
      const p = sched(d.segs, t, 0);
      const g = d.gold.some(([a, b]) => t >= a && t < b);
      drumEls[k].forEach((el, j) => {
        const dd = j - OFF - p;
        el.style.transform = "translateY(" + (dd * d.pitch).toFixed(1) + "px)";
        el.style.opacity = Math.max(0, 1 - Math.abs(dd) * 0.75).toFixed(3);
        el.style.color = g && Math.abs(dd) < 0.5 ? GOLD : INK;
      });
    }));
    const needle = (id, cx, cy, a) => $(id).setAttribute("transform", "rotate(" + a.toFixed(2) + " " + cx + " " + cy + ")");

    // ---------- 0. hook ----------
    draw("#b-hqq-c", T.q, 1.0); draw("#b-hqq-n", T.q + 0.9, 0.4);
    write("#b-hk0", T.z0, 0.25);
    write("#b-hk1", T.o0, 0.25);
    const HN = [[T.o0 - 0.05, T.o0 + 0.4, 0, 180], [T.so0 - 0.25, T.so0 + 0.15, 180, 360]];
    onFrame((t) => needle("b-hqq-nr", 100, 100, sched(HN, t, 0)));
    blurOut("#b-title", T.so0);
    fade(["#b-hk0", "#b-hk1"], 0, T.so0 + 0.1, 0.25);
    move("#b-hq", { x: 0, y: 0, scale: 1 }, { x: -700, y: 60, scale: 0.489 }, T.many, 0.8);
    for (let i = 1; i <= 9; i++) draw("#b-hr" + i, T.ten0 + (i - 1) * 0.08, 0.3);
    write("#b-hqm", T.qs0, 0.4);
    blurOut(["#b-hq", "#b-hrow", "#b-hqm"], T.off0);

    // ---------- 1 to 4. the lock ----------
    draw("#b-l1-sh", T.combo, 0.9); draw("#b-l1-body", T.combo + 0.8, 1.0);
    hide(["#b-l1w0", "#b-l1w1", "#b-l1w2"]);
    draw("#b-l1d0", T.wheel1, 0.5); fade("#b-l1w0", 1, T.pos1, 0.3);
    write("#b-r1t", T.gives2, 0.4); write("#b-r1n", T.two2, 0.2);
    draw("#b-l1d1", T.second2, 0.5); fade("#b-l1w1", 1, T.second2 + 0.35, 0.3);
    write("#b-r2t", T.makes2 - 0.1, 0.4); draw("#b-ca1", T.makes2, 0.4); write("#b-x1", T.makes2 + 0.3, 0.2);
    write("#b-r2n", T.four2 - 0.1, 0.2); tl.to("#b-r1n", { color: INK, duration: 0.3 }, T.four2 - 0.1);
    tl.to("#b-r2n", { color: INK, duration: 0.3 }, T.s00 - 0.1);
    [T.s00, T.s01, T.s10, T.s11].forEach((t, i) => {
      draw("#b-chb" + i, t - 0.1, 0.3); write("#b-cht" + i, t, 0.25);
      if (i < 3) tl.to("#b-cht" + i, { color: INK, duration: 0.25 }, [T.s01, T.s10, T.s11][i]);
    });
    blurOut("#b-chips", T.third4);
    draw("#b-l1d2", T.third4, 0.5); fade("#b-l1w2", 1, T.third4 + 0.35, 0.3);
    write("#b-r3t", T.makes4 - 0.05, 0.4); draw("#b-ca2", T.makes4 + 0.05, 0.4); write("#b-x2", T.makes4 + 0.35, 0.2);
    write("#b-r3n", T.eight4, 0.2);
    tl.to(all(["#b-ca1 path", "#b-ca2 path"]), { stroke: GOLD, duration: 0.3 }, T.doubles4);
    tl.to(all(["#b-x1", "#b-x2"]), { color: GOLD, duration: 0.3 }, T.doubles4);
    tl.to(all(["#b-ca1 path", "#b-ca2 path"]), { stroke: INK, duration: 0.4 }, T.doubles4 + 0.9);
    tl.to(all(["#b-x1", "#b-x2"]), { color: INK, duration: 0.4 }, T.doubles4 + 0.9);
    tl.to("#b-r3n", { scale: 1.2, duration: 0.25, yoyo: true, repeat: 1 }, T.doubles4 + 0.2);
    blurOut(["#b-lock1", "#b-r1t", "#b-r1n", "#b-r2t", "#b-r2n", "#b-r3t", "#b-r3n", "#b-carr", "#b-x1", "#b-x2"], T.off4);

    // ---------- 5 to 6. ten wheels, ten qubits ----------
    draw("#b-sframe", T.ten5, 0.6);
    for (let i = 0; i < 10; i++) draw("#b-sd" + i, T.ten5 + 0.3 + i * 0.08, 0.25);
    hide(["#b-sweep", "#b-cnt"].concat(Array.from({ length: 10 }, (_, i) => "#b-sw" + i)));
    for (let i = 0; i < 10; i++) fade("#b-sw" + i, 1, T.ten5 + 0.45 + i * 0.08, 0.25);
    const SW0 = T.power5, SW1 = T.land5;
    for (let i = 0; i < 10; i++) {
      write("#b-two" + i, SW0 + ((SW1 - SW0) * i) / 9 - 0.05, 0.15);
      if (i < 9) write("#b-tim" + i, SW0 + ((SW1 - SW0) * (i + 0.5)) / 9 - 0.05, 0.1);
    }
    fade("#b-sweep", 1, SW0 - 0.1, 0.15); fade("#b-cnt", 1, SW0 - 0.1, 0.15);
    fade("#b-sweep", 0, SW1 + 0.6, 0.3);
    const fmt = (n) => String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
    let lastCnt = "";
    onFrame((t) => {
      const s = Math.min(9, Math.max(0, ((t - SW0) / (SW1 - SW0)) * 9));
      $("b-sweep").setAttribute("transform", "translate(" + (140 * s).toFixed(1) + " 0)");
      const n = Math.pow(2, Math.min(10, Math.floor(s + 0.02) + 1));
      const txt = fmt(n);
      if (txt !== lastCnt) { $("b-cntn").textContent = txt; lastCnt = txt; }
      $("b-cnt").style.color = t >= SW1 ? GOLD : INK;
    });
    tl.fromTo("#b-cnt", { scale: 1 }, { scale: 1.18, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }, SW1);
    blurOut(["#b-strip"], T.qubits6);
    fade("#b-twos", 0, T.qubits6, 0.3);
    for (let i = 0; i < 10; i++) draw("#b-qr" + i, T.qubits6 + 0.05 + i * 0.07, 0.35);
    onFrame((t) => {
      if (t < T.qubits6 || t > T.off8 + 0.5) return;
      const amp = 16 * ease.clamp((t - T.qubits6 - 0.6) / 1.2);
      for (let i = 0; i < 10; i++) needle("b-qrq" + i + "-nr", ${ROWX(0)} + 140 * i, 80, amp * Math.sin(1.7 * t + i * 0.9));
    });
    tl.to("#b-cnt", { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }, T.have6);
    tl.to("#b-cnt", { x: -170, duration: 0.6, ease: "power2.inOut" }, T.have6 + 0.4);
    write("#b-poss", T.poss6, 0.7);
    blurOut(["#b-cnt", "#b-poss"], T.off6);
    move("#b-qrow", { y: 0, scale: 1 }, { y: -275, scale: 0.5 }, T.off6 + 0.05, 0.8);

    // ---------- 7 to 8. the amplitude ledger ----------
    draw("#b-lcard", T.quantum7, 1.2);
    draw(Array.from({ length: 7 }, (_, j) => "#b-lrule" + j), T.quantum7 + 0.9, 0.6);
    for (let j = 0; j < 7; j++) write("#b-lstr" + j, T.qubits7 - 0.2 + j * 0.14, 0.3);
    write("#b-lhead", T.result7, 0.3);
    write("#b-amp", T.called7, 0.6); draw("#b-ampa", T.called7 + 0.15, 0.4);
    write("#b-rowc", T.called7 + 0.9, 0.5);
    tl.to("#b-amp", { scale: 1.12, duration: 0.2, yoyo: true, repeat: 1, transformOrigin: "0% 50%" }, T.amp8);
    fade("#b-amparr", 0, T.likely8 - 0.1, 0.25);
    write("#b-more", T.likely8 + 0.5, 0.5);
    write("#b-less", T.result8 + 0.1, 0.5);
    fade(["#b-more", "#b-less"], 0, T.carry8 - 0.2, 0.25);
    const A1 = { 0: 0.55, 1: 0.35, 2: 0.72, 3: 0.45, 4: 0.6, 1023: 0.42 };
    const A2 = { 0: 0.42, 1: 0.55, 2: 0.3, 3: 0.95, 4: 0.5, 1023: 0.1 };
    const hash = (i, s) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
    const amp1 = (i) => A1[i] ?? 0.2 + 0.6 * hash(i, 1);
    const amp2 = (i) => A2[i] ?? 0.15 + 0.7 * hash(i, 2);
    const SCROLL = [[T.carry8, T.carry8 + 1.6, 0, 1023]];
    const PRE = [0, 1, 2, 3, 4, -1, 1023];
    const VD = ${JSON.stringify(VDOTS)};
    const binStr = (i) => i.toString(2).padStart(10, "0").split("").map((c) => "<span>" + c + "</span>").join("");
    const slotCache = [];
    let lastRow = "";
    onFrame((t) => {
      if (t < T.quantum7 - 0.5 || t > T.off8 + 0.5) return;
      const v = sched(SCROLL, t, 0), base = Math.floor(v), frac = v - base;
      const scrolling = t > T.carry8;
      const m = ease.inOut((t - T.likely8) / 1.0);
      for (let j = 0; j < 7; j++) {
        const idx = scrolling ? base + j : PRE[j];
        const html = idx < 0 ? VD : idx > 1023 ? "" : binStr(idx);
        if (slotCache[j] !== html) { $("b-lstr" + j).innerHTML = html; slotCache[j] = html; }
        $("b-ls" + j).style.transform = "translateY(" + (-frac * ${LG.rowH}).toFixed(1) + "px)";
        const rev = ease.inOut((t - T.number7 - j * 0.08) / 0.6);
        const len = idx < 0 || idx > 1023 ? 0 : rev * (amp1(idx) * (1 - m) + amp2(idx) * m);
        $("b-lbar" + j).style.clipPath = "inset(0 " + (100 - len * 100).toFixed(2) + "% 0 0)";
        $("b-lbg" + j).style.opacity = idx === 3 && t > T.likely8 + 0.3 && t < T.carry8 + 0.1 ? "1" : "0";
      }
      const row = fmt(scrolling ? Math.min(1024, base + 1) : 1);
      if (row !== lastRow) { $("b-rowcn").textContent = row; lastRow = row; }
      $("b-rowc").style.color = v >= 1023 ? GOLD : INK;
    });
    blurOut(["#b-ledger", "#b-amp", "#b-rowc", "#b-qrow"], T.off8);

    // ---------- 9. doubling blocks ----------
    const BO = ${JSON.stringify(blockOff)};
    const STEPT = [0, 1, 2, 3, 4].map((s) => T.doubling9 + s * 0.45);
    tl.fromTo("#b-blocks", { x: BO[0][0], y: BO[0][1] }, { x: BO[0][0], y: BO[0][1], duration: 0.01 }, 0);
    STEPT.forEach((t, s) => {
      const from = s === 0 ? 0 : Math.pow(2, s), to = Math.pow(2, s + 1);
      draw(Array.from({ length: to - from }, (_, i) => "#b-blk" + (from + i)), t, 0.35);
      if (s > 0) {
        tl.to("#b-blocks", { x: BO[s][0], y: BO[s][1], duration: 0.35, ease: "power2.inOut" }, t - 0.05);
        tl.to(all(Array.from({ length: from }, (_, i) => "#b-blk" + i + " path")), { stroke: INK, duration: 0.3 }, t);
      }
    });
    write("#b-blab", STEPT[0], 0.4);
    let lastBl = "";
    onFrame((t) => {
      const s = STEPT.filter((x) => t >= x).length || 1;
      const txt = s + (s > 1 ? " qubits: " : " qubit: ") + Math.pow(2, s);
      if (txt !== lastBl) { $("b-blabt").textContent = txt; lastBl = txt; }
    });
    tl.to(all(Array.from({ length: 16 }, (_, i) => "#b-blk" + (16 + i) + " path")), { stroke: INK, duration: 0.3 }, T.room9 + 0.8);
    draw("#b-roomg", T.room9, 0.45); write("#b-roomt", T.room9 + 0.25, 0.8);
    tl.to("#b-roomt", { color: GOLD, duration: 0.3 }, T.room9 + 1.2);
    blurOut(["#b-blocks", "#b-blab", "#b-room", "#b-roomt"], T.off9);

    // ---------- 10 to 12. the lock breaks ----------
    move("#b-lock2", { x: 510 }, { x: 0 }, T.qubits11 - 0.35, 0.8);
    draw("#b-l2-sh", T.lock10, 0.7); draw("#b-l2-body", T.lock10 + 0.6, 0.9);
    draw("#b-l2d", T.lock10b - 0.2, 0.6);
    const L2W = Array.from({ length: 10 }, (_, i) => "#b-l2w" + i);
    hide(L2W); fade(L2W, 1, T.lock10b + 0.3, 0.3);
    write("#b-onesett", T.one10, 0.8);
    draw("#b-scard", T.qubits11, 0.9);
    for (let j = 0; j < 7; j++) write("#b-srow" + j, T.qubits11 + 0.4 + j * 0.12, 0.3);
    draw(["#b-sbar0", "#b-sbar1", "#b-sbar2", "#b-sbar4", "#b-sbar6"], T.amp11, 1.0);
    const DIMROWS = [0, 1, 2, 3, 5, 6];
    fade(DIMROWS.map((j) => "#b-srow" + j), 0.3, T.measuring11, 0.4);
    fade(["#b-sbar0", "#b-sbar1", "#b-sbar2", "#b-sbar6"], 0.25, T.measuring11, 0.4);
    fade("#b-srow4", 0.3, T.measuring11 + 0.35, 0.4);
    tl.to(all("#b-sbar4 path"), { stroke: GOLD, duration: 0.3 }, T.measuring11);
    draw("#b-sarrg", T.measuring11, 0.35);
    draw("#b-rframe", T.measuring11 + 0.2, 0.5);
    hide("#b-rstr");
    show("#b-rstr", T.measuring11 + 0.35);
    move("#b-rstr", { x: ${fx(LIFT.x)}, y: ${fx(LIFT.y)}, scale: ${fx(LIFT.s)} }, { x: 0, y: 0, scale: 1 }, T.measuring11 + 0.35, 0.8);
    blurOut(["#b-sled", "#b-sarr"], T.off11);
    write("#b-readt", T.read12, 0.7);
    draw("#b-strike", T.amps12, 0.4);
    blurOut(["#b-read", "#b-lock2"], T.string12 - 0.1);
    move("#b-rbox", { x: 0, y: 0, scale: 1 }, { x: -320, y: -285, scale: 1.5 }, T.string12, 0.9);
    draw("#b-rticks", T.ten12, 0.7);
    blurOut("#b-rbox", T.off12);

    // ---------- 13 to 17. bit order ----------
    write("#b-qk", T.habit13, 0.5); draw("#b-qkbg", T.habit13 + 0.4, 0.4);
    write("#b-qksub", T.our13, 0.8);
    draw("#b-pw", T.numbers13, 0.5);
    draw(["#b-p0-c", "#b-p0-n"], T.numbers13 + 0.1, 0.6); draw(["#b-p1-c", "#b-p1-n"], T.numbers13 + 0.4, 0.6);
    write("#b-pq0", T.qubits13, 0.3); write("#b-pq1", T.qubits13 + 0.45, 0.3);
    blurOut(["#b-qk", "#b-qkb", "#b-qksub"], T.off13);
    draw("#b-sbox", T.result14, 0.7);
    write("#b-sq1", T.result14 + 0.5, 0.25); write("#b-sq0", T.result14 + 0.7, 0.25);
    draw("#b-qa1", T.goes14, 0.6);
    tl.to("#b-sq0", { color: GOLD, duration: 0.3 }, T.goes14 + 0.4);
    write("#b-s1", T.two15, 0.2); write("#b-s0a", T.two15 + 0.15, 0.2);
    draw("#b-xg", T.flip15, 0.4); write("#b-xgl", T.flip15 + 0.2, 0.2);
    const PN = [[T.flip15 + 0.25, T.flip15 + 0.85, 0, 180]];
    onFrame((t) => { needle("b-p0-nr", 220, 100, sched(PN, t, 0)); });
    tl.to(all(["#b-p0-c path", "#b-p0-n path"]), { stroke: GOLD, duration: 0.3 }, T.flip15 + 0.5);
    tl.to(all("#b-p0-n path.solid"), { fill: GOLD, duration: 0.3 }, T.flip15 + 0.5);
    fade("#b-s0a", 0, T.flip15 + 0.8, 0.2);
    write("#b-s0b", T.flip15 + 0.85, 0.25);
    tl.to(all(["#b-s1", "#b-s0b"]), { scale: 1.18, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }, T.shows16);
    write("#b-tent", T.not16, 0.3); draw("#b-tenx", T.not16 + 0.3, 0.3);
    fade("#b-qa1", 0, T.with16 - 0.15, 0.15); draw("#b-qa2", T.with16, 0.6);
    write("#b-p4", T.like16, 0.2); write("#b-p2", T.like16 + 0.15, 0.2);
    write("#b-ptens", T.like16 + 0.3, 0.25); write("#b-pones", T.ones16, 0.25);
    draw("#b-pund", T.ones16 + 0.1, 0.4);
    tl.to(all(["#b-p2", "#b-pones"]), { color: GOLD, duration: 0.3 }, T.ones16 + 0.1);
    blurOut(["#b-place", "#b-ten", "#b-pair", "#b-qarr"], T.off16);
    move("#b-slots", { x: 0 }, { x: -560 }, T.off16 + 0.1, 0.8);
    write("#b-cA", T.add17, 1.2);
    draw("#b-cb1", T.add17 + 0.1, 0.3); draw("#b-cba", T.doubles17, 0.3); draw("#b-cb2", T.doubles17 + 0.25, 0.4);
    write("#b-cB", T.meas17, 1.0);
    draw("#b-cundg", T.meas17 + 1.0, 0.6);
    fade("#b-shim", 1, T.string17, 0.3);
    onFrame((t) => {
      if (t < T.string17) return;
      $("b-shim").style.strokeDashoffset = (1.1 - ((t - T.string17) * 0.45) % 1.3).toFixed(3);
    });
  `;
  return { html, script, css };
}
