"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CourseCard from "@/components/lms/CourseCard";
import { useLang } from "@/lib/i18n";
import type { Course } from "@/lib/courses";

// Horizontal course slider — a scroll-snap track with prev/next arrows and
// page dots. Reads real scroll position (rAF-throttled) so it stays smooth
// and the dots track the swipe direction honestly at any viewport.
export default function FreeCoursesSlider({ courses }: { courses: Course[] }) {
  const { t } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const p = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05));
    setPages(p);
    setPage(Math.min(p - 1, Math.round(el.scrollLeft / el.clientWidth)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    // rAF-throttle the scroll handler so the dots update without jank
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        setPage(Math.round(el.scrollLeft / el.clientWidth));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [sync]);

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

  const arrowBase =
    "grid h-12 w-12 place-items-center rounded-full border border-line/20 bg-ink-900/80 text-lg text-bone-50 backdrop-blur-xl transition-all duration-300 hover:border-mint/60 hover:text-mint disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <div className="relative mt-14">
      {/* desktop arrows */}
      <button
        type="button"
        aria-label="Previous"
        onClick={() => go(-1)}
        disabled={atStart}
        className={`absolute -left-5 top-[42%] z-20 hidden md:grid ${arrowBase}`}
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => go(1)}
        disabled={atEnd}
        className={`absolute -right-5 top-[42%] z-20 hidden md:grid ${arrowBase}`}
      >
        →
      </button>

      {/* track — pt leaves room for the FREE badge so it isn't clipped by
          the horizontal scroll container */}
      <div
        ref={trackRef}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-3 pt-5"
      >
        {courses.map((c, i) => (
          <div
            key={c.slug}
            className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <div className="group/card relative h-full transition-transform duration-300 hover:-translate-y-1">
              <span className="absolute -top-3 right-4 z-10 rotate-[3deg] rounded-full bg-mint px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-[0_6px_24px_rgb(var(--mint)/0.45)]">
                {t.common.free} ✦
              </span>
              <CourseCard course={c} eager={i < 3} />
            </div>
          </div>
        ))}
      </div>

      {/* controls: mobile arrows + directional dots */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          disabled={atStart}
          className="grid h-9 w-9 place-items-center rounded-full border border-line/20 text-bone-50 transition-colors hover:border-mint/60 hover:text-mint disabled:opacity-30 md:hidden"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === page}
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
          className="grid h-9 w-9 place-items-center rounded-full border border-line/20 text-bone-50 transition-colors hover:border-mint/60 hover:text-mint disabled:opacity-30 md:hidden"
        >
          →
        </button>
      </div>
    </div>
  );
}
