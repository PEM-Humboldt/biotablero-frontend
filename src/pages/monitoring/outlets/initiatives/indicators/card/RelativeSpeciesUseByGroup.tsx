import {
  INITIATIVES_MAP_STATS_GRAPH_COLORS,
  INITIATIVES_MAP_STATS_GRAPH_CONTRAST_MAP,
} from "@config/monitoring";
import { ResponsiveBar } from "@nivo/bar";
import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { cn } from "@ui/shadCN/lib/utils";
import { useMemo, useState } from "react";
import { type BarsData } from "pages/monitoring/types/indicators";

export function RelativeSpeciesUseByGroup() {
  const { currentIndicator } = useIndicatorsCTX();
  const data = currentIndicator?.cleanData as BarsData;

  const groupsList = useMemo(() => [...(data.keys.parent ?? [])], [data]);
  const [selectedParent, setSelectedParent] = useState(groupsList[0]);

  const { displayKeys, displayData } = useMemo(() => {
    if (!data) {
      return { displayKeys: [], displayData: [] };
    }

    const keys = new Set<string>();
    const dataByDate: Record<string, Record<string, number | string>> = {};

    for (const value of data.values) {
      if (value.parent !== selectedParent) {
        continue;
      }

      keys.add(value.name);

      if (!dataByDate[value.date]) {
        dataByDate[value.date] = { date: value.date };
      }

      dataByDate[value.date][value.name] = value.value;
    }

    return {
      displayKeys: [...keys],
      displayData: Object.values(dataByDate),
    };
  }, [data, selectedParent]);

  return (
    <>
      <div className="p-2 shrink-0 space-y-2">
        <div title="Selecciona un grupo">
          <h4 className="m-0 text-base text-primary">Grupos</h4>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 max-h-20 overflow-y-auto pr-2 scrollbar-custom">
            {(groupsList ?? []).map((group) => {
              const groupName = group;
              const isSelected = groupName === selectedParent;

              return (
                <li key={`selectorBtn_${groupName}`}>
                  <button
                    className={cn(
                      "text-background min-w-[150px] w-full px-2 py-1 border rounded-lg transition-colors duration-300 text-base font-normal",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground bg-background! hover:cursor-pointer",
                    )}
                    onClick={() => setSelectedParent(groupName)}
                    aria-pressed={isSelected}
                    disabled={isSelected}
                  >
                    {groupName}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="relative w-full h-full min-h-[200px]">
        <ResponsiveBar
          data={displayData}
          keys={displayKeys}
          indexBy="date"
          layout="horizontal"
          margin={{ top: 0, right: 30, bottom: 65, left: 120 }}
          padding={0.1}
          valueScale={{ type: "linear" }}
          colors={INITIATIVES_MAP_STATS_GRAPH_COLORS}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={(bar) =>
            INITIATIVES_MAP_STATS_GRAPH_CONTRAST_MAP[bar.color.toLowerCase()] ||
            "#111111"
          }
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom",
              direction: "row",
              translateY: 60,
              itemWidth: 150,
              itemHeight: 20,
              itemDirection: "left-to-right",
            },
          ]}
          tooltip={(bar) => {
            return (
              <div
                className="bg-background px-4 py-2 shadow-md rounded flex flex-col items-center"
                style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
              >
                <div className="flex flex-col text-center text-sm mb-1 *:m-0!">
                  <span className="font-normal">
                    <span
                      className="inline-block w-3 h-3 mr-1 rounded-full"
                      style={{ backgroundColor: bar.color }}
                    />
                    {bar.id}
                  </span>
                  <span className="text-lg font-normal">{bar.value}</span>
                  <span className="italic">{bar.indexValue}</span>
                </div>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
