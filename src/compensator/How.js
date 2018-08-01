import React from 'react';

class How extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      totalSeleccionado: "",
    };
  }

  render () {
    let areaSeleccionada = 0;
    let valorLocal = 0;
    return (
      <table className="graphcard special">
        <tbody>
          <tr className="row1table">
            <th>Estrategia</th>
            {/* <th>SZH</th>
            <th>Jurisdicción</th> */}
            <th>Héctareas</th>
            <th>Agregar</th>
          </tr>
          <tr className="row2table">
            <td>Preservación mediante la ampliación de áreas declaradas</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>37761.41</td>
            <td><input
            name="isGoing"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
            <button className= "addbioma smbtn"
            onClick={() => {
              this.agregarArea(valorLocal);
            }}
            >+</button>
          </td>
          </tr>
          <tr className="row2table">
            <td>Recuperación fuera de áreas SINAP</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>200.55</td>
            <td><input
            name="isGoing"
            // type="checkbox"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
            <button className= "addbioma smbtn"
            onClick={() => {
              this.agregarArea(valorLocal);
            }}
            >+</button>
          </td>
          </tr>
          <tr className="row2table">
            <td>Preservación dentro de áreas declaradas</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>3176.32</td>
            <td><input
            name="isGoing"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
            <button className= "addbioma smbtn"
            onClick={() => {
              this.agregarArea(valorLocal);
            }}
            >+</button>
          </td>
          </tr>
          <tr className="row2table">
            <td>Recuperación en áreas SINAP</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>3523.40</td>
            <td><input
            name="isGoing"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
            <button className= "addbioma smbtn"
            onClick={() => {
              this.agregarArea(valorLocal);
            }}
            >+</button>
          </td>
          </tr>
          <tr className="row2table">
            <td>Restauración fuera de áreas SINAP</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>2198.32</td>
            <td><input
            name="isGoing"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
            <button className= "addbioma smbtn"
            onClick={() => {
              this.agregarArea(valorLocal);
            }}
            >+</button>
          </td>
          </tr>
          <tr className="row2table">
            <td>Rehabilitación en áreas SINAP</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>573.16</td>
            <td><input
            name="isGoing"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
            <button className= "addbioma smbtn"
            onClick={() => {
              this.agregarArea(valorLocal);
            }}
            >+</button>
          </td>
          </tr>
          <tr className="row2table">
            <td>Rehabilitación fuera de áreas SINAP</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>735.68</td>
            <td><input
            name="isGoing"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
            <button className= "addbioma smbtn"
            onClick={() => {
              this.agregarArea(valorLocal);
            }}
            >+</button>
          </td>
          </tr>
          <tr className="row2table">
            <td>Áreas de interes regional para la posible declaración de áreas protegidas</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>57903.50</td>
            <td><input
            name="isGoing"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
            <button className= "addbioma smbtn"
            onClick={() => {
              this.agregarArea(valorLocal);
            }}
            >+</button>
          </td>
          </tr>
          <tr className="row2table">
            <td>Restauración en áreas SINAP</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>7718.66</td>
            <td><input
            name="isGoing"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
            <button className="addbioma smbtn"
            onClick={() => {
              this.agregarArea(valorLocal);
            }}
            ></button>
          </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default How;
