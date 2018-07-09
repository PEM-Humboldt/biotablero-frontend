import React from 'react';
import Drawer from './Drawer';

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

  // componentDidUpdate(){
  //   if (this.props.data != null && this.props.data){
  //     this.setState({
  //       nombre: this.props.data.NOMCAR,
  //     });
  //   }
  // }

  render() {
    return (
      <div className="informer">
      <hr className="stlegrad"></hr>
      {/* TODO: Cambiar el zoom en el mapa para ver todo el país*/}
      <button onClick={() => this.props.verMenu("Selector")}>
        Volver al menú </button>
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
