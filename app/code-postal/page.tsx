"use client";

import { useLang } from "@/context/LangContext";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default function CodePostalPage() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader code="06 / CODE POSTAL" title={t.navCodePostal} />
      <EmptyState />
    </div>
  );
}
