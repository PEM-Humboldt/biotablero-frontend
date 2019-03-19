import React from 'react';
import { Group } from '@vx/group';
import { Pie } from '@vx/shape';
import { GradientPinkBlue } from '@vx/gradient';
import { withTooltip, Tooltip } from '@vx/tooltip';
import Descargar from '@material-ui/icons/Save';

export default withTooltip(({
  margin = {
    top: 0,
    left: 40,
    right: 40,
    bottom: 60,
  }, width, height, colors, levels, values, sublevels, subvalues,
  activeBiome, labelX, labelY, elementOnClick, graphTitle,
  hideTooltip, showTooltip, tooltipOpen, tooltipData, tooltipTop,
  units,
}) => {
  const radius = Math.min(width, height) / 2;
  const centerY = height / 2;
  const centerX = width / 2;

  const white = '#ffffff';
  const black = '#000000';

  const area = d => d.area;

  return (
    <div className="graphcard">
      <h2>
        <Descargar className="icondown" />
        {graphTitle}
      </h2>
      <svg width={width} height={height}>
        <GradientPinkBlue id="pie-gradients" />
        <rect rx={14} width={width} height={height} fill="url('#pie-gradients')" />
        <Group top={centerY - margin.top} left={centerX}>
          {console.log('data')}
          {console.log(levels)}
          <Pie
            data={levels}
            pieValue={area}
            outerRadius={radius - 80}
            innerRadius={radius - 120}
            cornerRadius={3}
            padAngle={0}
          >
            {pie => (pie.arcs.map((arc, i) => {
              const opacity = 1 / (i + 2);
              const [centroidX, centroidY] = pie.arcs.generateCentroid;
              const { startAngle, endAngle } = arc;
              const hasSpaceForLabel = endAngle - startAngle >= 0.1;
              return (
                <g key={`level-${arc.data.key}-${i}`}>
                  <path d={pie.path(arc)} fill={white} fillOpacity={opacity} />
                  {hasSpaceForLabel && (
                    <text
                      fill={white}
                      x={centroidX}
                      y={centroidY}
                      dy=".33em"
                      fontSize={9}
                      textAnchor="middle"
                    >
                      {arc.data.key}
                    </text>
                  )}
                </g>
              );
            })
            )
          }
          </Pie>
          <Pie
            data={sublevels}
            pieValue={subvalues}
            pieSortValues={(a, b) => -1}
            outerRadius={radius - 135}
          >
            {pie => (pie.arcs.map((arc, i) => {
              const opacity = 1 / (i + 2);
              const [centroidX, centroidY] = pie.path.centroid(arc);
              return (
                <g key={`sublevel-${arc.data.key}-${i}`}>
                  <path d={pie.path(arc)} fill={black} fillOpacity={opacity} />
                  <text
                    fill="white"
                    textAnchor="middle"
                    x={centroidX}
                    y={centroidY}
                    dy=".33em"
                    fontSize={9}
                  >
                    {arc.data.letter}
                  </text>
                </g>
              );
            })
            )}
          </Pie>
        </Group>
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
          <div>
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
