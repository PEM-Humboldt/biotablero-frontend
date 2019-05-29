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
  areaId, geofenceId,
) => {
  const generalArea = (areaData ? areaData.area : 0);
  const ecosystemsArea = getArea(listSE);
  const coverageArea = getArea(coverage);
  const protectedArea = getArea(areaPA);
  return (
    <div>
      <b className="eco_title"><h3>Resumen</h3></b>
      <br />
      <b>Total: </b>
      {`${areaData ? areaData.area : 0} `}
      ha - 100%
      <br />
      <b>Ecosistemas estratégicos: </b>
      {`${ecosystemsArea} ha - `}
      <b>
        {`${getPercentage(ecosystemsArea, generalArea)} %`}
      </b>
      <br />
      <div className="titeco2">
        <b>Cobertura: </b>
        {`${coverageArea} ha - ${Number((0.2 * 100).toFixed(2))} %`}
        {RenderGraph(coverage, '', '', 'SmallBarStackGraph',
          'Cobertura', ['#5564a4', '#92ba3a', '#e9c948'], handlerInfoGraph, openInfoGraph,
          '', '%')}
      </div>
      <div className="titeco2">
        <b>Área protegida / No protegida </b>
        {RenderGraph(arrayWithNoProtectedArea(generalArea, protectedArea), '', '', 'SmallBarStackGraph',
          'Área protegida', ['#92ba3a', '#e9c948', '#5564a4'], handlerInfoGraph, openInfoGraph,
          '', '%')}
      </div>
      <div className="titeco2">
        <b>Distribución en área protegida: </b>
        {`${protectedArea} ha - ${getPercentage(protectedArea, generalArea)} %`}
        {RenderGraph(areaPA, '', '', 'SmallBarStackGraph',
          'Área protegida', ['#92ba3a', '#e9c948', '#5564a4'], handlerInfoGraph, openInfoGraph,
          '', '%')}
      </div>
      {(listSE && areaId && geofenceId) ? Object.values(listSE).map(item => (
        listEcosystems(
          Number(item.area), item.type, item.percentage,
          handlerInfoGraph, openInfoGraph, areaId, geofenceId,
        ))) : ''
      }
    </div>
  );
};

export default Overview;
