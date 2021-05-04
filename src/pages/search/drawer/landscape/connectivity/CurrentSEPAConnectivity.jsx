import React from 'react';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import InfoIcon from '@material-ui/icons/Info';
import GraphLoader from 'components/charts/GraphLoader';
import matchColor from 'utils/matchColor';
import SearchContext from 'pages/search/SearchContext';
import RestAPI from 'utils/restAPI';
import formatNumber from 'utils/format';

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
      showInfoGraph: false,
      currentPAConnParamo: [],
      currentPAConnDryForest: [],
      currentPAConnWetland: [],
      selectedEcosystem: null,
      protParamo: 0,
      protDryForest: 0,
      protWetland: 0,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
    } = this.context;

    RestAPI.requestCurrentPAConnectivityBySE(areaId, geofenceId, 'Páramo')
      .then((res) => {
        if (this.mounted) {
          let protParamo = 0;
          const protConn = res.find((item) => item.key === 'prot_conn');
          const protUnconn = res.find((item) => item.key === 'prot_unconn');
          if (protConn && protUnconn) {
            protParamo = (protConn.percentage + protUnconn.percentage) * 100;
          }
          this.setState({
            currentPAConnParamo: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            protParamo,
          });
        }
      })
      .catch(() => {});

      RestAPI.requestCurrentPAConnectivityBySE(areaId, geofenceId, 'Bosque Seco Tropical')
      .then((res) => {
        if (this.mounted) {
          let protDryForest = 0;
          const protConn = res.find((item) => item.key === 'prot_conn');
          const protUnconn = res.find((item) => item.key === 'prot_unconn');
          if (protConn && protUnconn) {
            protDryForest = (protConn.percentage + protUnconn.percentage) * 100;
          }
          this.setState({
            currentPAConnDryForest: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            protDryForest,
          });
        }
      })
      .catch(() => {});

      RestAPI.requestCurrentPAConnectivityBySE(areaId, geofenceId, 'Humedal')
      .then((res) => {
        if (this.mounted) {
          let protWetland = 0;
          const protConn = res.find((item) => item.key === 'prot_conn');
          const protUnconn = res.find((item) => item.key === 'prot_unconn');
          if (protConn && protUnconn) {
            protWetland = (protConn.percentage + protUnconn.percentage) * 100;
          }
          this.setState({
            currentPAConnWetland: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            protWetland,
          });
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

  render() {
    const {
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
    } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Acerca de esta sección">
            <InfoIcon
              className="graphinfo"
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {(
          showInfoGraph && (
            <ShortInfo
              description="Current PA Connectivity By SE"
              className="graphinfo2"
              collapseButton={false}
            />
          )
        )}
        <div>
          <h3>Haz clic en la gráfica para seleccionar un EE</h3>
          <h6 className={selectedEcosystem === 'paramo' ? 'h6Selected' : null}>
            Páramo
          </h6>
          <div className="svgPointer">
            <GraphLoader
              graphType="LargeBarStackGraph"
              data={currentPAConnParamo}
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
          <div className="svgPointer">
            <GraphLoader
              graphType="LargeBarStackGraph"
              data={currentPAConnDryForest}
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
          <div className="svgPointer">
            <GraphLoader
              graphType="LargeBarStackGraph"
              data={currentPAConnWetland}
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
        </div>
      </div>
    );
  }
}

export default CurrentSEPAConnectivity;

CurrentSEPAConnectivity.contextType = SearchContext;
