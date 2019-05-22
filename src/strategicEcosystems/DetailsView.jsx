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
    {RenderGraph(dataAreaType, 'Tipo de área', 'Comparación', 'SmallBarStackGraph',
      'Cobertura', colorsNT, handlerInfoGraph, openInfoGraph,
      'muestra la proporción del tipo de área en este ecosistema estratégico', '%')}
    {RenderGraph(dataProtectedArea, 'Áreas protegidas y no protegidas', 'Comparación', 'SmallBarStackGraph',
      'Distribución de áreas protegidas y no protegidas', colorsAP, handlerInfoGraph, openInfoGraph,
      'representa las hectáreas en áreas protegidas y permite la comparación con el área no protegida', '%')}
    {RenderGraph(dataProtectedArea, 'Áreas protegidas y no protegidas', 'Comparación', 'SmallBarStackGraph',
      'Distribución de áreas protegidas y no protegidas', ['#5f8f2c', '#667521', '#75680f'], handlerInfoGraph, openInfoGraph,
      'representa las hectáreas en áreas protegidas y permite la comparación con el área no protegida', '%')}
    {`${Number(0.03).toFixed(2)} % SPN`}
  </div>
);

export default DetailsView;
