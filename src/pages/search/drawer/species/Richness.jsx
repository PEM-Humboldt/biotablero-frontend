import PropTypes from 'prop-types';
import React from 'react';

import SpeciesNumber from 'pages/search/drawer/species/richness/SpeciesNumber';
import SpeciesRecordsGaps from 'pages/search/drawer/species/richness/SpeciesRecordsGaps';
import Accordion from 'pages/search/drawer/Accordion';

const Richness = (props) => {
  const {
    handlerAccordionGeometry,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'speciesNumber',
        name: 'Número de especies',
      },
      component: SpeciesNumber,
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
