import { ResponsiveLine } from "@nivo/line";
import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import type { LineData } from "pages/monitoring/types/indicators";
import { useEffect, useMemo, useState } from "react";

import { INDICATORS_MAX_AMOUNT_OCUPATION_SPECIES } from "@config/monitoring";
import { cn } from "@ui/shadCN/lib/utils";
import { getSeriesColor } from "pages/monitoring/outlets/initiatives/indicators/card/utils/colors";

export function OccupationSpecies() {
  const { currentIndicator } = useIndicatorsCTX();
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);

  const filteredIndicator = useMemo(() => {
    if (!currentIndicator) {
      return [];
    }

    const rawData = (currentIndicator.cleanData ?? []) as LineData[];

    return rawData
      .filter((i) => selectedSpecies.includes(i.scientificName))
      .map((line) => {
        const matchedGroup = currentIndicator.groups.find(
          (g) => g.category.name === line.scientificName,
        );

        const color = matchedGroup
          ? getSeriesColor(matchedGroup.category.id)
          : "#FF0000";

        return {
          ...line,
          color,
        };
      });
  }, [currentIndicator, selectedSpecies]);

  useEffect(() => {
    if (!currentIndicator) {
      return;
    }

    setSelectedSpecies(() => {
      const loadSpecies: string[] = [];
      for (const specie of currentIndicator.groups) {
        if (loadSpecies.length === INDICATORS_MAX_AMOUNT_OCUPATION_SPECIES) {
          break;
        }

        loadSpecies.push(specie.category.name);
      }
      return loadSpecies;
    });
  }, [currentIndicator]);

  if (!currentIndicator) {
    return null;
  }

  const handleSelect = (item: string) => {
    if (selectedSpecies.includes(item)) {
      setSelectedSpecies((oldList) => oldList.filter((l) => l !== item));
      return;
    }

    setSelectedSpecies((oldList) => {
      const newList = [...oldList, item];
      if (newList.length > INDICATORS_MAX_AMOUNT_OCUPATION_SPECIES) {
        newList.shift();
      }
      return newList;
    });
  };

  return (
    <>
      <div className="pt-0 shrink-0">
        <span className="px-2 italic text-sm">
          selecciona hasta {INDICATORS_MAX_AMOUNT_OCUPATION_SPECIES} especies
        </span>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 max-h-40 overflow-y-auto p-2 pt-0 scrollbar-custom">
          {currentIndicator.groups.map((g) => {
            const buttonColor = getSeriesColor(g.category.id);
            const isSelected = selectedSpecies.includes(g.category.name);

            return (
              <button
                key={g.category.name}
                style={{
                  background: buttonColor,
                  borderColor: buttonColor,
                }}
                className={cn(
                  "text-background w-auto min-w-[150px] flex-[1_0] px-2 py-1 flex gap-1 border rounded-lg transition-colors duration-300",
                  isSelected ? "" : "text-foreground bg-background!",
                )}
                onClick={() => handleSelect(g.category.name)}
              >
                <div className="flex flex-col text-left *:m-0">
                  <span className="text-base font-normal">
                    {g.category.description}
                  </span>
                  <span className="text-sm italic">{g.category.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative w-full h-full min-h-[200px]">
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
                  <span className="font-normal">{description}</span>
                  <span className="italic">{name}</span>
                </div>
                <div className="space-x-1">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: point.color }}
                  />
                  <span className="font-normal">{point.data.y}</span>
                </div>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
