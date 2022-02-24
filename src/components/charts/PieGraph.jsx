import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';
import React from 'react';

import formatNumber from 'utils/format';
import { lightenColor, darkenColor } from 'utils/colorUtils';

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
          margin={{ top: 30, bottom: 30 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
          enableArcLinkLabels={false}
          enableArcLabels={false}
          tooltip={({ datum: { label, value, color } }) => (
            <div className="tooltip-graph-container">
              <strong style={{ color: lightenColor(color, 15) }}>
                {`${label}:`}
              </strong>
              <div>
                {formatNumber(value, 2)}
                {` ${units}`}
              </div>
            </div>
          )}
          onClick={({ id }) => {
            this.setState({ selectedId: id });
            onClickHandler(id);
          }}
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
