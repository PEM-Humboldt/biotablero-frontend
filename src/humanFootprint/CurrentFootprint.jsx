import React from 'react';
import PropTypes from 'prop-types';
import RenderGraph from '../charts/RenderGraph';
import GeneralArea from '../commons/GeneralArea';
import matchColor from '../commons/matchColor';

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
      <RenderGraph
        graph="LargeBarStackGraph"
        data={[
          {
            area: 732206, key: 'Natural',
          }, {
            area: 70749, key: 'Baja',
          }, {
            area: 533399, key: 'Media',
          }, {
            area: 521758, key: 'Alta',
          }]}
        graphTitle="Cobertura"
        labelX="Hectáreas"
        labelY="Cobertura"
        handlerInfoGraph={null}
        openInfoGraph={null}
        graphDescription="representa las hectáreas sobre los tipos de cobertura de huella humana identificados"
        zScale={matchColor('bioticReg')}
        padding={0.25}
      />
    </div>
  </div>
);

CurrentFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
};

export default CurrentFootprint;
