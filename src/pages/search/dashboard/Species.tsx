import React from "react";

import Accordion from "pages/search/Accordion";
import { Gap } from "pages/search/dashboard/species/Gap";
import {
  SearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import { accordionComponent } from "pages/search/types/ui";

interface Props {}

interface State {
  visible: string;
  childMap: {
    gap: string;
  };
}

class Species extends React.Component<Props, State> {
  static contextType = SearchLegacyCTX;
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: "gap",
      childMap: {
        gap: "gap",
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
    const { clearLayers } = this.context as LegacyContextValues;

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
    const { areaType } = this.context as LegacyContextValues;
    let visible = areaType?.id === "gap" ? "gap" : "gap";
    this.setState((prev) => ({
      visible: visible,
    }));
  }

  //TODO: Habilitar las pestañas comentadas cuando se conecte el nuevo backend de consultas
  render() {
    const { areaType } = this.context as LegacyContextValues;
    const { childMap, visible } = this.state;
    const initialArray: Array<accordionComponent> = [
      /*{
        label: {
          id: "richness",
          name: "Riqueza",
        },
        component: HumanFootprint,
        componentProps: {
          handleAccordionChange: this.handleAccordionChange,
          openTab: childMap.hf,
        },
      },*/
      {
        label: {
          id: "gap",
          name: "Vacios",
        },
        component: Gap,
        componentProps: {
          handleAccordionChange: this.handleAccordionChange,
          openTab: childMap.gap,
        },
      },
    ];

    let selected: Array<string> = [];

    const componentsArray = initialArray.filter((f) =>
      selected.includes(f.label.id),
    );

    return (
      <Accordion
        componentsArray={initialArray}
        classNameDefault="m0b"
        classNameSelected="m0b selector-expanded"
        handleChange={this.handleAccordionChange}
        level="1"
      />
    );
  }
}

export default Species;
