import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DetailsView from './DetailsView';
import GraphLoader from '../charts/GraphLoader';

/**
 * Give format to a big number
 *
 * @param {number} x number to be formatted
 * @returns {String} number formatted setting decimals and thousands properly
 */
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

class EcosystemsBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGraphs: [],
      stopLoad: false,
    };
  }

  componentWillUnmount() {
    this.setState({
      stopLoad: true,
    });
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
      showGraphs: !prevState.stopLoad ? loaded : false,
    }));
  }

  render() {
    const {
      areaId,
      geofenceId,
      total,
      listSE,
      matchColor,
    } = this.props;
    const { showGraphs, stopLoad } = this.state;

    return (
      <div
        className="ecosystems"
        role="presentation"
      >
        {!stopLoad && total !== 0 && listSE.map((item) => {
          const index = showGraphs.indexOf(item.type);
          return (
            <div className="mb10" key={item.type}>
              <div className="singleeco">{item.type}</div>
              <div className="singleeco2">
                {`${numberWithCommas(Number(item.area).toFixed(0))} ha`}
              </div>
              {(Number(item.area) !== 0) && (
                <button
                  className={`icongraph2 ${(index > -1) ? 'rotate-false' : 'rotate-true'}`}
                  type="button"
                  onClick={() => this.switchGraphs(item.type)}
                  data-tooltip
                  title="Ampliar información"
                >
                  <ExpandMoreIcon />
                </button>
              )}
              {!stopLoad && (Number(item.area) !== 0) && (
                <GraphLoader
                  graphType="SmallBarStackGraph"
                  data={[
                    {
                      key: item.type,
                      area: Number(item.area),
                      percentage: item.percentage,
                      label: item.type,
                    },
                    {
                      key: 'NA',
                      area: (total - item.area),
                      percentage: (total - item.area) / total,
                    },
                  ]}
                  units="ha"
                  colors={matchColor('se')}
                />
              )}
              {!stopLoad && (index > -1) && (
                <div className="graficaeco2">
                  <DetailsView
                    areaId={areaId}
                    geofenceId={geofenceId}
                    item={{
                      ...item,
                      percentage: item.percentage * 100,
                    }}
                    matchColor={matchColor}
                  />
                </div>
              )}
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
  geofenceId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  listSE: PropTypes.array,
  total: PropTypes.number,
  matchColor: PropTypes.func,
};

EcosystemsBox.defaultProps = {
  areaId: 0,
  geofenceId: 0,
  listSE: [],
  total: 0,
  matchColor: () => {},
};

export default EcosystemsBox;
