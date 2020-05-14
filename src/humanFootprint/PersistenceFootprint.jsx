import React from 'react';
import PropTypes from 'prop-types';
import GeneralArea from '../commons/GeneralArea';

const PersistenceFootprint = ({ generalArea }) => (
  <div className="graphcontainer pt5">
    <GeneralArea
      value={generalArea}
    />
    <h4>
      Cobertura
    </h4>
    <h6>
      Estable natural, Dinámica, Estable alta
    </h6>
    <div className="graficaeco">
      {/* TODO: Implement graph in NIVO */}
    </div>
  </div>
);

PersistenceFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
};

export default PersistenceFootprint;
