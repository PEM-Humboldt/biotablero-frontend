import { GRAPHS_EXTENDED_COLOR_PALETTE } from "@config/color";
import { hashStringToRange } from "@utils/format";

import { getSeriesColor } from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";

export function BarsLegend({
  keys,
  customColorMap,
}: {
  keys: string[];
  customColorMap?: Record<string, string>;
}) {
  return (
    <ul className="flex flex-wrap justify-end gap-4 text-sm p-4">
      {[...new Set(keys)].map((key) => {
        const color =
          customColorMap?.[key] ??
          getSeriesColor(
            hashStringToRange(key, GRAPHS_EXTENDED_COLOR_PALETTE.length),
            GRAPHS_EXTENDED_COLOR_PALETTE,
          );

        return (
          <li key={`legend_${key}`} className="flex items-center">
            <span
              className="inline-block w-4 h-4 mr-1 shrink-0 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span>{key}</span>
          </li>
        );
      })}
    </ul>
  );
}
