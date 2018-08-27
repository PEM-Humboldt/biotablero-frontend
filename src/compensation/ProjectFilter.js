import React from 'react';
import ProjectSelector from './ProjectSelector';
import Informer from './Informer';

class ProjectFilter extends React.Component {

  mostrarMenu(){
    if(!this.props.dataCapaActiva ){
      return (
        // alert(this.state.menuActivo),
        // alert(this.props.dataCapaActiva),
        // TODO: Revisar despliegue errado mediante estilo
        <ProjectSelector
        panelLayer = {this.props.panelLayer}
        subPanelLayer = {this.props.subPanelLayer}
        innerPanelLayer = {this.props.innerPanelLayer}
      />
    );
    } else { return this.mostrarInformacion(this.props.dataCapaActiva)}
  }

  mostrarInformacion(infoCapaActiva) {
    // TODO: Validar información: Designación y Administrado por
    if (this.props.dataCapaActiva)
    // TODO: Enviar y recibir de MapViewer la información de pertenencia
    //  a zonas hidrográficas, para representarlo en el resumen dentro de Informer
    // console.log(this.props.handlerBackButton);
    return <Informer back={this.props.handlerBackButton}
      zonageb={this.props.zonageb}
      geocerca={this.props.geocerca}
      nombre={this.props.dataCapaActiva.NOMCAR || this.props.dataCapaActiva}
      actualizarBiomaActivo={this.props.actualizarBiomaActivo}
      subArea= {this.props.subArea}
      datosSogamoso={this.props.datosSogamoso}
      panelLayer = {this.props.panelLayer}
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

export default ProjectFilter;
