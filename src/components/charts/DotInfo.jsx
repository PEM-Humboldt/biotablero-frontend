import React from 'react';
import { GlyphCircle } from '@vx/glyph';
import { withTooltip, Tooltip } from '@vx/tooltip';

import formatNumber from 'utils/format';

let tooltipTimeout;

export default withTooltip(({
  width, height, data, elementOnClick,
  hideTooltip, showTooltip, tooltipOpen, tooltipTop,
}) => {
  const margin = {
    top: 40, bottom: 60, left: 40, right: 50,
  };
  if (width < 10) return null;
  if (height < 10) return null;

  const area = formatNumber(data.area, 2);
  const percentage = parseFloat(data.percentage).toFixed(2);

  return (
    <div className="graphcontainer">
      <div className="graphcard">
        <h2>
          Resumen
        </h2>
        <svg width={width} height={height}>
          <GlyphCircle
            className="dot"
            key={data.id}
            stroke="#d49220"
            strokeWidth="5"
            fill="#d49242"
            left={margin.left * 2}
            top={height - margin.bottom + 10}
            size={40 * height}
            onMouseEnter={() => () => {
              clearTimeout(tooltipTimeout);
              showTooltip({
                tooltipTop: margin.top + 1.5,
                tooltipData: area,
              });
            }}
            onMouseLeave={() => () => {
              tooltipTimeout = setTimeout(() => {
                hideTooltip();
              }, 500);
            }}
            onClick={() => () => {
              elementOnClick(percentage);
            }}
          >
            <text
              dx={-25}
              dy={5}
              fill="white"
              strokeWidth={6}
              fontSize={20}
            >
              {`${percentage}%`}
            </text>
          </GlyphCircle>
          <text
            dx={150}
            dy={height / 2}
            fill="black"
            strokeWidth={6}
            fontSize={28}
          >
            {`${area} ha`}
          </text>
        </svg>
        <h3>
          Porcentaje de este ecosistema a nivel nacional y cantidad de hectáreas
        </h3>
        {tooltipOpen && (
          <Tooltip
            left="5"
            top={tooltipTop}
            style={{
              minWidth: 60,
              backgroundColor: 'rgba(0,0,0,0.9)',
              padding: 12,
              lineHeight: '1.5',
            }}
          >
            <div style={{ color: '#e9484d' }}>
              <div>
                <b>
                  {'Porcentaje del total: '}
                </b>
                {`${percentage} %`}
              </div>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
});
