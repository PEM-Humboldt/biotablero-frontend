import React from 'react';
import PropTypes from 'prop-types';
import RenderGraph from '../charts/RenderGraph';
import GeneralArea from '../commons/GeneralArea';
import matchColor from '../commons/matchColor';

const data = [
  {
    area: 732206, percentage: 0.29405913098887474, type: 'Estable natural', color: '#5aa394',
  }, {
    area: 70749, percentage: 0.03807574570316536, type: 'Dinámica', color: '#fb6a2a',
  }, {
    area: 1054399, percentage: 0.5674571823442289, type: 'Estable alta', color: '#b3433b',
  },
];

const data2 = [
  {
    area: 732206, key: 'Estable natural',
  }, {
    area: 70749, key: 'Dinámica',
  }, {
    area: 1054399, key: 'Estable alta',
  },
];

console.log(data2);

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
        graph="SmallBarStackGraph"
        data={data}
        graphTitle="Cobertura"
        colors={null}
        labelX="Tipo de área"
        labelY="Comparación"
        handlerInfoGraph={null}
        openInfoGraph={null}
        graphDescription="Estado de la cobertura en el área seleccionada"
        units="%"
      />
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
