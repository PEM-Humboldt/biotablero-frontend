import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchContext from 'pages/search/SearchContext';

import EcosystemDetails from 'pages/search/drawer/strategicEcosystems/ecosystemsBox/EcosystemDetails';
import GraphLoader from 'components/charts/GraphLoader';
import formatNumber from 'utils/format';
import matchColor from 'utils/matchColor';
import { transformSEValues } from 'pages/search/utils/transformData';

class EcosystemsBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopLoad: false,
    };
  }

  componentWillUnmount() {
    this.setState({ stopLoad: true });
  }

  render() {
    const {
      SETotalArea,
      SEAreas,
      setActiveSE,
      activeSE,
    } = this.props;
    const {
      stopLoad,
    } = this.state;
    return (
      <div
        className="ecosystems"
        role="presentation"
      >
        {!stopLoad && SETotalArea !== 0 && SEAreas.map((SEValues) => (
          <div className="mb10" key={SEValues.type}>
            <div className="singleeco">{SEValues.type}</div>
            <div className="singleeco2">
              {`${formatNumber(SEValues.area, 0)} ha`}
            </div>
            {(Number(SEValues.area) !== 0) && (
              <button
                className={`icongraph2 ${activeSE === SEValues.type ? 'rotate-false' : 'rotate-true'}`}
                type="button"
                onClick={() => setActiveSE(SEValues.type)}
                title="Ampliar información"
              >
                <ExpandMoreIcon />
              </button>
            )}
            {!stopLoad && (Number(SEValues.area) !== 0) && (
            <GraphLoader
              graphType="SmallBarStackGraph"
              data={transformSEValues(SEValues, SETotalArea)}
              units="ha"
              colors={matchColor('se')}
            />
            )}
            {!stopLoad && activeSE === SEValues.type && (
              <div className="graficaeco2">
                <EcosystemDetails
                  SEValues={SEValues}
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
  activeSE: PropTypes.string,
  setActiveSE: PropTypes.func,
};

EcosystemsBox.defaultProps = {
  SEAreas: [],
  SETotalArea: 0,
  activeSE: null,
  setActiveSE: () => {},
};

export default EcosystemsBox;
EcosystemsBox.contextType = SearchContext;
