"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";
import { bundles, fmtPrice } from "@/lib/courses";

const SEEN_KEY = "promo-seen";
const ART: Record<string, string> = {
  "ai-production-stack": "/lms/hero-banner.jpg",
  "editors-suite": "/work/secure/hero.webp",
  "motion-ai-master": "/work/tilal/hero.webp",
};

// Scratch-to-reveal promo code: a canvas foil painted over the code that the
// user rubs off with the pointer. Reveals fully once ~45% is scratched.
function ScratchCode({ code, hint }: { code: string; hint: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratching = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || revealed) return;
    const rect = cv.getBoundingClientRect();
    cv.width = rect.width * 2;
    cv.height = rect.height * 2;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    // metallic foil
    const g = ctx.createLinearGradient(0, 0, cv.width, cv.height);
    g.addColorStop(0, "#4a4356");
    g.addColorStop(0.5, "#6b6178");
    g.addColorStop(1, "#3d3648");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.font = `bold ${cv.height * 0.32}px sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH ME ✦", cv.width / 2, cv.height / 2);
    ctx.globalCompositeOperation = "destination-out";
  }, [revealed]);

  const scratch = (e: React.PointerEvent) => {
    if (!scratching.current || revealed) return;
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const rect = cv.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * cv.width;
    const y = ((e.clientY - rect.top) / rect.height) * cv.height;
    ctx.beginPath();
    ctx.arc(x, y, cv.height * 0.22, 0, Math.PI * 2);
    ctx.fill();
    // measure how much foil is gone (sampled)
    const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let clear = 0;
    for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clear++;
    if (clear / (data.length / 64) > 0.45) setRevealed(true);
  };

  const copy = () => {
    try {
      navigator.clipboard?.writeText(code);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="mt-4">
      <p className="text-[10px] uppercase tracking-ultra text-bone-500">{hint}</p>
      <div className="relative mt-2 h-12 overflow-hidden rounded-xl border border-dashed border-mint/40 bg-mint/[0.06]">
        <button
          type="button"
          onClick={revealed ? copy : undefined}
          className="absolute inset-0 flex items-center justify-between px-4"
        >
          <span className="font-mono text-lg font-bold tracking-[0.2em] text-mint">
            {code}
          </span>
          {revealed && (
            <span className="text-xs font-semibold text-bone-300">
              {copied ? "Copied ✓" : "Copy"}
            </span>
          )}
        </button>
        {!revealed && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-pointer touch-none"
            onPointerDown={(e) => {
              scratching.current = true;
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              scratch(e);
            }}
            onPointerMove={scratch}
            onPointerUp={() => (scratching.current = false)}
          />
        )}
      </div>
    </div>
  );
}

// Bottom-LEFT promo card (the right side belongs to WhatsApp + back-to-top).
// Rotates through every bundle offer with dots, and hides the code behind a
// scratch foil. Shows once per session on idle or half-scroll.
export default function PromoPopup() {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const muted =
    pathname.startsWith("/bundle") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/offers") ||
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
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (p > 0.5) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, [muted]);

  // auto-rotate offers while open
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % bundles.length), 7000);
    return () => clearInterval(id);
  }, [open]);

  const b = bundles[idx];
  const save = b.compareAt - b.price;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)" }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="glass-strong fixed bottom-5 left-5 right-5 z-[70] mx-auto w-auto max-w-sm overflow-hidden rounded-3xl sm:right-auto sm:left-6 sm:w-full"
          role="dialog"
          aria-label={t.promo.tag}
        >
          {/* art header — crossfades with the active offer */}
          <div className="glass-sheen relative h-32 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={b.slug}
                src={withBase(ART[b.slug] ?? ART["ai-production-stack"])}
                alt=""
                aria-hidden
                className="h-full w-full object-cover object-center"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
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

          {/* body — switches with the active offer */}
          <div className="relative p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={b.slug}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-bone-50">
                    {b.title[lang]}
                  </h3>
                  <span className="shrink-0 rounded-full bg-mint/15 px-2.5 py-1 text-[10px] font-bold text-mint" dir="ltr">
                    −{fmtPrice(save, lang)}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-bone-400">
                  {b.tagline[lang]}
                </p>
                <div className="mt-3 flex items-baseline gap-3" dir="ltr">
                  <span className="text-grad font-display text-2xl font-bold">
                    {fmtPrice(b.price, lang)}
                  </span>
                  <span className="text-sm text-bone-500 line-through">
                    {fmtPrice(b.compareAt, lang)}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <ScratchCode code={t.promo.code} hint={`${t.promo.codeLabel} · ${t.promo.codeHint}`} />

            <div className="mt-4 flex items-center gap-3">
              <Link
                href={`/checkout/?bundle=${b.slug}`}
                onClick={() => setOpen(false)}
                className="btn btn-primary grow py-3 text-sm"
              >
                {t.promo.cta}
              </Link>
              <Link
                href="/offers/"
                onClick={() => setOpen(false)}
                className="shrink-0 text-xs text-bone-400 underline decoration-line/40 underline-offset-4 transition-colors hover:text-mint"
              >
                {t.promo.seeAll}
              </Link>
            </div>

            {/* offer dots */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {bundles.map((x, i) => (
                <button
                  key={x.slug}
                  type="button"
                  aria-label={x.title.en}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === idx
                      ? "w-6 [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]"
                      : "w-1.5 bg-line/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
