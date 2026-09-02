import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BrandingProvider } from "./contexts/BrandingContext";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  return (
    <ThemeProvider>
      <BrandingProvider>
        <RouterProvider router={router} />
        <SpeedInsights />
      </BrandingProvider>
    </ThemeProvider>
  );
}
