import Accordion from "pages/search/Accordion";
import ForestIntegrity from "pages/search/drawer/landscape/forest/ForestIntegrity";
import ForestLossPersistence from "pages/search/drawer/landscape/forest/ForestLossPersistence";

interface Props {
  handleAccordionChange: (level: string, tabLayerId: string) => void;
  openTab: string;
}

const Forest = (props: Props) => {
  const { handleAccordionChange, openTab } = props;

  const componentsArray = [
    {
      label: {
        id: "forestLP-2016-2021",
        name: "Perdida y persistencia",
        collapsed: openTab !== "forestLP-2016-2021",
      },
      component: ForestLossPersistence,
    },
    {
      label: {
        id: "forestIntegrity",
        name: "Integridad",
        collapsed: openTab !== "forestIntegrity",
      },
      component: ForestIntegrity,
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

export default Forest;
