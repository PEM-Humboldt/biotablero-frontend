import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactGA from "react-ga4";
import { App } from "App";

if (import.meta.env.VITE_ENVIRONMENT === "production") {
  ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID, {
    gaOptions: {
      cookieDomain: ".humboldt.org.co",
      cookieFlags: "SameSite=None; Secure",
    },
  });
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("No se encontró el elemento root");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
