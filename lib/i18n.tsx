"use client";

// Bilingual provider (EN / Fusha AR). The chosen language persists per
// browser and flips the document's lang + dir so the whole layout mirrors.
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

const KEY = "lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // restore the saved choice after mount (SSG ships English)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  // mirror the document for RTL + the Arabic font hook in globals.css
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }, []);

  const toggle = useCallback(
    () => setLang(lang === "en" ? "ar" : "en"),
    [lang, setLang]
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
