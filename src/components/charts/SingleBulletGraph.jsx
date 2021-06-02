import PropTypes from 'prop-types';
import React from 'react';
import { ResponsiveBullet } from '@nivo/bullet';
import { BasicTooltip, useTooltip } from '@nivo/tooltip';
import { animated, to } from 'react-spring';

/**
 * Get the key for a value inside an object
 *
 * @param {Object} originalObject Object with key
 * @param {any} value value to find the key for
 *
 * @returns {String} desired key
 */
const findKey = (originalObject, value) => (
  Object.keys(originalObject).find(
    (key) => originalObject[key] === value,
  )
);

/**
 * Define display element for a tooltip
 *
 * @param {any} value value to show in tooltip
 * @param {String} color color for he tooltip chip
 *
 * @returns Tooltip elemtent
 */
const tooltip = (value, color) => {
  const { showTooltipFromEvent } = useTooltip();
  return (event) => {
    showTooltipFromEvent(
      <BasicTooltip
        id={<strong>{value}</strong>}
        enableChip
        color={color}
      />,
      event,
    );
  };
};

/**
 * Wrapper to allow custom measure component to access original key data and custom colors
 *
 * @param {Object} origMeasures keys for measure values
 * @param {Function} colors function to calculate color based on the key
 * @param {Boolean} reverse to specify if the chart is reversed
 *
 * @returns Functional component for a measure in form of a line
 */
const LineMeasureWrap = (origMeasures, colors, reverse = false) => {
  /**
   * Custom component to display bullet measures as lines (like markers)
   *
   * @param {Object} props see: https://github.com/plouc/nivo/blob/master/packages/bullet/src/types.ts#L99
   *
   * @returns React component
   */
  const LineMeasure = (props) => {
    const {
      animatedProps: {
        x,
        width,
      },
      data,
      onMouseLeave,
    } = props;
    const measureKey = findKey(origMeasures, data.v1);
    const xVal = to([x, width], (vx, vw) => {
      if (reverse) return vx;
      return vx + vw;
    });
    return (
      <animated.line
        x1={xVal}
        x2={xVal}
        y1={-10}
        y2={20}
        stroke={colors(measureKey)}
        strokeWidth={2}
        onMouseEnter={tooltip(data.v1, colors(measureKey))}
        onMouseLeave={onMouseLeave}
      />
    );
  };

  LineMeasure.propTypes = {
    animatedProps: PropTypes.shape({
      x: PropTypes.object.isRequired,
      width: PropTypes.object.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      v1: PropTypes.number.isRequired,
    }).isRequired,
    onMouseLeave: PropTypes.func.isRequired,
  };

  return LineMeasure;
};

/**
 * Wrapper to allow custom marker component to access original key data and custom colors
 *
 * @param {Object} origMarkers keys for marker values
 * @param {Function} colors function to calculate color based on the key
 *
 * @returns Functional component for a marker in form of a circle
 */
const CircleMarkerWrap = (origMarkers, colors) => {
  /**
   * Custom component to display bullet markers as circles
   *
   * @param {Object} props see: https://github.com/plouc/nivo/blob/master/packages/bullet/src/types.ts#L112
   *
   * @returns React component
   */
  const CircleMarker = (props) => {
    const {
      x,
      y,
      data,
      value,
      onMouseLeave,
    } = props;
    const markerKey = findKey(origMarkers, value);

    return (
      <g
        transform={`translate(${x},0)`}
        onMouseEnter={tooltip(value, colors(markerKey))}
        onMouseLeave={(event) => onMouseLeave(data, event)}
      >
        <circle
          cx={0}
          cy={y}
          r={6}
          fill={colors(markerKey)}
        />
      </g>
    );
  };

  CircleMarker.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
  };

  return CircleMarker;
};

/**
 * Wrapper to allow custom Range component to access original key data and custom colors
 *
 * @param {Object} origRanges keys for ranges values
 * @param {Function} colors function to calculate color based on the key
 *
 * @returns Functional component for a range without tooltip
 */
 const NoTooltipRangeWrap = (origRanges, colors) => {
  /**
   * Custom component to display bullet range without tooltip
   *
   * @param {Object} props see: https://github.com/plouc/nivo/blob/master/packages/bullet/src/types.ts#L99
   *
   * @returns React component
   */
  const NoTooltipRange = (props) => {
    const {
      animatedProps: {
        x,
        y,
        width,
        height,
      },
      data,
      onClick,
    } = props;
    const rangeKey = findKey(origRanges, data.v1);

    return (
      <animated.rect
        x={x}
        y={y}
        rx={5}
        width={to(width, (value) => Math.max(value, 0))}
        height={to(height, (value) => Math.max(value, 0))}
        fill={colors(rangeKey)}
        onClick={onClick}
      />
    );
  };

  NoTooltipRange.propTypes = {
    animatedProps: PropTypes.shape({
      x: PropTypes.object.isRequired,
      y: PropTypes.object.isRequired,
      width: PropTypes.object.isRequired,
      height: PropTypes.object.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      v1: PropTypes.number.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
  };

  return NoTooltipRange;
};

/**
 * Important: measures and markers are inverted with respect to nivo documentation
 */
const SingleBulletGraph = (props) => {
  const {
    height,
    data,
    colors,
    onClickHandler,
    reverse,
    labelXRight,
    labelXLeft,
  } = props;
  return (
    <div style={{ height, paddingBottom: '20px' }}>
      <ResponsiveBullet
        data={[{
          ...data,
          measures: Object.values(data.measures),
          markers: Object.values(data.markers),
          ranges: Object.values(data.ranges),
        }]}
        margin={{
          top: 5,
          right: 30,
          bottom: 32,
          left: 30,
        }}
        spacing={52}
        titleAlign="start"
        titleOffsetX={0}
        titleOffsetY={-30}
        rangeComponent={NoTooltipRangeWrap(data.ranges, colors)}
        measureComponent={LineMeasureWrap(data.measures, colors, reverse)}
        markerComponent={CircleMarkerWrap(data.markers, colors)}
        isInteractive
        reverse={reverse}
        onRangeClick={onClickHandler}
      />
      {(labelXRight || labelXLeft) && (
        <div className="extraLegend">
          <p>{labelXLeft}</p>
          <p>{labelXRight}</p>
        </div>
      )}
    </div>
  );
};

SingleBulletGraph.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    ranges: PropTypes.shape({
      area: PropTypes.number.isRequired,
      region: PropTypes.number.isRequired,
    }).isRequired,
    markers: PropTypes.shape({
      inferred: PropTypes.number.isRequired,
      observed: PropTypes.number.isRequired,
    }).isRequired,
    measures: PropTypes.shape({
      min_inferred: PropTypes.number.isRequired,
      min_observed: PropTypes.number.isRequired,
      max_inferred: PropTypes.number.isRequired,
      max_observed: PropTypes.number.isRequired,
    }).isRequired,
    title: PropTypes.string,
  }).isRequired,
  height: PropTypes.number,
  colors: PropTypes.func.isRequired,
  onClickHandler: PropTypes.func,
  reverse: PropTypes.bool,
  labelXRight: PropTypes.string,
  labelXLeft: PropTypes.string,
};

SingleBulletGraph.defaultProps = {
  height: 100,
  onClickHandler: () => {},
  reverse: false,
  labelXRight: null,
  labelXLeft: null,
};

export default SingleBulletGraph;
