import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import Accordion from '../commons/Accordion';
import CurrentFootprint from '../humanFootprint/CurrentFootprint';
import TimelineFootprint from '../humanFootprint/TimelineFootprint';
import PersistenceFooprint from '../humanFootprint/PersistenceFootprint';

const HumanFootprint = ({
  setSelection,
  currentHF,
  currentHFPValue,
  hfPersistence,
  hfTimeline,
  handlersGeometry,
}) => {
  const componentsArray = [
    {
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
          currentHFPValue={currentHFPValue}
          onClickGraphHandler={handlersGeometry[2]}
        />
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
        <TimelineFootprint
          setSelection={setSelection}
          data={hfTimeline}
          onClickGraphHandler={handlersGeometry[2]}
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
          onClickGraphHandler={handlersGeometry[2]}
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
  setSelection: PropTypes.func.isRequired,
  currentHF: PropTypes.array,
  currentHFPValue: PropTypes.number,
  hfPersistence: PropTypes.array,
  hfTimeline: PropTypes.array,
  handlersGeometry: PropTypes.arrayOf(PropTypes.func),
};

HumanFootprint.defaultProps = {
  currentHF: [],
  currentHFPValue: 0,
  hfPersistence: [],
  hfTimeline: [],
  handlersGeometry: [],
};

export default HumanFootprint;
