"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useVocab } from "@/hooks/useVocab";
import type { VocabEntry } from "@/lib/vocab";

const CATEGORIES = ["duration", "process", "status", "financing", "contact", "general"];

export default function AddVocabForm({ onClose }: { onClose: () => void }) {
    const { user } = useAuth();
    const { addEntry } = useVocab();
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const [ form, setForm ] = useState({
        termFr: "",
        termEn: "",
        defFr: "",
        defEn: "",
        category: CATEGORIES[0],
        related: "",
        note: "",
    });

    const handleSubmit = async () => {
        if (!form.termFr || !form.defFr) {
            setError("Terme FR et definition FR sont obligatoires");
            return;
        }
        setLoading(true);
        const success = await addEntry(
            form as Omit<VocabEntry, "id">,
            user ?? "anonymous"
        );

        if (success) {
            onClose();
        } else {
            setError("Error lors de l'ajout - ressayez");
        }
        setLoading(false);
    };

    const field = (
        key: keyof typeof form,
        label: string,
        placeholder: string,
        multiline = false
    ) => (
        <div className="flex flex-col gap-1">
            <label className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {label}
            </label>
            {multiline ? (
                <textarea
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    rows={3}
                    className="bg-ink border border-line px-3 py-2 font-body text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-signal resize-none"
                />
            ) : (
                <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="bg-ink border border-line px-3 py-2 font-body text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-signal"
                />
            )}
        </div>
    );

        return (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <div className="vocab-form bg-surface border border-line w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <div className="border-b border-line px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-base font-semibold text-ivory">
                            Nouveau terme
                            </h2>
                            <p className="font-mono text-[11px] text-muted mt-0.5">
                            Ajouté par {user}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="font-mono text-xs text-muted hover:text-ivory transition-colors"
                        >
                            ✕ FERMER
                        </button>
                    </div>

                    <div className="px-6 py-5 flex flex-col gap-4">
                        {field("termFr", "Terme FR *", "ex: Renouvellement")}
                        {field("termEn", "Terme EN", "ex: Renewal")}
                        {field("defFr", "Définition FR *", "Explication en français...", true)}
                        {field("defEn", "Définition EN", "English definition...", true)}

                    <div className="flex flex-col gap-1">
                        <label className="font-mono text-[11px] uppercase tracking-widest text-muted">
                            Catégorie
                        </label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                            className="bg-ink border border-line px-3 py-2 font-body text-sm text-ivory focus:outline-none focus:border-signal"
                        >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                        </select>
                    </div>

                    {field("related", "Lié à (optionnel)", "ex: engager — verbe")}
                    {field("note", "Note (optionnel)", "ex: À confirmer...", true)}

                    {error && (
                        <p className="font-mono text-xs text-amber">{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-signal text-ink font-mono text-sm font-semibold py-2.5 hover:bg-signal/80 transition-colors disabled:opacity-50"
                    >
                        {loading ? "AJOUT EN COURS..." : "AJOUTER LE TERME →"}
                    </button>
                </div>
            </div>
        </div>
    );
}