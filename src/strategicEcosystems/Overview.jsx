/** eslint verified */
import React from 'react';
import EcosystemBox from './EcosystemBox';
import RenderGraph from '../charts/RenderGraph';

const getPercentage = (part, total) => ((part * 100) / total).toFixed(2);

const getArea = (areaPA) => {
  const local = areaPA ? (areaPA.reduce((total, item) => (total + Number(item.area)), 0)) : '';
  return Number(local).toFixed(2);
};

const Overview = (/* TODO: Add all values required */
  areaData, listSE, areaPA, coverage,
  handlerInfoGraph, openInfoGraph,
) => {
  const generalArea = (areaData ? areaData.area : 0);
  const ecosystemsArea = getArea(listSE);
  const coverageArea = getArea(coverage);
  const protectedArea = getArea(areaPA);
  return (
    <div className="graphcard">
      <h2>Áreas</h2>
      <div className="graphcontainer pt5">
        <h4>
        hectáreas totales
        <b>{`${areaData ? areaData.area : 0} `} ha</b>
        </h4>
        <h4>
        Cobertura
        <b>{`${coverageArea} ha`}</b>
        </h4>
        <h5>
        {`${Number((0.2 * 100).toFixed(2))} %`}
        </h5>
        <h6>
        Natural y Transformado
        </h6>
        {RenderGraph(coverage, 'Tipo de área', 'Comparación', 'SmallBarStackGraph',
          'Cobertura', ['#5564a4', '#92ba3a', '#e9c948'], handlerInfoGraph, openInfoGraph,
          'muestra la proporción del tipo de área en este ecosistema estratégico', '%')}
        <h4>
        Áreas protegida
        <b>{`${protectedArea} ha `}</b>
        </h4>
        <h5>
        {`${getPercentage(protectedArea, generalArea)} %`}
        </h5>
        {RenderGraph(areaPA, 'Tipo de área', 'Comparación', 'SmallBarStackGraph',
          'Cobertura', ['#92ba3a', '#e9c948', '#5564a4'], handlerInfoGraph, openInfoGraph,
          'muestra la proporción del tipo de área en este ecosistema estratégico', '%')}
        <div className="ecoest">
          <h4>
          Ecosistemas estratégicos
          <b>{`${ecosystemsArea} ha`}</b>
          </h4>
          <h5>{`${getPercentage(ecosystemsArea, generalArea)} %`}</h5>
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
          <EcosystemBox
            name="Páramo"
            percentage="0.15"
            area={10}
            coverage={coverage}
            areaPA={areaPA}
            handlerInfoGraph={handlerInfoGraph}
            openInfoGraph={openInfoGraph}
          />
        </div>  
      </div>
    </div>
  );
};

export default Overview;
