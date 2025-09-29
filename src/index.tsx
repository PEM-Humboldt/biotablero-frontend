import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactGA from "react-ga4";
import { App } from "App";

if (import.meta.env.MODE === "production") {
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
  // NOTE: El componente de Indicators usa una dependencia bastante vieja,
  // react-masonry-component que presenta problemas de renderizado con el StrictMode
  // de React. Esto causa que las tarjetas de indicadores se muestren desordenadas
  // en el entorno de desarrollo. Mientras se actualiza la dependencia, se recomienda
  // desactivar temporalmente StrictMode para cualquier desarrollo dentro del
  // componente indicators
  //
  // <StrictMode>
  <App />,
  // </StrictMode>,
);
