import React from 'react';
import PropTypes from 'prop-types';
import RenderGraph from '../charts/RenderGraph';
import GeneralArea from '../commons/GeneralArea';
import matchColor from '../commons/matchColor';

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
      <RenderGraph
        graph="LargeBarStackGraph"
        data={[
          {
            area: 1054399, key: 'Estable alta',
          }, {
            area: 70749, key: 'Dinámica',
          }, {
            area: 732206, key: 'Estable natural',
          },
        ]}
        graphTitle="Persistencia"
        labelX="Hectáreas"
        labelY="Persistencia"
        handlerInfoGraph={null}
        openInfoGraph={null}
        graphDescription="muestra las hectáreas por cada categoría de persistencia en el área de consulta seleccionada"
        zScale={matchColor('bioticReg')}
        padding={0.3}
      />
    </div>
  </div>
);

PersistenceFootprint.propTypes = {
  generalArea: PropTypes.number.isRequired,
};

export default PersistenceFootprint;
