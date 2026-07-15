import type { LineCustomSvgLayerProps } from "@nivo/line";
import { area, curveLinear } from "d3-shape";
import type { LineData } from "pages/monitoring/types/indicators";

interface CustomDatum {
  x: string | number;
  y: number;
  hasLimits?: boolean;
  lowerLimit?: number;
  upperLimit?: number;
}

interface ComputedPoint {
  data: CustomDatum;
}

export const ConfidenceIntervalLayer = ({
  series,
  xScale,
  yScale,
}: LineCustomSvgLayerProps<LineData>) => {
  return series.map((s) => {
    const hasLimits = s.data.some((d) => d.data.hasLimits);
    if (!hasLimits) {
      return null;
    }

    const areaGenerator = area<ComputedPoint>()
      .x((d) => xScale(d.data.x as string))
      .y0((d) =>
        yScale(d.data.lowerLimit !== undefined ? d.data.lowerLimit : d.data.y),
      )
      .y1((d) =>
        yScale(d.data.upperLimit !== undefined ? d.data.upperLimit : d.data.y),
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
