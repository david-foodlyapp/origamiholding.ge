const GA_MEASUREMENT_ID = "G-EELM9N15MZ";
export const COOKIE_CONSENT_KEY = "origami_cookie_consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
}

export function hasAnalyticsConsent() {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

export function loadAnalytics() {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) {
    return;
  }

  ensureDataLayer();

  if (!document.querySelector(`script[data-gtag-id="${GA_MEASUREMENT_ID}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.dataset.gtagId = GA_MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_MEASUREMENT_ID, {
    page_path: `${window.location.pathname}${window.location.search}`,
  });
}

export function trackPageView(path: string) {
  if (!hasAnalyticsConsent() || !window.gtag) {
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, { page_path: path });
}
