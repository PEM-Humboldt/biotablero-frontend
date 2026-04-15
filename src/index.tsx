import { createRoot } from "react-dom/client";
import ReactGA from "react-ga4";
import { App } from "App";

const viteEnvironment =
  window._env_?.VITE_ENVIRONMENT || import.meta.env.VITE_ENVIRONMENT;
const gaTrackingId =
  window._env_?.VITE_GA_TRACKING_ID || import.meta.env.VITE_GA_TRACKING_ID;

if (viteEnvironment === "production") {
  ReactGA.initialize(gaTrackingId, {
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
