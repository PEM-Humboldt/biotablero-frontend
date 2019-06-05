/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DetailsView from './DetailsView';

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

  render() {
    const {
      name, percentage, area, nationalPercentage,
      coverage, areaPA, handlerInfoGraph, openInfoGraph,
    } = this.props;
    const { showGraphs } = this.state;
    return (
      <div
        className="ecosystems"
        role="presentation"
      >
        <div className="singleeco">{name}</div>
        <div className="singleeco2">{`${Number(area).toFixed(2)} ha`}</div>
        <button
          className={`icongraph2 ${showGraphs ? 'rotate-false' : 'rotate-true'}`}
          type="button"
          onClick={this.switchGraphs}
          data-tooltip
          title="Ampliar información"
        >
          <ExpandMoreIcon />
        </button>
        <div className="graficaeco2">
          {showGraphs
          && DetailsView(nationalPercentage,
            percentage, coverage, areaPA, handlerInfoGraph, openInfoGraph,
            ['#164f74', '#60bbd4', '#5aa394'],
            ['#75680f', '#b1b559', '#5aa394'])
          }
        </div>
      </div>
    );
  }
}

EcosystemBox.propTypes = {
  name: PropTypes.string,
  percentage: PropTypes.number,
  area: PropTypes.string,
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
  area: '0.00',
  nationalPercentage: 0,
  coverage: null,
  areaPA: null,
  handlerInfoGraph: () => {},
  openInfoGraph: false,
  showGraphs: false,
};

export default EcosystemBox;
