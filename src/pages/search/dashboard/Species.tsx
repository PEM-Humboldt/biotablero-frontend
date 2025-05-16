import React from "react";

import Accordion from "pages/search/Accordion";
import Richness from "pages/search/dashboard/species/Richness";
import FunctionalDiversity from "pages/search/dashboard/species/FunctionalDiversity";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import isFlagEnabled from "utils/isFlagEnabled";
import { accordionComponent } from "../types/ui";

interface Props {}

interface State {
  visible: string;
  childMap: {
    richness: string;
    functionalDiversity: string;
  };
  availableComponents: Array<any>;
  functionalFlag: boolean;
}

class Species extends React.Component<Props, State> {
  mounted = false;

  constructor(props: {}) {
    super(props);
    this.state = {
      visible: "richness",
      childMap: {
        richness: "numberOfSpecies",
        functionalDiversity: "tropicalDryForest",
      },
      availableComponents: [],
      functionalFlag: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaType, areaId, clearLayers } = this
      .context as SearchContextValues;

    clearLayers();

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    let selected: string[] = [];
    switch (areaTypeId) {
      case "states":
        if (areaIdId !== "88") {
          selected = ["richness", "functionalDiversity"];
        }
        break;
      case "ea":
        if (areaIdId !== "CORALINA") {
          selected = ["richness", "functionalDiversity"];
        }
        break;
      case "basinSubzones":
        selected = ["richness", "functionalDiversity"];
        break;
      default:
        break;
    }
    this.setState({ availableComponents: selected });

    isFlagEnabled("functionalDiversity").then((value) => {
      if (this.mounted) {
        this.setState({ functionalFlag: value });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Handles requests to load a layer when there are changes in accordions
   * @param {String} level accordion level that's calling the function
   * @param {String} tabLayerId layer to be loaded (also tab expanded). null if collapsed
   */
  handleAccordionChange = (level: any, tabLayerId: string) => {
    const { visible } = this.state;

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
    const { childMap, availableComponents, functionalFlag } = this.state;
    const initialArray: Array<accordionComponent> = [
      {
        label: {
          id: "richness",
          name: "Riqueza",
        },
        component: Richness,
        componentProps: {
          handleAccordionChange: this.handleAccordionChange,
          openTab: childMap.richness,
        },
      },
      {
        label: {
          id: "functionalDiversity",
          name: "Diversidad Funcional",
          disabled: !functionalFlag,
        },
        component: FunctionalDiversity,
        componentProps: {
          handleAccordionChange: this.handleAccordionChange,
          openTab: childMap.functionalDiversity,
        },
      },
    ];

    const componentsArray = initialArray.filter((f) =>
      availableComponents.includes(f.label.id)
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

export default Species;

Species.contextType = SearchContext;
