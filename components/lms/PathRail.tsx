"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";

// "The method" — connected scroll storytelling with worked examples. A royal
// filament fills as you pass the five stations (Learn → Practice → Project →
// Checkpoint → Ship). Each station ignites when reached and shows a real
// artifact from the instructor's AI production work on the opposite side.
const media: (
  | { type: "img"; src: string; alt: string }
  | { type: "video"; src: string; alt: string }
)[] = [
  { type: "img", src: "/work/axia/p1.webp", alt: "Lesson artifact — AI photoshoot frame from the AXIA campaign" },
  { type: "img", src: "/work/secure/03.webp", alt: "Practice artifact — cinematic AI still from a security brand film" },
  { type: "video", src: "/lms/reels/reel-d.mp4", alt: "Project example — AI-generated brand reel" },
  { type: "img", src: "/work/tilal/04.webp", alt: "Checkpoint artifact — Tilal AI film frame" },
  { type: "video", src: "/lms/reels/coffee-ad.mp4", alt: "Shipped example — finished AI coffee commercial" },
];

function StationMedia({ m, active }: { m: (typeof media)[number]; active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`relative mt-6 w-full max-w-sm overflow-hidden rounded-xl border transition-all duration-700 md:mt-0 ${
        active ? "border-mint/40 shadow-[0_20px_60px_rgb(var(--mint)/0.18)]" : "border-line/10"
      }`}
    >
      <div className="aspect-video">
        {m.type === "img" ? (
          <Media src={m.src} alt={m.alt} fill sizes="384px" className="object-cover" />
        ) : (
          <video
            src={withBase(m.src)}
            aria-label={m.alt}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
      </div>
      <span className="absolute bottom-3 rounded-full bg-ink-900/75 px-3 py-1 text-[10px] uppercase tracking-widest text-bone-200 backdrop-blur ltr:left-3 rtl:right-3">
        {m.type === "video" ? "▶ AI production" : "✦ Real artifact"}
      </span>
    </motion.div>
  );
}

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
    <li ref={ref} className="relative md:grid md:grid-cols-2 md:items-start md:gap-28">
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

      {/* text block */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`ps-12 md:ps-0 ${
          side === "start"
            ? "md:order-1 md:pe-14 md:text-end"
            : "md:order-2 md:ps-14"
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
        <p
          className={`mt-3 max-w-md text-pretty text-sm leading-relaxed text-bone-400 md:text-base ${
            side === "start" ? "md:ms-auto" : ""
          }`}
        >
          {s.d}
        </p>
      </motion.div>

      {/* worked example on the opposite side */}
      <div
        className={`ps-12 md:flex md:ps-0 ${
          side === "start"
            ? "md:order-2 md:justify-start md:ps-14"
            : "md:order-1 md:justify-end md:pe-14"
        }`}
      >
        <StationMedia m={media[i]} active={active} />
      </div>
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
      {/* live progress readout */}
      <div className="pointer-events-none sticky top-24 z-10 mb-10 hidden justify-end md:flex">
        <div className="flex items-center gap-3 rounded-full border border-line/15 bg-ink-900/80 px-4 py-2 backdrop-blur">
          <span className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-600">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-mint to-electric transition-[width] duration-150"
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
          className="w-full origin-top bg-gradient-to-b from-mint to-electric shadow-[0_0_18px_rgb(var(--mint)/0.6)]"
          style={{ scaleY: fill, height: "100%" }}
        />
      </div>

      <ol className="grid gap-16 md:gap-28">
        {t.home.path.map((s, i) => (
          <Station key={s.t} s={s} i={i} side={i % 2 === 0 ? "start" : "end"} />
        ))}
      </ol>
    </div>
  );
}
