import { ResponsiveBar } from "@nivo/bar";
import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import type { BarsData } from "pages/monitoring/types/indicators";
import { useMemo, useState } from "react";
import { cn } from "@ui/shadCN/lib/utils";

const colorMap: Record<string, string> = {
  Mujeres: "#99d3ba",
  Hombres: "#115f69",
  "Otras identidades": "#e6cd98",
  "Jóvenes (14-28)": "#2e2d62",
  "Jóvenes adultos (29-40)": "#e89c1e",
  "Adultos (41-59)": "#239498",
  "Adultos mayores (60+)": "#9a3811",
};
const contrastColorMap: Record<string, string> = {
  Mujeres: "#000000",
  Hombres: "#FFFFFF",
  "Otras identidades": "#000000",
  "Jóvenes (14-28)": "#FFFFFF",
  "Jóvenes adultos (29-40)": "#000000",
  "Adultos (41-59)": "#FFFFFF",
  "Adultos mayores (60+)": "#FFFFFF",
};

export function CollectiveActionParticipation() {
  const { currentIndicator } = useIndicatorsCTX();
  const data = currentIndicator?.cleanData as BarsData;

  const { groups, keysByGroup, dataByDateByGroup } = useMemo(() => {
    const keysByGroup = new Map<string, Set<string>>();
    const dataByDateByGroup = new Map<
      string,
      Map<string, Record<string, string | number>>
    >();

    if (!data) {
      return { groups: [], keysByGroup, dataByDateByGroup };
    }

    for (const value of data.values) {
      const keyGroup = keysByGroup.get(value.parent) ?? new Set<string>();
      keyGroup.add(value.name);
      keysByGroup.set(value.parent, keyGroup);

      const datesMap =
        dataByDateByGroup.get(value.parent) ??
        new Map<string, Record<string, string | number>>();
      const dataMap = datesMap.get(value.date) ?? {};

      dataMap[value.name] = value.value;
      if (dataMap["total"] === undefined) {
        dataMap["total"] = 0;
      }
      dataMap["total"] = (dataMap["total"] as number) + value.value;
      dataMap["date"] = value.date;

      datesMap.set(value.date, dataMap);
      dataByDateByGroup.set(value.parent, datesMap);
    }

    dataByDateByGroup.forEach((datesMap, parentKey) => {
      datesMap.forEach((dataMap) => {
        const total = dataMap["total"] as number;

        if (total > 0) {
          const actorKeys = keysByGroup.get(parentKey);

          if (actorKeys) {
            actorKeys.forEach((name) => {
              if (
                name !== "total" &&
                dataMap[name] !== undefined &&
                typeof dataMap[name] === "number"
              ) {
                const currentValue = dataMap[name];
                dataMap[name] = Number(
                  ((currentValue / total) * 100).toFixed(2),
                );
              }
            });
          }
        }
      });
    });

    return { groups: [...keysByGroup.keys()], keysByGroup, dataByDateByGroup };
  }, [data]);

  const [currentGroup, setCurrentGroup] = useState(groups[0]);

  const { displayData, displayKeys } = useMemo(() => {
    return {
      displayKeys: [...(keysByGroup.get(currentGroup) ?? new Set<string>())],
      displayData: [
        ...(
          dataByDateByGroup.get(currentGroup) ??
          new Map<string, Record<string, string | number>>()
        ).values(),
      ],
    };
  }, [currentGroup, keysByGroup, dataByDateByGroup]);

  return (
    <>
      <div className="p-2 shrink-0 space-y-2">
        <div title="Selecciona una categoría">
          <h4 className="m-0 text-base text-primary">Mostrar por:</h4>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 max-h-20 overflow-y-auto pr-2 scrollbar-custom">
            {groups.map((group) => {
              const isSelected = group === currentGroup;

              return (
                <li key={`selectorBtn_${group}`}>
                  <button
                    className={cn(
                      "text-background min-w-[150px] w-full px-2 py-1 border rounded-lg transition-colors duration-300 text-base font-normal",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground bg-background! hover:cursor-pointer",
                    )}
                    onClick={() => setCurrentGroup(group)}
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

      <div className="relative w-full h-full min-h-[200px]">
        <ResponsiveBar
          data={displayData}
          keys={displayKeys}
          indexBy="date"
          layout="horizontal"
          margin={{ top: 0, right: 10, bottom: 30, left: 150 }}
          valueScale={{ type: "linear", min: 0, max: 100 }}
          indexScale={{ type: "band", round: true }}
          axisBottom={{ tickSize: 5, tickValues: [0, 20, 40, 60, 80, 100] }}
          colors={(val) => colorMap[val.id] ?? "#FF0000"}
          labelTextColor={(bar) => contrastColorMap[bar.data.id] ?? "#FF0000"}
          axisLeft={{
            renderTick: (tick) => {
              const item = displayData.find((d) => d.date === tick.value);
              const total = item ? item.total : 0;

              return (
                <g transform={`translate(0,${tick.y})`}>
                  <text
                    textAnchor="end"
                    dominantBaseline="middle"
                    style={{ fontSize: 12, fontWeight: "bold" }}
                    x={-5}
                    y={-8}
                  >
                    {tick.value}
                  </text>
                  <text
                    textAnchor="end"
                    dominantBaseline="middle"
                    style={{ fontSize: 11 }}
                    x={-5}
                    y={8}
                  >
                    {total} Personas
                  </text>
                </g>
              );
            },
          }}
          labelSkipWidth={16}
          labelSkipHeight={16}
          valueFormat={(v) => `${Number(v.toFixed(1))}%`}
          tooltip={({ id, value, indexValue, color }) => {
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
                    {id}
                  </span>
                  <span className="text-lg font-normal">{value}%</span>
                  <span className="italic">{indexValue}</span>
                </div>
              </div>
            );
          }}
        />
      </div>
      <ul className="flex justify-between gap-2 text-sm ml-[150px] mr-2 mb-4">
        {displayKeys.map((key) => (
          <li key={`legend_${key}`} className="flex items-center">
            <span
              className="inline-block w-4 h-4 mr-1"
              style={{ backgroundColor: colorMap[key] ?? "#FF0000" }}
            />
            {key}
          </li>
        ))}
      </ul>
    </>
  );
}
