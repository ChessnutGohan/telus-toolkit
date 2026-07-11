"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";

export type TransitionPhase = "idle" | "flash" | "shake" | "tear-slam";

export function useMangaTransition(sectionKey: string) {
  const { mangaMode } = useTheme();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback(() => {
    if (!mangaMode) return;

    setIsTransitioning(true);
    setPhase("flash");

    // Phase 1: 150ms - Flash to Shake
    setTimeout(() => {
      setPhase("shake");
    }, 150);

    // Phase 2: 350ms (150+200) - Shake to Tear & Slam
    setTimeout(() => {
      setPhase("tear-slam");
    }, 350);

    // Phase 3: 1050ms - End Transition execution block
    setTimeout(() => {
      setPhase("idle");
      setIsTransitioning(false);
    }, 1050);

  }, [mangaMode]);

  // Execute transition trigger upon section key (route) mutation
  useEffect(() => {
    if (mangaMode) {
      triggerTransition();
    }
  }, [sectionKey, mangaMode, triggerTransition]);

  return { isTransitioning, phase, triggerTransition };
}