/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/Save';
import ReactChartkick, { LineChart } from 'react-chartkick';
import Chart from 'chart.js';
import BarGraph from './BarGraph';
import BarStackGraph from './BarStackGraph';
import SmallBarStackGraph from './SmallBarStackGraph';
import DotsGraph from './DotsGraph';
import DotInfo from './DotInfo';

ReactChartkick.addAdapter(Chart);

const GraphLoader = (
  {
    graphType, data, graphTitle, labelX, labelY, width, height,
    elementOnClick, colors, activeBiome, showOnlyTitle,
    units,
    withLeyends, // TODO: use withLeyends to control if labels in x are showed in the axis X
    handlerInfoGraph,
    graphDescription,
    openInfoGraph,
  },
) => (
  <div>
    {
      (graphType === 'BarStackGraph') ? (
        // TODO: Usar name en el gráfico
        <div className="graphcard pb">
          <BarStackGraph
            dataJSON={data}
            colors={colors}
            graphTitle={graphTitle}
            labelX={labelX}
            labelY={labelY}
            width={width}
            height="150"
            units={units}
            openInfoGraph={openInfoGraph}
            handlerInfoGraph={handlerInfoGraph}
            graphDescription={graphDescription}
          />
        </div>
      ) : ('')
    }
    {
      (graphType === 'SmallBarStackGraph') ? (
        // TODO: Usar name en el gráfico
        <SmallBarStackGraph
          dataJSON={data}
          colors={colors}
          graphTitle={graphTitle}
          labelX={labelX}
          labelY={labelY}
          width={width}
          height="150"
          units={units}
          openInfoGraph={openInfoGraph}
          handlerInfoGraph={handlerInfoGraph}
          graphDescription={graphDescription}
          isSmall
        />
      ) : ('')
    }
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
      (graphType === 'Dots') ? (
        // TODO: Move this custom content to src/compesation/Drawer
        <div className="graphcard pb">
          <h2>
            <DownloadIcon className="icondown" />
              Ecosistemas Equivalentes
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
                activeBiome={activeBiome}
                colors={colors}
                dataJSON={data}
                elementOnClick={elementOnClick}
                graphTitle={graphTitle}
                labelX={labelX}
                labelY={labelY}
                height="280"
                units={units}
                width={width}
              />
            </div>
          )}
        </div>
      ) : ('')
    }
    {
      (graphType === 'DotInfo') ? (
        <div>
          <DotInfo
            data={data}
            width={width}
            height="100"
          />
        </div>
      ) : ('')
    }
    {
      (graphType === 'LineChart') ? (
        <div>
          <LineChart
            // data={{ '2017-05-13': 2, '2017-05-14': 5 }}
            data={data}
            width={width}
            height="100"
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
  handlerInfoGraph: PropTypes.func,
  openInfoGraph: PropTypes.string,
  graphDescription: PropTypes.string,
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
  units: 'ha',
  withLeyends: false,
  handlerInfoGraph: () => {},
  openInfoGraph: null,
  graphDescription: null,
};

export default GraphLoader;
