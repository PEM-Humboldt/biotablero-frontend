/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DetailsView from './DetailsView';
import RenderGraph from '../charts/RenderGraph';

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const getPercentage = (part, total) => (part / total).toFixed(2);

class EcosystemBox extends Component {
  constructor(props) {
    super(props);
    const { showGraphs } = props;
    this.state = {
      showGraphs,
    };
  }

  /**
   * Update state to handle hide graphs
   *
   */
  switchGraphs = () => {
    this.setState(prevState => ({
      showGraphs: !prevState.showGraphs,
    }));
  }

  areaToCompare = (name, area, total) => ([
    { key: name, area, percentage: getPercentage(area, total) },
    { key: '', area: (total - area), percentage: getPercentage((total - area), total) },
  ])

  render() {
    const {
      name, percentage, area, nationalPercentage,
      coverage, areaPA, handlerInfoGraph, openInfoGraph, total,
    } = this.props;
    const { showGraphs } = this.state;
    return (
      <div
        className="ecosystems"
        role="presentation"
      >
        <div className="singleeco">{name}</div>
        <div className="singleeco2">{`${numberWithCommas(Number(area).toFixed(2))} ha`}</div>
        {(area !== 0 && total !== 0) && RenderGraph(this.areaToCompare(name, area, total), '', '', 'SmallBarStackGraph',
          'Área protegida', ['#70b438', '#fff'], handlerInfoGraph, openInfoGraph,
          '', '%')}
        {(area !== 0 && total !== 0) && (
          <button
            className={`icongraph2 ${showGraphs ? 'rotate-false' : 'rotate-true'}`}
            type="button"
            onClick={this.switchGraphs}
            data-tooltip
            title="Ampliar información"
          >
            <ExpandMoreIcon />
          </button>
        )}
        <div className="graficaeco2">
          {showGraphs
          && DetailsView(nationalPercentage,
            percentage, coverage, areaPA, handlerInfoGraph, openInfoGraph,
            ['#164f74', '#60bbd4', '#5aa394'],
            ['#92ba3a', '#e9c948', '#5564a4'])
          }
        </div>
      </div>
    );
  }
}

EcosystemBox.propTypes = {
  name: PropTypes.string,
  percentage: PropTypes.number,
  area: PropTypes.number,
  total: PropTypes.number,
  nationalPercentage: PropTypes.number,
  coverage: PropTypes.array,
  areaPA: PropTypes.array,
  handlerInfoGraph: PropTypes.func,
  openInfoGraph: PropTypes.string,
  showGraphs: PropTypes.bool,
};

EcosystemBox.defaultProps = {
  name: null,
  percentage: 0,
  area: 0,
  total: 0,
  nationalPercentage: 0,
  coverage: null,
  areaPA: null,
  handlerInfoGraph: () => {},
  openInfoGraph: false,
  showGraphs: false,
};

export default EcosystemBox;
