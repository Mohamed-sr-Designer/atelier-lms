"use client";

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import Magnetic from "@/components/ui/Magnetic";
import LogoMarquee from "@/components/LogoMarquee";
import Counter from "@/components/lms/Counter";
import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { withBase } from "@/lib/base";
import { stats } from "@/lib/courses";

// Authority page: the working record behind the school. Proper nouns stay as
// they are — the chrome is bilingual via dict.
const academies = [
  {
    name: "SOIC — School of Cinema",
    logo: "/lms/academies/soic.jpg",
    role: "Design & AI Production Instructor",
    desc: "Cinema-focused design education: visual storytelling, key art and AI production for film students.",
    now: true,
  },
  {
    name: "EDUX Academy",
    logo: "/lms/academies/edux.jpg",
    role: "Graphic Design Instructor",
    desc: "Graphic design tracks taking students from fundamentals to portfolio-ready execution.",
    now: true,
  },
  {
    name: "Teaching Planet Academy",
    logo: "/lms/academies/teaching.jpg",
    role: "Designer & Instructor",
    desc: "Applied design programs where course material was built from live client briefs.",
  },
  {
    name: "Raya Academy",
    logo: "/lms/academies/raya.jpg",
    role: "Design Instructor",
    desc: "Corporate-backed training with a focus on production speed and professional workflow.",
  },
];

const ladder = [
  {
    co: "Osolutions — Makkah, KSA",
    logos: ["/lms/companies/osolutions.jpg"],
    role: "Art Team Lead",
    note: "Leading brand, campaign and motion output for regional clients.",
    now: true,
  },
  {
    co: "Bundle IMS — Kuwait",
    logos: ["/lms/companies/bundle.jpg"],
    role: "Senior Designer, Automotive & BTL",
    note: "Key visuals and campaign systems for Rolls-Royce, Geely, GWM and AlGhanim.",
  },
  {
    co: "JUMPPEAK — Medical",
    logos: ["/lms/companies/jumppeak.jpg"],
    role: "Senior Designer",
    note: "Brand, campaign and content systems for a medical brand.",
  },
  {
    co: "Pala De 7 · Flowrista · Prepd",
    logos: [
      "/lms/companies/pala7.jpg",
      "/lms/companies/flowrista.jpg",
      "/lms/companies/prepd.jpg",
    ],
    role: "Designer & Freelance Art Direction",
    note: "Identity, retail and campaign work across sport, floral and food-tech.",
  },
];

const workGallery = [
  { src: "/lms/featured-banner.jpg", alt: "AXIA banner — AI photoshoot campaign" },
  { src: "/work/tilal/hero.webp", alt: "Tilal AI film — hero frame" },
  { src: "/work/secure/hero.webp", alt: "Security brand film — cinematic AI still" },
  { src: "/lms/winback.jpg", alt: "WINBACK campaign — AI production visual" },
];

