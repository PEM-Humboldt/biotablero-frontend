import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import Accordion from '../commons/Accordion';
import CurrentFootprint from '../humanFootprint/CurrentFootprint';
import TimelineFootprint from '../humanFootprint/TimelineFootprint';
import PersistenceFooprint from '../humanFootprint/PersistenceFootprint';

const HumanFootprint = ({
  selection,
  setSelection,
  currentHF,
  hfPersistence,
  hfTimeline,
  handlersGeometry,
}) => {
  const componentsArray = [{
    label: {
      id: 'currentHFP',
      name: 'Actual',
      disabled: false,
      expandIcon: <AddIcon />,
      detailId: 'Huella humana actual en área de consulta',
      description: 'Huella humana identificada en el último año de medición disponible, sobre el área de consulta',
    },
    component: (
      <CurrentFootprint
        data={currentHF}
      />
    ),
  },
  {
    label: {
      id: 'timeLineHFP',
      name: 'Histórico y Ecosistémas estratégicos (EE)',
      disabled: false,
      expandIcon: <AddIcon />,
      detailId: 'Huella humana a través del tiempo en el área',
      description: 'Representa diferentes análisis de huella humana en esta área de consulta',
    },
    component: (
      <TimelineFootprint
        selection={selection}
        setSelection={setSelection}
        data={hfTimeline}
      />
    ),
  },
  {
    label: {
      id: 'persistenceHFP',
      name: 'Persistencia',
      disabled: false,
      expandIcon: <AddIcon />,
      detailId: 'Persistencia de la huella humana en la unidad de consulta',
      description: 'Representa la persistencia desde el origen del muestreo hasta el periodo actual, producto de análisis de huella humana en el tiempo y en esta área de consulta',
    },
    component: (
      <PersistenceFooprint
        data={hfPersistence}
      />
    ),
  },
  ];
  return (
    <div>
      <Accordion
        componentsArray={componentsArray}
        classNameDefault="m1"
        classNameSelected="m1 accordionSelected"
        handlersGeometry={handlersGeometry}
      />
    </div>
  );
};

HumanFootprint.propTypes = {
  selection: PropTypes.string.isRequired,
  setSelection: PropTypes.func.isRequired,
  currentHF: PropTypes.array,
  hfPersistence: PropTypes.array,
  hfTimeline: PropTypes.array,
  handlersGeometry: PropTypes.arrayOf(PropTypes.func),
};

HumanFootprint.defaultProps = {
  currentHF: [],
  hfPersistence: [],
  hfTimeline: [],
  handlersGeometry: [],
};

export default HumanFootprint;
