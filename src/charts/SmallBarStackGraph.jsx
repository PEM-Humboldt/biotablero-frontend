import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import formatNumber from '../commons/format';

const SmallBarStackGraph = (props) => {
  const {
    data,
    height,
    colors,
    units,
  } = props;

  /**
   * Transform data structure to be passed to component as a prop
   *
   * @param {array} rawData raw data from RestAPI
   * @returns {array} transformed data ready to be used by graph component
   */
  const transformData = (rawData) => {
    const transformedData = {
      key: 'key',
    };
    rawData.forEach((item) => {
      transformedData[String(item.key)] = Number(item.area || item.percentage);
      transformedData[`${String(item.key)}Color`] = colors(item.key);
      transformedData[`${String(item.key)}Label`] = item.label;
      if (item.percentage) {
        transformedData[`${String(item.key)}Percentage`] = Number(item.percentage);
      }
    });
    return [transformedData];
  };

  /**
   * Get keys to be passed to component as a prop
   *
   * @returns {array} ids of each bar
   */
  const keys = data.map(item => String(item.key));

  /**
   * Get tooltip for graph component according to id of bar
   *
   * @param {string} id id for each bar
   * @param {Object} allData transformed data with all information needed
   * @returns {func} tooltip for component
   */
  const getToolTip = (id, allData) => {
    if (id !== 'NA') {
      return (
        <div style={{
          backgroundColor: '#333',
          color: '#ffffff',
          padding: '5px 10px',
          lineHeight: '1.5',
          borderRadius: 5,
          minWidth: 60,
          boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
        }}
        >
          <strong style={{ color: '#e84a5f' }}>
            {(id !== 'undefined') ? allData[`${id}Label`] : ''}
          </strong>
          <div>
            {`${formatNumber(allData[id], 0)} ${units}`}
            <br />
            {`${formatNumber(allData[`${id}Percentage`] * 100, 0)}%`}
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: 'none' }} />
    );
  };

  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={transformData(data)}
        keys={keys}
        indexBy="key"
        layout="horizontal"
        margin={{
          top: 0,
          right: 5,
          bottom: 0,
          left: 5,
        }}
        padding={0.19}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        colors={({ id, data: allData }) => allData[`${id}Color`]}
        enableGridY={false}
        axisLeft={null}
        enableLabel={false}
        animate
        motionStiffness={90}
        motionDamping={15}
        tooltip={({ id, data: allData }) => getToolTip(id, allData)}
        theme={{
          tooltip: {
            container: {
              padding: 0,
            },
          },
        }
        }
      />
    </div>
  );
};

SmallBarStackGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    area: PropTypes.number.isRequired,
    percentage: PropTypes.number,
    label: PropTypes.string,
  })).isRequired,
  height: PropTypes.number,
  colors: PropTypes.func,
  units: PropTypes.string,
};

SmallBarStackGraph.defaultProps = {
  height: 30,
  colors: () => {},
  units: 'ha',
};

export default SmallBarStackGraph;
