/** eslint verified */
import React from 'react';
import { BarStackHorizontal } from '@vx/shape';
import { Group } from '@vx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';

const TitleBarStackGraph = (
  input,
  width,
  graphTitle,
  units,
  margin = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  },
  style,
) => {
  if (width < 10) return null;
  // accessors
  const y = () => 1;

  const prepareData = (data, setName) => {
    const transformedData = {
      key: setName,
    };
    // transformedData[0] = `${data}`;
    transformedData[0] = '50';
    transformedData[1] = `${100 - 50}`;
    return transformedData;
  };

  const data = [prepareData(input, graphTitle)];
  const keys = [0, 1];
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = 25;

  // scales
  const xScale = scaleLinear({
    rangeRound: [0, xMax],
    domain: [0, 100], // TODO: Cambiar "0" por funcion min de d3-array
    nice: false,
  });
  const yScale = scaleBand({
    rangeRound: [yMax, 0],
    domain: data.map(y),
    padding: 0.1,
  });
  const zScale = scaleOrdinal({
    domain: keys,
    range: ['black', 'white', 'white'],
  });

  return (
    <div>
      <svg width={width - 15} height={35}>
        <Group top={margin.top} left={margin.left}>
          {`${Number((0.20 * 100).toFixed(2))} % `}
          <BarStackHorizontal
            data={data}
            keys={keys}
            width={xMax}
            height={yMax}
            y={y}
            xScale={xScale}
            yScale={yScale}
            zScale={zScale}
          />
        </Group>
      </svg>
    </div>
  );
};

export default TitleBarStackGraph;
