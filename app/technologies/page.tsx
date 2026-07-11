"use client";

import { useLang } from "@/context/LangContext";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default function TechnologiesPage() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader code="04 / TECHNOLOGIES" title={t.navTechnologies} />
      <EmptyState />
    </div>
  );
}
