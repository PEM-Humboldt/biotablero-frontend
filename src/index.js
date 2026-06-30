/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga4';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { getEnv } from './utils/getEnv';
// TODO: Habilitar registerServiceWorker cuando esté habilitado el dominio en HTTPS
// import registerServiceWorker from './registerServiceWorker';

// Eslint disallows JSX in .js files. But create-react-app only accepts index.js as entry point
/* eslint-disable react/jsx-filename-extension */
const gaTrackingId = getEnv('REACT_APP_GA_TRACKING_ID');
if (gaTrackingId) {
  ReactGA.initialize(gaTrackingId, {
    gaOptions: {
      cookieDomain: ".humboldt.org.co",
      cookieFlags: "SameSite=None; Secure",
    },
  });
}

ReactDOM.render(
  (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ),
  document.getElementById('root'),
);
// registerServiceWorker();
