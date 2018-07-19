import React from 'react';
import axios from 'axios';
import './infoGraph.css';

function cargarDatosJSON(URL_JSON, bodyRequestId, idArea){
  //  @adevia
  //  this.props.id = Recibe el ID del área a cargar
  //
// TODO: Realizar el llamado del JSON de datos para la gráfica
const bodyRequest = {
          id: bodyRequestId,
          params: {
           id_car: idArea,
         },
      };
   return axios.post(URL_JSON, bodyRequest)
   .then((res)=>{
     // console.log('res= '+ JSON.stringify(res));
     return res;
   })

}

class InfoGraph extends React.Component {
  render(){
    const margins = { top: 50, right: 20, bottom: 100, left: 60 };
    const svgDimensions = { width: 800, height: 500 }; // TODO: Ajustar para que reciba parámetros
    return(
      <div>
        Gráfico "Qué"
      </div>
  );
  }
}

export default InfoGraph;
