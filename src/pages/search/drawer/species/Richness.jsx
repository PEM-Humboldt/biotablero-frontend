import PropTypes from 'prop-types';
import React from 'react';

import NumberOfSpecies from 'pages/search/drawer/species/richness/NumberOfSpecies';
import SpeciesRecordsGaps from 'pages/search/drawer/species/richness/SpeciesRecordsGaps';
import Accordion from 'pages/search/drawer/Accordion';

const Richness = (props) => {
  const {
    handlerAccordionGeometry,
    openTab,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'numberOfSpecies',
        name: 'Número de especies',
        collapsed: openTab !== 'numberOfSpecies',
      },
      component: NumberOfSpecies,
    },
    {
      label: {
        id: 'speciesRecordsGaps',
        name: 'Vacíos en registros de especies',
        collapsed: openTab !== 'speciesRecordsGaps',
        disabled: true,
      },
      component: SpeciesRecordsGaps,
    },
  ];
  return (
    <div style={{ width: '100%' }}>
      <Accordion
        componentsArray={componentsArray}
        classNameDefault="m1"
        classNameSelected="m1 accordionSelected"
        handlerAccordionGeometry={handlerAccordionGeometry}
        level="2"
      />
    </div>
  );
};

Richness.propTypes = {
  handlerAccordionGeometry: PropTypes.func,
  openTab: PropTypes.string,
};

Richness.defaultProps = {
  handlerAccordionGeometry: () => {},
  openTab: '',
};

export default Richness;
