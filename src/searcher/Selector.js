// adevia
// TODO: Ajustar evento del Autocompletar sobre el mapa

import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import RateReviewIcon from '@material-ui/icons/Edit';
import Autocomplete from './Autocompletar';
//import jsonData from './prueba.geojson'; // Fuente: https://github.com/decolector/bta-geodata/blob/master/local.geojson

class Selector extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expanded: 'Geocercas',  // Inicia con 'Geocercas' activa
      subExpanded: null,
      innerExpanded: null,
    };
    this.props.panelLayer('Geocercas'); // Inicia con 'Geocercas' activa
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
    this.props.panelLayer(panel);
  };

  subHandleChange = subPanel => (event, expanded) => {
    this.setState({
      subExpanded: expanded ? subPanel : false,
    });
    this.props.subPanelLayer(subPanel);
  };


  render() {
    const { expanded, subExpanded /*, innerExpanded, onClick, value */} = this.state;
    this.handleChange('Geocercas');
    // alert('estadoMenu: '+this.props.estadoMenu);
    return (
      // TODO: Crear un arreglo dinámico del tipo de componente a agregar,
      // URL, contenido del texto y jerarquía para mostrar en el menú de la página
      <div className="selector">
        {/* {alert("Selector")} */}
        <div className="iconsection"></div>
        <h1>Consultas geográficas</h1>
        <p>En esta sección podrás encontrar información sobre <b>ecosistemas</b>, <b>especies</b> y <b>paisaje</b>, de 3 distintas maneras:</p>
        <p><i>1</i> Selecciona una <b>geocerca</b> predeterminada (departamentos, jurisdicciones, etc.)</p>
        <p><i>2</i> Sube tu propio <b>polígono</b> (usuarios registrados)</p>
        <p><i>3</i> Dibuja tu propia <b>línea o polígono</b> (usuarios registrados)</p>
        <ExpansionPanel className="m0" id='panel1-Geocerca'
          expanded= {expanded === 'Geocercas'}  // Inicia con 'Geocercas' activa
          onChange={this.handleChange('Geocercas')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          Geocercas
          </ExpansionPanelSummary>
          {/* El id='geocercas' se utiliza en la hoja de estilos, para mostrar todos los elementos listados*/}
          <ExpansionPanelDetails id='geocercas'>
              <ExpansionPanel className="m0" id='Zonas GEB' expanded= {subExpanded === 'Zonas GEB'} onChange={this.subHandleChange('Zonas GEB')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Zonas GEB
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="inlineb">
                  <button>Norte</button>
                  <button>Centro</button>
                  <button>Suroccidente</button>
                  <button>Occidente</button>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel className="m0" expanded= {subExpanded === 'Manejo Especial'} onChange={this.subHandleChange('Manejo Especial')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Áreas de manejo especial
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="inlineb">
                  <button>ANP</button>
                  <button>Pedets</button>
                  <button>Bosques de Paz</button>
                  <button>Reservas campesinas</button>
                  <button>Territorios colectivos</button>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel className="m0" expanded= {subExpanded === 'Departamentos'} onChange={this.subHandleChange('Departamentos')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Departamentos
              </ExpansionPanelSummary>ANP
                <ExpansionPanelDetails>
                  <Autocomplete valueSelected={this.props.innerPanelLayer}
                    name='Departamento'
                    data={[{ label: 'Amazonas' },
                      { label: 'Antioquia' },
                      { label: 'Arauca' },
                      { label: 'Archipiélago de San Andrés, Providencia y Santa Catalina' },
                      { label: 'Atlántico' },
                      { label: 'Bogotá D.C.' },
                      { label: 'Bolívar' },
                      { label: 'Boyacá' },
                      { label: 'Caldas' },
                      { label: 'Caquetá' },
                      { label: 'Casanare' },
                      { label: 'Cauca' },
                      { label: 'Cesar' },
                      { label: 'Chocó' },
                      { label: 'Córdoba' },
                      { label: 'Cundinamarca' },
                      { label: 'Guainía' },
                      { label: 'Guaviare' },
                      { label: 'Huila' },
                      { label: 'La Guajira' },
                      { label: 'Magdalena' },
                      { label: 'Meta' },
                      { label: 'Nariño' },
                      { label: 'Norte de Santander' },
                      { label: 'Putumayo' },
                      { label: 'Quindio' },
                      { label: 'Risaralda' },
                      { label: 'Santander' },
                      { label: 'Sucre' },
                      { label: 'Tolima' },
                      { label: 'Valle del Cauca' },
                      { label: 'Vaupés' },
                      { label: 'Vichada' },]}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel className="m0" expanded= {subExpanded === 'Jurisdicciones'} onChange={this.subHandleChange('Jurisdicciones')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Jurisdicciones ambientales
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Autocomplete
                    name='jurisdiccion'
                    valueSelected={(v) => {
                      return this.props.innerPanelLayer(v, 'corpoBoyaca')
                      }} // Envía al componente Padre el valor seleccionado
                    data={[
                    { label: 'CORPOBOYACA' },
                    { label: 'AMBA' },
                    { label: 'CAM' },
                    { label: 'CAR' },
                    { label: 'CARDER' },
                    { label: 'CARDIQUE' },
                    { label: 'CARSUCRE' },
                    { label: 'CAS' },
                    { label: 'CDA' },
                    { label: 'CDMB' },
                    { label: 'CODECHOCO' },
                    { label: 'CORALINA' },
                    { label: 'CORANTIOQUIA' },
                    { label: 'CORMACARENA' },
                    { label: 'CORNARE' },
                    { label: 'CORPAMAG' },
                    { label: 'CORPOAMAZONIA' },
                    { label: 'CORPOCALDAS' },
                    { label: 'CORPOCESAR' },
                    { label: 'CORPOCHIVOR' },
                    { label: 'CORPOGUAJIRA' },
                    { label: 'CORPOGUAVIO' },
                    { label: 'CORPOMOJANA' },
                    { label: 'CORPONOR' },
                    { label: 'CORPORINOQUIA' },
                    { label: 'CORPOURABA' },
                    { label: 'CORPPONARIÃ‘O' },
                    { label: 'CORTOLIMA' },
                    { label: 'CRA' },
                    { label: 'CRC' },
                    { label: 'CRQ' },
                    { label: 'CSB' },
                    { label: 'CVC' },
                    { label: 'CVS' },
                    { label: 'DAGMA' },
                    { label: 'DAMAB' },
                    { label: 'SDA' },
                    { label: 'SIN' },]}
                />
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel className="m0" expanded= {subExpanded === 'Zonas hidrográficas'} onChange={this.subHandleChange('Zonas hidrográficas')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Zonas hidrográficas
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Autocomplete name='jurisdiccion'
                    data={[{ label: 'Atrato - Darién' },
                      { label: 'Caribe - Urabá' },
                      { label: 'Sinú' },
                      { label: 'Caribe - Litoral' },
                      { label: 'Caribe - Guajira' },
                      { label: 'Catatumbo' },
                      { label: 'Caribe - Islas' },
                      { label: 'Alto Magdalena' },
                      { label: 'Saldańa' },
                      { label: 'Medio Magdalena' },
                      { label: 'Sogamoso' },
                      { label: 'Bajo Magdalena-Cauca - San Jorge' },
                      { label: 'Cauca' },
                      { label: 'Nechí' },
                      { label: 'Cesar' },
                      { label: 'Bajo Magdalena' },
                      { label: 'Inírida' },
                      { label: 'Guaviare' },
                      { label: 'Vichada' },
                      { label: 'Tomo' },
                      { label: 'Meta' },
                      { label: 'Casanare' },
                      { label: 'Arauca' },
                      { label: 'Orinoco - Directos' },
                      { label: 'Apure' },
                      { label: 'Guainía' },
                      { label: 'Vaupés' },
                      { label: 'Apaporis' },
                      { label: 'Caquetá' },
                      { label: 'Yarí' },
                      { label: 'Caguán' },
                      { label: 'Putumayo' },
                      { label: 'Amazonas - Directos' },
                      { label: 'Napo' },
                      { label: 'Mira' },
                      { label: 'Patía' },
                      { label: 'Amarales - Dagua - Directos' },
                      { label: 'San Juan' },
                      { label: 'Baudó - Directos Pacífico' },
                      { label: 'Pacífico - Directos' },
                      { label: 'Pacífico - Islas' },]
                  }/>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel className="m0" expanded= {subExpanded === 'estratégicos'} onChange={this.subHandleChange('estratégicos')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Ecosistemas estratégicos
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="inlineb">
                  <button>Bosques secos</button>
                  <button>Humedales</button>
                  <button>Páramos</button>
                </ExpansionPanelDetails>
              </ExpansionPanel>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel className="m0" id="panel2" disabled expanded= {expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary expandIcon={<FileUploadIcon />}>
          Subir polígono
          </ExpansionPanelSummary>
        </ExpansionPanel>
        <ExpansionPanel className="m0" id="panel3" disabled expanded= {expanded === 'panel3'} onChange={this.handleChange('panel3')}>
          <ExpansionPanelSummary expandIcon={<RateReviewIcon />}>
          Dibujar polígono / Línea
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Selector;
