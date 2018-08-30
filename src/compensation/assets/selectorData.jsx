/** eslint verified */
import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const description = (
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
        Zona GEB
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
    expandIcon: (<ExpandMoreIcon />),
    disabled: true,
  },
  {
    id: 'panel1-Centro',
    detailId: 'proyectos',
    label: 'Centro',
    expandIcon: (<ExpandMoreIcon />),
    options: [
      {
        id: 'licenciados',
        label: 'Licenciados',
        expandIcon: (<ExpandMoreIcon />),
      },
      {
        id: 'enLicenciamiento',
        label: 'En licenciamiento',
        expandIcon: (<ExpandMoreIcon />),
        options: [
          {
            type: 'button',
            name: 'Sogamoso',
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
        expandIcon: (<ExpandMoreIcon />),
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
        expandIcon: (<ExpandMoreIcon />),
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
    expandIcon: (<ExpandMoreIcon />),
    disabled: true,
  },
  {
    id: 'panel1-Suroccidente',
    detailId: 'panel1-Suroccidente',
    label: 'Suroccidente',
    expandIcon: (<ExpandMoreIcon />),
    disabled: true,
  },
];

export { description, selectorData };
