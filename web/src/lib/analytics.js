// Page-view addresses sent to Vercel Web Analytics. Query strings can carry
// password-reset tokens or emails, so only the path and the lesson ID are kept.
const LESSON_ID = /^[a-z0-9-]{1,60}$/;

/** The address with everything private removed, or null to skip the event. */
export function privateUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const lesson = parsed.searchParams.get("lesson");
  const keep = lesson && LESSON_ID.test(lesson) ? `?lesson=${lesson}` : "";
  return `${parsed.origin}${parsed.pathname}${keep}`;
}
