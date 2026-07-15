"use client";

import { useLang } from "@/lib/i18n";

// EN ⇄ ع switch — sits beside the theme toggle in the nav.
export default function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
      title={lang === "en" ? "العربية" : "English"}
      className="grid h-9 w-9 place-items-center rounded-full border border-line/15 text-sm font-semibold text-bone-300 transition-colors hover:border-mint/50 hover:text-mint"
    >
      {lang === "en" ? "ع" : "EN"}
    </button>
  );
}
