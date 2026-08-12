import { ResponsiveLine } from "@nivo/line";
import { useEffect, useState } from "react";
import { gapMockByGroup } from "./gapMock";
import { data } from "react-router";
import { getSeriesColor } from "@utils/color";
import { cn } from "@ui/shadCN/lib/utils";
import { Button } from "@ui/shadCN/component/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/shadCN/component/select";

type SpeciesGroup =
  | "mammals"
  | "birds"
  | "reptiles"
  | "amphibians"
  | "fish"
  | "plants";

const customColorMap: Record<number, string> = {
  2019: "#303F8C",
  2021: "#089FA7",
  2023: "#E69A00",
  2025: "#B54A00",
};

const speciesGroupLabels: { [K in SpeciesGroup]: string } = {
  mammals: "Mamiferos",
  birds: "Aves",
  reptiles: "Reptiles",
  amphibians: "Anfibios",
  fish: "Peces",
  plants: "Plantas",
};

export type GapData = {
  id: string | number;
  frequency: number[];
  bin_edges: number[];
};

const GAP_GRAPH_MAX_YEARS_VISUALIZATION_AMOUTN = 5;
const GAP_GRAPH_START_YEARS_VISUALIZATION_AMOUTN = 3;

export function Gap() {
  const [group, setGroup] = useState("");
  const [yearsAvailable, setYearsAvailable] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [groupData, setGroupData] = useState<
    { id: string; data: { x: number; y: number }[] }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const res: GapData[] = gapMockByGroup[group === "" ? "all" : group] ?? [];

      const formattedData = res.reduce<
        { id: string; data: { x: number; y: number }[] }[]
      >((all, current) => {
        const pairedData = current.bin_edges.map((edge, idx) => ({
          x: edge,
          y: current.frequency[idx] ?? 0,
        }));

        const serie = { id: String(current.id), data: pairedData };
        all.push(serie);

        return all;
      }, []);
      const years = [...new Set(res.map((r) => Number(r.id)).sort())];

      setGroupData(formattedData);
      setYearsAvailable(years);
      setSelectedYears(
        years.slice(
          -Math.min(GAP_GRAPH_START_YEARS_VISUALIZATION_AMOUTN, years.length),
        ),
      );
    };

    void fetchData();
  }, [group]);

  const handleSelectYear = (year: number) => {
    setSelectedYears((oldYears) => {
      const newYears = oldYears.includes(year)
        ? oldYears.filter((y) => y !== year)
        : [...new Set([...oldYears, year])];

      if (newYears.length <= 0) {
        newYears.push(yearsAvailable[yearsAvailable.length - 1]);
      }

      if (newYears.length > GAP_GRAPH_MAX_YEARS_VISUALIZATION_AMOUTN) {
        newYears.shift();
      }
      return newYears;
    });
  };

  const renderData = groupData.filter((g) =>
    selectedYears.includes(Number(g.id)),
  );

  return (
    <div className="p-4 pb-2 rounded-lg space-y-4">
      <div className="flex flex-col items-start mb-[2] gap-2">
        <h5
          style={{
            margin: 0,
            color: "#E23E57",
            lineHeight: 1.2,
            fontWeight: 500,
          }}
        >
          Índice de Vacíos por Registros (IVR) por km² (2019-2025)
        </h5>

        {Object.keys(speciesGroupLabels).length > 1 && (
          <Select value={group} onValueChange={(val) => setGroup(val)}>
            <SelectTrigger id="gap-species-group" className="border-grey">
              <SelectValue placeholder="Grupo Taxonómico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los grupos</SelectItem>
              {Object.entries(speciesGroupLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {yearsAvailable.length > 1 && (
          <fieldset className="border-0 p-0 m-0">
            <legend className="sr-only">
              Selecciona los años a visualizar
            </legend>
            <div
              role="group"
              aria-label="Años a visualizar"
              className="flex flex-wrap items-center"
            >
              {yearsAvailable
                .slice()
                .sort((a, b) => a - b)
                .map((year) => {
                  const isSelected = selectedYears.includes(year);

                  return (
                    <Button
                      key={`selectYearBtn_${year}`}
                      type="button"
                      onClick={() => handleSelectYear(year)}
                      aria-pressed={isSelected}
                      variant="ghost-clean"
                      size="sm"
                      className="text-foreground hover:text-primary border border-transparent hover:border-primary"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "relative inline-block w-6 mr-1 shrink-0 rounded-sm h-0.5",
                          "before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 before:rounded-full before:bg-inherit ",
                          "after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-white",
                        )}
                        style={{
                          backgroundColor: isSelected
                            ? (customColorMap[year] ?? getSeriesColor(year))
                            : "#cccccc",
                        }}
                      />
                      <span className="text-sm">{year}</span>
                    </Button>
                  );
                })}
            </div>
          </fieldset>
        )}
      </div>

      <div className="w-full h-full aspect-3/2">
        <ResponsiveLine
          data={renderData}
          margin={{ top: 10, right: 10, bottom: 60, left: 60 }}
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          curve="monotoneX"
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Índice de Vacíos de Registros por (IVR)",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          colors={(series) =>
            customColorMap[Number(series.id)] ??
            getSeriesColor(Number(series.id))
          }
          gridYValues={5}
          axisLeft={{
            tickValues: 5,
            legend: "Frecuencia de unidades de 1km²",
            legendOffset: -50,
            format: (value) => `${value / 1000}k`,
          }}
          pointSize={7}
          pointColor="#ffffff"
          pointBorderWidth={2}
          pointBorderColor={{ from: "seriesColor" }}
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}
          enableSlices="x"
          sliceTooltip={({ slice }) => {
            return (
              <div
                className="bg-background p-2 shadow-lg rounded text-xs flex flex-col gap-2"
                style={{ pointerEvents: "none" }}
              >
                <div className="font-normal text-foreground border-b pb-1">
                  IVR: {slice.points[0]?.data.xFormatted}
                </div>

                <div className="flex flex-col gap-1">
                  {slice.points.map((point) => {
                    const color =
                      customColorMap[Number(point.seriesId)] ??
                      getSeriesColor(Number(point.seriesId));

                    return (
                      <div
                        key={point.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center">
                          <span
                            className={cn(
                              "relative inline-block w-6 mr-1 shrink-0 rounded-sm h-0.5",
                              "before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 before:rounded-full before:bg-inherit ",
                              "after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-white",
                            )}
                            style={{ backgroundColor: color }}
                          />
                          <span>{point.seriesId}</span>
                        </div>
                        <span className="font-normal">
                          {point.data.yFormatted}/km²
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
        />
      </div>

      <p className="text-sm text-center">
        0 : vacío mínimo · 1 : vacíos máximo
      </p>
    </div>
  );
}
