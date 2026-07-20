import {
  GRAPHS_EXTENDED_COLOR_PALETTE,
  INITIATIVES_MAP_STATS_BAR_HEIGHT,
  INITIATIVES_MAP_STATS_GRAPH_Y_MARGINS,
} from "@config/monitoring";
import { type BarDatum, ResponsiveBar } from "@nivo/bar";

import { getContrastColor } from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";

export function MonitorignOverviewBars<T extends Record<string, unknown>>({
  data,
  keysForValues,
  keyForLeftAxisLabel,
  bottomAxisLabel,
}: {
  data?: T[];
  keysForValues: (keyof T & string)[];
  keyForLeftAxisLabel: keyof T;
  bottomAxisLabel: string;
}) {
  if (!data) {
    return null;
  }

  const maxDataValue = Math.max(
    ...data.map((d) => Number(d[keysForValues[0]]) || 0),
    0,
  );
  const graphMaxValue = Math.ceil(maxDataValue * 1.1);
  const chartHeight =
    data.length > 0
      ? data.length * INITIATIVES_MAP_STATS_BAR_HEIGHT +
        INITIATIVES_MAP_STATS_GRAPH_Y_MARGINS
      : 200;

  return (
    <div style={{ height: `${chartHeight}px`, width: "100%" }}>
      <ResponsiveBar
        data={data as BarDatum[]}
        keys={keysForValues as string[]}
        valueScale={{
          type: "linear",
          max: graphMaxValue,
        }}
        indexBy={keyForLeftAxisLabel as string}
        layout="horizontal"
        groupMode="grouped"
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelPosition="start"
        labelOffset={10}
        labelTextColor={(bar) => getContrastColor(bar.color)}
        margin={{ top: 20, right: 10, bottom: 40, left: 120 }}
        padding={0.1}
        colorBy="indexValue"
        colors={GRAPHS_EXTENDED_COLOR_PALETTE}
        axisBottom={{
          legend: bottomAxisLabel,
          legendPosition: "middle",
          legendOffset: 30,
          format: (value: number) => (Number.isInteger(value) ? value : ""),
          tickValues: graphMaxValue,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          format: (value) => {
            const text = String(value);
            return text.length > 20 ? `${text.substring(0, 17)}...` : text;
          },
        }}
        tooltip={BarsTooltip}
      />
    </div>
  );
}

function BarsTooltip({
  id: _id,
  value,
  indexValue,
  color,
}: {
  id: string | number;
  value: number;
  indexValue: string | number;
  color: string;
}) {
  return (
    <div
      className="bg-background px-4 py-2 shadow-md rounded text-xs"
      style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span>{indexValue}: </span>
        <span className="font-normal">{value}</span>
      </div>
    </div>
  );
}
