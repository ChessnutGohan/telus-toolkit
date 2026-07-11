"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { navItems } from "@/lib/nav";
import { vocab } from "@/lib/vocab";
import PageHeader from "@/components/PageHeader";

export default function Home() {
  const { t } = useLang();

  const sections = navItems.filter((item) => item.href !== "/");

  return (
    <div>
      <PageHeader code="00 / DASHBOARD" title={t.homeTitle} lede={t.homeLede} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((item) => {
          const count = item.href === "/vocabulaire" ? vocab.length : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-lg border border-line bg-surface p-5 transition-colors hover:border-relay/60"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-muted">
                    {item.code}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.ready ? "bg-signal" : "bg-line"
                    }`}
                    aria-hidden
                  />
                </div>
                <h2 className="mt-3 font-display text-lg font-medium text-ivory">
                  {t[item.labelKey]}
                </h2>
                <p className="mt-1 font-mono text-xs text-muted">
                  {item.ready
                    ? `${count} ${t.entriesLogged}`
                    : t.draftEntries}
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 font-body text-xs font-medium text-relay opacity-0 transition-opacity group-hover:opacity-100">
                {t.openSection} →
              </span>
            </Link>
          );
        })}
      </div>

      <p className="mt-10 font-mono text-[11px] text-muted/70">{t.footerNote}</p>
    </div>
  );
}
