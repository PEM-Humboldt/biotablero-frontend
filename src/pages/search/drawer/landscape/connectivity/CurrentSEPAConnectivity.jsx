import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import GraphLoader from 'components/charts/GraphLoader';
import DownloadCSV from 'components/DownloadCSV';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import SearchContext from 'pages/search/SearchContext';
import formatNumber from 'utils/format';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import TextBoxes from 'components/TextBoxes';

const getLabel = {
  unprot: 'No protegida',
  prot_conn: 'Protegida conectada',
  prot_unconn: 'Protegida no conectada',
};

class CurrentSEPAConnectivity extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      currentPAConnParamo: [],
      currentPAConnDryForest: [],
      currentPAConnWetland: [],
      selectedEcosystem: null,
      protParamo: 0,
      protDryForest: 0,
      protWetland: 0,
      messages: {
        paramo: 'loading',
        dryForest: 'loading',
        wetland: 'loading',
      },
      texts: { paConnSE: {} },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;

    switchLayer('currentSEPAConn');

    RestAPI.requestCurrentPAConnectivityBySE(areaId, geofenceId, 'Páramo')
      .then((res) => {
        if (this.mounted) {
          let protParamo = 0;
          const protConn = res.find((item) => item.key === 'prot_conn');
          const protUnconn = res.find((item) => item.key === 'prot_unconn');
          if (protConn && protUnconn) {
            protParamo = (protConn.percentage + protUnconn.percentage) * 100;
          }
          this.setState((prev) => ({
            currentPAConnParamo: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            protParamo,
            messages: {
              ...prev.messages,
              paramo: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            paramo: 'no-data',
          },
        }));
      });

      RestAPI.requestCurrentPAConnectivityBySE(areaId, geofenceId, 'Bosque Seco Tropical')
      .then((res) => {
        if (this.mounted) {
          let protDryForest = 0;
          const protConn = res.find((item) => item.key === 'prot_conn');
          const protUnconn = res.find((item) => item.key === 'prot_unconn');
          if (protConn && protUnconn) {
            protDryForest = (protConn.percentage + protUnconn.percentage) * 100;
          }
          this.setState((prev) => ({
            currentPAConnDryForest: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            protDryForest,
            messages: {
              ...prev.messages,
              dryForest: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            dryForest: 'no-data',
          },
        }));
      });

      RestAPI.requestCurrentPAConnectivityBySE(areaId, geofenceId, 'Humedal')
      .then((res) => {
        if (this.mounted) {
          let protWetland = 0;
          const protConn = res.find((item) => item.key === 'prot_conn');
          const protUnconn = res.find((item) => item.key === 'prot_unconn');
          if (protConn && protUnconn) {
            protWetland = (protConn.percentage + protUnconn.percentage) * 100;
          }
          this.setState((prev) => ({
            currentPAConnWetland: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            protWetland,
            messages: {
              ...prev.messages,
              wetland: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            wetland: 'no-data',
          },
        }));
      });

    RestAPI.requestSectionTexts('paConnSE')
      .then((res) => {
        if (this.mounted) {
          this.setState({ texts: { paConnSE: res } });
        }
      })
      .catch(() => {
        this.setState({ texts: { paConnSE: {} } });
      });
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

  render() {
    const {
      areaId,
      geofenceId,
      handlerClickOnGraph,
    } = this.context;
    const {
      currentPAConnParamo,
      currentPAConnDryForest,
      currentPAConnWetland,
      showInfoGraph,
      selectedEcosystem,
      protParamo,
      protDryForest,
      protWetland,
      messages: { paramo, dryForest, wetland },
      texts,
    } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`graphinfo${showInfoGraph ? ' activeBox' : ''}`}
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            description={texts.paConnSE.info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div>
          <h3>Haz clic en la gráfica para seleccionar un EE</h3>
          <h6 className={selectedEcosystem === 'paramo' ? 'h6Selected' : null}>
            Páramo
          </h6>
          {(currentPAConnParamo && currentPAConnParamo.length > 0) && (
            <DownloadCSV
              data={currentPAConnParamo}
              filename={`bt_conn_paramo_${areaId}_${geofenceId}.csv`}
            />
          )}
          <div className="svgPointer">
            <GraphLoader
              graphType="LargeBarStackGraph"
              data={currentPAConnParamo}
              message={paramo}
              labelX="Hectáreas"
              labelY="Conectividad Áreas Protegidas Páramo"
              units="ha"
              colors={matchColor('currentPAConn')}
              padding={0.25}
              onClickGraphHandler={() => {
                this.setState({ selectedEcosystem: 'paramo' });
                handlerClickOnGraph({ chartType: 'paramoPAConn' });
              }}
            />
          </div>
          {currentPAConnParamo.length > 0 && (
            <div>
              <h6 className="innerInfo">
                Porcentaje de área protegida
              </h6>
              <h5
                className="innerInfoH5"
                style={{ backgroundColor: matchColor('timelinePAConn')('prot') }}
              >
                {`${formatNumber(protParamo, 2)}%`}
              </h5>
            </div>
          )}
          <h6 className={selectedEcosystem === 'dryForest' ? 'h6Selected' : null}>
            Bosque Seco Tropical
          </h6>
          {(currentPAConnDryForest && currentPAConnDryForest.length > 0) && (
            <DownloadCSV
              data={currentPAConnDryForest}
              filename={`bt_conn_dryforest_${areaId}_${geofenceId}.csv`}
            />
          )}
          <div className="svgPointer">
            <GraphLoader
              graphType="LargeBarStackGraph"
              data={currentPAConnDryForest}
              message={dryForest}
              labelX="Hectáreas"
              labelY="Conectividad Áreas Protegidas Bosque Seco Tropical"
              units="ha"
              colors={matchColor('currentPAConn')}
              padding={0.25}
              onClickGraphHandler={() => {
                this.setState({ selectedEcosystem: 'dryForest' });
                handlerClickOnGraph({ chartType: 'dryForestPAConn' });
              }}
            />
          </div>
          {currentPAConnDryForest.length > 0 && (
            <div>
              <h6 className="innerInfo">
                Porcentaje de área protegida
              </h6>
              <h5
                className="innerInfoH5"
                style={{ backgroundColor: matchColor('timelinePAConn')('prot') }}
              >
                {`${formatNumber(protDryForest, 2)}%`}
              </h5>
            </div>
          )}
          <h6 className={selectedEcosystem === 'wetland' ? 'h6Selected' : null}>
            Humedal
          </h6>
          {(currentPAConnWetland && currentPAConnWetland.length > 0) && (
            <DownloadCSV
              data={currentPAConnWetland}
              filename={`bt_conn_wetland_${areaId}_${geofenceId}.csv`}
            />
          )}
          <div className="svgPointer">
            <GraphLoader
              graphType="LargeBarStackGraph"
              data={currentPAConnWetland}
              message={wetland}
              labelX="Hectáreas"
              labelY="Conectividad Áreas Protegidas Humedal"
              units="ha"
              colors={matchColor('currentPAConn')}
              padding={0.25}
              onClickGraphHandler={() => {
                this.setState({ selectedEcosystem: 'wetland' });
                handlerClickOnGraph({ chartType: 'wetlandPAConn' });
              }}
            />
          </div>
          {currentPAConnWetland.length > 0 && (
          <div>
            <h6 className="innerInfo">
              Porcentaje de área protegida
            </h6>
            <h5
              className="innerInfoH5"
              style={{ backgroundColor: matchColor('timelinePAConn')('prot') }}
            >
              {`${formatNumber(protWetland, 2)}%`}
            </h5>
          </div>
          )}
          <TextBoxes
            consText={texts.paConnSE.cons}
            metoText={texts.paConnSE.meto}
            quoteText={texts.paConnSE.quote}
            isInfoOpen={showInfoGraph}
            toggleInfo={this.toggleInfoGraph}
          />
        </div>
      </div>
    );
  }
}

export default CurrentSEPAConnectivity;

CurrentSEPAConnectivity.contextType = SearchContext;
