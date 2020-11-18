import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';
import React from 'react';

const theme = {
  tooltip: {
    container: {
      background: '#333',
      color: '#ffffff',
    },
    title: {
      filter: 'brightness(1.25)',
    },
  },
};

const PieGraph = ({ data, height, units }) => (
  <div style={{ height }}>
    <ResponsivePie
      data={data}
      colors={({ color }) => color}
      margin={{ top: 40, bottom: 40 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      radialLabel={({ label, value }) => (value > 0 ? label : `${label} (${value} ${units})`)}
      radialLabelsTextColor={{ from: 'color', modifiers: [['darker', 0.7]] }}
      radialLabelsLinkColor={{ from: 'color' }}
      radialLabelsLinkHorizontalLength={10}
      enableSlicesLabels={false}
      tooltip={({ label, value, color }) => (
        <div>
          <strong style={{ color, ...theme.tooltip.title }}>
            {`${label}:`}
          </strong>
          <div>
            {String(value)}
            {` ${units}`}
          </div>
        </div>
      )}
      theme={theme}
    />
  </div>
);

PieGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
  height: PropTypes.number,
  units: PropTypes.string,
};

PieGraph.defaultProps = {
  height: 300,
  units: 'ha',
};

export default PieGraph;
