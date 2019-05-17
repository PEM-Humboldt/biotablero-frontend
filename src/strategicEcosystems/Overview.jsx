/** eslint verified */
import React from 'react';
import { DataTable } from '@bit/grommet.grommet.data-table';
import { Meter } from '@bit/grommet.grommet.meter';

const columns = [
  {
    property: 'type',
    header: 'Ecosistema estratégico',
    primary: true,
  },
  {
    property: 'percent-graph',
    header: 'Porcentaje',
    render: datum => (
      <Meter
        values={[{ value: Number((datum.percentage * 100).toFixed(2)) }]}
        thickness="small"
        size="small"
      />
    ),
  },
  {
    property: 'percent',
    header: '%',
    render: datum => Number((datum.percentage * 100).toFixed(2)),
  },
  {
    property: 'area',
    header: 'Hectáreas - ha',
    render: datum => Number(Number(datum.area).toFixed(2)),
    align: 'end',
  },
  {
    property: 'more',
    header: 'Ver más',
    render: datum => '+',
    align: 'center',
  },
];

const getEcosystemsArea = (listSE) => {
  const local = listSE ? (listSE.map(item => Number(item.area))) : '';
  const sum = Object.values(local).reduce((total, value) => total + value, 0);
  return sum.toFixed(2);
};

const getPercentage = (part, total) => ((part * 100) / total).toFixed(2);

const getProtectedArea = (generalArea, areaPA) => {
  const local = areaPA ? (areaPA.map(item => Number(item.percentage))) : '';
  const sum = Object.values(local).reduce((total, value) => total + value, 0);
  return ((generalArea / 100) * sum).toFixed(2);
};


const Overview = (/* TODO: Add all values required */
  areaData, listSE, areaPA,
) => {
  const generalArea = (areaData ? areaData.area : 0);
  const ecosystemsArea = getEcosystemsArea(listSE);
  const protectedArea = getProtectedArea(generalArea, areaPA);
  return (
    <div className="overview">
      <div className="complist">
        <b className="addedBioma">Resumen</b>
        <br />
        <b>Área total seleccionada: </b>
        {`${areaData ? areaData.area : 0} `}
        ha - 100%
        <br />
        <b>Área en ecosistemas estratégicos: </b>
        { /* 218123.84 */ }
        {`${ecosystemsArea} ha - `}
        { // <b> 10.58%</b>
        }
        <b>
          {`${getPercentage(ecosystemsArea, generalArea)} %`}
        </b>
        <br />
        <b>Área protegida en ecosistemas estratégicos: </b>
        {`${protectedArea} ha - `}
        <b>
          {`${getPercentage(protectedArea, generalArea)} %`}
        </b>
      </div>
      <DataTable
        className="listSS"
        columns={columns}
        data={listSE}
      />
    </div>
  );
};

export default Overview;
