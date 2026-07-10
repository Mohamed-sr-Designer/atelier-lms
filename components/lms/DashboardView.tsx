"use client";

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import GlyphPlate from "@/components/lms/GlyphPlate";
import { useLang } from "@/lib/i18n";
import { useStore, courseProgress, enrolledCourses } from "@/lib/store";
import { courses, fmtDuration, getCourse, lessonCount } from "@/lib/courses";

export default function DashboardView() {
  const { t, lang } = useLang();
  const store = useStore();

  if (!store.user) {
    return (
      <section className="container-edge mx-auto max-w-edge pb-24 pt-44 text-center">
        <p className="font-serif text-2xl italic text-bone-200">
          {t.checkout.loginFirst}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login/?next=%2Fdashboard%2F"
            className="rounded-full bg-mint px-7 py-3.5 text-sm font-medium text-white"
          >
            {t.auth.loginBtn}
          </Link>
          <Link
            href="/register/?next=%2Fdashboard%2F"
            className="rounded-full border border-line/20 px-7 py-3.5 text-sm text-bone-50"
          >
            {t.auth.registerBtn}
          </Link>
        </div>
      </section>
    );
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t.dash.greetingM : hour < 18 ? t.dash.greetingA : t.dash.greetingE;
  const firstName = store.user.name.trim().split(/\s+/)[0];

  const enrolled = enrolledCourses(store);
  const continueCourse =
    enrolled.find((c) => {
      const p = courseProgress(store, c.slug);
      return p > 0 && p < 100;
    }) || enrolled.find((c) => courseProgress(store, c.slug) < 100);

  // aggregate stats
  const lessonsDone = Object.values(store.completed).reduce(
    (n, arr) => n + arr.length,
    0
  );
  const minutesDone = Object.entries(store.completed).reduce((n, [slug, ids]) => {
    const c = getCourse(slug);
    if (!c) return n;
    const all = c.modules.flatMap((m) => m.lessons);
    return n + ids.reduce((x, id) => x + (all.find((l) => l.id === id)?.dur || 0), 0);
  }, 0);
  const quizzesCleared = Object.values(store.quizPassed).filter(Boolean).length;

  return (
    <section className="container-edge mx-auto max-w-edge pb-28 pt-32 md:pt-40">
      <Reveal>
        <SectionLabel index="✦">{t.dash.kicker}</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.0] tracking-tightest text-bone-50 md:text-6xl">
          {greeting},{" "}
          <span className="font-serif font-normal italic tracking-normal text-mint">
            {firstName}
          </span>
          .
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 text-sm text-bone-400 md:text-base">
          {enrolled.length ? t.dash.sub : t.dash.subEmpty}
        </p>
      </Reveal>

      {/* stats */}
      <Reveal delay={0.15}>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 sm:grid-cols-3">
          {[
            { n: lessonsDone, l: t.dash.statsLessons },
            { n: minutesDone, l: t.dash.statsMinutes },
            { n: quizzesCleared, l: t.dash.statsQuizzes },
          ].map((s) => (
            <div key={s.l} className="bg-ink-900 p-7 text-center">
              <p className="font-display text-4xl font-semibold tabular-nums text-bone-50 md:text-5xl">
                {s.n.toLocaleString("en-US")}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-ultra text-bone-500">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* continue hero */}
      {continueCourse && (
        <Reveal delay={0.2}>
          <Link href={`/learn/${continueCourse.slug}/`} className="group mt-10 block">
            <div className="relative overflow-hidden rounded-2xl border border-mint/25 bg-ink-800">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(100% 100% at 95% 120%, rgb(var(--mint) / 0.22) 0%, transparent 70%)",
                }}
              />
              <div className="relative grid items-center gap-8 p-7 md:grid-cols-12 md:p-10">
                <div className="hidden md:col-span-3 md:block" style={{ containerType: "inline-size" }}>
                  <GlyphPlate course={continueCourse} className="aspect-[4/3]" />
                </div>
                <div className="md:col-span-9">
                  <p className="text-xs uppercase tracking-ultra text-mint">
                    {t.dash.continueLabel}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-bone-50 md:text-3xl">
                    {continueCourse.title[lang]}
                  </h2>
                  <div className="mt-5 flex items-center gap-4">
                    <div className="h-1.5 grow overflow-hidden rounded-full bg-ink-900">
                      <div
                        className="h-full rounded-full bg-mint shadow-[0_0_12px_rgb(var(--mint)/0.7)] transition-all duration-700"
                        style={{ width: `${courseProgress(store, continueCourse.slug)}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-sm tabular-nums text-bone-300" dir="ltr">
                      {courseProgress(store, continueCourse.slug)}%
                    </span>
                  </div>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm text-mint">
                    {t.common.continueLearning}
                    <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180">
                      →
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </Reveal>
      )}

      {/* enrolled courses */}
      <div className="mt-16">
        <Reveal>
          <SectionLabel index="01">{t.dash.enrolledLabel}</SectionLabel>
        </Reveal>
        {enrolled.length === 0 ? (
          <Reveal delay={0.08}>
            <div className="mt-8 rounded-2xl border border-dashed border-line/20 p-14 text-center">
              <p className="font-serif text-xl italic text-bone-400">
                {t.dash.subEmpty}
              </p>
              <Link
                href="/courses/"
                className="mt-6 inline-block rounded-full bg-mint px-7 py-3.5 text-sm font-medium text-white"
              >
                {t.dash.browseCta}
              </Link>
            </div>
          </Reveal>
        ) : (
          <Stagger className="mt-8 grid gap-5 md:grid-cols-2">
            {enrolled.map((c) => {
              const p = courseProgress(store, c.slug);
              const quizDone = Boolean(store.quizPassed[c.slug]);
              return (
                <StaggerItem key={c.slug}>
                  <div className="flex h-full gap-5 rounded-2xl border border-line/10 bg-ink-800/60 p-5 transition-colors duration-300 hover:border-mint/25">
                    <div className="w-28 shrink-0 self-start" style={{ containerType: "inline-size" }}>
                      <GlyphPlate course={c} className="aspect-[4/3]" />
                    </div>
                    <div className="flex grow flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold tracking-tight text-bone-50">
                          {c.short[lang]}
                        </h3>
                        <span className="shrink-0 text-xs text-bone-500" dir="ltr">
                          {fmtDuration(
                            c.modules.reduce(
                              (n, m) => n + m.lessons.reduce((x, l) => x + l.dur, 0),
                              0
                            ),
                            lang
                          )}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-1 grow overflow-hidden rounded-full bg-ink-900">
                          <div
                            className="h-full rounded-full bg-mint"
                            style={{ width: `${p}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-bone-400" dir="ltr">
                          {p}%
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-bone-500">
                        {(store.completed[c.slug] || []).length}/{lessonCount(c)}{" "}
                        {t.common.lessons}
                        {p === 100 && !quizDone ? ` · ${t.dash.finalStep}` : ""}
                        {p === 100 && quizDone ? ` · ${t.common.completed} ✓` : ""}
                      </p>
                      <div className="mt-auto pt-4">
                        {p === 100 && !quizDone ? (
                          <Link
                            href={`/learn/${c.slug}/?tab=quiz`}
                            className="inline-block rounded-full bg-electric px-5 py-2.5 text-xs font-medium text-ink-900"
                          >
                            {t.dash.quizReady} →
                          </Link>
                        ) : (
                          <Link
                            href={`/learn/${c.slug}/`}
                            className="inline-block rounded-full border border-line/20 px-5 py-2.5 text-xs text-bone-50 transition-colors hover:border-mint/50 hover:text-mint"
                          >
                            {p === 0
                              ? t.success.startCourse
                              : t.common.continueLearning}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </div>

      {/* discover more */}
      {enrolled.length > 0 && enrolled.length < courses.length && (
        <div className="mt-16">
          <Reveal>
            <Link href="/courses/" className="link-underline text-sm text-mint">
              {t.dash.browseCta}
            </Link>
          </Reveal>
        </div>
      )}
    </section>
  );
}
