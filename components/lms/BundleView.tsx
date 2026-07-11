"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import Magnetic from "@/components/ui/Magnetic";
import CourseCard from "@/components/lms/CourseCard";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";
import { useStore } from "@/lib/store";
import {
  bundle,
  bundleCourses,
  fmtDuration,
  fmtPrice,
  fmtUsd,
  lessonCount,
  totalMinutes,
} from "@/lib/courses";

export default function BundleView() {
  const { t, lang } = useLang();
  const store = useStore();
  const mins = bundleCourses.reduce((n, c) => n + totalMinutes(c), 0);
  const lessons = bundleCourses.reduce((n, c) => n + lessonCount(c), 0);
  const savePct = Math.round((1 - bundle.price / bundle.compareAt) * 100);
  const owned = bundle.courseSlugs.every((s) => store.enrollments.includes(s));

  return (
    <>
      <section className="bg-grid relative overflow-hidden pb-20 pt-32 md:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 85% 110%, rgb(var(--mint) / 0.18) 0%, transparent 65%)",
          }}
        />
        <div className="container-edge relative mx-auto grid max-w-edge items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="✦">
                {t.bundle.kicker} — {savePct}% {t.bundle.save}
              </SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-7 text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
                {bundle.title[lang]}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 font-serif text-xl italic text-mint md:text-2xl">
                {bundle.tagline[lang]}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-bone-400">
                {bundle.desc[lang]}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-line/10 pt-6">
                {[
                  { l: t.bundle.totalRuntime, v: fmtDuration(mins, lang) },
                  { l: t.bundle.totalLessons, v: String(lessons) },
                  { l: t.common.projects, v: "×6" },
                ].map((m) => (
                  <div key={m.l}>
                    <dd className="font-display text-2xl font-semibold text-bone-50 md:text-3xl" dir="ltr">
                      {m.v}
                    </dd>
                    <dt className="mt-0.5 text-[11px] uppercase tracking-ultra text-bone-500">
                      {m.l}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Magnetic>
                  <Link
                    href={owned ? "/dashboard/" : "/checkout/?bundle=1"}
                    className="btn btn-primary px-9 py-4"
                  >
                    {owned ? t.common.continueLearning : t.bundle.cta}
                  </Link>
                </Magnetic>
                <p dir="ltr" className="flex flex-col">
                  <span>
                    <span className="me-3 text-bone-500 line-through">
                      {fmtPrice(bundle.compareAt, lang)}
                    </span>
                    <span className="font-display text-3xl font-semibold text-bone-50">
                      {fmtPrice(bundle.price, lang)}
                    </span>
                  </span>
                  <span className="mt-0.5 text-xs font-medium text-mint">
                    ≈ {fmtUsd(bundle.price)} USD · save {fmtPrice(bundle.compareAt - bundle.price, lang)} ({savePct}%)
                  </span>
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="mt-5 text-xs text-bone-500">
                {t.bundle.projectsNote} · {t.course.guarantee}
              </p>
            </Reveal>
          </div>

          {/* the film + floating campaign frames */}
          <div className="hidden lg:col-span-5 lg:block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative mx-8 my-12"
            >
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
              {[
                { src: "/lms/popup.jpg", alt: "AI campaign popup visual", cls: "-left-8 -top-10 w-28 rotate-[-7deg]", d: 0.5 },
                { src: "/work/tilal/hero.webp", alt: "Tilal AI film frame", cls: "-right-8 -top-8 w-32 rotate-[6deg]", d: 0.6 },
                { src: "/work/secure/03.webp", alt: "Cinematic AI still", cls: "-bottom-10 -left-6 w-32 rotate-[4deg]", d: 0.7 },
                { src: "/lms/winback.jpg", alt: "WINBACK campaign visual", cls: "-bottom-8 -right-8 w-28 rotate-[-5deg]", d: 0.8 },
              ].map((f) => (
                <motion.div
                  key={f.src}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ rotate: 0, scale: 1.08, zIndex: 20 }}
                  transition={{ type: "spring", stiffness: 200, damping: 16, delay: f.d }}
                  className={`absolute overflow-hidden rounded-xl border border-line/25 shadow-2xl shadow-black/60 ${f.cls}`}
                >
                  <div className="aspect-[4/5]">
                    <Media src={f.src} alt={f.alt} fill sizes="128px" className="object-cover" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* what's inside */}
      <section className="border-t border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto max-w-edge py-20 md:py-28">
          <Reveal>
            <SectionLabel index="01">{t.bundle.includes}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-bone-400">
              {t.bundle.note}
            </p>
          </Reveal>
          <Stagger className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {bundleCourses.map((c) => (
              <StaggerItem key={c.slug}>
                <CourseCard course={c} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
