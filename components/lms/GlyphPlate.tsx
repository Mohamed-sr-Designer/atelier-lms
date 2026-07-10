"use client";

import { Media } from "@/components/ui/Media";
import type { Course } from "@/lib/courses";

// Course plate: real work produced with the course's exact workflow, full
// color and front-and-center — no letter abbreviations. A gradient scrim
// grounds the editorial chrome; hover breathes the image and warms the glow.
export default function GlyphPlate({
  course,
  className = "",
  eager = false,
}: {
  course: Course;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div
      className={`group/plate relative overflow-hidden rounded-2xl border border-line/10 bg-ink-800 ${className}`}
    >
      <Media
        src={course.cover}
        alt={`Real client work produced with the ${course.short.en} workflow`}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        priority={eager}
        className="object-cover transition-all duration-700 ease-cinema group-hover/plate:scale-[1.06]"
      />
      {/* scrim + accent glow */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/10 to-ink-900/30"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/plate:opacity-100"
        style={{
          background:
            "linear-gradient(140deg, rgb(var(--mint) / 0.18) 0%, transparent 40%, rgb(var(--electric) / 0.14) 100%)",
        }}
      />
      {/* hairline frame */}
      <div aria-hidden className="absolute inset-3 rounded-xl border border-line/15" />

      {/* editorial chrome */}
      <span className="absolute left-6 top-5 rounded-full bg-ink-900/60 px-2.5 py-1 text-[10px] uppercase tracking-ultra text-bone-200 backdrop-blur">
        {course.index}
      </span>
      <span className="absolute right-6 top-5 font-serif text-sm italic text-bone-50/90 [text-shadow:0_1px_12px_rgb(0_0_0/0.6)]">
        Method
      </span>
    </div>
  );
}
