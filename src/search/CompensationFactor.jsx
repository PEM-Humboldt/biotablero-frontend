
import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import RenderGraph from '../charts/RenderGraph';


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
      <div className="graphcontainer">
        <div className="graphcard pb">
          {(areaName === 'Jurisdicciones ambientales')
            && [
              (
                <h2>
                  <DownloadIcon className="icondown" />
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
                  >
                    Factor de Compensación
                  </div>
                </h2>
              ),
              (
                openInfoGraph && (openInfoGraph === 'Factor de Compensación') && (
                <ShortInfo
                  name="Factor de Compensación"
                  description="representa las hectáreas sobre los Biomas IAvH analizados"
                  className="graphinfo2"
                  tooltip="¿Qué significa?"
                  customButton
                />
                )
              ),
              (
                <RenderGraph
                  graph="LargeBarStackGraph"
                  data={compensationFactorData}
                  graphTitle="Factor de Compensación"
                  labelX="Hectáreas"
                  labelY="Factor de Compensación"
                  handlerInfoGraph={handlerInfoGraph}
                  openInfoGraph={openInfoGraph}
                  graphDescription="representa las hectáreas sobre los Biomas IAvH analizados"
                  zScale={matchColor('fc')}
                  padding={0.25}
                />
              ),
              (
                <RenderGraph
                  graph="LargeBarStackGraph"
                  data={biomesData}
                  graphTitle="Biomas"
                  labelX="Hectáreas"
                  labelY="Biomas"
                  handlerInfoGraph={handlerInfoGraph}
                  openInfoGraph={openInfoGraph}
                  graphDescription="agrupa los biomas definidos a nivel nacional y presentes en esta área de consulta"
                  zScale={matchColor('biomas')}
                  padding={0.3}
                />
              ),
              (
                <RenderGraph
                  graph="LargeBarStackGraph"
                  data={bioticRegionsData}
                  graphTitle="Regiones Bióticas"
                  labelX="Hectáreas"
                  labelY="Regiones Bióticas"
                  handlerInfoGraph={handlerInfoGraph}
                  openInfoGraph={openInfoGraph}
                  graphDescription="muestra las hectáreas por cada región biótica en el área de consulta seleccionada"
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
