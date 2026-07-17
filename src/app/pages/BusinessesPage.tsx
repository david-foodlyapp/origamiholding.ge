import React from "react";
import { Businesses } from "../components/Businesses";
import { SEO } from "../components/SEO";
import { useTranslation } from "react-i18next";

export function BusinessesPage() {
  const { t } = useTranslation();

  return (
    <div className="pt-20">
      <SEO title={t('nav.ourBusinesses')} />
      <Businesses />
    </div>
  );
}
