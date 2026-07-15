"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import Aurora from "@/components/ui/Aurora";
import { useLang } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

type Check = {
  key: "lens" | "light" | "comp" | "palette" | "constraints" | "subject";
  test: RegExp;
  add: string;
};

// The director's checklist, encoded. Each check looks for photographic
// language in the prompt; anything missing gets appended as real direction.
const CHECKS: Check[] = [
  {
    key: "lens",
    test: /\b\d{2,3}\s?mm\b|lens|focal|wide[- ]angle|telephoto|macro/i,
    add: "85mm lens",
  },
  {
    key: "light",
    test: /light|lit\b|shadow|golden hour|window|softbox|backlit|dusk|overcast/i,
    add: "soft window light from camera left, gentle fill",
  },
  {
    key: "comp",
    test: /composition|negative space|rule of thirds|close[- ]up|crop|centered|framing|top[- ]down/i,
    add: "negative space top-right for a headline, rule-of-thirds placement",
  },
  {
    key: "palette",
    test: /palette|color world|muted|warm|cool tones|amber|pastel|monochrome|grade/i,
    add: "warm muted amber palette",
  },
  {
    key: "constraints",
    test: /no text|no logo|without|--no|avoid|clean background|shallow depth/i,
    add: "shallow depth of field, no text, no logos",
  },
  {
    key: "subject",
    test: /.{18,}/,
    add: "",
  },
];

export default function PromptFixer() {
  const { t } = useLang();
  const [input, setInput] = useState("");
  const [fixed, setFixed] = useState("");
  const [missing, setMissing] = useState<Check["key"][]>([]);
  const [copied, setCopied] = useState(false);
  const [ran, setRan] = useState(false);

  const fix = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim().replace(/[.\s]+$/, "");
    if (!raw) return;
    const gaps = CHECKS.filter((c) => !c.test.test(raw)).map((c) => c.key);
    const additions = CHECKS.filter(
      (c) => gaps.includes(c.key) && c.add
    ).map((c) => c.add);
    setMissing(gaps);
    setFixed(additions.length ? `${raw} — ${additions.join(", ")}` : raw);
    setRan(true);
    setCopied(false);
  };

  const copy = () => {
    try {
      navigator.clipboard?.writeText(fixed);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="relative overflow-hidden border-t border-line/10 py-20 md:py-28">
      <Aurora className="opacity-40" />
      <div className="container-edge relative mx-auto max-w-edge">
        <Reveal>
          <SectionLabel index="✦">{t.promptFixer.kicker}</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.0] tracking-tightest text-bone-50 md:text-6xl">
            {t.promptFixer.titleA}{" "}
            <span className="text-grad font-serif font-normal italic tracking-normal">
              {t.promptFixer.titleI}
            </span>
            {t.promptFixer.titleB}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone-400 md:text-base">
            {t.promptFixer.sub}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={fix} className="glass mt-10 rounded-3xl p-6 md:p-8">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.promptFixer.placeholder}
              rows={3}
              className="w-full resize-none rounded-xl border border-line/15 bg-ink-900/70 px-4 py-3.5 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none"
              dir="auto"
            />
            <button type="submit" className="btn btn-primary mt-4 px-8 py-3.5">
              {t.promptFixer.fixBtn}
            </button>

            <AnimatePresence>
              {ran && (
                <motion.div
                  initial={{ opacity: 0, y: 16, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="overflow-hidden"
                >
                  {/* the directed version */}
                  <div className="mt-7 rounded-2xl border border-mint/30 bg-mint/[0.05] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-ultra text-mint">
                        {t.promptFixer.fixedLabel}
                      </p>
                      <button
                        type="button"
                        onClick={copy}
                        className="shrink-0 rounded-full border border-line/20 px-4 py-1.5 text-xs text-bone-200 transition-colors hover:border-mint/50 hover:text-mint"
                      >
                        {copied ? t.promptFixer.copied : t.promptFixer.copyBtn}
                      </button>
                    </div>
                    <p className="mt-3 font-mono text-sm leading-relaxed text-bone-100" dir="ltr">
                      {fixed}
                    </p>
                  </div>

                  {/* what was missing */}
                  {missing.filter((k) => k !== "subject" || missing.length === CHECKS.length).length > 0 && (
                    <div className="mt-5">
                      <p className="text-[11px] uppercase tracking-ultra text-bone-500">
                        {t.promptFixer.tipsLabel}
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {missing.map((k) => (
                          <motion.li
                            key={k}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-start gap-3 text-sm leading-relaxed text-bone-300"
                          >
                            <span className="mt-0.5 text-mint">✦</span>
                            {t.promptFixer.tips[k]}
                          </motion.li>
                        ))}
                        {missing.length === 0 && (
                          <li className="text-sm text-mint">✓ {t.promptFixer.upsell}</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <p className="mt-6 border-t border-line/10 pt-4 font-serif text-sm italic text-bone-400">
                    {t.promptFixer.upsell}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
