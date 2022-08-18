/* eslint-disable react/prop-types */
import {
  createElement,
  useCallback,
  useMemo,
  React,
} from 'react';

import { useTheme } from '@nivo/core';
import { useTooltip } from '@nivo/tooltip';
import { animated, to } from 'react-spring';

/**
 * Default Bar item from https://github.com/plouc/nivo/blob/v0.79.1/packages/bar/src/BarItem.tsx
 * We created this Item so we could be able to send anchor to showTooltipFromEvent (line 59).
 */
const BarItem = ({
  bar: { data, ...bar },

  style: {
    borderColor,
    color,
    height,
    labelColor,
    labelOpacity,
    labelX,
    labelY,
    transform,
    width,
  },

  borderRadius,
  borderWidth,

  label,
  shouldRenderLabel,

  isInteractive,
  onClick,
  onMouseEnter,
  onMouseLeave,

  tooltip,

  isFocusable,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const theme = useTheme();
  const { showTooltipFromEvent, showTooltipAt, hideTooltip } = useTooltip();

  const renderTooltip = useMemo(
    () => () => createElement(tooltip, { ...bar, ...data }),
    [tooltip, bar, data],
  );

  const handleClick = useCallback(
    (event) => {
      onClick?.({ color: bar.color, ...data }, event);
    },
    [bar, data, onClick],
  );
  const handleTooltip = useCallback(
    (event) => showTooltipFromEvent(renderTooltip(), event, 'right'),
    [showTooltipFromEvent, renderTooltip],
  );
  const handleMouseEnter = useCallback(
    (event) => {
      onMouseEnter?.(data, event);
      showTooltipFromEvent(renderTooltip(), event);
    },
    [data, onMouseEnter, showTooltipFromEvent, renderTooltip],
  );
  const handleMouseLeave = useCallback(
    (event) => {
      onMouseLeave?.(data, event);
      hideTooltip();
    },
    [data, hideTooltip, onMouseLeave],
  );

  // extra handlers to allow keyboard navigation
  const handleFocus = useCallback(() => {
    showTooltipAt(renderTooltip(), [bar.absX + bar.width / 2, bar.absY]);
  }, [showTooltipAt, renderTooltip, bar]);
  const handleBlur = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  return (
    <animated.g transform={transform}>
      <animated.rect
        width={to(width, (value) => Math.max(value, 0))}
        height={to(height, (value) => Math.max(value, 0))}
        rx={borderRadius}
        ry={borderRadius}
        fill={data.fill ?? color}
        strokeWidth={borderWidth}
        stroke={borderColor}
        focusable={isFocusable}
        tabIndex={isFocusable ? 0 : undefined}
        aria-label={ariaLabel ? ariaLabel(data) : undefined}
        aria-labelledby={ariaLabelledBy ? ariaLabelledBy(data) : undefined}
        aria-describedby={ariaDescribedBy ? ariaDescribedBy(data) : undefined}
        onMouseEnter={isInteractive ? handleMouseEnter : undefined}
        onMouseMove={isInteractive ? handleTooltip : undefined}
        onMouseLeave={isInteractive ? handleMouseLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
        onFocus={isInteractive && isFocusable ? handleFocus : undefined}
        onBlur={isInteractive && isFocusable ? handleBlur : undefined}
      />
      {shouldRenderLabel && (
        <animated.text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="central"
          fillOpacity={labelOpacity}
          style={{
            ...theme.labels.text,
            pointerEvents: 'none',
            fill: labelColor,
          }}
        >
          {label}
        </animated.text>
      )}
    </animated.g>
  );
};

export default BarItem;
