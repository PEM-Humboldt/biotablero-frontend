import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import { darkenColor } from 'utils/colorUtils';
import formatNumber from 'utils/format';

class MultiSmallSingleBarGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndexValue: props.selectedIndexValue,
    };
  }

  render() {
    const {
      data,
      height,
      colors,
      units,
      onClickHandler,
      labelX,
    } = this.props;
    const {
      selectedIndexValue,
    } = this.state;

    const transformData = (rawData) => {
      const transformedData = rawData.map((element) => {
        const object = {
          id: String(element.id),
        };
        object[String(element.id)] = Number(element.value);
        object[`${String(element.id)}Label`] = element.name;
        object[`${String(element.id)}Color`] = colors(element.key);
        object[`${String(element.id)}DarkenColor`] = darkenColor(colors(element.key), 15);
        object[`${String(element.id)}Area`] = Number(element.area);
        return object;
      });
      return transformedData;
    };

  /**
   * Get keys to be passed to component as a prop
   *
   * @returns {array} ids of each bar category removing duplicates
   */
    const keys = data ? [...new Set(data.map((item) => String(item.id)))] : [];

    return (
      <div style={{ height }}>
        <ResponsiveBar
          data={transformData(data)}
          keys={keys}
          indexBy="id"
          layout="horizontal"
          margin={{
            top: 20,
            right: 15,
            bottom: 50,
            left: 40,
          }}
          padding={0.35}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          colors={({
            id,
            indexValue,
            data: allData,
          }) => {
            if (indexValue === selectedIndexValue) {
              return allData[`${id}DarkenColor`];
            }
            return allData[`${id}Color`];
          }}
          enableGridY={false}
          enableGridX
          axisLeft={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 0,
            tickRotation: 0,
            format: '.2f',
            legend: labelX,
            legendPosition: 'start',
            legendOffset: 25,
          }}
          enableLabel
          label={({ value }) => formatNumber(value, 2)}
          animate
          motionStiffness={90}
          motionDamping={15}
          tooltip={({ id, data: allData, color }) => (
            <div>
              <strong style={{ color }}>
                {allData[`${id}Label`]}
              </strong>
              <div style={{ color: '#ffffff' }}>
                {formatNumber(allData[id], 2)}
                <br />
                {`${formatNumber(allData[`${id}Area`], 2)} ${units}`}
              </div>
            </div>
          )}
          theme={{
            tooltip: {
              container: {
                background: '#333',
                whiteSpace: 'nowrap',
                position: 'absolute',
                fontSize: 12,
              },
            },
            axis:
              {
                legend: { text: { fontSize: '14' } },
              },
          }}
          onClick={({ indexValue }) => {
            this.setState({ selectedIndexValue: indexValue });
            onClickHandler(indexValue);
          }}
        />
      </div>
    );
  }
}

MultiSmallSingleBarGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    area: PropTypes.number,
  })).isRequired,
  height: PropTypes.number,
  colors: PropTypes.func,
  units: PropTypes.string,
  onClickHandler: PropTypes.func,
  selectedIndexValue: PropTypes.string,
  labelX: PropTypes.string,
};

MultiSmallSingleBarGraph.defaultProps = {
  height: 30,
  colors: () => {},
  units: 'ha',
  onClickHandler: () => {},
  selectedIndexValue: null,
  labelX: '',
};

export default MultiSmallSingleBarGraph;
