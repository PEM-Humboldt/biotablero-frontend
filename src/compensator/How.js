import React from 'react';

class How extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      totalSeleccionado: "",
    };
  }

  render () {
    const { bioma, szh, car, estrategias } = this.props
    const estrategiasData = estrategias.map(({ _source: obj }) => (
      <tr className="row2table" key={obj.GROUPS}>
        <td>{obj.ESTRATEGIA}</td>
        <td>{obj.HA_ES_EJ}</td>
        <td>
          <input
            name="isGoing"
            type="text"
            defaultValue={obj.HA_ES_EJ}
            onChange={this.handleInputChange} />
          <button className= "addbioma smbtn"
            onClick={() => {
              this.agregarArea(valorLocal);
            }}>
          </button>
        </td>
      </tr>
    ))
    let valorLocal = 0;
    return (
      <div>
      <div className="titecositema">
        <b>Bioma:</b> {bioma}<br></br>
        <b>SZH:</b> {szh}<br></br>
        <b>Jurisdicción:</b> {car}
      </div>
      <table className="graphcard special">
        <thead>
          <tr className="row1table">
            <th>Estrategia</th>
            <th>Héctareas</th>
            <th>Agregar</th>
          </tr>
        </thead>
        <tbody>
          {estrategiasData}
        </tbody>
      </table>
      </div>
    );
  }
}

export default How;
