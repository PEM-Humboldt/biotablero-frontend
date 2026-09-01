import { useState } from "react";

import Accordion from "pages/search/Accordion";
import { useSearchDispatchCTX } from "pages/search/hooks/SearchContext";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";
import { Gap } from "pages/search/dashboard/species/Gap";
import { ObservedRichness } from "pages/search/dashboard/species/ObservedRichness";

export function Species() {
  const searchDispatch = useSearchDispatchCTX();

  const [visible, setVisible] = useState("observedRichness");
  const [childMap, setChildMap] = useState({
    gap: "gap",
    observedRichness: "observedRichness",
  });

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

  const speciesComponents = [
    {
      label: {
        id: "observedRichness",
        name: "Riqueza observada",
      },
      component: ObservedRichness,
      componentProps: {
        handleAccordionChange: handleAccordionChange,
        openTab: childMap.observedRichness,
      },
    },
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

  return (
    <Accordion
      componentsArray={speciesComponents}
      classNameDefault="m0b"
      classNameSelected="m0b selector-expanded"
      handleChange={handleAccordionChange}
      level="1"
    />
  );
}
