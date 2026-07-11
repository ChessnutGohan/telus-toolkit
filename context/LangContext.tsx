"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionary, type Lang } from "@/lib/i18n";

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: typeof dictionary[Lang];
};

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "telus-toolkit-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "fr" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  };

  const toggle = () => setLang(lang === "fr" ? "en" : "fr");

  const value = useMemo(
    () => ({ lang, setLang, toggle, t: dictionary[lang] }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
