import type { WalkthroughStep } from "@/lib/course";

// The worked example read top to bottom, one chunk at a time. Under each chunk: what it
// does and, where it helps, what it means in the lesson's picture. The chunks together
// are the whole program (a Python test checks that no line is skipped).
export function CodeWalkthrough({ steps }: { steps: WalkthroughStep[] }) {
  return (
    <ol className="walkthrough" aria-label="The example, line by line">
      {steps.map((step, i) => (
        <li key={i} className="walkthrough-step">
          <pre>{step.code}</pre>
          <div className="walkthrough-notes">
            <p>
              <span className="eyebrow">What it does</span>
              {step.does}
            </p>
            {step.picture && (
              <p className="walkthrough-picture">
                <span className="eyebrow">In the picture</span>
                {step.picture}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
