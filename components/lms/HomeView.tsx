"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
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
import FeaturedCourse from "@/components/lms/FeaturedCourse";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";
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

const ease = [0.16, 1, 0.3, 1] as const;

// Rotated sticker chip — the tape/badge language, tuned down to premium.
function Sticker({
  children,
  tone = "mint",
  rotate = -4,
  className = "",
}: {
  children: React.ReactNode;
  tone?: "mint" | "electric" | "outline";
  rotate?: number;
  className?: string;
}) {
  const tones = {
    mint: "bg-mint text-ink-900",
    electric: "bg-electric text-ink-900",
    outline: "border border-line/40 bg-ink-900/60 text-bone-50 backdrop-blur",
  };
  return (
    <motion.span
      initial={{ scale: 0, rotate: rotate * 3 }}
      whileInView={{ scale: 1, rotate }}
      viewport={{ once: true }}
      whileHover={{ rotate: 0, scale: 1.06 }}
      transition={{ type: "spring", stiffness: 220, damping: 14 }}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest ${tones[tone]} ${className}`}
    >
      ✦ {children}
    </motion.span>
  );
}

// Portfolio pieces produced with the exact workflows the courses teach.
const gallery = [
  { src: "/work/axia/hero.webp", alt: "AXIA campaign key visual — AI photoshoot pipeline" },
  { src: "/work/fresh-valley/hero.webp", alt: "Fresh Valley identity — Illustrator construction" },
  { src: "/work/auto/hero.webp", alt: "Automotive key visual — Photoshop compositing" },
  { src: "/work/ihs/hero.webp", alt: "IHS hospitality campaign — retouch and grade" },
  { src: "/work/axia/insta-2.webp", alt: "AXIA social set — AI generation finished in Photoshop" },
  { src: "/work/fresh-valley/marks.webp", alt: "Fresh Valley marks — vector systems" },
];

export default function HomeView() {
  const { t, lang } = useLang();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // cinematic depth: the photo drifts and swells, the copy sinks and dissolves
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const headY = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const copyBlur = useTransform(scrollYProgress, [0, 0.7], [0, 8]);
  const copyFilter = useMotionTemplate`blur(${copyBlur}px)`;

  const freePs = getCourse("adobe-photoshop")!;
  const featured = getCourse("ai-photoshoot")!;
  const gridCourses = courses.filter((c) => c.slug !== featured.slug);
  const freeCourses = courses.filter((c) => c.price === 0);
  const aiCourses = courses.filter((c) => c.price > 0);

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
      {/* ================================================= HERO — cinematic */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      >
        {/* the landscape portrait — parallax + slow swell */}
        <motion.div
          style={{ y: imgY, scale: imgScale }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase("/lms/hero-landscape.jpg")}
            alt="Mohamed Tarek — art director, standing in his spotlit studio library"
            className="h-full w-full object-cover object-[center_30%]"
          />
        </motion.div>

        {/* cinematic treatments: grade, vignette, grain, ember, light sweep */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/25 to-ink-900/45" />
        <div aria-hidden className="vignette absolute inset-0" />
        <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.08]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 50% at 50% 115%, rgb(var(--mint) / 0.22) 0%, transparent 65%)",
          }}
        />
        <motion.div
          aria-hidden
          initial={{ x: "-160%" }}
          animate={{ x: "360%" }}
          transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
          className="pointer-events-none absolute inset-y-0 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-bone-50/[0.07] to-transparent mix-blend-screen"
        />

        {/* floating stickers */}
        <div className="absolute right-6 top-24 z-10 hidden md:block lg:right-16 lg:top-28">
          <Sticker tone="mint" rotate={5}>
            {t.home.heroStickers[0]}
          </Sticker>
        </div>
        <div className="absolute top-[38%] z-10 hidden md:block ltr:left-6 ltr:lg:left-16 rtl:right-6 rtl:lg:right-16">
          <Sticker tone="outline" rotate={-5}>
            {t.home.heroStickers[1]}
          </Sticker>
        </div>
        <div className="absolute right-8 top-[52%] z-10 hidden lg:block">
          <Sticker tone="electric" rotate={4}>
            {t.home.heroStickers[2]}
          </Sticker>
        </div>

        {/* copy over the image — dissolves as you scroll past */}
        <motion.div
          style={{ opacity: copyOpacity, filter: copyFilter }}
          className="container-edge relative z-10 mx-auto w-full max-w-edge pb-10 pt-36"
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

          <motion.h1 style={{ y: headY }} className="mt-6">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.45 }}
                className="block font-display text-[clamp(2.6rem,8.5vw,7.5rem)] font-semibold leading-[0.95] tracking-tightest text-bone-50"
              >
                {t.home.heroA}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.58 }}
                className="block font-display text-[clamp(2.6rem,8.5vw,7.5rem)] font-semibold leading-[0.95] tracking-tightest"
              >
                <span className="glow-mint font-serif font-normal italic tracking-normal text-mint">
                  {t.home.heroI}
                </span>{" "}
                <span className="text-outline">{t.home.heroB}</span>
              </motion.span>
            </span>
          </motion.h1>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
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
                  <Link
                    href="/courses/"
                    className="inline-block rounded-full bg-mint px-8 py-4 text-sm font-semibold text-ink-900 transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                  >
                    {t.home.ctaPrimary}
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link
                    href="/bundle/"
                    className="inline-block rounded-full border border-line/30 bg-ink-900/40 px-8 py-4 text-sm text-bone-50 backdrop-blur transition-colors duration-300 hover:border-mint/60 hover:text-mint active:scale-95"
                  >
                    {t.home.bundleLabel} →
                  </Link>
                </Magnetic>
              </motion.div>
            </div>

            {/* free drop card */}
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease, delay: 1.05 }}
            >
              <Link
                href={`/courses/${freePs.slug}/`}
                className="group flex items-center gap-4 rounded-2xl border border-mint/40 bg-ink-900/70 p-4 pr-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-1deg] rtl:pl-6 rtl:pr-4"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-mint/15 font-serif text-xl italic text-mint">
                  {freePs.glyph}
                </span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-ultra text-mint">
                    {t.home.heroCardTag}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-bone-50">
                    {freePs.short[lang]} — {fmtPrice(0, lang)}
                  </span>
                </span>
                <span className="ms-2 text-mint transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </div>

          {/* bottom strip: scroll cue + record */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-10 flex items-end justify-between gap-6 border-t border-line/15 pt-5"
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
                { n: stats.graduates, s: "+", l: t.home.stats.graduates },
                { n: stats.academies, s: "", l: t.home.stats.academies },
                { n: stats.totalHours, s: "h", l: t.home.stats.hours },
              ].map((x) => (
                <div key={x.l} className="text-end">
                  <p className="font-display text-xl font-semibold text-bone-50 md:text-2xl">
                    <Counter value={x.n} suffix={x.s} />
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

      {/* ============================================= TICKER TAPE ============ */}
      <section aria-hidden className="relative -mx-4 overflow-hidden py-12">
        <div className="rotate-[-1.5deg] bg-mint py-3 shadow-[0_0_60px_rgb(var(--mint)/0.35)]">
          <div className="flex w-max animate-marquee items-center gap-6" style={{ animationDuration: "26s" }}>
            {[...t.home.marquee, ...t.home.marquee].map((w, i) => (
              <span key={i} className="flex items-center gap-6 whitespace-nowrap">
                <span className="font-display text-lg font-bold uppercase tracking-tight text-ink-900 md:text-2xl">
                  {w}
                </span>
                <span className="text-ink-900">✦</span>
              </span>
            ))}
          </div>
        </div>
        <div className="-mt-1 rotate-[1deg] border-y border-line/15 bg-ink-900 py-3">
          <div className="flex w-max animate-marquee-rev items-center gap-6" style={{ animationDuration: "40s" }}>
            {[...t.home.marquee, ...t.home.marquee].map((w, i) => (
              <span key={i} className="flex items-center gap-6 whitespace-nowrap">
                <span className="text-outline font-display text-lg font-bold uppercase tracking-tight md:text-2xl">
                  {w}
                </span>
                <span className="text-mint">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= THE DEAL + ECONOMICS === */}
      <section className="container-edge mx-auto max-w-edge py-24 md:py-36">
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
                <div className="mt-5 flex flex-wrap gap-2">
                  {freeCourses.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/courses/${c.slug}/`}
                      className="rounded-full border border-ink-900/20 px-4 py-2 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-900 hover:text-bone-50"
                    >
                      <span className="me-1.5 font-serif italic">{c.glyph}</span>
                      {c.short[lang]}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* AI — premium ember card */}
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
                    "radial-gradient(110% 100% at 90% 115%, rgb(var(--mint) / 0.3) 0%, rgb(var(--mint) / 0.05) 50%, transparent 75%)",
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
                    <span className="flex items-center gap-3 text-sm font-medium text-bone-50">
                      <span className="font-serif text-lg italic text-mint">{c.glyph}</span>
                      {c.short[lang]}
                    </span>
                    <span dir="ltr" className="text-end">
                      {c.compareAt ? (
                        <span className="me-2 text-xs text-bone-500 line-through">
                          {c.compareAt.toLocaleString("en-US")}
                        </span>
                      ) : null}
                      <span className="font-display text-lg font-semibold text-mint">
                        {fmtPrice(c.price, lang)}
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

        {/* the economics — value told as a story, not a pricing card */}
        <div className="mt-24 md:mt-32">
          <Reveal>
            <SectionLabel index="02">{t.home.econLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.0] tracking-tightest text-bone-50 md:text-6xl">
              {t.home.econTitleA}{" "}
              <span className="glow-mint font-serif font-normal italic tracking-normal text-mint">
                {t.home.econTitleI}
              </span>
              {t.home.econTitleB}
            </h2>
          </Reveal>
          <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            {/* connecting thread */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-line/10 via-mint/50 to-mint md:block"
            />
            {t.home.econ.map((e, i) => (
              <Reveal key={e.l} delay={i * 0.12}>
                <div className="relative">
                  <span
                    aria-hidden
                    className={`absolute -top-1 hidden h-2.5 w-2.5 rounded-full md:block ltr:left-0 rtl:right-0 ${
                      i === 2 ? "bg-mint shadow-[0_0_16px_rgb(var(--mint)/0.8)]" : "bg-bone-500/40"
                    }`}
                  />
                  <p
                    className={`pt-6 font-display text-5xl font-bold tracking-tightest md:text-6xl ${
                      i === 2 ? "glow-mint text-mint" : i === 1 ? "text-bone-50" : "text-outline"
                    }`}
                    dir="ltr"
                  >
                    {e.n}
                    {e.u && (
                      <span className="ms-2 text-lg font-semibold text-bone-500">{e.u}</span>
                    )}
                  </p>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone-400">
                    {e.l}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= FEATURED COURSE ======== */}
      <div className="border-y border-line/10 bg-ink-800/40">
        <FeaturedCourse course={featured} />
      </div>

      {/* ============================================= THE DROPS ============== */}
      <section className="container-edge mx-auto max-w-edge py-24 md:py-36" id="courses">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel index="03">{t.home.coursesLabel}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.0] tracking-tightest text-bone-50 md:text-6xl">
                {t.home.coursesTitleA}{" "}
                <span className="glow-mint font-serif font-normal italic tracking-normal text-mint">
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
          {gridCourses.map((c, i) => (
            <StaggerItem key={c.slug}>
              <motion.div
                whileHover={{ rotate: i % 2 === 0 ? -0.8 : 0.8, y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className={`relative h-full rounded-2xl ${
                  c.price > 0
                    ? "p-1 ring-1 ring-mint/40 [background:radial-gradient(120%_100%_at_90%_110%,rgb(var(--mint)/0.14),transparent_65%)]"
                    : ""
                }`}
              >
                {c.price > 0 && (
                  <span className="absolute -top-3 z-10 rotate-[-4deg] rounded-full bg-mint px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink-900 ltr:left-4 rtl:right-4">
                    ✦ {t.common.premium}
                  </span>
                )}
                {c.price === 0 && (
                  <span className="absolute -top-3 z-10 rotate-[3deg] rounded-full border border-line/30 bg-ink-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-bone-50 ltr:right-4 rtl:left-4">
                    {t.common.free} ✦
                  </span>
                )}
                <CourseCard course={c} eager={i < 3} />
              </motion.div>
            </StaggerItem>
          ))}
          {/* bundle teaser card fills the sixth slot */}
          <StaggerItem>
            <Link href="/bundle/" className="group block h-full">
              <article className="relative flex h-full min-h-[19rem] flex-col justify-between overflow-hidden rounded-2xl border border-mint/30 bg-ink-800 p-7 transition-transform duration-300 group-hover:-translate-y-1">
                <div
                  aria-hidden
                  className="absolute inset-0"
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
                  <p className="text-end" dir="ltr">
                    <span className="block text-sm text-bone-500 line-through">
                      {fmtPrice(bundle.compareAt, lang)}
                    </span>
                    <span className="block font-display text-2xl font-semibold text-mint">
                      {fmtPrice(bundle.price, lang)}
                    </span>
                  </p>
                </div>
              </article>
            </Link>
          </StaggerItem>
        </Stagger>
      </section>

      {/* ============================================= PROOF / OUTCOMES ======= */}
      <section className="border-y border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto max-w-edge py-24 md:py-36">
          <Reveal>
            <SectionLabel index="04">{t.home.outcomesLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.0] tracking-tightest text-bone-50 md:text-6xl">
              {t.home.outcomesTitleA}{" "}
              <span className="glow-mint font-serif font-normal italic tracking-normal text-mint">
                {t.home.outcomesTitleI}
              </span>
              {t.home.outcomesTitleB}
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.outcomes.map((x, i) => (
              <Reveal key={x.l} delay={i * 0.06}>
                <div className="group border-t-2 border-line/15 pt-5 transition-colors duration-500 hover:border-mint">
                  <p className="text-outline group-hover:glow-mint font-display text-6xl font-bold tracking-tightest transition-all duration-500 md:text-7xl">
                    <Counter value={x.n} suffix={x.s} />
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-ultra text-bone-400">
                    {x.l}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* trust + community strip */}
          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-line/10 bg-ink-900/60 p-7 md:flex-row md:items-center">
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

        {/* portfolio gallery — made with the Method */}
        <div className="overflow-hidden pb-20">
          <p className="mb-6 text-center text-xs uppercase tracking-ultra text-bone-500">
            {t.home.galleryLabel}
          </p>
          <div className="flex w-max animate-marquee items-stretch gap-5" style={{ animationDuration: "70s" }} dir="ltr">
            {[...gallery, ...gallery].map((g, i) => (
              <div
                key={`${g.src}-${i}`}
                className="group relative h-56 w-72 shrink-0 overflow-hidden rounded-xl border border-line/10 md:h-64 md:w-96"
              >
                <Media
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="384px"
                  className="object-cover saturate-[0.55] transition-all duration-700 ease-cinema group-hover:scale-105 group-hover:saturate-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================= METHOD (journey) ======= */}
      <section className="container-edge mx-auto max-w-edge py-24 md:py-36">
        <div className="text-center">
          <Reveal>
            <div className="flex justify-center">
              <SectionLabel index="05">{t.home.pathLabel}</SectionLabel>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
              {t.home.pathTitleA}{" "}
              <span className="glow-mint font-serif font-normal italic tracking-normal text-mint">
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
      </section>

      {/* ============================================= WHY ==================== */}
      <section className="border-y border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto max-w-edge py-24 md:py-36">
          <Reveal>
            <SectionLabel index="06">{t.home.whyLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
              {t.home.whyTitleA}{" "}
              <span className="font-serif font-normal italic tracking-normal text-mint">
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
                <p className="text-outline-mint font-display text-4xl font-bold md:text-5xl">
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
        </div>
      </section>

      {/* ============================================= INSTRUCTOR ============= */}
      <section className="container-edge mx-auto max-w-edge py-24 md:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <Reveal>
              <motion.div
                whileHover={{ rotate: -1 }}
                className="relative overflow-hidden rounded-2xl border border-line/15"
              >
                <Media
                  src="/lms/instructor-wide.png"
                  alt="Mohamed Tarek teaching — warm studio light, arms crossed"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-auto w-full object-cover"
                />
              </motion.div>
            </Reveal>
            {/* floating live-work thumbnails — credibility by design */}
            <Reveal delay={0.15}>
              <motion.div
                whileHover={{ rotate: 0, scale: 1.04 }}
                className="absolute -bottom-8 w-36 rotate-[-5deg] overflow-hidden rounded-lg border border-line/20 shadow-2xl shadow-black/50 md:w-44 ltr:-left-4 rtl:-right-4"
              >
                <div className="aspect-[4/5]">
                  <Media src="/work/axia/hero.webp" alt="AXIA campaign — shipped client work" fill sizes="176px" className="object-cover" />
                </div>
              </motion.div>
            </Reveal>
            <Reveal delay={0.22}>
              <motion.div
                whileHover={{ rotate: 0, scale: 1.04 }}
                className="absolute -top-8 w-32 rotate-[6deg] overflow-hidden rounded-lg border border-line/20 shadow-2xl shadow-black/50 md:w-40 ltr:-right-3 rtl:-left-3"
              >
                <div className="aspect-[4/5]">
                  <Media src="/work/auto/hero.webp" alt="Automotive key visual — shipped client work" fill sizes="160px" className="object-cover" />
                </div>
              </motion.div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="07">{t.home.instructorLabel}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
                {t.home.instructorTitleA}{" "}
                <span className="glow-mint font-serif font-normal italic tracking-normal text-mint">
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
              <div className="mt-8">
                <Magnetic>
                  <Link
                    href="/instructor/"
                    className="inline-block rounded-full border border-line/25 px-7 py-3.5 text-sm text-bone-50 transition-colors duration-300 hover:border-mint/60 hover:text-mint active:scale-95"
                  >
                    {t.home.instructorCta} →
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="mt-20">
          <p className="mb-6 text-center text-xs uppercase tracking-ultra text-bone-500">
            {t.home.brandsNote}
          </p>
          <LogoMarquee />
        </div>
      </section>

      {/* ============================================= STORIES ================ */}
      <section className="overflow-hidden border-t border-line/10 py-24 md:py-36">
        <div className="container-edge mx-auto max-w-edge">
          <Reveal>
            <SectionLabel index="08">{t.home.testimonialsLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
              {t.home.testimonialsTitleA}{" "}
              <span className="glow-mint font-serif font-normal italic tracking-normal text-mint">
                {t.home.testimonialsTitleI}
              </span>
              {t.home.testimonialsTitleB}
            </h2>
          </Reveal>

          {/* featured success story with before/after portfolio preview */}
          <Reveal delay={0.1}>
            <div className="relative mt-14 overflow-hidden rounded-3xl border border-line/15 bg-ink-800/60">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(90% 100% at 5% 115%, rgb(var(--mint) / 0.16) 0%, transparent 60%)",
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
                {/* before/after portfolio preview */}
                <div className="lg:col-span-5">
                  <div className="group relative overflow-hidden rounded-2xl border border-line/15">
                    <div className="aspect-[4/3]">
                      <Media
                        src="/work/axia/insta-2.webp"
                        alt="Student final project — AI campaign frame, before and after finishing"
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover brightness-[0.6] saturate-0 transition-all duration-1000 ease-cinema group-hover:scale-[1.03] group-hover:brightness-100 group-hover:saturate-100"
                      />
                    </div>
                    <span className="absolute bottom-4 left-4 rounded-full bg-ink-900/80 px-3.5 py-1.5 text-[11px] text-bone-200 backdrop-blur transition-colors duration-500 group-hover:bg-mint group-hover:text-ink-900 rtl:left-auto rtl:right-4">
                      ✦ {t.home.beforeAfter}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* marquee rows */}
        <div className="mt-14 grid gap-6" dir="ltr">
          {[
            { rows: rowA, anim: "animate-marquee", dur: "95s", rot: "rotate-[-1deg]" },
            { rows: rowB, anim: "animate-marquee-rev", dur: "110s", rot: "rotate-[1deg]" },
          ].map(({ rows, anim, dur, rot }, ri) => (
            <div key={ri} className={`relative overflow-visible ${rot}`}>
              <div
                className={`flex w-max items-stretch gap-5 ${anim}`}
                style={{ animationDuration: dur }}
              >
                {[...rows, ...rows].map((r, i) => (
                  <motion.figure
                    key={`${r.name}-${i}`}
                    whileHover={{ rotate: ri === 0 ? 1.5 : -1.5, scale: 1.03 }}
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
                  </motion.figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================= THE AI STACK =========== */}
      <section className="container-edge mx-auto max-w-edge pb-24 md:pb-36">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-mint/25 bg-ink-800">
            <span
              aria-hidden
              className="text-outline-mint pointer-events-none absolute -top-6 font-display text-[10rem] font-bold leading-none opacity-30 ltr:-right-4 rtl:-left-4 md:text-[16rem]"
            >
              AI
            </span>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(110% 100% at 90% 120%, rgb(var(--mint) / 0.3) 0%, rgb(var(--mint) / 0.06) 45%, transparent 75%)",
              }}
            />
            <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.06]" />
            <div className="relative grid items-center gap-10 p-8 md:p-14 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Sticker tone="mint" rotate={-3}>
                  {t.home.bundleLabel} · {savePct}%−
                </Sticker>
                <h2 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-5xl">
                  {bundle.title[lang]}
                </h2>
                <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-bone-400 md:text-base">
                  {bundle.desc[lang]}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-ultra text-bone-500">
                  <span dir="ltr">
                    {fmtDuration(bundleMins, lang)} {t.bundle.totalRuntime}
                  </span>
                  <span>
                    {bundleLessons} {t.bundle.totalLessons}
                  </span>
                  <span>{t.bundle.projectsNote}</span>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Magnetic>
                    <Link
                      href="/bundle/"
                      className="inline-block rounded-full bg-mint px-8 py-4 text-sm font-semibold text-ink-900 transition-transform duration-300 hover:scale-[1.04] active:scale-95"
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
              <div className="hidden gap-4 lg:col-span-5 lg:grid lg:grid-cols-2">
                {bundleCourses.map((c, i) => (
                  <motion.div
                    key={c.slug}
                    whileHover={{ rotate: i === 0 ? -2 : 2, y: -6 }}
                    className={i === 1 ? "translate-y-6" : ""}
                    style={{ containerType: "inline-size" }}
                  >
                    <GlyphPlate course={c} className="aspect-[3/4]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============================================= FAQ TEASER ============= */}
      <section className="border-t border-line/10">
        <div className="container-edge mx-auto max-w-edge py-24 md:py-36">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel index="09">{t.home.faqLabel}</SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tightest text-bone-50 md:text-5xl">
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

      {/* ============================================= FINAL CTA ============== */}
      <section className="bg-grid relative overflow-hidden border-t border-line/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 115%, rgb(var(--mint) / 0.22) 0%, transparent 70%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.05]" />
        <div className="container-edge relative mx-auto max-w-edge py-28 text-center md:py-44">
          <Reveal>
            <div className="flex justify-center">
              <SectionLabel index="✦">{t.home.finalLabel}</SectionLabel>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto mt-8 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.0] tracking-tightest md:text-7xl">
              <span className="text-bone-50">{t.home.finalTitleA}</span>{" "}
              <span className="glow-mint font-serif font-normal italic tracking-normal text-mint">
                {t.home.finalTitleI}
              </span>
              <span className="text-outline">{t.home.finalTitleB}</span>
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
                  className="inline-block rounded-full bg-mint px-10 py-5 text-base font-semibold text-ink-900 shadow-[0_0_60px_rgb(var(--mint)/0.35)] transition-transform duration-300 hover:scale-[1.05] active:scale-95"
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
