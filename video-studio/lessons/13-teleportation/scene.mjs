// Lesson 13, "Teleportation". Follows plan.md: Alice's unknown state (a gold arrow) and Bob far
// away, the fax that shreds the original, the Bell pair split between them, Alice's CNOT, H and
// two meters, two bits that ride the phone line, Bob's fix table (nothing, X, Z, both), Bob's
// mirrored arrow swung back by Z, the state moved not copied, where the fax breaks, the sum
// entanglement + bits, no faster than light (Bob's 50/50 until the bits arrive), and the closing
// circuit with the takeaway. Gold always marks where the real state lives right now.
export const phrases = [["one time in four", "1 in 4"]];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, lines, INK, GOLD, DIM, GROUND, wobbly } = k;
  const fx = (n) => +(+n).toFixed(3);
  // A word's start by its transcript spelling (for words the transcriber merged or wrote as digits).
  const wd = (li, prefix, nth = 0) => {
    const hit = lines[li].words.filter((w) => w.w.toLowerCase().replace(/[^a-z0-9-]/g, "").startsWith(prefix))[nth];
    if (!hit) throw new Error(`wd: no "${prefix}" in line ${li}`);
    return fx(hit.start);
  };

  // ---------- drawing helpers ----------
  const ctr = (size) => fx(size * 0.745); // label top offset that centres its text on a y
  const lc = (id, cx, cy, w, size, html, extra = "") => lbl(id, fx(cx - w / 2), fx(cy - ctr(size)), w, size, html, extra);
  // A div whose svg uses board coordinates (viewBox at x,y).
  const obj = (id, x, y, w, h, svg, inner = "", extra = "") =>
    `<div id="${id}" class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}">` +
    (svg ? `<svg class="sk" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}">${svg}</svg>` : "") + inner + `</div>`;
  // A clipped window (overflow hidden) holding a movable inner div, for a page entering a slot.
  const clipBox = (id, innerId, x, y, w, h, svg) =>
    `<div id="${id}" class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden">` +
    `<div id="${innerId}" class="obj" data-layout-allow-overflow style="left:0;top:0;width:${w}px;height:${h}px">` +
    `<svg class="sk" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}">${svg}</svg></div></div>`;
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
    return [fx(a * p0[0] + b * p1[0] + c * p2[0]), fx(a * p0[1] + b * p1[1] + c * p2[1])];
  });
  const headAt = (pts, o, size = 18) => {
    const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1];
    const a = Math.atan2(y2 - y1, x2 - x1), w = (o.strokeWidth ?? 3) * 0.85;
    return [0.45, -0.45].map((da) => r.line(x2, y2, x2 - size * Math.cos(a + da), y2 - size * Math.sin(a + da), pen({ ...o, strokeWidth: w }))).join("");
  };
  // A wobbly stroke with its points and length shares, for things that ride along it.
  const track = (id, pts, amp, seed, stroke, width) => {
    const w = wobbly(pts, amp, seed);
    const P = w.d.slice(1).split(" L").map((s, i) => { const [x, y] = s.split(" ").map(Number); return [x, y, w.frac[i]]; });
    return { svg: `<g id="${id}"><path class="ink" pathLength="1" d="${w.d}" stroke="${stroke}" stroke-width="${width}" fill="none" stroke-linecap="round"/></g>`, P };
  };
  // An arrow from the origin pointing up (rotate its group to aim it), with a dot at its foot.
  const upArrow = (L, o, head = 20, dot = 16) =>
    arrow(0, 0, 0, -L, o, head) + r.circle(0, 0, dot, pen({ ...o, fill: o.stroke ?? INK, fillStyle: "solid", strokeWidth: 1 }));
  // Dotted arrow (not pen-drawn; faded in).
  const dotArrow = (L, color, width, dash) =>
    `<line x1="0" y1="0" x2="0" y2="${-L}" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}" stroke-linecap="round"/>` +
    `<path d="M ${-L * 0.16} ${-L * 0.8} L 0 ${-L} L ${L * 0.16} ${-L * 0.8}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  // A qubit drawn as a circle with a faint dashed up-down axis.
  const qubit = (cx, cy, rad, seed, sw = 3.2) =>
    r.circle(cx, cy, rad * 2, pen({ strokeWidth: sw, seed })) + dashed([[cx, cy - rad - 16], [cx, cy + rad + 16]], 9, 8, { strokeWidth: 2, stroke: DIM, seed: seed + 1 });
  const cross = (cx, cy, s, o = {}) => r.line(cx - s, cy - s * 0.8, cx + s, cy + s * 0.8, pen({ strokeWidth: 4.4, ...o })) + r.line(cx + s, cy - s * 0.8, cx - s, cy + s * 0.8, pen({ strokeWidth: 4.4, ...o }));
  const plusT = (cx, cy, d, o = {}) => r.circle(cx, cy, d, pen(o)) + r.line(cx - d / 2 + 4, cy, cx + d / 2 - 4, cy, pen(o)) + r.line(cx, cy - d / 2 + 4, cx, cy + d / 2 - 4, pen(o));
  const dotS = (cx, cy, d, o = {}) => r.circle(cx, cy, d, pen({ fill: o.stroke ?? INK, fillStyle: "solid", strokeWidth: 1, ...o }));
  // A meter: box, dial arc, needle (needle group id given so it can swing).
  const meter = (x, y, needleId, w = 90, h = 64) =>
    r.rect(x - w / 2, y - h / 2, w, h, pen({ strokeWidth: 2.8 })) +
    r.arc(x, y + h * 0.28, w * 0.62, w * 0.62, Math.PI, 2 * Math.PI, false, pen({ strokeWidth: 2.2 })) +
    `<g id="${needleId}" transform="rotate(-40 ${x} ${fx(y + h * 0.28)})">${r.line(x, y + h * 0.28, x, y - h * 0.26, pen({ strokeWidth: 2.6 }))}</g>`;
  // A small photocopier: body, lid, two stacked sheets.
  const copier = (x, y, s = 1) =>
    r.rect(x, y + 50 * s, 170 * s, 70 * s, pen({ strokeWidth: 3 })) +
    r.line(x - 8 * s, y + 42 * s, x + 178 * s, y + 36 * s, pen({ strokeWidth: 3 })) +
    r.rect(x + 40 * s, y, 70 * s, 40 * s, pen({ strokeWidth: 2.4 })) + r.rect(x + 54 * s, y + 8 * s, 70 * s, 40 * s, pen({ strokeWidth: 2.4 })) +
    dotS(x + 140 * s, y + 70 * s, 14 * s) + r.line(x + 20 * s, y + 95 * s, x + 110 * s, y + 95 * s, pen({ strokeWidth: 2 }));
  // A handset: a bar with two cups.
  const handset = (cx, cy, s = 1) =>
    r.rect(cx - 50 * s, cy - 12 * s, 100 * s, 22 * s, pen({ strokeWidth: 3 })) +
    r.ellipse(cx - 42 * s, cy + 8 * s, 34 * s, 24 * s, pen({ strokeWidth: 2.6 })) + r.ellipse(cx + 42 * s, cy + 8 * s, 34 * s, 24 * s, pen({ strokeWidth: 2.6 }));
  const star = (cx, cy, R, o) => r.poly(Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? R * 0.45 : R;
    return [fx(cx + rr * Math.cos(a)), fx(cy + rr * Math.sin(a))];
  }), o);
  const page = (x, y, w = 140, h = 180) =>
    r.rect(x, y, w, h, goldPen({ strokeWidth: 3.2 })) + star(x + w / 2, y + h * 0.38, w * 0.24, goldPen({ strokeWidth: 2.8 })) +
    r.line(x + 22, y + h * 0.72, x + w - 22, y + h * 0.72, goldPen({ strokeWidth: 2.2 })) + r.line(x + 22, y + h * 0.84, x + w - 46, y + h * 0.84, goldPen({ strokeWidth: 2.2 }));
  // A gold hatch bar.
  const hbar = (x, y, w, h, seed) =>
    r.rect(x, y, w, h, { ...pen({ seed }), fill: GOLD, fillStyle: "hachure", hachureGap: 8, fillWeight: 2, stroke: GOLD, strokeWidth: 2.4, roughness: 1 });

  // ---------- times ----------
  const T = {
    alice0: cue(0, "alice"), qubit0: cue(0, "qubit"), arrow0: cue(0, "arrow"), some0: cue(0, "some"), nobody0: cue(0, "nobody"),
    start1: cue(1, null), bob1: cue(1, "bob"), far1: cue(1, "far"), exact1: cue(1, "exact"), copy1: cue(1, "copy"), meas1: cue(1, "measuring"),
    off1: cue(2, null, 0, -0.1),
    picture2: cue(2, "picture"), fax2: cue(2, "fax"), machine2: cue(2, "machine"), shreds2: cue(2, "shreds"), sends2: cue(2, "sends"),
    comes3: cue(3, "comes"), original3: cue(3, "original"), shredded3: cue(3, "shredded"), needs3: cue(3, "needs"), phone3: cue(3, "phone"),
    off3: cue(4, null, 0, -0.12),
    quantum4: cue(4, "quantum"), bell4: cue(4, "bell"), ent4: cue(4, "entangled"), readings4: cue(4, "readings"), always4: cue(4, "always"),
    start5: cue(5, null), alice5: cue(5, "alice"), bob5: cue(5, "bob"),
    mystery6: cue(6, "mystery"), half6: cue(6, "half"), gates6: cue(6, "gates"), cnot6: wd(6, "see"), h6: wd(6, "hand"), measures6: cue(6, "measures"), both6: cue(7, "both"),
    two7: cue(7, "two"), four7: cue(7, "four"), outcomes7: cue(7, "outcomes"), one7: cue(7, "one"),
    start8: cue(8, null), sends8: cue(8, "sends"), ordinary8: cue(8, "ordinary"), phone8: cue(8, "phone"),
    start9: cue(9, null), fix9: cue(9, "fix"), nothing9: cue(9, "nothing"), x9: wd(9, "x"), z9: wd(9, "zor"), both9: cue(9, "both"), half9: cue(9, "half"),
    start10: cue(10, null), holds10: cue(10, "holds"), turned10: cue(10, "turned"), fix10: cue(10, "fix"), restores10: cue(10, "restores"), exactly10: cue(11, "exactly"),
    start11: cue(11, null), meas11: cue(11, "measuring"), moved11: cue(11, "moved"), copied11: cue(11, "copied"),
    off11: cue(12, "where", 0, -0.05),
    fax12: cue(12, "fax"), breaks12: cue(12, "breaks"), fax12b: cue(12, "fax", 1), reads12: cue(12, "reads"), alice12: cue(12, "alice"), never12: cue(12, "never"), learns12: cue(12, "learns"),
    off12: cue(13, null, 0, -0.12),
    state13: cue(13, "state"), ent13: cue(13, "entanglement"), bits13: cue(13, "bits"), together13: cue(13, "together"), alone13: cue(13, "alone"), say13: cue(13, "say"), nothing13: cue(13, "nothing"),
    off13: cue(14, null, 0, -0.12),
    no14: cue(14, "no"), light14: cue(14, "light"), until14: cue(14, "until"), qubit14: cue(14, "qubit"), fifty14: wd(14, "50"), coin14: cue(14, "coin"), whatever14: cue(14, "whatever"),
    off14: cue(15, null, 0, -0.1), wait15: cue(15, "wait"), her15: cue(15, "her"), never15: cue(15, "never"), only15: cue(15, "only"),
    off15: cue(16, null, 0, -0.12),
    ent16: cue(16, "entanglement"), plus16: cue(16, "plus"), two16: cue(16, "two"), ordinary16: cue(16, "ordinary"), bits16: cue(16, "bits"), move16: cue(16, "move"),
    nothing16: cue(16, "nothing"), copied16: cue(16, "copied"), outruns16: cue(16, "outruns"),
  };
  const TILT = 35;

  // ---------- 0 to 1. Alice's unknown state, Bob far away ----------
  const AQ = { x: 400, y: 560, r: 120 }, BQ = { x: 1500, y: 560, r: 120 };
  const stSvg =
    `<g id="b-aQ">${qubit(AQ.x, AQ.y, AQ.r, 20, 3.4)}</g>` +
    `<g id="b-aAp" transform="translate(${AQ.x} ${AQ.y}) rotate(${TILT})"><g id="b-aA">${upArrow(100, { stroke: GOLD, strokeWidth: 5.4 }, 24, 18)}</g></g>` +
    `<g id="b-bQ">${qubit(BQ.x, BQ.y, BQ.r, 30, 3.4)}</g>` +
    `<g id="b-ghost" transform="translate(${BQ.x} ${BQ.y}) rotate(${TILT})">${dotArrow(100, INK, 3.4, "6 9")}</g>` +
    `<g id="b-dist">${dashed([[545, 560], [1355, 560]], 22, 16, { strokeWidth: 2.8, seed: 40 })}</g>` +
    `<g id="b-cop">${copier(612, 622)}</g>` +
    `<g id="b-x1">${cross(697, 682, 100)}</g>` +
    `<g id="b-met">${r.rect(870, 650, 160, 100, pen({ strokeWidth: 3 }))}${r.arc(950, 735, 116, 116, Math.PI, 2 * Math.PI, false, pen({ strokeWidth: 2.4 }))}` +
    `<g id="b-metn" transform="rotate(-50 950 735)">${r.line(950, 735, 950, 684, pen({ strokeWidth: 3 }))}</g>${dotS(950, 735, 12)}</g>` +
    `<g id="b-x2">${cross(950, 700, 100)}</g>`;
  const stations =
    obj("b-st", 140, 280, 1640, 580, stSvg) +
    lc("b-alice0", AQ.x, 335, 200, 56, "Alice") + lc("b-a0", 432, 412, 50, 40, "0") + lc("b-a1", 432, 712, 50, 40, "1") +
    lc("b-qdef", AQ.x, 785, 420, 40, "qubit = quantum bit") +
    lc("b-qm0", 512, 446, 60, 64, "?", `color:${GOLD}`) +
    lc("b-bob0", BQ.x, 335, 200, 56, "Bob") + lc("b-b0", 1532, 412, 50, 40, "0") + lc("b-b1", 1532, 712, 50, 40, "1") +
    lc("b-far", 950, 518, 240, 40, "far away") + lc("b-goal", 1652, 440, 110, 40, "goal") +
    lc("b-nocopy", 697, 808, 260, 40, "no copying") + lc("b-destroys", 950, 808, 260, 40, "destroys it");

  // ---------- 2 to 3. the fax that shreds the original ----------
  const fax = (x, y, seed) =>
    r.rect(x, y, 420, 220, pen({ strokeWidth: 3.4, seed })) +
    r.rect(x + 30, y + 40, 170, 62, pen({ strokeWidth: 2.4 })) +
    r.line(x + 46, y + 62, x + 150, y + 62, pen({ strokeWidth: 1.8, stroke: DIM })) + r.line(x + 46, y + 82, x + 120, y + 82, pen({ strokeWidth: 1.8, stroke: DIM })) +
    Array.from({ length: 9 }, (_, i) => dotS(x + 268 + (i % 3) * 40, y + 52 + Math.floor(i / 3) * 36, 13)).join("") +
    r.line(x + 40, y + 176, x + 200, y + 176, pen({ strokeWidth: 2.4 })) +
    r.rect(x + 200, y - 10, 190, 14, pen({ strokeWidth: 2.6 })) +
    handset(x + 98, y - 30, 0.95) +
    r.curve(Array.from({ length: 14 }, (_, i) => [fx(x - 14 + 9 * Math.cos(i * 1.7)), fx(y - 20 + i * 11 + 6 * Math.sin(i * 1.7))]), pen({ strokeWidth: 2 }));
  const CAB = track("b-cable", bez([357, 380], [960, 158], [1337, 380], 60), 3, 77, INK, 3);
  const STRIPS = Array.from({ length: 6 }, (_, i) => {
    const s = fx(T.shreds2 + 0.45 + i * 0.17);
    return { id: `b-strip${i}`, x0: 512 + i * 21, x1: 510 + i * 22 + (i % 2 ? 6 : -6), y1: 708 + ((i * 37) % 5) * 7, rot: (i % 2 ? 1 : -1) * (10 + ((i * 13) % 4) * 6), s };
  });
  const faxSvg =
    `<g id="b-faxL">${fax(260, 420, 200)}</g><g id="b-faxR">${fax(1240, 420, 220)}</g>` +
    `<g id="b-bin">${r.poly([[485, 690], [648, 690], [632, 802], [501, 802]], pen({ strokeWidth: 3 }))}${r.line(478, 690, 655, 690, pen({ strokeWidth: 3.4 }))}</g>` +
    `<g id="b-exit">${r.line(500, 640, 620, 640, pen({ strokeWidth: 5 }))}</g>` +
    STRIPS.map((s) => `<g id="${s.id}" style="opacity:0">${r.curve([[0, 0], [5, 11], [-4, 22], [5, 33], [0, 44]], pen({ strokeWidth: 2.6 }))}</g>`).join("") +
    CAB.svg + `<circle id="b-pulse" cx="0" cy="0" r="11" fill="${INK}" style="opacity:0"/>`;
  const faxHtml =
    obj("b-fax", 140, 140, 1640, 700, faxSvg) +
    clipBox("b-pgL", "b-pgLm", 460, 150, 200, 266, `<g id="b-pageL">${page(490, 225)}</g>`) +
    clipBox("b-pgR", "b-pgRm", 1440, 150, 200, 266, page(1470, 225)) +
    lc("b-faxA", 360, 700, 200, 48, "Alice") + lc("b-faxB", 1450, 700, 200, 48, "Bob") +
    lc("b-shredl", 752, 760, 200, 40, "shredded") + lc("b-phonel", 960, 214, 260, 40, "phone line");

  // ---------- 4 to 11. the Bell pair, Alice's circuit, the bits, Bob's fix ----------
  // Bell-pair circles and the link are placed every frame (they move); Bob's arrow lives in his circle.
  const BELL = { L0: [800, 480], R0: [1120, 480], L1: [300, 620], R1: [1560, 620], R2: [1250, 540], rad: 70, s2: 1.8 };
  const bellSvg =
    `<path id="b-link" d="" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/>` +
    `<g id="b-qLp" transform="translate(${BELL.L0})"><g id="b-qL">${qubit(0, 0, BELL.rad, 300)}</g></g>` +
    `<g id="b-qRp" transform="translate(${BELL.R0})"><g id="b-qR">${qubit(0, 0, BELL.rad, 310, 2.6)}</g>` +
    `<g id="b-bRef" transform="rotate(${TILT})">${dotArrow(60, GOLD, 2.6, "5 6")}</g>` +
    `<g id="b-bAp" transform="scale(-1 1) rotate(${TILT})"><g id="b-bA">${upArrow(58, { strokeWidth: 3 }, 12, 10)}</g><g id="b-bAg">${upArrow(58, { stroke: GOLD, strokeWidth: 3.2 }, 12, 10)}</g></g></g>`;
  const bellHtml =
    obj("b-bell", 140, 150, 1640, 730, bellSvg) +
    lc("b-bellp", 960, 360, 360, 64, "Bell pair") +
    lc("b-rdL", 800, 600, 80, 64, `<span id="b-rdLt">0</span>`) + lc("b-rdR", 1120, 600, 80, 64, `<span id="b-rdRt">0</span>`) +
    lc("b-eq4", 960, 600, 80, 64, "=", `color:${GOLD}`) + lc("b-match4", 960, 690, 300, 40, "always match") +
    lc("b-hdA", 300, 255, 180, 56, "Alice") + lc("b-hdB", 1560, 255, 180, 56, "Bob");

  // Alice's circuit (line 6): mystery qubit on top wire, her half on the bottom wire.
  const W1 = 400, W2 = 620, CNX = 500, HX = 630, MX = 770;
  const circSvg =
    `<g id="b-myQ">${qubit(300, W1, 70, 340)}</g>` +
    `<g id="b-myAp" transform="translate(300 ${W1}) rotate(${TILT})"><g id="b-myA">${upArrow(58, { stroke: GOLD, strokeWidth: 4.4 }, 14, 12)}</g></g>` +
    `<g id="b-wires">${r.line(372, W1, MX - 45, W1, pen({ strokeWidth: 3 }))}${r.line(372, W2, MX - 45, W2, pen({ strokeWidth: 3 }))}</g>` +
    `<g id="b-cx6">${dotS(CNX, W1, 22)}${r.line(CNX, W1, CNX, W2 + 26, pen({ strokeWidth: 3 }))}${plusT(CNX, W2, 52, { strokeWidth: 3 })}</g>` +
    `<g id="b-h6">${r.rect(HX - 40, W1 - 40, 80, 80, pen({ strokeWidth: 3, fill: GROUND, fillStyle: "solid" }))}</g>` +
    `<g id="b-m6">${meter(MX, W1, "b-m6a")}${meter(MX, W2, "b-m6b")}</g>`;
  const circHtml =
    obj("b-circ", 220, 300, 760, 400, circSvg) +
    lc("b-myq", 368, 348, 60, 56, "?", `color:${GOLD}`) +
    lc("b-h6l", HX, W1, 70, 56, "H") +
    lc("b-gate", 650, 318, 500, 40, "gate = one step on a qubit");

  // The two bits: the readout rides from the meters to Alice, then down the phone line to Bob.
  const RO = { x: 900, y: 510 };
  const roHtml = lc("b-ro", RO.x, RO.y, 140, 72, `<span id="b-rot">00</span>`, "opacity:0");
  const CARDS = ["00", "01", "10", "11"].map((s, i) => ({ s, cx: 690 + i * 200 }));
  const cardsSvg = CARDS.map((c, i) =>
    `<g id="b-card${i}">${r.rect(c.cx - 75, 335, 150, 100, pen({ strokeWidth: 3, seed: 400 + i }))}</g>` +
    `<g id="b-bar${i}">${hbar(c.cx - 28, 470, 56, 90, 410 + i)}</g>`).join("") +
    `<g id="b-cardG">${r.rect(CARDS[2].cx - 82, 328, 164, 114, goldPen({ strokeWidth: 4 }))}</g>` +
    `<g id="b-base7">${r.line(600, 562, 1380, 562, pen({ strokeWidth: 2.6 }))}</g>`;
  const cardsHtml =
    obj("b-cards", 580, 315, 820, 260, cardsSvg) +
    CARDS.map((c, i) => lc(`b-cd${i}`, c.cx, 385, 140, 64, c.s)).join("") +
    lc("b-in4", 990, 618, 340, 56, "1 in 4 each");

  // The phone call (line 8).
  const CAB8 = track("b-cab8", bez([500, 300], [940, 420], [1380, 300], 60), 3, 88, INK, 3);
  const callSvg =
    `<g id="b-hsA" transform="rotate(0 440 300)"><g id="b-hsAi">${handset(440, 300)}</g></g>` +
    `<g id="b-hsB" transform="rotate(0 1440 300)"><g id="b-hsBi">${handset(1440, 300)}</g></g>` + CAB8.svg;
  const callHtml = obj("b-call", 380, 270, 1130, 140, callSvg) + lc("b-ordl", 940, 430, 620, 40, "ordinary message, ordinary speed");

  // Bob's fix table (line 9).
  const ROWS = [["00 → nothing", 430], ["01 → X", 505], ["10 → Z", 580], ["11 → X and Z", 655]];
  const SKX = 1180;
  const arcHead = (cx, cy, w, h, a, o, size = 12) => {
    const p = [cx + (w / 2) * Math.cos(a), cy + (h / 2) * Math.sin(a)], tx = -(w / 2) * Math.sin(a), ty = (h / 2) * Math.cos(a);
    return headAt([[p[0] - tx * 0.05, p[1] - ty * 0.05], p], o, size);
  };
  const fixSvg =
    `<g id="b-fixf">${r.rect(690, 388, 420, 308, pen({ strokeWidth: 2.6 }))}</g>` +
    `<g id="b-skX">${r.circle(SKX, 505, 52, pen({ strokeWidth: 2.6 }))}${dotS(SKX, 479, 10)}${r.arc(SKX, 505, 84, 84, -1.25, 1.25, false, pen({ strokeWidth: 2.4 }))}${arcHead(SKX, 505, 84, 84, 1.25, { strokeWidth: 2.4 })}</g>` +
    `<g id="b-skZ">${r.circle(SKX, 585, 52, pen({ strokeWidth: 2.6 }))}${r.line(SKX, 545, SKX, 625, pen({ strokeWidth: 1.8, stroke: DIM }))}${r.arc(SKX, 585, 96, 30, 0.25, 2.9, false, pen({ strokeWidth: 2.4 }))}${arcHead(SKX, 585, 96, 30, 2.9, { strokeWidth: 2.4 })}</g>`;
  const fixHtml =
    obj("b-fix", 680, 375, 580, 330, fixSvg) +
    lc("b-fixh", 900, 345, 300, 48, "Bob's fix") +
    ROWS.map(([s, y], i) => lbl(`b-row${i}`, 724, fx(y - ctr(48)), 380, 48, s, "text-align:left")).join("") +
    lc("b-halft", 1322, 545, 190, 40, "half turns");

  // Bob's arrow restored (line 10) and the state moved (line 11).
  const restHtml =
    lc("b-turned", 1585, 450, 360, 40, "her state, turned by Z") +
    lc("b-same", 1555, 600, 260, 56, "same state", `color:${GOLD}`) +
    obj("b-tick", 1680, 570, 80, 60, `<g id="b-tickg">${r.linear([[1690, 600], [1708, 618], [1748, 576]], goldPen({ strokeWidth: 4.4 }))}</g>`);
  const ARC11 = bez([360, 330], [760, 100], [1110, 440], 40);
  const movedSvg =
    `<g id="b-mvArc">${r.linear(ARC11, goldPen({ strokeWidth: 5, roughness: 0.9 }))}${headAt(ARC11, { stroke: GOLD, strokeWidth: 5 }, 26)}</g>`;
  const movedHtml =
    obj("b-m2", 220, 320, 160, 160, `<g id="b-m2Q">${qubit(300, W1, 70, 520)}</g><g id="b-m2Ap" transform="translate(300 ${W1}) rotate(${TILT})"><g id="b-m2A">${upArrow(58, { strokeWidth: 4 }, 14, 12)}</g></g>`) +
    lc("b-plain1", 560, 455, 330, 40, "just a plain 1 now") +
    obj("b-mv", 330, 80, 820, 400, movedSvg) +
    lc("b-movedl", 748, 192, 220, 64, "moved", `color:${GOLD}`) +
    lc("b-notcop", 760, 545, 260, 56, "not copied") +
    obj("b-cop2", 880, 470, 160, 130, `<g id="b-cop2g">${copier(906, 492, 0.6)}</g><g id="b-x11">${cross(960, 530, 64, { strokeWidth: 3.6 })}</g>`);

  // ---------- 12. where the fax breaks ----------
  const MAG = { x: 520, y: 400 };
  const splitSvg =
    `<g id="b-div">${r.curve([[960, 280], [952, 420], [966, 580], [958, 800]], pen({ strokeWidth: 3 }))}</g>` +
    `<g id="b-sfax">${r.rect(300, 520, 330, 170, pen({ strokeWidth: 3.2 }))}${r.rect(420, 508, 160, 12, pen({ strokeWidth: 2.4 }))}` +
    `${r.rect(326, 552, 130, 50, pen({ strokeWidth: 2.2 }))}${Array.from({ length: 6 }, (_, i) => dotS(500 + (i % 3) * 36, 566 + Math.floor(i / 3) * 34, 12)).join("")}</g>` +
    `<g id="b-spage">${page(440, 345, 120, 150)}</g>` +
    `<g id="b-magp" transform="translate(0 0)"><g id="b-mag">${r.circle(MAG.x, MAG.y, 104, pen({ strokeWidth: 3.6 }))}${r.line(MAG.x + 38, MAG.y + 38, MAG.x + 92, MAG.y + 92, pen({ strokeWidth: 7 }))}</g></g>` +
    `<g id="b-sQ">${qubit(1440, 500, 110, 560)}</g>` +
    `<g id="b-sAp" transform="translate(1440 500) rotate(${TILT})"><g id="b-sA">${upArrow(90, { stroke: GOLD, strokeWidth: 5 }, 20, 16)}</g></g>`;
  const neverU = `<svg class="sk" style="left:0;top:86%;width:100%;height:14px;overflow:visible" viewBox="0 0 100 14" preserveAspectRatio="none"><g id="b-nevu">${r.line(2, 7, 98, 5, goldPen({ strokeWidth: 3.6 }))}</g></svg>`;
  const splitHtml =
    obj("b-split", 140, 150, 1640, 700, splitSvg) +
    lc("b-wfb", 960, 210, 620, 56, "where the fax breaks") +
    lc("b-reads", 465, 762, 460, 48, "a fax reads the page") +
    obj("b-sheet", 1318, 378, 244, 244, r.rect(1328, 388, 224, 224, pen({ strokeWidth: 3, fill: GROUND, fillStyle: "solid" })) +
      r.rect(1340, 400, 200, 200, { ...pen(), stroke: "none", fill: "rgba(232,232,232,0.35)", fillStyle: "hachure", hachureGap: 16, fillWeight: 1.6 })) +
    lc("b-sq", 1440, 500, 90, 96, "?") +
    lc("b-never", 1440, 762, 460, 48, `Alice <span style="position:relative;display:inline-block">never${neverU}</span> sees it`);

  // ---------- 13. entanglement + bits = the state ----------
  const SQ = Array.from({ length: 61 }, (_, i) => [fx(500 + i * 4), fx(420 + 16 * Math.sin((i / 60) * Math.PI * 6))]);
  const sumSvg =
    `<g id="b-sqz">${r.circle(476, 420, 36, pen({ strokeWidth: 2.6 }))}${r.curve(SQ, goldPen({ strokeWidth: 4, roughness: 0.6 }))}${r.circle(764, 420, 36, pen({ strokeWidth: 2.6 }))}</g>` +
    `<g id="b-sto">${arrow(1095, 420, 1225, 420, { strokeWidth: 3.4 }, 20)}</g>` +
    `<g id="b-sArp" transform="translate(1355 470) rotate(${TILT})"><g id="b-sAr">${upArrow(110, { stroke: GOLD, strokeWidth: 5.4 }, 22, 16)}</g></g>` +
    `<g id="b-brk">${r.curve([[440, 572], [445, 590], [700, 592], [1080, 588], [1088, 570]], goldPen({ strokeWidth: 4 }))}</g>` +
    `<g id="b-sto2">${arrow(915, 690, 1030, 690, { strokeWidth: 3 }, 18)}</g>`;
  const sumHtml =
    obj("b-sum", 420, 340, 1080, 380, sumSvg) +
    lc("b-sent", 620, 520, 380, 56, "entanglement") + lc("b-splus", 850, 420, 80, 90, "+") +
    lc("b-s10", 990, 420, 150, 90, "10") + lc("b-sbits", 990, 520, 220, 56, "two bits") +
    lc("b-sstate", 1400, 520, 260, 56, "the state", `color:${GOLD}`) +
    lc("b-a10", 850, 690, 120, 64, "10") + lc("b-aq", 1090, 690, 80, 80, "?") +
    lc("b-anoth", 975, 790, 600, 40, "says nothing about the state");

  // ---------- 14 to 15. no faster than light ----------
  const FA = { x: 480, y: 520 }, FB = { x: 1340, y: 520 }, CK = { x: 1610, y: 520 };
  const CAB15 = track("b-cab15", bez([572, 298], [910, 376], [1248, 298], 50), 2.5, 99, INK, 3);
  const ftlSvg =
    `<g id="b-sun">${r.circle(620, 200, 76, pen({ strokeWidth: 3.2 }))}</g>` +
    `<g id="b-raysp" transform="rotate(0 620 200)"><g id="b-rays">${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return r.line(fx(620 + 48 * Math.cos(a)), fx(200 + 48 * Math.sin(a)), fx(620 + 68 * Math.cos(a)), fx(200 + 68 * Math.sin(a)), pen({ strokeWidth: 2.8 })); }).join("")}</g></g>` +
    `<g id="b-fQA">${qubit(FA.x, FA.y, 110, 700)}</g>` +
    `<g id="b-fAp" transform="translate(${FA.x} ${FA.y}) rotate(${TILT})"><g id="b-fA">${upArrow(90, { stroke: GOLD, strokeWidth: 5 }, 20, 16)}</g></g>` +
    `<g id="b-fDp" transform="translate(${FA.x} ${FA.y}) rotate(180)"><g id="b-fD">${upArrow(90, { strokeWidth: 4.4 }, 20, 16)}</g></g>` +
    `<g id="b-fQB">${qubit(FB.x, FB.y, 110, 720)}</g>` +
    `<g id="b-fBp" transform="translate(${FB.x} ${FB.y}) rotate(${-TILT})"><g id="b-fB">${upArrow(90, { strokeWidth: 4.4 }, 20, 16)}</g></g>` +
    `<circle id="b-fGlow" cx="${FB.x}" cy="${FB.y}" r="70" fill="${GOLD}" style="filter:blur(26px);opacity:0"/>` +
    `<g id="b-fGp" transform="translate(${FB.x} ${FB.y}) rotate(${TILT})"><g id="b-fG">${upArrow(90, { stroke: GOLD, strokeWidth: 5.4 }, 20, 16)}</g></g>` +
    `<g id="b-base14">${r.line(1230, 790, 1450, 790, pen({ strokeWidth: 2.6 }))}${dashed([[1236, 650], [1446, 650]], 8, 8, { strokeWidth: 1.8, stroke: DIM })}</g>` +
    `<g id="b-clk">${r.circle(CK.x, CK.y, 116, pen({ strokeWidth: 3.2 }))}${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return r.line(fx(CK.x + 46 * Math.cos(a)), fx(CK.y + 46 * Math.sin(a)), fx(CK.x + 53 * Math.cos(a)), fx(CK.y + 53 * Math.sin(a)), pen({ strokeWidth: 2 })); }).join("")}${dotS(CK.x, CK.y, 10)}</g>` +
    `<g id="b-clkh" transform="rotate(0 ${CK.x} ${CK.y})">${r.line(CK.x, CK.y, CK.x, CK.y - 40, pen({ strokeWidth: 3.4 }))}</g>` +
    `<g id="b-hs15">${handset(530, 300, 0.75)}${handset(1290, 300, 0.75)}</g>` + CAB15.svg +
    `<g id="b-path15">${dashed([[610, 560], [1205, 560]], 18, 14, { strokeWidth: 2.8 })}${headAt([[1180, 560], [1210, 560]], { strokeWidth: 2.8 }, 18)}</g>` +
    `<g id="b-x15">${cross(905, 560, 70)}</g>`;
  const bar14 = (i, x) => obj(`b-fbar${i}`, x - 32, 716, 64, 78, hbar(x - 28, 720, 56, 70, 760 + i));
  const coinD = 120;
  const ftlHtml =
    obj("b-ftl", 140, 120, 1640, 740, ftlSvg) +
    lc("b-nfl", 990, 200, 560, 56, "no faster than light") +
    lc("b-fhA", FA.x, 365, 180, 56, "Alice") + lc("b-fhB", FB.x, 365, 180, 56, "Bob") +
    bar14(0, 1280) + bar14(1, 1400) +
    lc("b-fb0", 1280, 822, 60, 40, "0") + lc("b-fb1", 1400, 822, 60, 40, "1") +
    `<div id="b-coin" class="obj" style="left:${CK.x - coinD / 2}px;top:${FB.y - coinD / 2}px;width:${coinD}px;height:${coinD}px">` +
    `<div id="b-coinS" class="obj" style="left:0;top:0;width:${coinD}px;height:${coinD}px;transform-origin:50% 50%">` +
    `<svg class="sk" width="${coinD}" height="${coinD}" viewBox="0 0 ${coinD} ${coinD}"><g id="b-coinr">${r.circle(60, 60, 110, pen({ strokeWidth: 3.2 }))}${r.circle(60, 60, 88, pen({ strokeWidth: 1.6, stroke: DIM }))}</g></svg>` +
    lbl("b-cf0", 0, fx(60 - ctr(56)), coinD, 56, "0", "opacity:0") + lbl("b-cf1", 0, fx(60 - ctr(56)), coinD, 56, "1", "opacity:0") + `</div></div>` +
    lc("b-ten15", 580, 256, 100, 48, "10") +
    lc("b-stays", FA.x, 690, 400, 40, "her qubit stays put");

  // ---------- 16. the closing circuit and the takeaway ----------
  const OX = 100, Y1 = 300, Y2 = 400, Y3 = 500;
  const X = (x) => x + OX;
  const box = (cx, cy) => r.rect(cx - 35, cy - 35, 70, 70, pen({ strokeWidth: 3 }));
  // A classical double line: right along y0 to x1, then down to y2.
  const dbl = (x0, y0, x1, y2) => [-4, 4].map((d) => r.linear([[x0, y0 + d], [x1 - d, y0 + d], [x1 - d, y2]], pen({ strokeWidth: 2.2, roughness: 0.6 }))).join("");
  const closeSvg =
    `<g id="b-cw">${r.line(X(300), Y1, X(685), Y1, pen())}${r.line(X(755), Y1, X(795), Y1, pen())}` +
    `${r.line(X(300), Y2, X(365), Y2, pen())}${r.line(X(435), Y2, X(795), Y2, pen())}` +
    `${r.line(X(300), Y3, X(1045), Y3, pen())}${r.line(X(1115), Y3, X(1185), Y3, pen())}${r.line(X(1255), Y3, X(1400), Y3, pen())}</g>` +
    `<g id="b-cbell">${box(X(400), Y2)}${dotS(X(500), Y2, 20)}${r.line(X(500), Y2, X(500), Y3 + 24, pen())}${plusT(X(500), Y3, 48, { strokeWidth: 3 })}</g>` +
    `<g id="b-calice">${dotS(X(620), Y1, 20)}${r.line(X(620), Y1, X(620), Y2 + 24, pen())}${plusT(X(620), Y2, 48, { strokeWidth: 3 })}${box(X(720), Y1)}</g>` +
    `<g id="b-cmeas">${meter(X(840), Y1, "b-cm1")}${meter(X(840), Y2, "b-cm2")}</g>` +
    `<g id="b-ccl">${dbl(X(885), Y2, X(1080), Y3 - 35)}${dbl(X(885), Y1, X(1220), Y3 - 35)}</g>` +
    `<g id="b-cfix">${box(X(1080), Y3)}${box(X(1220), Y3)}</g>`;
  const closeHtml =
    obj("b-close", 180, 240, 1500, 320, closeSvg) +
    lc("b-kpsi", X(240), Y1, 120, 56, "|ψ⟩") + lc("b-k0a", X(240), Y2, 120, 56, "|0⟩") + lc("b-k0b", X(240), Y3, 120, 56, "|0⟩") +
    lc("b-cH1", X(400), Y2, 60, 48, "H") + lc("b-cH2", X(720), Y1, 60, 48, "H") +
    lc("b-cX", X(1080), Y3, 60, 48, "X") + lc("b-cZ", X(1220), Y3, 60, 48, "Z") +
    lc("b-cout", X(1470), Y3, 140, 64, "|ψ⟩", `color:${GOLD}`) +
    lc("b-lbell", X(450), 572, 220, 40, "Bell pair") + lc("b-lalice", X(730), 572, 200, 40, "Alice") + lc("b-lbob", X(1150), 572, 220, 40, "Bob's fix") +
    lc("b-take", 960, 680, 1400, 72, "entanglement + 2 bits = the state moves") +
    obj("b-tku", 440, 712, 1040, 40, `<g id="b-tkug">${r.curve([[460, 730], [760, 722], [1100, 728], [1460, 720]], goldPen({ strokeWidth: 4.4, roughness: 1 }))}</g>`) +
    lc("b-nc", 700, 794, 380, 48, "nothing copied") + lc("b-nol", 1230, 794, 480, 48, "nothing outruns light");

  const html = stations + faxHtml + bellHtml + circHtml + cardsHtml + callHtml + fixHtml + restHtml + movedHtml + roHtml + splitHtml + sumHtml + ftlHtml + closeHtml;

  // ---------- timeline ----------
  const script = `
    const T = ${JSON.stringify(T)};
    const BELL = ${JSON.stringify(BELL)};
    const STRIPS = ${JSON.stringify(STRIPS)};
    const CAB = ${JSON.stringify(CAB.P)}, CAB8 = ${JSON.stringify(CAB8.P)}, CAB15 = ${JSON.stringify(CAB15.P)};
    const clamp = (u) => Math.min(1, Math.max(0, u));
    const along = (P, u) => {
      u = clamp(u);
      for (let i = 1; i < P.length; i++) if (P[i][2] >= u) {
        const a = P[i - 1], b = P[i], f = (u - a[2]) / ((b[2] - a[2]) || 1);
        return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
      }
      return [P[P.length - 1][0], P[P.length - 1][1]];
    };
    const rot = (id, a, cx, cy) => $(id).setAttribute("transform", "rotate(" + a.toFixed(2) + " " + cx + " " + cy + ")");
    const place = (id, x, y, a, sx = 1, sy = 1) => $(id).setAttribute("transform", "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ") scale(" + sx.toFixed(3) + " " + sy.toFixed(3) + ") rotate(" + a.toFixed(2) + ")");
    const bump = (t, a, d) => (t > a && t < a + d) ? Math.sin(Math.PI * (t - a) / d) : 0;

    // 0 to 1: Alice's arrow wobbles (some way, nobody knows), flickers when measuring is named
    onFrame((t) => {
      const amp = sched([[T.some0 - 0.1, T.some0 + 0.3, 0, 9], [T.nobody0 + 0.5, T.nobody0 + 1.2, 9, 4]], t, 0);
      const a = ${TILT} + amp * Math.sin(t * 5.2);
      place("b-aAp", ${AQ.x}, ${AQ.y}, a);
      const fl = t > T.meas1 && t < T.meas1 + 0.75 ? 0.3 + 0.7 * Math.abs(Math.cos((t - T.meas1) * 26)) : 1;
      $("b-aAp").style.opacity = fl.toFixed(3);
      const sh = t > T.meas1 && t < T.meas1 + 0.75 ? 7 * Math.sin((t - T.meas1) * 48) : 0;
      $("b-qm0").style.transform = "translateX(" + sh.toFixed(2) + "px)";
      const n = sched([[T.meas1, T.meas1 + 0.5, -50, 55], [T.meas1 + 0.5, T.meas1 + 0.8, 55, 35]], t, -50);
      rot("b-metn", n, 950, 735);
    });

    // 2 to 3: shreds fall into the bin, a pulse runs along the phone line
    onFrame((t) => {
      STRIPS.forEach((s) => {
        const u = ease.inOut((t - s.s) / 0.55);
        const y = 646 + (s.y1 - 646) * u, x = s.x0 + (s.x1 - s.x0) * u, a = s.rot * u;
        const flash = bump(t, T.shredded3 - 0.05, 0.5);
        const el = $(s.id);
        el.setAttribute("transform", "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ") rotate(" + a.toFixed(2) + ")");
        el.style.opacity = t < s.s ? "0" : (clamp((t - s.s) / 0.1) * (1 - 0.6 * flash)).toFixed(3);
      });
      const u1 = (t - (T.sends2 + 0.5)) / 0.95, u2 = (t - (T.needs3 + 0.1)) / 1.0;
      const u = u1 > 0 && u1 < 1 ? u1 : (u2 > 0 && u2 < 1 ? u2 : -1);
      const p = $("b-pulse");
      if (u < 0) { p.style.opacity = "0"; } else {
        const [x, y] = along(CAB, ease.inOut(u));
        p.setAttribute("cx", x.toFixed(2)); p.setAttribute("cy", y.toFixed(2)); p.style.opacity = "1";
      }
    });

    // 4 to 11: the Bell pair, its link, Bob's arrow
    const linkD = (L, R, rl, rr, rev, amp, waves) => {
      const dist = Math.hypot(R[0] - L[0], R[1] - L[1]);
      const sag = Math.max(0, dist - 330) * 0.13;
      const C = [(L[0] + R[0]) / 2, (L[1] + R[1]) / 2 + sag * 2];
      const a0 = Math.atan2(C[1] - L[1], C[0] - L[0]), a1 = Math.atan2(C[1] - R[1], C[0] - R[0]);
      const P0 = [L[0] + (rl + 8) * Math.cos(a0), L[1] + (rl + 8) * Math.sin(a0)], P2 = [R[0] + (rr + 8) * Math.cos(a1), R[1] + (rr + 8) * Math.sin(a1)];
      const N = 90, n = Math.round(N * rev);
      if (n < 2) return "";
      let d = "";
      for (let i = 0; i <= n; i++) {
        const u = i / N, A = (1 - u) * (1 - u), B = 2 * u * (1 - u), Cc = u * u;
        const x = A * P0[0] + B * C[0] + Cc * P2[0], y = A * P0[1] + B * C[1] + Cc * P2[1];
        const tx = 2 * (1 - u) * (C[0] - P0[0]) + 2 * u * (P2[0] - C[0]), ty = 2 * (1 - u) * (C[1] - P0[1]) + 2 * u * (P2[1] - C[1]);
        const tl2 = Math.hypot(tx, ty) || 1, w = amp * Math.sin(u * Math.PI * 2 * waves) * Math.sin(Math.PI * u);
        d += (i ? " L" : "M") + (x - ty / tl2 * w).toFixed(1) + " " + (y + tx / tl2 * w).toFixed(1);
      }
      return d;
    };
    onFrame((t) => {
      const Lx = sched([[T.alice5 - 0.05, T.alice5 + 0.95, BELL.L0[0], BELL.L1[0]]], t), Ly = sched([[T.alice5 - 0.05, T.alice5 + 0.95, BELL.L0[1], BELL.L1[1]]], t);
      const Rx = sched([[T.bob5 - 0.05, T.bob5 + 0.95, BELL.R0[0], BELL.R1[0]], [T.start10, T.start10 + 1.0, BELL.R1[0], BELL.R2[0]]], t);
      const Ry = sched([[T.bob5 - 0.05, T.bob5 + 0.95, BELL.R0[1], BELL.R1[1]], [T.start10, T.start10 + 1.0, BELL.R1[1], BELL.R2[1]]], t);
      const Rs = sched([[T.start10, T.start10 + 1.0, 1, BELL.s2]], t);
      $("b-qLp").setAttribute("transform", "translate(" + Lx.toFixed(2) + " " + Ly.toFixed(2) + ")");
      $("b-qRp").setAttribute("transform", "translate(" + Rx.toFixed(2) + " " + Ry.toFixed(2) + ") scale(" + Rs.toFixed(3) + ")");
      const rev = sched([[T.bell4 - 0.05, T.bell4 + 0.6, 0, 1]], t, 0);
      const sep = clamp((Math.hypot(Rx - Lx, Ry - Ly) - 330) / 400);
      const amp = 11 - 5 * sep, waves = 3 + 9 * sep;
      const link = $("b-link");
      link.setAttribute("d", linkD([Lx, Ly], [Rx, Ry], BELL.rad, BELL.rad * Rs, rev, amp, waves));
      const pulse = bump(t, T.ent4 - 0.1, 0.55) + bump(t, T.ent4 + 0.5, 0.55);
      link.setAttribute("stroke-width", (4 + 4 * pulse - 1.2 * sep).toFixed(2));
      link.setAttribute("stroke-dasharray", sep > 0.5 ? "16 11" : "none");
      link.style.opacity = (1 - 0.45 * sep).toFixed(3);
      // Bob's arrow: mirror image of Alice's, swung back by Z (scaleX -1 to 1), gold as it lands
      const sx = sched([[T.fix10 - 0.05, T.fix10 + 0.85, -1, 1]], t, -1);
      $("b-bAp").setAttribute("transform", "scale(" + sx.toFixed(3) + " 1) rotate(${TILT})");
      const g = clamp((t - (T.fix10 + 0.55)) / 0.3);
      $("b-bA").style.opacity = t < T.holds10 ? "0" : (1 - g).toFixed(3);
      $("b-bAg").style.opacity = g.toFixed(3);
      // readings tick together: 0 0, 1 1, ...
      const k = Math.max(0, Math.floor((t - T.readings4) / 0.5));
      const v = String([0, 1, 1, 0, 1, 0, 0, 1][k % 8]);
      $("b-rdLt").textContent = v; $("b-rdRt").textContent = v;
      const pop = 1 + 0.12 * Math.max(0, 1 - ((t - T.readings4) % 0.5) / 0.18) * (t > T.readings4 ? 1 : 0);
      $("b-rdL").style.transform = $("b-rdR").style.transform = "scale(" + pop.toFixed(3) + ")";
    });

    // 6 to 9: the mystery arrow slides into the gates; the two bits come out and travel
    onFrame((t) => {
      const mx = sched([[T.cnot6 - 0.3, T.measures6 + 0.3, 300, 770]], t, 300);
      place("b-myAp", mx, ${W1}, ${TILT}, 1, 1);
      $("b-myAp").style.opacity = t < T.mystery6 ? "0" : (clamp((t - T.mystery6) / 0.4) * (1 - clamp((t - T.both6) / 0.35))).toFixed(3);
      const sw = (t0) => sched([[t0, t0 + 0.35, -40, 45], [t0 + 0.35, t0 + 0.6, 45, 20]], t, -40);
      rot("b-m6a", sw(T.measures6 + 0.15), ${MX}, ${fx(W1 + 64 * 0.28)}); rot("b-m6b", sw(T.measures6 + 0.3), ${MX}, ${fx(W2 + 64 * 0.28)});
      // readout: flickers through 00 01 10 11, lands on 10
      const ro = $("b-ro");
      const vis = clamp((t - T.two7 + 0.1) / 0.2) * (1 - clamp((t - T.start10 + 0.1) / 0.3));
      ro.style.opacity = vis.toFixed(3);
      const k = Math.floor((t - T.two7) * 9);
      $("b-rot").textContent = t < T.one7 ? ["00", "01", "10", "11"][((k % 4) + 4) % 4] : "10";
      ro.style.color = t < T.one7 ? "${INK}" : "${GOLD}";
      let x = ${RO.x}, y = ${RO.y};
      const m1 = ease.inOut((t - (T.outcomes7 - 0.3)) / 0.9);
      x += (520 - x) * m1;
      const m2 = ease.inOut((t - (T.sends8 + 0.05)) / 0.4);
      x += (500 - x) * m2; y += (262 - y) * m2;
      const u3 = (t - (T.sends8 + 0.45)) / (T.phone8 + 0.15 - T.sends8 - 0.45);
      if (u3 > 0) { const [cx, cy] = along(CAB8, ease.inOut(u3)); x = cx; y = cy - 40; }
      const m4 = ease.inOut((t - (T.phone8 + 0.2)) / 0.45);
      x += (1560 - x) * m4; y += (478 - y) * m4;
      ro.style.transform = "translate(" + (x - ${RO.x}).toFixed(2) + "px," + (y - ${RO.y}).toFixed(2) + "px)";
      // the handsets ring on "phone call"
      const ring = t > T.phone8 - 0.1 && t < T.phone8 + 0.6 ? 7 * Math.sin((t - T.phone8) * 50) : 0;
      rot("b-hsA", ring, 440, 300); rot("b-hsB", -ring, 1440, 300);
    });

    // 11: Alice's original snaps to a plain 1
    onFrame((t) => {
      const a = sched([[T.meas11 + 0.25, T.meas11 + 0.6, ${TILT}, 180]], t, ${TILT});
      place("b-m2Ap", 300, ${W1}, a);
    });

    // 12: the magnifier reads the page
    onFrame((t) => {
      const u = Math.max(0, t - T.reads12);
      const dx = 26 * Math.sin(u * 3.2), dy = 14 * Math.sin(u * 6.4);
      $("b-magp").setAttribute("transform", "translate(" + dx.toFixed(2) + " " + dy.toFixed(2) + ")");
    });

    // 14 to 15: Bob's arrow shrinks to a dot, coin flips, Alice's arrow swings, the bits crawl
    onFrame((t) => {
      rot("b-raysp", t * 24, 620, 200);
      const s = sched([[T.until14 + 0.45, T.until14 + 1.25, 1, 0.08]], t, 1);
      place("b-fBp", ${FB.x}, ${FB.y}, ${-TILT}, s, s);
      $("b-fBp").style.opacity = t < T.only15 - 0.15 ? "1" : "0";
      // coin: scaleY through flips, face swaps edge-on
      const c0 = T.qubit14, ang = Math.max(0, t - c0) * Math.PI * 2.2;
      const sy = t > c0 ? Math.max(0.06, Math.abs(Math.cos(ang))) : 1;
      const face = Math.floor((ang + Math.PI / 2) / Math.PI) % 2;
      $("b-coinS").style.transform = "scaleY(" + sy.toFixed(3) + ")";
      $("b-cf0").style.opacity = t > c0 - 0.2 && face === 0 ? "1" : "0";
      $("b-cf1").style.opacity = t > c0 - 0.2 && face === 1 ? "1" : "0";
      // bars rise to exactly half and then stay put
      const h = sched([[T.fifty14 - 0.1, T.fifty14 + 0.5, 0, 1]], t, 0);
      ["b-fbar0", "b-fbar1"].forEach((id) => { $(id).style.clipPath = "inset(" + ((1 - h) * 100).toFixed(2) + "% 0 0 0)"; });
      // Alice's arrow points every which way
      const w0 = T.whatever14;
      const a = sched([[w0 + 0.05, w0 + 0.45, ${TILT}, -70], [w0 + 0.6, w0 + 1.0, -70, 140], [w0 + 1.15, w0 + 1.5, 140, 75], [w0 + 1.65, w0 + 2.05, 75, 215], [w0 + 2.15, w0 + 2.45, 215, 160]], t, ${TILT});
      place("b-fAp", ${FA.x}, ${FA.y}, a);
      // clock hand sweeps while Bob waits
      rot("b-clkh", Math.max(0, t - T.wait15 + 0.2) * 150, ${CK.x}, ${CK.y});
      // the bits crawl down the line, ordinary speed
      const u = (t - (T.wait15 + 0.1)) / (T.only15 - 0.15 - T.wait15 - 0.1);
      const [x, y] = along(CAB15, ease.inOut(u));
      const ten = $("b-ten15");
      ten.style.transform = "translate(" + (x - 580).toFixed(2) + "px," + (y - 40 - 256).toFixed(2) + "px)";
      ten.style.opacity = (t < T.wait15 ? 0 : clamp((t - T.wait15) / 0.2) * (1 - clamp((t - T.only15) / 0.25))).toFixed(3);
      $("b-fGlow").style.opacity = (0.35 * clamp((t - T.only15 - 0.3) / 0.5) * (0.8 + 0.2 * Math.sin(t * 4))).toFixed(3);
    });

    // ---- 0. hook: Alice's unknown state ----
    write("#b-alice0", T.alice0 - 0.05, 0.35);
    draw("#b-aQ", T.alice0, 1.2);
    write(["#b-a0", "#b-a1"], T.alice0 + 0.9, 0.2);
    write("#b-qdef", T.qubit0 + 0.2, 0.9);
    blurOut("#b-title", 3.05);
    draw("#b-aA", T.arrow0 - 0.15, 0.6);
    write("#b-qm0", T.nobody0 - 0.05, 0.3);
    // ---- 1. Bob far away; no copying; measuring destroys ----
    fade("#b-qdef", 0, T.start1 - 0.1, 0.3);
    write("#b-bob0", T.bob1 - 0.15, 0.3);
    draw("#b-bQ", T.bob1 - 0.05, 0.9);
    write(["#b-b0", "#b-b1"], T.bob1 + 0.7, 0.2);
    draw("#b-dist", T.far1 - 0.1, 1.0);
    write("#b-far", T.far1 + 0.1, 0.45);
    hide("#b-ghost"); fade("#b-ghost", 0.45, T.exact1 - 0.1, 0.5);
    write("#b-goal", T.exact1 + 0.2, 0.25);
    draw("#b-cop", T.copy1 - 0.25, 0.5);
    draw("#b-x1", T.copy1 + 0.3, 0.3);
    write("#b-nocopy", T.copy1 + 0.4, 0.55);
    draw("#b-met", T.meas1 - 0.25, 0.4);
    draw("#b-x2", T.meas1 + 0.35, 0.3);
    write("#b-destroys", T.meas1 + 0.4, 0.5);
    blurOut(["#b-st", "#b-alice0", "#b-a0", "#b-a1", "#b-qm0", "#b-bob0", "#b-b0", "#b-b1", "#b-far", "#b-goal", "#b-nocopy", "#b-destroys"], T.off1);

    // ---- 2. the fax that shreds the original ----
    draw("#b-faxL", T.picture2 - 0.05, 1.1);
    draw("#b-faxR", T.fax2 + 0.1, 1.0);
    draw("#b-pageL", T.machine2 + 0.05, 0.45);
    draw(["#b-bin", "#b-exit"], T.shreds2 - 0.25, 0.4);
    move("#b-pgLm", { y: 0 }, { y: 200 }, T.shreds2 + 0.1, 0.9);
    write(["#b-faxA", "#b-faxB"], T.shreds2 + 0.6, 0.35);
    draw("#b-cable", T.sends2 - 0.1, 1.0);
    // ---- 3. the page comes out at Bob's; it all needs the phone line ----
    move("#b-pgRm", { y: 200 }, { y: 0 }, T.comes3 - 0.05, 0.9);
    write("#b-shredl", T.shredded3 - 0.1, 0.5);
    write("#b-phonel", T.phone3 - 0.1, 0.55);
    blurOut(["#b-fax", "#b-pgL", "#b-pgR", "#b-faxA", "#b-faxB", "#b-shredl", "#b-phonel"], T.off3);

    // ---- 4. the Bell pair ----
    draw(["#b-qL", "#b-qR"], T.quantum4 + 0.4, 0.9);
    write("#b-bellp", T.bell4 - 0.15, 0.55);
    write(["#b-rdL", "#b-rdR"], T.readings4 - 0.05, 0.2);
    write("#b-eq4", T.always4 - 0.15, 0.2);
    write("#b-match4", T.always4 + 0.05, 0.6);
    // ---- 5. Alice keeps one, Bob takes the other ----
    blurOut(["#b-bellp", "#b-rdL", "#b-rdR", "#b-eq4", "#b-match4"], T.start5 - 0.1);
    write("#b-hdA", T.alice5 + 0.2, 0.35);
    write("#b-hdB", T.bob5 + 0.2, 0.3);
    move("#b-hdB", { x: 0, y: 0 }, { x: ${BELL.R2[0] - BELL.R1[0]}, y: 110 }, T.start10, 1.0);

    // ---- 6. the circuit ----
    hide(["#b-myQ", "#b-myq"]);
    fade(["#b-myQ", "#b-myq"], 1, T.mystery6 - 0.1, 0.4);
    fade("#b-myq", 0, T.cnot6 - 0.3, 0.3);
    draw("#b-wires", T.half6 - 0.1, 0.7);
    write("#b-gate", T.gates6 - 0.05, 0.9);
    fade("#b-gate", 0, T.gates6 + 1.15, 0.3);
    draw("#b-cx6", T.cnot6 - 0.1, 0.5);
    draw("#b-h6", T.h6 - 0.25, 0.3); write("#b-h6l", T.h6 - 0.05, 0.15);
    draw("#b-m6", T.measures6 - 0.1, 0.45);
    // ---- 7. two bits, four outcomes, one time in four each ----
    blurOut(["#b-circ", "#b-h6l"], T.four7 - 0.1);
    ${CARDS.map((_, i) => `draw("#b-card${i}", ${fx(T.four7 + i * 0.16)}, 0.3); write("#b-cd${i}", ${fx(T.four7 + 0.15 + i * 0.16)}, 0.15);`).join("\n    ")}
    draw("#b-base7", T.outcomes7, 0.4);
    ${CARDS.map((_, i) => `draw("#b-bar${i}", ${fx(T.outcomes7 + 0.25 + i * 0.12)}, 0.35);`).join("\n    ")}
    write("#b-in4", T.one7 - 0.1, 0.6);
    draw("#b-cardG", T.one7 + 0.1, 0.4);
    tl.to("#b-cd2", { color: "${GOLD}", duration: 0.25 }, T.one7 + 0.1);
    fade(["#b-card0", "#b-card1", "#b-card3", "#b-cd0", "#b-cd1", "#b-cd3", "#b-bar0", "#b-bar1", "#b-bar3"], 0.35, T.one7 + 0.2, 0.4);
    // ---- 8. the bits go the ordinary way ----
    blurOut(["#b-cards", "#b-cd0", "#b-cd1", "#b-cd2", "#b-cd3", "#b-in4"], T.start8 - 0.05);
    draw(["#b-hsAi", "#b-hsBi"], T.start8 + 0.05, 0.45);
    draw("#b-cab8", T.sends8 - 0.05, 0.8);
    write("#b-ordl", T.ordinary8 - 0.05, 0.8);
    // ---- 9. the fix table ----
    blurOut(["#b-call", "#b-ordl"], T.start9);
    write("#b-fixh", T.start9 + 0.25, 0.45);
    draw("#b-fixf", T.fix9 - 0.25, 0.5);
    write("#b-row0", T.nothing9 - 0.1, 0.35);
    write("#b-row1", T.x9 - 0.02, 0.25);
    write("#b-row2", T.z9 - 0.02, 0.25);
    write("#b-row3", T.both9 - 0.05, 0.4);
    tl.to("#b-row2", { color: "${GOLD}", duration: 0.3 }, T.both9 + 0.35);
    fade(["#b-row0", "#b-row1", "#b-row3"], 0.45, T.both9 + 0.4, 0.4);
    draw("#b-skX", T.half9 - 0.2, 0.45); draw("#b-skZ", T.half9, 0.45);
    write("#b-halft", T.half9 + 0.2, 0.45);
    // ---- 10. his half holds her state, turned; the fix restores it ----
    blurOut(["#b-fix", "#b-fixh", "#b-row0", "#b-row1", "#b-row2", "#b-row3", "#b-halft"], T.start10 - 0.1);
    draw("#b-bA", T.holds10 - 0.1, 0.5);
    write("#b-turned", T.turned10 - 0.05, 0.8);
    hide("#b-bRef"); fade("#b-bRef", 0.85, T.restores10, 0.4);
    draw("#b-tickg", T.exactly10 - 0.1, 0.3);
    write("#b-same", T.exactly10, 0.5);
    // ---- 11. measuring wiped out her original: the state moved ----
    fade(["#b-turned", "#b-bRef"], 0, T.start11 + 0.1, 0.3);
    fade(["#b-tick", "#b-same"], 0, T.moved11 - 0.7, 0.3);
    draw("#b-m2Q", T.meas11 - 0.15, 0.4);
    draw("#b-m2A", T.meas11 - 0.05, 0.3);
    write("#b-plain1", T.meas11 + 0.55, 0.9);
    draw("#b-mvArc", T.moved11 - 0.5, 1.0);
    write("#b-movedl", T.moved11 + 0.05, 0.4);
    write("#b-notcop", T.copied11 - 0.3, 0.6);
    draw("#b-cop2g", T.copied11 - 0.2, 0.35); draw("#b-x11", T.copied11 + 0.2, 0.3);
    blurOut(["#b-bell", "#b-hdA", "#b-hdB", "#b-m2", "#b-plain1", "#b-mv", "#b-movedl", "#b-notcop", "#b-cop2"], T.off11);

    // ---- 12. where the fax breaks ----
    write("#b-wfb", T.fax12 - 0.1, 0.8);
    draw("#b-div", T.breaks12 - 0.05, 0.6);
    draw("#b-sfax", T.fax12b - 0.25, 0.6);
    draw("#b-spage", T.fax12b + 0.05, 0.4);
    draw("#b-mag", T.reads12 - 0.1, 0.4);
    write("#b-reads", T.reads12 + 0.15, 0.9);
    draw("#b-sQ", T.alice12 - 0.3, 0.45);
    draw("#b-sA", T.alice12 - 0.05, 0.3);
    hide("#b-sheet");
    tl.fromTo("#b-sheet", { opacity: 0, y: -120 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, T.never12 - 0.1);
    write("#b-sq", T.learns12 - 0.05, 0.3);
    write("#b-never", T.alice12, 0.9);
    draw("#b-nevu", T.never12 + 0.1, 0.35);
    blurOut(["#b-split", "#b-wfb", "#b-reads", "#b-sheet", "#b-sq", "#b-never"], T.off12);

    // ---- 13. the state rides on entanglement and bits together ----
    draw("#b-sAr", T.state13 - 0.1, 0.45); write("#b-sstate", T.state13 + 0.1, 0.5);
    draw("#b-sqz", T.ent13 - 0.35, 0.7); write("#b-sent", T.ent13 + 0.05, 0.6);
    write("#b-splus", T.bits13 - 0.35, 0.15);
    write("#b-s10", T.bits13 - 0.2, 0.25); write("#b-sbits", T.bits13 + 0.05, 0.35);
    draw("#b-brk", T.together13 - 0.05, 0.55);
    draw("#b-sto", T.together13 + 0.4, 0.35);
    write("#b-a10", T.alone13 - 0.25, 0.25);
    draw("#b-sto2", T.alone13 + 0.05, 0.3);
    write("#b-aq", T.say13 - 0.1, 0.2);
    write("#b-anoth", T.nothing13 - 0.1, 0.9);
    blurOut(["#b-sum", "#b-sent", "#b-splus", "#b-s10", "#b-sbits", "#b-sstate", "#b-a10", "#b-aq", "#b-anoth"], T.off13);

    // ---- 14. no faster than light; Bob's 50/50 until the bits arrive ----
    write("#b-nfl", T.no14 - 0.1, 0.9);
    draw(["#b-sun", "#b-rays"], T.light14 - 0.35, 0.6);
    draw("#b-fQB", T.until14 - 0.2, 0.5); write("#b-fhB", T.until14 - 0.05, 0.3);
    draw("#b-fB", T.until14 + 0.1, 0.3);
    draw("#b-coinr", T.qubit14 - 0.25, 0.35);
    draw("#b-base14", T.fifty14 - 0.3, 0.3);
    write(["#b-fb0", "#b-fb1"], T.fifty14 + 0.1, 0.2);
    draw("#b-fQA", T.whatever14 - 0.35, 0.45); write("#b-fhA", T.whatever14 - 0.2, 0.3);
    draw("#b-fA", T.whatever14 - 0.1, 0.25);
    // ---- 15. Bob must wait; her qubit never travels, only its state ----
    blurOut(["#b-nfl", "#b-sun", "#b-raysp", "#b-coin"], T.off14);
    draw("#b-clk", T.wait15 - 0.35, 0.45);
    hide("#b-clkh"); show("#b-clkh", T.wait15 - 0.1);
    draw("#b-hs15", T.wait15 - 0.35, 0.3); draw("#b-cab15", T.wait15 - 0.15, 0.6);
    fade("#b-fAp", 0, T.her15 - 0.1, 0.3);
    draw("#b-fD", T.her15, 0.35);
    draw("#b-path15", T.never15 - 0.2, 0.45);
    draw("#b-x15", T.never15 + 0.25, 0.3);
    write("#b-stays", T.never15 + 0.3, 0.8);
    fade(["#b-fbar0", "#b-fbar1", "#b-fb0", "#b-fb1", "#b-base14"], 0, T.only15 - 0.15, 0.35);
    draw("#b-fG", T.only15 + 0.05, 0.5);
    blurOut(["#b-ftl", "#b-fhA", "#b-fhB", "#b-ten15", "#b-stays"], T.off15);

    // ---- 16. the closing circuit and the takeaway ----
    draw("#b-cw", T.off15 + 0.2, 0.7);
    write(["#b-kpsi", "#b-k0a", "#b-k0b"], T.off15 + 0.25, 0.3);
    draw("#b-cbell", T.ent16 - 0.2, 0.6); write("#b-cH1", T.ent16 - 0.05, 0.15);
    write("#b-lbell", T.ent16 + 0.2, 0.45);
    draw("#b-calice", T.plus16 - 0.05, 0.5); write("#b-cH2", T.plus16 + 0.3, 0.15);
    draw("#b-cmeas", T.two16, 0.4);
    write("#b-lalice", T.two16 + 0.1, 0.4);
    draw("#b-ccl", T.ordinary16, 0.6);
    draw("#b-cfix", T.bits16 - 0.05, 0.4); write(["#b-cX", "#b-cZ"], T.bits16 + 0.15, 0.15);
    write("#b-lbob", T.bits16 + 0.2, 0.4);
    write("#b-cout", T.move16, 0.4);
    write("#b-take", T.move16 + 0.3, 1.0);
    draw("#b-tkug", T.nothing16 + 0.1, 0.5);
    write("#b-nc", T.copied16 - 0.3, 0.6);
    write("#b-nol", T.outruns16 - 0.25, 0.8);
  `;
  return { html, script, css: "" };
}
