"use client";
import { useMemo, useState } from "react";
import { cAbs2, simulateCircuit } from "@/lib/quantum_simulator";
import type { GateName, GateOp } from "@/lib/quantum_simulator";
import { course } from "@/lib/course";
import type { Practice } from "@/lib/course";
import { BlochSphere, CircuitDiagram, ProbabilityBars, piLabel } from "./visuals";

export default function CircuitLab({
  preset,
  challenge,
}: {
  preset: string;
  challenge?: Practice;
}) {
  const initial = challenge
    ? { qubits: challenge.qubits, gates: [] }
    : course.presets[preset] || course.presets["Start at |0>"];
  const [gates, setGates] = useState<GateOp[]>(
    initial.gates.map((g, i) => ({
      ...g,
      id: String(i),
      control: g.control ?? undefined,
    })),
  );
  const [gate, setGate] = useState<GateName>("H");
  const [target, setTarget] = useState(0);
  const [control, setControl] = useState(0);
  const [angle, setAngle] = useState(Math.PI / 2);
  const [shots, setShots] = useState(100);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const result = useMemo(
    () => simulateCircuit(initial.qubits, gates),
    [initial.qubits, gates],
  );
  const controlled = gate === "CNOT" || gate === "CZ";
  const sample = () => {
    const histogram: Record<string, number> = {};
    for (let n = 0; n < shots; n++) {
      const draw = Math.random();
      let cumulative = 0;
      for (let i = 0; i < result.statevector.length; i++) {
        cumulative += cAbs2(result.statevector[i]);
        if (draw < cumulative || i === result.statevector.length - 1) {
          const label = i.toString(2).padStart(initial.qubits, "0");
          histogram[label] = (histogram[label] || 0) + 1;
          break;
        }
      }
    }
    setCounts(histogram);
  };
  return (
    <section
      className="panel course-lab"
      aria-label="Interactive circuit experiment"
    >
      <h2>{preset}</h2>
      {challenge && (
        <>
          <p>{challenge.goal}</p>
          <details>
            <summary>Hint</summary>
            <p>{challenge.hint}</p>
          </details>
          <p aria-live="polite">
            {Object.entries(challenge.target).every(
              ([basis, p]) =>
                Math.abs(cAbs2(result.statevector[parseInt(basis, 2)]) - p) <
                0.015,
            ) &&
            (challenge.required || []).every((g) =>
              gates.some((op) => op.gate === g),
            ) &&
            !(challenge.forbidden || []).some((g) =>
              gates.some((op) => op.gate === g),
            )
              ? "Challenge passed!"
              : "Keep experimenting: compare the probabilities and gate requirements with the goal."}
          </p>
        </>
      )}
      <div className="course-controls">
        <label>
          Gate
          <select
            value={gate}
            onChange={(e) => setGate(e.target.value as GateName)}
          >
            {["H", "X", "Y", "Z", "S", "T", "RX", "RY", "RZ", "CNOT", "CZ"].map(
              (g) => (
                <option key={g}>{g}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Target
          <select
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          >
            {Array.from({ length: initial.qubits }, (_, q) => (
              <option key={q} value={q}>
                q{q}
              </option>
            ))}
          </select>
        </label>
        {controlled && (
          <label>
            Control
            <select
              value={control}
              onChange={(e) => setControl(Number(e.target.value))}
            >
              {Array.from({ length: initial.qubits }, (_, q) => (
                <option key={q} value={q}>
                  q{q}
                </option>
              ))}
            </select>
          </label>
        )}
        {["RX", "RY", "RZ"].includes(gate) && (
          <label>
            Angle {piLabel(angle)}
            <input
              type="range"
              min={-Math.PI * 2}
              max={Math.PI * 2}
              step={Math.PI / 16}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
            />
          </label>
        )}
        <button
          className="primary"
          disabled={controlled && control === target}
          onClick={() => {
            setGates([
              ...gates,
              {
                id: crypto.randomUUID(),
                gate,
                target,
                angle,
                ...(controlled ? { control } : {}),
              },
            ]);
            setCounts({});
          }}
        >
          Add gate
        </button>
        <button
          onClick={() => {
            setGates(gates.slice(0, -1));
            setCounts({});
          }}
          disabled={!gates.length}
        >
          Undo
        </button>
        <button
          onClick={() => {
            setGates([]);
            setCounts({});
          }}
        >
          Clear
        </button>
      </div>
      <CircuitDiagram
        qubits={initial.qubits}
        gates={gates}
        onRemove={(index) => {
          setGates(gates.filter((_, i) => i !== index));
          setCounts({});
        }}
      />
      <div className="result-grid">
        <div>
          <h3>Exact probabilities</h3>
          <ProbabilityBars probabilities={result.statevector.map(cAbs2)} />
          <p className="caption">Read bit strings right to left: q0 is the rightmost bit.</p>
        </div>
        <div>
          <h3>Each qubit&apos;s arrow</h3>
          <div className="bloch-row">
            {Object.entries(result.blochAngles).map(([q, b]) => (
              <BlochSphere
                key={q}
                x={b.x}
                y={b.y}
                z={b.z}
                size={150}
                label={`q${q}${b.purity < 0.98 ? " · shrunk: entangled or mixed" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="course-controls">
        <label>
          Shots
          <input
            type="number"
            min="1"
            max="10000"
            value={shots}
            onChange={(e) =>
              setShots(
                Math.max(1, Math.min(10000, Number(e.target.value) || 1)),
              )
            }
          />
        </label>
        <button onClick={sample}>Sample measurements</button>
      </div>
      <pre aria-live="polite">
        {Object.entries(counts)
          .map(([basis, count]) => `${basis}: ${count}`)
          .join("\n")}
      </pre>
      <details>
        <summary>Matching Qiskit code</summary>
        <pre>{result.qiskitCode}</pre>
      </details>
    </section>
  );
}
