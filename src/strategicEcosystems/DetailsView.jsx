/** eslint verified */
import React from 'react';
import RenderGraph from '../charts/RenderGraph';
import { setPAValues, setCoverageValues } from './FormatSE';

const DetailsView = (/* TODO: Add all values required */
  npsp, // percentage in "national system of protected areas" or SINAP
  sep, // in strategic ecosystems percentage
  coverage, // By default, should load transformed and natural area by %
  protectedArea, // By default, should load transformed and natural area by %
  handlerInfoGraph, openInfoGraph, // values for coverage
) => (
  <div>
    <h3>
      Distribución de coberturas:
    </h3>
    {RenderGraph(setCoverageValues(coverage), 'Tipo de área', 'Comparación', 'SmallBarStackGraph',
      'Cobertura', null, handlerInfoGraph, openInfoGraph,
      'muestra la proporción del tipo de área en este ecosistema estratégico', '%')}
    <h3>
      Distribución en áreas protegidas:
    </h3>
    {RenderGraph(setPAValues(protectedArea), 'Áreas protegidas y no protegidas', 'Comparación', 'SmallBarStackGraph',
      'Distribución de áreas protegidas y no protegidas', null, handlerInfoGraph, openInfoGraph,
      'representa las hectáreas en áreas protegidas y permite la comparación con el área no protegida', '%')}
    {
      <h3>
        En Ecosistemas Estratégicos:
        <b>{`${Number(sep).toFixed(2)} %`}</b>
        <br />
        En Sistema Nacional:
        <b>{`${Number(npsp).toFixed(2)} %`}</b>
      </h3>
    }
  </div>
);

export default DetailsView;
