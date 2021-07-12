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
  <div style={{ padding: '10px' }}>
    <br />
    <b>Usa los controles ubicados a la izquierda superior del mapa para:</b>
    <br />
    <br />
    <div>
      <CreatePolygon className="polygon-icons" />
      <div style={{ padding: '10px', display: 'inline-block' }}> Dibujar un polígono </div>
    </div>
    <br />
    <div>
      <EditPolygon className="polygon-icons" />
      <div style={{ padding: '10px', display: 'inline-block' }}> Editar el polígono dibujado </div>
    </div>
    <br />
    <div>
      <DeletePolygon className="polygon-icons" />
      <div style={{ padding: '10px', display: 'inline-block' }}> Borrar el polígono dibujado </div>
    </div>
    <br />
    <div>
      <Done />
      <div style={{ padding: '10px', display: 'inline-block' }}> Confirmar el polígono a consultar </div>
    </div>
    <br />
    <b>Se mostrarán las opciones a medida que se avance en el dibujo.</b>
  </div>
);

export { Description, InstructionsForPolygon };
