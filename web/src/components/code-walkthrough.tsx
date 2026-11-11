import type { WalkthroughSketch, WalkthroughStep } from "@/lib/course";
import { BlochSphere, ProbabilityBars } from "@/components/visuals";

const SKETCH_SIZE = 124;

// What the qubit looks like after a step: the arrow on the globe, or the odds as bars.
function Sketch({ sketch }: { sketch: WalkthroughSketch }) {
  if (sketch.kind === "arrow") {
    const [x, y, z] = sketch.xyz;
    return (
      <div className="walkthrough-sketch">
        <BlochSphere x={x} y={y} z={z} size={SKETCH_SIZE} ghost={sketch.before ?? undefined} sideLabels={false} />
        <p className="caption">{sketch.label}</p>
      </div>
    );
  }
  const labels = Object.keys(sketch.odds).sort(); // 00, 01, 10, 11: same-length bitstrings
  return (
    <div className="walkthrough-sketch">
      <ProbabilityBars probabilities={labels.map((k) => sketch.odds[k])} labels={labels} />
      <p className="caption">{sketch.label}</p>
    </div>
  );
}

// The worked example read top to bottom, one chunk at a time: the code, one short line
// on what it does, a sketch of the qubit where it helps, and an optional longer note.
// The chunks together are the whole program (a Python test checks no line is skipped).
export function CodeWalkthrough({ steps }: { steps: WalkthroughStep[] }) {
  return (
    <ol className="walkthrough" aria-label="The example, line by line">
      {steps.map((step, i) => (
        <li key={i} className={`walkthrough-step${step.sketch ? ` has-${step.sketch.kind}` : ""}`}>
          <pre>{step.code}</pre>
          <div className="walkthrough-text">
            <p className="walkthrough-does">{step.does}</p>
            {step.more && (
              <details>
                <summary>Tell me more</summary>
                <p>{step.more}</p>
              </details>
            )}
          </div>
          {step.sketch && <Sketch sketch={step.sketch} />}
        </li>
      ))}
    </ol>
  );
}

// Lesson 1 only: how to read the handful of Python pieces every example uses.
export function PythonBasics({ pairs }: { pairs: string[][] }) {
  return (
    <aside className="python-basics" aria-label="How to read the code">
      <p className="eyebrow">How to read the code</p>
      <dl>
        {pairs.map(([code, meaning]) => (
          <div key={code}>
            <dt><code>{code}</code></dt>
            <dd>{meaning}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
