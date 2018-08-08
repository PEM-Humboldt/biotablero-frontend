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
      if (this.props.graphType==='BarVertical') {
        return (
          <BarGraph
            dataJSON={this.state.data}
            titulo={this.props.titulo}
            labelX={this.props.labelX}
            labelY={this.props.labelY}
            width={this.props.width}
            height={this.props.height}/>
        )
      }
      if (this.props.graphType==='BarStackHorizontal'){
        // TODO: Usar this.props.name en el gráfico
        return (
          <BarStackHorizontal
            dataJSON={this.state.data}
            titulo={this.props.titulo}
            labelX={this.props.labelX}
            labelY={this.props.labelY}
            width={this.props.width}
            height="250"
          />
        )
      }
    }

  render(){
    return(
      <div>
        {this.showGraph()}
      </div>
    );
  }
}

export default InfoGraph;
