// TODO: Administrar las opciones seleccionadas
import React, { Component } from 'react';
import CarritoIcon from '@material-ui/icons/AddLocation';
import Select from 'react-select';

const options = [
  { value: 'Río Bogotá', label: 'Río Bogotá' },
  { value: 'Río Suarez', label: 'Río Suarez' },
  { value: 'Río Opón', label: 'Río Opón' }
]

const bogota = [
  { value: 'CAR - Corporacion Autonoma Regional de Cundinamarca',
  label: 'CAR - Corporacion Autonoma Regional de Cundinamarca' },
]
const suarez = [
  { value: 'CAR - Corporacion Autonoma Regional de Cundinamarca',
  label: 'CAR - Corporacion Autonoma Regional de Cundinamarca' },
  { value: 'CAS - Corporación Autónoma Regional de Santander',
  label: 'CAS - Corporación Autónoma Regional de Santander' },
]
const opon = [
  { value: 'CAR - Corporacion Autonoma Regional de Cundinamarca',
  label: 'CAR - Corporacion Autonoma Regional de Cundinamarca' },
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
    this.setState({
      szhSelected: szhSelected,
      jurisdiccionSelected: null,
    });
  }

  handleChangeCAR = (jurisdiccionSelected) => {
    this.setState({ jurisdiccionSelected: jurisdiccionSelected });
  }

  evaluateSZH = (nameBioma) => {
    if (nameBioma) {
      // TODO: Actualizar listado de SZH por Bioma seleccionado
      return (
        <Select
          value={this.state.szhSelected}
          onChange={this.handleChange}
          placeholder={"SubZona Hidrográfica"}
          options={options} />
        );
      }
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
      value={this.state.jurisdiccionSelected}
      onChange={this.handleChangeCAR}
      placeholder={"Seleccione CAR"}
      options={suarez} />);
    }
  if (nameSZH === 'Río Opón') {
    return (<Select
      value={this.state.jurisdiccionSelected}
      onChange={this.handleChangeCAR}
      placeholder={"Seleccione CAR"}
      options={opon} />);
  }
}

mostrarEstrategia = () => {
  // this.props.szh(this.state.szhSelected.value);
  // this.props.actualizarBiomaActivo(this.state.jurisdiccionSelected.value);
  this.props.cargarEstrategia(true, this.state.szhSelected.value, this.state.jurisdiccionSelected.value);
}

  componentDidUpdate() {
    if (this.state.jurisdiccionSelected && !this.state.szhSelected.value) {
      this.setState({jurisdiccionSelected: null,});
    }
    // if (this.props.subArea && this.state.szhSelected) {
    //   this.setState({szhSelected: null,});
    // }
  }

render () {
  return (
    <div className="complist">
      <CarritoIcon />
      <div className="Biomatit">{(this.props.subArea) ? this.props.subArea : "Seleccione un bioma del gráfico"}</div>
        {(this.props.subArea) ? this.evaluateSZH(this.props.subArea) : ""}
        {(this.state.szhSelected ? this.evaluateCAR(this.state.szhSelected.value) : "")}
        {this.state.jurisdiccionSelected ?
          <button className="addbioma"
          onClick={() => {
            this.mostrarEstrategia(this.state.szhSelected.value, this.state.jurisdiccionSelected.value);
          }}
          ></button> : ""}
      </div>
    );
  }
}

export default PopMenu;
