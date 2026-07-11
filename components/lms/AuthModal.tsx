"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { login, loginAs, useStore } from "@/lib/store";

type Mode = "login" | "register";
type Joining = "student" | "team";

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
  const [joining, setJoining] = useState<Joining>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    if (!finalName) {
      finalName = cleanEmail
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    login(finalName, cleanEmail);
    setName("");
    setEmail("");
    setPassword("");
    close();
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

              {/* account type — the sitemap's "account type" step, one tap */}
              {isRegister && (
                <div className="mt-6">
                  <span className="text-xs uppercase tracking-ultra text-bone-500">
                    {t.auth.accountType}
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-line/15 bg-ink-900/60 p-1.5">
                    {(
                      [
                        { id: "student", label: t.auth.typeStudent },
                        { id: "team", label: t.auth.typeTeam },
                      ] as { id: Joining; label: string }[]
                    ).map((o) => (
                      // NOTE: no layoutId here — a shared-layout pill inside an
                      // AnimatePresence overlay can stall the exit animation and
                      // leave an invisible click-eating backdrop over the site.
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setJoining(o.id)}
                        className={`relative rounded-lg px-3 py-2.5 text-sm transition-colors duration-300 ${
                          joining === o.id
                            ? "text-white"
                            : "text-bone-300 hover:text-bone-50"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 rounded-lg transition-opacity duration-300 [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))] ${
                            joining === o.id ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <span className="relative">{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isRegister && joining === "team" ? (
                <div className="mt-6 rounded-2xl border border-electric/30 bg-electric/5 p-6 text-center">
                  <p className="text-sm leading-relaxed text-bone-300">
                    {t.auth.teamNote}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      router.push("/training/");
                    }}
                    className="btn mt-5 w-full bg-electric py-3.5 text-ink-900"
                  >
                    {t.auth.teamCta}
                  </button>
                </div>
              ) : (
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
              )}

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
