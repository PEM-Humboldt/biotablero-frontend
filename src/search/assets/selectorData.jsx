/** eslint verified */
import React from 'react';

const description = companyName => (
  <div>
    <h1>
      Consultas geográficas
    </h1>
    <p>
      {'En esta sección podrás encontrar información sobre '}
      <b>
        ecosistemas
      </b>
      {', '}
      <b>
        especies
      </b>
      {' y '}
      <b>
        paisaje
      </b>
      {', de 3 distintas maneras:'}
    </p>
    <p>
      <i>
        1
      </i>
      {' Selecciona un '}
      <b>
        área de consulta
      </b>
      { companyName ? ` de la empresa ${companyName} o ` : ''}
      {' predeterminada (departamentos, jurisdicciones, etc.)'}
    </p>
    <p>
      <i>
        2
      </i>
      {' Sube tu propio '}
      <b>
        polígono
      </b>
      {' (usuarios registrados)'}
    </p>
    <p>
      <i>
        3
      </i>
      {' Dibuja tu propia '}
      <b>
        línea o polígono
      </b>
      {' (usuarios registrados)'}
    </p>
  </div>
);

const dataGEB = {
  id: 'Zonas_GEB',
  label: 'Zonas GEB',
  options: [
    {
      type: 'button',
      label: 'Norte',
    },
    {
      type: 'button',
      label: 'Centro',
    },
    {
      type: 'button',
      label: 'Suroccidente',
    },
    {
      type: 'button',
      label: 'Occidente',
    },
  ],
};

export { description, dataGEB };
