import { useEffect, useRef, useReducer, useMemo } from "react";
import InfoIcon from "@mui/icons-material/Info";

import { type CartesianMarkerProps } from "@nivo/core";
import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import TextBoxes from "@ui/TextBoxes";
import { Lines } from "@composites/charts/Lines";
import { GraphLegend } from "@ui/GraphLegend";
import { LOCALE } from "@config/monitoring";

import type { TimelineHF } from "pages/search/types/humanFootprint";
import type { TextsObject } from "pages/search/types/texts";
import type { RasterLayer } from "pages/search/types/layers";
import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import { processLineSeriesDataToCsv } from "pages/search/utils/processDataCsv";
import { TimelineFootprintController } from "pages/search/dashboard/landscape/humanFootprint/TimelineFootprintController";
import { matchColor } from "pages/search/utils/matchColor";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";
import { getMetricTexts } from "pages/search/utils/texts";

export const hfTimelineLUT = [
  { key: "aTotal", label: "Área consulta", source: "poligono" },
  { key: "paramo", label: "Páramo", source: "paramo" },
  { key: "dryForest", label: "Bosque Seco Tropical", source: "bosqueSeco" },
  { key: "wetland", label: "Humedal", source: "humedal" },
] as const;

export type SEKey = (typeof hfTimelineLUT)[number]["key"];
export type SELabel = (typeof hfTimelineLUT)[number]["label"];
export type SESource = (typeof hfTimelineLUT)[number]["source"];

export interface hfTimelineSeries {
  key: SEKey;
  label: SELabel;
  data: { x: string; y: number }[];
}

interface hfTimelineState {
  showInfoGraph: boolean;
  timelineData: hfTimelineSeries[];
  message: MessageWrapperType;
  selectedSE: SELabel;
  seExtension: Partial<Record<SESource, number>>;
  seLayers: RasterLayer[];
  texts: { hfTimeline: TextsObject };
}

enum TimelineHFUpdated {
  TOGGLE_TEXTS = "toggleInfoGraph",
  TIMELINE_VALUES = "timelineValuesSucceeded",
  TIMELINE_ERROR = "timelineValuesFailed",
  SELECT_SE = "selectSE",
  SE_LAYERS = "setLayers",
}

type hfTimelineActions =
  | {
      type: TimelineHFUpdated.TOGGLE_TEXTS;
      forceState?: boolean;
    }
  | {
      type: TimelineHFUpdated.TIMELINE_VALUES;
      payload: {
        timelineData: TimelineHF[];
        texts?: TextsObject;
        seValues?: Record<string, number>;
      };
    }
  | {
      type: TimelineHFUpdated.TIMELINE_ERROR;
      error?: string;
    }
  | {
      type: TimelineHFUpdated.SELECT_SE;
      seLabel: string | null;
    }
  | {
      type: TimelineHFUpdated.SE_LAYERS;
      layers: RasterLayer[];
    };

function transformTimelineData(data: TimelineHF[]): hfTimelineSeries[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const orderedData = [...data].sort(
    (left, right) => Number(left.id) - Number(right.id),
  );

  return hfTimelineLUT.map(({ key, label, source }) => ({
    key,
    label,
    data: orderedData.map((row) => ({ x: row.id, y: row[source] })),
  }));
}

function reducer(
  state: hfTimelineState,
  action: hfTimelineActions,
): hfTimelineState {
  switch (action.type) {
    case TimelineHFUpdated.TOGGLE_TEXTS:
      return {
        ...state,
        showInfoGraph:
          action.forceState !== undefined
            ? action.forceState
            : !state.showInfoGraph,
      };

    case TimelineHFUpdated.TIMELINE_VALUES:
      return {
        ...state,
        ...(action.payload.texts !== undefined
          ? { texts: { hfTimeline: action.payload.texts } }
          : {}),
        timelineData: transformTimelineData(action.payload.timelineData),
        ...(action.payload?.seValues
          ? { seExtension: action.payload.seValues }
          : {}),
        message: null,
      };

    case TimelineHFUpdated.SELECT_SE:
      return { ...state, selectedSE: action.seLabel as SELabel };

    case TimelineHFUpdated.TIMELINE_ERROR:
      return {
        ...state,
        timelineData: [],
        message: "no-data",
      };

    case TimelineHFUpdated.SE_LAYERS:
      return { ...state, seLayers: action.layers };

    default:
      console.warn("Unknown requested hfReducer action");
      return state;
  }
}

