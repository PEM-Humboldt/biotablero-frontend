import React from "react";

import Accordion from "pages/search/Accordion";
import CompensationFactor from "pages/search/dashboard/landscape/CompensationFactor";
import Forest from "pages/search/dashboard/landscape/Forest";
import HumanFootprint from "pages/search/dashboard/landscape/HumanFootprint";
import PAConnectivity from "pages/search/dashboard/landscape/PAConnectivity";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import { accordionComponent } from "pages/search/types/ui";

interface Props {}

interface State {
  visible: string;
  childMap: {
    fc: string;
    hf: string;
    forest: string;
    connectivity: string;
  };
}

class Landscape extends React.Component<Props, State> {
  static contextType = SearchContext;

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: "hf",
      childMap: {
        fc: "fc",
        hf: "hfCurrent",
        forest: "forestLP-2016-2021",
        connectivity: "currentPAConn",
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
    const { clearLayers } = this.context as SearchContextValues;

    clearLayers();

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
    const { areaType } = this.context as SearchContextValues;
    let visible = areaType?.id === "ea" ? "fc" : "hf";
    this.setState((prev) => ({
      visible: visible,
    }));
  }

  render() {
    const { areaType } = this.context as SearchContextValues;
    const { childMap, visible } = this.state;
    const initialArray: Array<accordionComponent> = [
      {
        label: {
          id: "fc",
          name: "FC y Biomas",
          collapsed: areaType?.id !== "ea",
        },
        component: CompensationFactor,
      },
      {
        label: {
          id: "hf",
          name: "Huella humana",
        },
        component: HumanFootprint,
        componentProps: {
          handleAccordionChange: this.handleAccordionChange,
          openTab: childMap.hf,
        },
      },
      {
        label: {
          id: "forest",
          name: "Bosques",
        },
        component: Forest,
        componentProps: {
          handleAccordionChange: this.handleAccordionChange,
          openTab: childMap.forest,
        },
      },
      {
        label: {
          id: "connectivity",
          name: "Conectividad de Áreas Protegidas",
        },
        component: PAConnectivity,
        componentProps: {
          handleAccordionChange: this.handleAccordionChange,
          openTab: childMap.connectivity,
        },
      },
    ];

    let selected: Array<string> = [];

    switch (areaType?.id) {
      case "states":
      case "basinSubzones":
        selected = ["hf", "forest", "connectivity"];
        break;
      case "ea":
        selected = ["fc", "hf", "forest", "connectivity"];
        break;
      default:
        selected = ["forest"];
        break;
    }

    const componentsArray = initialArray.filter((f) =>
      selected.includes(f.label.id)
    );

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

export default Landscape;

Landscape.contextType = SearchContext;
