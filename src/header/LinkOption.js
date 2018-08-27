// TODO: Implement external link from menu header
import React from 'react';
import { Link } from 'react-router-dom';

function LinkOption(props) {
  return (
    <div>
      {/* Parte 3 de 3 del enrutador: Llamar las rutas a enrutar*/}
      <Link to={props.url}><li>{props.name}</li></Link>
    </div>
  );
}

export default LinkOption;
