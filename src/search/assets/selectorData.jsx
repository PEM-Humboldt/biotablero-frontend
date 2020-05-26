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
      {' "y" '}
      <b>
        paisaje
      </b>
      , de 3 distintas maneras:
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
  detailId: 'Zonas_GEB',
  label: 'Zonas GEB',
  options: [
    {
      name: 'Norte',
    },
    {
      name: 'Centro',
    },
    {
      name: 'Suroccidente',
    },
    {
      name: 'Occidente',
    },
  ],
};

const dataLines = [
  {
    id: 'Área total',
    data: [
      {
        x: 1970,
        y: 75,
      },
      {
        x: 1990,
        y: 65,
      },
      {
        x: 2000,
        y: 68,
      },
      {
        x: 2015,
        y: 89,
      },
      {
        x: 2018,
        y: 80,
      },
    ],
  },
  {
    id: 'Páramo',
    data: [
      {
        x: 1970,
        y: 55,
      },
      {
        x: 1990,
        y: 15,
      },
      {
        x: 2000,
        y: 28,
      },
      {
        x: 2015,
        y: 79,
      },
      {
        x: 2018,
        y: 38,
      },
    ],
  },
  {
    id: 'Humedales',
    data: [
      {
        x: 1970,
        y: 45,
      },
      {
        x: 1990,
        y: 10,
      },
      {
        x: 2000,
        y: 67,
      },
      {
        x: 2015,
        y: 43,
      },
      {
        x: 2018,
        y: 11,
      },
    ],
  },
  {
    id: 'Bosques Secos',
    data: [
      {
        x: 1970,
        y: 12,
      },
      {
        x: 1990,
        y: 67,
      },
      {
        x: 2000,
        y: 69,
      },
      {
        x: 2015,
        y: 75,
      },
      {
        x: 2018,
        y: 55,
      },
    ],
  },
];

const changeValues = [
  {
    axis: 'y',
    value: 15,
    type: 'Natural',
    legendPosition: 'top-left',
  },
  {
    axis: 'y',
    value: 30,
    type: 'Baja',
    legendPosition: 'top-left',
  },
  {
    axis: 'y',
    value: 60,
    type: 'Media',
    legendPosition: 'top-left',
  },
  {
    axis: 'y',
    value: 100,
    type: 'Alta',
    legendPosition: 'top-left',
  },
];


export {
  changeValues,
  description,
  dataGEB,
  dataLines,
};
