import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import formatNumber from '../commons/format';

const darkColors = {
  '#003d59': '#003d59',
  '#5a1d44': '#5a1d44',
  '#902130': '#902130',
};

const LargeBarStackGraph = (props) => {
  const {
    data,
    labelX,
    labelY,
    height,
    colors,
    padding,
    units,
    onClickGraphHandler,
  } = props;

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
      transformedData[String(item.key)] = Number(item.area || item.percentage);
      transformedData[`${String(item.key)}Color`] = colors(item.key);
      transformedData[`${String(item.key)}Label`] = item.label;
      transformedData[`${String(item.key)}Percentage`] = Number(item.percentage);
    });
    return [transformedData];
  };

  const keys = data.map((item) => String(item.key));

  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={transformData(data, labelY)}
        onClick={(category) => onClickGraphHandler(category.id)}
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
        colors={(obj) => colors(obj.id)}
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
        tooltip={({ id, data: allData, color }) => (
          <div>
            <strong style={{ color: darkColors[color] ? '#ffffff' : color }}>
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
          axis: { legend: { text: { fontSize: '14' } } },
        }}
      />
    </div>
  );
};

LargeBarStackGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    area: PropTypes.number.isRequired,
    percentage: PropTypes.number,
    label: PropTypes.string.isRequired,
  })).isRequired,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  height: PropTypes.number,
  colors: PropTypes.func,
  padding: PropTypes.number,
  units: PropTypes.string,
  onClickGraphHandler: PropTypes.func.isRequired,
};

LargeBarStackGraph.defaultProps = {
  labelX: '',
  labelY: '',
  height: 150,
  colors: () => {},
  padding: 0.25,
  units: 'ha',
};

export default LargeBarStackGraph;
