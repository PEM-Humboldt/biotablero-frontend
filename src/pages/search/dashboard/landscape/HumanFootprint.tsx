import AddIcon from "@mui/icons-material/Add";

import Accordion from "pages/search/Accordion";
import type { AccordionComponent, ComponentProps } from "pages/search/types/ui";
import { CurrentFootprint } from "pages/search/dashboard/landscape/humanFootprint/CurrentFootprint";
import { TimelineFootprint } from "pages/search/dashboard/landscape/humanFootprint/TimelineFootprint";
// import PersistenceFooprint from "pages/search/dashboard/landscape/humanFootprint/PersistenceFootprint";

export function HumanFootprint({
  handleAccordionChange,
  openTab,
}: ComponentProps) {
  const componentsArray: Array<AccordionComponent> = [
    {
      label: {
        id: "hfCurrent",
        name: "Actual",
        collapsed: openTab !== "hfCurrent",
        expandIcon: <AddIcon />,
        detailId: "Huella humana actual en área de consulta",
        description:
          "Huella humana identificada en el último año de medición disponible, sobre el área de consulta",
      },
      component: CurrentFootprint,
    },
    /*{
      label: {
        id: "hfPersistence",
        name: "Persistencia",
        collapsed: openTab !== "hfPersistence",
        expandIcon: <AddIcon />,
        detailId: "Persistencia de la huella humana en la unidad de consulta",
        description:
          "Representa la persistencia desde el origen del muestreo hasta el periodo actual, producto de análisis de huella humana en el tiempo y en esta área de consulta",
      },
      component: PersistenceFooprint,
    },*/
    {
      label: {
        id: "hfTimeline",
        name: "Histórico y Ecosistemas estratégicos (EE)",
        collapsed: openTab !== "hfTimeline",
        expandIcon: <AddIcon />,
        detailId: "Huella humana a través del tiempo en el área",
        description:
          "Representa diferentes análisis de huella humana en esta área de consulta",
      },
      component: TimelineFootprint,
    },
  ];
  return (
    <div style={{ width: "100%" }}>
      <Accordion
        componentsArray={componentsArray}
        classNameDefault="m1"
        classNameSelected="m1 accordionSelected"
        handleChange={handleAccordionChange ? handleAccordionChange : () => {}}
        level="2"
      />
    </div>
  );
}
