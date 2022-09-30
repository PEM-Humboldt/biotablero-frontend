import React from "react";

import Accordion from "pages/search/Accordion";
import ConservationAreas from "pages/search/drawer/portfolios/ConservationAreas";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import { accordionComponent } from "pages/search/types/ui";

interface Props {}

interface State {
  visible: string;
  childMap: {
    conservationAreas: string;
  };
}

class Portfolios extends React.Component<Props, State> {
  static contextType = SearchContext;

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: "conservationAreas",
      childMap: {
        conservationAreas: "conservationAreas",
      },
    };
  }

  /**
   * Handles requests to load a layer when there are changes in accordions
   * @param {String} level accordion level that's calling the function
   * @param {String} tabLayerId layer to be loaded (also tab expanded). null if collapsed
   */
  handleAccordionChange = (level: string, tabLayerId: string) => {
    const { visible } = this.state;
    const { switchLayer, cancelActiveRequests } = this
      .context as SearchContextValues;
    cancelActiveRequests();

    if (tabLayerId === null) {
      switchLayer("");
    }

    switch (level) {
      case "1":
        this.setState({ visible: tabLayerId });
        break;
      case "2":
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
  };

  render() {
    const { childMap } = this.state;
    const initialArray: Array<accordionComponent> = [
      {
        label: {
          id: "conservationAreas",
          name: "Portafolios de áreas de conservación",
        },
        component: ConservationAreas,
        componentProps: {
          handleAccordionChange: this.handleAccordionChange,
          openTab: childMap.conservationAreas,
        },
      },
    ];

    const componentsArray = initialArray;

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

export default Portfolios;

Portfolios.contextType = SearchContext;
