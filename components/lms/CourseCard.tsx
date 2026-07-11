"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { useLiveCourse } from "@/lib/studio";
import {
  fmtDuration,
  fmtPrice,
  lessonCount,
  totalMinutes,
  type Course,
} from "@/lib/courses";
import GlyphPlate from "./GlyphPlate";

export default function CourseCard({
  course: courseStatic,
  eager = false,
  popular = false,
  href,
  live = true,
}: {
  course: Course;
  eager?: boolean;
  popular?: boolean;
  href?: string; // override link target (drafts point at /preview/)
  live?: boolean; // apply studio overrides (off for drafts, already live)
}) {
  const { t, lang } = useLang();
  const liveCourse = useLiveCourse(courseStatic);
  const course = live ? liveCourse : courseStatic; // studio edits apply live
  const mins = totalMinutes(course);

  return (
    <Link
      href={href ?? `/courses/${course.slug}/`}
      className="group block h-full"
      aria-label={course.title[lang]}
    >
      <article className="flex h-full flex-col">
        <div className="relative [container-type:inline-size]">
          <GlyphPlate course={course} eager={eager} className="aspect-[4/3]" />
          {popular && (
            <span className="absolute right-4 top-4 rounded-full bg-electric px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-900 shadow-[0_6px_20px_rgb(var(--electric)/0.45)]">
              ★ {t.catalog.popular}
            </span>
          )}
          {/* price chip — the offer must read from across the room */}
          <span
            className={`absolute bottom-4 left-4 rounded-full px-4 py-2 text-sm font-bold backdrop-blur-md transition-transform duration-300 group-hover:scale-105 ${
              course.price === 0
                ? "text-white shadow-[0_6px_24px_rgb(var(--mint)/0.5)] [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]"
                : "bg-ink-900/85 text-bone-50 ring-1 ring-mint/40"
            }`}
          >
            {course.price === 0 ? `✦ ${fmtPrice(0, lang)}` : fmtPrice(course.price, lang)}
            {course.compareAt ? (
              <span className="ml-1.5 text-xs font-medium text-bone-500 line-through">
                {course.compareAt.toLocaleString("en-US")}
              </span>
            ) : null}
          </span>
        </div>

        <div className="flex grow flex-col pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-bone-50 transition-colors duration-300 group-hover:text-mint md:text-2xl">
              {course.short[lang]}
            </h3>
            <span className="shrink-0 text-xs uppercase tracking-ultra text-bone-500">
              {fmtDuration(mins, lang)}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-bone-400">
            {course.tagline[lang]}
          </p>
          <div className="mt-4 flex items-center gap-4 border-t border-line/10 pt-4 text-xs text-bone-500">
            <span>
              {lessonCount(course)} {t.common.lessons}
            </span>
            <span aria-hidden>·</span>
            <span>
              {course.modules.length} {t.common.modules}
            </span>
            <span aria-hidden>·</span>
            <span className="text-electric">
              ★ {course.rating.toFixed(1)}
            </span>
            <span className="ml-auto text-mint opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ltr:-translate-x-2 rtl:ml-0 rtl:mr-auto rtl:translate-x-2">
              {t.common.viewCourse} →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
