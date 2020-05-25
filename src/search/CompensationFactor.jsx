
import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import GraphLoader from '../charts/GraphLoader';


const CompensationFactor = (props) => {
  const {
    areaName,
    biomesData,
    bioticRegionsData,
    compensationFactorData,
    handlerInfoGraph,
    openInfoGraph,
    matchColor,
  } = props;
  return (
    <div style={{ width: '100%' }}>
      <div className="graphinside">
        <div className="graphcardAcc">
          {(areaName === 'Jurisdicciones ambientales')
            && [
              (
                <h2>
                  Factor de Compensación
                  <InfoIcon
                    className="graphinfo"
                    data-tooltip
                    title="¿Qué significa este gráfico?"
                    onClick={() => {
                      handlerInfoGraph('Factor de Compensación');
                    }}
                  />
                  <div
                    className="graphinfo"
                    onClick={() => handlerInfoGraph('Factor de Compensación')}
                    onKeyPress={() => handlerInfoGraph('Factor de Compensación')}
                    role="button"
                    tabIndex="0"
                  />
                  <DownloadIcon className="icondown" />
                </h2>
              ),
              (
                openInfoGraph && (openInfoGraph === 'Factor de Compensación') && (
                <ShortInfo
                  name="Factor de Compensación."
                  description="La primera gráfica muestra la cantidad de hectáreas por valor de compensación en el área seleccionada. Estos valores se consiguen al cruzar análisis entre las áreas de las dos siguientes gráficas, Biomas y Regiones bióticas del área seleccionada. "
                  className="graphinfo2"
                  tooltip="¿Qué significa?"
                  customButton
                />
                )
              ),
              (
                <GraphLoader
                  graphType="LargeBarStackGraph"
                  data={compensationFactorData}
                  labelX="Hectáreas"
                  labelY="Factor de Compensación"
                  units="ha"
                  zScale={matchColor('fc')}
                  padding={0.25}
                />
              ),
              (
                <h3>
                  Biomas
                </h3>
              ),
              (
                <GraphLoader
                  graphType="LargeBarStackGraph"
                  data={biomesData}
                  labelX="Hectáreas"
                  labelY="Biomas"
                  units="ha"
                  zScale={matchColor('biomas')}
                  padding={0.3}
                />
              ),
              (
                <h3>
                  Regiones Bióticas
                </h3>
              ),
              (
                <GraphLoader
                  graphType="LargeBarStackGraph"
                  data={bioticRegionsData}
                  labelX="Hectáreas"
                  labelY="Regiones Bióticas"
                  units="ha"
                  zScale={matchColor('bioticReg')}
                  padding={0.3}
                />
              ),
            ]}
          {(areaName !== 'Jurisdicciones ambientales')
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
    </div>
  );
};

CompensationFactor.propTypes = {
  areaName: PropTypes.string.isRequired,
  biomesData: PropTypes.array,
  bioticRegionsData: PropTypes.array,
  compensationFactorData: PropTypes.array,
  handlerInfoGraph: PropTypes.func.isRequired,
  openInfoGraph: PropTypes.object,
  matchColor: PropTypes.func,
};

CompensationFactor.defaultProps = {
  openInfoGraph: '',
  biomesData: null,
  bioticRegionsData: null,
  compensationFactorData: null,
  matchColor: () => {},
};

export default CompensationFactor;
