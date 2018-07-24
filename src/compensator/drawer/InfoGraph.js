import React from 'react';
import ScatterChart from './ScatterChart';

class InfoGraph extends React.Component {
  render(){
    return(
      <div>
        <ScatterChart
          width={this.props.width}/>
      </div>
  );
  }
}

export default InfoGraph;
