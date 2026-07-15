"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import GlyphPlate from "@/components/lms/GlyphPlate";
import { useLang } from "@/lib/i18n";
import { useStore, enroll } from "@/lib/store";
import { openAuth } from "@/components/lms/AuthModal";
import { useStudio, mergeCourse } from "@/lib/studio";
import { site, payments } from "@/lib/site";
import {
  bundle,
  bundleCourses,
  fmtPrice,
  fmtUsd,
  getCourse,
  type Course,
} from "@/lib/courses";

export default function CheckoutView() {
  const { t, lang } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const store = useStore();
  const studio = useStudio();
  const [method, setTarek] = useState<"instapay" | "vodafone">("instapay");
  const [copied, setCopied] = useState("");

  const isBundle = params.get("bundle") === "1";
  const courseStatic = isBundle ? null : getCourse(params.get("course") || "");
  const course = courseStatic
    ? mergeCourse(courseStatic, studio.courses[courseStatic.slug])
    : null;
  const items: Course[] = isBundle ? bundleCourses : course ? [course] : [];
  const total = isBundle ? bundle.price : course?.price ?? 0;
  const compareAt = isBundle ? bundle.compareAt : course?.compareAt;
  const isFree = total === 0;

  if (items.length === 0) {
    return (
      <section className="container-edge mx-auto max-w-edge pb-24 pt-40 text-center">
        <p className="text-bone-400">404</p>
        <Link href="/courses/" className="link-underline mt-4 inline-block text-mint">
          {t.notFound.courses} →
        </Link>
      </section>
    );
  }

  const orderName = isBundle ? bundle.title[lang] : course!.short[lang];

  const complete = () => {
    enroll(isBundle ? bundle.courseSlugs : course!.slug);
    const target = isBundle ? bundleCourses[0].slug : course!.slug;
    router.push(`/checkout/success/?course=${target}${isBundle ? "&bundle=1" : ""}`);
  };

  const confirmPaid = () => {
    const msg = encodeURIComponent(
      `${payments.waEnrollMsg} ${orderName} — ${fmtPrice(total, "en")} (${
        method === "instapay" ? "InstaPay" : "Vodafone Cash"
      })`
    );
    window.open(
      `https://wa.me/${site.whatsapp}?text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
    complete();
  };

  const copy = (v: string) => {
    navigator.clipboard?.writeText(v).then(() => {
      setCopied(v);
      setTimeout(() => setCopied(""), 1800);
    });
  };

  return (
    <section className="bg-grid relative overflow-hidden pb-24 pt-32 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 10% 110%, rgb(var(--mint) / 0.12) 0%, transparent 65%)",
        }}
      />
      <div className="container-edge relative mx-auto max-w-edge">
        <Reveal>
          <SectionLabel index="✦">{t.checkout.kicker}</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
            {t.checkout.title}
          </h1>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          {/* order summary */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-2xl border border-line/15 bg-ink-800/70 p-7">
              <p className="text-xs uppercase tracking-ultra text-bone-500">
                {t.checkout.orderLabel}
              </p>
              <ul className="mt-5 grid gap-4">
                {items.map((c) => (
                  <li key={c.slug} className="flex items-center gap-4">
                    <div className="w-20 shrink-0" style={{ containerType: "inline-size" }}>
                      <GlyphPlate course={c} className="aspect-[4/3] rounded-lg" />
                    </div>
                    <div className="grow">
                      <p className="text-sm font-medium text-bone-50">
                        {c.short[lang]}
                      </p>
                      <p className="text-xs text-bone-500">{c.level[lang]}</p>
                    </div>
                    <p className="text-sm text-bone-300" dir="ltr">
                      {fmtPrice(c.price, lang)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-line/10 pt-5">
                {compareAt ? (
                  <div className="flex justify-between text-sm text-bone-500">
                    <span>{t.bundle.vs}</span>
                    <span className="line-through" dir="ltr">
                      {fmtPrice(compareAt, lang)}
                    </span>
                  </div>
                ) : null}
                {compareAt ? (
                  <div className="mt-2 flex justify-between text-sm text-mint">
                    <span>{t.bundle.save}</span>
                    <span dir="ltr">−{fmtPrice(compareAt - total, lang)}</span>
                  </div>
                ) : null}
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-ultra text-bone-500">
                    {t.checkout.total}
                  </span>
                  <span className="text-end" dir="ltr">
                    <span className="block font-display text-3xl font-semibold text-bone-50">
                      {fmtPrice(total, lang)}
                    </span>
                    {total > 0 ? (
                      <span className="block text-xs font-medium text-bone-400">
                        ≈ {fmtUsd(total)} USD
                      </span>
                    ) : null}
                  </span>
                </div>
              </div>
              <Link
                href={isBundle ? "/bundle/" : `/courses/${course!.slug}/`}
                className="link-underline mt-6 inline-block text-xs text-bone-400"
              >
                ← {t.checkout.backTo}
              </Link>
            </div>
          </Reveal>

          {/* payment */}
          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="rounded-2xl border border-line/15 bg-ink-800/70 p-7 md:p-9">
              {!store.user ? (
                <div className="text-center">
                  <p className="text-bone-300">{t.checkout.loginFirst}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => openAuth("register")}
                      className="btn btn-primary px-7 py-3.5"
                    >
                      {t.auth.registerBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => openAuth("login")}
                      className="btn btn-ghost px-7 py-3.5"
                    >
                      {t.auth.loginBtn}
                    </button>
                  </div>
                </div>
              ) : isFree ? (
                <div className="text-center">
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-bone-400">
                    {t.course.startFreeNote}
                  </p>
                  <button
                    type="button"
                    onClick={complete}
                    className="btn btn-primary mt-7 px-9 py-4"
                  >
                    {t.checkout.freeBtn}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-ultra text-bone-500">
                    {t.checkout.payLabel}
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        {
                          id: "instapay" as const,
                          label: t.checkout.instapay,
                          value: payments.manual.instapay,
                        },
                        {
                          id: "vodafone" as const,
                          label: t.checkout.vodafone,
                          value: payments.manual.vodafoneCash,
                        },
                      ]
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setTarek(m.id)}
                        className={`rounded-xl border p-5 text-start transition-colors duration-300 ${
                          method === m.id
                            ? "border-mint bg-mint/5"
                            : "border-line/15 hover:border-line/30"
                        }`}
                        aria-pressed={method === m.id}
                      >
                        <p className="flex items-center justify-between text-sm font-medium text-bone-50">
                          {m.label}
                          <span
                            className={`h-3 w-3 rounded-full border ${
                              method === m.id
                                ? "border-mint bg-mint"
                                : "border-line/30"
                            }`}
                          />
                        </p>
                        <p
                          className="mt-2 flex items-center gap-2 font-mono text-sm text-bone-300"
                          dir="ltr"
                        >
                          {m.value}
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              copy(m.value);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && copy(m.value)}
                            className="rounded border border-line/20 px-1.5 py-0.5 text-[10px] text-bone-400 hover:text-mint"
                          >
                            {copied === m.value ? "✓" : "copy"}
                          </span>
                        </p>
                      </button>
                    ))}
                  </div>

                  <p className="mt-6 rounded-lg bg-ink-900/70 p-4 text-xs leading-relaxed text-bone-400">
                    {t.checkout.manualNote}
                  </p>

                  <button
                    type="button"
                    onClick={confirmPaid}
                    className="btn btn-primary mt-7 w-full py-4"
                  >
                    {t.checkout.confirmBtn}
                  </button>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/10 pt-5">
                    <p className="text-xs text-bone-500">{t.checkout.secure}</p>
                    <div className="flex gap-2">
                      {payments.gateways.map((g) => (
                        <span
                          key={g.id}
                          className="rounded-full border border-line/10 px-3 py-1 text-[10px] text-bone-500/70"
                        >
                          {g.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-bone-500/70">
                    {t.checkout.gatewaysSoon}
                  </p>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
