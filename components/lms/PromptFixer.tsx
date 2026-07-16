"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import Aurora from "@/components/ui/Aurora";
import { useLang } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

type TipKey =
  | "lens"
  | "light"
  | "comp"
  | "palette"
  | "constraints"
  | "subject"
  | "human";

// The director's checklist, encoded. Each check looks for photographic
// language; anything missing gets appended as real direction.
const CHECKS: { key: Exclude<TipKey, "human">; test: RegExp; add: string }[] = [
  { key: "lens", test: /\b\d{2,3}\s?mm\b|lens|focal|wide[- ]angle|telephoto|macro/i, add: "85mm lens" },
  { key: "light", test: /light|lit\b|shadow|golden hour|window|softbox|backlit|dusk|overcast/i, add: "soft window light from camera left, gentle fill" },
  { key: "comp", test: /composition|negative space|rule of thirds|close[- ]up|crop|centered|framing|top[- ]down/i, add: "negative space top-right for a headline, rule-of-thirds placement" },
  { key: "palette", test: /palette|color world|muted|warm|cool tones|amber|pastel|monochrome|grade/i, add: "warm muted amber palette" },
  { key: "constraints", test: /no text|no logo|without|--no|avoid|clean background|shallow depth/i, add: "shallow depth of field, no text, no logos" },
];

// A person in the prompt means the fixer must ask for casting details first —
// nationality, age and place stop the model drifting to generic faces.
const HUMAN_RE =
  /\b(man|woman|men|women|person|people|model|girl|boy|guy|lady|human|portrait|face|bride|groom|kid|child|male|female)\b|(رجل|امرأة|فتاة|شاب|شابة|طفل|طفلة|موديل|إنسان|إنسانة|بنت|ولد|عروس|عريس|وجه|شخص)/i;

// Best-effort grammar & spelling tidy (client-side): spacing, casing and the
// misspellings that actually show up in prompts.
const TYPOS: [RegExp, string][] = [
  [/\bteh\b/gi, "the"],
  [/\brecieve\b/gi, "receive"],
  [/\bseperate\b/gi, "separate"],
  [/\blense\b/gi, "lens"],
  [/\bbackround\b/gi, "background"],
  [/\bbackgorund\b/gi, "background"],
  [/\bportait\b/gi, "portrait"],
  [/\bfoto\b/gi, "photo"],
  [/\bpicutre\b/gi, "picture"],
  [/\bpcture\b/gi, "picture"],
  [/\bwich\b/gi, "which"],
  [/\bwiht\b/gi, "with"],
  [/\bwoman standing infront\b/gi, "woman standing in front"],
  [/\binfront\b/gi, "in front"],
  [/\balot\b/gi, "a lot"],
];

function tidyGrammar(raw: string): { text: string; changed: boolean } {
  let text = raw.replace(/\s+/g, " ").trim().replace(/[.\s]+$/, "");
  const before = text;
  for (const [re, to] of TYPOS) text = text.replace(re, to);
  // sentence-case the first letter (latin only; Arabic has no case)
  text = text.replace(/^[a-z]/, (c) => c.toUpperCase());
  // collapse duplicated words ("the the")
  text = text.replace(/\b(\w+)\s+\1\b/gi, "$1");
  return { text, changed: text !== before };
}

const wordCount = (s: string) =>
  s.trim().split(/\s+/).filter(Boolean).length;

