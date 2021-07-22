import PropTypes from 'prop-types';
import React from 'react';

import Accordion from 'pages/search/Accordion';
import CompensationFactor from 'pages/search/drawer/landscape/CompensationFactor';
import Forest from 'pages/search/drawer/landscape/Forest';
import HumanFootprint from 'pages/search/drawer/landscape/HumanFootprint';
import PAConnectivity from 'pages/search/drawer/landscape/PAConnectivity';
import SearchContext from 'pages/search/SearchContext';

class Landscape extends React.Component {
  constructor(props, context) {
    super(props, context);
    const { areaId } = this.context;
    this.state = {
      visible: areaId === 'ea' ? 'fc' : 'hf',
      childMap: {
        fc: 'fc',
        hf: 'hfCurrent',
        forest: 'forestIntegrity',
        connectivity: 'currentPAConn',
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
    const { childMap } = this.state;
    const initialArray = [
      {
        label: {
          id: 'fc',
          name: 'FC y Biomas',
          collapsed: areaId !== 'ea',
        },
        component: CompensationFactor,
      },
      {
        label: {
          id: 'hf',
          name: 'Huella humana',
        },
        component: HumanFootprint,
        componentProps: {
          handlerAccordionGeometry: this.handlerAccordionGeometry,
          openTab: childMap.hf,
        },
      },
      {
        label: {
          id: 'forest',
          name: 'Bosques',
        },
        component: Forest,
        componentProps: {
          handlerAccordionGeometry: this.handlerAccordionGeometry,
          openTab: childMap.forest,
        },
      },
      {
        label: {
          id: 'connectivity',
          name: 'Conectividad de Áreas Protegidas',
        },
        component: PAConnectivity,
        componentProps: {
          handlerAccordionGeometry: this.handlerAccordionGeometry,
          openTab: childMap.connectivity,
        },
      },
    ];

    let selected = [];
    switch (areaId) {
      case 'states':
      case 'basinSubzones':
        selected = ['hf', 'forest', 'connectivity'];
        break;
      case 'ea':
        selected = ['fc', 'hf', 'forest', 'connectivity'];
        break;
      case 'pa':
        selected = ['hf', 'forest'];
        break;
      default:
        break;
    }
    const componentsArray = initialArray.filter((f) => selected.includes(f.label.id));

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

Landscape.propTypes = {
  handlerSwitchLayer: PropTypes.func,
};

Landscape.defaultProps = {
  handlerSwitchLayer: () => {},
};

export default Landscape;

Landscape.contextType = SearchContext;
