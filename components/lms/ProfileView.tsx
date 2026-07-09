"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";
import { useStore, login, logout, enrolledCourses } from "@/lib/store";
import { getCourse } from "@/lib/courses";

export default function ProfileView() {
  const { t, lang } = useLang();
  const router = useRouter();
  const store = useStore();
  const [name, setName] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!store.user) {
    return (
      <section className="container-edge mx-auto max-w-edge pb-24 pt-44 text-center">
        <p className="font-serif text-2xl italic text-bone-200">
          {t.checkout.loginFirst}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login/?next=%2Fprofile%2F"
            className="rounded-full bg-mint px-7 py-3.5 text-sm font-medium text-ink-900"
          >
            {t.auth.loginBtn}
          </Link>
        </div>
      </section>
    );
  }

  const displayName = name ?? store.user.name;
  const joined = new Date(store.user.joined).toLocaleDateString(
    lang === "ar" ? "ar-EG" : "en-GB",
    { year: "numeric", month: "long" }
  );
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

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = displayName.trim();
    if (!clean) return;
    login(clean, store.user!.email);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const reset = () => {
    if (!window.confirm(t.profile.resetConfirm)) return;
    try {
      localStorage.removeItem("atelier-lms");
    } catch {}
    window.location.reload();
  };

  return (
    <section className="container-edge mx-auto max-w-edge pb-28 pt-32 md:pt-40">
      <Reveal>
        <SectionLabel index="✦">{t.profile.kicker}</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <div className="mt-8 flex items-center gap-6">
          <span className="grid h-20 w-20 place-items-center rounded-full border border-mint/40 bg-mint/10 font-serif text-3xl italic text-mint">
            {store.user.name.trim().charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-bone-50 md:text-5xl">
              {store.user.name}
            </h1>
            <p className="mt-1.5 text-sm text-bone-400">
              {store.user.email} · {t.profile.memberSince} {joined}
            </p>
          </div>
        </div>
      </Reveal>

      {/* stats */}
      <Reveal delay={0.1}>
        <div className="mt-12">
          <SectionLabel index="01">{t.profile.statsLabel}</SectionLabel>
          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 sm:grid-cols-4">
            {[
              { n: enrolledCourses(store).length, l: t.dash.enrolledLabel },
              { n: lessonsDone, l: t.dash.statsLessons },
              { n: minutesDone, l: t.dash.statsMinutes },
              {
                n: Object.values(store.quizPassed).filter(Boolean).length,
                l: t.dash.statsQuizzes,
              },
            ].map((s) => (
              <div key={s.l} className="bg-ink-900 p-6 text-center">
                <p className="font-display text-3xl font-semibold tabular-nums text-bone-50">
                  {s.n.toLocaleString("en-US")}
                </p>
                <p className="mt-1.5 text-[11px] uppercase tracking-ultra text-bone-500">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* edit */}
      <Reveal delay={0.15}>
        <form
          onSubmit={save}
          className="mt-12 max-w-lg rounded-2xl border border-line/15 bg-ink-800/60 p-8"
        >
          <label className="block">
            <span className="text-xs uppercase tracking-ultra text-bone-500">
              {t.profile.editName}
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-line/15 bg-ink-900 px-4 py-3.5 text-sm text-bone-50 focus:border-mint/60 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="mt-6 rounded-full bg-mint px-7 py-3 text-sm font-medium text-ink-900 transition-transform hover:scale-[1.03]"
          >
            {saved ? t.profile.saved : t.profile.saveBtn}
          </button>
        </form>
      </Reveal>

      {/* session */}
      <Reveal delay={0.2}>
        <div className="mt-12 max-w-lg">
          <SectionLabel index="02">{t.profile.dangerLabel}</SectionLabel>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="rounded-full border border-line/20 px-7 py-3 text-sm text-bone-50 transition-colors hover:border-mint/50"
            >
              {t.profile.logoutBtn}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-red-500/30 px-7 py-3 text-sm text-red-400/90 transition-colors hover:border-red-500/60"
            >
              {t.profile.resetBtn}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
