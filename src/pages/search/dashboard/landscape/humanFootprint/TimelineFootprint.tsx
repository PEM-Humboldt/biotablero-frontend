import { useEffect, useRef, useReducer } from "react";
import InfoIcon from "@mui/icons-material/Info";

import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import { formatNumber } from "@utils/format";
import processDataCsv from "pages/search/utils/processDataCsv";
import TextBoxes from "@ui/TextBoxes";

import type { TimelineHF } from "pages/search/types/humanFootprint";
import type { SEDetails } from "pages/search/types/ecosystems";
import type { TextsObject } from "pages/search/types/texts";
import Lines from "@composites/charts/Lines";
import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { type CartesianMarkerProps } from "@nivo/core";
import { TimelineFootprintController } from "pages/search/dashboard/landscape/humanFootprint/TimelineFootprintController";
import type { RasterLayer } from "pages/search/types/layers";
import { matchColor } from "pages/search/utils/matchColor";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";
import { getMetricTexts } from "pages/search/utils/texts";

type SEKeys = Record<"paramo" | "dryForest" | "wetland" | "aTotal", string>;

const seTitle: SEKeys = {
  paramo: "Páramos",
  dryForest: "Bosque seco tropical",
  wetland: "Humedales",
  aTotal: "Total",
};

const getLabel = (type: string): string => {
  switch (type) {
    case "paramo":
      return "Páramo";
    case "wetland":
      return "Humedal";
    case "dryForest":
      return "Bosque Seco Tropical";
    default:
      return "Área consulta";
  }
};

type TimelineSeriesKey = "aTotal" | "paramo" | "dryForest" | "wetland";
type TimelineField = "poligono" | "paramo" | "bosqueSeco" | "humedal";

interface hfTimelineSeries {
  key: TimelineSeriesKey;
  label: string;
  data: { x: string; y: number }[];
}

const hfTimelineSeriesConfig: {
  key: TimelineSeriesKey;
  label: string;
  source: TimelineField;
}[] = [
  { key: "aTotal", label: "Área consulta", source: "poligono" },
  { key: "paramo", label: "Páramo", source: "paramo" },
  { key: "dryForest", label: "Bosque Seco Tropical", source: "bosqueSeco" },
  { key: "wetland", label: "Humedal", source: "humedal" },
];

interface SEDetailsExt extends SEDetails {
  type: string;
}

interface hfTimelineState {
  showInfoGraph: boolean;
  timelineData: hfTimelineSeries[];
  message: MessageWrapperType;
  selectedEcosystem: SEDetailsExt | null;
  texts: { hfTimeline: TextsObject };
  layers: RasterLayer[];
}

enum HFTimelineUpdated {
  TOGGLE_TEXTS = "toggleInfoGraph",
  TIMELINE_VALUES = "timelineValuesSucceeded",
  TIMELINE_ERROR = "timelineValuesFailed",
  ECOSYSTEM = "setSelectedEcosystem",
  TEXTS = "setTexts",
  LAYERS = "setLayers",
}

type hfTimelineActions =
  | {
      type: HFTimelineUpdated.TOGGLE_TEXTS;
      forceState?: boolean;
    }
  | {
      type: HFTimelineUpdated.TIMELINE_VALUES;
      payload: { timelineData: TimelineHF[]; texts?: TextsObject };
    }
  | {
      type: HFTimelineUpdated.TIMELINE_ERROR;
      error?: string;
    }
  | {
      type: HFTimelineUpdated.ECOSYSTEM;
      ecosystem: SEDetailsExt | null;
    }
  | {
      type: HFTimelineUpdated.TEXTS;
      texts: TextsObject;
    }
  | {
      type: HFTimelineUpdated.LAYERS;
      layers: RasterLayer[];
    };

