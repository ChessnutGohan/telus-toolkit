"use client";

import React, { useState } from "react";
import { getLayout } from "@/lib/mangaLayout";
import type { VocabEntry } from "@/lib/vocab";

interface Props {
  entries: VocabEntry[];
  layoutSeed: number;
}

export default function MangaPanelGrid({ entries, layoutSeed }: Props) {
  const layout = getLayout(entries.length, layoutSeed);

  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  }
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
              className={`flip-card ${flipped[entry.id] ? 'flipped' : ''}`}
              onClick={() => toggleFlip(entry.id)}
              style={{
                gridArea: area,
                overflow: "hidden",
                position: "relative",
                transform: `rotate(${layout.rotations[i] ?? 0}deg)`,
              }}
            >
            <div className="flip-card-inner" style={{
              background: "#fff",
              backgroundImage: "radial-gradient(#00000012 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}>
              <div className="flip-card-front">
                <h3 style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "clamp(1rem, 2.5cqw, 2rem)",
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

              <div className="flip-card-back">
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.65rem",
                  color: "#888",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}>
                  EN
                </span>
                <h3 style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "clamp(1rem, 3.5cqw, 1.8rem)",
                  fontWeight: 700,
                  color: "#000",
                  marginBottom: "8px",
                }}>
                  {entry.termEn}
                </h3>
                <p style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "clamp(0.65rem, 2cqw, 0.85rem)",
                  color: "#333",
                  fontStyle: "italic",
                  lineHeight: 1.4,
                  maxWidth: "90%",
                }}>
                  {entry.defEn}
                </p>
                <div style={{
                  marginTop: "auto",
                  paddingTop: "8px",
                  borderTop: "1px solid #ccc",
                  width: "100%",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.6rem",
                  color: "#888",
                }}>
                  Cliquer pour retoruner
                </div>
            </div>
          </div>
        </div>
      );
    })}
    </div>
  );
}