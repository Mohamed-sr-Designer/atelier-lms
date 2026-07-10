"use client";

import { useEffect, useState } from "react";

// The site is dark-only; this switches the ACCENT theme instead:
// "pulse" (royal magenta × cyan) ⇄ "ember" (molten orange × azure).
const THEMES = {
  pulse: { a: "#E237C7", b: "#38D1E0", next: "ember" as const },
  ember: { a: "#FF7A1A", b: "#40B2FF", next: "pulse" as const },
};

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [accent, setAccent] = useState<keyof typeof THEMES>("pulse");

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-accent") as keyof typeof THEMES) ||
      "pulse";
    setAccent(current in THEMES ? current : "pulse");
  }, []);

  const toggle = () => {
    const next = THEMES[accent].next;
    setAccent(next);
    document.documentElement.setAttribute("data-accent", next);
    try {
      localStorage.setItem("accent", next);
    } catch {}
  };

  const t = THEMES[accent];

  return (
    <button
      onClick={toggle}
      aria-label={`Switch color theme (current: ${accent})`}
      title={accent === "pulse" ? "Try the Ember theme" : "Back to Pulse"}
      className={`grid h-9 w-9 place-items-center rounded-full border border-line/15 transition-all duration-300 hover:scale-105 hover:border-mint/60 ${className}`}
    >
      <span
        aria-hidden
        className="block h-4 w-4 rounded-full transition-all duration-500"
        style={{
          background: `conic-gradient(from 210deg, ${t.a} 0deg 180deg, ${t.b} 180deg 360deg)`,
          boxShadow: `0 0 10px ${t.a}66`,
        }}
      />
    </button>
  );
}
