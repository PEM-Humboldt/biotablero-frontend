import { ResponsiveLine, type SliceData } from "@nivo/line";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
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
  2018: GRAPHS_EXTENDED_COLOR_PALETTE[7],
  2019: GRAPHS_EXTENDED_COLOR_PALETTE[8],
  2020: GRAPHS_EXTENDED_COLOR_PALETTE[15],
  2021: GRAPHS_EXTENDED_COLOR_PALETTE[18],
  2022: GRAPHS_EXTENDED_COLOR_PALETTE[20],
  2023: GRAPHS_EXTENDED_COLOR_PALETTE[23],
  2024: GRAPHS_EXTENDED_COLOR_PALETTE[26],
  2025: GRAPHS_EXTENDED_COLOR_PALETTE[29],
};

type GapSerie = { id: string; data: { x: number; y: number }[] };

type GapState = {
  isLoading: boolean;
  errors: string[];
  availableGroups: string[];
  currentGroup: string;
  availableYears: number[];
  activeYears: number[];
  seriesData: GapSerie[];
  averages: Record<string, number>;
  showInfo: boolean;
  texts: TextsObject;
};

const gapInitialState: GapState = {
  isLoading: true,
  errors: [],
  availableGroups: [],
  currentGroup: "all",
  availableYears: [],
  activeYears: [],
  seriesData: [],
  averages: {},
  showInfo: false,
  texts: { info: "", cons: "", meto: "", quote: "" },
};

enum GapsUpdated {
  INITIAL_DATA = "initialData",
  LOADING = "isLoading",
  ERRORS_FOUND = "errors",
  TAXONOMIC_GROUP = "taxonomicGroup",
  ACTIVE_YEARS = "yearsSelected",
  SHOW_INFO = "showTexts",
}

type GapAction =
  | { type: GapsUpdated.LOADING; forceState?: boolean }
  | { type: GapsUpdated.SHOW_INFO; forceState?: boolean }
  | {
      type: GapsUpdated.ERRORS_FOUND;
      errors: { user: string[]; console: unknown };
    }
  | {
      type: GapsUpdated.INITIAL_DATA;
      payload: {
        taxonomicGroups: string[];
        texts: TextsObject;
        series: GapSerie[];
        yearsAvailable: number[];
        averages: Record<string, number>;
      };
    }
  | { type: GapsUpdated.ACTIVE_YEARS; selectedYear: number }
  | {
      type: GapsUpdated.TAXONOMIC_GROUP;
      payload: {
        taxonomicGroup: string;
        series: GapSerie[];
        yearsAvailable: number[];
        averages: Record<string, number>;
      };
    };

function preSelectedYears(yearsAvailable: number[]): number[] {
  return yearsAvailable.length > 0
    ? yearsAvailable.slice(
        -Math.min(
          GAP_GRAPH_START_YEARS_VISUALIZATION_AMOUTN,
          yearsAvailable.length,
        ),
      )
    : [];
}

function gapReducer(state: GapState, action: GapAction): GapState {
  switch (action.type) {
    case GapsUpdated.LOADING: {
      const isLoading =
        action.forceState !== undefined ? action.forceState : !state.isLoading;
      return {
        ...state,
        errors: isLoading ? [] : state.errors,
        isLoading,
      };
    }

    case GapsUpdated.SHOW_INFO: {
      const isActive =
        action.forceState !== undefined ? action.forceState : !state.showInfo;
      return {
        ...state,
        errors: isActive ? [] : state.errors,
        showInfo: isActive,
      };
    }

    case GapsUpdated.ERRORS_FOUND:
      console.error(action.errors.console);
      return {
        ...state,
        errors: action.errors.user,
        isLoading: false,
      };

    case GapsUpdated.INITIAL_DATA:
      return {
        ...state,
        availableGroups: action.payload.taxonomicGroups,
        texts: action.payload.texts,
        seriesData: action.payload.series,
        availableYears: action.payload.yearsAvailable,
        activeYears: preSelectedYears(action.payload.yearsAvailable),
        averages: action.payload.averages,
        isLoading: false,
        errors: [],
      };

    case GapsUpdated.TAXONOMIC_GROUP:
      return {
        ...state,
        currentGroup: action.payload.taxonomicGroup,
        averages: action.payload.averages,
        seriesData: action.payload.series,
        availableYears: action.payload.yearsAvailable,
        activeYears: preSelectedYears(action.payload.yearsAvailable),
        isLoading: false,
        errors: [],
      };

    case GapsUpdated.ACTIVE_YEARS: {
      const newYearsSelection = state.activeYears.includes(action.selectedYear)
        ? state.activeYears.filter((y) => y !== action.selectedYear)
        : [...new Set([...state.activeYears, action.selectedYear])];

      if (newYearsSelection.length <= 0) {
        newYearsSelection.push(
          state.availableYears[state.availableYears.length - 1],
        );
      }

      if (newYearsSelection.length > GAP_GRAPH_MAX_YEARS_VISUALIZATION_AMOUTN) {
        newYearsSelection.shift();
      }

      return {
        ...state,
        activeYears: newYearsSelection,
      };
    }

    default:
      console.warn("Unknown requested gapReducer action");
      return state;
  }
}

