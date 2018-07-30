import React from 'react';
import Drawer from './Drawer';
import BackIcon from '@material-ui/icons/FirstPage';

class Informer extends React.Component {
  render() {
    return (
      <div className="informer">
        {/* TODO: Cambiar el zoom en el mapa para ver todo el país*/}
        <button className="geobtn" onClick={() => this.props.verMenu("Selector")}>
          <BackIcon />
        </button>
        <div className="iconsec2 mt2"></div>
        <h1> {this.props.zonageb} / {this.props.geocerca} <br></br> <b>{this.props.nombre}</b></h1>
        <Drawer
          biomaActivo={this.props.biomaActivo}
          actualizarBiomaActivo= {this.props.actualizarBiomaActivo}
        />
      </div>
    );
  }
}

export default Informer;
