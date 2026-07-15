"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// Wraps a section in gift wrap: crossed gradient ribbons, a bow, and a tag.
// Tap to unwrap (or it unwraps itself a few seconds after scrolling into
// view) — the ribbons slide away and the content springs out of the box.
export default function GiftReveal({
  tag,
  hint,
  children,
}: {
  tag: string;
  hint: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const [open, setOpen] = useState(false);

  // auto-unwrap shortly after the reader arrives
  useEffect(() => {
    if (!inView || open) return;
    const id = setTimeout(() => setOpen(true), 3200);
    return () => clearTimeout(id);
  }, [inView, open]);

  return (
    <div ref={ref} className="relative">
      {/* the present inside — blurred & scaled down until unwrapped */}
      <motion.div
        animate={
          open
            ? { opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }
            : { opacity: 0.45, scale: 0.985, filter: "blur(6px)" }
        }
        transition={{ duration: 0.7, ease }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={hint}
            className="absolute inset-0 z-20 cursor-pointer overflow-hidden rounded-3xl"
            exit={{ opacity: 0, transitionEnd: { display: "none" } }}
            transition={{ duration: 0.4 }}
          >
            {/* vertical ribbon */}
            <motion.span
              aria-hidden
              className="absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 [background:linear-gradient(180deg,rgb(var(--mint)),rgb(var(--electric)))] shadow-[0_0_40px_rgb(var(--mint)/0.5)]"
              exit={{ y: "-110%", transition: { duration: 0.55, ease } }}
            />
            {/* horizontal ribbon */}
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 [background:linear-gradient(90deg,rgb(var(--electric)),rgb(var(--mint)))] shadow-[0_0_40px_rgb(var(--electric)/0.4)]"
              exit={{ x: "110%", transition: { duration: 0.55, ease } }}
            />
            {/* bow */}
            <motion.span
              aria-hidden
              className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
              animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              exit={{ scale: 0, rotate: 30, transition: { duration: 0.4 } }}
            >
              <span className="grid h-24 w-24 place-items-center rounded-full border border-white/20 bg-ink-900/70 text-5xl backdrop-blur-xl shadow-[0_0_60px_rgb(var(--mint)/0.55)]">
                🎁
              </span>
            </motion.span>
            {/* tag */}
            <motion.span
              className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-bone-100 backdrop-blur"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              exit={{ opacity: 0 }}
            >
              🎀 {tag} — <span className="text-mint">{hint}</span>
            </motion.span>
            {/* frosted wrap */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 rounded-3xl border border-mint/25 bg-ink-900/30 backdrop-blur-sm"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
