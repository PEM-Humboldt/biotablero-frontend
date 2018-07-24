// adevia
// TODO: Ajustar evento del Autocompletar sobre el mapa

import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import jsonData from './prueba.geojson'; // Fuente: https://github.com/decolector/bta-geodata/blob/master/local.geojson

class ProjectSelector extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expanded: 'Centro',  // Inicia con opción 'Centro' activa
      subExpanded: null,
      innerExpanded: null,
    };
    this.props.panelLayer('Centro'); // Inicia activa
    this.props.subPanelLayer('En Licenciamiento'); // Inicia activa
    this.props.innerPanelLayer('Sogamoso');
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
    this.handleChange('Centro');
    return (
      // TODO: Crear un arreglo dinámico del tipo de componente a agregar,
      // URL, contenido del texto y jerarquía para mostrar en el menú de la página
      <div className="selector">
        <div className="iconsection"></div>
        <h1>Compensaciones</h1>
        <p>En esta sección podrás encontrar información por <b>zonas</b> de los proyectos:</p>
        <p><i>1</i> Licenciados </p>
        <p><i>2</i> En licenciamiento </p>
        <p><i>3</i> DAA </p>
        <p></p>
        <ExpansionPanel id='panel1-Norte' disabled
          expanded= {expanded === 'Norte'}
          onChange={this.handleChange('Norte')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          Norte
          </ExpansionPanelSummary>
        </ExpansionPanel>
        <ExpansionPanel id="panel1-Centro"
          expanded= {expanded === 'Centro'} onChange={this.handleChange('Centro')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          Centro
          </ExpansionPanelSummary>
          <ExpansionPanelDetails id="proyectos">
            <ExpansionPanel id='licenciados'
              expanded= {subExpanded === 'Licenciados'}
              onChange={this.subHandleChange('Licenciados')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              Licenciados
              </ExpansionPanelSummary>
            </ExpansionPanel>
            <ExpansionPanel id='enLicenciamiento'
              expanded= {subExpanded === 'En Licenciamiento'}
              onChange={this.subHandleChange('En Licenciamiento')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              En licenciamiento
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className="inlineb">
                <button onClick={() => this.props.innerPanelLayer('Sogamoso')}>Sogamoso</button>
                <button disabled onClick={() => this.props.innerPanelLayer('Nortechivor')}>Nortechivor</button>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel id='daa'
              expanded= {subExpanded === 'DAA'}
              onChange={this.subHandleChange('DAA')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              Diagnóstico Ambiental de Alternativas
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className="inlineb">
                <button disabled onClick={() => this.props.innerPanelLayer('San Fernando')}>San Fernando</button>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel id="panel1-Occidente" disabled
          expanded= {expanded === 'Occidente'}
          onChange={this.handleChange('Occidente')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          Occidente
          </ExpansionPanelSummary>
        </ExpansionPanel>
        <ExpansionPanel id="panel1-Suroccidente" disabled
          expanded= {expanded === 'Suroccidente'}
          onChange={this.handleChange('Suroccidente')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          Suroccidente
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </div>
    );
  }
}

export default ProjectSelector;
