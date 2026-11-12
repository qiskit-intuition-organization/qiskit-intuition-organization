import {
  blochSketch,
  displayUrl,
  formatIssueDate,
  type IssuedCertificate,
} from "@/lib/certificate";

// Until the official files arrive, the logo comes from The Quantum Economy's site.
const LOGO =
  "https://thequantumeconomy.com/wp-content/uploads/2026/11/the-quantum-economy-logo-tomorrowmensch.svg";
const TOPICS = [
  "qubits",
  "superposition",
  "entanglement",
  "teleportation",
  "Grover",
  "QFT",
  "phase estimation",
  "real hardware",
];
const SKETCH = blochSketch();

export type CertificateTheme = "dark" | "light";

/**
 * The A4 landscape certificate (docs/certificate/certificate-template.html).
 * It scales with its box, and prints at exactly 297 × 210 mm.
 * The printed name is always rendered as text.
 */
export function CertificateSheet({
  certificate,
  theme,
  url,
  lessonCount,
}: {
  certificate: IssuedCertificate;
  theme: CertificateTheme;
  url: string;
  lessonCount: number;
}) {
  return (
    <div className="cert-sheet-box">
      <section className={`cert-sheet ${theme}`} aria-label="Certificate">
        <div className="cert-frame" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="cert-top">
          <img
            className="cert-logo"
            src={LOGO}
            alt="The Quantum Economy, a project of tomorrowmensch"
          />
          <div className="cert-kicker">
            Learn / <b>{certificate.course}</b>
          </div>
        </div>
        <div className="cert-main">
          <div>
            <p className="cert-label">Certificate of completion</p>
            <p className="cert-certifies">This certifies that</p>
            <p className="cert-name">
              {certificate.name}
              <span className="cert-dot">.</span>
            </p>
            <p className="cert-body">
              has completed <strong>{certificate.course}</strong>, a{" "}
              {lessonCount}-lesson course in quantum computing from The Quantum
              Economy, writing and testing working Qiskit code at every step,
              from a single qubit to Grover search, the quantum Fourier
              transform and running circuits on real hardware.
            </p>
            <div className="cert-topics">
              {TOPICS.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
          </div>
          <svg
            className="cert-sketch"
            viewBox="0 0 120 120"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <text x="56" y="9">
              |0⟩
            </text>
            <text x="56" y="118">
              |1⟩
            </text>
            {SKETCH.map((stroke, i) => (
              <path
                key={i}
                d={stroke.d}
                className={stroke.tone}
                strokeWidth={stroke.width}
                strokeDasharray={stroke.dash}
              />
            ))}
            <circle cx="60" cy="62" r="1.4" className="dot" />
          </svg>
        </div>
        <div className="cert-bottom">
          <div className="cert-facts">
            <div>
              <div className="k">Date</div>
              <div className="v">{formatIssueDate(certificate.issued_at)}</div>
            </div>
            <div>
              <div className="k">Certificate ID</div>
              <div className="v mono">{certificate.id}</div>
            </div>
            <div>
              <div className="k">Verify at</div>
              <div className="v mono">{displayUrl(url)}</div>
            </div>
          </div>
          <div className="cert-sign">
            <div className="script" />
            <div className="line" />
            <div className="who">Anders Indset</div>
            <div className="role">The Quantum Economy</div>
          </div>
        </div>
        <p className="cert-fine">
          Qiskit is a trademark of IBM. This certificate is issued by The
          Quantum Economy, a project of tomorrowmensch, and is not affiliated
          with or endorsed by IBM.
        </p>
      </section>
    </div>
  );
}
