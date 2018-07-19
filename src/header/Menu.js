import React from 'react';
import LinkOption from './LinkOption';

class Menu extends React.Component {

  render(){
    return (
      <div id="menuToggle">
        <input type="checkbox" />
			    <span></span>
			    <span></span>
			    <span></span>
        <ul id="menu">
          <LinkOption url="/" name="Inicio"/>
          <LinkOption url="/Consultas" name="Consultas"/>
          <LinkOption url="./filters.html" name="Indicadores"/>
          <LinkOption url="/Compensaciones" name="Compensaciones"/>
          <LinkOption url="./alertas.html" name="Alertas"/>
        </ul>
      </div>
    );
  }s
}

export default Menu;
