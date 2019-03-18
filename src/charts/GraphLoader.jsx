/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/Save';
import BarStackHorizontal from './BarStackHorizontal';
import BarGraph from './BarGraph';
import DotsGraph from './DotsGraph';
// import LinearFiltered from './LinearFiltered';
import Pie from './Pie';

const GraphLoader = (
  {
    graphType, data, graphTitle, labelX, labelY, width, height,
    elementOnClick, colors, activeBiome, showOnlyTitle,
    units,
    withLeyends, // TODO: use withLeyends to control if labels in x are showed in the axis X
  },
) => (
  <div>
    {
      (graphType === 'BarVertical') ? (
        <div>
          <BarGraph
            dataJSON={data}
            colors={colors}
            graphTitle={graphTitle}
            labelX={labelX}
            labelY={labelY}
            width={width}
            height={height}
            units={units}
            withLeyends={withLeyends}
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
          colors={colors}
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
            <DownloadIcon className="icondown" />
              Ecosistémas Equivalentes
          </h2>
          { !showOnlyTitle && (
            <div>
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
                elementOnClick={elementOnClick}
                colors={colors}
                activeBiome={activeBiome}
              />
            </div>
          )}
        </div>
      ) : ('')
    }
    {
    // (graphType === 'LinearFiltered') ? (
    //   // TODO: Usar name en el gráfico
    //   <div>
    //     <LinearFiltered
    //       dataJSON={data}
    //       colors={colors}
    //       graphTitle={graphTitle}
    //       labelX={labelX}
    //       labelY={labelY}
    //       width={width}
    //       height="280"
    //     />
    //   </div>
    // ) : ('')
    }
    {
    (graphType === 'Pie') ? (
      // TODO: Usar name en el gráfico
      <div>
        <Pie
          width={width}
          height="250"
          levels={data}
        />
      </div>
    ) : ('')
    }
  </div>
);

GraphLoader.propTypes = {
  elementOnClick: PropTypes.func,
  colors: PropTypes.array,
  graphType: PropTypes.string.isRequired,
  graphTitle: PropTypes.string,
  // Array or object, depending on graphType
  data: PropTypes.any.isRequired,
  activeBiome: PropTypes.string,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  showOnlyTitle: PropTypes.bool,
  units: PropTypes.string,
  withLeyends: PropTypes.bool,
};

GraphLoader.defaultProps = {
  elementOnClick: () => {},
  graphTitle: '',
  colors: ['blue'],
  activeBiome: '',
  labelX: '',
  labelY: '',
  width: 400,
  height: 250,
  showOnlyTitle: false,
  units: 'Ha',
  withLeyends: false,
};

export default GraphLoader;
