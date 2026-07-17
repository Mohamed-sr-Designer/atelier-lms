"use client";

import { Media } from "@/components/ui/Media";
import { withBase } from "@/lib/base";
import type { Course } from "@/lib/courses";

// Course plate, three flavors:
//  1. coverVideo  → muted looping footage (AI Video)
//  2. icon/plate  → official app icon on its brand gradient (software courses)
//  3. cover image → real client work (AI Photoshoot)
export default function GlyphPlate({
  course,
  className = "",
  eager = false,
}: {
  course: Course;
  className?: string;
  eager?: boolean;
}) {
  const brand = course.plate;

  return (
    <div
      className={`group/plate relative overflow-hidden rounded-2xl border border-line/10 bg-ink-800 ${className}`}
    >
      {course.coverVideo ? (
        <video
          src={withBase(course.coverVideo)}
          poster={withBase(course.cover)}
          aria-label={`AI-generated footage — made with the ${course.short.en} workflow`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-cinema group-hover/plate:scale-[1.05]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : brand ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-700 ease-cinema group-hover/plate:scale-[1.06]"
            style={{
              background: `linear-gradient(135deg, ${brand[0]} 0%, ${brand[0]} 35%, ${brand[1]} 130%)`,
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(90% 90% at 85% 110%, ${brand[1]}55 0%, transparent 60%)`,
            }}
          />
          <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.06]" />
          <div className="absolute inset-0 grid place-items-center">
            {course.icon ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={withBase(course.icon)}
                alt={`${course.short.en} app icon`}
                className="w-[38%] max-w-[9rem] rounded-[22%] drop-shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-cinema group-hover/plate:-translate-y-1.5 group-hover/plate:scale-105"
              />
            ) : (
              /* drawn Adobe-style tile for apps without an icon asset —
                 solid fill + thin brand border + letters, like the real ones */
              <span
                className="grid aspect-square w-[38%] max-w-[9rem] place-items-center rounded-[22%] border-2 font-sans text-4xl font-bold drop-shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-cinema group-hover/plate:-translate-y-1.5 group-hover/plate:scale-105 md:text-5xl"
                style={{ borderColor: brand[1], color: brand[1], background: brand[0] }}
              >
                {course.tileText}
              </span>
            )}
          </div>
        </>
      ) : (
        <Media
          src={course.cover}
          alt={`Real client work produced with the ${course.short.en} workflow`}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          priority={eager}
          className="object-cover transition-all duration-700 ease-cinema group-hover/plate:scale-[1.06]"
        />
      )}

      {/* scrim + accent glow */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-ink-900/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/plate:opacity-100"
        style={{
          background:
            "linear-gradient(140deg, rgb(var(--mint) / 0.14) 0%, transparent 45%, rgb(var(--electric) / 0.12) 100%)",
        }}
      />
      {/* hairline frame */}
      <div aria-hidden className="absolute inset-3 rounded-xl border border-line/15" />

    </div>
  );
}
