import React from 'react';
import PropTypes from 'prop-types';
import GraphLoader from '../charts/GraphLoader';
import GeneralArea from '../commons/GeneralArea';
import matchColor from '../commons/matchColor';

const PersistenceFootprint = ({ generalArea }) => (
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
        data={[
          {
            area: 732206, key: 'Estable natural', percentage: 0.394059131,
          }, {
            area: 70749, key: 'Dinámica', percentage: 0.038075746,
          }, {
            area: 1054399, key: 'Estable alta', percentage: 0.567457182,
          },
        ]}
        units="ha"
        zScale={matchColor('persistenceHFP')}
      />
    </div>
  </div>
);

PersistenceFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
};

export default PersistenceFootprint;
