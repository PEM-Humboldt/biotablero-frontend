import { useEffect } from "react";

import Accordion from "pages/search/Accordion";
// import Richness from "pages/search/dashboard/species/Richness";
import { Gap } from "pages/search/dashboard/species/Gap";
import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import { useState } from "react";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";

export function Species() {
  const { areaType } = useSearchStateCTX();
  const searchDispatch = useSearchDispatchCTX();

  const [visible, setVisible] = useState("gap");
  const [childMap, setChildMap] = useState({ gap: "gap" });

  useEffect(() => {
    setVisible(areaType?.id === "gap" ? "gap" : "gap");
  }, [areaType]);

  const handleAccordionChange = (level: string, tabLayerId: string) => {
    searchDispatch({ type: SearchUpdated.CLEAR_LAYERS });

    switch (level) {
      case "1":
        setVisible(tabLayerId);
        break;
      case "2":
        setChildMap((old) => ({ ...old, [visible]: tabLayerId }));
        break;
      default:
        break;
    }
  };

  const availableComponents = [
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
        handleAccordionChange: handleAccordionChange,
        openTab: childMap.gap,
      },
    },
  ];

  const componentsArray = availableComponents.filter((f) =>
    visible.includes(f.label.id),
  );

  return (
    <Accordion
      componentsArray={componentsArray}
      classNameDefault="m0b"
      classNameSelected="m0b selector-expanded"
      handleChange={handleAccordionChange}
      level="2"
    />
  );
}
