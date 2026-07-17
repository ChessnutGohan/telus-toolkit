"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import { DICTEE_ENTRIES, DicteeEntry } from "@/lib/dicteeEntries";

type FocusField = "adresse" | "telephone" | "postal" | "all";
type Progress = { item_id: string; attempts: number; best_score: number; completed: boolean; };

const DIGITS: Record<string, string> = {
  "0":"zéro","1":"un","2":"deux","3":"trois","4":"quatre",
  "5":"cinq","6":"six","7":"sept","8":"huit","9":"neuf",
};

function spellPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  const parts: string[] = [];
  for (let i = 0; i < 3;  i++) parts.push(DIGITS[d[i]] ?? d[i]);
  parts.push("...");
  for (let i = 3; i < 6;  i++) parts.push(DIGITS[d[i]] ?? d[i]);
  parts.push("...");
  for (let i = 6; i < 10; i++) parts.push(DIGITS[d[i]] ?? d[i]);
  return parts.join(", ");
}

function spellPostal(code: string): string {
  return code.toUpperCase().split("").map(c => {
    if (c === " ") return "espace";
    if (DIGITS[c])  return DIGITS[c];
    return `${c} majuscule`;
  }).join(", ");
}

function buildSpeech(entry: DicteeEntry, civility: string, focus: FocusField, spell: boolean): string {
  const parts = [`Bonjour ${civility}.`];
  if (focus === "all" || focus === "adresse") {
    parts.push(`Mon adresse est : ${entry.adresse}.`);
    const num = entry.adresse.match(/^\d+/)?.[0] ?? "";
    if (spell) parts.push(`Je vais épeler le numéro : ${num.split("").map(c => DIGITS[c] ?? c).join(", ")}.`);
    if (spell) parts.push(`La rue : ${entry.adresse.replace(/^\d+\s*/, "")}.`);
  }
  if (focus === "all" || focus === "telephone") {
    parts.push(`Mon numéro de téléphone est : ${entry.telephone}.`);
    if (spell) parts.push(`Je vais épeler : ${spellPhone(entry.telephone)}.`);
  }
  if (focus === "all" || focus === "postal") {
    parts.push(`Mon code postal est : ${entry.postal}.`);
    if (spell) parts.push(`Je vais épeler : ${spellPostal(entry.postal)}.`);
  }
  return parts.join(" ");
}
type CharResult = { char: string; status: "correct"|"wrong"|"missing" };

function diffLetters(input: string, target: string): CharResult[] {
  return Array.from({ length: target.length }, (_, i) => {
    const t = target[i]; const inp = input[i] ?? "";
    if (!inp) return { char: t, status: "missing" as const };
    if (inp.toLowerCase() === t.toLowerCase()) return { char: t, status: "correct" as const };
    return { char: t, status: "wrong" as const };
  });
}

function calcScore(input: string, target: string): number {
  if (!target) return 0;
  let c = 0;
  for (let i = 0; i < target.length; i++)
    if ((input[i] ?? "").toLowerCase() === target[i].toLowerCase()) c++;
  return Math.round((c / target.length) * 100);
}

const FIELD_COLOR:  Record<string, string> = { adresse:"#6FE7B0", telephone:"#8B7FD6", postal:"#F5B759" };
const FIELD_LABEL:  Record<string, string> = { adresse:"Adresse",  telephone:"Téléphone", postal:"Code postal" };
const FIELD_PLACEHOLDER: Record<string, string> = {
  adresse:"Ex: 1245 rue Saint-Denis, Montréal, Québec",
  telephone:"Ex: 514-555-0198", postal:"Ex: H2X 3K4",
};

function DiffRow({ label, input, target, color }: { label:string; input:string; target:string; color:string }) {
  const diff = diffLetters(input, target);
  const score = calcScore(input, target);
  return (
    <div style={{ marginBottom:"12px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
        <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"9px", color, textTransform:"uppercase", letterSpacing:"0.2em" }}>{label}</span>
        <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"12px", fontWeight:700, color: score>=90?"#6FE7B0":score>=60?"#F5B759":"#ff6b6b" }}>{score}%</span>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"1px", padding:"8px", background:"#0a0a14", borderLeft:`3px solid ${color}` }}>
        {diff.map((d,i) => (
          <span key={i} style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"15px", fontWeight:700,
            color: d.status==="correct"?"#6FE7B0":d.status==="wrong"?"#ff6b6b":"#333" }}>{d.char}</span>
        ))}
      </div>
    </div>
  );
}


