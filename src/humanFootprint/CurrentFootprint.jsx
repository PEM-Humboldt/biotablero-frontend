import React from 'react';
import PropTypes from 'prop-types';
import RenderGraph from '../charts/RenderGraph';
import GeneralArea from '../commons/GeneralArea';

const CurrentFootprint = ({ generalArea, matchColor }) => (
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
      <RenderGraph
        graph="SmallBarStackGraph"
        data={[
          {
            area: 732206, percentage: 0.29405913098887474, type: 'Natural',
          }, {
            area: 70749, percentage: 0.03807574570316536, type: 'Baja',
          }, {
            area: 533399, percentage: 0.3674571823442289, type: 'Media',
          }, {
            area: 521758, percentage: 0.30040794096373092685, type: 'Alta',
          }]}
        zScale={matchColor('currentHFP')}
        units="ha"
      />
    </div>
  </div>
);

CurrentFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
  matchColor: PropTypes.func,
};

CurrentFootprint.defaultProps = {
  matchColor: () => {},
};

export default CurrentFootprint;
