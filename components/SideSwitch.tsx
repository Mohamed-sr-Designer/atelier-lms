"use client";

import { useLang } from "@/lib/i18n";

// The two halves of one name: the academy (this site) and the portfolio (its
// own site). The same segmented switch sits in both headers, so moving between
// them reads as flipping a side rather than leaving.
export const PORTFOLIO_URL = "https://mohamed-sr-designer.github.io/mohamed-tarek-portfolio-v2/";

export default function SideSwitch({ className = "" }: { className?: string }) {
  const { lang } = useLang();
  const there = lang === "ar" ? "البورتفوليو" : "Portfolio";
  const here = lang === "ar" ? "الأكاديمية" : "Academy";
  return (
    <div
      role="group"
      aria-label={lang === "ar" ? "البورتفوليو أو الأكاديمية" : "Portfolio or Academy"}
      className={`inline-flex items-center rounded-full border border-line/20 bg-ink-800/80 p-1 text-[12px] font-semibold ${className}`}
    >
      <a
        href={PORTFOLIO_URL}
        className="group inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-bone-200 transition-colors hover:text-mint"
      >
        <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:translate-x-0.5">
          ↖
        </span>
        {there}
      </a>
      <span aria-current="page" className="rounded-full bg-mint px-3.5 py-1.5 text-white">
        {here}
      </span>
    </div>
  );
}
