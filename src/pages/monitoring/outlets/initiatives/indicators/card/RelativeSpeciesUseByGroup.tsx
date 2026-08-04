import { useEffect, useMemo, useState } from "react";

import { GRAPHS_EXTENDED_COLOR_PALETTE } from "@config/monitoring";
import { ResponsiveBar } from "@nivo/bar";
import { hashStringToRange } from "@utils/format";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { type BarsData } from "pages/monitoring/types/indicators";
import {
  getContrastColor,
  getSeriesColor,
} from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";
import { BarsLegend } from "pages/monitoring/outlets/initiatives/indicators/card/ui/BarsLegend";
import { GraphInfoSelector } from "pages/monitoring/outlets/initiatives/indicators/card/ui/GraphInfoSelector";
import { uiText } from "pages/monitoring/outlets/initiatives/indicators/layout/uiText";

export function RelativeSpeciesUseByGroup() {
  const { currentIndicator } = useIndicatorsCTX();
  const data = currentIndicator?.cleanData as BarsData;

  const groupsList = useMemo(() => [...(data.keys.parent ?? [])], [data]);
  const [selectedParent, setSelectedParent] = useState("");

  useEffect(() => {
    setSelectedParent(groupsList[0]);
  }, [groupsList]);

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
      <div className="p-4 shrink-0 space-y-4 border border-muted mb-0 rounded-lg hover:border-primary/50 transition-colors duration-300">
        <GraphInfoSelector
          uiText={uiText.indicatorCard.relativeSpeciesUseByGroup.selector}
          options={groupsList}
          currentSelection={selectedParent}
          updateCurrent={setSelectedParent}
        />
      </div>

      <div className="w-full h-full aspect-3/2">
        <ResponsiveBar
          data={displayData}
          keys={displayKeys}
          indexBy="date"
          layout="horizontal"
          margin={{ top: 0, right: 30, bottom: 30, left: 120 }}
          padding={0.1}
          colors={(bar) =>
            getSeriesColor(
              hashStringToRange(
                String(bar.id),
                GRAPHS_EXTENDED_COLOR_PALETTE.length,
              ),
              GRAPHS_EXTENDED_COLOR_PALETTE,
            )
          }
          enableGridX={true}
          enableGridY={false}
          theme={{ grid: { line: { strokeDasharray: "1 1" } } }}
          valueScale={{ type: "linear", min: 0, max: 100 }}
          axisBottom={{
            tickValues: [0, 20, 40, 60, 80, 100],
            format: (v) => `${v}%`,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={(bar) => getContrastColor(bar.color)}
          valueFormat={(v) => `${Number(v.toFixed(1))}%`}
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
                  <span className="text-lg font-normal">{bar.value}%</span>
                  <span className="italic">{bar.indexValue}</span>
                </div>
              </div>
            );
          }}
        />
      </div>

      <BarsLegend keys={displayKeys} />
    </>
  );
}
