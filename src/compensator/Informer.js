import React from 'react';
import BackIcon from '@material-ui/icons/FirstPage';
import Drawer from './Drawer';

class Informer extends React.Component {
  render() {
    return (
      <div className="informer">
        {/* TODO: Cambiar el zoom en el mapa para ver todo el país*/}
        <button className="geobtn" onClick={() => this.props.back()}>
          <BackIcon />
        </button>
        <div className="iconsec2 mt2"></div>
        <h1> {this.props.zonageb} / {this.props.geocerca} <br></br> <b>{this.props.nombre}</b></h1>
        <Drawer
        updateActiveBioma={this.props.actualizarBiomaActivo}
        subArea= {this.props.subArea}
        projectData={this.props.datosSogamoso}
        panelLayer = {this.props.panelLayer}
        />
      </div>
    );
  }
}

export default Informer;
