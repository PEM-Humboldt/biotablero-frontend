import React from 'react';
import { Link } from 'react-router-dom';

function Option(props) {
  return (
    <div>
      {/* Parte 3 de 3 del enrutador: Llamar las rutas a enrutar*/}
      <Link to={props.url}><li>{props.name}</li></Link>
    </div>
  );
}

export default Option;
