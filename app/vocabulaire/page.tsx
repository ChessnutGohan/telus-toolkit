"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/context/LangContext";
import { useVocab } from "@/hooks/useVocab";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import PageHeader from "@/components/PageHeader";
import VocabCard from "@/components/VocabCard";
import MangaPanelGrid from "@/components/MangaPanelGrid";
import AddVocabForm from "@/components/AddVocabForm";
import { useMangaPagination } from "@/hooks/useMangaPagination";

export default function VocabulairePage() {
  const { entries, loading, error, addEntry, deleteEntry } = useVocab();
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const { t, lang } = useLang();
  const [query, setQuery] = useState("");

  const { mangaMode } = useTheme();
  const [layoutSeed, setLayoutSeed] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) => {
      const term = lang === "fr" ? entry.termFr : entry.termEn;
      const def = lang === "fr" ? entry.defFr : entry.defEn;
      return (
        term.toLowerCase().includes(q) ||
        def.toLowerCase().includes(q)
      );
    });
  }, [query, lang, entries]);

  const {
    currentEntries,
    page,
    totalPages,
    nextPage,
    prevPage,
    isFirst,
    isLast,
  } = useMangaPagination(filtered);

  const [flipping, setFlipping] = useState(false);

  const handleNext = () => {
    setFlipping(true);
    setTimeout(() => {
      nextPage();
      setFlipping(false);
    }, 200);
  }

  const handlePrev = () => {
    setFlipping(true);
    setTimeout(() => {
      prevPage()
      setFlipping(false);
    }, 200);
  };

  return (
    <div>
      <PageHeader code="01 / VOCABULAIRE" title={t.vocabTitle} lede={t.vocabLede} />
      {loading && (
        <p className="font-mono text-xs text-muted mb-4">
          Chargement...
        </p>
      )}

      {error && (
        <p className="font-mono text-xs text-muted mb-4">
          Erreur: {error}
        </p>
      )}
      <div className="flex items-center justify-between mb-6">

      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="mb-6 w-full max-w-sm rounded-md border border-line bg-surface px-3 py-2 font-body text-sm text-ivory placeholder:text-muted focus:border-relay focus:outline-none"
      />
      <button
        onClick={() => setShowForm(true)}
        className="ml-4 bg-signal text-ink font-mono text-xs font-semibold px-4 hover:bg-signal/80 transition-colors"
        >
        + AJOUTER
        </button>
      </div>
      {showForm && <AddVocabForm onClose={() => setShowForm(false)} />}
      {filtered.length === 0 ? (
        <p className="font-body text-sm text-muted">{t.noResults}</p>
      ) : (
        <div>
          {mangaMode && (
            <button
              onClick={() => setLayoutSeed((prev) => (prev + 1))}
              className="mb-4 px-6 py-3 bg-black text-white font-bold uppercase border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]"
              style={{ transform: "rotate(-1deg)" }}
            >
              🎲 Randomize Panel
            </button>
          )}
          {mangaMode ? (
            <div>
              <div className="relative">
                <div className={ flipping ? "manga-page-flip" : ""}>
                  <MangaPanelGrid entries={currentEntries} layoutSeed={layoutSeed + page * 7} />
                </div>
              
                <div
                  onClick={handleNext}
                  className="absolute left-0 top-0 w-16 h-full cursor-pointer z-10 flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <span className="font-display text-3xl text-black" style={{ fontFamily: "var(--font-hand)" }}>←</span>
                </div>

                <div
                    onClick={handlePrev}
                    className="absolute right-0 top-0 w-16 h-full cursor-pointer z-10 flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <span className="font-display text-3xl text-black" style={{ fontFamily: "var(--font-hand)" }}>→</span>
                </div>
            </div>
                <div className="flex items-center justify-between mt-6 px-2">
                  <span className="font-mono text-xs text-muted">
                    {page + 1} / {totalPages}
                  </span>
                  {!isFirst && (
                    <span className="font-display text-sm text-black italic" style={{ fontFamily: "var(--font-hand)" }}>
                      ← Autres mots
                    </span>
                  )}
                  {isLast && (
                    <span className="font-display text-sm text-black italic" style={{ fontFamily: "var(--font-hand)" }}>
                      Fin! ✓
                    </span>
                  )}
                </div>
              </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((entry) => (
                <VocabCard key={entry.id} entry={entry} onDelete={deleteEntry} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

