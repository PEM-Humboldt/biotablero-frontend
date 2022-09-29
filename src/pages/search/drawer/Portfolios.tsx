import React from "react";

import Accordion from "pages/search/Accordion";
import ConservationAreas from "pages/search/drawer/portfolios/ConservationAreas";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import { accordionComponent } from "pages/search/types/ui";

interface Props {}

interface State {
  visible: string;
  childMap: {};
}

class Portfolios extends React.Component<Props, State> {
  static contextType = SearchContext;

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: "portfolio-ca",
      childMap: {},
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

  componentDidMount() {
    const { areaId } = this.context as SearchContextValues;
    let visible = "portfolio-ca";
    this.setState((prev) => ({
      visible: visible,
    }));
  }

  render() {
    const { areaId } = this.context as SearchContextValues;
    const { childMap } = this.state;
    const initialArray: Array<accordionComponent> = [
      {
        label: {
          id: "portfolio-ca",
          name: "Portafolios de áreas de conservación",
        },
        component: ConservationAreas,
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
