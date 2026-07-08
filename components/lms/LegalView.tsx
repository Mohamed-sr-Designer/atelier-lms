"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";

export default function LegalView({
  kind,
}: {
  kind: "terms" | "privacy" | "refunds";
}) {
  const { t, lang } = useLang();
  const doc = t.legal[kind];
  const others = (["terms", "privacy", "refunds"] as const).filter(
    (k) => k !== kind
  );

  return (
    <section className="container-edge mx-auto max-w-4xl pb-28 pt-32 md:pt-44">
      <Reveal>
        <SectionLabel index="§">{t.legal.kicker}</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.0] tracking-tightest text-bone-50 md:text-6xl">
          {doc.title}
          <span className="font-serif font-normal italic tracking-normal text-mint">.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 text-xs text-bone-500">
          {t.legal.updated}:{" "}
          {new Date("2026-07-08").toLocaleDateString(
            lang === "ar" ? "ar-EG" : "en-GB",
            { year: "numeric", month: "long", day: "numeric" }
          )}
        </p>
      </Reveal>

      <div className="mt-14 grid gap-10">
        {doc.sections.map((s, i) => (
          <Reveal key={s.h}>
            <div className="grid gap-4 border-t border-line/10 pt-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="flex items-baseline gap-3">
                  <span className="font-serif text-sm italic text-mint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg font-semibold tracking-tight text-bone-50">
                    {s.h}
                  </span>
                </p>
              </div>
              <p className="text-pretty text-sm leading-relaxed text-bone-400 md:col-span-8 md:text-base">
                {s.p}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-14 flex flex-wrap gap-5 border-t border-line/10 pt-8">
          {others.map((k) => (
            <Link
              key={k}
              href={`/legal/${k}/`}
              className="link-underline text-sm text-bone-300"
            >
              {t.legal[k].title} →
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
