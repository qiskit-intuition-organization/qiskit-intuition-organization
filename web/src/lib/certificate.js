/** Pure helpers for the certificate page and the public verify page. */

export const CERTIFICATE_NAME = "Qiskit Intuition, certificate of completion";
export const ISSUER = "The Quantum Economy";

// Mirrors backend/routers/certificate.py: no 0/O, 1/I/L.
const ID_PATTERN =
  /^QE-QI-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/;
const NAME_PUNCTUATION = new Set([" ", "'", "’", "-", "."]);
const LETTER = /^\p{L}$/u;
export const NAME_RULES =
  "Enter the name to print using 2 to 80 letters, spaces, apostrophes, hyphens or dots.";

/** Uppercased, trimmed ID, or null when it cannot be a certificate ID. */
export function normalizeCertificateId(value) {
  const id = String(value ?? "").trim().toUpperCase();
  return ID_PATTERN.test(id) ? id : null;
}

/**
 * The name as the server will print it, or an error. Same rules as the
 * backend; the server still decides.
 */
export function checkPrintedName(value) {
  const trimmed = String(value ?? "").normalize("NFC").trim();
  const chars = Array.from(trimmed);
  if (!chars.every((c) => LETTER.test(c) || NAME_PUNCTUATION.has(c)))
    return { error: NAME_RULES };
  const name = trimmed.replace(/ +/g, " ");
  const length = Array.from(name).length;
  const letters = chars.filter((c) => LETTER.test(c)).length;
  if (length < 2 || length > 80 || letters < 2) return { error: NAME_RULES };
  return { name };
}

/** The first word of the printed name, for "You did it, Alex." */
export function firstName(name) {
  return String(name ?? "").trim().split(" ")[0] || "";
}

/** "12 November 2026"; UTC so the server and the browser agree. */
export function formatIssueDate(seconds) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(seconds * 1000));
}

/** The public verify URL on whichever origin serves the app. */
export function verifyUrl(origin, id) {
  return `${String(origin).replace(/\/+$/, "")}/verify/${encodeURIComponent(id)}`;
}

/** The verify URL without its scheme, as printed on the certificate. */
export function displayUrl(url) {
  return String(url).replace(/^https?:\/\//, "");
}

/** LinkedIn's "Add licence or certification" link, pre-filled. */
export function linkedInUrl({ id, issuedAt, url }) {
  const issued = new Date(issuedAt * 1000);
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: CERTIFICATE_NAME,
    organizationName: ISSUER,
    issueYear: String(issued.getUTCFullYear()),
    issueMonth: String(issued.getUTCMonth() + 1),
    certUrl: url,
    certId: id,
  });
  return `https://www.linkedin.com/profile/add?${params}`;
}

/**
 * The hand-drawn Bloch sphere on the certificate: each stroke is drawn twice
 * with a small seeded wobble, so every certificate draws the same picture.
 */
export function blochSketch() {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5;
  const strokes = [];
  const path = (points, tone, width, dash) => {
    for (let pass = 0; pass < 2; pass++) {
      const d = points
        .map(
          ([x, y], i) =>
            `${i ? "L" : "M"}${(x + rnd() * 0.9).toFixed(2)},${(y + rnd() * 0.9).toFixed(2)}`,
        )
        .join("");
      strokes.push({ d, tone, width: pass ? width * 0.6 : width, dash });
    }
  };
  const ellipse = (cx, cy, rx, ry, from, to, n = 64) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const t = from + ((to - from) * i) / n;
      return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)];
    });
  const [cx, cy] = [60, 62];
  const r = 44;
  path(ellipse(cx, cy, r, r, 0, Math.PI * 2, 90), "ink", 0.9);
  path(ellipse(cx, cy, r, r * 0.3, Math.PI, Math.PI * 2), "ink", 0.6, "2 2.4");
  path(ellipse(cx, cy, r, r * 0.3, 0, Math.PI), "ink", 0.7);
  path([[cx, cy - r - 3], [cx, cy + r + 3]], "ink", 0.5, "1.5 2");
  const tip = [cx + 27, cy - 30];
  path([[cx, cy], tip], "gold", 1.5);
  path([[tip[0] - 7.2, tip[1] + 1.2], tip, [tip[0] - 1.6, tip[1] + 7]], "gold", 1.5);
  path([tip, [tip[0], cy + 6]], "gold", 0.5, "1 1.8");
  return strokes;
}
