import { useEffect, useMemo, useState } from "react";
import { ResponsiveLine } from "@nivo/line";

import {
  GRAPHS_CONTRAST_COLOR_PALETTE,
  INDICATOR_MAX_COUNT_OCUPATION_SPECIES,
} from "@config/monitoring";
import { cn } from "@ui/shadCN/lib/utils";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import type { LineData } from "pages/monitoring/types/indicators";
import { getSeriesColor } from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";
import { uiText } from "pages/monitoring/outlets/initiatives/indicators/layout/uiText";
import { GetIndicatorInfo } from "@hooks/useReport/GetIndicatorInfo";

export function OccupationSpecies() {
  const { currentIndicator } = useIndicatorsCTX();
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);

  const speciesOptions = useMemo(
    () =>
      (currentIndicator?.groups ?? []).map((group) => ({
        commonName: group.category.description,
        name: group.category.name,
        color: getSeriesColor(group.category.id, GRAPHS_CONTRAST_COLOR_PALETTE),
      })),
    [currentIndicator?.groups],
  );

  const renderIndicatorInfo = useMemo(() => {
    if (!currentIndicator) {
      return [];
    }

    const rawSeries = (currentIndicator.cleanData ?? []) as LineData[];

    return rawSeries.map((line) => {
      const matchedGroup = currentIndicator.groups.find(
        (g) => g.category.name === line.scientificName,
      );

      const color = matchedGroup
        ? getSeriesColor(
            matchedGroup.category.id,
            GRAPHS_CONTRAST_COLOR_PALETTE,
          )
        : "#FF0000";

      return { ...line, color };
    });
  }, [currentIndicator]);

  const filteredIndicator = useMemo(
    () =>
      renderIndicatorInfo.filter((i) =>
        selectedSpecies.includes(i.scientificName),
      ),
    [renderIndicatorInfo, selectedSpecies],
  );

  const handleSelect = (item: string) => {
    if (selectedSpecies.includes(item)) {
      setSelectedSpecies((oldList) => oldList.filter((l) => l !== item));
      return;
    }

    setSelectedSpecies((oldList) => {
      const newList = [...oldList, item];
      if (newList.length > INDICATOR_MAX_COUNT_OCUPATION_SPECIES) {
        newList.shift();
      }
      return newList;
    });
  };

  useEffect(() => {
    if (!currentIndicator) {
      return;
    }

    setSelectedSpecies(() => {
      const loadSpecies: string[] = [];
      for (const specie of currentIndicator.groups) {
        if (loadSpecies.length === INDICATOR_MAX_COUNT_OCUPATION_SPECIES) {
          break;
        }

        loadSpecies.push(specie.category.name);
      }
      return loadSpecies;
    });
  }, [currentIndicator]);

  return !currentIndicator ? null : (
    <>
      <div
        className="p-4 shrink-0 space-y-4 border border-muted mb-0 rounded-lg hover:border-primary/50 transition-colors duration-300"
        title={uiText.indicatorCard.ocupationSpecies.title}
      >
        {currentIndicator.groups.length >
          INDICATOR_MAX_COUNT_OCUPATION_SPECIES && (
          <span className="italic text-sm text-primary">
            {uiText.indicatorCard.ocupationSpecies.maxSelection(
              INDICATOR_MAX_COUNT_OCUPATION_SPECIES,
            )}
          </span>
        )}
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
          {speciesOptions.map((specie) => {
            const isSelected = selectedSpecies.includes(specie.name);

            return (
              <li key={`selectorBtn_${specie.name}`}>
                <button
                  style={{
                    background: specie.color,
                    borderColor: specie.color,
                  }}
                  className={cn(
                    "text-background w-full min-w-[150px] flex-[1_0] px-2 py-1 flex gap-1 border rounded-lg transition-colors duration-300 hover:cursor-pointer",
                    isSelected ? "" : "text-foreground bg-background!",
                  )}
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(specie.name)}
                >
                  <div className="flex flex-col text-left *:m-0">
                    <span className="text-base font-normal">
                      {specie.commonName}
                    </span>
                    <span className="text-sm italic">{specie.name}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <GetIndicatorInfo
        baseId={"carajo"}
        graphStateStringId={selectedSpecies.join(", ")}
        mapFromLeafletElementId={null}
      >
        <div className="w-full h-full aspect-3/2">
          <ResponsiveLine
            data={filteredIndicator}
            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: 100 }}
            axisBottom={{ tickSize: 5, legendPosition: "middle" }}
            axisLeft={{ tickSize: 5, legendPosition: "middle" }}
            colors={(series) => series.color}
            pointSize={10}
            useMesh={true}
            tooltip={({ point }) => {
              const [name, description] = point.seriesId
                .replace(/\|\|.*$/, "")
                .split(", ");

              return (
                <div
                  className="bg-background px-4 py-2 shadow-md rounded flex flex-col items-center"
                  style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
                >
                  <div className="flex flex-col text-center text-sm mb-1 *:m-0!">
                    <div className="space-x-1">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: point.color }}
                      />
                      <span className="font-normal">{description}</span>
                    </div>
                    <span className="italic">{name}</span>
                  </div>
                  <div className="space-x-1">
                    <span className="font-normal">{point.data.y}</span>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </GetIndicatorInfo>
    </>
  );
}
