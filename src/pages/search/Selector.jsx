import PropTypes from 'prop-types';
import React from 'react';

import EditIcon from '@material-ui/icons/Edit';

import Accordion from 'pages/search/Accordion';
import DrawPolygon from 'pages/search/selector/DrawPolygon';
import SearchAreas from 'pages/search/selector/SearchAreas';

const Selector = (props) => {
  const { areasData, description, handlers } = props;

  const sections = [
    {
      label: {
        id: 'panel1-Geocerca',
        name: 'Área de consulta',
      },
      component: SearchAreas,
      componentProps: {
        areaList: areasData,
        onChange: handlers.areaTypeChange,
        onSelection: handlers.geofenceChange,
      },
    },
    {
      label: {
        id: 'draw-polygon',
        name: 'Dibujar polígono',
        icon: EditIcon,
      },
      component: DrawPolygon,
    },
    {
      label: {
        id: 'panel3',
        name: 'Subir polígono',
        disabled: true,
      },
    },
  ];

  const onChange = (level, tabId) => {
    if (tabId === 'draw-polygon') {
      handlers.polygonChange();
    } else {
      handlers.areaListChange();
    }
  };

  return (
    <div className="selector">
      <div className="description">
        {description}
      </div>
      <Accordion
        componentsArray={sections}
        classNameDefault="m0b"
        classNameSelected="m0b selector-expanded"
        level="1"
        handlerAccordionGeometry={onChange}
      />
    </div>
  );
};

Selector.propTypes = {
  areasData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    data: PropTypes.array,
  })).isRequired,
  handlers: PropTypes.shape({
    areaListChange: PropTypes.func.isRequired,
    areaTypeChange: PropTypes.func.isRequired,
    geofenceChange: PropTypes.func.isRequired,
    polygonChange: PropTypes.func.isRequired,
  }).isRequired,
  description: PropTypes.object,
};

Selector.defaultProps = {
  description: {},
};

export default Selector;
