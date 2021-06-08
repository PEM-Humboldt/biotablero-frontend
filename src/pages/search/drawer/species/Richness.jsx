import PropTypes from 'prop-types';
import React from 'react';

import NumberOfSpecies from 'pages/search/drawer/species/richness/NumberOfSpecies';
import SpeciesRecordsGaps from 'pages/search/drawer/species/richness/SpeciesRecordsGaps';
import Accordion from 'pages/search/drawer/Accordion';

const Richness = (props) => {
  const {
    handlerAccordionGeometry,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'numberOfSpecies',
        name: 'Número de especies',
      },
      component: NumberOfSpecies,
    },
    {
      label: {
        id: 'speciesRecordsGaps',
        name: 'Vacíos en registros de especies',
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
};

Richness.defaultProps = {
  handlerAccordionGeometry: () => {},
};

export default Richness;
