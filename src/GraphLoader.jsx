/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import Descargar from '@material-ui/icons/Save';
import BarStackHorizontal from './charts/BarStackHorizontal';
import BarGraph from './charts/BarGraph';
import DotsGraph from './charts/DotsGraph';

const GraphLoader = (
  {
    graphType, data, graphTitle, labelX, labelY, width, height,
    actualizarBiomaActivo, colors,
  },
) => (
  <div>
    {
      (graphType === 'BarVertical') ? (
        <div className="graphcard pb">
          <BarGraph
            dataJSON={data}
            graphTitle={graphTitle}
            labelX={labelX}
            labelY={labelY}
            width={width}
            height={height}
          />
        </div>
      ) : ('')
    }
    {
    (graphType === 'BarStackHorizontal') ? (
      // TODO: Usar name en el gráfico
      <div className="graphcard pb">
        <BarStackHorizontal
          dataJSON={data}
          graphTitle={graphTitle}
          labelX={labelX}
          labelY={labelY}
          width={width}
          height="250"
        />
      </div>
    ) : ('')
    }
    {
      (graphType === 'Dots') ? (
        <div className="graphcard pb">
          <h2>
            <Descargar className="icondown" />
              Ecosistémas Equivalentes
          </h2>
          <p className="legcomp">
            Agrega uno o varios Biomas a tus opciones de compensación
            <br />
            FC
            <b>
              Alto
            </b>
            <i>
              Medio
            </i>
            <em>
              Bajo
            </em>
            y cantidad de area afectada
          </p>
          <DotsGraph
            dataJSON={data}
            graphTitle={graphTitle}
            labelX={labelX}
            labelY={labelY}
            width={width}
            height="280"
            actualizarBiomaActivo={actualizarBiomaActivo}
            colors={colors}
          />
        </div>
      ) : ('')
    }
  </div>
);

GraphLoader.propTypes = {
  actualizarBiomaActivo: PropTypes.func,
  colors: PropTypes.array,
  graphType: PropTypes.string.isRequired,
  graphTitle: PropTypes.string,
  data: PropTypes.object.isRequired,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

GraphLoader.defaultProps = {
  actualizarBiomaActivo: () => {},
  graphTitle: '',
  colors: ['blue'],
  labelX: '',
  labelY: '',
  width: 400,
  height: 250,
};

export default GraphLoader;
