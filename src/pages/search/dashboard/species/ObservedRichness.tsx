import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/shadCN/component/select";
import { ShortInfo } from "@composites/ShortInfo";
import TextBoxes from "@ui/TextBoxes";
import { ErrorsList } from "@ui/LabelingWithErrors";

import InfoIcon from "@mui/icons-material/Info";
import { IconTooltip } from "@ui/Tooltips";

import {
  ObservedRichnessController,
  type ObservedRichnessDataType,
} from "pages/search/dashboard/species/ObservedRichnessController";
import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import type { TextsObject } from "pages/search/types/texts";
import { speciesGroupLabels } from "pages/search/dashboard/species/commonDictionaries";
import { CircleAlert, LayersIcon, LeafIcon, MapPin } from "lucide-react";
import { LOCALE } from "@config/monitoring";
import { cn } from "@ui/shadCN/lib/utils";
import { GraphLegend } from "@ui/GraphLegend";
import SmallStackedBar, {
  type SmallStackedBarData,
} from "@composites/charts/SmallStackedBar";
import { getMetricTexts } from "pages/search/utils/texts";
import { ResponsiveLine } from "@nivo/line";
import { getSeriesColor } from "@utils/color";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";
import type { MetricTypesMap } from "pages/search/types/metrics";

const OBSERVED_RICHNESS_GRAPH_KEYS = ["CR", "EN", "VU"];

const customColorMap: Record<string, string> = {
  CR: "#5c150c",
  EN: "#bc472b",
  VU: "#d98242",
};

