/** eslint verified */
import React from 'react';
import { ParentSize } from '@vx/responsive';
import GraphLoader from './GraphLoader';

/**
 * Function to render a graph
 *
 * @param {any} data Graph data, it can be null (data hasn't loaded), false (data not available)
 *  or an Object with the data.
 * @param {string} labelX axis X label
 * @param {string} labelY axis Y label
 * @param {string} graph graph type
 * @param {string} graphTitle graph title
 * @param {array} colors colors to sort elements inside the graph
 */
const RenderGraph = (
  data, labelX, labelY, graph, graphTitle, colors,
  handlerInfoGraph, openInfoGraph, graphDescription, units,
) => {
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
            width={parent.width}
            height={parent.height}
            graphType={graph}
            data={data}
            labelX={labelX}
            labelY={labelY}
            graphTitle={graphTitle}
            colors={colors}
            handlerInfoGraph={handlerInfoGraph}
            openInfoGraph={openInfoGraph}
            graphDescription={graphDescription}
            units={units}
          />
        )
      )}
    </ParentSize>
  );
};

export default RenderGraph;
