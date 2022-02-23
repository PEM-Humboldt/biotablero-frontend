import InfoIcon from '@mui/icons-material/Info';
import React from 'react';

import GraphLoader from 'components/charts/GraphLoader';
import DownloadCSV from 'components/DownloadCSV';
import ShortInfo from 'components/ShortInfo';
import { InfoTooltip, IconTooltip } from 'components/Tooltips';
import {
  cFInfo,
  BiomesText,
  BioticRegionsText,
} from 'pages/search/drawer/landscape/InfoTexts';
import SearchContext from 'pages/search/SearchContext';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';

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
    this.setState((prevState) => ({
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
    return data.map((obj) => ({
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
    const {
      areaId,
      geofenceId,
    } = this.context;

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
              <DownloadCSV
                className="icondown"
                data={fc}
                filename={`bt_cf_compensation_factor_${areaId}_${geofenceId}.csv`}
              />
            </h2>
            <div className="graphinfobox">
              <IconTooltip title="Acerca de esta sección">
                <InfoIcon
                  className="graphinfo"
                  onClick={() => this.toggleInfoGraph()}
                />
              </IconTooltip>
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
              title={BiomesText}
            >
              <h3>
                Biomas
              </h3>
            </InfoTooltip>
            <DownloadCSV
              data={biomes}
              filename={`bt_cf_biomes_${areaId}_${geofenceId}.csv`}
            />
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
              title={BioticRegionsText}
            >
              <h3>
                Regiones Bióticas
              </h3>
            </InfoTooltip>
            <DownloadCSV
              data={bioticUnits}
              filename={`bt_cf_biotic_units_${areaId}_${geofenceId}.csv`}
            />
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