export default function PromptFixer() {
  const { t } = useLang();
  const [input, setInput] = useState("");
  const [fixed, setFixed] = useState("");
  const [tips, setTips] = useState<TipKey[]>([]);
  const [grammarFixed, setGrammarFixed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stage, setStage] = useState<"idle" | "short" | "askHuman" | "done">("idle");
  // human casting details
  const [nat, setNat] = useState("");
  const [age, setAge] = useState("");
  const [place, setPlace] = useState("");

  const compose = (cleaned: string, human?: { nat: string; age: string; place: string }) => {
    const gaps = CHECKS.filter((c) => !c.test.test(cleaned));
    let core = cleaned;
    const extraTips: TipKey[] = gaps.map((g) => g.key);
    if (human) {
      const casting = [
        human.nat && `${human.nat}`,
        human.age && `${human.age}-year-old`,
      ]
        .filter(Boolean)
        .join(" ");
      core = `${cleaned} — ${casting}${human.place ? `, in ${human.place}` : ""}`;
      extraTips.unshift("human");
    }
    const additions = gaps.map((g) => g.add);
    setFixed(additions.length ? `${core} — ${additions.join(", ")}` : core);
    setTips(extraTips);
    setStage("done");
    setCopied(false);
  };

  const fix = (e: React.FormEvent) => {
    e.preventDefault();
    const { text: cleaned, changed } = tidyGrammar(input);
    if (!cleaned) return;
    setGrammarFixed(changed);
    // too short to direct — ask for a real description first
    if (wordCount(cleaned) < 8) {
      setStage("short");
      setFixed("");
      setTips([]);
      return;
    }
    // a person in frame → casting questions before the fix
    if (HUMAN_RE.test(cleaned) && !(nat && age && place)) {
      setStage("askHuman");
      return;
    }
    compose(cleaned, HUMAN_RE.test(cleaned) ? { nat, age, place } : undefined);
  };

  const applyHuman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nat.trim() || !age.trim() || !place.trim()) return;
    const { text: cleaned } = tidyGrammar(input);
    compose(cleaned, { nat: nat.trim(), age: age.trim(), place: place.trim() });
  };

  const copy = () => {
    try {
      navigator.clipboard?.writeText(fixed);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const inputCls =
    "mt-2 w-full rounded-lg border border-line/15 bg-ink-900/70 px-3.5 py-3 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none";

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

            <AnimatePresence mode="wait">
              {/* too short — coach, don't guess */}
              {stage === "short" && (
                <motion.div
                  key="short"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="mt-6 flex items-start gap-3 rounded-2xl border border-electric/30 bg-electric/[0.06] p-5"
                >
                  <span className="text-lg text-electric">✎</span>
                  <p className="text-sm leading-relaxed text-bone-200">
                    {t.promptFixer.tooShort}
                  </p>
                </motion.div>
              )}

              {/* person detected — casting questions first */}
              {stage === "askHuman" && (
                <motion.div
                  key="human"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="mt-6 rounded-2xl border border-mint/30 bg-mint/[0.05] p-5 md:p-6"
                >
                  <p className="font-display text-lg font-semibold text-bone-50">
                    {t.promptFixer.humanTitle}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-bone-400">
                    {t.promptFixer.humanNote}
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-ultra text-bone-500">
                        {t.promptFixer.natLabel}
                      </span>
                      <input
                        type="text"
                        value={nat}
                        onChange={(e) => setNat(e.target.value)}
                        placeholder={t.promptFixer.natPh}
                        className={inputCls}
                        dir="auto"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-ultra text-bone-500">
                        {t.promptFixer.ageLabel}
                      </span>
                      <input
                        type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder={t.promptFixer.agePh}
                        className={inputCls}
                        dir="ltr"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-ultra text-bone-500">
                        {t.promptFixer.placeLabel}
                      </span>
                      <input
                        type="text"
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                        placeholder={t.promptFixer.placePh}
                        className={inputCls}
                        dir="auto"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={applyHuman}
                    disabled={!nat.trim() || !age.trim() || !place.trim()}
                    className="btn btn-primary mt-5 px-7 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t.promptFixer.humanApply}
                  </button>
                </motion.div>
              )}

              {/* the directed result */}
              {stage === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                >
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

                  {(tips.length > 0 || grammarFixed) && (
                    <div className="mt-5">
                      <p className="text-[11px] uppercase tracking-ultra text-bone-500">
                        {t.promptFixer.tipsLabel}
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {grammarFixed && (
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-3 text-sm leading-relaxed text-bone-300"
                          >
                            <span className="mt-0.5 text-electric">✓</span>
                            {t.promptFixer.grammarTip}
                          </motion.li>
                        )}
                        {tips.map((k) => (
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
