"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";

const ease = [0.76, 0, 0.24, 1] as const;

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only ever play once per browser session (not on every route change).
    let seen = false;
    try {
      seen = sessionStorage.getItem("preloaded") === "1";
    } catch {}
    if (reduce || seen) {
      setDone(true);
      return;
    }
    try {
      sessionStorage.setItem("preloaded", "1");
    } catch {}
    document.body.style.overflow = "hidden";
    let n = 0;
    const id = setInterval(() => {
      n += Math.floor(Math.random() * 9) + 4;
      if (n >= 100) {
        n = 100;
        clearInterval(id);
        setTimeout(() => setDone(true), 450);
      }
      setCount(n);
    }, 95);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[110] flex flex-col justify-between overflow-hidden bg-ink-900 px-6 py-8 md:px-12 md:py-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease }}
        >
          {/* glass atmosphere */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, rgb(var(--mint)) 0%, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, rgb(var(--electric)) 0%, transparent 70%)" }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-noise opacity-[0.06]" />
          {/* top row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-bone-400"
          >
            <span>{site.shortName}</span>
            <span>School of Visual Direction — 2026</span>
          </motion.div>

          {/* center mark */}
          <div className="flex flex-col items-center">
            <span className="overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.1 }}
                className="block font-display text-[15vw] font-semibold leading-none tracking-tightest text-bone-50 md:text-[8vw]"
              >
                TAREK
              </motion.span>
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-2 font-serif text-lg italic text-mint md:text-2xl"
            >
              by {site.instructor} · Zero → Professional Workflow
            </motion.span>
          </div>

          {/* bottom: progress + counter */}
          <div>
            <div className="mb-3 flex items-end justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-bone-400">
                Opening the studio
              </span>
              <span className="font-display text-5xl font-semibold tabular-nums text-bone-50 md:text-7xl">
                {String(count).padStart(3, "0")}
              </span>
            </div>
            <div className="h-px w-full bg-line/15">
              <motion.div
                className="h-full bg-mint"
                style={{ width: `${count}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
