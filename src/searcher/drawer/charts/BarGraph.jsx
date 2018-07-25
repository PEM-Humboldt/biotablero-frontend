import React from 'react';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand, scaleOrdinal } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { AxisBottom } from '@vx/axis';

// Se exporta el SGV construido
export default withTooltip((
  {tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  hideTooltip,
  showTooltip,
  ...props}) => {
  if (props.width < 10) return null;

  const prepareData = (data, setName) => {
     const transformedData = [];
       data.aggregations.areas.buckets.forEach(item => {
         transformedData.push({name:`${item.key}`, area_V: `${item.area.value}`});
       })
       return transformedData;
  }

  // Se preparan los datos para el gráfico
  const data = prepareData(props.dataJSON, props.area);
  let keys = Object.keys(data[0]);

  // Define las dimensiones y márgenes del gráfico
  const width = props.width;
  const height = 600;
  const margin = { top: 20, bottom: 20, left: 20, right: 20 };

  // Crea los límites del gráfico
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Ayuda a obtener el dato que se quiere
  const x = d => d.name;
  const y = d => d.area_V;

  // Crea las escalas para cada dato
  const xScale = scaleBand({
    rangeRound: [0, xMax],
    domain: data.map(x),
    padding: 0.4,
  });
  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, Math.max(...data.map(y))],
  });
  const zScale = scaleOrdinal({
    domain: keys,
    range: ['#6c5efb'],
  });

  // Junta las escalas y el accesor para construir cada punto
  const compose = (scale, accessor) => (data) => scale(accessor(data));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  let tooltipTimeout;

  return (
    <div className="graphcard">
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const barHeight = yMax - yPoint(d);
        return (
          <Group top={margin.top}
            left={margin.left} key={`bar-${i}`}
            >
            <Bar
              x={xPoint(d)}
              y={yMax - barHeight}
              height={barHeight}
              width={xScale.bandwidth()}
              fill='#fc2e1c'
              onMouseLeave={data => event => {
                tooltipTimeout = setTimeout(() => {
                  hideTooltip();
                }, 300);
              }}
              onMouseMove={data => event => {
                console.log("d: "+JSON.stringify(d.name));
                console.log('y: '+y);
                console.log('yMax: '+yMax);
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                showTooltip({
                  tooltipData: d,
                  tooltipTop: margin.top + yScale(y(d)),
                  tooltipLeft: margin.left + xScale(x(d)),
                });
              }}
            />
            <AxisBottom
              scale={xScale}
              top={yMax}
              stroke="#a44afe"
              tickStroke="#a44afe"
              tickLabelProps=
                {
                (area_V, index) => (
                {
                fill: '#ffffff',
                fontSize: 11,
                textAnchor: 'middle',
                }
              )
            }
            onMouseLeave={data => event => {
              tooltipTimeout = setTimeout(() => {
                hideTooltip();
              }, 300);
            }}
            onMouseMove={data => event => {
              if (tooltipTimeout) clearTimeout(tooltipTimeout);
              showTooltip({
                tooltipData: d,
                tooltipTop: margin.top + yScale(y(d)),
                tooltipLeft: margin.left + xScale(x(d)),
              });
            }}
            />
          </Group>
        );
      })}
    </svg>
    {tooltipOpen && (
      <Tooltip
        top={tooltipTop}
        left={tooltipLeft}
        style={{
          minWidth: 60,
          backgroundColor: 'rgba(0,0,0,0.9)',
          color: 'white',
        }}
      >
        <div style={{ color: zScale(tooltipData.name) }}>
          <strong>
            {tooltipData.name}
          </strong>
        </div>
        <div>{tooltipData.area_V} Ha</div>
      </Tooltip>
    )}
        </div>
  );
});
