"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { VocabEntry } from "@/lib/vocab";

type SupabaseVocabRow = {
    id: string;
    term_fr: string;
    term_en: string;
    def_fr: string;
    def_en: string;
    category: string;
    related: string | null;
    note: string | null;
    added_by: string;
    created_at: string;
};

function rowToEntry(row: SupabaseVocabRow): VocabEntry {
    return {
        id: row.id,
        termFr: row.term_fr,
        termEn: row.term_en,
        defFr: row.def_fr,
        defEn: row.def_en,
        category: row.category as VocabEntry["category"],
        related: row.related ?? undefined,
        note: row.note ?? undefined,
    };
}

export function useVocab() {
    const [entries, setEntries] = useState<VocabEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEntries = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("vocabulary")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            setError(error.message);
        } else {
            setEntries((data as SupabaseVocabRow[]).map(rowToEntry));
        }
        setLoading(false);
    };

    const addEntry = async (
        entry: Omit<VocabEntry, "id">,
        addedBy: string
    ): Promise<boolean> => {
        const { error } = await supabase.from("vocabulary").insert({
            term_fr: entry.termFr,
            term_en: entry.termEn,
            def_fr: entry.defFr,
            def_en: entry.defEn,
            category: entry.category,
            related: entry.related ?? null,
            note: entry.note ?? null,
            added_by: addedBy,
        });

        if (error) {
            setError(error.message);
            return false;
        }
        await fetchEntries();
        return true;
    };

    const deleteEntry = async (id: string): Promise<boolean> => {
        const { error } = await supabase
            .from("vocabulary")
            .delete()
            .eq("id", id);

        if (error) {
            setError(error.message);
            return false;
        }

        await fetchEntries();
        return true;
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    return { entries, loading, error, addEntry, deleteEntry, refetch: fetchEntries };
}
    
