import ReactDOM from "react-dom";
import ReactGA from "react-ga4";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// TODO: Habilitar registerServiceWorker cuando esté habilitado el dominio en HTTPS
// import registerServiceWorker from './registerServiceWorker';

ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID, {
  gaOptions: {
    cookieDomain: ".humboldt.org.co",
    cookieFlags: "SameSite=None; Secure",
  },
});

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
// registerServiceWorker();
