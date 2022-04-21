import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchContext from 'pages/search/SearchContext';

import EcosystemDetails from 'pages/search/drawer/strategicEcosystems/ecosystemsBox/EcosystemDetails';
import GraphLoader from 'components/charts/GraphLoader';
import formatNumber from 'utils/format';
import matchColor from 'utils/matchColor';

class EcosystemsBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopLoad: false,
      activeSE: null,
    };
  }

  componentWillUnmount() {
    this.setState({ stopLoad: true });
  }

  /**
   * Set active strategic ecosystem graph
   *
   * @param {String} selectedSE strategic ecosystem to be loaded
   */
  switchActiveSE = (selectedSE) => {
    const { switchLayer } = this.context;
    this.setState((prevState) => {
      const newState = prevState;
      if (!prevState.activeSE || prevState.activeSE !== selectedSE) {
        newState.activeSE = selectedSE;
      } else {
        newState.activeSE = null;
        switchLayer('coverages');
      }
      return newState;
    });
  }

  render() {
    const {
      SETotalArea,
      SEAreas,
    } = this.props;
    const {
      stopLoad,
      activeSE,
    } = this.state;
    return (
      <div
        className="ecosystems"
        role="presentation"
      >
        {!stopLoad && SETotalArea !== 0 && SEAreas.map((item) => (
          <div className="mb10" key={item.type}>
            <div className="singleeco">{item.type}</div>
            <div className="singleeco2">
              {`${formatNumber(item.area, 0)} ha`}
            </div>
            {(Number(item.area) !== 0) && (
              <button
                className={`icongraph2 ${activeSE === item.type ? 'rotate-false' : 'rotate-true'}`}
                type="button"
                onClick={() => this.switchActiveSE(item.type)}
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
                    area: (SETotalArea - item.area),
                    percentage: (SETotalArea - item.area) / SETotalArea,
                  },
                ]}
                units="ha"
                colors={matchColor('se')}
              />
            )}
            {!stopLoad && activeSE === item.type && (
              <div className="graficaeco2">
                <EcosystemDetails
                  item={{
                    ...item,
                    percentage: item.percentage * 100,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

EcosystemsBox.propTypes = {
  SEAreas: PropTypes.array,
  SETotalArea: PropTypes.number,
};

EcosystemsBox.defaultProps = {
  SEAreas: [],
  SETotalArea: 0,
};

export default EcosystemsBox;
EcosystemsBox.contextType = SearchContext;
