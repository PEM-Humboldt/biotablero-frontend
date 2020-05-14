import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DetailsView from './DetailsView';
import RenderGraph from '../charts/RenderGraph';

/**
 * Give format to a big number
 *
 * @param {number} x number to be formatted
 * @returns {String} number formatted setting decimals and thousands properly
 */
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
   * Calculate percentage for a given value according to total
   *
   * @param {number} part value for the given part
   * @param {number} total value obtained by adding all parts
   * @returns {number} percentage associated to each part
   */
const getPercentage = (part, total) => (part / total).toFixed(2);

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

  preProcessData = (name, area, total) => ([
    { key: name, area, percentage: getPercentage(area, total) },
    { key: 'NA', area: (total - area), percentage: getPercentage((total - area), total) },
  ])

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
                {`${numberWithCommas(Number(item.area).toFixed(2))} ha`}
              </div>
              {
                (item.area !== 0 && item.area !== '0') && (
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
              {!stopLoad
                && (item.area !== 0 && item.area !== '0')
                  && (
                    <RenderGraph
                      graph="SmallBarStackGraphNIVO"
                      data={this.preProcessData(item.type, item.area, total)}
                      zScale={matchColor('se')}
                      units="ha"
                    />
                  )
              }
              {!stopLoad
                && (index > -1) && (
                <div className="graficaeco2">
                  <DetailsView
                    areaId={areaId}
                    geofenceId={geofenceId}
                    item={item}
                    matchColor={matchColor}
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
