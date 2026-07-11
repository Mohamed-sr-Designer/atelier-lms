"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import GlyphPlate from "@/components/lms/GlyphPlate";
import { useLang } from "@/lib/i18n";
import {
  useStore,
  courseProgress,
  enrolledCourses,
  toggleArchive,
  setGoal,
  loginAs,
} from "@/lib/store";
import { openAuth } from "@/components/lms/AuthModal";
import { courses, getCourse, lessonCount } from "@/lib/courses";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

// deterministic per-slug score for completed assignments (demo)
const scoreFor = (slug: string) =>
  90 + (slug.split("").reduce((n, ch) => n + ch.charCodeAt(0), 0) % 9);

const nextDow = (dow: number) => {
  const d = new Date();
  const diff = (dow - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
};

const dayISO = (d: Date) => d.toISOString().slice(0, 10);

export default function DashboardView() {
  const { t } = useLang();
  const store = useStore();

  // guest gate
  if (!store.user) {
    return (
      <section className="container-edge mx-auto max-w-edge pb-24 pt-44 text-center">
        <p className="font-serif text-2xl italic text-bone-200">
          {t.checkout.loginFirst}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="btn btn-primary px-7 py-3.5"
          >
            {t.auth.loginBtn}
          </button>
          <button
            type="button"
            onClick={() => loginAs("student")}
            className="btn btn-ghost px-7 py-3.5"
          >
            ✦ {t.auth.previewStudent}
          </button>
        </div>
      </section>
    );
  }

  return <Board key={store.user.email} />;
}

function Board() {
  const { t, lang } = useLang();
  const store = useStore();
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [doubt, setDoubt] = useState("");
  const [editGoal, setEditGoal] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t.dash.greetingM : hour < 18 ? t.dash.greetingA : t.dash.greetingE;
  const firstName = store.user!.name.trim().split(/\s+/)[0];

  const enrolled = enrolledCourses(store);
  const active = enrolled.filter((c) => !store.archived.includes(c.slug));
  const archived = enrolled.filter((c) => store.archived.includes(c.slug));
  const shelf = tab === "active" ? active : archived;

  const continueCourse =
    active.find((c) => {
      const p = courseProgress(store, c.slug);
      return p > 0 && p < 100;
    }) || active.find((c) => courseProgress(store, c.slug) < 100);

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

  // last-7-days activity, oldest → today
  const week = useMemo(() => {
    const out: { label: string; mins: number; today: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push({
        label: d.toLocaleDateString("en-GB", { weekday: "short" }),
        mins: store.activity[dayISO(d)] || 0,
        today: i === 0,
      });
    }
    return out;
  }, [store.activity]);
  const weekMins = week.reduce((n, d) => n + d.mins, 0);
  const chartMax = Math.max(60, ...week.map((d) => d.mins));

  // weekly goal ring
  const goalMins = store.goal * 60;
  const goalPct = Math.min(100, Math.round((weekMins / goalMins) * 100));
  const R = 52;
  const CIRC = 2 * Math.PI * R;

  // demo live sessions on the next Friday / Monday
  const sessions = useMemo(
    () => [
      {
        title: "Live portfolio review",
        course: "AI Photoshoot",
        date: nextDow(5),
        time: "7:00 – 8:00 PM",
        tone: "mint" as const,
      },
      {
        title: "Open Q&A room",
        course: "All courses",
        date: nextDow(1),
        time: "8:30 – 9:15 PM",
        tone: "electric" as const,
      },
    ],
    []
  );
  const sessionDays = sessions.map((s) => s.date.getDate());

  // assignments — each enrolled course's final project, status from real progress
  const assignments = enrolled.map((c) => {
    const p = courseProgress(store, c.slug);
    const quiz = Boolean(store.quizPassed[c.slug]);
    const status = quiz
      ? ("done" as const)
      : p === 100
        ? ("review" as const)
        : p > 0
          ? ("progress" as const)
          : ("upcoming" as const);
    return { c, p, status };
  });

  // mini calendar
  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const sendDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hi Mohamed — quick doubt from my dashboard:\n${doubt}`
    );
    window.open(`https://wa.me/${site.whatsapp}?text=${msg}`, "_blank", "noopener,noreferrer");
    setDoubt("");
  };

  const statusChip = {
    done: "bg-mint/15 text-mint border-mint/30",
    review: "bg-electric/15 text-electric border-electric/30",
    progress: "bg-bone-50/10 text-bone-200 border-line/20",
    upcoming: "bg-ink-900 text-bone-400 border-line/15",
  };

  return (
    <section className="container-edge mx-auto max-w-edge pb-28 pt-32 md:pt-40">
      {/* header */}
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
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="text-sm text-bone-400 md:text-base">
            {enrolled.length ? t.dash.sub : t.dash.subEmpty}
          </p>
          <Link
            href="/profile/"
            className="inline-flex items-center gap-2 rounded-full border border-line/20 px-4 py-2 text-xs text-bone-200 transition-colors hover:border-mint/50 hover:text-mint"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
            </svg>
            {t.dash.accountCta}
          </Link>
        </div>
      </Reveal>

      {/* stats strip */}
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

      {/* bento: main column + side column */}
      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        {/* ============================== MAIN ============================== */}
        <div className="space-y-12 lg:col-span-8">
          {/* continue hero */}
          {continueCourse && (
            <Reveal>
              <Link href={`/learn/${continueCourse.slug}/`} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-mint/25 bg-ink-800">
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(100% 100% at 95% 120%, rgb(var(--mint) / 0.22) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative grid items-center gap-8 p-7 md:grid-cols-12 md:p-9">
                    <div className="hidden md:col-span-4 md:block" style={{ containerType: "inline-size" }}>
                      <GlyphPlate course={continueCourse} className="aspect-[4/3]" />
                    </div>
                    <div className="md:col-span-8">
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
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          {/* my courses — active / archived */}
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Reveal>
                <SectionLabel index="01">{t.dash.coursesLabel}</SectionLabel>
              </Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/courses/"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgb(var(--mint)/0.35)] transition-transform duration-300 hover:-translate-y-0.5 [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]"
                >
                  <span className="text-base leading-none">＋</span>
                  {t.dash.addCourse}
                </Link>
                <div className="flex gap-1 rounded-full border border-line/15 bg-ink-800/60 p-1">
                {(
                  [
                    { id: "active", label: `${t.dash.tabActive} · ${active.length}` },
                    { id: "archived", label: `${t.dash.tabArchived} · ${archived.length}` },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setTab(o.id)}
                    className={`relative rounded-full px-4 py-1.5 text-xs transition-colors duration-300 ${
                      tab === o.id ? "text-ink-900" : "text-bone-300 hover:text-bone-50"
                    }`}
                  >
                    {tab === o.id && (
                      <motion.span
                        layoutId="dash-shelf-tab"
                        className="absolute inset-0 rounded-full bg-mint"
                        transition={{ duration: 0.35, ease }}
                      />
                    )}
                    <span className="relative">{o.label}</span>
                  </button>
                ))}
                </div>
              </div>
            </div>

            {enrolled.length === 0 ? (
              <Reveal delay={0.08}>
                <div className="mt-8 rounded-2xl border border-dashed border-line/20 p-14 text-center">
                  <p className="font-serif text-xl italic text-bone-400">
                    {t.dash.subEmpty}
                  </p>
                  <Link href="/courses/" className="btn btn-primary mt-6 px-7 py-3.5">
                    {t.dash.browseCta}
                  </Link>
                </div>
              </Reveal>
            ) : shelf.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-line/20 p-10 text-center font-serif italic text-bone-400">
                {t.dash.archivedEmpty}
              </p>
            ) : (
              <Stagger key={tab} className="mt-8 grid gap-5 md:grid-cols-2">
                {shelf.map((c) => {
                  const p = courseProgress(store, c.slug);
                  const quizDone = Boolean(store.quizPassed[c.slug]);
                  const isArch = store.archived.includes(c.slug);
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
                            <button
                              type="button"
                              onClick={() => toggleArchive(c.slug)}
                              title={isArch ? t.dash.unarchive : t.dash.archive}
                              className="shrink-0 rounded-full border border-line/15 px-2.5 py-1 text-[10px] uppercase tracking-widest text-bone-500 transition-colors hover:border-mint/40 hover:text-mint"
                            >
                              {isArch ? t.dash.unarchive : t.dash.archive}
                            </button>
                          </div>
                          <div className="mt-3 flex items-center gap-3">
                            <div className="h-1 grow overflow-hidden rounded-full bg-ink-900">
                              <div className="h-full rounded-full bg-mint" style={{ width: `${p}%` }} />
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
                                {p === 0 ? t.success.startCourse : t.common.continueLearning}
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

          {/* my assignments */}
          {assignments.length > 0 && (
            <div>
              <Reveal>
                <SectionLabel index="02">{t.dash.assignmentsLabel}</SectionLabel>
              </Reveal>
              <div className="mt-8 space-y-3">
                {assignments.map(({ c, status }) => (
                  <Reveal key={c.slug}>
                    <Link
                      href={`/learn/${c.slug}/?tab=project`}
                      className={`group flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border bg-ink-800/60 p-5 transition-colors duration-300 md:p-6 ${
                        status === "done"
                          ? "border-mint/25 hover:border-mint/50"
                          : status === "review"
                            ? "border-electric/25 hover:border-electric/50"
                            : "border-line/10 hover:border-line/30"
                      }`}
                    >
                      <div className="min-w-0 grow">
                        <p className="truncate text-base font-semibold tracking-tight text-bone-50">
                          {c.finalProject.t}
                        </p>
                        <p className="mt-1 text-xs text-bone-500">
                          {c.short[lang]} · {t.course.finalProjectLabel}
                        </p>
                      </div>
                      <p className="text-sm tabular-nums text-bone-300" dir="ltr">
                        {status === "done" ? `${scoreFor(c.slug)}/100` : "--/100"}
                        <span className="ml-2 text-xs text-bone-500">
                          {status === "done" ? t.dash.qualified : t.dash.aStatus[status]}
                        </span>
                      </p>
                      <span
                        className={`rounded-full border px-3.5 py-1.5 text-[11px] font-semibold ${statusChip[status]}`}
                      >
                        {t.dash.aStatus[status]}
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* study statistics */}
          <div>
            <div className="flex items-end justify-between gap-4">
              <Reveal>
                <SectionLabel index="03">{t.dash.statsLabel}</SectionLabel>
              </Reveal>
              <span className="text-[11px] uppercase tracking-ultra text-bone-500">
                {t.dash.statsUnit}
              </span>
            </div>
            <Reveal delay={0.08}>
              <div className="mt-8 rounded-2xl border border-line/10 bg-ink-800/60 p-6 md:p-8">
                {weekMins === 0 ? (
                  <p className="py-10 text-center font-serif italic text-bone-400">
                    {t.dash.statsEmpty}
                  </p>
                ) : (
                  <div className="flex h-44 items-end justify-between gap-3 md:gap-5">
                    {week.map((d, i) => (
                      <div key={i} className="flex h-full grow flex-col items-center justify-end gap-2">
                        <span className="text-[10px] tabular-nums text-bone-500">
                          {d.mins ? `${d.mins}m` : ""}
                        </span>
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${Math.max(3, (d.mins / chartMax) * 100)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease, delay: i * 0.06 }}
                          className={`w-full max-w-[2.2rem] rounded-t-lg ${
                            d.today
                              ? "shadow-[0_0_18px_rgb(var(--mint)/0.5)] [background:linear-gradient(180deg,rgb(var(--mint)),rgb(var(--electric)))]"
                              : "bg-bone-50/15"
                          }`}
                        />
                        <span
                          className={`text-[10px] uppercase tracking-widest ${
                            d.today ? "text-mint" : "text-bone-500"
                          }`}
                        >
                          {d.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* discover more */}
          {enrolled.length > 0 && enrolled.length < courses.length && (
            <Reveal>
              <Link href="/courses/" className="link-underline text-sm text-mint">
                {t.dash.browseCta}
              </Link>
            </Reveal>
          )}
        </div>

        {/* ============================== SIDE ============================== */}
        <div className="space-y-6 lg:col-span-4">
          {/* weekly goal */}
          <Reveal>
            <div className="glass relative overflow-hidden rounded-2xl p-6">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(90% 90% at 100% 0%, rgb(var(--mint) / 0.12) 0%, transparent 60%)",
                }}
              />
              <div className="relative flex items-center gap-6">
                <div className="relative h-28 w-28 shrink-0">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r={R} fill="none" stroke="rgb(var(--bg))" strokeWidth="10" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r={R}
                      fill="none"
                      stroke="url(#goalGrad)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={CIRC}
                      initial={{ strokeDashoffset: CIRC }}
                      whileInView={{ strokeDashoffset: CIRC * (1 - goalPct / 100) }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease }}
                    />
                    <defs>
                      <linearGradient id="goalGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgb(var(--mint))" />
                        <stop offset="100%" stopColor="rgb(var(--electric))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 grid place-items-center font-display text-xl font-semibold text-bone-50">
                    {goalPct}%
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-ultra text-bone-500">
                    {t.dash.goalLabel}
                  </p>
                  <p className="mt-2 text-sm text-bone-200" dir="ltr">
                    <span className="font-display text-2xl font-semibold text-bone-50">
                      {(weekMins / 60).toFixed(1)}
                    </span>{" "}
                    {t.dash.goalOf} {store.goal}
                    {t.dash.goalUnit}
                  </p>
                  {goalPct >= 100 && (
                    <p className="mt-1 text-xs text-mint">{t.dash.goalDone}</p>
                  )}
                  <div className="mt-3">
                    {editGoal ? (
                      <span className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGoal(store.goal - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-line/20 text-bone-200 hover:border-mint/50 hover:text-mint"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm tabular-nums text-bone-50">
                          {store.goal}h
                        </span>
                        <button
                          type="button"
                          onClick={() => setGoal(store.goal + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-line/20 text-bone-200 hover:border-mint/50 hover:text-mint"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditGoal(false)}
                          className="ml-1 text-xs text-mint"
                        >
                          ✓
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditGoal(true)}
                        className="text-xs text-bone-400 underline decoration-line/40 underline-offset-4 transition-colors hover:text-mint"
                      >
                        {t.dash.goalEdit} · {t.dash.goalHint}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* upcoming sessions */}
          <Reveal delay={0.05}>
            <div className="glass rounded-2xl p-6">
              <p className="text-xs uppercase tracking-ultra text-bone-500">
                {t.dash.sessionsLabel}
              </p>
              <div className="mt-5 space-y-4">
                {sessions.map((s) => (
                  <div
                    key={s.title}
                    className={`rounded-xl border-l-2 bg-ink-900/60 p-4 ${
                      s.tone === "mint" ? "border-mint" : "border-electric"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-bone-50">{s.title}</p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          s.tone === "mint"
                            ? "bg-mint/15 text-mint"
                            : "bg-electric/15 text-electric"
                        }`}
                      >
                        {s.course}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-bone-400" dir="ltr">
                      {s.date.toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      · {s.time}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-[11px] text-bone-500">{t.dash.sessionBy}</p>
                      <a
                        href={`https://wa.me/${site.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs font-semibold ${
                          s.tone === "mint" ? "text-mint" : "text-electric"
                        }`}
                      >
                        {t.dash.sessionJoin} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* calendar */}
          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-ultra text-bone-500">
                  {t.dash.calendarLabel}
                </p>
                <p className="font-serif text-sm italic text-mint">{monthLabel}</p>
              </div>
              <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[11px]">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                  <span key={d} className="pb-2 uppercase tracking-widest text-bone-500">
                    {d}
                  </span>
                ))}
                {Array.from({ length: lead }).map((_, i) => (
                  <span key={`x${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === now.getDate();
                  const hasSession = sessionDays.includes(day) && day > now.getDate();
                  return (
                    <span
                      key={day}
                      className={`relative grid aspect-square place-items-center rounded-lg tabular-nums transition-colors ${
                        isToday
                          ? "font-bold text-white [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]"
                          : hasSession
                            ? "border border-mint/40 text-mint"
                            : "text-bone-300"
                      }`}
                    >
                      {day}
                      {hasSession && (
                        <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-mint" />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* ask a doubt */}
          <Reveal delay={0.15}>
            <form onSubmit={sendDoubt} className="overflow-hidden rounded-2xl border border-line/15">
              <p className="bg-bone-50 px-6 py-4 text-sm font-bold text-ink-900">
                {t.dash.doubtLabel}
              </p>
              <div className="bg-ink-800/60 p-5">
                <textarea
                  value={doubt}
                  onChange={(e) => setDoubt(e.target.value)}
                  placeholder={t.dash.doubtPh}
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-line/15 bg-ink-900/70 px-4 py-3.5 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-bone-500">{t.dash.doubtNote}</p>
                  <button type="submit" className="btn btn-primary px-6 py-2.5 text-sm">
                    {t.dash.doubtSend}
                  </button>
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
