import PropTypes from 'prop-types';
import React from 'react';

import CompensationFactor from './CompensationFactor';
import HumanFootprint from './HumanFootprint';
import Forest from './Forest';
import LandscapeAccordion from './LandscapeAccordion';
import SearchContext from '../SearchContext';

class Landscape extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedLevel1: null,
      expandedLevel2: null,
    };
  }

  componentDidMount() {
    const { handlerSwitchLayer } = this.props;
    const { areaId } = this.context;
    this.setState({ expandedLevel2: 'hfCurrent' });
    if (areaId === 'ea') {
      this.setState({ expandedLevel1: 'fc' });
      handlerSwitchLayer('fc');
    } else {
      this.setState({ expandedLevel1: 'hf' });
      handlerSwitchLayer('hfCurrent');
    }
  }

  /**
   * Transform data to fit in the graph structure
   *
   * @param {string} level accordion level
   * @param {string} expandedTab accordion tab to be expanded or hidden
   *
   */
  handlerAccordionGeometry = (level, expandedTab) => {
    const { handlerSwitchLayer } = this.props;
    const { expandedLevel1, expandedLevel2 } = this.state;

    switch (level) {
      case '1':
        this.setState({ expandedLevel1: expandedTab });
        if (expandedTab === 'hf') {
          handlerSwitchLayer(expandedLevel2);
        } else {
          handlerSwitchLayer(expandedTab);
        }
        break;
      case '2':
        this.setState({ expandedLevel2: expandedTab });
        if (expandedTab === null) {
          handlerSwitchLayer(expandedLevel1);
        } else {
          handlerSwitchLayer(expandedTab);
        }
        break;
      default:
        handlerSwitchLayer(null);
    }
  }

  render() {
    const { areaId } = this.context;

    const componentsArray = [
      {
        label: {
          id: 'fc',
          name: 'FC y Biomas',
          disabled: areaId !== 'ea',
        },
        component: <CompensationFactor />,
      },
      {
        label: {
          id: 'hf',
          name: 'Huella humana',
          disabled: false,
        },
        component: (
          <HumanFootprint
            handlerAccordionGeometry={this.handlerAccordionGeometry}
          />
        ),
      },
      {
        label: {
          id: 'forest',
          name: 'Bosques',
          disabled: false,
        },
        component: (
          <Forest
            handlerAccordionGeometry={this.handlerAccordionGeometry}
          />
        ),
      },
    ];
    return (
      <LandscapeAccordion
        componentsArray={componentsArray}
        classNameDefault="m0b"
        classNameSelected="m0b selector-expanded"
        handlerAccordionGeometry={this.handlerAccordionGeometry}
        level="1"
      />
    );
  }
}

Landscape.propTypes = {
  handlerSwitchLayer: PropTypes.func,
};

Landscape.defaultProps = {
  handlerSwitchLayer: () => {},
};

export default Landscape;

Landscape.contextType = SearchContext;
