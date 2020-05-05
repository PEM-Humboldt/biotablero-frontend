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
import LargeBarStackGraphNIVO from './LargeBarStackGraphNIVO';

ReactChartkick.addAdapter(Chart);

const GraphLoader = (props) => {
  const {
    graphType,
    data,
    graphTitle,
    colors,
    labelX,
    labelY,
    width,
    height,
    elementOnClick,
    activeBiome,
    showOnlyTitle,
    units,
    withLeyends, // TODO: use withLeyends to control if labels in x are showed in the axis X
    handlerInfoGraph,
    graphDescription,
    openInfoGraph,
    zScale: zScaleInput,
  } = props;
  return (
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
          <SmallBarStackGraph
            dataJSON={data}
            colors={colors}
            graphTitle={graphTitle}
            labelY={labelY}
            width={width}
            height="150"
            units={units}
            openInfoGraph={openInfoGraph}
            handlerInfoGraph={handlerInfoGraph}
            graphDescription={graphDescription}
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
      {
        (graphType === 'LargeBarStackGraphNIVO') ? (
          <div className="graphcard pb">
            <LargeBarStackGraphNIVO
              data={data}
              graphTitle={graphTitle}
              labelX={labelX}
              labelY={labelY}
              width={width}
              height={150}
              handlerInfoGraph={handlerInfoGraph}
              openInfoGraph={openInfoGraph}
              graphDescription={graphDescription}
              zScale={zScaleInput}
            />
          </div>
        ) : ('')
      }
    </div>
  );
};

GraphLoader.propTypes = {
  graphType: PropTypes.string.isRequired,
  data: PropTypes.any.isRequired, // Array or object, depending on graphType
  graphTitle: PropTypes.string,
  colors: PropTypes.array,
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
  elementOnClick: PropTypes.func,
  zScale: PropTypes.func,
};

GraphLoader.defaultProps = {
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
  elementOnClick: () => {},
  zScale: () => {},
};

export default GraphLoader;
