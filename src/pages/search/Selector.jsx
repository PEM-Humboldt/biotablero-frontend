import PropTypes from 'prop-types';
import React from 'react';

import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Accordion from 'pages/search/Accordion';
import EditPolygonIcon from 'pages/search/selector/EditIcon';
import PolygonIcon from 'pages/search/selector/PolygonIcon';
import RemoveIcon from 'pages/search/selector/RemoveIcon';

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

const DrawPolygon = () => {
  const instructions = [
    {
      label: {
        id: 'draw',
        name: (
          <div style={{ display: 'flex' }}>
            <PolygonIcon />
            <span style={{ paddingLeft: 10, alignSelf: 'center' }}>Dibujar</span>
          </div>
        ),
      },
      component: () => (
        <div style={{ display: 'block' }}>
          <div>
            <b>Terminar:</b>
            {' Conecta el primer y el último punto.'}
          </div>
          <br />
          <div>
            <b>Deshacer:</b>
            {' Borra el último punto.'}
          </div>
          <br />
          <div>
            <b>Cancelar:</b>
            {' Elimina todos los puntos.'}
          </div>
        </div>
      ),
    },
    {
      label: {
        id: 'edit',
        name: (
          <div style={{ display: 'flex' }}>
            <EditPolygonIcon />
            <span style={{ paddingLeft: 10, alignSelf: 'center' }}>Editar</span>
          </div>
        ),
      },
      component: () => (
        <div style={{ display: 'block' }}>
          <div>
            <b>Terminar:</b>
            {' Acepta la edición actual.'}
          </div>
          <br />
          <div>
            <b>Cancelar:</b>
            {' Deshace toda la edición.'}
          </div>
        </div>
      ),
    },
    {
      label: {
        id: 'remove',
        name: (
          <div style={{ display: 'flex' }}>
            <RemoveIcon />
            <span style={{ paddingLeft: 10, alignSelf: 'center' }}>Borrar</span>
          </div>
        ),
      },
      component: () => (
        <div style={{ display: 'block' }}>
          <div>
            <b>Terminar:</b>
            {' Acepta la eliminación del polígono.'}
          </div>
          <br />
          <div>
            <b>Cancelar:</b>
            {' Sale de este control.'}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '10px' }}>
      Los controles a la izquierda superior del mapa se manejan así, después de dibujar el polígono
      aparecerán las opciones extra.
      <div style={{ width: '100%' }}>
        <Accordion
          componentsArray={instructions}
          classNameDefault="m0"
          classNameSelected="m0"
          level="2"
        />
      </div>
    </div>
  );
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
