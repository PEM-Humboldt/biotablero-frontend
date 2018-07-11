import React from 'react';
import Selector from './Selector';
import Informer from './Informer';

class Filter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      menuActivo: "",
    };
    this.cambiarMenu = this.cambiarMenu.bind(this);
  }

  cambiarMenu(campo){
    this.setState({
      menuActivo: "",
    });
    this.props.actualizarCapaActiva(null);
  }

  mostrarMenu(){
    if(!this.props.dataCapaActiva ){
      return (
        // alert(this.state.menuActivo),
        // alert(this.props.dataCapaActiva),
        // TODO: Revisar despliegue errado mediante estilo
        <Selector
        panelLayer = {this.props.panelLayer}
        subPanelLayer = {this.props.subPanelLayer}
        innerPanelLayer = {this.props.innerPanelLayer}
        estadoMenu= {this.state.menuActivo}
      />
    );
    } else { return this.mostrarInformacion(this.props.dataCapaActiva)}
  }

  mostrarInformacion(infoCapaActiva) {
    // TODO: Validar información: Designación y Administrado por
    if (this.props.dataCapaActiva)
    // TODO: Enviar y recibir de MapViewer la información de pertenencia
    //  a zonas hidrográficas, para representarlo en el resumen dentro de Informer
    return <Informer verMenu={this.cambiarMenu}
      geocerca={this.props.geocerca}
      nombre={this.props.dataCapaActiva.NOMCAR || this.props.dataCapaActiva}
      />
  }

  componentDidUpdate() {
    // alert("this.state.menuActivo: "+this.state.menuActivo);
    // this.mostrarMenu();
  }

  render() {
    return (
      <div className="filter">
        {this.mostrarMenu()}
      </div>
    );
  }
}

export default Filter;
