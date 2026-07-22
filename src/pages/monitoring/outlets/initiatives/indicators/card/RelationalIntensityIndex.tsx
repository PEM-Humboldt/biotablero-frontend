import { useEffect, useMemo, useState } from "react";

import { type BarDatum, ResponsiveBar } from "@nivo/bar";
import {
  INDICATOR_MAX_COUNT_RELATIONAL_INTENSITY,
  GRAPHS_GRADIENT_COLOR_PALETTE,
} from "@config/monitoring";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import type { BarsData } from "pages/monitoring/types/indicators";
import { GraphInfoSelector } from "pages/monitoring/outlets/initiatives/indicators/card/ui/GraphInfoSelector";
import { getContrastColor } from "pages/monitoring/outlets/initiatives/indicators/card//utils/colors";
import { uiText } from "pages/monitoring/outlets/initiatives/indicators/layout/uiText";

export function RelationalIntensityIndex() {
  const { currentIndicator } = useIndicatorsCTX();

  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const data = currentIndicator?.cleanData as BarsData;

  const { dataByDate, allDates } = useMemo(() => {
    const dataByDate: Record<string, { actor: string; value: number }[]> = {};
    const sortedTime = [...data.keys.dateSorter!.keys()].sort((a, b) => b - a);
    const allDates = sortedTime.map(
      (time) => data.keys.dateSorter?.get(time) ?? "",
    );

    for (const value of data.values) {
      if (!dataByDate[value.date]) {
        dataByDate[value.date] = [];
      }

      dataByDate[value.date].push({ actor: value.name, value: value.value });
    }

    for (const date in dataByDate) {
      const average =
        dataByDate[date].reduce((sum, cur) => sum + cur.value, 0) /
        dataByDate[date].length;

      dataByDate[date].push({
        actor: uiText.indicatorCard.relationalIntensityIndex.averageLabel,
        value: Number(average.toFixed(2)),
      });
    }

    return { dataByDate: dataByDate, allDates };
  }, [data]);

  const handleSelect = (date: string) => {
    if (selectedDates.includes(date)) {
      setSelectedDates((oldDate) => oldDate.filter((d) => d !== date));
      return;
    }

    setSelectedDates((oldDates) => {
      const newList = [...oldDates, date];

      if (newList.length > INDICATOR_MAX_COUNT_RELATIONAL_INTENSITY) {
        newList.shift();
      }
      return allDates.filter((date) => newList.includes(date));
    });
  };

  useEffect(() => {
    if (allDates.length > 0 && selectedDates.length === 0) {
      const preselectAmount = Math.max(
        1,
        Math.min(INDICATOR_MAX_COUNT_RELATIONAL_INTENSITY, allDates.length) - 1,
      );
      setSelectedDates(allDates.slice(0, preselectAmount));
    }
  }, [allDates, selectedDates]);

  return (
    <>
      <div className="p-4 shrink-0 space-y-4 border border-muted mb-0 rounded-lg hover:border-primary/50 transition-colors duration-300">
        <GraphInfoSelector
          uiText={{
            title: uiText.indicatorCard.relationalIntensityIndex.selector.title,
            label: uiText.indicatorCard.relationalIntensityIndex.selector.label,
            instruction:
              allDates.length > INDICATOR_MAX_COUNT_RELATIONAL_INTENSITY
                ? uiText.indicatorCard.relationalIntensityIndex.selector.maxSelection(
                    INDICATOR_MAX_COUNT_RELATIONAL_INTENSITY,
                  )
                : undefined,
          }}
          options={allDates.toReversed()}
          currentSelection={selectedDates}
          singleSelect={false}
          updateCurrent={handleSelect}
        />
      </div>

      <div className="flex w-full h-full aspect-3/2">
        <div className="w-[150px]">
          <ResponsiveBar
            data={
              dataByDate[allDates[0]].map((d) => ({
                ...d,
                value: null,
              })) as unknown as BarDatum[]
            }
            indexBy="actor"
            layout="horizontal"
            margin={{ top: 0, right: 0, bottom: 60, left: 150 }}
            padding={0.4}
            valueScale={{ type: "linear", min: -1.0, max: 1.0 }}
            indexScale={{ type: "band", round: true }}
            colors="transparent"
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={{
              tickSize: 0,
              tickPadding: 10,
              tickRotation: 0,
            }}
            enableGridX={false}
            enableGridY={false}
          />
        </div>

        {selectedDates.toReversed().map((date) => (
          <div
            key={`indicatorSection_${date}`}
            className="flex-1 hover:bg-grey-light rounded"
          >
            <ResponsiveBar
              data={dataByDate[date]}
              keys={["value"]}
              indexBy="actor"
              layout="horizontal"
              margin={{ top: 0, right: 10, bottom: 60, left: 10 }}
              padding={0.2}
              valueScale={{ type: "linear", min: -1.0, max: 1.0 }}
              indexScale={{ type: "band", round: true }}
              colors={(bar) => {
                if (
                  bar.indexValue ===
                  uiText.indicatorCard.relationalIntensityIndex.averageLabel
                ) {
                  return GRAPHS_GRADIENT_COLOR_PALETTE[0];
                }
                return bar.value! >= 0
                  ? GRAPHS_GRADIENT_COLOR_PALETTE[5]
                  : GRAPHS_GRADIENT_COLOR_PALETTE[9];
              }}
              axisTop={null}
              axisRight={null}
              axisLeft={null}
              enableGridX={true}
              enableGridY={true}
              theme={{ grid: { line: { strokeDasharray: "1 1" } } }}
              axisBottom={{
                tickValues: [-1.0, -0.5, 0, 0.5, 1.0],
                legend: date,
                legendPosition: "middle",
                legendOffset: 40,
              }}
              labelSkipWidth={20}
              labelTextColor={(label) => getContrastColor(label.color)}
              markers={[
                {
                  axis: "x",
                  value: 0,
                  lineStyle: { stroke: "#64748b", strokeWidth: 1 },
                },
              ]}
              tooltip={({ value, indexValue, color }) => {
                return (
                  <div
                    className="bg-background px-4 py-2 shadow-md rounded flex flex-col items-center"
                    style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
                  >
                    <div className="flex flex-col text-center text-sm mb-1 *:m-0!">
                      <span className="font-normal">
                        <span
                          className="inline-block w-3 h-3 mr-1 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {indexValue}
                      </span>
                      <span className="text-lg font-normal">{value}</span>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        ))}
      </div>
      <p className="text-sm italic m-0 text-center">
        {uiText.indicatorCard.relationalIntensityIndex.bottomLegend}
      </p>
    </>
  );
}
