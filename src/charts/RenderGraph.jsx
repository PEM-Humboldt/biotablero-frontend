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
 * @param {string} graphDescription description of the graph
 * @param {string} units units of data inside the graph
 */
const RenderGraph = (props) => {
  const {
    graph,
    data,
    graphTitle,
    labelX,
    labelY,
    graphDescription,
    units,
    colors,
    padding,
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
            graphDescription={graphDescription}
            units={units}
            padding={padding}
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
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  graphDescription: PropTypes.string,
  units: PropTypes.string,
  colors: PropTypes.func,
  padding: PropTypes.number,
};

RenderGraph.defaultProps = {
  data: null,
  graphTitle: '',
  labelX: '',
  labelY: '',
  graphDescription: null,
  units: 'ha',
  colors: () => {},
  padding: 0.25,
};

export default RenderGraph;
