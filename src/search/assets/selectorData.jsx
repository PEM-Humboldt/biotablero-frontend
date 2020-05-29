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
      y
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

const changeValues = [ // Used colors from colorPalettes.jsx (currentHFPLower)
  {
    axis: 'y',
    value: 15,
    legend: 'Natural',
    lineStyle: { stroke: '#addccd', strokeWidth: 1 },
    textStyle: {
      fill: '#addccd',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
  },
  {
    axis: 'y',
    value: 30,
    legend: 'Baja',
    lineStyle: { stroke: '#eacf94', strokeWidth: 1 },
    textStyle: {
      fill: '#eacf94',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
  },
  {
    axis: 'y',
    value: 60,
    legend: 'Media',
    lineStyle: { stroke: '#f2b48a', strokeWidth: 1 },
    textStyle: {
      fill: '#f2b48a',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
  },
  {
    axis: 'y',
    value: 100,
    legend: 'Alta',
    lineStyle: { stroke: '#e49c98', strokeWidth: 1 },
    textStyle: {
      fill: '#e49c98',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
  },
];


export {
  changeValues,
  description,
  dataGEB,
  dataLines,
};
