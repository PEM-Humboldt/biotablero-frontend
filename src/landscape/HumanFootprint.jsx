import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import React from 'react';

import CurrentFootprint from './humanFootprint/CurrentFootprint';
import LandscapeAccordion from './LandscapeAccordion';
import PersistenceFooprint from './humanFootprint/PersistenceFootprint';
import TimelineFootprint from './humanFootprint/TimelineFootprint';


const HumanFootprint = (props) => {
  const {
    handlerAccordionGeometry,
  } = props;

  const componentsArray = [
    {
      label: {
        id: 'hfCurrent',
        name: 'Actual',
        disabled: false,
        expandIcon: <AddIcon />,
        detailId: 'Huella humana actual en área de consulta',
        description: 'Huella humana identificada en el último año de medición disponible, sobre el área de consulta',
      },
      component: (
        <CurrentFootprint />
      ),
    },
    {
      label: {
        id: 'hfPersistence',
        name: 'Persistencia',
        disabled: false,
        expandIcon: <AddIcon />,
        detailId: 'Persistencia de la huella humana en la unidad de consulta',
        description: 'Representa la persistencia desde el origen del muestreo hasta el periodo actual, producto de análisis de huella humana en el tiempo y en esta área de consulta',
      },
      component: (
        <PersistenceFooprint />
      ),
    },
    {
      label: {
        id: 'hfTimeline',
        name: 'Histórico y Ecosistémas estratégicos (EE)',
        disabled: false,
        expandIcon: <AddIcon />,
        detailId: 'Huella humana a través del tiempo en el área',
        description: 'Representa diferentes análisis de huella humana en esta área de consulta',
      },
      component: (
        <TimelineFootprint />
      ),
    },
  ];
  return (
    <div>
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
};

HumanFootprint.defaultProps = {
  handlerAccordionGeometry: () => {},
};

export default HumanFootprint;
