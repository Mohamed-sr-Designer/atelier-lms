"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { useStore, loginAs } from "@/lib/store";
import { openAuth } from "@/components/lms/AuthModal";

// Wraps every /admin screen: guests and students see a glass gate with a
// one-tap admin preview; the instructor sees the studio.
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { t } = useLang();
  const store = useStore();

  if (store.user?.role === "admin") return <>{children}</>;

  return (
    <section className="container-edge mx-auto grid max-w-edge place-items-center pb-24 pt-48">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass relative w-full max-w-md overflow-hidden rounded-3xl p-10 text-center"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgb(var(--mint) / 0.12) 0%, transparent 45%, rgb(var(--electric) / 0.1) 100%)",
          }}
        />
        <div className="relative">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-line/20 bg-ink-900/70 font-serif text-2xl italic text-mint">
            ⌘
          </span>
          <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-bone-50">
            {t.admin.guard}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-bone-400">
            {t.admin.guardSub}
          </p>
          <button
            type="button"
            onClick={() => loginAs("admin")}
            className="btn btn-primary mt-7 w-full py-4"
          >
            {t.admin.guardCta}
          </button>
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="btn btn-ghost mt-3 w-full py-3.5"
          >
            {t.nav.login}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
