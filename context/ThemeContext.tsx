"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeContextValue = {
  mangaMode: boolean;
  toggleManga: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "telus-manga-mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mangaMode, setMangaModeState] = useState<boolean>(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "true") {
      setMangaModeState(true);
      document.documentElement.classList.add("manga-mode-active");
    }
  }, []);

  const toggleManga = () => {
    setMangaModeState((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      
      if (next) {
        document.documentElement.classList.add("manga-mode-active");
      } else {
        document.documentElement.classList.remove("manga-mode-active");
      }
      
      return next;
    });
  };

  const value = useMemo(
    () => ({ mangaMode, toggleManga }),
    [mangaMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}