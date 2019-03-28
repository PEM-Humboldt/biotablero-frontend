import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleLinear, scaleBand, scaleOrdinal } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';
import Descargar from '@material-ui/icons/Save';

// Se exporta el SGV construido
export default withTooltip(({
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  hideTooltip,
  showTooltip,
  labelX,
  labelY,
  graphTitle,
  colors,
  withLeyends, // TODO: Control if names in axis X are showed
  units,
  ...props
}) => {
  const { width, dataJSON, area } = props;
  if (width < 10) return null;

  const prepareData = (data) => {
    const transformedData = [];
    data.forEach((item) => {
      transformedData.push({
        name: `${item.key || item.type || item.category}`,
        area_V: `${item.area || item.percentage}`,
      });
    });
    return transformedData;
  };

  // Se preparan los datos para el gráfico
  const data = prepareData(dataJSON, area);

  // Define las dimensiones y márgenes del gráfico
  const height = 300;
  const margin = {
    top: 40, bottom: 60, left: 40, right: 50,
  };

  // Crea los límites del gráfico
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const keys = dataJSON.map(item => item.key || item.type);

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
  const zScale = scaleOrdinal({
    domain: keys,
    range: colors,
  });

  // Junta las escalas y el accesor para construir cada punto
  const compose = (scale, accessor) => value => scale(accessor(value));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  let tooltipTimeout;

  return (
    <div className="graphcontainer">
      <div className="graphcard">
        <h2>
          <Descargar className="icondown" />
          {graphTitle}
        </h2>
        <svg width={width} height={height}>
          {data.map((d, i) => {
            const barHeight = yMax - yPoint(d);
            return (
              <Group
                top={margin.top}
                left={margin.left}
                key={`bar-${i}`}
              >
                <Bar
                  x={xPoint(d)}
                  y={yMax - barHeight}
                  z={zScale(d)}
                  height={barHeight}
                  width={xScale.bandwidth()}
                  fill={zScale(d.name || d.key)}
                  onMouseLeave={() => () => {
                    tooltipTimeout = setTimeout(() => {
                      hideTooltip();
                    }, 300);
                  }}
                  onMouseMove={() => () => {
                    if (tooltipTimeout) clearTimeout(tooltipTimeout);
                    showTooltip({
                      tooltipData: d,
                      tooltipTop: margin.top + yScale(y(d)),
                      tooltipLeft: margin.left + xScale(x(d)),
                    });
                  }}
                />
                <AxisLeft
                  hideAxisLine
                  hideTicks
                  scale={yScale}
                  label={labelY}
                  labelOffset={5}
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
                  top={yMax}
                  label={labelX}
                  labelProps={{
                    fill: '#e84a5f',
                    fontSize: 13,
                    textAnchor: 'middle',
                  }}
                  stroke="#ea495f"
                  tickStroke="#ea495f"
                  tickLabelProps={() => ({
                    fill: 'none',
                  })}
                />
              </Group>
            );
          })}
        </svg>
        {tooltipOpen && (
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
              <strong>
                {tooltipData.name}
              </strong>
              <br />
              <div>
                {`${Number(tooltipData.area_V).toFixed(2)} ${units}`}
              </div>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
});
