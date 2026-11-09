// Timing and text rules shared by narrate, build and the scenes.
export const DEFAULT_VOICE = "bf_emma"; // Emma, the voice for every lesson. Change here to re-voice all.
export const LEAD = 0.4; // silence before the first line
export const GAP = 0.3; // between lines: one breath, no pauses
export const END_HOLD = 2.6; // the last frame holds after the last word

const BANNED = [["—", "em dash"], ["–", "en dash"]];
export function checkText(s, where) {
  for (const [ch, name] of BANNED) if (String(s).includes(ch)) throw new Error(`${name} in ${where}: ${s}`);
}

// Word cue: the time a word starts, from the transcript, or estimated from the letters before it
// when the transcriber wrote it differently (digits, symbols). `line` is 0-based; `word` is a word
// from that line's text (case and punctuation ignored); `nth` picks a later repeat (0 = first).
// With no word it returns the line's start. `offset` shifts the result.
const DIGITS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
// Lowercase letters only; a bare number the transcriber wrote as digits becomes its word.
export const norm = (s) => {
  const t = String(s).toLowerCase().replace(/[^a-z0-9']/g, "");
  return /^\d+$/.test(t) && +t <= 10 ? DIGITS[+t] : t;
};
export function makeCue(lines) {
  return function cue(line, word, nth = 0, offset = 0) {
    const L = lines[line];
    if (!L) throw new Error(`cue: no line ${line} (there are ${lines.length}, numbered from 0)`);
    if (word == null) return +(L.start + offset).toFixed(3);
    const target = norm(word);
    const hits = L.words.filter((w) => norm(w.w) === target || (target.length > 3 && norm(w.w).startsWith(target)));
    if (hits[nth]) return +(hits[nth].start + offset).toFixed(3);
    // Estimate from the script text: share of characters before the word.
    const toks = L.text.split(/\s+/);
    const idx = toks.map(norm).reduce((acc, w, i) => (w === target ? [...acc, i] : acc), [])[nth];
    if (idx == null) throw new Error(`cue: "${word}" (#${nth}) is not in line ${line}: "${L.text}"`);
    const before = toks.slice(0, idx).join(" ").length + (idx ? 1 : 0);
    return +(L.start + (L.dur * before) / L.text.length + offset).toFixed(3);
  };
}