export default function InstructorView() {
  const { t } = useLang();

  return (
    <>
      {/* hero — full-screen cinematic portrait */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBase("/lms/hero-landscape.jpg")}
          alt="Mohamed Tarek — art director, standing in his spotlit studio library"
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/35 to-ink-900/40" />
        <div aria-hidden className="vignette absolute inset-0" />
        <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.07]" />

        <div className="container-edge relative z-10 mx-auto w-full max-w-edge pb-14 pt-40">
          <Reveal>
            <SectionLabel index="✦">{t.home.instructorLabel}</SectionLabel>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.95] tracking-tightest text-bone-50 [text-shadow:0_2px_30px_rgb(0_0_0/0.5)] md:text-9xl">
              Mohamed{" "}
              <span className="text-grad font-serif font-normal italic tracking-normal">
                Tarek
              </span>
            </h1>
          </Reveal>
          <div className="mt-7 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <Reveal delay={0.12}>
                <p className="text-lg text-bone-200 md:text-xl">
                  {site.instructorRole} —{" "}
                  <span className="text-bone-400">{site.markets}</span>
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-4 text-pretty text-base leading-relaxed text-bone-300">
                  {t.home.instructorBio}
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.22}>
              <div className="flex shrink-0 flex-wrap gap-4">
                <Magnetic>
                  <Link href="/courses/" className="btn btn-primary px-8 py-4">
                    {t.home.ctaSecondary} →
                  </Link>
                </Magnetic>
                <Magnetic>
                  <a
                    href={`https://wa.me/${site.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost px-8 py-4"
                  >
                    {t.contact.waCta}
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* record */}
      <section className="border-y border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto max-w-edge py-16 md:py-20">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 sm:grid-cols-3">
            {[
              { n: stats.graduates, p: "+", s: "", l: t.home.stats.graduates, live: true },
              { n: stats.academies, p: "", s: "", l: t.home.stats.academies, live: false },
              { n: stats.totalLessons, p: "", s: "", l: t.home.stats.lessons, live: false },
            ].map((x) => (
              <div key={x.l} className="bg-ink-900 p-8 text-center">
                <p className="font-display text-4xl font-semibold text-bone-50 md:text-5xl">
                  <Counter value={x.n} prefix={x.p} suffix={x.s} />
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-ultra text-bone-500">
                  {x.l}
                  {x.live ? (
                    <span className="ml-2 inline-flex items-center gap-1 text-mint">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
                      still counting
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* academies */}
      <section className="container-edge mx-auto max-w-edge py-20 md:py-28">
        <Reveal>
          <SectionLabel index="01">Where he teaches</SectionLabel>
        </Reveal>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
          {academies.map((a) => (
            <StaggerItem
              key={a.name}
              className="flex h-full flex-col gap-3 rounded-xl border border-line/10 bg-ink-800/60 p-7 transition-colors duration-300 hover:border-mint/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <Media
                    src={a.logo}
                    alt={`${a.name} logo`}
                    sizes="56px"
                    className="h-14 w-14 shrink-0 rounded-xl border border-line/15 object-cover"
                  />
                  <h3 className="text-xl font-semibold tracking-tight text-bone-50 md:text-2xl">
                    {a.name}
                  </h3>
                </div>
                {a.now ? (
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-mint/30 bg-mint/5 px-3 py-1 text-xs text-mint">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                    Now
                  </span>
                ) : null}
              </div>
              <p className="text-xs uppercase tracking-ultra text-bone-400">
                {a.role}
              </p>
              <p className="text-pretty text-sm leading-relaxed text-bone-400">
                {a.desc}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* career ladder */}
      <section className="border-y border-line/10 bg-ink-800/40">
        <div className="container-edge mx-auto max-w-edge py-20 md:py-28">
          <Reveal>
            <SectionLabel index="02">The desk behind the lessons</SectionLabel>
          </Reveal>
          <div className="mt-10 border-t border-line/10">
            {ladder.map((x, i) => (
              <Reveal key={x.co}>
                <div className="grid gap-3 border-b border-line/10 py-7 md:grid-cols-12 md:items-center">
                  <p className="font-serif text-sm italic text-mint md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div className="md:col-span-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex -space-x-2">
                        {x.logos.map((l) => (
                          <Media
                            key={l}
                            src={l}
                            alt={`${x.co} logo`}
                            sizes="44px"
                            className="h-11 w-11 rounded-full border-2 border-ink-900 object-cover"
                          />
                        ))}
                      </span>
                      <p className="flex flex-wrap items-center gap-3 text-lg font-semibold tracking-tight text-bone-50">
                        {x.co}
                        {x.now && (
                          <span className="rounded-full border border-mint/30 bg-mint/5 px-2.5 py-0.5 text-[10px] text-mint">
                            Now
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-bone-300 md:col-span-3">{x.role}</p>
                  <p className="text-sm text-bone-500 md:col-span-4">{x.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* work gallery */}
      <section className="container-edge mx-auto max-w-edge py-20 md:py-28">
        <div className="flex items-end justify-between gap-4">
          <Reveal>
            <SectionLabel index="03">The work behind the courses</SectionLabel>
          </Reveal>
        </div>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workGallery.map((w) => (
            <StaggerItem key={w.src}>
              <div className="group relative overflow-hidden rounded-xl border border-line/10">
                <div className="aspect-[4/5]">
                  <Media
                    src={w.src}
                    alt={w.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-105"
                  />
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-6 text-center text-xs uppercase tracking-ultra text-bone-500">
          {t.home.brandsNote}
        </p>
        <div className="mt-6">
          <LogoMarquee />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line/10">
        <div className="container-edge mx-auto max-w-edge py-24 text-center md:py-32">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
              {t.home.finalTitleA}{" "}
              <span className="font-serif font-normal italic tracking-normal text-mint">
                {t.home.finalTitleI}
              </span>
              {t.home.finalTitleB}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10">
              <Magnetic strength={0.5}>
                <Link
                  href="/courses/adobe-photoshop/"
                  className="btn btn-primary px-10 py-5 text-base"
                >
                  {t.home.finalCta}
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
