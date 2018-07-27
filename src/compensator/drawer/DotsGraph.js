import React from 'react';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { GlyphCircle } from '@vx/glyph';
import { scaleLinear, scaleBand, scaleOrdinal } from '@vx/scale';
import { genRandomNormalPoints } from '@vx/mock-data';
import { withTooltip, Tooltip } from '@vx/tooltip';

const name = d => d.name;
const x = d => d.percentageAffect;
const y = d => d.fc;
const z = d => d.z;

let tooltipTimeout;

export default withTooltip(props => {
  const { width, height } = props;
  const margin = { top: 40, bottom: 40, left: 60, right: 50 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - 80;
  if (width < 10) return null;

  const prepareData = (data) => {
    const transformedData = [];
    data.forEach(item => {
      transformedData.push(
        {
          name:`${item._source.BIOMA_IAVH}`,
          percentageAffect: `${item._source.PORCENT_AFECTACION}`,
          fc: `${item._source.FACT_COMP}`,
          z: `${item._source.PORCENT_AFECTACION}`,

        }
      );
    });
    return transformedData;
  };

  let points = prepareData(props.dataJSON.hits.hits);

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
    domain: points.map(y),
    range: ['#7b56a5',
    '#6256a5',
    '#5564a4',
    '#4a8fb8',
    '#51b4c1',
    '#81bb47',
    '#a4c051',
    '#b1b559',
    '#eabc47',
    '#d5753d',
    '#ea5948',
    '#ea495f',
    '#c3374d',],
  });

  return (
    <div>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={'white'}
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={xScale}
          yScale={yScale}
          width={xMax}
          height={yMax}
          stroke={'#dbbcc0'}
          strokeOpacity={0.2}
          xOffset={xScale / 2}
        />
      <Group top={margin.top} width={width - margin.left}
        onTouchStart={() => event => {
          if (tooltipTimeout) clearTimeout(tooltipTimeout);
          props.hideTooltip();
        }}
        >
          {points.map((point, i) => {
            return (
              <GlyphCircle
                className="dot"
                key={point.name}
                fill={zScale(y(point))}
                left={margin.left + xScale(x(point))}
                top={yScale(y(point))}
                size={xScale(x(point))}
                xScale={xScale}
                // zScale={zScale}
                onMouseEnter={() => event => {
                  if (tooltipTimeout) {
                    clearTimeout(tooltipTimeout);
                    props.showTooltip({
                      tooltipLeft: margin.left + point.width + 75,
                      tooltipTop: margin.top + yScale(y(point)),
                      tooltipData: point
                    });
                  }
                }}
                // onTouchStart={() => event => {
                //   if (tooltipTimeout) clearTimeout(tooltipTimeout);
                //   props.showTooltip({
                //     tooltipLeft: xScale(x(point)),
                //     tooltipTop: yScale(y(point)) - 30,
                //     tooltipData: point
                //   });
                // }}
                onMouseLeave={() => event => {
                  tooltipTimeout = setTimeout(() => {
                    props.hideTooltip();
                  }, 5000);
                }}
              />
            );
          })}
          <AxisLeft
            left={margin.left}
            scale={yScale}
            stroke="#edc2c7"
            tickStroke="#edc2c7"
            label={'Factor de Compensación'}
            labelProps={{
              fill: '#e84a5f',
              fontSize: 13,
              textAnchor: 'middle',
            }}
            tickLabelProps={(value, index) => ({
              fill: '#e84a5f',
              fontSize: 10,
              textAnchor: 'end',
            })}
          />
          <AxisBottom
            left={margin.left}
            scale={xScale}
            top={yMax}
            stroke="#edc2c7"
            tickStroke="#edc2c7"
            tickLabelProps={(value, index) => ({
              fill: '#e84a5f',
              fontSize: 10,
              textAnchor: 'end',
            })}
          />
        </Group>
      </svg>
      {props.tooltipOpen &&
        <Tooltip
          left={props.tooltipLeft}
          top={props.tooltipTop}
          style={{
            minWidth: 60,
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: 12,
            lineHeight: '1.5',
          }}
          >
            <div style={{ color: zScale(y(props.tooltipData))}}>
              <strong>Bioma IAvH: </strong> <br></br>
              {props.tooltipData.name}
              <div>{props.tooltipData.x} Ha</div>
              <select>
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
            </div>
          </Tooltip>}
        </div>
      );
    });
