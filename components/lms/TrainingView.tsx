"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import LogoMarquee from "@/components/LogoMarquee";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

type Lane = "program" | "consult";

// Training for agencies & teams — a cinematic banner up top, then ONE panel:
// a segmented switch decides which form you see, so the page never feels like
// two competing forms.
export default function TrainingView() {
  const { t } = useLang();
  const [lane, setLane] = useState<Lane>("program");

  // program form
  const [agency, setAgency] = useState("");
  const [pName, setPName] = useState("");
  const [pRole, setPRole] = useState(t.training.pRoles[0]);
  const [size, setSize] = useState(t.training.sizes[0]);
  const [industry, setIndustry] = useState(t.training.industries[0]);
  const [location, setLocation] = useState(t.training.locations[0]);
  const [website, setWebsite] = useState("");
  const inEgypt = location === "Egypt";

  // consultation form
  const [cName, setCName] = useState("");
  const [cRole, setCRole] = useState(t.training.cRoles[0]);
  const [cCompany, setCCompany] = useState("");
  const [cContact, setCContact] = useState("");
  const [cTime, setCTime] = useState(t.training.cTimes[0]);

  const submitProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Mohamed Tarek — Team Program] ${agency}`);
    const body = encodeURIComponent(
      [
        `Company / agency: ${agency}`,
        `Contact person: ${pName} (${pRole})`,
        `Team size: ${size}`,
        `Industry: ${industry}`,
        `Location: ${location}`,
        `Website: ${website}`,
        `Delivery: ${inEgypt ? "On-site or online (Egypt)" : "Online (international)"}`,
      ].join("\n")
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  const submitConsult = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hi Mohamed — I'd like to book the free strategy consultation.\nName: ${cName}\nRole: ${cRole}\nCompany: ${cCompany}\nContact: ${cContact}\nPreferred time: ${cTime}`
    );
    window.open(
      `https://wa.me/${site.whatsapp}?text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const input =
    "mt-2 w-full rounded-lg border border-line/15 bg-ink-900 px-4 py-3.5 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none";
  const selectCls = `${input} appearance-none`;
  const label = "text-xs uppercase tracking-ultra text-bone-500";

  return (
    <>
      {/* ------------------------------------------------- cinematic banner */}
      <section className="relative flex min-h-[72svh] flex-col justify-end overflow-hidden">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase("/lms/training-banner.jpg")}
            alt="Tarek for business — AI production training for agencies and teams"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/45 to-ink-900/30" />
        <div aria-hidden className="vignette absolute inset-0" />
        <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.07]" />

        <div className="container-edge relative z-10 mx-auto w-full max-w-edge pb-12 pt-40">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-line/25 bg-ink-900/50 px-4 py-2 text-xs uppercase tracking-ultra text-bone-200 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
              {t.training.bannerTag} — {t.training.kicker}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-5xl font-semibold leading-[0.96] tracking-tightest text-bone-50 [text-shadow:0_2px_30px_rgb(0_0_0/0.5)] md:text-8xl">
              {t.training.titleA}{" "}
              <span className="text-grad font-serif font-normal italic tracking-normal">
                {t.training.titleI}
              </span>
              {t.training.titleB}
            </h1>
          </Reveal>
          <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal delay={0.12}>
              <p className="max-w-xl text-pretty text-base leading-relaxed text-bone-200 md:text-lg">
                {t.training.sub}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="flex max-w-md flex-wrap gap-2">
                {[
                  "Brand & campaign systems",
                  "AI photoshoot pipeline",
                  "AI video production",
                  "Motion & delivery workflow",
                ].map((c) => (
                  <span
                    key={c}
                    className="glass rounded-full px-4 py-2 text-xs text-bone-200 transition-colors hover:border-mint/50 hover:text-mint"
                  >
                    ✦ {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ one panel */}
      <section className="bg-grid relative overflow-hidden pb-28 pt-16 md:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 90% 110%, rgb(var(--mint) / 0.13) 0%, transparent 65%)",
          }}
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, -40, 0], x: [0, 24, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(var(--mint)) 0%, transparent 70%)" }}
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, 36, 0], x: [0, -28, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(var(--electric)) 0%, transparent 70%)" }}
        />

        <div className="container-edge relative mx-auto max-w-edge">
          <Reveal>
            <SectionLabel index="✦">{t.training.tabHint}</SectionLabel>
          </Reveal>

          {/* lane switch */}
          <Reveal delay={0.06}>
            <div className="mt-8 inline-flex rounded-full border border-line/15 bg-ink-800/70 p-1.5 backdrop-blur">
              {(
                [
                  { id: "program", label: t.training.tabProgram },
                  { id: "consult", label: `✦ ${t.training.tabConsult}` },
                ] as { id: Lane; label: string }[]
              ).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setLane(o.id)}
                  className={`relative rounded-full px-6 py-3 text-sm transition-colors duration-300 ${
                    lane === o.id ? "text-white" : "text-bone-300 hover:text-bone-50"
                  }`}
                >
                  {lane === o.id && (
                    <motion.span
                      layoutId="training-lane"
                      className="absolute inset-0 rounded-full [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]"
                      transition={{ duration: 0.4, ease }}
                    />
                  )}
                  <span className="relative">{o.label}</span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* single form panel */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {lane === "program" ? (
                <motion.form
                  key="program"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease }}
                  onSubmit={submitProgram}
                  className="rounded-3xl border border-line/15 bg-ink-800/70 p-8 backdrop-blur-sm md:p-10"
                >
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-bone-50">
                    {t.training.formTitle}
                  </h2>

                  <label className="mt-7 block">
                    <span className={label}>{t.training.agency}</span>
                    <input
                      type="text"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className={input}
                      required
                    />
                  </label>

                  {/* who's reaching out + their title */}
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className={label}>{t.training.pName}</span>
                      <input
                        type="text"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        placeholder={t.training.pNamePh}
                        className={input}
                        required
                      />
                    </label>
                    <label className="block">
                      <span className={label}>{t.training.pRole}</span>
                      <select value={pRole} onChange={(e) => setPRole(e.target.value)} className={selectCls}>
                        {t.training.pRoles.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className={label}>{t.training.size}</span>
                      <select value={size} onChange={(e) => setSize(e.target.value)} className={selectCls}>
                        {t.training.sizes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={label}>{t.training.industry}</span>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className={selectCls}
                      >
                        {t.training.industries.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={label}>{t.training.location}</span>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={selectCls}
                      >
                        {t.training.locations.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={label}>{t.training.website}</span>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://"
                        className={input}
                      />
                    </label>
                  </div>

                  {/* delivery mode follows the location */}
                  <div
                    className={`mt-6 rounded-xl border p-4 text-sm transition-colors duration-500 ${
                      inEgypt
                        ? "border-mint/40 bg-mint/5 text-bone-200"
                        : "border-electric/40 bg-electric/5 text-bone-200"
                    }`}
                  >
                    <span className={label}>{t.training.modeLabel}</span>
                    <p className="mt-1.5 leading-relaxed">
                      {inEgypt ? t.training.modeEg : t.training.modeIntl}
                    </p>
                  </div>

                  <button type="submit" className="btn btn-primary mt-8 w-full py-4">
                    {t.training.submit}
                  </button>
                  <p className="mt-4 text-center text-xs text-bone-500">{t.training.note}</p>
                </motion.form>
              ) : (
                <motion.form
                  key="consult"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease }}
                  onSubmit={submitConsult}
                  className="relative overflow-hidden rounded-3xl border border-electric/30 bg-ink-800/70 p-8 backdrop-blur-sm md:p-10"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(140deg, rgb(var(--electric) / 0.12) 0%, transparent 50%, rgb(var(--mint) / 0.08) 100%)",
                    }}
                  />
                  <div className="relative">
                    <span className="inline-flex items-center gap-2 rounded-full bg-electric px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink-900">
                      ✦ {t.training.consultTag}
                    </span>
                    <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-bone-50">
                      {t.training.consultTitle}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-bone-400">
                      {t.training.consultSub}
                    </p>

                    <label className="mt-6 block">
                      <span className={label}>{t.training.cName}</span>
                      <input
                        type="text"
                        value={cName}
                        onChange={(e) => setCName(e.target.value)}
                        className={input}
                        required
                      />
                    </label>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className={label}>{t.training.cRole}</span>
                        <select
                          value={cRole}
                          onChange={(e) => setCRole(e.target.value)}
                          className={selectCls}
                        >
                          {t.training.cRoles.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className={label}>{t.training.cTime}</span>
                        <select
                          value={cTime}
                          onChange={(e) => setCTime(e.target.value)}
                          className={selectCls}
                        >
                          {t.training.cTimes.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className={label}>{t.training.cCompany}</span>
                        <input
                          type="text"
                          value={cCompany}
                          onChange={(e) => setCCompany(e.target.value)}
                          className={input}
                          required
                        />
                      </label>
                      <label className="block">
                        <span className={label}>{t.training.cContact}</span>
                        <input
                          type="text"
                          value={cContact}
                          onChange={(e) => setCContact(e.target.value)}
                          className={input}
                          required
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn mt-8 w-full bg-electric py-4 text-ink-900 hover:scale-[1.02]"
                    >
                      {t.training.cSubmit}
                    </button>
                    <p className="mt-4 text-center text-xs text-bone-500">
                      {t.training.cNote}
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* brands & academies loop */}
      <section className="pb-24">
        <p className="mb-6 text-center text-xs uppercase tracking-ultra text-bone-500">
          {t.home.brandsNote}
        </p>
        <LogoMarquee />
      </section>
    </>
  );
}
