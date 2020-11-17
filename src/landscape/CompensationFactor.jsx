import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import React from 'react';

import { InfoTooltip, IconTooltip } from '../commons/tooltips';
import {
  cFInfo,
  biomesText,
  bioticRegionsText,
} from './assets/info_texts';
import GraphLoader from '../charts/GraphLoader';
import matchColor from '../commons/matchColor';
import RestAPI from '../api/RestAPI';
import SearchContext from '../SearchContext';
import ShortInfo from '../commons/ShortInfo';

class CompensationFactor extends React.Component {
  mounted = false;

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
    this.mounted = true;
    const {
      areaId,
      geofenceId,
    } = this.context;

    if (areaId !== 'ea') return;

    RestAPI.requestBiomes(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({ biomes: this.processData(res) });
        }
      })
      .catch(() => {});

    RestAPI.requestCompensationFactor(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({ fc: this.processData(res) });
        }
      })
      .catch(() => {});

    RestAPI.requestBioticUnits(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({ bioticUnits: this.processData(res) });
        }
      })
      .catch(() => {});
  }

  componentWillUnmount() {
    this.mounted = false;
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
              <DownloadIcon className="icondown" />
            </h2>
            <div className="graphinfobox">
              <IconTooltip title="Acerca de esta sección">
                <InfoIcon
                  className="graphinfo"
                  onClick={() => this.toggleInfoGraph()}
                />
              </IconTooltip>
              <div
                className="graphinfo"
                onClick={() => this.toggleInfoGraph()}
                onKeyPress={() => this.toggleInfoGraph()}
                role="button"
                tabIndex="0"
              />
              {showInfoGraph && (
                <ShortInfo
                  description={cFInfo}
                  className="graphinfo2"
                  collapseButton={false}
                />
              )}
            </div>
            <GraphLoader
              graphType="LargeBarStackGraph"
              data={fc}
              labelX="Hectáreas"
              labelY="Factor de Compensación"
              units="ha"
              colors={matchColor('fc')}
              padding={0.25}
            />
            <InfoTooltip
              placement="left"
              interactive
              title={biomesText}
            >
              <h3>
                Biomas
              </h3>
            </InfoTooltip>
            <GraphLoader
              graphType="LargeBarStackGraph"
              data={biomes}
              labelX="Hectáreas"
              labelY="Biomas"
              units="ha"
              colors={matchColor('biomas')}
              padding={0.3}
            />
            <InfoTooltip
              placement="left"
              interactive
              title={bioticRegionsText}
            >
              <h3>
                Regiones Bióticas
              </h3>
            </InfoTooltip>
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

export default CompensationFactor;

CompensationFactor.contextType = SearchContext;
