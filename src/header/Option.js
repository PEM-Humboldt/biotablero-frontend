import React from 'react';
import { Link } from 'react-router-dom'

function Option(props) {
  return (
    if(this.props.externalLink) {
      return (
        <div>
          <a href={this.props.externalLink} target="blank">
          {/* TODO: Pasar el nombre del módulo como subtítulo */}
          {/* <button className={this.props.styles}
          onClick={() =>
          console.log("Prueba")}>
          {this.props.value} <b>{this.props.valueB}</b>
        </button> */}
          </a>
        </div>
      } else {
        <div>
          {/* Parte 3 de 3 del enrutador: Llamar las rutas a enrutar*/}
          <Link to={props.url}><li>{props.name}</li></Link>
        </div>
      }
    );
}

export default Option;
