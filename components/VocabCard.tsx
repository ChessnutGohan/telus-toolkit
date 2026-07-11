"use client";

import type { VocabEntry } from "@/lib/vocab";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/auth";

const categoryColor: Record<VocabEntry["category"], string> = {
  duration: "bg-relay",
  process: "bg-signal",
  status: "bg-amber",
  financing: "bg-amber",
  contact: "bg-relay",
};

export default function VocabCard({ entry, onDelete }: { entry: VocabEntry; onDelete?: (id: string) => void }) {
  const { lang } = useLang();
  const term = lang === "fr" ? entry.termFr : entry.termEn;
  const crossTerm = lang === "fr" ? entry.termEn : entry.termFr;
  const def = lang === "fr" ? entry.defFr : entry.defEn;
  const { user } = useAuth();
  const admin = isAdmin(user ?? "");

  return (
    <div className="group relative rounded-lg border border-line bg-surface p-4 transition-colors hover:border-relay/60">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${categoryColor[entry.category]}`}
            aria-hidden
          />
          <h3 className="font-mono text-[15px] font-medium leading-snug text-ivory">
            {term}
          </h3>
        </div>
      </div>

      <p className="mt-2 font-body text-sm leading-relaxed text-muted">{def}</p>

      <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted/70">
        <span>{lang === "fr" ? "EN" : "FR"}</span>
        <span className="text-ivory/60">{crossTerm}</span>
      </div>

      {entry.related && (
        <p className="mt-2 font-body text-xs italic text-relay">{entry.related}</p>
      )}

      {entry.note && (
        <p className="mt-2 rounded border border-amber/30 bg-amber/5 px-2 py-1 font-body text-[11px] text-amber">
          {entry.note}
        </p>
      )}

      {admin && (
        <button
          onClick={() => onDelete?.(entry.id)}
          className="mt-2 font-mono text-[10px] text-red-400 hover:text-red-300 transition-colors"
        >
          x supprimer
        </button>
      )}
    </div>
  );
}
