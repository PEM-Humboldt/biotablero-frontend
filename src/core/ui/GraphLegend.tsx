import { GRAPHS_EXTENDED_COLOR_PALETTE } from "@config/color";
import { cn } from "@ui/shadCN/lib/utils";
import { hashStringToRange } from "@utils/format";

import { getSeriesColor } from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";

export function GraphLegend({
  keys,
  customColorMap,
  customColorList,
  isBar = true,
  renderValues,
  className,
  onClick,
  selected,
}: {
  keys: string[];
  customColorMap?: Record<string, string>;
  customColorList?: string[];
  isBar?: boolean;
  renderValues?: Record<string, number>;
  className?: string;
  onClick?: (label: string) => void;
  selected?: string[];
}) {
  return (
    <ul
      className={cn("flex flex-wrap justify-end gap-4 text-sm p-4", className)}
    >
      {keys.map((key) => {
        const isSelected = selected?.includes(key) ?? false;

        const color =
          customColorMap?.[key] ??
          getSeriesColor(
            hashStringToRange(
              key,
              customColorList?.length ?? GRAPHS_EXTENDED_COLOR_PALETTE.length,
            ),
            customColorList ?? GRAPHS_EXTENDED_COLOR_PALETTE,
          );

        const content = (
          <>
            <span
              className={cn(
                "relative inline-block w-4 mr-1 shrink-0 rounded-sm",
                isBar
                  ? "h-4"
                  : "h-0.5 before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-inherit",
              )}
              style={{ backgroundColor: color }}
            />
            <span
              className={cn(
                isSelected && "underline underline-offset-4 font-semibold",
              )}
            >
              {key}
              {renderValues && renderValues[key]
                ? ` · ${renderValues[key]}`
                : ""}
            </span>
          </>
        );

        return (
          <li key={`legend_${key}`} className="flex items-center">
            {onClick ? (
              <button
                type="button"
                onClick={() => onClick(key)}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
}
