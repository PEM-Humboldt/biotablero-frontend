import AddIcon from '@material-ui/icons/Add';
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
        id: 'forestLossPersistence',
        name: 'Perdida y persistencia',
        disabled: false,
        expandIcon: <AddIcon />,
        detailId: 'Perdida y persistencia',
        description: 'Perdida y persistencia',
      },
      component: (
        <ForestLossPersistence />
      ),
    },
    {
      label: {
        id: 'forestIntegrity',
        name: 'Integridad',
        disabled: false,
        expandIcon: <AddIcon />,
        detailId: 'Integridad',
        description: 'Integridad',
      },
      component: (
        <ForestIntegrity />
      ),
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
