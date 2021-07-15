import PropTypes from 'prop-types';
import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import Accordion from 'pages/search/Accordion';

const AreaAutocomplete = ({ options, areaType, onChange }) => (
  <Autocomplete
    id="autocomplete-selector"
    options={options}
    getOptionLabel={(option) => option.name}
    onChange={(event, values) => {
      onChange(areaType, values);
    }}
    style={{ width: '100%' }}
    renderInput={(params) => (
      <TextField
        InputProps={params.InputProps}
        inputProps={params.inputProps}
        fullWidth={params.fullWidth}
        label="Escriba el nombre a buscar"
        placeholder="Seleccionar..."
        variant="standard"
        InputLabelProps={{ shrink: true }}
      />
    )}
    autoHighlight
    ListboxProps={
      {
        style: {
          maxHeight: '100px',
          border: '0px',
        },
      }
    }
  />
);

AreaAutocomplete.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  areaType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Geofences = ({ areaList, onChange, onSelection }) => {
  const areaTypes = areaList.map((geofence) => ({
    label: {
      id: geofence.id,
      name: geofence.name,
      disabled: (geofence.id === 'se'),
    },
    component: AreaAutocomplete,
    componentProps: {
      options: geofence.data,
      areaType: geofence.id,
      onChange: onSelection,
    },
  }));

  const onGeofenceChange = (level, tabId) => {
    onChange(tabId);
  };

  return (
    <div style={{ width: '100%' }}>
      <Accordion
        componentsArray={areaTypes}
        classNameDefault="m0"
        classNameSelected="m0"
        level="2"
        handlerAccordionGeometry={onGeofenceChange}
      />
    </div>
  );
};

Geofences.propTypes = {
  areaList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    data: PropTypes.array,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  onSelection: PropTypes.func.isRequired,
};

const Selector = (props) => {
  const { areasData, description, handlers } = props;

  const sections = [
    {
      label: {
        id: 'panel1-Geocerca',
        name: 'Área de consulta',
      },
      component: Geofences,
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
      },
      iconOption: 'edit',
    },
    {
      label: {
        id: 'panel3',
        name: 'Subir polígono',
        disabled: true,
      },
    },
  ];

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
        handlerAccordionGeometry={handlers.areaListChange}
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
    polygonOpen: PropTypes.func.isRequired,
  }).isRequired,
  description: PropTypes.object,
};

Selector.defaultProps = {
  description: {},
};

export default Selector;
