import React from 'react';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { GlyphCircle } from '@vx/glyph';
import { scaleLinear, scaleOrdinal } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';

const name = d => d.name;
const x = d => d.porcentaje_affectada;
const y = d => d.fc;
const z = d => d.natural_afectada;

let tooltipTimeout;

export default withTooltip(props => {
  const { width, height } = props;
  const margin = { top: 0, bottom: 40, left: 80, right: 40 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - 65;
  if (width < 10) return null;

  let points = props.dataJSON;

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
    // domain: points.map(x),
    range: props.colors,
  });

  const checkColorFC = (value1, areaAfectada) =>{
    if(props.labelX === "% Area afectada") {
      // if ((areaAfectada > 0.22)) return 0; // TODO: Habiltar cambio de color a "negro" si el punto ha sido seleccionado previamente
      if ((value1 > 6.5) && (areaAfectada > 12)) return zScale(2);
      if ((value1 > 6.5) && (areaAfectada < 12)) return zScale(1);
      if ((value1 < 6.4) && (areaAfectada < 12)) return zScale(0);
    }
  }

  return (
    <div>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={'transparent'}
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
                // fill={zScale(y(point))}
                fill={checkColorFC(y(point), x(point))}
                left={margin.left + xScale(x(point))}
                top={yScale(y(point))}
                size={xScale(x(point))}
                // xScale={xScale}
                // zScale={zScale}
                onMouseEnter={() => event => {
                  if (tooltipTimeout) {
                    clearTimeout(tooltipTimeout);
                    props.showTooltip({
                      tooltipTop: margin.top + yScale(y(point)),
                      tooltipData: point
                    });
                  }
                  props.actualizarBiomaActivo(name(point));
                }}
                onMouseLeave={() => event => {
                  tooltipTimeout = setTimeout(() => {
                    props.hideTooltip();
                  }, 500);
                }}
              />
            );
          })}
          <AxisLeft
            left={margin.left-10}
            scale={yScale}
            stroke="none"
            tickStroke="#edc2c7"
            label={props.labelY}
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
            top={yMax+10}
            stroke="none"
            label={props.labelX}
            labelProps={{
              fill: '#e84a5f',
              fontSize: 13,
              textAnchor: 'middle',
            }}
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
            left={(xScale(x(props.tooltipData)) > margin.left) ? xScale(x(props.tooltipData)) : xScale(x(props.tooltipData))+ margin.left}
            top={props.tooltipTop}
            style={{
              minWidth: 60,
              backgroundColor: 'rgba(0,0,0,0.9)',
              padding: 12,
              lineHeight: '1.5',
            }}
            >
              <div style={{ color: checkColorFC(y(props.tooltipData), x(props.tooltipData))}}>
                { // TODO: Cambiar el color en Drawer del nombre del bioma de acuerdo al color seleccionado en el gráfico
                //  console.log("checkColorFC(y(props.tooltipData), x(props.tooltipData)): "+y(props.tooltipData)+" "+x(props.tooltipData))
                }
                {/* {name(props.tooltipData)} */}
                <div><b> Afectación: </b>{Number(x(props.tooltipData)).toFixed(2)} %</div>
                <div><b> FC: </b>{Number(y(props.tooltipData)).toFixed(2)}</div>
                <div><b> Natural: </b>{Number(z(props.tooltipData)).toFixed(2)} Ha</div>
              </div>
            </Tooltip>}
          </div>
        );
      });
