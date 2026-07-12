"use client";

import React from "react";
import { getLayout } from "@/lib/mangaLayout";
import type { VocabEntry } from "@/lib/vocab";

interface Props {
  entries: VocabEntry[];
  layoutSeed: number;
}

export default function MangaPanelGrid({ entries, layoutSeed }: Props) {
  const layout = getLayout(entries.length, layoutSeed);

  return (
    <div
      className="w-full"
      style={{
        display: "grid",
        gridTemplateAreas: layout.gridTemplateAreas,
        gridTemplateColumns: layout.gridTemplateColumns,
        gridTemplateRows: layout.gridTemplateRows,
        gap: "6px",
        minHeight: "520px",
        background: "#000",
        padding: "6px",
        border: "6px solid #000",
        boxShadow: "8px 8px 0 #000",
      }}
    >
      {layout.areas.map((area, i) => {
        const entry = entries[i];
        if (!entry) return null;

        return (
          <div
            key={area}
            style={{
              gridArea: area,
              background: "#fff",
              backgroundImage: "radial-gradient(#00000012 1px, transparent 1px)",
              backgroundSize: "8px 8px",
              transform: `rotate(${layout.rotations[i] ?? 0}deg)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              textAlign: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Diagonal accent line — top right corner */}
            <div style={{
              position: "absolute",
              top: 0, right: 0,
              width: "40px", height: "4px",
              background: "#000",
              transform: "rotate(45deg) translate(8px, -8px)",
              transformOrigin: "right top",
            }} />

            <h3 style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "clamp(1rem, 3.5cqw, 2rem)",
              fontWeight: 700,
              color: "#000",
              lineHeight: 1.1,
              marginBottom: "6px",
            }}>
              {entry.termFr}
            </h3>

            <p style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(0.65rem, 2cqw, 0.85rem)",
              color: "#222",
              fontStyle: "italic",
              lineHeight: 1.4,
              maxWidth: "90%",
            }}>
              {entry.defFr}
            </p>

            <div style={{
              marginTop: "auto",
              paddingTop: "8px",
              borderTop: "1px solid #ccc",
              width: "100%",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "clamp(0.55rem, 1.5cqw, 0.7rem)",
              color: "#444",
              fontWeight: 600,
            }}>
              {entry.termEn}
            </div>
          </div>
        );
      })}
    </div>
  );
}