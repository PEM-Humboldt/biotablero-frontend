// TODO: Administrar las opciones seleccionadas
import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import CarritoIcon from '@material-ui/icons/AddLocation';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const options2 = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

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
            <Select options={options} />
            <Select options={options2} />

        {/* </ExpansionPanel> */}
      </div>
    );
  }

}

export default PopMenu;
