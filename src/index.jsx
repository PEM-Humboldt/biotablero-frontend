import ReactDOM from "react-dom";
import ReactGA from "react-ga4";
import { App } from "App";
import { StrictMode } from "react";
// TODO: Habilitar registerServiceWorker cuando esté habilitado el dominio en HTTPS
// import registerServiceWorker from './registerServiceWorker';

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
    <App />
  </StrictMode>,
  document.getElementById("root")
);
// registerServiceWorker();
