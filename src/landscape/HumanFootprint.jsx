import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import LandscapeAccordion from './LandscapeAccordion';
import CurrentFootprint from './humanFootprint/CurrentFootprint';
import TimelineFootprint from './humanFootprint/TimelineFootprint';
import PersistenceFooprint from './humanFootprint/PersistenceFootprint';

const HumanFootprint = (props) => {
  const {
    handlerClickOnGraph,
    handlerAccordionGeometry,
    areaId,
    geofenceId,
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
        <CurrentFootprint
          areaId={areaId}
          geofenceId={geofenceId}
          onClickGraphHandler={handlerClickOnGraph}
        />
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
        <PersistenceFooprint
          areaId={areaId}
          geofenceId={geofenceId}
          onClickGraphHandler={handlerClickOnGraph}
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
          areaId={areaId}
          geofenceId={geofenceId}
          onClickGraphHandler={handlerClickOnGraph}
        />
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
  handlerClickOnGraph: PropTypes.func,
  handlerAccordionGeometry: PropTypes.func,
  geofenceId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  areaId: PropTypes.string.isRequired,
};

HumanFootprint.defaultProps = {
  handlerClickOnGraph: () => {},
  handlerAccordionGeometry: () => {},
};

export default HumanFootprint;
