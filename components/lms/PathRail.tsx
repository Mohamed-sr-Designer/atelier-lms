"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useLang } from "@/lib/i18n";

// "The method" — connected scroll storytelling. A molten-amber filament fills
// as you pass the five stations (Learn → Practice → Project → Checkpoint →
// Ship); each station ignites as the filament reaches it, and a live progress
// readout mirrors how course progress feels inside the platform.
function Station({
  s,
  i,
  side,
}: {
  s: { t: string; d: string };
  i: number;
  side: "start" | "end";
}) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, { margin: "0px 0px -45% 0px" });

  return (
    <li ref={ref} className="relative">
      {/* node — ignites when reached */}
      <span
        aria-hidden
        className={`absolute top-1.5 grid h-[27px] w-[27px] place-items-center rounded-full border bg-ink-900 transition-all duration-500 ltr:left-0 rtl:right-0 md:ltr:left-1/2 md:ltr:-translate-x-1/2 md:rtl:right-1/2 md:rtl:translate-x-1/2 ${
          active
            ? "border-mint shadow-[0_0_24px_rgb(var(--mint)/0.6)]"
            : "border-line/20"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full transition-all duration-500 ${
            active ? "scale-100 bg-mint" : "scale-50 bg-bone-500/40"
          }`}
        />
      </span>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`ps-12 md:w-[calc(50%-3.5rem)] md:ps-0 ${
          side === "start"
            ? "md:ltr:mr-auto md:ltr:text-right md:rtl:ml-auto md:rtl:text-left"
            : "md:ltr:ml-auto md:rtl:mr-auto"
        }`}
      >
        <p
          className={`font-serif text-sm italic transition-colors duration-500 ${
            active ? "text-mint" : "text-bone-500"
          }`}
        >
          {String(i + 1).padStart(2, "0")} — {Math.round(((i + 1) / 5) * 100)}%
        </p>
        <h3
          className={`mt-2 text-2xl font-semibold tracking-tight transition-colors duration-500 md:text-4xl ${
            active ? "text-bone-50" : "text-bone-500/70"
          }`}
        >
          {s.t}
        </h3>
        <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-bone-400 md:text-base ltr:md:ml-auto rtl:md:mr-auto">
          {s.d}
        </p>
      </motion.div>
    </li>
  );
}

export default function PathRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const [pct, setPct] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.6"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  useMotionValueEvent(fill, "change", (v) =>
    setPct(Math.min(100, Math.max(0, Math.round(v * 100))))
  );

  return (
    <div ref={ref} className="relative mt-16 md:mt-24">
      {/* live progress readout — pinned beside the rail on desktop */}
      <div className="pointer-events-none sticky top-24 z-10 mb-10 hidden justify-end md:flex">
        <div className="flex items-center gap-3 rounded-full border border-line/15 bg-ink-900/80 px-4 py-2 backdrop-blur">
          <span className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-600">
            <span
              className="block h-full rounded-full bg-mint transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
          </span>
          <span className="font-display text-sm font-semibold tabular-nums text-bone-50" dir="ltr">
            {pct}%
          </span>
        </div>
      </div>

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

      <ol className="grid gap-14 md:gap-28">
        {t.home.path.map((s, i) => (
          <Station key={s.t} s={s} i={i} side={i % 2 === 0 ? "start" : "end"} />
        ))}
      </ol>
    </div>
  );
}
