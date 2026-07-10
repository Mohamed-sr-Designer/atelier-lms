"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";

// Training for agencies & teams: a smart program-request form (delivery mode
// follows the location — on-site is an Egypt option) plus a fast-track free
// consultation form for decision makers.
export default function TrainingView() {
  const { t } = useLang();

  // program form
  const [agency, setAgency] = useState("");
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
    const subject = encodeURIComponent(`[Method — Team Program] ${agency}`);
    const body = encodeURIComponent(
      [
        `Company / agency: ${agency}`,
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
    <section className="bg-grid relative overflow-hidden pb-28 pt-32 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 90% 110%, rgb(var(--mint) / 0.13) 0%, transparent 65%)",
        }}
      />
      <div className="container-edge relative mx-auto max-w-edge">
        <Reveal>
          <SectionLabel index="✦">{t.training.kicker}</SectionLabel>
        </Reveal>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.05}>
            <h1 className="max-w-2xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
              {t.training.titleA}{" "}
              <span className="text-grad font-serif font-normal italic tracking-normal">
                {t.training.titleI}
              </span>
              {t.training.titleB}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-bone-400">
              {t.training.sub}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* program request */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <form
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
            </form>
          </Reveal>

          {/* free consultation */}
          <Reveal delay={0.15} className="lg:col-span-5">
            <form
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
                <label className="mt-5 block">
                  <span className={label}>{t.training.cCompany}</span>
                  <input
                    type="text"
                    value={cCompany}
                    onChange={(e) => setCCompany(e.target.value)}
                    className={input}
                    required
                  />
                </label>
                <label className="mt-5 block">
                  <span className={label}>{t.training.cContact}</span>
                  <input
                    type="text"
                    value={cContact}
                    onChange={(e) => setCContact(e.target.value)}
                    className={input}
                    required
                  />
                </label>

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
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
