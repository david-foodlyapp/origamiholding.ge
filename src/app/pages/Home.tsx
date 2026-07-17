import React from "react";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { FromToWorld } from "../components/FromToWorld";
import { Businesses } from "../components/Businesses";
import { News } from "../components/News";
import { SEO } from "../components/SEO";
import { LogoMaskSection } from "../components/LogoMaskSection";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('seo.home')} />
      <Hero />
      <About />
      <LogoMaskSection />
      <FromToWorld />
      <Businesses />
      <News />
    </>
  );
}
