import React from 'react';
// import ScatterChart from './ScatterChart';
// import ScatterChart from './d3_scatterplot';
import DotsGraph from './DotsGraph';
import './infoGraph.css';

class InfoGraph extends React.Component {
  render(){
    return(
      <div>
        <DotsGraph
          dataJSON={this.props.data}
          labelX={this.props.labelX}
          labelY={this.props.labelY}
          width={this.props.width}
          height="280"
        />
        {/* <ScatterChart
          dataJSON={this.props.data}
          area={this.props.labelY}
          width={this.props.width}
          height={this.props.height}
        /> */}
      </div>
  );
  }
}

export default InfoGraph;
