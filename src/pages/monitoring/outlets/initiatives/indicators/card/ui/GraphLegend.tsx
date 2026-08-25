import { GRAPHS_EXTENDED_COLOR_PALETTE } from "@config/color";
import { cn } from "@ui/shadCN/lib/utils";
import { hashStringToRange } from "@utils/format";

import { getSeriesColor } from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";

export function GraphLegend({
  keys,
  customColorMap,
  customColorList,
  isBar = true,
}: {
  keys: string[];
  customColorMap?: Record<string, string>;
  customColorList?: string[];
  isBar?: boolean;
}) {
  return (
    <ul className="flex flex-wrap justify-end gap-4 text-sm p-4">
      {keys.map((key) => {
        const color =
          customColorMap?.[key] ??
          getSeriesColor(
            hashStringToRange(
              key,
              customColorList?.length ?? GRAPHS_EXTENDED_COLOR_PALETTE.length,
            ),
            customColorList ?? GRAPHS_EXTENDED_COLOR_PALETTE,
          );

        return (
          <li key={`legend_${key}`} className="flex items-center">
            <span
              className={cn(
                "relative inline-block w-4 mr-1 shrink-0 rounded-sm",
                isBar
                  ? "h-4"
                  : "h-0.5 before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-inherit",
              )}
              style={{ backgroundColor: color }}
            />
            <span>{key}</span>
          </li>
        );
      })}
    </ul>
  );
}
