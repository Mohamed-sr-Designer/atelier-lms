"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";

// "The method" — sticky scroll storytelling. A molten-amber filament fills as
// you scroll past the five stations of every Atelier course: Learn → Practice
// → Project → Checkpoint → Certificate.
export default function PathRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.6"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <div ref={ref} className="relative mt-16 md:mt-20">
      {/* filament */}
      <div
        aria-hidden
        className="absolute bottom-0 top-0 w-px bg-line/10 ltr:left-[13px] rtl:right-[13px] md:ltr:left-1/2 md:rtl:right-1/2"
      >
        <motion.div
          className="w-full origin-top bg-mint shadow-[0_0_18px_rgb(var(--mint)/0.6)]"
          style={{ scaleY: fill, height: "100%" }}
        />
      </div>

      <ol className="grid gap-14 md:gap-24">
        {t.home.path.map((s, i) => {
          const left = i % 2 === 0; // desktop alternation
          return (
            <li key={s.t} className="relative">
              {/* node */}
              <span
                aria-hidden
                className="absolute top-1.5 grid h-[27px] w-[27px] place-items-center rounded-full border border-mint/40 bg-ink-900 ltr:left-0 rtl:right-0 md:ltr:left-1/2 md:ltr:-translate-x-1/2 md:rtl:right-1/2 md:rtl:translate-x-1/2"
              >
                <span className="h-2 w-2 rounded-full bg-mint" />
              </span>
              <Reveal
                className={`ps-12 md:w-[calc(50%-3.5rem)] md:ps-0 ${
                  left
                    ? "md:ltr:mr-auto md:ltr:text-right md:rtl:ml-auto md:rtl:text-left"
                    : "md:ltr:ml-auto md:rtl:mr-auto"
                }`}
              >
                <p className="font-serif text-sm italic text-mint">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-bone-50 md:text-4xl">
                  {s.t}
                </h3>
                <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-bone-400 md:text-base ltr:md:ml-auto rtl:md:mr-auto">
                  {s.d}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
