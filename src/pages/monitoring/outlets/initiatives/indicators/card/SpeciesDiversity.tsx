import { useEffect, useMemo, useState } from "react";

import { ResponsiveLine } from "@nivo/line";
import { hashStringToRange } from "@utils/format";
import { cn } from "@ui/shadCN/lib/utils";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { ConfidenceIntervalLayer } from "pages/monitoring/outlets/initiatives/indicators/card/utils/ConfidenceIntervalLayer";
import type { LineData } from "pages/monitoring/types/indicators";
import { getSeriesColor } from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";
import { uiText } from "pages/monitoring/outlets/initiatives/indicators/layout/uiText";

export function SpeciesDiversity() {
  const { currentIndicator } = useIndicatorsCTX();

  const [selectedSpecie, setSelectedSpecie] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");

  const speciesList = useMemo(() => {
    if (!currentIndicator) {
      return [];
    }
    const uniqueSpecies = new Set<string>();

    currentIndicator.groups.map((group) => {
      uniqueSpecies.add(group.category.name);
    });

    return [...uniqueSpecies];
  }, [currentIndicator]);

  const indexesList = useMemo(() => {
    if (!currentIndicator?.groups) {
      return [];
    }

    const [currentGroup] = currentIndicator.groups.filter(
      (group) => group.category.name === selectedSpecie,
    );

    if (!currentGroup) {
      return [];
    }

    const uniqueIndex = new Set<string>(
      currentGroup.values.map((value) => value.measureUnit.name),
    );

    return [...uniqueIndex];
  }, [currentIndicator?.groups, selectedSpecie]);

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
    filteredData: (LineData & { color: string })[];
    minY: number | "auto";
    maxY: number | "auto";
  }>(() => {
    if (!currentIndicator?.cleanData) {
      return { filteredData: [], minY: "auto", maxY: "auto" };
    }

    const result = (currentIndicator.cleanData as LineData[]).reduce(
      (acc, data) => {
        if (
          data.scientificName !== selectedSpecie ||
          data.metricName !== selectedIndex
        ) {
          return acc;
        }

        const color = getSeriesColor(hashStringToRange(data.scientificName));
        acc.filteredData.push({ ...data, color });
        acc.minYvalue =
          Math.min(...data.data.map((d) => d.lowerLimit ?? d.y)) - 1;
        acc.maxYvalue =
          Math.max(...data.data.map((d) => d.upperLimit ?? d.y)) + 1;

        return acc;
      },
      {
        filteredData: [] as (LineData & { color: string })[],
        minYvalue: Infinity,
        maxYvalue: -Infinity,
      },
    );

    return {
      filteredData: result.filteredData,
      minY: result.minYvalue === Infinity ? "auto" : result.minYvalue,
      maxY: result.maxYvalue === -Infinity ? "auto" : result.maxYvalue,
    };
  }, [currentIndicator?.cleanData, selectedSpecie, selectedIndex]);

  return (
    <>
      <div className="p-2 shrink-0 space-y-2">
        <div title="Selecciona un grupo">
          <h4 className="m-0 text-base text-primary">Grupos</h4>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 max-h-20 overflow-y-auto pr-2 scrollbar-custom">
            {speciesList.map((specie) => {
              const buttonColor = getSeriesColor(hashStringToRange(specie));
              const isSelected = specie === selectedSpecie;

              return (
                <li key={`selectorBtn_${specie}`}>
                  <button
                    style={{
                      background: buttonColor,
                      borderColor: buttonColor,
                    }}
                    className={cn(
                      "text-background min-w-[150px] w-full px-2 py-1 border rounded-lg transition-colors duration-300 text-base font-normal",
                      isSelected
                        ? ""
                        : "text-foreground bg-background! hover:cursor-pointer",
                    )}
                    onClick={() => setSelectedSpecie(specie)}
                    aria-pressed={isSelected}
                    disabled={isSelected}
                  >
                    {specie}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div title="Selecciona un índice">
          <h4 className="m-0 text-base text-primary">Índices</h4>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 max-h-20 overflow-y-auto pr-2 scrollbar-custom">
            {indexesList.map((index) => {
              const isSelected = index === selectedIndex;

              return (
                <li key={`selectorBtn_${index}`}>
                  <button
                    className={cn(
                      "text-background min-w-[150px] w-full px-2 py-1 border rounded-lg transition-colors duration-300 text-base font-normal",
                      isSelected
                        ? "text-primary-foreground bg-primary"
                        : "text-primary bg-background hover:cursor-pointer",
                    )}
                    onClick={() => setSelectedIndex(index)}
                    aria-pressed={isSelected}
                    disabled={isSelected}
                  >
                    {index}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

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
            legend: "Spp. estimados",
            legendOffset: -40,
          }}
          colors={(series) => series.color}
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
              .split("||")
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
                        {uiText.indicatorCard.rangedTooltip.upperLimitTitle}
                      </td>
                      <td>{point.data?.upperLimit ?? data}</td>
                    </tr>
                    <tr>
                      <td>{uiText.indicatorCard.rangedTooltip.valueTitle}</td>
                      <td>{data}</td>
                    </tr>
                    <tr>
                      <td>
                        {uiText.indicatorCard.rangedTooltip.lowerLimitTitle}
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
    </>
  );
}
