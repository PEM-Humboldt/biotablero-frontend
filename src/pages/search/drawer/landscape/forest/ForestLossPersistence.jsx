import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import SearchContext from 'pages/search/SearchContext';
import GraphLoader from 'components/charts/GraphLoader';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import formatNumber from 'utils/format';
import DownloadCSV from 'components/DownloadCSV';

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
      showInfoGraph: false,
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
            name="Perdida y persistencia"
            description="Perdida y persistencia"
            className="graphinfo2"
            collapseButton={false}
          />
          )
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
          <DownloadCSV
            className="icondown"
            data={forestLP}
            filename={`bt_cf_forest_loss_persistence_${areaId}_${geofenceId}.csv`}
          />
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
      </div>
    );
  }
}

export default ForestLossPersistence;

ForestLossPersistence.contextType = SearchContext;
