import React from 'react';

import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import InfoIcon from '@material-ui/icons/Info';
import { TimelinePAConnText } from 'pages/search/drawer/landscape/InfoTexts';
import GraphLoader from 'components/charts/GraphLoader';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import SearchContext from 'pages/search/SearchContext';

class TimelinePAConnectivity extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      timelinePAConnectivity: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId } = this.context;
    Promise.all([
      RestAPI.requestTimelinePAConnectivity(areaId, geofenceId, 'prot'),
      RestAPI.requestTimelinePAConnectivity(areaId, geofenceId, 'prot_conn'),
    ])
      .then((res) => {
        if (this.mounted) {
          this.setState({ timelinePAConnectivity: this.processData(res) });
        }
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

  /**
   * Defines the label for a given data
   * @param {string} key key identifier
   *
   * @returns {string} label to be used for tooltips and legends.
   */
  getLabel = (key) => {
    switch (key) {
      case 'prot': return 'Protegida';
      case 'prot_conn': return 'Protegida Conectada';
      default: return '';
    }
  };

  /**
   * Transform data to fit in the graph structure
   * @param {array} data data to be transformed
   *
   * @returns {array} transformed array
   */
  processData = (data) => {
    if (!data) return [];
    return data.map((obj) => ({
      ...obj,
      data: obj.data.map((item) => ({
        ...item,
        y: item.y * 100,
      })),
      label: this.getLabel(obj.key),
    }));
  };

  render() {
    const {
      showInfoGraph,
      timelinePAConnectivity,
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
              description={TimelinePAConnText}
              className="graphinfo2"
              collapseButton={false}
            />
          )
        )}
        <div>
          <h6>
            Conectividad áreas protegidas en el tiempo
          </h6>
          <div>
            <GraphLoader
              graphType="MultiLinesGraph"
              colors={matchColor('timelinePAConn')}
              data={timelinePAConnectivity}
              labelX="Año"
              labelY="Porcentaje"
              units="%"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TimelinePAConnectivity;

TimelinePAConnectivity.contextType = SearchContext;
