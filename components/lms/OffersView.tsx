"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import Aurora from "@/components/ui/Aurora";
import { useLang } from "@/lib/i18n";
import {
  bundles,
  coursesOfBundle,
  fmtPrice,
  fmtUsd,
  lessonCount,
  totalMinutes,
} from "@/lib/courses";

const ease = [0.16, 1, 0.3, 1] as const;

// Plan order: Editors → AI Stack → Master (cheapest to heaviest, like
// subscription tiers). The heaviest pack is the spotlighted middle... no —
// spotlight the master pack as the tall center column, Netflix-style.
const TIER_ORDER = ["editors-suite", "motion-ai-master", "ai-production-stack"];

export default function OffersView() {
  const { t, lang } = useLang();

  const tiers = TIER_ORDER.map((slug) => bundles.find((b) => b.slug === slug)!).filter(Boolean);
  const spotlight = "motion-ai-master"; // the everything pack, center stage

  const tierTag: Record<string, string> = {
    "editors-suite": t.offersPage.tierEditors,
    "ai-production-stack": t.offersPage.tierStack,
    "motion-ai-master": t.offersPage.tierMaster,
  };

  // feature matrix rows — ✓ / — per plan
  const has = (b: (typeof bundles)[0], slug: string) => b.courseSlugs.includes(slug);
  const rows: { label: string; get: (b: (typeof bundles)[0]) => string | boolean }[] = [
    { label: t.offersPage.featCourses, get: (b) => String(b.courseSlugs.length) },
    {
      label: t.offersPage.featHours,
      get: (b) =>
        `${Math.round(coursesOfBundle(b).reduce((n, c) => n + totalMinutes(c), 0) / 60)}h`,
    },
    { label: t.offersPage.featProjects, get: (b) => String(b.courseSlugs.length) },
    { label: t.offersPage.featAE, get: (b) => has(b, "adobe-after-effects") },
    { label: t.offersPage.featPr, get: (b) => has(b, "adobe-premiere-pro") },
    { label: t.offersPage.featAiPhoto, get: (b) => has(b, "ai-photoshoot") },
    { label: t.offersPage.featAiVideo, get: (b) => has(b, "ai-video-generation") },
    { label: t.offersPage.featSupport, get: () => true },
    { label: t.offersPage.featLifetime, get: () => true },
  ];

  return (
    <section className="bg-grid relative overflow-hidden pb-28 pt-32 md:pt-44">
      <Aurora className="hidden opacity-50 md:block" />
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

        {/* ======================= the three plans, side by side ============== */}
        <div className="mt-16 grid items-end gap-6 lg:grid-cols-3">
          {tiers.map((b, i) => {
            const items = coursesOfBundle(b);
            const mins = items.reduce((n, c) => n + totalMinutes(c), 0);
            const lessons = items.reduce((n, c) => n + lessonCount(c), 0);
            const savePct = Math.round((1 - b.price / b.compareAt) * 100);
            const hot = b.slug === spotlight;
            return (
              <motion.div
                key={b.slug}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.7, ease, delay: i * 0.12 }}
                whileHover={{ y: -8 }}
                className={`glass-sheen relative overflow-hidden rounded-3xl border ${
                  hot
                    ? "border-mint/40 bg-ink-800/80 shadow-[0_30px_90px_-30px_rgb(var(--mint)/0.35)] lg:pb-4"
                    : "border-line/15 bg-ink-800/50"
                }`}
              >
                {/* spotlight crown */}
                {hot && (
                  <div className="relative overflow-hidden py-2.5 text-center text-[11px] font-bold uppercase tracking-widest text-white [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]">
                    ✦ {t.offersPage.best} ✦
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ left: ["-35%", "135%"] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                )}

                <div className="p-7 md:p-8">
                  <p className="text-[11px] uppercase tracking-ultra text-bone-500">
                    {tierTag[b.slug]}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-bone-50">
                    {b.title[lang]}
                  </h2>
                  <p className="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-bone-400">
                    {b.tagline[lang]}
                  </p>

                  {/* price block */}
                  <div className="mt-6" dir="ltr">
                    <p className="text-sm text-bone-500 line-through">
                      {fmtPrice(b.compareAt, lang)}
                    </p>
                    <p className={`font-display font-bold tracking-tightest ${hot ? "text-grad text-5xl" : "text-4xl text-bone-50"}`}>
                      {fmtPrice(b.price, lang)}
                    </p>
                    <p className="mt-1 text-xs text-bone-400">
                      ≈ {fmtUsd(b.price)} USD · {t.offersPage.perOnce}
                    </p>
                    <span className="mt-3 inline-block rounded-full bg-mint/10 px-3 py-1 text-[11px] font-bold text-mint">
                      {t.offersPage.save} {fmtPrice(b.compareAt - b.price, lang)} ({savePct}%)
                    </span>
                  </div>

                  <Link
                    href={`/checkout/?bundle=${b.slug}`}
                    className={`mt-6 block w-full py-4 text-center ${
                      hot ? "btn btn-primary" : "btn btn-ghost"
                    }`}
                  >
                    {t.offersPage.cta}
                  </Link>

                  {/* what's inside */}
                  <div className="mt-7 border-t border-line/10 pt-5">
                    <p className="text-[11px] uppercase tracking-ultra text-bone-500">
                      {t.offersPage.includes}
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {items.map((c) => (
                        <li key={c.slug} className="flex items-center gap-2.5 text-sm text-bone-200">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint/15 text-[10px] font-bold text-mint">
                            ✓
                          </span>
                          {c.short[lang]}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs text-bone-500" dir="ltr">
                      {Math.round(mins / 60)}h {t.offersPage.runtime} · {lessons}{" "}
                      {t.offersPage.lessonsWord}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ======================= feature comparison matrix ================== */}
        <Reveal delay={0.1}>
          <div className="mt-20">
            <SectionLabel index="✦">{t.offersPage.compareLabel}</SectionLabel>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr>
                    <th className="sticky start-0 z-10 w-1/3 bg-ink-900 pb-4 text-start text-[11px] font-medium uppercase tracking-ultra text-bone-500" />
                    {tiers.map((b) => (
                      <th
                        key={b.slug}
                        className={`pb-4 text-center font-display text-base font-semibold ${
                          b.slug === spotlight ? "text-grad" : "text-bone-200"
                        }`}
                      >
                        {b.title[lang]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <motion.tr
                      key={row.label}
                      // opacity only — a transform on <tr> would break the
                      // sticky first column inside the scroll container
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: ri * 0.04 }}
                      className="group"
                    >
                      <td className="sticky start-0 z-10 border-t border-line/10 bg-ink-900 py-3.5 pe-3 text-bone-300 transition-colors group-hover:text-bone-50">
                        {row.label}
                      </td>
                      {tiers.map((b) => {
                        const v = row.get(b);
                        return (
                          <td
                            key={b.slug}
                            className={`border-t border-line/10 py-3.5 text-center ${
                              b.slug === spotlight ? "bg-mint/[0.04]" : ""
                            }`}
                          >
                            {typeof v === "boolean" ? (
                              v ? (
                                <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-mint/15 text-xs font-bold text-mint">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-bone-600">—</span>
                              )
                            ) : (
                              <span className="font-semibold tabular-nums text-bone-100" dir="ltr">
                                {v}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                  {/* CTA row */}
                  <tr>
                    <td className="sticky start-0 z-10 border-t border-line/10 bg-ink-900 py-5" />
                    {tiers.map((b) => (
                      <td key={b.slug} className="border-t border-line/10 px-3 py-5 text-center">
                        <Link
                          href={`/checkout/?bundle=${b.slug}`}
                          className={`inline-block rounded-full px-5 py-2.5 text-xs font-semibold transition-transform hover:-translate-y-0.5 ${
                            b.slug === spotlight
                              ? "text-white [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]"
                              : "border border-line/20 text-bone-200 hover:border-mint/50"
                          }`}
                        >
                          {fmtPrice(b.price, lang)} →
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-center text-xs text-bone-500">
              {t.offersPage.codeNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
