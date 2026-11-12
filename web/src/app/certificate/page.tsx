"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { IssueForm, Issued } from "@/components/certificate-views";
import { course } from "@/lib/course";
import type { IssuedCertificate } from "@/lib/certificate";
import { api } from "@/services/api";

type Status = {
  passed: string[];
  missing: string[];
  total: number;
  complete: boolean;
  certificate: IssuedCertificate | null;
};

function Kicker() {
  return (
    <p className="kicker">
      Learn / <b>{course.brand.name}</b>
    </p>
  );
}

function SignedOut({ error }: { error: string }) {
  return (
    <>
      <h1>
        Earn your certificate<span className="dot">.</span>
      </h1>
      <p className="lede">
        Finish {course.brand.name} and get a certificate of completion with your
        name, a unique ID and a public link anyone can use to check it. You can
        add it to LinkedIn or download it as a PDF.
      </p>
      <p>
        To earn it, sign in and pass the <strong>Code it</strong> exercise in
        every lesson. Exercises are checked on our server, and only the ones
        you pass while signed in count.
      </p>
      {error && (
        <p role="alert" className="auth-error">
          {error}
        </p>
      )}
      <div className="cert-links account-menu">
        <Link href="/login">Sign in</Link>
        <Link href="/signup">Create account</Link>
      </div>
    </>
  );
}

function Progress({ status }: { status: Status }) {
  const lessons = new Map(course.lessons.map((lesson) => [lesson.id, lesson]));
  return (
    <>
      <h1>
        Your certificate<span className="dot">.</span>
      </h1>
      <p className="lede">
        Pass the <strong>Code it</strong> exercise in every lesson while signed
        in, and your certificate of completion will be ready here.
      </p>
      <div className="cert-progress">
        <progress value={status.passed.length} max={status.total} />
        <span>
          {status.passed.length} of {status.total} exercises passed
        </span>
      </div>
      <p className="cert-note">
        Only exercises checked while you are signed in count. If you passed one
        before signing in, open it and press <strong>Check exercise</strong>{" "}
        again.
      </p>
      <h2>Still to pass</h2>
      <ul className="cert-missing">
        {status.missing.map((id) => {
          const lesson = lessons.get(id);
          return (
            <li key={id}>
              <Link href={`/?lesson=${encodeURIComponent(id)}`}>
                <span>
                  {lesson ? `${lesson.number}. ${lesson.title}` : id}
                </span>
                <small>Open Code it</small>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function CertificatePage() {
  const { user, loading, error: serviceError } = useAuth();
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState("");
  const userId = user?.id;
  const load = useCallback(async () => {
    setError("");
    try {
      setStatus(await api<Status>("certificate/status"));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load your certificate.",
      );
    }
  }, []);
  useEffect(() => {
    setStatus(null);
    if (userId) load();
  }, [userId, load]);

  let content;
  if (loading || (user && !status && !error))
    content = <p role="status">Opening your certificate…</p>;
  else if (!user) content = <SignedOut error={serviceError} />;
  else if (!status)
    content = (
      <>
        <p role="alert" className="auth-error">
          {error}
        </p>
        <button onClick={load}>Try again</button>
      </>
    );
  else if (status.certificate)
    content = (
      <Issued certificate={status.certificate} lessonCount={status.total} />
    );
  else if (status.complete)
    content = (
      <IssueForm
        total={status.total}
        suggestedName={user.display_name}
        onIssued={(certificate) => setStatus({ ...status, certificate })}
        onRefused={load}
      />
    );
  else content = <Progress status={status} />;

  return (
    <main className="cert-page">
      <div className="cert-print-hide">
        <Link className="back" href="/">
          ← Back to the learning path
        </Link>
        <Kicker />
      </div>
      {content}
    </main>
  );
}
