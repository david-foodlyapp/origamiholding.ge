import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Cookie } from "lucide-react";
import { COOKIE_CONSENT_KEY, loadAnalytics, trackPageView } from "../lib/analytics";

type ConsentState = "accepted" | "rejected" | null;

export function CookieConsentModal() {
  const { t } = useTranslation();
  const [consent, setConsent] = useState<ConsentState>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentState;
    setConsent(savedConsent);
    setReady(true);

    if (savedConsent === "accepted") {
      loadAnalytics();
    }
  }, []);

  const handleConsent = (value: Exclude<ConsentState, null>) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setConsent(value);

    if (value === "accepted") {
      loadAnalytics();
      trackPageView(`${window.location.pathname}${window.location.search}`);
    }
  };

  if (!ready || consent !== null) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="pointer-events-auto w-full max-w-5xl rounded-[30px] border border-[#dfe7e3] bg-[#fbfbf8] text-black dark:text-black shadow-[0_28px_90px_rgba(23,38,33,0.18)]">
        <div className="flex flex-col gap-6 px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-start lg:gap-8 lg:px-10">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f6bb64]/35 text-[#23483f]">
            <Cookie className="h-8 w-8" strokeWidth={2.1} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-2 text-sm font-medium tracking-[0.08em] text-black/70 dark:text-black/70">
              {t("cookieConsent.eyebrow")}
            </p>
            <h2 className="mb-3 text-xl font-semibold tracking-[-0.02em] text-black dark:text-black sm:text-2xl">
              {t("cookieConsent.title")}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-black/65 dark:text-black/65 sm:text-base">
              {t("cookieConsent.description")}
            </p>
            <p className="mt-4 text-sm text-black/65 dark:text-black/65">
              <Link
                to="/cookie-policy"
                className="font-medium text-black dark:text-black underline decoration-black/25 underline-offset-4 transition hover:text-black/75"
              >
                {t("cookieConsent.learnMore")}
              </Link>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#e6ece8] bg-white/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => handleConsent("rejected")}
            className="text-left text-sm font-medium text-black/60 dark:text-black/60 transition hover:text-black"
          >
            {t("cookieConsent.reject")}
          </button>
          <button
            type="button"
            onClick={() => handleConsent("accepted")}
            className="min-w-40 rounded-full bg-[#27493f] px-7 py-3 text-sm font-semibold tracking-[0.12em] uppercase text-white transition hover:bg-[#1f3c34]"
          >
            {t("cookieConsent.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
