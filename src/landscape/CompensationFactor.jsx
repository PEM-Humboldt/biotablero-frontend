import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import React from 'react';

import GraphLoader from '../charts/GraphLoader';
import RestAPI from '../api/RestAPI';
import SearchContext from '../SearchContext';
import ShortInfo from '../commons/ShortInfo';

class CompensationFactor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      biomes: null,
      fc: null,
      bioticUnits: null,
    };
  }

  componentDidMount() {
    const {
      areaId,
      geofenceId,
    } = this.context;

    if (areaId !== 'ea') return;

    RestAPI.requestBiomes(areaId, geofenceId)
      .then((res) => {
        this.setState({ biomes: this.processData(res) });
      })
      .catch(() => {});

    RestAPI.requestCompensationFactor(areaId, geofenceId)
      .then((res) => {
        this.setState({ fc: this.processData(res) });
      })
      .catch(() => {});

    RestAPI.requestBioticUnits(areaId, geofenceId)
      .then((res) => {
        this.setState({ bioticUnits: this.processData(res) });
      })
      .catch(() => {});
  }

  /**
   * Show or hide the detailed information on each graph
   */
  toggleInfoGraph = () => {
    this.setState(prevState => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  /**
   * Transform data to fit in the graph structure
   * @param {array} data data to be transformed
   *
   * @returns {array} data transformed
   */
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
      matchColor,
    } = this.props;
    const {
      showInfoGraph,
      biomes,
      fc,
      bioticUnits,
    } = this.state;

    if (!biomes || !bioticUnits || !fc) {
      return (
        <div className="graphcard" style={{ width: '100%' }}>
          <h2>
            Gráficas en construcción
          </h2>
          <p>
            Pronto más información
          </p>
        </div>
      );
    }
    return (
      <div style={{ width: '100%' }}>
        <div className="graphinside">
          <div className="graphcardAcc">
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
              data={fc}
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
              data={biomes}
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
              data={bioticUnits}
              labelX="Hectáreas"
              labelY="Regiones Bióticas"
              units="ha"
              colors={matchColor('bioticReg')}
              padding={0.3}
            />
          </div>
        </div>
      </div>
    );
  }
}

CompensationFactor.propTypes = {
  matchColor: PropTypes.func,
};

CompensationFactor.defaultProps = {
  matchColor: () => {},
};

export default CompensationFactor;

CompensationFactor.contextType = SearchContext;
