import React from 'react';
import axios from 'axios';
import BarStackHorizontal from './charts/BarStackHorizontal';
import './infoGraph.css';

function cargarDatosJSON(URL_JSON, bodyRequestId, idArea){
  //  @adevia
  //  this.props.idArea = Recibe el ID del área a cargar
  //  this.
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

const prepareDara = (data, setName) => {
   const transformedData = {
     key: setName,
     total_area: `${data.aggregations.total_area.value}`
   }
   data.aggregations.areas.buckets.forEach(item => {
     transformedData[item['key']] = `${item.area.value}`
   })
   return transformedData;
}

class InfoGraph extends React.Component {


  // biomas = null;
  //
  // componentDidMount() {
  //   cargarDatosJSON(
  //     'http://192.168.205.190:9200/_search/template',
  //     'carByBiomaArea', "CORPOBOYACA")
  //     .then((respuesta) =>
  //       biomas = respuesta,
  //       console.log('biomas= '+ JSON.stringify(biomas.data.aggregations.areas.buckets.map((element) => element.key)))
  //     );
  // }

  showGraph(){
    {
      console.log('Tipo de gráfico: '+this.props.graphType);
      if (this.props.graphType==='BarStackHorizontal'){
        // TODO: Usar this.props.name en el gráfico
        return <BarStackHorizontal
          dataJSON={this.props.data}
          labelY={this.props.labelY}
          width='500' height='200'
          actualizarBiomaActivo= {this.props.actualizarBiomaActivo}/>
      }
    }
  }

  render(){
    // console.log("Total area: "+ JSON.stringify(distritos.data.aggregations.total_area.value));
    const margins = { top: 50, right: 20, bottom: 100, left: 60 };
    const svgDimensions = { width: window.innerWidth, height: window.innerHeight }; // TODO: Ajustar para que reciba parámetros del tamaño del gráfico

    return(
      <div>
        {this.showGraph()}
        {/* <BarHorizontal dataJSON={distritos.data} labelY='distritos' width='500' height='200'/>
        <BarHorizontal dataJSON={fc.data} labelY='F C' width='500' height='200'/> */}
      </div>
  );
  }
}

export default InfoGraph;
