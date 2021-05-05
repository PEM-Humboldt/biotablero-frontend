import PropTypes from 'prop-types';
import React from 'react';

import Richness from 'pages/search/drawer/species/Richness';
import FunctionalDiversity from 'pages/search/drawer/species/FunctionalDiversity';
import LandscapeAccordion from 'pages/search/drawer/landscape/LandscapeAccordion';
import SearchContext from 'pages/search/SearchContext';

class Landscape extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: 'richness',
      childMap: {
        richness: 'speciesNumber',
        functionalDiversity: 'tropicalDryForest',
      },
    };
  }

  componentDidMount() {
    const { handlerSwitchLayer } = this.props;
    const { visible, childMap } = this.state;
    handlerSwitchLayer(childMap[visible]);
  }

  /**
   * Handles requests to load a layer when there are changes in accordions
   * @param {String} level accordion level that's calling the function
   * @param {String} tabLayerId layer to be loaded (also tab expanded). null if collapsed
   */
  handlerAccordionGeometry = (level, tabLayerId) => {
    const { handlerSwitchLayer } = this.props;
    const { visible, childMap } = this.state;
    if (tabLayerId === null) handlerSwitchLayer(null);

    switch (level) {
      case '1':
        this.setState({ visible: tabLayerId });
        handlerSwitchLayer(childMap[tabLayerId]);
        break;
      case '2':
        this.setState((prev) => ({
          childMap: {
            ...prev.childMap,
            [visible]: tabLayerId,
          },
        }));
        handlerSwitchLayer(tabLayerId);
        break;
      default:
        break;
    }
  }

  render() {
    const { areaId } = this.context;
    const initialArray = [
      {
        label: {
          id: 'richness',
          name: 'Riqueza',
        },
        component: Richness,
        componentProps: { handlerAccordionGeometry: this.handlerAccordionGeometry },
      },
      {
        label: {
          id: 'functionalDiversity',
          name: 'Diversidad Funcional',
        },
        component: FunctionalDiversity,
        componentProps: { handlerAccordionGeometry: this.handlerAccordionGeometry },
      },
    ];

    let selected = [];
    switch (areaId) {
      case 'states':
      case 'basinSubzones':
      case 'ea':
      case 'pa':
        selected = ['richness', 'functionalDiversity'];
        break;
      default:
        break;
    }
    const componentsArray = initialArray.filter((f) => selected.includes(f.label.id));

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
