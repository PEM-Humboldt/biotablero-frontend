import { useEffect, useMemo, useState } from "react";

import { ResponsiveLine } from "@nivo/line";
import { hashStringToRange } from "@utils/format";
import { GRAPHS_CONTRAST_COLOR_PALETTE } from "@config/color";
import { GRAPH_ANIMATION_CONFIG } from "@config/global";
import { GetObservationInfo } from "@hooks/useReport/GetIndicatorInfo";

import { useObservationsCTX } from "pages/monitoring/hooks/useObservationsCTX";
import { ConfidenceIntervalLayer } from "pages/monitoring/outlets/initiatives/observations/card/utils/ConfidenceIntervalLayer";
import type { LineData } from "pages/monitoring/types/observations";
import { getSeriesColor } from "pages/monitoring/outlets/initiatives/observations/card/utils/colors";
import { uiText } from "pages/monitoring/outlets/initiatives/observations/layout/uiText";
import { GraphInfoSelector } from "pages/monitoring/outlets/initiatives/observations/card/ui/GraphInfoSelector";
import { GraphLegend } from "@ui/GraphLegend";

export function SpeciesDiversity() {
  const { currentObservation } = useObservationsCTX();

  const [selectedSpecie, setSelectedSpecie] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");

  const speciesList = useMemo(() => {
    if (!currentObservation) {
      return [];
    }
    const uniqueSpecies = new Set<string>();

    currentObservation.groups.map((group) => {
      uniqueSpecies.add(group.category.name);
    });

    return [...uniqueSpecies];
  }, [currentObservation]);

  const indexesList = useMemo(() => {
    if (!currentObservation?.groups) {
      return [];
    }

    const [currentGroup] = currentObservation.groups.filter(
      (group) => group.category.name === selectedSpecie,
    );

    if (!currentGroup) {
      return [];
    }

    const uniqueIndex = new Set<string>(
      currentGroup.values.map((value) => value.indicatorType.name),
    );

    return [...uniqueIndex];
  }, [currentObservation?.groups, selectedSpecie]);

  useEffect(() => {
    if (speciesList.length === 0) {
      return;
    }
    setSelectedSpecie(speciesList[0]);
  }, [speciesList]);

  useEffect(() => {
    if (indexesList.length === 0) {
      return;
    }
    setSelectedIndex((current) => (current === "" ? indexesList[0] : current));
  }, [indexesList]);

  const { filteredData, minY, maxY } = useMemo<{
    filteredData: LineData[];
    minY: number | "auto";
    maxY: number | "auto";
  }>(() => {
    if (!currentObservation?.cleanData) {
      return { filteredData: [], minY: "auto", maxY: "auto" };
    }

    const result = (currentObservation.cleanData as LineData[]).reduce(
      (acc, data) => {
        if (
          data.scientificName !== selectedSpecie ||
          data.metricName !== selectedIndex
        ) {
          return acc;
        }

        acc.filteredData.push(data);
        acc.minYvalue =
          Math.min(...data.data.map((d) => d.lowerLimit ?? d.y)) - 1;
        acc.maxYvalue =
          Math.max(...data.data.map((d) => d.upperLimit ?? d.y)) + 1;

        return acc;
      },
      {
        filteredData: [] as LineData[],
        minYvalue: Infinity,
        maxYvalue: -Infinity,
      },
    );

    return {
      filteredData: result.filteredData,
      minY: result.minYvalue === Infinity ? "auto" : result.minYvalue,
      maxY: result.maxYvalue === -Infinity ? "auto" : result.maxYvalue,
    };
  }, [currentObservation?.cleanData, selectedSpecie, selectedIndex]);

  return (
    <>
      <div className="p-4 shrink-0 space-y-4 border border-muted mb-0 rounded-lg hover:border-primary/50 transition-colors duration-300">
        <GraphInfoSelector
          uiText={uiText.observationCard.speciesDiversity.groupSelector}
          options={speciesList}
          currentSelection={selectedSpecie}
          updateCurrent={(s: unknown) => {
            if (typeof s === "string") {
              setSelectedSpecie(s);
            }
          }}
          colorFromOptionHash={true}
          highContrast={true}
        />

        <GraphInfoSelector
          uiText={uiText.observationCard.speciesDiversity.indexSelector}
          options={indexesList}
          currentSelection={selectedIndex}
          updateCurrent={(s: unknown) => {
            if (typeof s === "string") {
              setSelectedIndex(s);
            }
          }}
        />
      </div>

      <GetObservationInfo
        graphId={`${selectedSpecie}, ${selectedIndex}`}
        mapElementId={null}
        mapUrl={null}
      >
        <>
          <div className="w-full h-full aspect-3/2">
            <ResponsiveLine
              data={filteredData}
              margin={{ top: 20, right: 30, bottom: 30, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: minY,
                max: maxY,
              }}
              axisLeft={{
                legend: uiText.observationCard.speciesDiversity.leftAxisLegend,
                legendOffset: -40,
              }}
              motionConfig={GRAPH_ANIMATION_CONFIG}
              colors={(series) =>
                getSeriesColor(
                  hashStringToRange(series.scientificName),
                  GRAPHS_CONTRAST_COLOR_PALETTE,
                )
              }
              pointSize={8}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              useMesh={true}
              layers={[
                "grid",
                "markers",
                "axes",
                "areas",
                ConfidenceIntervalLayer,
                "crosshair",
                "lines",
                "points",
                "slices",
                "mesh",
              ]}
              tooltip={({ point }) => {
                const [name, description] = point.seriesId
                  .split(", ")
                  .map((l) => l.trim());

                const data = point.data.y;
                const date = point.data.x;

                return (
                  <div
                    className="bg-background px-4 py-2 shadow-md rounded flex flex-col items-center"
                    style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
                  >
                    <div className="flex flex-col text-center text-sm mb-1 *:m-0!">
                      <span className="font-normal">
                        <span
                          className="inline-block w-3 h-3 mr-1 rounded-full"
                          style={{ backgroundColor: point.seriesColor }}
                        />
                        {name}
                      </span>
                      <span className="italic">
                        {description} - {date}
                      </span>
                    </div>
                    <table className="space-x-1 [&_td]:px-2 [&_tr_td]:first:text-right">
                      <tbody>
                        <tr>
                          <td>
                            {
                              uiText.observationCard.rangedTooltip
                                .upperLimitTitle
                            }
                          </td>
                          <td>{point.data?.upperLimit ?? data}</td>
                        </tr>
                        <tr>
                          <td>
                            {uiText.observationCard.rangedTooltip.valueTitle}
                          </td>
                          <td>{data}</td>
                        </tr>
                        <tr>
                          <td>
                            {
                              uiText.observationCard.rangedTooltip
                                .lowerLimitTitle
                            }
                          </td>
                          <td>{point.data?.lowerLimit ?? data}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              }}
            />
          </div>
          <GraphLegend
            keys={filteredData.map((f) => f.id)}
            customColorList={GRAPHS_CONTRAST_COLOR_PALETTE}
            isBar={false}
          />
        </>
      </GetObservationInfo>
    </>
  );
}
