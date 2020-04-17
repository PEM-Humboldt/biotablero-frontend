
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
  console.log('biomesData: ', biomesData);
  return (
    <div style={{ width: '100%' }}>
      <div className="graphcontainer">
        {(areaName && areaName === 'Jurisdicciones ambientales')
          && RenderGraph(
            compensationFactorData,
            'Hectáreas',
            'F C',
            'BarStackGraph',
            'Factor de Compensación',
            compensationFactorColors,
            handlerInfoGraph,
            openInfoGraph,
            'representa las hectáreas sobre los Biomas IAvH analizados',
          )}
        {(areaName && areaName === 'Jurisdicciones ambientales')
          && RenderGraph(
            biomesData,
            'Hectáreas',
            'Biomas',
            'BarStackGraph',
            'Biomas',
            biomesColors,
            handlerInfoGraph,
            openInfoGraph,
            'agrupa los biomas definidos a nivel nacional y presentes en esta área de consulta',
          )}
        {(areaName && areaName === 'Jurisdicciones ambientales')
          && RenderGraph(
            bioticRegionsData,
            'Hectáreas',
            'Regiones Bióticas',
            'BarStackGraph',
            'Regiones Bióticas',
            bioticRegionsColors,
            handlerInfoGraph,
            openInfoGraph,
            'muestra las hectáreas por cada región biótica en el área de consulta seleccionada',
          )}
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
