
import React from 'react';
import PropTypes from 'prop-types';
import RenderGraph from '../charts/RenderGraph';

const CompensationFactor = (props) => {
  const {
    areaName,
    biomesColors,
    biomesData,
    bioticRegionsColors,
    bioticRegionsData,
    compensationFactorColors,
    compensationFactorData,
    handlerInfoGraph,
    openInfoGraph,
    matchColor,
  } = props;
  console.log('CompensationFactor matchColor', matchColor);
  // console.log('CompensationFactor matchColor - FC', matchColor('fc'));
  return (
    <div style={{ width: '100%' }}>
      <div className="graphcontainer">
        {(areaName && areaName === 'Jurisdicciones ambientales')
          && (
            <RenderGraph
              graph="LargeBarStackGraphNIVO"
              data={compensationFactorData}
              graphTitle="Factor de Compensación NIVO"
              labelX="Hectáreas"
              labelY="FC"
              handlerInfoGraph={handlerInfoGraph}
              openInfoGraph={openInfoGraph}
              graphDescription="representa las hectáreas sobre los Biomas IAvH analizados"
              zScale={matchColor('fc')}
            />
          )
        }
        {(areaName && areaName === 'Jurisdicciones ambientales')
          && (
          <RenderGraph
            graph="BarStackGraph"
            data={compensationFactorData}
            graphTitle="Factor de Compensación"
            colors={compensationFactorColors}
            labelX="Hectáreas"
            labelY="F C"
            handlerInfoGraph={handlerInfoGraph}
            openInfoGraph={openInfoGraph}
            graphDescription="representa las hectáreas sobre los Biomas IAvH analizados"
          />
          )
        }
        {(areaName && areaName === 'Jurisdicciones ambientales')
          && (
            <RenderGraph
              graph="BarStackGraph"
              data={biomesData}
              graphTitle="Biomas"
              colors={biomesColors}
              labelX="Hectáreas"
              labelY="Biomas"
              handlerInfoGraph={handlerInfoGraph}
              openInfoGraph={openInfoGraph}
              graphDescription="agrupa los biomas definidos a nivel nacional y presentes en esta área de consulta"
            />
          )
        }
        {(areaName && areaName === 'Jurisdicciones ambientales')
          && (
            <RenderGraph
              graph="BarStackGraph"
              data={bioticRegionsData}
              graphTitle="Regiones Bióticas"
              colors={bioticRegionsColors}
              labelX="Hectáreas"
              labelY="Regiones Bióticas"
              handlerInfoGraph={handlerInfoGraph}
              openInfoGraph={openInfoGraph}
              graphDescription="muestra las hectáreas por cada región biótica en el área de consulta seleccionada"
            />
          )
        }
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
};

CompensationFactor.propTypes = {
  areaName: PropTypes.string.isRequired,
  biomesColors: PropTypes.array.isRequired,
  biomesData: PropTypes.array,
  bioticRegionsColors: PropTypes.array.isRequired,
  bioticRegionsData: PropTypes.array,
  compensationFactorColors: PropTypes.array.isRequired,
  compensationFactorData: PropTypes.array,
  handlerInfoGraph: PropTypes.func.isRequired,
  openInfoGraph: PropTypes.object,
  matchColor: PropTypes.any,
};

CompensationFactor.defaultProps = {
  openInfoGraph: '',
  biomesData: null,
  bioticRegionsData: null,
  compensationFactorData: null,
  matchColor: null,
};

export default CompensationFactor;
