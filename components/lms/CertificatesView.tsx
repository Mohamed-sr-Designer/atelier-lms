"use client";

import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import CertificatePlate from "@/components/lms/CertificatePlate";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function CertificatesView() {
  const { t } = useLang();
  const store = useStore();

  return (
    <section className="container-edge mx-auto max-w-edge pb-28 pt-32 md:pt-40">
      <Reveal>
        <SectionLabel index="✦">{t.certs.kicker}</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
          {t.certs.title}
          <span className="font-serif font-normal italic tracking-normal text-mint">.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-bone-400">
          {t.certs.sub}
        </p>
      </Reveal>

      {store.certificates.length === 0 ? (
        <Reveal delay={0.15}>
          <div className="mt-14 rounded-2xl border border-dashed border-line/20 p-16 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-line/20 font-serif text-2xl italic text-bone-500">
              A
            </span>
            <p className="mt-6 font-serif text-xl italic text-bone-400">
              {t.certs.empty}
            </p>
            <Link
              href="/courses/"
              className="mt-6 inline-block rounded-full bg-mint px-7 py-3.5 text-sm font-medium text-ink-900"
            >
              {t.certs.emptyCta}
            </Link>
          </div>
        </Reveal>
      ) : (
        <Stagger className="mt-14 grid gap-10 lg:grid-cols-2">
          {store.certificates.map((cert) => (
            <StaggerItem key={cert.id}>
              <CertificatePlate cert={cert} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  );
}
