"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// Glass route transition: a frosted veil melts away while the accent line
// sweeps and the incoming page rises out of the blur.
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <>
      {/* accent sweep */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[82] h-[3px] w-full origin-left bg-gradient-to-r from-mint to-electric"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.7, ease }}
      />
      {/* frosted veil that melts away */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[81] bg-ink-900/30 backdrop-blur-xl"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.55, ease }}
      />
      {/* content rises out of the blur */}
      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease }}
      >
        {children}
      </motion.div>
    </>
  );
}