export function Gap() {
  const { areaType, areaId } = useSearchStateCTX();
  const [gap, updateGap] = useReducer(gapReducer, gapInitialState);
  const searchDispatch = useSearchDispatchCTX();
  const controllerRef = useRef<GapController | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = new GapController();
  }

  const lastYear = gap.activeYears.toSorted().at(-1);

  if (areaType && areaId) {
    controllerRef.current.setArea(areaType.id, areaId.id);
  }

  const getGapData = useCallback(
    (taxonomicGroup: string) => {
      if (!controllerRef.current) {
        return;
      }
      const groupRequest =
        taxonomicGroup === "all" ? undefined : taxonomicGroup;
      const controller = controllerRef.current;

      updateGap({ type: GapsUpdated.LOADING, forceState: true });
      searchDispatch({
        type: SearchUpdated.LOADING_LAYER,
        loadingLayer: true,
      });

      Promise.all([
        controller.getGapData(groupRequest),
        controller.getGapAverage(groupRequest),
      ])
        .then(([gapData, average]) => {
          updateGap({
            type: GapsUpdated.TAXONOMIC_GROUP,
            payload: {
              series: gapData.series,
              yearsAvailable: gapData.years,
              averages: average,
              taxonomicGroup: taxonomicGroup,
            },
          });
        })
        .catch((err) => {
          updateGap({
            type: GapsUpdated.ERRORS_FOUND,
            errors: {
              user: ["No fue posible obtener los datos del indicador"],
              console: err,
            },
          });
        });
    },
    [searchDispatch],
  );

  useEffect(() => {
    if (!controllerRef.current) {
      return;
    }
    const controller = controllerRef.current;

    updateGap({ type: GapsUpdated.LOADING, forceState: true });
    searchDispatch({
      type: SearchUpdated.LOADING_LAYER,
      loadingLayer: true,
    });

    Promise.all([
      controller.getGapTaxonomicGroups(),
      getMetricTexts("recordGaps"),
      controller.getGapData(),
      controller.getGapAverage(),
    ])
      .then(([groups, texts, gapSeries, gapAverages]) => {
        updateGap({
          type: GapsUpdated.INITIAL_DATA,
          payload: {
            taxonomicGroups: groups,
            texts: texts,
            series: gapSeries.series,
            yearsAvailable: gapSeries.years,
            averages: gapAverages,
          },
        });
      })
      .catch((err) => {
        updateGap({
          type: GapsUpdated.ERRORS_FOUND,
          errors: {
            user: ["No fue posible obtener los datos del indicador"],
            console: err,
          },
        });
      });

    return () => {
      controller.cancelActiveRequests();
    };
  }, [searchDispatch]);

  useEffect(() => {
    if (!controllerRef.current || !lastYear) {
      return;
    }

    searchDispatch({
      type: SearchUpdated.LOADING_LAYER,
      loadingLayer: true,
    });

    const controller = controllerRef.current;
    const groupReq = gap.currentGroup === "all" ? undefined : gap.currentGroup;

    controller
      .getGapLayer(String(lastYear), groupReq)
      .then((layersRes) => {
        searchDispatch({
          type: SearchUpdated.WILDCARD,
          payload: {
            rasterLayers: layersRes,
            mapTitle: { name: `Vacíos · ${lastYear}` },
            loadingLayer: false,
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
      });
  }, [lastYear, gap.currentGroup, searchDispatch]);

  const handleSelectYear = (year: number) => {
    updateGap({ type: GapsUpdated.ACTIVE_YEARS, selectedYear: year });
  };

  const renderData = useMemo(
    () => gap.seriesData.filter((g) => gap.activeYears.includes(Number(g.id))),
    [gap.seriesData, gap.activeYears],
  );

  return !lastYear ? null : (
    <div className="graphcontainer pt6 overflow-hidden">
      <h4>Índice de Vacíos por Registros (IVR) por km²</h4>
      <IconTooltip title="Interpretación">
        <InfoIcon
          className={`metrics-info-icon${gap.showInfo ? " activeBox" : ""}`}
          onClick={() => updateGap({ type: GapsUpdated.SHOW_INFO })}
        />
      </IconTooltip>

      {gap.showInfo && (
        <ShortInfo
          description={`<p>${gap.texts.info}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}

      {gap.availableGroups.length > 1 && (
        <Select value={gap.currentGroup} onValueChange={getGapData}>
          <SelectTrigger id="gap-species-group" className="border-grey">
            <SelectValue placeholder="Grupo Taxonómico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los grupos</SelectItem>
            {gap.availableGroups.map((group) => (
              <SelectItem key={`selectGroup-${group}`} value={group}>
                {speciesGroupLabels[group] ?? group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {gap.availableYears.length > 1 ? (
        <fieldset className="border-0 p-0 m-0">
          <legend className="sr-only">Selecciona los años a visualizar</legend>
          <div
            role="group"
            aria-label="Años a visualizar"
            className="flex flex-wrap items-center"
          >
            {gap.availableYears
              .toSorted((a, b) => a - b)
              .map((year) => {
                const isSelected = gap.activeYears.includes(year);

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
                customColorMap[gap.availableYears[0]] ??
                getSeriesColor(gap.availableYears[0]),
            }}
          />
          <span className="text-sm">{gap.availableYears[0]}</span>
        </div>
      )}

      <ErrorsList errorItems={gap.errors} />

      {gap.isLoading ? (
        <div className="errorData">Cargando datos...</div>
      ) : (
        <>
          <div className="w-full h-full aspect-video">
            <GapLineChart
              data={renderData}
              lastYear={lastYear}
              averages={gap.averages}
            />
          </div>
          <p className="text-sm text-center">
            0 : vacío mínimo · 1 : vacíos máximo
          </p>
          <TextBoxes
            consText={gap.texts.cons}
            metoText={gap.texts.meto}
            quoteText={gap.texts.quote}
            downloadData={controllerRef.current.getDownloadData(renderData)}
            downloadName={`índiceVacíos_${areaType?.label}_${areaId?.name}.csv`}
            isInfoOpen={gap.showInfo}
            toggleInfo={() => updateGap({ type: GapsUpdated.SHOW_INFO })}
          />
        </>
      )}
    </div>
  );
}

const GapLineChart = memo(function GapLineChart({
  data,
  lastYear,
  averages,
}: {
  data: GapSerie[];
  lastYear: number;
  averages: Record<string, number>;
}) {
  return (
    <ResponsiveLine
      data={data}
      markers={markers(lastYear, averages)}
      margin={{ top: 30, right: 10, bottom: 60, left: 60 }}
      xScale={{ type: "linear", min: "auto", max: "auto" }}
      yScale={{ type: "linear", min: 0, max: "auto" }}
      curve="monotoneX"
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Índice de Vacíos de Registros por (IVR)",
        legendOffset: 36,
        legendPosition: "middle" as const,
      }}
      colors={(series) =>
        customColorMap[Number(series.id)] ?? getSeriesColor(Number(series.id))
      }
      gridYValues={5}
      axisLeft={{
        tickValues: 5,
        legend: "Frecuencia de unidades de 1km²",
        legendOffset: -50,
        format: (value: number) => `${value / 1000}k`,
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
  );
});

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
        IVR: {Number(slice.points[0]?.data.x.toFixed(2))}
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
