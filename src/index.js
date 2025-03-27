/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga4';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// TODO: Habilitar registerServiceWorker cuando esté habilitado el dominio en HTTPS
// import registerServiceWorker from './registerServiceWorker';

// Eslint disallows JSX in .js files. But create-react-app only accepts index.js as entry point
/* eslint-disable react/jsx-filename-extension */
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, {
  gaOptions: {
    cookieDomain: ".humboldt.org.co",
    cookieFlags: "SameSite=None; Secure",
  },
});

ReactDOM.render(
  (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ),
  document.getElementById('root'),
);
// registerServiceWorker();
