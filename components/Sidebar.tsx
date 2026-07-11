"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import { useLang } from "@/context/LangContext";
import LangToggle from "./LangToggle";
import MangaToggle from "./MangaToggle";
export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLang();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`flex h-full flex-col border-r border-line bg-surface transition-all duration-300
    ${collapsed ? 'w-16 min-w-16' : 'w-64 min-w-64'}`}>
     <div className="border-b border-line px-5 py-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_2px_rgba(111,231,176,0.6)]" />
          {!collapsed && (
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              {t.statusLive}
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="font-mono text-xs text-muted hover:text-ivory transition-colors"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {!collapsed && (
        <>
          <h1 className="mt-3 font-display text-lg font-semibold leading-tight text-ivory">
            {t.brand}
          </h1>
          <p className="mt-1 font-body text-xs text-muted">{t.brandSub}</p>
        </>
      )}
    </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "group flex items-center gap-3 rounded-md px-3 py-2.5 font-body text-sm transition-colors",
                    isActive
                      ? "bg-raised text-ivory"
                      : "text-muted hover:bg-raised/60 hover:text-ivory",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "font-mono text-[11px] tabular-nums",
                      isActive ? "text-signal" : "text-muted group-hover:text-relay",
                    ].join(" ")}
                  >
                    {item.code}
                  </span>
                  {!collapsed && <span className="flex-1">{t[item.labelKey]}</span>}
                  {!collapsed && !item.ready && (
                    <span className="h-1.5 w-1.5 rounded-full bg-line" aria-hidden />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-line px-5 py-4 overflow-hidden">
        {!collapsed && <LangToggle />}
        {!collapsed && <MangaToggle />}
      </div>
    </aside>
  );
}
