import React from 'react';

import Accordion from 'pages/search/Accordion';
import Richness from 'pages/search/dashboard/species/Richness';
import SearchContext from 'pages/search/SearchContext';

class Species extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      visible: 'richness',
      availableComponents: [],
      functionalFlag: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId } = this.context;
    let selected = [];
    switch (areaId) {
      case 'states':
        if (geofenceId !== '88') {
          selected = ['richness'];
        }
        break;
      case 'ea':
        if (geofenceId !== 'CORALINA') {
          selected = ['richness'];
        }
        break;
      case 'basinSubzones':
        selected = ['richness'];
        break;
      default:
        break;
    }
    this.setState({ availableComponents: selected });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Handles requests to load a layer when there are changes in accordions
   * @param {String} level accordion level that's calling the function
   * @param {String} tabLayerId layer to be loaded (also tab expanded). null if collapsed
   */
  handleAccordionChange = (level, tabLayerId) => {
    const { visible } = this.state;
    const { switchLayer, cancelActiveRequests } = this.context;
    cancelActiveRequests();

    if (tabLayerId === "") {
      switchLayer("");
    }

    switch (level) {
      case '1':
        this.setState({ visible: tabLayerId });
        break;
      case '2':
        this.setState((prev) => ({
          childMap: {
            ...prev.childMap,
            [visible]: tabLayerId,
          },
        }));
        break;
      default:
        break;
    }
  }

  render() {
    const {
      childMap,
      availableComponents,
    } = this.state;
    const initialArray = [
      {
        label: {
          id: 'richness',
          name: 'Riqueza',
        },
        component: Richness,
        componentProps: {
          handleAccordionChange: this.handleAccordionChange,
          openTab: childMap.richness,
        },
      },
    ];

    const componentsArray = initialArray.filter((f) => availableComponents.includes(f.label.id));

    return (
      <Accordion
        componentsArray={componentsArray}
        classNameDefault="m0b"
        classNameSelected="m0b selector-expanded"
        handleChange={this.handleAccordionChange}
        level="1"
      />
    );
  }
}

export default Species;

Species.contextType = SearchContext;
