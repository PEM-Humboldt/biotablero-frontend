import React from 'react';

class How extends React.Component {

  render () {
    return (
      <table className="graphcard">
        <tbody>
          <tr className="row1table">
            <th>Estrategia</th>
            {/* <th>SZH</th>
            <th>Jurisdicción</th> */}
            <th>Héctareas</th>
            <th>Agregar</th>
          </tr>
          <tr className="row2table">
            <td>Recuperación fuera de áreas SINAP</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>200.55</td>
            <td><input
            name="isGoing"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
          </td>
          </tr>
          <tr className="row2table">
            <td>Rehabilitación en áreas SINAP</td>
            {/* <td>Río Suárez</td>
            <td>Corporacion Autonoma Regional de Cundinamarca</td> */}
            <td>573.16</td>
            <td><input
            name="isGoing"
            // type="checkbox"
            type="text"
            // checked={this.state.isGoing}
            onChange={this.handleInputChange} />
          </td>
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
            <button className="addbioma"
            onClick={() => {
              this.mostrarEstrategia(this.state.szhSelected.value, this.state.jurisdiccionSelected.value);
            }}
            >+</button>
          </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default How;
