/** eslint verified */
import React from 'react';
import { BarStackHorizontal } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { withTooltip, TooltipWithBounds } from '@vx/tooltip';
import localPoint from '@vx/event/build/localPoint';
import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';

/**
 * Function to render tooltip inside the graph
 *
 * @param {string} event event on graph
 * @param {string} datum value to show inside tooltip
 */
const handleMouseOver = (event, datum, showTooltip) => {
  const coords = localPoint(event.target.ownerSVGElement, event);
  showTooltip({
    tooltipLeft: coords.x,
    tooltipTop: coords.y,
    tooltipData: datum,
  });
};

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
    units,
    handlerInfoGraph,
    openInfoGraph,
    graphDescription,
  }) => {
    if (width < 10) return null;
    // accessors
    const y = () => 1;

    const prepareData = (data, setName) => {
      const transformedData = {
        key: setName,
      };
      data.forEach((item) => {
        transformedData[item.key || item.type] = `${item.area || item.percentage}`;
      });
      return transformedData;
    };

    const data = [prepareData(dataJSON, labelY)];
    const keys = dataJSON.map(item => item.key || item.type);
    const totals = dataJSON.reduce((total, current) => total
      + parseFloat(current.area || current.percentage), 0);

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
      padding: 0.1,
    });
    const zScale = scaleOrdinal({
      domain: keys,
      range: colors,
    });

    let tooltipTimeout;

    return (
      <div>
        <h2>
          <DownloadIcon className="icondown" />
          <InfoIcon
            className="graphinfo"
            data-tooltip
            title="¿Qué significa este gráfico?"
            onClick={() => {
              handlerInfoGraph(graphTitle);
            }}
          />
          <div
            className="graphinfo"
            onClick={() => handlerInfoGraph(graphTitle)}
            onKeyPress={() => handlerInfoGraph(graphTitle)}
            role="button"
            tabIndex="0"
          >
            {graphTitle}
          </div>
        </h2>
        {openInfoGraph && (openInfoGraph === graphTitle) && (
          <ShortInfo
            name={graphTitle}
            description={graphDescription}
            className="graphinfo2"
            tooltip="¿Qué significa?"
            customButton
            onMouseMove={(e) => {
              if (tooltipTimeout) clearTimeout(tooltipTimeout);
              handleMouseOver(e, '¿Qué significa?', showTooltip);
            }}
          />
        )}
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
              onMouseMove={dataSelected => (e) => {
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                handleMouseOver(e, dataSelected, showTooltip);
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
              top={yMax}
              label={labelX}
              labelProps={{
                fill: '#e84a5f',
                fontSize: 13,
                textAnchor: 'middle',
              }}
              stroke="#e84a5f"
              numTicks={5}
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
          <TooltipWithBounds
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
              {`${Number(tooltipData.data[tooltipData.key]).toFixed(2)} ${units}`}
            </div>
            <div>
              <small>
                {tooltipData.xFormatted}
              </small>
            </div>
          </TooltipWithBounds>
        )}
      </div>
    );
  },
);
