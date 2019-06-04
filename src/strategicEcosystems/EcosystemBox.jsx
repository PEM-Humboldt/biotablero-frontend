/** eslint verified */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RenderGraph from '../charts/RenderGraph';
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
        <div>
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
          <h3>
            En Ecosistémas Estratégicos:
            <b>{`${(Number(percentage) * 100).toFixed(2)} %`}</b>
          </h3>
          <div className="graficaeco">
            {RenderGraph(coverage, 'Tipo de área', 'Comparación', 'SmallBarStackGraph',
              'Cobertura', ['#164f74', '#60bbd4', '#5aa394'], handlerInfoGraph, openInfoGraph,
              '', '%')}
          </div>
        </div>
        <div className="graficaeco2">
          {showGraphs
          && DetailsView(nationalPercentage, coverage, areaPA, handlerInfoGraph, openInfoGraph,
            ['#5564a4', '#92ba3a', '#5aa394'],
            ['#75680f', '#b1b559', '#5aa394'])
          }
        </div>
      </div>
    );
  }
}

EcosystemBox.propTypes = {
  name: PropTypes.string,
  percentage: PropTypes.string,
  area: PropTypes.number,
  nationalPercentage: PropTypes.number,
  coverage: PropTypes.array,
  areaPA: PropTypes.array,
  handlerInfoGraph: PropTypes.func,
  openInfoGraph: PropTypes.string,
  showGraphs: PropTypes.bool,
};

EcosystemBox.defaultProps = {
  name: null,
  percentage: '0',
  area: 0,
  nationalPercentage: 0,
  coverage: null,
  areaPA: null,
  handlerInfoGraph: () => {},
  openInfoGraph: false,
  showGraphs: false,
};

export default EcosystemBox;
