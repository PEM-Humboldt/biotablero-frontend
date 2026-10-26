import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { CircleAlert, LayersIcon, LeafIcon, MapPin } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/shadCN/component/select";
import SmallStackedBar, {
  type SmallStackedBarData,
} from "@composites/charts/SmallStackedBar";
import { TextBoxes } from "@ui/TextBoxes";
import { AddSearchIndicatorToReportBtn } from "@ui/AddSearchIndicatorToReport";
import { ErrorsList } from "@ui/LabelingWithErrors";
import { GetSearchIndicatorInfo } from "@hooks/useReport/GetSearchIndicatorInfo";
import { GraphLegend } from "@ui/GraphLegend";
import { LOCALE } from "@config/global";
import { ShortInfo } from "@composites/ShortInfo";
import { cn } from "@ui/shadCN/lib/utils";

import {
  ObservedRichnessController,
  type ObservedRichnessDataType,
} from "pages/search/dashboard/species/ObservedRichnessController";
import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import type { TextsObject } from "pages/search/types/texts";
import { getMetricTexts } from "pages/search/utils/texts";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";
import type { AreaIdBasic } from "pages/search/types/dashboard";
import type { MetricTypesMap } from "pages/search/types/metrics";

import InfoIcon from "@mui/icons-material/Info";
import { IconTooltip } from "@ui/Tooltips";
import { capitalize } from "@utils/format";
import { ResponsiveBar } from "@nivo/bar";

const OBSERVED_RICHNESS_GRAPH_KEYS = ["CR", "EN", "VU"];
const CUSTOM_BINS = [
  "1",
  "2",
  "3-5",
  "6-10",
  "11-20",
  "21-50",
  "51-100",
  "101-200",
  "201-500",
  "501-1000",
  ">1000",
];
const HISTOGRAM_BARS_COLOR = "#D49A36";
const threatenedSpeciesCustomColorMap: Record<string, string> = {
  CR: "#5c150c",
  EN: "#bc472b",
  VU: "#d98242",
};

const observedRichnessGradientColors = ["#1B0C42", "#A6216E", "#FCB03D"];

enum ObservedRichnessUpdated {
  LOADING = "loading",
  ERRORS = "errors",
  INITIAL_DATA = "loaded",
  TAXONOMIC_GROUP = "taxonomicGroup",
  SHOW_INFO = "showInfo",
}

type ObservedRichnessGraphSerie = {
  id: string;
  data: { x: number; y: number }[];
};

type ObservedRichnessState = {
  isLoading: boolean;
  isInfoOpen: boolean;
  errors: string[];
  taxonomicGroupsAvailable: string[];
  currentTaxonomicGroup: string;
  nationalTableData: ObservedRichnessDataType | null;
  areaTableData: ObservedRichnessDataType | null;
  areaSerie: ObservedRichnessGraphSerie | null;
  texts: TextsObject;
};

type ObservedRichnessAction =
  | { type: ObservedRichnessUpdated.LOADING; isLoading: boolean }
  | {
      type: ObservedRichnessUpdated.ERRORS;
      payload: { user: string[]; console: unknown };
    }
  | {
      type: ObservedRichnessUpdated.INITIAL_DATA;
      payload: {
        taxonomicGroupsAvailable: string[];
        texts: TextsObject;
        nationalData: ObservedRichnessDataType;
        areaData: ObservedRichnessDataType | null;
        areaSerie: MetricTypesMap["richness"];
      };
    }
  | {
      type: ObservedRichnessUpdated.TAXONOMIC_GROUP;
      payload: {
        taxonomicGroup: string;
        nationalData: ObservedRichnessDataType;
        areaData: ObservedRichnessDataType | null;
        areaSerie: MetricTypesMap["richness"];
      };
    }
  | { type: ObservedRichnessUpdated.SHOW_INFO; forceState?: boolean };

function transformSerieToObservedRichnessSerie(
  serie: MetricTypesMap["richness"],
): ObservedRichnessGraphSerie {
  const pairedData = serie.bin_edges.map((edge, idx) => ({
    x: Number(edge.toFixed(2)),
    y: serie.frequency[idx] ?? serie.frequency[idx - 1],
  }));

  return { id: String(serie.id), data: pairedData };
}

