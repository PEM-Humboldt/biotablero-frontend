import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/Save';
import ReactChartkick, { LineChart } from 'react-chartkick';
import Chart from 'chart.js';
import BarGraph from './BarGraph';
import DotsGraph from './DotsGraph';
import DotInfo from './DotInfo';
import LargeBarStackGraph from './LargeBarStackGraph';
import SmallBarStackGraph from './SmallBarStackGraph';

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
    zScale,
    padding,
  } = props;

  // While data is being retrieved from server
  let errorMessage = null;
  // (data === null) while waiting for API response
  if (data === null) errorMessage = 'Cargando información...';
  // (!data) if API doesn't respond
  else if (!data) errorMessage = 'Información no disponible';
  // (data.length <= 0) if API response in not object
  else if (data.length <= 0) errorMessage = 'Información no disponible';
  if (errorMessage) {
    // TODO: ask Cesar to make this message nicer
    return (
      <div className="errorData">
        {errorMessage}
      </div>
    );
  }

  return (
    <div>
      {
        (graphType === 'LargeBarStackGraph') ? (
          <LargeBarStackGraph
            data={data}
            labelX={labelX}
            labelY={labelY}
            height={150}
            zScale={zScale}
            padding={padding}
          />
        ) : ('')
      }
      {
        (graphType === 'SmallBarStackGraph') ? (
          <SmallBarStackGraph
            data={data}
            height={30}
            zScale={zScale}
            units={units}
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
  elementOnClick: PropTypes.func,
  zScale: PropTypes.func,
  padding: PropTypes.number,
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
  elementOnClick: () => {},
  zScale: () => {},
  padding: 0.25,
};

export default GraphLoader;
