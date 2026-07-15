"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "@/lib/i18n";

// The method as a pure typographic journey — no photos, no clips. A gradient
// spine draws itself with the reader's scroll; each beat is an oversized
// ghost numeral, a glass node pulsing on the line, and one hard sentence.
export default function MethodStrip() {
  const { t } = useLang();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 65%"],
  });
  const spine = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <ol ref={ref} className="relative mt-14">
      {/* the spine — grows with scroll */}
      <div
        aria-hidden
        className="absolute bottom-6 top-2 w-px bg-line/10 ltr:left-[1.35rem] rtl:right-[1.35rem] md:ltr:left-1/2 md:rtl:right-1/2"
      >
        <motion.div
          style={{ scaleY: spine }}
          className="h-full w-full origin-top bg-gradient-to-b from-mint via-electric to-mint shadow-[0_0_16px_rgb(var(--mint)/0.6)]"
        />
      </div>

      {t.home.path.map((s, i) => {
        const flip = i % 2 === 1; // alternate sides on desktop
        return (
          <motion.li
            key={s.t}
            initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
            whileInView={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transitionEnd: { filter: "none" },
            }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid items-center gap-x-10 py-7 ltr:pl-14 rtl:pr-14 md:grid-cols-2 md:py-9 md:ltr:pl-0 md:rtl:pr-0"
          >
            {/* node on the spine */}
            <span
              aria-hidden
              className="absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center ltr:left-0 rtl:right-0 md:ltr:left-1/2 md:rtl:right-1/2 md:ltr:-translate-x-1/2 md:rtl:translate-x-1/2"
            >
              <span className="glass absolute inset-0 rounded-full" />
              <span className="relative h-2.5 w-2.5 animate-pulse rounded-full bg-mint shadow-[0_0_14px_rgb(var(--mint)/0.9)]" />
            </span>

            {/* beat card */}
            <div
              className={`group relative ${
                flip
                  ? "md:col-start-1 md:ltr:pr-14 md:ltr:text-right md:rtl:pl-14 md:rtl:text-left"
                  : "md:col-start-2 md:ltr:pl-14 md:rtl:pr-14"
              }`}
            >
              {/* ghost numeral behind the copy */}
              <span
                aria-hidden
                className={`text-grad pointer-events-none absolute -top-9 font-display text-8xl font-bold leading-none opacity-[0.13] transition-opacity duration-500 group-hover:opacity-30 md:text-9xl ${
                  flip
                    ? "ltr:right-10 rtl:left-10"
                    : "ltr:left-10 rtl:right-10"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative">
                <p className="font-serif text-sm italic text-mint">
                  {String(i + 1).padStart(2, "0")} / 05
                </p>
                <h3 className="mt-1.5 font-display text-3xl font-semibold tracking-tightest text-bone-50 transition-colors duration-300 group-hover:text-mint md:text-4xl">
                  {s.t}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-bone-400 md:text-base">
                  {s.d}
                </p>
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
