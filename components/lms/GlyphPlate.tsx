"use client";

import { Media } from "@/components/ui/Media";
import type { Course } from "@/lib/courses";

// The signature course cover: a typographic "tool plate". No stock imagery —
// a huge Fraunces italic glyph over charcoal, a molten-amber ember bleeding in
// from below, and the course's real client work ghosted behind as texture.
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
      {/* ghosted real work as texture */}
      <Media
        src={course.cover}
        alt={`Real client work produced with the ${course.short.en} workflow`}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        priority={eager}
        className="object-cover opacity-[0.16] saturate-0 transition-all duration-700 ease-cinema group-hover/plate:scale-105 group-hover/plate:opacity-25 group-hover/plate:saturate-100"
      />
      {/* ember */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-70 transition-opacity duration-700 group-hover/plate:opacity-100"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 110%, rgb(var(--mint) / 0.28) 0%, rgb(var(--mint) / 0.08) 38%, transparent 70%)",
        }}
      />
      {/* hairline frame */}
      <div aria-hidden className="absolute inset-3 rounded-xl border border-line/10" />

      {/* editorial index */}
      <span className="absolute left-6 top-5 text-xs uppercase tracking-ultra text-bone-400">
        {course.index}
      </span>
      <span className="absolute right-6 top-5 font-serif text-sm italic text-mint/80">
        Method
      </span>

      {/* the glyph */}
      <div className="absolute inset-0 grid place-items-center">
        <span
          dir="ltr"
          className="select-none font-serif text-[clamp(5rem,42cqw,11rem)] italic leading-none text-bone-50 transition-transform duration-700 ease-cinema [text-shadow:0_0_80px_rgb(var(--mint)/0.35)] group-hover/plate:-translate-y-2"
        >
          {course.glyph}
        </span>
      </div>
    </div>
  );
}
