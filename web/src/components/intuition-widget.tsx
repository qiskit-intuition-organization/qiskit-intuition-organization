"use client";
/**
 * The "Try it" picture at the start of every lesson. Each widget type is its
 * own small component built from the shared drawings in ./visuals, so every
 * lesson shows something you can see change, not just numbers.
 *
 * Angles in lesson data (theta, phi) are in multiples of π, as in the
 * curriculum file.
 */
import { useMemo, useState } from "react";
import { cAbs2, simulateCircuit } from "@/lib/quantum_simulator";
import type { Complex, GateName, GateOp } from "@/lib/quantum_simulator";
import { api } from "@/services/api";
import {
  AMBER,
  AmplitudeBars,
  BlochSphere,
  CircuitDiagram,
  CurvePlot,
  INK,
  Phasors,
  ProbabilityBars,
  RED,
  piLabel,
} from "./visuals";

export type Widget = {
  type: string;
  theta?: number;
  phi?: number;
  caption?: string;
  gates?: string[];
  show_curve?: boolean;
  show_phi?: boolean;
  p1?: number;
};

const PI = Math.PI;
const op = (gate: GateName, target: number, angle?: number, control?: number): GateOp => ({
  id: `${gate}-${target}-${control ?? ""}-${angle ?? ""}`,
  gate,
  target,
  angle,
  control,
});
const probs = (n: number, gates: GateOp[]) => simulateCircuit(n, gates).statevector.map(cAbs2);
const blochOf = (n: number, gates: GateOp[], q = 0) => simulateCircuit(n, gates).blochAngles[q];

/** Marginal probability that qubit q reads 1 (q0 is the least significant bit). */
const marginalOne = (p: number[], q: number) => p.reduce((sum, v, i) => sum + ((i >> q) & 1 ? v : 0), 0);

function sample(p: number[], shots: number): number[] {
  const counts = p.map(() => 0);
  for (let n = 0; n < shots; n++) {
    let r = Math.random();
    let k = 0;
    while (k < p.length - 1 && r >= p[k]) r -= p[k++];
    counts[k]++;
  }
  return counts;
}

function fmtComplex({ r, i }: Complex): string {
  const re = Math.abs(r) < 5e-4 ? 0 : r;
  const im = Math.abs(i) < 5e-4 ? 0 : i;
  if (!im) return re.toFixed(3);
  if (!re) return `${im.toFixed(3)}i`;
  return `${re.toFixed(2)} ${im >= 0 ? "+" : "−"} ${Math.abs(im).toFixed(2)}i`;
}

function PiSlider({
  label,
  value,
  set,
  min = 0,
  max = 2,
  step = 1 / 24,
}: {
  label: string;
  value: number;
  set: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="pi-slider">
      <span>
        {label}: <strong>{piLabel(value * PI)}</strong>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
    </label>
  );
}

function PlainSlider({ label, value, set, min = 0, max = 1, step = 0.01, show }: { label: string; value: number; set: (v: number) => void; min?: number; max?: number; step?: number; show?: string }) {
  return (
    <label className="pi-slider">
      <span>
        {label}: <strong>{show ?? value.toFixed(2)}</strong>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
    </label>
  );
}

const Status = ({ children }: { children: React.ReactNode }) => (
  <p className="widget-status" aria-live="polite">
    {children}
  </p>
);

/* ---------------------------------------------------------------- one qubit */

function Interference({ widget }: { widget: Widget }) {
  const [phi, setPhi] = useState(widget.phi ?? 0);
  const p0 = Math.cos((phi * PI) / 2) ** 2;
  return (
    <>
      <PiSlider label="Phase shift between the two paths" value={phi} set={setPhi} />
      <div className="widget-grid">
        <figure className="bloch">
          <Phasors phase={phi * PI} />
          <figcaption>Blue: path 1 · red: path 2, added on · dashed: the total</figcaption>
        </figure>
        <div>
          <ProbabilityBars probabilities={[p0, 1 - p0]} />
          <CurvePlot fn={(t) => Math.cos(t / 2) ** 2} xMax={2 * PI} value={phi * PI} xLabel="phase shift" yLabel="P(0)" ticks={[[0, "0"], [PI, "π"], [2 * PI, "2π"]]} />
        </div>
      </div>
      <Status>
        {p0 > 0.99
          ? "In step: both paths point the same way, so they add up and every shot reads 0."
          : p0 < 0.01
            ? "Half a wave apart: the paths to 0 point in opposite directions and cancel — every shot reads 1."
            : "Partly out of step: the paths partly cancel, so 0 becomes less likely."}
      </Status>
    </>
  );
}

