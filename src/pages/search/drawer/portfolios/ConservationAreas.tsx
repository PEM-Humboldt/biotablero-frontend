import Accordion from "pages/search/Accordion";
import Targets from "pages/search/drawer/portfolios/conservationAreas/Targets";
import { accordionComponent, componentProps } from "pages/search/types/ui";

const ConservationAreas: React.FC<componentProps> = (props) => {
  const { handleAccordionChange, openTab } = props;

  const componentsArray: Array<accordionComponent> = [
    {
      label: {
        id: "targets",
        name: "Portafolios por temáticas",
      },
      component: Targets,
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
};

export default ConservationAreas;
