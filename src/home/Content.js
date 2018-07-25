import React from 'react';
import MenuButton from './MenuButton';

// TODO: Cambiar esta función a una clase, para definir dinámicamente
//  los estilos de imagen resaltada
function Content(props) {

  return (
    <div className="finderline">
      <MenuButton styles={"finder geo activeicon"}
        value="consultas" valueB="geográficas"
        localLink="/Consultas"/>
      <MenuButton styles={"finder ind"}
        value="indicadores de" valueB="biodiversidad"
        localLink="./filters.html"/>
      <MenuButton styles={"finder com"}
        value="compensación" valueB="ambiental"
        localLink="/Compensaciones"/>
      <MenuButton styles={"finder ale"}
        value="alertas" valueB="tempranas"
        localLink="./alertas.html"/>
    </div>
  );
}
export default Content;
