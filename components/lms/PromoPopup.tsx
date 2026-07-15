"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";
import { bundle, fmtPrice } from "@/lib/courses";

const ease = [0.16, 1, 0.3, 1] as const;
const SEEN_KEY = "promo-seen";

// A glassy, spring-in promo card for the AI Production Stack. Surfaces once
// per session — after ~22s of browsing OR when the reader is halfway down a
// page — never on the checkout/bundle funnel itself. Carries the hero art,
// a promo code and a save badge.
export default function PromoPopup() {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // don't nag on the funnel pages
  const muted =
    pathname.startsWith("/bundle") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/learn");

  useEffect(() => {
    if (muted) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen) return;

    const reveal = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setOpen(true);
      cleanup();
    };

    const timer = setTimeout(reveal, 22000);
    const onScroll = () => {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.5) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, [muted]);

  const copyCode = () => {
    try {
      navigator.clipboard?.writeText(t.promo.code);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)" }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="glass-strong fixed bottom-5 left-5 right-5 z-[70] mx-auto w-auto max-w-sm overflow-hidden rounded-3xl sm:left-auto sm:right-6 sm:w-full"
          role="dialog"
          aria-label={t.promo.title}
        >
          {/* hero art with an animated sheen */}
          <div className="glass-sheen relative h-32 overflow-hidden">
            <motion.img
              src={withBase("/lms/hero-banner.jpg")}
              alt=""
              aria-hidden
              className="h-full w-full object-cover object-[center_30%]"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              animate={{ x: ["0%", "420%"] }}
              transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-ink-900/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mint backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
              {t.promo.tag}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-ink-900/60 text-bone-300 backdrop-blur transition-colors hover:text-mint"
            >
              ✕
            </button>
          </div>

          {/* body */}
          <div className="relative p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl font-semibold tracking-tight text-bone-50">
                {t.promo.title}
              </h3>
              <span className="shrink-0 rounded-full bg-mint/15 px-2.5 py-1 text-[10px] font-bold text-mint">
                {t.promo.save}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-bone-400">{t.promo.sub}</p>

            {/* price */}
            <div className="mt-4 flex items-baseline gap-3" dir="ltr">
              <span className="font-display text-2xl font-bold text-grad">
                {fmtPrice(bundle.price, lang)}
              </span>
              <span className="text-sm text-bone-500 line-through">
                {fmtPrice(bundle.compareAt, lang)}
              </span>
            </div>

            {/* promo code */}
            <button
              type="button"
              onClick={copyCode}
              className="glass-sheen group mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-mint/40 bg-mint/[0.06] px-4 py-3 text-left transition-colors hover:border-mint/70"
            >
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-ultra text-bone-500">
                  {t.promo.codeLabel} · {t.promo.codeHint}
                </span>
                <span className="font-mono text-base font-bold tracking-wider text-mint">
                  {t.promo.code}
                </span>
              </span>
              <span className="shrink-0 text-xs font-semibold text-bone-300 group-hover:text-mint">
                {copied ? "Copied ✓" : "Copy"}
              </span>
            </button>

            <div className="mt-4 flex items-center gap-3">
              <Link
                href="/bundle/"
                onClick={() => setOpen(false)}
                className="btn btn-primary grow py-3 text-sm"
              >
                {t.promo.cta}
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 px-2 text-xs text-bone-500 transition-colors hover:text-bone-300"
              >
                {t.promo.dismiss}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
