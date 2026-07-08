"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { fmtDuration, type Course } from "@/lib/courses";

// Curriculum as an editorial magazine index: oversized module numerals,
// hairline rows, Fraunces durations. Modules expand to reveal lessons.
export default function CurriculumIndex({
  course,
  defaultOpen = 0,
}: {
  course: Course;
  defaultOpen?: number;
}) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="border-t border-line/10">
      {course.modules.map((m, mi) => {
        const isOpen = open === mi;
        const mins = m.lessons.reduce((n, l) => n + l.dur, 0);
        return (
          <div key={m.n} className="border-b border-line/10">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : mi)}
              aria-expanded={isOpen}
              className="group flex w-full items-baseline gap-5 py-7 text-start md:gap-10"
            >
              <span
                className={`shrink-0 font-display text-4xl font-semibold tracking-tight transition-colors duration-300 md:text-6xl ${
                  isOpen ? "text-mint" : "text-bone-500/50 group-hover:text-mint/70"
                }`}
              >
                {m.n}
              </span>
              <span className="grow">
                <span className="block text-xl font-semibold tracking-tight text-bone-50 md:text-2xl">
                  {m.t}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-ultra text-bone-500">
                  {m.lessons.length} {t.common.lessons} ·{" "}
                  <span dir="ltr">{fmtDuration(mins, lang)}</span>
                </span>
              </span>
              <span
                aria-hidden
                className={`shrink-0 font-serif text-2xl leading-none text-bone-400 transition-transform duration-500 ease-cinema ${
                  isOpen ? "rotate-45 text-mint" : ""
                }`}
              >
                +
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ol className="pb-8 ps-[4.3rem] md:ps-[7.5rem]">
                    {m.lessons.map((l, li) => (
                      <li
                        key={l.id}
                        className="flex items-baseline gap-4 border-t border-line/5 py-3.5 first:border-t-0"
                      >
                        <span className="shrink-0 text-xs tabular-nums text-bone-500">
                          {m.n}.{li + 1}
                        </span>
                        <span className="grow text-sm text-bone-200 md:text-base">
                          {l.t}
                          {l.free ? (
                            <span className="ms-3 rounded-full bg-mint/15 px-2 py-0.5 text-[10px] text-mint">
                              {t.common.freePreview}
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 font-serif text-sm italic text-bone-400" dir="ltr">
                          {l.dur}
                          {t.common.minutesShort}
                        </span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
