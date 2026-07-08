"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Editorial FAQ accordion: hairline rows, serif numerals, one open at a time.
export default function FaqList({
  items,
  className = "",
}: {
  items: { q: string; a: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={`divide-y divide-line/10 border-y border-line/10 ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-baseline gap-5 py-6 text-start transition-colors md:gap-8"
            >
              <span className="shrink-0 font-serif text-sm italic text-bone-500 transition-colors group-hover:text-mint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`grow text-lg font-medium tracking-tight transition-colors md:text-xl ${
                  isOpen ? "text-mint" : "text-bone-50 group-hover:text-mint"
                }`}
              >
                {item.q}
              </span>
              <span
                className={`shrink-0 font-serif text-2xl leading-none text-bone-400 transition-transform duration-500 ease-cinema ${
                  isOpen ? "rotate-45 text-mint" : ""
                }`}
                aria-hidden
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
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-7 text-pretty ps-10 text-sm leading-relaxed text-bone-400 md:ps-14 md:text-base">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
