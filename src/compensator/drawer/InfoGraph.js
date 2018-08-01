import React from 'react';
// import ScatterChart from './ScatterChart';
// import ScatterChart from './d3_scatterplot';
import DotsGraph from './DotsGraph';
import Descargar from '@material-ui/icons/Save';

class InfoGraph extends React.Component {
  render(){
    return(
      <div className="graphcard pb">
      <h2><Descargar className="icondown" />Ecosistémas Equivalentes</h2>
      <p className="legcomp">Agrega uno o varios Biomas a tus opciones de compensación<br></br>
      FC <b>Alto</b> <i>Medio</i> <em>Bajo</em> y cantidad de area afectada</p>
        <DotsGraph
          dataJSON={this.props.data}
          labelX={this.props.labelX}
          labelY={this.props.labelY}
          width={this.props.width}
          height="280"
          actualizarBiomaActivo = {this.props.actualizarBiomaActivo}
          colors = {this.props.colors}
          biomaColor = {this.props.biomaColor}
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
