import DownloadIcon from '@mui/icons-material/Save';
import PropTypes from 'prop-types';

import DotsGraph from 'pages/compensation/drawer/graphLoader/DotsGraph';

import { MyResponsiveScatterPlot } from './graphLoader/MyResponsiveScatterPlot';
import { dataBarChartFromBackend } from './graphLoader/dataScatter';

const GraphLoader = (props) => {
  const {
    graphType,
    data,
    graphTitle,
    colors,
    labelX,
    labelY,
    width,
    elementOnClick,
    activeBiome,
    showOnlyTitle,
    units,
    message,
  } = props;

  let errorMessage = null;
  // TODO: don't relay on data being null for a loading state
  if (data === null || message === 'loading') {
    errorMessage = 'Cargando información...';
  } else if (!data || data.length <= 0 || Object.keys(data).length === 0 || message === 'no-data') {
    errorMessage = 'Información no disponible';
  }
  if (errorMessage) {
    return (
      <div className="errorData">
        {errorMessage}
      </div>
    );
  }

  switch (graphType) {
    case 'Dots':
      return (
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
              <div style={{height:"280px"}}>
              <MyResponsiveScatterPlot
                data={dataBarChartFromBackend}
                activeBiome={activeBiome}
                dataJSON={data}
                height="280"
                width={width}
                labelX={labelX}
                labelY={labelY}
                colors={colors}
                elementOnClick={elementOnClick}
              />
              </div>
            </div>
          )}
        </div>
      );
      default:
        return <></>;
  }
};

GraphLoader.propTypes = {
  graphType: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  graphTitle: PropTypes.string,
  activeBiome: PropTypes.string,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  width: PropTypes.number.isRequired,
  showOnlyTitle: PropTypes.bool,
  units: PropTypes.string,
  elementOnClick: PropTypes.func,
  colors: PropTypes.array,
  message: PropTypes.string,
};

GraphLoader.defaultProps = {
  graphTitle: '',
  activeBiome: '',
  labelX: '',
  labelY: '',
  showOnlyTitle: false,
  units: '',
  elementOnClick: () => {},
  colors: [],
  message: null,
};

export default GraphLoader;
