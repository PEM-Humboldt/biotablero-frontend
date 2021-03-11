import React from 'react';

import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import InfoIcon from '@material-ui/icons/Info';
import GraphLoader from 'components/charts/GraphLoader';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';

const changeValues = [
  {
    axis: 'y',
    value: 80,
    lineStyle: { stroke: '#3fbf9f', strokeWidth: 1 },
    textStyle: {
      fill: '#3fbf9f',
      fontSize: 9,
    },
    legendPosition: 'bottom-right',
    orient: 'top',
    tickRotation: -90,
  },
];

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
      .then(([prot, protConn]) => {
        if (this.mounted) {
          this.setState({ timelinePAConnectivity: prot.concat(protConn) });
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
              description="Timeline PA Connectivity"
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
              markers={changeValues}
              labelX="Año"
              labelY="Porcentaje"
            />
          </div>
        </div>
      </div>
    );
  }//
}

export default TimelinePAConnectivity;
