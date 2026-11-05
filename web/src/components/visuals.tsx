"use client";
/** Small, dependency-free SVG drawings shared by the lessons and the Playground. */
import type { GateOp } from "@/lib/quantum_simulator";

export const INK = "#1d3a8a";
export const RED = "#ab2e22";
export const AMBER = "#ad6500";
export const TEAL = "#087f8c";

/** Angle in multiples of π, e.g. 1.5708 → "π/2", 0.33π → "0.33π". */
export function piLabel(angle: number): string {
  const t = angle / Math.PI;
  const nice: Record<string, string> = {
    "0": "0", "1": "π", "-1": "−π", "0.5": "π/2", "-0.5": "−π/2", "0.25": "π/4",
    "-0.25": "−π/4", "2": "2π", "1.5": "3π/2", "0.75": "3π/4", "0.125": "π/8",
  };
  const key = String(Math.round(t * 1000) / 1000);
  return nice[key] ?? `${t.toFixed(2)}π`;
}

/* ------------------------------------------------------------------ circuit */

type Placed = { gate: GateOp; index: number; column: number };

function layout(qubits: number, gates: GateOp[]): { placed: Placed[]; columns: number } {
  const free = Array(qubits).fill(0);
  const placed = gates.map((gate, index) => {
    const span = gate.control === undefined ? [gate.target] : [gate.target, gate.control];
    const lo = Math.min(...span);
    const hi = Math.max(...span);
    let column = 0;
    for (let q = lo; q <= hi; q++) column = Math.max(column, free[q]);
    for (let q = lo; q <= hi; q++) free[q] = column + 1;
    return { gate, index, column };
  });
  return { placed, columns: Math.max(1, ...free) };
}

/**
 * A circuit drawn the way textbooks draw it: one wire per qubit (q0 on top),
 * time running left to right. Pass onRemove to let learners delete any gate.
 */
