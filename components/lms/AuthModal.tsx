"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { login, loginAs, updateUser, useStore } from "@/lib/store";

type Mode = "login" | "register";

// Open from anywhere: openAuth("register"). The modal closes itself on
// success — callers just re-render off the store.
export const openAuth = (mode: Mode = "login") => {
  window.dispatchEvent(new CustomEvent("open-auth", { detail: mode }));
};

export default function AuthModal() {
  const { t } = useLang();
  const router = useRouter();
  const store = useStore();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setMode(((e as CustomEvent).detail as Mode) || "login");
      setErr("");
      setOpen(true);
    };
    window.addEventListener("open-auth", onOpen);
    return () => window.removeEventListener("open-auth", onOpen);
  }, []);

  // native cursor + scroll lock while open
  useEffect(() => {
    document.documentElement.classList.toggle("modal-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // if already signed in, no reason to stay open
  useEffect(() => {
    if (store.user && open) close();
  }, [store.user, open, close]);

  const isRegister = mode === "register";

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
    const cleanPhone = phone.trim();
    if (isRegister && cleanPhone.replace(/\D/g, "").length < 8) {
      setErr(t.auth.errPhone);
      return;
    }
    if (!finalName) {
      finalName = cleanEmail
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    login(finalName, cleanEmail);
    if (cleanPhone) updateUser({ phone: cleanPhone });
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    close();
  };

  // Demo social sign-in: on a static site there's no OAuth server, so each
  // provider connects instantly with a demo identity in this browser.
  const socialLogin = (provider: "google" | "facebook" | "instagram") => {
    const ids = {
      google: { n: "Google Student", e: "student.google@gmail.com" },
      facebook: { n: "Facebook Student", e: "student.facebook@fb.com" },
      instagram: { n: "Instagram Student", e: "student.ig@instagram.com" },
    } as const;
    login(ids[provider].n, ids[provider].e);
    close();
    router.push("/dashboard/");
  };

  const input =
    "mt-2 w-full rounded-xl border border-line/15 bg-ink-900/70 px-4 py-3.5 text-sm text-bone-50 placeholder:text-bone-500/60 backdrop-blur focus:border-mint/60 focus:outline-none";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, display: "grid" }}
          // display:none at exit-end is the safety net: even if the fade is
          // ever interrupted, the backdrop can never linger invisibly and
          // swallow every click on the page.
          exit={{ opacity: 0, transitionEnd: { display: "none" } }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-ink-900/60 p-4 backdrop-blur-xl"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={isRegister ? t.auth.registerTitle : t.auth.loginTitle}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line/20 bg-ink-800/60 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl md:p-10"
          >
            {/* glass sheen */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgb(var(--mint) / 0.14) 0%, transparent 40%, rgb(var(--electric) / 0.1) 100%)",
              }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-noise opacity-[0.05]" />

            <button
              type="button"
              onClick={close}
              aria-label={t.common.close}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-line/15 text-bone-400 transition-colors hover:border-mint/50 hover:text-mint"
            >
              ✕
            </button>

            <div className="relative">
              <p className="text-xs uppercase tracking-ultra text-mint">
                {isRegister ? t.nav.startFree : t.nav.login}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-bone-50">
                {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
              </h2>
              <p className="mt-2 text-sm text-bone-400">
                {isRegister ? t.auth.registerSub : t.auth.loginSub}
              </p>

              <form onSubmit={submit} className="mt-6">
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
                      className={input}
                      autoComplete="name"
                    />
                  </label>
                )}
                <label className={`block ${isRegister ? "mt-5" : ""}`}>
                  <span className="text-xs uppercase tracking-ultra text-bone-500">
                    {t.auth.email}
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.auth.emailPh}
                    className={input}
                    autoComplete="email"
                    required
                  />
                </label>
                {isRegister && (
                  <label className="mt-5 block">
                    <span className="text-xs uppercase tracking-ultra text-bone-500">
                      {t.auth.phone}
                    </span>
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.auth.phonePh}
                      className={input}
                      autoComplete="tel"
                      required
                    />
                  </label>
                )}
                <label className="mt-5 block">
                  <span className="text-xs uppercase tracking-ultra text-bone-500">
                    {t.auth.password}
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth.passwordPh}
                    className={input}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    required
                  />
                </label>

                {err && <p className="mt-4 text-sm text-mint">{err}</p>}

                <button type="submit" className="btn btn-primary mt-7 w-full py-4">
                  {isRegister ? t.auth.registerBtn : t.auth.loginBtn}
                </button>
              </form>

              {/* social sign-in (demo — instant connect in this browser) */}
              <div className="mt-5 flex items-center gap-3">
                <span className="h-px grow bg-line/15" />
                <span className="text-[10px] uppercase tracking-ultra text-bone-500">
                  {t.auth.socialLabel}
                </span>
                <span className="h-px grow bg-line/15" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => socialLogin("google")}
                  aria-label="Continue with Google"
                  className="glass flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-bone-100 transition-colors hover:border-mint/50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.45 1.8 14.97.75 12 .75 7.31.75 3.26 3.44 1.28 7.35l3.66 2.84C5.9 7.31 8.7 5.04 12 5.04Z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.55 5.55 0 0 1-2.4 3.58l3.72 2.89c2.17-2.01 3.7-4.98 3.7-8.71Z" />
                    <path fill="#FBBC05" d="M4.94 14.31a6.9 6.9 0 0 1 0-4.12L1.28 7.35a11.24 11.24 0 0 0 0 10.05l3.66-2.84Z" />
                    <path fill="#34A853" d="M12 23.25c3.04 0 5.6-1 7.46-2.72l-3.72-2.89c-1.03.7-2.36 1.1-3.74 1.1-3.3 0-6.1-2.27-7.06-5.34l-3.66 2.84c1.98 3.91 6.03 6.6 10.72 6.6Z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => socialLogin("facebook")}
                  aria-label="Continue with Facebook"
                  className="glass flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-bone-100 transition-colors hover:border-mint/50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
                    <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12Z" />
                  </svg>
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => socialLogin("instagram")}
                  aria-label="Continue with Instagram"
                  className="glass flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-bone-100 transition-colors hover:border-mint/50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#igGrad)" strokeWidth="2" aria-hidden>
                    <defs>
                      <linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FD5949" />
                        <stop offset="50%" stopColor="#D6249F" />
                        <stop offset="100%" stopColor="#285AEB" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="url(#igGrad)" stroke="none" />
                  </svg>
                  Instagram
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-bone-500">
                {t.auth.socialNote}
              </p>

              {/* one-tap demo accounts — student is pre-seeded, admin opens the studio */}
              <div className="mt-6 flex items-center gap-3">
                <span className="h-px grow bg-line/15" />
                <span className="text-[10px] uppercase tracking-ultra text-bone-500">
                  {t.auth.previewLabel}
                </span>
                <span className="h-px grow bg-line/15" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    loginAs("student");
                    close();
                    router.push("/dashboard/");
                  }}
                  className="btn btn-ghost px-4 py-3 text-sm"
                >
                  ✦ {t.auth.previewStudent}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginAs("admin");
                    close();
                    router.push("/admin/");
                  }}
                  className="btn border border-electric/40 bg-electric/10 px-4 py-3 text-sm text-electric hover:bg-electric/20"
                >
                  ⌘ {t.auth.previewAdmin}
                </button>
              </div>

              <p className="mt-5 text-center text-sm text-bone-400">
                {isRegister ? t.auth.orLogin : t.auth.orRegister}{" "}
                <button
                  type="button"
                  onClick={() => setMode(isRegister ? "login" : "register")}
                  className="link-underline text-mint"
                >
                  {isRegister ? t.auth.loginLink : t.auth.registerLink}
                </button>
              </p>

              {/* agencies & teams don't need an account — straight to training */}
              <p className="mt-3 text-center text-sm text-bone-400">
                {t.auth.teamPrompt}{" "}
                <button
                  type="button"
                  onClick={() => {
                    close();
                    router.push("/training/");
                  }}
                  className="link-underline text-electric"
                >
                  {t.auth.teamLink}
                </button>
              </p>

              <p className="mt-5 border-t border-line/10 pt-4 text-center text-[11px] leading-relaxed text-bone-500">
                {t.auth.demoNote}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
