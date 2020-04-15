import React from 'react';
import PropTypes from 'prop-types';
import RenderGraph from '../charts/RenderGraph';

const PersistenceFootprint = ({ geofence }) => (
  <div className="graphcontainer pt5">
    <h3>
      Persistencia de huella humana en
      {` ${geofence.name}`}
    </h3>
    <h4>
      hectáreas totales
      <b> 1111111 ha</b>
    </h4>
    <h4>
      Cobertura
    </h4>
    <h6>
      Estable natural, Dinámica, Estable alta
    </h6>
    <div className="graficaeco">
      {RenderGraph([
        {
          area: 732206, percentage: 0.29405913098887474, type: 'Estable natural', color: '#5aa394',
        }, {
          area: 70749, percentage: 0.03807574570316536, type: 'Dinámica', color: '#fb6a2a',
        }, {
          area: 1054399, percentage: 0.5674571823442289, type: 'Estable alta', color: '#b3433b',
        }],
      'Tipo de área', 'Comparación', 'SmallBarStackGraph',
      'Cobertura', null, null, null,
      'Estado de la cobertura en el área seleccionada', '%')}
    </div>
  </div>
);

PersistenceFootprint.propTypes = {
  geofence: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default PersistenceFootprint;
