// TODO: Administrar las opciones seleccionadas
import React, { Component } from 'react';
import CarritoIcon from '@material-ui/icons/AddLocation';
import Select from 'react-select';

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

  handleChangeSZH = (szhSelected) => {
    this.setState({
      szhSelected: szhSelected.value,
      jurisdiccionSelected: null,
    });
    this.props.cargarEstrategia(szhSelected.value, null);
  }

  handleChangeCAR = (jurisdiccionSelected) => {
    this.setState({ jurisdiccionSelected: jurisdiccionSelected.value });
    this.props.cargarEstrategia(this.state.szhSelected, jurisdiccionSelected.value);
  }

  /**
   * Print Select element for different szh
   *
   * @param {String} nameBioma Name of the bioma to list options
   */
  evaluateSZH = (nameBioma) => {
    const options = Object.keys(this.props.data).map(szh => ({ value: szh, label: szh }))
    if (nameBioma) {
      // TODO: Actualizar listado de SZH por Bioma seleccionado
      // Lo mejor seríaactualizar el elastic para que traiga estod dtos filtrados por el Bioma seleccionado
      return (
        <Select
          value={this.state.szhSelected}
          onChange={this.handleChangeSZH}
          placeholder={"SubZona Hidrográfica"}
          options={options}
        />
      );
    }
  }

  /**
   * Print Select element for different car
   *
   * @param {String} nameSZH Name of the szh to list options
   */
  evaluateCAR = (nameSZH) => {
    const options = Object.keys(this.props.data[nameSZH]).map(car => ({ value: car, label: car }))
    return (
      <Select
        value={this.state.jurisdiccionSelected}
        onChange={this.handleChangeCAR}
        placeholder={"Seleccione CAR"}
        options={options}
      />
    );
  }

  componentDidUpdate() {
    if (this.state.jurisdiccionSelected && !this.state.szhSelected) {
      this.setState({ jurisdiccionSelected: null });
    }
  }

render () {
  return (
    <div className="complist">
      <CarritoIcon />
      <div className="Biomatit">{(this.props.subArea) ? this.props.subArea : "Seleccione un bioma del gráfico"}</div>
        {(this.props.subArea) ? this.evaluateSZH(this.props.subArea) : ""}
        {(this.state.szhSelected ? this.evaluateCAR(this.state.szhSelected) : "")}
        {this.state.jurisdiccionSelected ?
          <button className="addbioma"
            onClick={() => {
              this.props.cargarEstrategia(this.state.szhSelected, this.state.jurisdiccionSelected);
            }}
          ></button> : ""}
      </div>
    );
  }
}

export default PopMenu;
