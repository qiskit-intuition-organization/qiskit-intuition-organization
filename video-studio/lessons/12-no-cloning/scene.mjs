// Lesson 12, "Why you can't copy a qubit". Follows plan.md: a qubit and an empty space (can we copy
// it?) -> the CNOT circuit copying 0 and 1 -> the black-and-white photocopier and the grey page it
// binds instead of copying -> CNOT fed the plus state, with live outcome bars (true copies would
// give four even bars, the real answer is 00 and 11 only) -> two linked globes with no arrow ->
// the no-cloning theorem -> why: many copies would reveal the arrow, one qubit gives one bit ->
// where the copier breaks -> repeat a known recipe -> closing circuit and takeaway.
export const phrases = [
  ["zero zero", "00"],
  ["one one", "11"],
  ["plus state", "|+⟩ state"],
  ["no cloning", "no-cloning"],
  ["C NOT's", "CNOT's"],
];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, INK, GOLD, GROUND, DIM } = k;
  const fx = (n) => +(+n).toFixed(2);
  const ctr = (size) => size * 0.745; // label top offset that centres its text on a y
  // A label centred on (cx, cy) in board coordinates.
  const L = (id, cx, cy, w, size, html, extra = "") => lbl(id, fx(cx - w / 2), fx(cy - ctr(size)), w, size, html, extra);
  // A left-aligned label starting at x, centred on cy.
  const LL = (id, x, cy, w, size, html, extra = "") => lbl(id, fx(x), fx(cy - ctr(size)), w, size, html, "text-align:left;" + extra);
  // A full-board layer: svg and labels share board coordinates, so the layer moves as a whole.
  const layer = (id, svg, inner = "", extra = "") =>
    `<div id="${id}" class="obj" style="left:0;top:0;width:1920px;height:1080px;${extra}">` +
    `<svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${inner}</div>`;
  // A small div whose svg uses board coordinates (viewBox at x,y).
  const box = (id, x, y, w, h, svg, inner = "", extra = "") =>
    `<div id="${id}" class="obj" style="left:${fx(x)}px;top:${fx(y)}px;width:${fx(w)}px;height:${fx(h)}px;${extra}">` +
    `<svg class="sk" width="${fx(w)}" height="${fx(h)}" viewBox="${fx(x)} ${fx(y)} ${fx(w)} ${fx(h)}">${svg}</svg>${inner}</div>`;

  // ---------- drawing helpers ----------
  function dashed(pts, dash, gap, o) {
    let out = "", on = true, left = dash, cur = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const len = Math.hypot(x1 - x0, y1 - y0) || 1e-6, ux = (x1 - x0) / len, uy = (y1 - y0) / len;
      let pos = 0;
      while (len - pos > left) {
        pos += left;
        const p = [x0 + ux * pos, y0 + uy * pos];
        if (on) { cur.push(p); out += r.linear(cur, pen({ roughness: 0.5, disableMultiStroke: true, ...o })); }
        on = !on; cur = [p]; left = on ? dash : gap;
      }
      left -= len - pos;
      cur.push([x1, y1]);
    }
    if (on && cur.length > 1) out += r.linear(cur, pen({ roughness: 0.5, disableMultiStroke: true, ...o }));
    return out;
  }
  const ellPts = (cx, cy, rx, ry, n = 64) => Array.from({ length: n + 1 }, (_, i) => [cx + rx * Math.cos((2 * Math.PI * i) / n), cy + ry * Math.sin((2 * Math.PI * i) / n)]);
  const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  const dot = (x, y, d, o = {}) => r.circle(x, y, d, pen({ fill: INK, fillStyle: "solid", strokeWidth: 1.4, ...o }));
  const tick = (x, y, s, o = {}) => r.linear([[x, y], [x + s * 0.35, y + s * 0.4], [x + s, y - s * 0.5]], pen({ strokeWidth: 4, roughness: 0.8, ...o }));
  const cross = (x, y, s, o = {}) => r.line(x - s, y - s, x + s, y + s, goldPen({ strokeWidth: 6, ...o })) + r.line(x + s, y - s, x - s, y + s, goldPen({ strokeWidth: 6, ...o }));
  const rrect = (x, y, w, h, c = 12) =>
    `M${x + c} ${y} L${x + w - c} ${y} Q${x + w} ${y} ${x + w} ${y + c} L${x + w} ${y + h - c} Q${x + w} ${y + h} ${x + w - c} ${y + h} L${x + c} ${y + h} Q${x} ${y + h} ${x} ${y + h - c} L${x} ${y + c} Q${x} ${y} ${x + c} ${y} Z`;
  // The state arrow of a globe, drawn pointing straight up; onFrame turns it about the centre.
  const stateArrow = (cx, cy, len, seed, sw = 5) =>
    arrow(cx, cy, cx, cy - len, { stroke: GOLD, strokeWidth: sw, roughness: 0.8, seed }, Math.max(14, len * 0.22)) +
    r.circle(cx, cy, Math.max(12, len * 0.14), goldPen({ fill: GOLD, fillStyle: "solid", strokeWidth: 1.5, seed: seed + 1 }));
  const ARROWS = []; // { id, cx, cy, segs, wob, ph }
  // A mini globe: circle, dashed equator, pole dots, and optionally a gold state arrow.
  function globe(id, cx, cy, R, seed, o = {}) {
    const body = o.dashed
      ? dashed(ellPts(cx, cy, R, R, 72), 14, 11, { strokeWidth: 2.6, seed })
      : r.circle(cx, cy, 2 * R, pen({ strokeWidth: o.sw ?? 3.2, seed }));
    const eq = dashed(ellPts(cx, cy, R, R * 0.26, 56), 10, 9, { strokeWidth: 2, stroke: "rgba(232,232,232,0.6)", seed: seed + 1 });
    const poles = o.dashed ? "" : [cy - R, cy + R].map((y, i) => dot(cx, y, Math.max(10, R * 0.11), { seed: seed + 2 + i })).join("");
    let s = `<g id="${id}">${body}${poles}</g><g id="${id}-eq">${eq}</g>`;
    if (o.arrow != null) {
      s += `<g id="${id}-arr">${stateArrow(cx, cy, R * 0.86, seed + 5, R > 100 ? 5.5 : 4.5)}</g>`;
      ARROWS.push({ id: `${id}-arr`, cx, cy, segs: o.arrow.segs ?? [], init: o.arrow.init ?? 0, wob: o.arrow.wob ?? 3, ph: (seed % 7) * 0.9 });
    }
    return s;
  }
  // A hachured cloth thrown over a globe (the arrow is hidden under it).
  const cloth = (cx, cy, R, seed) =>
    r.path(`M${cx - R * 0.95} ${cy + R * 0.15} C${cx - R * 0.8} ${cy - R * 0.75} ${cx - R * 0.3} ${cy - R * 1.02} ${cx + R * 0.05} ${cy - R * 0.98} C${cx + R * 0.6} ${cy - R * 0.92} ${cx + R * 0.9} ${cy - R * 0.4} ${cx + R * 0.95} ${cy + R * 0.2} C${cx + R * 0.7} ${cy + R * 0.45} ${cx + R * 0.45} ${cy + R * 0.25} ${cx + R * 0.15} ${cy + R * 0.5} C${cx - R * 0.2} ${cy + R * 0.3} ${cx - R * 0.6} ${cy + R * 0.5} ${cx - R * 0.95} ${cy + R * 0.15} Z`,
      pen({ fill: "rgba(232,232,232,0.5)", fillStyle: "hachure", hachureGap: 8, fillWeight: 2, strokeWidth: 2.8, seed }));
  // Pages: 150 x 200, centred on (cx, cy). kind: white, black, grey, plain.
  function pageSvg(kind, cx, cy, seed, o = {}) {
    const w = o.w ?? 150, h = o.h ?? 200, x = cx - w / 2, y = cy - h / 2;
    const fills = {
      white: { fill: INK, fillStyle: "solid", stroke: "#9aa0a6", strokeWidth: 2.6 },
      black: { fill: "#0b0c0e", fillStyle: "solid", stroke: INK, strokeWidth: 2.8 },
      grey: { fill: "#8b8d90", fillStyle: "hachure", hachureGap: 6, fillWeight: 2.4, stroke: o.gold ? GOLD : INK, strokeWidth: o.gold ? 3.6 : 2.8 },
      plain: { stroke: INK, strokeWidth: 2.8 },
    }[kind];
    const lineCol = kind === "white" ? "#8a8d91" : kind === "black" ? "rgba(232,232,232,0.4)" : "rgba(232,232,232,0.55)";
    const txt = [0.28, 0.42, 0.56, 0.7].map((f, i) =>
      r.line(x + w * 0.18, y + h * f, x + w * (i === 3 ? 0.58 : 0.82), y + h * f, pen({ stroke: lineCol, strokeWidth: 2.2, roughness: 0.9, seed: seed + 3 + i }))).join("");
    return r.path(rrect(x, y, w, h), pen({ roughness: 1, seed, ...fills })) + txt;
  }
  // A page in its own little div (so it can move), drawn in board coordinates.
  const pageDiv = (id, kind, cx, cy, seed, o = {}) => {
    const w = (o.w ?? 150) + 24, h = (o.h ?? 200) + 24;
    return box(id, cx - w / 2, cy - h / 2, w, h, `<g id="${id}-g">${pageSvg(kind, cx, cy, seed, o)}</g>`, "", o.extra ?? "");
  };
  // Eyes: open (almond, iris, moving pupil) and closed (a lid with lashes).
  const eyeOpen = (id, cx, cy, seed) =>
    `<g id="${id}">${r.curve([[cx - 90, cy], [cx - 40, cy - 46], [cx + 40, cy - 46], [cx + 90, cy]], pen({ strokeWidth: 3.2, seed }))}` +
    `${r.curve([[cx - 90, cy], [cx - 40, cy + 40], [cx + 40, cy + 40], [cx + 90, cy]], pen({ strokeWidth: 3.2, seed: seed + 1 }))}` +
    `${r.circle(cx, cy, 64, pen({ strokeWidth: 2.6, seed: seed + 2 }))}` +
    [-60, -30, 0, 30, 60].map((dx, i) => r.line(cx + dx, cy - 42 + Math.abs(dx) * 0.25, cx + dx * 1.15, cy - 62 + Math.abs(dx) * 0.25, pen({ strokeWidth: 2.4, seed: seed + 4 + i }))).join("") +
    `</g><g id="${id}-pupil">${dot(cx, cy, 24, { seed: seed + 3 })}</g>`;
  const eyeShut = (id, cx, cy, seed) =>
    `<g id="${id}">${r.curve([[cx - 90, cy - 6], [cx - 40, cy + 30], [cx + 40, cy + 30], [cx + 90, cy - 6]], pen({ strokeWidth: 3.4, seed }))}` +
    [-56, -28, 0, 28, 56].map((dx, i) => r.line(cx + dx, cy + 22 - Math.abs(dx) * 0.2, cx + dx * 1.15, cy + 44 - Math.abs(dx) * 0.2, pen({ strokeWidth: 2.4, seed: seed + 2 + i }))).join("") + `</g>`;

  // ---------- times ----------
  const T = {
    q0: cue(0, "question", 0, -0.1), copy0: cue(0, "copy", 0, -0.15), qubit0: cue(0, "qubit", 0, -0.05), quantum0: cue(0, "quantum", 0, -0.05),
    off0: cue(1, null, 0, -0.25),
    zeros1: cue(1, "zeros", 0, -0.15), ones1: cue(1, "ones", 0, -0.1), yes1: cue(1, "yes", 0, -0.05), gate1: cue(1, "gate", 0, -0.2), cnot1: cue(1, "CNOT", 0, -0.2),
    blank1: cue(1, "blank", 0, -0.1), zero1: cue(1, "zero", 1, -0.1),
    flips2: cue(2, "flips", 0, -0.05), original2: cue(2, "original", 0, -0.1), zero2: cue(2, "zero", 0, -0.1), zz2: cue(2, "zero", 1, -0.1),
    one2b: cue(2, "one", 1, -0.1), oo2: cue(2, "one", 2, -0.1),
    shrink: cue(3, null, 0, 0), photo3: cue(3, "photocopier", 0, -0.1), black3: cue(3, "black", 0, -0.1), white3: cue(3, "white", 0, -0.05),
    white4: cue(4, "white", 0, -0.15), two4: cue(4, "two", 0, -0.05), pages4: cue(4, "pages", 0, -0.1), black4: cue(4, "black", 0, -0.2),
    two4b: cue(4, "two", 1, -0.05), ones4: cue(4, "ones", 0, -0.1), but4: cue(4, "but", 0, -0.05),
    grey5: cue(5, "grey", 0, -0.35), doesnt5: cue(5, "doesn't", 0, -0.1), copy5: cue(5, "copy", 0, -0.1), it5: cue(5, "it", 2, -0.1),
    binds6: cue(6, "binds", 0, 0), looks6: cue(6, "looks", 0, -0.15), black6: cue(6, "black", 0, -0.15), white6: cue(6, "white", 0, -0.15),
    off6: cue(7, null, 0, -0.1), grey7: cue(7, "grey", 0, -0.1), plus7: cue(7, "plus", 0, -0.15), state7: cue(7, "state", 0, -0.05),
    arrow7: cue(7, "arrow", 0, -0.2), equator7: cue(7, "equator", 0, -0.05),
    copies8: cue(8, "copies", 0, -0.15), four8: cue(8, "four", 0, -0.1), one8: cue(8, "one", 0, -0.1),
    instead9: cue(9, "instead", 0, 0), zero9: cue(9, "zero", 0, -0.05), one9: cue(9, "one", 0, -0.05), half9: cue(9, "half", 0, -0.1),
    ent10: cue(10, "entangled", 0, -0.15), answers10: cue(10, "answers", 0, -0.1), neither10: cue(10, "neither", 0, -0.1), own10: cue(11, "own", 0, 0.05),
    not11: cue(11, "not", 0, -0.05), fault11: cue(11, "fault", 0, 0.1), no11: cue(11, "no", 0, -0.1), circuit11: cue(11, "circuit", 0, -0.15),
    unknown11: cue(11, "unknown", 0, -0.1), state11: cue(11, "state", 0, -0.05), why11: cue(11, "why", 0, -0.1),
    copies12: cue(12, "copies", 0, -0.2), measure12: cue(12, "measure", 0, -0.05), work12: cue(12, "work", 0, -0.1), arrow12: cue(12, "arrow", 0, -0.25),
    off12: cue(13, "measuring", 0, -0.2), measuring13: cue(13, "measuring", 0, -0.15), one13: cue(13, "one", 0, -0.1), copying13: cue(13, "copying", 0, -0.15),
    past13: cue(13, "past", 0, -0.05),
    off13: cue(14, null, 0, 0), photo14: cue(14, "photocopier", 0, -0.15), breaks14: cue(14, "breaks", 0, -0.1), anyone14: cue(14, "anyone", 0, -0.1),
    grey14: cue(14, "grey", 0, -0.05), nobody14: cue(14, "nobody", 0, -0.1), shade14: cue(14, "shade", 0, -0.1),
    off14: cue(15, null, 0, 0), many15: cue(15, "many", 0, -0.2), known15: cue(15, "known", 0, -0.05), repeat15: cue(15, "repeat", 0, -0.1),
    off15: cue(16, "no", 0, -0.3), no16: cue(16, "no", 0, -0.05), cnot16: cue(16, "CNOT", 0, -0.2), copies16: cue(16, "copies", 1, -0.1),
    zero16: cue(16, "zero", 0, -0.1), one16: cue(16, "one", 0, -0.1), entangles16: cue(16, "entangles", 0, -0.15), between16: cue(16, "between", 0, -0.2),
  };

  // ---------- 0. hook: a qubit and an empty space beside it ----------
  const G0 = [760, 600, 130], G0b = [1160, 600, 130];
  const hookSvg =
    globe("b-g0", ...G0, 40, { arrow: { init: 55, wob: 4 } }) +
    `<g id="b-g0b">${dashed(ellPts(G0b[0], G0b[1], G0b[2], G0b[2], 72), 14, 11, { strokeWidth: 2.6, seed: 60 })}</g>` +
    `<g id="b-g0ar">${arrow(905, 600, 1012, 600, { strokeWidth: 3, seed: 61 }, 18)}</g>`;
  const hookHtml = layer("b-hook", hookSvg,
    L("b-g0q", G0b[0], G0b[1], 120, 96, "?", `color:${GOLD}`) +
    L("b-g0cp", 958, 548, 160, 48, "copy?") +
    L("b-g0l1", G0[0], 772, 200, 52, "qubit") +
    L("b-g0l2", G0[0], 826, 300, 42, "a quantum bit"));

  // ---------- 1-2. the CNOT circuit (layer moves: centre, corner icon, left, centre) ----------
  const C = { x1: 620, x2: 1300, yt: 380, yb: 600, gx: 960, inX: 470, outX: 1380 };
  const circSvg =
    `<g id="b-cw">${r.line(C.x1, C.yt, C.x2, C.yt, pen({ strokeWidth: 3.2 }))}${r.line(C.x1, C.yb, C.x2, C.yb, pen({ strokeWidth: 3.2 }))}</g>` +
    `<g id="b-cg">${dot(C.gx, C.yt, 30)}${r.line(C.gx, C.yt, C.gx, C.yb + 42, pen({ strokeWidth: 3.2 }))}${r.circle(C.gx, C.yb, 84, pen({ strokeWidth: 3.4 }))}${r.line(C.gx - 42, C.yb, C.gx + 42, C.yb, pen({ strokeWidth: 3.2 }))}</g>` +
    `<g id="b-ctick">${tick(548, 318, 40, { stroke: GOLD })}</g>` +
    `<g id="b-cund">${r.curve([[422, 692], [470, 688], [520, 693]], goldPen({ strokeWidth: 4 }))}</g>` +
    `<g id="b-cpulse">${r.circle(C.gx, C.yb, 104, goldPen({ strokeWidth: 5 }))}</g>` +
    `<g id="b-cflip">${r.curve([[1030, 520], [1062, 540], [1066, 580]], pen({ strokeWidth: 2.6 }))}${r.line(1066, 580, 1056, 566, pen({ strokeWidth: 2.4 }))}${r.line(1066, 580, 1074, 565, pen({ strokeWidth: 2.4 }))}</g>` +
    `<circle id="b-cdot" cx="${C.x1}" cy="${C.yt}" r="13" fill="${GOLD}" stroke="${GROUND}" stroke-width="4"/>`;
  const circInner =
    L("b-in01", C.inX, C.yt, 200, 64, "0 / 1") +
    L("b-in1a", C.inX, C.yt, 100, 64, "1", `color:${GOLD}`) +
    L("b-in0", C.inX, C.yt, 100, 64, "0") +
    L("b-in1b", C.inX, C.yt, 100, 64, "1", `color:${GOLD}`) +
    L("b-inb", C.inX, C.yb, 140, 64, "|0⟩") +
    L("b-lorig", 720, 340, 200, 42, "original") +
    L("b-lblank", C.inX, 662, 160, 42, "blank") +
    L("b-lgate", C.gx, 290, 300, 56, "CNOT gate") +
    LL("b-lflip", 1080, 512, 120, 42, "flip") +
    L("b-o0t", C.outX, C.yt, 90, 60, "0") + L("b-o0b", C.outX, C.yb, 90, 60, "0") +
    L("b-o1t", C.outX, C.yt, 90, 60, "1") + L("b-o1b", C.outX, C.yb, 90, 60, "1") +
    // line 9: outputs flicker between 0 0 and 1 1 (driven by onFrame)
    L("b-f0t", C.outX, C.yt, 90, 60, "0", `color:${GOLD};opacity:0`) + L("b-f0b", C.outX, C.yb, 90, 60, "0", `color:${GOLD};opacity:0`) +
    L("b-f1t", C.outX, C.yt, 90, 60, "1", `color:${GOLD};opacity:0`) + L("b-f1b", C.outX, C.yb, 90, 60, "1", `color:${GOLD};opacity:0`);
  // transform origin at the circuit's middle; poses as GSAP x/y/scale
  const CO = [1010, 480];
  const POSE = { icon: { x: 1610 - CO[0], y: 170 - CO[1], scale: 0.3 }, left: { x: -318, y: 0, scale: 0.8 }, mid: { x: -50, y: 10, scale: 0.75 } };
  const at = (p, x, y) => [fx((x - CO[0]) * p.scale + CO[0] + p.x), fx((y - CO[1]) * p.scale + CO[1] + p.y)];
  const circHtml = layer("b-circ", circSvg, circInner, `transform-origin:${CO[0]}px ${CO[1]}px`);
  const sumHtml = layer("b-sum",
    `<g id="b-st0">${tick(905, 760, 40, { stroke: GOLD })}</g><g id="b-st1">${tick(1245, 760, 40, { stroke: GOLD })}</g>`,
    L("b-s0", 790, 768, 220, 64, "0 → 00") + L("b-s1", 1130, 768, 220, 64, "1 → 11"));

  // ---------- 3-6. the photocopier ----------
  const PG = { inStart: [470, 300], inStop: [840, 300], out: [[1335, 550], [1505, 550]], copy: [1420, 550] };
  const copierSvg =
    `<g id="b-cp">` +
    r.rect(680, 440, 560, 240, pen({ fill: GROUND, fillStyle: "solid", strokeWidth: 3.4, seed: 70 })) +
    r.rect(668, 405, 584, 35, pen({ fill: GROUND, fillStyle: "solid", strokeWidth: 3, seed: 71 })) +
    r.rect(756, 398, 168, 12, pen({ fill: "#0b0c0e", fillStyle: "solid", strokeWidth: 2.4, seed: 72 })) +
    r.rect(1090, 462, 124, 64, pen({ strokeWidth: 2.4, seed: 73 })) +
    r.circle(1180, 494, 30, pen({ strokeWidth: 2.4, seed: 74 })) + dot(1116, 484, 10, { seed: 75 }) + dot(1116, 506, 10, { seed: 76 }) +
    r.line(702, 586, 1218, 586, pen({ strokeWidth: 2.4, seed: 77 })) + r.line(910, 628, 1010, 628, pen({ strokeWidth: 3.4, seed: 78 })) +
    r.line(712, 680, 712, 702, pen({ strokeWidth: 3, seed: 79 })) + r.line(1208, 680, 1208, 702, pen({ strokeWidth: 3, seed: 80 })) +
    r.linear([[1240, 664], [1690, 664], [1712, 640]], pen({ strokeWidth: 3, seed: 81 })) +
    `</g>` +
    `<g id="b-swb">${r.rect(720, 466, 52, 52, pen({ fill: "#0b0c0e", fillStyle: "solid", strokeWidth: 2.4, seed: 82 }))}</g>` +
    `<g id="b-sww">${r.rect(790, 466, 52, 52, pen({ fill: INK, fillStyle: "solid", strokeWidth: 2.4, stroke: "#9aa0a6", seed: 83 }))}</g>` +
    `<g id="b-pt1">${tick(1392, 410, 44, { stroke: GOLD })}</g><g id="b-pt2">${tick(1392, 410, 44, { stroke: GOLD, seed: 84 })}</g>`;
  const copierHtml = layer("b-copier", copierSvg,
    L("b-bwonly", 960, 742, 500, 48, "black and white only") +
    L("b-map", 960, 742, 500, 48, "white = 0, black = 1"));
  // feed: pages slide in from the left and drop through the slot (clipped at the lid)
  const FEED = [300, 60, 700, 345];
  const feedHtml = `<div id="b-feed" class="obj" style="left:${FEED[0]}px;top:${FEED[1]}px;width:${FEED[2]}px;height:${FEED[3]}px;overflow:hidden">` +
    ["white", "black", "grey"].map((kd, i) => {
      const [cx, cy] = PG.inStart;
      return `<div style="position:absolute;left:${-FEED[0]}px;top:${-FEED[1]}px;width:0;height:0">${pageDiv(`b-pin${i}`, kd, cx, cy, 90 + i * 10, { gold: kd === "grey" })}</div>`;
    }).join("") + `</div>`;
  // output: pages slide out from behind the copier onto the tray (clipped at the copier's right side)
  const OUT = [1242, 380, 480, 283];
  const outPages = [["white", 0], ["white", 1], ["black", 0], ["black", 1]].map(([kd, j], i) => {
    const [cx, cy] = PG.out[j];
    return pageDiv(`b-pout${i}`, kd, cx, cy, 130 + i * 10);
  }).join("");
  const outHtml = `<div id="b-out" class="obj" style="left:${OUT[0]}px;top:${OUT[1]}px;width:${OUT[2]}px;height:${OUT[3]}px;overflow:hidden">` +
    `<div style="position:absolute;left:${-OUT[0]}px;top:${-OUT[1]}px;width:0;height:0">${outPages}` +
    box("b-ghostp", PG.copy[0] - 90, PG.copy[1] - 115, 180, 230,
      `<g id="b-ghost">${dashed(rectPts(PG.copy[0] - 75, PG.copy[1] - 100, 150, 200), 14, 10, { stroke: "#8b8d90", strokeWidth: 3 })}</g>` +
      `<g id="b-ghostx">${cross(PG.copy[0], PG.copy[1], 58)}</g>`) +
    `</div></div>`;
  // line 6: the original and its "copy", bound by a gold ribbon; they flip black/white together
  const bound = PG.out.map(([cx, cy], i) =>
    `<div id="b-bp${i}" class="obj" style="left:${cx - 87}px;top:${cy - 112}px;width:174px;height:224px;transform-origin:87px 112px">` +
    `<svg class="sk" width="174" height="224" viewBox="${cx - 87} ${cy - 112} 174 224">` +
    `<g id="b-bpw${i}" style="opacity:0">${r.path(rrect(cx - 75, cy - 100, 150, 200), pen({ fill: INK, fillStyle: "solid", stroke: "none", seed: 150 + i }))}</g>` +
    `<g id="b-bpk${i}" style="opacity:0">${r.path(rrect(cx - 75, cy - 100, 150, 200), pen({ fill: "#0b0c0e", fillStyle: "solid", stroke: "none", seed: 152 + i }))}</g>` +
    `<g id="b-bpo${i}">${pageSvg("plain", cx, cy, 154 + i * 10)}</g></svg></div>`).join("");
  const ribbon =
    r.curve([[1238, 536], [1330, 528], [1420, 538], [1510, 528], [1602, 536]], goldPen({ strokeWidth: 4, seed: 170 })) +
    r.curve([[1238, 566], [1330, 558], [1420, 568], [1510, 558], [1602, 566]], goldPen({ strokeWidth: 4, seed: 171 })) +
    r.ellipse(1396, 530, 52, 34, goldPen({ strokeWidth: 3.6, seed: 172 })) + r.ellipse(1444, 530, 52, 34, goldPen({ strokeWidth: 3.6, seed: 173 })) +
    r.line(1418, 548, 1400, 594, goldPen({ strokeWidth: 3.4, seed: 174 })) + r.line(1422, 548, 1442, 594, goldPen({ strokeWidth: 3.4, seed: 175 }));
  const BP = [1420, 550];
  const boundHtml = `<div id="b-bound" class="obj" style="left:0;top:0;width:1920px;height:1080px;transform-origin:${BP[0]}px ${BP[1]}px">${bound}` +
    `<svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080"><g id="b-ribbon">${ribbon}</g></svg></div>`;
  const eyeHtml = layer("b-eye6", eyeOpen("b-e6", 960, 250, 180));

  // ---------- 7-10. CNOT on the plus state, bars, the entangled pair ----------
  const inG = at(POSE.left, C.inX, C.yt); // where the top input sits in the left pose
  const GP = [inG[0], inG[1], 90];
  const plusSvg =
    `<g id="b-gp-pg">${pageSvg("grey", 222, 200, 190, { w: 90, h: 120 })}</g>` +
    globe("b-gp", ...GP, 200, { arrow: { init: 0, segs: [[T.state7, T.equator7, 0, 90]], wob: 2.5 } }) +
    `<g id="b-gp-eqg">${r.ellipse(GP[0], GP[1], GP[2] * 2, GP[2] * 0.52, goldPen({ strokeWidth: 4.4, seed: 210 }))}</g>`;
  const plusHtml = layer("b-plus", plusSvg, L("b-gp-plus", 380, 200, 220, 60, "= |+⟩"));
  // bars
  const BX = [1180, 1320, 1460, 1600], BW = 90, BASE = 720, BH = 360;
  const barsSvg =
    `<defs>${BX.map((x, i) => `<clipPath id="b-bclip${i}"><rect id="b-brect${i}" x="${x - 8}" y="${BASE}" width="${BW + 16}" height="0"/></clipPath>`).join("")}</defs>` +
    `<g id="b-baxis">${r.line(1140, BASE, 1720, BASE, pen({ strokeWidth: 3.2, seed: 220 }))}</g>` +
    BX.map((x, i) =>
      `<g clip-path="url(#b-bclip${i})">` +
      `<g id="b-bink${i}">${r.rect(x + 4, BASE - BH, BW - 8, BH, pen({ fill: "rgba(232,232,232,0.55)", fillStyle: "hachure", hachureGap: 10, fillWeight: 2, stroke: "none", seed: 230 + i }))}</g>` +
      (i === 0 || i === 3 ? `<g id="b-bgold${i}">${r.rect(x + 4, BASE - BH, BW - 8, BH, pen({ fill: GOLD, fillStyle: "hachure", hachureGap: 8, fillWeight: 2.4, stroke: "none", seed: 240 + i }))}</g>` : "") +
      `${r.line(x, BASE, x, BASE - BH, goldPen({ strokeWidth: 3.2, seed: 250 + i }))}${r.line(x + BW, BASE, x + BW, BASE - BH, goldPen({ strokeWidth: 3.2, seed: 260 + i }))}</g>` +
      `<line id="b-bcap${i}" x1="${x - 2}" y1="${BASE}" x2="${x + BW + 2}" y2="${BASE}" stroke="${GOLD}" stroke-width="4.4" stroke-linecap="round"/>`).join("");
  const barsHtml = layer("b-bars", barsSvg,
    BX.map((x, i) => L(`b-bl${i}`, x + BW / 2, 762, 110, 48, ["00", "01", "10", "11"][i])).join("") +
    BX.map((x, i) => L(`b-bp${i}t`, x + BW / 2, BASE - 30, 120, 42, "0%", "opacity:0")).join("") +
    L("b-b14", 1435, 822, 400, 48, "1 in 4 each") +
    L("b-bhalf", 1435, 822, 440, 48, "half the time each", `color:${GOLD}`));
  // the two "true copies" we hoped for
  const tcSvg = globe("b-tc0", 1300, 240, 70, 270, { arrow: { init: 90, wob: 3 } }) + globe("b-tc1", 1500, 240, 70, 280, { arrow: { init: 90, wob: 3 } });
  const tcHtml = layer("b-tc", tcSvg, L("b-tcl", 1400, 120, 320, 50, "true copies?"));
  // the entangled pair at the outputs
  const oT = at(POSE.left, C.x2, C.yt), oB = at(POSE.left, C.x2, C.yb);
  const E = [[1250, 330], [1250, 650]], ER = 80;
  const entSvg =
    `<g id="b-ear">${arrow(oT[0] + 16, oT[1] - 4, E[0][0] - ER - 14, E[0][1] + 18, { strokeWidth: 2.6, seed: 300 }, 16)}${arrow(oB[0] + 16, oB[1] + 4, E[1][0] - ER - 14, E[1][1] - 18, { strokeWidth: 2.6, seed: 301 }, 16)}</g>` +
    globe("b-e0", ...E[0], ER, 310, { arrow: { init: 90, wob: 3 } }) + globe("b-e1", ...E[1], ER, 320, { arrow: { init: 90, wob: 3 } }) +
    `<g id="b-elink">${r.curve(Array.from({ length: 9 }, (_, i) => [E[0][0] + (i % 2 ? 14 : -14), E[0][1] + ER + 6 + i * ((E[1][1] - E[0][1] - 2 * ER - 12) / 8)]), goldPen({ strokeWidth: 4.4, seed: 330 }))}</g>` +
    E.map(([x, y], i) => `<g id="b-eblur${i}">${r.ellipse(x, y, 70, 54, pen({ fill: "rgba(232,232,232,0.55)", fillStyle: "hachure", hachureGap: 6, fillWeight: 1.6, stroke: "rgba(232,232,232,0.45)", strokeWidth: 1.6, seed: 340 + i }))}</g>`).join("");
  const entHtml = layer("b-ent", entSvg,
    LL("b-entl", 1300, 466, 300, 60, "entangled", `color:${GOLD}`) +
    LL("b-same", 1302, 530, 320, 48, "same answers") +
    LL("b-noa0", 1350, E[0][1], 240, 48, "no arrow") + LL("b-noa1", 1350, E[1][1], 240, 48, "no arrow"));
  const faultHtml = layer("b-fault", "", L("b-faultl", 960, 704, 360, 52, "not its fault"));

  // ---------- 11. the no-cloning theorem ----------
  const thSvg =
    `<g id="b-thu">${r.curve([[640, 352], [800, 344], [1000, 350], [1280, 342]], goldPen({ strokeWidth: 4, seed: 400 }))}</g>` +
    `<g id="b-anyc">${r.rect(760, 450, 400, 190, pen({ strokeWidth: 3.4, seed: 401 }))}${r.line(676, 545, 760, 545, pen({ seed: 402 }))}` +
    `${r.line(1160, 500, 1262, 490, pen({ seed: 403 }))}${r.line(1160, 600, 1262, 612, pen({ seed: 404 }))}</g>` +
    globe("b-ug", 605, 545, 70, 410) + `<g id="b-ucl">${cloth(605, 545, 70, 420)}</g>` +
    globe("b-uo", 1320, 488, 54, 430) + `<g id="b-uocl">${cloth(1320, 488, 54, 436)}</g>` +
    `<g id="b-uc">${dashed(ellPts(1320, 614, 54, 54, 48), 12, 10, { strokeWidth: 2.6 })}</g>` +
    `<g id="b-ux">${cross(1320, 614, 50)}</g>`;
  const thHtml = layer("b-th", thSvg,
    L("b-tht", 960, 290, 760, 76, "no-cloning theorem") +
    L("b-anyl", 960, 545, 340, 52, "any circuit") +
    L("b-uq", 605, 538, 80, 60, "?", `color:${GOLD}`));
  const whyHtml = layer("b-why", "", L("b-whyl", 960, 190, 300, 80, "why?"));

  // ---------- 12. many copies would reveal the arrow ----------
  const SX = Array.from({ length: 6 }, (_, i) => 360 + i * 240), SY = 340, SR = 60;
  const SANG = [0, 90, 45, 135, 20, 160], SRES = ["1", "0", "1", "1", "0", "1"];
  const manySvg =
    SX.map((x, i) => globe(`b-m${i}`, x, SY, SR, 500 + i * 10)).join("") +
    SX.map((x, i) => {
      const a = (SANG[i] * Math.PI) / 180, dx = Math.sin(a) * (SR + 22), dy = -Math.cos(a) * (SR + 22);
      return `<g id="b-ms${i}">${r.line(x - dx, SY - dy, x + dx, SY + dy, pen({ strokeWidth: 3, roughness: 0.6, seed: 600 + i }))}${dot(x + dx, SY + dy, 12, { seed: 610 + i })}${dot(x - dx, SY - dy, 12, { seed: 620 + i })}</g>`;
    }).join("") +
    `<g id="b-mfeed">${SX.map((x, i) => r.line(x, 494, fx(960 + (x - 960) * 0.22), 540, pen({ strokeWidth: 2, stroke: "rgba(232,232,232,0.6)", seed: 630 + i }))).join("")}</g>` +
    globe("b-mbig", 960, 680, 125, 650, { arrow: { init: 50, wob: 3 } });
  const manyHtml = layer("b-many", manySvg,
    SX.map((x, i) => L(`b-mq${i}`, x, SY - 4, 60, 52, "?")).join("") +
    SX.map((x, i) => L(`b-mr${i}`, x, 456, 60, 48, SRES[i])).join("") +
    LL("b-marr", 1110, 680, 260, 52, "the arrow!", `color:${GOLD}`));

  // ---------- 13. one qubit, one bit; copying would sneak past ----------
  const M = [1000, 460];
  const meterSvg =
    globe("b-q13", 620, 460, 110, 700) + `<g id="b-q13cl">${cloth(620, 460, 110, 710)}</g>` +
    `<g id="b-meter">${r.rect(M[0] - 100, M[1] - 70, 200, 140, pen({ strokeWidth: 3.2, seed: 720 }))}${r.arc(M[0], M[1] + 40, 140, 140, Math.PI * 1.1, Math.PI * 1.9, false, pen({ strokeWidth: 2.4, seed: 721 }))}` +
    `${r.line(735, 460, M[0] - 100, 460, pen({ strokeWidth: 3, seed: 722 }))}</g>` +
    `<g id="b-needle">${r.line(M[0], M[1] + 40, M[0], M[1] - 22, goldPen({ strokeWidth: 4, seed: 723 }))}${dot(M[0], M[1] + 40, 14, { seed: 724 })}</g>` +
    `<g id="b-m1ar">${arrow(M[0] + 108, 460, 1190, 460, { strokeWidth: 3, seed: 725 }, 16)}</g>` +
    `<g id="b-tcp">${r.rect(560, 215, 120, 56, pen({ strokeWidth: 2.6, seed: 730 }))}${r.rect(552, 204, 136, 11, pen({ strokeWidth: 2.2, seed: 731 }))}${r.line(680, 262, 712, 262, pen({ strokeWidth: 2.4, seed: 732 }))}</g>` +
    `<g id="b-sneak">${dashed(Array.from({ length: 41 }, (_, i) => { const u = i / 40; return [fx(712 + 600 * u), fx(250 - 130 * Math.sin(Math.PI * u) + 140 * u * u)]; }), 14, 10, { strokeWidth: 3 })}` +
    `${r.line(1312, 390, 1298, 372, pen({ strokeWidth: 2.6, seed: 733 }))}${r.line(1312, 390, 1290, 390, pen({ strokeWidth: 2.6, seed: 734 }))}</g>` +
    `<g id="b-sneakx">${cross(1010, 170, 42)}</g>`;
  const meterHtml = layer("b-m13", meterSvg,
    L("b-mt0", M[0] - 74, 418, 50, 40, "0") + L("b-mt1", M[0] + 74, 418, 50, 40, "1") +
    L("b-one", 1252, 456, 90, 88, "1", `color:${GOLD}`) + L("b-onebit", 1252, 540, 200, 50, "one bit"));

  // ---------- 14. where the copier breaks ----------
  const brkSvg =
    `<g id="b-scp">${r.rect(840, 172, 240, 86, pen({ strokeWidth: 3, seed: 800 }))}${r.rect(830, 156, 260, 16, pen({ strokeWidth: 2.6, seed: 801 }))}` +
    `${r.linear([[1080, 248], [1150, 248], [1160, 236]], pen({ strokeWidth: 2.6, seed: 802 }))}${r.circle(1048, 196, 18, pen({ strokeWidth: 2, seed: 803 }))}</g>` +
    `<g id="b-crack">${r.linear([[930, 140], [954, 178], [936, 200], [968, 226], [950, 250], [978, 280]], pen({ strokeWidth: 5, roughness: 0.6, seed: 804 }))}</g>` +
    `<g id="b-div">${dashed([[960, 330], [960, 790]], 14, 12, { stroke: DIM, strokeWidth: 2.4 })}</g>` +
    `<g id="b-gp14">${pageSvg("grey", 560, 560, 810)}</g>` + eyeOpen("b-e14", 560, 380, 820) +
    `<g id="b-tk14">${tick(700, 380, 42)}</g>` +
    globe("b-q14", 1360, 560, 110, 830) + `<g id="b-q14cl">${cloth(1360, 560, 110, 840)}</g>` + eyeShut("b-e14b", 1360, 370, 850);
  const brkHtml = layer("b-brk", brkSvg,
    L("b-seegrey", 560, 726, 260, 52, "see grey") + L("b-cantsee", 1360, 726, 300, 52, "can't see it") +
    L("b-q14q", 1360, 548, 80, 80, "?", `color:${GOLD}`));

  // ---------- 15. repeat the recipe ----------
  const RY = [400, 530, 660];
  const recipeSvg =
    `<g id="b-card">${r.rect(460, 200, 1000, 560, pen({ strokeWidth: 3.2, seed: 900 }))}</g>` +
    `<g id="b-kund">${r.curve([[1140, 304], [1260, 298], [1380, 303]], goldPen({ strokeWidth: 4, seed: 901 }))}</g>` +
    RY.map((y, i) =>
      `<g id="b-row${i}">${r.line(610, y, 760, y, pen({ seed: 910 + i * 10 }))}${r.rect(760, y - 42, 260, 84, pen({ strokeWidth: 2.8, seed: 911 + i * 10 }))}${r.line(1020, y, 1180, y, pen({ seed: 912 + i * 10 }))}</g>` +
      globe(`b-rg${i}`, 1240, y, 52, 920 + i * 10, { arrow: { init: 90, wob: 3 } }) +
      `<g id="b-rt${i}">${tick(1330, y, 46, { stroke: GOLD, seed: 925 + i * 10 })}</g>`).join("");
  const recipeHtml = layer("b-rec", recipeSvg,
    L("b-rect", 640, 272, 260, 60, "recipe") + L("b-known", 1260, 268, 300, 60, "known state") +
    RY.map((y, i) => L(`b-r0${i}`, 560, y, 110, 56, "|0⟩") + L(`b-rs${i}`, 890, y, 250, 50, "same steps")).join(""));

  // ---------- 16. closing: takeaway and the circuit once more ----------
  const F = { x1: 720, x2: 1240, yt: 470, yb: 660, gx: 980 };
  const finSvg =
    `<g id="b-fw">${r.line(F.x1, F.yt, F.x2, F.yt, pen({ strokeWidth: 3, seed: 950 }))}${r.line(F.x1, F.yb, F.x2, F.yb, pen({ strokeWidth: 3, seed: 951 }))}</g>` +
    `<g id="b-fg">${dot(F.gx, F.yt, 26, { seed: 952 })}${r.line(F.gx, F.yt, F.gx, F.yb + 34, pen({ strokeWidth: 3, seed: 953 }))}${r.circle(F.gx, F.yb, 68, pen({ strokeWidth: 3.2, seed: 954 }))}${r.line(F.gx - 34, F.yb, F.gx + 34, F.yb, pen({ strokeWidth: 3, seed: 955 }))}</g>` +
    `<g id="b-ft0">${tick(500, F.yt + 22, 42, { seed: 956 })}</g><g id="b-ft1">${tick(500, F.yb - 8, 42, { seed: 957 })}</g>` +
    `<g id="b-flinkp"><g id="b-flink">${dot(F.x2 + 20, F.yt, 16, { fill: GOLD, stroke: GOLD, seed: 958 })}${dot(F.x2 + 20, F.yb, 16, { fill: GOLD, stroke: GOLD, seed: 959 })}` +
    `${r.curve(Array.from({ length: 9 }, (_, i) => [F.x2 + 20 + (i % 2 ? 12 : -12), F.yt + 12 + i * ((F.yb - F.yt - 24) / 8)]), goldPen({ strokeWidth: 4.4, seed: 960 }))}</g></g>`;
  const finHtml = layer("b-fin", finSvg,
    L("b-take", 960, 230, 1600, 96, `No circuit copies an <span style="color:${GOLD}">unknown</span> state.`) +
    L("b-fr0", 370, F.yt + 22, 240, 66, "0 → 00") + L("b-fr1", 370, F.yb - 8, 240, 66, "1 → 11") +
    L("b-fcn", F.gx, F.yt - 56, 180, 52, "CNOT") +
    L("b-fip", 656, F.yt, 120, 66, "|+⟩", `color:${GOLD}`) + L("b-fi0", 656, F.yb, 120, 66, "|0⟩") +
    LL("b-fent", 1300, (F.yt + F.yb) / 2, 320, 66, "entangled", `color:${GOLD}`));

  const html = [
    hookHtml, circHtml, sumHtml, copierHtml, feedHtml, outHtml, boundHtml, eyeHtml,
    plusHtml, barsHtml, tcHtml, entHtml, faultHtml, thHtml, whyHtml, manyHtml, meterHtml, brkHtml, recipeHtml, finHtml,
  ].join("\n");

  // ---------- timeline ----------
  const FLIPS6 = [[T.black6 - 0.1, 1], [T.white6 - 0.05, 0], [T.white6 + 0.35, 1]]; // face: 1 black, 0 white
  const script = `
    const T = ${JSON.stringify(T)};
    const ARROWS = ${JSON.stringify(ARROWS)};
    const POSE = ${JSON.stringify(POSE)};
    hide(["#b-cdot", "#b-cpulse", "#b-gp-eqg", "#b-bgold0", "#b-bgold3", "#b-bars", "#b-pin0", "#b-pin1", "#b-pin2", "#b-pout0", "#b-pout1", "#b-pout2", "#b-pout3"]);

    // 0. hook: can you copy a qubit?
    draw("#b-g0", T.q0, 1.0); draw("#b-g0-eq", T.q0 + 0.6, 0.5); draw("#b-g0-arr", T.q0 + 1.0, 0.4);
    draw("#b-g0b", T.copy0, 0.7); draw("#b-g0ar", T.copy0 + 0.05, 0.35); write("#b-g0cp", T.copy0 + 0.1, 0.35);
    write("#b-g0q", T.copy0 + 0.4, 0.2);
    blurOut("#b-title", 2.9);
    write("#b-g0l1", T.qubit0, 0.35); write("#b-g0l2", T.quantum0, 0.6);
    blurOut("#b-hook", T.off0);

    // 1. CNOT copies plain 0 and 1
    write("#b-in01", T.zeros1, 0.45);
    draw("#b-ctick", T.yes1, 0.3);
    draw("#b-cw", T.gate1, 0.6); write("#b-lorig", T.gate1 + 0.4, 0.4);
    draw("#b-cg", T.cnot1, 0.8); write("#b-lgate", T.cnot1 + 0.1, 0.5);
    write("#b-inb", T.blank1, 0.3); write("#b-lblank", T.blank1 + 0.3, 0.35);
    draw("#b-cund", T.zero1, 0.3);

    // 2. it flips the blank only when the original is 1
    fade(["#b-ctick", "#b-cund"], 0, T.flips2 - 0.2, 0.3);
    tl.fromTo("#b-cpulse", { opacity: 0, scale: 0.8, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1.1, duration: 0.25, ease: "power2.out" }, T.flips2);
    tl.to("#b-cpulse", { opacity: 0, scale: 1.25, duration: 0.45, ease: "power2.in" }, T.flips2 + 0.35);
    draw("#b-cflip", T.flips2 + 0.1, 0.4); write("#b-lflip", T.flips2 + 0.3, 0.3);
    fade("#b-in01", 0, T.original2 - 0.05, 0.2); write("#b-in1a", T.original2 + 0.1, 0.2);
    // the control flows from the input along the top wire and down to the target
    tl.set("#b-cdot", { x: 0, y: 0, opacity: 1 }, T.original2 + 0.3);
    tl.to("#b-cdot", { x: ${C.gx - C.x1}, duration: 0.45, ease: "power1.inOut" }, T.original2 + 0.3);
    tl.to("#b-cdot", { y: ${C.yb - C.yt}, duration: 0.3, ease: "power1.in" }, T.original2 + 0.75);
    tl.to("#b-cdot", { opacity: 0, duration: 0.15 }, T.original2 + 1.05);
    fade(["#b-cflip", "#b-lflip"], 0, T.zero2 - 0.15, 0.25);
    fade("#b-in1a", 0, T.zero2 - 0.15, 0.15); write("#b-in0", T.zero2, 0.2);
    write("#b-o0t", T.zz2, 0.2); write("#b-o0b", T.zz2 + 0.15, 0.2);
    write("#b-s0", T.zz2 + 0.15, 0.5); draw("#b-st0", T.zz2 + 0.75, 0.3);
    fade(["#b-in0", "#b-o0t", "#b-o0b"], 0, T.one2b - 0.15, 0.15); write("#b-in1b", T.one2b, 0.2);
    tl.set("#b-cdot", { x: 0, y: 0, opacity: 1 }, T.one2b + 0.1);
    tl.to("#b-cdot", { x: ${C.gx - C.x1}, duration: 0.3, ease: "power1.inOut" }, T.one2b + 0.1);
    tl.to("#b-cdot", { y: ${C.yb - C.yt}, duration: 0.2, ease: "power1.in" }, T.one2b + 0.4);
    tl.to("#b-cdot", { opacity: 0, duration: 0.12 }, T.one2b + 0.6);
    write("#b-o1t", T.one2b + 0.55, 0.2); write("#b-o1b", T.oo2, 0.2);
    write("#b-s1", T.one2b + 0.25, 0.5); draw("#b-st1", T.oo2 + 0.05, 0.3);

    // the circuit steps aside to a small corner icon
    blurOut("#b-sum", T.photo3 - 0.3);
    fade(["#b-in1b", "#b-o1t", "#b-o1b", "#b-lorig", "#b-lblank", "#b-lgate", "#b-inb"], 0, T.shrink, 0.3);
    move("#b-circ", { x: 0, y: 0, scale: 1, opacity: 1 }, { ...POSE.icon, opacity: 0.55 }, T.shrink, 0.9);

    // 3. a photocopier that only understands black and white
    draw("#b-cp", T.photo3 - 0.1, 1.7);
    draw("#b-swb", T.black3, 0.3); draw("#b-sww", T.white3, 0.3);
    write("#b-bwonly", T.white3 + 0.2, 0.7);

    // 4. white in, two white out; black in, two black out
    const feed = (i, t0) => {
      tl.set("#b-pin" + i, { opacity: 1, x: 0, y: 0, scaleY: 1 }, t0 - 0.2);
      tl.fromTo("#b-pin" + i, { scale: 0.85 }, { scale: 1, duration: 0.2, ease: "back.out(2)" }, t0 - 0.2);
      tl.to("#b-pin" + i, { x: ${PG.inStop[0] - PG.inStart[0]}, duration: 0.5, ease: "power2.inOut" }, t0);
      tl.to("#b-pin" + i, { y: 240, duration: 0.3, ease: "power2.in" }, t0 + 0.5);
    };
    const eject = (i, j, t0) => {
      const dx = j === 0 ? -260 : -430;
      tl.set("#b-pout" + i, { opacity: 1 }, t0);
      tl.fromTo("#b-pout" + i, { x: dx }, { x: 0, duration: 0.55, ease: "power2.out" }, t0);
    };
    feed(0, T.white4); eject(0, 1, T.two4 - 0.05); eject(1, 0, T.two4 + 0.2);
    draw("#b-pt1", T.pages4, 0.3);
    fade("#b-bwonly", 0, T.black4 - 0.3, 0.25); write("#b-map", T.black4 + 0.1, 0.7);
    blurOut(["#b-pout0", "#b-pout1", "#b-pt1"], T.black4 - 0.1);
    feed(1, T.black4); eject(2, 1, T.two4b); eject(3, 0, T.two4b + 0.25);
    draw("#b-pt2", T.ones4, 0.3);

    // 5. a grey page does not give a grey copy
    blurOut(["#b-pout2", "#b-pout3", "#b-pt2"], T.but4);
    feed(2, T.grey5);
    draw("#b-ghost", T.doesnt5, 0.6);
    draw("#b-ghostx", T.copy5, 0.3);

    // 6. it binds the pages; whoever looks sees both black or both white
    fade(["#b-ghost", "#b-ghostx"], 0, T.it5, 0.25);
    draw(["#b-bpo0", "#b-bpo1"], T.binds6 - 0.1, 0.5);
    draw("#b-ribbon", T.binds6 + 0.3, 1.0);
    blurOut(["#b-copier", "#b-feed"], T.binds6 + 0.7);
    move("#b-bound", { x: 0, y: 0, scale: 1 }, { x: ${960 - BP[0]}, y: ${510 - BP[1]}, scale: 1.45 }, T.binds6 + 0.8, 1.0);
    draw("#b-e6", T.looks6, 0.6); draw("#b-e6-pupil", T.looks6 + 0.4, 0.2);
    blurOut(["#b-bound", "#b-eye6"], T.off6);

    // 7. CNOT fed the plus state
    move("#b-circ", { ...POSE.icon, opacity: 0.55 }, { ...POSE.left, opacity: 1, immediateRender: false }, T.off6 + 0.05, 0.9);
    fade(["#b-lgate", "#b-inb"], 1, T.off6 + 0.7, 0.4);
    draw("#b-gp-pg", T.grey7, 0.4);
    draw("#b-gp", T.plus7, 0.6); draw("#b-gp-eq", T.plus7 + 0.4, 0.4); draw("#b-gp-arr", T.plus7 + 0.5, 0.3);
    write("#b-gp-plus", T.state7, 0.45);
    tl.fromTo("#b-gp-eqg", { opacity: 0 }, { opacity: 1, duration: 0.2 }, T.equator7);
    tl.to("#b-gp-eqg", { opacity: 0, duration: 0.5 }, T.equator7 + 0.6);

    // 8. two true copies would give all four results
    draw(["#b-tc0", "#b-tc1"], T.copies8, 0.7); draw(["#b-tc0-eq", "#b-tc1-eq"], T.copies8 + 0.3, 0.4);
    draw(["#b-tc0-arr", "#b-tc1-arr"], T.copies8 + 0.6, 0.3); write("#b-tcl", T.copies8 + 0.2, 0.6);
    fade("#b-bars", 1, T.four8 - 0.3, 0.2);
    draw("#b-baxis", T.four8 - 0.3, 0.3);
    write(["#b-bl0", "#b-bl1", "#b-bl2", "#b-bl3"], T.four8, 0.3);
    write("#b-b14", T.one8, 0.6);

    // 9. instead only 00 or 11, half the time each
    blurOut("#b-tc", T.instead9);
    fade("#b-b14", 0, T.instead9, 0.25);
    fade(["#b-bgold0", "#b-bgold3"], 1, T.instead9 + 0.4, 0.5);
    write("#b-bhalf", T.half9, 0.7);

    // 10. entangled: answers locked together, no arrow of its own
    blurOut("#b-bars", T.ent10);
    draw("#b-ear", T.ent10, 0.4);
    draw(["#b-e0", "#b-e1"], T.ent10 + 0.1, 0.6); draw(["#b-e0-eq", "#b-e1-eq"], T.ent10 + 0.4, 0.3); draw(["#b-e0-arr", "#b-e1-arr"], T.ent10 + 0.55, 0.25);
    draw("#b-elink", T.ent10 + 0.5, 0.6); write("#b-entl", T.ent10 + 0.6, 0.5);
    write("#b-same", T.answers10, 0.6);
    fade(["#b-e0-arr", "#b-e1-arr"], 0, T.neither10, 0.4);
    draw(["#b-eblur0", "#b-eblur1"], T.neither10 + 0.2, 0.5);
    write("#b-noa0", T.neither10 + 0.3, 0.45); write("#b-noa1", T.neither10 + 0.45, 0.45);

    // 11. not CNOT's fault: the no-cloning theorem
    blurOut(["#b-ent", "#b-plus"], T.own10);
    move("#b-circ", { ...POSE.left }, { ...POSE.mid, immediateRender: false }, T.own10 + 0.1, 0.7);
    write("#b-faultl", T.not11 + 0.1, 0.6);
    blurOut(["#b-circ", "#b-fault"], T.fault11 + 0.45);
    write("#b-tht", T.no11, 0.8); draw("#b-thu", T.no11 + 0.6, 0.4);
    draw("#b-anyc", T.circuit11, 0.5); write("#b-anyl", T.circuit11 + 0.15, 0.4);
    draw(["#b-ug", "#b-ug-eq"], T.unknown11 - 0.1, 0.4); draw("#b-ucl", T.unknown11 + 0.15, 0.3); write("#b-uq", T.unknown11 + 0.35, 0.15);
    draw(["#b-uo", "#b-uo-eq", "#b-uocl"], T.unknown11 + 0.2, 0.4); draw("#b-uc", T.unknown11 + 0.3, 0.4);
    draw("#b-ux", T.state11, 0.3);

    // 12. why: many copies, measured along different directions, would reveal the arrow
    blurOut("#b-th", T.why11);
    write("#b-whyl", T.why11 + 0.05, 0.3);
    blurOut("#b-why", T.copies12 - 0.1);
    ${JSON.stringify(SX)}.forEach((x, i) => {
      draw(["#b-m" + i, "#b-m" + i + "-eq"], T.copies12 + i * 0.08, 0.5);
      write("#b-mq" + i, T.copies12 + 0.3 + i * 0.08, 0.15);
      draw("#b-ms" + i, T.measure12 + i * 0.28, 0.3);
      write("#b-mr" + i, T.measure12 + 0.2 + i * 0.28, 0.15);
    });
    draw("#b-mfeed", T.work12 - 0.2, 0.4);
    draw(["#b-mbig", "#b-mbig-eq"], T.work12 - 0.1, 0.5); draw("#b-mbig-arr", T.arrow12, 0.35);
    write("#b-marr", T.arrow12 + 0.05, 0.4);

    // 13. measuring one qubit gives just one bit; copying would sneak past that
    blurOut("#b-many", T.off12);
    draw(["#b-q13", "#b-q13-eq"], T.measuring13, 0.5); draw("#b-q13cl", T.measuring13 + 0.4, 0.3);
    draw("#b-meter", T.measuring13 + 0.3, 0.6); write(["#b-mt0", "#b-mt1"], T.measuring13 + 0.7, 0.2); draw("#b-needle", T.measuring13 + 0.8, 0.2);
    draw("#b-m1ar", T.one13 - 0.2, 0.25); write("#b-one", T.one13, 0.2); write("#b-onebit", T.one13 + 0.2, 0.4);
    draw("#b-tcp", T.copying13, 0.35);
    draw("#b-sneak", T.copying13 + 0.35, 0.65);
    draw("#b-sneakx", T.past13, 0.3);

    // 14. the copier breaks: grey is visible, a qubit's shade is not
    blurOut("#b-m13", T.off13);
    draw("#b-scp", T.photo14, 0.6); draw("#b-crack", T.breaks14, 0.35);
    draw("#b-div", T.breaks14 + 0.3, 0.4);
    draw("#b-gp14", T.anyone14, 0.4); draw("#b-e14", T.anyone14 + 0.1, 0.4); draw("#b-e14-pupil", T.anyone14 + 0.4, 0.15);
    write("#b-seegrey", T.grey14, 0.4); draw("#b-tk14", T.grey14 + 0.3, 0.3);
    draw(["#b-q14", "#b-q14-eq"], T.nobody14, 0.5); draw("#b-q14cl", T.nobody14 + 0.4, 0.3); draw("#b-e14b", T.nobody14 + 0.5, 0.4);
    write("#b-cantsee", T.nobody14 + 0.8, 0.5);
    write("#b-q14q", T.shade14, 0.2);

    // 15. you can still repeat a known recipe
    blurOut("#b-brk", T.off14);
    draw("#b-card", T.off14 + 0.15, 0.7); write("#b-rect", T.off14 + 0.5, 0.35);
    write("#b-r00", T.many15, 0.2); draw("#b-row0", T.many15 + 0.1, 0.5); write("#b-rs0", T.many15 + 0.2, 0.5);
    draw(["#b-rg0", "#b-rg0-eq"], T.many15 + 0.5, 0.4); draw("#b-rg0-arr", T.many15 + 0.8, 0.2);
    write("#b-known", T.known15, 0.5); draw("#b-kund", T.known15 + 0.4, 0.3);
    draw("#b-rt0", T.known15 + 0.8, 0.3);
    [1, 2].forEach((i) => {
      const t0 = T.repeat15 - 0.35 + (i - 1) * 0.5;
      write("#b-r0" + i, t0, 0.15); draw("#b-row" + i, t0, 0.3); write("#b-rs" + i, t0 + 0.05, 0.25);
      draw(["#b-rg" + i, "#b-rg" + i + "-eq", "#b-rg" + i + "-arr"], t0 + 0.15, 0.3); draw("#b-rt" + i, t0 + 0.4, 0.25);
    });

    // 16. closing: no circuit copies an unknown state
    blurOut("#b-rec", T.off15);
    write("#b-take", T.no16, 1.0);
    draw("#b-fw", T.cnot16 - 0.1, 0.5); draw("#b-fg", T.cnot16 + 0.1, 0.5); write("#b-fcn", T.cnot16 + 0.1, 0.3);
    write("#b-fi0", T.cnot16 + 0.3, 0.2);
    write("#b-fr0", T.copies16, 0.4); draw("#b-ft0", T.zero16 + 0.1, 0.25);
    write("#b-fr1", T.one16 - 0.2, 0.4); draw("#b-ft1", T.one16 + 0.2, 0.25);
    write("#b-fip", T.entangles16, 0.25);
    draw("#b-flink", T.entangles16 + 0.3, 0.6);
    write("#b-fent", T.between16, 0.6);

    // ---------- continuous values ----------
    // state arrows: scheduled angle plus a gentle hand-held wobble
    onFrame((t) => ARROWS.forEach((a) => {
      const ang = sched(a.segs, t, a.init) + a.wob * Math.sin(t * 1.6 + a.ph);
      $(a.id).setAttribute("transform", "rotate(" + ang.toFixed(2) + " " + a.cx + " " + a.cy + ")");
    }));
    // outcome bars: four even bars for true copies, then only 00 and 11
    const BX = ${JSON.stringify(BX)};
    const BAR_SEGS = [0, 1, 2, 3].map((i) => [[T.four8, T.four8 + 0.9, 0, 0.25], [T.instead9 + 0.05, T.instead9 + 1.0, 0.25, i === 0 || i === 3 ? 0.5 : 0]]);
    onFrame((t) => BX.forEach((x, i) => {
      const v = sched(BAR_SEGS[i], t, 0), h = v * ${BH}, top = ${BASE} - h;
      $("b-brect" + i).setAttribute("y", top.toFixed(2)); $("b-brect" + i).setAttribute("height", h.toFixed(2));
      $("b-bcap" + i).setAttribute("y1", top.toFixed(2)); $("b-bcap" + i).setAttribute("y2", top.toFixed(2));
      $("b-bcap" + i).style.opacity = v > 0.004 ? "1" : "0";
      const p = $("b-bp" + i + "t");
      p.textContent = Math.round(v * 100) + "%";
      p.style.top = (top - 34 - ${ctr(42)}).toFixed(1) + "px";
      p.style.opacity = v > 0.01 ? "1" : "0";
      p.style.color = t > T.half9 && (i === 0 || i === 3) ? "${GOLD}" : "${INK}";
    }));
    // the outputs flicker 0 0 / 1 1 in step, never 0 1
    onFrame((t) => {
      const on = t >= T.zero9 && t < T.ent10;
      const face = Math.floor((t - T.zero9) / 0.6) % 2;
      ["b-f0t", "b-f0b"].forEach((id) => { $(id).style.opacity = on && face === 0 ? "1" : "0"; });
      ["b-f1t", "b-f1b"].forEach((id) => { $(id).style.opacity = on && face === 1 ? "1" : "0"; });
    });
    // the bound pages flip together: both black or both white
    const FLIPS6 = ${JSON.stringify(FLIPS6)}, FD = 0.3;
    onFrame((t) => {
      let face = -1, sx = 1;
      for (const [a, f] of FLIPS6) {
        if (t < a) break;
        if (t < a + FD) { const u = (t - a) / FD; sx = Math.max(0.04, Math.abs(Math.cos(Math.PI * u))); if (u >= 0.5) face = f; }
        else face = f;
      }
      [0, 1].forEach((i) => {
        $("b-bp" + i).style.transform = "scaleX(" + sx.toFixed(3) + ")";
        $("b-bpw" + i).style.opacity = face === 0 ? "1" : "0";
        $("b-bpk" + i).style.opacity = face === 1 ? "1" : "0";
      });
    });
    // the meter needle hunts, then settles on 1
    onFrame((t) => {
      const a0 = T.measuring13 + 1.0;
      let ang = -40;
      if (t > a0) ang = t < T.one13 - 0.1 ? -40 + 38 * Math.sin((t - a0) * 7) * Math.min(1, (t - a0) * 2) : 42 + 3 * Math.sin(t * 2.3);
      $("b-needle").setAttribute("transform", "rotate(" + ang.toFixed(2) + " ${M[0]} ${M[1] + 40})");
    });
    // pupils look around
    onFrame((t) => {
      $("b-e6-pupil").setAttribute("transform", "translate(" + (12 * Math.sin(t * 1.3)).toFixed(2) + " " + (8 + 4 * Math.sin(t * 0.9)).toFixed(2) + ")");
      $("b-e14-pupil").setAttribute("transform", "translate(" + (10 * Math.sin(t * 1.1)).toFixed(2) + " " + (6 + 4 * Math.sin(t * 1.7)).toFixed(2) + ")");
    });
    // the closing link breathes through the hold
    onFrame((t) => {
      $("b-flinkp").style.opacity = t < T.between16 ? "1" : (0.82 + 0.18 * Math.cos((t - T.between16) * 2.4)).toFixed(3);
    });
  `;
  return { html, script, css: "" };
}
