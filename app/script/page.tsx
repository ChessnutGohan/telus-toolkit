"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { scriptLines } from "@/lib/script";
import PageHeader from "@/components/PageHeader";

const PHASES = ["all", "gretting", "verfication", "discovery", 
  "acknowledgement", "troubleshooting", "hold", "de-escalation",
  "boundaries", "closing"];

const PHASE_COLORS: Record<string, string> = {
  greeting: "#6FE7B0",
  verification: "#8D7FD6",
  discovery: "#F5B759",
  acknowledgement: "#6FE7B0",
  troubleshooting: "#F5B759",
  hold: "#8B7FD6",
  "de-escalation": "#ff6b6b",
  boundaries: "#ff6b6b",
  closing: "#6FE7B0",
};

export default function ScruptPage() {
  const { lang } = useLang();
  const [activePhase, setActivePhase] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = activePhase === "all"
    ? scriptLines
    : scriptLines.filter((l => l.phase === activePhase));

  const getText = (text: string) => {
    const frMatch = text.match(/FR:\s*(.*?)(?:\nEN:|$)/s);
    const enMatch = text.match(/EN:\s*(.*?)$/s);
    if (lang === "fr" && frMatch) return frMatch[1].trim();
    if (lang === "en" && enMatch) return enMatch[1].trim();
    return text;
  };

  return (
    <div>
      <PageHeader code="02 / SCRIPT" title="Script d'appel" lede="Phrases clés par phase - cliquez pour voir les détails." />
      {/* Phase filter */}

      <div className="flex flex-wrap gap-1 mb-6 w-full">
        {PHASES.map((phase) => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 transition-all flex-1 text-center"
            style={{
              background: activePhase === phase 
                ? (PHASE_COLORS[phase] || "#6FE7B0") 
                : "#f6f8fd",
              color: activePhase === phase ? "#000" : "#8B93A7",
              border: "none",
              borderLeft: `3px solid ${PHASE_COLORS[phase] || "#6FE7B0"}`,
              transform: activePhase === phase ? "translateX(4px) skewX(-5deg)" : "skewX(-5deg)",
              boxShadow: activePhase === phase ? `4px 4px 0px ${PHASE_COLORS[phase] || "#6FE7B0"}` : "none",
              transition: "all 0.15s cubic-bezier(0.19, 0.22, 1)",
            }}
          >
            {phase}
          </button>
        ))}
      </div>
      {/* Script Lines */}
      <div className="flex flex-col gap-2">
        {filtered.map((line) => (
          <div
            key={line.id}
            onClick={() => setExpanded(expanded === line.id ? null : line.id)}
            className="border border-line bg-surface rounded-none cursor-pointer hover:border-relay/60 transtion-colors"
            style={{
              borderLeft: `3px solit $(PHASE_COLORS[line.phase] || "#6FE7B0")`,
            }}
          >
            <div className="px-4 py-3 flex items-start gap-3">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest"
                  style={{
                    color: PHASE_COLORS[line.phase] || "#6FE7B0",
                  }}>
                    {line.phase}
                  </span>
                  {line.branchPoint && (
                    <span className="font-mono text-[10px] text-amber px-1.5 py-0.5 border border-amber/40">
                      ⚡ branch
                    </span>
                  )}
                </div>
                <p className="font-body text-sm text-ivory leading-snug">
                  {getText(line.text)}
                </p>
              </div>
              <span className="font-mono text-xs text-muted mt-1 shrink-0">
                {expanded === line.id ? "▲" : "▼"}
              </span>
            </div>
            {expanded === line.id && (
              <div className="px-4 pb-3 border-t border-line">
                {/*Show both languages*/}
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {line.text.includes("FR:") && (
                    <div>
                      <span className="font-mono text-[10px] text-muted uppercase tracking-widest">FR</span>
                      <p className="font-body text-sm text-ivory mt-0.5">
                        {line.text.match(/FR:\s*(.*?)(?:\nEN:|$)/s)?.[1]?.trim()}
                      </p>
                    </div>
                  )}
                  {line.text.includes("EN:") && (
                    <div>
                      <span className="font-mono text-[10px] text-muted uppercase tracking-widest">EN</span>
                      <p className="font-body text-sm text-muted mt-0.5 italic">
                        {line.text.match(/EN:\s*(.*?)$/s)?.[1]?.trim()}
                      </p>
                    </div>
                  )}
                </div>
                {line.note && (
                  <p className="mt-2 font-mono text-[11px] text-amber border-t border-line pt-2">
                    💡 {line.note}
                  </p>
                )}
                <p className="mt-1 font-mono text-[10px] text-muted">
                  {line.id}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}