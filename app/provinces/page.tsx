"use client";

import { useLang } from "@/context/LangContext";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default function ProvincesPage() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader code="05 / PROVINCES" title={t.navProvinces} />
      <EmptyState />
    </div>
  );
}
