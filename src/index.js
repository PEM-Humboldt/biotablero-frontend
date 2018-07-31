import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
// TODO: Habilitar registerServiceWorker cuando esté habilitado el dominio en HTTPS
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
  // Parte 1 de 3 del enrutador: Importar el componente BrowserRouter
  <BrowserRouter>
    <App />
  </BrowserRouter>)
  , document.getElementById('root'));
// registerServiceWorker();
