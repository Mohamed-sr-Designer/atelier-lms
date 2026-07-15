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
        className="pointer-events-none fixed left-0 top-0 z-[82] h-[3px] w-full origin-left bg-gradient-to-r from-mint via-electric to-mint"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.7, ease }}
      />
      {/* frosted veil that melts away, with a faint accent wash */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[81] bg-ink-900/30 backdrop-blur-2xl"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease }}
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 20% 0%, rgb(var(--mint) / 0.12) 0%, transparent 60%), radial-gradient(50% 50% at 90% 100%, rgb(var(--electric) / 0.1) 0%, transparent 60%)",
        }}
      />
      {/* content rises out of the blur. The residual filter/transform must be
          cleared once the animation ends — any value other than "none" turns
          this wrapper into a containing block, which would un-fix the fixed
          OfferBar and Nav rendered inside each page's SiteShell. */}
      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transitionEnd: { filter: "none", transform: "none" },
        }}
        transition={{ duration: 0.6, ease }}
      >
        {children}
      </motion.div>
    </>
  );
}
