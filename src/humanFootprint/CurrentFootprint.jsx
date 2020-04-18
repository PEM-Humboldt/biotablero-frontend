import React from 'react';
import PropTypes from 'prop-types';
import RenderGraph from '../charts/RenderGraph';
import GeneralArea from '../commons/GeneralArea';

const CurrentFootprint = ({ generalArea, geofence }) => (
  <div className="graphcontainer pt5">
    <h3>
      Huella humana actual en
      {` ${geofence.name}`}
    </h3>
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
      {RenderGraph([
        {
          area: 732206, percentage: 0.29405913098887474, type: 'Natural', color: '#5aa394',
        }, {
          area: 70749, percentage: 0.03807574570316536, type: 'Baja', color: '#dea857',
        }, {
          area: 533399, percentage: 0.3674571823442289, type: 'Media', color: '#fb6a2a',
        }, {
          area: 521758, percentage: 0.30040794096373092685, type: 'Alta', color: '#b3433b',
        }],
      'Tipo de área', 'Comparación', 'SmallBarStackGraph',
      'Cobertura', null, null, null,
      'Estado de la cobertura en el área seleccionada', '%')}
    </div>
  </div>
);

CurrentFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
  geofence: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default CurrentFootprint;
