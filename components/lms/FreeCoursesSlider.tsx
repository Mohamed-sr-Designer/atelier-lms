"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "@/components/lms/CourseCard";
import { useLang } from "@/lib/i18n";
import type { Course } from "@/lib/courses";

// Horizontal course slider — a scroll-snap track with prev/next arrows and
// page dots. Works off real scroll position so the dots stay honest at any
// viewport (1 card on mobile, 2 on tablet, 3 on desktop).
export default function FreeCoursesSlider({ courses }: { courses: Course[] }) {
  const { t } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const p = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05));
    setPages(p);
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    const onScroll = () =>
      setPage(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };
  const toPage = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const atStart = page <= 0;
  const atEnd = page >= pages - 1;

  return (
    <div className="relative mt-14">
      {/* arrows (desktop) */}
      <button
        type="button"
        aria-label="Previous"
        onClick={() => go(-1)}
        disabled={atStart}
        className={`absolute -left-5 top-[38%] z-20 hidden h-12 w-12 place-items-center rounded-full border border-line/20 bg-ink-900/80 text-bone-50 backdrop-blur-xl transition-all duration-300 hover:border-mint/60 hover:text-mint md:grid ${
          atStart ? "cursor-not-allowed opacity-30" : "opacity-100"
        }`}
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => go(1)}
        disabled={atEnd}
        className={`absolute -right-5 top-[38%] z-20 hidden h-12 w-12 place-items-center rounded-full border border-line/20 bg-ink-900/80 text-bone-50 backdrop-blur-xl transition-all duration-300 hover:border-mint/60 hover:text-mint md:grid ${
          atEnd ? "cursor-not-allowed opacity-30" : "opacity-100"
        }`}
      >
        →
      </button>

      {/* track */}
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {courses.map((c, i) => (
          <div
            key={c.slug}
            className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -4 }}
              className="relative h-full"
            >
              <span className="absolute -top-3.5 right-4 z-10 rotate-[3deg] rounded-full bg-mint px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-[0_6px_24px_rgb(var(--mint)/0.45)]">
                {t.common.free} ✦
              </span>
              <CourseCard course={c} eager={i < 3} />
            </motion.div>
          </div>
        ))}
      </div>

      {/* controls row: mobile arrows + dots */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          disabled={atStart}
          className={`grid h-9 w-9 place-items-center rounded-full border border-line/20 text-bone-50 transition-colors hover:border-mint/60 hover:text-mint md:hidden ${
            atStart ? "opacity-30" : ""
          }`}
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => toPage(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === page
                  ? "w-7 [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]"
                  : "w-2 bg-line/30 hover:bg-line/50"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          disabled={atEnd}
          className={`grid h-9 w-9 place-items-center rounded-full border border-line/20 text-bone-50 transition-colors hover:border-mint/60 hover:text-mint md:hidden ${
            atEnd ? "opacity-30" : ""
          }`}
        >
          →
        </button>
      </div>
    </div>
  );
}
