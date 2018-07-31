// TODO: Administrar las opciones seleccionadas
import React, { Component } from 'react';
import CarritoIcon from '@material-ui/icons/AddLocation';
import Select from 'react-select';

const options = [
  { value: 'Río Bogotá', label: 'Río Bogotá' },
  { value: 'Río Suarez', label: 'Río Suarez' },
  { value: 'Río Opón', label: '70% - Río Opón' }
]

const bogota = [
  { value: 'CAR - Corporación Autónoma Regional',
  label: 'CAR - Corporación Autónoma Regional' },
]
const suarez = [
  { value: 'CAR - Corporación Autónoma Regional',
  label: 'CAR - Corporación Autónoma Regional' },
  { value: 'CAS - Corporación Autónoma Regional de Santander',
  label: 'CAS - Corporación Autónoma Regional de Santander' },
]
const opon = [
  { value: 'CAR - Corporación Autónoma Regional',
  label: 'CAR - Corporación Autónoma Regional' },
  { value: 'CAS - Corporación Autónoma Regional de Santander',
  label: 'CAS - Corporación Autónoma Regional de Santander' },
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
        {this.state.jurisdiccionSelected ? 
        <button
          className="addbioma"
          onClick={() => {
            this.props.szh(this.state.szhSelected.value);
            this.props.actualizarBiomaActivo(this.state.jurisdiccionSelected.value);
          }}
          >+</button> : ""}
      </div>
    );
  }
}

export default PopMenu;
