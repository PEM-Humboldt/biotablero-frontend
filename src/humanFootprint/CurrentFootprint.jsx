import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';
import GraphLoader from '../charts/GraphLoader';
import matchColor from '../commons/matchColor';

const CurrentFootprint = (props) => {
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
            handlerInfoGraph('CurrentFootprint');
          }}
        />
        <div
          className="graphinfo"
          onClick={() => handlerInfoGraph('CurrentFootprint')}
          onKeyPress={() => handlerInfoGraph('CurrentFootprint')}
          role="button"
          tabIndex="0"
        />
      </h2>
      {(
        openInfoGraph && (openInfoGraph === 'CurrentFootprint') && (
        <ShortInfo
          name="Huella Humana Actual"
          description="Se mostrará el valor promedio de la huella humana en el año más reciente para la unidad de consulta seleccionada previamente. Justo debajo una gráfica tipo barra horizontal apilada que mostrará la proporción de cada categoría para el año más reciente"
          className="graphinfo2"
          tooltip="¿Qué significa?"
          customButton
        />
        )
      )}
      <h6>
        Natural, Baja, Media y Alta
      </h6>
      <div>
        <GraphLoader
          graphType="LargeBarStackGraph"
          data={data}
          labelX="Hectáreas"
          labelY="Huella Humana Actual"
          units="ha"
          colors={matchColor('currentHFP')}
          padding={0.25}
        />
      </div>
    </div>
  );
};

CurrentFootprint.propTypes = {
  data: PropTypes.array.isRequired,
  handlerInfoGraph: PropTypes.func,
  openInfoGraph: PropTypes.string,
};

CurrentFootprint.defaultProps = {
  handlerInfoGraph: () => {},
  openInfoGraph: null,
};


export default CurrentFootprint;
