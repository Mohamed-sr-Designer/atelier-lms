"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import CourseCard from "@/components/lms/CourseCard";
import { useLang } from "@/lib/i18n";
import { bundle, bundleCourses, courses, fmtPrice } from "@/lib/courses";

type Filter = "all" | "design" | "motion" | "ai";

const CATEGORY: Record<string, Exclude<Filter, "all">> = {
  "adobe-photoshop": "design",
  "adobe-illustrator": "design",
  "adobe-after-effects": "motion",
  "adobe-premiere-pro": "motion",
  "ai-photoshoot": "ai",
  "ai-video-generation": "ai",
};

export default function CatalogView() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t.catalog.all },
    { id: "design", label: t.catalog.filterDesign },
    { id: "motion", label: t.catalog.filterMotion },
    { id: "ai", label: t.catalog.filterAi },
  ];

  const shown = courses.filter(
    (c) => filter === "all" || CATEGORY[c.slug] === filter
  );

  return (
    <section className="container-edge mx-auto max-w-edge pb-24 pt-32 md:pb-32 md:pt-44">
      <Reveal>
        <SectionLabel index="✦">{t.catalog.kicker}</SectionLabel>
      </Reveal>
      <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal delay={0.05}>
          <h1 className="max-w-2xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
            {t.catalog.titleA}{" "}
            <span className="font-serif font-normal italic tracking-normal text-mint">
              {t.catalog.titleI}
            </span>
            {t.catalog.titleB}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-bone-400">
            {t.catalog.sub}
          </p>
        </Reveal>
      </div>

      {/* filters */}
      <Reveal delay={0.15}>
        <div className="mt-12 flex flex-wrap gap-2 border-b border-line/10 pb-6">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`relative rounded-full px-5 py-2.5 text-sm transition-colors duration-300 ${
                filter === f.id
                  ? "text-ink-900"
                  : "text-bone-300 hover:text-bone-50"
              }`}
            >
              {filter === f.id && (
                <motion.span
                  layoutId="catalog-filter"
                  className="absolute inset-0 rounded-full bg-mint"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* grid */}
      <Stagger
        key={filter}
        className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {shown.map((c, i) => (
          <StaggerItem key={c.slug}>
            <CourseCard course={c} eager={i < 3} />
          </StaggerItem>
        ))}
      </Stagger>
      {shown.length === 0 && (
        <p className="mt-12 text-bone-400">{t.catalog.empty}</p>
      )}

      {/* bundle banner */}
      <Reveal delay={0.1}>
        <Link href="/bundle/" className="group mt-20 block">
          <div className="relative overflow-hidden rounded-3xl border border-mint/25 bg-ink-800 p-8 md:p-12">
            <div
              aria-hidden
              className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(110% 100% at 90% 120%, rgb(var(--mint) / 0.28) 0%, transparent 70%)",
              }}
            />
            <div className="relative flex flex-wrap items-center justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-ultra text-mint">
                  {t.home.bundleLabel}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-bone-50 md:text-4xl">
                  {t.catalog.bundleCard}
                </h2>
                <p className="mt-2 text-sm text-bone-400">
                  {t.catalog.bundleCardSub}
                </p>
              </div>
              <div className="flex items-center gap-8">
                <div className="hidden gap-3 font-serif text-4xl italic text-bone-50/80 sm:flex">
                  {bundleCourses.map((c) => (
                    <span key={c.slug}>{c.glyph}</span>
                  ))}
                </div>
                <p className="text-end" dir="ltr">
                  <span className="block text-sm text-bone-500 line-through">
                    {fmtPrice(bundle.compareAt, lang)}
                  </span>
                  <span className="block font-display text-3xl font-semibold text-mint">
                    {fmtPrice(bundle.price, lang)}
                  </span>
                </p>
                <span className="grid h-12 w-12 place-items-center rounded-full border border-mint/40 text-mint transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180">
                  →
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
