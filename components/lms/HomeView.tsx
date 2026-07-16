"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import Magnetic from "@/components/ui/Magnetic";
import LogoMarquee from "@/components/LogoMarquee";
import Counter from "@/components/lms/Counter";
import FeaturedCourse from "@/components/lms/FeaturedCourse";
import FreeCoursesSlider from "@/components/lms/FreeCoursesSlider";
import WorkedWith from "@/components/lms/WorkedWith";
import Aurora from "@/components/ui/Aurora";
import GiftReveal from "@/components/ui/GiftReveal";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";
import {
  bundle,
  bundleCourses,
  courses,
  fmtDuration,
  fmtPrice,
  fmtUsd,
  getCourse,
  lessonCount,
  stats,
  totalMinutes,
} from "@/lib/courses";

const ease = [0.16, 1, 0.3, 1] as const;

// Rotated sticker chip — sized up so offers read instantly.
function Sticker({
  children,
  tone = "mint",
  rotate = -4,
  className = "",
}: {
  children: React.ReactNode;
  tone?: "mint" | "electric" | "grad" | "outline";
  rotate?: number;
  className?: string;
}) {
  const tones = {
    mint: "bg-mint text-white",
    electric: "bg-electric text-ink-900",
    grad: "text-white [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))] shadow-[0_8px_30px_rgb(var(--mint)/0.4)]",
    outline: "border border-line/40 bg-ink-900/60 text-bone-50 backdrop-blur",
  };
  return (
    <motion.span
      initial={{ scale: 0, rotate: rotate * 3 }}
      whileInView={{ scale: 1, rotate }}
      viewport={{ once: true }}
      whileHover={{ rotate: 0, scale: 1.06 }}
      transition={{ type: "spring", stiffness: 220, damping: 14 }}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-widest ${tones[tone]} ${className}`}
    >
      ✦ {children}
    </motion.span>
  );
}

// The floating collage around the AI-stack film.
const stackFloaters = [
  { src: "/lms/popup.jpg", alt: "AI campaign popup visual", cls: "-left-6 -top-10 w-28 rotate-[-7deg] md:w-36", d: 0.1 },
  { src: "/work/tilal/hero.webp", alt: "Tilal AI film hero frame", cls: "-right-8 -top-6 w-32 rotate-[6deg] md:w-44", d: 0.2 },
  { src: "/work/secure/03.webp", alt: "Cinematic AI still", cls: "-left-10 bottom-6 w-32 rotate-[4deg] md:w-40", d: 0.3 },
  { src: "/lms/winback.jpg", alt: "WINBACK campaign visual — AI production", cls: "-bottom-10 -right-6 w-28 rotate-[-5deg] md:w-36", d: 0.4 },
];

export default function HomeView() {
  const { t, lang } = useLang();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const freePs = getCourse("adobe-photoshop")!;
  const featured = getCourse("ai-photoshoot")!;
  const aiVideo = getCourse("ai-video-generation")!;
  const freeCourses = courses.filter((c) => c.price === 0);
  const softwareCourses = courses.filter((c) => !c.slug.startsWith("ai-"));
  const aiCourses = courses.filter((c) => c.slug.startsWith("ai-"));

  const allReviews = courses.flatMap((c) =>
    c.reviews.map((r) => ({ ...r, course: c.short[lang] }))
  );
  const reviews = allReviews.filter((_, i) => i % 2 === 0);
  const reviewsB = allReviews.filter((_, i) => i % 2 === 1);

  const bundleMins = bundleCourses.reduce((n, c) => n + totalMinutes(c), 0);
  const bundleLessons = bundleCourses.reduce((n, c) => n + lessonCount(c), 0);
  const savePct = Math.round((1 - bundle.price / bundle.compareAt) * 100);

  return (
    <>
      {/* ================================================= HERO — AI showcase */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      >
        <motion.div
          style={{ y: imgY, scale: imgScale }}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase("/lms/hero-banner.jpg")}
            alt="AI-produced editorial campaign — a model in a pixel-art world, made with the Tarek pipeline"
            className="h-full w-full object-cover object-[center_28%]"
          />
        </motion.div>

        {/* heavier grade for the bright artwork */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/55 to-ink-900/25" />
        <div aria-hidden className="vignette absolute inset-0" />
        <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.07]" />
        {/* cinematic light pass — a soft blurred beam with a bright core and a
            faint accent tint, like a projector sweeping the artwork */}
        <motion.div
          aria-hidden
          initial={{ x: "-180%" }}
          animate={{ x: "320%" }}
          transition={{ duration: 6.5, ease: [0.45, 0, 0.25, 1], repeat: Infinity, repeatDelay: 2 }}
          className="fx-heavy pointer-events-none absolute inset-y-[-12%] hidden w-[46%] rotate-12 mix-blend-screen md:block"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bone-50/[0.14] to-transparent blur-3xl" />
          <div className="absolute inset-y-0 left-[28%] w-[30%] bg-gradient-to-r from-transparent via-mint/25 to-transparent blur-xl" />
          <div className="absolute inset-y-0 left-[46%] w-[9%] bg-gradient-to-r from-transparent via-bone-50/25 to-transparent blur-md" />
        </motion.div>

        {/* offer sticker — loud on purpose; needs lg room or it hits the kicker */}
        <div className="absolute left-6 top-[30%] z-10 hidden lg:left-16 lg:block">
          <Sticker tone="outline" rotate={-5}>
            {t.home.heroStickers[1]}
          </Sticker>
        </div>

        {/* copy */}
        <motion.div
          style={{ opacity: copyOpacity }}
          className="container-edge relative z-10 mx-auto w-full max-w-edge pb-10 pt-32"
        >
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full border border-line/25 bg-ink-900/50 px-4 py-2 text-xs uppercase tracking-ultra text-bone-200 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
            {t.home.kicker}
          </motion.p>

          <h1 className="mt-6">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.45 }}
                className="block font-display text-[clamp(2.5rem,7.5vw,6.5rem)] font-semibold leading-[0.98] tracking-tightest text-bone-50 [text-shadow:0_2px_30px_rgb(0_0_0/0.5)]"
              >
                {t.home.heroA}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.58 }}
                className="block pb-2 font-display text-[clamp(2.5rem,7.5vw,6.5rem)] font-semibold leading-[0.98] tracking-tightest"
              >
                <span className="text-grad font-serif font-normal italic tracking-normal">
                  {t.home.heroI}
                </span>{" "}
                <span className="text-bone-50 [text-shadow:0_2px_30px_rgb(0_0_0/0.5)]">
                  {t.home.heroB}
                </span>
              </motion.span>
            </span>
          </h1>

          <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.75 }}
                className="text-pretty text-base leading-relaxed text-bone-200 md:text-lg"
              >
                {t.home.heroSub}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.9 }}
                className="mt-7 flex flex-wrap items-center gap-4"
              >
                <Magnetic>
                  <Link href="/courses/" className="btn btn-primary px-8 py-4">
                    {t.home.ctaPrimary}
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link
                    href="/bundle/"
                    className="btn btn-ghost bg-ink-900/40 px-8 py-4 backdrop-blur"
                  >
                    {t.home.bundleLabel} →
                  </Link>
                </Magnetic>
              </motion.div>
            </div>

            {/* free drop card + "4 free courses" sticker above it */}
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease, delay: 1.05 }}
              className="flex flex-col items-end gap-3"
            >
              <Sticker tone="grad" rotate={-4}>
                {t.home.heroStickers[0]}
              </Sticker>
              <Link
                href={`/courses/${freePs.slug}/`}
                className="group flex items-center gap-4 rounded-2xl border border-mint/40 bg-ink-900/70 p-4 pr-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-1deg]"
              >
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
                  style={{ background: "linear-gradient(135deg,#001E36,#31A8FF)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={withBase("/lms/icons/ps.webp")} alt="Photoshop icon" className="h-7 w-7" />
                </span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-ultra text-mint">
                    {t.home.heroCardTag}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-bone-50">
                    {freePs.short[lang]} —{" "}
                    <span className="font-bold text-mint">{fmtPrice(0, lang)}</span>
                  </span>
                </span>
                <span className="ms-2 text-mint transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </div>

          {/* bottom strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-9 flex items-end justify-between gap-6 border-t border-line/15 pt-5"
          >
            <p className="flex items-center gap-3 text-[11px] uppercase tracking-ultra text-bone-400">
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                ↓
              </motion.span>
              {t.home.scroll}
            </p>
            <div className="flex gap-8 md:gap-12">
              {[
                { n: stats.graduates, p: "+", s: "", l: t.home.stats.graduates, live: true },
                { n: stats.academies, p: "", s: "", l: t.home.stats.academies, live: false },
                { n: stats.totalHours, p: "", s: "h", l: t.home.stats.hours, live: false },
              ].map((x) => (
                <div key={x.l} className="text-end">
                  <p className="font-display text-xl font-semibold text-bone-50 md:text-2xl">
                    <Counter value={x.n} prefix={x.p} suffix={x.s} />
                    {x.live ? (
                      <span className="ml-1.5 align-middle text-[9px] font-semibold uppercase tracking-widest text-mint">
                        still counting
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 max-w-[9rem] text-[10px] uppercase tracking-widest text-bone-400">
                    {x.l}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================= TAPE =================== */}
      <section aria-hidden className="relative -mx-4 overflow-hidden py-10">
        <div className="rotate-[-1.5deg] bg-gradient-to-r from-mint via-mint to-electric py-3 shadow-[0_0_60px_rgb(var(--mint)/0.35)]">
          <div className="flex w-max animate-marquee items-center gap-6" style={{ animationDuration: "26s" }}>
            {[...t.home.marquee, ...t.home.marquee].map((w, i) => (
              <span key={i} className="flex items-center gap-6 whitespace-nowrap">
                <span className="font-display text-lg font-bold uppercase tracking-tight text-white md:text-2xl">
                  {w}
                </span>
                <span className="text-white/80">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= THE DEAL =============== */}
      <section className="container-edge mx-auto max-w-edge py-20 md:py-28">
        <Reveal>
          <SectionLabel index="01">{t.home.manLabel}</SectionLabel>
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* FREE — inverted light card */}
          <Reveal>
            <motion.div
              whileHover={{ rotate: -0.6, scale: 1.005 }}
              className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-bone-50 p-8 text-ink-900 md:p-12"
            >
              <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.05]" />
              <div className="relative">
                <Sticker tone="mint" rotate={-3}>
                  {t.home.freeTag}
                </Sticker>
                <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-[1.02] tracking-tight md:text-5xl">
                  {t.home.freeTitle}
                </h2>
                <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed opacity-70 md:text-base">
                  {t.home.freeBody}
                </p>
              </div>
              <div className="relative mt-8 flex grow flex-col justify-end">
                <p className="font-display text-7xl font-bold tracking-tightest md:text-8xl" dir="ltr">
                  EGP 0
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {freeCourses.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/courses/${c.slug}/`}
                      className="group/pill flex items-center gap-2.5 rounded-full border border-ink-900/15 bg-ink-900/[0.03] py-1.5 pl-1.5 pr-4 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-900/30 hover:bg-ink-900 hover:text-bone-50"
                    >
                      {c.icon ? (
                        <span
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-[26%]"
                          style={{
                            background: c.plate
                              ? `linear-gradient(135deg, ${c.plate[0]}, ${c.plate[1]})`
                              : "#111",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={withBase(c.icon)} alt={`${c.short.en} icon`} className="h-5 w-5 rounded-[24%]" />
                        </span>
                      ) : null}
                      {c.short[lang]}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* AI — premium card */}
          <Reveal delay={0.08}>
            <motion.div
              whileHover={{ rotate: 0.6, scale: 1.005 }}
              className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-mint/35 bg-ink-800 p-8 md:p-12"
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(140deg, rgb(var(--mint) / 0.22) 0%, transparent 45%, rgb(var(--electric) / 0.16) 100%)",
                }}
              />
              <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.06]" />
              <div className="relative">
                <Sticker tone="electric" rotate={3}>
                  {t.home.paidTag}
                </Sticker>
                <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-[1.02] tracking-tight text-bone-50 md:text-5xl">
                  {t.home.paidTitle}
                </h2>
                <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-bone-400 md:text-base">
                  {t.home.paidBody}
                </p>
              </div>
              <div className="relative mt-8 flex grow flex-col justify-end gap-3">
                {aiCourses.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/courses/${c.slug}/`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-line/15 bg-ink-900/60 px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-mint/50"
                  >
                    <span className="text-sm font-medium text-bone-50">
                      {c.short[lang]}
                    </span>
                    <span dir="ltr" className="text-end">
                      {c.compareAt ? (
                        <span className="me-2 text-xs text-bone-500 line-through">
                          {c.compareAt.toLocaleString("en-US")}
                        </span>
                      ) : null}
                      <span className="text-grad font-display text-xl font-bold">
                        {fmtPrice(c.price, lang)}
                      </span>
                      <span className="ms-2 text-xs font-medium text-bone-400">
                        · {fmtUsd(c.price)}
                      </span>
                    </span>
                  </Link>
                ))}
                <Link
                  href="/bundle/"
                  className="link-underline mt-2 text-center text-sm text-electric"
                >
                  {t.catalog.bundleCard} — {fmtPrice(bundle.price, lang)} · {savePct}%− →
                </Link>
              </div>
            </motion.div>
          </Reveal>
        </div>

        {/* market-rate anchor — the price only reads cheap next to real rates */}
        <Reveal delay={0.1}>
          <div className="glass mt-6 rounded-3xl p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-ultra text-bone-500">
              {t.home.marketLabel}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.home.marketItems.map((m) => (
                <div
                  key={m.job}
                  className="rounded-xl border border-line/10 bg-ink-900/50 px-4 py-3.5"
                >
                  <p className="text-xs text-bone-400">{m.job}</p>
                  <p className="mt-1 font-display text-lg font-semibold text-bone-50" dir="ltr">
                    {m.rate}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 font-serif text-sm italic text-mint md:text-base">
              {t.home.marketPunch}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ============================================= THE DROPS ============== */}
      <section className="border-y border-line/10 bg-ink-800/40" id="courses">
        <div className="container-edge mx-auto max-w-edge py-20 md:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <SectionLabel index="02">{t.home.coursesLabel}</SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.0] tracking-tightest text-bone-50 md:text-6xl">
                  {t.home.coursesTitleA}{" "}
                  <span className="text-grad font-serif font-normal italic tracking-normal">
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

          {/* the four free software courses, as a swipeable slider */}
          <FreeCoursesSlider courses={softwareCourses} />
        </div>
      </section>

      {/* ============================== WHY HERE — the honest comparison ====== */}
      <section className="relative overflow-hidden">
        <div className="container-edge mx-auto max-w-edge py-20 md:py-28">
          <Reveal>
            <SectionLabel index="03">{t.home.whyMeLabel}</SectionLabel>
          </Reveal>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal delay={0.05}>
              <h2 className="max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
                {t.home.whyMeTitleA}{" "}
                <span className="text-grad font-serif font-normal italic tracking-normal">
                  {t.home.whyMeTitleI}
                </span>
                {t.home.whyMeTitleB}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-sm text-sm leading-relaxed text-bone-400">
                {t.home.whyMeSub}
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {/* the market */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, ease }}
              className="rounded-3xl border border-line/10 bg-ink-800/30 p-7 md:p-9"
            >
              <p className="text-[11px] uppercase tracking-ultra text-bone-500">
                {t.home.themCol}
              </p>
              <ul className="mt-6 space-y-4">
                {t.home.whyMeRows.map((row) => (
                  <li
                    key={row.them}
                    className="flex items-start gap-3 text-sm leading-relaxed text-bone-500"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-line/10 text-[10px] text-bone-500">
                      ✕
                    </span>
                    {row.them}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* here */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, ease, delay: 0.12 }}
              className="glass-sheen relative overflow-hidden rounded-3xl border border-mint/30 bg-ink-800/70 p-7 shadow-[0_30px_90px_-40px_rgb(var(--mint)/0.35)] md:p-9"
            >
              <p className="text-[11px] uppercase tracking-ultra text-mint">
                {t.home.meCol}
              </p>
              <ul className="mt-6 space-y-4">
                {t.home.whyMeRows.map((row) => (
                  <li
                    key={row.me}
                    className="flex items-start gap-3 text-sm leading-relaxed text-bone-100"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint/15 text-[10px] font-bold text-mint">
                      ✓
                    </span>
                    {row.me}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line/10 pt-6">
                <Link href="/courses/" className="btn btn-primary px-6 py-3.5 text-sm">
                  {t.home.whyMeCta}
                </Link>
                <p className="font-serif text-sm italic text-bone-400">
                  {t.home.whyMeNote}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================= INSTRUCTOR ============= */}
      <section className="border-y border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto grid max-w-edge items-center gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <SectionLabel index="04">{t.home.instructorLabel}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
                {t.home.instructorTitleA}{" "}
                <span className="text-grad font-serif font-normal italic tracking-normal">
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
            <Reveal delay={0.14}>
              <p className="mt-8 text-[11px] uppercase tracking-ultra text-bone-500">
                {t.home.instructorChipsLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.home.instructorChips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-line/15 px-4 py-2 text-xs text-bone-300 transition-colors duration-300 hover:border-electric/50 hover:text-electric"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/instructor/"
                  className="btn btn-primary w-full justify-center px-7 py-4 text-base"
                >
                  {t.home.instructorCta} →
                </Link>
                <Link
                  href="/training/"
                  className="btn btn-ghost w-full justify-center px-7 py-4 text-base"
                >
                  {t.nav.training} →
                </Link>
              </div>
            </Reveal>
            {/* companies & academies he's worked with — under the CTAs */}
            <Reveal delay={0.22}>
              <div className="mt-8">
                <WorkedWith label={t.home.workedWithLabel} />
              </div>
            </Reveal>
          </div>
          {/* vertical portrait — clean, no wash */}
          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <motion.div
                whileHover={{ rotate: -0.8 }}
                className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-line/15"
              >
                <Media
                  src="/lms/instructor-portrait.jpg"
                  alt="Mohamed Tarek — art director and Tarek instructor"
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="h-auto w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent"
                />
                <div className="absolute bottom-5 left-5">
                  <p className="font-serif text-2xl italic text-bone-50">Mohamed Tarek</p>
                  <p className="text-[11px] uppercase tracking-ultra text-bone-200/80">
                    Art Director · Instructor
                  </p>
                </div>
              </motion.div>
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

      {/* ================================= PREMIUM · AI PHOTOSHOOT =========== */}
      <FeaturedCourse course={featured} />

      {/* ================================= PREMIUM · AI VIDEO =============== */}
      <div className="border-t border-line/10">
        <FeaturedCourse
          course={aiVideo}
          label={t.home.featuredVideoLabel}
          note={t.home.featuredVideoNote}
          flip
        />
      </div>

      {/* ============================================= THE AI STACK =========== */}
      <section className="relative border-y border-line/10 bg-ink-800/40">
        <Aurora className="opacity-40" />
        <div className="container-edge relative mx-auto max-w-edge py-24 md:py-32">
          <GiftReveal tag={t.home.giftTag} hint={t.home.giftHint}>
          <div className="glass-sheen relative overflow-hidden rounded-3xl border border-mint/25 bg-ink-900 p-8 md:p-14">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(130deg, rgb(var(--mint) / 0.16) 0%, transparent 45%, rgb(var(--electric) / 0.12) 100%)",
              }}
            />
            <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.06]" />

            <div className="relative grid items-center gap-14 lg:grid-cols-12">
              {/* copy + price */}
              <div className="lg:col-span-5">
                <Reveal>
                  <Sticker tone="grad" rotate={-3}>
                    {t.home.bundleLabel} · {savePct}%−
                  </Sticker>
                </Reveal>
                <Reveal delay={0.06}>
                  <h2 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-5xl">
                    {bundle.title[lang]}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-3 font-serif text-lg italic text-mint">
                    {t.catalog.bundleCardSub}
                  </p>
                </Reveal>
                <Reveal delay={0.14}>
                  <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-bone-400 md:text-base">
                    {bundle.desc[lang]}
                  </p>
                </Reveal>
                <Reveal delay={0.18}>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-ultra text-bone-500">
                    <span dir="ltr">
                      {fmtDuration(bundleMins, lang)} {t.bundle.totalRuntime}
                    </span>
                    <span>
                      {bundleLessons} {t.bundle.totalLessons}
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={0.22}>
                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <Magnetic>
                      <Link href="/bundle/" className="btn btn-primary px-8 py-4">
                        {t.home.bundleCta}
                      </Link>
                    </Magnetic>
                    <p dir="ltr" className="flex flex-col">
                      <span>
                        <span className="me-3 text-bone-500 line-through">
                          {fmtPrice(bundle.compareAt, lang)}
                        </span>
                        <span className="text-grad font-display text-4xl font-bold">
                          {fmtPrice(bundle.price, lang)}
                        </span>
                      </span>
                      <span className="mt-0.5 text-xs font-medium text-mint">
                        ≈ {fmtUsd(bundle.price)} USD · save {savePct}%
                      </span>
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* landscape film + floating collage */}
              <div className="lg:col-span-7">
                <Reveal delay={0.15}>
                  <div className="relative mx-6 my-10 md:mx-10">
                    <div className="relative overflow-hidden rounded-2xl border border-line/20 shadow-2xl shadow-black/50">
                      <video
                        src={withBase("/lms/reels/video-1.mp4")}
                        aria-label="AI-generated brand film — full pipeline result"
                        className="aspect-video w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                      <span className="absolute bottom-3 left-3 rounded-full bg-ink-900/75 px-3 py-1 text-[10px] uppercase tracking-widest text-bone-200 backdrop-blur">
                        ▶ AI film — no camera, no crew
                      </span>
                    </div>
                    {stackFloaters.map((f) => (
                      <motion.div
                        key={f.src}
                        initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ rotate: 0, scale: 1.08, zIndex: 20 }}
                        transition={{ type: "spring", stiffness: 200, damping: 16, delay: f.d }}
                        className={`absolute overflow-hidden rounded-xl border border-line/25 shadow-2xl shadow-black/60 ${f.cls}`}
                      >
                        <div className="aspect-[4/5]">
                          <Media src={f.src} alt={f.alt} fill sizes="176px" className="object-cover" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
          </GiftReveal>
        </div>
      </section>

      {/* ============================================= PROOF + STORY ========== */}
      <section className="overflow-hidden py-20 md:py-28">
        <div className="container-edge mx-auto max-w-edge">
          <Reveal>
            <SectionLabel index="05">{t.home.outcomesLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
              {t.home.outcomesTitleA}{" "}
              <span className="text-grad font-serif font-normal italic tracking-normal">
                {t.home.outcomesTitleI}
              </span>
              {t.home.outcomesTitleB}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.outcomes.map((x, i) => (
              <Reveal key={x.l} delay={i * 0.06}>
                <div className="group border-t-2 border-line/15 pt-4 transition-colors duration-500 hover:border-mint">
                  <p className="text-grad font-display text-5xl font-bold tracking-tightest md:text-6xl">
                    <Counter value={x.n} suffix={x.s} />
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-ultra text-bone-400">
                    {x.l}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* featured success story */}
          <Reveal delay={0.1}>
            <div className="relative mt-14 overflow-hidden rounded-3xl border border-line/15 bg-ink-800/60">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(120deg, rgb(var(--mint) / 0.14) 0%, transparent 45%, rgb(var(--electric) / 0.1) 100%)",
                }}
              />
              <div className="relative grid gap-10 p-8 md:p-12 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="text-xs uppercase tracking-ultra text-mint">
                    {t.home.storyLabel}
                  </p>
                  <blockquote className="mt-5 text-balance font-serif text-2xl italic leading-snug text-bone-50 md:text-3xl">
                    “{t.home.storyQuote}”
                  </blockquote>
                  <div className="mt-7 flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-mint/15 font-serif text-lg italic text-mint">
                      {t.home.storyName.charAt(0)}
                    </span>
                    <div>
                      <p className="text-bone-50">{t.home.storyName}</p>
                      <p className="text-sm text-bone-500">{t.home.storyRole}</p>
                    </div>
                  </div>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {t.home.storyChips.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-electric/30 bg-electric/5 px-4 py-2 text-xs text-electric"
                      >
                        ✦ {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <div className="group relative overflow-hidden rounded-2xl border border-line/15">
                    <div className="aspect-[4/3]">
                      <Media
                        src="/lms/story.jpg"
                        alt="Graduate portfolio piece — AI campaign hero visual"
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover transition-transform duration-1000 ease-cinema group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* trust strip */}
          <Reveal delay={0.12}>
            <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-line/10 bg-ink-900/60 p-6 md:flex-row md:items-center">
              <p className="max-w-md text-sm leading-relaxed text-bone-300">
                {t.home.communityNote}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.home.trustChips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-line/20 px-4 py-2 text-xs text-bone-200 transition-colors hover:border-mint/50 hover:text-mint"
                  >
                    ✦ {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* one testimonial marquee row */}
        <div className="mt-14" dir="ltr">
          <div className="relative rotate-[-1deg] overflow-visible">
            <div className="flex w-max animate-marquee items-stretch gap-5" style={{ animationDuration: "95s" }}>
              {[...reviews, ...reviews].map((r, i) => (
                <motion.figure
                  key={`${r.name}-${i}`}
                  whileHover={{ rotate: 1.5, scale: 1.03 }}
                  className="w-[22rem] shrink-0 rounded-xl border border-line/10 bg-ink-800/60 p-6"
                >
                  <p className="text-electric" aria-label={`${r.stars} stars`} dir="ltr">
                    {"★".repeat(Math.floor(r.stars))}
                    {r.stars % 1 !== 0 && <span className="text-sm align-middle">½</span>}
                    <span className="text-bone-500/40">
                      {"★".repeat(5 - Math.ceil(r.stars))}
                    </span>
                    <span className="ms-2 align-middle text-xs text-bone-500">
                      {r.stars % 1 === 0 ? `${r.stars}.0` : r.stars}
                    </span>
                  </p>
                  {/* dir=auto: Arabic reviews read RTL, English/Franco LTR */}
                  <blockquote dir="auto" className="mt-3 text-sm leading-relaxed text-bone-200">
                    “{r.text}”
                  </blockquote>
                  <figcaption className="mt-4 flex items-center justify-between text-xs">
                    <span dir="auto">
                      <span className="block text-bone-50">{r.name}</span>
                      <span className="text-bone-500">{r.role}</span>
                    </span>
                    <span className="rounded-full bg-mint/10 px-2.5 py-1 text-[10px] text-mint">
                      {r.course}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>

          {/* second strip — quick-hit glass quotes, opposite direction */}
          <div className="relative mt-6 rotate-[0.8deg] overflow-visible">
            <div className="flex w-max animate-marquee-rev items-center gap-4" style={{ animationDuration: "80s" }}>
              {[...reviewsB, ...reviewsB].map((r, i) => (
                <motion.div
                  key={`${r.name}-b-${i}`}
                  whileHover={{ y: -4, rotate: -1 }}
                  className="glass flex shrink-0 items-center gap-3 rounded-full py-2.5 pl-3 pr-5"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-mint/30 to-electric/30 font-serif text-xs italic text-bone-50">
                    {r.name.charAt(0)}
                  </span>
                  <span dir="auto" className="max-w-[19rem] truncate text-sm text-bone-200">
                    “{r.text}”
                  </span>
                  <span className="shrink-0 text-xs text-electric" dir="ltr">
                    ★ {r.stars % 1 === 0 ? `${r.stars}.0` : r.stars}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= OBJECTIONS ============= */}
      {/* editorial two-column — deliberately quieter than Begin below it */}
      <section className="border-t border-line/10">
        <div className="container-edge mx-auto grid max-w-edge gap-10 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="font-serif text-3xl italic leading-snug text-bone-50 md:text-4xl">
                {t.home.objLabel}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            {t.home.objections.map((o, i) => (
              <motion.div
                key={o.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.05 }}
                className={`flex gap-6 py-6 ${i === 0 ? "" : "border-t border-line/10"}`}
              >
                <span className="font-display text-sm font-semibold text-bone-600" dir="ltr">
                  0{i + 1}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-bone-50">
                    {o.q}
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-bone-400">
                    {o.a}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= FINAL CTA ============== */}
      <section className="bg-grid relative overflow-hidden border-t border-line/10">
        <Aurora className="opacity-70" />
        <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.05]" />
        <div className="container-edge relative mx-auto max-w-edge py-24 text-center md:py-36">
          <Reveal>
            <div className="flex justify-center">
              <SectionLabel index="✦">{t.home.finalLabel}</SectionLabel>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto mt-8 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.0] tracking-tightest md:text-7xl">
              <span className="text-bone-50">{t.home.finalTitleA}</span>{" "}
              <span className="text-grad font-serif font-normal italic tracking-normal">
                {t.home.finalTitleI}
              </span>
              <span className="text-bone-50">{t.home.finalTitleB}</span>
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
                  href={`/courses/${freePs.slug}/`}
                  className="btn btn-primary px-10 py-5 text-base"
                >
                  {t.home.finalCta}
                </Link>
              </Magnetic>
              <Link href="/courses/" className="link-underline text-sm text-bone-400">
                {t.home.finalAlt}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
