"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { courses, fmtPrice } from "@/lib/courses";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false); // courses dropdown
  const pathname = usePathname();
  const { t, lang, toggle } = useLang();
  const store = useStore();

  const links = [
    { label: t.nav.courses, href: "/courses" },
    { label: t.nav.instructor, href: "/instructor" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.faq, href: "/faq" },
    { label: t.nav.contact, href: "/contact" },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // close menus on route change
  useEffect(() => {
    setMenu(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-courses-menu]"))
        setMenu(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinema ${
          scrolled
            ? "border-b border-line/10 bg-ink-900/70 py-3 backdrop-blur-xl"
            : "py-5"
        }`}
      >
        <div className="container-edge mx-auto flex max-w-edge items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Method — home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line/20 font-serif text-base italic transition-colors duration-300 group-hover:border-mint/60 group-hover:text-mint">
              M
            </span>
            <span className="hidden text-sm tracking-tight text-bone-200 sm:block">
              Method
              <span className="text-bone-400"> {t.nav.roleTag}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((item) =>
              item.href === "/courses" ? (
                <div
                  key={item.href}
                  className="relative"
                  data-courses-menu
                  onMouseEnter={() => setMenu(true)}
                  onMouseLeave={() => setMenu(false)}
                >
                  <Link
                    href="/courses/"
                    className={`link-underline flex items-center gap-1 text-sm transition-colors ${
                      isActive("/courses")
                        ? "text-mint"
                        : "text-bone-200 hover:text-bone-50"
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={menu}
                  >
                    {item.label}
                    <span className="text-[0.6rem]">▾</span>
                  </Link>
                  <AnimatePresence>
                    {menu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        role="menu"
                        className="absolute left-1/2 top-full w-[21rem] -translate-x-1/2 pt-4 rtl:left-auto rtl:right-1/2 rtl:translate-x-1/2"
                      >
                        <div className="overflow-hidden rounded-xl border border-line/15 bg-ink-800/95 p-2 shadow-2xl backdrop-blur-xl">
                          {courses.map((c) => (
                            <Link
                              key={c.slug}
                              href={`/courses/${c.slug}/`}
                              role="menuitem"
                              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-900"
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                <span className="w-7 shrink-0 font-serif text-lg italic text-mint">
                                  {c.glyph}
                                </span>
                                <span className="block truncate text-sm text-bone-50">
                                  {c.short[lang]}
                                </span>
                              </span>
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                                  c.price === 0
                                    ? "bg-mint/15 text-mint"
                                    : "bg-electric/15 text-electric"
                                }`}
                              >
                                {fmtPrice(c.price, lang)}
                              </span>
                            </Link>
                          ))}
                          <Link
                            href="/bundle/"
                            role="menuitem"
                            className="mt-1 flex items-center justify-between gap-3 rounded-lg border border-mint/25 bg-mint/5 px-3 py-2.5 transition-colors hover:bg-mint/10"
                          >
                            <span className="text-sm text-bone-50">
                              {t.catalog.bundleCard}
                            </span>
                            <span className="text-xs text-mint">✦</span>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={`${item.href}/`}
                  className={`link-underline text-sm transition-colors ${
                    isActive(item.href)
                      ? "text-mint"
                      : "text-bone-200 hover:text-bone-50"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-line/20 px-3 py-2 text-xs font-medium text-bone-200 transition-colors hover:border-mint/50 hover:text-mint"
              aria-label="Switch language"
            >
              {t.nav.langBtn}
            </button>
            <ThemeToggle />
            {store.user ? (
              <Link
                href="/dashboard/"
                className="hidden items-center gap-2 rounded-full border border-line/20 py-1.5 pl-1.5 pr-4 text-sm text-bone-50 transition-all duration-300 hover:border-mint/50 hover:bg-mint/5 md:flex rtl:pl-4 rtl:pr-1.5"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-mint/15 font-serif text-xs italic text-mint">
                  {store.user.name.trim().charAt(0).toUpperCase() || "A"}
                </span>
                {t.nav.dashboard}
              </Link>
            ) : (
              <>
                <Link
                  href="/login/"
                  className="hidden text-sm text-bone-200 transition-colors hover:text-bone-50 md:block"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register/"
                  className="hidden rounded-full bg-mint px-5 py-2 text-sm font-medium text-ink-900 transition-transform duration-300 hover:scale-[1.04] md:inline-block"
                >
                  {t.nav.startFree}
                </Link>
              </>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span
                className={`h-px w-6 bg-bone-50 transition-all duration-300 ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-6 bg-bone-50 transition-all duration-300 ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col justify-center overflow-y-auto bg-ink-900 px-8 py-24 lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {links.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.5 }}
                >
                  <Link
                    href={`${item.href}/`}
                    onClick={() => setOpen(false)}
                    className="font-serif text-4xl text-bone-50"
                  >
                    <span className="mr-3 align-top text-sm text-bone-400 rtl:ml-3 rtl:mr-0">
                      0{i + 1}
                    </span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {store.user ? (
                <Link
                  href="/dashboard/"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-mint px-6 py-3 text-sm font-medium text-ink-900"
                >
                  {t.nav.dashboard}
                </Link>
              ) : (
                <>
                  <Link
                    href="/register/"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-mint px-6 py-3 text-sm font-medium text-ink-900"
                  >
                    {t.nav.startFree}
                  </Link>
                  <Link
                    href="/login/"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-line/20 px-6 py-3 text-sm text-bone-50"
                  >
                    {t.nav.login}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
