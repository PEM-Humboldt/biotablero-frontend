import React from 'react';
import { Link } from 'react-router-dom'

function Option(props) {
  return (
    <div>
      {/* Parte 3 de 3 del enrutador: Llamar las rutas a enrutar*/}
      <li><Link to={props.url}>{props.name}</Link></li>
    </div>
  );
}

export default Option;
