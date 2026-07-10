"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import QuizPanel from "@/components/lms/QuizPanel";
import NotesBoard from "@/components/lms/NotesBoard";
import { useLang } from "@/lib/i18n";
import {
  useStore,
  toggleLesson,
  passQuiz,
  courseProgress,
  isEnrolled,
} from "@/lib/store";
import { downloadResource } from "@/lib/download";
import { fmtDuration, lessonCount, type Course } from "@/lib/courses";

type Tab = "resources" | "board" | "final" | "quiz";

export default function LearnView({ course }: { course: Course }) {
  const { t, lang } = useLang();
  const params = useSearchParams();
  const store = useStore();

  const enrolled = isEnrolled(store, course.slug);
  const done = store.completed[course.slug] || [];
  const progress = courseProgress(store, course.slug);
  const quizPassed = Boolean(store.quizPassed[course.slug]);

  const allLessons = useMemo(
    () => course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, mod: m }))),
    [course]
  );

  // first incomplete lesson (or the first) as the landing lesson
  const firstIncomplete =
    allLessons.find((l) => !done.includes(l.id))?.id ?? allLessons[0].id;
  const [currentId, setCurrentId] = useState(firstIncomplete);
  const [openModule, setOpenModule] = useState(() => {
    const idx = course.modules.findIndex((m) =>
      m.lessons.some((l) => l.id === firstIncomplete)
    );
    return idx === -1 ? 0 : idx;
  });
  const [tab, setTab] = useState<Tab>(
    params.get("tab") === "quiz" ? "quiz" : "resources"
  );

  const current = allLessons.find((l) => l.id === currentId) ?? allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.id === current.id);
  const canWatch = enrolled || current.free;
  const isDone = done.includes(current.id);

  const go = (dir: 1 | -1) => {
    const next = allLessons[currentIndex + dir];
    if (!next) return;
    setCurrentId(next.id);
    const mi = course.modules.findIndex((m) =>
      m.lessons.some((l) => l.id === next.id)
    );
    if (mi !== -1) setOpenModule(mi);
  };

  return (
    <section className="container-edge mx-auto max-w-edge pb-28 pt-28 md:pt-32">
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/10 pb-6">
        <div className="flex min-w-0 items-center gap-5">
          <Link
            href="/dashboard/"
            className="shrink-0 text-sm text-bone-400 transition-colors hover:text-bone-50"
          >
            {t.learn.backToDash}
          </Link>
          <span aria-hidden className="hidden h-4 w-px bg-line/20 sm:block" />
          <h1 className="hidden truncate font-serif text-lg italic text-bone-50 sm:block">
            {course.title[lang]}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-ultra text-bone-500">
            {t.learn.progressLabel}
          </span>
          <div className="h-1.5 w-36 overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full bg-mint shadow-[0_0_10px_rgb(var(--mint)/0.7)] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm tabular-nums text-bone-200" dir="ltr">
            {progress}%
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* -------------------------------------------------- main column */}
        <div className="lg:col-span-8">
          {/* player */}
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-line/15 bg-ink-800">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(110% 100% at 15% 115%, rgb(var(--mint) / 0.2) 0%, transparent 60%)",
              }}
            />
            {canWatch ? (
              <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
                <Media
                  src={course.cover}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover opacity-20 saturate-[0.6]"
                />
                <p className="relative mt-4 text-xs uppercase tracking-ultra text-mint">
                  {t.learn.nowPlaying}
                </p>
                <p className="relative mt-2 max-w-xl text-balance text-lg font-semibold text-bone-50 md:text-2xl">
                  {current.t}
                </p>
                <p className="relative mt-3 rounded-full border border-line/15 bg-ink-900/60 px-4 py-1.5 text-xs text-bone-300 backdrop-blur">
                  {t.learn.comingSoon}
                </p>
              </div>
            ) : (
              <div className="relative flex h-full flex-col items-center justify-center p-8 text-center backdrop-blur">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-line/20 text-xl text-bone-400">
                  🔒
                </span>
                <p className="mt-5 text-lg font-semibold text-bone-50 md:text-xl">
                  {t.learn.enrollGate}
                </p>
                <p className="mt-2 max-w-sm text-sm text-bone-400">
                  {t.learn.enrollGateSub}
                </p>
                <Link
                  href={`/checkout/?course=${course.slug}`}
                  className="mt-6 btn btn-primary px-7 py-3.5"
                >
                  {course.price === 0 ? t.common.enrollFree : t.common.enroll}
                </Link>
              </div>
            )}
            {/* player chrome */}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-line/10 bg-ink-900/70 px-5 py-3 backdrop-blur" dir="ltr">
              <span className="text-mint">▶</span>
              <div className="h-1 grow rounded-full bg-ink-600">
                <div className="h-full w-[3%] rounded-full bg-mint" />
              </div>
              <span className="text-xs tabular-nums text-bone-400">
                00:00 / {String(current.dur).padStart(2, "0")}:00
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-bone-500">{t.learn.playerNote}</p>

          {/* lesson meta + actions */}
          <div className="mt-7 flex flex-wrap items-start justify-between gap-5 border-b border-line/10 pb-7">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-ultra text-bone-500">
                {current.mod.n} · {current.mod.t} —{" "}
                <span dir="ltr">
                  {current.dur}
                  {t.common.minutesShort}
                </span>
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-bone-50 md:text-3xl">
                {current.t}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-bone-400">
                {current.d}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!canWatch}
                onClick={() => toggleLesson(course.slug, current.id)}
                className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                  isDone
                    ? "border border-mint/50 bg-mint/10 text-mint"
                    : "bg-mint text-white hover:scale-[1.03]"
                }`}
              >
                {isDone ? t.learn.markedDone : t.learn.markDone}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={currentIndex === 0}
                  className="rounded-full border border-line/20 px-4 py-3 text-sm text-bone-200 transition-colors hover:border-mint/50 disabled:opacity-30"
                >
                  {t.learn.prev}
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  disabled={currentIndex === allLessons.length - 1}
                  className="rounded-full border border-line/20 px-4 py-3 text-sm text-bone-200 transition-colors hover:border-mint/50 disabled:opacity-30"
                >
                  {t.learn.next}
                </button>
              </div>
            </div>
          </div>

          {/* course completed banner */}
          {progress === 100 && quizPassed && (
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-electric/40 bg-electric/5 p-6">
              <p className="font-serif text-lg italic text-bone-50">
                {t.learn.completedTitle}
              </p>
              <Link
                href="/courses/"
                className="rounded-full bg-electric px-6 py-3 text-sm font-medium text-ink-900 transition-transform hover:scale-[1.03]"
              >
                {t.dash.browseCta}
              </Link>
            </div>
          )}

          {/* tabs */}
          <div className="mt-10">
            <div className="flex flex-wrap gap-2 border-b border-line/10 pb-4">
              {(
                [
                  { id: "resources" as Tab, label: t.learn.resources },
                  { id: "board" as Tab, label: t.learn.boardTab },
                  { id: "final" as Tab, label: t.learn.finalProjectTab },
                  { id: "quiz" as Tab, label: t.learn.quizTitle },
                ]
              ).map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setTab(x.id)}
                  className={`relative rounded-full px-5 py-2.5 text-sm transition-colors duration-300 ${
                    tab === x.id ? "text-ink-900" : "text-bone-300 hover:text-bone-50"
                  }`}
                >
                  {tab === x.id && (
                    <motion.span
                      layoutId="learn-tab"
                      className="absolute inset-0 rounded-full bg-mint"
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative">
                    {x.label}
                    {x.id === "quiz" && quizPassed ? " ✓" : ""}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-8">
              {tab === "resources" && (
                <div className="divide-y divide-line/10 border-y border-line/10">
                  {course.resources.map((r) => (
                    <div key={r.t} className="flex items-center gap-5 py-5">
                      <span className="grid h-11 w-14 shrink-0 place-items-center rounded-lg border border-line/15 text-[10px] font-semibold tracking-widest text-mint">
                        {r.type}
                      </span>
                      <div className="grow">
                        <p className="text-sm font-medium text-bone-50">{r.t}</p>
                        <p className="mt-0.5 text-xs text-bone-500">{r.note}</p>
                      </div>
                      {enrolled ? (
                        <button
                          type="button"
                          onClick={() => downloadResource(course, r)}
                          className="shrink-0 rounded-full border border-line/20 px-5 py-2.5 text-xs text-bone-50 transition-colors hover:border-mint/50 hover:text-mint"
                        >
                          {t.learn.resourceGet} ↓
                        </button>
                      ) : (
                        <span className="shrink-0 text-xs text-bone-500">
                          {t.learn.resourceLocked}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === "board" && <NotesBoard slug={course.slug} />}

              {tab === "final" && (
                <div className="rounded-2xl border border-mint/20 bg-ink-800/60 p-8">
                  <p className="text-xs uppercase tracking-ultra text-mint">
                    {t.course.finalProjectLabel}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-bone-50 md:text-2xl">
                    {course.finalProject.t}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone-400">
                    {course.finalProject.d}
                  </p>
                  <p className="mt-6 text-xs uppercase tracking-ultra text-bone-500">
                    {t.course.deliverables}
                  </p>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {course.finalProject.deliverables.map((d) => (
                      <li key={d} className="flex items-baseline gap-3 text-sm text-bone-200">
                        <span className="text-mint">✦</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "quiz" &&
                (enrolled ? (
                  <QuizPanel
                    quiz={course.quiz}
                    passed={quizPassed}
                    onPass={() => passQuiz(course.slug)}
                  />
                ) : (
                  <p className="text-sm text-bone-400">{t.learn.enrollGateSub}</p>
                ))}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- curriculum rail */}
        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-line/15 bg-ink-800/50 lg:sticky lg:top-28">
            <p className="border-b border-line/10 px-6 py-4 text-xs uppercase tracking-ultra text-bone-500">
              {t.learn.curriculum} — {lessonCount(course)} {t.common.lessons} ·{" "}
              <span dir="ltr">
                {fmtDuration(
                  course.modules.reduce(
                    (n, m) => n + m.lessons.reduce((x, l) => x + l.dur, 0),
                    0
                  ),
                  lang
                )}
              </span>
            </p>
            <div className="max-h-[70vh] overflow-y-auto">
              {course.modules.map((m, mi) => {
                const open = openModule === mi;
                const moduleDone = m.lessons.every((l) => done.includes(l.id));
                return (
                  <div key={m.n} className="border-b border-line/10 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenModule(open ? -1 : mi)}
                      aria-expanded={open}
                      className="flex w-full items-center gap-4 px-6 py-4 text-start"
                    >
                      <span
                        className={`font-display text-xl font-semibold ${
                          moduleDone ? "text-mint" : open ? "text-bone-50" : "text-bone-500/60"
                        }`}
                      >
                        {m.n}
                      </span>
                      <span className="grow text-sm font-medium text-bone-50">
                        {m.t}
                      </span>
                      <span
                        aria-hidden
                        className={`font-serif text-lg text-bone-400 transition-transform duration-300 ${
                          open ? "rotate-45 text-mint" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          {m.lessons.map((l) => {
                            const active = l.id === current.id;
                            const lessonDone = done.includes(l.id);
                            const accessible = enrolled || l.free;
                            return (
                              <li key={l.id}>
                                <button
                                  type="button"
                                  onClick={() => setCurrentId(l.id)}
                                  className={`flex w-full items-center gap-3 px-6 py-3 text-start transition-colors ${
                                    active ? "bg-mint/10" : "hover:bg-ink-900/60"
                                  }`}
                                >
                                  <span
                                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] ${
                                      lessonDone
                                        ? "border-mint bg-mint text-white"
                                        : accessible
                                          ? "border-line/25 text-transparent"
                                          : "border-line/15 text-bone-500"
                                    }`}
                                  >
                                    {lessonDone ? "✓" : accessible ? "" : "🔒"}
                                  </span>
                                  <span
                                    className={`grow text-xs leading-snug ${
                                      active ? "text-mint" : "text-bone-300"
                                    }`}
                                  >
                                    {l.t}
                                  </span>
                                  <span className="shrink-0 font-serif text-[11px] italic text-bone-500" dir="ltr">
                                    {l.dur}m
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
