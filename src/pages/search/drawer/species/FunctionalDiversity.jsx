import PropTypes from 'prop-types';
import React from 'react';

import TropicalDryForest from 'pages/search/drawer/species/functionalDiversity/TropicalDryForest';
import LandscapeAccordion from 'pages/search/drawer/landscape/LandscapeAccordion';

const FunctionalDiversity = (props) => {
  const {
    handlerAccordionGeometry,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'tropicalDryForest',
        name: 'Plantas del bosque seco',
      },
      component: TropicalDryForest,
    },
  ];
  return (
    <div style={{ width: '100%' }}>
      <LandscapeAccordion
        componentsArray={componentsArray}
        classNameDefault="m1"
        classNameSelected="m1 accordionSelected"
        handlerAccordionGeometry={handlerAccordionGeometry}
        level="2"
      />
    </div>
  );
};

FunctionalDiversity.propTypes = {
  handlerAccordionGeometry: PropTypes.func,
};

FunctionalDiversity.defaultProps = {
  handlerAccordionGeometry: () => {},
};

export default FunctionalDiversity;
