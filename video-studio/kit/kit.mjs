// Drawing kit shared by every lesson scene: the rough.js pen, the seeded wobble for strokes
// whose length must be known exactly, hand-drawn math glyphs and the label helper.
// A scene gets all of this as `k` (see KIT.md).
import rough from "roughjs";
import { GLYPHS, hand } from "./glyphs.mjs";

export const INK = "#e8e8e8";
export const GOLD = "#d9b463";
export const GROUND = "#17191c";
export const DIM = "rgba(232,232,232,0.28)";

export function makePen(startSeed = 11) {
  const gen = rough.generator();
  let seedCounter = startSeed;
  const pen = (o = {}) => ({ stroke: INK, strokeWidth: 3, roughness: 1.4, bowing: 1.2, seed: seedCounter++, ...o });
  const goldPen = (o = {}) => pen({ stroke: GOLD, strokeWidth: 3.6, ...o });

  // rough.js drawable -> SVG paths. Stroked paths get pathLength=1 so draw() can pen them on.
  const svgOf = (drawable) =>
    gen
      .toPaths(drawable)
      .map((p) => {
        const filled = p.fill && p.fill !== "none";
        if (filled) return `<path class="solid" d="${p.d}" fill="${p.fill}" stroke="none"/>`;
        return `<path class="ink" pathLength="1" d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      })
      .join("");
  const r = {
    line: (x1, y1, x2, y2, o) => svgOf(gen.line(x1, y1, x2, y2, o ?? pen())),
    rect: (x, y, w, h, o) => svgOf(gen.rectangle(x, y, w, h, o ?? pen())),
    circle: (x, y, d, o) => svgOf(gen.circle(x, y, d, o ?? pen())),
    ellipse: (x, y, w, h, o) => svgOf(gen.ellipse(x, y, w, h, o ?? pen())),
    curve: (pts, o) => svgOf(gen.curve(pts, o ?? pen())),
    poly: (pts, o) => svgOf(gen.polygon(pts, o ?? pen())),
    linear: (pts, o) => svgOf(gen.linearPath(pts, o ?? pen())),
    arc: (x, y, w, h, start, stop, closed, o) => svgOf(gen.arc(x, y, w, h, start, stop, closed ?? false, o ?? pen())),
    path: (d, o) => svgOf(gen.path(d, o ?? pen())),
  };
  // Arrow from (x1,y1) to (x2,y2) with a two-stroke head.
  const arrow = (x1, y1, x2, y2, o = {}, head = 18) => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const w = (o.strokeWidth ?? 3) * 0.85;
    const hp = (da) => [x2 - head * Math.cos(a + da), y2 - head * Math.sin(a + da)];
    const [l, rr] = [hp(0.45), hp(-0.45)];
    return r.line(x1, y1, x2, y2, pen(o)) + r.line(x2, y2, l[0], l[1], pen({ ...o, strokeWidth: w })) + r.line(x2, y2, rr[0], rr[1], pen({ ...o, strokeWidth: w }));
  };
  return { gen, pen, goldPen, r, arrow };
}

// Seeded smooth wobble, for hand-made strokes whose length must be known exactly
// (a trace that follows a value, a dial arc). Returns { d, frac } where frac[i] is the
// share of the total length reached at point i.
export function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function normalAt(pts, i) {
  const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  return [-dy / len, dx / len];
}
export function wobbly(points, amp, seed) {
  const rnd = mulberry32(seed);
  const [p1, p2, f1, f2] = [rnd() * 6.28, rnd() * 6.28, 0.018 + rnd() * 0.01, 0.05 + rnd() * 0.02];
  let s = 0;
  const out = points.map(([x, y], i) => {
    if (i > 0) s += Math.hypot(x - points[i - 1][0], y - points[i - 1][1]);
    const [nx, ny] = normalAt(points, i);
    const off = amp * (0.65 * Math.sin(s * f1 + p1) + 0.35 * Math.sin(s * f2 + p2));
    return [x + nx * off, y + ny * off];
  });
  const lengths = [0];
  for (let i = 1; i < out.length; i++) lengths.push(lengths[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
  const total = lengths[lengths.length - 1] || 1;
  const d = "M" + out.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L");
  return { d, frac: lengths.map((l) => +(l / total).toFixed(4)) };
}

// A handwritten label, absolutely placed inside its parent. `html` may contain θ π ψ φ ⟨ ⟩ √ → ≈;
// they are swapped for hand-drawn glyphs because Caveat has none of them.
export const lbl = (id, x, y, w, size, html, extra = "") =>
  `<div class="lbl hand" id="${id}" style="left:${x}px;top:${y}px;width:${w}px;font-size:${size}px;${extra}">${hand(html)}</div>`;

export { GLYPHS, hand };
