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
    { label: t.downloads.title, href: "/downloads/" },
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
                alt="Tarek logo"
                className="h-9 w-9 rounded-full ring-1 ring-line/25"
              />
              <span className="text-bone-50">Tarek</span>
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

        <div className="mt-12 flex flex-col gap-4 border-t border-line/10 pt-6 text-sm text-bone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Tarek · {site.instructor}. {t.footer.rights}
          </p>
          <a href="#top" className="link-underline text-bone-400">
            {t.footer.backTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
