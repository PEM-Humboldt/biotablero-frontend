import React from 'react';
import PropTypes from 'prop-types';
import GeneralArea from '../commons/GeneralArea';
import MultiLinesGraph from '../charts/MultiLinesGraph';

import { dataLines } from '../search/assets/selectorData';


const TimelineFootprint = ({ generalArea }) => (
  <div className="graphcontainer pt5">
    <GeneralArea
      value={generalArea}
    />
    <h4>
      Valores promedio en el área
    </h4>
    <h6>
      Natural, Baja, Media y Alta
    </h6>
    <div className="graficaeco">
      <h2>
        <MultiLinesGraph
          data={dataLines}
        />
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

TimelineFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
};

export default TimelineFootprint;
