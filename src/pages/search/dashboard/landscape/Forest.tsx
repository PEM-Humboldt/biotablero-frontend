import React, { useContext } from "react";
import Accordion from "pages/search/Accordion";
import ForestIntegrity from "pages/search/dashboard/landscape/forest/ForestIntegrity";
import ForestLossPersistence from "pages/search/dashboard/landscape/forest/ForestLossPersistence";
import SearchContext from "pages/search/SearchContext";
import { accordionComponent, componentProps } from "pages/search/types/ui";

const Forest: React.FC<componentProps> = (props) => {
  const { handleAccordionChange, openTab } = props;

  const { searchType } = useContext(SearchContext);

  const initialArray: Array<accordionComponent> = [
    {
      label: {
        id: "forestLP-2016-2021",
        name: "Pérdida y persistencia",
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

  let selected: Array<string> = [];

  if (searchType !== "drawPolygon") {
    selected = ["forestLP-2016-2021", "forestIntegrity"];
  } else {
    selected = ["forestLP-2016-2021"];
  }

  const componentsArray = initialArray.filter((f) =>
    selected.includes(f.label.id)
  );
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

export default Forest;
