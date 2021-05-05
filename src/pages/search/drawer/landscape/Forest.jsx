import PropTypes from 'prop-types';
import React from 'react';

import ForestIntegrity from 'pages/search/drawer/landscape/forest/ForestIntegrity';
import ForestLossPersistence from 'pages/search/drawer/landscape/forest/ForestLossPersistence';
import Accordion from 'pages/search/drawer/Accordion';

const Forest = (props) => {
  const {
    handlerAccordionGeometry,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'forestLP-2016-2019',
        name: 'Perdida y persistencia',
        disabled: true,
        collapsed: true,
      },
      component: ForestLossPersistence,
    },
    {
      label: {
        id: 'forestIntegrity',
        name: 'Integridad',
      },
      component: ForestIntegrity,
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

Forest.propTypes = {
  handlerAccordionGeometry: PropTypes.func,
};

Forest.defaultProps = {
  handlerAccordionGeometry: () => {},
};

export default Forest;
