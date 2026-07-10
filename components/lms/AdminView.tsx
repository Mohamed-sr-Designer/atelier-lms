"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import Counter from "@/components/lms/Counter";
import AdminGuard from "@/components/lms/AdminGuard";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useStudio, setOfferOverride, mergeCourse } from "@/lib/studio";
import { courses, fmtPrice } from "@/lib/courses";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

// Deterministic demo series — the studio is a static-export demo, so the
// analytics are invented but stable between visits.
const REVENUE_14D = Array.from(
  { length: 14 },
  (_, i) => 2600 + ((i * 7919) % 11) * 640 + (i % 3) * 520 + (i > 9 ? 1400 : 0)
);

const SIGNUPS = [
  { n: "Nour El-Sayed", e: "nour.s@gmail.com", c: "AI Photoshoot", ago: "2h" },
  { n: "Omar Khaled", e: "omar.kh@outlook.com", c: "The AI Stack", ago: "5h" },
  { n: "Farida Adel", e: "farida.a@gmail.com", c: "Photoshop — free", ago: "9h" },
  { n: "Youssef Hany", e: "y.hany@yahoo.com", c: "AI Video", ago: "1d" },
  { n: "Salma Ibrahim", e: "salma.designs@gmail.com", c: "Illustrator — free", ago: "1d" },
];

const LOCATIONS = [
  { l: "Egypt", p: 46 },
  { l: "Saudi Arabia", p: 21 },
  { l: "Kuwait", p: 9 },
  { l: "UAE", p: 8 },
  { l: "Other", p: 16 },
];

const REVIEW_QUEUE = [
  { n: "Mariam A.", p: "Product photoshoot — sneakers drop", c: "AI Photoshoot" },
  { n: "Ahmed R.", p: "30-second launch spot", c: "AI Video" },
  { n: "Hager M.", p: "Poster series — 3 formats", c: "Photoshop" },
  { n: "Karim S.", p: "Brand mark + lockups", c: "Illustrator" },
  { n: "Dina F.", p: "Logo sting animation", c: "After Effects" },
];

export default function AdminView() {
  return (
    <AdminGuard>
      <Studio />
    </AdminGuard>
  );
}

