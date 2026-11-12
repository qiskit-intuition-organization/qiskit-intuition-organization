"use client";
import { useEffect, useState } from "react";
import {
  CertificateSheet,
  type CertificateTheme,
} from "@/components/certificate-sheet";
import {
  checkPrintedName,
  displayUrl,
  firstName,
  linkedInUrl,
  verifyUrl,
  type IssuedCertificate,
} from "@/lib/certificate";
import { api } from "@/services/api";

const HINT: Record<CertificateTheme, string> = {
  dark: "Best for screens and LinkedIn",
  light: "Best for printing",
};

/** The site's own origin, so verify links work on any deployment. */
export function useOrigin() {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return origin;
}

export function IssueForm({
  total,
  suggestedName,
  onIssued,
  onRefused,
}: {
  total: number;
  suggestedName: string;
  onIssued: (certificate: IssuedCertificate) => void;
  onRefused: () => void;
}) {
  const [value, setValue] = useState(
    () => checkPrintedName(suggestedName).name ?? "",
  );
  const [confirming, setConfirming] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function issue(name: string) {
    setBusy(true);
    setError("");
    try {
      const data = await api<{ certificate: IssuedCertificate }>(
        "certificate",
        { name },
      );
      onIssued(data.certificate);
    } catch (e) {
      setConfirming("");
      setError(e instanceof Error ? e.message : "Please try again.");
      onRefused();
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <h1>
        Claim your certificate<span className="dot">.</span>
      </h1>
      <p className="lede">
        You have passed the coding exercise in all {total} lessons. Enter your
        name as it should appear on your certificate.
      </p>
      {error && (
        <p role="alert" className="auth-error">
          {error}
        </p>
      )}
      <form
        className="cert-form"
        onSubmit={(event) => {
          event.preventDefault();
          const { name, error: problem } = checkPrintedName(value);
          if (!name) {
            setError(problem ?? "");
            return;
          }
          setError("");
          setValue(name);
          setConfirming(name);
        }}
      >
        <label>
          Name to print
          <input
            name="certificate_name"
            autoComplete="name"
            required
            maxLength={80}
            value={value}
            disabled={busy || Boolean(confirming)}
            onChange={(event) => setValue(event.target.value)}
          />
          <small>
            2 to 80 characters: letters (accents are fine), spaces,
            apostrophes, hyphens and dots.
          </small>
        </label>
        <p className="cert-warning">
          Check it carefully. Once your certificate is issued, the name and the
          certificate ID cannot be changed.
        </p>
        {confirming ? (
          <div role="group" aria-label="Confirm the name">
            <p>
              Print <strong>{confirming}</strong> on your certificate? This
              cannot be changed later.
            </p>
            <div className="buttons">
              <button
                type="button"
                className="primary"
                disabled={busy}
                onClick={() => issue(confirming)}
              >
                {busy ? "Issuing…" : "Yes, issue it"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirming("")}
              >
                Change the name
              </button>
            </div>
          </div>
        ) : (
          <div className="buttons">
            <button className="primary">Issue my certificate</button>
          </div>
        )}
      </form>
    </>
  );
}

export function Issued({
  certificate,
  lessonCount,
}: {
  certificate: IssuedCertificate;
  lessonCount: number;
}) {
  const [theme, setTheme] = useState<CertificateTheme>("dark");
  const [copied, setCopied] = useState("");
  const origin = useOrigin();
  const url = verifyUrl(origin, certificate.id);
  function download() {
    // The browser's print window saves the sheet as an A4 landscape PDF.
    const title = document.title;
    document.title = `${certificate.course} certificate ${certificate.id}`;
    window.addEventListener("afterprint", () => (document.title = title), {
      once: true,
    });
    window.print();
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied("Verify link copied.");
    } catch {
      setCopied(`Copy failed. The link is ${url}`);
    }
  }
  return (
    <>
      {/* Only on this page: print the sheet on one A4 landscape page. */}
      <style>{"@page { size: 297mm 210mm; margin: 0; }"}</style>
      <div className="cert-print-hide">
        <h1>
          You did it, {firstName(certificate.name)}
          <span className="dot">.</span>
        </h1>
        <p className="lede">
          All {lessonCount} lessons and every coding exercise are done. Choose a
          style for your certificate, then download it or add it to LinkedIn.
        </p>
        <div className="cert-controls">
          <span className="label" id="cert-style">
            Style
          </span>
          <div className="cert-switch" role="group" aria-labelledby="cert-style">
            {(["dark", "light"] as const).map((option) => (
              <button
                key={option}
                type="button"
                data-theme={option}
                aria-pressed={theme === option}
                onClick={() => setTheme(option)}
              >
                <span className="swatch" aria-hidden="true" />
                {option === "dark" ? "Dark" : "Light"}
              </button>
            ))}
          </div>
          <span className="cert-hint">{HINT[theme]}</span>
        </div>
      </div>
      <div className="cert-preview">
        <CertificateSheet
          certificate={certificate}
          theme={theme}
          url={url}
          lessonCount={lessonCount}
        />
      </div>
      <div className="cert-print-hide">
        <div className="cert-actions">
          <button type="button" className="btn primary" onClick={download}>
            Download PDF ({theme})
          </button>
          <a
            className="btn"
            href={linkedInUrl({
              id: certificate.id,
              issuedAt: certificate.issued_at,
              url,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            Add to LinkedIn
          </a>
          <button type="button" className="btn" onClick={copy}>
            Copy verify link
          </button>
        </div>
        <p className="cert-note" role="status">
          {copied}
        </p>
        <p className="cert-note">
          Download PDF opens your browser’s print window, already set to A4
          landscape: choose <strong>Save as PDF</strong> as the destination.
        </p>
        <p className="cert-note">
          Anyone can check it at{" "}
          <a href={url}>
            <code>{displayUrl(url)}</code>
          </a>
        </p>
      </div>
    </>
  );
}
