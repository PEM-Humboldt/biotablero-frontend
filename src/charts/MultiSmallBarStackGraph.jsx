import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import formatNumber from '../commons/format';

class MultiSmallBarStackGraph extends React.Component {
  render() {
    const {
      data,
      height,
      colors,
      units,
      onClickHandler,
    } = this.props;

    /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {array} rawData raw data from RestAPI
   * @returns {array} transformed data ready to be used by graph component
   */
    const transformData = (rawData) => {
      const transformedData = rawData.map((element) => {
        const object = {
          key: String(element.id),
        };
        element.data.forEach((item) => {
          object[String(item.key)] = Number(item.area);
          object[`${String(item.key)}Color`] = colors(item.key);
          object[`${String(item.key)}Label`] = item.label;
          object[`${String(item.key)}Percentage`] = Number(item.percentage);
        });
        return object;
      });
      return transformedData;
    };

    /**
   * Get keys to be passed to component as a prop
   *
   * @returns {array} ids of each bar category
   */
    const keys = data[0] ? data[0].data.map(item => String(item.key)) : [];

    return (
      <div style={{ height }}>
        <ResponsiveBar
          data={transformData(data)}
          keys={keys}
          indexBy="key"
          layout="horizontal"
          margin={{
            top: 20,
            right: 15,
            bottom: 50,
            left: 90,
          }}
          padding={0.35}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          colors={({ id, data: allData }) => allData[`${id}Color`]}
          enableGridY={false}
          enableGridX
          axisLeft={{
            tickSize: 3,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Periodo',
            legendPosition: 'middle',
            legendOffset: -80,
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 0,
            tickRotation: 0,
            format: '.2s',
            legend: 'Hectáreas',
            legendPosition: 'start',
            legendOffset: 25,
          }}
          enableLabel={false}
          animate
          motionStiffness={90}
          motionDamping={15}
          tooltip={({ id, data: allData, color }) => (
            <div>
              <strong style={{ color }}>
                {allData[`${id}Label`]}
              </strong>
              <div style={{ color: '#ffffff' }}>
                {`${formatNumber(allData[id], 0)} ${units}`}
              </div>
            </div>
          )}
          theme={{
            tooltip: {
              container: {
                background: '#333',
              },
            },
            axis:
              {
                legend: { text: { fontSize: '14' } },
              },
          }}
          onClick={({ indexValue }) => {
            onClickHandler(indexValue);
          }}
        />
      </div>
    );
  }
}

MultiSmallBarStackGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      area: PropTypes.number.isRequired,
      key: PropTypes.string,
      percentage: PropTypes.number,
      label: PropTypes.string,
    })).isRequired,
  })).isRequired,
  height: PropTypes.number,
  colors: PropTypes.func,
  units: PropTypes.string,
  onClickHandler: PropTypes.func,
};

MultiSmallBarStackGraph.defaultProps = {
  height: 30,
  colors: () => {},
  units: 'ha',
  onClickHandler: () => {},
};

export default MultiSmallBarStackGraph;
