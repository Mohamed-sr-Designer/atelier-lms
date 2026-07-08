"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";
import { login } from "@/lib/store";

// Login & Register share one editorial split-screen form. The platform is a
// static demo, so "auth" creates the local student record — no passwords kept.
export default function AuthView({ mode }: { mode: "login" | "register" }) {
  const { t } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const isRegister = mode === "register";
  const title = isRegister ? t.auth.registerTitle : t.auth.loginTitle;
  const sub = isRegister ? t.auth.registerSub : t.auth.loginSub;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErr(t.auth.errEmail);
      return;
    }
    let finalName = name.trim();
    if (isRegister && !finalName) {
      setErr(t.auth.errName);
      return;
    }
    if (!finalName) {
      // login without a stored name — derive a display name from the email
      finalName = cleanEmail
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    login(finalName, cleanEmail);
    router.push(next);
  };

  return (
    <section className="bg-grid relative min-h-screen overflow-hidden pt-32 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 90% 110%, rgb(var(--mint) / 0.14) 0%, transparent 65%)",
        }}
      />
      <div className="container-edge relative mx-auto grid max-w-edge gap-14 pb-24 lg:grid-cols-2">
        {/* editorial side */}
        <div>
          <Reveal>
            <SectionLabel index="✦">
              {isRegister ? t.nav.startFree : t.nav.login}
            </SectionLabel>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-7 max-w-lg text-balance font-display text-5xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-7xl">
              {title.split(".")[0]}
              <span className="font-serif font-normal italic tracking-normal text-mint">
                .
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-bone-400">
              {sub}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-10 max-w-md rounded-xl border border-line/10 bg-ink-800/60 p-5 text-xs leading-relaxed text-bone-500">
              {t.auth.demoNote}
            </p>
          </Reveal>
        </div>

        {/* form */}
        <Reveal delay={0.1}>
          <form
            onSubmit={submit}
            className="rounded-2xl border border-line/15 bg-ink-800/70 p-8 backdrop-blur-sm md:p-10"
          >
            {isRegister && (
              <label className="block">
                <span className="text-xs uppercase tracking-ultra text-bone-500">
                  {t.auth.name}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.auth.namePh}
                  className="mt-2 w-full rounded-lg border border-line/15 bg-ink-900 px-4 py-3.5 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none"
                  autoComplete="name"
                />
              </label>
            )}
            <label className={`block ${isRegister ? "mt-6" : ""}`}>
              <span className="text-xs uppercase tracking-ultra text-bone-500">
                {t.auth.email}
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPh}
                className="mt-2 w-full rounded-lg border border-line/15 bg-ink-900 px-4 py-3.5 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none"
                autoComplete="email"
                required
              />
            </label>
            <label className="mt-6 block">
              <span className="text-xs uppercase tracking-ultra text-bone-500">
                {t.auth.password}
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPh}
                className="mt-2 w-full rounded-lg border border-line/15 bg-ink-900 px-4 py-3.5 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none"
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
              />
            </label>

            {err && <p className="mt-4 text-sm text-mint">{err}</p>}

            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-mint py-4 text-sm font-medium text-ink-900 transition-transform duration-300 hover:scale-[1.02]"
            >
              {isRegister ? t.auth.registerBtn : t.auth.loginBtn}
            </button>

            <p className="mt-6 text-center text-sm text-bone-400">
              {isRegister ? t.auth.orLogin : t.auth.orRegister}{" "}
              <Link
                href={
                  (isRegister ? "/login/" : "/register/") +
                  (next !== "/dashboard/" ? `?next=${encodeURIComponent(next)}` : "")
                }
                className="link-underline text-mint"
              >
                {isRegister ? t.auth.loginLink : t.auth.registerLink}
              </Link>
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
