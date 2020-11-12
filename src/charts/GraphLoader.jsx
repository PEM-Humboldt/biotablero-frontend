import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/Save';
import DotsGraph from './DotsGraph';
import DotInfo from './DotInfo';
import LargeBarStackGraph from './LargeBarStackGraph';
import SmallBarStackGraph from './SmallBarStackGraph';
import MultiSmallBarStackGraph from './MultiSmallBarStackGraph';
import MultiLinesGraph from './MultiLinesGraph';

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
    padding,
    onClickGraphHandler,
    markers,
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

  switch (graphType) {
    case 'LargeBarStackGraph':
      return (
        <LargeBarStackGraph
          data={data}
          labelX={labelX}
          labelY={labelY}
          height={150}
          colors={colors}
          padding={padding}
          units={units}
          onClickGraphHandler={onClickGraphHandler}
        />
      );
    case 'SmallBarStackGraph':
      return (
        <SmallBarStackGraph
          data={data}
          height={30}
          colors={colors}
          units={units}
        />
      );
    case 'MultiSmallBarStackGraph':
      return (
        <MultiSmallBarStackGraph
          data={data}
          height={250}
          colors={colors}
          units={units}
        />
      );
    case 'Dots':
      return (
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
      );
    case 'DotInfo':
      return (
        <DotInfo
          data={data}
          width={width}
          height="100"
        />
      );
    case 'MultiLinesGraph':
      return (
        <MultiLinesGraph
          onClickGraphHandler={onClickGraphHandler}
          colors={colors}
          data={data}
          markers={markers}
          height={490}
        />
      );
    default:
      return '';
  }
};

GraphLoader.propTypes = {
  graphType: PropTypes.string.isRequired,
  data: PropTypes.any.isRequired, // Array or object, depending on graphType
  graphTitle: PropTypes.string,
  activeBiome: PropTypes.string,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  width: PropTypes.number,
  showOnlyTitle: PropTypes.bool,
  units: PropTypes.string,
  elementOnClick: PropTypes.func,
  // TODO: Remove array type once the charts in compensation are migrated
  colors: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
  ]),
  padding: PropTypes.number,
  onClickGraphHandler: PropTypes.func,
  markers: PropTypes.arrayOf(PropTypes.shape({
    axis: PropTypes.string,
    value: PropTypes.number,
    type: PropTypes.string,
    legendPosition: PropTypes.string,
  })),
};

GraphLoader.defaultProps = {
  graphTitle: '',
  activeBiome: '',
  labelX: '',
  labelY: '',
  showOnlyTitle: false,
  units: 'ha',
  elementOnClick: () => {},
  colors: () => {},
  padding: 0.25,
  onClickGraphHandler: () => {},
  markers: [],
};

export default GraphLoader;
