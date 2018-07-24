import React from 'react';
import { BarStackHorizontal } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';

export default withTooltip(
  ({
    dataJSON,
    labelY,
    width,
    height,
    events = false,
    margin = {
      top: 40,
      left: 70,
      right: 40,
      bottom: 100,
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

    // const actualizarSubArea = (key) => {
    //   return props.actualizarBiomaActivo(key);
    // }

    const prepareDara = (data, setName) => {
       const transformedData = {
         key: setName,
       }
         data.aggregations.areas.buckets.forEach(item => {
           transformedData[item['key']] = `${item.area.value}`
         })
         // console.log('transformedData: '+JSON.stringify(transformedData));
         return transformedData;
    }

    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt){
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    function sortByKey(array, key) {
      return array.sort(function(a, b) {
          var x = a[key]; var y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

    let data = [prepareDara(dataJSON.data, labelY)].slice(0);
    let keys = Object.keys(data[0]);
    keys = sortByKey(keys, keys);
    // console.log("DataDist1: "+ JSON.stringify(keys));
    let totals =  dataJSON.data.aggregations.total_area.value;

    // console.log("DataTotal: "+ dataJSON.data.aggregations.total_area.value);
    // bounds
    // console.log('width: '+width);
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // // scales
    const xScale = scaleLinear({
      rangeRound: [0, xMax],
      domain: [0, totals], // TODO: Cambiar "0" por funcion min de d3-array
      nice: true,
      clamp: false,
    });
    const yScale = scaleBand({
      rangeRound: [yMax, 0],
      domain: data.map(y),
      padding: 0.3,
      // tickFormat: () => val => formatDate(val),
      tickFormat: () => val => toTitleCase(labelY),
    });
    const zScale = scaleOrdinal({
      domain: keys,
      range: ['#6c5efb', '#c998ff', '#a44afe', '#ffffff', '#ff0000'],
    });

    let tooltipTimeout;

    return (
      <div style={{ position: 'relative' }}>
        <svg width={width} height={height}>
          <rect
            x={"5"}
            y={0}
            width={width}
            height={height}
            fill="#eaedff"
            rx={14}
          />
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
              hideAxisLine={true}
              hideTicks={true}
              scale={yScale}
              stroke="#a44afe"
              tickStroke="#a44afe"
              tickLabelProps={(value, index) => ({
                fill: '#a44afe',
                fontSize: 11,
                textAnchor: 'end',
                dy: '0.33em',
              })}
            />
            <AxisBottom
              scale={xScale}
              top={yMax}
              stroke="#a44afe"
              tickStroke="#a44afe"
              tickLabelProps={(value, index) => ({
                fill: '#a44afe',
                fontSize: 11,
                textAnchor: 'middle',
              })}
            />
          </Group>
        </svg>
        <div
          style={{
            position: 'absolute',
            top: margin.top / 2 - 10,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '14px',
          }}
        >
        </div>
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
            <div style={{ color: zScale(tooltipData.key) }}>
              <strong>{tooltipData.key}</strong>
            </div>
            <div>{tooltipData.data[tooltipData.key]} Ha</div>
            <div>
              <small>{tooltipData.xFormatted}</small>
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
);
