import React from 'react';
import PropTypes from 'prop-types';

const TimelineFootprint = (props) => {
  const getName = ({ name }) => name;
  return (
    <div className="graphcontainer pt5">
      <h3>
      Huella humana a través del tiempo y por ecosistemas estratégicos en
        {` ${getName(props)}`}
      </h3>
      <h4>
      hectáreas totales
        <b> 1111112 ha</b>
      </h4>
      <h4>
      Valores promedio en el área
      </h4>
      <h6>
      Natural, Baja, Media y Alta
      </h6>
      <div className="graficaeco">
        <h2>
        Nuevo gráfico
        </h2>
        <h4>
        Bosque seco tropical
        </h4>
        <h4>
        Humedal
        </h4>
        <h4>
        Páramo
        </h4>
      Área del ecosistema dentro de la unidad de consulta: 332 ha
      </div>
    </div>
  );
};

TimelineFootprint.propTypes = {
  props: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default TimelineFootprint;
