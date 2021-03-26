import React from 'react';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import InfoIcon from '@material-ui/icons/Info';
import GraphLoader from 'components/charts/GraphLoader';
import matchColor from 'utils/matchColor';
import SearchContext from 'pages/search/SearchContext';
import RestAPI from 'utils/restAPI';

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
          this.setState({
            currentPAConnParamo: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
          });
        }
      })
      .catch(() => {});

      RestAPI.requestCurrentPAConnectivityBySE(areaId, geofenceId, 'Bosque Seco Tropical')
      .then((res) => {
        if (this.mounted) {
          this.setState({
            currentPAConnDryForest: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
          });
        }
      })
      .catch(() => {});

      RestAPI.requestCurrentPAConnectivityBySE(areaId, geofenceId, 'Humedal')
      .then((res) => {
        if (this.mounted) {
          this.setState({
            currentPAConnWetland: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
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
        </div>
      </div>
    );
  }
}

export default CurrentSEPAConnectivity;

CurrentSEPAConnectivity.contextType = SearchContext;
