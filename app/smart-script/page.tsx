"use client";

import { useLang } from "@/context/LangContext";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default function SmartScriptPage() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader code="03 / SMART SCRIPT" title={t.navSmartScript} />
      <EmptyState />
    </div>
  );
}
