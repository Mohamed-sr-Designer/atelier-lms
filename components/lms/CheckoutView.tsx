"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import GlyphPlate from "@/components/lms/GlyphPlate";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { createOrder, enrollFree, myOrders, useDb } from "@/lib/db";
import { useOps } from "@/lib/ops-dict";
import { openAuth } from "@/components/lms/AuthModal";
import { useStudio, mergeCourse } from "@/lib/studio";
import { isValidCode, promoDiscount } from "@/lib/promo";
import { site, payments } from "@/lib/site";
import {
  coursesOfBundle,
  fmtPrice,
  fmtUsd,
  getBundle,
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
  const [promoInput, setPromoInput] = useState("");
  const [promoState, setPromoState] = useState<"idle" | "ok" | "bad">("idle");
  const [reference, setReference] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const o = useOps();
  const { data: orders } = useDb(myOrders, [store.user?.email]);

  // ?bundle=1 (legacy, AI stack) or ?bundle=<slug> for any pack
  const bundleParam = params.get("bundle");
  const activeBundle = bundleParam
    ? getBundle(bundleParam === "1" ? "ai-production-stack" : bundleParam)
    : undefined;
  const isBundle = Boolean(activeBundle);
  const courseStatic = isBundle ? null : getCourse(params.get("course") || "");
  const course = courseStatic
    ? mergeCourse(courseStatic, studio.courses[courseStatic.slug])
    : null;
  const items: Course[] = activeBundle
    ? coursesOfBundle(activeBundle)
    : course
      ? [course]
      : [];
  const baseTotal = activeBundle ? activeBundle.price : course?.price ?? 0;
  const compareAt = activeBundle ? activeBundle.compareAt : course?.compareAt;
  const promoOff = promoState === "ok" ? promoDiscount(baseTotal) : 0;
  const total = baseTotal - promoOff;
  const isFree = baseTotal === 0;

  const applyPromo = () => {
    if (!promoInput.trim()) return;
    setPromoState(isValidCode(promoInput) ? "ok" : "bad");
  };

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

  const orderName = activeBundle
    ? activeBundle.title[lang]
    : course!.short[lang];

  const slugs = items.map((c) => c.slug);
  const hasPending = (orders || []).some(
    (x) => x.status === "pending" && slugs.every((sl) => x.courseSlugs.includes(sl))
  );

  // Free courses open straight away.
  const complete = async () => {
    try {
      await enrollFree(slugs);
    } catch (x) {
      setErr(String((x as Error).message || x));
      return;
    }
    const target = slugs[0];
    router.push(`/checkout/success/?course=${target}${isBundle ? "&bundle=1" : ""}`);
  };

  const methodLabel = method === "instapay" ? "InstaPay" : "Vodafone Cash";

  // Paid: the order waits in the admin desk until the transfer is confirmed.
  const confirmPaid = async () => {
    if (reference.trim().length < 3) {
      setErr(o.checkout.errRef);
      return;
    }
    setErr("");
    setSending(true);
    try {
      await createOrder({
        title: orderName,
        courseSlugs: slugs,
        amount: total,
        promo: promoState === "ok" ? promoInput.trim() : undefined,
        method: methodLabel,
        reference: reference.trim(),
      });
      setSent(true);
    } catch (x) {
      setErr(String((x as Error).message || x));
    }
    setSending(false);
  };

  const waReceipt = () => {
    const msg = encodeURIComponent(
      `${payments.waEnrollMsg} ${orderName}: ${fmtPrice(total, "en")} (${methodLabel}, ${reference.trim()})${
        promoState === "ok" ? `, promo ${promoInput.trim()}` : ""
      }`
    );
    window.open(`https://wa.me/${site.whatsapp}?text=${msg}`, "_blank", "noopener,noreferrer");
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
                    <span dir="ltr">−{fmtPrice(compareAt - baseTotal, lang)}</span>
                  </div>
                ) : null}

                {/* promo code */}
                {!isFree && (
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoState("idle");
                        }}
                        placeholder={t.checkout.promoPh}
                        aria-label={t.checkout.promoLabel}
                        disabled={promoState === "ok"}
                        dir="ltr"
                        className="min-w-0 grow rounded-lg border border-line/15 bg-ink-900 px-3.5 py-2.5 font-mono text-sm tracking-wider text-bone-50 placeholder:text-bone-500/50 focus:border-mint/60 focus:outline-none disabled:opacity-60"
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        disabled={promoState === "ok"}
                        className="shrink-0 rounded-lg border border-mint/40 bg-mint/10 px-4 text-xs font-semibold text-mint transition-colors hover:bg-mint/20 disabled:opacity-60"
                      >
                        {promoState === "ok" ? "✓" : t.checkout.promoApply}
                      </button>
                    </div>
                    {promoState === "ok" && (
                      <div className="mt-2 flex justify-between text-sm text-mint">
                        <span>{t.checkout.promoOff} ✦</span>
                        <span dir="ltr">−{fmtPrice(promoOff, lang)}</span>
                      </div>
                    )}
                    {promoState === "bad" && (
                      <p className="mt-2 text-xs text-red-400/90">
                        {t.checkout.promoInvalid}
                      </p>
                    )}
                  </div>
                )}

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
                href={
                  activeBundle
                    ? activeBundle.slug === "ai-production-stack"
                      ? "/bundle/"
                      : "/offers/"
                    : `/courses/${course!.slug}/`
                }
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
              ) : sent ? (
                <div className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-mint/40 bg-mint/10 text-2xl text-mint">
                    ✓
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-bone-50">
                    {o.checkout.pendingTitle}
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-bone-400">
                    {o.checkout.pendingBody}
                  </p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={waReceipt} className="btn btn-ghost py-3.5">
                      {o.checkout.pendingWa}
                    </button>
                    <Link href="/dashboard/" className="btn btn-primary py-3.5">
                      {o.checkout.toDash}
                    </Link>
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
                    {o.checkout.refNote}
                  </p>

                  <label className="mt-5 block">
                    <span className="text-xs uppercase tracking-ultra text-bone-500">
                      {o.checkout.refLabel}
                    </span>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder={o.checkout.refPh}
                      className="mt-1.5 w-full rounded-xl border border-line/15 bg-ink-900 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none"
                    />
                  </label>

                  {hasPending && (
                    <p className="mt-4 rounded-lg border border-electric/30 bg-electric/5 p-3 text-xs text-bone-200">
                      {o.checkout.alreadyPending}
                    </p>
                  )}
                  {err && <p className="mt-3 text-sm text-mint">{err}</p>}

                  <button
                    type="button"
                    onClick={confirmPaid}
                    disabled={sending}
                    className="btn btn-primary mt-6 w-full py-4 disabled:opacity-60"
                  >
                    {sending ? o.checkout.sending : o.checkout.submit}
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