function BlochDial({ widget }: { widget: Widget }) {
  const [theta, setTheta] = useState(widget.theta ?? 0.3);
  const [phi, setPhi] = useState(widget.phi ?? 0);
  const gates = [op("RY", 0, theta * PI), op("RZ", 0, phi * PI)];
  const b = blochOf(1, gates);
  const p = probs(1, gates);
  return (
    <>
      <PiSlider label="Tilt away from |0⟩ (θ)" value={theta} set={setTheta} max={widget.show_curve ? 2 : 1} />
      {widget.show_phi && <PiSlider label="Turn around the equator (φ)" value={phi} set={setPhi} />}
      <div className="widget-grid">
        <BlochSphere x={b.x} y={b.y} z={b.z} size={220} label="The state: an arrow" />
        <div>
          <h4>What a measurement reports</h4>
          <ProbabilityBars probabilities={p} />
          {widget.show_curve && (
            <CurvePlot fn={(t) => Math.sin(t / 2) ** 2} xMax={2 * PI} value={theta * PI} xLabel="angle θ" yLabel="P(1)" ticks={[[0, "0"], [PI / 2, "π/2"], [PI, "π"], [1.5 * PI, "3π/2"], [2 * PI, "2π"]]} />
          )}
        </div>
      </div>
      <Status>
        {widget.show_phi
          ? `Turning φ moves the arrow around the equator, yet the bars stay at ${(p[0] * 100).toFixed(0)}% / ${(p[1] * 100).toFixed(0)}%. That hidden turn is the phase.`
          : widget.show_curve
            ? `P(1) = sin²(θ/2) = ${(p[1] * 100).toFixed(1)}%. Notice the curve is flat near 0 and steep in the middle.`
            : theta < 0.02
              ? "Straight up: the qubit is |0⟩ and always reads 0."
              : theta > 0.98
                ? "Straight down: |1⟩, always 1."
                : `The closer the arrow is to the top, the more often you read 0 — here ${(p[0] * 100).toFixed(0)}% of the time.`}
      </Status>
    </>
  );
}

const GATE_BLURBS: Record<string, string> = {
  X: "half-turn about x: swaps |0⟩ and |1⟩",
  Y: "half-turn about y",
  Z: "half-turn about z: flips the phase",
  H: "half-turn about the diagonal: pole ↔ equator",
  S: "quarter-turn about z",
  T: "eighth-turn about z",
};

