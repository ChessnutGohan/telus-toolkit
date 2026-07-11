"use client";

import { useTheme } from "@/context/ThemeContext";

export default function MangaToggle() {
  const { mangaMode, toggleManga } = useTheme();

  return (
    <button
      onClick={toggleManga}
      className={`w-full py-2 px-4 mt-2 font-bold text-sm transition-all border-2 
        ${mangaMode 
          ? 'bg-black text-white border-black hover:bg-gray-800' 
          : 'bg-transparent text-emerald-400 border-emerald-500 hover:bg-emerald-900'}`}
    >
      {mangaMode ? '🎭 Manga OFF' : '🎭 Manga'}
    </button>
  );
}