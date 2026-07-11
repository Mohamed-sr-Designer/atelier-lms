"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import GlyphPlate from "@/components/lms/GlyphPlate";
import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { useStudio, findDraft, draftToCourse } from "@/lib/studio";
import { fmtDuration, fmtPrice, lessonCount, totalMinutes } from "@/lib/courses";

// Live preview page for a studio-created (draft) course. Static export can't
// mint a new route per draft, so every draft renders through this one page
// via ?slug=. It reads the draft client-side and shows a real course spread.
export default function DraftPreviewView() {
  const { t, lang } = useLang();
  const params = useSearchParams();
  const studio = useStudio();
  const slug = params.get("slug") || "";
  const draft = findDraft(studio, slug);

  if (!draft) {
    return (
      <section className="container-edge mx-auto max-w-edge pb-24 pt-44 text-center">
        <p className="font-serif text-2xl italic text-bone-200">
          This course doesn&apos;t exist in this browser.
        </p>
        <Link href="/courses/" className="btn btn-primary mt-8 px-7 py-3.5">
          {t.notFound.courses} →
        </Link>
      </section>
    );
  }

  const course = draftToCourse(draft);
  const mins = totalMinutes(course);
  const lessons = lessonCount(course);
  const enrollMsg = encodeURIComponent(
    `Hi Mohamed — I'd like to enroll in "${course.title.en}" (${fmtPrice(course.price, "en")}).`
  );

  return (
    <>
      {/* hero */}
      <section className="bg-grid relative overflow-hidden pb-16 pt-32 md:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 10% 110%, rgb(var(--mint) / 0.12) 0%, transparent 65%)",
          }}
        />
        <div className="container-edge relative mx-auto grid max-w-edge gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <nav className="flex items-center gap-2 text-xs uppercase tracking-ultra text-bone-500">
                <Link href="/courses/" className="hover:text-mint">
                  {t.course.breadcrumbCourses}
                </Link>
                <span>/</span>
                <span className="text-bone-300">{course.short[lang]}</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]">
                  {t.admin.draftBadge}
                </span>
              </nav>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
                {course.title[lang]}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl font-serif text-lg italic text-mint md:text-xl">
                {course.tagline[lang]}
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-xs uppercase tracking-ultra text-bone-500">
                <span dir="ltr">{fmtDuration(mins, lang)}</span>
                <span>
                  {lessons} {t.common.lessons}
                </span>
                <span>
                  {course.modules.length} {t.common.modules}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <a
                  href={`https://wa.me/${site.whatsapp}?text=${enrollMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary px-8 py-4"
                >
                  {course.price === 0 ? t.common.enrollFree : t.common.enroll}
                </a>
                <p dir="ltr">
                  {course.compareAt ? (
                    <span className="me-2 text-bone-500 line-through">
                      {fmtPrice(course.compareAt, lang)}
                    </span>
                  ) : null}
                  <span className="text-grad font-display text-3xl font-bold">
                    {fmtPrice(course.price, lang)}
                  </span>
                </p>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div style={{ containerType: "inline-size" }}>
                <GlyphPlate course={course} eager className="aspect-[4/3] shadow-2xl shadow-black/50" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* curriculum */}
      <section className="container-edge mx-auto max-w-edge py-16 md:py-24">
        <Reveal>
          <SectionLabel index="01">{t.course.curriculumLabel}</SectionLabel>
        </Reveal>
        <div className="mt-8 space-y-4">
          {course.modules.map((m) => (
            <Reveal key={m.n}>
              <div className="rounded-2xl border border-line/10 bg-ink-800/50 p-5 md:p-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-lg italic text-mint">{m.n}</span>
                  <h3 className="text-lg font-semibold tracking-tight text-bone-50">{m.t}</h3>
                  <span className="ml-auto text-xs text-bone-500" dir="ltr">
                    {m.lessons.reduce((n, l) => n + l.dur, 0)}m
                  </span>
                </div>
                {m.lessons.length > 0 && (
                  <ul className="mt-4 divide-y divide-line/10">
                    {m.lessons.map((l) => (
                      <li key={l.id} className="flex items-center gap-3 py-2.5 text-sm text-bone-300">
                        <span className="text-mint">▶</span>
                        <span className="grow">{l.t}</span>
                        <span className="shrink-0 text-xs text-bone-500" dir="ltr">
                          {l.dur}m
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
