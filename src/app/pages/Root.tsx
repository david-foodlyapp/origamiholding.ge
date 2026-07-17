import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FloatingContact } from "../components/FloatingContact";
import { CookieConsentModal } from "../components/CookieConsentModal";
import { useTranslation } from "react-i18next";
import { hasAnalyticsConsent, trackPageView } from "../lib/analytics";

export function Root() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();

  // Sync HTML lang attribute with active language
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!hasAnalyticsConsent()) {
      return;
    }

    trackPageView(`${pathname}${window.location.search}`);
  }, [pathname]);

  return (
    <div className="font-[Inter] antialiased bg-white text-gray-900 overflow-x-hidden flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
      <CookieConsentModal />
    </div>
  );
}
