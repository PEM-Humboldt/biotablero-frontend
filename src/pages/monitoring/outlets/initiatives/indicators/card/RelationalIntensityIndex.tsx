import { type BarDatum, ResponsiveBar } from "@nivo/bar";
import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@ui/shadCN/lib/utils";
import {
  INDICATOR_MAX_COUNT_RELATIONAL_INTENSITY,
  INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD,
  INITIATIVES_MAP_STATS_GRAPH_CONTRAST_MAP,
} from "@config/monitoring";
import type { BarsData } from "pages/monitoring/types/indicators";

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
        actor: "Promedio poderado",
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
      <div className="p-2 shrink-0 space-y-2">
        <div title="Selecciona un grupo">
          <h4 className="m-0 text-base/2 text-primary">Periodo</h4>
          {allDates.length > INDICATOR_MAX_COUNT_RELATIONAL_INTENSITY && (
            <span className="italic text-sm m-0">
              selecciona hasta {INDICATOR_MAX_COUNT_RELATIONAL_INTENSITY}
            </span>
          )}
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 max-h-20 overflow-y-auto mt-1 pr-2 scrollbar-custom">
            {allDates.toReversed().map((group) => {
              const isSelected = selectedDates.includes(group);

              return (
                <li key={`selectorBtn_${group}`}>
                  <button
                    className={cn(
                      "text-background w-full px-2 py-1 border rounded-lg transition-colors duration-300 text-base font-normal",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground bg-background! hover:cursor-pointer",
                    )}
                    onClick={() => handleSelect(group)}
                    aria-pressed={isSelected}
                  >
                    {group}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="relative flex w-full h-full min-h-[200px]">
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
                if (bar.indexValue === "Promedio ponderado") {
                  return INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[0];
                }
                return bar.value! >= 0
                  ? INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[5]
                  : INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[9];
              }}
              axisTop={null}
              axisRight={null}
              axisLeft={null}
              axisBottom={{
                tickValues: [-1.0, -0.5, 0, 0.5, 1.0],
                legend: date,
                legendPosition: "middle",
                legendOffset: 40,
              }}
              labelSkipWidth={20}
              labelTextColor={(label) => {
                if (label.data.indexValue === "Promedio ponderado") {
                  return INITIATIVES_MAP_STATS_GRAPH_CONTRAST_MAP[
                    INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[0]
                  ];
                }
                return label.data.value >= 0
                  ? INITIATIVES_MAP_STATS_GRAPH_CONTRAST_MAP[
                      INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[5]
                    ]
                  : INITIATIVES_MAP_STATS_GRAPH_CONTRAST_MAP[
                      INITIATIVES_MAP_STATS_GRAPH_COLORS_GRAD[9]
                    ];
              }}
              valueFormat=">-.2f"
              theme={{
                grid: {
                  line: {
                    stroke: "#bbb",
                    strokeDasharray: "1 1",
                    strokeWidth: "0.5",
                  },
                },
              }}
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
        Linea central= relación neutra · Barra a la derecha= relación
        colaborativa · Barra a la izquierda= relación conflictiva
      </p>
    </>
  );
}
