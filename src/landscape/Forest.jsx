import PropTypes from 'prop-types';
import React from 'react';

import LandscapeAccordion from './LandscapeAccordion';
import ForestLossPersistence from './forest/ForestLossPersistence';
import ForestIntegrity from './forest/ForestIntegrity';

const Forest = (props) => {
  const {
    handlerAccordionGeometry,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'forestLP',
        name: 'Perdida y persistencia',
        disabled: false,
      },
      component: ForestLossPersistence,
    },
    {
      label: {
        id: 'forestIntegrity',
        name: 'Integridad',
        disabled: false,
      },
      component: ForestIntegrity,
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

Forest.propTypes = {
  handlerAccordionGeometry: PropTypes.func,
};

Forest.defaultProps = {
  handlerAccordionGeometry: () => {},
};

export default Forest;
