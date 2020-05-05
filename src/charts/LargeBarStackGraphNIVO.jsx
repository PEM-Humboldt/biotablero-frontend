import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import DownloadIcon from '@material-ui/icons/Save';
import InfoIcon from '@material-ui/icons/Info';
import ShortInfo from '../commons/ShortInfo';

const LargeBarStackGraphNIVO = (props) => {
  const {
    data,
    graphTitle,
    labelX,
    labelY,
    width,
    height,
    handlerInfoGraph,
    openInfoGraph,
    graphDescription,
    zScale,
  } = props;

  /**
   * Give format to a big number
   *
   * @param {number} x number to be formatted
   */
  const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /**
   * Transform structure of data to be passed to component as a prop
   *
   * @param {array} rawData raw data from RestAPI
   * @param {String} key id for data of each bar o serie
   */
  const transformData = (rawData, key) => {
    const transformedData = {
      key,
    };
    rawData.forEach((item) => {
      transformedData[String(item.key)] = Number(item.area);
    });
    return transformedData;
  };

  const transformedData = [transformData(data, labelY)];
  const keys = data.map(item => String(item.key));

  return (
    <div>
      <h2>
        <DownloadIcon className="icondown" />
        <InfoIcon
          className="graphinfo"
          data-tooltip
          title="¿Qué significa este gráfico?"
          onClick={() => {
            handlerInfoGraph(graphTitle);
          }}
        />
        <div
          className="graphinfo"
          onClick={() => handlerInfoGraph(graphTitle)}
          onKeyPress={() => handlerInfoGraph(graphTitle)}
          role="button"
          tabIndex="0"
        >
          {graphTitle}
        </div>
      </h2>
      {openInfoGraph && (openInfoGraph === graphTitle) && (
        <ShortInfo
          name={graphTitle}
          description={graphDescription}
          className="graphinfo2"
          tooltip="¿Qué significa?"
          customButton
        />
      )}
      <div style={{ width, height }}>
        <ResponsiveBar
          data={transformedData}
          keys={keys}
          indexBy="key"
          layout="horizontal"
          margin={{
            top: 0,
            right: 40,
            bottom: 45,
            left: 40,
          }}
          padding={0.18}
          colors={obj => zScale(parseFloat(obj.id))}
          enableGridX
          borderWidth={0}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 0,
            tickRotation: 0,
            format: '.2s',
            legend: labelX,
            legendPosition: 'middle',
            legendOffset: 25,
          }}
          axisLeft={null}
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
    </div>
  );
};

LargeBarStackGraphNIVO.propTypes = {
  data: PropTypes.array.isRequired,
  graphTitle: PropTypes.string,
  labelX: PropTypes.string,
  labelY: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  handlerInfoGraph: PropTypes.func,
  openInfoGraph: PropTypes.string,
  graphDescription: PropTypes.string,
  zScale: PropTypes.func,
};

LargeBarStackGraphNIVO.defaultProps = {
  graphTitle: '',
  labelX: '',
  labelY: '',
  width: 581,
  height: 150,
  handlerInfoGraph: () => {},
  openInfoGraph: null,
  graphDescription: null,
  zScale: () => {},
};

export default LargeBarStackGraphNIVO;
