import React from 'react';
import BarStackHorizontal from './charts/BarStackHorizontal';
import BarGraph from './charts/BarGraph';
// import Pie from './charts/Pie';
import './infoGraph.css';

class InfoGraph extends React.Component {
  showGraph()
    {
      if (this.props.graphType==='BarVertical') {
        return (
          <BarGraph
            dataJSON={this.props.data}
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
            dataJSON={this.props.data}
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
