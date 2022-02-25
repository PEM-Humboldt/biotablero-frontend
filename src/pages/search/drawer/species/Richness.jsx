import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import Accordion from 'pages/search/Accordion';
import NumberOfSpecies from 'pages/search/drawer/species/richness/NumberOfSpecies';
import SpeciesRecordsGaps from 'pages/search/drawer/species/richness/SpeciesRecordsGaps';
import isFlagEnabled from 'utils/isFlagEnabled';

const Richness = (props) => {
  const {
    handleAccordionChange,
    openTab,
  } = props;

  const [gapsFlag, setGapsFlag] = useState(false);

  useEffect(() => {
    isFlagEnabled('speciesRecordsGaps')
      .then((value) => setGapsFlag(value));
  }, []);

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
        disabled: !gapsFlag,
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
        handleChange={handleAccordionChange}
        level="2"
      />
    </div>
  );
};

Richness.propTypes = {
  handleAccordionChange: PropTypes.func,
  openTab: PropTypes.string,
};

Richness.defaultProps = {
  handleAccordionChange: () => {},
  openTab: '',
};

export default Richness;
