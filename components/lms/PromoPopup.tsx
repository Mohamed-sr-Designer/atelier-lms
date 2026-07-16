"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";
import { bundles, fmtPrice } from "@/lib/courses";
import { getPersonalCode } from "@/lib/promo";

const SEEN_KEY = "promo-seen";
const ART: Record<string, string> = {
  "ai-production-stack": "/lms/hero-banner.jpg",
  "editors-suite": "/work/secure/hero.webp",
  "motion-ai-master": "/work/tilal/hero.webp",
};

// Scratch-to-reveal foil over the personal promo code.
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

// Center-screen promo: the three offers as a stacked DECK of cards (no
// slider). Tapping the deck sends the top card to the back with a spring.
// Appears once per session in the middle of the screen; closing collapses
// it to a small gift icon (bottom-left) that reopens it anytime.
type PopupState = "hidden" | "open" | "mini";

export default function PromoPopup() {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const [state, setState] = useState<PopupState>("hidden");
  const [order, setOrder] = useState<number[]>(bundles.map((_, i) => i));
  const [code, setCode] = useState("MT-····");

  const muted =
    pathname.startsWith("/bundle") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/offers") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/learn");

  useEffect(() => {
    setCode(getPersonalCode());
  }, []);

  useEffect(() => {
    if (muted) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen) {
      // already shown this session — keep the mini icon available
      setState((s) => (s === "hidden" ? "mini" : s));
      return;
    }

    const reveal = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setState("open");
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

  const shuffle = () =>
    setOrder(([top, ...rest]) => [...rest, top]);

  if (muted) return null;

  return (
    <>
      {/* minimized gift icon — reopens the offers */}
      <AnimatePresence>
        {state === "mini" && (
          <motion.button
            type="button"
            onClick={() => setState("open")}
            aria-label={t.promo.seeAll}
            title={t.promo.seeAll}
            initial={{ opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, transitionEnd: { display: "none" } }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            whileHover={{ y: -3, scale: 1.08 }}
            className="glass-strong fixed bottom-5 left-5 z-[65] grid place-items-center rounded-full p-3 text-2xl leading-none md:bottom-8 md:left-8"
          >
            🎁
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-mint shadow-[0_0_10px_rgb(var(--mint)/0.9)]"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* the centered offers dialog */}
      <AnimatePresence>
        {state === "open" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transitionEnd: { display: "none" } }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[75] grid place-items-center overflow-y-auto p-4"
            role="dialog"
            aria-label={t.promo.tag}
          >
            {/* dimmed backdrop — click to minimize */}
            <button
              type="button"
              aria-label={t.promo.dismiss}
              onClick={() => setState("mini")}
              className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.92, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 24, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 170, damping: 20 }}
              className="relative w-full max-w-sm"
            >
          {/* the deck */}
          <div className="relative" style={{ paddingTop: 18 }}>
            {order.map((bi, depth) => {
              const b = bundles[bi];
              const isTop = depth === 0;
              return (
                <motion.div
                  key={b.slug}
                  animate={{
                    y: -depth * 9,
                    scale: 1 - depth * 0.04,
                    rotate: depth === 0 ? 0 : depth === 1 ? -2.5 : 2.5,
                    zIndex: 30 - depth,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className={`glass-strong overflow-hidden rounded-3xl ${
                    isTop ? "relative" : "absolute inset-x-0 top-[18px]"
                  }`}
                  style={{ zIndex: 30 - depth, transformOrigin: "50% 100%" }}
                  onClick={isTop ? undefined : shuffle}
                >
                  {/* art header */}
                  <div
                    className="glass-sheen relative h-28 cursor-pointer overflow-hidden"
                    onClick={isTop ? shuffle : undefined}
                    title={t.promo.shuffleHint}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={withBase(ART[b.slug] ?? ART["ai-production-stack"])}
                      alt=""
                      aria-hidden
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
                    <span className="absolute left-4 top-3.5 inline-flex items-center gap-2 rounded-full bg-ink-900/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mint backdrop-blur">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
                      {t.promo.tag}
                    </span>
                    {isTop && (
                      <>
                        <span className="absolute bottom-2.5 left-4 rounded-full bg-ink-900/70 px-2.5 py-1 text-[10px] text-bone-300 backdrop-blur" dir="ltr">
                          {bi + 1}/{bundles.length} · {t.promo.shuffleHint}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setState("mini");
                          }}
                          aria-label="Close"
                          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-ink-900/60 text-bone-300 backdrop-blur transition-colors hover:text-mint"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>

                  {/* body — only the top card carries the full body */}
                  {isTop && (
                    <div className="relative p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-bone-50">
                          {b.title[lang]}
                        </h3>
                        <span
                          className="shrink-0 rounded-full bg-mint/15 px-2.5 py-1 text-[10px] font-bold text-mint"
                          dir="ltr"
                        >
                          −{fmtPrice(b.compareAt - b.price, lang)}
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

                      <ScratchCode
                        code={code}
                        hint={`${t.promo.codeLabel} · ${t.promo.codeHint}`}
                      />

                      <div className="mt-4 flex items-center gap-3">
                        <Link
                          href={`/checkout/?bundle=${b.slug}`}
                          onClick={() => setState("mini")}
                          className="btn btn-primary grow py-3 text-sm"
                        >
                          {t.promo.cta}
                        </Link>
                        <Link
                          href="/offers/"
                          onClick={() => setState("mini")}
                          className="shrink-0 text-xs text-bone-400 underline decoration-line/40 underline-offset-4 transition-colors hover:text-mint"
                        >
                          {t.promo.seeAll}
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
