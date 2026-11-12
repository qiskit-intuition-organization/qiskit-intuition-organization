"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CertificateSheet } from "@/components/certificate-sheet";
import { useOrigin } from "@/components/certificate-views";
import { course } from "@/lib/course";
import {
  formatIssueDate,
  normalizeCertificateId,
  verifyUrl,
  type IssuedCertificate,
} from "@/lib/certificate";

type Lookup =
  | { state: "checking" }
  | { state: "valid"; certificate: IssuedCertificate }
  | { state: "not-found" }
  | { state: "error" };

function readParam(value: string | undefined) {
  try {
    return decodeURIComponent(value ?? "");
  } catch {
    return value ?? "";
  }
}

/** Public check of a certificate ID. Shows only what the certificate prints. */
export default function VerifyPage() {
  const params = useParams<{ id: string }>();
  const raw = readParam(params.id).slice(0, 40);
  const id = normalizeCertificateId(raw);
  const origin = useOrigin();
  const [lookup, setLookup] = useState<Lookup>({ state: "checking" });
  const check = useCallback(async () => {
    if (!id) {
      setLookup({ state: "not-found" });
      return;
    }
    setLookup({ state: "checking" });
    try {
      const response = await fetch(
        `/api/certificate/verify/${encodeURIComponent(id)}`,
        { cache: "no-store" },
      );
      if (response.status === 404) return setLookup({ state: "not-found" });
      const data = await response.json();
      if (!response.ok || data.valid !== true) throw new Error();
      setLookup({ state: "valid", certificate: data });
    } catch {
      setLookup({ state: "error" });
    }
  }, [id]);
  useEffect(() => {
    check();
  }, [check]);

  return (
    <main className="cert-page">
      <Link className="back" href="/">
        ← {course.brand.name}
      </Link>
      <p className="kicker">
        Certificate check / <b>{course.brand.name}</b>
      </p>
      {lookup.state === "checking" && (
        <p role="status">Checking the certificate…</p>
      )}
      {lookup.state === "error" && (
        <>
          <h1>
            We could not check this certificate<span className="dot">.</span>
          </h1>
          <p className="lede" role="alert">
            The certificate service did not answer. Please try again shortly.
          </p>
          <button onClick={check}>Try again</button>
        </>
      )}
      {lookup.state === "not-found" && (
        <>
          <h1>
            No certificate found<span className="dot">.</span>
          </h1>
          <p className="lede">
            No certificate has the ID <code>{raw || "(empty)"}</code>. Check it
            against the certificate: IDs look like{" "}
            <code>QE-QI-XXXX-XXXX</code> and never use the characters 0, O, 1,
            I or L.
          </p>
        </>
      )}
      {lookup.state === "valid" && (
        <>
          <h1>
            Valid certificate<span className="dot">.</span>
          </h1>
          <p className="lede">
            <strong>{lookup.certificate.name}</strong> completed{" "}
            <strong>{lookup.certificate.course}</strong>. Certificate{" "}
            <code>{lookup.certificate.id}</code> was issued by The Quantum
            Economy on {formatIssueDate(lookup.certificate.issued_at)}.
          </p>
          <div className="cert-preview">
            <CertificateSheet
              certificate={lookup.certificate}
              theme="dark"
              url={verifyUrl(origin, lookup.certificate.id)}
              lessonCount={course.lessons.length}
            />
          </div>
        </>
      )}
    </main>
  );
}
