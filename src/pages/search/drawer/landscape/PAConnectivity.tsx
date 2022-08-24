import Accordion from "pages/search/Accordion";
import CurrentPAConnectivity from "pages/search/drawer/landscape/connectivity/CurrentPAConnectivity";
import TimelinePAConnectivity from "pages/search/drawer/landscape/connectivity/TimelinePAConnectivity";
import CurrentSEPAConnectivity from "pages/search/drawer/landscape/connectivity/CurrentSEPAConnectivity";

interface Props {
  handleAccordionChange: () => {};
  openTab: string;
}

const PAConnectivity = (props: Props) => {
  const { handleAccordionChange, openTab } = props;

  const componentsArray = [
    {
      label: {
        id: "currentPAConn",
        name: "Actual",
        collapsed: openTab !== "currentPAConn",
      },
      component: CurrentPAConnectivity,
    },
    {
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
    },
  ];
  return (
    <div style={{ width: "100%" }}>
      <Accordion
        componentsArray={componentsArray}
        classNameDefault="m1"
        classNameSelected="m1 accordionSelected"
        handleChange={handleAccordionChange}
        level="2"
      />
    </div>
  );
};

export default PAConnectivity;
