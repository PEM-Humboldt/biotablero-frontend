/** eslint verified */
import React from 'react';
import { DataTable } from '@bit/grommet.grommet.data-table';
import { Meter } from '@bit/grommet.grommet.meter';

const columns = [
  {
    property: 'name',
    header: 'Ecosistema estratégico',
    primary: true,
    footer: 'Area total',
  },
  {
    property: 'percent-graph',
    header: 'Porcentaje',
    render: datum => (
      <Meter
        values={[{ value: datum.percent }]}
        thickness="small"
        size="small"
      />
    ),
    aggregate: 'sum',
    footer: { aggregate: true },
  },
  {
    property: 'percent',
    header: '%',
    render: datum => (datum.percent),
    aggregate: 'sum',
    footer: { aggregate: true },
  },
  {
    property: 'area',
    header: 'Hectáreas - ha',
    render: datum => datum.area,
    align: 'end',
    aggregate: 'sum',
    footer: { aggregate: true },
  },
  {
    property: 'more',
    header: 'Ver más',
    render: datum => datum.button,
    align: 'center',
    aggregate: 'sum',
    footer: { aggregate: true },
  },
];

const DATA = [ // Diferencia: 1841926.16
  {
    name: 'Páramos',
    percent: 56.58704248,
    area: 123429.83,
    button: '+',
  },
  {
    name: 'Bosque seco tropical',
    percent: 43.41295752,
    area: 94694.01,
    button: '+',
  },
  {
    name: 'Humedales',
    percent: 0,
    area: 0,
    button: '+',
  },
];

const Overview = (/* TODO: values */) => (
  <div className="overview">
    <div className="complist">
      <b className="addedBioma">Resumen</b>
      <br />
      <b>Área total seleccionada: </b>
      2060050 ha - 100%
      <br />
      <b>Área en ecosistemas estratégicos: </b>
      218123.84 ha -
      <b> 10.58%</b>
    </div>
    <DataTable className="listSS" columns={columns} data={DATA} />
  </div>
);

export default Overview;
