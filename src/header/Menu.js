import React from 'react';
import Option from './Option'

class Menu extends React.Component {

  render(){
    return (
      <div id="menuToggle">
        <input type="checkbox" />
			    <span></span>
			    <span></span>
			    <span></span>
        <ul id="menu">
          <Option url="/" name="Inicio"/>
          <Option url="/Consultas" name="Consultas"/>
          <Option url="./filters.html" name="Indicadores"/>
          <Option url="./compensaciones.html" name="Compensaciones"/>
          <Option url="./alertas.html" name="Alertas"/>
        </ul>
      </div>
    );
  }
}

export default Menu;
