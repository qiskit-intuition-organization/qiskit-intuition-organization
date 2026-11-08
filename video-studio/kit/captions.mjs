// Captions are the spoken words, a few at a time, with math shown as notation.
// A scene can add its own spoken -> shown pairs with `export const phrases = [["C NOT", "CNOT"]]`.
export const BASE_PHRASES = [
  ["sine squared of theta over two", "sin²(θ/2)"],
  ["pi over two", "π/2"], ["pi over three", "π/3"], ["pi over four", "π/4"], ["two pi", "2π"],
  ["fifty fifty", "50/50"], ["Fifty fifty", "50/50"],
  ["R Y", "RY"], ["R X", "RX"], ["R Z", "RZ"], ["C NOT", "CNOT"],
  ["theta", "θ"], ["pi", "π"],
];

function tokens(say, phrases) {
  const out = [];
  let rest = say.trim();
  while (rest) {
    const hit = phrases.find(([p]) => rest.startsWith(p) && !/[A-Za-z]/.test(rest[p.length] || ""));
    const sayTok = hit ? hit[0] : rest.match(/^\S+/)[0];
    let tail = "";
    rest = rest.slice(sayTok.length);
    if (hit) { const p = rest.match(/^[.,:;!?]*/)[0]; tail = p; rest = rest.slice(p.length); }
    out.push({ show: (hit ? hit[1] : sayTok) + tail, weight: sayTok.length + tail.length + 1 });
    rest = rest.trimStart();
  }
  return out;
}

// Break at commas and full stops; a clause longer than MAX_WORDS is split evenly, and a clause
// of one or two words joins its neighbour.
const MAX_WORDS = 8;
function chunks(say, phrases) {
  const clauses = [];
  let cur = [];
  for (const tk of tokens(say, phrases)) { cur.push(tk); if (/[.,:;!?]$/.test(tk.show)) { clauses.push(cur); cur = []; } }
  if (cur.length) clauses.push(cur);
  const merged = [];
  for (const c of clauses) {
    const prev = merged[merged.length - 1];
    if (prev && (c.length <= 2 || prev.length <= 2) && prev.length + c.length <= MAX_WORDS) merged[merged.length - 1] = [...prev, ...c];
    else merged.push(c);
  }
  return merged.flatMap((c) => {
    if (c.length <= MAX_WORDS) return [c];
    const parts = Math.ceil(c.length / 7), size = Math.ceil(c.length / parts);
    return Array.from({ length: parts }, (_, k) => c.slice(k * size, (k + 1) * size));
  });
}

// -> [[start, end, text], ...] covering the whole film; each caption holds until the next.
export function captionCues(lines, total, extraPhrases = []) {
  const phrases = [...extraPhrases, ...BASE_PHRASES].sort((a, b) => b[0].length - a[0].length);
  const starts = [];
  lines.forEach((l) => {
    const groups = chunks(l.text, phrases);
    const sum = groups.flat().reduce((s, t) => s + t.weight, 0);
    let t = l.start;
    groups.forEach((g) => {
      starts.push([+t.toFixed(3), g.map((x) => x.show).join(" ")]);
      t += (l.dur * g.reduce((s, x) => s + x.weight, 0)) / sum;
    });
  });
  return starts.map(([a, text], i) => [a, i + 1 < starts.length ? starts[i + 1][0] : total, text]);
}
