"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import CourseCard from "@/components/lms/CourseCard";
import { useLang } from "@/lib/i18n";
import { useStudio, draftToCourse } from "@/lib/studio";
import { bundle, courses, fmtPrice, fmtUsd } from "@/lib/courses";

type Filter = "all" | "design" | "motion" | "ai" | "free" | "premium";

const CATEGORY: Record<string, "design" | "motion" | "ai"> = {
  "adobe-photoshop": "design",
  "adobe-illustrator": "design",
  "adobe-after-effects": "motion",
  "adobe-premiere-pro": "motion",
  "ai-photoshoot": "ai",
  "ai-video-generation": "ai",
};

export default function CatalogView() {
  const { t, lang } = useLang();
  const studio = useStudio();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t.catalog.all },
    { id: "design", label: t.catalog.filterDesign },
    { id: "motion", label: t.catalog.filterMotion },
    { id: "ai", label: t.catalog.filterAi },
    { id: "free", label: `✦ ${t.catalog.filterFree}` },
    { id: "premium", label: t.catalog.filterPremium },
  ];

  const query = q.trim().toLowerCase();
  const shown = courses.filter((c) => {
    const byFilter =
      filter === "all"
        ? true
        : filter === "free"
          ? c.price === 0
          : filter === "premium"
            ? c.price > 0
            : CATEGORY[c.slug] === filter;
    if (!byFilter) return false;
    if (!query) return true;
    const hay = [
      c.title.en,
      c.short.en,
      c.tagline.en,
      c.level.en,
      ...c.tools,
      ...c.outcomes,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  });

  // the busiest course wears the Popular badge (sitemap: "Popular courses")
  const popularSlug = courses.reduce((a, b) =>
    b.students > a.students ? b : a
  ).slug;

  // studio-created courses (drafts) — shown when the filter allows them
  const draftCourses = (studio.drafts || [])
    .map(draftToCourse)
    .filter((c) => {
      const byFilter =
        filter === "all" || filter === "ai"
          ? filter !== "ai"
          : filter === "free"
            ? c.price === 0
            : filter === "premium"
              ? c.price > 0
              : false;
      const okFilter = filter === "all" ? true : byFilter;
      if (!okFilter) return false;
      if (!query) return true;
      return [c.title.en, c.short.en, c.tagline.en]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

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

      {/* search + filters */}
      <Reveal delay={0.15}>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-line/10 pb-6">
          <label className="relative block w-full max-w-sm">
            <span className="sr-only">{t.catalog.searchPh}</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bone-500"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.catalog.searchPh}
              className="w-full rounded-full border border-line/15 bg-ink-800/60 py-3 pl-11 pr-5 text-sm text-bone-50 placeholder:text-bone-500/70 backdrop-blur focus:border-mint/60 focus:outline-none"
            />
          </label>
          <span className="text-xs tabular-nums text-bone-500" dir="ltr">
            {shown.length} {t.catalog.results}
          </span>
          <div className="flex w-full flex-wrap gap-2">
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
        </div>
      </Reveal>

      {/* grid */}
      <Stagger
        key={`${filter}-${query}`}
        className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {shown.map((c, i) => (
          <StaggerItem key={c.slug}>
            <CourseCard course={c} eager={i < 3} popular={c.slug === popularSlug} />
          </StaggerItem>
        ))}
        {draftCourses.map((c) => (
          <StaggerItem key={c.slug}>
            <div className="relative">
              <span className="absolute -top-3 left-4 z-10 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_6px_20px_rgb(var(--mint)/0.45)] [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]">
                New ✦
              </span>
              <CourseCard course={c} href={`/preview/?slug=${c.slug}`} live={false} />
            </div>
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
                <p className="text-end" dir="ltr">
                  <span className="block text-sm text-bone-500 line-through">
                    {fmtPrice(bundle.compareAt, lang)}
                  </span>
                  <span className="block font-display text-3xl font-semibold text-mint">
                    {fmtPrice(bundle.price, lang)}
                  </span>
                  <span className="block text-xs font-medium text-bone-400">
                    ≈ {fmtUsd(bundle.price)} USD
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
