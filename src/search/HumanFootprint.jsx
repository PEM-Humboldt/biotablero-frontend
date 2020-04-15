import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Accordion from '../commons/Accordion';
import CurrentFootprint from '../humanFootprint/CurrentFootprint';
import TimelineFootprint from '../humanFootprint/TimelineFootprint';
import PersistenceFooprint from '../humanFootprint/PersistenceHumanFootprint';

const HumanFootprint = (geofence) => {
  const componentsArray = [{
    label: {
      id: 'Huella humana actual',
      name: 'Huella humana en el último año',
      disabled: false,
      expandIcon: <AddIcon />,
      detailId: 'Huella humana actual en área de consulta',
      description: 'Huella humana identificada en el último año de medición disponible, sobre el área de consulta',
    },
    component: CurrentFootprint(geofence),
  },
  {
    label: {
      id: 'Huella humana en el tiempo',
      name: 'Huella humana a través del tiempo',
      disabled: false,
      expandIcon: <AddIcon />,
      detailId: 'Huella humana a través del tiempo en el área',
      description: 'Representa diferentes análisis de huella humana en esta área de consulta',
    },
    component: TimelineFootprint(geofence),
  },
  {
    label: {
      id: 'Persistencia de huella humana',
      name: 'Persistencia',
      disabled: false,
      expandIcon: <AddIcon />,
      detailId: 'Persistencia de la huella humana en la unidad de consulta',
      description: 'Representa la persistencia desde el origen del muestreo hasta el periodo actual, producto de análisis de huella humana en el tiempo y en esta área de consulta',
    },
    component: PersistenceFooprint(geofence),
  },
  ];
  return (
    <div>
      <Accordion
        componentsArray={componentsArray}
      />
    </div>
  );
};

HumanFootprint.propTypes = {
};

HumanFootprint.defaultProps = {
};

export default HumanFootprint;
