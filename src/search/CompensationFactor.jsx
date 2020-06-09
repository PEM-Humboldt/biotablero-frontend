
import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import GraphLoader from '../charts/GraphLoader';

class CompensationFactor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
    };
  }

  toggleInfoGraph = () => {
    this.setState(prevState => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  processData = (data) => {
    if (!data) return [];
    return data.map(obj => ({
      key: `${obj.key}`,
      area: parseFloat(obj.area),
      label: `${obj.key}`,
    }));
  };

  render() {
    const {
      areaName,
      biomesData,
      bioticRegionsData,
      compensationFactorData,
      matchColor,
    } = this.props;
    const { showInfoGraph } = this.state;
    return (
      <div style={{ width: '100%' }}>
        <div className="graphinside">
          <div className="graphcardAcc">
            {(areaName === 'Jurisdicciones ambientales')
              ? (
                <div>
                  <h2>
                    Factor de Compensación
                    <InfoIcon
                      className="graphinfo"
                      data-tooltip
                      title="¿Qué significa este gráfico?"
                      onClick={() => this.toggleInfoGraph()}
                    />
                    <div
                      className="graphinfo"
                      onClick={() => this.toggleInfoGraph()}
                      onKeyPress={() => this.toggleInfoGraph()}
                      role="button"
                      tabIndex="0"
                    />
                    <DownloadIcon className="icondown" />
                  </h2>
                  {showInfoGraph && (
                    <ShortInfo
                      name="Factor de Compensación."
                      description="La primera gráfica muestra la cantidad de hectáreas por valor de compensación en el área seleccionada. Estos valores se consiguen al cruzar análisis entre las áreas de las dos siguientes gráficas, Biomas y Regiones bióticas del área seleccionada. "
                      className="graphinfo2"
                      tooltip="¿Qué significa?"
                      customButton
                    />
                  )}
                  <GraphLoader
                    graphType="LargeBarStackGraph"
                    data={this.processData(compensationFactorData)}
                    labelX="Hectáreas"
                    labelY="Factor de Compensación"
                    units="ha"
                    colors={matchColor('fc')}
                    padding={0.25}
                  />
                  <h3>
                    Biomas
                  </h3>
                  <GraphLoader
                    graphType="LargeBarStackGraph"
                    data={this.processData(biomesData)}
                    labelX="Hectáreas"
                    labelY="Biomas"
                    units="ha"
                    colors={matchColor('biomas')}
                    padding={0.3}
                  />
                  <h3>
                    Regiones Bióticas
                  </h3>
                  <GraphLoader
                    graphType="LargeBarStackGraph"
                    data={this.processData(bioticRegionsData)}
                    labelX="Hectáreas"
                    labelY="Regiones Bióticas"
                    units="ha"
                    colors={matchColor('bioticReg')}
                    padding={0.3}
                  />
                </div>
              )
              : (
                <div className="graphcard">
                  <h2>
                    Gráficas en construcción
                  </h2>
                  <p>
                    Pronto más información
                  </p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

CompensationFactor.propTypes = {
  areaName: PropTypes.string.isRequired,
  biomesData: PropTypes.array,
  bioticRegionsData: PropTypes.array,
  compensationFactorData: PropTypes.array,
  matchColor: PropTypes.func,
};

CompensationFactor.defaultProps = {
  biomesData: null,
  bioticRegionsData: null,
  compensationFactorData: null,
  matchColor: () => {},
};

export default CompensationFactor;
