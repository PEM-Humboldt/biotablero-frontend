
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
  } = props;
  return (
    <div style={{ width: '100%' }}>
      <div className="graphcontainer">
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
  biomesColors: PropTypes.object.isRequired,
  biomesData: PropTypes.array.isRequired,
  bioticRegionsColors: PropTypes.object.isRequired,
  bioticRegionsData: PropTypes.array.isRequired,
  compensationFactorColors: PropTypes.object.isRequired,
  compensationFactorData: PropTypes.array.isRequired,
  handlerInfoGraph: PropTypes.func.isRequired,
  openInfoGraph: PropTypes.object,
};

CompensationFactor.defaultProps = {
  openInfoGraph: '',
};

export default CompensationFactor;
