"use client";

import { useLang } from "@/context/LangContext";

export default function LangToggle() {
  const { lang, toggle, t } = useLang();

  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {t.langToggleLabel}
      </span>
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle language"
        className="relative flex h-8 w-16 items-center rounded-full border border-line bg-ink px-1 transition-colors"
      >
        <span
          className={[
            "absolute flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] font-semibold transition-transform duration-200",
            lang === "fr"
              ? "translate-x-0 bg-relay text-ink"
              : "translate-x-8 bg-signal text-ink",
          ].join(" ")}
        >
          {lang === "fr" ? "FR" : "EN"}
        </span>
      </button>
    </div>
  );
}
