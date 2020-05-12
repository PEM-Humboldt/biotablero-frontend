import React from 'react';
import PropTypes from 'prop-types';
import GeneralArea from '../commons/GeneralArea';
import MultiLinesGraph from '../charts/MultiLinesGraph';
import matchColor from '../commons/matchColor';

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
      Diferenciados entre área total y cada ecosistema estratégico
    </h6>
    <div className="graficaeco">
      <h2>
        <MultiLinesGraph
          colors={matchColor('hfPersistence')}
          data={dataLines}
        />
      </h2>
      Área del ecosistema dentro de la unidad de consulta: 332 ha
    </div>
  </div>
);

TimelineFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
};

export default TimelineFootprint;
