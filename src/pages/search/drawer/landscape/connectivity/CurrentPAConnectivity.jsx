import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import GraphLoader from 'components/charts/GraphLoader';
import { LegendColor } from 'components/CssLegends';
import DownloadCSV from 'components/DownloadCSV';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import { CurrentPAConnText } from 'pages/search/drawer/landscape/InfoTexts';
import SearchContext from 'pages/search/SearchContext';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import formatNumber from 'utils/format';

const getLabel = {
  unprot: 'No protegida',
  prot_conn: 'Protegida conectada',
  prot_unconn: 'Protegida no conectada',
};

const legendDPCCategories = {
  muy_bajo: 'Muy bajo',
  bajo: 'Bajo',
  medio: 'Medio',
  alto: 'Alto',
  muy_alto: 'Muy Alto',
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
            prot: protConn && protUnconn ? (protConn.percentage + protUnconn.percentage) * 100 : 0,
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
    const {
      areaId,
      geofenceId,
      handlerClickOnGraph,
    } = this.context;
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
              description={CurrentPAConnText}
              className="graphinfo2"
              collapseButton={false}
            />
          )
        )}
        <div>
          <h6>
            Conectividad áreas protegidas
          </h6>
          <DownloadCSV
            data={currentPAConnectivity}
            filename={`bt_conn_current_${areaId}_${geofenceId}.csv`}
          />
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
          {currentPAConnectivity.length > 0 && (
            <div>
              <h6 className="innerInfo">
                Porcentaje de área protegida
              </h6>
              <h5
                className="innerInfoH5"
                style={{ backgroundColor: matchColor('timelinePAConn')('prot') }}
              >
                {`${formatNumber(prot, 2)}%`}
              </h5>
            </div>
          )}
          <h6>
            Aporte de las áreas protegidas a la conectividad
          </h6>
          <DownloadCSV
            data={dpc}
            filename={`bt_conn_dpc_${areaId}_${geofenceId}.csv`}
          />
          <h3 className="innerInfoH3">
            Haz clic en un área protegida para visualizarla
          </h3>
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
            {Object.keys(legendDPCCategories).map((cat) => (
              <LegendColor
                color={matchColor('dpc')(cat)}
                key={cat}
              >
                {legendDPCCategories[cat]}
              </LegendColor>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default CurrentPAConnectivity;

CurrentPAConnectivity.contextType = SearchContext;
