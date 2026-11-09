import type { Config } from "tailwindcss";

/* Colours and fonts point at the theme tokens defined in src/app/notebook.css. */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--base)",
        raised: "var(--raised)",
        inset: "var(--inset)",
        hover: "var(--hover)",
        text: { DEFAULT: "var(--text)", 2: "var(--text-2)" },
        muted: "var(--muted)",
        gold: "var(--gold)",
        error: "var(--error)",
        success: "var(--success)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
    },
  },
  plugins: [],
};

export default config;
