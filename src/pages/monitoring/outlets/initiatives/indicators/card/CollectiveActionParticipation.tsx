import { useMemo, useState } from "react";

import { hashStringToRange } from "@utils/format";
import {
  GRAPH_ANIMATION_CONFIG,
  GRAPHS_EXTENDED_COLOR_PALETTE,
} from "@config/monitoring";
import { ResponsiveBar } from "@nivo/bar";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import type { BarsData } from "pages/monitoring/types/indicators";
import {
  getContrastColor,
  getSeriesColor,
} from "pages/monitoring/outlets/initiatives/indicators/card//utils/colors";
import { GraphLegend } from "pages/monitoring/outlets/initiatives/indicators/card/ui/GraphLegend";
import { GraphInfoSelector } from "pages/monitoring/outlets/initiatives/indicators/card/ui/GraphInfoSelector";
import { uiText } from "pages/monitoring/outlets/initiatives/indicators/layout/uiText";
import { GetIndicatorInfo } from "@hooks/useReport/GetIndicatorInfo";

const customColorMap: Record<string, string> = {
  Mujeres: GRAPHS_EXTENDED_COLOR_PALETTE[10],
  Hombres: GRAPHS_EXTENDED_COLOR_PALETTE[8],
  "Otras identidades": GRAPHS_EXTENDED_COLOR_PALETTE[13],
  "Jóvenes (14-28)": GRAPHS_EXTENDED_COLOR_PALETTE[0],
  "Jóvenes adultos (29-40)": GRAPHS_EXTENDED_COLOR_PALETTE[15],
  "Adultos (41-59)": GRAPHS_EXTENDED_COLOR_PALETTE[7],
  "Adultos mayores (60+)": GRAPHS_EXTENDED_COLOR_PALETTE[20],
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
        const amountKey =
          uiText.indicatorCard.collectiveActionParticipation.amountKey;
        const total = dataMap[amountKey] as number;

        if (total > 0) {
          const actorKeys = keysByGroup.get(parentKey);

          if (actorKeys) {
            actorKeys.forEach((name) => {
              if (
                name !== amountKey &&
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
      <div className="p-4 shrink-0 space-y-4 border border-muted mb-0 rounded-lg hover:border-primary/50 transition-colors duration-300">
        <GraphInfoSelector
          uiText={uiText.indicatorCard.collectiveActionParticipation.selector}
          options={groups}
          currentSelection={currentGroup}
          updateCurrent={setCurrentGroup}
        />
      </div>

      <GetIndicatorInfo
        graphId={currentGroup}
        mapElementId={null}
        mapUrl={null}
      >
        <>
          <div className="w-full h-full aspect-video">
            <ResponsiveBar
              data={displayData}
              keys={displayKeys}
              indexBy="date"
              layout="horizontal"
              motionConfig={GRAPH_ANIMATION_CONFIG}
              margin={{ top: 0, right: 20, bottom: 30, left: 150 }}
              valueScale={{ type: "linear", min: 0, max: 100 }}
              indexScale={{ type: "band", round: true }}
              enableGridX={true}
              enableGridY={false}
              theme={{ grid: { line: { strokeDasharray: "1 1" } } }}
              padding={0.5}
              axisBottom={{
                tickValues: [0, 20, 40, 60, 80, 100],
                format: (v) => `${v}%`,
              }}
              colors={(bar) =>
                customColorMap[bar.id] ??
                getSeriesColor(
                  hashStringToRange(
                    String(bar.id),
                    GRAPHS_EXTENDED_COLOR_PALETTE.length,
                  ),
                  GRAPHS_EXTENDED_COLOR_PALETTE,
                )
              }
              labelTextColor={(bar) => getContrastColor(bar.color)}
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
                        {uiText.indicatorCard.collectiveActionParticipation.amountLabel(
                          Number(total),
                        )}
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

          <GraphLegend keys={displayKeys} customColorMap={customColorMap} />
        </>
      </GetIndicatorInfo>
    </>
  );
}
