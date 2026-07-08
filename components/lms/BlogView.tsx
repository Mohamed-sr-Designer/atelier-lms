"use client";

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { posts } from "@/lib/blog";

export default function BlogView() {
  const { t, lang } = useLang();

  return (
    <section className="container-edge mx-auto max-w-edge pb-28 pt-32 md:pt-44">
      <Reveal>
        <SectionLabel index="✦">{t.blogUi.kicker}</SectionLabel>
      </Reveal>
      <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal delay={0.05}>
          <h1 className="max-w-2xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
            {t.blogUi.titleA}{" "}
            <span className="font-serif font-normal italic tracking-normal text-mint">
              {t.blogUi.titleI}
            </span>
            {t.blogUi.titleB}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-bone-400">
            {t.blogUi.sub}
          </p>
        </Reveal>
      </div>

      <Stagger className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2">
        {posts.map((p, i) => (
          <StaggerItem key={p.slug} className={i === 0 ? "md:col-span-2" : ""}>
            <Link href={`/blog/${p.slug}/`} className="group block">
              <article className={i === 0 ? "grid gap-8 md:grid-cols-2 md:items-center" : ""}>
                <div className="relative overflow-hidden rounded-2xl border border-line/10">
                  <div className={i === 0 ? "aspect-[16/10]" : "aspect-[16/9]"}>
                    <Media
                      src={p.cover}
                      alt={p.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover saturate-[0.7] transition-all duration-700 ease-cinema group-hover:scale-105 group-hover:saturate-100"
                    />
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-ink-900/80 px-3 py-1.5 text-[11px] text-bone-200 backdrop-blur rtl:left-auto rtl:right-4">
                    {p.tag}
                  </span>
                </div>
                <div className="pt-5">
                  <p className="text-xs text-bone-500">
                    {new Date(p.date).toLocaleDateString(
                      lang === "ar" ? "ar-EG" : "en-GB",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}{" "}
                    · {p.readMins} {t.blogUi.minsRead}
                  </p>
                  <h2
                    className={`mt-3 text-balance font-semibold tracking-tight text-bone-50 transition-colors duration-300 group-hover:text-mint ${
                      i === 0 ? "text-3xl md:text-4xl" : "text-2xl"
                    }`}
                  >
                    {lang === "ar" ? p.titleAr : p.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-bone-400 md:text-base">
                    {lang === "ar" ? p.excerptAr : p.excerpt}
                  </p>
                  <p className="mt-4 text-sm text-mint">
                    {t.blogUi.readMore}
                  </p>
                </div>
              </article>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