const initialState: hfTimelineState = {
  showInfoGraph: true,
  timelineData: [],
  message: "loading",
  selectedSE: "Área consulta",
  seExtension: {},
  texts: {
    hfTimeline: { info: "", cons: "", meto: "", quote: "" },
  },
  seLayers: [],
};

const hfTimelineColors = (key: string | number) =>
  matchColor("hfTimeline")(key) ?? "#3d3c48";

export function TimelineFootprint() {
  const { areaType, areaId } = useSearchStateCTX();
  const searchMapDispatch = useSearchDispatchCTX();
  const [timelineHFState, timelineHFDispatch] = useReducer(
    reducer,
    initialState,
  );

  const {
    showInfoGraph,
    timelineData,
    seExtension,
    message,
    texts,
    selectedSE,
    seLayers: _layers,
  } = timelineHFState;

  const controllerRef = useRef(new TimelineFootprintController());

  useEffect(() => {
    let isCurrent = true;

    if (!areaType?.id || !areaId?.id) {
      return () => {
        isCurrent = false;
        controller.cancelActiveRequests();
      };
    }

    searchMapDispatch({
      type: SearchUpdated.LOADING_LAYER,
      loadingLayer: true,
    });

    const controller = controllerRef.current;
    controller.setArea(areaType.id, areaId.id);

    Promise.all([
      controller.getTimelineData(),
      getMetricTexts("timelineHF"),
      controller.getSEData(),
      // controller.getLayer(),
    ])
      .then(([timelineRawData, timelineTexts, seData]) => {
        timelineHFDispatch({
          type: TimelineHFUpdated.TIMELINE_VALUES,
          payload: {
            timelineData: timelineRawData,
            texts: timelineTexts,
            seValues: seData,
          },
        });

        searchMapDispatch({
          type: SearchUpdated.SHOW_AREA_LAYER,
          showAreaLayer: true,
        });

        searchMapDispatch({
          type: SearchUpdated.LOADING_LAYER,
          loadingLayer: false,
        });

        // searchMapDispatch({
        //   type: SearchUpdated.RASTER_LAYERS,
        //   payload: {
        //     rasterLayers: baseLayer,
        //     mapTitle: {
        //       name: "HH - Huella humana en el tiempo y ecosistemas estratégicos (EE)",
        //     },
        //   },
        // });
      })
      .catch((error) => {
        if (!isCurrent) {
          return;
        }
        timelineHFDispatch({ type: TimelineHFUpdated.TIMELINE_ERROR });
        searchMapDispatch({
          type: SearchUpdated.LAYER_ERROR,
          layerError: error instanceof Error ? error.message : String(error),
        });
      });

    return () => {
      isCurrent = false;
      controller.cancelActiveRequests();
    };
  }, [areaType, areaId, searchMapDispatch]);

  const customColorMap = useMemo(
    () =>
      timelineData.reduce<Record<string, string>>((acc, item) => {
        acc[item.label] = hfTimelineColors(item.key);
        return acc;
      }, {}),
    [timelineData],
  );

  const toggleInfoGraph = () => {
    timelineHFDispatch({ type: TimelineHFUpdated.TOGGLE_TEXTS });
  };

  const handleEcosystemSelection = (ecosystemLabel: string) => {
    const ecosystem = hfTimelineLUT.find((e) => e.label === ecosystemLabel);

    const seLabel =
      !ecosystem || ecosystem.key === "aTotal" ? null : ecosystem.label;

    timelineHFDispatch({
      type: TimelineHFUpdated.SELECT_SE,
      seLabel,
    });
  };

  const activeSE = hfTimelineLUT.find((item) => item.label === selectedSE);
  const seExtensionvalue = activeSE ? seExtension[activeSE.source] : undefined;

  return !areaType || !areaId ? null : (
    <div className="graphcontainer pt6">
      <h2>
        <IconTooltip title="Interpretación">
          <span className="iconWrapper">
            <InfoIcon
              className={`metrics-info-icon${showInfoGraph ? " activeBox" : ""}`}
              onClick={toggleInfoGraph}
            />
          </span>
        </IconTooltip>
      </h2>

      {showInfoGraph && (
        <ShortInfo
          description={`<p>${texts.hfTimeline.info}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}

      <h6>Huella humana en el tiempo comparada con EE</h6>
      <p>Haz clic en un ecosistema para ver su comportamiento</p>

      <div>
        <Lines
          colors={hfTimelineColors}
          seriesData={timelineData}
          loadStatus={message}
          markers={hfTimelineMarkers}
          showLegend={false}
          enablePoints={true}
        />

        <GraphLegend
          keys={hfTimelineLUT.map((item) => item.label)}
          isBar={false}
          customColorMap={customColorMap}
          onClick={handleEcosystemSelection}
          selected={selectedSE ? [selectedSE] : []}
          className="justify-center"
        />

        {selectedSE && seExtensionvalue && (
          <div>
            <h6>{`${selectedSE} dentro de la unidad de consulta`}</h6>
            <h5>{`${Math.round(seExtensionvalue).toLocaleString(LOCALE)} ha`}</h5>
          </div>
        )}

        <TextBoxes
          consText={texts.hfTimeline.cons}
          metoText={texts.hfTimeline.meto}
          quoteText={texts.hfTimeline.quote}
          downloadData={processLineSeriesDataToCsv(timelineData)}
          downloadName={`timeline_hf_${areaType.id}_${areaId.id}.csv`}
          isInfoOpen={showInfoGraph}
          toggleInfo={toggleInfoGraph}
        />
      </div>
    </div>
  );
}

const hfTimelineMarkers: CartesianMarkerProps[] = [
  {
    axis: "y",
    value: 15,
    legend: "Natural",
    lineStyle: { stroke: "#909090", strokeWidth: 1 },
    textStyle: { fill: "#3fbf9f", fontSize: 9 },
    legendPosition: "bottom-right",
  },
  {
    axis: "y",
    value: 40,
    legend: "Baja",
    lineStyle: { stroke: "#909090", strokeWidth: 1 },
    textStyle: { fill: "#d5a529", fontSize: 9 },
    legendPosition: "bottom-right",
  },
  {
    axis: "y",
    value: 60,
    legend: "Media",
    lineStyle: { stroke: "#909090", strokeWidth: 1 },
    textStyle: { fill: "#e66c29", fontSize: 9 },
    legendPosition: "bottom-right",
  },
  {
    axis: "y",
    value: 100,
    legend: "Alta",
    lineStyle: { stroke: "#909090", strokeWidth: 1 },
    textStyle: { fill: "#cf324e", fontSize: 9 },
    legendPosition: "bottom-right",
  },
];

// const clickOnGraph = async (selectedKey: string) => {
//   const layerDescription =
//     selectedKey === "aTotal"
//       ? "HH - Huella humana en el tiempo y ecosistemas estratégicos (EE)"
//       : `HH - Huella humana en el tiempo - ${seTitle[selectedKey as keyof SEKeys]}`;
//
//   if (selectedKey === "aTotal") {
//     hfTimelineDispatch({
//       type: HFTimelineUpdated.ECOSYSTEM,
//       ecosystem: null,
//     });
//
//     searchMapDispatch({
//       type: SearchUpdated.RASTER_LAYERS,
//       payload: {
//         rasterLayers: layers.filter((layer) =>
//           ["timelineHF"].includes(layer.id),
//         ),
//         mapTitle: { name: layerDescription },
//       },
//     });
//     return;
//   }
//
//   searchMapDispatch({
//     type: SearchUpdated.LOADING_LAYER,
//     loadingLayer: true,
//   });
//
//   try {
//     const isLayerAvailable = layers.some((layer) => layer.id === selectedKey);
//     let updatedLayers = layers;
//
//     if (!isLayerAvailable) {
//       const seLayer = await controllerRef.current.getSELayer(
//         selectedKey as keyof Omit<SEKeys, "aTotal">,
//       );
//       updatedLayers = [...layers, ...seLayer];
//       hfTimelineDispatch({
//         type: HFTimelineUpdated.LAYERS,
//         layers: updatedLayers,
//       });
//     }
//
//     searchMapDispatch({
//       type: SearchUpdated.RASTER_LAYERS,
//       payload: {
//         rasterLayers: updatedLayers.filter((layer) =>
//           ["timelineHF", selectedKey].includes(layer.id),
//         ),
//         mapTitle: { name: layerDescription },
//       },
//     });
//   } catch (error) {
//     searchMapDispatch({
//       type: SearchUpdated.LAYER_ERROR,
//       layerError: error instanceof Error ? error.message : String(error),
//     });
//   }
// };
