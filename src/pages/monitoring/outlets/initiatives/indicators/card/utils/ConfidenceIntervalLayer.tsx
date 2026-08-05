import type { InferX, InferY, LineCustomSvgLayerProps } from "@nivo/line";
import { area, curveLinear } from "d3-shape";
import type {
  LineData,
  LineDataValues,
} from "pages/monitoring/types/indicators";

interface ComputedPoint {
  data: LineDataValues;
}

/**
 * A custom SVG layer for Nivo's Line chart that renders a confidence interval area
 * (shaded region) beneath the main line.
 *
 * @param props - The properties injected by the Nivo ResponsiveLine component.
 * @param props.series - The computed line series data, typed strictly using the `LineData` schema.
 * @param props.xScale - The D3 scale function to map data X-values to coordinate pixels.
 * @param props.yScale - The D3 scale function to map data Y-values to coordinate pixels.
 *
 * @returns An array of SVG `path` elements representing the confidence intervals for
 * active series, or `null` for series where no limits are defined.
 */
export const ConfidenceIntervalLayer = <T extends LineData>({
  series,
  xScale,
  yScale,
}: LineCustomSvgLayerProps<T>) => {
  return series.map((s) => {
    const hasLimits = s.data.some((d) => d.data.hasLimits);
    if (!hasLimits) {
      return null;
    }

    const areaGenerator = area<ComputedPoint>()
      .x((d) => xScale(d.data.x as InferX<T>))
      .y0((d) =>
        yScale(
          (d.data.lowerLimit !== undefined
            ? d.data.lowerLimit
            : d.data.y) as InferY<T>,
        ),
      )
      .y1((d) =>
        yScale(
          (d.data.upperLimit !== undefined
            ? d.data.upperLimit
            : d.data.y) as InferY<T>,
        ),
      )
      .curve(curveLinear);

    return (
      <path
        key={`${s.id}-ci`}
        d={areaGenerator(s.data) || undefined}
        fill={s.color}
        fillOpacity={0.2}
      />
    );
  });
};
