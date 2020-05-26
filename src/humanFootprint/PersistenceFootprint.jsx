import React from 'react';
import PropTypes from 'prop-types';
import GraphLoader from '../charts/GraphLoader';
import GeneralArea from '../commons/GeneralArea';

const PersistenceFootprint = ({ generalArea, matchColor }) => (
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
  matchColor: PropTypes.func,
};

PersistenceFootprint.defaultProps = {
  matchColor: () => {},
};

export default PersistenceFootprint;
