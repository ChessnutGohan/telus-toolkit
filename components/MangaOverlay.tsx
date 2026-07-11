"use client";

import { TransitionPhase } from "@/hooks/useMangaTransition";

interface MangaOverlayProps {
  isTransitioning: boolean;
  phase: TransitionPhase;
  sectionKey: string;
}

export default function MangaOverlay({ isTransitioning, phase, sectionKey }: MangaOverlayProps) {
  if (!isTransitioning) return null;

  // Dynamically maps the current route to your image assets in the public folder
  const imagePath = `/manga/${sectionKey}.png`;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden manga-overlay-container">
      {/* Phase 1: White Flash */}
      <div className={`absolute inset-0 bg-white transition-opacity duration-150 ${phase === 'flash' ? 'opacity-100' : 'opacity-0'}`} />

      {/* Phase 2/3: Speed Lines (Kept as CSS/SVG for procedural rendering, no image needed) */}
      <svg 
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className={`absolute inset-0 w-full h-full manga-speed-lines ${phase === 'tear-slam' ? 'active' : ''}`}
      >
        <g transform="translate(50,50)">
          {[...Array(16)].map((_, i) => (
            <polygon
              key={i}
              points="0,0 -100, -100 -90, -100"
              fill="black"
              transform={`rotate(${i * 22.5})`}
              opacity="0.8"
            />
          ))}
        </g>
      </svg>
      {/* Phase 3: Panel Tear & Silhouette Slam */}
      {phase === 'tear-slam' && (
        <div className="absolute inset-0 manga-tear-reveal flex flex-col items-center justify-center">
          {/* Thick Manga Frame */}
          <div className="absolute inset-4 border-8 border-black z-10 pointer-events-none rotate-1 bg-white opacity-10"></div>
          
          {/* External Image Asset Injection */}
          <img 
            src={imagePath} 
            alt={`${sectionKey} silhouette`}
            className="w-1/2 h-1/2 object-contain manga-slam-character z-20"
            onError={(e) => {
              // Failsafe: Hides broken image icon if the file is missing in your public folder
              e.currentTarget.style.display = 'none';
            }}
          />
          
          <div className="absolute bottom-1/4 right-1/4 text-black text-6xl font-black italic tracking-tighter manga-slam-text z-20">
            {sectionKey.toUpperCase()}!!
          </div>
        </div>
      )}
    </div>
  );
}