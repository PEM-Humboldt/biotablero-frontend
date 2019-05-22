/** eslint verified */
import React from 'react';
import EcosystemBox from './EcosystemBox';

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
  areaData, listSE, areaPA, coverage,
  handlerInfoGraph, openInfoGraph,
) => {
  const generalArea = (areaData ? areaData.area : 0);
  const ecosystemsArea = getEcosystemsArea(listSE);
  const protectedArea = getProtectedArea(generalArea, areaPA);
  return (
    <div>
      <div className="complist">
        <b className="eco_title"><h3>Resumen</h3></b>
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
        <br />
      </div>
      <EcosystemBox
        name="Páramo"
        percentage="0.15"
        area={10}
        coverage={coverage}
        areaPA={areaPA}
        handlerInfoGraph={handlerInfoGraph}
        openInfoGraph={openInfoGraph}
      />
      <EcosystemBox
        name="Bosque seco tropical"
        percentage="0.40"
        area={60}
        coverage={coverage}
        areaPA={areaPA}
        handlerInfoGraph={handlerInfoGraph}
        openInfoGraph={openInfoGraph}
      />
      <EcosystemBox
        name="Humedales"
        percentage="0"
        area={0}
        coverage={coverage}
        areaPA={areaPA}
        handlerInfoGraph={handlerInfoGraph}
        openInfoGraph={openInfoGraph}
      />
    </div>
  );
};

export default Overview;
