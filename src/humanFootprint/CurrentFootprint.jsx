import React from 'react';
import PropTypes from 'prop-types';
import GraphLoader from '../charts/GraphLoader';
import GeneralArea from '../commons/GeneralArea';
import matchColor from '../commons/matchColor';

const CurrentFootprint = ({ generalArea, data }) => (
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
      <GraphLoader
        graphType="SmallBarStackGraph"
        data={data}
        units="ha"
        colors={matchColor('currentHFP')}
      />
    </div>
  </div>
);

CurrentFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
};

export default CurrentFootprint;
