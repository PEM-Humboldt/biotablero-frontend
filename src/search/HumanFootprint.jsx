import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import Accordion from '../commons/Accordion';
import CurrentFootprint from '../humanFootprint/CurrentFootprint';
import TimelineFootprint from '../humanFootprint/TimelineFootprint';
import PersistenceFooprint from '../humanFootprint/PersistenceFootprint';

const HumanFootprint = ({
  generalArea,
  setSelection,
  currentHF,
  hfPersistence,
  hfTimeline,
}) => {
  const componentsArray = [{
    label: {
      id: 'Actual',
      name: 'Huella humana en el último año',
      disabled: false,
      expandIcon: <AddIcon />,
      detailId: 'Huella humana actual en área de consulta',
      description: 'Huella humana identificada en el último año de medición disponible, sobre el área de consulta',
    },
    component: (
      <CurrentFootprint
        generalArea={generalArea}
        data={currentHF}
      />
    ),
  },
  {
    label: {
      id: 'Histórico y Ecosistémas estratégicos (EE)',
      name: 'Huella humana a través del tiempo',
      disabled: false,
      expandIcon: <AddIcon />,
      detailId: 'Huella humana a través del tiempo en el área',
      description: 'Representa diferentes análisis de huella humana en esta área de consulta',
    },
    component: (
      <TimelineFootprint
        generalArea={generalArea}
        setSelection={setSelection}
        data={hfTimeline}
      />
    ),
  },
  {
    label: {
      id: 'Persistencia',
      name: 'Persistencia',
      disabled: false,
      expandIcon: <AddIcon />,
      detailId: 'Persistencia de la huella humana en la unidad de consulta',
      description: 'Representa la persistencia desde el origen del muestreo hasta el periodo actual, producto de análisis de huella humana en el tiempo y en esta área de consulta',
    },
    component: (
      <PersistenceFooprint
        generalArea={generalArea}
        data={hfPersistence}
      />
    ),
  },
  ];
  return (
    <Accordion
      componentsArray={componentsArray}
      classNameDefault="m1"
      classNameSelected="m1 accordionSelected"
    />
  );
};

HumanFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
  setSelection: PropTypes.func.isRequired,
  currentHF: PropTypes.array.isRequired,
  hfPersistence: PropTypes.array.isRequired,
  hfTimeline: PropTypes.array.isRequired,
};

export default HumanFootprint;
