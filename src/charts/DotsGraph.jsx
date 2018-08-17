/** eslint verified */
import React from 'react';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { GlyphCircle } from '@vx/glyph';
import { scaleLinear, scaleOrdinal } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';

const name = d => d.name;
const x = d => d.affected_percentage;
const y = d => d.fc;
const z = d => d.affected_natural;

let tooltipTimeout;

export default withTooltip(({
  width, height, colors, dataJSON: points, labelX, labelY, dotOnClick,
  hideTooltip, showTooltip, tooltipOpen, tooltipData, tooltipTop,
}) => {
  const margin = {
    top: 0, bottom: 40, left: 80, right: 40,
  };
  const xMax = width - margin.left - margin.right;
  const yMax = height - 65;
  if (width < 10) return null;
  if (height < 10) return null;

  const xScale = scaleLinear({
    domain: [0, Math.max(...points.map(x))],
    range: [0, xMax],
    nice: true,
  });
  const yScale = scaleLinear({
    domain: [4, 10],
    range: [yMax, 0],
    clamp: true,
  });
  const zScale = scaleOrdinal({
    range: colors,
  });

  const checkColorFC = (value1, areaAfectada) => {
    if (labelX === '% Area afectada') {
      // TODO: Include another color border for item selected and item in cart
      if ((value1 > 6.5) && (areaAfectada > 12)) return zScale(2);
      if ((value1 > 6.5) && (areaAfectada < 12)) return zScale(1);
      if ((value1 < 6.4) && (areaAfectada < 12)) return zScale(0);
    }
    return null;
  };

  return (
    <div>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={xScale}
          yScale={yScale}
          width={xMax}
          height={yMax}
          stroke="#dbbcc0"
          strokeOpacity={0.2}
          xOffset={xScale / 2}
        />
        <Group
          top={margin.top}
          width={width - margin.left}
        >
          {points.map(point => (
            <GlyphCircle
              className="dot"
              key={point.name}
              fill={checkColorFC(y(point), x(point))}
              left={margin.left + xScale(x(point))}
              top={yScale(y(point))}
              size={xScale(x(point))}
              onMouseEnter={() => () => {
                clearTimeout(tooltipTimeout);
                showTooltip({
                  tooltipTop: margin.top + yScale(y(point)),
                  tooltipData: point,
                });
              }}
              onMouseLeave={() => () => {
                tooltipTimeout = setTimeout(() => {
                  hideTooltip();
                }, 500);
              }}
              onClick={() => () => dotOnClick(name(point))}
            />
          ))}
          <AxisLeft
            left={margin.left - 10}
            scale={yScale}
            stroke="none"
            tickStroke="#edc2c7"
            label={labelY}
            labelProps={{
              fill: '#e84a5f',
              fontSize: 13,
              textAnchor: 'middle',
            }}
            tickLabelProps={() => ({
              fill: '#e84a5f',
              fontSize: 10,
              textAnchor: 'end',
            })}
          />
          <AxisBottom
            left={margin.left}
            scale={xScale}
            top={yMax + 10}
            stroke="none"
            label={labelX}
            labelProps={{
              fill: '#e84a5f',
              fontSize: 13,
              textAnchor: 'middle',
            }}
            tickStroke="#edc2c7"
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
          left={(xScale(x(tooltipData)) > margin.left)
            ? xScale(x(tooltipData)) : xScale(x(tooltipData)) + margin.left}
          top={tooltipTop}
          style={{
            minWidth: 60,
            backgroundColor: 'rgba(0,0,0,0.9)',
            padding: 12,
            lineHeight: '1.5',
          }}
        >
          <div style={{ color: checkColorFC(y(tooltipData), x(tooltipData)) }}>
            <div>
              <b>
                {'Afectación: '}
              </b>
              {`${Number(x(tooltipData)).toFixed(2)} %`}
            </div>
            <div>
              <b>
                {'FC: '}
              </b>
              {Number(y(tooltipData)).toFixed(2)}
            </div>
            <div>
              <b>
                {'Natural: '}
              </b>
              {`${Number(z(tooltipData)).toFixed(2)} Ha`}
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
});
