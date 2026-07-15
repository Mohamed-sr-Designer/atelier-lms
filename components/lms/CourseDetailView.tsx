"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import GlyphPlate from "@/components/lms/GlyphPlate";
import CurriculumIndex from "@/components/lms/CurriculumIndex";
import FaqList from "@/components/lms/FaqList";
import CourseCard from "@/components/lms/CourseCard";
import LiveViewers from "@/components/lms/LiveViewers";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";
import { useStore, isEnrolled } from "@/lib/store";
import { useLiveCourse } from "@/lib/studio";
import {
  bundle,
  courses,
  fmtDuration,
  fmtPrice,
  fmtUsd,
  lessonCount,
  totalMinutes,
  type Course,
} from "@/lib/courses";

export default function CourseDetailView({ course: courseStatic }: { course: Course }) {
  const { t, lang } = useLang();
  const course = useLiveCourse(courseStatic); // studio edits apply live
  const store = useStore();
  const enrolled = isEnrolled(store, course.slug);
  const mins = totalMinutes(course);
  const lessons = lessonCount(course);
  const inBundle = bundle.courseSlugs.includes(course.slug);
  const related = courses.filter((c) => c.slug !== course.slug).slice(0, 3);

  const ctaHref = enrolled
    ? `/learn/${course.slug}/`
    : `/checkout/?course=${course.slug}`;
  const ctaLabel = enrolled
    ? t.common.continueLearning
    : course.price === 0
      ? t.common.enrollFree
      : t.common.enroll;

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="bg-grid relative overflow-hidden pb-16 pt-32 md:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 10% 110%, rgb(var(--mint) / 0.12) 0%, transparent 65%)",
          }}
        />
        <div className="container-edge relative mx-auto grid max-w-edge gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* breadcrumb */}
            <Reveal>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-bone-500">
                <Link href="/" className="transition-colors hover:text-bone-200">
                  {t.common.home}
                </Link>
                <span aria-hidden>/</span>
                <Link href="/courses/" className="transition-colors hover:text-bone-200">
                  {t.course.breadcrumbCourses}
                </Link>
                <span aria-hidden>/</span>
                <span className="text-bone-300">{course.short[lang]}</span>
              </nav>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-8 flex items-center gap-4">
                <SectionLabel index={course.index}>{course.level[lang]}</SectionLabel>
                {course.price === 0 && (
                  <span className="rounded-full bg-mint px-3 py-1 text-[11px] font-medium text-white">
                    {t.common.free}
                  </span>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
                {course.title[lang]}
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 font-serif text-xl italic leading-snug text-mint md:text-2xl">
                {course.tagline[lang]}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-bone-400">
                {course.desc[lang]}
              </p>
            </Reveal>
            {/* meta strip */}
            <Reveal delay={0.25}>
              <dl className="mt-9 flex flex-wrap gap-x-9 gap-y-4 border-t border-line/10 pt-6">
                {[
                  { l: t.common.hours, v: fmtDuration(mins, lang) },
                  { l: t.common.lessons, v: String(lessons) },
                  { l: t.common.modules, v: String(course.modules.length) },
                  { l: t.common.students, v: `${course.students.toLocaleString("en-US")}+` },
                  {
                    l: `${course.ratingCount} ${t.common.reviewsWord}`,
                    v: `★ ${course.rating.toFixed(1)}`,
                    amber: true,
                  },
                ].map((m) => (
                  <div key={m.l}>
                    <dt className="text-[11px] uppercase tracking-ultra text-bone-500">
                      {m.l}
                    </dt>
                    <dd
                      className={`mt-1 font-display text-xl font-semibold md:text-2xl ${
                        m.amber ? "text-electric" : "text-bone-50"
                      }`}
                      dir="ltr"
                    >
                      {m.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* live signal + skill ticker — the hero floor */}
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <LiveViewers />
                <span className="hidden text-xs text-bone-500 sm:block">
                  {course.students.toLocaleString("en-US")}+ {t.common.students} ·{" "}
                  {course.level[lang]}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="relative mt-8 -mx-1 overflow-hidden rounded-xl border border-line/10 bg-ink-900/40 py-3 backdrop-blur" dir="ltr">
                <div className="animate-marquee flex w-max items-center gap-6" style={{ animationDuration: "34s" }}>
                  {[...course.outcomes, ...course.outcomes].map((o, i) => (
                    <span key={i} className="flex items-center gap-6 whitespace-nowrap text-sm">
                      <span className="text-grad font-semibold">{o}</span>
                      <span className="text-bone-500">✦</span>
                    </span>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-900 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-900 to-transparent" />
              </div>
            </Reveal>
          </div>

          {/* sticky enroll card */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal delay={0.15}>
                <div className="overflow-hidden rounded-2xl border border-line/15 bg-ink-800/70 backdrop-blur-sm">
                  <div style={{ containerType: "inline-size" }}>
                    <GlyphPlate course={course} eager className="aspect-[16/9] rounded-none border-0" />
                  </div>
                  <div className="p-7">
                    <div className="flex items-end justify-between gap-4">
                      <div dir="ltr">
                        <p className="font-display text-4xl font-semibold text-bone-50">
                          {fmtPrice(course.price, lang)}
                        </p>
                        {course.compareAt ? (
                          <p className="mt-1 text-sm text-bone-500">
                            <span className="line-through">
                              {fmtPrice(course.compareAt, lang)}
                            </span>
                            <span className="ms-2 text-mint">
                              −{Math.round((1 - course.price / course.compareAt) * 100)}%
                            </span>
                          </p>
                        ) : course.price > 0 ? (
                          <p className="mt-1 text-sm text-bone-400">
                            ≈ {fmtUsd(course.price)} USD
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-bone-500">
                            {t.course.startFreeNote}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link href={ctaHref} className="btn btn-primary mt-6 w-full px-8 py-4">
                      {ctaLabel}
                    </Link>
                    {enrolled && (
                      <p className="mt-3 text-center text-xs text-mint">
                        {t.common.enrolled}
                      </p>
                    )}

                    <ul className="mt-7 grid gap-3 border-t border-line/10 pt-6 text-sm text-bone-300">
                      {t.course.includesItems.map((x) => (
                        <li key={x} className="flex items-baseline gap-3">
                          <span className="text-mint">✦</span>
                          {x}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-6 rounded-lg bg-ink-900/70 p-4 text-xs leading-relaxed text-bone-400">
                      {course.price === 0 ? t.course.startFreeNote : t.course.guarantee}
                    </p>

                    {inBundle && course.price !== 0 && (
                      <p className="mt-4 text-center text-xs text-bone-400">
                        {t.course.bundleHint}{" "}
                        <Link href="/bundle/" className="link-underline text-mint">
                          {t.course.bundleHintCta} →
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ outcomes */}
      <section className="border-y border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto max-w-edge py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel index="01">{t.course.whatYouLearn}</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-6 text-sm leading-relaxed text-bone-400">
                  {course.audience[lang]}
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 text-[11px] uppercase tracking-ultra text-bone-500">
                  {t.course.toolsLabel}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {course.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-line/15 px-3 py-1.5 text-xs text-bone-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
            <Stagger className="grid gap-4 lg:col-span-8 sm:grid-cols-2">
              {course.outcomes.map((o, i) => (
                <StaggerItem
                  key={o}
                  className="flex items-start gap-4 rounded-xl border border-line/10 bg-ink-900 p-6"
                >
                  <span className="font-serif text-sm italic text-mint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-bone-200 md:text-base">{o}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ path */}
      <section className="container-edge mx-auto max-w-edge py-20 md:py-28">
        <Reveal>
          <SectionLabel index="02">{t.course.pathLabel}</SectionLabel>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 md:grid-cols-5">
          {course.path.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col gap-3 bg-ink-900 p-6">
                <p className="font-display text-3xl font-semibold text-bone-500/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-lg font-semibold tracking-tight text-bone-50">
                  {s.t}
                </h3>
                <p className="text-xs leading-relaxed text-bone-400">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ curriculum */}
      <section className="container-edge mx-auto max-w-edge pb-20 md:pb-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionLabel index="03">{t.course.curriculumLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-xs text-bone-500">{t.course.curriculumNote}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="mt-10">
            <CurriculumIndex course={course} />
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------ projects + final */}
      <section className="border-y border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto max-w-edge py-20 md:py-28">
          <Reveal>
            <SectionLabel index="04">{t.course.projectsLabel}</SectionLabel>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
            {course.projects.map((p, i) => (
              <StaggerItem
                key={p.t}
                className="rounded-xl border border-line/10 bg-ink-900 p-7 transition-colors duration-300 hover:border-mint/30"
              >
                <p className="font-serif text-sm italic text-mint">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-bone-50">
                  {p.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-400">{p.d}</p>
              </StaggerItem>
            ))}
          </Stagger>

          {/* final project */}
          <Reveal delay={0.1}>
            <div className="relative mt-12 overflow-hidden rounded-2xl border border-mint/25 bg-ink-900 p-8 md:p-12">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(100% 100% at 100% 120%, rgb(var(--mint) / 0.18) 0%, transparent 65%)",
                }}
              />
              <div className="relative grid gap-8 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-ultra text-mint">
                    {t.course.finalProjectLabel}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-bone-50 md:text-3xl">
                    {course.finalProject.t}
                  </h3>
                  <p className="mt-4 text-pretty text-sm leading-relaxed text-bone-400 md:text-base">
                    {course.finalProject.d}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-ultra text-bone-500">
                    {t.course.deliverables}
                  </p>
                  <ul className="mt-4 grid gap-3">
                    {course.finalProject.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-baseline gap-3 border-b border-line/10 pb-3 text-sm text-bone-200"
                      >
                        <span className="text-mint">✦</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ resources + cert */}
      <section className="container-edge mx-auto grid max-w-edge gap-14 py-20 md:py-28 lg:grid-cols-2">
        <div>
          <Reveal>
            <SectionLabel index="05">{t.course.resourcesLabel}</SectionLabel>
          </Reveal>
          <div className="mt-8 divide-y divide-line/10 border-y border-line/10">
            {course.resources.map((r) => (
              <Reveal key={r.t}>
                <div className="flex items-center gap-5 py-5">
                  <span className="grid h-11 w-14 shrink-0 place-items-center rounded-lg border border-line/15 text-[10px] font-semibold tracking-widest text-mint">
                    {r.type}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-bone-50 md:text-base">{r.t}</p>
                    <p className="mt-0.5 text-xs text-bone-500">{r.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div>
          <Reveal>
            <SectionLabel index="06">{t.course.outcomeLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-line/15 bg-ink-800 p-8 text-center md:p-10">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(90% 70% at 10% 110%, rgb(var(--mint) / 0.16) 0%, transparent 60%)",
                }}
              />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-ultra text-bone-400">
                  Tarek — School of Visual Direction
                </p>
                <p className="mt-4 font-serif text-2xl italic text-bone-50 md:text-3xl">
                  {t.course.outcomeTitle}
                </p>
                <div className="mx-auto mt-5 grid h-12 w-12 place-items-center rounded-full border border-mint/60 font-serif text-lg italic text-mint">
                  M
                </div>
                <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-bone-400">
                  {t.course.outcomeNote}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ showcase gallery */}
      {course.showcase && (
        <section className="border-t border-line/10 bg-ink-800/40">
          <div className="container-edge mx-auto max-w-edge py-20 md:py-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Reveal>
                <SectionLabel index="✦">{t.course.showcaseLabel}</SectionLabel>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="max-w-sm text-sm text-bone-400">{t.course.showcaseNote}</p>
              </Reveal>
            </div>
            {course.showcase.images && (
              <Stagger className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                {course.showcase.images.map((src, i) => (
                  <StaggerItem
                    key={src}
                    className={i % 5 === 0 ? "col-span-2 row-span-2" : ""}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? -0.6 : 0.6 }}
                      className="group relative h-full min-h-[10rem] overflow-hidden rounded-xl border border-line/10"
                    >
                      <Media
                        src={src}
                        alt={`Made with this course — AI production frame ${i + 1}`}
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-cover saturate-[0.75] transition-all duration-700 ease-cinema group-hover:saturate-100"
                      />
                    </motion.div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
            {course.showcase.videos && (
              <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {course.showcase.videos.map((src, i) => (
                  <StaggerItem key={src}>
                    <motion.div
                      whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? -0.6 : 0.6 }}
                      className="relative overflow-hidden rounded-xl border border-line/10"
                    >
                      <video
                        src={withBase(src)}
                        aria-label={`Made with this course — AI film ${i + 1}`}
                        className="aspect-video w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                      <span className="absolute bottom-3 left-3 rounded-full bg-ink-900/75 px-3 py-1 text-[10px] uppercase tracking-widest text-bone-200 backdrop-blur">
                        ▶ AI production
                      </span>
                    </motion.div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------ instructor */}
      <section className="border-y border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto grid max-w-edge items-center gap-10 py-20 md:grid-cols-12 md:py-24">
          <div className="md:col-span-3">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-line/15">
                <Media
                  src="/lms/instructor-wide.png"
                  alt="Mohamed Tarek — course instructor"
                  width={1731}
                  height={1787}
                  className="h-auto w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal>
              <SectionLabel index="07">{t.course.instructorLabel}</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h3 className="mt-5 font-serif text-3xl italic text-bone-50 md:text-4xl">
                Mohamed Tarek
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-bone-400 md:text-base">
                {t.home.instructorBio}
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <Link
                href="/instructor/"
                className="link-underline mt-5 inline-block text-sm text-mint"
              >
                {t.home.instructorCta} →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ reviews */}
      <section className="container-edge mx-auto max-w-edge py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionLabel index="08">{t.course.reviewsLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-sm text-bone-400">
              <span className="text-electric">★ {course.rating.toFixed(1)}</span>{" "}
              · {course.ratingCount} {t.common.reviewsWord}
            </p>
          </Reveal>
        </div>
        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          {course.reviews.map((r) => (
            <StaggerItem
              key={r.name}
              className="flex h-full flex-col rounded-xl border border-line/10 bg-ink-800/60 p-7"
            >
              <p className="text-electric" aria-label={`${r.stars} stars`}>
                {"★".repeat(r.stars)}
                <span className="text-bone-500/40">{"★".repeat(5 - r.stars)}</span>
              </p>
              <blockquote className="mt-4 grow text-sm leading-relaxed text-bone-200">
                “{r.text}”
              </blockquote>
              <footer className="mt-5 border-t border-line/10 pt-4 text-xs">
                <p className="text-bone-50">{r.name}</p>
                <p className="mt-0.5 text-bone-500">{r.role}</p>
              </footer>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ------------------------------------------------ FAQ + related */}
      <section className="border-t border-line/10">
        <div className="container-edge mx-auto max-w-edge py-20 md:py-28">
          <Reveal>
            <SectionLabel index="09">{t.course.faqLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-10">
              <FaqList items={course.faq} />
            </div>
          </Reveal>

          <div className="mt-24">
            <Reveal>
              <SectionLabel index="10">{t.course.relatedLabel}</SectionLabel>
            </Reveal>
            <Stagger className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <StaggerItem key={c.slug}>
                  <CourseCard course={c} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* mobile sticky enroll bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/15 bg-ink-900/90 p-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div dir="ltr">
            <p className="font-display text-xl font-semibold text-bone-50">
              {fmtPrice(course.price, lang)}
            </p>
            {course.compareAt ? (
              <p className="text-xs text-bone-500 line-through">
                {fmtPrice(course.compareAt, lang)}
              </p>
            ) : course.price > 0 ? (
              <p className="text-xs text-bone-400">≈ {fmtUsd(course.price)} USD</p>
            ) : null}
          </div>
          <Link
            href={ctaHref}
            className="btn btn-primary px-7 py-3.5"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </>
  );
}
