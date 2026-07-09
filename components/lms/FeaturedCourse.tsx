"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import Magnetic from "@/components/ui/Magnetic";
import GlyphPlate from "@/components/lms/GlyphPlate";
import { useLang } from "@/lib/i18n";
import {
  fmtDuration,
  fmtPrice,
  lessonCount,
  totalMinutes,
  type Course,
} from "@/lib/courses";

// The featured drop — a full editorial spread for one course. The plate tilts
// toward the pointer (Apple-card style), the curriculum peeks like a magazine
// index, and the price sits inside the story instead of on a pricing card.
export default function FeaturedCourse({ course }: { course: Course }) {
  const { t, lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  // pointer-tracked tilt
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 140, damping: 18 });
  const rotY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 140, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const mins = totalMinutes(course);

  return (
    <section className="container-edge mx-auto max-w-edge py-24 md:py-36">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Reveal>
          <SectionLabel index="✦">{t.home.featuredLabel}</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="font-serif text-sm italic text-bone-400">
            {t.home.featuredNote}
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid items-center gap-12 lg:grid-cols-12">
        {/* tilting plate */}
        <div className="lg:col-span-6" style={{ perspective: 1200 }}>
          <Reveal>
            <motion.div
              ref={ref}
              onMouseMove={onMove}
              onMouseLeave={reset}
              style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
              className="relative"
            >
              <div style={{ containerType: "inline-size" }}>
                <GlyphPlate course={course} eager className="aspect-[4/3] shadow-2xl shadow-black/50" />
              </div>
              {/* floating price chip, lifted off the plate */}
              <div
                className="absolute -bottom-5 rounded-2xl border border-mint/40 bg-ink-900/90 px-6 py-4 backdrop-blur-xl ltr:-right-4 rtl:-left-4"
                style={{ transform: "translateZ(60px)" }}
                dir="ltr"
              >
                {course.compareAt ? (
                  <p className="text-xs text-bone-500 line-through">
                    {fmtPrice(course.compareAt, lang)}
                  </p>
                ) : null}
                <p className="font-display text-3xl font-semibold text-mint">
                  {fmtPrice(course.price, lang)}
                </p>
              </div>
            </motion.div>
          </Reveal>
        </div>

        {/* editorial column */}
        <div className="lg:col-span-6">
          <Reveal delay={0.08}>
            <h2 className="text-balance font-display text-3xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-5xl">
              {course.title[lang]}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 font-serif text-lg italic leading-snug text-mint md:text-xl">
              {course.tagline[lang]}
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-xs uppercase tracking-ultra text-bone-500">
              <span dir="ltr">{fmtDuration(mins, lang)}</span>
              <span>
                {lessonCount(course)} {t.common.lessons}
              </span>
              <span className="text-electric">★ {course.rating.toFixed(1)}</span>
              <span>
                {course.students.toLocaleString("en-US")}+ {t.common.students}
              </span>
            </div>
          </Reveal>

          {/* module index peek — magazine style */}
          <Reveal delay={0.2}>
            <div className="mt-8 border-t border-line/10">
              {course.modules.slice(0, 4).map((m) => (
                <div
                  key={m.n}
                  className="group flex items-baseline gap-5 border-b border-line/10 py-3.5 transition-colors hover:border-mint/30"
                >
                  <span className="font-display text-xl font-semibold text-bone-500/50 transition-colors group-hover:text-mint">
                    {m.n}
                  </span>
                  <span className="grow text-sm text-bone-200">{m.t}</span>
                  <span className="font-serif text-xs italic text-bone-500" dir="ltr">
                    {m.lessons.reduce((n, l) => n + l.dur, 0)}m
                  </span>
                </div>
              ))}
              <p className="py-3 text-xs text-bone-500">
                + {course.modules.length - 4 > 0 ? course.modules.length - 4 : 0}{" "}
                {t.common.modules} · {t.course.curriculumNote}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href={`/courses/${course.slug}/`}
                  className="inline-block rounded-full bg-mint px-8 py-4 text-sm font-semibold text-ink-900 transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                >
                  {t.home.featuredCta}
                </Link>
              </Magnetic>
              <Link href="/courses/" className="link-underline text-sm text-bone-300">
                {t.home.featuredBrowse} →
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
