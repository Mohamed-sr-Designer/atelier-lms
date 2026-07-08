"use client";

import { useRef } from "react";

// Horizontal scroll-snap slider with ‹ › arrows. Children are the slides
// (each should be shrink-0 with a width class + snap-start).
export function Carousel({
  children,
  className = "",
  ariaLabel = "Slider",
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line/20 bg-ink-900/70 text-bone-50 backdrop-blur-md transition-colors duration-300 hover:border-mint/60 hover:text-mint";

  return (
    <div className="relative" aria-label={ariaLabel} role="region">
      <div
        ref={ref}
        className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Previous"
        className={`${arrow} left-2 md:left-3`}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Next"
        className={`${arrow} right-2 md:right-3`}
      >
        ›
      </button>
    </div>
  );
}
