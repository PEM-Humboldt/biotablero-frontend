import PropTypes from 'prop-types';
import React from 'react';

import Accordion from 'pages/search/Accordion';
import ForestIntegrity from 'pages/search/drawer/landscape/forest/ForestIntegrity';
import ForestLossPersistence from 'pages/search/drawer/landscape/forest/ForestLossPersistence';

const Forest = (props) => {
  const {
    handleAccordionChange,
    openTab,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'forestLP-2016-2019',
        name: 'Perdida y persistencia',
        disabled: true,
        collapsed: openTab !== 'forestLP-2016-2019',
      },
      component: ForestLossPersistence,
    },
    {
      label: {
        id: 'forestIntegrity',
        name: 'Integridad',
        collapsed: openTab !== 'forestIntegrity',
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
        handleChange={handleAccordionChange}
        level="2"
      />
    </div>
  );
};

Forest.propTypes = {
  handleAccordionChange: PropTypes.func,
  openTab: PropTypes.string,
};

Forest.defaultProps = {
  handleAccordionChange: () => {},
  openTab: '',
};

export default Forest;
