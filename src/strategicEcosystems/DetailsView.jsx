/** eslint verified */
import React from 'react';
import RenderGraph from '../charts/RenderGraph';

const DetailsView = (/* TODO: Add all values required */
  dataAreaType, // By default, should load transformed and natural area by %
  dataProtectedArea, // By default, should load transformed and natural area by %
  handlerInfoGraph, openInfoGraph, // values for dataAreaType
  colorsNT, // color values for dataAreaType
  colorsAP, // color values for dataProtectedArea
) => (
  <div>
    {RenderGraph(dataAreaType, 'Tipo de área', 'Comparación', 'BarStackHorizontal',
      'Tipos de áreas', colorsNT, handlerInfoGraph, openInfoGraph,
      'muestra la proporción del tipo de área en este ecosistema estratégico', '%')}
    {RenderGraph(dataProtectedArea, 'Áreas protegidas y no protegidas', 'Comparación', 'BarStackHorizontal',
      'Distribución de áreas protegidas y no protegidas', colorsAP, handlerInfoGraph, openInfoGraph,
      'representa las hectáreas en áreas protegidas y permite la comparación con el área no protegida', '%')}
  </div>
);

export default DetailsView;
