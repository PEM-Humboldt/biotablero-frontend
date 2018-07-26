import React from 'react';
import ScatterChart from './ScatterChart';
// import ScatterChart from './d3_scatterplot';
import './infoGraph.css';

class InfoGraph extends React.Component {
  render(){
    return(
      <div>
        <ScatterChart
          dataJSON={this.props.data}
          area={this.props.labelY}
          width={this.props.width}
          height={this.props.height}
        />
      </div>
  );
  }
}

export default InfoGraph;
