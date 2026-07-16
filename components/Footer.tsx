"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";
import { courses } from "@/lib/courses";

export default function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();

  // Support column — blog, help and ways to reach a human
  const platform = [
    { label: t.nav.blog, href: "/blog/" },
    { label: t.nav.faq, href: "/faq/" },
    { label: t.nav.contact, href: "/contact/" },
    { label: t.nav.offers, href: "/offers/" },
  ];

  const school = [
    { label: t.nav.dashboard, href: "/dashboard/" },
    { label: t.nav.instructor, href: "/instructor/" },
    { label: t.nav.training, href: "/training/" },
    { label: t.catalog.bundleCard, href: "/bundle/" },
  ];

  const legal = [
    { label: t.legal.terms.title, href: "/legal/terms/" },
    { label: t.legal.privacy.title, href: "/legal/privacy/" },
    { label: t.legal.refunds.title, href: "/legal/refunds/" },
  ];

  return (
    <footer className="border-t border-line/10">
      <div className="container-edge mx-auto max-w-edge py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          {/* identity */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBase("/lms/logo.svg")}
                alt="Mohamed Tarek logo"
                className="h-9 w-9 rounded-full ring-1 ring-line/25"
              />
              <span className="text-bone-50">Mohamed Tarek</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-400">
              {t.footer.blurb}
            </p>
            <p className="mt-6 text-xs uppercase tracking-ultra text-bone-500">
              {t.footer.madeIn}
            </p>
          </div>

          {/* courses */}
          <nav className="md:col-span-3" aria-label="Courses">
            <p className="text-xs uppercase tracking-ultra text-bone-500">
              {t.footer.learnCol}
            </p>
            <ul className="mt-4 grid gap-2 text-sm">
              {courses.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/courses/${c.slug}/`}
                    className="text-bone-400 transition-colors hover:text-bone-50"
                  >
                    {c.short[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* platform */}
          <nav className="md:col-span-2" aria-label="Platform">
            <p className="text-xs uppercase tracking-ultra text-bone-500">
              {t.footer.platformCol}
            </p>
            <ul className="mt-4 grid gap-2 text-sm">
              {platform.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-bone-400 transition-colors hover:text-bone-50"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* school + legal */}
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-ultra text-bone-500">
              {t.footer.companyCol}
            </p>
            <ul className="mt-4 grid gap-2 text-sm">
              {school.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-bone-400 transition-colors hover:text-bone-50"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs uppercase tracking-ultra text-bone-500">
              {t.footer.legalCol}
            </p>
            <ul className="mt-4 grid gap-2 text-sm">
              {legal.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-bone-400 transition-colors hover:text-bone-50"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs uppercase tracking-ultra text-bone-500">
              {t.footer.connectCol}
            </p>
            <ul className="mt-4 grid gap-2 text-sm">
              <li>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone-400 transition-colors hover:text-bone-50"
                >
                  WhatsApp ↗
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-bone-400 transition-colors hover:text-bone-50"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone-400 transition-colors hover:text-bone-50"
                >
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* payments + social */}
        <div className="mt-12 flex flex-col gap-6 border-t border-line/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-ultra text-bone-500">
              {t.footer.payLabel}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* Visa */}
              <span className="flex h-8 items-center rounded-md border border-line/15 bg-bone-50 px-3 font-serif text-sm font-bold italic tracking-tight text-[#1A1F71]">
                VISA
              </span>
              {/* Mastercard */}
              <span className="flex h-8 items-center gap-0 rounded-md border border-line/15 bg-ink-800 px-3">
                <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
                <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#F79E1B] opacity-90" />
              </span>
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-ultra text-bone-500 md:text-end">
              {t.footer.followLabel}
            </p>
            <div className="mt-3 flex items-center gap-3 md:justify-end">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="glass grid h-10 w-10 place-items-center rounded-full text-bone-300 transition-all duration-300 hover:-translate-y-0.5 hover:text-mint"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="glass grid h-10 w-10 place-items-center rounded-full text-bone-300 transition-all duration-300 hover:-translate-y-0.5 hover:text-mint"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M13.5 21.9v-7.4h2.5l.47-3.1H13.5V9.4c0-.85.42-1.68 1.75-1.68h1.35V5.08s-1.23-.21-2.4-.21c-2.45 0-4.05 1.48-4.05 4.17v2.36H7.4v3.1h2.75v7.4a10 10 0 1 1 3.35 0Z" />
                </svg>
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="glass grid h-10 w-10 place-items-center rounded-full text-bone-300 transition-all duration-300 hover:-translate-y-0.5 hover:text-mint"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5A2.49 2.49 0 1 1 0 3.5a2.49 2.49 0 0 1 4.98 0ZM.2 8.4h4.6V24H.2V8.4Zm7.7 0h4.4v2.13h.06c.61-1.16 2.11-2.38 4.35-2.38 4.65 0 5.51 3.06 5.51 7.04V24h-4.6v-7.9c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.17V24H7.9V8.4Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line/10 pt-6 text-sm text-bone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {t.footer.rights}
          </p>
          <a href="#top" className="link-underline text-bone-400">
            {t.footer.backTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