function GatePlay({ widget }: { widget: Widget }) {
  const [sequence, setSequence] = useState<GateName[]>([]);
  const gates = sequence.map((g, i) => ({ ...op(g, 0), id: `${g}-${i}` }));
  const result = simulateCircuit(1, gates);
  const trail = sequence.map((_, k) => {
    const b = simulateCircuit(1, gates.slice(0, k)).blochAngles[0];
    return [b.x, b.y, b.z] as [number, number, number];
  });
  const b = result.blochAngles[0];
  const [alpha, beta] = result.statevector;
  return (
    <>
      <div className="course-controls">
        {(widget.gates ?? ["X", "H", "Z"]).map((g) => (
          <button key={g} title={GATE_BLURBS[g]} onClick={() => setSequence([...sequence, g as GateName])}>
            Apply {g}
          </button>
        ))}
        <button onClick={() => setSequence([])}>Reset to |0⟩</button>
      </div>
      <div className="widget-grid">
        <BlochSphere x={b.x} y={b.y} z={b.z} size={220} trail={trail} label="Faint dots: where the arrow has been" />
        <div>
          <p>
            <strong>Sequence:</strong> |0⟩{sequence.map((g) => ` → ${g}`).join("")}
          </p>
          <ProbabilityBars probabilities={result.statevector.map(cAbs2)} />
          <p className="amplitudes">
            α = {fmtComplex(alpha)}, β = {fmtComplex(beta)}
          </p>
          <ul className="gate-legend">
            {(widget.gates ?? []).map((g) => (
              <li key={g}>
                <strong>{g}</strong> — {GATE_BLURBS[g]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function Shots({ widget }: { widget: Widget }) {
  const [p1, setP1] = useState(widget.p1 ?? 0.3);
  const [shots, setShots] = useState(10);
  const [counts, setCounts] = useState<number[] | null>(null);
  const truth = [1 - p1, p1];
  const observed = counts ? counts.map((c) => c / shots) : null;
  const error = Math.sqrt((p1 * (1 - p1)) / shots);
  return (
    <>
      <PlainSlider label="True chance of reading 1" value={p1} set={(v) => { setP1(v); setCounts(null); }} show={`${(p1 * 100).toFixed(0)}%`} />
      <div className="course-controls">
        {[10, 100, 1000, 10000].map((n) => (
          <button key={n} className={n === shots ? "primary" : ""} onClick={() => { setShots(n); setCounts(null); }}>
            {n.toLocaleString()} shots
          </button>
        ))}
        <button className="primary" onClick={() => setCounts(sample(truth, shots))}>
          Run the experiment
        </button>
      </div>
      {counts && <ShotDots counts={counts} />}
      <ProbabilityBars probabilities={observed ?? [0, 0]} compare={truth} compareLabel="the true probabilities" />
      <Status>
        {observed
          ? `${shots.toLocaleString()} shots read 1 ${(observed[1] * 100).toFixed(1)}% of the time. Typical wobble at this many shots: ±${(error * 100).toFixed(1)}%. Run again and watch it jump — less with more shots.`
          : "Press Run: each shot is one measurement of a freshly prepared qubit."}
      </Status>
    </>
  );
}

/** The first 100 shots as dots: hollow = 0, filled = 1, in a random order. */
function ShotDots({ counts }: { counts: number[] }) {
  const dots = useMemo(() => {
    const total = counts[0] + counts[1];
    const shown = Math.min(100, total);
    const ones = Math.round((counts[1] / total) * shown);
    const list: number[] = Array.from({ length: shown }, (_, i) => (i < ones ? 1 : 0));
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [counts]);
  return (
    <figure className="shot-dots">
      <svg viewBox="0 0 400 84" width="100%" style={{ maxWidth: 400 }} role="img" aria-label={`${dots.filter(Boolean).length} of ${dots.length} shown shots read 1`}>
        {dots.map((d, i) => (
          <circle key={i} cx={10 + (i % 25) * 15.5} cy={10 + Math.floor(i / 25) * 20} r={6} fill={d ? RED : "#fffdf5"} stroke={d ? RED : INK} strokeWidth={1.5} />
        ))}
      </svg>
      <figcaption>
        {dots.length < counts[0] + counts[1] ? `A sample of 100 of your shots` : "Every shot"}: hollow = read 0, filled = read 1
      </figcaption>
    </figure>
  );
}

function BasisMeasure({ widget }: { widget: Widget }) {
  const [theta, setTheta] = useState(widget.theta ?? 0.5);
  const [phi, setPhi] = useState(widget.phi ?? 0);
  const [basis, setBasis] = useState<"Z" | "X" | "Y">("Z");
  const prep = [op("RY", 0, theta * PI), op("RZ", 0, phi * PI)];
  const rotate = basis === "X" ? [op("H", 0)] : basis === "Y" ? [op("S", 0), op("S", 0), op("S", 0), op("H", 0)] : [];
  const b = blochOf(1, prep);
  const p = probs(1, [...prep, ...rotate]);
  const axis: Record<string, [number, number, number]> = { Z: [0, 0, 1], X: [1, 0, 0], Y: [0, 1, 0] };
  const names = { Z: ["|0⟩", "|1⟩"], X: ["|+⟩", "|−⟩"], Y: ["|+i⟩", "|−i⟩"] }[basis];
  return (
    <>
      <PiSlider label="Tilt (θ)" value={theta} set={setTheta} max={1} />
      <PiSlider label="Turn (φ)" value={phi} set={setPhi} />
      <div className="course-controls" role="radiogroup" aria-label="Measurement axis">
        {(["Z", "X", "Y"] as const).map((a) => (
          <button key={a} role="radio" aria-checked={basis === a} className={basis === a ? "primary" : ""} onClick={() => setBasis(a)}>
            Ask along {a}
          </button>
        ))}
      </div>
      <div className="widget-grid">
        <BlochSphere x={b.x} y={b.y} z={b.z} size={220} ghost={axis[basis]} label={`Dashed line: the ${basis} axis you are asking about`} />
        <div>
          <h4>Answers along {basis}</h4>
          <ProbabilityBars probabilities={p} labels={names} />
        </div>
      </div>
      <Status>The odds only depend on how close the arrow is to each end of the axis you ask about.</Status>
    </>
  );
}

/* ---------------------------------------------------------------- many qubits */

function BitOrder() {
  const [value, setValue] = useState(1);
  const bits = [2, 1, 0].map((q) => (value >> q) & 1);
  return (
    <>
      <p>Press a qubit to flip it.</p>
      <div className="register">
        {[2, 1, 0].map((q, i) => (
          <button key={q} className={bits[i] ? "primary" : ""} onClick={() => setValue(value ^ (1 << q))} aria-pressed={Boolean(bits[i])}>
            <small>q{q}</small>
            <strong>{bits[i]}</strong>
          </button>
        ))}
      </div>
      <ProbabilityBars probabilities={Array.from({ length: 8 }, (_, i) => (i === value ? 1 : 0))} />
      <Status>
        Qiskit prints <code>{bits.join("")}</code> — q0 is the <strong>rightmost</strong> digit. As a number that is {value}.
      </Status>
    </>
  );
}

function PairGrid({ pairs, title }: { pairs: [number, number][]; title: string }) {
  const agree = pairs.filter(([a, b]) => a === b).length;
  return (
    <div className="pair-grid">
      <h4>{title}</h4>
      <div>
        {pairs.map(([a, b], i) => (
          <span key={i} className={a === b ? "agree" : "disagree"}>
            {b}
            {a}
          </span>
        ))}
      </div>
      <p className="caption">
        {pairs.length ? `${agree} of ${pairs.length} shots agree` : "No shots yet"}
      </p>
    </div>
  );
}

function Entangle() {
  const [runs, setRuns] = useState<{ coins: [number, number][]; bell: [number, number][] }>({ coins: [], bell: [] });
  const bit = () => (Math.random() < 0.5 ? 0 : 1);
  const bellB = blochOf(2, [op("H", 0), op("CNOT", 1, undefined, 0)], 0);
  return (
    <>
      <div className="course-controls">
        <button
          className="primary"
          onClick={() =>
            setRuns({
              coins: Array.from({ length: 10 }, () => [bit(), bit()] as [number, number]),
              bell: Array.from({ length: 10 }, () => {
                const b = bit();
                return [b, b] as [number, number];
              }),
            })
          }
        >
          Run 10 shots of each
        </button>
      </div>
      <div className="widget-grid">
        <PairGrid pairs={runs.coins} title="Two separate coins (H on each)" />
        <PairGrid pairs={runs.bell} title="A Bell pair (H, then CNOT)" />
      </div>
      <div className="bloch-row">
        <BlochSphere x={1} y={0} z={0} size={140} label="A separate coin: a full arrow (|+⟩)" />
        <BlochSphere x={bellB.x} y={bellB.y} z={bellB.z} size={140} label="Half of a Bell pair: no arrow at all" />
      </div>
      <Status>Both look random one qubit at a time. Only the Bell pair always agrees: the information lives in the pair.</Status>
    </>
  );
}

function CopyAttempt() {
  const [theta, setTheta] = useState(0.5);
  const copier = simulateCircuit(2, [op("RY", 0, theta * PI), op("CNOT", 1, undefined, 0)]);
  const copies = simulateCircuit(2, [op("RY", 0, theta * PI), op("RY", 1, theta * PI)]);
  const overlap = copier.statevector.reduce(
    (acc, a, i) => {
      const b = copies.statevector[i];
      return { r: acc.r + a.r * b.r + a.i * b.i, i: acc.i + a.r * b.i - a.i * b.r };
    },
    { r: 0, i: 0 },
  );
  const fidelity = cAbs2(overlap);
  const original = blochOf(1, [op("RY", 0, theta * PI)]);
  const after = copier.blochAngles[0];
  return (
    <>
      <PiSlider label="The original's tilt (θ)" value={theta} set={setTheta} max={1} />
      <CircuitDiagram qubits={2} gates={[op("RY", 0, theta * PI), op("CNOT", 1, undefined, 0)]} />
      <div className="widget-grid">
        <div>
          <h4>The CNOT copier gives</h4>
          <ProbabilityBars probabilities={copier.statevector.map(cAbs2)} compare={copies.statevector.map(cAbs2)} compareLabel="what two real copies would give" />
        </div>
        <div className="bloch-row">
          <BlochSphere x={original.x} y={original.y} z={original.z} size={140} label="The original before copying" />
          <BlochSphere x={after.x} y={after.y} z={after.z} size={140} label="The original after the 'copy'" />
        </div>
      </div>
      <Status>
        Fidelity with two true copies: <strong>{fidelity.toFixed(2)}</strong>.{" "}
        {fidelity > 0.995
          ? "At a pole the copier works perfectly: 0 and 1 copy fine."
          : "In between, the copier entangles instead of copying — and the original's arrow shrinks."}
      </Status>
    </>
  );
}

const TELEPORT_STEPS = [
  "Alice's mystery state is prepared on q0",
  "H on q1: start the shared Bell pair",
  "CNOT q1 → q2: Alice (q1) and Bob (q2) now share a Bell pair",
  "Alice entangles her mystery qubit with her half (CNOT q0 → q1)",
  "H on q0: Alice is ready to measure q0 and q1",
  "Bob's fix for Alice's second bit: X controlled by q1",
  "Bob's fix for Alice's first bit: Z controlled by q0",
];

function Teleport() {
  const [theta, setTheta] = useState(0.35);
  const [step, setStep] = useState(0);
  const all = [
    op("RY", 0, theta * PI),
    op("H", 1),
    op("CNOT", 2, undefined, 1),
    op("CNOT", 1, undefined, 0),
    op("H", 0),
    op("CNOT", 2, undefined, 1),
    op("CZ", 2, undefined, 0),
  ];
  const gates = all.slice(0, step + 1);
  const result = simulateCircuit(3, gates);
  const alice = blochOf(1, [all[0]]);
  const bob = result.blochAngles[2];
  return (
    <>
      <PiSlider label="Alice's state (tilt θ)" value={theta} set={setTheta} max={1} />
      <PlainSlider label="Protocol step" value={step} set={(v) => setStep(Math.round(v))} max={6} step={1} show={`${step + 1} of 7`} />
      <p className="widget-step">{TELEPORT_STEPS[step]}</p>
      <CircuitDiagram qubits={3} gates={gates} />
      <div className="bloch-row">
        <BlochSphere x={alice.x} y={alice.y} z={alice.z} size={150} label="Alice's original (q0 at the start)" />
        <BlochSphere x={bob.x} y={bob.y} z={bob.z} size={150} ghost={[alice.x, alice.y, alice.z]} label="Bob's qubit q2 now (dashed: the target)" />
      </div>
      <Status>
        {step < 6
          ? "Bob's arrow is short or pointing the wrong way: without Alice's two bits his qubit is useless."
          : "After both fixes Bob's arrow matches Alice's original exactly — the state moved; nothing was copied."}
      </Status>
    </>
  );
}

function Superdense() {
  const [x, setX] = useState(true);
  const [z, setZ] = useState(true);
  const gates = [op("H", 0), op("CNOT", 1, undefined, 0), ...(x ? [op("X", 0)] : []), ...(z ? [op("Z", 0)] : []), op("CNOT", 1, undefined, 0), op("H", 0)];
  const p = probs(2, gates);
  const message = `${x ? 1 : 0}${z ? 1 : 0}`;
  const bell = { "00": "|Φ⁺⟩", "10": "|Ψ⁺⟩", "01": "|Φ⁻⟩", "11": "|Ψ⁻⟩" }[message];
  return (
    <>
      <p>Alice twists only her own qubit (q0), then posts it to Bob.</p>
      <div className="course-controls">
        <button aria-pressed={x} className={x ? "primary" : ""} onClick={() => setX(!x)}>
          X on Alice&apos;s qubit {x ? "✓" : ""}
        </button>
        <button aria-pressed={z} className={z ? "primary" : ""} onClick={() => setZ(!z)}>
          Z on Alice&apos;s qubit {z ? "✓" : ""}
        </button>
      </div>
      <CircuitDiagram qubits={2} gates={gates} />
      <ProbabilityBars probabilities={p} />
      <Status>
        The pair is now {bell}. After Bob&apos;s CNOT and H he reads <strong>{message}</strong> with certainty — two bits from one posted qubit.
      </Status>
    </>
  );
}

/* ---------------------------------------------------------------- algorithms */

const ORACLES: Record<string, { label: string; gates: GateOp[]; balanced: boolean }> = {
  "0": { label: "f(x) = 0 (constant)", gates: [], balanced: false },
  "1": { label: "f(x) = 1 (constant)", gates: [op("X", 1)], balanced: false },
  x: { label: "f(x) = x (balanced)", gates: [op("CNOT", 1, undefined, 0)], balanced: true },
  "not-x": { label: "f(x) = NOT x (balanced)", gates: [op("CNOT", 1, undefined, 0), op("X", 1)], balanced: true },
};

function Deutsch() {
  const [oracle, setOracle] = useState("x");
  const before = [op("X", 1), op("H", 0), op("H", 1), ...ORACLES[oracle].gates];
  const gates = [...before, op("H", 0)];
  const q0 = blochOf(2, before, 0);
  const p1 = marginalOne(probs(2, gates), 0);
  return (
    <>
      <label>
        Hidden function
        <select value={oracle} onChange={(e) => setOracle(e.target.value)}>
          {Object.entries(ORACLES).map(([k, o]) => (
            <option key={k} value={k}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <CircuitDiagram qubits={2} gates={gates} />
      <div className="widget-grid">
        <BlochSphere x={q0.x} y={q0.y} z={q0.z} size={170} label="q0 just before the last H: |+⟩ or |−⟩" />
        <div>
          <h4>q0 after the last H</h4>
          <ProbabilityBars probabilities={[1 - p1, p1]} />
        </div>
      </div>
      <Status>
        One query: q0 reads <strong>{Math.round(p1)}</strong>, so f is {ORACLES[oracle].balanced ? "balanced" : "constant"}. A classical computer must ask twice: f(0) and f(1).
      </Status>
    </>
  );
}

function SecretString() {
  const [secret, setSecret] = useState(0b101);
  const n = 3;
  const before = [op("X", n), ...[0, 1, 2, 3].map((q) => op("H", q)), ...[0, 1, 2].filter((q) => (secret >> q) & 1).map((q) => op("CNOT", n, undefined, q))];
  const gates = [...before, ...[0, 1, 2].map((q) => op("H", q))];
  const pFull = probs(4, gates);
  const inputs = Array.from({ length: 8 }, (_, k) => pFull[k] + pFull[k + 8]);
  const result = simulateCircuit(4, before);
  const s = secret.toString(2).padStart(3, "0");
  return (
    <>
      <p>Set the secret hidden in the box (q2 q1 q0):</p>
      <div className="register">
        {[2, 1, 0].map((q) => (
          <button key={q} className={(secret >> q) & 1 ? "primary" : ""} onClick={() => setSecret(secret ^ (1 << q))}>
            <small>s{q}</small>
            <strong>{(secret >> q) & 1}</strong>
          </button>
        ))}
      </div>
      <CircuitDiagram qubits={4} gates={gates} />
      <div className="bloch-row">
        {[0, 1, 2].map((q) => {
          const b = result.blochAngles[q];
          return <BlochSphere key={q} x={b.x} y={b.y} z={b.z} size={130} label={`q${q} after the query: ${(secret >> q) & 1 ? "|−⟩ (sign kicked back)" : "|+⟩"}`} />;
        })}
      </div>
      <h4>The input qubits after the final H gates</h4>
      <ProbabilityBars probabilities={inputs} />
      <Status>
        One query reads the whole secret, <strong>{s}</strong>. Classically you would need {n} questions, one per bit.
      </Status>
    </>
  );
}

function Grover() {
  const [n, setN] = useState(4);
  const [marked, setMarked] = useState(3);
  const [amps, setAmps] = useState<number[]>(Array(4).fill(0.5));
  const [history, setHistory] = useState<string[]>([]);
  const reset = (size = n, m = marked) => {
    setAmps(Array(size).fill(1 / Math.sqrt(size)));
    setHistory([]);
    setN(size);
    setMarked(Math.min(m, size - 1));
  };
  const oracle = () => {
    setAmps(amps.map((a, i) => (i === marked ? -a : a)));
    setHistory([...history, "oracle"]);
  };
  const diffuser = () => {
    const mean = amps.reduce((a, b) => a + b, 0) / amps.length;
    setAmps(amps.map((a) => 2 * mean - a));
    setHistory([...history, "diffuser"]);
  };
  const width = Math.log2(n);
  const nextIsOracle = history.length % 2 === 0;
  return (
    <>
      <div className="course-controls">
        <label>
          Items
          <select value={n} onChange={(e) => reset(Number(e.target.value))}>
            {[4, 8].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <label>
          Hidden answer
          <select value={marked} onChange={(e) => reset(n, Number(e.target.value))}>
            {Array.from({ length: n }, (_, k) => (
              <option key={k} value={k}>
                {k.toString(2).padStart(width, "0")}
              </option>
            ))}
          </select>
        </label>
        <button className={nextIsOracle ? "primary" : ""} onClick={oracle}>
          Oracle: flip its sign
        </button>
        <button className={nextIsOracle ? "" : "primary"} onClick={diffuser}>
          Diffuser: reflect about the average
        </button>
        <button onClick={() => reset()}>Reset</button>
      </div>
      <AmplitudeBars amplitudes={amps} labels={amps.map((_, k) => k.toString(2).padStart(width, "0"))} highlight={marked} showMean />
      <Status>
        Chance of finding the answer: <strong>{(amps[marked] ** 2 * 100).toFixed(0)}%</strong> after {Math.floor(history.length / 2)} full round(s).{" "}
        {history.at(-1) === "oracle"
          ? "The oracle only flipped a sign — the odds haven't changed yet. Now reflect about the average."
          : amps[marked] ** 2 > 0.99
            ? "Found it: one measurement now gives the answer almost every time."
            : `Best after ${Math.round(PI / (4 * Math.asin(1 / Math.sqrt(n))) - 0.5)} round(s) for ${n} items; keep going and it overshoots.`}
      </Status>
    </>
  );
}

/** Discrete Fourier transform of real amplitudes, as the QFT applies it. */
function qftProbabilities(input: number[]): number[] {
  const N = input.length;
  return Array.from({ length: N }, (_, k) => {
    let re = 0;
    let im = 0;
    input.forEach((a, x) => {
      re += a * Math.cos((2 * PI * x * k) / N);
      im += a * Math.sin((2 * PI * x * k) / N);
    });
    return (re * re + im * im) / N;
  });
}

function QftClocks() {
  const [x, setX] = useState(1);
  const [period, setPeriod] = useState(2);
  const speeds = [1 / 2, 1 / 4, 1 / 8];
  const pattern: number[] = Array.from({ length: 8 }, (_, k) => (k % period === 0 ? 1 : 0));
  const norm = Math.sqrt(pattern.reduce((a, b) => a + b, 0));
  const spectrum = qftProbabilities(pattern.map((a) => a / norm));
  return (
    <>
      <h4>1 · A single input becomes three clock hands</h4>
      <PlainSlider label="Input number x" value={x} set={(v) => setX(Math.round(v))} max={7} step={1} show={`${x} (binary ${x.toString(2).padStart(3, "0")})`} />
      <div className="bloch-row">
        {speeds.map((s) => {
          const angle = 2 * PI * x * s;
          return <BlochSphere key={s} x={Math.cos(angle)} y={Math.sin(angle)} z={0} size={130} label={`turns ${s === 0.5 ? "½" : s === 0.25 ? "¼" : "⅛"} per step → ${piLabel(angle % (2 * PI))}`} />;
        })}
      </div>
      <p className="caption">All eight outcomes stay at 12.5%: the QFT stores x in how far each hand has turned, not in the odds.</p>
      <h4>2 · A repeating pattern becomes a few sharp peaks</h4>
      <div className="course-controls">
        {[1, 2, 4].map((r) => (
          <button key={r} className={r === period ? "primary" : ""} onClick={() => setPeriod(r)}>
            Repeats every {r}
          </button>
        ))}
      </div>
      <div className="widget-grid">
        <div>
          <p className="caption">Input amplitudes</p>
          <ProbabilityBars probabilities={pattern.map((a) => a / norm ** 2)} />
        </div>
        <div>
          <p className="caption">After the QFT</p>
          <ProbabilityBars probabilities={spectrum} />
        </div>
      </div>
      <Status>
        A pattern that repeats every {period} of 8 steps lands on multiples of 8 ÷ {period} = {8 / period}: the rhythm, read off as a position — like hearing the notes in a chord.
      </Status>
    </>
  );
}

const PHASES: [string, number][] = [
  ["1/8 (0.001 in binary)", 1 / 8],
  ["1/4 (0.010)", 1 / 4],
  ["3/8 (0.011)", 3 / 8],
  ["1/2 (0.100)", 1 / 2],
  ["3/4 (0.110)", 3 / 4],
  ["0.3 (not exact in 3 digits)", 0.3],
];

function PhaseClock() {
  const [phase, setPhase] = useState(1 / 4);
  const t = 3;
  const N = 2 ** t;
  const readout = Array.from({ length: N }, (_, k) => {
    let re = 0;
    let im = 0;
    for (let j = 0; j < N; j++) {
      const a = 2 * PI * j * (phase - k / N);
      re += Math.cos(a);
      im += Math.sin(a);
    }
    return (re * re + im * im) / (N * N);
  });
  const best = readout.indexOf(Math.max(...readout));
  return (
    <>
      <label>
        Hidden phase φ (fraction of a turn)
        <select value={phase} onChange={(e) => setPhase(Number(e.target.value))}>
          {PHASES.map(([label, v]) => (
            <option key={label} value={v}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <p>Each counting qubit watches the hand after a different number of ticks:</p>
      <div className="bloch-row">
        {[1, 2, 4].map((ticks) => {
          const angle = 2 * PI * ticks * phase;
          return <BlochSphere key={ticks} x={Math.cos(angle)} y={Math.sin(angle)} z={0} size={130} label={`after U${ticks === 1 ? "" : ticks === 2 ? "²" : "⁴"}: turned ${piLabel(angle % (2 * PI))}`} />;
        })}
      </div>
      <h4>Readout after the inverse QFT</h4>
      <ProbabilityBars probabilities={readout} labels={readout.map((_, k) => `0.${k.toString(2).padStart(t, "0")}`)} />
      <Status>
        Most likely reading: 0.{best.toString(2).padStart(t, "0")} in binary = {best}/{N} of a turn
        {Math.abs(best / N - phase) < 1e-9 ? " — exact." : `, the closest 3-digit value to ${phase} (so the bars blur).`}
      </Status>
    </>
  );
}

/* ---------------------------------------------------------------- hardware & beyond */

function Noise() {
  const [lambda, setLambda] = useState(0.1);
  const ideal = [0.5, 0, 0, 0.5];
  const noisy = ideal.map((p) => (1 - lambda) * p + lambda / 4);
  return (
    <>
      <PlainSlider label="Noise strength λ" value={lambda} set={setLambda} show={`${(lambda * 100).toFixed(0)}%`} />
      <div className="widget-grid">
        <div>
          <h4>A Bell pair on a noisy chip</h4>
          <ProbabilityBars probabilities={noisy} compare={ideal} compareLabel="the ideal result" />
        </div>
        <BlochSphere x={1 - lambda} y={0} z={0} size={190} ghost={[1, 0, 0]} label="One qubit in |+⟩: noise shrinks the arrow (dashed: ideal)" />
      </div>
      <Status>
        {(lambda * 50).toFixed(1)}% of shots now land on 01 or 10 — outcomes a perfect Bell pair never gives. Noise pulls every state toward a random mush.
      </Status>
    </>
  );
}

const ROUTES: Record<string, { label: string; pairs: [number, number][] }> = {
  near: { label: "Bell pair q0 → q1", pairs: [[0, 1]] },
  far: { label: "CNOT q0 → q3", pairs: [[0, 3]] },
  star: { label: "Star from q0", pairs: [[0, 1], [0, 2], [0, 3]] },
};

function CouplingMap({ topology, pairs }: { topology: string; pairs: [number, number][] }) {
  const pos = [[40, 60], [120, 60], [200, 60], [280, 60]];
  const edges: [number, number][] = topology === "line" ? [[0, 1], [1, 2], [2, 3]] : [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const wired = (a: number, b: number) => edges.some(([p, q]) => (p === a && q === b) || (p === b && q === a));
  return (
    <svg viewBox="0 0 320 130" width="100%" style={{ maxWidth: 360 }} role="img" aria-label="Chip wiring">
      {edges.map(([a, b]) => (
        <path key={`${a}${b}`} d={Math.abs(a - b) === 1 ? `M${pos[a][0]},${pos[a][1]} L${pos[b][0]},${pos[b][1]}` : `M${pos[a][0]},${pos[a][1]} Q${(pos[a][0] + pos[b][0]) / 2},${10 + 6 * Math.abs(a - b)} ${pos[b][0]},${pos[b][1]}`} fill="none" stroke={INK} strokeWidth={2} />
      ))}
      {pairs.filter(([a, b]) => !wired(a, b)).map(([a, b]) => (
        <path key={`need${a}${b}`} d={`M${pos[a][0]},${pos[a][1]} Q${(pos[a][0] + pos[b][0]) / 2},118 ${pos[b][0]},${pos[b][1]}`} fill="none" stroke={RED} strokeWidth={2} strokeDasharray="5 4" />
      ))}
      {pos.map(([x, y], q) => (
        <g key={q}>
          <circle cx={x} cy={y} r={16} fill={pairs.some((p) => p.includes(q)) ? "#fff1a1" : "#fffdf5"} stroke={INK} strokeWidth={2} />
          <text x={x} y={y + 5} textAnchor="middle" className="bloch-label">
            q{q}
          </text>
        </g>
      ))}
      <text x={160} y={127} textAnchor="middle" className="axis-label" fill={AMBER}>
        {pairs.some(([a, b]) => !wired(a, b)) ? "red dashed: a CNOT the wiring can't do directly" : "every CNOT needed is wired directly"}
      </text>
    </svg>
  );
}

function Routing() {
  const [route, setRoute] = useState("far");
  const [topology, setTopology] = useState("line");
  const [output, setOutput] = useState("");
  return (
    <>
      <div className="course-controls">
        <label>
          Circuit
          <select value={route} onChange={(e) => setRoute(e.target.value)}>
            {Object.entries(ROUTES).map(([k, r]) => (
              <option key={k} value={k}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Chip wiring
          <select value={topology} onChange={(e) => setTopology(e.target.value)}>
            <option value="line">Line: 0—1—2—3</option>
            <option value="full">All-to-all</option>
          </select>
        </label>
      </div>
      <CouplingMap topology={topology} pairs={ROUTES[route].pairs} />
      <div className="course-controls">
        <button
          className="primary"
          onClick={async () => {
            setOutput("Compiling with Qiskit's transpiler…");
            try {
              const data = await api<{ before: string; after: string; cx_before: number; cx_after: number }>("course/routing", { circuit: route, topology });
              setOutput(`Before (${data.cx_before} two-qubit gates)\n${data.before}\nAfter routing (${data.cx_after} two-qubit gates)\n${data.after}`);
            } catch (error) {
              setOutput(error instanceof Error ? error.message : "Compilation failed");
            }
          }}
        >
          Compile for this chip
        </button>
      </div>
      {output && <pre aria-live="polite">{output}</pre>}
    </>
  );
}

function Variational() {
  const [target, setTarget] = useState(0.8);
  const [theta, setTheta] = useState(0.3);
  const [path, setPath] = useState<number[]>([]);
  const p1 = (t: number) => Math.sin(t / 2) ** 2;
  const train = (steps: number) => {
    let value = theta;
    const visited: number[] = [];
    for (let i = 0; i < steps; i++) {
      visited.push(value);
      const derivative = (p1(value + PI / 2) - p1(value - PI / 2)) / 2;
      value = Math.max(0, Math.min(2 * PI, value - 4 * (p1(value) - target) * derivative));
    }
    setPath([...path, ...visited].slice(-30));
    setTheta(value);
  };
  return (
    <>
      <PlainSlider label="Target P(1)" value={target} set={setTarget} show={`${(target * 100).toFixed(0)}%`} />
      <div className="course-controls">
        <button className="primary" onClick={() => train(1)}>
          Train 1 step
        </button>
        <button onClick={() => train(10)}>Train 10 steps</button>
        <button onClick={() => { setTheta(0.3); setPath([]); }}>Reset</button>
      </div>
      <div className="widget-grid">
        <CurvePlot fn={p1} xMax={2 * PI} value={theta} target={target} trail={path} xLabel="knob θ" yLabel="P(1)" ticks={[[0, "0"], [PI, "π"], [2 * PI, "2π"]]} />
        <div>
          <ProbabilityBars probabilities={[1 - p1(theta), p1(theta)]} />
          <p>
            θ = {piLabel(theta)} · cost (P(1) − target)² = {((p1(theta) - target) ** 2).toFixed(4)}
          </p>
        </div>
      </div>
      <Status>Each step measures the slope (parameter-shift rule) and turns the knob a little downhill. Amber dots trace the path.</Status>
    </>
  );
}

const WIDGETS: Record<string, (props: { widget: Widget }) => React.ReactElement> = {
  interference: Interference,
  bloch_dial: BlochDial,
  gate_play: GatePlay,
  shots: Shots,
  basis_measure: BasisMeasure,
  bit_order: BitOrder,
  entangle: Entangle,
  copy_attempt: CopyAttempt,
  teleport: Teleport,
  superdense: Superdense,
  deutsch: Deutsch,
  secret_string: SecretString,
  grover: Grover,
  qft_clocks: QftClocks,
  phase_clock: PhaseClock,
  noise: Noise,
  routing: Routing,
  variational: Variational,
};

export default function IntuitionWidget({ widget }: { widget: Widget; preset?: string }) {
  const Component = useMemo(() => WIDGETS[widget.type], [widget.type]);
  if (!Component) return null;
  return (
    <section className="panel widget" aria-label={`${widget.type} intuition experiment`}>
      <Component widget={widget} />
    </section>
  );
}