function Studio() {
  const { t, lang } = useLang();
  const store = useStore();
  const studio = useStudio();

  // offer controls
  const [offerText, setOfferText] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const offerEnabled = studio.offer?.enabled !== false;
  const displayOffer = offerText ?? studio.offer?.text ?? t.offer.text;

  const totalRevenue = REVENUE_14D.reduce((a, b) => a + b, 0) * 4; // ~2 months
  const chartMax = Math.max(...REVENUE_14D);
  const firstName = store.user!.name.trim().split(/\s+/)[0];

  // course ranking — students × live price (overrides included)
  const ranked = useMemo(() => {
    const live = courses.map((c) => mergeCourse(c, studio.courses[c.slug]));
    return live
      .map((c) => ({
        c,
        revenue: c.price * Math.round(c.students * 0.32),
      }))
      .sort((a, b) => b.revenue - a.revenue || b.c.students - a.c.students);
  }, [studio]);
  const topRevenue = Math.max(1, ...ranked.map((r) => r.revenue));

  const saveOffer = () => {
    setOfferOverride({ text: displayOffer.trim(), enabled: offerEnabled });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section className="container-edge mx-auto max-w-edge pb-28 pt-32 md:pt-40">
      {/* welcome */}
      <Reveal>
        <SectionLabel index="⌘">{t.admin.kicker}</SectionLabel>
      </Reveal>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <Reveal delay={0.05}>
          <h1 className="text-balance font-display text-4xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
            {t.admin.welcome},{" "}
            <span className="text-grad font-serif font-normal italic tracking-normal">
              {firstName}
            </span>
            .
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex items-center gap-3">
            <span className="glass rounded-full px-4 py-2 text-xs text-bone-200">
              {t.admin.range}
            </span>
            <Link href="/admin/courses/" className="btn btn-primary px-6 py-3 text-sm">
              {t.admin.editCourses} →
            </Link>
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.12}>
        <p className="mt-4 max-w-xl text-sm text-bone-400 md:text-base">
          {t.admin.sub}
        </p>
      </Reveal>

      {/* stat tiles */}
      <Reveal delay={0.15}>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: totalRevenue, pre: "EGP ", l: t.admin.statRevenue, up: "+12%" },
            { n: 1247 + (store.user ? 1 : 0), pre: "", l: t.admin.statStudents, up: "+38" },
            { n: 4.8, pre: "", l: t.admin.statConversion, up: "+0.6", pct: true },
            { n: courses.length, pre: "", l: t.admin.statCourses, up: "" },
          ].map((s) => (
            <div key={s.l} className="relative bg-ink-900 p-7">
              <p className="font-display text-3xl font-semibold text-bone-50 md:text-4xl">
                <span className="text-base text-bone-400">{s.pre}</span>
                {s.pct ? (
                  <span className="tabular-nums" dir="ltr">
                    {s.n}%
                  </span>
                ) : (
                  <Counter value={s.n as number} />
                )}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-ultra text-bone-500">
                {s.l}
              </p>
              {s.up && (
                <span className="absolute right-5 top-5 rounded-full bg-mint/10 px-2.5 py-1 text-[10px] font-bold text-mint">
                  ↑ {s.up}
                </span>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* ============================ MAIN ============================ */}
        <div className="space-y-6 lg:col-span-8">
          {/* revenue chart */}
          <Reveal>
            <div className="glass relative overflow-hidden rounded-2xl p-6 md:p-8">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(80% 90% at 0% 0%, rgb(var(--mint) / 0.1) 0%, transparent 55%)",
                }}
              />
              <div className="relative">
                <div className="flex items-end justify-between gap-4">
                  <p className="text-xs uppercase tracking-ultra text-bone-500">
                    {t.admin.chartLabel} — {t.admin.range.toLowerCase()}
                  </p>
                  <p className="font-display text-lg font-semibold text-mint" dir="ltr">
                    {fmtPrice(REVENUE_14D.reduce((a, b) => a + b, 0), lang)}
                  </p>
                </div>
                <div className="mt-6 flex h-44 items-end gap-1.5 md:gap-2.5">
                  {REVENUE_14D.map((v, i) => (
                    <div key={i} className="group relative flex h-full grow flex-col justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${(v / chartMax) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease, delay: i * 0.04 }}
                        className={`rounded-t-md transition-opacity ${
                          i === REVENUE_14D.length - 1
                            ? "shadow-[0_0_18px_rgb(var(--mint)/0.5)] [background:linear-gradient(180deg,rgb(var(--mint)),rgb(var(--electric)))]"
                            : "bg-bone-50/15 group-hover:bg-bone-50/30"
                        }`}
                      />
                      <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-900 px-2 py-1 text-[10px] tabular-nums text-bone-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        EGP {v.toLocaleString("en-US")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* top courses */}
          <Reveal delay={0.05}>
            <div className="glass rounded-2xl p-6 md:p-8">
              <p className="text-xs uppercase tracking-ultra text-bone-500">
                {t.admin.topLabel}{" "}
                <span className="text-bone-600">· {t.admin.topBy}</span>
              </p>
              <div className="mt-6 space-y-5">
                {ranked.map(({ c, revenue }, i) => (
                  <div key={c.slug} className="flex items-center gap-4">
                    <span className="w-6 shrink-0 font-serif text-sm italic text-mint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 grow">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-bone-50">
                          {c.short[lang]}
                        </p>
                        <p className="shrink-0 text-xs tabular-nums text-bone-400" dir="ltr">
                          {c.price === 0
                            ? `${c.students.toLocaleString("en-US")} ${t.common.students}`
                            : fmtPrice(revenue, lang)}
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-900">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${Math.max(6, (revenue / topRevenue) * 100)}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease, delay: i * 0.07 }}
                          className={`h-full rounded-full ${
                            c.price === 0
                              ? "bg-bone-50/20"
                              : "[background:linear-gradient(90deg,rgb(var(--mint)),rgb(var(--electric)))]"
                          }`}
                        />
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        c.price === 0
                          ? "bg-bone-50/10 text-bone-300"
                          : "bg-mint/15 text-mint"
                      }`}
                    >
                      {c.price === 0 ? t.common.free : fmtPrice(c.price, lang)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* review queue */}
          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-ultra text-bone-500">
                  {t.admin.reviewLabel}
                </p>
                <span className="rounded-full bg-electric/15 px-3 py-1 text-xs font-bold text-electric">
                  {REVIEW_QUEUE.length}
                </span>
              </div>
              <div className="mt-5 divide-y divide-line/10">
                {REVIEW_QUEUE.map((r) => (
                  <div key={r.p} className="flex items-center gap-4 py-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint/10 font-serif text-sm italic text-mint">
                      {r.n.charAt(0)}
                    </span>
                    <div className="min-w-0 grow">
                      <p className="truncate text-sm text-bone-50">{r.p}</p>
                      <p className="text-xs text-bone-500">
                        {r.n} · {r.c}
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${site.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-full border border-line/20 px-4 py-1.5 text-xs text-bone-200 transition-colors hover:border-mint/50 hover:text-mint"
                    >
                      {t.admin.reviewCta} →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ============================ SIDE ============================ */}
        <div className="space-y-6 lg:col-span-4">
          {/* site controls */}
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-electric/25 bg-ink-800/70 p-6">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(140deg, rgb(var(--electric) / 0.1) 0%, transparent 55%)",
                }}
              />
              <div className="relative">
                <p className="text-xs uppercase tracking-ultra text-bone-500">
                  {t.admin.controlsLabel}
                </p>
                <label className="mt-5 block">
                  <span className="text-[11px] uppercase tracking-ultra text-bone-500">
                    {t.admin.offerText}
                  </span>
                  <textarea
                    value={displayOffer}
                    onChange={(e) => setOfferText(e.target.value)}
                    rows={3}
                    className="mt-2 w-full resize-none rounded-xl border border-line/15 bg-ink-900/70 px-4 py-3 text-sm text-bone-50 focus:border-mint/60 focus:outline-none"
                  />
                </label>
                <label className="mt-4 flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-sm text-bone-200">{t.admin.offerOn}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={offerEnabled}
                    onClick={() => setOfferOverride({ enabled: !offerEnabled })}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                      offerEnabled
                        ? "[background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]"
                        : "bg-ink-900 ring-1 ring-line/20"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                        offerEnabled ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.removeItem("offer-ends");
                    } catch {}
                    // fresh value each click so the ribbon re-reads its deadline
                    setOfferOverride({ endsAt: Date.now() });
                  }}
                  className="mt-4 w-full rounded-full border border-line/20 px-4 py-2.5 text-xs text-bone-200 transition-colors hover:border-mint/50 hover:text-mint"
                >
                  ↻ {t.admin.offerReset}
                </button>
                <button
                  type="button"
                  onClick={saveOffer}
                  className="btn btn-primary mt-3 w-full py-3"
                >
                  {saved ? t.admin.saved : t.admin.save}
                </button>
              </div>
            </div>
          </Reveal>

          {/* latest signups */}
          <Reveal delay={0.05}>
            <div className="glass rounded-2xl p-6">
              <p className="text-xs uppercase tracking-ultra text-bone-500">
                {t.admin.signupsLabel}
              </p>
              <div className="mt-4 divide-y divide-line/10">
                {store.user && (
                  <div className="flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-serif text-sm italic text-white [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]">
                      {store.user.name.charAt(0)}
                    </span>
                    <div className="min-w-0 grow">
                      <p className="truncate text-sm text-bone-50">{store.user.name}</p>
                      <p className="truncate text-xs text-bone-500">{store.user.email}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-mint/15 px-2.5 py-1 text-[10px] font-bold text-mint">
                      {t.admin.youTag}
                    </span>
                  </div>
                )}
                {SIGNUPS.map((s) => (
                  <div key={s.e} className="flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bone-50/10 font-serif text-sm italic text-bone-200">
                      {s.n.charAt(0)}
                    </span>
                    <div className="min-w-0 grow">
                      <p className="truncate text-sm text-bone-50">{s.n}</p>
                      <p className="truncate text-xs text-bone-500">{s.c}</p>
                    </div>
                    <span className="shrink-0 text-[11px] tabular-nums text-bone-500">
                      {s.ago}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* locations */}
          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-6">
              <p className="text-xs uppercase tracking-ultra text-bone-500">
                {t.admin.locationsLabel}
              </p>
              <div className="mt-5 space-y-4">
                {LOCATIONS.map((x, i) => (
                  <div key={x.l}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-bone-200">{x.l}</span>
                      <span className="tabular-nums text-bone-400" dir="ltr">
                        {x.p}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-900">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${x.p}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease, delay: i * 0.08 }}
                        className="h-full rounded-full [background:linear-gradient(90deg,rgb(var(--mint)),rgb(var(--electric)))]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="px-2 text-center text-[11px] leading-relaxed text-bone-500">
              {t.admin.localNote}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
