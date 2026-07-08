"use client";

import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { useLang } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useLang();
  return (
    <SiteShell>
      <main className="bg-grid relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 115%, rgb(var(--mint) / 0.16) 0%, transparent 70%)",
          }}
        />
        <div className="container-edge relative mx-auto flex min-h-[85vh] max-w-edge flex-col items-center justify-center py-32 text-center">
          <p className="font-display text-[26vw] font-semibold leading-none tracking-tightest text-bone-50/[0.06] md:text-[18rem]">
            404
          </p>
          <h1 className="-mt-10 max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:-mt-20 md:text-6xl">
            {t.notFound.titleA}{" "}
            <span className="font-serif font-normal italic tracking-normal text-mint">
              {t.notFound.titleI}
            </span>
            {t.notFound.titleB}
          </h1>
          <p className="mt-6 max-w-md text-pretty text-sm leading-relaxed text-bone-400">
            {t.notFound.sub}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-mint px-8 py-4 text-sm font-medium text-ink-900 transition-transform duration-300 hover:scale-[1.04]"
            >
              {t.notFound.home}
            </Link>
            <Link
              href="/courses/"
              className="rounded-full border border-line/25 px-8 py-4 text-sm text-bone-50 transition-colors duration-300 hover:border-mint/60 hover:text-mint"
            >
              {t.notFound.courses}
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
