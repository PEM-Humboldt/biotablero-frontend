/** eslint verified */
import React from 'react';
import EcosystemBox from './EcosystemBox';
import RestAPI from '../api/RestAPI';
import RenderGraph from '../charts/RenderGraph';

const getPercentage = (part, total) => ((part * 100) / total).toFixed(2);

const getArea = (areaPA) => {
  const local = areaPA ? (areaPA.reduce((total, item) => (total + Number(item.area)), 0)) : '';
  return Number(local).toFixed(2);
};

const arrayWithNoProtectedArea = (general, protectedArea) => {
  const noProtected = (general - Number(protectedArea)).toFixed(2);
  return [
    { type: 'Área protegida', area: protectedArea, percentage: getPercentage(Number(protectedArea), general) / 100 },
    { type: 'No protegida', area: noProtected.toString(), percentage: getPercentage(noProtected, general) / 100 },
  ];
};

const getDetailsBySE = (areaId, geofenceId, name) => {
  console.log((areaId, geofenceId, name));
  Promise.all(
    [RestAPI.requestSENationalPercentage(areaId, geofenceId, name)
      .then(res => res)
      .catch(() => {})],
    [RestAPI.requestSECoverageByGeofence(areaId, geofenceId, name)
      .then(res => res)
      .catch(() => {})],
    [RestAPI.requestSEPAByGeofence(areaId, geofenceId, name)
      .then(res => res)
      .catch(() => 0)],
  ).then(response => response);
};


  /**
   * Return the ecosystems and its content
   */
const listEcosystems = (area, name, percentage,
  handlerInfoGraph, openInfoGraph, areaId, geofenceId) => {
  console.log(areaId, geofenceId);
  // const {
  //   coverageSE, // object
  //   protectedAreaSE, // object
  //   nationalPercentage, // value used for label
  // } = getDetailsBySE(areaId, geofenceId, name);
  return (areaId && geofenceId && (
    <EcosystemBox
      key={name}
      name={name}
      percentage={percentage}
      area={area}
      coverage={RestAPI.requestSECoverageByGeofence(areaId, geofenceId, name)
        .then(res => res)
        .catch(() => {})} // TODO: Call coverage for this ee
      areaPA={RestAPI.requestSEPAByGeofence(areaId, geofenceId, name)
        .then(res => res)
        .catch(() => 0)} // TODO: Call areaPA for this ee
      handlerInfoGraph={handlerInfoGraph}
      openInfoGraph={openInfoGraph}
      nationalPercentage={
        RestAPI.requestSENationalPercentage(areaId, geofenceId, name)
          .then(res => res)
          .catch(() => {})
      }
    />
  ));
};

const Overview = (/* TODO: Add all values required */
  areaData, listSE, areaPA, coverage,
  handlerInfoGraph, openInfoGraph,
  // areaId, geofenceId,
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
          <b>{`${areaData ? areaData.area : 0} ha`}</b>
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
