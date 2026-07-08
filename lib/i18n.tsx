"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { dict, type Lang } from "@/lib/dict";

type Ctx = {
  lang: Lang;
  t: (typeof dict)["en"];
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<Ctx>({
  lang: "en",
  t: dict.en,
  setLang: () => {},
  toggle: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // hydrate from storage after mount (SSR renders English)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "ar") setLangState("ar");
    } catch {}
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(
    () => setLangState((v) => (v === "en" ? "ar" : "en")),
    []
  );

  return (
    <LangContext.Provider value={{ lang, t: dict[lang], setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
