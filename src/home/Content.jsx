import React from 'react';
import MenuButton from './MenuButton';
var $ = require ('jquery');

function geobtnFn( event ) {   
  $(".invisible").css("display", "none");
  $(".finder").removeClass("activeicon");
  $("#geobtn").addClass("activeicon");
  $(".geocont").css("display", "block");
};

function indbtnFn( event ) {   
  $(".invisible").css("display", "none");
  $(".finder").removeClass("activeicon");
  $("#indbtn").addClass("activeicon");
  $(".indicont").css("display", "block");
};

function combtnFn( event ) {   
  $(".invisible").css("display", "none");
  $(".finder").removeClass("activeicon");
  $("#combtn").addClass("activeicon");
  $(".compcont").css("display", "block");
};

function alebtnFn ( event ) {   
  $(".invisible").css("display", "none");
  $(".finder").removeClass("activeicon");
  $("#alebtn").addClass("activeicon");
  $(".alertcont").css("display", "block");
};

// TODO: Cambiar esta función a una clase, para definir dinámicamente
//  los estilos de imagen resaltada
function Content(props) {

  return (
    <div className="finderline">
      <MenuButton myfunction={(event) => geobtnFn(event)} styles={"finder geo activeicon"}
        idBtn="geobtn"
        value="consultas" valueB="geográficas"
        localLink="/Consultas"/>
      <MenuButton myfunction={(event) => indbtnFn(event)} styles={"finder ind"}
        idBtn="indbtn"
        value="indicadores de" valueB="biodiversidad"
        localLink="Indicadores"
        externalLink="http://humboldt-156715.appspot.com/filters.html"/>
      <MenuButton myfunction={(event) => combtnFn(event)} styles={"finder com"}
        idBtn="combtn"
        value="compensación" valueB="ambiental"
        localLink="/Compensaciones"/>
      <MenuButton myfunction={(event) => alebtnFn(event)} styles={"finder ale"}
        idBtn="alebtn"
        value="alertas" valueB="tempranas"
        localLink="./Alertas"/>
    </div>
  );
}
export default Content;
