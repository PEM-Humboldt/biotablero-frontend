// TODO: Administrar las opciones seleccionadas
import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import CarritoIcon from '@material-ui/icons/AddLocation';

class PopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: null,
      subExpanded: null,
      sumArea: null,
    }
  }


  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
    this.props.panelLayer(panel);
  };

  render () {
    const { expanded, subExpanded /*, innerExpanded, onClick, value */} = this.state;
    return (
      <div className="complist">
        {/* <ExpansionPanel id='panel1-PopMenu' disabled
          expanded= {expanded === 'BiomaSeleccionado'}
          onChange={this.handleChange('BiomaSeleccionado')}> */}
          <CarritoIcon />
          <div className="Biomatit">{(this.props.subArea) ? this.props.subArea : "Seleccione un bioma del gráfico"}</div>
          <br></br>
          <select>
            <option value="SZH"> Seleccione SZH...</option>
          </select>
          <br></br>
          <select>
            <option value="CAR"> Seleccione CAR...</option>
          </select>

        {/* </ExpansionPanel> */}
      </div>
    );
  }

}

export default PopMenu;
