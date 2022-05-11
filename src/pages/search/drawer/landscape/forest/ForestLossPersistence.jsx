import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import SearchContext from 'pages/search/SearchContext';
import GraphLoader from 'components/charts/GraphLoader';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import formatNumber from 'utils/format';
import { LPTexts } from 'pages/search/drawer/landscape/forest/InfoTexts';
import TextBoxes from 'components/TextBoxes';

const {
  info,
  meto,
  cons,
  quote,
} = LPTexts;

const LATEST_PERIOD = '2016-2021';

const getLabel = {
  persistencia: 'Persistencia',
  perdida: 'Pérdida',
  ganancia: 'Ganancia',
  no_bosque: 'No bosque',
};

class ForestLossPersistence extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      forestLP: [],
      forestPersistenceValue: 0,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
      switchLayer,
    } = this.context;

    const getPersistenceValue = (data) => {
      const periodData = data ? data.find((item) => item.id === LATEST_PERIOD).data : null;
      const persistenceData = periodData ? periodData.find((item) => item.key === 'persistencia') : null;
      return persistenceData ? persistenceData.area : 0;
    };

    switchLayer(`forestLP-${LATEST_PERIOD}`);

    RestAPI.requestForestLP(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            forestLP: res.map((item) => ({
              ...item,
              data: item.data.map((element) => ({
                ...element,
                label: getLabel[element.key],
              }
              )),
            })),
            forestPersistenceValue: getPersistenceValue(res),
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

  /**
   * Process data to be downloaded as a csv file
   *
   * @param {Object} data data transformed passed to graph
   */
  processDownload = (data) => {
    const result = [];
    data.forEach((period) => (
      period.data.forEach((obj) => {
        result.push({
          period: period.id,
          category: obj.label,
          area: obj.area,
          percentage: obj.percentage,
        });
      })));
    return result;
  };

  render() {
    const {
      forestLP,
      forestPersistenceValue,
      showInfoGraph,
    } = this.state;
    const {
      areaId,
      geofenceId,
      handlerClickOnGraph,
    } = this.context;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className="graphinfo"
              onClick={this.toggleInfoGraph}
            />
          </IconTooltip>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            description={info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div>
          <h6>
            Cobertura actual
          </h6>
          <h5 style={{ backgroundColor: matchColor('forestLP')('persistencia') }}>
            {`${formatNumber(forestPersistenceValue, 0)} ha `}
          </h5>
        </div>
        <div>
          <h6>
            Cobertura de bosque en el tiempo
          </h6>
        </div>
        <div>
          <GraphLoader
            graphType="MultiSmallBarStackGraph"
            data={forestLP}
            units="ha"
            colors={matchColor('forestLP')}
            onClickGraphHandler={(period, key) => {
              handlerClickOnGraph({
                chartType: 'forestLP',
                chartSection: period,
                selectedKey: key,
              });
            }}
            selectedIndexValue="2016-2021"
          />
        </div>
        <TextBoxes
          consText={cons}
          metoText={meto}
          quoteText={quote}
          downloadData={this.processDownload(forestLP)}
          downloadName={`forest_loss_persistence_${areaId}_${geofenceId}.csv`}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
      </div>
    );
  }
}

export default ForestLossPersistence;

ForestLossPersistence.contextType = SearchContext;
