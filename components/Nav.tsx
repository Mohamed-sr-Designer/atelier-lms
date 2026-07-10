"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { useStore, logout } from "@/lib/store";
import { useStudio, mergeCourse } from "@/lib/studio";
import { withBase } from "@/lib/base";
import { courses, fmtPrice } from "@/lib/courses";
import { openAuth } from "@/components/lms/AuthModal";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false); // courses dropdown
  const pathname = usePathname();
  const { t, lang } = useLang();
  const store = useStore();
  const studio = useStudio();

  // Deliberately minimal: Journal, FAQ and Contact live in the footer.
  // The Studio only appears for the admin role.
  const links = [
    { label: t.nav.courses, href: "/courses" },
    { label: t.nav.instructor, href: "/instructor" },
    { label: t.nav.training, href: "/training" },
    ...(store.user?.role === "admin"
      ? [{ label: `⌘ ${t.nav.studio}`, href: "/admin" }]
      : []),
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
        className={`fixed inset-x-0 top-8 z-50 transition-all duration-500 ease-cinema ${
          scrolled
            ? "border-b border-line/10 bg-ink-900/70 py-3 backdrop-blur-xl"
            : "py-5"
        }`}
      >
        <div className="container-edge mx-auto flex max-w-edge items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Tarek — home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBase("/lms/logo.svg")}
              alt="Tarek logo"
              className="h-10 w-10 rounded-full ring-1 ring-line/25 transition-all duration-300 group-hover:ring-mint/60"
            />
            <span className="hidden text-sm tracking-tight text-bone-200 sm:block">
              Tarek
              <span className="text-bone-400"> {t.nav.roleTag}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
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
                        className="absolute left-1/2 top-full w-[21rem] -translate-x-1/2 pt-4"
                      >
                        <div className="overflow-hidden rounded-xl border border-line/15 bg-ink-800/95 p-2 shadow-2xl backdrop-blur-xl">
                          {courses
                            .map((c) => mergeCourse(c, studio.courses[c.slug]))
                            .map((c) => (
                            <Link
                              key={c.slug}
                              href={`/courses/${c.slug}/`}
                              role="menuitem"
                              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-900"
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                <span
                                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                    c.price === 0 ? "bg-mint" : "bg-electric"
                                  }`}
                                />
                                <span className="block truncate text-sm text-bone-50">
                                  {c.short[lang]}
                                </span>
                              </span>
                              <span
                                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                  c.price === 0
                                    ? "bg-mint text-white"
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
            <ThemeToggle />
            {store.user ? (
              <>
                <Link
                  href="/dashboard/"
                  className="hidden items-center rounded-full border border-line/20 px-4 py-2 text-sm text-bone-50 transition-all duration-300 hover:border-mint/50 hover:bg-mint/5 md:flex"
                >
                  {t.nav.dashboard}
                </Link>
                {/* avatar → account settings */}
                <Link
                  href="/profile/"
                  aria-label={t.nav.account}
                  title={t.nav.account}
                  className="hidden rounded-full ring-1 ring-line/25 transition-all duration-300 hover:ring-mint/60 md:block"
                >
                  {store.user.avatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={store.user.avatar}
                      alt={t.nav.account}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-mint/15 font-serif text-sm italic text-mint">
                      {store.user.name.trim().charAt(0).toUpperCase() || "T"}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  aria-label={t.nav.logout}
                  title={t.nav.logout}
                  className="hidden h-9 w-9 place-items-center rounded-full border border-line/15 text-bone-400 transition-colors hover:border-mint/50 hover:text-mint md:grid"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="hidden text-sm text-bone-200 transition-colors hover:text-bone-50 md:block"
                >
                  {t.nav.login}
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="btn btn-primary hidden px-5 py-2.5 md:inline-flex"
                >
                  {t.nav.startFree}
                </button>
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
                    <span className="mr-3 align-top text-sm text-bone-400">
                      0{i + 1}
                    </span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {store.user ? (
                <>
                  <Link
                    href="/dashboard/"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary px-6 py-3.5"
                  >
                    {t.nav.dashboard}
                  </Link>
                  <Link
                    href="/profile/"
                    onClick={() => setOpen(false)}
                    className="btn btn-ghost px-6 py-3.5"
                  >
                    {t.nav.account}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="btn btn-ghost px-6 py-3.5"
                  >
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openAuth("register");
                    }}
                    className="btn btn-primary px-6 py-3.5"
                  >
                    {t.nav.startFree}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openAuth("login");
                    }}
                    className="btn btn-ghost px-6 py-3.5"
                  >
                    {t.nav.login}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
