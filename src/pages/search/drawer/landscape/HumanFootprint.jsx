import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import React from 'react';

import CurrentFootprint from 'pages/search/drawer/landscape/humanFootprint/CurrentFootprint';
import PersistenceFooprint from 'pages/search/drawer/landscape/humanFootprint/PersistenceFootprint';
import TimelineFootprint from 'pages/search/drawer/landscape/humanFootprint/TimelineFootprint';
import LandscapeAccordion from 'pages/search/drawer/landscape/LandscapeAccordion';

const HumanFootprint = (props) => {
  const {
    handlerAccordionGeometry,
    openTab,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'hfCurrent',
        name: 'Actual',
        collapsed: openTab !== 'hfCurrent',
        expandIcon: <AddIcon />,
        detailId: 'Huella humana actual en área de consulta',
        description: 'Huella humana identificada en el último año de medición disponible, sobre el área de consulta',
      },
      component: CurrentFootprint,
    },
    {
      label: {
        id: 'hfPersistence',
        name: 'Persistencia',
        collapsed: openTab !== 'hfPersistence',
        expandIcon: <AddIcon />,
        detailId: 'Persistencia de la huella humana en la unidad de consulta',
        description: 'Representa la persistencia desde el origen del muestreo hasta el periodo actual, producto de análisis de huella humana en el tiempo y en esta área de consulta',
      },
      component: PersistenceFooprint,
    },
    {
      label: {
        id: 'hfTimeline',
        name: 'Histórico y Ecosistémas estratégicos (EE)',
        collapsed: openTab !== 'hfTimeline',
        expandIcon: <AddIcon />,
        detailId: 'Huella humana a través del tiempo en el área',
        description: 'Representa diferentes análisis de huella humana en esta área de consulta',
      },
      component: TimelineFootprint,
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

HumanFootprint.propTypes = {
  handlerAccordionGeometry: PropTypes.func,
  openTab: PropTypes.string,
};

HumanFootprint.defaultProps = {
  handlerAccordionGeometry: () => {},
  openTab: '',
};

export default HumanFootprint;
