import { useMemo, useState } from "react";

import Accordion from "pages/search/Accordion";
import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";
// import Richness from "pages/search/dashboard/species/Richness";
import { Gap } from "pages/search/dashboard/species/Gap";
import { ObservedRichness } from "pages/search/dashboard/species/ObservedRichness";

export function Species() {
  const searchDispatch = useSearchDispatchCTX();
  const { areaType } = useSearchStateCTX();

  const [visible, setVisible] = useState("gap");
  const [childMap, setChildMap] = useState({ gap: "gap" });

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
    {
      label: {
        id: "observedRichness",
        name: "Riqueza observada",
      },
      component: ObservedRichness,
      componentProps: {
        handleAccordionChange: handleAccordionChange,
        openTab: childMap.gap,
      },
    },
  ];

  const componentsAvailable = useMemo(() => {
    if (!areaType) {
      return [];
    }

    switch (areaType.id) {
      case "states":
      case "basinSubzones":
      case "ea":
      default:
        return ["gap", "observedRichness"];
    }
  }, [areaType]);

  const componentsArray = availableComponents.filter((f) =>
    componentsAvailable.includes(f.label.id),
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
