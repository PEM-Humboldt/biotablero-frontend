import React from 'react';
import './common/main.css';

class ShortInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      rotate_button: true,
      hide_text: true,
    };
  }

  handleClick = () => {
    this.setState({ rotate_button: !this.state.rotate_button,
      hide_text: !this.state.hide_text});
  }

  render() {
    return (
      <div>
        <div className={'hidden-' + this.state.hide_text}>
            <p>Que es <b>BioTablero</b> vinculada tanto a Institutos de Investigación como a Instituciones Académicas.
            Una batería mínima de Indicadores de Biodiversidad</p>
        </div>
        <button id="showHome" className={'showHome rotate-' + this.state.hide_text}
          data-tooltip title="¿Qué es BioTablero?"
          onClick={this.handleClick}></button>
      </div>
    );
  }
}

export default ShortInfo;
