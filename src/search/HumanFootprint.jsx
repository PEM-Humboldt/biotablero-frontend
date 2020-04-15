import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import Accordion from '../commons/Accordion';
import CurrentFootprint from '../humanFootprint/CurrentFootprint';
import TimelineFootprint from '../humanFootprint/TimelineFootprint';
import PersistenceFooprint from '../humanFootprint/PersistenceFootprint';

const HumanFootprint = ({ geofence }) => {
  const componentsArray = [{
    label: {
      id: 'Huella humana actual',
      name: 'Huella humana en el último año',
      disabled: false,
      expandIcon: <AddIcon />,
      detailId: 'Huella humana actual en área de consulta',
      description: 'Huella humana identificada en el último año de medición disponible, sobre el área de consulta',
    },
    component: (<CurrentFootprint geofence={geofence} />),
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
    component: (<TimelineFootprint geofence={geofence} />),
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
    component: (<PersistenceFooprint geofence={geofence} />),
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
  geofence: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default HumanFootprint;
