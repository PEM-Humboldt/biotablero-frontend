import React from 'react';
import BarStackHorizontal from './charts/BarStackHorizontal';
import BarGraph from './charts/BarGraph';
import './infoGraph.css';

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

  showGraph()
    {
      if (this.props.graphType==='BarVertical') {
        return <BarGraph />
      } else if (this.props.graphType==='BarStackHorizontal'){
        // TODO: Usar this.props.name en el gráfico
        return <BarStackHorizontal
          dataJSON={this.props.data.then((res)=>{
            // console.log('RES_InfoGraph= '+ JSON.stringify(res.aggregations.areas.buckets.map((element) => element.key)));
            return res.data;})}
          labelY={this.props.labelY}
          width='500' height='200'
          actualizarBiomaActivo= {this.props.actualizarBiomaActivo}/>
        }
    }


  render(){
    // console.log("Total area: "+ JSON.stringify(distritos.data.aggregations.total_area.value));
    // const margins = { top: 50, right: 20, bottom: 100, left: 60 };
    // const svgDimensions = { width: window.innerWidth, height: window.innerHeight }; // TODO: Ajustar para que reciba parámetros del tamaño del gráfico

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
