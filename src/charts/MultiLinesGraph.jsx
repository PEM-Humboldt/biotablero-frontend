import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveLine } from '@nivo/line';
import matchColor from '../commons/matchColor';

const MultiLinesGraph = ({
  colors, data,
}) => (
  <div style={{ height: '400px', width: '750px' }}>
    <h2>
      Seccion 2: Huella humana a través del tiempo
    </h2>
    {console.log(matchColor(colors))}
    <ResponsiveLine
      data={data}
      curve="cardinal"
      margin={{
        top: 50,
        left: 60,
        right: 110,
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
      colors={matchColor(colors)}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
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
    />
  </div>
);

MultiLinesGraph.propTypes = {
  colors: PropTypes.string,
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
  colors: 'sEco',
};

export default MultiLinesGraph;
