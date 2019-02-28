/** eslint verified */
import React from 'react';

const description = companyName => (
  <div>
    <h1>
      Compensaciones
    </h1>
    <p>
      {'En esta sección podrás encontrar información sobre '}
      <b>
        ¿Qué y cuánto compensar?
      </b>
      {', '}
      <b>
        ¿Dónde y cómo compensar?
      </b>
      {', para esto:'}
    </p>
    <p>
      <i>
        1
      </i>
      {' Selecciona una '}
      <b>
        Zona
        {companyName ? ` ${companyName}` : ''}
      </b>
    </p>
    <p>
      <i>
        2
      </i>
      {' Selecciona un '}
      <b>
        proyecto
      </b>
      {' (licenciado, en licenciamiento o diagnóstico) o crea un '}
      <b>
        nuevo proyecto
      </b>
    </p>
    <p>
      <i>
        3
      </i>
      {' Consulta el qué y cuánto (proyectos previamente analizados)'}
    </p>
    <p>
      <i>
        4
      </i>
      {' Selecciona el dónde y cómo para alcanzar las metas de compensación (proyectos previamente analizados)'}
    </p>
  </div>
);

const selectorData = [
  {
    id: 'panel1-Norte',
    detailId: 'panel1-Norte',
    label: 'Norte',
    disabled: true,
  },
  {
    id: 'panel1-Centro',
    detailId: 'proyectos',
    label: 'Centro',
    options: [
      {
        id: 'licenciados',
        label: 'Licenciados',
      },
      {
        id: 'En Licenciamiento',
        label: 'En licenciamiento',
        options: [
          {
            type: 'button',
            name: 'sogamoso',
            label: 'Sogamoso',
          },
          {
            type: 'button',
            label: 'Nortechivor',
          },
        ],
      },
      {
        id: 'daa',
        label: 'Diagnóstico Ambiental de Alternativas',
        options: [
          {
            type: 'button',
            label: 'San Fernando',
          },
        ],
      },
      {
        id: 'addProject',
        label: '+ Agregar nuevo proyecto',
        options: [
          {
            type: 'button',
            label: 'Agregar',
          },
        ],
      },
    ],
  },
  {
    id: 'panel1-Occidente',
    detailId: 'panel1-Occidente',
    label: 'Occidente',
    disabled: true,
  },
  {
    id: 'panel1-Suroccidente',
    detailId: 'panel1-Suroccidente',
    label: 'Suroccidente',
    disabled: true,
  },
];

export { description, selectorData };
