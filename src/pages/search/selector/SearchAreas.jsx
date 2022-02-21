import PropTypes from 'prop-types';
import React from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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

const SearchAreas = ({ areaList, onChange, onSelection }) => {
  const areaTypes = areaList.map((geofence) => ({
    label: {
      id: geofence.id,
      name: geofence.name,
      disabled: (geofence.id === 'se'),
      collapsed: true,
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

SearchAreas.propTypes = {
  areaList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    data: PropTypes.array,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  onSelection: PropTypes.func.isRequired,
};

export default SearchAreas;
