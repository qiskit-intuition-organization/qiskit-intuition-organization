// Lesson 15, "Phase kickback: Deutsch's algorithm". Follows plan.md: the sealed box (constant or
// balanced), the trick coin and the real coin, two questions for an ordinary computer and one for a
// quantum one, the circuit with its helper set to minus, the flip that only turns minus over (times
// minus one), the input in superposition, the minus one kicked back onto the input's arrow, the
// constant and balanced panels where a final H makes the arrows add or cancel, where the coin
// picture breaks (one fact about the pair, never either face), and the closing formula and takeaway.
// Amplitude arrows: up = plus, down = minus, one arrow per reading 0 and 1 (as in lesson 8).
export const phrases = [
  ["minus one to the power of its answer", "(−1)^f(x)"],
  ["times minus one", "× (−1)"],
  ["that minus one", "that −1"],
  ["becomes minus", "becomes |−⟩"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, INK, GOLD, GROUND } = k;
  const PI = Math.PI;
  const DIMINK = "rgba(232,232,232,0.42)";
  const fx = (n) => +(+n).toFixed(2);
  const C = (id, cx, cy, w, size, html, extra = "") => lbl(id, fx(cx - w / 2), fx(cy - size * 0.76), w, size, html, extra);
  const L = (id, x, cy, w, size, html, extra = "") => lbl(id, fx(x), fx(cy - size * 0.76), w, size, html, `text-align:left;${extra}`);
  const R = (id, x2, cy, w, size, html, extra = "") => lbl(id, fx(x2 - w), fx(cy - size * 0.76), w, size, html, `text-align:right;${extra}`);
  const cc = (svg) => svg.replaceAll(`stroke="${INK}"`, 'stroke="currentColor"').replaceAll(`stroke="${GOLD}"`, 'stroke="currentColor"');
  const G = (id, inner, extra = "") => `<g id="${id}"${extra}>${inner}</g>`;
  const at = (x, y, a = 0, s = 1) => `translate(${fx(x)} ${fx(y)}) rotate(${fx(a)}) scale(${s})`;
  const full = (id, svg, inner = "", extra = "") =>
    `<div class="obj" id="${id}" style="left:0;top:0;width:1920px;height:1080px;${extra}"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${inner}</div>`;
  const gold = (s) => `<span style="color:${GOLD}">${s}</span>`;
  const M = "−";

  // ---------- drawing helpers ----------
  const bez = (p0, p1, p2, n = 30) => Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n, a = (1 - u) ** 2, b = 2 * u * (1 - u), c = u * u;
    return [fx(a * p0[0] + b * p1[0] + c * p2[0]), fx(a * p0[1] + b * p1[1] + c * p2[1])];
  });
  const headAt = (pts, o, size = 18) => {
    const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1];
    const a = Math.atan2(y2 - y1, x2 - x1), w = (o.strokeWidth ?? 3) * 0.85;
    return [0.45, -0.45].map((da) => r.line(x2, y2, fx(x2 - size * Math.cos(a + da)), fx(y2 - size * Math.sin(a + da)), pen({ ...o, strokeWidth: w }))).join("");
  };
  const curveArrow = (pts, o, size = 18) => r.curve(pts, pen(o)) + headAt(pts, o, size);
  const arcPts = (cx, cy, R0, a0, a1, n = 30) => Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * PI) / 180;
    return [fx(cx + R0 * Math.cos(a)), fx(cy + R0 * Math.sin(a))];
  });
  // A sealed crate: front, top and side faces filled with the ground, two straps.
  function crate(x, y, w, h, d, sw = 3.2) {
    const f = { strokeWidth: sw, roughness: 1, fill: GROUND, fillStyle: "solid" };
    return r.poly([[x, y], [x + d, y - d], [x + w + d, y - d], [x + w, y]], pen(f)) +
      r.poly([[x + w, y], [x + w + d, y - d], [x + w + d, y + h - d], [x + w, y + h]], pen(f)) +
      r.rect(x, y, w, h, pen(f)) +
      r.line(x + w * 0.2, y + 3, x + w * 0.2, y + h - 3, pen({ strokeWidth: sw * 0.6 })) +
      r.line(x + w * 0.8, y + 3, x + w * 0.8, y + h - 3, pen({ strokeWidth: sw * 0.6 }));
  }
  const gateBox = (x, y, w, h, sw = 3.2) => r.rect(x, y, w, h, pen({ strokeWidth: sw, roughness: 1, fill: GROUND, fillStyle: "solid" }));
  // Coin faces
  const sun = (cx, cy, s = 1) =>
    r.circle(cx, cy, 58 * s, pen({ strokeWidth: 3.2 })) +
    Array.from({ length: 8 }, (_, i) => {
      const a = (i * PI) / 4;
      return r.line(fx(cx + 38 * s * Math.cos(a)), fx(cy + 38 * s * Math.sin(a)), fx(cx + 56 * s * Math.cos(a)), fx(cy + 56 * s * Math.sin(a)), pen({ strokeWidth: 2.8, roughness: 0.8 }));
    }).join("");
  // A crescent: the outer arc round the left, then an inner arc (circle shifted right) back.
  function moon(cx, cy) {
    const outer = arcPts(cx, cy, 48, 50, 310, 26);
    const [tx, ty] = outer[outer.length - 1], ox = cx + 21;
    const rr = Math.hypot(tx - ox, ty - cy), aTop = (Math.atan2(ty - cy, tx - ox) * 180) / PI;
    const inner = arcPts(ox, cy, rr, aTop, aTop - (360 + 2 * aTop), 22);
    return r.curve([...outer, ...inner.slice(1)], pen({ strokeWidth: 3.2, roughness: 0.7 }));
  }
  const coin = (cx, cy) => r.circle(cx, cy, 190, pen({ strokeWidth: 3.6 })) + r.circle(cx, cy, 166, pen({ strokeWidth: 1.6, roughness: 1.6 }));
  // An amplitude arrow standing on its foot at (0,0), pointing up; groups are turned by onFrame.
  const footArrow = (len, sw, head) => cc(arrow(0, 0, 0, -len, { strokeWidth: sw }, head));
  // A speech bubble div that can slide.
  const bubble = (id, cx, cy, w, h, text, size = 56) =>
    `<div class="obj" id="${id}" style="left:${fx(cx - w / 2 - 40)}px;top:${fx(cy - h / 2 - 20)}px;width:${w + 80}px;height:${h + 70}px">` +
    `<svg class="sk" width="${w + 80}" height="${h + 70}" viewBox="0 0 ${w + 80} ${h + 70}">${r.ellipse(w / 2 + 40, h / 2 + 20, w, h, pen({ strokeWidth: 3, fill: GROUND, fillStyle: "solid" }))}` +
    `${r.line(w * 0.3 + 40, h * 0.9 + 20, w * 0.12 + 40, h + 46, pen({ strokeWidth: 2.8 }))}${r.line(w * 0.12 + 40, h + 46, w * 0.42 + 40, h * 0.97 + 20, pen({ strokeWidth: 2.8 }))}</svg>` +
    C(`${id}-t`, w / 2 + 40, h / 2 + 20, w, size, text) + `</div>`;

  // A card of amplitude arrows: baseline centred on (cx, by), slots at cx -/+ off, label size ls.
  // Arrow groups ${p}-a0 and ${p}-a1 start at the given angles (0 = up, 180 = down).
  function card(p, cx, by, half, off, len, ls, sw, head, angles, opts = {}) {
    const col = opts.color ?? INK;
    const slots = [cx - off, cx + off];
    const base = G(`${p}-base`, r.line(cx - half, by, cx + half, by, pen({ strokeWidth: sw * 0.62, stroke: col })) +
      slots.map((x) => r.line(x, by - 7, x, by + 7, pen({ strokeWidth: sw * 0.5, stroke: col }))).join(""));
    const arrows = slots.map((x, i) => `<g id="${p}-a${i}" transform="${at(x, by, angles[i])}" style="color:${opts.arrowColors?.[i] ?? col}">${footArrow(len, sw, head)}</g>`).join("");
    const labels = slots.map((x, i) => C(`${p}-s${i}`, x - ls * 0.85, by + ls * 0.72, ls * 1.2, ls, String(i), opts.labelCss ?? "")).join("");
    return { svg: base + arrows, html: labels, slots };
  }

  // ---------- Times, cued to the voice ----------
  const T = {
    sealed: cue(0, "sealed", 0, -0.1), takes: cue(0, "takes", 0, -0.1), answers: cue(0, "answers", 0, -0.05), titleOut: cue(0, "answers"),
    hookOut: cue(1, "either", 0, -0.2), its1: cue(1, "It's"), const1: cue(1, "constant", 0, -0.1), same1: cue(1, "same", 0, -0.1),
    both1: cue(1, "both", 0, -0.1), times1: cue(1, "times", 0, -0.1), bal1: cue(1, "balanced", 0, -0.1), two1: cue(1, "two", 0, -0.1),
    diff1: cue(1, "different", 0, -0.1), cardsOut: cue(2, "Think", 0, -0.2),
    coin2: cue(2, "coin", 0, -0.15), trick2: cue(2, "trick", 0, -0.1), same2: cue(2, "same", 0, -0.1), twice2: cue(2, "twice", 0, -0.1),
    real2: cue(2, "real", 0, -0.1), two2: cue(2, "two", 0, -0.15), diff2: cue(2, "different", 0, 0.05),
    l3: cue(3), check: cue(3, "check", 0, -0.1), ordinary: cue(3, "ordinary", 0, -0.15), ask: cue(3, "ask", 0, -0.1), twice3: cue(3, "twice", 0, -0.1),
    lapOut: cue(4, "quantum", 0, -0.2), chip: cue(4, "quantum", 0, -0.05), once: cue(4, "once", 0, -0.1), phase4: cue(4, "phase", 0, -0.1),
    answer4: cue(4, "answer", 0, -0.1), sign4: cue(4, "sign", 0, -0.1), l4Out: cue(5, "box", 0, -0.2),
    box5: cue(5, "box", 0, -0.1), helper5: cue(5, "helper", 0, -0.1), whenever: cue(5, "whenever", 0, -0.1),
    l6: cue(6), minus6: cue(6, "minus", 0, -0.1), arrow6: cue(6, "arrow", 0, -0.1), up6: cue(6, "up", 0, -0.1), down6: cue(6, "down", 0, -0.1),
    l7: cue(7), swap: cue(7, "arrows", 0, -0.05), still: cue(7, "still", 0, -0.1), turned: cue(7, "turned", 0, -0.1), times7: cue(7, "times", 0, -0.1),
    l7Out: cue(8, "Now", 0, -0.2), now8: cue(8, "Now", 0, -0.05), puts: cue(8, "puts", 0, -0.3), input8: cue(8, "input", 0, -0.1),
    sup8: cue(8, "superposition", 0, -0.1), zero8: cue(8, "zero", 0, -0.1), one8: cue(8, "on", 1, 0.15),
    l9: cue(9), wherever: cue(9, "wherever", 0, -0.1), that9: cue(9, "that", 0, -0.1), instead: cue(9, "instead", 0, -0.1), phase9: cue(9, "phase", 0, -0.1),
    l9Out: cue(10, "If", 0, -0.2), const10: cue(10, "constant", 0, -0.2), both10: cue(10, "both", 0, -0.1), same10: cue(10, "same", 0, -0.1), keeps: cue(10, "keeps", 0, -0.1),
    l11: cue(11), bal11: cue(11, "balanced", 0, -0.2), one11: cue(11, "one", 0, -0.1), minus11: cue(11, "minus", 0, -0.1),
    l12: cue(12), final: cue(12, "final", 0, 0.2), intf: cue(12, "interfere", 0, -0.1), adding: cue(12, "adding", 0, -0.1), cancel12: cue(12, "cancelling", 0, -0.1),
    zero12: cue(12, "zero", 0, -0.1), one12: cue(12, "one", 0, -0.1), every: cue(12, "every", 0, -0.1),
    l12Out: cue(13, "Here", 0, -0.2), coin13: cue(13, "coin", 0, -0.15), breaks: cue(13, "breaks", 0, -0.1), never13: cue(13, "never", 0, -0.1), whether: cue(13, "whether", 0, -0.1),
    never14: cue(14, "never", 0, -0.15), both14: cue(14, "both", 0, -0.1), intf14: cue(14, "interference", 0, -0.1), fact: cue(14, "fact", 0, -0.1),
    out14: cue(15, "Deutsch's", 0, -0.2), deutsch: cue(15, "Deutsch's", 0, -0.05), box15: cue(15, "box", 0, -0.1), mult: cue(15, "multiplies", 0, -0.1),
    input15: cue(15, "input", 0, -0.1), minus15: cue(15, "minus", 0, -0.05), power: cue(15, "power", 0, -0.1), answer15: cue(15, "answer", 0, -0.05),
    l16: cue(16, "Phase", 0, -0.15), writes: cue(16, "writes", 0, -0.1), intf16: cue(16, "interference", 0, -0.1), one16: cue(16, "one", 0, -0.1),
  };

  // ===================== Line 0: the sealed box =====================
  const hookSvg =
    G("b-hbox", crate(780, 430, 360, 280, 36, 3.6)) +
    G("b-hin", arrow(370, 570, 760, 570, { strokeWidth: 3.6 }, 24)) +
    G("b-hout", cc(arrow(1196, 570, 1550, 570, { strokeWidth: 3.6 }, 24)), ` style="color:${GOLD}"`);
  const hookHtml =
    C("b-hq", 960, 574, 200, 170, "?") +
    C("b-hinl", 565, 506, 260, 56, "0 or 1") +
    C("b-houtl", 1373, 506, 260, 56, "0 or 1", `color:${GOLD}`);

  // ===================== Line 1: constant or balanced =====================
  const brace = (x, y0, y1, w = 26) => {
    const m = (y0 + y1) / 2;
    return r.curve([[x, y0], [x + w * 0.8, y0 + 10], [x + w * 0.8, m - 18], [x + w * 1.6, m], [x + w * 0.8, m + 18], [x + w * 0.8, y1 - 10], [x, y1]], goldPen({ strokeWidth: 3.4, roughness: 0.7 }));
  };
  const cardsSvg =
    G("b-ccard", r.rect(260, 360, 600, 400, pen({ strokeWidth: 2.8, roughness: 1.1 }))) +
    G("b-bcard", r.rect(1060, 360, 600, 400, pen({ strokeWidth: 2.8, roughness: 1.1 }))) +
    G("b-cbr", cc(brace(612, 500, 670)), ` style="color:${GOLD}"`) +
    G("b-bbr", cc(brace(1412, 500, 670)), ` style="color:${GOLD}"`);
  const cardsHtml =
    C("b-ct", 560, 425, 400, 64, "constant") +
    C("b-cr0", 500, 530, 260, 56, `0 → <span class="b-ansC" style="color:${GOLD}">1</span>`) +
    C("b-cr1", 500, 640, 260, 56, `1 → <span class="b-ansC" style="color:${GOLD}">1</span>`) +
    C("b-csame", 756, 586, 140, 48, "same", `color:${GOLD}`) +
    C("b-bt", 1360, 425, 400, 64, "balanced") +
    C("b-br0", 1300, 530, 260, 56, `0 → <span class="b-ansB" style="color:${GOLD}">0</span>`) +
    C("b-br1", 1300, 640, 260, 56, `1 → <span class="b-ansB" style="color:${GOLD}">1</span>`) +
    C("b-bdiff", 1568, 586, 190, 44, "different", `color:${GOLD}`);

  // ===================== Lines 2 and 3: the coins =====================
  const turnArrow = (x0, x1) => curveArrow(bez([x0, 378], [(x0 + x1) / 2, 300], [x1, 378]), { strokeWidth: 3.4 }, 18);
  const coinsSvg =
    G("b-ctT", coin(380, 480) + coin(660, 480)) +
    G("b-sunT0", cc(sun(380, 480)), ` style="color:${GOLD}"`) +
    G("b-sunT1", cc(sun(660, 480)), ` style="color:${GOLD}"`) +
    G("b-ctF", coin(1260, 480) + coin(1540, 480)) +
    G("b-sunF", cc(sun(1260, 480)), ` style="color:${GOLD}"`) +
    G("b-moonF", cc(moon(1540, 480)), ` style="color:${GOLD}"`) +
    G("b-turnT", cc(turnArrow(420, 620)), ` style="color:${GOLD}"`) +
    G("b-turnF", cc(turnArrow(1300, 1500)), ` style="color:${GOLD}"`);
  const coinsHtml =
    C("b-ctl", 520, 640, 300, 56, "trick coin") + C("b-ctl2", 520, 706, 240, 44, "constant") +
    C("b-cfl", 1400, 640, 300, 56, "real coin") + C("b-cfl2", 1400, 706, 240, 44, "balanced");

  // ===================== Lines 3 and 4: two questions, then one =====================
  const laptop =
    r.rect(340, 300, 300, 180, pen({ strokeWidth: 3.4 })) + r.rect(362, 320, 256, 140, pen({ strokeWidth: 1.8, roughness: 1.4 })) +
    r.poly([[322, 484], [658, 484], [704, 534], [276, 534]], pen({ strokeWidth: 3.2 })) +
    r.line(330, 500, 650, 500, pen({ strokeWidth: 1.8 })) + r.line(318, 516, 662, 516, pen({ strokeWidth: 1.8 })) + r.line(430, 527, 550, 527, pen({ strokeWidth: 2.2 }));
  const chip =
    r.rect(400, 320, 200, 200, pen({ strokeWidth: 3.4 })) + r.rect(424, 344, 152, 152, pen({ strokeWidth: 1.8, roughness: 1.3 })) +
    [0, 1, 2, 3].map((i) => {
      const q = 350 + i * 47;
      return r.line(376, q, 400, q, pen({ strokeWidth: 2.6 })) + r.line(600, q, 624, q, pen({ strokeWidth: 2.6 })) +
        r.line(q + 80, 296, q + 80, 320, pen({ strokeWidth: 2.6 })) + r.line(q + 80, 520, q + 80, 544, pen({ strokeWidth: 2.6 }));
    }).join("") +
    r.circle(500, 420, 92, pen({ strokeWidth: 3 })) + arrow(500, 448, 500, 392, { strokeWidth: 3 }, 14);
  const qSvg =
    G("b-lap", laptop) + G("b-chip", chip) +
    G("b-box2", crate(1060, 330, 216, 168, 22, 3.2)) +
    G("b-strike", r.line(1066, 562, 1270, 556, pen({ strokeWidth: 3.6 }))) +
    G("b-sgn", cc(arrow(1150, 836, 1150, 790, { strokeWidth: 3.2 }, 13) + arrow(1186, 790, 1186, 836, { strokeWidth: 3.2 }, 13)), ` style="color:${INK}"`);
  const qHtml =
    C("b-box2q", 1168, 416, 120, 100, "?") +
    C("b-two", 1168, 560, 300, 56, "2 questions", `color:${GOLD}`) +
    C("b-oneq", 1168, 632, 300, 56, "1 question", `color:${GOLD}`) +
    C("b-note", 960, 814, 300, 44, "answer → a sign");

  // ===================== Lines 5 to 9: the circuit =====================
  const WI = 420, WH = 640; // input and helper wires
  const OX = 860, OW = 200, OY = 330, OH = 370, OD = 24; // the oracle box
  const circSvg =
    G("b-wireIn", r.line(200, WI, OX + 2, WI, pen({ strokeWidth: 3.2 })) + r.line(OX + OW + OD, WI, 1700, WI, pen({ strokeWidth: 3.2 }))) +
    G("b-wireHelp", r.line(200, WH, OX + 2, WH, pen({ strokeWidth: 3.2 })) + r.line(OX + OW + OD, WH, 1700, WH, pen({ strokeWidth: 3.2 }))) +
    G("b-oracle", crate(OX, OY, OW, OH, OD, 3.4)) +
    G("b-curl", cc(curveArrow(arcPts(1150, 616, 34, 200, 520, 24), { strokeWidth: 3.4 }, 15)), ` style="color:${GOLD}"`) +
    G("b-hgate", gateBox(380, 375, 100, 90)) +
    G("b-trace", cc(curveArrow([[1030, 730], [1046, 600], [1040, 450], [1032, 300]], { strokeWidth: 3.6 }, 18)), ` style="color:${GOLD}"`) +
    G("b-tick", r.linear([[1092, 772], [1106, 790], [1134, 752]], pen({ strokeWidth: 3.6, roughness: 0.6 })));
  const circHtml =
    C("b-inl", 250, 378, 160, 44, "input") + C("b-hel", 256, 598, 170, 44, "helper") +
    C("b-oq", OX + OW / 2, 534, 120, 110, "?") +
    L("b-flipl", 1104, 696, 380, 44, "flip if answer is 1") +
    C("b-hl", 430, 420, 90, 60, "H") +
    C("b-supl", 650, 206, 320, 44, "superposition") +
    R("b-tag1", 836, 482, 280, 40, "example box:") + R("b-tag2", 836, 534, 280, 40, "0 → 0, 1 → 1") +
    L("b-stillm", 1146, 772, 260, 40, "still minus");
  // Small cards: input above its wire, helper below its wire (each in its own layer so it can slide).
  const IC = card("b-ic", 650, 330, 110, 70, 70, 40, 4, 16, [0, 0]);
  const HC = card("b-hc", 370, 775, 110, 70, 70, 40, 4, 16, [0, 180], { arrowColors: [INK, GOLD] });
  const tokenHtml =
    `<div class="obj" id="b-token" style="left:988px;top:694px;width:84px;height:72px">` +
    `<svg class="sk" width="84" height="72" viewBox="0 0 84 72">${r.ellipse(42, 36, 80, 64, pen({ stroke: GOLD, strokeWidth: 3, fill: GROUND, fillStyle: "solid" }))}</svg>` +
    C("b-tokl", 42, 36, 84, 44, `${M}1`, `color:${GOLD}`) + `</div>`;

  // ===================== Lines 6 and 7: minus, and a flip of minus =====================
  const BIG = card("b-bg", 960, 500, 320, 160, 200, 64, 6, 28, [0, 180], { arrowColors: [INK, GOLD] });
  const GH = card("b-gh", 1380, 500, 272, 136, 170, 54, 5, 24, [0, 180], { color: DIMINK, labelCss: `color:${DIMINK}` });
  const bigSvg =
    BIG.svg +
    G("b-fcurl", cc(curveArrow(arcPts(1400, 330, 46, 150, 480, 26), { strokeWidth: 3.8 }, 18)), ` style="color:${GOLD}"`);
  const halfSvg =
    G("b-half", cc(curveArrow(bez([1360, 300], [960, 120], [560, 300]), { strokeWidth: 4 }, 22)), ` style="color:${GOLD}"`);
  const bigHtml = BIG.html;
  const ghostSvg = GH.svg + halfSvg;
  const ghostHtml = GH.html;

  // ===================== Lines 10 to 12: constant and balanced panels =====================
  const PANEL_DX = 840;
  function panel(p, dx, title, rows, angles) {
    const cx = 400 + dx, by = 600;
    const cd = card(p, cx, by, 170, 90, 110, 44, 4.6, 20, angles);
    // four copies used when the final H mixes the arrows (two per slot)
    const copies = ["c00", "c01", "c10", "c11"].map((c) => `<g id="${p}-${c}" style="opacity:0;color:${INK}">${footArrow(110, 4.6, 20)}</g>`).join("");
    const dots = [0, 1].map((j) => `<circle id="${p}-z${j}" cx="${cd.slots[j]}" cy="${by}" r="9" fill="${INK}" style="opacity:0"/>`).join("");
    const svg =
      G(`${p}-mini`, crate(250 + dx, 345, 80, 58, 12, 2.6)) +
      cd.svg + copies + dots +
      G(`${p}-hg`, gateBox(620 + dx, 556, 90, 88)) +
      G(`${p}-ha`, arrow(722 + dx, 600, 768 + dx, 600, { strokeWidth: 3 }, 14));
    const html =
      C(`${p}-t`, 540 + dx, 296, 400, 64, title) +
      C(`${p}-mq`, 290 + dx, 378, 60, 40, "?") +
      L(`${p}-rows`, 352 + dx, 376, 300, 44, rows) +
      cd.html +
      C(`${p}-hl`, 665 + dx, 600, 80, 56, "H") +
      C(`${p}-ro`, 832 + dx, 600, 110, 80, p === "b-pL" ? "0" : "1", `color:${GOLD}`) +
      C(`${p}-ev`, 832 + dx, 690, 190, 44, "every time");
    return { svg, html, slots: cd.slots };
  }
  const PL = panel("b-pL", 0, "constant", "0 → 1, 1 → 1", [0, 0]);
  const PR = panel("b-pR", PANEL_DX, "balanced", "0 → 0, 1 → 1", [0, 0]);
  const notesSvg =
    G("b-sbr", cc(r.curve([[292, 726], [300, 744], [400, 742], [500, 744], [508, 726]], goldPen({ strokeWidth: 3.4, roughness: 0.7 }))), ` style="color:${GOLD}"`) +
    G("b-ghost", [310, 490].map((x) => cc(arrow(x, 600, x, 490, { strokeWidth: 3, stroke: DIMINK }, 18))).join(""), ` style="color:${DIMINK}"`);
  const notesHtml =
    C("b-sbl", 400, 786, 240, 44, "same sign", `color:${GOLD}`) +
    C("b-shape", 770, 600, 220, 44, "same shape") +
    C("b-bmin", 1240, 786, 300, 56, `= minus |${M}⟩`, `color:${GOLD}`) +
    C("b-addc", 960, 206, 300, 44, "add / cancel");

  // ===================== Lines 13 and 14: where the coin picture breaks =====================
  const CX13 = [420, 700, 1220, 1500], CY13 = 450;
  const cover = (cx) => r.circle(cx, CY13, 172, pen({ strokeWidth: 2, fill: GROUND, fillStyle: "solid" })) +
    r.circle(cx, CY13, 172, pen({ strokeWidth: 2.2, fill: INK, fillStyle: "hachure", hachureGap: 13, fillWeight: 1.3, hachureAngle: -41 }));
  const c13Svg =
    G("b-c13", CX13.map((x) => coin(x, CY13)).join("") + sun(420, CY13) + sun(700, CY13) + sun(1220, CY13) + moon(1500, CY13)) +
    G("b-crack", r.linear([[960, 330], [944, 380], [972, 420], [946, 470], [970, 520], [956, 572]], pen({ strokeWidth: 3.4, roughness: 0.6 }))) +
    G("b-covers", CX13.map(cover).join(""));
  const c13Html =
    CX13.map((x, i) => C(`b-cq${i}`, x, CY13, 80, 72, "?", `text-shadow:0 0 10px ${GROUND},0 0 6px ${GROUND}`)).join("") +
    C("b-same13", 560, 616, 200, 56, "same", `color:${GOLD}`) +
    C("b-diff13", 1360, 616, 260, 56, "different", `color:${GOLD}`);
  const a14Svg =
    G("b-acards", r.rect(360, 330, 560, 130, pen({ strokeWidth: 2.8, roughness: 1 })) + r.rect(1000, 330, 560, 130, pen({ strokeWidth: 2.8, roughness: 1 }))) +
    G("b-abrace", r.curve([[640, 478], [652, 512], [930, 506], [960, 548], [990, 506], [1268, 512], [1280, 478]], goldPen({ strokeWidth: 3.8, roughness: 0.6 }))) +
    G("b-fcard", r.rect(690, 580, 540, 116, goldPen({ strokeWidth: 3.2, roughness: 1 })));
  const a14Html =
    C("b-ans0", 640, 396, 520, 56, `answer for 0: <span class="b-qm">?</span>`) +
    C("b-ans1", 1280, 396, 520, 56, `answer for 1: <span class="b-qm">?</span>`) +
    C("b-fact", 960, 640, 520, 64, "same or different", `color:${GOLD}`);

  // ===================== Lines 15 and 16: the formula and the takeaway =====================
  const Y1 = 330, Y2 = 470;
  const endSvg =
    G("b-ewires",
      [[520, 600], [680, 860], [1024, 1120], [1200, 1300]].map(([a, b]) => r.line(a, Y1, b, Y1, pen({ strokeWidth: 3 }))).join("") +
      [[520, 860], [1024, 1440]].map(([a, b]) => r.line(a, Y2, b, Y2, pen({ strokeWidth: 3 }))).join("")) +
    G("b-eboxes", gateBox(600, Y1 - 40, 80, 80) + crate(860, 284, 140, 232, 20, 3.2) + gateBox(1120, Y1 - 40, 80, 80) +
      gateBox(1300, Y1 - 40, 100, 80) + r.arc(1350, Y1 + 22, 70, 70, PI * 1.08, PI * 1.92, false, pen({ strokeWidth: 2.6 })) +
      arrow(1350, Y1 + 22, 1378, Y1 - 22, { strokeWidth: 2.6 }, 10)) +
    "";
  const formula = `U<sub>f</sub> |x⟩|${M}⟩ = <span id="b-fm1">(${M}1)</span><sup id="b-fsup">f(x)</sup> |x⟩|${M}⟩`;
  const endHtml =
    C("b-etitle", 960, 150, 900, 72, "Deutsch's algorithm") +
    C("b-ek0", 468, Y1, 100, 56, "|0⟩") + C("b-ek1", 468, Y2, 100, 56, `|${M}⟩`) +
    C("b-eh1", 640, Y1, 80, 52, "H") + C("b-eh2", 1160, Y1, 80, 52, "H") +
    C("b-euf", 930, 404, 120, 56, "U<sub>f</sub>") +
    `<div class="obj" id="b-form" style="left:260px;top:0;width:1400px;height:1080px">${C("b-fml", 700, 690, 1400, 96, formula)}</div>` +
    C("b-n1", 450, 806, 260, 40, "U<sub>f</sub>: the box") + C("b-n2", 770, 806, 220, 40, "x: input") +
    C("b-n3", 1090, 806, 300, 40, "f(x): its answer") + C("b-n4", 1440, 806, 260, 40, `|${M}⟩: helper`) +
    C("b-take1", 960, 520, 1300, 56, "kickback writes the answer into the phase") +
    R("b-take2", 1000, 622, 600, 56, "interference reads it") +
    L("b-take3", 1016, 622, 340, 56, "in 1 question", `color:${GOLD}`);
  const takeUnder = `<div class="obj" id="b-tu" style="left:1010px;top:650px;width:320px;height:30px"><svg class="sk" width="320" height="30" viewBox="0 0 320 30"><g id="b-tug">${r.curve([[6, 14], [110, 8], [220, 15], [300, 8]], goldPen({ strokeWidth: 4.2, roughness: 1 }))}</g></svg></div>`;

  // ===================== HTML =====================
  const html = `
    ${full("b-hook", hookSvg, hookHtml)}
    ${full("b-cards", cardsSvg, cardsHtml)}
    ${full("b-coins", coinsSvg, coinsHtml).replace('class="obj"', 'class="obj" data-layout-allow-overflow')}
    ${full("b-q", qSvg, qHtml)}
    ${bubble("b-bub0", 690, 380, 150, 90, "0 ?")}
    ${bubble("b-bub1", 690, 380, 150, 90, "1 ?")}
    ${bubble("b-bub2", 700, 420, 190, 96, "same?")}
    ${C("b-pk", 960, 740, 600, 72, "phase kickback", `color:${GOLD}`)}
    ${full("b-circ", circSvg, circHtml)}
    ${full("b-icard", IC.svg, IC.html).replace('class="obj"', 'class="obj" data-layout-allow-overflow')}
    ${full("b-hcard", HC.svg, HC.html).replace('class="obj"', 'class="obj" data-layout-allow-overflow')}
    ${tokenHtml}
    ${full("b-big", bigSvg, bigHtml)}
    ${C("b-bigt", 960, 226, 500, 72, `minus &nbsp;|${M}⟩`)}
    ${C("b-flipped", 540, 770, 260, 54, "flipped")}
    ${C("b-eq", 960, 500, 300, 72, `= ${gold(`${M}1`)} ×`)}
    ${full("b-ghostc", ghostSvg, ghostHtml)}
    ${full("b-panels", PL.svg + PR.svg + notesSvg, PL.html + PR.html + notesHtml)}
    ${full("b-s13", c13Svg, c13Html)}
    ${full("b-s14", a14Svg, a14Html)}
    ${full("b-end", endSvg, endHtml)}
    ${takeUnder}
  `;
  const css = `
    #root #b-fml sub { font-size: 0.55em; vertical-align: -0.25em; }
    #root #b-fml sup { font-size: 0.55em; vertical-align: 0.9em; margin-left: 0.2em; }
    #root #b-euf sub, #root #b-n1 sub { font-size: 0.6em; vertical-align: -0.25em; }
    #root .b-qm { display: inline-block; }
  `;

  // ===================== Timeline =====================
  const script = `
    const T = ${JSON.stringify(T)};
    const INK = "${INK}", GOLD = "${GOLD}";
    const f1 = (v) => v.toFixed(1);
    const S = (segs, t, init) => sched(segs, t, init);
    const place = (id, x, y, a, s = 1) => $(id).setAttribute("transform", "translate(" + f1(x) + " " + f1(y) + ") rotate(" + a.toFixed(2) + ") scale(" + s.toFixed(3) + ")");
    const PL = ${JSON.stringify(PL.slots)}, PR = ${JSON.stringify(PR.slots)};

    // ----- The final H mixes each panel's two arrows: every arrow sends a copy to both slots,
    // the copy from slot 1 to slot 1 turns over, then same-way copies stack and opposite ones cancel.
    function mix(p, slots, a0, a1, survivor, t) {
      const u = S([[T.intf, T.intf + 1.0, 0, 1]], t, 0);
      const on = t >= T.intf ? 1 : 0;
      const ang = { "00": a0, "01": a0, "10": a1, "11": a1 + 180 * u };
      const fin = { "00": a0, "01": a0, "10": a1, "11": a1 + 180 };
      [0, 1].forEach((j) => {
        const same = ((fin["0" + j] - fin["1" + j]) % 360 + 360) % 360 === 0;
        const stack = S([[T.adding, T.adding + 0.5, 0, 1]], t, 0);
        const gone = S([[T.cancel12, T.cancel12 + 0.45, 1, 0]], t, 1);
        [0, 1].forEach((i) => {
          const key = "" + i + j, id = p + "-c" + key;
          const x = slots[i] + (slots[j] - slots[i]) * u;
          let y = 600, s = 1;
          if (same && i === 1) y = 600 + (Math.cos((fin["0" + j] * Math.PI) / 180) > 0 ? -110 : 110) * stack;
          if (!same) s = gone;
          place(id, x, y, ang[key], s);
          const el = $(id);
          el.style.opacity = String(on * (s > 0.02 ? 1 : 0));
          el.style.color = same && j === survivor && stack > 0.5 ? GOLD : INK;
        });
        $(p + "-z" + j).style.opacity = String(same ? 0 : S([[T.cancel12 + 0.3, T.cancel12 + 0.5, 0, 1]], t, 0) * on);
      });
    }

    onFrame((t) => {
      // Big minus card: the flip swaps the arrows along crossing arcs (line 7).
      const u = S([[T.swap, T.swap + 1.0, 0, 1]], t, 0), lift = Math.sin(Math.PI * u);
      place("b-bg-a0", 800 + 320 * u, 500 + 70 * lift, 0);
      place("b-bg-a1", 1120 - 320 * u, 500 - 70 * lift, 180);
      // Input card: the arrow on 1 is turned over by the kicked-back minus one (line 9).
      place("b-ic-a1", 720, 330, S([[T.that9 + 0.85, T.that9 + 1.65, 0, 180]], t, 0));
      // Panels: constant turns both arrows, balanced only the arrow on 1 (lines 10 and 11).
      const bothA = S([[T.both10, T.both10 + 0.8, 0, 180]], t, 0);
      place("b-pL-a0", PL[0], 600, bothA); place("b-pL-a1", PL[1], 600, bothA);
      place("b-pR-a1", PR[1], 600, S([[T.one11, T.one11 + 0.8, 0, 180]], t, 0));
      // Line 12: the final H.
      mix("b-pL", PL, 180, 180, 0, t);
      mix("b-pR", PR, 0, 180, 1, t);
      // The kicked-back token climbs the box (line 9).
      const k = S([[T.that9, T.that9 + 0.8, 0, 1]], t, 0);
      $("b-token").style.transform = "translate(" + f1(4 * Math.sin(Math.PI * k)) + "px," + f1(-450 * k) + "px)";
    });

    // ===== Line 0: a sealed box =====
    draw("#b-hbox", T.sealed, 1.6);
    write("#b-hq", T.sealed + 1.1, 0.4);
    draw("#b-hin", T.takes, 0.45); write("#b-hinl", T.takes + 0.1, 0.4);
    draw("#b-hout", T.answers, 0.45); write("#b-houtl", T.answers + 0.15, 0.4);
    blurOut("#b-title", T.titleOut);
    blurOut(["#b-hin", "#b-hinl", "#b-hout", "#b-houtl"], T.hookOut);

    // ===== Line 1: constant or balanced =====
    move("#b-hook", { y: 0, scale: 1, transformOrigin: "960px 570px" }, { y: -370, scale: 0.5 }, T.its1, 0.8);
    draw("#b-ccard", T.const1, 0.7); write("#b-ct", T.const1 + 0.1, 0.5);
    write("#b-cr0", T.same1, 0.35); write("#b-cr1", T.both1, 0.35);
    draw("#b-cbr", T.times1, 0.35); write("#b-csame", T.times1 + 0.2, 0.3);
    tl.to(".b-ansC", { color: INK, duration: 0.35 }, T.bal1);
    tl.to(["#b-cbr", "#b-csame"], { color: INK, duration: 0.35 }, T.bal1);
    draw("#b-bcard", T.bal1, 0.6); write("#b-bt", T.bal1 + 0.1, 0.5);
    write("#b-br0", T.two1, 0.3); write("#b-br1", T.diff1, 0.35);
    draw("#b-bbr", T.diff1 + 0.3, 0.35); write("#b-bdiff", T.diff1 + 0.45, 0.4);
    blurOut(["#b-cards", "#b-hook"], T.cardsOut);

    // ===== Line 2: a trick coin and a real coin =====
    tl.set("#b-coins", { transformOrigin: "0px 0px" }, 0);
    draw("#b-ctT", T.coin2, 0.8);
    write("#b-ctl", T.trick2, 0.5);
    draw("#b-sunT0", T.same2, 0.4); draw("#b-sunT1", T.twice2, 0.4);
    write("#b-ctl2", T.twice2 + 0.2, 0.4);
    tl.to(["#b-sunT0", "#b-sunT1"], { color: INK, duration: 0.35 }, T.real2);
    draw("#b-ctF", T.real2, 0.6); write("#b-cfl", T.real2 + 0.15, 0.5);
    draw("#b-sunF", T.two2, 0.35); draw("#b-moonF", T.diff2, 0.4);
    write("#b-cfl2", T.diff2 + 0.3, 0.4);

    // ===== Line 3: look at both sides; an ordinary computer asks twice =====
    tl.to(["#b-sunF", "#b-moonF"], { color: INK, duration: 0.35 }, T.l3);
    draw("#b-turnT", T.check, 0.4); draw("#b-turnF", T.check + 0.15, 0.4);
    ["#b-turnT", "#b-turnF"].forEach((s, i) => { const o = i ? "1400 340" : "520 340"; tl.to(s, { keyframes: [8, -8, 8, -8, 0].map((rotation, n) => ({ rotation, svgOrigin: o, duration: n === 0 || n === 4 ? 0.16 : 0.2 })) }, T.check + 0.5); });
    tl.to(["#b-turnT", "#b-turnF"], { color: INK, duration: 0.3 }, T.ordinary - 0.2);
    fade(["#b-ctl", "#b-ctl2", "#b-cfl", "#b-cfl2"], 0, T.ordinary - 0.1, 0.3);
    move("#b-coins", { x: 0, y: 0, scale: 1 }, { x: 54, y: -63, scale: 0.45 }, T.ordinary, 0.9);
    draw("#b-lap", T.ordinary + 0.2, 1.0);
    draw("#b-box2", T.ordinary + 0.4, 0.9); write("#b-box2q", T.ordinary + 1.1, 0.3);
    hide(["#b-bub0", "#b-bub1", "#b-bub2"]);
    fade("#b-bub0", 1, T.ask, 0.15); move("#b-bub0", { x: 0, y: 0 }, { x: 260, y: -20 }, T.ask, 0.6);
    fade("#b-bub1", 1, T.twice3, 0.15); move("#b-bub1", { x: 0, y: 0 }, { x: 260, y: 92 }, T.twice3, 0.6);
    write("#b-two", T.twice3 + 0.35, 0.6);

    // ===== Line 4: a quantum computer asks once =====
    blurOut(["#b-lap", "#b-bub0", "#b-bub1"], T.lapOut);
    draw("#b-chip", T.chip, 1.0);
    fade("#b-bub2", 1, T.once, 0.15); move("#b-bub2", { x: 0, y: 0 }, { x: 250, y: -10 }, T.once, 0.6);
    draw("#b-strike", T.once + 0.3, 0.3);
    tl.to("#b-two", { color: INK, duration: 0.3 }, T.once + 0.3);
    write("#b-oneq", T.once + 0.5, 0.55);
    write("#b-pk", T.phase4, 0.8);
    write("#b-note", T.answer4, 0.6);
    draw("#b-sgn", T.sign4, 0.35);
    fade(["#b-note", "#b-sgn"], 0, T.sign4 + 0.45, 0.3);
    move("#b-pk", { y: 0, scale: 1, color: GOLD }, { y: -630, scale: 0.667, color: INK }, T.l4Out + 0.15, 0.8);
    blurOut(["#b-coins", "#b-q", "#b-bub2"], T.l4Out);

    // ===== Line 5: the box flips a helper qubit =====
    draw("#b-wireIn", T.box5 - 0.05, 0.6); write("#b-inl", T.box5, 0.4);
    draw("#b-oracle", T.box5, 1.0); write("#b-oq", T.box5 + 0.8, 0.3);
    draw("#b-wireHelp", T.helper5, 0.6); write("#b-hel", T.helper5 + 0.05, 0.4);
    draw("#b-curl", T.whenever, 0.5); write("#b-flipl", T.whenever + 0.3, 0.8);
    tl.to("#b-curl", { color: INK, duration: 0.3 }, T.l6);

    // ===== Line 6: the helper is set to minus =====
    hide(["#b-hgate", "#b-hl", "#b-supl", "#b-tag1", "#b-tag2", "#b-stillm", "#b-tick", "#b-trace", "#b-token"]);
    fade("#b-circ", 0.12, T.l6, 0.35); fade("#b-circ", 0, T.still, 0.35); fade("#b-pk", 0.6, T.l6, 0.35);
    write("#b-bigt", T.minus6, 0.6);
    draw("#b-bg-base", T.arrow6, 0.5); write(["#b-bg-s0", "#b-bg-s1"], T.arrow6 + 0.2, 0.25);
    draw("#b-bg-a0", T.up6, 0.4); draw("#b-bg-a1", T.down6, 0.4);

    // ===== Line 7: a flip only turns minus over: times minus one =====
    draw("#b-fcurl", T.l7, 0.45);
    fade("#b-fcurl", 0, T.still - 0.3, 0.3);
    move("#b-big", { x: 0, scale: 1, transformOrigin: "960px 500px" }, { x: -420, scale: 0.85 }, T.still, 0.9);
    tl.to("#b-bg-a1", { color: INK, duration: 0.3 }, T.still);
    move("#b-bigt", { x: 0, y: 0, scale: 1 }, { x: 420, y: 544, scale: 0.75 }, T.still, 0.9);
    draw(["#b-gh-base", "#b-gh-a0", "#b-gh-a1"], T.still + 0.35, 0.7); write(["#b-gh-s0", "#b-gh-s1"], T.still + 0.6, 0.25);
    write("#b-flipped", T.still + 0.6, 0.45);
    draw("#b-half", T.turned, 0.6);
    write("#b-eq", T.times7, 0.6);
    blurOut(["#b-big", "#b-bigt", "#b-flipped", "#b-eq", "#b-ghostc"], T.l7Out);

    // ===== Line 8: an H gate puts the input in superposition =====
    fade("#b-circ", 1, T.now8, 0.4); fade("#b-pk", 1, T.now8, 0.4);
    draw(["#b-hc-base", "#b-hc-a0", "#b-hc-a1"], T.now8, 0.3); write(["#b-hc-s0", "#b-hc-s1"], T.now8, 0.2);
    move("#b-hcard", { x: 590, y: -275, scale: 2.4, transformOrigin: "370px 775px" }, { x: 0, y: 0, scale: 1 }, T.now8, 0.9);
    tl.to("#b-hc-a1", { color: INK, duration: 0.3 }, T.now8 + 1.0);
    show("#b-hgate", T.puts); draw("#b-hgate", T.puts, 0.4); show("#b-hl", T.puts + 0.25); write("#b-hl", T.puts + 0.25, 0.2);
    draw("#b-ic-base", T.input8, 0.4); write(["#b-ic-s0", "#b-ic-s1"], T.input8 + 0.2, 0.25);
    show("#b-supl", T.sup8); write("#b-supl", T.sup8, 0.7);
    tl.set(["#b-ic-a0", "#b-ic-a1"], { color: GOLD }, 0);
    draw("#b-ic-a0", T.zero8, 0.35); draw("#b-ic-a1", T.one8, 0.35);
    tl.to(["#b-ic-a0", "#b-ic-a1"], { color: INK, duration: 0.3 }, T.l9 - 0.05);

    // ===== Line 9: the minus one kicks back onto the input =====
    fade("#b-supl", 0, T.l9 - 0.05, 0.3);
    move("#b-icard", { x: 0, y: 0 }, { x: 310, y: -100 }, T.wherever, 0.9);
    move("#b-hcard", { x: 0, y: 0 }, { x: 590, y: 0 }, T.wherever, 0.9);
    show(["#b-tag1", "#b-tag2"], T.wherever + 0.5); write("#b-tag1", T.wherever + 0.5, 0.5); write("#b-tag2", T.wherever + 0.9, 0.6);
    show("#b-trace", T.that9); draw("#b-trace", T.that9, 0.8);
    fade("#b-token", 1, T.that9, 0.15);
    fade("#b-token", 0, T.that9 + 0.9, 0.3);
    tl.to("#b-ic-a1", { color: GOLD, duration: 0.2 }, T.that9 + 0.8);
    fade("#b-trace", 0.35, T.that9 + 1.8, 0.4);
    show("#b-tick", T.instead); draw("#b-tick", T.instead, 0.3);
    show("#b-stillm", T.instead + 0.15); write("#b-stillm", T.instead + 0.15, 0.6);
    tl.to("#b-pk", { color: GOLD, duration: 0.25 }, T.phase9);
    tl.to("#b-pk", { color: INK, duration: 0.4 }, T.phase9 + 1.2);
    blurOut(["#b-circ", "#b-icard", "#b-hcard"], T.l9Out);

    // ===== Line 10: constant: both arrows turn, same shape =====
    hide(["#b-pL-hg", "#b-pL-hl", "#b-pL-ha", "#b-pL-ro", "#b-pL-ev", "#b-pR-hg", "#b-pR-hl", "#b-pR-ha", "#b-pR-ro", "#b-pR-ev", "#b-ghost", "#b-shape", "#b-sbr", "#b-sbl", "#b-bmin", "#b-addc"]);
    write("#b-pL-t", T.const10, 0.6);
    draw("#b-pL-mini", T.const10 + 0.2, 0.5); write("#b-pL-mq", T.const10 + 0.5, 0.2); write("#b-pL-rows", T.const10 + 0.4, 0.7);
    draw(["#b-pL-base", "#b-pL-a0", "#b-pL-a1"], T.const10 + 0.5, 0.6); write(["#b-pL-s0", "#b-pL-s1"], T.const10 + 0.7, 0.25);
    tl.to(["#b-pL-a0", "#b-pL-a1"], { color: GOLD, duration: 0.2 }, T.both10);
    show("#b-sbr", T.same10); draw("#b-sbr", T.same10, 0.4); show("#b-sbl", T.same10 + 0.1); write("#b-sbl", T.same10 + 0.1, 0.5);
    show("#b-ghost", T.keeps); draw("#b-ghost", T.keeps, 0.5); show("#b-shape", T.keeps + 0.2); write("#b-shape", T.keeps + 0.2, 0.6);
    tl.to(["#b-pL-a0", "#b-pL-a1", "#b-sbr", "#b-sbl"], { color: INK, duration: 0.35 }, T.l11);

    // ===== Line 11: balanced: only one arrow turns, the input becomes minus =====
    write("#b-pR-t", T.bal11, 0.6);
    draw("#b-pR-mini", T.bal11 + 0.2, 0.5); write("#b-pR-mq", T.bal11 + 0.5, 0.2); write("#b-pR-rows", T.bal11 + 0.4, 0.7);
    draw(["#b-pR-base", "#b-pR-a0", "#b-pR-a1"], T.bal11 + 0.4, 0.6); write(["#b-pR-s0", "#b-pR-s1"], T.bal11 + 0.6, 0.25);
    tl.to("#b-pR-a1", { color: GOLD, duration: 0.2 }, T.one11);
    show("#b-bmin", T.minus11 - 0.1); write("#b-bmin", T.minus11 - 0.1, 0.45);

    // ===== Line 12: a final H: the arrows add or cancel =====
    fade(["#b-ghost", "#b-shape", "#b-sbr", "#b-sbl", "#b-pL-rows", "#b-pR-rows", "#b-pL-mini", "#b-pR-mini", "#b-pL-mq", "#b-pR-mq"], 0, T.l12, 0.35);
    tl.to("#b-pR-a1", { color: INK, duration: 0.3 }, T.l12);
    tl.to("#b-bmin", { color: INK, duration: 0.3 }, T.l12);
    fade("#b-bmin", 0, T.intf - 0.3, 0.3);
    ["#b-pL", "#b-pR"].forEach((p) => {
      show(p + "-hg", T.final); draw(p + "-hg", T.final, 0.4); show(p + "-hl", T.final + 0.25); write(p + "-hl", T.final + 0.25, 0.2);
      tl.set([p + "-a0", p + "-a1"], { opacity: 0 }, T.intf);
      show(p + "-ha", T.zero12 - 0.3); draw(p + "-ha", T.zero12 - 0.3, 0.25);
    });
    show("#b-addc", T.adding); write("#b-addc", T.adding, 0.6);
    show("#b-pL-ro", T.zero12); write("#b-pL-ro", T.zero12, 0.25);
    tl.to("#b-pL-ro", { color: INK, duration: 0.3 }, T.one12);
    show("#b-pR-ro", T.one12); write("#b-pR-ro", T.one12, 0.25);
    show(["#b-pL-ev", "#b-pR-ev"], T.every); write(["#b-pL-ev", "#b-pR-ev"], T.every, 0.5);
    blurOut(["#b-panels", "#b-pk"], T.l12Out);

    // ===== Line 13: where the coin picture breaks =====
    draw("#b-c13", T.coin13, 1.0);
    draw("#b-crack", T.breaks, 0.45);
    draw("#b-covers", T.never13, 0.9);
    write(["#b-cq0", "#b-cq1", "#b-cq2", "#b-cq3"], T.never13 + 0.6, 0.3);
    write("#b-same13", T.whether, 0.4); write("#b-diff13", T.whether + 0.25, 0.5);

    // ===== Line 14: one fact about the pair =====
    blurOut("#b-s13", T.never14);
    draw("#b-acards", T.never14 + 0.1, 0.6);
    write("#b-ans0", T.never14 + 0.3, 0.7); write("#b-ans1", T.never14 + 0.6, 0.7);
    tl.to(".b-qm", { scale: 1.35, duration: 0.18, yoyo: true, repeat: 3, ease: "power1.inOut" }, T.both14);
    draw("#b-abrace", T.intf14, 0.6);
    draw("#b-fcard", T.intf14 + 0.5, 0.5); write("#b-fact", T.intf14 + 0.6, 0.7);
    blurOut("#b-s14", T.deutsch);

    // ===== Line 15: Deutsch's algorithm =====
    write("#b-etitle", T.deutsch, 0.9);
    draw("#b-ewires", T.deutsch + 0.3, 0.9); draw("#b-eboxes", T.deutsch + 0.5, 1.4);
    write(["#b-ek0", "#b-ek1"], T.deutsch + 0.4, 0.3); write(["#b-eh1", "#b-eh2"], T.deutsch + 1.0, 0.2); write("#b-euf", T.deutsch + 1.3, 0.3);
    write("#b-fml", T.mult, 1.2);
    write("#b-n1", T.mult + 0.9, 0.5); write("#b-n2", T.mult + 1.3, 0.4);
    tl.to("#b-fm1", { color: GOLD, duration: 0.25 }, T.minus15);
    tl.to("#b-fsup", { color: GOLD, duration: 0.25 }, T.power);
    write("#b-n3", T.power, 0.6); write("#b-n4", T.power + 0.5, 0.5);

    // ===== Line 16: the takeaway =====
    blurOut(["#b-ewires", "#b-eboxes", "#b-ek0", "#b-ek1", "#b-eh1", "#b-eh2", "#b-euf", "#b-n1", "#b-n2", "#b-n3", "#b-n4"], T.l16);
    move("#b-form", { y: 0 }, { y: -366 }, T.l16 + 0.1, 0.9);
    write("#b-take1", T.writes, 1.0);
    tl.to(["#b-fm1", "#b-fsup"], { color: INK, duration: 0.35 }, T.intf16);
    write("#b-take2", T.intf16, 0.8);
    write("#b-take3", T.one16, 0.6);
    draw("#b-tug", T.one16 + 0.5, 0.5);
  `;
  return { html, script, css };
}