function transformDataToSmallStackedBarData(
  data: ObservedRichnessDataType,
): SmallStackedBarData[] {
  const totalThreatened = data.threatenedTotal || 1;

  return OBSERVED_RICHNESS_GRAPH_KEYS.map((key) => {
    const rawVal = data.barValues[key as keyof typeof data.barValues] ?? 0;

    return {
      key,
      label: `${key}:${rawVal.toLocaleString(LOCALE)}`,
      area: rawVal,
      percentage: rawVal / totalThreatened,
    };
  });
}

function observedRichnessReducer(
  state: ObservedRichnessState,
  action: ObservedRichnessAction,
): ObservedRichnessState {
  switch (action.type) {
    case ObservedRichnessUpdated.LOADING:
      return { ...state, isLoading: action.isLoading };

    case ObservedRichnessUpdated.ERRORS:
      console.error(action.payload.console);
      return { ...state, isLoading: false, errors: action.payload.user };

    case ObservedRichnessUpdated.INITIAL_DATA:
      return {
        ...state,
        isLoading: false,
        errors: [],
        taxonomicGroupsAvailable: action.payload.taxonomicGroupsAvailable
          .reduce<string[]>((all, current) => {
            if (current !== "total") {
              all.push(capitalize(current));
            }
            return all;
          }, [])
          .toSorted(),
        nationalTableData: action.payload.nationalData,
        areaTableData: action.payload.areaData,
        texts: action.payload.texts,
        areaSerie: transformSerieToObservedRichnessSerie(
          action.payload.areaSerie,
        ),
        currentTaxonomicGroup: "all",
      };

    case ObservedRichnessUpdated.TAXONOMIC_GROUP:
      return {
        ...state,
        isLoading: false,
        errors: [],
        nationalTableData: action.payload.nationalData,
        areaTableData: action.payload.areaData,
        areaSerie: transformSerieToObservedRichnessSerie(
          action.payload.areaSerie,
        ),
        currentTaxonomicGroup: action.payload.taxonomicGroup,
      };

    case ObservedRichnessUpdated.SHOW_INFO:
      return {
        ...state,
        isInfoOpen:
          action.forceState !== undefined
            ? action.forceState
            : !state.isInfoOpen,
      };

    default:
      console.warn("Unknown requested observedRichnessReducer action");
      return state;
  }
}

const observedRichnessInitialState: ObservedRichnessState = {
  isLoading: true,
  isInfoOpen: false,
  errors: [],
  taxonomicGroupsAvailable: [],
  currentTaxonomicGroup: "all",
  nationalTableData: null,
  areaTableData: null,
  areaSerie: null,
  texts: { info: "", cons: "", meto: "", quote: "" },
};

