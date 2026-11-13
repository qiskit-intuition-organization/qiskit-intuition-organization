import assert from "node:assert/strict";
import { test } from "node:test";
import { FEEDBACK_KINDS, buildFeedback } from "../src/lib/feedback.js";

const where = { page: "course", lessonId: "phase", stage: "Formalize" };

test("feedback kinds match the backend's list", () => {
  assert.deepEqual(FEEDBACK_KINDS, ["Confusing explanation", "Bug", "Idea", "Something I liked"]);
});

test("a good message becomes the payload the backend expects", () => {
  const result = buildFeedback({ kind: "Bug", message: "  The bars never update.  ", email: " ", ...where });
  assert.deepEqual(result, {
    payload: { kind: "Bug", message: "The bars never update.", page: "course", lesson_id: "phase", stage: "Formalize" },
  });
});

test("an optional email is trimmed and sent only when given", () => {
  const { payload } = buildFeedback({ kind: "Idea", message: "Add a lesson on noise.", email: " me@example.com ", ...where });
  assert.equal(payload.email, "me@example.com");
});

test("too short, too long and unknown kinds are explained before sending", () => {
  assert.match(buildFeedback({ kind: "Bug", message: "short", ...where }).error, /at least 10/);
  assert.match(buildFeedback({ kind: "Bug", message: "x".repeat(4001), ...where }).error, /under 4000/);
  assert.match(buildFeedback({ kind: "Spam", message: "A long enough message.", ...where }).error, /kind/);
  assert.match(buildFeedback({ kind: "Bug", message: "A long enough message.", email: "nope", ...where }).error, /email/);
});

test("length is counted in characters, so emoji are not double-counted", () => {
  const nineEmoji = "😀".repeat(9);
  assert.match(buildFeedback({ kind: "Idea", message: nineEmoji, ...where }).error, /at least 10/);
  assert.ok(buildFeedback({ kind: "Idea", message: "😀".repeat(10), ...where }).payload);
});
