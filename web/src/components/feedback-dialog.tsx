"use client";

import { useRef, useState } from "react";
import { buildFeedback, FEEDBACK_KINDS, MAX_LENGTH } from "@/lib/feedback";
import { api } from "@/services/api";

type Where = { page: string; lessonId: string; lessonTitle: string; stage: string };
type Status = { tone: "error" | "done"; text: string } | null;

/** "Report feedback": a private form inside the course. No account or GitHub needed. */
export default function FeedbackDialog({ page, lessonId, lessonTitle, stage }: Where) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState(FEEDBACK_KINDS[0]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  function open() {
    setStatus(null);
    dialog.current?.showModal();
  }

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const { payload, error } = buildFeedback({ kind, message, email, page, lessonId, stage });
    if (!payload) return setStatus({ tone: "error", text: error ?? "Please check the form." });
    setBusy(true);
    setStatus(null);
    try {
      await api("feedback", payload);
      setMessage("");
      setStatus({ tone: "done", text: "Thank you. Your feedback reached the team." });
    } catch (failure) {
      const text = failure instanceof Error ? failure.message : "";
      setStatus({ tone: "error", text: text || "It could not be sent. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="feedback-open" onClick={open}>
        Report feedback
      </button>
      <dialog ref={dialog} className="feedback-dialog" aria-labelledby="feedback-title">
        <form onSubmit={send}>
          <h2 id="feedback-title">Send feedback</h2>
          <p className="feedback-where">
            About: {lessonTitle}
            {stage ? ` · ${stage}` : ""}
          </p>
          <label className="field">
            <span>What kind?</span>
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {FEEDBACK_KINDS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Your message</span>
            <textarea
              rows={5}
              maxLength={MAX_LENGTH}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What confused you, what broke, or what you would add."
              required
            />
          </label>
          <label className="field">
            <span>Email, if you would like a reply (optional)</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <p className="feedback-note">Only the course team can read this. It is never posted publicly.</p>
          {status && (
            <p role="status" className={`feedback-status ${status.tone}`}>
              {status.text}
            </p>
          )}
          <div className="feedback-actions">
            <button type="button" onClick={() => dialog.current?.close()}>
              Close
            </button>
            <button type="submit" className="primary" disabled={busy}>
              {busy ? "Sending…" : "Send feedback"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
