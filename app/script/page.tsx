"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/context/LangContext";
import { scriptLines, ScriptLine } from "@/lib/script";
import PageHeader from "@/components/PageHeader";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHASES = [
  "all", "greeting", "verification", "discovery",
  "acknowledgement", "troubleshooting", "hold",
  "de-escalation", "boundaries", "closing",
];

const PHASE_COLORS: Record<string, string> = {
  greeting:        "#6FE7B0",
  verification:    "#8B7FD6",
  discovery:       "#F5B759",
  acknowledgement: "#6FE7B0",
  troubleshooting: "#F5B759",
  hold:            "#8B7FD6",
  "de-escalation": "#ff6b6b",
  boundaries:      "#ff6b6b",
  closing:         "#6FE7B0",
};

// ─── PDF Palettes ─────────────────────────────────────────────────────────────

const PHANTOM = {
  bg: "#100000", surface: "#1a0000", boxBg: "#180000",
  border: "#ffffff", shadow: "#cc0000", nameBg: "#cc0000",
  nameText: "#ffffff", body: "#f0e6e6", muted: "#aa8888",
  phase: "#ff4444", dot: "rgba(200,0,0,0.12)", accent: "#cc0000",
};

const MANGA_PALETTE = {
  bg: "#f5f5f0", surface: "#ffffff", boxBg: "#ffffff",
  border: "#000000", shadow: "#333333", nameBg: "#000000",
  nameText: "#ffffff", body: "#111111", muted: "#444444",
  phase: "#000000", dot: "rgba(0,0,0,0.08)", accent: "#000000",
};

type Palette = typeof PHANTOM;
type ColorMode = "phantom" | "manga";
type ViewMode  = "standard" | "royal";

const PROJECT_URL = "https://telus-toolkit.vercel.app";

const STANDARD_IDS = [
  "greeting-001",
  "verif-001",
  "disc-001",
  "disc-002",
  "ack-001",
  "ack-002",
  "bridge-001",
  "trouble-001",
  "hold-001",
  "hold-002",
  "hold-return-001",
  "hold-003",
  "resolution-001",
  "close-002",
  "close-003",
];

// ─── Glitch text hook ─────────────────────────────────────────────────────────

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#▓▒░█";
const BASE_TEXT    = "SUMMON";

function useGlitchText(active: boolean) {
  const [display, setDisplay] = useState(BASE_TEXT);
  useEffect(() => {
    if (!active) { setDisplay(BASE_TEXT); return; }
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      if (frame > 14) { setDisplay(BASE_TEXT); clearInterval(id); return; }
      setDisplay(
        BASE_TEXT.split("").map((c, i) =>
          i < frame / 2.5 ? c : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join("")
      );
    }, 40);
    return () => clearInterval(id);
  }, [active]);
  return display;
}

