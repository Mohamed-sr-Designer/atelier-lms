import type { Config } from "tailwindcss";
import path from "path";

// Colors are CSS-variable backed so the whole UI flips between dark (default)
// and light themes just by swapping the variables on <html> (see globals.css).
// Content globs are anchored to this file so the dev server finds sources even
// when started from a different working directory (e.g. the workspace root).
const here = (p: string) => path.join(__dirname, p).replace(/\\/g, "/");

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    here("app/**/*.{ts,tsx}"),
    here("components/**/*.{ts,tsx}"),
    here("lib/**/*.{ts,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "rgb(var(--bg) / <alpha-value>)",
          800: "rgb(var(--bg2) / <alpha-value>)",
          700: "rgb(var(--bg3) / <alpha-value>)",
          600: "rgb(var(--bg4) / <alpha-value>)",
          500: "rgb(var(--bg5) / <alpha-value>)",
        },
        bone: {
          50: "rgb(var(--fg) / <alpha-value>)",
          200: "rgb(var(--fg2) / <alpha-value>)",
          400: "rgb(var(--fg3) / <alpha-value>)",
          500: "rgb(var(--fg4) / <alpha-value>)",
        },
        line: "rgb(var(--line) / <alpha-value>)",
        electric: "rgb(var(--electric) / <alpha-value>)",
        mint: "rgb(var(--mint) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        ultra: "0.32em",
      },
      maxWidth: {
        edge: "1680px",
      },
      transitionTimingFunction: {
        cinema: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.5" },
          "50%": { transform: "translate(4%, -6%) scale(1.15)", opacity: "0.8" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-rev": "marqueeReverse 50s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        aurora: "aurora 18s ease-in-out infinite",
        shimmer: "shimmer 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
