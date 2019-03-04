/** eslint verified */
import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

const selectorData = [
  {
    id: 'Geocerca',
    idLabel: 'panel1-Geocerca',
    // id='geofences' se utiliza en la hoja de estilos, para mostrar todos los elementos listados
    detailId: 'geofences',
    label: 'Área de consulta',
    options: [
      {
        id: 'areas-manejo-especial',
        label: 'Áreas de manejo especial',
        options: [
          {
            type: 'button',
            label: 'ANP',
          },
          {
            type: 'button',
            label: 'Pedets',
          },
          {
            type: 'button',
            label: 'Bosques de Paz',
          },
          {
            type: 'button',
            label: 'Reservas campesinas',
          },
          {
            type: 'button',
            label: 'Territorios colectivos',
          },
        ],
      },
      {
        id: 'departamentos',
        label: 'Departamentos',
        expandIcon: (<ExpandMoreIcon />),
        options: [
          {
            type: 'autocomplete',
            name: 'departamentos',
            data: [
              { label: 'Amazonas', value: 'Amazonas' },
              { label: 'Antioquia', value: 'Antioquia' },
              { label: 'Arauca', value: 'Arauca' },
              { label: 'Archipiélago de San Andrés, Providencia y Santa Catalina', value: 'san-Andres' },
              { label: 'Atlántico', value: 'Atlántico' },
              { label: 'Bogotá D.C.', value: 'Bogotá D.C.' },
              { label: 'Bolívar', value: 'Bolívar' },
              { label: 'Boyacá', value: 'Boyacá' },
              { label: 'Caldas', value: 'Caldas' },
              { label: 'Caquetá', value: 'Caquetá' },
              { label: 'Casanare', value: 'Casanare' },
              { label: 'Cauca', value: 'Cauca' },
              { label: 'Cesar', value: 'Cesar' },
              { label: 'Chocó', value: 'Chocó' },
              { label: 'Córdoba', value: 'Córdoba' },
              { label: 'Cundinamarca', value: 'Cundinamarca' },
              { label: 'Guainía', value: 'Guainía' },
              { label: 'Guaviare', value: 'Guaviare' },
              { label: 'Huila', value: 'Huila' },
              { label: 'La Guajira', value: 'La Guajira' },
              { label: 'Magdalena', value: 'Magdalena' },
              { label: 'Meta', value: 'Meta' },
              { label: 'Nariño', value: 'Nariño' },
              { label: 'Norte de Santander', value: 'Norte de Santander' },
              { label: 'Putumayo', value: 'Putumayo' },
              { label: 'Quindio', value: 'Quindio' },
              { label: 'Risaralda', value: 'Risaralda' },
              { label: 'Santander', value: 'Santander' },
              { label: 'Sucre', value: 'Sucre' },
              { label: 'Tolima', value: 'Tolima' },
              { label: 'Valle del Cauca', value: 'valle' },
              { label: 'Vaupés', value: 'Vaupés' },
              { label: 'Vichada', value: 'Vichada' },
            ],
          },
        ],
      },
      {
        id: 'jurisdicciones',
        label: 'Jurisdicciones ambientales',
        expandIcon: (<ExpandMoreIcon />),
        options: [
          {
            type: 'autocomplete',
            name: 'jurisdiccion',
            data: [
              { label: 'CORPOBOYACA', value: 'CORPOBOYACA' },
              { label: 'AMBA', value: 'AMBA' },
              { label: 'CAM', value: 'CAM' },
              { label: 'CAR', value: 'CAR' },
              { label: 'CARDER', value: 'CARDER' },
              { label: 'CARDIQUE', value: 'CARDIQUE' },
              { label: 'CARSUCRE', value: 'CARSUCRE' },
              { label: 'CAS', value: 'CAS' },
              { label: 'CDA', value: 'CDA' },
              { label: 'CDMB', value: 'CDMB' },
              { label: 'CODECHOCO', value: 'CODECHOCO' },
              { label: 'CORALINA', value: 'CORALINA' },
              { label: 'CORANTIOQUIA', value: 'CORANTIOQUIA' },
              { label: 'CORMACARENA', value: 'CORMACARENA' },
              { label: 'CORNARE', value: 'CORNARE' },
              { label: 'CORPAMAG', value: 'CORPAMAG' },
              { label: 'CORPOAMAZONIA', value: 'CORPOAMAZONIA' },
              { label: 'CORPOCALDAS', value: 'CORPOCALDAS' },
              { label: 'CORPOCESAR', value: 'CORPOCESAR' },
              { label: 'CORPOCHIVOR', value: 'CORPOCHIVOR' },
              { label: 'CORPOGUAJIRA', value: 'CORPOGUAJIRA' },
              { label: 'CORPOGUAVIO', value: 'CORPOGUAVIO' },
              { label: 'CORPOMOJANA', value: 'CORPOMOJANA' },
              { label: 'CORPONOR', value: 'CORPONOR' },
              { label: 'CORPORINOQUIA', value: 'CORPORINOQUIA' },
              { label: 'CORPOURABA', value: 'CORPOURABA' },
              { label: 'CORPPONARIÃ‘O', value: 'CORPPONARIÃ‘O' },
              { label: 'CORTOLIMA', value: 'CORTOLIMA' },
              { label: 'CRA', value: 'CRA' },
              { label: 'CRC', value: 'CRC' },
              { label: 'CRQ', value: 'CRQ' },
              { label: 'CSB', value: 'CSB' },
              { label: 'CVC', value: 'CVC' },
              { label: 'CVS', value: 'CVS' },
              { label: 'DAGMA', value: 'DAGMA' },
              { label: 'DAMAB', value: 'DAMAB' },
              { label: 'SDA', value: 'SDA' },
              { label: 'SIN', value: 'SIN' },
            ],
          },
        ],
      },
      {
        id: 'zonas-hidrograficas',
        label: 'Zonas hidrográficas',
        expandIcon: (<ExpandMoreIcon />),
        options: [
          {
            type: 'autocomplete',
            name: 'zona-hidrografica',
            data: [
              { label: 'Atrato - Darién', value: 'Atrato-Darien' },
              { label: 'Caribe - Urabá', value: 'Caribe-Uraba' },
              { label: 'Sinú', value: 'Sinu' },
              { label: 'Caribe - Litoral', value: 'Caribe-Litoral' },
              { label: 'Caribe - Guajira', value: 'Caribe-Guajira' },
              { label: 'Catatumbo', value: 'Catatumbo' },
              { label: 'Caribe - Islas', value: 'Caribe-Islas' },
              { label: 'Alto Magdalena', value: 'AltoMagdalena' },
              { label: 'Saldańa', value: 'Saldana' },
              { label: 'Medio Magdalena', value: 'MedioMagdalena' },
              { label: 'Sogamoso', value: 'Sogamoso' },
              { label: 'Bajo Magdalena-Cauca - San Jorge', value: 'BajoMagdalena-Cauca-SanJorge' },
              { label: 'Cauca', value: 'Cauca' },
              { label: 'Nechí', value: 'Nechi' },
              { label: 'Cesar', value: 'Cesar' },
              { label: 'Bajo Magdalena', value: 'BajoMagdalena' },
              { label: 'Inírida', value: 'Inirida' },
              { label: 'Guaviare', value: 'Guaviare' },
              { label: 'Vichada', value: 'Vichada' },
              { label: 'Tomo', value: 'Tomo' },
              { label: 'Meta', value: 'Meta' },
              { label: 'Casanare', value: 'Casanare' },
              { label: 'Arauca', value: 'Arauca' },
              { label: 'Orinoco - Directos', value: 'Orinoco-Directos' },
              { label: 'Apure', value: 'Apure' },
              { label: 'Guainía', value: 'Guainia' },
              { label: 'Vaupés', value: 'Vaupes' },
              { label: 'Apaporis', value: 'Apaporis' },
              { label: 'Caquetá', value: 'Caqueta' },
              { label: 'Yarí', value: 'Yari' },
              { label: 'Caguán', value: 'Caguan' },
              { label: 'Putumayo', value: 'Putumayo' },
              { label: 'Amazonas - Directos', value: 'Amazonas-Directos' },
              { label: 'Napo', value: 'Napo' },
              { label: 'Mira', value: 'Mira' },
              { label: 'Patía', value: 'Patia' },
              { label: 'Amarales - Dagua - Directos', value: 'Amarales-Dagua-Directos' },
              { label: 'San Juan', value: 'SanJuan' },
              { label: 'Baudó - Directos Pacífico', value: 'Baudo-DirectosPacifico' },
              { label: 'Pacífico - Directos', value: 'Pacifico-Directos' },
              { label: 'Pacífico - Islas', value: 'Pacifico-Islas' },
            ],
          },
        ],
      },
      {
        id: 'ecosisemas-estrategicos',
        label: 'Ecosistemas estratégicos',
        options: [
          {
            type: 'button',
            label: 'Bosques secos',
          },
          {
            type: 'button',
            label: 'Humedales',
          },
          {
            type: 'button',
            label: 'Páramos',
          },
        ],
      },
    ],
  },
  {
    id: 'panel2',
    detailId: 'panel2',
    label: 'Subir polígono',
    iconOption: 'upload',
    disabled: true,
  },
  {
    id: 'panel3',
    detailId: 'panel3',
    label: 'Dibujar polígono / Línea',
    iconOption: 'edit',
    disabled: true,
  },
];

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

export { description, selectorData, dataGEB };
