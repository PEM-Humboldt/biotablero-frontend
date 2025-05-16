import Accordion from "pages/search/Accordion";
import NumberOfSpecies from "pages/search/dashboard/species/richness/NumberOfSpecies";
import SpeciesRecordsGaps from "pages/search/dashboard/species/richness/SpeciesRecordsGaps";
import { componentProps } from "pages/search/types/ui";

const Richness: React.FC<componentProps> = (props) => {
  const { handleAccordionChange, openTab } = props;

  const componentsArray = [
    {
      label: {
        id: "numberOfSpecies",
        name: "Número de especies",
        collapsed: openTab !== "numberOfSpecies",
      },
      component: NumberOfSpecies,
    },
    {
      label: {
        id: "speciesRecordsGaps",
        name: "Vacíos en registros de especies",
        collapsed: openTab !== "speciesRecordsGaps",
      },
      component: SpeciesRecordsGaps,
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

export default Richness;
