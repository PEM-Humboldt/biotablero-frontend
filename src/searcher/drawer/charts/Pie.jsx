import React from 'react';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { withTooltip, Tooltip } from '@vx/tooltip';

// const letters = letterFrequency.slice(0, 4);
// const browsers = Object.keys(browserUsage[0])
//   .filter(k => k !== "date")
//   .map(k => ({ label: k, usage: browserUsage[0][k] }));

function Label({ x, y, children }) {
  return (
    <text
      fill="white"
      textAnchor="middle"
      x={x}
      y={y}
      dy=".33em"
      fontSize={9}
    >
      {children}
    </text>
  );
}

// export default ({
export default withTooltip((
  {
    width,
    height,
    events = false,
    margin = {
      top: 30,
      left: 20,
      right: 20,
      bottom: 110,
    },
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
    ...props}) => {
    if (width < 10) return null;

    let tooltipTimeout;

    const prepareData = (data) => {
       const transformedData = [];
         data.aggregations.areas.buckets.forEach(item => {
           transformedData.push({name:`${item.key}`, area_V: `${item.area.value}`});
         })
         return transformedData;
    }

    // Se preparan los datos para el gráfico
    const data = prepareData(props.dataJSON);
    let keys = Object.keys(data[0]);

    const radius = Math.min(width, height) / 2;
    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            rx={14}
            width={width}
            height={height}
          />
          <Group top={height / 2 - margin.top} left={width / 2}>
            <Pie
              // data={letters}
              data={data}
              pieValue={d => d.area_V}
              outerRadius={radius - 80}
              innerRadius={radius - 120}
              fill="black"
              fillOpacity={d => 1 / (d.index + 2) }
              cornerRadius={3}
              padAngle={0}
              centroid={(centroid, arc) => {
                const [x, y] = centroid;
                return <Label x={x} y={y}>{arc.data.name}</Label>;
              }}
              onMouseLeave={data => event => {
                tooltipTimeout = setTimeout(() => {
                  hideTooltip();
                }, 300);
              }}
              onMouseMove={data => event => {
                console.log("d: "+JSON.stringify(data.name));
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                showTooltip({
                  tooltipData: data,
                  tooltipTop: margin.top,
                  tooltipLeft: margin.left,
                });
              }}
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
            }}
          >
            <div style={{ color: ['#6c5efb'] }}>
              <strong>
                {tooltipData.name}
              </strong>
            </div>
            <div>{tooltipData.area_V} Ha</div>
          </Tooltip>
        )}
      </div>
    );
  }
);
