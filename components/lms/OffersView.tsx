"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import Aurora from "@/components/ui/Aurora";
import GlyphPlate from "@/components/lms/GlyphPlate";
import { useLang } from "@/lib/i18n";
import {
  bundles,
  coursesOfBundle,
  fmtDuration,
  fmtPrice,
  fmtUsd,
  lessonCount,
  totalMinutes,
} from "@/lib/courses";

const ease = [0.16, 1, 0.3, 1] as const;

// The big offers page: every bundle as a full-width animated glass card —
// what's inside, the math, and one loud CTA each.
export default function OffersView() {
  const { t, lang } = useLang();

  // best value = biggest absolute saving
  const bestSlug = bundles.reduce((a, b) =>
    b.compareAt - b.price > a.compareAt - a.price ? b : a
  ).slug;

  return (
    <section className="bg-grid relative overflow-hidden pb-28 pt-32 md:pt-44">
      <Aurora className="opacity-50" />
      <div className="container-edge relative mx-auto max-w-edge">
        <Reveal>
          <SectionLabel index="✦">{t.offersPage.kicker}</SectionLabel>
        </Reveal>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.05}>
            <h1 className="max-w-2xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
              {t.offersPage.titleA}{" "}
              <span className="text-grad font-serif font-normal italic tracking-normal">
                {t.offersPage.titleI}
              </span>
              {t.offersPage.titleB}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-bone-400">
              {t.offersPage.sub}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 space-y-8">
          {bundles.map((b, bi) => {
            const items = coursesOfBundle(b);
            const mins = items.reduce((n, c) => n + totalMinutes(c), 0);
            const lessons = items.reduce((n, c) => n + lessonCount(c), 0);
            const savePct = Math.round((1 - b.price / b.compareAt) * 100);
            const best = b.slug === bestSlug;
            return (
              <Reveal key={b.slug} delay={bi * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className={`glass-sheen glass relative overflow-hidden rounded-3xl p-7 md:p-10 ${
                    best ? "ring-1 ring-mint/40" : ""
                  }`}
                >
                  {best && (
                    <span className="absolute -right-10 top-6 rotate-45 px-12 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]">
                      {t.offersPage.best}
                    </span>
                  )}
                  <div className="grid items-center gap-8 lg:grid-cols-12">
                    {/* copy */}
                    <div className="lg:col-span-7">
                      <span className="inline-flex items-center gap-2 rounded-full bg-mint/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-mint">
                        ✦ {savePct}%− · {t.offersPage.save}{" "}
                        {fmtPrice(b.compareAt - b.price, lang)}
                      </span>
                      <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-4xl">
                        {b.title[lang]}
                      </h2>
                      <p className="mt-2 font-serif text-base italic text-mint md:text-lg">
                        {b.tagline[lang]}
                      </p>
                      <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-bone-400">
                        {b.desc[lang]}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-ultra text-bone-500">
                        <span dir="ltr">
                          {fmtDuration(mins, lang)} {t.offersPage.runtime}
                        </span>
                        <span>
                          {lessons} {t.offersPage.lessonsWord}
                        </span>
                      </div>
                      {/* includes */}
                      <p className="mt-6 text-[11px] uppercase tracking-ultra text-bone-500">
                        {t.offersPage.includes}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {items.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/courses/${c.slug}/`}
                            className="flex items-center gap-2.5 rounded-full border border-line/15 bg-ink-900/50 py-1.5 pl-1.5 pr-4 text-xs text-bone-200 transition-colors hover:border-mint/50 hover:text-mint"
                          >
                            <span className="w-9" style={{ containerType: "inline-size" }}>
                              <GlyphPlate course={c} className="aspect-square rounded-lg" />
                            </span>
                            {c.short[lang]}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* price + CTA */}
                    <div className="lg:col-span-5">
                      <div className="rounded-2xl border border-line/15 bg-ink-900/60 p-6 text-center md:p-8">
                        <p dir="ltr">
                          <span className="me-3 text-bone-500 line-through">
                            {fmtPrice(b.compareAt, lang)}
                          </span>
                          <span className="text-grad font-display text-4xl font-bold md:text-5xl">
                            {fmtPrice(b.price, lang)}
                          </span>
                        </p>
                        <p className="mt-1 text-xs font-medium text-bone-400" dir="ltr">
                          ≈ {fmtUsd(b.price)} USD
                        </p>
                        <Link
                          href={`/checkout/?bundle=${b.slug}`}
                          className="btn btn-primary mt-6 w-full px-8 py-4"
                        >
                          {t.offersPage.cta}
                        </Link>
                        <p className="mt-4 text-[11px] text-bone-500">
                          {t.offersPage.codeNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
