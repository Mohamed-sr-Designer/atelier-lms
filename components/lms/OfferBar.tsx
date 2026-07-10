"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

// Sticky launch-offer ribbon above the nav: a looping marquee plus a live
// 7-day countdown. The deadline persists per browser so it feels real.
const DEADLINE_KEY = "offer-ends";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const getDeadline = () => {
  try {
    const saved = localStorage.getItem(DEADLINE_KEY);
    const n = saved ? parseInt(saved, 10) : NaN;
    if (!Number.isNaN(n) && n > Date.now()) return n;
    const fresh = Date.now() + SEVEN_DAYS;
    localStorage.setItem(DEADLINE_KEY, String(fresh));
    return fresh;
  } catch {
    return Date.now() + SEVEN_DAYS;
  }
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function OfferBar() {
  const { t } = useLang();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => setLeft(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const d = left !== null ? Math.floor(left / 86400000) : 0;
  const h = left !== null ? Math.floor((left % 86400000) / 3600000) : 0;
  const m = left !== null ? Math.floor((left % 3600000) / 60000) : 0;
  const s = left !== null ? Math.floor((left % 60000) / 1000) : 0;

  const chunk = (
    <span className="mx-8 inline-flex items-center gap-3 whitespace-nowrap">
      <span className="font-semibold">✦ {t.offer.text}</span>
      <span className="opacity-80">
        {t.offer.ends}{" "}
        <span className="font-bold tabular-nums" suppressHydrationWarning>
          {d}
          {t.offer.days} {pad(h)}
          {t.offer.hours} {pad(m)}
          {t.offer.mins} {pad(s)}
          {t.offer.secs}
        </span>
      </span>
      <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-bold backdrop-blur">
        {t.offer.cta} →
      </span>
    </span>
  );

  return (
    <Link
      href="/bundle/"
      aria-label={`${t.offer.text} — ${t.offer.ends}`}
      className="fixed inset-x-0 top-0 z-[60] block overflow-hidden bg-gradient-to-r from-mint via-mint to-electric text-[11px] text-white shadow-[0_4px_30px_rgb(var(--mint)/0.35)] md:text-xs"
    >
      <div className="animate-marquee flex w-max items-center py-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i}>{chunk}</span>
        ))}
      </div>
    </Link>
  );
}
