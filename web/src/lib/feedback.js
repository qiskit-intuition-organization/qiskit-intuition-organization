// The in-course feedback form. These rules mirror backend/routers/feedback.py.
export const FEEDBACK_KINDS = ["Confusing explanation", "Bug", "Idea", "Something I liked"];
export const MIN_LENGTH = 10;
export const MAX_LENGTH = 4000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns { payload } ready to send, or { error } to show the learner. */
export function buildFeedback({ kind, message, email = "", page = "", lessonId = "", stage = "" }) {
  const text = String(message ?? "").trim();
  const length = [...text].length; // Code points, as the backend counts them.
  const reply = String(email ?? "").trim();
  if (!FEEDBACK_KINDS.includes(kind)) return { error: "Choose what kind of feedback this is." };
  if (length < MIN_LENGTH)
    return { error: `Please write at least ${MIN_LENGTH} characters so the team can act on it.` };
  if (length > MAX_LENGTH) return { error: `Please keep it under ${MAX_LENGTH} characters.` };
  if (reply && !EMAIL.test(reply)) return { error: "Check the email address, or leave it empty." };
  const payload = { kind, message: text, page, lesson_id: lessonId, stage };
  return { payload: reply ? { ...payload, email: reply } : payload };
}
