/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// TODO: Habilitar registerServiceWorker cuando esté habilitado el dominio en HTTPS
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ),
  document.getElementById('root'),
);
// registerServiceWorker();
