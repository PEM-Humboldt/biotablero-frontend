import React from 'react';
import Drawer from './Drawer';
import BackIcon from '@material-ui/icons/FirstPage';

class Informer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nombre: null,
      designacion: null,
      area: null,
      administrador: null,
    };
  }

  render() {
    return (
      <div className="informer">
      <hr className="stlegrad"></hr>
      {/* TODO: Cambiar el zoom en el mapa para ver todo el país*/}
      <button className="backbtn" onClick={() => this.props.verMenu("Selector")} ><BackIcon />
      </button>
        <h3>{'\n'}Información general</h3>
          <b>Nombre:</b> {this.props.nombre +'\n'}
          <b>Designación: </b> {this.props.designacion +'\n'}
          <b>Área:</b> {this.props.area +'\n'}
          <b>Administrado por:</b> {this.props.administrador +'\n'}
          <hr className="stlegrad"></hr>
          <Drawer />
      </div>
    );
  }
}

export default Informer;
