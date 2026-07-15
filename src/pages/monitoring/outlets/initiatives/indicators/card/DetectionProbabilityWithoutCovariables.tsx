import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import { useEffect, useMemo, useState } from "react";
import { ConfidenceIntervalLayer } from "pages/monitoring/outlets/initiatives/indicators/card/utils/ConfidenceIntervalLayer";
import type { LineData } from "pages/monitoring/types/indicators";
import { ResponsiveLine } from "@nivo/line";
import { INITIATIVES_MAP_STATS_GRAPH_COLORS } from "@config/monitoring";
import { Combobox } from "@ui/ComboBox";
import { SearchIcon } from "lucide-react";
import { cn } from "@ui/shadCN/lib/utils";

export function DetectionProbabilityWithoutCovariables() {
  const { currentIndicator } = useIndicatorsCTX();
  const [selectedSpecie, setSelectedSpecie] = useState<string>("");

  const speciesOptions = useMemo(
    () =>
      currentIndicator?.groups.map((specie) => {
        const commonName = specie.category?.description
          ? `${specie.category?.description}, `
          : "";
        return {
          value: specie.category.name,
          label: `${commonName}${specie.category.name}`,
        };
      }) ?? [],
    [currentIndicator?.groups],
  );

  const filteredData = useMemo(() => {
    return ((currentIndicator?.cleanData ?? []) as LineData[])
      .filter((s) => s.scientificName === selectedSpecie)
      .map((s) => ({
        ...s,
        id: s.metricName || s.id,
      }));
  }, [currentIndicator, selectedSpecie]);

  const selectedSpecieName = useMemo(() => {
    const current = currentIndicator?.groups.find(
      (specie) => specie.category.name === selectedSpecie,
    );

    return current
      ? {
          name: current.category.name,
          commonName: current.category.description,
        }
      : { name: undefined, commonName: undefined };
  }, [currentIndicator?.groups, selectedSpecie]);

  useEffect(() => {
    if (!currentIndicator) {
      return;
    }

    setSelectedSpecie(speciesOptions[0].value ?? "");
  }, [currentIndicator, speciesOptions]);

  if (!currentIndicator) {
    return null;
  }

  return (
    <>
      <div className="p-2 pb-0 shrink-0 space-y-4">
        {speciesOptions.length > 1 && (
          <Combobox
            items={speciesOptions ?? []}
            value={selectedSpecie}
            setValue={setSelectedSpecie}
            uiText={{
              itemNotFound: "No se encuentra esa especie",
              trigger: "Selecciona una especie",
              inputPlaceholder: "Escibe el nombre para buscar la especie",
            }}
            icon={SearchIcon}
            keys={{ forLabel: "label", forValue: "value" }}
          />
        )}

        <h4
          className={cn(
            speciesOptions.length > 1
              ? "border-t border-muted m-0! mt-4 pt-4"
              : "m-0!",
            "text-primary",
          )}
        >
          <div>{selectedSpecieName?.commonName ?? selectedSpecieName.name}</div>
          {selectedSpecieName?.commonName && (
            <div className="text-base italic font-light">
              {selectedSpecieName.name}
            </div>
          )}
        </h4>
      </div>

      <div className="relative w-full h-full min-h-[200px]">
        <ResponsiveLine
          data={filteredData as LineData[]}
          margin={{ top: 20, right: 30, bottom: 65, left: 30 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: 1,
          }}
          colors={[
            INITIATIVES_MAP_STATS_GRAPH_COLORS[3],
            INITIATIVES_MAP_STATS_GRAPH_COLORS[7],
          ]}
          pointSize={10}
          useMesh={true}
          layers={[
            "grid",
            "axes",
            ConfidenceIntervalLayer,
            "crosshair",
            "lines",
            "points",
            "mesh",
            "legends",
          ]}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 50,
              itemWidth: 200,
              itemHeight: 20,
              symbolSize: 12,
              symbolShape: "circle",
            },
          ]}
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
