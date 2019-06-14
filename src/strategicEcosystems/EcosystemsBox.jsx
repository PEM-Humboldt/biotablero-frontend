/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DetailsView from './DetailsView';
import RenderGraph from '../charts/RenderGraph';

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const getPercentage = (part, total) => (part / total).toFixed(2);

class EcosystemsBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGraphs: [],
    };
  }

  /**
   * Update state to handle hide graphs
   *
   */
  switchGraphs = (toLoad) => {
    const { showGraphs } = this.state;
    const loaded = showGraphs;
    const index = showGraphs.indexOf(toLoad);
    if (index > -1) {
      loaded.splice(index, 1);
    } else {
      loaded.push(toLoad);
    }
    this.setState(prevState => ({
      ...prevState,
      showGraphs: loaded,
    }));
  }

  areaToCompare = (name, area, total) => ([
    { key: name, area, percentage: getPercentage(area, total) },
    { key: '', area: (total - area), percentage: getPercentage((total - area), total) },
  ])

  render() {
    const {
      areaId,
      geofenceId,
      total,
      listSE,
    } = this.props;
    const { showGraphs } = this.state;
    return (
      <div
        className="ecosystems"
        role="presentation"
      >
        {total !== 0 && listSE.map((item) => {
          const index = showGraphs.indexOf(item.type);
          return (
            <div key={item.type}>
              <div className="singleeco">{item.type}</div>
              <div className="singleeco2">
                {`${numberWithCommas(Number(item.area).toFixed(2))} ha`}
              </div>
              {
                (item.area !== 0 && total !== 0) && (
                  <button
                    className={`icongraph2 ${(index > -1) ? 'rotate-false' : 'rotate-true'}`}
                    type="button"
                    onClick={() => this.switchGraphs(item.type)}
                    data-tooltip
                    title="Ampliar información"
                  >
                    <ExpandMoreIcon />
                  </button>
                )
              }
              {
                RenderGraph(
                  this.areaToCompare(item.type, item.area, total), '', '', 'SmallBarStackGraph',
                  'Área protegida', ['#51b4c1', '#fff'], null, null,
                  '', '%',
                )
              }
              {
                index && (
                <div className="graficaeco2">
                  <DetailsView
                    areaId={areaId}
                    geofenceId={geofenceId}
                    item={item}
                  />
                </div>
                )
              }
            </div>
          );
        })
      }
      </div>
    );
  }
}

EcosystemsBox.propTypes = {
  areaId: PropTypes.string,
  geofenceId: PropTypes.string,
  listSE: PropTypes.array,
  total: PropTypes.number,
};

EcosystemsBox.defaultProps = {
  areaId: 0,
  geofenceId: 0,
  listSE: [],
  total: 0,
};

export default EcosystemsBox;