enum ObservedRichnessUpdated {
  LOADING = "loading",
  ERRORS = "errors",
  STARTING_INFO = "loaded",
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
      type: ObservedRichnessUpdated.STARTING_INFO;
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

function transformObservedRichnessSerie(
  serie: MetricTypesMap["richness"],
): ObservedRichnessGraphSerie {
  const pairedData = serie.bin_edges.map((edge, idx) => ({
    x: Number(edge.toFixed(2)),
    y: serie.frequency[idx] ?? serie.frequency[idx - 1],
  }));

  return { id: String(serie.id), data: pairedData };
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

    case ObservedRichnessUpdated.STARTING_INFO:
      return {
        ...state,
        isLoading: false,
        errors: [],
        taxonomicGroupsAvailable: action.payload.taxonomicGroupsAvailable,
        nationalTableData: action.payload.nationalData,
        areaTableData: action.payload.areaData,
        texts: action.payload.texts,
        areaSerie: transformObservedRichnessSerie(action.payload.areaSerie),
        currentTaxonomicGroup: "all",
      };

    case ObservedRichnessUpdated.TAXONOMIC_GROUP:
      return {
        ...state,
        isLoading: false,
        errors: [],
        nationalTableData: action.payload.nationalData,
        areaTableData: action.payload.areaData,
        areaSerie: transformObservedRichnessSerie(action.payload.areaSerie),
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

  const controller = useRef(new ObservedRichnessController());

  if (areaType && areaId) {
    controller.current.setArea(areaType.id, areaId.id);
  }

  useEffect(() => {
    updateRichness({ type: ObservedRichnessUpdated.LOADING, isLoading: true });
    searchMapDispatch({
      type: SearchUpdated.LOADING_LAYER,
      loadingLayer: true,
    });

    Promise.all([
      controller.current.getORichnessTaxonomicGroups(),
      getMetricTexts("statsOnSpecies"),
      areaType?.id !== "custom" ? controller.current.getAreaData() : null,
      controller.current.getNationalData(),
      controller.current.getRichnessSerie(),
      controller.current.getRichnessLayer(),
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
          updateRichness({
            type: ObservedRichnessUpdated.STARTING_INFO,
            payload: {
              taxonomicGroupsAvailable: groups,
              texts: texts,
              areaData: areaData,
              nationalData: nationalData,
              areaSerie: areaSerie,
            },
          });

          searchMapDispatch({
            type: SearchUpdated.RASTER_LAYERS,
            payload: {
              rasterLayers: areaRichnessMap,
              mapTitle: {
                name: `Riqueza observada en ${areaId?.name}`,
                gradientData: {
                  from: 0,
                  to: 1,
                  colors: ["#ff0000", "#0000ff"],
                },
              },
            },
          });
        },
      )
      .catch((err) => {
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
  }, [areaType?.id, searchMapDispatch, areaId?.name]);

  const handleTaxonomicGroupChange = useCallback(
    (taxonomicGroup: string) => {
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
        areaType?.id !== "custom"
          ? controller.current.getAreaData(groupFilter)
          : null,
        controller.current.getNationalData(groupFilter),
        controller.current.getRichnessSerie(groupFilter),
        controller.current.getRichnessLayer(groupFilter),
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

          searchMapDispatch({
            type: SearchUpdated.RASTER_LAYERS,
            payload: {
              rasterLayers: areaRichnessMap,
              mapTitle: {
                name: groupFilter
                  ? `Riqueza observada de ${groupFilter} en ${areaId?.name}`
                  : `Riqueza observada en ${areaId?.name}`,
                gradientData: {
                  from: 0,
                  to: 1,
                  colors: ["#ff0000", "#0000ff"],
                },
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

  return (
    <>
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
          <ShortInfo
            description={`<p>${richness.texts.info}</p>`}
            className="graphinfo2"
            collapseButton={false}
          />
        )}

        {Object.keys(richness.taxonomicGroupsAvailable).length > 1 && (
          <Select
            value={richness.currentTaxonomicGroup}
            onValueChange={(val) => handleTaxonomicGroupChange(val)}
          >
            <SelectTrigger id="gap-species-group" className="border-grey">
              <SelectValue placeholder="Grupo Taxonómico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los grupos</SelectItem>
              {richness.taxonomicGroupsAvailable.map((group) => (
                <SelectItem key={`selectGroup-${group}`} value={group}>
                  {speciesGroupLabels[group] ?? group}
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
              <ObservedRichnessTable data={richness.areaTableData} />
              <ObservedRichnessTable
                data={richness.nationalTableData}
                isReference={richness.areaTableData !== null}
              />
            </>
          )}
        </div>

        {richness.areaSerie && (
          <div className="graphcontainer pt6">
            <h4>Número de especies registradas por km2</h4>
            <div className="w-full aspect-video">
              <GapLineChart data={richness.areaSerie} />
            </div>
          </div>
        )}

        <TextBoxes
          consText={richness.texts.cons}
          metoText={richness.texts.meto}
          quoteText={richness.texts.quote}
          downloadData={controller.current.getDownloadData({
            current: richness.areaTableData,
            national: richness.nationalTableData,
          })}
          downloadName={`cifrasRiquezaObservada_${areaType?.label}_${areaId?.name}_vs_contextoPaís.csv`}
          isInfoOpen={richness.isInfoOpen}
          toggleInfo={() =>
            updateRichness({
              type: ObservedRichnessUpdated.SHOW_INFO,
            })
          }
        />
      </div>
    </>
  );
}

const GapLineChart = memo(function GapLineChart({
  data,
}: {
  data: ObservedRichnessGraphSerie;
}) {
  return (
    <ResponsiveLine
      data={[data]}
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
    />
  );
});

function buildSmallStackedBarData(
  data: ObservedRichnessDataType,
): SmallStackedBarData[] {
  const totalThreatened = data.threatenedTotal || 1;

  return OBSERVED_RICHNESS_GRAPH_KEYS.map((key) => {
    const rawVal = data.barValues[key as keyof typeof data.barValues] ?? 0;

    return {
      key,
      label: `${key}:${rawVal.toLocaleString(LOCALE)}`,
      area: rawVal,
      percentage: (rawVal / totalThreatened) * 100,
    };
  });
}

function ObservedRichnessTable({
  data,
  isReference,
}: {
  data: ObservedRichnessDataType | null;
  isReference?: boolean;
}) {
  const { areaId } = useSearchStateCTX();

  const stackedData = useMemo(() => {
    if (!data) {
      return [];
    }
    return buildSmallStackedBarData(data);
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
            colors={(key) => customColorMap[key] ?? "#FF0000"}
            padding={0}
            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
            forceFullPercent={true}
          />
        </div>

        <GraphLegend
          keys={OBSERVED_RICHNESS_GRAPH_KEYS}
          customColorMap={customColorMap}
          renderValues={data.barValues}
          className="justify-start px-0 pt-1 text-[#888]!"
        />
      </div>
    </div>
  );
}
