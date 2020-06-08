import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import GraphLoader from '../charts/GraphLoader';
import matchColor from '../commons/matchColor';

const PersistenceFootprint = (props) => {
  const {
    data,
    handlerInfoGraph,
    openInfoGraph,
  } = props;
  return (
    <div className="graphcontainer pt6">
      <h2>
        <InfoIcon
          className="graphinfo"
          data-tooltip
          title="¿Qué significa este gráfico?"
          onClick={() => {
            handlerInfoGraph('PersistenceFootprint');
          }}
        />
        <div
          className="graphinfo"
          onClick={() => handlerInfoGraph('PersistenceFootprint')}
          onKeyPress={() => handlerInfoGraph('PersistenceFootprint')}
          role="button"
          tabIndex="0"
        />
      </h2>
      {(
        openInfoGraph && (openInfoGraph === 'PersistenceFootprint') && (
        <ShortInfo
          name="Persistencia Huella Humana"
          description="Barra horizontal del mismo tipo a la de la sección 1 (o a las barras horizontales existentes en BioTablero) que muestra el área total de la unidad de consulta distribuida en los diferentes valores de persistencia"
          className="graphinfo2"
          tooltip="¿Qué significa?"
          customButton
        />
        )
      )}
      <h6>
        Estable natural, Dinámica, Estable alta
      </h6>
      <div>
        <GraphLoader
          graphType="LargeBarStackGraph"
          data={data}
          labelX="Hectáreas"
          labelY="Persistencia Huella Humana"
          units="ha"
          colors={matchColor('persistenceHFP')}
          padding={0.25}
        />
      </div>
    </div>
  );
};

PersistenceFootprint.propTypes = {
  data: PropTypes.array.isRequired,
  handlerInfoGraph: PropTypes.func,
  openInfoGraph: PropTypes.string,
};

PersistenceFootprint.defaultProps = {
  handlerInfoGraph: () => {},
  openInfoGraph: null,
};

export default PersistenceFootprint;
