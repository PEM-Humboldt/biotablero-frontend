/** eslint verified */
import React from 'react';
import '../assets/main.css';

class ShortInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotate_button: true,
      hide_text: true,
    };
  }

  handleClick = () => {
    const { rotate_button: rotateButton, hide_text: hideText } = this.state;
    this.setState({
      rotate_button: !rotateButton,
      hide_text: !hideText,
    });
  }

  render() {
    const { hide_text: hideText } = this.state;
    return (
      <div>
        <div
          className={`hidden-${hideText}`}
        >
          <p>
            <b>
              BioTablero
            </b>
            {' reúne herramientas web para consultar cifras e indicadores y facilitar la toma de decisiones sobre biodiversidad, llevando a autoridades ambientales y empresas privadas síntesis de la información existente, actualizada y confiable en un contexto regional y nacional.'}
          </p>
        </div>
        <button
          type="button"
          id="showHome"
          className={`showHome rotate-${hideText}`}
          data-tooltip
          title="¿Qué es BioTablero?"
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

export default ShortInfo;
