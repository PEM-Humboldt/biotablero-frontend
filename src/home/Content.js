import React from 'react';
import ModuleButton from './MenuButton';

// TODO: Cambiar esta función a una clase, para definir dinámicamente
//  los estilos de imagen resaltada
function Content(props) {

  return (
    <div className="finderline">
      <ModuleButton styles={"finder geo activeicon"} value="consultas" valueB="geográficas"/>
      <ModuleButton styles={"finder ind"} value="indicadores de" valueB="biodiversidad"/>
      <ModuleButton styles={"finder com"} value="compensación" valueB="ambiental"/>
      <ModuleButton styles={"finder ale"} value="alertas" valueB="tempranas"/>
    </div>
  );
}
export default Content;
