import React from 'react';
import Drawer from './Drawer';
import BackIcon from '@material-ui/icons/FirstPage';

class Informer extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="informer">
      {/* TODO: Cambiar el zoom en el mapa para ver todo el país*/}
      <button className="geobtn" onClick={() => this.props.verMenu("Selector")} ><BackIcon />
      </button>
          <h1> {this.props.geocerca} / {this.props.nombre}</h1>
          <Drawer />
      </div>
    );
  }
}

export default Informer;
