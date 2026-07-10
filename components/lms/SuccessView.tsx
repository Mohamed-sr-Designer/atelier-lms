"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import { useLang } from "@/lib/i18n";
import { getCourse } from "@/lib/courses";

// Enrollment success — a moment of ceremony, then straight into momentum.
export default function SuccessView() {
  const { t, lang } = useLang();
  const params = useSearchParams();
  const course = getCourse(params.get("course") || "");
  const isBundle = params.get("bundle") === "1";

  return (
    <section className="bg-grid relative flex min-h-screen items-center overflow-hidden pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 115%, rgb(var(--mint) / 0.22) 0%, transparent 70%)",
        }}
      />
      <div className="container-edge relative mx-auto max-w-edge py-24 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.15 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-mint/50 bg-mint/10 font-serif text-3xl italic text-mint"
        >
          ✦
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mx-auto mt-8 max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-8xl"
        >
          {t.success.enrollTitle}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto mt-6 max-w-md text-pretty text-sm leading-relaxed text-bone-400 md:text-base"
        >
          {isBundle
            ? `${t.catalog.bundleCard} — ${t.success.enrollSub}`
            : course
              ? `${course.title[lang]} — ${t.success.enrollSub}`
              : t.success.enrollSub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          {course && (
            <Magnetic strength={0.5}>
              <Link
                href={`/learn/${course.slug}/`}
                className="btn btn-primary px-10 py-5 text-base"
              >
                {t.success.startCourse}
              </Link>
            </Magnetic>
          )}
          <Link href="/dashboard/" className="link-underline text-sm text-bone-400">
            {t.success.goDashboard}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
