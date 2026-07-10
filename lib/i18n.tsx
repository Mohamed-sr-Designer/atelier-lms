"use client";

// English-only build (the Arabic option was removed by request). The provider
// keeps the same API shape so components using useLang() stay unchanged.
import { createContext, useContext } from "react";
import { dict, type Lang } from "@/lib/dict";

type Ctx = {
  lang: Lang;
  t: (typeof dict)["en"];
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const value: Ctx = {
  lang: "en",
  t: dict.en,
  setLang: () => {},
  toggle: () => {},
};

const LangContext = createContext<Ctx>(value);

export function LangProvider({ children }: { children: React.ReactNode }) {
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
