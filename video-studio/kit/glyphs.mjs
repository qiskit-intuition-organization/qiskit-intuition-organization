// Hand-drawn math glyphs. Caveat and TASA Orbiter have no Greek letters, kets, roots or arrows,
// so the pen draws them (and Caveat's slanted | becomes a straight bar for kets) as small SVG strokes that inherit the text colour and size.
// θ and π are the pilot's (lesson 6). aria-labels use names, never the characters, so hand()
// can safely run twice over the same string.
const svg = (cls, viewBox, d, label) =>
  `<svg class="gl ${cls}" viewBox="${viewBox}" aria-label="${label}"><path d="${d}"/></svg>`;

export const GLYPHS = {
  "θ": svg("gl-th", "0 0 60 100", "M31 10 C14 11 9 38 10 54 C11 78 21 91 31 89 C46 87 52 62 50 44 C48 22 42 10 31 10 Z M12 51 C24 48 37 50 49 47", "theta"),
  "π": svg("gl-pi", "0 22 64 72", "M6 38 C22 32 42 34 59 30 M23 36 C23 56 20 74 14 89 M43 35 C41 58 43 77 53 87", "pi"),
  "ψ": svg("gl-psi", "0 0 64 100", "M8 32 C7 56 16 68 32 68 C48 68 57 56 56 30 M33 10 C32 40 31 70 30 94", "psi"),
  "φ": svg("gl-phi", "0 0 64 100", "M33 8 C32 40 31 70 30 96 M31 34 C14 35 7 46 8 56 C9 67 19 73 32 72 C46 71 56 64 56 53 C56 42 47 34 31 34 Z", "phi"),
  "α": svg("gl-al", "0 0 64 100", "M54 34 C46 62 36 80 20 78 C8 76 6 58 14 46 C22 34 36 34 42 50 C47 64 52 76 60 78", "alpha"),
  "β": svg("gl-be", "0 0 60 100", "M16 98 C17 70 17 44 19 28 C21 12 44 10 46 26 C47 38 36 45 27 47 C42 47 52 56 50 70 C48 84 30 88 18 78", "beta"),
  "ω": svg("gl-om", "0 0 74 100", "M14 42 C6 60 12 78 24 78 C34 78 37 66 37 56 C37 66 40 78 50 78 C62 78 68 60 60 42", "omega"),
  "Σ": svg("gl-sig", "0 0 60 100", "M52 14 C38 13 24 14 10 14 L34 52 L10 90 C24 89 38 90 54 89", "sum"),
  "⊗": svg("gl-ot", "0 0 70 100", "M35 26 C20 26 10 38 10 52 C10 67 21 78 35 78 C50 78 60 67 60 52 C60 38 49 26 35 26 Z M18 34 L52 70 M52 34 L18 70", "tensor"),
  "|": svg("gl-bar", "0 0 24 100", "M12 6 C13 36 11 66 12 96", "bar"),
  "⟩": svg("gl-ket", "0 0 40 100", "M8 6 C18 22 26 38 32 52 C26 66 18 80 9 96", "ket"),
  "⟨": svg("gl-bra", "0 0 40 100", "M32 6 C22 22 14 38 8 52 C14 66 22 80 31 96", "bra"),
  "√": svg("gl-root", "0 0 70 100", "M4 62 L15 55 L28 94 C36 64 44 34 50 8 L68 7", "root"),
  "→": svg("gl-to", "0 0 90 100", "M6 56 C30 53 55 55 80 53 M62 38 C70 44 76 49 81 53 C75 58 68 63 61 69", "to"),
  "≈": svg("gl-approx", "0 0 70 100", "M6 44 C18 34 28 50 38 44 C48 38 56 40 64 36 M6 66 C18 56 28 72 38 66 C48 60 56 62 64 58", "approx"),
};

export const hand = (s) => [...Object.entries(GLYPHS)].reduce((out, [ch, g]) => out.replaceAll(ch, g), String(s));

// CSS for the glyphs, scoped under #root. Heights are in em so a glyph follows its label's size.
export const GLYPH_CSS = `
    #root .gl { display: inline-block; height: 0.7em; width: 0.44em; vertical-align: -0.02em; margin: 0 0.02em; overflow: visible; }
    #root .gl path { fill: none; stroke: currentColor; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; }
    #root .gl-pi { height: 0.56em; width: 0.5em; vertical-align: 0; }
    #root .gl-psi, #root .gl-phi { height: 0.78em; width: 0.5em; vertical-align: -0.16em; }
    #root .gl-al, #root .gl-om { height: 0.56em; width: 0.56em; vertical-align: 0; }
    #root .gl-be { height: 0.86em; width: 0.46em; vertical-align: -0.16em; }
    #root .gl-sig { height: 0.74em; width: 0.5em; vertical-align: -0.02em; }
    #root .gl-ot { height: 0.6em; width: 0.6em; vertical-align: 0; }
    #root .gl-bar { height: 0.86em; width: 0.16em; vertical-align: -0.14em; }
    #root .gl-ket, #root .gl-bra { height: 0.86em; width: 0.3em; vertical-align: -0.14em; }
    #root .gl-root { height: 0.8em; width: 0.56em; vertical-align: -0.1em; }
    #root .gl-to { height: 0.6em; width: 0.8em; vertical-align: 0; }
    #root .gl-approx { height: 0.6em; width: 0.6em; vertical-align: 0; }`;
