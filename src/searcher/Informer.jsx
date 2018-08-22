import React from 'react';
import BackIcon from '@material-ui/icons/FirstPage';

import Drawer from './Drawer';

const Informer = ({
  geocerca, nombre, verMenu, biomaActivo, biomaActivoData,
}) => (
  <div className="informer">
    {/* TODO: Cambiar el zoom en el mapa para ver todo el país */}
    <button
      className="geobtn"
      type="button"
      onClick={() => verMenu('Selector')}
    >
      <BackIcon />
    </button>
    <div className="iconsection mt2" />
    <h1>
      {`${geocerca} / ${nombre}`}
      <br />
      <b>
        {biomaActivo}
      </b>
    </h1>
    <Drawer
      biomaActivo={biomaActivo}
      biomaActivoData={biomaActivoData}
    />
  </div>
);

export default Informer;
