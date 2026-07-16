"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CourseCard from "@/components/lms/CourseCard";
import type { Course } from "@/lib/courses";

// Horizontal course slider — a scroll-snap track with prev/next arrows and
// page dots. Steps are measured per CARD (width + gap), so the dots and both
// arrows stay honest even when only a fraction of a viewport is scrollable.
// RTL: Chrome reports scrollLeft as 0 → -max there, so all the page math
// runs on |scrollLeft| and programmatic scrolls flip their sign.
export default function FreeCoursesSlider({ courses }: { courses: Course[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  // one card's scroll step (card width + the flex gap)
  const stepOf = (el: HTMLDivElement) => {
    const first = el.children[0] as HTMLElement | undefined;
    const gap = parseFloat(getComputedStyle(el).columnGap || "24") || 24;
    return first ? first.offsetWidth + gap : el.clientWidth;
  };
  const dirSign = (el: HTMLDivElement) =>
    getComputedStyle(el).direction === "rtl" ? -1 : 1;

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const step = stepOf(el);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const count = maxScroll <= 1 ? 1 : Math.max(1, Math.round(maxScroll / step) + 1);
    setPages(count);
    setPage(Math.min(count - 1, Math.round(Math.abs(el.scrollLeft) / step)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        const step = stepOf(el);
        setPage(Math.round(Math.abs(el.scrollLeft) / step));
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
    el.scrollBy({ left: dir * stepOf(el) * dirSign(el), behavior: "smooth" });
  };
  const toPage = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * stepOf(el) * dirSign(el), behavior: "smooth" });
  };

  const atStart = page <= 0;
  const atEnd = page >= pages - 1;

  const arrowBase =
    "grid h-12 w-12 place-items-center rounded-full border border-line/20 bg-ink-900/80 text-lg text-bone-50 backdrop-blur-xl transition-all duration-300 hover:border-mint/60 hover:text-mint disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <div className="relative mt-14">
      {/* track */}
      <div
        ref={trackRef}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-3 pt-2"
      >
        {courses.map((c, i) => (
          <div
            key={c.slug}
            className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <div className="h-full transition-transform duration-300 hover:-translate-y-1">
              <CourseCard course={c} eager={i < 3} />
            </div>
          </div>
        ))}
      </div>

      {/* controls — arrows + dots, centered well below the track */}
      <div className="mt-12 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          disabled={atStart}
          className={arrowBase}
        >
          {/* mirrored in RTL: "back" points toward the start edge */}
          <span className="inline-block rtl:-scale-x-100">←</span>
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
          className={arrowBase}
        >
          <span className="inline-block rtl:-scale-x-100">→</span>
        </button>
      </div>
    </div>
  );
}
