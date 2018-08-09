import React from 'react';
import Drawer from './Drawer';
import BackIcon from '@material-ui/icons/FirstPage';

class Informer extends React.Component {
  render() {
    return (
      <div className="informer">
      {/* TODO: Cambiar el zoom en el mapa para ver todo el país*/}
      <button className="geobtn"
        onClick={() => this.props.verMenu("Selector")}>
        <BackIcon />
      </button>
          <div className="iconsection mt2"></div>
          <h1> {this.props.geocerca} / {this.props.nombre} <br></br> <b>{this.props.subArea}</b></h1>
          <Drawer
            biomaActivo={this.props.biomaActivo}
            biomaActivoData={this.props.biomaActivoData}
          />
      </div>
    );
  }
}

export default Informer;