export default function DicteePage() {
  const { lang } = useLang();
  const { user }  = useAuth();
  const [idx,      setIdx]      = useState(0);
  const [speed,    setSpeed]    = useState(1.0);
  const [focus,    setFocus]    = useState<FocusField>("all");
  const [inputs,   setInputs]   = useState({ adresse:"", telephone:"", postal:"" });
  const [revealed, setRevealed] = useState(false);
  const [playing,  setPlaying]  = useState(false);
  const [civility, setCivility] = useState("madame");
  const [progress, setProgress] = useState<Progress[]>([]);
  const [spell, setSpell] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const entry = DICTEE_ENTRIES[idx];
  const total = DICTEE_ENTRIES.length;
  const activeFields = (focus === "all" ? ["adresse","telephone","postal"] : [focus]) as (keyof DicteeEntry)[];

  useEffect(() => {
    setCivility(Math.random() > 0.5 ? "madame" : "monsieur");
    setInputs({ adresse:"", telephone:"", postal:"" });
    setRevealed(false); setPlaying(false);
    window.speechSynthesis?.cancel();
  }, [idx]);

  useEffect(() => {
    if (!user) return;
    supabase.from("dictee_progress").select("*").eq("username", user)
      .then(({ data }) => { if (data) setProgress(data); });
  }, [user]);

  const getProgress = (id: string) => progress.find(p => p.item_id === id);

  const speak = useCallback(() => {
    if (!entry) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(buildSpeech(entry, civility, focus, spell));
    utt.lang = "fr-CA"; utt.rate = speed;
    utt.onstart = () => setPlaying(true);
    utt.onend   = () => { setPlaying(false); inputRef.current?.focus(); };
    window.speechSynthesis.speak(utt);
  }, [entry, civility, speed, focus, spell]);

  const stop = () => { window.speechSynthesis.cancel(); setPlaying(false); };

  const calcOverall = () => {
    const scores = activeFields.map(f => calcScore(inputs[f as keyof typeof inputs], entry?.[f] ?? ""));
    return Math.round(scores.reduce((a,b) => a+b, 0) / scores.length);
  };

  const saveProgress = async () => {
    if (!user || !entry) return;
    const score = calcOverall();
    const existing = getProgress(entry.id);
    const best = Math.max(existing?.best_score ?? 0, score);
    await supabase.from("dictee_progress").upsert({
      username: user, item_id: entry.id, category: "complet",
      attempts: (existing?.attempts ?? 0) + 1, best_score: best,
      completed: best >= 90, last_attempt: new Date().toISOString(),
    }, { onConflict: "username,item_id" });
    setProgress(prev => {
      const without = prev.filter(p => p.item_id !== entry.id);
      return [...without, { item_id: entry.id, attempts: (existing?.attempts??0)+1, best_score: best, completed: best>=90 }];
    });
  };

  const handleReveal = () => { setRevealed(true); saveProgress(); };
  const handleNext   = () => { stop(); setIdx(i => (i+1) % total); };
  const handlePrev   = () => { stop(); setIdx(i => (i-1+total) % total); };

  const totalDone = progress.filter(p => p.completed).length;
  const entryProg = entry ? getProgress(entry.id) : null;
  const hasInput  = activeFields.some(f => inputs[f as keyof typeof inputs]);

  if (!entry) return (
    <div style={{ padding:"40px", textAlign:"center", fontFamily:"var(--font-mono,monospace)", color:"#8B93A7" }}>
      Aucune entrée — ajoute des données dans <code>lib/dicteeEntries.ts</code>
    </div>
  );

  const btnBase: React.CSSProperties = {
    fontFamily:"var(--font-mono,monospace)", fontSize:"10px", letterSpacing:"0.15em",
    textTransform:"uppercase", padding:"8px 16px", background:"transparent",
    color:"#8B93A7", border:"1px solid #2C3040", cursor:"pointer",
    clipPath:"polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
  };

  return (
    <div style={{ maxWidth:"720px", margin:"0 auto" }}>
      <PageHeader code="05 / DICTÉE" title="Dictée québécoise"
        lede="Écoute, transcris, améliore — une entrée complète à la fois." />

      {user && (
        <div style={{ marginBottom:"20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
            <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"9px", color:"#8B93A7", textTransform:"uppercase", letterSpacing:"0.2em" }}>PROGRESSION</span>
            <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"9px", color:"#6FE7B0" }}>{totalDone} / {total}</span>
          </div>
          <div style={{ height:"3px", background:"#1a1a2e" }}>
            <div style={{ height:"100%", background:"#6FE7B0", width:`${(totalDone/total)*100}%`, transition:"width 0.4s" }} />
          </div>
        </div>
      )}

      <div style={{ display:"flex", gap:"6px", marginBottom:"20px", flexWrap:"wrap" }}>
        {(["all","adresse","telephone","postal"] as const).map(f => {
          const color = FIELD_COLOR[f] || "#6FE7B0";
          const active = focus === f;
          return (
            <button key={f} onClick={() => setFocus(f)} style={{
              ...btnBase, padding:"5px 12px", fontSize:"9px",
              background: active ? color : "transparent",
              color: active ? "#000" : "#8B93A7",
              border:`1px solid ${active ? color : "#2C3040"}`,
              borderLeft:`3px solid ${color}`,
            }}>
              {f === "all" ? (lang==="fr"?"Tout":"All") : FIELD_LABEL[f]}
            </button>
          );
        })}
      </div>

      <div style={{ border:"1px solid #2C3040", background:"#14161C", padding:"24px", boxShadow:"4px 4px 0px #cc0000" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"9px", color:"#444" }}>{entry.id}</span>
            {entryProg?.completed && <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"9px", color:"#6FE7B0" }}>✓ COMPLÉTÉ</span>}
            {entryProg && <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"9px", color:"#444" }}>MEILLEUR: {entryProg.best_score}%</span>}
          </div>
          <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"10px", color:"#444" }}>{idx+1} / {total}</span>
        </div>

        <div style={{ display:"flex", gap:"6px", marginBottom:"16px", alignItems:"center" }}>
          <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"9px", color:"#8B93A7", textTransform:"uppercase", letterSpacing:"0.15em" }}>VITESSE</span>
          {[0.75, 1.0, 1.25].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{
              fontFamily:"var(--font-mono,monospace)", fontSize:"10px", padding:"3px 10px",
              background: speed===s?"#F5B759":"transparent", color: speed===s?"#000":"#8B93A7",
              border:`1px solid ${speed===s?"#F5B759":"#2C3040"}`, cursor:"pointer",
              clipPath:"polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
            }}>x{s}</button>
          ))}
        </div>
        <button onClick={() => setSpell(s => !s)} style={{
          ...btnBase,
          background: spell ? "#6FE7B0" : "transparent",
          color: spell ? "#000" : "#8B93A7",
          border:`1px solid ${spell ? "#6FE7B0" : "#2C3040"}`,
          cursor:"pointer",
          clipPath:"polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
        }}>
          {spell ? "✓ EPILER" : "X EPILER"}
        </button>

        <button onClick={playing ? stop : speak} style={{
          width:"100%", padding:"14px",
          background: playing?"#330000":"#cc0000", color:"#fff",
          border:`2px solid ${playing?"#ff4444":"#cc0000"}`,
          fontFamily:"var(--font-mono,monospace)", fontSize:"12px",
          letterSpacing:"0.2em", textTransform:"uppercase",
          cursor:"pointer", marginBottom:"20px",
          clipPath:"polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
          boxShadow: playing?"0 0 20px #cc000066":"4px 4px 0px #660000",
          transition:"all 0.15s",
        }}>{playing ? "⏹ ARRÊTER" : "▶ ÉCOUTER"}</button>

        <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"16px" }}>
          {activeFields.map((f, i) => (
            <div key={f}>
              <label style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"9px", color:FIELD_COLOR[f], textTransform:"uppercase", letterSpacing:"0.2em", display:"block", marginBottom:"5px" }}>
                {FIELD_LABEL[f]}
              </label>
              <input
                ref={i === 0 ? inputRef : undefined}
                value={inputs[f as keyof typeof inputs]}
                onChange={e => setInputs(prev => ({ ...prev, [f]: e.target.value }))}
                onKeyDown={e => { if (e.key==="Enter" && !revealed) handleReveal(); }}
                disabled={revealed}
                placeholder={FIELD_PLACEHOLDER[f]}
                style={{
                  width:"100%", padding:"10px 14px", boxSizing:"border-box",
                  background:"#0a0a14", border:"1px solid #2C3040",
                  borderLeft:`3px solid ${FIELD_COLOR[f]}`,
                  color:"#EDEFF5", fontFamily:"var(--font-mono,monospace)",
                  fontSize:"13px", outline:"none",
                }}
              />
            </div>
          ))}
        </div>

        {revealed && (
          <div style={{ marginBottom:"16px" }}>
            <div style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"9px", color:"#8B93A7", textTransform:"uppercase", letterSpacing:"0.2em", marginBottom:"10px" }}>
              ANALYSE · <span style={{ color:"#6FE7B0" }}>CORRECT</span> · <span style={{ color:"#ff6b6b" }}>ERREUR</span> · <span style={{ color:"#333" }}>MANQUANT</span>
            </div>
            {activeFields.map(f => (
              <DiffRow key={f} label={FIELD_LABEL[f]}
                input={inputs[f as keyof typeof inputs]}
                target={entry[f]} color={FIELD_COLOR[f]} />
            ))}
            <div style={{ textAlign:"right", marginTop:"8px" }}>
              <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"10px", color:"#8B93A7", marginRight:"8px" }}>SCORE GLOBAL</span>
              <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"22px", fontWeight:700,
                color: calcOverall()>=90?"#6FE7B0":calcOverall()>=60?"#F5B759":"#ff6b6b" }}>
                {calcOverall()}%
              </span>
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:"8px" }}>
          {!revealed ? (
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={handleReveal} disabled={!hasInput} style={{
                flex:1, padding:"12px",
                background: hasInput?"#F5B759":"#333", color: hasInput?"#000":"#666",
                border:"none", cursor: hasInput?"pointer":"not-allowed",
                fontFamily:"var(--font-mono,monospace)", fontSize:"11px",
                letterSpacing:"0.15em", textTransform:"uppercase",
                clipPath:"polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
              }}>RÉVÉLER</button>

              <button onClick={() => { setRevealed(true); saveProgress(); }} style={{
                flex:1, padding: "12px",
                background: "transparent", color: "#8B93A7",
                border: "1px solid #2C3040", cursor: "pointer",
                fontFamily: "var(--font-mono,monospace)", fontSize: "11px",
                letterSpacing: "0.15em", textTransform: "uppercase",
                clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
              }}>VOIR RÉPONSES</button>
            </div>
          ) : (
            <>
              <button onClick={() => { setInputs({ adresse:"", telephone:"", postal:"" }); setRevealed(false); }} style={{
                flex:1, padding:"12px", background:"transparent", color:"#8B93A7",
                border:"1px solid #2C3040", cursor:"pointer",
                fontFamily:"var(--font-mono,monospace)", fontSize:"11px",
                letterSpacing:"0.15em", textTransform:"uppercase",
                clipPath:"polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
              }}>RÉESSAYER</button>
              <button onClick={handleNext} style={{
                flex:2, padding:"12px", background:"#cc0000", color:"#fff",
                border:"none", cursor:"pointer",
                fontFamily:"var(--font-mono,monospace)", fontSize:"11px",
                letterSpacing:"0.15em", textTransform:"uppercase",
                clipPath:"polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
                boxShadow:"3px 3px 0px #660000",
              }}>SUIVANT →</button>
            </>
          )}
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", marginTop:"12px" }}>
        <button onClick={handlePrev} style={btnBase}>← PRÉCÉDENT</button>
        {!user && <span style={{ fontFamily:"var(--font-mono,monospace)", fontSize:"9px", color:"#333", alignSelf:"center" }}>Connectez-vous pour sauvegarder</span>}
        <button onClick={handleNext} style={btnBase}>SUIVANT →</button>
      </div>
    </div>
  );
}