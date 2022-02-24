import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveLine } from '@nivo/line';

import formatNumber from 'utils/format';

class MultiLinesGraph extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      labels: {},
      selectedId: null,
    };
  }

  componentDidMount() {
    const { data, colors } = this.props;
    const labels = {};
    const newData = data.map((obj) => {
      labels[obj.key] = obj.label;
      // "id" field is required for NIVO Line component
      return { ...obj, id: obj.key, color: colors(obj.key) };
    });
    this.setState({
      data: newData,
      labels,
    });
  }

  /**
   * Organize customized tooltip for this graph
   *
   * @param {object} point datum selected in the graph
   */
  getToolTip = (point) => {
    const {
      data: { xFormatted, yFormatted },
      serieColor,
      serieId,
    } = point;
    const { labels } = this.state;
    const { units } = this.props;
    return (
      <div className="tooltip-graph-container">
        <div>
          <strong style={{ color: serieId === 'aTotal' ? '#ffffff' : serieColor }}>
            {`${labels[serieId]} en ${xFormatted}`}
          </strong>
          <br />
          <div style={{ color: '#ffffff' }}>
            {`${formatNumber(yFormatted, 2)} ${units}`}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Set state values updated by user action with the data structure required
   *
   * @param {string} selectedId identify the value selected in data
   */
  changeSelected = (selectedId) => {
    const { data, colors } = this.props;
    const transformedData = data.map((obj) => {
      // "id" field is required for NIVO Line component
      if (obj.key === selectedId) return { ...obj, id: obj.key, color: colors(`${obj.key}Sel`) };
      return { ...obj, id: obj.key, color: colors(obj.key) };
    });
    this.setState({ data: transformedData, selectedId });
  };

  /**
   * Handle events to be updated when a line in the graph is selected
   *
   * @param {object} point retrieve the datum selected in the graph
   */
  selectLine = (point) => {
    const { onClickGraphHandler } = this.props;
    this.changeSelected(point.serieId || point.id);
    onClickGraphHandler(point.serieId || point.id);
  };

  render() {
    const {
      colors,
      labelX,
      labelY,
      markers,
      yMin,
      yMax,
      height,
    } = this.props;

    const { data, labels, selectedId } = this.state;

    if (!data) return null;

    return (
      <div style={{ height }}>
        <ResponsiveLine
          onClick={this.selectLine}
          data={data}
          curve="cardinal"
          markers={markers}
          crosshairType="cross"
          margin={{
            top: 50,
            left: 60,
            right: 20,
            bottom: 100,
          }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: yMin,
            max: yMax,
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
            legend: labelX,
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: labelY,
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          colors={(obj) => obj.color}
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
          tooltip={(point) => this.getToolTip(point.point)}
          theme={{
            onMouseEnter: {
              container: {
                padding: 0,
              },
            },
          }}
          legends={[{
            anchor: 'bottom-left',
            data: Object.keys(labels).map((id) => {
              const color = id === selectedId ? colors(`${id}Sel`) : colors(id);
              return {
                id,
                label: labels[id],
                color,
              };
            }),
            direction: 'row',
            justify: false,
            translateX: -50,
            translateY: 100,
            itemsSpacing: 5,
            itemDirection: 'left-to-right',
            itemWidth: 105,
            itemHeight: 40,
            itemOpacity: 0.75,
            onClick: this.selectLine,
            symbolSize: 12,
            legendOffset: {
              onMouseEnter: {
                container: {
                  padding: 0,
                },
              },
            },
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [{
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
              },
            }],
          }]}
          isInteractive
          animate
        />
      </div>
    );
  }
}

MultiLinesGraph.propTypes = {
  markers: PropTypes.arrayOf(PropTypes.shape({
    axis: PropTypes.string,
    value: PropTypes.number,
    type: PropTypes.string,
    legendPosition: PropTypes.string,
  })),
  onClickGraphHandler: PropTypes.func.isRequired,
  colors: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.string,
      y: PropTypes.number,
    })),
  })).isRequired,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  yMin: PropTypes.number,
  yMax: PropTypes.number,
  height: PropTypes.number,
  units: PropTypes.string,
};

MultiLinesGraph.defaultProps = {
  markers: [],
  labelX: '',
  labelY: '',
  yMin: 0,
  yMax: 100,
  height: 490,
  units: '',
};

export default MultiLinesGraph;
