/** eslint verified */
import React from 'react';
import { BarStackHorizontal } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';
import Descargar from '@material-ui/icons/Save';

export default withTooltip(
  ({
    dataJSON,
    width,
    colors,
    height,
    graphTitle,
    labelX,
    labelY,
    margin = {
      top: 0,
      left: 40,
      right: 40,
      bottom: 60,
    },
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  }) => {
    if (width < 10) return null;
    // accessors
    const y = () => 1;

    const prepareData = (data, setName) => {
      const transformedData = {
        key: setName,
      };
      data.forEach((item) => {
        transformedData[item.key] = `${item.area}`;
      });
      return transformedData;
    };
    
    const data = [prepareData(dataJSON, labelY)];
    const keys = Object.keys(data[0]);
    const totals = dataJSON.reduce((total, current) =>  total + parseFloat(current.area), 0);

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // scales
    const xScale = scaleLinear({
      rangeRound: [0, xMax],
      domain: [0, totals], // TODO: Cambiar "0" por funcion min de d3-array
      nice: false,
    });
    const yScale = scaleBand({
      rangeRound: [yMax, 0],
      domain: data.map(y),
      padding: 0.3,
    });
    const zScale = scaleOrdinal({
      domain: keys,
      range: colors,
    });

    let tooltipTimeout;

    return (
      <div className="graphcard">
        <h2>
          <Descargar className="icondown" />
          {graphTitle}
        </h2>
        <svg width={width - 40} height={height}>
          <Group top={margin.top} left={margin.left}>
            <BarStackHorizontal
              data={data}
              keys={keys}
              width={xMax}
              height={yMax}
              y={y}
              xScale={xScale}
              yScale={yScale}
              zScale={zScale}
              // TODO: onClick should highlight area selected on the map
              onMouseLeave={() => () => {
                tooltipTimeout = setTimeout(() => {
                  hideTooltip();
                }, 300);
              }}
              onMouseMove={dataSelected => () => {
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                showTooltip({
                  tooltipData: dataSelected,
                  tooltipTop: margin.top + yScale(y(dataSelected.data)),
                  tooltipLeft: margin.left + dataSelected.width + 75,
                });
              }}
            />
            <AxisLeft
              top={margin.top}
              left={30}
              hideAxisLine
              hideTicks
              scale={yScale}
              label={labelY}
              labelProps={{
                fill: '#e84a5f',
                fontSize: 13,
                textAnchor: 'middle',
              }}
              tickLabelProps={() => ({
                fill: 'none',
              })}
            />
            <AxisBottom
              scale={xScale}
              top={yMax - 10}
              label={labelX}
              labelProps={{
                fill: '#e84a5f',
                fontSize: 13,
                textAnchor: 'middle',
              }}
              stroke="#e84a5f"
              tickStroke="#e84a5f"
              tickLabelProps={() => ({
                fill: '#e84a5f',
                fontSize: 10,
                textAnchor: 'end',
              })}
            />
          </Group>
        </svg>
        {tooltipOpen && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
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
              {`${Number(tooltipData.data[tooltipData.key]).toFixed(2)} Ha`}
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
  },
);
