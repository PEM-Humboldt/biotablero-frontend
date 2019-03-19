import React from 'react';
import { Group } from '@vx/group';
import { LinePath } from '@vx/shape';
import { curveMonotoneX } from '@vx/curve';
import { scaleLinear, scaleOrdinal } from '@vx/scale';
import { max } from 'd3-array';
import { withTooltip, Tooltip } from '@vx/tooltip';
import Descargar from '@material-ui/icons/Save';

export default withTooltip(({
  width, height, colors, dataJSON, activeBiome, labelX, labelY, elementOnClick,
  hideTooltip, showTooltip, tooltipOpen, tooltipData, tooltipTop, graphTitle,
  units,
}) => {
  // accessors
  const x = d => d.key;
  const y = d => d.area;
  // bounds
  const xMax = width;
  const yMax = height / 8;
  // prepare dataset
  const prepareData = (items) => {
    const transformedData = [];
    items.forEach((item) => {
      transformedData[item.key] = item.area;
    });
    return [transformedData];
  };
  // asign dataset
  const data = prepareData(dataJSON);
  const keys = dataJSON.map(item => item.key);
  // scales
  const xScale = scaleLinear({
    range: [0, xMax],
    domain: data.map(x),
    padding: 0.2,
    nice: true,
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, y)],
  });
  const zScale = scaleOrdinal({
    domain: keys,
    range: colors,
  });

  return (
    <div className="graphcard">
      <h2>
        <Descargar className="icondown" />
        {graphTitle}
      </h2>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="#a53e3e" rx={14} />
        {xMax > 8
          && data.map((value, i) => (
            <Group key={`lines-${i}`} top={i * yMax / 2}>
              <LinePath
                data={value}
                x={xScale(x(value))}
                y={yScale(y(value))}
                stroke="#ffffff"
                strokeWidth={1}
                curve={i % 2 === 0 ? curveMonotoneX : undefined}
              />
            </Group>
          ))}
      </svg>
      {tooltipOpen && (
        <Tooltip
          top={tooltipTop}
          style={{
            minWidth: 60,
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: 12,
            lineHeight: '1.5',
          }}
        >
          <div style={{ color: zScale(tooltipData.key) }}>
            <strong>
              {tooltipData.key}
            </strong>
          </div>
          <div>
            {`${Number(tooltipData.data[tooltipData.key]).toFixed(2)} ${units}`}
          </div>
          <div>
            <small>
              {tooltipData.xFormatted}
            </small>
          </div>
        </Tooltip>
      )}
    </div>
  );
});
