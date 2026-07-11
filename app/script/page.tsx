"use client";

import { useLang } from "@/context/LangContext";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default function ScriptPage() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader code="02 / SCRIPT" title={t.navScript} />
      <EmptyState />
    </div>
  );
}
