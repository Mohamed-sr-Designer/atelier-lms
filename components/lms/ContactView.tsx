"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";

export default function ContactView() {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(0);
  const [msg, setMsg] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `[Method] ${t.contact.topics[topic]} — ${name || "Student"}`
    );
    const body = encodeURIComponent(`${msg}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

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
      <div className="container-edge relative mx-auto grid max-w-edge gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <SectionLabel index="✦">{t.contact.kicker}</SectionLabel>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-7 max-w-lg text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
              {t.contact.titleA}{" "}
              <span className="font-serif font-normal italic tracking-normal text-mint">
                {t.contact.titleI}
              </span>
              {t.contact.titleB}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-bone-400">
              {t.contact.sub}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-8 py-4"
              >
                {t.contact.waCta}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="rounded-full border border-line/25 px-8 py-4 text-sm text-bone-50 transition-colors duration-300 hover:border-mint/60 hover:text-mint"
              >
                {t.contact.emailCta}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-12 max-w-md rounded-2xl border border-line/10 bg-ink-800/60 p-7">
              <p className="text-xs uppercase tracking-ultra text-mint">
                {t.contact.trainingTitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-bone-400">
                {t.contact.trainingNote}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form
            onSubmit={send}
            className="rounded-2xl border border-line/15 bg-ink-800/70 p-8 backdrop-blur-sm md:p-10"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-ultra text-bone-500">
                  {t.contact.formName}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-line/15 bg-ink-900 px-4 py-3.5 text-sm text-bone-50 focus:border-mint/60 focus:outline-none"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-ultra text-bone-500">
                  {t.contact.formEmail}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-line/15 bg-ink-900 px-4 py-3.5 text-sm text-bone-50 focus:border-mint/60 focus:outline-none"
                  required
                />
              </label>
            </div>
            <div className="mt-6">
              <span className="text-xs uppercase tracking-ultra text-bone-500">
                {t.contact.formTopic}
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.contact.topics.map((x, i) => (
                  <button
                    key={x}
                    type="button"
                    onClick={() => setTopic(i)}
                    className={`rounded-full border px-4 py-2 text-xs transition-colors duration-300 ${
                      topic === i
                        ? "border-mint bg-mint/10 text-mint"
                        : "border-line/15 text-bone-300 hover:border-line/30"
                    }`}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
            <label className="mt-6 block">
              <span className="text-xs uppercase tracking-ultra text-bone-500">
                {t.contact.formMsg}
              </span>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={5}
                className="mt-2 w-full resize-none rounded-lg border border-line/15 bg-ink-900 px-4 py-3.5 text-sm text-bone-50 focus:border-mint/60 focus:outline-none"
                required
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary mt-8 w-full py-4"
            >
              {t.contact.formSend}
            </button>
            <p className="mt-4 text-center text-xs text-bone-500">
              {t.contact.formNote}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
