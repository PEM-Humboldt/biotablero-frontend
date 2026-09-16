import { SearchAccordion } from "@ui/SearchAccordion";
import { CurrentPAConnectivity } from "pages/search/dashboard/landscape/connectivity/CurrentPAConnectivity";
import TimelinePAConnectivity from "pages/search/dashboard/landscape/connectivity/TimelinePAConnectivity";
import CurrentSEPAConnectivity from "pages/search/dashboard/landscape/connectivity/CurrentSEPAConnectivity";
import type { AccordionComponent, ComponentProps } from "pages/search/types/ui";

export function PAConnectivity(props: ComponentProps) {
  const { handleAccordionChange, openTab } = props;

  const componentsArray: Array<AccordionComponent> = [
    {
      label: {
        id: "currentPAConn",
        name: "Actual",
        collapsed: openTab !== "currentPAConn",
      },
      component: CurrentPAConnectivity,
    },
    /*{
      label: {
        id: "timelinePAConn",
        name: "Histórico",
        collapsed: openTab !== "timelinePAConn",
      },
      component: TimelinePAConnectivity,
    },
    {
      label: {
        id: "currentSEPAConn",
        name: "Ecosistemas Estratégicos (EE)",
        collapsed: openTab !== "currentSEPAConn",
      },
      component: CurrentSEPAConnectivity,
    },*/
  ];
  return (
    <div style={{ width: "100%" }}>
      <SearchAccordion
        componentsArray={componentsArray}
        classNameDefault="m1"
        classNameSelected="m1 accordionSelected"
        handleChange={handleAccordionChange ? handleAccordionChange : () => {}}
        level="2"
      />
    </div>
  );
}
