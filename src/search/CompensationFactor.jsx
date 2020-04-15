
import React from 'react';
import RenderGraph from '../charts/RenderGraph';

const CompensationFactor = (
  // all this current component is a previous version that must be refactored
  // and looking for receive just an object (the props parameter) instead of several parameters
  areaName,
  biomesColors,
  biomesData,
  bioticRegionsColors,
  bioticRegionsData,
  compensationFactorColors,
  compensationFactorData,
  handlerInfoGraph,
  openInfoGraph,
) => (
  <div className="graphcard">
    <div className="graphcontainer">
      <h4>
        hectáreas totales
        <b> 1,827,103.00 ha</b>
      </h4>
      {(areaName && areaName === 'Jurisdicciones ambientales')
        && RenderGraph(compensationFactorData, 'Hectáreas', 'F C', 'BarStackGraph', 'Factor de Compensación', compensationFactorColors, handlerInfoGraph, openInfoGraph, 'representa las hectáreas sobre los Biomas IAvH analizados')}
      {(areaName && areaName === 'Jurisdicciones ambientales')
        && RenderGraph(biomesData, 'Hectáreas', 'Biomas', 'BarStackGraph', 'Biomas', biomesColors, handlerInfoGraph, openInfoGraph, 'agrupa los biomas definidos a nivel nacional y presentes en esta área de consulta')}
      {(areaName && areaName === 'Jurisdicciones ambientales')
        && RenderGraph(bioticRegionsData, 'Hectáreas', 'Regiones Bióticas', 'BarStackGraph', 'Regiones Bióticas', bioticRegionsColors, handlerInfoGraph, openInfoGraph, 'muestra las hectáreas por cada región biótica en el área de consulta seleccionada')}
      {(areaName && areaName !== 'Jurisdicciones ambientales')
        && (
          <div className="graphcard">
            <h2>
              Gráficas en construcción
            </h2>
            <p>
              Pronto más información
            </p>
          </div>
        )}
    </div>
  </div>
);

export default CompensationFactor;
