import React from 'react';
import { Link } from 'react-router-dom';

class MenuButton extends React.Component{
  //adevia
  render(){
    if(this.props.externalLink) {
      return (
        <a href={this.props.externalLink} target="blank"> {/* Props obligatorio */}
        <button className={this.props.styles}
          onClick={() =>
            // TODO: Pasar el nombre del módulo como subtítulo
            console.log("Prueba")}>
            {this.props.value} <b>{this.props.valueB}</b>
          </button>
        </a>
      )
    }
    else {
      return (
        {/* Parte 3 de 3 del enrutador: Llamar las rutas a enrutar*/},
        <Link to={this.props.localLink}> {/* Props obligatorio */}
        <button className={this.props.styles}
          onClick={() =>
            // TODO: Pasar el nombre del módulo como subtítulo
            console.log("Prueba")}>
            {this.props.value} <b>{this.props.valueB}</b>
          </button>
        </Link>
      )
    }
  }
}

export default MenuButton;
