"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

// Playful live signal: a number that keeps easing toward random targets
// between 1 and 100 — up and down, forever.
export default function LiveViewers() {
  const { t } = useLang();
  const [n, setN] = useState(42);
  const target = useRef(42);

  useEffect(() => {
    const retarget = setInterval(() => {
      target.current = 1 + Math.floor(Math.random() * 100);
    }, 2600);
    const step = setInterval(() => {
      setN((cur) => {
        const diff = target.current - cur;
        if (diff === 0) return cur;
        return cur + Math.sign(diff) * Math.max(1, Math.floor(Math.abs(diff) / 6));
      });
    }, 90);
    return () => {
      clearInterval(retarget);
      clearInterval(step);
    };
  }, []);

  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-line/15 bg-ink-900/60 px-4 py-2 text-xs text-bone-300 backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
      </span>
      <span className="font-display text-sm font-bold tabular-nums text-bone-50" suppressHydrationWarning>
        {n}
      </span>
      {t.course.viewingNow}
    </span>
  );
}
