import React from 'react';
import PropTypes from 'prop-types';
import GeneralArea from '../commons/GeneralArea';

const CurrentFootprint = ({ generalArea }) => (
  <div className="graphcontainer pt5">
    <GeneralArea
      value={generalArea}
    />
    <h4>
      Cobertura
    </h4>
    <h6>
      Natural, Baja, Media y Alta
    </h6>
    <div className="graficaeco">
      {/* TODO: Implement graph in NIVO */}
    </div>
  </div>
);

CurrentFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
};

export default CurrentFootprint;
