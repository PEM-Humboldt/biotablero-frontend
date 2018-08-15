import React from 'react';
import { BarStackHorizontal } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';
import Descargar from '@material-ui/icons/Save';

export default withTooltip(
  ({
    dataJSON,
    labelX,
    labelY,
    width,
    height,
    graphTitle,
    events = false,
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
  }) => {
    if (width < 10) return null;
    // accessors
    const y = d => 1;

    const prepareData = (data, setName) => {
      const transformedData = {
        key: setName,
      }
      data.aggregations.areas.buckets.forEach(item => {
        transformedData[item['key']] = `${item.area.value}`
      })
      return transformedData;
    }

    function comparingValues(a, b) {
      return a - b;
    }

    function sortByKey(array, key) {
      if(graphTitle === 'Factor de Compensación' || labelY==='F C'){
        keys = keys.sort(comparingValues);
      }
      return array.sort(function(a, b) {
          var x = a[key]; var y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

    let data = [prepareData(dataJSON, labelY)].slice(0);
    let keys = Object.keys(data[0]);

    //Organizar los datos alfabética o numéricamente
    data = sortByKey(data, keys);
    let totals =  dataJSON.aggregations.total_area.value;

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
      padding: 0.3,
    });
    const zScale = scaleOrdinal({
      domain: keys,
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

    let tooltipTimeout;

    return (
      <div className="graphcard">
      <h2><Descargar className="icondown" />{graphTitle}</h2>
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
              onClick={data => event => {
                if (!events) return;
                alert(`clicked: ${JSON.stringify(data)}`);
                // actualizarSubArea(data.key);
              }}
              onMouseLeave={data => event => {
                tooltipTimeout = setTimeout(() => {
                  hideTooltip();
                }, 300);
              }}
              onMouseMove={data => event => {
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                showTooltip({
                  tooltipData: data,
                  tooltipTop: margin.top + yScale(y(data.data)),
                  tooltipLeft: margin.left + data.width + 75,
                });
              }}
            />
            <AxisLeft
              top={margin.top}
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
              })}
            />
            <AxisBottom
              scale={xScale}
              top={yMax-10}
              label={labelX}
              labelProps={{
                fill: '#e84a5f',
                fontSize: 13,
                textAnchor: 'middle',
              }}
              stroke="#e84a5f"
              tickStroke="#e84a5f"
              tickLabelProps={(value, index) => ({
                fill: '#e84a5f',
                fontSize: 10,
                textAnchor: 'end',
              })}
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
              padding: 12,
              lineHeight: '1.5',
            }}
          >
            <div style={{ color: zScale(tooltipData.key) }}>
              <strong>{tooltipData.key}</strong>
            </div>
            <div>{Number(tooltipData.data[tooltipData.key]).toFixed(2)} Ha</div>
            <div>
              <small>{tooltipData.xFormatted}</small>
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
);
