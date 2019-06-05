/** eslint verified */
import React from 'react';
import RenderGraph from '../charts/RenderGraph';
import RestAPI from '../api/RestAPI';

const nationalPercentage = (areaId, geofenceId, name) => {
  RestAPI.requestSENationalPercentage(areaId, geofenceId, name)
    .then((res) => { console.log(res.national_percentage); return res; })
    .catch(() => 0);
};

const getDetails = (areaId, geofenceId, name) => {
  const relativeCoverage = RestAPI.requestSECoverageByGeofence(areaId, geofenceId, name)
    .then((res) => { console.log(res); return res; })
    .catch(() => 0);
  const relativePA = RestAPI.requestSEPAByGeofence(areaId, geofenceId, name)
    .then((res) => { console.log(res); return res; })
    .catch(() => 0);
  console.log(Promise.all([nationalPercentage, relativeCoverage, relativePA]));
};

const DetailsView = (/* TODO: Add all values required */
  npsp, // in national parks systems percentage
  sep, // in strategic ecosystems percentage
  coverage, // By default, should load transformed and natural area by %
  protectedArea, // By default, should load transformed and natural area by %
  handlerInfoGraph, openInfoGraph, // values for coverage
  colorsC, // color values for coverage
  colorsAP, // color values for protectedArea
  areaId,
  geofenceId,
  name,
) => (
  <div>
    { // TODO: Organize data
    }
    {RenderGraph(coverage, 'Tipo de área', 'Comparación', 'SmallBarStackGraph',
      'Cobertura', colorsC, handlerInfoGraph, openInfoGraph,
      'muestra la proporción del tipo de área en este ecosistema estratégico', '%')}
    {RenderGraph(protectedArea, 'Áreas protegidas y no protegidas', 'Comparación', 'SmallBarStackGraph',
      'Distribución de áreas protegidas y no protegidas', colorsAP, handlerInfoGraph, openInfoGraph,
      'representa las hectáreas en áreas protegidas y permite la comparación con el área no protegida', '%')}
    {
      <h3>
        En Ecosistemas Estratégicos:
        <b>{`${(Number(sep) * 100).toFixed(2)} %`}</b>
        <br />
        En SPN:
        <b>{`${Number(npsp).toFixed(2)} %`}</b>
      </h3>
    }
  </div>
);

export default DetailsView;
