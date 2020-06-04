import React from 'react';
import PropTypes from 'prop-types';
import GraphLoader from '../charts/GraphLoader';
import GeneralArea from '../commons/GeneralArea';
import matchColor from '../commons/matchColor';

const PersistenceFootprint = ({ generalArea, data }) => (
  <div className="graphcontainer pt5">
    <GeneralArea
      value={generalArea}
    />
    <h6>
      Estable natural, Dinámica, Estable alta
    </h6>
    <div className="graficaeco">
      <GraphLoader
        graphType="SmallBarStackGraph"
        data={data}
        units="ha"
        colors={matchColor('persistenceHFP')}
      />
    </div>
  </div>
);

PersistenceFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
};

export default PersistenceFootprint;
