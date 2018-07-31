import React from 'react';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { AxisBottom, AxisLeft } from '@vx/axis';
import Descargar from '@material-ui/icons/Save';

// Se exporta el SGV construido
export default withTooltip((
  {tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  hideTooltip,
  showTooltip,
  labelX,
  labelY,
  titulo,
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
  // let keys = Object.keys(data[0]);

  // Define las dimensiones y márgenes del gráfico
  const width = props.width;
  const height = 300;
  const margin = { top: 40, bottom: 60, left: 40, right: 50 };

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
    padding: 0.2,
    nice: false,
  });
  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, Math.max(...data.map(y))],
    nice: false,
  });
  // const zScale = scaleOrdinal({
  //   domain: keys,
  //   range: ['#ea495f'],
  // });

  // Junta las escalas y el accesor para construir cada punto
  const compose = (scale, accessor) => (data) => scale(accessor(data));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  let tooltipTimeout;

  return (
    <div className="graphcontainer">
    <div className="graphcard">
    <h2><Descargar className="icondown" />{titulo}</h2>
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
              fill='#345b6b'
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
              }}/>
            <AxisLeft
              left={30}
              hideAxisLine={true}
              hideTicks={true}
              scale={yScale}
              label={labelY}
              labelProps={{
                fill: '#e84a5f',
                fontSize: 13,
                textAnchor: 'middle',
              }}
              tickLabelProps={(value, index) => ({
                fill: 'none',
              })}/>
            <AxisBottom
              scale={xScale}
              top={yMax}
              label={labelX}
              labelProps={{
                fill: '#e84a5f',
                fontSize: 13,
                textAnchor: 'middle',
              }}
              stroke="#ea495f"
              tickStroke="#ea495f"
              tickLabelProps=
                {
                (area_V, index) => (
                {
                fill: 'none',
                fontSize: 11,
                textAnchor: 'end',
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
            }}/>
          </Group>
        );
      })}
    </svg>
    {tooltipOpen &&
      <Tooltip
        left={tooltipLeft}
        top={tooltipTop}
        style={{
          minWidth: 60,
          backgroundColor: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: 12,
          lineHeight: '1.5',
        }}
        >
        <div>
          <strong>{tooltipData.name}</strong><br></br>
          <div>{Number(tooltipData.area_V).toFixed(2)} Ha</div>
        </div>
      </Tooltip>}
        {/* <div>{Number(tooltipData.area_V).toFixed(2)} Ha</div> */}

        </div>
        </div>
  );
});
