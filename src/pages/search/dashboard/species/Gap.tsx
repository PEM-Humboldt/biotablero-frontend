import { ResponsiveLine, type SliceData } from "@nivo/line";
import { useEffect, useRef, useState } from "react";
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
import { GapController } from "pages/search/dashboard/species/GapController";
import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";
import { GRAPHS_EXTENDED_COLOR_PALETTE } from "@config/color";
import { ErrorsList } from "@ui/LabelingWithErrors";
import TextBoxes from "@ui/TextBoxes";
import type { TextsObject } from "pages/search/types/texts";
import InfoIcon from "@mui/icons-material/Info";
import { IconTooltip } from "@ui/Tooltips";
import { ShortInfo } from "@composites/ShortInfo";
import { speciesGroupLabels } from "pages/search/dashboard/species/commonDictionaries";
import { getMetricTexts } from "pages/search/utils/texts";

const GAP_GRAPH_MAX_YEARS_VISUALIZATION_AMOUTN = 5;
const GAP_GRAPH_START_YEARS_VISUALIZATION_AMOUTN = 3;

const customColorMap: Record<number, string> = {
  2019: GRAPHS_EXTENDED_COLOR_PALETTE[8],
  2020: GRAPHS_EXTENDED_COLOR_PALETTE[15],
  2021: GRAPHS_EXTENDED_COLOR_PALETTE[18],
  2022: GRAPHS_EXTENDED_COLOR_PALETTE[20],
  2023: GRAPHS_EXTENDED_COLOR_PALETTE[23],
  2024: GRAPHS_EXTENDED_COLOR_PALETTE[26],
  2025: GRAPHS_EXTENDED_COLOR_PALETTE[23],
};

