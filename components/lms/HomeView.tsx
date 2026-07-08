"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import Magnetic from "@/components/ui/Magnetic";
import LogoMarquee from "@/components/LogoMarquee";
import CourseCard from "@/components/lms/CourseCard";
import Counter from "@/components/lms/Counter";
import PathRail from "@/components/lms/PathRail";
import FaqList from "@/components/lms/FaqList";
import GlyphPlate from "@/components/lms/GlyphPlate";
import { useLang } from "@/lib/i18n";
import {
  bundle,
  bundleCourses,
  courses,
  fmtDuration,
  fmtPrice,
  getCourse,
  lessonCount,
  stats,
  totalMinutes,
} from "@/lib/courses";

export default function HomeView() {
  const { t, lang } = useLang();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const free = getCourse("ai-photoshoot")!;

  const reviews = courses.flatMap((c) =>
    c.reviews.map((r) => ({ ...r, course: c.short[lang] }))
  );
  const rowA = reviews.filter((_, i) => i % 2 === 0);
  const rowB = reviews.filter((_, i) => i % 2 === 1);

  const bundleMins = bundleCourses.reduce((n, c) => n + totalMinutes(c), 0);
  const bundleLessons = bundleCourses.reduce((n, c) => n + lessonCount(c), 0);
  const savePct = Math.round((1 - bundle.price / bundle.compareAt) * 100);

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <section
        ref={heroRef}
        className="bg-grid relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40"
      >
        {/* ember wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 85% 100%, rgb(var(--mint) / 0.14) 0%, transparent 65%)",
          }}
        />
        <div className="container-edge relative mx-auto grid max-w-edge items-center gap-14 lg:grid-cols-12">
          {/* copy */}
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="✦">{t.home.kicker}</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-7 text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 sm:text-6xl md:text-7xl xl:text-[5.4rem]">
                {t.home.heroA}
                <br />
                <span className="font-serif font-normal italic tracking-normal text-mint">
                  {t.home.heroI}
                </span>{" "}
                {t.home.heroB}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-bone-400 md:text-lg">
                {t.home.heroSub}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <Link
                    href={`/courses/${free.slug}/`}
                    className="inline-block rounded-full bg-mint px-8 py-4 text-sm font-medium text-ink-900 transition-transform duration-300 hover:scale-[1.04]"
                  >
                    {t.home.ctaPrimary}
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link
                    href="/courses/"
                    className="inline-block rounded-full border border-line/25 px-8 py-4 text-sm text-bone-50 transition-colors duration-300 hover:border-mint/60 hover:text-mint"
                  >
                    {t.home.ctaSecondary}
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
            {/* trust row */}
            <Reveal delay={0.24}>
              <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-line/10 pt-6">
                {[
                  { n: stats.graduates, s: "+", l: t.home.stats.graduates },
                  { n: stats.academies, s: "", l: t.home.stats.academies },
                  { n: stats.totalHours, s: "h", l: t.home.stats.hours },
                ].map((x) => (
                  <div key={x.l}>
                    <p className="font-display text-2xl font-semibold text-bone-50 md:text-3xl">
                      <Counter value={x.n} suffix={x.s} />
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-ultra text-bone-500">
                      {x.l}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* portrait */}
          <div className="relative lg:col-span-5">
            <motion.div style={{ y: portraitY }} className="relative">
              <Reveal delay={0.1}>
                <div className="relative overflow-hidden rounded-2xl border border-line/15">
                  <Media
                    src="/lms/instructor-tall.png"
                    alt="Mohamed Tarek — art director and Atelier instructor, in his studio library"
                    width={1023}
                    height={1536}
                    priority
                    className="h-auto w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent"
                  />
                  {/* name chip */}
                  <div className="absolute bottom-5 left-5 rtl:left-auto rtl:right-5">
                    <p className="font-serif text-xl italic text-bone-50">
                      Mohamed Tarek
                    </p>
                    <p className="text-[11px] uppercase tracking-ultra text-bone-200/80">
                      Art Director · Instructor
                    </p>
                  </div>
                </div>
              </Reveal>
              {/* floating free-course card */}
              <Reveal delay={0.3}>
                <Link
                  href={`/courses/${free.slug}/`}
                  className="group absolute -bottom-8 flex items-center gap-4 rounded-xl border border-mint/30 bg-ink-800/90 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 ltr:-left-6 ltr:md:-left-14 rtl:-right-6 rtl:md:-right-14"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-mint/15 font-serif text-lg italic text-mint">
                    {free.glyph}
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-ultra text-mint">
                      {t.home.heroCardTag}
                    </span>
                    <span className="mt-0.5 block text-sm font-medium text-bone-50">
                      {free.short[lang]} — {fmtPrice(0, lang)}
                    </span>
                  </span>
                  <span className="ms-2 text-mint transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </Link>
              </Reveal>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- marquee */}
      <section aria-hidden className="overflow-hidden border-y border-line/10 py-5">
        <div className="flex w-max animate-marquee items-center gap-8">
          {[...t.home.marquee, ...t.home.marquee].map((w, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="font-display text-2xl font-semibold tracking-tight text-bone-500/60 md:text-3xl">
                {w}
              </span>
              <span className="font-serif text-xl italic text-mint">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- catalog */}
      <section className="container-edge mx-auto max-w-edge py-24 md:py-32" id="courses">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel index="01">{t.home.coursesLabel}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-bone-50 md:text-6xl">
                {t.home.coursesTitleA}{" "}
                <span className="font-serif font-normal italic text-mint">
                  {t.home.coursesTitleI}
                </span>
                {t.home.coursesTitleB}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-bone-400">
              {t.home.coursesNote}
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <StaggerItem key={c.slug}>
              <CourseCard course={c} eager={i < 3} />
            </StaggerItem>
          ))}
          {/* bundle teaser card in the grid */}
          <StaggerItem>
            <Link href="/bundle/" className="group block h-full">
              <article className="relative flex h-full min-h-[19rem] flex-col justify-between overflow-hidden rounded-2xl border border-mint/30 bg-ink-800 p-7">
                <div
                  aria-hidden
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 85% 110%, rgb(var(--mint) / 0.3) 0%, transparent 65%)",
                  }}
                />
                <div className="relative">
                  <p className="text-xs uppercase tracking-ultra text-mint">
                    {t.home.bundleLabel}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-bone-50 md:text-3xl">
                    {t.catalog.bundleCard}
                  </h3>
                  <p className="mt-2 text-sm text-bone-400">{t.catalog.bundleCardSub}</p>
                </div>
                <div className="relative flex items-end justify-between">
                  <div className="flex gap-2 font-serif text-3xl italic text-bone-50">
                    {bundleCourses.map((c) => (
                      <span key={c.slug} className="opacity-80">
                        {c.glyph}
                      </span>
                    ))}
                  </div>
                  <p className="text-end">
                    <span className="block text-sm text-bone-500 line-through" dir="ltr">
                      {fmtPrice(bundle.compareAt, lang)}
                    </span>
                    <span className="block font-display text-2xl font-semibold text-mint" dir="ltr">
                      {fmtPrice(bundle.price, lang)}
                    </span>
                  </p>
                </div>
              </article>
            </Link>
          </StaggerItem>
        </Stagger>
      </section>

      {/* ---------------------------------------------------------- method */}
      <section className="border-y border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto max-w-edge py-24 md:py-32">
          <div className="text-center">
            <Reveal>
              <div className="flex justify-center">
                <SectionLabel index="02">{t.home.pathLabel}</SectionLabel>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-bone-50 md:text-6xl">
                {t.home.pathTitleA}{" "}
                <span className="font-serif font-normal italic text-mint">
                  {t.home.pathTitleI}
                </span>
                {t.home.pathTitleB}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-bone-400">
                {t.home.pathNote}
              </p>
            </Reveal>
          </div>
          <PathRail />
        </div>
      </section>

      {/* ---------------------------------------------------------- why */}
      <section className="container-edge mx-auto max-w-edge py-24 md:py-32">
        <Reveal>
          <SectionLabel index="03">{t.home.whyLabel}</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-bone-50 md:text-6xl">
            {t.home.whyTitleA}{" "}
            <span className="font-serif font-normal italic text-mint">
              {t.home.whyTitleI}
            </span>
            {t.home.whyTitleB}
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 sm:grid-cols-2">
          {t.home.why.map((w, i) => (
            <StaggerItem
              key={w.t}
              className="group bg-ink-900 p-8 transition-colors duration-500 hover:bg-ink-800 md:p-10"
            >
              <p className="font-serif text-sm italic text-mint">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-bone-50 md:text-2xl">
                {w.t}
              </h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-bone-400">
                {w.d}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ---------------------------------------------------------- instructor */}
      <section className="border-y border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto grid max-w-edge items-center gap-12 py-24 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-line/15">
                <Media
                  src="/lms/instructor-wide.png"
                  alt="Mohamed Tarek teaching — warm studio light, arms crossed"
                  width={1731}
                  height={1787}
                  className="h-auto w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="04">{t.home.instructorLabel}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-bone-50 md:text-6xl">
                {t.home.instructorTitleA}{" "}
                <span className="font-serif font-normal italic text-mint">
                  {t.home.instructorTitleI}
                </span>
                {t.home.instructorTitleB}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-bone-400 md:text-lg">
                {t.home.instructorBio}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8">
                <Magnetic>
                  <Link
                    href="/instructor/"
                    className="inline-block rounded-full border border-line/25 px-7 py-3.5 text-sm text-bone-50 transition-colors duration-300 hover:border-mint/60 hover:text-mint"
                  >
                    {t.home.instructorCta} →
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="pb-16">
          <p className="mb-6 text-center text-xs uppercase tracking-ultra text-bone-500">
            {t.home.brandsNote}
          </p>
          <LogoMarquee />
        </div>
      </section>

      {/* ---------------------------------------------------------- testimonials */}
      <section className="overflow-hidden py-24 md:py-32">
        <div className="container-edge mx-auto max-w-edge">
          <Reveal>
            <SectionLabel index="05">{t.home.testimonialsLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-bone-50 md:text-6xl">
              {t.home.testimonialsTitleA}{" "}
              <span className="font-serif font-normal italic text-mint">
                {t.home.testimonialsTitleI}
              </span>
              {t.home.testimonialsTitleB}
            </h2>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-5" dir="ltr">
          {[
            { rows: rowA, anim: "animate-marquee", dur: "95s" },
            { rows: rowB, anim: "animate-marquee-rev", dur: "110s" },
          ].map(({ rows, anim, dur }, ri) => (
            <div key={ri} className="relative overflow-hidden">
              <div
                className={`flex w-max items-stretch gap-5 ${anim}`}
                style={{ animationDuration: dur }}
              >
                {[...rows, ...rows].map((r, i) => (
                  <figure
                    key={`${r.name}-${i}`}
                    className="w-[22rem] shrink-0 rounded-xl border border-line/10 bg-ink-800/60 p-6"
                  >
                    <p className="text-electric" aria-label={`${r.stars} stars`}>
                      {"★".repeat(r.stars)}
                      <span className="text-bone-500/40">
                        {"★".repeat(5 - r.stars)}
                      </span>
                    </p>
                    <blockquote className="mt-3 text-sm leading-relaxed text-bone-200">
                      “{r.text}”
                    </blockquote>
                    <figcaption className="mt-4 flex items-center justify-between text-xs">
                      <span>
                        <span className="block text-bone-50">{r.name}</span>
                        <span className="text-bone-500">{r.role}</span>
                      </span>
                      <span className="rounded-full bg-mint/10 px-2.5 py-1 text-[10px] text-mint">
                        {r.course}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- bundle */}
      <section className="container-edge mx-auto max-w-edge pb-24 md:pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-mint/25 bg-ink-800">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(110% 100% at 90% 120%, rgb(var(--mint) / 0.3) 0%, rgb(var(--mint) / 0.06) 45%, transparent 75%)",
              }}
            />
            <div className="relative grid items-center gap-10 p-8 md:p-14 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="text-xs uppercase tracking-ultra text-mint">
                  {t.home.bundleLabel} — {savePct}% {t.bundle.save}
                </p>
                <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-5xl">
                  {bundle.title[lang]}
                </h2>
                <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-bone-400 md:text-base">
                  {bundle.desc[lang]}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-ultra text-bone-500">
                  <span dir="ltr">{fmtDuration(bundleMins, lang)} {t.bundle.totalRuntime}</span>
                  <span>{bundleLessons} {t.bundle.totalLessons}</span>
                  <span>{t.bundle.certNote}</span>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Magnetic>
                    <Link
                      href="/bundle/"
                      className="inline-block rounded-full bg-mint px-8 py-4 text-sm font-medium text-ink-900 transition-transform duration-300 hover:scale-[1.04]"
                    >
                      {t.home.bundleCta}
                    </Link>
                  </Magnetic>
                  <p dir="ltr">
                    <span className="me-3 text-bone-500 line-through">
                      {fmtPrice(bundle.compareAt, lang)}
                    </span>
                    <span className="font-display text-3xl font-semibold text-bone-50">
                      {fmtPrice(bundle.price, lang)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="hidden gap-4 lg:col-span-5 lg:grid lg:grid-cols-3">
                {bundleCourses.map((c, i) => (
                  <div
                    key={c.slug}
                    className={i === 1 ? "translate-y-6" : ""}
                    style={{ containerType: "inline-size" }}
                  >
                    <GlyphPlate course={c} className="aspect-[3/4]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------- faq teaser */}
      <section className="border-t border-line/10">
        <div className="container-edge mx-auto max-w-edge py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel index="06">{t.home.faqLabel}</SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-5xl">
                  {t.home.faqTitle}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <Link
                  href="/faq/"
                  className="link-underline mt-6 inline-block text-sm text-mint"
                >
                  {t.home.faqCta} →
                </Link>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal delay={0.1}>
                <FaqList items={t.faqPage.items.slice(0, 4)} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- final CTA */}
      <section className="bg-grid relative overflow-hidden border-t border-line/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 115%, rgb(var(--mint) / 0.2) 0%, transparent 70%)",
          }}
        />
        <div className="container-edge relative mx-auto max-w-edge py-28 text-center md:py-40">
          <Reveal>
            <div className="flex justify-center">
              <SectionLabel index="✦">{t.home.finalLabel}</SectionLabel>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto mt-8 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-7xl">
              {t.home.finalTitleA}{" "}
              <span className="font-serif font-normal italic tracking-normal text-mint">
                {t.home.finalTitleI}
              </span>
              {t.home.finalTitleB}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-lg text-pretty text-sm leading-relaxed text-bone-400 md:text-base">
              {t.home.finalSub}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-col items-center gap-4">
              <Magnetic strength={0.5}>
                <Link
                  href={`/courses/${free.slug}/`}
                  className="inline-block rounded-full bg-mint px-10 py-5 text-base font-medium text-ink-900 transition-transform duration-300 hover:scale-[1.05]"
                >
                  {t.home.finalCta}
                </Link>
              </Magnetic>
              <Link
                href="/courses/"
                className="link-underline text-sm text-bone-400"
              >
                {t.home.finalAlt}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
