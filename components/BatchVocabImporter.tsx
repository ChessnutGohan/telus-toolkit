"use client";

import { useState } from "react";
import { useGemini } from "@/hooks/useGemini";
import { useVocab } from "@/hooks/useVocab";
import { useAuth } from "@/context/AuthContext";
import type { VocabEntry } from "@/lib/vocab";

type ParsedEntry = Omit<VocabEntry, "id"> & { approved: boolean };

const CATEGORIES = ["duration", "process", "status", "financing", "contact", "general"];

export default function BatchVocabImporter({ onClose }: { onClose: () => void }) {
  const { ask, loading } = useGemini();
  const { addEntry } = useVocab();
  const { user } = useAuth();

  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<"input" | "review">("input");
  const [error, setError] = useState<string | null>(null);

  const handleAnalyse = async () => {
    if (!input.trim()) return;
    setError(null);

    const prompt = `Tu es un expert en français canadien et en terminologie Telus.
Pour chaque terme ou expression de cette liste, génère une entrée de vocabulaire.
Liste: ${input}

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après, sans backticks.
Format exact pour chaque entrée:
[
  {
    "termFr": "le terme en français",
    "termEn": "the term in english",
    "defFr": "définition courte en français (1-2 phrases)",
    "defEn": "short definition in english (1-2 sentences)",
    "category": "un de ces choix: duration, process, status, financing, contact, general",
    "related": "terme lié optionnel ou null",
    "note": "note optionnelle ou null"
  }
]`;

    const response = await ask(prompt, "batch", true);
    if (!response) {
      setError("Gemini n'a pas répondu. Réessaie.");
      return;
    }

    try {
      const clean = response.replace(/```json|```/g, "").trim();
      const data = JSON.parse(clean);
      setParsed(data.map((e: Omit<VocabEntry, "id">) => ({ ...e, approved: true })));
      setStep("review");
    } catch (e) {
      console.error("Raw Gemini response:", response);
      console.error("Parse error:", e);
      setError("Erreur de parsing JSON. Réessaie ou reformule ta liste.");
    }
  };

  const updateField = (i: number, field: keyof ParsedEntry, value: string) => {
    setParsed(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  };
  
  const [animating, setAnimating] = useState<Record<number, "accepting" | "rejecting">>({});

  const toggleApprove = (i: number, action: "accept" | "reject") => {
    setAnimating(prev => ({ ...prev, [i]: action === "accept" ? "accepting" : "rejecting" }));
    setTimeout(() => {
        setParsed(prev => prev.map((e, idx) => idx === i ? { ...e, approved: action === "accept" } : e));
        setAnimating(prev => { const n = { ...prev }; delete n[i]; return n; });
    }, 300);
  };
  const handleSave = async () => {
    setSaving(true);
    const toSave = parsed.filter(e => e.approved);
    for (const entry of toSave) {
      await addEntry(entry, user ?? "anonymous");
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-line w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="border-b border-line px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-ivory">
              {step === "input" ? "Importer en lot" : `Réviser — ${parsed.filter(e => e.approved).length}/${parsed.length} approuvés`}
            </h2>
            <p className="font-mono text-[11px] text-muted mt-0.5">
              {step === "input" ? "Colle tes termes, Gemini s'occupe du reste" : "Modifie ou rejette avant de sauvegarder"}
            </p>
          </div>
          <button onClick={onClose} className="font-mono text-xs text-muted hover:text-ivory">✕</button>
        </div>

        <div className="px-6 py-5">
          {step === "input" ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  Termes à importer (séparés par virgules ou sauts de ligne)
                </label>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={"certainement, absolument, je vous en prie\nbienvenue, merci de votre patience\nle forfait, la facturation..."}
                  rows={8}
                  className="bg-ink border border-line px-3 py-2 font-body text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-signal resize-none"
                />
              </div>

              {error && <p className="font-mono text-xs text-amber">{error}</p>}

              <button
                onClick={handleAnalyse}
                disabled={loading || !input.trim()}
                className="w-full bg-signal text-ink font-mono text-sm font-semibold py-2.5 hover:bg-signal/80 transition-colors disabled:opacity-50"
              >
                {loading ? "GEMINI ANALYSE..." : "ANALYSER AVEC GEMINI →"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {parsed.map((entry, i) => (
                <div
                  key={i}
                  className={`border p-4 transition-colors ${entry.approved ? "border-black bg-white" : "border-line bg-ink opacity-50"} ${animating[i] === "accepting" ? "card-accepting" : animating[i] === "rejecting" ? "card-rejecting" : ""}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-signal uppercase tracking-widest">
                      {entry.category}
                    </span>
                    <div className="flex gap-2">
                    <button
                        onClick={() => !entry.approved && toggleApprove(i, "accept")}
                        className={`font-mono text-xs px-3 py-1 border transition-colors ${
                        entry.approved ? "bg-signal border-signal text-ink" : "border-line text-muted"
                        }`}
                    >
                        ✓
                    </button>
                    <button
                        onClick={() => entry.approved && toggleApprove(i, "reject")}
                        className={`font-mono text-xs px-3 py-1 border transition-colors ${
                        !entry.approved ? "bg-amber border-amber text-ink" : "border-line text-muted"
                        }`}
                    >
                        ✗
                    </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-mono text-[10px] text-muted uppercase">FR</label>
                      <input
                        value={entry.termFr}
                        onChange={e => updateField(i, "termFr", e.target.value)}
                        className="w-full bg-ink border border-line px-2 py-1 font-body text-sm text-ivory mt-0.5 focus:outline-none focus:border-signal"
                        style={{ backgroundColor: '#fff', color: '#000', fontFamily: "var(--font-hand)" }}
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] text-muted uppercase">EN</label>
                      <input
                        value={entry.termEn}
                        onChange={e => updateField(i, "termEn", e.target.value)}
                        className="w-full bg-ink border border-line px-2 py-1 font-body text-sm text-ivory mt-0.5 focus:outline-none focus:border-signal"
                        style={{ backgroundColor: '#fff', color: '#000', fontFamily: "var(--font-hand)" }}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="font-mono text-[10px] text-muted uppercase">Déf. FR</label>
                      <textarea
                        value={entry.defFr}
                        onChange={e => updateField(i, "defFr", e.target.value)}
                        rows={2}
                        className="w-full bg-ink border border-line px-2 py-1 font-body text-sm text-ivory mt-0.5 focus:outline-none focus:border-signal resize-none"
                        style={{ backgroundColor: '#fff', color: '#000', fontFamily: "var(--font-hand)" }}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="font-mono text-[10px] text-muted uppercase">Déf. EN</label>
                      <textarea
                        value={entry.defEn}
                        onChange={e => updateField(i, "defEn", e.target.value)}
                        rows={2}
                        className="w-full bg-ink border border-line px-2 py-1 font-body text-sm text-ivory mt-0.5 focus:outline-none focus:border-signal resize-none"
                        style={{ backgroundColor: '#fff', color: '#000', fontFamily: "var(--font-hand)" }}
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] text-muted uppercase">Catégorie</label>
                      <select
                        value={entry.category}
                        onChange={e => updateField(i, "category", e.target.value)}
                        className="w-full bg-ink border border-line px-2 py-1 font-body text-sm text-ivory mt-0.5 focus:outline-none focus:border-signal"
                        style={{ backgroundColor: '#fff', color: '#000', fontFamily: "var(--font-hand)" }}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {entry.note && (
                      <div>
                        <label className="font-mono text-[10px] text-muted uppercase">Note</label>
                        <input
                          value={entry.note ?? ""}
                          onChange={e => updateField(i, "note", e.target.value)}
                          className="w-full bg-ink border border-line px-2 py-1 font-body text-sm text-ivory mt-0.5 focus:outline-none focus:border-signal"
                          style={{ backgroundColor: '#fff', color: '#000', fontFamily: "var(--font-hand)" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {error && <p className="font-mono text-xs text-amber">{error}</p>}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep("input")}
                  className="flex-1 border border-line text-muted font-mono text-sm py-2.5 hover:border-relay hover:text-ivory transition-colors"
                >
                  ← RETOUR
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || parsed.filter(e => e.approved).length === 0}
                  className="flex-2 bg-signal text-ink font-mono text-sm font-semibold py-2.5 px-6 hover:bg-signal/80 transition-colors disabled:opacity-50"
                >
                  {saving ? "SAUVEGARDE..." : `SAUVEGARDER ${parsed.filter(e => e.approved).length} TERMES →`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}