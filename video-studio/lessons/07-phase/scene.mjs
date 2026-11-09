// Lesson 7, "Phase: the hidden direction". One picture carries the film: the qubit arrow inside
// a hand-drawn globe. Latitude (how far up or down) sets the odds; longitude (which way it faces
// round the globe) is the phase. See plan.md for the beat plan.
export const phrases = [["phi", "φ"]];

const PI = Math.PI;
const R = 290; // globe radius in the globe's own 800x800 svg
const K = 0.24; // squash of the rings (equator ry = K * R)
const C = 400; // globe centre inside its svg

// Projection: polar angle th (0 = up), phase ph (0 = right on screen, pi/2 faces the viewer).
const P = (th, ph, g = 1) => [C + g * R * Math.sin(th) * Math.cos(ph), C + g * (-R * Math.cos(th) + K * R * Math.sin(th) * Math.sin(ph))];

export default function scene(k) {
  const { r, pen, goldPen, arrow, lbl, cue, INK, GOLD } = k;
  const DIMINK = "rgba(232,232,232,0.38)";
  const GOLDFILL = { fill: GOLD, fillStyle: "hachure", hachureGap: 9, fillWeight: 2 };

  // ---------- Times (seconds), cued to the voice ----------
  const T = {
    pzGate: cue(0, "gate", 0, -0.15), pzQubit: cue(0, "qubit", 0, -0.1), pzChange: cue(0, "change"),
    pzOdds: cue(0, "odds", 0, -0.15), pzEq: cue(0, "unchanged", 0, -0.1),
    l1: cue(1), arrow1: cue(1, "an"), up: cue(1, "up", 0, -0.15), down: cue(1, "down", 0, -0.15),
    odds2: cue(2, "odds", 0, -0.15), how: cue(2, "how", 0, -0.1), lat2: cue(2, "latitude", 0, -0.1), globe2: cue(3, "globe", 0, -0.15),
    l3: cue(3), cities: cue(3, "cities", 0, -0.15), equally: cue(3, "equally", 0, -0.1), north: cue(3, "north", 0, -0.1), however: cue(3, "however", 0, -0.1),
    l4: cue(4), lon4: cue(4, "longitude", 0, -0.35), arrow4: cue(4, "arrow", 0, -0.2), faces: cue(4, "faces", 0, -0.1), phase4: cue(4, "phase", 0, -0.3),
    l5: cue(5), z5: cue(5, "zgate", 0, -0.15), spins: cue(5, "spins", 0, -0.1), halfway: cue(5, "halfway", 0, -0.1), stay: cue(5, "odds", 0, -0.1),
    l6: cue(6), quarter: cue(6, "quarter", 0, -0.1), eighth: cue(6, "tan", 0, 0.05),
    l7: cue(7), equator: cue(7, "equator", 0, -0.15), fifty7: 37.35,
    l8: cue(8), apply: cue(8, "apply", 0, -0.1), swings: cue(8, "swings", 0, -0.2), still: 41.15,
    l9: cue(9), nothing: cue(9, "nothing", 0, -0.15), bars9: cue(9, "bars", 0, -0.1), arrow9: cue(9, "arrow", 0, -0.15),
    l10: cue(10), add: cue(10, "add", 0, -0.1), hgate: cue(10, "hgate", 0, -0.15), updown: cue(10, "up", 0, -0.15),
    l11: cue(11), straightUp: cue(11, "straight", 0, -0.15), zero11: cue(11, "zero", 0, -0.1),
    l12: cue(12), straightDown: cue(12, "straight", 0, -0.3), one12: cue(12, "one", 0, -0.1),
    l13: cue(13), same13: cue(13, "same", 0, -0.1), opp: cue(13, "opposite", 0, -0.1), phase13: cue(13, "phase", 0, -0.1),
    l14: cue(14), globe14: cue(14, "globe", 0, -0.2), maps: cue(14, "maps", 0, -0.1), lon14: cue(14, "longitude", 0, -0.1),
    meas: cue(14, "measurement", 0, -0.1), phase14: cue(14, "phase", 0, -0.1), directly: cue(14, "directly", 0, -0.1),
    l15: cue(15), later: cue(15, "later", 0, -0.15), turns: cue(15, "phase", 0, -0.5), odds15: cue(15, "odds", 0, -0.1), interf: cue(15, "interference", 0, -0.15),
    l16: cue(16), formula: cue(16, "formula", 0, -0.25), theta: cue(16, "theta", 0, -0.1), phi: cue(16, "phi", 0, -0.15),
    // The transcript drifts late on the last line; these come from its pauses (silence at 81.19 to 81.69).
    l17: cue(17), lon17: 80.45, invis: 81.65, decides: 82.85,
  };

  // ---------- A globe: 800x800 div, centre (400,400), moved and scaled as a whole ----------
  const merid = (ph, o) => r.curve(Array.from({ length: 15 }, (_, i) => P((PI * i) / 14, ph)), o);
  function globe(id, extras = "") {
    const dashes = Array.from({ length: 21 }, (_, i) => {
      const y0 = C - R + 14 + i * 26.5;
      return r.line(C, y0, C, y0 + 13, pen({ strokeWidth: 2, roughness: 0.4, stroke: DIMINK }));
    }).join("");
    const shell = `<g id="${id}-shell">${r.circle(C, C, 2 * R, pen({ strokeWidth: 3.2, curveFitting: 1 }))}${dashes}</g>`;
    const grid =
      `<g id="${id}-grid">` +
      r.arc(C, C, 2 * R, 2 * K * R, 0, PI, false, pen({ strokeWidth: 2.6 })) +
      r.arc(C, C, 2 * R, 2 * K * R, PI, 2 * PI, false, pen({ strokeWidth: 2.2, stroke: DIMINK })) +
      [PI / 6, PI / 3, (2 * PI) / 3, (5 * PI) / 6].map((ph) => merid(ph, pen({ strokeWidth: 1.8, stroke: "rgba(232,232,232,0.6)" }))).join("") +
      `</g>`;
    const dyn =
      `<g id="${id}-ringg"><path id="${id}-ringB" fill="none" stroke="${GOLD}" stroke-opacity=".45" stroke-width="3" stroke-dasharray="10 11" stroke-linecap="round"/>` +
      `<path id="${id}-ringF" fill="none" stroke="${GOLD}" stroke-width="3.4" stroke-dasharray="12 9" stroke-linecap="round"/></g>` +
      `<g id="${id}-trg"><path id="${id}-trB" fill="none" stroke="${GOLD}" stroke-opacity=".5" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path id="${id}-trF" fill="none" stroke="${GOLD}" stroke-opacity=".85" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>` +
      `<g id="${id}-arrg" style="color:${GOLD}"><g id="${id}-arri">` +
      `<path id="${id}-arr" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle id="${id}-tip" r="10" fill="currentColor"/></g>` +
      `<circle id="${id}-hub" cx="${C}" cy="${C}" r="8" fill="${INK}"/></g>`;
    return { shell, grid, dyn, extras };
  }
  const globeDiv = (id, cx, cy, g) =>
    `<div class="obj" id="${id}" style="left:${cx - C}px;top:${cy - C}px;width:800px;height:800px">` +
    `<svg class="sk" width="800" height="800" viewBox="0 0 800 800">${g.shell}${g.grid}${g.extras}${g.dyn}</svg></div>`;

  // ---------- Globe 1 (lines 1 to 13): its own extras ----------
  const PH_A = (130 * PI) / 180, PH_B = (50 * PI) / 180, TH_R = PI / 3;
  const house = (id, n) =>
    `<g id="${id}"><g id="${id}-s">` +
    r.rect(-17, -36, 34, 30, pen({ strokeWidth: 2.6, roughness: 1 })) +
    r.poly([[-23, -34], [0, -56], [23, -34]], pen({ strokeWidth: 2.6, roughness: 1 })) +
    r.rect(-5, -20, 10, 14, pen({ strokeWidth: 1.8, roughness: 0.6 })) +
    r.line(0, -6, 0, 0, pen({ strokeWidth: 2.4, roughness: 0.4 })) +
    `<circle cx="0" cy="0" r="7" fill="${INK}"/></g></g>`;
  const g1extras =
    `<g id="b-g1-eqg">${r.arc(C, C, 2 * R, 2 * K * R, 0, PI, false, goldPen({ strokeWidth: 4 }))}${r.arc(C, C, 2 * R, 2 * K * R, PI, 2 * PI, false, goldPen({ strokeWidth: 3, stroke: "rgba(217,180,99,0.45)" }))}</g>` +
    `<g id="b-g1-merA">${merid(PH_A, goldPen({ strokeWidth: 3 }))}</g><g id="b-g1-merB">${merid(PH_B, goldPen({ strokeWidth: 3 }))}</g>` +
    `<g id="b-g1-brk"><path id="b-g1-brA" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path id="b-g1-brB" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>` +
    `<g id="b-g1-pins">${house("b-g1-pinA")}${house("b-g1-pinB")}</g>`;
  const G1 = globe("b-g1", g1extras);
  const G2 = globe("b-g2");
  const G3 = globe("b-g3");
  const G4 = globe("b-g4");

  // ---------- Odds bars ----------
  // Two bars (0 and 1); fill is a gold hachure clipped to the live height, with a gold top edge.
  function bars(p, x0, base, w, gap, H, opts = {}) {
    const xs = [x0, x0 + w + gap];
    const frame = `<g id="${p}-frame">${xs.map((x) => r.rect(x, base - H, w, H, pen({ strokeWidth: 2.2, roughness: 0.9, stroke: "rgba(232,232,232,0.55)" }))).join("")}${r.line(x0 - 24, base, xs[1] + w + 24, base, pen({ strokeWidth: 3 }))}</g>`;
    const clips = xs.map((x, i) => `<clipPath id="${p}-c${i}"><rect id="${p}-c${i}r" x="${x - 4}" y="${base}" width="${w + 8}" height="0"/></clipPath>`).join("");
    const fills = `<g id="${p}-fill">${xs.map((x, i) => `<g clip-path="url(#${p}-c${i})">${r.rect(x + 3, base - H, w - 6, H, pen({ ...GOLDFILL, stroke: "none", roughness: 1.1 }))}</g>`).join("")}` +
      xs.map((x, i) => `<line id="${p}-t${i}" x1="${x}" x2="${x + w}" y1="${base}" y2="${base}" stroke="${GOLD}" stroke-width="4.5" stroke-linecap="round"/>`).join("") + `</g>`;
    const ls = opts.labelSize ?? 48;
    const labels = xs.map((x, i) => lbl(`${p}-l${i}`, x - 30, base + 2, w + 60, ls, String(i))).join("");
    const pcts = opts.pct ? xs.map((x, i) => lbl(`${p}-p${i}`, x - 40, base - 60, w + 80, 40, "50%")).join("") : "";
    return { svg: `<defs>${clips}</defs>${frame}${fills}`, html: labels + pcts, xs };
  }
  const OB = bars("b-ob", 1330, 700, 120, 40, 420, { pct: true });
  const OC = bars("b-oc", 1330, 700, 120, 40, 420, { pct: true });
  const MBL = bars("b-mbl", 196, 600, 48, 26, 170, { labelSize: 40 });
  const MBR = bars("b-mbr", 1618, 600, 48, 26, 170, { labelSize: 40 });

  // ---------- Small pieces ----------
  const gateBox = (id, x, y, s, o) => `<g id="${id}">${r.rect(x - s / 2, y - s / 2, s, s, pen({ strokeWidth: 3, roughness: 1, ...o }))}</g>`;
  const tick = (id, x, y, s = 1) => `<g id="${id}">${r.linear([[x, y + 14 * s], [x + 12 * s, y + 28 * s], [x + 38 * s, y - 4 * s]], goldPen({ strokeWidth: 4.4, roughness: 0.9 }))}</g>`;
  const dial = (id, cx, cy) =>
    `<g id="${id}">${r.circle(cx, cy, 140, pen({ strokeWidth: 3 }))}` +
    [0, PI / 2, PI, (3 * PI) / 2].map((a) => r.line(cx + 60 * Math.cos(a), cy + 60 * Math.sin(a), cx + 74 * Math.cos(a), cy + 74 * Math.sin(a), pen({ strokeWidth: 2.4, roughness: 0.5 }))).join("") +
    `<path id="${id}-w" fill="${GOLD}" fill-opacity=".28" stroke="${GOLD}" stroke-width="3"/>` +
    `<line id="${id}-p" x1="${cx}" y1="${cy}" x2="${cx + 58}" y2="${cy}" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="${cx}" cy="${cy}" r="7" fill="${INK}"/></g>`;
  const DIALS = [1310, 1480, 1650];

  // Map (line 14)
  const coast = r.curve([[262, 420], [300, 352], [372, 330], [430, 372], [468, 340], [540, 318], [612, 360], [660, 330], [736, 368], [742, 450], [690, 520], [600, 548], [520, 512], [452, 560], [380, 540], [300, 520], [262, 470], [262, 420]], pen({ strokeWidth: 2.8, roughness: 1.3 }));
  const mapSvg =
    `<g id="b-map">${r.rect(220, 270, 560, 330, pen({ strokeWidth: 3.2, roughness: 1 }))}${coast}` +
    [360, 500, 640].map((x) => r.curve([[x, 276], [x + (x - 500) * 0.06, 435], [x, 594]], pen({ strokeWidth: 2, stroke: "rgba(232,232,232,0.55)" }))).join("") +
    `${r.line(226, 435, 774, 435, pen({ strokeWidth: 1.8, stroke: "rgba(232,232,232,0.4)" }))}</g>`;
  // Meter (line 14): a half dial that only ever lands on 0 or 1.
  const MT = { cx: 960, cy: 520, r: 92 };
  const meterSvg =
    `<g id="b-mt">${r.arc(MT.cx, MT.cy, 2 * MT.r, 2 * MT.r, PI, 2 * PI, false, pen({ strokeWidth: 3.2 }))}${r.line(MT.cx - MT.r - 14, MT.cy, MT.cx + MT.r + 14, MT.cy, pen({ strokeWidth: 3 }))}` +
    [PI + 0.32, 2 * PI - 0.32].map((a) => r.line(MT.cx + 72 * Math.cos(a), MT.cy + 72 * Math.sin(a), MT.cx + 90 * Math.cos(a), MT.cy + 90 * Math.sin(a), pen({ strokeWidth: 3, roughness: 0.4 }))).join("") +
    `<line id="b-mt-n" x1="${MT.cx}" y1="${MT.cy}" x2="${MT.cx}" y2="${MT.cy - 70}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="${MT.cx}" cy="${MT.cy}" r="8" fill="${INK}"/></g>`;

  // Formula with underline and circle hooks (line 16)
  const ul = (id) => `<svg style="position:absolute;left:0.02em;top:0.92em;width:0.52em;height:0.2em;overflow:visible" viewBox="0 0 70 20"><g id="${id}">${r.line(2, 8, 68, 11, pen({ strokeWidth: 4.5, roughness: 0.8 }))}</g></svg>`;
  const phiRing = `<svg style="position:absolute;left:-0.1em;top:-0.1em;width:0.86em;height:1.08em;overflow:visible" viewBox="0 0 130 125"><g id="b-phic">${r.ellipse(65, 64, 120, 112, goldPen({ strokeWidth: 5, roughness: 1.2 }))}</g></svg>`;
  const formula =
    `|ψ⟩ = cos(<span class="b-w">θ${ul("b-ul1")}</span>/2)|0⟩ + e<sup>i<span class="b-w">φ${phiRing}</span></sup> sin(<span class="b-w">θ${ul("b-ul2")}</span>/2)|1⟩`;

  const fUnder = r.curve([[4, 14], [130, 8], [270, 15], [372, 8]], goldPen({ strokeWidth: 4.6, roughness: 1 }));

  // ---------- Board svg (board coordinates) ----------
  const boardSvg =
    // Puzzle (line 0)
    `<g id="b-pz-wire">${r.line(420, 520, 890, 520, pen({ strokeWidth: 3 }))}${r.line(1030, 520, 1500, 520, pen({ strokeWidth: 3 }))}</g>` +
    `<g id="b-pz-bars">` +
    [600, 1320].map((cx) => [0, 1].map((i) => {
      const x = cx - 61 + i * 74;
      return r.rect(x, 610, 48, 180, pen({ strokeWidth: 2.2, roughness: 0.9, stroke: "rgba(232,232,232,0.55)" })) + r.rect(x + 3, 700, 42, 90, pen({ ...GOLDFILL, stroke: GOLD, strokeWidth: 3, roughness: 1 }));
    }).join("") + r.line(cx - 90, 790, cx + 90, 790, pen({ strokeWidth: 3 }))).join("") +
    `</g>` +
    // Odds bars
    OB.svg + OC.svg + MBL.svg + MBR.svg +
    `<g id="b-eqs">${r.line(734, 432, 786, 430, goldPen({ strokeWidth: 5, roughness: 0.6 }))}${r.line(734, 454, 786, 452, goldPen({ strokeWidth: 5, roughness: 0.6 }))}</g>` +
    tick("b-tk5", 1484, 160, 0.9) + tick("b-tk8", 1704, 160, 0.9) +
    // Phase arc near the north pole of globe 1 (board coords; centre of globe 1 is 760,470)
    `<g id="b-pharc">${r.arc(760, 232, 150, 40, 0.15, PI - 0.05, false, goldPen({ strokeWidth: 3.4, roughness: 0.8 }))}${r.line(686, 234, 680, 212, goldPen({ strokeWidth: 3 }))}${r.line(686, 234, 703, 220, goldPen({ strokeWidth: 3 }))}</g>` +
    // Gate boxes
    gateBox("b-z5", 260, 520, 120) + gateBox("b-z8", 260, 520, 120) +
    // Dials (line 6)
    DIALS.map((x, i) => dial(`b-d${i}`, x, 470)).join("") +
    // Thought bubble and loose circle (line 9)
    `<g id="b-bub">${r.ellipse(300, 362, 310, 112, pen({ strokeWidth: 2.6 }))}${r.circle(280, 432, 18, pen({ strokeWidth: 2.2 }))}${r.circle(268, 452, 9, pen({ strokeWidth: 2 }))}</g>` +
    `<g id="b-strike">${r.line(178, 366, 424, 356, goldPen({ strokeWidth: 4.4 }))}</g>` +
    `<g id="b-loop">${r.ellipse(1470, 518, 520, 570, pen({ strokeWidth: 2.6, roughness: 2 }))}</g>` +
    // Circuits (line 10)
    `<g id="b-cl">${r.line(390, 196, 478, 196, pen())}${r.line(562, 196, 650, 196, pen())}</g>` + gateBox("b-hl", 520, 196, 84) +
    `<g id="b-cr">${r.line(1220, 196, 1298, 196, pen())}${r.line(1382, 196, 1418, 196, pen())}${r.line(1502, 196, 1580, 196, pen())}</g>` + gateBox("b-zr", 1340, 196, 84) + gateBox("b-hr", 1460, 196, 84) +
    gateBox("b-zrg", 1340, 196, 84, { stroke: GOLD, strokeWidth: 3.8 }) +
    `<g id="b-ghL"><path d="M520 470 L520 318 M506 338 L520 318 L534 338" fill="none" stroke="${INK}" stroke-opacity=".5" stroke-width="4" stroke-dasharray="10 9" stroke-linecap="round"/></g>` +
    `<g id="b-ghR"><path d="M1400 510 L1400 662 M1386 642 L1400 662 L1414 642" fill="none" stroke="${INK}" stroke-opacity=".5" stroke-width="4" stroke-dasharray="10 9" stroke-linecap="round"/></g>` +
    `<g id="b-dbl">${arrow(760, 770, 1240, 770, { stroke: GOLD, strokeWidth: 4 }, 22)}${r.line(760, 770, 780, 760, goldPen({ strokeWidth: 3.4 }))}${r.line(760, 770, 780, 780, goldPen({ strokeWidth: 3.4 }))}</g>` +
    // Map, meter and the dotted line with its cross (line 14)
    mapSvg + meterSvg +
    `<g id="b-dot"><path d="M1012 418 L1196 176" fill="none" stroke="${INK}" stroke-opacity=".6" stroke-width="3.5" stroke-dasharray="3 12" stroke-linecap="round"/></g>` +
    `<g id="b-x">${r.line(1080, 270, 1132, 318, goldPen({ strokeWidth: 5 }))}${r.line(1132, 268, 1078, 320, goldPen({ strokeWidth: 5 }))}</g>` +
    // Interference wire and H (line 15)
    `<g id="b-iw">${r.line(220, 470, 372, 470, pen())}${r.line(488, 470, 640, 470, pen())}</g>` + gateBox("b-ih", 430, 470, 116);

  // ---------- HTML ----------
  const html = `
    <div class="obj" id="b-pz-boxd" style="left:890px;top:450px;width:140px;height:140px">
      <svg class="sk" width="140" height="140" viewBox="0 0 140 140"><g id="b-pz-box">${r.rect(6, 6, 128, 128, pen({ strokeWidth: 3.2, roughness: 1 }))}</g></svg>
      ${lbl("b-pz-qm", 0, 8, 140, 100, "?", `color:${GOLD}`)}
    </div>
    ${lbl("b-pz-q", 236, 486, 170, 48, "qubit")}
    ${lbl("b-pz-bf", 480, 540, 240, 40, "odds before")}
    ${lbl("b-pz-af", 1200, 540, 240, 40, "odds after")}
    ${[600, 1320].map((cx, j) => [0, 1].map((i) => lbl(`b-pz-n${j}${i}`, cx - 61 + i * 74 - 16, 792, 80, 40, String(i))).join("")).join("")}
    ${lbl("b-pz-eq", 900, 640, 120, 110, "=", `color:${GOLD}`)}

    ${globeDiv("b-g1", 760, 470, G1)}
    ${globeDiv("b-g2", 520, 490, G2)}
    ${globeDiv("b-g3", 1350, 470, G3)}
    ${globeDiv("b-g4", 560, 560, G4)}

    <div class="obj" id="b-bd" style="left:0px;top:0px;width:1920px;height:1080px">
      <svg class="sk" width="1920" height="1080" viewBox="0 0 1920 1080">${boardSvg}</svg>
    </div>

    ${lbl("b-n0", 710, 92, 100, 56, "0", `color:${GOLD}`)}
    ${lbl("b-n1", 710, 768, 100, 56, "1", `color:${GOLD}`)}
    ${OB.html}${OC.html}${MBL.html}${MBR.html}
    ${lbl("b-obh", 1300, 140, 170, 48, "odds", "text-align:left")}
    ${lbl("b-och", 1300, 140, 170, 48, "odds", "text-align:left")}
    ${lbl("b-eqn", 1090, 290, 640, 56, "equally far north", "text-align:left")}
    ${lbl("b-lon", 990, 168, 280, 56, "longitude", `color:${GOLD};text-align:left`)}
    ${lbl("b-ph", 400, 108, 220, 64, "phase", `color:${GOLD};text-align:right`)}
    ${lbl("b-z5l", 200, 462, 120, 80, "Z", `color:${GOLD}`)}
    ${lbl("b-z8l", 200, 462, 120, 80, "Z", `color:${GOLD}`)}
    ${lbl("b-half", 140, 236, 340, 44, "half turn", "text-align:right")}
    ${lbl("b-same", 1528, 140, 200, 48, "same", `color:${GOLD};text-align:left`)}
    ${DIALS.map((x, i) => lbl(`b-dl${i}`, x - 60, 300, 120, 60, ["Z", "S", "T"][i], i === 0 ? `color:${GOLD}` : "")).join("")}
    ${DIALS.map((x, i) => lbl(`b-dn${i}`, x - 80, 548, 160, 44, ["half", "quarter", "eighth"][i])).join("")}
    ${lbl("b-5050", 1480, 128, 220, 64, "50/50", `color:${GOLD};text-align:left`)}
    ${lbl("b-bubt", 170, 330, 260, 44, "did nothing?")}
    ${lbl("b-hdl", 400, 92, 240, 48, "no Z")}
    ${lbl("b-hdr", 1280, 92, 240, 48, "with Z")}
    ${lbl("b-hll", 478, 162, 84, 56, "H", `color:${GOLD}`)}
    ${lbl("b-zrl", 1298, 162, 84, 56, "Z")}
    ${lbl("b-hrl", 1418, 162, 84, 56, "H", `color:${GOLD}`)}
    ${lbl("b-p2t", 490, 236, 60, 40, "0")}${lbl("b-p2b", 490, 676, 60, 40, "1")}
    ${lbl("b-p1t", 1370, 236, 60, 40, "0")}${lbl("b-p1b", 1370, 676, 60, 40, "1")}
    ${lbl("b-al0", 360, 728, 320, 56, "always 0", `color:${GOLD}`)}
    ${lbl("b-al1", 1240, 728, 320, 56, "always 1", `color:${GOLD}`)}
    ${lbl("b-same13", 700, 160, 520, 48, "50/50 = 50/50")}
    ${[["0°", 360], ['30°<span style="margin-left:.16em">E</span>', 500], ['60°<span style="margin-left:.16em">E</span>', 640]].map(([s, x], i) => lbl(`b-mp${i}`, x - 70, 208, 140, 40, s)).join("")}
    ${lbl("b-mt0", MT.cx - 140, MT.cy - 6, 80, 40, "0")}${lbl("b-mt1", MT.cx + 60, MT.cy - 6, 80, 40, "1")}
    ${lbl("b-mtl", MT.cx - 140, MT.cy + 50, 280, 40, "reads 0 or 1")}
    ${lbl("b-phq", 1200, 100, 320, 64, "phase: ?")}
    ${lbl("b-ihl", 372, 418, 116, 80, "H", `color:${GOLD}`)}
    ${lbl("b-intf", 600, 728, 600, 64, "interference", `color:${GOLD}`)}
    ${lbl("b-formula", 140, 300, 1640, 96, formula, "padding:40px 0")}
    ${lbl("b-nth", 360, 548, 1200, 52, "θ: latitude, the odds")}
    ${lbl("b-nph", 360, 628, 1200, 52, "φ: longitude, the phase", `color:${GOLD}`)}
    ${lbl("b-c1", 880, 330, 900, 64, "Phase is the arrow's longitude:", "text-align:left")}
    ${lbl("b-c2", 880, 438, 900, 60, "invisible now,", "text-align:left")}
    ${lbl("b-c3", 880, 540, 900, 76, "decisive later.", `color:${GOLD};text-align:left`)}
    <div class="obj" id="b-c3u" style="left:884px;top:650px;width:380px;height:30px"><svg class="sk" width="380" height="30" viewBox="0 0 380 30"><g id="b-c3ug">${fUnder}</g></svg></div>
  `;

  const css = `
    #root .b-w { position: relative; display: inline-block; }
    #b-formula sup { font-size: 0.62em; vertical-align: 0.78em; line-height: 0; }
    #b-g2, #b-g3, #b-g4 { transform-origin: 50% 50%; }
  `;

  // ---------- Timeline ----------
  const script = `
    const T = ${JSON.stringify(T)};
    const PI = Math.PI, TAU = 2 * PI, R = ${R}, K = ${K}, C = ${C};
    const INK = "${INK}", GOLD = "${GOLD}";
    const clamp = (u) => Math.min(1, Math.max(0, u));
    const P = (th, ph, g = 1) => [C + g * R * Math.sin(th) * Math.cos(ph), C + g * (-R * Math.cos(th) + K * R * Math.sin(th) * Math.sin(ph))];
    const f1 = (v) => v.toFixed(1);
    function arrowD(x1, y1, x2, y2) {
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
      if (L < 2) return "";
      const ux = dx / L, uy = dy / L, nx = -uy, ny = ux, bow = Math.min(5, L * 0.02);
      const mx = (x1 + x2) / 2 + nx * bow, my = (y1 + y2) / 2 + ny * bow;
      const h = Math.min(30, L * 0.32), a = 0.45, bx = -ux, by = -uy;
      const h1 = [x2 + h * (bx * Math.cos(a) - by * Math.sin(a)), y2 + h * (bx * Math.sin(a) + by * Math.cos(a))];
      const h2 = [x2 + h * (bx * Math.cos(-a) - by * Math.sin(-a)), y2 + h * (bx * Math.sin(-a) + by * Math.cos(-a))];
      return "M" + f1(x1) + " " + f1(y1) + " Q" + f1(mx) + " " + f1(my) + " " + f1(x2) + " " + f1(y2) + " M" + f1(h1[0]) + " " + f1(h1[1]) + " L" + f1(x2) + " " + f1(y2) + " L" + f1(h2[0]) + " " + f1(h2[1]);
    }
    // A stretch of a line of latitude, split into its front (facing us) and back halves.
    function arcD(th, a, b) {
      if (Math.abs(b - a) < 0.01) return ["", ""];
      const n = Math.max(2, Math.ceil((Math.abs(b - a) / TAU) * 160));
      let f = "", bk = "", prev = null;
      for (let i = 0; i <= n; i++) {
        const ph = a + ((b - a) * i) / n, [x, y] = P(th, ph), pt = f1(x) + " " + f1(y), front = Math.sin(ph) >= 0;
        if (front) f += (prev === true ? " L" : " M") + pt; else bk += (prev === false ? " L" : " M") + pt;
        if (prev !== null && prev !== front) { if (front) bk += " L" + pt; else f += " L" + pt; }
        prev = front;
      }
      return [f, bk];
    }
    function globeAt(id, th, ph, o) {
      const g = o.g ?? 1, [x, y] = P(th, ph, g);
      $(id + "-arr").setAttribute("d", g < 0.02 ? "" : arrowD(C, C, x, y));
      const tip = $(id + "-tip");
      tip.setAttribute("cx", f1(x)); tip.setAttribute("cy", f1(y)); tip.setAttribute("r", g < 0.02 ? "0" : "10");
      const back = -Math.sin(ph) * Math.sin(th);
      $(id + "-arri").style.opacity = String(1 - 0.45 * clamp((back - 0.3) / 0.4));
      if (o.ring) { const [rf, rb] = arcD(o.ring[0], o.ring[1], o.ring[1] + TAU * o.ring[2]); $(id + "-ringF").setAttribute("d", rf); $(id + "-ringB").setAttribute("d", rb); }
      if (o.trail) { const [tf, tb] = arcD(o.trail[0], o.trail[1], o.trail[2]); $(id + "-trF").setAttribute("d", tf); $(id + "-trB").setAttribute("d", tb); }
    }
    function setBars(p, p0, H, base, pct) {
      [p0, 1 - p0].forEach((v, i) => {
        const h = H * v, rc = $(p + "-c" + i + "r");
        rc.setAttribute("y", f1(base - h)); rc.setAttribute("height", f1(h));
        const tp = $(p + "-t" + i);
        tp.setAttribute("y1", f1(base - h)); tp.setAttribute("y2", f1(base - h)); tp.style.opacity = v > 0.004 ? "1" : "0";
        if (pct) { const L = $(p + "-p" + i); L.style.top = f1(base - h - 62) + "px"; L.textContent = Math.round(v * 100) + "%"; }
      });
    }
    const p0 = (th) => Math.cos(th / 2) ** 2;

    // ----- Globe 1's arrow: polar angle, phase, growth -----
    const PH0 = PI / 6;
    const th1 = (t) => sched([[T.down, T.down + 0.9, 0, PI], [T.how, T.how + 0.75, PI, PI / 3], [T.how + 0.75, T.how + 1.45, PI / 3, 2 * PI / 3], [T.how + 1.45, T.how + 2.15, 2 * PI / 3, PI / 3],
      [T.equator, T.equator + 0.9, PI / 3, PI / 2], [T.straightDown, T.straightDown + 1.0, PI / 2, PI]], t, 0);
    const ph1 = (t) => sched([[T.faces, T.faces + 2.0, PH0, PH0 + TAU], [T.spins, T.spins + 1.2, PH0 + TAU, PH0 + TAU + PI],
      [T.quarter + 0.1, T.quarter + 0.85, PH0 + TAU + PI, PH0 + TAU + 1.5 * PI], [T.eighth + 0.1, T.eighth + 0.6, PH0 + TAU + 1.5 * PI, PH0 + TAU + 1.75 * PI],
      [T.equator, T.equator + 0.9, PH0 + TAU + 1.75 * PI, 2 * TAU], [T.swings, T.swings + 1.2, 2 * TAU, 2 * TAU + PI]], t, PH0);
    const g1 = (t) => sched([[T.arrow1 + 0.25, T.arrow1 + 0.85, 0, 1]], t, 0);
    const th2 = (t) => sched([[T.straightUp, T.straightUp + 1.0, PI / 2, 0]], t, PI / 2);
    const th3 = (t) => sched([[T.turns, T.turns + 1.0, PI / 2, 0]], t, PI / 2);
    const ph3 = (t) => sched([[T.globe14 + 0.6, T.l15, PI / 2, TAU]], t, PI / 2);
    // City B slides east, round the back, and home again (line 3).
    const phB = (t) => sched([[T.however, T.however + 1.0, ${PH_B}, ${PH_B} - 1.28 * PI], [T.however + 1.0, T.however + 2.0, ${PH_B} - 1.28 * PI, ${PH_B}]], t, ${PH_B});
    const pop = (t, t0) => { if (t < t0) return 0; const u = clamp((t - t0) / 0.42), c1 = 2.2, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };

    onFrame((t) => {
      const th = th1(t), ph = ph1(t);
      let trail;
      if (t < T.l8) trail = [th, PH0 + TAU, Math.max(PH0 + TAU, ph)];
      else if (t < T.arrow9) trail = [PI / 2, 2 * TAU, Math.max(2 * TAU, ph)];
      else trail = [PI / 2, 2 * TAU, 2 * TAU + PI * sched([[T.arrow9 + 0.05, T.arrow9 + 0.65, 0, 1]], t, 0)];
      globeAt("b-g1", th, ph, { g: g1(t), ring: [th, PH0, sched([[T.lat2, T.lat2 + 0.8, 0, 1]], t, 0)], trail });
      globeAt("b-g2", th2(t), 0, {});
      globeAt("b-g3", th3(t), ph3(t), {});
      globeAt("b-g4", PI / 3, PI / 6 + 0.75 * (t - T.l17), { ring: [PI / 3, 0, sched([[T.l17 + 0.6, T.l17 + 1.4, 0, 1]], t, 0)] });
      // Odds bars
      setBars("b-ob", p0(th), 420, 700, true);
      setBars("b-oc", p0(th3(t)), 420, 700, true);
      setBars("b-mbl", p0(th2(t)), 170, 600, false);
      setBars("b-mbr", p0(th), 170, 600, false);
      // Cities on one line of latitude (line 3)
      [["b-g1-pinA", ${PH_A}, T.cities, "b-g1-brA"], ["b-g1-pinB", phB(t), T.cities + 0.25, "b-g1-brB"]].forEach(([id, phc, t0, br]) => {
        const [x, y] = P(${TH_R}, phc), s = pop(t, t0);
        const back = -Math.sin(phc);
        $(id).setAttribute("transform", "translate(" + f1(x) + " " + f1(y) + ") scale(" + s.toFixed(3) + ")");
        $(id).style.opacity = String(s <= 0 ? 0 : 1 - 0.55 * clamp((back + 0.1) / 0.4));
        const fy = C + K * R * Math.sin(${TH_R}) * Math.sin(phc), u = sched([[T.equally, T.equally + 0.6, 0, 1]], t, 0);
        const top = fy - (fy - y) * u;
        $(br).setAttribute("d", u <= 0 ? "" : "M" + f1(x) + " " + f1(fy) + " L" + f1(x) + " " + f1(top) + " M" + f1(x - 10) + " " + f1(fy) + " L" + f1(x + 10) + " " + f1(fy) + (u > 0.98 ? " M" + f1(x - 10) + " " + f1(top + 8) + " L" + f1(x + 10) + " " + f1(top + 8) : ""));
        $(br).style.opacity = String(1 - 0.55 * clamp((back + 0.1) / 0.4));
      });
      // Dials seen from above the north pole (line 6)
      [[0, sched([[T.l6 + 0.25, T.l6 + 0.8, 0, PI]], t, 0)], [1, sched([[T.quarter + 0.1, T.quarter + 0.85, 0, PI / 2]], t, 0)], [2, sched([[T.eighth + 0.1, T.eighth + 0.6, 0, PI / 4]], t, 0)]].forEach(([i, a]) => {
        const cx = ${JSON.stringify(DIALS)}[i], cy = 470, rr = 56;
        const p = $("b-d" + i + "-p");
        p.setAttribute("x2", f1(cx + 58 * Math.cos(a))); p.setAttribute("y2", f1(cy + 58 * Math.sin(a)));
        $("b-d" + i + "-w").setAttribute("d", a < 0.01 ? "" : "M" + cx + " " + cy + " L" + (cx + rr) + " " + cy + " A" + rr + " " + rr + " 0 " + (a > PI ? 1 : 0) + " 1 " + f1(cx + rr * Math.cos(a)) + " " + f1(cy + rr * Math.sin(a)) + " Z");
      });
      // The meter only ever lands on 0 or 1 (line 14)
      const bits = [0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0];
      const mt = t - T.meas - 0.5, kk = Math.max(0, Math.floor(mt / 0.45));
      const prevB = kk > 0 ? bits[(kk - 1) % bits.length] : 0.5, curB = mt < 0 ? 0.5 : bits[kk % bits.length];
      const v = mt < 0 ? 0.5 : prevB + (curB - prevB) * ease.inOut(clamp((mt - kk * 0.45) / 0.14));
      const na = PI + 0.32 + (PI - 0.64) * v;
      $("b-mt-n").setAttribute("x2", f1(${MT.cx} + 74 * Math.cos(na))); $("b-mt-n").setAttribute("y2", f1(${MT.cy} + 74 * Math.sin(na)));
    });

    // ===== Line 0: the puzzle =====
    draw("#b-pz-wire", T.pzGate - 0.5, 0.7);
    draw("#b-pz-box", T.pzGate, 0.6);
    write("#b-pz-qm", T.pzGate + 0.35, 0.3);
    write("#b-pz-q", T.pzQubit, 0.35);
    tl.to("#b-pz-boxd", { keyframes: [{ rotation: -9, duration: 0.1 }, { rotation: 8, duration: 0.12 }, { rotation: -5, duration: 0.1 }, { rotation: 0, duration: 0.14 }] }, T.pzChange);
    draw("#b-pz-bars", T.pzOdds, 1.0);
    write(["#b-pz-bf", "#b-pz-n00", "#b-pz-n01"], T.pzOdds + 0.1, 0.6);
    write(["#b-pz-af", "#b-pz-n10", "#b-pz-n11"], T.pzOdds + 0.5, 0.6);
    write("#b-pz-eq", T.pzEq, 0.3);

    // ===== Line 1: the arrow; up reads 0, down reads 1 =====
    blurOut(["#b-title", "#b-pz-wire", "#b-pz-bars", "#b-pz-boxd", "#b-pz-q", "#b-pz-bf", "#b-pz-af", "#b-pz-eq", "[id^=b-pz-n]"], T.l1);
    draw("#b-g1-shell", T.arrow1, 1.2);
    hide(["#b-g1-arrg", "#b-g1-ringg", "#b-g1-trg", "#b-g1-pins", "#b-g1-brk"]);
    show("#b-g1-arrg", T.arrow1 + 0.2);
    write("#b-n0", T.up, 0.3);
    write("#b-n1", T.down, 0.3);
    tl.to("#b-n0", { color: INK, duration: 0.3 }, T.down + 0.3);

    // ===== Line 2: odds follow height; latitude =====
    draw("#b-ob-frame", T.odds2, 0.8);
    hide(["#b-ob-fill", "#b-ob-p0", "#b-ob-p1"]);
    fade(["#b-ob-fill", "#b-ob-p0", "#b-ob-p1"], 1, T.odds2 + 0.5, 0.4);
    write(["#b-ob-l0", "#b-ob-l1"], T.odds2 + 0.4, 0.2);
    write("#b-obh", T.odds2 + 0.2, 0.3);
    tl.to("#b-n1", { color: INK, duration: 0.3 }, T.how);
    show("#b-g1-ringg", T.lat2);
    draw("#b-g1-grid", T.globe2, 1.2);

    // ===== Line 3: cities on one line of latitude =====
    fade(["#b-g1-arrg", "#b-ob-fill", "#b-ob-frame", "#b-ob-p0", "#b-ob-p1", "#b-ob-l0", "#b-ob-l1", "#b-obh"], 0, T.l3, 0.4);
    show(["#b-g1-pins", "#b-g1-brk"], T.cities - 0.05);
    write("#b-eqn", T.equally, 0.8);
    draw("#b-eqs", T.north, 0.3);

    // ===== Line 4: that's longitude; our arrow has one too, the phase =====
    draw("#b-g1-merA", T.lon4, 0.6);
    draw("#b-g1-merB", T.lon4 + 0.3, 0.6);
    write("#b-lon", T.lon4 + 0.1, 0.55);
    blurOut(["#b-g1-pins", "#b-g1-brk", "#b-g1-merA", "#b-g1-merB", "#b-eqs"], T.arrow4);
    blurOut("#b-eqn", T.l4);
    fade(["#b-g1-arrg", "#b-ob-fill", "#b-ob-frame", "#b-ob-p0", "#b-ob-p1", "#b-ob-l0", "#b-ob-l1", "#b-obh"], 1, T.arrow4 + 0.1, 0.45);
    draw("#b-pharc", T.phase4 - 0.1, 0.6);
    write("#b-ph", T.phase4, 0.4);
    tl.to("#b-lon", { color: INK, duration: 0.3 }, T.phase4);

    // ===== Line 5: Z turns it half way round its latitude =====
    tl.to("#b-ph", { color: INK, duration: 0.3 }, T.z5);
    tl.to("#b-pharc path", { attr: { stroke: INK }, duration: 0.3 }, T.z5);
    draw("#b-z5", T.z5, 0.5);
    write("#b-z5l", T.z5 + 0.15, 0.2);
    show("#b-g1-trg", T.spins - 0.05);
    write("#b-half", T.halfway, 0.5);
    draw("#b-tk5", T.stay, 0.3);
    write("#b-same", T.stay + 0.25, 0.3);

    // ===== Line 6: S a quarter, T an eighth =====
    blurOut(["#b-z5", "#b-z5l", "#b-half", "#b-tk5", "#b-same"], T.l6);
    fade("#b-g1-trg", 0, T.l6, 0.3);
    fade(["#b-ob-fill", "#b-ob-frame", "#b-ob-p0", "#b-ob-p1", "#b-ob-l0", "#b-ob-l1", "#b-obh"], 0, T.l6, 0.3);
    draw("#b-d0", T.l6 + 0.05, 0.5);
    write(["#b-dl0", "#b-dn0"], T.l6 + 0.1, 0.25);
    draw("#b-d1", T.quarter - 0.2, 0.4);
    write(["#b-dl1", "#b-dn1"], T.quarter - 0.15, 0.35);
    tl.to("#b-dl0", { color: INK, duration: 0.25 }, T.quarter);
    tl.to("#b-dl1", { color: GOLD, duration: 0.25 }, T.quarter);
    draw("#b-d2", T.eighth - 0.2, 0.35);
    write(["#b-dl2", "#b-dn2"], T.eighth - 0.15, 0.3);
    tl.to("#b-dl1", { color: INK, duration: 0.25 }, T.eighth);
    tl.to("#b-dl2", { color: GOLD, duration: 0.25 }, T.eighth);

    // ===== Line 7: on the equator pointing right, fifty fifty =====
    blurOut(["#b-d0", "#b-d1", "#b-d2", "[id^=b-dl]", "[id^=b-dn]"], T.l7 + 0.55);
    fade(["#b-ob-fill", "#b-ob-frame", "#b-ob-p0", "#b-ob-p1", "#b-ob-l0", "#b-ob-l1", "#b-obh"], 1, T.l7 + 0.7, 0.4);
    fade("#b-g1-ringg", 0, T.equator - 0.3, 0.4);
    draw("#b-g1-eqg", T.equator, 0.8);
    write("#b-5050", T.fifty7, 0.35);

    // ===== Line 8: apply Z, it swings round to point left, still fifty fifty =====
    fade("#b-g1-eqg", 0, T.apply, 0.4);
    draw("#b-z8", T.apply + 0.2, 0.5);
    write("#b-z8l", T.apply + 0.35, 0.2);
    tl.set("#b-g1-trg", { opacity: 1 }, T.swings - 0.05);
    draw("#b-tk8", T.still, 0.3);

    // ===== Line 9: did Z do nothing? =====
    draw("#b-bub", T.nothing - 0.1, 0.5);
    write("#b-bubt", T.nothing + 0.1, 0.6);
    draw("#b-loop", T.bars9, 0.8);
    draw("#b-strike", T.arrow9 + 0.25, 0.35);

    // ===== Line 10: two experiments, then an H gate =====
    blurOut(["#b-ob-fill", "#b-ob-frame", "#b-ob-p0", "#b-ob-p1", "#b-ob-l0", "#b-ob-l1", "#b-obh", "#b-5050", "#b-tk8", "#b-loop", "#b-bub", "#b-bubt", "#b-strike",
      "#b-z8", "#b-z8l", "#b-g1-trg", "#b-n0", "#b-n1", "#b-lon", "#b-ph", "#b-pharc"], T.l10);
    move("#b-g1", { x: 0, y: 0, scale: 1 }, { x: 640, y: 20, scale: 0.62 }, T.l10 + 0.1, 1.0);
    tl.set("#b-g2", { scale: 0.62 }, 0);
    draw(["#b-g2-shell", "#b-g2-grid"], T.l10 + 0.25, 1.1);
    hide(["#b-g2-arrg", "#b-g2-ringg", "#b-g2-trg"]);
    fade("#b-g2-arrg", 1, T.l10 + 0.9, 0.35);
    draw("#b-cl", T.add, 0.4);
    draw("#b-cr", T.add + 0.1, 0.4);
    draw("#b-zr", T.add, 0.4);
    write("#b-zrl", T.add + 0.1, 0.2);
    write("#b-hdl", T.add - 0.1, 0.3);
    write("#b-hdr", T.add + 0.05, 0.35);
    draw(["#b-hl", "#b-hr"], T.hgate, 0.45);
    write(["#b-hll", "#b-hrl"], T.hgate + 0.15, 0.2);
    draw(["#b-mbl-frame", "#b-mbr-frame"], T.hgate + 0.8, 0.6);
    hide(["#b-mbl-fill", "#b-mbr-fill"]);
    fade(["#b-mbl-fill", "#b-mbr-fill"], 1, T.hgate + 1.2, 0.35);
    write(["#b-mbl-l0", "#b-mbl-l1", "#b-mbr-l0", "#b-mbr-l1"], T.hgate + 1.1, 0.2);
    write(["#b-p2t", "#b-p1t", "#b-p2b", "#b-p1b"], T.updown - 0.3, 0.2);
    draw("#b-ghL", T.updown, 0.4);
    draw("#b-ghR", T.updown + 0.35, 0.4);

    // ===== Line 11: without Z it lands straight up =====
    fade("#b-ghL", 0, T.straightUp + 0.6, 0.4);
    tl.to("#b-hrl", { color: INK, duration: 0.25 }, T.straightUp - 0.4);
    write("#b-al0", T.zero11, 0.45);

    // ===== Line 12: with Z it lands straight down =====
    fade("#b-ghR", 0, T.straightDown + 0.6, 0.4);
    tl.to("#b-hrl", { color: GOLD, duration: 0.25 }, T.straightDown - 0.4);
    tl.to(["#b-hll", "#b-g2-arrg"], { color: INK, duration: 0.3 }, T.straightDown - 0.4);
    write("#b-al1", T.one12, 0.45);
    tl.to("#b-al0", { color: INK, duration: 0.3 }, T.one12);

    // ===== Line 13: same odds before, opposite answers after =====
    write("#b-same13", T.same13, 0.7);
    tl.to("#b-hrl", { color: INK, duration: 0.25 }, T.opp);
    draw("#b-dbl", T.opp, 0.6);
    draw("#b-zrg", T.phase13 - 0.1, 0.4);
    tl.to("#b-zrl", { color: GOLD, duration: 0.3 }, T.phase13);
    tl.to("#b-al1", { color: INK, duration: 0.3 }, T.phase13);

    // ===== Line 14: where the globe breaks =====
    blurOut(["#b-g1", "#b-g2", "#b-cl", "#b-cr", "#b-hl", "#b-hr", "#b-zr", "#b-zrg", "#b-hll", "#b-hrl", "#b-zrl", "#b-hdl", "#b-hdr", "#b-p2t", "#b-p2b", "#b-p1t", "#b-p1b",
      "#b-mbl-frame", "#b-mbl-fill", "#b-mbr-frame", "#b-mbr-fill", "#b-mbl-l0", "#b-mbl-l1", "#b-mbr-l0", "#b-mbr-l1", "#b-al0", "#b-al1", "#b-dbl", "#b-same13"], T.l14);
    tl.set("#b-g3", { scale: 0.862 }, 0);
    draw(["#b-g3-shell", "#b-g3-grid"], T.globe14, 1.0);
    hide(["#b-g3-arrg", "#b-g3-ringg", "#b-g3-trg"]);
    fade("#b-g3-arrg", 1, T.globe14 + 0.6, 0.35);
    draw("#b-map", T.maps - 0.1, 1.1);
    write(["#b-mp0", "#b-mp1", "#b-mp2"], T.maps + 0.3, 0.4);
    tl.to(["#b-mp0", "#b-mp1", "#b-mp2"], { color: GOLD, duration: 0.3 }, T.lon14);
    draw("#b-mt", T.meas, 0.5);
    write(["#b-mt0", "#b-mt1", "#b-mtl"], T.meas + 0.3, 0.45);
    write("#b-phq", T.phase14, 0.45);
    tl.to(["#b-mp0", "#b-mp1", "#b-mp2"], { color: INK, duration: 0.3 }, T.phase14);
    draw("#b-dot", T.directly - 0.2, 0.35);
    draw("#b-x", T.directly + 0.1, 0.3);

    // ===== Line 15: a later gate turns phase into odds =====
    blurOut(["#b-map", "[id^=b-mp]", "#b-mt", "#b-mt0", "#b-mt1", "#b-mtl", "#b-phq", "#b-dot", "#b-x"], T.l15);
    move("#b-g3", { x: 0, y: 0 }, { x: -450, y: 0 }, T.l15 + 0.1, 0.9);
    draw("#b-iw", T.later, 0.5);
    draw("#b-ih", T.later + 0.2, 0.45);
    write("#b-ihl", T.later + 0.35, 0.2);
    draw("#b-oc-frame", T.later + 0.5, 0.7);
    hide(["#b-oc-fill", "#b-oc-p0", "#b-oc-p1"]);
    fade(["#b-oc-fill", "#b-oc-p0", "#b-oc-p1"], 1, T.later + 0.9, 0.35);
    write(["#b-oc-l0", "#b-oc-l1", "#b-och"], T.later + 0.8, 0.25);
    write("#b-intf", T.interf, 0.7);
    tl.to("#b-ihl", { color: INK, duration: 0.3 }, T.interf);

    // ===== Line 16: the formula =====
    blurOut(["#b-g3", "#b-iw", "#b-ih", "#b-ihl", "#b-oc-frame", "#b-oc-fill", "#b-oc-p0", "#b-oc-p1", "#b-oc-l0", "#b-oc-l1", "#b-och", "#b-intf"], T.l16);
    write("#b-formula", T.formula, 1.0);
    draw(["#b-ul1", "#b-ul2"], T.theta, 0.35);
    write("#b-nth", T.theta + 0.25, 0.9);
    draw("#b-phic", T.phi, 0.45);
    write("#b-nph", T.phi + 0.2, 1.0);

    // ===== Line 17: closing picture =====
    blurOut(["#b-nth", "#b-nph"], T.l17);
    move("#b-formula", { y: 0, scale: 1 }, { y: -205, scale: 0.68 }, T.l17 + 0.05, 1.0);
    tl.set("#b-g4", { scale: 0.724 }, 0);
    draw(["#b-g4-shell", "#b-g4-grid"], T.l17 + 0.2, 1.1);
    hide(["#b-g4-arrg", "#b-g4-trg"]);
    fade("#b-g4-arrg", 1, T.l17 + 0.5, 0.35);
    hide("#b-g4-ringg");
    show("#b-g4-ringg", T.l17 + 0.6);
    write("#b-c1", T.lon17 - 0.6, 1.0);
    write("#b-c2", T.invis, 0.7);
    write("#b-c3", T.decides, 0.8);
    draw("#b-c3ug", T.decides + 0.8, 0.5);
  `;

  return { html, script, css };
}