function P5DialogueBox({
  line, lang, viewMode, palette,
}: {
  line: ScriptLine; lang: "fr" | "en"; viewMode: ViewMode; palette: Palette;
}) {
  const phaseColor = PHASE_COLORS[line.phase] || "#6FE7B0";
  const fr = line.text.match(/FR:\s*(.*?)(?:\nEN:|$)/s)?.[1]?.trim() ?? line.text;
  const en = line.text.match(/EN:\s*(.*?)$/s)?.[1]?.trim() ?? line.text;
  const primary = lang === "fr" ? fr : en;

  // The real P5 box shape:
  // main body = trapezoid slanting right, left side has a jagged spike pointing left
  // right side has a separate detached arrow pointer
  // spike points: top-left corner jags inward then back out
  // W=820 H=100 (viewBox units), spike at x=0~40, body from x=30 to x=780, arrow from x=790

  return (
    <div style={{ position: "relative", marginBottom: "32px", paddingLeft: "8px" }}>
      {/* meta row above box */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px", paddingLeft: "48px" }}>
        <span style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: phaseColor, fontWeight: 700 }}>
          {line.phase}
        </span>
        {line.branchPoint && (
          <span style={{ fontFamily: "monospace", fontSize: "8px", color: "#F5B759", border: "1px solid #F5B759", padding: "1px 5px" }}>
            ⚡ BRANCH
          </span>
        )}
        <span style={{ fontFamily: "monospace", fontSize: "8px", color: palette.muted, marginLeft: "auto" }}>
          {line.id}
        </span>
      </div>

      <div style={{ position: "relative" }}>
        {/* SVG shell — border + shadow + spike + arrow pointer */}
        <svg
          viewBox="0 0 860 110"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          aria-hidden
        >
          {/* drop shadow layer */}
          <polygon
            points="38,6 820,0 836,104 22,110"
            fill={palette.shadow}
            transform="translate(6,6)"
          />
          {/* white border outer */}
          <polygon
            points="38,0 826,0 842,110 20,110  0,80  18,55  0,30"
            fill={palette.border}
          />
          {/* dark inner fill */}
          <polygon
            points="42,7 820,7 834,103 26,103  7,78  24,55  7,32"
            fill={palette.boxBg}
          />
          {/* halftone dot grid via pattern */}
          <defs>
            <pattern id={`dots-${line.id}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="7" cy="7" r="1.2" fill={palette.dot} />
            </pattern>
          </defs>
          <polygon
            points="42,7 820,7 834,103 26,103  7,78  24,55  7,32"
            fill={`url(#dots-${line.id})`}
          />
          {/* right arrow pointer — detached, white outline then dark fill */}
          <polygon points="836,30 860,55 836,80" fill={palette.border} />
          <polygon points="840,36 856,55 840,74" fill={palette.boxBg} />
        </svg>

        {/* name tag — sits on top-left of box */}
        <div style={{
          position: "absolute",
          top: "-14px",
          left: "44px",
          background: palette.nameBg,
          padding: "3px 18px 3px 10px",
          clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
          zIndex: 3,
        }}>
          <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: palette.nameText, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            AGENT
          </span>
        </div>

        {/* text content layer — positioned over the SVG */}
        <div style={{
          position: "relative",
          zIndex: 2,
          padding: "18px 72px 16px 56px",
          minHeight: "90px",
          display: "flex",
          alignItems: "center",
        }}>
          {viewMode === "standard" ? (
            <p style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, lineHeight: 1.55, color: palette.body, margin: 0 }}>
              {primary}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
              <div>
                <span style={{ fontFamily: "monospace", fontSize: "8px", color: palette.muted, textTransform: "uppercase", letterSpacing: "0.2em", display: "block", marginBottom: "2px" }}>FR</span>
                <p style={{ fontFamily: "sans-serif", fontSize: "13px", fontWeight: 600, lineHeight: 1.55, color: palette.body, margin: 0 }}>{fr}</p>
              </div>
              <div style={{ height: "1px", background: `${phaseColor}40` }} />
              <div>
                <span style={{ fontFamily: "monospace", fontSize: "8px", color: palette.muted, textTransform: "uppercase", letterSpacing: "0.2em", display: "block", marginBottom: "2px" }}>EN</span>
                <p style={{ fontFamily: "sans-serif", fontSize: "13px", lineHeight: 1.55, color: palette.muted, fontStyle: "italic", margin: 0 }}>{en}</p>
              </div>
              {line.note && (
                <div style={{ borderTop: `1px solid ${phaseColor}25`, paddingTop: "6px", display: "flex", gap: "5px" }}>
                  <span style={{ fontSize: "10px" }}>💡</span>
                  <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#F5B759", margin: 0, lineHeight: 1.5 }}>{line.note}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Export Modal ─────────────────────────────────────────────────────────────

function ExportModal({
  onClose, lang, allLines,
}: {
  onClose: () => void; lang: "fr" | "en"; allLines: ScriptLine[];
}) {
  const [colorMode, setColorMode]   = useState<ColorMode>("phantom");
  const [viewMode,  setViewMode]    = useState<ViewMode>("standard");
  const [phase,     setPhase]       = useState("all");
  const [generating, setGenerating] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const palette = colorMode === "phantom" ? PHANTOM : MANGA_PALETTE;

  const baseLines = viewMode === "standard"
    ? allLines.filter(l => STANDARD_IDS.includes(l.id))
    : allLines;

  const filtered = phase === "all" ? baseLines : baseLines.filter(l => l.phase === phase);

  const grouped: Record<string, ScriptLine[]> = {};
  filtered.forEach(l => { (grouped[l.phase] ??= []).push(l); });

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const el = captureRef.current;
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: palette.bg, useCORS: true, logging: false });
      const img    = canvas.toDataURL("image/png");
      const pdf    = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(img, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`telus-script_${colorMode}_${viewMode}_${lang}.pdf`);
    } catch {
      alert("Install deps first:\nnpm install jspdf html2canvas");
    } finally {
      setGenerating(false);
    }
  };

  // close on backdrop click
  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(10,0,0,0.75)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{
        background: "#14161C",
        border: "1px solid #2C3040",
        boxShadow: "6px 6px 0px #cc0000",
        width: "100%",
        maxWidth: "560px",
        maxHeight: "90vh",
        overflowY: "auto",
        clipPath: "polygon(16px 0%, 100% 0%, calc(100% - 4px) calc(100% - 4px), 4px calc(100% - 4px))",
        padding: "32px 28px 28px",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontSize: "22px", fontWeight: 700, color: "#EDEFF5",
              margin: 0, letterSpacing: "0.05em",
            }}>
              Script Export
            </h2>
            <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", color: "#8B93A7", margin: "4px 0 0" }}>
              Configure &amp; download
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "var(--font-mono, monospace)", fontSize: "11px",
              color: "#8B93A7", letterSpacing: "0.1em", padding: "4px 0",
            }}
          >
            × CERRAR
          </button>
        </div>

        {/* ── Option rows ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Palette */}
          <div>
            <p style={labelStyle}>PALETTE</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["phantom", "manga"] as ColorMode[]).map(m => (
                <button key={m} onClick={() => setColorMode(m)} style={optionBtn(colorMode === m, m === "phantom" ? "#cc0000" : "#8B7FD6")}>
                  {m === "phantom" ? "⬛ PHANTOM" : "🟣 MANGA"}
                </button>
              ))}
            </div>
          </div>

          {/* View mode */}
          <div>
            <p style={labelStyle}>MODE</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["standard", "royal"] as ViewMode[]).map(m => (
                <button key={m} onClick={() => setViewMode(m)} style={optionBtn(viewMode === m, "#F5B759", viewMode === m ? "#000" : undefined)}>
                  {m === "standard" ? "▶ STANDARD" : "★ ROYAL"}
                </button>
              ))}
            </div>
          </div>

          {/* Phase filter */}
          <div>
            <p style={labelStyle}>PHASE</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["all", ...PHASES.slice(1)].map(p => {
                const c = PHASE_COLORS[p] || "#6FE7B0";
                const active = phase === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPhase(p)}
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "9px", letterSpacing: "0.15em",
                      textTransform: "uppercase", padding: "4px 10px",
                      background: active ? c : "transparent",
                      color: active ? "#000" : "#8B93A7",
                      border: `1px solid ${active ? c : "#2C3040"}`,
                      borderLeft: `3px solid ${c}`,
                      cursor: "pointer",
                      transition: "all 0.1s",
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Line count */}
          <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "10px", color: "#8B93A7", margin: 0 }}>
            {filtered.length} line{filtered.length !== 1 ? "s" : ""} selected
          </p>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={generating}
          style={{
            marginTop: "28px",
            width: "100%",
            padding: "14px",
            background: generating ? "#333" : (colorMode === "phantom" ? "#cc0000" : "#8B7FD6"),
            color: "#fff",
            border: "none",
            cursor: generating ? "not-allowed" : "pointer",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "12px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
            boxShadow: generating ? "none" : "4px 4px 0px rgba(0,0,0,0.5)",
            transition: "all 0.15s",
          }}
        >
          {generating ? "⏳ GENERATING…" : "⬇ DOWNLOAD PDF"}
        </button>

        <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "9px", color: "#8B93A740", marginTop: "10px", textAlign: "center" }}>
          requires: npm install jspdf html2canvas
        </p>
      </div>

      {/* ── Hidden capture div (renders off-screen) ── */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, width: "900px" }}>
        <div
          ref={captureRef}
          style={{
            background: palette.bg,
            backgroundImage: `radial-gradient(circle, ${palette.dot} 1px, transparent 1px)`,
            backgroundSize: "18px 18px",
            padding: "44px 40px",
          }}
        >
          {/* project URL banner */}
          <div style={{
            marginBottom: "20px",
            padding: "7px 14px",
            background: palette.accent,
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
          }}>
            <span style={{ fontFamily: "monospace", fontSize: "9px", color: palette.nameText, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Full project scope →
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", color: palette.nameText, opacity: 0.85 }}>
              {PROJECT_URL}
            </span>
          </div>

          {/* PDF title header */}
          <div style={{ borderBottom: `2px solid ${palette.accent}`, paddingBottom: "18px", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: "9px", color: palette.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "6px" }}>
                TELUS TOOLKIT / 02 / SCRIPT D&apos;APPEL
              </div>
              <div style={{ fontFamily: "sans-serif", fontSize: "24px", fontWeight: 700, color: palette.body, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {viewMode === "royal" ? "★ ROYAL EDITION" : "▶ STANDARD"}
              </div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: palette.muted, textAlign: "right", lineHeight: 1.9 }}>
              <div>PALETTE: {colorMode.toUpperCase()}</div>
              <div>LANG: {lang.toUpperCase()}</div>
              <div>PHASE: {phase.toUpperCase()}</div>
              <div>LINES: {filtered.length}</div>
            </div>
          </div>

          {/* Lines */}
          {Object.entries(grouped).map(([ph, lines]) => (
            <div key={ph}>
              {/* Phase header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "28px 0 14px" }}>
                <div style={{ width: "3px", height: "24px", background: PHASE_COLORS[ph] || palette.accent, flexShrink: 0 }} />
                <span style={{ fontFamily: "sans-serif", fontSize: "16px", fontWeight: 700, color: palette.body, textTransform: "uppercase", letterSpacing: "0.15em" }}>{ph}</span>
                <div style={{ flex: 1, height: "1px", background: `${PHASE_COLORS[ph] || palette.accent}50` }} />
              </div>
              {lines.map(line => (
                <P5DialogueBox key={line.id} line={line} lang={lang} viewMode={viewMode} palette={palette} />
              ))}
            </div>
          ))}

          {/* Footer */}
          <div style={{ marginTop: "36px", paddingTop: "14px", borderTop: `1px solid ${palette.accent}40`, fontFamily: "monospace", fontSize: "9px", color: palette.muted, display: "flex", justifyContent: "space-between" }}>
            <span>TELUS TOOLKIT — OPERATOR CONSOLE</span>
            <span>E.N.D © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared micro-styles ──────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono, monospace)",
  fontSize: "9px", letterSpacing: "0.2em",
  textTransform: "uppercase", color: "#8B93A7",
  margin: "0 0 8px",
};

function optionBtn(active: boolean, activeColor: string, activeTextColor = "#fff"): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "10px", letterSpacing: "0.15em",
    textTransform: "uppercase", padding: "7px 16px",
    background: active ? activeColor : "transparent",
    color: active ? activeTextColor : "#8B93A7",
    border: `1px solid ${active ? activeColor : "#2C3040"}`,
    cursor: "pointer",
    clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
    transition: "all 0.12s",
  };
}

// ─── Summon Button ────────────────────────────────────────────────────────────

function SummonButton({ onClick }: { onClick: () => void }) {
  const [hovering, setHovering] = useState(false);
  const glitch = useGlitchText(hovering);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => { setPulse(p => !p); }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-label="Open script export"
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 200,
        background: hovering ? "#cc0000" : "#100000",
        border: `2px solid ${hovering ? "#ff4444" : "#cc0000"}`,
        color: hovering ? "#fff" : "#cc0000",
        fontFamily: "var(--font-mono, monospace)",
        fontSize: "11px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        padding: "10px 20px",
        cursor: "pointer",
        clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
        boxShadow: pulse && !hovering
          ? "0 0 18px #cc000066, 4px 4px 0px #cc000044"
          : hovering
          ? "0 0 28px #cc0000, 4px 4px 0px #660000"
          : "4px 4px 0px #cc000033",
        transition: "background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.4s",
        userSelect: "none",
      }}
    >
      {glitch}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ScriptPage() {
  const { lang } = useLang();
  const [activePhase, setActivePhase] = useState("all");
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [showExport,  setShowExport]  = useState(false);

  const filtered = activePhase === "all"
    ? scriptLines
    : scriptLines.filter(l => l.phase === activePhase);

  const getText = (text: string) => {
    const fr = text.match(/FR:\s*(.*?)(?:\nEN:|$)/s)?.[1]?.trim();
    const en = text.match(/EN:\s*(.*?)$/s)?.[1]?.trim();
    if (lang === "fr" && fr) return fr;
    if (lang === "en" && en) return en;
    return text;
  };

  return (
    <div>
      <PageHeader code="02 / SCRIPT" title="Script d'appel" lede="Phrases clés par phase — cliquez pour voir les détails." />

      {/* Phase filter */}
      <div className="flex flex-wrap gap-1 mb-6 w-full">
        {PHASES.map((phase) => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 transition-all flex-1 text-center"
            style={{
              background: activePhase === phase ? (PHASE_COLORS[phase] || "#6FE7B0") : "transparent",
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

      {/* Script lines */}
      <div className="flex flex-col gap-2">
        {filtered.map((line) => (
          <div
            key={line.id}
            onClick={() => setExpanded(expanded === line.id ? null : line.id)}
            className="border border-line bg-surface rounded-none cursor-pointer hover:border-relay/60 transition-colors"
            style={{ borderLeft: `3px solid ${PHASE_COLORS[line.phase] || "#6FE7B0"}` }}
          >
            <div className="px-4 py-3 flex items-start gap-3">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: PHASE_COLORS[line.phase] || "#6FE7B0" }}
                  >
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
                <p className="mt-1 font-mono text-[10px] text-muted">{line.id}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summon button (fixed bottom-right) */}
      <SummonButton onClick={() => setShowExport(true)} />

      {/* Export modal */}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          lang={lang}
          allLines={scriptLines}
        />
      )}
    </div>
  );
}