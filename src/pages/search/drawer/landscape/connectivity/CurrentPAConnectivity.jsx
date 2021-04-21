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

class CurrentPAConnectivity extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      currentPAConnectivity: [],
      dpc: [],
      prot: 0,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
    } = this.context;

    RestAPI.requestCurrentPAConnectivity(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          const protConn = res.find((item) => item.key === 'prot_conn');
          const protUnconn = res.find((item) => item.key === 'prot_unconn');
          this.setState({
            currentPAConnectivity: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            prot: protConn && protUnconn ? protConn.percentage + protUnconn.percentage : 0,
          });
        }
      })
      .catch(() => {});

    RestAPI.requestDPC(areaId, geofenceId, 5)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            dpc: res.reverse(),
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
    const { handlerClickOnGraph } = this.context;
    const {
      currentPAConnectivity,
      dpc,
      prot,
      showInfoGraph,
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
              description="Current PA Connectivity"
              className="graphinfo2"
              collapseButton={false}
            />
          )
        )}
        <div>
          <h6>
            Conectividad áreas protegidas
          </h6>
          <div>
            <h6>
              Indice Prot
            </h6>
            <h5 style={{ backgroundColor: '#d5a529' }}>
              {`${formatNumber(prot, 2)}%`}
            </h5>
          </div>
          <div>
            <GraphLoader
              graphType="LargeBarStackGraph"
              data={currentPAConnectivity}
              labelX="Hectáreas"
              labelY="Conectividad Áreas Protegidas"
              units="ha"
              colors={matchColor('currentPAConn')}
              padding={0.25}
            />
          </div>
          <h6>
            Áreas protegidas con mayor dPC
          </h6>
          <div>
            <GraphLoader
              graphType="MultiSmallSingleBarGraph"
              data={dpc}
              colors={matchColor('dpc')}
              onClickGraphHandler={(selected) => handlerClickOnGraph({ selectedKey: selected })}
              labelX="dPC"
              units="ha"
            />
          </div>
          <div className="dpcLegend">
            <p className="dpc1">Muy bajo</p>
            <p className="dpc2">Bajo</p>
            <p className="dpc3">Medio</p>
            <p className="dpc4">Alto</p>
            <p className="dpc5">Muy alto</p>
          </div>
        </div>
      </div>
    );
  }
}

export default CurrentPAConnectivity;

CurrentPAConnectivity.contextType = SearchContext;
