import ReactDOM from "react-dom";
import ReactGA from "react-ga4";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { StrictMode } from "react";
// TODO: Habilitar registerServiceWorker cuando esté habilitado el dominio en HTTPS
// import registerServiceWorker from './registerServiceWorker';

// Sólo ejecuta google analitycs cuando está en producción
if (import.meta.env.MODE === "production") {
  ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID, {
    gaOptions: {
      cookieDomain: ".humboldt.org.co",
      cookieFlags: "SameSite=None; Secure",
    },
  });
}

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);
// registerServiceWorker();
