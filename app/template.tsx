"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// Lightweight, creative route transition — NOT a loading screen.
// The incoming page clips up from the bottom while a thin accent line
// sweeps across the top. Fast and non-blocking.
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <>
      {/* accent sweep */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[82] h-[3px] w-full origin-left bg-mint"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.7, ease }}
      />
      {/* content reveal */}
      <motion.div
        initial={{ clipPath: "inset(18% 0 0 0)", opacity: 0, y: 18 }}
        animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        {children}
      </motion.div>
    </>
  );
}
