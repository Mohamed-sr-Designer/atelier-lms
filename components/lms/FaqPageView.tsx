"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import FaqList from "@/components/lms/FaqList";
import { useLang } from "@/lib/i18n";

export default function FaqPageView() {
  const { t } = useLang();

  return (
    <section className="container-edge mx-auto max-w-edge pb-28 pt-32 md:pt-44">
      <Reveal>
        <SectionLabel index="✦">{t.faqPage.kicker}</SectionLabel>
      </Reveal>
      <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal delay={0.05}>
          <h1 className="max-w-2xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
            {t.faqPage.titleA}{" "}
            <span className="font-serif font-normal italic tracking-normal text-mint">
              {t.faqPage.titleI}
            </span>
            {t.faqPage.titleB}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-bone-400">
            {t.faqPage.sub}
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="mt-14">
          <FaqList items={t.faqPage.items} />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-14 text-center">
          <Link
            href="/contact/"
            className="inline-block rounded-full border border-line/25 px-8 py-4 text-sm text-bone-50 transition-colors duration-300 hover:border-mint/60 hover:text-mint"
          >
            {t.faqPage.stillCta}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
