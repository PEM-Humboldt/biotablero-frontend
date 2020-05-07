import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';

const LargeBarStackGraphNIVO = (props) => {
  const {
    data,
    labelX,
    labelY,
    width,
    height,
    zScale,
    padding,
  } = props;

  /**
   * Give format to a big number
   *
   * @param {number} x number to be formatted
   * @returns {String} number formatted setting decimals and thousands properly
   */
  const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {array} rawData raw data from RestAPI
   * @param {String} key id for data of each bar o serie
   * @returns {array} transformed data ready to be used by graph component
   */
  const transformData = (rawData, key) => {
    const transformedData = {
      key,
    };
    rawData.forEach((item) => {
      transformedData[String(item.key)] = Number(item.area);
    });
    return [transformedData];
  };

  const keys = data.map(item => String(item.key));

  return (
    <div style={{ width, height }}>
      <ResponsiveBar
        data={transformData(data, labelY)}
        keys={keys}
        indexBy="key"
        layout="horizontal"
        margin={{
          top: 0,
          right: 40,
          bottom: 45,
          left: 40,
        }}
        padding={padding}
        colors={obj => zScale(obj.id)}
        enableGridX
        borderWidth={0}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisLeft={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 0,
          tickRotation: 0,
          format: '.2s',
          legend: labelX,
          legendPosition: 'start',
          legendOffset: 25,
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate
        motionStiffness={90}
        motionDamping={15}
        tooltip={({ id, value, color }) => (
          <div>
            <strong style={{ color }}>
              {id}
            </strong>
            <div style={{ color: '#ffffff' }}>
              {numberWithCommas(Number(value).toFixed(2))}
            </div>
          </div>
        )}
        theme={{
          tooltip: {
            container: {
              background: '#333',
            },
          },
          axis: { legend: { text: { fontSize: '14' } } },
        }}
      />
    </div>
  );
};

LargeBarStackGraphNIVO.propTypes = {
  data: PropTypes.array.isRequired,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  zScale: PropTypes.func,
  padding: PropTypes.number,
};

LargeBarStackGraphNIVO.defaultProps = {
  labelX: '',
  labelY: '',
  width: 581,
  height: 150,
  zScale: () => {},
  padding: 0.25,
};

export default LargeBarStackGraphNIVO;
