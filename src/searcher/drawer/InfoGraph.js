import React from 'react';
import BarStackHorizontal from './charts/BarStackHorizontal';
import BarGraph from './charts/BarGraph';
// import Pie from './charts/Pie';
import './infoGraph.css';

class InfoGraph extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: this.props.data,
    }
  }

  componentWillMount(){
    // this.setState({
    //   data: this.props.data,
    // });
    // console.log('RES_InfoGraph= '+ JSON.stringify(this.state.data));
  }

  showGraph()
    {
      // console.log('Parent.width: '+ this.props.width);
      if (this.props.graphType==='BarVertical') {
        return (
        // <Pie
        //   dataJSON={this.state.data}
        //   area={this.props.labelY}
        //   width={this.props.width}
        //   height={this.props.height}
        // />
        <BarGraph
          dataJSON={this.state.data}
          area={this.props.labelY}
          width={this.props.width}
          height={this.props.height}
        />
      )
      } else
      if (this.props.graphType==='BarStackHorizontal'){
        // TODO: Usar this.props.name en el gráfico
        return <BarStackHorizontal
          dataJSON={this.state.data}
          // dataJSON={this.props.data.then((res)=>{
          //   // console.log('RES_InfoGraph= '+ JSON.stringify(res.aggregations.areas.buckets.map((element) => element.key)));
          //   return res.data;})}
          labelY={this.props.labelY}
          // width='500'
          width={this.props.width}
          height="180"
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
