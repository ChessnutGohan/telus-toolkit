"use client";

import React from "react";
import { mangaLayouts } from "@/lib/mangaLayout";
import { vocab, VocabEntry } from "@/lib/vocab";

/* STREAMING_CHUNK:Defining MangaPanelGrid props... */
interface Props {
entries: VocabEntry[];
activeLayout: number;
}

export default function MangaPanelGrid({ entries, activeLayout }: Props) {
/* STREAMING_CHUNK:Selecting active layout config... */
  const layout = mangaLayouts[activeLayout] || mangaLayouts[0];

  return (
    <div
    className="grid gap-3 md:gap-5 mt-8 p-4 md:p-8 bg-white border-[8px] border-black shadow-[8px_8px_0_0_#000]"
    style={{
    gridTemplateColumns: layout.gridTemplateColumns,
    gridTemplateRows: layout.gridTemplateRows,
    gridTemplateAreas: layout.gridTemplateAreas,
    // Screentone effect
    backgroundImage: "radial-gradient(#00000015 1px, transparent 1px)",
    backgroundSize: "8px 8px",
    }}
    >
    {/* STREAMING_CHUNK:Rendering dynamic manga panels... */}
    {layout.areas.map((areaName, i) => {
    const entry = entries[i];

        // Gracefully hide empty panels if there are fewer than 10 entries
        if (!entry) return null; 

        return (
          <div
            key={areaName}
            // `container-type: inline-size` allows us to use @container queries or `cqw` to auto-scale font 
            // relative to the panel's spanned width in the CSS grid.
            className="relative border-[4px] border-black bg-white p-4 md:p-6 shadow-[4px_4px_0_0_#000] flex flex-col justify-center items-center text-center overflow-hidden z-10"
            style={{
              gridArea: areaName,
              transform: i % 2 === 0 ? "rotate(-0.5deg)" : "rotate(0.5deg)",
              /*clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",*/
              containerType: "inline-size", 
            }}
          >
            {/* Term: Scales automatically with cqw based on panel width */}
            <h3 
              className="font-bold text-black mb-2 leading-none"
              style={{ 
                fontFamily: "'Caveat', cursive", 
                fontSize: "clamp(1.75rem, 8cqw, 4rem)" 
              }}
            >
              {entry.termFr}
            </h3>
            
            <p className="text-black/90 font-medium italic mb-3 text-sm md:text-base leading-snug max-w-[90%]">
              {entry.defFr}
            </p>
            
            <p className="font-mono text-xs md:text-sm font-bold text-black/70 mt-auto pt-2 border-t-2 border-black/10 w-full">
              {entry.termEn}
            </p>
          </div>
        );
      })}
    </div>


    );
}