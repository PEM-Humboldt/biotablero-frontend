import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';
import React from 'react';

import formatNumber from 'utils/format';
import { lightenColor, darkenColor } from 'utils/colorUtils';

const theme = {
  tooltip: {
    background: '#333',
    color: '#ffffff',
    padding: '5px 8px',
  },
};

class PieGraph extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedId: null,
    };
  }

  render() {
    const {
      height,
      units,
      onClickHandler,
      colors,
      data,
    } = this.props;
    const { selectedId } = this.state;
    return (
      <div style={{ height }}>
        <ResponsivePie
          data={data}
          colors={({ id }) => {
            if (selectedId === id) {
              return darkenColor(colors(id), 10);
            }
            return colors(id);
          }}
          margin={{ top: 30, bottom: 60 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
          enableRadialLabels={false}
          enableSliceLabels={false}
          tooltip={({ datum: { label, value, color } }) => (
            <div>
              <strong style={{ color: lightenColor(color, 15) }}>
                {`${label}:`}
              </strong>
              <div>
                {formatNumber(value, 2)}
                {` ${units}`}
              </div>
            </div>
          )}
          theme={theme}
          onClick={({ id }) => {
            this.setState({ selectedId: id });
            onClickHandler(id);
          }}
          legends={[
            {
              anchor: 'bottom-left',
              direction: 'column',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 5,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
      </div>
    );
  }
}

PieGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  height: PropTypes.number,
  units: PropTypes.string,
  colors: PropTypes.func,
  onClickHandler: PropTypes.func,
};

PieGraph.defaultProps = {
  height: 300,
  units: 'ha',
  colors: () => {},
  onClickHandler: () => {},
};

export default PieGraph;
