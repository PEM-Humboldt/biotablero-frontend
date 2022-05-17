import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import GraphLoader from 'components/charts/GraphLoader';
import { LegendColor } from 'components/CssLegends';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import { CurrentPAConnTexts, DPCConnTexts } from 'pages/search/drawer/landscape/connectivity/InfoTexts';
import SearchContext from 'pages/search/SearchContext';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import formatNumber from 'utils/format';
import TextBoxes from 'components/TextBoxes';

const {
  info: connInfo,
  meto: connMeto,
  cons: connCons,
  quote: connQuote,
} = CurrentPAConnTexts;

const {
  info: dpcInfo,
  meto: dpcMeto,
  cons: dpcCons,
  quote: dpcQuote,
} = DPCConnTexts;

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
      infoShown: new Set(['current']),
      currentPAConnectivity: [],
      dpc: [],
      prot: 0,
      messages: {
        conn: 'loading',
        dpc: 'loading',
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;

    switchLayer('currentPAConn');

    RestAPI.requestCurrentPAConnectivity(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          const protConn = res.find((item) => item.key === 'prot_conn');
          const protUnconn = res.find((item) => item.key === 'prot_unconn');
          this.setState((prev) => ({
            currentPAConnectivity: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            prot: protConn && protUnconn ? (protConn.percentage + protUnconn.percentage) * 100 : 0,
            messages: {
              ...prev.messages,
              conn: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            conn: 'no-data',
          },
        }));
      });

    RestAPI.requestDPC(areaId, geofenceId, 5)
      .then((res) => {
        if (this.mounted) {
          this.setState((prev) => ({
            dpc: res.reverse(),
            messages: {
              ...prev.messages,
              dpc: null,
            },
          }));
        }
      })
      .catch(() => {
        this.setState((prev) => ({
          messages: {
            ...prev.messages,
            dpc: 'no-data',
          },
        }));
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  toggleInfo = (value) => {
    this.setState((prev) => {
      const newState = prev;
      if (prev.infoShown.has(value)) {
        newState.infoShown.delete(value);
        return newState;
      }
      newState.infoShown.add(value);
      return newState;
    });
  }

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
      infoShown,
      messages: { conn, dpc: dpcMess },
    } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className="graphinfo"
              onClick={() => this.toggleInfo('current')}
            />
          </IconTooltip>
        </h2>
        {infoShown.has('current') && (
          <ShortInfo
            description={connInfo}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div>
          <h6>
            Conectividad áreas protegidas
          </h6>
          <div>
            <GraphLoader
              graphType="LargeBarStackGraph"
              data={currentPAConnectivity}
              message={conn}
              labelX="Hectáreas"
              labelY="Conectividad Áreas Protegidas"
              units="ha"
              colors={matchColor('currentPAConn')}
              padding={0.25}
            />
            <TextBoxes
              consText={connCons}
              metoText={connMeto}
              quoteText={connQuote}
              downloadData={currentPAConnectivity}
              downloadName={`conn_current_${areaId}_${geofenceId}.csv`}
              toggleInfo={() => this.toggleInfo('current')}
              isInfoOpen={infoShown.has('current')}
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
          <IconTooltip title="Interpretación">
            <InfoIcon
              className="downSpecial"
              onClick={() => this.toggleInfo('dpc')}
            />
          </IconTooltip>
          {infoShown.has('dpc') && (
            <ShortInfo
              description={dpcInfo}
              className="graphinfo2"
              collapseButton={false}
            />
          )}
          <h3 className="innerInfoH3">
            Haz clic en un área protegida para visualizarla
          </h3>
          <div>
            <GraphLoader
              graphType="MultiSmallSingleBarGraph"
              data={dpc}
              message={dpcMess}
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
          <TextBoxes
            consText={dpcCons}
            metoText={dpcMeto}
            quoteText={dpcQuote}
            downloadData={dpc}
            downloadName={`conn_dpc_${areaId}_${geofenceId}.csv`}
            isInfoOpen={infoShown.has('dpc')}
            toggleInfo={() => this.toggleInfo('dpc')}
          />
        </div>
      </div>
    );
  }
}

export default CurrentPAConnectivity;

CurrentPAConnectivity.contextType = SearchContext;
