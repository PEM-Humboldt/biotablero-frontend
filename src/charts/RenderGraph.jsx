/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import { ParentSize } from '@vx/responsive';
import GraphLoader from './GraphLoader';

/**
 * Function to render a graph
 *
 * @param {string} graph graph type
 * @param {any} data Graph data, it can be null (data hasn't loaded),
 *  false (data not available) or an Object with the data.
 * @param {string} graphTitle graph title
 * @param {array} colors colors to sort elements inside the graph
 * @param {string} labelX axis X label
 * @param {string} labelY axis Y label
 * @param {func} handlerInfoGraph function to handle additional information
 * @param {string} openInfoGraph additional information for the graph
 * @param {string} graphDescription description of the graph
 * @param {string} units units of data inside the graph
 */
const RenderGraph = (props) => {
  const {
    graph,
    data,
    graphTitle,
    colors,
    labelX,
    labelY,
    handlerInfoGraph,
    openInfoGraph,
    graphDescription,
    units,
    zScale,
  } = props;
  // While data is being retrieved from server
  let errorMessage = null;
  // (data === null) while waiting for API response
  if (data === null) errorMessage = 'Cargando información...';
  // (!data) if API doesn't respond
  else if (!data) errorMessage = `Información${graphTitle ? ` de ${graphTitle}` : ''} no disponible`;
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
    <ParentSize className="nocolor">
      {parent => (
        parent.width && (
          <GraphLoader
            graphType={graph}
            data={data}
            graphTitle={graphTitle}
            colors={colors}
            width={parent.width}
            height={parent.height}
            labelX={labelX}
            labelY={labelY}
            handlerInfoGraph={handlerInfoGraph}
            openInfoGraph={openInfoGraph}
            graphDescription={graphDescription}
            units={units}
            zScale={zScale}
          />
        )
      )}
    </ParentSize>
  );
};

RenderGraph.propTypes = {
  graph: PropTypes.string.isRequired,
  data: PropTypes.any, // Array or object, depending on graphType
  graphTitle: PropTypes.string,
  colors: PropTypes.array,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  handlerInfoGraph: PropTypes.func,
  openInfoGraph: PropTypes.string,
  graphDescription: PropTypes.string,
  units: PropTypes.string,
  zScale: PropTypes.func,
};

RenderGraph.defaultProps = {
  data: null,
  graphTitle: '',
  colors: ['blue'],
  labelX: '',
  labelY: '',
  handlerInfoGraph: () => {},
  openInfoGraph: null,
  graphDescription: null,
  units: 'ha',
  zScale: () => {},
};

export default RenderGraph;
