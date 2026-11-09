// Lesson 4, Measurement and shots. Beat plan: plan.md. Drawings follow the voice word by word.
export const phrases = [
  ["five hundred and twelve", "512"],
  ["four hundred and eighty eight", "488"],
  ["seven hundred and forty eight", "748"],
  ["seventy one", "71"],
  ["sixty percent", "60%"],
  ["seventy five", "75%"],
  ["Ten shots", "10 shots"],
  ["six zeros", "6 zeros"],
  ["A hundred", "100"],
  ["A thousand", "1,000"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, wobbly, mulberry32, lbl, cue, TOTAL, INK, GOLD, GROUND, DIM } = k;
  const f1 = (v) => +v.toFixed(1);

  // ---------- label helpers (board coordinates, centred on cx, cy) ----------
  const L = (id, cx, cy, size, text, w, extra = "") => lbl(id, f1(cx - w / 2), f1(cy - size * 0.745), w, size, text, extra);
  const LL = (id, x, cy, size, text, w, extra = "") => lbl(id, x, f1(cy - size * 0.745), w, size, text, "text-align:left;" + extra);
  const LR = (id, xr, cy, size, text, w, extra = "") => lbl(id, xr - w, f1(cy - size * 0.745), w, size, text, "text-align:right;" + extra);
  const G = `color:${GOLD};`;
  const board = (id, inner, labels = "", style = "") =>
    `<div id="${id}" class="obj" style="left:0;top:0;width:1920px;height:1080px;${style}"><svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${inner}</svg>${labels}</div>`;

  // ---------- drawing helpers ----------
  const rrPath = (x, y, w, h, q) =>
    `M${x + q} ${y} L${x + w - q} ${y} Q${x + w} ${y} ${x + w} ${y + q} L${x + w} ${y + h - q} Q${x + w} ${y + h} ${x + w - q} ${y + h} L${x + q} ${y + h} Q${x} ${y + h} ${x} ${y + h - q} L${x} ${y + q} Q${x} ${y} ${x + q} ${y} Z`;
  const card = (cx, cy, w, h, o) => r.path(rrPath(cx - w / 2, cy - h / 2, w, h, 14), o ?? pen({ strokeWidth: 3, roughness: 1 }));

  // A qubit: circle with poles, and an arrow tilted `ang` degrees from straight up (0 = reads 0).
  function qubit(id, cx, cy, R, ang, o = {}) {
    const cp = o.gold ? goldPen({ strokeWidth: 3.6 }) : pen({ strokeWidth: 3 });
    const circ =
      r.circle(cx, cy, 2 * R, cp) +
      r.line(cx - 9, cy - R, cx + 9, cy - R, pen({ strokeWidth: 2.4, roughness: 0.6 })) +
      r.line(cx - 9, cy + R, cx + 9, cy + R, pen({ strokeWidth: 2.4, roughness: 0.6 }));
    const arr =
      arrow(cx, cy, cx, cy - R * 0.84, { strokeWidth: Math.max(3, R / 26), roughness: 0.8 }, Math.max(12, R * 0.2)) +
      r.circle(cx, cy, Math.max(8, R * 0.12), pen({ fill: INK, fillStyle: "solid", strokeWidth: 2, roughness: 0.6 }));
    const svg = `<g id="${id}-c">${circ}</g><g id="${id}-a" transform="rotate(${ang} ${cx} ${cy})">${arr}</g>`;
    const s = o.labelSize ?? 44;
    const labels = o.noLabels
      ? ""
      : L(`${id}-l0`, cx, cy - R - 38, s, "0", 60) + L(`${id}-l1`, cx, cy + R + 36, s, "1", 60);
    return { svg, labels };
  }
  // The measurement symbol: a box, a half dial and a needle (rotated at run time).
  const NEEDLES = [];
  function meter(id, cx, cy, w, h, swings = []) {
    const py = cy + h * 0.3, ar = w * 0.33;
    const body =
      r.rect(cx - w / 2, cy - h / 2, w, h, pen({ strokeWidth: 3, roughness: 1 })) +
      r.arc(cx, py, ar * 2, ar * 2, Math.PI * 1.06, Math.PI * 1.94, false, pen({ strokeWidth: 2.6, roughness: 0.8 }));
    const needle = `<g id="${id}-n" transform="rotate(-50 ${cx} ${f1(py)})">${r.line(cx, py, cx, py - ar * 1.12, pen({ strokeWidth: 3.4, roughness: 0.6 }))}${r.circle(cx, py, 9, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1.5 }))}</g>`;
    const segs = [];
    swings.forEach((t0) => segs.push([t0, t0 + 0.32, -50, 58], [t0 + 0.32, t0 + 0.7, 58, 32]));
    NEEDLES.push({ id: `${id}-n`, px: cx, py: f1(py), segs });
    return `<g id="${id}">${body}</g>${needle}`;
  }
  // Stick figure, y = head centre. reach = [x, y] for the right hand.
  function stick(x, y, s, reach, sw = 3) {
    const p = () => pen({ strokeWidth: sw, roughness: 1 });
    const hand = reach ?? [x + 30 * s, y + 72 * s];
    return (
      r.circle(x, y, 40 * s, p()) +
      r.line(x, y + 20 * s, x, y + 92 * s, p()) +
      r.line(x, y + 42 * s, x - 30 * s, y + 72 * s, p()) +
      r.line(x, y + 42 * s, hand[0], hand[1], p()) +
      r.line(x, y + 92 * s, x - 24 * s, y + 140 * s, p()) +
      r.line(x, y + 92 * s, x + 24 * s, y + 140 * s, p())
    );
  }
  // Small ballot box with a paper going in: centre x, y, scale s.
  const ballot = (x, y, s = 1, o = {}) => {
    const q = (w) => (o.gold ? goldPen({ strokeWidth: w }) : pen({ strokeWidth: w, roughness: 0.9 }));
    return (
      r.rect(x - 22 * s, y - 40 * s, 30 * s, 34 * s, q(2.4)) +
      r.line(x - 15 * s, y - 24 * s, x - 9 * s, y - 17 * s, q(2.2)) +
      r.line(x - 9 * s, y - 17 * s, x + 1 * s, y - 33 * s, q(2.2)) +
      r.rect(x - 34 * s, y - 8 * s, 68 * s, 48 * s, q(2.8)) +
      r.line(x - 18 * s, y - 8 * s, x + 18 * s, y - 8 * s, q(4))
    );
  };
  // A bar that grows from `base`: hachure body clipped to its height, plus a cap line that rides on top.
  function bar(id, x, w, base, maxH, o = {}) {
    const fillPen = pen({ fill: o.gold ? GOLD : INK, fillStyle: "hachure", hachureGap: o.gap ?? 10, fillWeight: 1.8, strokeWidth: 2.8, roughness: 1, stroke: o.gold ? GOLD : INK });
    return (
      `<defs><clipPath id="${id}-clip"><rect id="${id}-cr" x="${x - 12}" y="${base}" width="${w + 24}" height="0"/></clipPath></defs>` +
      `<g id="${id}" clip-path="url(#${id}-clip)">${r.rect(x, base - maxH, w, maxH, fillPen)}</g>` +
      `<g id="${id}-cap" style="opacity:0">${r.line(x - 4, base, x + w + 4, base, (o.gold ? goldPen : pen)({ strokeWidth: 3.4, roughness: 0.7 }))}</g>`
    );
  }
  const dash = (id, x1, y1, x2, y2, stroke = DIM, w = 2.4, extra = "") =>
    `<line id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-dasharray="10 10" stroke-linecap="round" ${extra}/>`;

  // ---------- times ----------
  const T = {
    friend: cue(0, "friend") - 0.1, sets: cue(0, "sets") - 0.1, qubit0: cue(0, "qubit") - 0.1,
    zero0: cue(0, "zero"), one0: cue(0, "one"), can: cue(0, "Can") - 0.1,
    l1: cue(1), measure: cue(1, "measure") - 0.15, look: cue(1, "look"), zero1: cue(1, "zero") - 0.1, what: cue(1, "What") - 0.1,
    nothing: cue(2, "nothing"), bit: cue(2, "bit") - 0.1, zero2: cue(2, "zero") - 0.1, one2: cue(2, "or") + 0.15,
    that3: cue(3, "That") - 0.1, nearly: cue(3, "nearly") - 0.15, rarely: cue(3, "rarely") - 0.15,
    its: cue(4, "It's") - 0.05, opinion: cue(4, "opinion") - 0.1, poll4: cue(4, "poll"), voter4: cue(4, "voter") - 0.2, who: cue(4, "who") - 0.1,
    thousand5: cue(5, "thousand") - 0.1, pct: cue(5, "percentages"), focus: cue(5, "focus") - 0.1,
    quantum: cue(6, "Quantum"), set6: cue(6, "set") - 0.1, again1: cue(6, "again") - 0.05, again2: cue(6, "again", 1) - 0.05, measuring: cue(6, "measuring"),
    run7: cue(7, "run"), shot7: cue(7, "shot") - 0.1, vote7: cue(7, "vote") - 0.25,
    say: cue(8, "Say") - 0.05, zero8: cue(8, "zero") - 0.1, three: cue(8, "three") - 0.1, times8: cue(8, "times"),
    ten: cue(9, "Ten"), six: cue(9, "six"), sixty: cue(9, "six") + 0.85,
    hundred: cue(10, "hundred") - 0.05, thousand10: cue(10, "thousand") - 0.25,
    l11: cue(11), wobbles: cue(11, "wobbles") - 0.1, settles: cue(11, "settles") - 0.1, trueT: cue(11, "true") - 0.1,
    l12: cue(12), halve: cue(12, "halve") - 0.1, wobble12: cue(12, "wobble"), four: cue(12, "four") - 0.1,
    so: cue(13, "So"), fifty: cue(13, "qubit") - 0.9, twelve: cue(13, "gives") + 0.1, eighty: cue(13, "and") + 0.4, relax: cue(14) - 0.55,
    broken: cue(14, "broken") - 0.1, gap: cue(14, "gap") - 0.1, shot14: cue(14, "shot") - 0.1, poll14: cue(14, "poll") - 0.2,
    heres: cue(15), breaks: cue(15, "breaks") - 0.1, voter15: cue(15, "voter") - 0.15, opinion15: cue(15, "opinion") - 0.2, asked: cue(15, "asked") - 0.3,
    qubit16: cue(16, "qubit") - 0.1, no16: cue(16, "no") - 0.05, measuring16: cue(16, "Measuring") - 0.1, creates: cue(16, "creates") - 0.05,
    sitting: cue(16, "sitting") - 0.15,
    thats: cue(17) - 0.05, freshly: cue(17, "freshly") - 0.3,
    one18: cue(18) - 0.05, vote18: cue(18, "vote") - 0.1, many: cue(18, "many") - 0.1, reveal: cue(18, "reveal") - 0.1,
  };
  const t = (v) => v.toFixed(3);

  // =====================================================================
  // Scene A: one look tells you almost nothing (lines 0 to 3)
  // =====================================================================
  const QA = { x: 860, y: 560, R: 110 };
  const qa = qubit("b-a-q", QA.x, QA.y, QA.R, 60);
  const aFriend = board(
    "b-a-friend",
    `<g id="b-a-fig">${stick(330, 492, 1.1, [440, 548])}</g>` +
      `<g id="b-a-setup">${r.rect(450, 512, 150, 96, pen({ roughness: 1 }))}</g>` +
      `<g id="b-a-ar1">${arrow(612, 560, 732, 560, { strokeWidth: 3 })}</g>`,
    L("b-a-friendl", 330, 700, 44, "friend", 160) + L("b-a-setupl", 525, 560, 44, "set up", 150)
  );
  const aRow = board(
    "b-a-row",
    qa.svg +
      `<g id="b-a-ar2">${arrow(992, 560, 1080, 560, { strokeWidth: 3 })}</g>` +
      meter("b-a-m", 1180, 560, 170, 120, [T.look - 0.05]),
    qa.labels +
      `<div id="b-a-cover" class="obj" style="left:0;top:0;width:1920px;height:1080px"><svg class="sk" width="1920" height="1080">${r.rect(
        QA.x - 122, QA.y - 120, 244, 240, pen({ fill: GROUND, fillStyle: "solid", strokeWidth: 3, roughness: 1.1 })
      )}${r.rect(QA.x - 122, QA.y - 120, 244, 240, pen({ strokeWidth: 3, roughness: 1.3 }))}</svg>${L("b-a-qm", QA.x, QA.y + 6, 140, "?", 120, G)}</div>`
  );
  const aCard = board(
    "b-a-card",
    `<g id="b-a-cardbox">${card(1450, 560, 130, 160, goldPen({ strokeWidth: 3.8, roughness: 1 }))}</g>`,
    L("b-a-card0", 1450, 566, 96, "0", 100, G)
  );
  const aWhat = L("b-a-q2", 1450, 430, 64, "?", 60) + L("b-a-what", 1450, 690, 44, "what did you learn?", 360);
  const aGhost = board(
    "b-a-ghosts",
    `<g id="b-a-g0">${card(1300, 557, 96, 120, pen({ strokeWidth: 2.2, stroke: DIM, roughness: 1.2 }))}</g>` +
      `<g id="b-a-g1">${card(1430, 557, 96, 120, pen({ strokeWidth: 2.2, stroke: DIM, roughness: 1.2 }))}</g>`,
    L("b-a-g0l", 1300, 562, 64, "0", 80, "color:rgba(232,232,232,0.5)") +
      L("b-a-g1l", 1430, 562, 64, "1", 80, "color:rgba(232,232,232,0.5)") +
      L("b-a-bit", 1210, 690, 56, "1 look = 1 bit", 360)
  );
  const qA1 = qubit("b-a-qa", 650, 330, 80, 15, { labelSize: 40 });
  const qA2 = qubit("b-a-qb", 650, 690, 80, 150, { labelSize: 40 });
  const aTwo = board(
    "b-a-two",
    qA1.svg + qA2.svg +
      `<g id="b-a-arA">${arrow(745, 350, 1222, 528, { strokeWidth: 3 })}</g>` +
      `<g id="b-a-arB">${arrow(745, 672, 1222, 592, { strokeWidth: 3 })}</g>`,
    qA1.labels + qA2.labels +
      LR("b-a-nl", 545, 330, 48, "nearly always 0", 330) +
      LR("b-a-rl", 545, 690, 48, "rarely 0", 330)
  );

  // =====================================================================
  // Scene B: the opinion poll (lines 4 to 5)
  // =====================================================================
  const boxSvg =
    r.rect(820, 520, 280, 200, pen({ strokeWidth: 3.2, roughness: 1 })) +
    r.poly([[820, 520], [868, 474], [1148, 474], [1100, 520]], pen({ strokeWidth: 3, roughness: 1 })) +
    r.linear([[1100, 720], [1148, 674], [1148, 474]], pen({ strokeWidth: 3, roughness: 1 })) +
    r.line(930, 497, 1050, 497, pen({ strokeWidth: 6, roughness: 0.6 }));
  const crowd = [];
  for (let c = 0; c < 12; c++) {
    let g = "";
    for (let rw = 0; rw < 5; rw++) g += stick(180 + c * 50 + (rw % 2) * 12, 404 + rw * 90, 0.42, null, 2.2);
    crowd.push(`<g id="b-b-col${c}">${g}</g>`);
  }
  const bBase = 620, bMax = 260;
  const bTop = (p) => bBase - bMax * p;
  const sB = board(
    "b-sB",
    `<g id="b-b-box">${boxSvg}</g>` +
      `<g id="b-b-voter">${stick(620, 470, 1.2, [688, 522])}</g>` +
      `<g id="b-b-crowd">${crowd.join("")}</g>` +
      `<g id="b-b-board">${r.line(1320, bBase, 1650, bBase, pen({ strokeWidth: 3 }))}${r.rect(1350, bTop(1), 100, bMax, pen({ stroke: DIM, strokeWidth: 2, roughness: 1.2 }))}${r.rect(1510, bTop(1), 100, bMax, pen({ stroke: DIM, strokeWidth: 2, roughness: 1.2 }))}</g>`,
    L("b-b-polll", 960, 622, 64, "poll", 160) +
      L("b-b-voterl", 620, 700, 44, "1 voter", 160) +
      L("b-b-crowdl", 470, 318, 56, "1,000 voters", 340) +
      L("b-b-winner", 1480, 290, 56, `winner<span style="${G}">?</span>`, 260) +
      L("b-b-al", 1400, 656, 48, "A", 60) + L("b-b-bl", 1560, 656, 48, "B", 60)
  );
  const bPaper = board("b-b-paper", `<g>${r.rect(676, 482, 34, 44, pen({ strokeWidth: 2.4, roughness: 0.8 }))}${r.line(684, 498, 702, 498, pen({ strokeWidth: 2 }))}${r.line(684, 510, 698, 510, pen({ strokeWidth: 2 }))}</g>`);
  const bRes = board(
    "b-b-res",
    r.rect(1350, bTop(0.58), 100, bMax * 0.58, pen({ fill: GOLD, fillStyle: "hachure", hachureGap: 9, fillWeight: 2, stroke: GOLD, strokeWidth: 3, roughness: 1 })) +
      r.rect(1510, bTop(0.42), 100, bMax * 0.42, pen({ fill: INK, fillStyle: "hachure", hachureGap: 10, fillWeight: 1.8, strokeWidth: 2.8, roughness: 1 })),
    L("b-b-p58", 1400, bTop(0.58) - 42, 52, "58%", 140, G) + L("b-b-p42", 1560, bTop(0.42) - 42, 52, "42%", 140)
  );

  // =====================================================================
  // Scene C: shots (lines 6 to 7)
  // =====================================================================
  const ROWS = [260, 430, 600];
  const cDigits = ["0", "0", "1"];
  const cCardT = [T.measuring, T.measuring + 0.35, T.measuring + 0.7];
  const sC = board(
    "b-sC",
    ROWS.map((y, i) => {
      const q = qubit(`b-c-q${i}`, 520, y, 62, 60, { noLabels: true });
      return (
        `<g id="b-c-row${i}">` +
        r.rect(185, y - 42, 150, 84, pen({ roughness: 1 })) +
        arrow(345, y, 445, y, { strokeWidth: 2.8 }) +
        `</g>` +
        q.svg +
        `<g id="b-c-rowb${i}">${arrow(594, y, 676, y, { strokeWidth: 2.8 })}</g>` +
        meter(`b-c-m${i}`, 760, y, 150, 100, [cCardT[i] - 0.3]) +
        `<g id="b-c-rowc${i}">${arrow(844, y, 904, y, { strokeWidth: 2.8 })}${card(960, y, 92, 116)}</g>` +
        `<g id="b-c-bal${i}">${ballot(1082, y + 4, 1)}</g>`
      );
    }).join("") +
      `<g id="b-c-dots">${[260, 520, 760, 960].map((x) => [0, 1, 2].map((j) => r.circle(x, 712 + j * 26, 7, pen({ fill: DIM, fillStyle: "solid", stroke: DIM, strokeWidth: 1 }))).join("")).join("")}</g>` +
      `<g id="b-c-brk">${r.rect(160, 184, 870, 154, goldPen({ strokeWidth: 3.4, roughness: 1.1 }))}</g>`,
    ROWS.map((y, i) => L(`b-c-su${i}`, 260, y, 42, "set up", 140) + L(`b-c-d${i}`, 960, y + 4, 72, cDigits[i], 80, G)).join("") +
      L("b-c-shot", 1400, 250, 64, "1 run = 1 shot", 380, G) +
      L("b-c-vote", 1400, 352, 64, "1 shot = 1 vote", 380)
  );

  // =====================================================================
  // Scene D: counts settle on the true odds (lines 8 to 12)
  // =====================================================================
  // Outcomes: seeded, P(0) = 0.75, nudged so the first 10, 100 and 1000 shots hold 6, 71 and 748 zeros.
  const rnd = mulberry32(4242);
  const out = Array.from({ length: 1000 }, () => (rnd() < 0.75 ? 0 : 1));
  out[0] = 0;
  const fix = (a, b, want) => {
    const idx = () => a + Math.floor(rnd() * (b - a));
    let have = out.slice(a, b).filter((v) => v === 0).length;
    while (have !== want) {
      const i = idx();
      if (i === 0) continue;
      if (have > want && out[i] === 0) { out[i] = 1; have--; }
      else if (have < want && out[i] === 1) { out[i] = 0; have++; }
    }
  };
  fix(0, 10, 6); fix(10, 100, 65); fix(100, 1000, 677);
  const CUM = [0];
  out.forEach((v, i) => CUM.push(CUM[i] + (v === 0 ? 1 : 0)));
  if (CUM[10] !== 6 || CUM[100] !== 71 || CUM[1000] !== 748) throw new Error("shot sequence nudge failed");

  const DB = { base: 780, maxH: 460, x0: 380, x1: 600, w: 130 };
  const dTop = (p) => DB.base - DB.maxH * p;
  const CH = { x0: 940, y0: 780, h: 560, w: 760 };
  const cxN = (n) => CH.x0 + (Math.log10(n) / 3) * CH.w;
  const cyF = (f) => CH.y0 - CH.h * f;
  const tracePts = Array.from({ length: 1000 }, (_, i) => [cxN(i + 1), cyF(CUM[i + 1] / (i + 1))]);
  const trace = wobbly(tracePts, 0, 3);
  const early = wobbly(tracePts.slice(0, 30), 0, 3);
  const qd = qubit("b-d-q", 660, 196, 56, 60, { labelSize: 40 });
  const sDl = board(
    "b-d-left",
    qd.svg +
      `<g id="b-d-axes">${r.line(360, DB.base, 760, DB.base, pen({ strokeWidth: 3.2 }))}</g>` +
      bar("b-d-bar0", DB.x0, DB.w, DB.base, DB.maxH) +
      bar("b-d-bar1", DB.x1, DB.w, DB.base, DB.maxH) +
      dash("b-d-t0", 170, f1(dTop(0.75)), 530, f1(dTop(0.75)), GOLD, 3) +
      dash("b-d-t1", 588, f1(dTop(0.25)), 742, f1(dTop(0.25)), DIM, 2.4),
    qd.labels +
      `<div class="lbl hand" id="b-d-count" style="left:160px;top:${f1(165 - 64 * 0.745)}px;width:400px;font-size:64px;text-align:left">shots: <span id="b-d-n">0</span></div>` +
      `<div class="lbl hand" id="b-d-z" style="left:${DB.x0 + DB.w / 2 - 110}px;top:${f1(815 - 44 * 0.745)}px;width:220px;font-size:44px">zeros: <span id="b-d-zn">0</span></div>` +
      `<div class="lbl hand" id="b-d-o" style="left:${DB.x1 + DB.w / 2 - 110}px;top:${f1(815 - 44 * 0.745)}px;width:220px;font-size:44px">ones: <span id="b-d-on">0</span></div>` +
      `<div class="lbl hand" id="b-d-p0" style="left:${DB.x0 + DB.w / 2 - 80}px;top:400px;width:160px;font-size:52px;color:${GOLD}">0%</div>` +
      `<div class="lbl hand" id="b-d-p1" style="left:${DB.x1 + DB.w / 2 - 80}px;top:600px;width:160px;font-size:52px">0%</div>` +
      LR("b-d-truel", 368, dTop(0.75) - 30, 44, "true: 3 in 4", 230, G)
  );
  // Error band: half width sqrt(0.75 x 0.25 / n), clamped to the chart.
  const bandN = Array.from({ length: 41 }, (_, i) => Math.round(10 ** (Math.log10(3) + (i / 40) * (3 - Math.log10(3)))));
  const hw = (n) => 2 * CH.h * Math.sqrt((0.75 * 0.25) / n);
  const clampY = (y) => Math.min(CH.y0 - 2, Math.max(CH.y0 - CH.h + 2, y));
  const bandPts = [...bandN.map((n) => [cxN(n), clampY(cyF(0.75) - hw(n))]), ...bandN.slice().reverse().map((n) => [cxN(n), clampY(cyF(0.75) + hw(n))])];
  const ibar = (n, gold) => {
    const x = cxN(n), y1 = cyF(0.75) - hw(n), y2 = cyF(0.75) + hw(n), p = gold ? goldPen({ strokeWidth: 3.4, roughness: 0.6 }) : pen({ strokeWidth: 3, roughness: 0.6 });
    return r.line(x, y1, x, y2, p) + r.line(x - 12, y1, x + 12, y1, gold ? goldPen({ strokeWidth: 3, roughness: 0.5 }) : pen({ strokeWidth: 2.6, roughness: 0.5 })) + r.line(x - 12, y2, x + 12, y2, gold ? goldPen({ strokeWidth: 3, roughness: 0.5 }) : pen({ strokeWidth: 2.6, roughness: 0.5 }));
  };
  const axHead = (x, y, dx, dy) => r.line(x, y, x - dx * 16 + dy * 10, y - dy * 16 + dx * 10, pen({ strokeWidth: 2.6 })) + r.line(x, y, x - dx * 16 - dy * 10, y - dy * 16 - dx * 10, pen({ strokeWidth: 2.6 }));
  const sDc = board(
    "b-d-chart",
    `<g id="b-d-cax">${r.line(CH.x0 - 16, CH.y0, CH.x0 + CH.w + 50, CH.y0, pen())}${axHead(CH.x0 + CH.w + 50, CH.y0, 1, 0)}` +
      `${r.line(CH.x0, CH.y0 + 16, CH.x0, CH.y0 - CH.h - 40, pen())}${axHead(CH.x0, CH.y0 - CH.h - 40, 0, -1)}` +
      [1, 10, 100, 1000].map((n) => r.line(cxN(n), CH.y0 - 9, cxN(n), CH.y0 + 9, pen({ strokeWidth: 2.4, roughness: 0.5 }))).join("") +
      [0.5, 0.75, 1].map((f) => r.line(CH.x0 - 9, cyF(f), CH.x0 + 9, cyF(f), pen({ strokeWidth: 2.4, roughness: 0.5 }))).join("") +
      `</g>` +
      `<g id="b-d-band" style="opacity:.2">${r.poly(bandPts, pen({ fill: INK, fillStyle: "hachure", hachureGap: 9, fillWeight: 1.6, stroke: INK, strokeWidth: 1.4, roughness: 0.7 }))}</g>` +
      dash("b-d-c75", CH.x0 + 6, cyF(0.75), CH.x0 + CH.w + 20, cyF(0.75), DIM, 2.4) +
      dash("b-d-c75g", CH.x0 + 6, cyF(0.75), CH.x0 + CH.w + 20, cyF(0.75), GOLD, 3.2) +
      `<path id="b-d-trace" d="${trace.d}" pathLength="1" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1 2;stroke-dashoffset:1"/>` +
      `<path id="b-d-early" d="${early.d}" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0"/>` +
      `<circle id="b-d-dot" cx="${CH.x0}" cy="${CH.y0}" r="11" fill="${GOLD}" stroke="${GROUND}" stroke-width="4" style="opacity:0"/>` +
      `<g id="b-d-settle">${r.curve([[1420, 282], [1540, 296], [1640, 318], [1700, 338]], goldPen({ strokeWidth: 3.2 }))}${r.line(1700, 338, 1680, 340, goldPen({ strokeWidth: 3 }))}${r.line(1700, 338, 1688, 322, goldPen({ strokeWidth: 3 }))}</g>` +
      `<g id="b-d-ib100">${ibar(100, false)}</g><g id="b-d-ib400">${ibar(400, true)}</g>` +
      `<g id="b-d-x4">${r.curve([[cxN(100) + 4, cyF(0.75) - hw(100) - 14], [(cxN(100) + cxN(400)) / 2, cyF(0.75) - hw(100) - 64], [cxN(400) - 4, cyF(0.75) - hw(400) - 16]], pen({ strokeWidth: 2.6 }))}${r.line(cxN(400) - 4, cyF(0.75) - hw(400) - 16, cxN(400) - 20, cyF(0.75) - hw(400) - 24, pen({ strokeWidth: 2.4 }))}${r.line(cxN(400) - 4, cyF(0.75) - hw(400) - 16, cxN(400) - 10, cyF(0.75) - hw(400) - 32, pen({ strokeWidth: 2.4 }))}</g>`,
    L("b-d-x1", cxN(1), 818, 40, "1", 60) + L("b-d-x10", cxN(10), 818, 40, "10", 80) + L("b-d-x100", cxN(100), 818, 40, "100", 90) + L("b-d-x1000", cxN(1000), 818, 40, "1000", 110) +
      LR("b-d-y50", 925, cyF(0.5), 40, "50%", 100) + LR("b-d-y75", 925, cyF(0.75), 40, "75%", 100) + LR("b-d-y100", 925, cyF(1), 40, "100%", 110) +
      LL("b-d-ytl", 965, 165, 44, "fraction of zeros", 360) + L("b-d-xtl", 1690, 735, 44, "shots", 140) +
      L("b-d-wob", 1100, 560, 44, "wobbles", 200, G) + L("b-d-setl", 1560, 248, 44, "settles", 180, G) +
      L("b-d-truel2", 1590, 470, 44, "true odds 75%", 300, G) +
      L("b-d-l100", cxN(100), cyF(0.75) + hw(100) + 36, 44, "100", 90) + L("b-d-l400", cxN(400), cyF(0.75) + hw(100) + 36, 44, "400", 90, G) +
      L("b-d-half", cxN(400), cyF(0.75) + hw(100) + 90, 44, "half the wobble", 300, G) +
      L("b-d-x4l", (cxN(100) + cxN(400)) / 2, cyF(0.75) - hw(100) - 92, 44, "×4", 90)
  );

  // =====================================================================
  // Scene E: shot noise (lines 13 to 14)
  // =====================================================================
  const EB = { base: 780, x0: 770, x1: 1070, w: 180 };
  const eY = (c) => 700 - (c - 400) * 3; // axis starts at 400 (the zigzag break shows it)
  const eH = (c) => EB.base - eY(c);
  const qe = qubit("b-e-q", 400, 380, 80, 90, { labelSize: 40 });
  // Axis break: a wavy gap cut across each bar, since the counts start at 400.
  const brk = (x, w) => {
    const wave = (y) => Array.from({ length: 7 }, (_, i) => [x - 10 + (i * (w + 20)) / 6, y + (i % 2 ? -5 : 5)]);
    const top = wave(722), bot = wave(742);
    return `<path d="M${top.map((p) => p.join(" ")).join(" L")} L${bot.slice().reverse().map((p) => p.join(" ")).join(" L")} Z" fill="${GROUND}"/>` +
      r.linear(top, pen({ strokeWidth: 2.4, roughness: 0.5 })) + r.linear(bot, pen({ strokeWidth: 2.4, roughness: 0.5 }));
  };
  const bracket = (x, y1, y2) => goldPen({ strokeWidth: 3.4 }) && r.line(x, y1, x, y2, goldPen({ strokeWidth: 3.6, roughness: 0.5 })) + r.line(x - 10, y1, x + 2, y1, goldPen({ strokeWidth: 3, roughness: 0.4 })) + r.line(x - 10, y2, x + 2, y2, goldPen({ strokeWidth: 3, roughness: 0.4 }));
  const sE = board(
    "b-sE",
    qe.svg +
      `<g id="b-e-axes">${r.line(740, EB.base, 1300, EB.base, pen({ strokeWidth: 3.2 }))}</g>` +
      bar("b-e-bar0", EB.x0, EB.w, EB.base, eH(560)) +
      bar("b-e-bar1", EB.x1, EB.w, EB.base, eH(560)) +
      `<g id="b-e-brk0">${brk(EB.x0, EB.w)}</g><g id="b-e-brk1">${brk(EB.x1, EB.w)}</g>` +
      dash("b-e-500", 760, eY(500), 1290, eY(500), DIM, 2.6) +
      `<g id="b-e-check">${r.linear([[1500, 252], [1530, 286], [1606, 196]], pen({ strokeWidth: 5, roughness: 0.9 }))}</g>` +
      `<g id="b-e-br0">${bracket(966, eY(512), eY(500))}</g><g id="b-e-br1">${bracket(1266, eY(500), eY(488))}</g>` +
      `<g id="b-e-bal">${ballot(1690, 476, 1.4)}</g>`,
    qe.labels + L("b-e-5050", 400, 548, 56, "50/50", 160) +
      LR("b-e-500l", 752, eY(500), 44, "500", 100) +
      L("b-e-zl", 860, 815, 44, "zeros", 160) + L("b-e-ol", 1160, 815, 44, "ones", 160) +
      L("b-e-512", 860, 306, 56, "512", 120) + L("b-e-488", 1160, 306, 56, "488", 120) +
      L("b-e-fine", 1560, 352, 56, "circuit is fine", 340) +
      LL("b-e-noise", 1296, 476, 64, "shot noise", 330, G)
  );

  // =====================================================================
  // Scene F: where the poll breaks (lines 15 to 17)
  // =====================================================================
  const crack = [[960, 240], [946, 300], [972, 352], [950, 420], [968, 488], [944, 560], [970, 630], [952, 700], [966, 760], [956, 820]];
  const dashedEllipse = (cx, cy, w, h, n) =>
    Array.from({ length: n }, (_, i) => r.arc(cx, cy, w, h, (i / n) * Math.PI * 2, ((i + 0.55) / n) * Math.PI * 2, false, pen({ strokeWidth: 2.6, roughness: 0.6 }))).join("");
  const qf = qubit("b-f-q", 1230, 600, 100, 60);
  const sFl = board(
    "b-f-left",
    `<g id="b-f-crack">${r.linear(crack, pen({ strokeWidth: 3.4, roughness: 1 }))}</g>` +
      `<g id="b-f-voter">${stick(440, 560, 1.3)}</g>` +
      `<g id="b-f-think">${r.circle(470, 500, 14, pen({ strokeWidth: 2.4 }))}${r.circle(500, 466, 22, pen({ strokeWidth: 2.4 }))}${r.ellipse(600, 360, 250, 150, pen({ strokeWidth: 3 }))}</g>` +
      `<g id="b-f-say">${r.path(rrPath(160, 300, 190, 104, 26), pen({ strokeWidth: 3 }))}${r.linear([[300, 404], [338, 446], [262, 404]], pen({ strokeWidth: 3 }))}</g>`,
    L("b-f-B", 600, 364, 80, "B", 100) + L("b-f-who", 255, 354, 56, "who?", 160)
  );
  const sFr = board(
    "b-f-right",
    qf.svg +
      `<g id="b-f-arm">${arrow(1342, 600, 1442, 600, { strokeWidth: 3 })}</g>` +
      meter("b-f-m", 1525, 600, 150, 110, [T.measuring16 + 0.25]),
    qf.labels + L("b-f-used", 1230, 806, 48, "used", 140)
  );
  const sFcard = board("b-f-card", card(1690, 600, 100, 125, goldPen({ strokeWidth: 3.8, roughness: 1 })), L("b-f-c0", 1690, 606, 80, "0", 90, G));
  const sFb = board(
    "b-f-bub",
    `<g id="b-f-empty">${r.circle(1322, 470, 14, pen({ strokeWidth: 2.2 }))}${r.circle(1344, 434, 20, pen({ strokeWidth: 2.2 }))}${dashedEllipse(1400, 320, 280, 150, 16)}</g>`,
    L("b-f-noans", 1400, 322, 44, "no answer yet", 240)
  );
  const qfresh = qubit("b-f-fq", 680, 600, 100, 60, { gold: true });
  const sFf = board(
    "b-f-fresh",
    `<g id="b-f-fsetup">${r.rect(220, 552, 170, 96, pen({ roughness: 1 }))}${arrow(400, 600, 566, 600, { strokeWidth: 3 })}</g>`,
    L("b-f-fsul", 305, 600, 44, "set up", 150) + L("b-f-freshl", 560, 806, 56, "fresh qubit for every shot", 640, G)
  );
  const sFq = board("b-f-fq", qfresh.svg, qfresh.labels);

  // =====================================================================
  // Scene G: takeaway (line 18)
  // =====================================================================
  const GB = { base: 780, maxH: 400, x0: 1080, x1: 1400, w: 160 };
  const gTop = (p) => GB.base - GB.maxH * p;
  const sG = board(
    "b-sG",
    `<g id="b-g-bal">${ballot(330, 470, 2)}</g>` +
      `<g id="b-g-card">${card(560, 470, 110, 140, pen({ strokeWidth: 3.2, roughness: 1 }))}</g>` +
      `<g id="b-g-axes">${r.line(1020, GB.base, 1620, GB.base, pen({ strokeWidth: 3.2 }))}</g>` +
      bar("b-g-bar0", GB.x0, GB.w, GB.base, GB.maxH) +
      bar("b-g-bar1", GB.x1, GB.w, GB.base, GB.maxH) +
      dash("b-g-t0", 1060, f1(gTop(0.75)), 1260, f1(gTop(0.75)), DIM, 2.6) +
      dash("b-g-t1", 1380, f1(gTop(0.25)), 1580, f1(gTop(0.25)), DIM, 2.6) +
      `<g id="b-g-und">${r.curve([[980, 300], [1200, 292], [1440, 298], [1680, 288]], goldPen({ strokeWidth: 4.4, roughness: 1 }))}</g>`,
    L("b-g-c0", 560, 476, 88, "0", 100) +
      L("b-g-vote", 445, 640, 64, "1 shot = 1 vote", 420) +
      L("b-g-n0", GB.x0 + GB.w / 2, gTop(0.748) - 40, 48, "748", 120) +
      L("b-g-n1", GB.x1 + GB.w / 2, gTop(0.252) - 40, 48, "252", 120) +
      L("b-g-zl", GB.x0 + GB.w / 2, 815, 44, "zeros", 160) + L("b-g-ol", GB.x1 + GB.w / 2, 815, 44, "ones", 160) +
      L("b-g-take", 1330, 240, 72, "many shots reveal the odds", 760, G)
  );

  const html = [aFriend, aRow, aCard, aWhat, aGhost, aTwo, sB, bPaper, bRes, sC, sDl, sDc, sE, sFl, sFr, sFcard, sFb, sFf, sFq, sG].join("\n");

  // ---------- timeline ----------
  const script = `
    const NEEDLES = ${JSON.stringify(NEEDLES)};
    const CUM = ${JSON.stringify(CUM)};
    const TRACE_FRAC = ${JSON.stringify(trace.frac)};
    const T = ${JSON.stringify(T)};
    const mv = (sel, to, start, dur = 0.8, e = "power2.inOut") => tl.to(all(sel), { ...to, duration: dur, ease: e }, start);
    const setBar = (id, base, h) => {
      const cr = $(id + "-cr");
      cr.setAttribute("y", (base - h).toFixed(2));
      cr.setAttribute("height", (h > 0.5 ? h + 6 : 0).toFixed(2));
      const cap = $(id + "-cap");
      cap.setAttribute("transform", "translate(0 " + (-h).toFixed(2) + ")");
      cap.style.opacity = h > 0.5 ? "1" : "0";
    };

    // ===== Scene A =====
    hide(["#b-a-cover", "#b-a-card", "#b-a-qa-l0", "#b-a-qa-l1"]);
    draw("#b-a-fig", ${t(T.friend)}, 0.8);
    write("#b-a-friendl", ${t(T.friend + 0.5)}, 0.4);
    draw("#b-a-setup", ${t(T.sets)}, 0.5);
    write("#b-a-setupl", ${t(T.sets + 0.3)}, 0.35);
    draw("#b-a-ar1", ${t(T.sets + 0.35)}, 0.3);
    draw(["#b-a-q-c", "#b-a-q-a"], ${t(T.qubit0)}, 1.2);
    write("#b-a-q-l0", ${t(T.zero0 - 0.1)}, 0.2);
    write("#b-a-q-l1", ${t(T.one0 - 0.05)}, 0.2);
    tl.fromTo("#b-a-cover", { opacity: 0, y: -90, rotation: -5 }, { opacity: 1, y: 0, rotation: 0, duration: 0.55, ease: "power2.out" }, ${t(T.can)});
    tl.set("#b-a-cover", { transformOrigin: "${QA.x}px ${QA.y}px" }, 0);
    blurOut("#b-title", ${t(T.l1)});
    draw("#b-a-ar2", ${t(T.measure)}, 0.3);
    draw(["#b-a-m", "#b-a-m-n"], ${t(T.measure + 0.2)}, 0.8);
    tl.set("#b-a-card", { transformOrigin: "1450px 560px" }, 0);
    tl.fromTo("#b-a-card", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, ${t(T.zero1)});
    write("#b-a-q2", ${t(T.what)}, 0.2);
    write("#b-a-what", ${t(T.what + 0.15)}, 0.9);
    // line 2: one look, one bit
    blurOut(["#b-a-friend", "#b-a-q2", "#b-a-what"], ${t(T.nothing)});
    mv("#b-a-row", { x: -250, scale: 0.85 }, ${t(T.nothing + 0.1)}, 0.9);
    mv("#b-a-card", { x: -323.5, y: -3, scale: 0.85 }, ${t(T.nothing + 0.1)}, 0.9);
    write("#b-a-bit", ${t(T.bit)}, 0.8);
    draw("#b-a-g0", ${t(T.zero2)}, 0.35); write("#b-a-g0l", ${t(T.zero2 + 0.1)}, 0.2);
    draw("#b-a-g1", ${t(T.one2)}, 0.35); write("#b-a-g1l", ${t(T.one2 + 0.1)}, 0.2);
    // line 3: the same zero, two very different qubits
    blurOut(["#b-a-row", "#b-a-ghosts"], ${t(T.that3)});
    mv("#b-a-card", { x: -150, y: 0, scale: 1 }, ${t(T.that3 + 0.1)}, 0.8);
    draw(["#b-a-qa-c", "#b-a-qa-a"], ${t(T.nearly)}, 0.9);
    fade(["#b-a-qa-l0", "#b-a-qa-l1"], 1, ${t(T.nearly + 0.5)}, 0.3);
    write("#b-a-nl", ${t(T.nearly + 0.4)}, 0.8);
    draw("#b-a-arA", ${t(T.nearly + 1.0)}, 0.5);
    draw(["#b-a-qb-c", "#b-a-qb-a"], ${t(T.rarely)}, 0.8);
    write(["#b-a-qb-l0", "#b-a-qb-l1"], ${t(T.rarely + 0.4)}, 0.2);
    write("#b-a-rl", ${t(T.rarely + 0.3)}, 0.5);
    draw("#b-a-arB", ${t(T.rarely + 0.7)}, 0.45);

    // ===== Scene B =====
    blurOut(["#b-a-two", "#b-a-card"], ${t(T.its)});
    draw("#b-b-box", ${t(T.opinion)}, 1.0);
    write("#b-b-polll", ${t(T.poll4)}, 0.35);
    draw("#b-b-voter", ${t(T.voter4)}, 0.7);
    write("#b-b-voterl", ${t(T.voter4 + 0.5)}, 0.4);
    hide("#b-b-paper");
    fade("#b-b-paper", 1, ${t(T.voter4 + 0.6)}, 0.15);
    tl.fromTo("#b-b-paper", { x: 0, y: 0 }, { x: 292, y: -46, duration: 0.55, ease: "power2.inOut" }, ${t(T.voter4 + 0.8)});
    mv("#b-b-paper", { y: -8, opacity: 0 }, ${t(T.voter4 + 1.35)}, 0.3, "power2.in");
    draw("#b-b-board", ${t(T.who - 0.2)}, 0.8);
    write("#b-b-winner", ${t(T.who)}, 0.5);
    write(["#b-b-al", "#b-b-bl"], ${t(T.who + 0.5)}, 0.2);
    // line 5: a thousand voters
    blurOut(["#b-b-voter", "#b-b-voterl"], ${t(T.thousand5 - 0.25)});
    for (let c = 11; c >= 0; c--) draw("#b-b-col" + c, ${t(T.thousand5)} + (11 - c) * 0.08, 0.35);
    write("#b-b-crowdl", ${t(T.thousand5 + 0.3)}, 0.7);
    tl.fromTo("#b-b-res", { opacity: 0, scaleY: 0.15, filter: "blur(12px)" }, { opacity: 1, scaleY: 1, filter: "blur(9px)", duration: 0.8, ease: "power2.out" }, ${t(T.pct)});
    tl.set("#b-b-res", { transformOrigin: "1480px ${bBase}px" }, 0);
    tl.to("#b-b-res", { filter: "blur(0px)", duration: 0.8, ease: "power2.inOut" }, ${t(T.focus)});

    // ===== Scene C =====
    blurOut(["#b-sB", "#b-b-res"], ${t(T.quantum)});
    ${ROWS.map((_, i) => {
      const s = i === 0 ? T.set6 : i === 1 ? T.again1 : T.again2;
      const d = i === 0 ? 1 : 0.55;
      return `draw("#b-c-row${i}", ${t(s)}, ${(d * 0.3).toFixed(2)}); write("#b-c-su${i}", ${t(s + 0.05)}, 0.25);
    draw(["#b-c-q${i}-c", "#b-c-q${i}-a"], ${t(s + d * 0.3)}, ${(d * 0.3).toFixed(2)});
    draw(["#b-c-rowb${i}", "#b-c-m${i}", "#b-c-m${i}-n", "#b-c-rowc${i}"], ${t(s + d * 0.6)}, ${(d * 0.45).toFixed(2)});`;
    }).join("\n    ")}
    ${cCardT.map((s, i) => `write("#b-c-d${i}", ${t(s)}, 0.18); tl.to("#b-c-d${i}", { color: "${INK}", duration: 0.3 }, ${t(s + 0.6)});`).join("\n    ")}
    hide("#b-c-dots");
    fade("#b-c-dots", 1, ${t(T.measuring + 0.9)}, 0.5);
    draw("#b-c-brk", ${t(T.run7 - 0.1)}, 0.8);
    write("#b-c-shot", ${t(T.shot7)}, 0.75);
    ${[0, 1, 2].map((i) => `draw("#b-c-bal${i}", ${t(T.vote7 - 0.6 + i * 0.15)}, 0.4);`).join(" ")}
    write("#b-c-vote", ${t(T.vote7)}, 0.75);

    // ===== Scene D =====
    blurOut("#b-sC", ${t(T.say)});
    hide(["#b-d-t0", "#b-d-t1", "#b-d-c75", "#b-d-c75g", "#b-d-p0", "#b-d-p1", "#b-d-count"]);
    draw(["#b-d-q-c", "#b-d-q-a"], ${t(T.say + 0.1)}, 0.8);
    write(["#b-d-q-l0", "#b-d-q-l1"], ${t(T.say + 0.6)}, 0.2);
    draw("#b-d-axes", ${t(T.zero8)}, 0.5);
    write(["#b-d-z", "#b-d-o"], ${t(T.zero8 + 0.3)}, 0.5);
    fade("#b-d-count", 1, ${t(T.zero8)}, 0.01); write("#b-d-count", ${t(T.zero8)}, 0.5);
    tl.fromTo("#b-d-t0", { opacity: 1, attr: { x2: 170 } }, { opacity: 1, attr: { x2: 530 }, duration: 0.6, ease: "power2.inOut" }, ${t(T.three)});
    write("#b-d-truel", ${t(T.three + 0.4)}, 0.7);
    fade("#b-d-t1", 1, ${t(T.three + 0.5)}, 0.4);
    draw("#b-d-cax", ${t(T.times8 - 0.1)}, 1.0);
    write(["#b-d-x1", "#b-d-x10", "#b-d-x100", "#b-d-x1000"], ${t(T.times8 + 0.5)}, 0.3);
    write(["#b-d-y50", "#b-d-y75", "#b-d-y100"], ${t(T.times8 + 0.6)}, 0.3);
    write("#b-d-ytl", ${t(T.times8 + 0.3)}, 0.8);
    write("#b-d-xtl", ${t(T.times8 + 0.8)}, 0.35);
    fade("#b-d-c75", 1, ${t(T.times8 + 0.6)}, 0.4);
    fade("#b-d-p0", 1, ${t(T.sixty)}, 0.01); write("#b-d-p0", ${t(T.sixty)}, 0.4);
    fade("#b-d-p1", 1, ${t(T.sixty + 0.3)}, 0.01); write("#b-d-p1", ${t(T.sixty + 0.3)}, 0.4);
    // line 11: the fraction wobbles, then settles
    fade("#b-d-left", 0.35, ${t(T.l11)}, 0.4);
    tl.fromTo("#b-d-early", { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${t(T.wobbles)});
    fade("#b-d-early", 0, ${t(T.settles - 0.2)}, 0.4);
    write("#b-d-wob", ${t(T.wobbles + 0.1)}, 0.45);
    draw("#b-d-settle", ${t(T.settles)}, 0.7);
    write("#b-d-setl", ${t(T.settles + 0.3)}, 0.45);
    fade("#b-d-c75g", 1, ${t(T.trueT)}, 0.35);
    tl.to("#b-d-y75", { color: "${GOLD}", duration: 0.3 }, ${t(T.trueT)});
    write("#b-d-truel2", ${t(T.trueT + 0.1)}, 0.7);
    // line 12: four times the shots halves the wobble
    fade(["#b-d-wob", "#b-d-setl", "#b-d-settle", "#b-d-truel2"], 0, ${t(T.l12 - 0.1)}, 0.3);
    draw("#b-d-band", ${t(T.halve)}, 0.9);
    draw("#b-d-ib100", ${t(T.wobble12)}, 0.4);
    write("#b-d-l100", ${t(T.wobble12 + 0.3)}, 0.3);
    draw("#b-d-ib400", ${t(T.four)}, 0.4);
    draw("#b-d-x4", ${t(T.four + 0.1)}, 0.5);
    write("#b-d-x4l", ${t(T.four + 0.45)}, 0.25);
    write("#b-d-l400", ${t(T.four + 0.2)}, 0.3);
    write("#b-d-half", ${t(T.four + 0.4)}, 0.7);

    // ===== Scene E =====
    blurOut(["#b-d-left", "#b-d-chart"], ${t(T.so)});
    hide(["#b-e-500"]);
    draw(["#b-e-q-c", "#b-e-q-a"], ${t(T.fifty)}, 0.8);
    write(["#b-e-q-l0", "#b-e-q-l1"], ${t(T.fifty + 0.5)}, 0.2);
    write("#b-e-5050", ${t(T.fifty + 0.2)}, 0.5);
    draw("#b-e-axes", ${t(T.fifty + 0.4)}, 0.7);
    write(["#b-e-zl", "#b-e-ol"], ${t(T.fifty + 0.8)}, 0.4);
    fade("#b-e-500", 1, ${t(T.fifty + 0.9)}, 0.4);
    write("#b-e-500l", ${t(T.fifty + 1.0)}, 0.3);
    write("#b-e-512", ${t(T.twelve + 0.6)}, 0.35);
    draw("#b-e-brk0", ${t(T.twelve + 0.25)}, 0.3);
    draw("#b-e-brk1", ${t(T.eighty + 0.25)}, 0.3);
    write("#b-e-488", ${t(T.eighty + 0.6)}, 0.35);
    draw("#b-e-check", ${t(T.relax)}, 0.6);
    write("#b-e-fine", ${t(T.broken)}, 0.8);
    draw("#b-e-br0", ${t(T.gap)}, 0.35);
    draw("#b-e-br1", ${t(T.gap + 0.25)}, 0.35);
    write("#b-e-noise", ${t(T.shot14)}, 0.6);
    draw("#b-e-bal", ${t(T.poll14)}, 0.5);
    fade(["#b-e-q-c", "#b-e-q-a", "#b-e-q-l0", "#b-e-q-l1", "#b-e-5050"], 0.25, ${t(T.poll14)}, 0.5);

    // ===== Scene F =====
    blurOut("#b-sE", ${t(T.heres)});
    draw("#b-f-crack", ${t(T.breaks)}, 0.6);
    draw("#b-f-voter", ${t(T.voter15)}, 0.8);
    draw("#b-f-think", ${t(T.opinion15)}, 0.6);
    write("#b-f-B", ${t(T.opinion15 + 0.5)}, 0.25);
    draw("#b-f-say", ${t(T.asked - 0.2)}, 0.45);
    write("#b-f-who", ${t(T.asked + 0.1)}, 0.35);
    tl.to("#b-f-B", { color: "${GOLD}", duration: 0.3 }, ${t(T.asked + 0.35)});
    draw(["#b-f-q-c", "#b-f-q-a"], ${t(T.qubit16)}, 0.8);
    write(["#b-f-q-l0", "#b-f-q-l1"], ${t(T.qubit16 + 0.5)}, 0.2);
    draw("#b-f-empty", ${t(T.no16)}, 0.6);
    write("#b-f-noans", ${t(T.no16 + 0.4)}, 0.7);
    draw("#b-f-arm", ${t(T.measuring16)}, 0.25);
    draw(["#b-f-m", "#b-f-m-n"], ${t(T.measuring16 + 0.1)}, 0.45);
    hide("#b-f-card");
    tl.set("#b-f-card", { transformOrigin: "1690px 600px" }, 0);
    tl.fromTo("#b-f-card", { opacity: 0, scale: 0.6, x: -60 }, { opacity: 1, scale: 1, x: 0, duration: 0.45, ease: "back.out(1.8)" }, ${t(T.creates)});
    blurOut("#b-f-bub", ${t(T.creates + 0.5)});
    tl.to("#b-f-q-l0", { color: "${GOLD}", duration: 0.3 }, ${t(T.sitting + 0.7)});
    // line 17: every vote needs a fresh qubit
    blurOut("#b-f-left", ${t(T.thats)});
    fade(["#b-f-right", "#b-f-card"], 0.35, ${t(T.thats + 0.3)}, 0.4);
    write("#b-f-used", ${t(T.thats + 0.5)}, 0.4);
    draw("#b-f-fsetup", ${t(T.freshly - 0.3)}, 0.6);
    write("#b-f-fsul", ${t(T.freshly - 0.1)}, 0.3);
    tl.set("#b-f-fq", { transformOrigin: "680px 600px" }, 0);
    tl.fromTo("#b-f-fq", { opacity: 0, x: -360, scale: 0.35 }, { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "power2.out" }, ${t(T.freshly + 0.1)});
    write("#b-f-freshl", ${t(T.freshly + 0.5)}, 0.9);

    // ===== Scene G =====
    blurOut(["#b-f-right", "#b-f-card", "#b-f-fresh", "#b-f-fq"], ${t(T.one18)});
    draw("#b-g-bal", ${t(T.one18 + 0.1)}, 0.6);
    draw("#b-g-card", ${t(T.one18 + 0.4)}, 0.5);
    write("#b-g-c0", ${t(T.one18 + 0.75)}, 0.2);
    write("#b-g-vote", ${t(T.vote18 - 0.4)}, 0.75);
    draw("#b-g-axes", ${t(T.many - 0.1)}, 0.4);
    write(["#b-g-zl", "#b-g-ol"], ${t(T.many)}, 0.3);
    hide(["#b-g-t0", "#b-g-t1"]);
    fade(["#b-g-t0", "#b-g-t1"], 1, ${t(T.many + 0.4)}, 0.4);
    write("#b-g-n0", ${t(T.many + 0.9)}, 0.25);
    write("#b-g-n1", ${t(T.many + 1.0)}, 0.25);
    write("#b-g-take", ${t(T.reveal)}, 1.0);
    draw("#b-g-und", ${t(T.reveal + 0.9)}, 0.6);

    // ===== Continuous values =====
    const qArrow = (id, cx, cy, a) => $(id).setAttribute("transform", "rotate(" + a.toFixed(2) + " " + cx + " " + cy + ")");
    const NSEG = [[T.ten, T.ten + 1.3, 0, 10], [T.hundred, T.hundred + 1.35, 10, 100], [T.thousand10, T.thousand10 + 1.35, 100, 1000]];
    onFrame((t) => {
      NEEDLES.forEach((nd) => $(nd.id).setAttribute("transform", "rotate(" + sched(nd.segs, t, -50).toFixed(2) + " " + nd.px + " " + nd.py + ")"));
      // Scene D: shots, bars and the trace follow one counter.
      const N = sched(NSEG, t, 0);
      const n = Math.floor(N + 1e-6);
      $("b-d-n").textContent = String(n);
      $("b-d-zn").textContent = String(CUM[n]);
      $("b-d-on").textContent = String(n - CUM[n]);
      const f0 = n ? CUM[n] / n : 0;
      setBar("b-d-bar0", ${DB.base}, n ? ${DB.maxH} * f0 : 0);
      setBar("b-d-bar1", ${DB.base}, n ? ${DB.maxH} * (1 - f0) : 0);
      const p0 = n === 1000 ? "74.8%" : Math.round(f0 * 100) + "%";
      const p1 = n === 1000 ? "25.2%" : Math.round((1 - f0) * 100) + "%";
      $("b-d-p0").textContent = p0; $("b-d-p1").textContent = p1;
      $("b-d-p0").style.top = (Math.min(${DB.base} - ${DB.maxH} * f0, ${f1(dTop(0.75))}) - 92).toFixed(1) + "px";
      $("b-d-p1").style.top = (${DB.base} - ${DB.maxH} * (1 - f0) - 100).toFixed(1) + "px";
      const tr = $("b-d-trace"), dot = $("b-d-dot");
      if (N < 1) { tr.style.opacity = "0"; dot.style.opacity = "0"; }
      else {
        const i = Math.min(998, Math.floor(N - 1)), u = Math.min(1, N - 1 - i);
        const fr = TRACE_FRAC[i] + (TRACE_FRAC[i + 1] - TRACE_FRAC[i]) * u;
        tr.style.opacity = "1"; tr.style.strokeDashoffset = String(1 - fr);
        const pt = tr.getPointAtLength(tr.getTotalLength() * fr);
        dot.setAttribute("cx", pt.x.toFixed(2)); dot.setAttribute("cy", pt.y.toFixed(2));
        dot.style.opacity = t < T.l11 ? "1" : String(Math.max(0, 1 - (t - T.l11) / 0.4));
      }
      // Scene E: 512 and 488 against 500
      setBar("b-e-bar0", ${EB.base}, sched([[T.twelve, T.twelve + 0.7, 0, ${eH(512)}]], t, 0));
      setBar("b-e-bar1", ${EB.base}, sched([[T.eighty, T.eighty + 0.7, 0, ${eH(488)}]], t, 0));
      // Scene F: measuring leaves the arrow on the answer it gave
      qArrow("b-f-q-a", 1230, 600, sched([[T.sitting, T.sitting + 0.8, 60, 0]], t, 60));
      // Scene G: the counts grow, then settle with a small damped wobble in the hold
      const g = sched([[T.many, T.many + 0.9, 0, 1]], t, 0);
      const te = ${t(cue(18, "odds"))};
      const wob = t > te ? 0.012 * Math.exp(-(t - te) * 1.1) * Math.sin((t - te) * 9) : 0;
      setBar("b-g-bar0", ${GB.base}, ${GB.maxH} * 0.748 * g * (1 + wob));
      setBar("b-g-bar1", ${GB.base}, ${GB.maxH} * 0.252 * g * (1 - wob));
    });
  `;
  return { html, script, css: "" };
}
