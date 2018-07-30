// TODO: Administrar las opciones seleccionadas
import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import CarritoIcon from '@material-ui/icons/AddLocation';
import Select from 'react-select';

const options = [
  { value: 'Río Bogotá', label: 'Río Bogotá' },
  { value: 'Río Suarez', label: 'Río Suarez' },
  { value: 'Río Opón', label: '70% - Río Opón' }
]

const bogota = [
  { value: 'Orobioma Andino Altoandino cordillera oriental',
  label: 'Orobioma Andino Altoandino cordillera oriental' },
]
const suarez = [
  { value: 'Orobioma Andino Altoandino cordillera oriental',
  label: 'Orobioma Andino Altoandino cordillera oriental' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
const opon = [
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

class PopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sumArea: null,
      szhSelected: null,
      subList: null,
      jurisdiccionSelected: null,
    }
  }

  handleChange = (szhSelected) => {
    this.setState({ szhSelected: szhSelected });
  }

  handleChangeCAR = (jurisdiccionSelected) => {
    this.setState({ jurisdiccionSelected: jurisdiccionSelected });
  }

evaluateCAR = (nameSZH) => {
  if (nameSZH === 'Río Bogotá') {
    return (<Select
      value={this.state.jurisdiccionSelected}
      onChange={this.handleChangeCAR}
      placeholder={"Seleccione CAR"}
      options={bogota} />);
    }
    if (nameSZH === 'Río Suarez') {
      return (<Select
        placeholder={"Seleccione CAR"}
        options={suarez} />);
      }
      if (nameSZH === 'Río Opón') {
        return (<Select
          placeholder={"Seleccione CAR"}
          options={opon} />);
        }
      }

render () {
  return (
    <div className="complist">
      <CarritoIcon />
      <div className="Biomatit">{(this.props.subArea) ? this.props.subArea : "Seleccione un bioma del gráfico"}</div>
      <Select
        value={this.state.szhSelected}
        onChange={this.handleChange}
        placeholder={"SubZona Hidrográfica"}
        options={options} />
        {this.state.szhSelected ? this.evaluateCAR(this.state.szhSelected.value) : ""}
        {this.state.jurisdiccionSelected ? <button
          className="geobtn"
          onClick={() => {
            this.props.szh(this.state.szhSelected.value);
            this.props.actualizarBiomaActivo(this.state.jurisdiccionSelected.value);
          }}
          > Agregar </button> : ""}
      </div>
    );
  }
}

export default PopMenu;
