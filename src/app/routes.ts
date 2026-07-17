import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { NewsPage } from "./pages/NewsPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import { CookiePolicy } from "./pages/CookiePolicy";
import { WhatWeDo } from "./pages/WhatWeDo";
import { LeadershipPage } from "./pages/LeadershipPage";
import { BusinessesPage } from "./pages/BusinessesPage";
import { NewsDetailsPage } from "./pages/NewsDetailsPage";
import { Hospitality } from "./pages/businesses/Hospitality";
import { PropertyDevelopmentPage } from "./pages/businesses/DevelopmentPage";
import { ArchitecturePage } from "./pages/businesses/ArchitecturePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "news", Component: NewsPage },
      { path: "news/:slug", Component: NewsDetailsPage },
      { path: "contact", Component: ContactPage },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-of-service", Component: TermsOfService },
      { path: "cookie-policy", Component: CookiePolicy },
      { path: "what-we-do", Component: WhatWeDo },
      { path: "leadership", Component: LeadershipPage },
      { path: "businesses", Component: BusinessesPage },
      { path: "hospitality", Component: Hospitality },
      { path: "development", Component: PropertyDevelopmentPage },
      { path: "architecture", Component: ArchitecturePage },
      { path: "*", Component: Home } // catch-all route to prevent 404s
    ],
  },
]);
