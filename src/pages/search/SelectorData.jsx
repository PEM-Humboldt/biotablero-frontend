import React from 'react';
import { ReactComponent as CreatePolygon } from 'images/create-polygon.svg';
import { ReactComponent as EditPolygon } from 'images/edit-polygon.svg';
import { ReactComponent as DeletePolygon } from 'images/delete-polygon.svg';
import { Done } from '@material-ui/icons';

const Description = () => (
  <div>
    <p>
      {'En esta sección podrás encontrar información sobre '}
      <b>
        ecosistemas
      </b>
      {', '}
      <b>
        especies
      </b>
      {' y '}
      <b>
        paisaje
      </b>
      , de 3 distintas maneras:
    </p>
    <p>
      <i>
        1
      </i>
      {' Selecciona un '}
      <b>
        área de consulta
      </b>
      {' predeterminada (departamentos, jurisdicciones, etc.)'}
    </p>
    <p>
      <i>
        2
      </i>
      {' Dibuja un '}
      <b>
        polígono
      </b>
    </p>
    <p>
      <i>
        3
      </i>
      {' Sube tu propio '}
      <b>
        polígono
      </b>
      {' (usuarios registrados)'}
    </p>
  </div>
);

const InstructionsForPolygon = () => (
  <div>
    <b>Sobre el mapa puedes:</b>
    <br />
    <br />
    <div>
      <div
        className="create-polygon"
      >
        <CreatePolygon />
      </div>
      Dibujar un polígono
    </div>
    <br />
    <div>
      <div
        className="polygon-icons"
      >
        <EditPolygon />
      </div>
      Editar el polígono dibujado
    </div>
    <br />
    <div>
      <div
        className="polygon-icons"
      >
        <DeletePolygon />
      </div>
      Borrar el polígono dibujado
    </div>
    <br />
    <div>
      <div
        className="polygon-icons"
      >
        <Done />
      </div>
      Confirmar el polígono a consultar
    </div>
  </div>
);

export { Description, InstructionsForPolygon };
