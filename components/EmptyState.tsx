"use client";

import { useLang } from "@/context/LangContext";

export default function EmptyState() {
  const { t } = useLang();
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface/50 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-line">
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
      </div>
      <h2 className="font-display text-base font-medium text-ivory">
        {t.emptyTitle}
      </h2>
      <p className="mx-auto mt-2 max-w-sm font-body text-sm text-muted">
        {t.emptyBody}
      </p>
    </div>
  );
}
