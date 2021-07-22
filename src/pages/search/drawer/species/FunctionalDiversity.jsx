import PropTypes from 'prop-types';
import React from 'react';

import Accordion from 'pages/search/Accordion';
import TropicalDryForest from 'pages/search/drawer/species/functionalDiversity/TropicalDryForest';

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

FunctionalDiversity.propTypes = {
  handlerAccordionGeometry: PropTypes.func,
};

FunctionalDiversity.defaultProps = {
  handlerAccordionGeometry: () => {},
};

export default FunctionalDiversity;