export function CircuitDiagram({
  qubits,
  gates,
  onRemove,
}: {
  qubits: number;
  gates: GateOp[];
  onRemove?: (index: number) => void;
}) {
  const { placed, columns } = layout(qubits, gates);
  const left = 40;
  const col = 58;
  const row = 50;
  const top = 28;
  const width = left + columns * col + 30;
  const height = top + (qubits - 1) * row + 30;
  const y = (q: number) => top + q * row;
  const x = (c: number) => left + c * col + col / 2;
  return (
    <div className="circuit-diagram">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={
          gates.length
            ? `Circuit on ${qubits} qubit(s): ${gates.map((g) => g.gate).join(", ")}`
            : `Empty circuit on ${qubits} qubit(s)`
        }
      >
        {Array.from({ length: qubits }, (_, q) => (
          <g key={q}>
            <text x={6} y={y(q) + 5} className="wire-label">
              q{q}
            </text>
            <line x1={left - 6} x2={width - 10} y1={y(q)} y2={y(q)} stroke={INK} strokeWidth={1.5} />
          </g>
        ))}
        {placed.map(({ gate, index, column }) => {
          const cx = x(column);
          const remove = onRemove ? () => onRemove(index) : undefined;
          const common = {
            key: `${gate.id}-${index}`,
            className: remove ? "gate removable" : "gate",
            onClick: remove,
            role: remove ? "button" : undefined,
            tabIndex: remove ? 0 : undefined,
            onKeyDown: remove
              ? (e: React.KeyboardEvent) => (e.key === "Enter" || e.key === " ") && remove()
              : undefined,
          };
          const title = <title>{remove ? `Remove ${gate.gate} (gate ${index + 1})` : gate.gate}</title>;
          if (gate.control !== undefined) {
            const yc = y(gate.control);
            const yt = y(gate.target);
            return (
              <g {...common}>
                {title}
                <line x1={cx} x2={cx} y1={yc} y2={yt} stroke={INK} strokeWidth={2} />
                <circle cx={cx} cy={yc} r={5.5} fill={INK} />
                {gate.gate === "CNOT" ? (
                  <g>
                    <circle cx={cx} cy={yt} r={12} fill="#fffdf5" stroke={INK} strokeWidth={2} />
                    <line x1={cx - 12} x2={cx + 12} y1={yt} y2={yt} stroke={INK} strokeWidth={2} />
                    <line x1={cx} x2={cx} y1={yt - 12} y2={yt + 12} stroke={INK} strokeWidth={2} />
                  </g>
                ) : (
                  <circle cx={cx} cy={yt} r={5.5} fill={INK} />
                )}
                <rect x={cx - 20} y={Math.min(yc, yt) - 16} width={40} height={Math.abs(yt - yc) + 32} fill="transparent" />
              </g>
            );
          }
          const angle = gate.angle !== undefined && ["RX", "RY", "RZ"].includes(gate.gate);
          return (
            <g {...common}>
              {title}
              <rect
                x={cx - 21}
                y={y(gate.target) - 17}
                width={42}
                height={34}
                rx={3}
                fill={gate.gate === "H" ? "#fff1a1" : "#fffdf5"}
                stroke={INK}
                strokeWidth={2}
              />
              <text x={cx} y={y(gate.target) + (angle ? -1 : 5)} textAnchor="middle" className="gate-label">
                {gate.gate}
              </text>
              {angle && (
                <text x={cx} y={y(gate.target) + 12} textAnchor="middle" className="gate-angle">
                  {piLabel(gate.angle!)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {onRemove && gates.length > 0 && <p className="caption">Tap a gate to remove it.</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ Bloch sphere */

const AX = { x: [-0.36, 0.32], y: [0.94, 0], z: [0, -0.94] } as const;

/** Project a point on the unit sphere to screen offsets (x right, y down). */
function project(x: number, y: number, z: number): [number, number] {
  return [x * AX.x[0] + y * AX.y[0] + z * AX.z[0], x * AX.x[1] + y * AX.y[1] + z * AX.z[1]];
}

/**
 * A Bloch sphere in perspective: |0⟩ on top, |1⟩ at the bottom, |+⟩ toward
 * you and |+i⟩ to the right. The arrow is the state; a short arrow means the
 * qubit is mixed (for example, half of an entangled pair).
 */
export function BlochSphere({
  x,
  y,
  z,
  size = 190,
  label,
  trail = [],
  ghost,
}: {
  x: number;
  y: number;
  z: number;
  size?: number;
  label?: string;
  trail?: [number, number, number][];
  ghost?: [number, number, number];
}) {
  const r = size * 0.36;
  const c = size / 2;
  const pt = (px: number, py: number, pz: number): [number, number] => {
    const [dx, dy] = project(px, py, pz);
    return [c + r * dx, c + r * dy];
  };
  /** Front (or back) half of the equator as SVG path segments. */
  const equator = (front: boolean) => {
    let d = "";
    let pen = false;
    for (let k = 0; k <= 72; k++) {
      const t = (k / 72) * Math.PI * 2;
      const visible = front ? Math.cos(t) >= 0 : Math.cos(t) <= 0;
      if (!visible) {
        pen = false;
        continue;
      }
      const [sx, sy] = pt(Math.cos(t), Math.sin(t), 0);
      d += `${pen ? "L" : "M"}${sx.toFixed(1)},${sy.toFixed(1)} `;
      pen = true;
    }
    return d;
  };
  const [ex, ey] = pt(x, y, z);
  const length = Math.sqrt(x * x + y * y + z * z);
  const behind = x < -0.05;
  const [top, bottom, plus, plusI] = [pt(0, 0, 1), pt(0, 0, -1), pt(1, 0, 0), pt(0, 1, 0)];
  return (
    <figure className="bloch">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label={`${label ? label + ": " : ""}Bloch vector x ${x.toFixed(2)}, y ${y.toFixed(2)}, z ${z.toFixed(2)}${length < 0.98 ? " (mixed)" : ""}`}
      >
        <circle cx={c} cy={c} r={r} fill="rgba(8,127,140,.07)" stroke={INK} strokeWidth={1.5} />
        <path d={equator(false)} fill="none" stroke={INK} strokeWidth={1} strokeDasharray="3 4" opacity={0.5} />
        <path d={equator(true)} fill="none" stroke={INK} strokeWidth={1.2} />
        <line x1={top[0]} y1={top[1]} x2={bottom[0]} y2={bottom[1]} stroke={INK} strokeWidth={0.8} opacity={0.35} />
        <line x1={c} y1={c} x2={plus[0]} y2={plus[1]} stroke={INK} strokeWidth={0.8} opacity={0.35} />
        <line x1={c} y1={c} x2={plusI[0]} y2={plusI[1]} stroke={INK} strokeWidth={0.8} opacity={0.35} />
        <text x={top[0]} y={top[1] - 7} textAnchor="middle" className="bloch-label">|0⟩</text>
        <text x={bottom[0]} y={bottom[1] + 17} textAnchor="middle" className="bloch-label">|1⟩</text>
        <text x={plus[0] - 6} y={plus[1] + 15} textAnchor="middle" className="bloch-label small">|+⟩</text>
        <text x={plusI[0] - 2} y={plusI[1] - 7} textAnchor="middle" className="bloch-label small">|+i⟩</text>
        {trail.map(([tx, ty, tz], i) => {
          const [sx, sy] = pt(tx, ty, tz);
          return <circle key={i} cx={sx} cy={sy} r={3} fill={AMBER} opacity={0.25 + (0.5 * (i + 1)) / (trail.length + 1)} />;
        })}
        {ghost && (() => {
          const [gx, gy] = pt(...ghost);
          return <line x1={c} y1={c} x2={gx} y2={gy} stroke={INK} strokeWidth={2.5} strokeDasharray="4 4" opacity={0.45} />;
        })()}
        {length > 0.02 ? (
          <>
            <line x1={c} y1={c} x2={ex} y2={ey} stroke={RED} strokeWidth={3.5} strokeLinecap="round" opacity={behind ? 0.55 : 1} />
            <circle cx={ex} cy={ey} r={5.5} fill={RED} opacity={behind ? 0.55 : 1} />
          </>
        ) : (
          <circle cx={c} cy={c} r={5} fill={RED} />
        )}
      </svg>
      {label && <figcaption>{label}</figcaption>}
    </figure>
  );
}

/* ------------------------------------------------------------------ charts */

/** Probability bars with optional comparison values drawn as ghost bars. */
export function ProbabilityBars({
  probabilities,
  labels,
  compare,
  compareLabel,
}: {
  probabilities: number[];
  labels?: string[];
  compare?: number[];
  compareLabel?: string;
}) {
  const width = Math.max(1, Math.round(Math.log2(probabilities.length)));
  return (
    <div className="prob-bars">
      {probabilities.map((p, i) => (
        <div className="probability-row" key={i}>
          <code>{labels?.[i] ?? i.toString(2).padStart(width, "0")}</code>
          <div className="bar-track">
            {compare && <b style={{ width: `${(compare[i] ?? 0) * 100}%` }} />}
            <i style={{ width: `${p * 100}%` }} />
          </div>
          <span>{(p * 100).toFixed(1)}%</span>
        </div>
      ))}
      {compare && compareLabel && <p className="caption">Outlined bars: {compareLabel}</p>}
    </div>
  );
}

/** A function plotted on [0, xMax] with a marker at the current value. */
export function CurvePlot({
  fn,
  xMax,
  value,
  xLabel,
  yLabel,
  ticks,
  width = 320,
  height = 170,
  target,
  trail = [],
}: {
  fn: (x: number) => number;
  xMax: number;
  value: number;
  xLabel: string;
  yLabel: string;
  ticks?: [number, string][];
  width?: number;
  height?: number;
  /** Optional horizontal goal line, e.g. a training target. */
  target?: number;
  /** Earlier x values, drawn as fading dots (e.g. an optimizer's path). */
  trail?: number[];
}) {
  const pad = { l: 36, r: 12, t: 18, b: 30 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const sx = (v: number) => pad.l + (v / xMax) * w;
  const sy = (v: number) => pad.t + (1 - v) * h;
  const path = Array.from({ length: 121 }, (_, k) => {
    const v = (k / 120) * xMax;
    return `${k ? "L" : "M"}${sx(v).toFixed(1)},${sy(fn(v)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }} role="img" aria-label={`${yLabel} against ${xLabel}`} className="curve-plot">
      <line x1={pad.l} x2={pad.l + w} y1={sy(0)} y2={sy(0)} stroke="#6f6a5e" />
      <line x1={pad.l} x2={pad.l} y1={sy(0)} y2={sy(1)} stroke="#6f6a5e" />
      {[0, 0.5, 1].map((v) => (
        <text key={v} x={pad.l - 6} y={sy(v) + 4} textAnchor="end" className="axis-label">{v}</text>
      ))}
      {(ticks ?? []).map(([v, t]) => (
        <text key={t} x={sx(v)} y={sy(0) + 16} textAnchor="middle" className="axis-label">{t}</text>
      ))}
      <path d={path} fill="none" stroke={INK} strokeWidth={2} />
      {target !== undefined && (
        <>
          <line x1={pad.l} x2={pad.l + w} y1={sy(target)} y2={sy(target)} stroke={AMBER} strokeDasharray="6 4" strokeWidth={1.5} />
          <text x={pad.l + w} y={sy(target) - 4} textAnchor="end" className="axis-label" fill={AMBER}>target</text>
        </>
      )}
      {trail.map((t, i) => (
        <circle key={i} cx={sx(t)} cy={sy(fn(t))} r={3} fill={AMBER} opacity={0.2 + (0.6 * (i + 1)) / (trail.length + 1)} />
      ))}
      <line x1={sx(value)} x2={sx(value)} y1={sy(0)} y2={sy(fn(value))} stroke={RED} strokeDasharray="3 3" />
      <circle cx={sx(value)} cy={sy(fn(value))} r={5} fill={RED} />
      <text x={pad.l + w} y={height - 4} textAnchor="end" className="axis-label">{xLabel}</text>
      <text x={4} y={pad.t - 2} className="axis-label">{yLabel}</text>
    </svg>
  );
}

/** Signed amplitudes as bars above and below zero, with an optional mean line. */
export function AmplitudeBars({
  amplitudes,
  labels,
  highlight,
  showMean,
}: {
  amplitudes: number[];
  labels: string[];
  highlight?: number;
  showMean?: boolean;
}) {
  const n = amplitudes.length;
  const width = 60 + n * 64 + (showMean ? 64 : 0);
  const height = 190;
  const mid = 95;
  const scale = 80;
  const mean = amplitudes.reduce((a, b) => a + b, 0) / n;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }} role="img" aria-label={`Amplitudes ${amplitudes.map((a) => a.toFixed(2)).join(", ")}`} className="amp-bars">
      <line x1={30} x2={width - 10} y1={mid} y2={mid} stroke="#6f6a5e" />
      <text x={24} y={mid - scale + 4} textAnchor="end" className="axis-label">+1</text>
      <text x={24} y={mid + 4} textAnchor="end" className="axis-label">0</text>
      <text x={24} y={mid + scale + 4} textAnchor="end" className="axis-label">−1</text>
      {amplitudes.map((a, i) => {
        const x = 46 + i * 64;
        const h = Math.abs(a) * scale;
        return (
          <g key={i}>
            <rect x={x} y={a >= 0 ? mid - h : mid} width={36} height={Math.max(h, 1)} fill={i === highlight ? RED : TEAL} opacity={0.85} />
            <text x={x + 18} y={height - 4} textAnchor="middle" className="axis-label">{labels[i]}</text>
            <text x={x + 18} y={a >= 0 ? mid - h - 5 : mid + h + 13} textAnchor="middle" className="axis-label">{a.toFixed(2)}</text>
          </g>
        );
      })}
      {showMean && (
        <>
          <line x1={36} x2={width - 10} y1={mid - mean * scale} y2={mid - mean * scale} stroke={AMBER} strokeDasharray="5 4" strokeWidth={2} />
          <text x={width - 4} y={mid - mean * scale + 4} textAnchor="end" className="axis-label" fill={AMBER}>average</text>
        </>
      )}
    </svg>
  );
}

/** Two path amplitudes as arrows on a circle, plus their sum (interference). */
export function Phasors({ phase }: { phase: number }) {
  const size = 200;
  const c = size / 2;
  const r = 34;
  // Amplitude for outcome 0 is (1 + e^{iφ})/2: path A along +x, path B rotated by φ.
  const a: [number, number] = [r, 0];
  const b: [number, number] = [r * Math.cos(phase), -r * Math.sin(phase)];
  const sum: [number, number] = [a[0] + b[0], a[1] + b[1]];
  const arrow = (from: [number, number], to: [number, number], color: string, dash?: string) => (
    <line x1={c + from[0]} y1={c + from[1]} x2={c + to[0]} y2={c + to[1]} stroke={color} strokeWidth={3} strokeDasharray={dash} markerEnd={`url(#head-${color.slice(1)})`} />
  );
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Two path amplitudes and their sum" className="phasors">
      <defs>
        {[INK, RED, AMBER].map((color) => (
          <marker key={color} id={`head-${color.slice(1)}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={color} />
          </marker>
        ))}
      </defs>
      <circle cx={c} cy={c} r={2 * r} fill="none" stroke="#c9c1aa" strokeDasharray="3 4" />
      {arrow([0, 0], a, INK)}
      {arrow(a, sum, RED)}
      {Math.hypot(...sum) > 2 && arrow([0, 0], sum, AMBER, "6 4")}
      <title>Blue: path 1. Red: path 2, added on. Dashed amber: the total.</title>
    </svg>
  );
}