export function Gap() {
  const [isLoading, setIsLoading] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [groupsAvailable, setGroupsAvailable] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [yearsAvailable, setYearsAvailable] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [showInfoGraph, setShowInfoGraph] = useState(false);
  const [recordsGapAverage, setRecordsGapAverage] = useState<
    Record<string, number>
  >({});

  const [texts, setTexts] = useState<{ recordsGap: TextsObject }>({
    recordsGap: { info: "", cons: "", meto: "", quote: "" },
  });
  const [groupSeries, setGroupSeries] = useState<
    { id: string; data: { x: number; y: number }[] }[]
  >([]);
  const { areaType, areaId } = useSearchStateCTX();
  const searchDispatch = useSearchDispatchCTX();
  const controller = useRef(new GapController());

  const lastYear = selectedYears[selectedYears.length - 1];

  if (areaType && areaId) {
    controller.current.setArea(areaType.id, areaId.id);
  }

  useEffect(() => {
    setIsLoading((old) => old + 1);
    Promise.all([
      controller.current.getGapTaxonomicGroups(),
      getMetricTexts("recordGaps"),
    ])
      .then(([groups, texts]) => {
        setGroupsAvailable(groups);
        setTexts({ recordsGap: texts });
      })
      .catch((err) => {
        console.error(err);
        setErrors(["No fue posible obtener los datos del indicador"]);
      })
      .finally(() => {
        setIsLoading((old) => old - 1);
      });
  }, []);

  useEffect(() => {
    setIsLoading((old) => old + 1);
    Promise.all([
      controller.current.getGapData(selectedGroup),
      controller.current.getGapAverage(selectedGroup),
    ])
      .then(([gapData, average]) => {
        const series = gapData?.series ?? [];
        const years = gapData?.years ?? [];

        setRecordsGapAverage(average ?? {});
        setGroupSeries(series);
        setYearsAvailable(years);
        setSelectedYears(
          years.length > 0
            ? years.slice(
                -Math.min(
                  GAP_GRAPH_START_YEARS_VISUALIZATION_AMOUTN,
                  years.length,
                ),
              )
            : [],
        );
      })
      .catch((err) => {
        console.error(err);
        setErrors(["No fue posible obtener los datos del indicador"]);
      })
      .finally(() => {
        setIsLoading((old) => old - 1);
      });
  }, [selectedGroup]);

  useEffect(() => {
    if (!lastYear) {
      return;
    }
    searchDispatch({
      type: SearchUpdated.LOADING_LAYER,
      loadingLayer: true,
    });

    controller.current
      .getGapLayer(String(lastYear), selectedGroup)
      .then((layersRes) => {
        searchDispatch({
          type: SearchUpdated.WILDCARD,
          payload: {
            rasterLayers: layersRes,
            mapTitle: { name: `Vacíos · ${lastYear}` },
          },
        });
      })
      .catch((err) => {
        if (String(err) !== "Error: request canceled") {
          searchDispatch({
            type: SearchUpdated.LAYER_ERROR,
            layerError: String(err),
          });
        }
      })
      .finally(() => {
        searchDispatch({
          type: SearchUpdated.LOADING_LAYER,
          loadingLayer: false,
        });
      });
  }, [selectedGroup, lastYear, searchDispatch]);

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

  const renderData = groupSeries.filter((g) =>
    selectedYears.includes(Number(g.id)),
  );

  return (
    <div className="graphcontainer pt6 overflow-hidden">
      <h4>Índice de Vacíos por Registros (IVR) por km²</h4>
      <IconTooltip title="Interpretación">
        <InfoIcon
          className={`metrics-info-icon${showInfoGraph ? " activeBox" : ""}`}
          onClick={() => setShowInfoGraph((prev) => !prev)}
        />
      </IconTooltip>

      {showInfoGraph && (
        <ShortInfo
          description={`<p>${texts.recordsGap.info}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}

      {Object.keys(groupsAvailable).length > 1 && (
        <Select
          value={selectedGroup}
          onValueChange={(val) => setSelectedGroup(val)}
        >
          <SelectTrigger id="gap-species-group" className="border-grey">
            <SelectValue placeholder="Grupo Taxonómico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los grupos</SelectItem>
            {groupsAvailable.map((group) => (
              <SelectItem key={`selectGroup-${group}`} value={group}>
                {speciesGroupLabels[group] ?? group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {yearsAvailable.length > 1 ? (
        <fieldset className="border-0 p-0 m-0">
          <legend className="sr-only">Selecciona los años a visualizar</legend>
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
      ) : (
        <div className="flex items-center">
          <span
            aria-hidden="true"
            className={cn(
              "relative inline-block w-6 mr-1 shrink-0 rounded-sm h-0.5",
              "before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 before:rounded-full before:bg-inherit ",
              "after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-white",
            )}
            style={{
              backgroundColor:
                customColorMap[yearsAvailable[0]] ??
                getSeriesColor(yearsAvailable[0]),
            }}
          />
          <span className="text-sm">{yearsAvailable[0]}</span>
        </div>
      )}

      <ErrorsList errorItems={errors} />

      <div className="w-full h-full aspect-video">
        {isLoading ? (
          <div className="errorData">Cargando datos...</div>
        ) : (
          <ResponsiveLine
            data={renderData}
            markers={markers(lastYear, recordsGapAverage)}
            margin={{ top: 30, right: 10, bottom: 60, left: 60 }}
            xScale={{ type: "linear", min: "auto", max: "auto" }}
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
            sliceTooltip={SliceTooltip}
          />
        )}
      </div>
      <p className="text-sm text-center">
        0 : vacío mínimo · 1 : vacíos máximo
      </p>

      <TextBoxes
        consText={texts.recordsGap.cons}
        metoText={texts.recordsGap.meto}
        quoteText={texts.recordsGap.quote}
        downloadData={controller.current.getDownloadData(renderData)}
        downloadName={`índiceVacíos_${areaType?.label}_${areaId?.name}.csv`}
        isInfoOpen={showInfoGraph}
        toggleInfo={() => setShowInfoGraph((prev) => !prev)}
      />
    </div>
  );
}

function markers(year: number, recordsGapAverage: Record<string, number>) {
  const value = recordsGapAverage[year];

  if (typeof value !== "number" || isNaN(value)) {
    return [];
  }

  return [
    {
      axis: "x" as const,
      value: value,
      lineStyle: {
        stroke: GRAPHS_EXTENDED_COLOR_PALETTE[4],
        strokeWidth: 2,
        strokeDasharray: "6 4",
      },
      legend: `Promedio ${year}: ${recordsGapAverage[year]}`,
      legendPosition: "top" as const,
      legendOffsetY: 15,
      textStyle: {
        fill: GRAPHS_EXTENDED_COLOR_PALETTE[4],
        fontSize: 12,
        fontWeight: 400,
      },
    },
  ];
}

function SliceTooltip({
  slice,
}: {
  slice: SliceData<{ id: string; data: { x: number; y: number }[] }>;
}) {
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
              <span className="font-normal">{point.data.yFormatted}/km²</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
