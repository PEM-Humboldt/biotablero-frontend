import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import SearchContext from '../../SearchContext';
import ShortInfo from '../../commons/ShortInfo';
import { IconTooltip } from '../../commons/tooltips';
import GraphLoader from '../../charts/GraphLoader';
import matchColor from '../../commons/matchColor';
import RestAPI from '../../api/RestAPI';

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
    } = this.context;
    RestAPI.requestEcoChangeLPCategories(areaId, geofenceId)
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
          });
        }
      })
      .catch(() => {});
    RestAPI.requestEcoChangePersistenceValue(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            forestPersistenceValue: Number(res.area),
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
    const { handlerClickOnGraph } = this.context;
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
            {forestPersistenceValue}
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
              handlerClickOnGraph('forestLP', period, key);
            }}
            selectedIndexValue="2016-2019"
          />
        </div>
      </div>
    );
  }
}

export default ForestLossPersistence;

ForestLossPersistence.contextType = SearchContext;
