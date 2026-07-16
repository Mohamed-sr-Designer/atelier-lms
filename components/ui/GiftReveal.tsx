"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// Premium gift wrap. The section sleeps under layered glass: two satin
// gradient ribbons with a travelling sheen, a rotating conic seal with a
// serif monogram, and drifting sparkles. Unwrap is MANUAL.
//
// NOTE: the out-animation is state-driven (animate on `open`) with a timed
// unmount — NOT AnimatePresence exit. Infinite-loop children inside an
// exiting AnimatePresence node can stall the exit forever and leave an
// invisible click-blocker (same family as the auth-modal bug).
const SPARKS = [
  { x: "12%", y: "18%", d: 0 },
  { x: "84%", y: "12%", d: 0.6 },
  { x: "70%", y: "78%", d: 1.2 },
  { x: "22%", y: "72%", d: 1.8 },
  { x: "48%", y: "8%", d: 2.4 },
  { x: "90%", y: "52%", d: 3 },
];

export default function GiftReveal({
  tag,
  hint,
  children,
}: {
  tag: string;
  hint: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  const unwrap = () => {
    if (open) return;
    setOpen(true);
    // unmount after the out-choreography finishes — deterministic, no
    // AnimatePresence to get stuck
    setTimeout(() => setGone(true), 800);
  };

  return (
    <div className="relative">
      {/* the present inside — dimmed & blurred until unwrapped */}
      <motion.div
        animate={
          open
            ? { opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }
            : { opacity: 0.35, scale: 0.985, filter: "blur(10px)" }
        }
        transition={{ duration: 0.8, ease }}
      >
        {children}
      </motion.div>

      {!gone && (
        <motion.button
          type="button"
          onClick={unwrap}
          aria-label={hint}
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.55, ease, delay: open ? 0.15 : 0 }}
          className={`group absolute inset-0 z-20 overflow-hidden rounded-3xl ${
            open ? "pointer-events-none" : "cursor-pointer"
          }`}
        >
          {/* layered glass wrap with accent glows */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-3xl border border-line/20 bg-ink-900/45 backdrop-blur-2xl"
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-3xl opacity-70"
            style={{
              background:
                "radial-gradient(45% 60% at 18% 10%, rgb(var(--mint) / 0.16) 0%, transparent 60%), radial-gradient(45% 60% at 85% 90%, rgb(var(--electric) / 0.14) 0%, transparent 60%)",
            }}
          />
          <span aria-hidden className="bg-noise absolute inset-0 rounded-3xl opacity-[0.05]" />

          {/* satin ribbons — vertical + horizontal, travelling sheen */}
          <motion.span
            aria-hidden
            animate={open ? { y: "-115%" } : { y: "0%" }}
            transition={{ duration: 0.6, ease }}
            className="absolute inset-y-0 left-1/2 w-14 -translate-x-1/2 overflow-hidden"
          >
            <span className="absolute inset-0 [background:linear-gradient(180deg,rgb(var(--mint)/0.9),rgb(var(--electric)/0.9))] shadow-[0_0_50px_rgb(var(--mint)/0.45)]" />
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/40" />
            <motion.span
              className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-white/35 to-transparent"
              animate={{ top: ["-15%", "115%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.span>
          <motion.span
            aria-hidden
            animate={open ? { x: "115%" } : { x: "0%" }}
            transition={{ duration: 0.6, ease }}
            className="absolute inset-x-0 top-1/2 h-14 -translate-y-1/2 overflow-hidden"
          >
            <span className="absolute inset-0 [background:linear-gradient(90deg,rgb(var(--electric)/0.9),rgb(var(--mint)/0.9))] shadow-[0_0_50px_rgb(var(--electric)/0.4)]" />
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/40" />
            <motion.span
              className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              animate={{ left: ["-15%", "115%"] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
          </motion.span>

          {/* rotating conic seal with serif monogram */}
          <motion.span
            aria-hidden
            animate={open ? { scale: 0, rotate: 45 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.45, ease }}
            className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
          >
            <motion.span
              className="absolute h-32 w-32 rounded-full opacity-80"
              style={{
                background:
                  "conic-gradient(from 0deg, rgb(var(--mint)), rgb(var(--electric)), transparent 55%, rgb(var(--mint)))",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            />
            <span className="glass-strong grid h-24 w-24 place-items-center rounded-full transition-transform duration-500 group-hover:scale-110">
              <span className="flex flex-col items-center">
                <span className="text-grad font-serif text-3xl font-semibold italic leading-none">
                  MT
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.3em] text-bone-400">
                  ✦ gift ✦
                </span>
              </span>
            </span>
          </motion.span>

          {/* drifting sparkles */}
          {SPARKS.map((s, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute text-mint/80"
              style={{ left: s.x, top: s.y, fontSize: i % 2 ? 11 : 15 }}
              animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.15, 0.8], y: [0, -7, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: s.d }}
            >
              ✦
            </motion.span>
          ))}

          {/* elegant tag */}
          <motion.span
            className="glass absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-6 py-3"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-serif text-sm italic text-bone-100">{tag}</span>
            <span className="mx-2 text-bone-500">—</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-mint">
              {hint}
            </span>
          </motion.span>
        </motion.button>
      )}
    </div>
  );
}