export function ObservedRichness() {
  const [richness, updateRichness] = useReducer(
    observedRichnessReducer,
    observedRichnessInitialState,
  );

  const { areaType, areaId } = useSearchStateCTX();
  const searchMapDispatch = useSearchDispatchCTX();

  const controllerRef = useRef(new ObservedRichnessController());

  if (areaType && areaId) {
    controllerRef.current.setArea(areaType.id, areaId.id);
  }

  useEffect(() => {
    let isMounted = true;
    const controller = controllerRef.current;

    updateRichness({ type: ObservedRichnessUpdated.LOADING, isLoading: true });
    searchMapDispatch({
      type: SearchUpdated.LOADING_LAYER,
      loadingLayer: true,
    });

    Promise.all([
      controller.getORichnessTaxonomicGroups(),
      getMetricTexts("statsOnSpecies"),
      areaType?.id !== "custom" ? controller.getAreaData() : null,
      controller.getNationalData(),
      controller.getRichnessHistogram(),
      controller.getRichnessLayer(),
    ])
      .then(
        ([
          groups,
          texts,
          areaData,
          nationalData,
          areaSerie,
          areaRichnessMap,
        ]) => {
          if (!isMounted) {
            return;
          }

          updateRichness({
            type: ObservedRichnessUpdated.INITIAL_DATA,
            payload: {
              taxonomicGroupsAvailable: groups.filter((e) => e !== "total"),
              texts: texts,
              areaData: areaData,
              nationalData: nationalData,
              areaSerie: areaSerie,
            },
          });

          const gradientMaxValue = areaSerie.bin_edges.at(-1);

          searchMapDispatch({
            type: SearchUpdated.RASTER_LAYERS,
            payload: {
              rasterLayers: areaRichnessMap,
              mapTitle: {
                name: `Riqueza observada en ${capitalize(areaId?.name)}`,
                ...(gradientMaxValue !== undefined
                  ? {
                      gradientData: {
                        from: 1,
                        to: gradientMaxValue,
                        colors: observedRichnessGradientColors,
                      },
                    }
                  : {}),
              },
            },
          });
        },
      )
      .catch((err) => {
        if (!isMounted) {
          return;
        }

        updateRichness({
          type: ObservedRichnessUpdated.ERRORS,
          payload: {
            user: ["No fue posible obtener los datos del indicador"],
            console: err,
          },
        });

        searchMapDispatch({
          type: SearchUpdated.LAYER_ERROR,
          layerError: err instanceof Error ? err.message : String(err),
        });
      });

    return () => {
      isMounted = false;
      controller.cancelActiveRequests();
    };
  }, [areaType?.id, searchMapDispatch, areaId?.name]);

  const handleTaxonomicGroupChange = useCallback(
    (taxonomicGroup: string) => {
      const controller = controllerRef.current;
      const groupFilter =
        taxonomicGroup === "all" || taxonomicGroup === ""
          ? undefined
          : taxonomicGroup;

      updateRichness({
        type: ObservedRichnessUpdated.LOADING,
        isLoading: true,
      });
      searchMapDispatch({
        type: SearchUpdated.LOADING_LAYER,
        loadingLayer: true,
      });

      Promise.all([
        areaType?.id !== "custom" ? controller.getAreaData(groupFilter) : null,
        controller.getNationalData(groupFilter),
        controller.getRichnessHistogram(groupFilter),
        controller.getRichnessLayer(groupFilter),
      ])
        .then(([current, context, graphData, areaRichnessMap]) => {
          updateRichness({
            type: ObservedRichnessUpdated.TAXONOMIC_GROUP,
            payload: {
              taxonomicGroup: taxonomicGroup,
              nationalData: context,
              areaData: current,
              areaSerie: graphData,
            },
          });

          const gradientMaxValue = graphData.bin_edges.at(-1);

          searchMapDispatch({
            type: SearchUpdated.RASTER_LAYERS,
            payload: {
              rasterLayers: areaRichnessMap,
              mapTitle: {
                name: groupFilter
                  ? `Riqueza observada de ${groupFilter} en ${capitalize(areaId?.name)}`
                  : `Riqueza observada en ${capitalize(areaId?.name)}`,
                ...(gradientMaxValue !== undefined
                  ? {
                      gradientData: {
                        from: 1,
                        to: gradientMaxValue,
                        colors: observedRichnessGradientColors,
                      },
                    }
                  : {}),
              },
            },
          });
        })
        .catch((err) => {
          updateRichness({
            type: ObservedRichnessUpdated.ERRORS,
            payload: {
              user: ["No fue posible obtener los datos del indicador"],
              console: err,
            },
          });
        });
    },
    [areaType?.id, areaId?.name, searchMapDispatch],
  );

  const histogramData = useMemo(() => {
    if (
      !richness.areaSerie ||
      !richness.areaSerie.data ||
      richness.areaSerie.data.length === 0
    ) {
      return [];
    }

    return richness.areaSerie.data
      .slice(0, CUSTOM_BINS.length)
      .map((point, index) => ({
        rango: CUSTOM_BINS[index],
        frecuencia: point.y,
      }));
  }, [richness.areaSerie]);

  return (
    <div className="graphcontainer pt6">
      <h4>Número de especies</h4>
      <IconTooltip title="Interpretación">
        <InfoIcon
          className={`metrics-info-icon${richness.isInfoOpen ? " activeBox" : ""}`}
          onClick={() =>
            updateRichness({
              type: ObservedRichnessUpdated.SHOW_INFO,
            })
          }
        />
      </IconTooltip>

      {richness.isInfoOpen && (
        <ShortInfo description={richness.texts.info} className="graphinfo2" />
      )}

      {Object.keys(richness.taxonomicGroupsAvailable).length > 1 && (
        <Select
          value={richness.currentTaxonomicGroup}
          onValueChange={(val) => handleTaxonomicGroupChange(val)}
          disabled={richness.isLoading}
        >
          <SelectTrigger id="gap-species-group" className="border-grey">
            <SelectValue placeholder="Grupo Taxonómico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los grupos</SelectItem>
            {richness.taxonomicGroupsAvailable.map((group) => (
              <SelectItem
                key={`selectGroup-${group}`}
                value={group.toLocaleLowerCase(LOCALE)}
              >
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <ErrorsList errorItems={richness.errors} />

      <div className="">
        {richness.isLoading ? (
          <div className="errorData">Cargando datos...</div>
        ) : (
          <>
            <GetSearchIndicatorInfo
              wrapperId="StatsOnSpecies"
              title="Número de especies"
              tableData={[]}
              graphId={
                richness.currentTaxonomicGroup === "all"
                  ? "Todos los grupos"
                  : richness.currentTaxonomicGroup
              }
              includesMap={false}
            >
              <>
                <ObservedRichnessTable
                  data={richness.areaTableData}
                  areaId={areaId}
                />
                <ObservedRichnessTable
                  data={richness.nationalTableData}
                  areaId={areaId}
                  isReference={true}
                />
              </>
            </GetSearchIndicatorInfo>

            <AddSearchIndicatorToReportBtn
              wrapperId="StatsOnSpecies"
              overWriteLabel="Agregar tablas"
              className="w-full"
            />
          </>
        )}
      </div>

      {richness.areaSerie && (
        <div className="graphcontainer pt6">
          <h4 className="text-balance">
            Número de especies registradas por km²
          </h4>
          {richness.isLoading ? (
            <div className="errorData">Cargando datos...</div>
          ) : (
            <GetSearchIndicatorInfo
              wrapperId="ObservedRichness"
              title="Número de especies registradas por km²"
              graphInfo={richness.texts}
              tableData={controllerRef.current.getDownloadData({
                current: richness.areaTableData,
                national: richness.nationalTableData,
              })}
              graphId={
                richness.currentTaxonomicGroup === "all"
                  ? "Todos los grupos"
                  : richness.currentTaxonomicGroup
              }
              includesMap={true}
            >
              <div className="w-full aspect-video">
                <ResponsiveBar
                  data={histogramData}
                  keys={["frecuencia"]}
                  indexBy="rango"
                  margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                  padding={0.1}
                  colors={[HISTOGRAM_BARS_COLOR]}
                  enableLabel={false}
                  enableGridX={false}
                  enableGridY={true}
                  theme={{
                    axis: {
                      ticks: { text: { fill: "#888", fontSize: 12 } },
                      legend: { text: { fill: "#888", fontSize: 13 } },
                    },
                    grid: { line: { stroke: "#f0f0f0", strokeWidth: 1 } },
                  }}
                  axisBottom={{
                    tickSize: 0,
                    legend: "Número de especies registradas",
                    legendPosition: "middle",
                    legendOffset: 45,
                    renderTick: (tick) => {
                      const parts = String(tick.value).split("-");

                      return (
                        <g transform={`translate(${tick.x},${tick.y + 12})`}>
                          {parts.length > 1 ? (
                            <>
                              <text
                                textAnchor="middle"
                                fill="#888"
                                fontSize={12}
                                dy={6}
                              >
                                {parts[0]}
                              </text>
                              <text
                                textAnchor="middle"
                                fill="#888"
                                fontSize={12}
                                dy={18}
                              >
                                {parts[1]}
                              </text>
                            </>
                          ) : (
                            <text
                              textAnchor="middle"
                              fill="#888"
                              fontSize={12}
                              dy={6}
                            >
                              {tick.value}
                            </text>
                          )}
                        </g>
                      );
                    },
                  }}
                  axisLeft={{
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: 0,
                    legend: "Frecuencia de unidades de 1 km²",
                    legendPosition: "middle",
                    legendOffset: -50,
                    tickValues: 6,
                    format: (value) =>
                      value >= 1000 ? `${value / 1000}k` : value,
                  }}
                  tooltip={({ indexValue, value }) => (
                    <div
                      style={{
                        padding: "6px 12px",
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        color: "#333",
                        width: "150px",
                      }}
                    >
                      <strong>{value}</strong> celdas de 1km² registran{" "}
                      <strong>{indexValue}</strong> especie
                      {Number(indexValue) === 1 ? "" : "s"}
                    </div>
                  )}
                />
              </div>
            </GetSearchIndicatorInfo>
          )}
        </div>
      )}

      <TextBoxes
        addToReportWrapperId="ObservedRichness"
        texts={richness.texts}
        download={{
          data: controllerRef.current.getDownloadData({
            current: richness.areaTableData,
            national: richness.nationalTableData,
          }),
          filename: `cifrasRiquezaObservada_${areaType?.label}_${areaId?.name}_vs_contextoPaís.csv`,
        }}
        isInfoOpen={richness.isInfoOpen}
        toggleInfo={() =>
          updateRichness({
            type: ObservedRichnessUpdated.SHOW_INFO,
          })
        }
      />
    </div>
  );
}

function ObservedRichnessTable({
  data,
  isReference,
  areaId,
}: {
  data: ObservedRichnessDataType | null;
  isReference?: boolean;
  areaId?: AreaIdBasic;
}) {
  const stackedData = useMemo(() => {
    if (!data) {
      return [];
    }
    return transformDataToSmallStackedBarData(data);
  }, [data]);

  return !data ? null : (
    <div className="mb-4 border-b border-grey">
      <address className="flex gap-1 items-center text-sm text-grey-dark font-normal not-italic uppercase my-2">
        <MapPin size={16} />
        {isReference ? "Colombia" : areaId?.name}
      </address>

      <ul
        className={cn(
          "flex flex-wrap gap-2",
          "*:first:flex-none *:border *:border-grey *:p-2 *:rounded-lg *:grow",
          "[&_li>span:first-child]:text-[#888] [&_li>span:first-child]:text-sm [&_li>span:first-child]:font-normal [&_li>span:first-child]:flex [&_li>span:first-child]:gap-1 [&_li>span:first-child]:items-baseline",
          "[&_li_svg]:shrink-0 [&_li_svg]:translate-y-0.5",
        )}
      >
        <li
          className={cn(
            "w-full",
            isReference ? "flex gap-2 justify-between" : "",
          )}
          title={"Total especies observadas"}
        >
          <span>
            <LeafIcon size={14} /> Total especies observadas
          </span>
          <span
            className={cn("font-black", isReference ? "text-lg" : "text-4xl")}
          >
            {data.total.toLocaleString(LOCALE)}
          </span>
        </li>
        <li title={"Especies endémicas"}>
          <span>
            <MapPin size={14} /> Endémicas
          </span>
          <span
            className={cn("font-black", isReference ? "text-base" : "text-xl")}
          >
            {data.endemic}
          </span>
        </li>
        <li title={"Amenazadas"}>
          <span>
            <CircleAlert size={14} /> Amenazadas
          </span>
          <span
            className={cn("font-black", isReference ? "text-base" : "text-xl")}
          >
            {data.threatenedTotal}
          </span>
        </li>
        <li title={"Endémicas amenazadas"}>
          <span>
            <CircleAlert size={14} /> Endémicas amenazadas
          </span>
          <span
            className={cn("font-black", isReference ? "text-base" : "text-xl")}
          >
            {data.endemicThreatened}
          </span>
        </li>
        <li title={"Invasoras"}>
          <span>
            <LayersIcon size={14} /> Invasoras
          </span>
          <span
            className={cn("font-black", isReference ? "text-base" : "text-xl")}
          >
            {data.invasive}
          </span>
        </li>
      </ul>

      <div className="mt-2">
        <span className="flex gap-2 justify-between text-[#888] text-sm font-normal">
          <span>Amenazadas por categoría UICN</span>
          <span className="text-grey-dark font-bold">
            {data.threatenedTotal.toLocaleString(LOCALE)}
          </span>
        </span>

        <div className="w-full">
          <SmallStackedBar
            loadStatus={null}
            data={stackedData}
            height={24}
            units="especies"
            colors={(key) => threatenedSpeciesCustomColorMap[key] ?? "#FF0000"}
            padding={0}
            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
            forceFullPercent={true}
          />
        </div>

        <GraphLegend
          keys={OBSERVED_RICHNESS_GRAPH_KEYS}
          customColorMap={threatenedSpeciesCustomColorMap}
          renderValues={data.barValues}
          className="justify-start px-0 pt-1 text-[#888]!"
        />
      </div>
    </div>
  );
}
