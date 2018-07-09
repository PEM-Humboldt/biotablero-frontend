// adevia
// TODO: Ajustar evento del Autocompletar sobre el mapa

import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import RateReviewIcon from '@material-ui/icons/RateReview';
import Autocomplete from './Autocompletar';
//import jsonData from './prueba.geojson'; // Fuente: https://github.com/decolector/bta-geodata/blob/master/local.geojson

class Selector extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expanded: 'Seleccione una geocerca',  // Inicia con 'Seleccione una geocerca' activa
      subExpanded: null,
      innerExpanded: null,
    };
    this.props.panelLayer('Seleccione una geocerca'); // Inicia con 'Seleccione una geocerca' activa
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
    this.props.panelLayer(panel);
    this.props.subPanelLayer(null);
    this.props.innerPanelLayer(null);
  };

  subHandleChange = subPanel => (event, expanded) => {
    this.setState({
      subExpanded: expanded ? subPanel : false,
    });
    this.props.subPanelLayer(subPanel);
    this.props.innerPanelLayer(null);
  };

  innerHandleChange = innerPanel => (event, expanded) => {
    this.setState({
      innerExpanded: expanded ? innerPanel : false,
    });
    this.props.innerPanelLayer(innerPanel);
  };


  render() {
    const { expanded, subExpanded /*, innerExpanded, onClick, value */} = this.state;
    this.handleChange('Seleccione una geocerca');
    // alert('estadoMenu: '+this.props.estadoMenu);
    return (
      // TODO: Crear un arreglo dinámico del tipo de componente a agregar,
      // URL, contenido del texto y jerarquía para mostrar en el menú de la página
      <div className="selector">
        {/* {alert("Selector")} */}
        <h1>Consultas</h1>
        <p>Explore mediante el mapa o las siguientes opciones:</p>
        <ExpansionPanel id='panel1-Geocerca'
          expanded= {expanded === 'Seleccione una geocerca'}  // Inicia con 'Seleccione una geocerca' activa
          onChange={this.handleChange('Seleccione una geocerca')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          Seleccione una geocerca
          </ExpansionPanelSummary>
          {/* El id='geocercas' se utiliza en la hoja de estilos, para mostrar todos los elementos listados*/}
          <ExpansionPanelDetails id='geocercas'>
              <ExpansionPanel id='subPanel11-Proyectos' expanded= {subExpanded === 'Proyectos'} onChange={this.subHandleChange('Proyectos')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Zonas
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  {/* <ExpansionPanel id='innerPanel111-Licenciados' expanded= {innerExpanded === 'Licenciados'} onChange={this.innerHandleChange('Licenciados')}> */}
                  <ExpansionPanel id='innerPanel111-Licenciados'>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    Licenciados
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      {/*TODO: Create new component: Geofence
                        <Geofence data={jsonData} value={"Sogamoso - EEB"} /> {'\n'}*/}
                      <button onClick={() => this.props.innerPanelLayer('Sogamoso - EEB')}> Sogamoso - EEB </button> {'\n'}
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  {/* <ExpansionPanel expanded= {innerExpanded === 'innerPanel112'} onChange={this.innerHandleChange('innerPanel112')}> */}
                  <ExpansionPanel >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    En licenciamiento
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      - Sin proyectos -
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  {/* <ExpansionPanel expanded= {innerExpanded === 'innerPanel113'} onChange={this.innerHandleChange('innerPanel113')}> */}
                  <ExpansionPanel >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    En diagnóstico AA
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      - Sin proyectos -
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded= {subExpanded === 'subPanel2'} onChange={this.subHandleChange('subPanel2')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Áreas de manejo especial
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <button>ANP</button> {'\n'}
                  <button>Pedets</button>{'\n'}
                  <button>Bosques de Paz</button>{'\n'}
                  <button>Reservas campesinas</button>{'\n'}
                  <button>Territorios colectivos</button>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded= {subExpanded === 'subPanel31'} onChange={this.subHandleChange('subPanel31')}>
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
              <ExpansionPanel expanded= {subExpanded === 'Jurisdicciones'} onChange={this.subHandleChange('Jurisdicciones')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Jurisdicciones ambientales
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Autocomplete
                    name='jurisdiccion'
                    valueSelected={this.props.innerPanelLayer} // Envía al componente Padre el valor seleccionado
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
              <ExpansionPanel expanded= {subExpanded === 'subPanel51'} onChange={this.subHandleChange('subPanel51')}>
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
              <ExpansionPanel expanded= {subExpanded === 'subPanel61'} onChange={this.subHandleChange('subPanel61')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Ecosistemas estratégicos
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <button>Bosques secos</button>{'\n'}
                  <button>Humedales</button>{'\n'}
                  <button>Páramos</button>{'\n'}
                </ExpansionPanelDetails>
              </ExpansionPanel>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel disabled expanded= {expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary expandIcon={<FileUploadIcon />}>
          Subir polígono
          </ExpansionPanelSummary>
        </ExpansionPanel>
        <ExpansionPanel disabled expanded= {expanded === 'panel3'} onChange={this.handleChange('panel3')}>
          <ExpansionPanelSummary expandIcon={<RateReviewIcon />}>
          Dibujar polígono / Línea
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Selector;
