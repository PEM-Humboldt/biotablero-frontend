import React from "react";
import {
  BulletMarkersItemProps,
  BulletRectsItemProps,
  ResponsiveBullet,
} from "@nivo/bullet";
import { BasicTooltip, useTooltip } from "@nivo/tooltip";
import { animated, to } from "@react-spring/web";
import withMessageWrapper from "pages/search/shared_components/charts/withMessageWrapper";

type colorsFunction = (param: string) => string;
/**
 * Get the key for a value inside an object
 *
 * @param {Object} originalObject Object with key
 * @param {any} value value to find the key for
 *
 * @returns {String} desired key
 */
const findKey = (originalObject: Record<string, number>, value: number) =>
  Object.keys(originalObject).find((key) => originalObject[key] === value);

/**
 * Define display element for a tooltip
 *
 * @param {any} value value to show in tooltip
 * @param {String} color color for he tooltip chip
 * @param {String} label text to be shown at the tooltip
 *
 * @returns Tooltip elemtent
 */
const tooltip = (value: number, color: string, label?: string) => {
  const { showTooltipFromEvent } = useTooltip();
  return (event: React.MouseEvent<Element, MouseEvent>) => {
    showTooltipFromEvent(
      <BasicTooltip
        id={
          <div className="bulletTooltip">
            {label ? (
              <>
                {label} <br />
              </>
            ) : (
              <></>
            )}
            <strong>{value}</strong>
          </div>
        }
        enableChip
        color={color}
      />,
      event,
      "right"
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
const LineMeasureWrap = (
  origMeasures: Record<string, number>,
  colors: colorsFunction,
  reverse: boolean,
  labels?: Record<string, string>
) => {
  /**
   * Custom component to display bullet measures as lines (like markers)
   *
   * @param {Object} props see: https://github.com/plouc/nivo/blob/master/packages/bullet/src/types.ts#L99
   *
   * @returns React component
   */
  const LineMeasure: React.FC<BulletRectsItemProps> = (props) => {
    const {
      animatedProps: { x, width },
      data,
      onMouseLeave,
    } = props;
    const measureKey = findKey(origMeasures, data.v1) || "";
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
        strokeWidth={3}
        onMouseEnter={tooltip(
          data.v1,
          colors(measureKey),
          labels?.[measureKey]
        )}
        onMouseLeave={(event: unknown) =>
          onMouseLeave(
            data,
            event as React.MouseEvent<SVGRectElement, MouseEvent>
          )
        }
      />
    );
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
const CircleMarkerWrap = (
  origMarkers: Record<string, number>,
  colors: colorsFunction,
  labels?: Record<string, string>
) => {
  /**
   * Custom component to display bullet markers as circles
   *
   * @param {Object} props see: https://github.com/plouc/nivo/blob/master/packages/bullet/src/types.ts#L112
   *
   * @returns React component
   */
  const CircleMarker: React.FC<BulletMarkersItemProps> = (props) => {
    const { x, y, data, onMouseLeave } = props;
    const markerKey = findKey(origMarkers, data.value) || "";

    return (
      <g
        transform={`translate(${x},0)`}
        onMouseEnter={tooltip(
          data.value,
          colors(markerKey),
          labels?.[markerKey]
        )}
        onMouseLeave={(event: unknown) =>
          onMouseLeave(
            data,
            event as React.MouseEvent<SVGLineElement, MouseEvent>
          )
        }
      >
        <circle cx={0} cy={y} r={6} fill={colors(markerKey)} />
      </g>
    );
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
const NoTooltipRangeWrap = (
  origRanges: Record<string, number>,
  colors: colorsFunction
) => {
  /**
   * Custom component to display bullet range without tooltip
   *
   * @param {Object} props see: https://github.com/plouc/nivo/blob/master/packages/bullet/src/types.ts#L99
   *
   * @returns React component
   */
  const NoTooltipRange: React.FC<BulletRectsItemProps> = (props) => {
    const {
      animatedProps: { x, y, width, height },
      data,
      onClick,
    } = props;
    const rangeKey = findKey(origRanges, data.v1) || "";

    return (
      <animated.rect
        x={x}
        y={y}
        rx={5}
        width={to(width, (value) => Math.max(value, 0))}
        height={to(height, (value) => Math.max(value, 0))}
        fill={colors(rangeKey)}
        onClick={(event) => onClick(data, event)} //REVISAR
      />
    );
  };

  return NoTooltipRange;
};

interface BulletProps {
  data: BulletData | null;
  height?: number;
  colors: colorsFunction;
  onClickHandler: () => void;
  reverse?: boolean;
  labelXRight?: string;
  labelXLeft?: string;
}

interface BulletData {
  id: string;
  ranges: Record<string, number>;
  markers: Record<string, number>;
  measures: Record<string, number>;
  labels?: {
    markers: Record<string, string>;
    measures: Record<string, string>;
  };
  title: string;
}

/**
 * Important: measures and markers are inverted with respect to nivo documentation
 */
const SingleBullet: React.FC<BulletProps> = (props) => {
  const {
    height = 62,
    data,
    colors,
    onClickHandler,
    reverse = false,
    labelXRight = "",
    labelXLeft = "",
  } = props;

  if (data === null) {
    return <></>;
  }
  return (
    <div style={{ height }}>
      <ResponsiveBullet
        data={[
          {
            ...data,
            measures: Object.values(data.measures),
            markers: Object.values(data.markers),
            ranges: Object.values(data.ranges),
          },
        ]}
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
        measureComponent={LineMeasureWrap(
          data.measures,
          colors,
          reverse,
          data.labels?.measures
        )}
        markerComponent={CircleMarkerWrap(
          data.markers,
          colors,
          data.labels?.markers
        )}
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

export default withMessageWrapper<BulletProps>(SingleBullet);
