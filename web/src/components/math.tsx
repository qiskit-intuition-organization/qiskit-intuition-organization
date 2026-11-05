"use client";
import katex from "katex";

/** Typeset a LaTeX formula. Errors show the source instead of breaking the page. */
export default function MathBlock({ latex, fallback }: { latex?: string; fallback?: string }) {
  if (!latex) return fallback ? <pre>{fallback}</pre> : null;
  const html = katex.renderToString(latex, {
    displayMode: true,
    throwOnError: false,
    trust: false,
    strict: "ignore",
    output: "htmlAndMathml",
  });
  return <div className="math-block" dangerouslySetInnerHTML={{ __html: html }} />;
}
