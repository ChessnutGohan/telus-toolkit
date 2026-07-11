"use client";

import { usePathname } from "next/navigation";
import MangaOverlay from "@/components/MangaOverlay";
import { useMangaTransition } from "@/hooks/useMangaTransition";

export default function MangaRootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sectionKey = pathname === "/" ? "dashboard" : pathname.replace("/", "");
  const { isTransitioning, phase } = useMangaTransition(sectionKey);
  
  return (
    <>
        <MangaOverlay isTransitioning={isTransitioning} phase={phase} sectionKey={sectionKey} />
        {children}
    </> 
  );
}