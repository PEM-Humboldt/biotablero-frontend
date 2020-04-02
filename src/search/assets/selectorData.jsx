/** eslint verified */
import React from 'react';
import AddIcon from '@material-ui/icons/Add';

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

const dataPaisajes = [
  {
    id: 'Factor de compensación',
    name: 'Factor de compensación',
    disabled: false,
    expandIcon: <AddIcon />,
    detailId: 'Factor de compensación en área de consulta',
    description: 'Representa el coeficiente de relación entre BiomasIAvH y regiones bióticas',
  },
  {
    id: 'Huella humana',
    name: 'Huella humana',
    disabled: false,
    expandIcon: <AddIcon />,
    detailId: 'Huella humana en el área',
    description: 'Representa diferentes análisis de huella humana en esta área de consulta',
  },
];

export { description, dataGEB, dataPaisajes };
