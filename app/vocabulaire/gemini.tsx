"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import MangaPanelGrid from "@/components/MangaPanelGrid";
import VocabCard from "@/components/VocabCard";
import { vocab } from "@/lib/vocab";

export default function VocabulariePage() {
/* STREAMING_CHUNK:Initializing state and hooks... */
    const { mangaMode } = useTheme();
    const [activeLayout, setActiveLayout] = useState(0);

    /* STREAMING_CHUNK:Defining randomizer function... */
    const randomizeLayout = () => {
    setActiveLayout((prev) => (prev + 1) % 4);
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
                <VocabCard key={entry.id} entry={entry} />
            ))}
        </div>

        {mangaMode && (
            <button
                onClick={() => setActiveLayout((prev) => (prev + 1) % 4)}
                className="mb-4 px-6 py-3 bg-black text-white font-bold uppercase border-[4px] border-black shawdow-[4px_4px_0_0_rgba(0,0,0,2)]"
                style={{ transform: "rotate(-1deg)" }} 
            >
            🎲 Randomize Panel
            </button>
        )}

        {mangaMode ? (
            <MangaPanelGrid entries={filtered} activeLayout={activeLayout} />
        ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((entry) => (
                    <VocabCard key={entry.id} entry={entry} />
                ))}
            </div>
        )}
      