"use client";

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";
import { useStore, enrolledCourses } from "@/lib/store";
import { downloadResource } from "@/lib/download";

export default function DownloadsView() {
  const { t, lang } = useLang();
  const store = useStore();
  const enrolled = enrolledCourses(store);

  return (
    <section className="container-edge mx-auto max-w-edge pb-28 pt-32 md:pt-40">
      <Reveal>
        <SectionLabel index="✦">{t.downloads.kicker}</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
          {t.downloads.title}
          <span className="font-serif font-normal italic tracking-normal text-mint">.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-bone-400">
          {t.downloads.sub}
        </p>
      </Reveal>

      {enrolled.length === 0 ? (
        <Reveal delay={0.15}>
          <div className="mt-14 rounded-2xl border border-dashed border-line/20 p-16 text-center">
            <p className="font-serif text-xl italic text-bone-400">
              {t.downloads.empty}
            </p>
            <Link
              href="/courses/"
              className="btn btn-primary mt-6 px-7 py-3.5"
            >
              {t.dash.browseCta}
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="mt-14 grid gap-12">
          {enrolled.map((c) => (
            <div key={c.slug}>
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="h-2 w-2 rounded-full bg-mint" aria-hidden />
                  <h2 className="text-xl font-semibold tracking-tight text-bone-50 md:text-2xl">
                    {t.downloads.perCourse} {c.short[lang]}
                  </h2>
                </div>
              </Reveal>
              <Stagger className="mt-5 divide-y divide-line/10 border-y border-line/10">
                {c.resources.map((r) => (
                  <StaggerItem key={r.t} className="flex items-center gap-5 py-5">
                    <span className="grid h-11 w-14 shrink-0 place-items-center rounded-lg border border-line/15 text-[10px] font-semibold tracking-widest text-mint">
                      {r.type}
                    </span>
                    <div className="grow">
                      <p className="text-sm font-medium text-bone-50 md:text-base">
                        {r.t}
                      </p>
                      <p className="mt-0.5 text-xs text-bone-500">{r.note}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadResource(c, r)}
                      className="shrink-0 rounded-full border border-line/20 px-5 py-2.5 text-xs text-bone-50 transition-colors hover:border-mint/50 hover:text-mint"
                    >
                      {t.learn.resourceGet} ↓
                    </button>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
