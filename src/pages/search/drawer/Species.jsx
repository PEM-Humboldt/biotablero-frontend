import PropTypes from 'prop-types';
import React from 'react';

import Accordion from 'pages/search/Accordion';
import Richness from 'pages/search/drawer/species/Richness';
import FunctionalDiversity from 'pages/search/drawer/species/FunctionalDiversity';
import SearchContext from 'pages/search/SearchContext';
import isFlagEnabled from 'utils/isFlagEnabled';

class Species extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: 'richness',
      childMap: {
        richness: 'numberOfSpecies',
        functionalDiversity: 'tropicalDryForest',
      },
      availableComponents: ['richness', 'functionalDiversity'],
      gapsFlag: false,
    };
  }

  componentDidMount() {
    const { areaId } = this.context;
    const { visible, childMap } = this.state;

    let selected = [];
    switch (areaId) {
      case 'states':
      case 'basinSubzones':
      case 'ea':
        selected = ['richness', 'functionalDiversity'];
        break;
      default:
        break;
    }
    this.setState({ availableComponents: selected });

    if (selected.includes(visible)) {
      const { handlerSwitchLayer } = this.props;
      handlerSwitchLayer(childMap[visible]);
    }

    isFlagEnabled('functionalDiversity')
    .then((value) => {
      this.setState({ gapsFlag: value });
    });
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
    const { childMap, availableComponents, gapsFlag } = this.state;
    const initialArray = [
      {
        label: {
          id: 'richness',
          name: 'Riqueza',
        },
        component: Richness,
        componentProps: {
          handlerAccordionGeometry: this.handlerAccordionGeometry,
          openTab: childMap.richness,
        },
      },
      {
        label: {
          id: 'functionalDiversity',
          name: 'Diversidad Funcional',
          disabled: !gapsFlag,
        },
        component: FunctionalDiversity,
        componentProps: {
          handlerAccordionGeometry: this.handlerAccordionGeometry,
          openTab: childMap.functionalDiversity,
        },
      },
    ];

    const componentsArray = initialArray.filter((f) => availableComponents.includes(f.label.id));

    return (
      <Accordion
        componentsArray={componentsArray}
        classNameDefault="m0b"
        classNameSelected="m0b selector-expanded"
        handlerAccordionGeometry={this.handlerAccordionGeometry}
        level="1"
      />
    );
  }
}

Species.propTypes = {
  handlerSwitchLayer: PropTypes.func,
};

Species.defaultProps = {
  handlerSwitchLayer: () => {},
};

export default Species;

Species.contextType = SearchContext;