function transformTimelineData(data: TimelineHF[]): hfTimelineSeries[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const orderedData = [...data].sort(
    (left, right) => Number(left.id) - Number(right.id),
  );

  return hfTimelineSeriesConfig.map(({ key, label, source }) => ({
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
    case HFTimelineUpdated.TOGGLE_TEXTS:
      return {
        ...state,
        showInfoGraph:
          action.forceState !== undefined
            ? action.forceState
            : !state.showInfoGraph,
      };

    case HFTimelineUpdated.TIMELINE_VALUES:
      return {
        ...state,
        ...(action.payload.texts !== undefined
          ? { texts: { hfTimeline: action.payload.texts } }
          : {}),
        timelineData: transformTimelineData(action.payload.timelineData),
        message: null,
      };

    case HFTimelineUpdated.TIMELINE_ERROR:
      return {
        ...state,
        timelineData: [],
        message: "no-data",
      };

    case HFTimelineUpdated.ECOSYSTEM:
      return { ...state, selectedEcosystem: action.ecosystem };

    // TODO: Ver si este case es necesario
    case HFTimelineUpdated.TEXTS:
      return { ...state, texts: { hfTimeline: action.texts } };

    case HFTimelineUpdated.LAYERS:
      return { ...state, layers: action.layers };

    default:
      console.warn("Unknown requested searchReducer action");
      return state;
  }
}

const initialState: hfTimelineState = {
  showInfoGraph: true,
  timelineData: [],
  message: "loading",
  selectedEcosystem: null,
  texts: {
    hfTimeline: { info: "", cons: "", meto: "", quote: "" },
  },
  layers: [],
};

const hfTimelineColors = (key: string | number) =>
  matchColor("hfTimeline")(key) ?? "#3d3c48";

export function TimelineFootprint() {
  const { areaType, areaId } = useSearchStateCTX();
  const searchMapDispatch = useSearchDispatchCTX();
  const [hfTimelineState, hfTimelineDispatch] = useReducer(
    reducer,
    initialState,
  );

  const {
    showInfoGraph,
    timelineData,
    selectedEcosystem,
    message,
    texts,
    layers,
  } = hfTimelineState;

  const controllerRef = useRef(new TimelineFootprintController());

  const timelineLinesKey = timelineData
    .map(
      ({ key, data }) =>
        `${key}:${data.map(({ x, y }) => `${x}-${y}`).join(",")}`,
    )
    .join("|");

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
    controller.setArea(areaType.id, areaId.id.toString());

    Promise.all([
      controller.getTimelineData(),
      getMetricTexts("timelineHF"),
      // controller.getLayer(),
    ])
      .then(([timelineRawData, timelineTexts]) => {
        hfTimelineDispatch({
          type: HFTimelineUpdated.TIMELINE_VALUES,
          payload: {
            timelineData: timelineRawData,
            texts: timelineTexts,
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
        hfTimelineDispatch({ type: HFTimelineUpdated.TIMELINE_ERROR });
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

  const toggleInfoGraph = () => {
    hfTimelineDispatch({ type: HFTimelineUpdated.TOGGLE_TEXTS });
  };

  const clickOnGraph = async (selectedKey: string) => {
    const layerDescription =
      selectedKey === "aTotal"
        ? "HH - Huella humana en el tiempo y ecosistemas estratégicos (EE)"
        : `HH - Huella humana en el tiempo - ${seTitle[selectedKey as keyof SEKeys]}`;

    if (selectedKey === "aTotal") {
      hfTimelineDispatch({
        type: HFTimelineUpdated.ECOSYSTEM,
        ecosystem: null,
      });

      searchMapDispatch({
        type: SearchUpdated.RASTER_LAYERS,
        payload: {
          rasterLayers: layers.filter((layer) =>
            ["timelineHF"].includes(layer.id),
          ),
          mapTitle: { name: layerDescription },
        },
      });
      return;
    }

    searchMapDispatch({
      type: SearchUpdated.LOADING_LAYER,
      loadingLayer: true,
    });

    try {
      const isLayerAvailable = layers.some((layer) => layer.id === selectedKey);
      let updatedLayers = layers;

      if (!isLayerAvailable) {
        const seLayer = await controllerRef.current.getSELayer(
          selectedKey as keyof Omit<SEKeys, "aTotal">,
        );
        updatedLayers = [...layers, ...seLayer];
        hfTimelineDispatch({
          type: HFTimelineUpdated.LAYERS,
          layers: updatedLayers,
        });
      }

      searchMapDispatch({
        type: SearchUpdated.RASTER_LAYERS,
        payload: {
          rasterLayers: updatedLayers.filter((layer) =>
            ["timelineHF", selectedKey].includes(layer.id),
          ),
          mapTitle: { name: layerDescription },
        },
      });
    } catch (error) {
      searchMapDispatch({
        type: SearchUpdated.LAYER_ERROR,
        layerError: error instanceof Error ? error.message : String(error),
      });
    }
  };

  if (!areaType || !areaId) {
    return null;
  }

  return (
    <div className="graphcontainer pt6">
      <h2>
        <IconTooltip title="Interpretación">
          <InfoIcon
            className={`graphinfo${showInfoGraph ? " activeBox" : ""}`}
            onClick={toggleInfoGraph}
          />
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
          key={timelineLinesKey}
          colors={hfTimelineColors}
          data={timelineData}
          loadStatus={message}
          markers={hfTimelineMarkers}
          onClickGraphHandler={(selectedKey: string) => {
            void clickOnGraph(selectedKey);
          }}
        />
        {selectedEcosystem && (
          <div>
            <h6>
              {`${getLabel(selectedEcosystem.type)} dentro de la unidad de consulta`}
            </h6>
            <h5>{`${formatNumber(selectedEcosystem.total_area, 2)} ha`}</h5>
          </div>
        )}
        <TextBoxes
          consText={texts.hfTimeline.cons}
          metoText={texts.hfTimeline.meto}
          quoteText={texts.hfTimeline.quote}
          downloadData={processDataCsv(timelineData)}
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
