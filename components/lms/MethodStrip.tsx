"use client";

import { motion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";

// The method, compressed to one breath: five beats on a single gradient wire,
// each holding a real artifact from the instructor's AI production work.
const media: (
  | { type: "img"; src: string; alt: string }
  | { type: "video"; src: string; alt: string }
)[] = [
  { type: "img", src: "/work/axia/p1.webp", alt: "Learn — AI photoshoot frame from the AXIA campaign" },
  { type: "img", src: "/work/secure/03.webp", alt: "Practice — cinematic AI still" },
  { type: "video", src: "/lms/reels/reel-d.mp4", alt: "Project — AI-generated brand reel" },
  { type: "img", src: "/work/tilal/04.webp", alt: "Checkpoint — Tilal AI film frame" },
  { type: "video", src: "/lms/reels/coffee-ad.mp4", alt: "Ship — finished AI commercial" },
];

export default function MethodStrip() {
  const { t } = useLang();

  return (
    <div className="relative mt-14">
      {/* the wire — draws itself in */}
      <div aria-hidden className="absolute left-0 right-0 top-[4.5rem] hidden h-px bg-line/10 md:block">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full origin-left bg-gradient-to-r from-mint via-mint to-electric shadow-[0_0_14px_rgb(var(--mint)/0.5)]"
        />
      </div>

      <ol className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
        {t.home.path.map((s, i) => (
          <motion.li
            key={s.t}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            className="group w-64 shrink-0 snap-start md:w-auto"
          >
            <p className="text-grad font-display text-4xl font-bold tracking-tightest md:text-5xl">
              {String(i + 1).padStart(2, "0")}
            </p>
            {/* node on the wire */}
            <div aria-hidden className="relative mt-3 hidden h-4 items-center md:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-mint shadow-[0_0_12px_rgb(var(--mint)/0.8)] transition-transform duration-300 group-hover:scale-150" />
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-bone-50 md:text-2xl">
              {s.t}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-bone-400">{s.d}</p>
            <motion.div
              whileHover={{ rotate: i % 2 === 0 ? -2 : 2, y: -4 }}
              className="relative mt-4 overflow-hidden rounded-xl border border-line/10 transition-colors duration-300 group-hover:border-mint/40"
            >
              <div className="aspect-video">
                {media[i].type === "img" ? (
                  <Media
                    src={media[i].src}
                    alt={media[i].alt}
                    fill
                    sizes="256px"
                    className="object-cover saturate-[0.7] transition-all duration-500 group-hover:saturate-100"
                  />
                ) : (
                  <video
                    src={withBase(media[i].src)}
                    aria-label={media[i].alt}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                )}
              </div>
            </motion.div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
