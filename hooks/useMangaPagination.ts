"use client";

import { useState, useMemo, useEffect } from "react";
import type { VocabEntry} from "@/lib/vocab";

const ENTRIES_PER_PAGE = 6;

export function useMangaPagination(entries: VocabEntry[]) {
    const [page, setPage] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [entries]);

    const totalPages = Math.ceil(entries.length / ENTRIES_PER_PAGE);
    const currentEntries = useMemo(() => {
        const start = page * ENTRIES_PER_PAGE;
        return entries.slice(start, start + ENTRIES_PER_PAGE);
    }, [entries, page]);

    const nextPage = () => setPage((p) => Math.min(p + 1, totalPages - 1));
    const prevPage = () => setPage((p) => Math.max(p - 1, 0));
    const isFirst = page === 0;
    const isLast = page === totalPages - 1;

    return {
        currentEntries,
        page, 
        totalPages,
        nextPage,
        prevPage,
        isFirst,
        isLast
    };
}
