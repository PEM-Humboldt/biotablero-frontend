import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveLine } from '@nivo/line';

const MultiLinesGraph = ({
  setSelection, colors, data,
}) => (
  <div style={{ height: '490px', width: '450px' }}>
    <ResponsiveLine
      onMouseEnter={point => setSelection(point.serieId || point.id)}
      data={data}
      curve="cardinal"
      margin={{
        top: 50,
        left: 60,
        right: 20,
        bottom: 100,
      }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 0,
        max: 100,
        stacked: false,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Año',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Indice promedio Huella Humana',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      colors={obj => colors(obj.id)}
      blendMode="multiply"
      activeFillOpacity={1}
      fillOpacity={0.3}
      inactiveFillOpacity={0.2}
      borderWidth={2}
      activeBorderWidth={3}
      inactiveBorderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', '0.3']] }}
      borderOpacity={0.95}
      activeBorderOpacity={0.95}
      inactiveBorderOpacity={0.05}
      startLabel="Área total"
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh
      legends={[
        {
          anchor: 'bottom-left',
          direction: 'row',
          justify: false,
          translateX: -50,
          translateY: 100,
          itemsSpacing: 30,
          itemDirection: 'left-to-right',
          itemWidth: 90,
          itemHeight: 80,
          itemOpacity: 0.75,
          onMouseEnter: point => setSelection(point.serieId || point.id),
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      isInteractive
      animate
    />
  </div>
);

MultiLinesGraph.propTypes = {
  setSelection: PropTypes.func.isRequired,
  colors: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.shape({
      id: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.string,
        y: PropTypes.number,
      })),
    }),
  })).isRequired,
};

MultiLinesGraph.defaultProps = {
};

export default MultiLinesGraph;
