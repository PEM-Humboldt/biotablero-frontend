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
  {
    key: "aTotal",
    label: "Área consulta",
    classId: "poligono",
    itemId: "Humedales30",
  },
  {
    key: "paramo",
    label: "Páramo",
    classId: "paramo",
    itemId: "Paramos30",
  },
  {
    key: "tropicalDryForest",
    label: "Bosque Seco Tropical",
    classId: "bosqueSeco",
    itemId: "BosqueSeco1000",
  },
  {
    key: "wetland",
    label: "Humedal",
    classId: "humedal",
  },
] as const;

export type SEKey = (typeof hfTimelineLUT)[number]["key"];
export type SELabel = (typeof hfTimelineLUT)[number]["label"];
export type SESource = (typeof hfTimelineLUT)[number]["classId"];

export type TimelineFPSeries = {
  key: SEKey;
  label: SELabel;
  data: { x: string; y: number }[];
};

type TimelineFPState = {
  isLoading: boolean;
  showInfoGraph: boolean;
  timelineData: TimelineFPSeries[];
  message: MessageWrapperType;
  selectedSE: SELabel;
  seExtension: Partial<Record<SESource, number>>;
  texts: { hfTimeline: TextsObject };
};

enum TimelineFPUpdated {
  SHOW_INFO = "toggleInfoGraph",
  SERIES = "timelineValuesSucceeded",
  ERRORS_FOUND = "timelineValuesFailed",
  CURRENT_SE = "selectSE",
}

type TimelineFPActions =
  | {
      type: TimelineFPUpdated.SHOW_INFO;
      forceState?: boolean;
    }
  | {
      type: TimelineFPUpdated.SERIES;
      payload: {
        timelineData: TimelineHF[];
        texts?: TextsObject;
        seValues?: Record<string, number>;
      };
    }
  | {
      type: TimelineFPUpdated.ERRORS_FOUND;
      error?: string;
    }
  | {
      type: TimelineFPUpdated.CURRENT_SE;
      seLabel: string | null;
    };

function transformTimelineData(data: TimelineHF[]): TimelineFPSeries[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const orderedData = [...data].sort(
    (left, right) => Number(left.id) - Number(right.id),
  );

  return hfTimelineLUT.map(({ key, label, classId: source }) => ({
    key,
    label,
    data: orderedData.map((row) => ({ x: row.id, y: row[source] })),
  }));
}

function timelineFPReducer(
  state: TimelineFPState,
  action: TimelineFPActions,
): TimelineFPState {
  switch (action.type) {
    case TimelineFPUpdated.SHOW_INFO:
      return {
        ...state,
        showInfoGraph:
          action.forceState !== undefined
            ? action.forceState
            : !state.showInfoGraph,
      };

    case TimelineFPUpdated.SERIES:
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

    case TimelineFPUpdated.CURRENT_SE:
      return { ...state, selectedSE: action.seLabel as SELabel };

    case TimelineFPUpdated.ERRORS_FOUND:
      return {
        ...state,
        timelineData: [],
        message: "no-data",
      };

    default:
      console.warn("Unknown requested hfReducer action");
      return state;
  }
}

const timelineFPInitialState: TimelineFPState = {
  isLoading: true,
  showInfoGraph: false,
  timelineData: [],
  message: "loading",
  selectedSE: "Área consulta",
  seExtension: {},
  texts: {
    hfTimeline: { info: "", cons: "", meto: "", quote: "" },
  },
};

const timelineFPColors = (key: string | number) =>
  matchColor("hfTimeline")(key) ?? "#3d3c48";

export function TimelineFootprint() {
  const { areaType, areaId, rasterLayers } = useSearchStateCTX();
  const searchMapDispatch = useSearchDispatchCTX();
  const [timelineHFState, timelineHFDispatch] = useReducer(
    timelineFPReducer,
    timelineFPInitialState,
  );

  const {
    showInfoGraph,
    timelineData,
    seExtension,
    message,
    texts,
    selectedSE,
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
      controller.getSELayer(),
    ])
      .then(([timelineRawData, timelineTexts, seData, layers]) => {
        timelineHFDispatch({
          type: TimelineFPUpdated.SERIES,
          payload: {
            timelineData: timelineRawData,
            texts: timelineTexts,
            seValues: seData,
          },
        });

        searchMapDispatch({
          type: SearchUpdated.WILDCARD,
          payload: {
            showAreaLayer: true,
            rasterLayers: layers,
            mapTitle: {
              name: "HH - Huella humana en el tiempo y ecosistemas estratégicos (EE)",
            },
            loadingLayer: false,
          },
        });
      })
      .catch((error) => {
        if (!isCurrent) {
          return;
        }
        timelineHFDispatch({ type: TimelineFPUpdated.ERRORS_FOUND });
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
        acc[item.label] = timelineFPColors(item.key);
        return acc;
      }, {}),
    [timelineData],
  );

  const toggleInfoGraph = () => {
    timelineHFDispatch({ type: TimelineFPUpdated.SHOW_INFO });
  };

  const handleEcosystemSelection = (ecosystemLabel: string) => {
    const ecosystem = hfTimelineLUT.find((e) => e.label === ecosystemLabel);
    const isAlreadySelected = selectedSE === ecosystemLabel;
    const isTotalOrInvalid =
      !ecosystem || ecosystem.key === "aTotal" || isAlreadySelected;

    const seLabel = isTotalOrInvalid ? null : ecosystem.label;
    const seKey = isTotalOrInvalid ? null : ecosystem.key;

    timelineHFDispatch({
      type: TimelineFPUpdated.CURRENT_SE,
      seLabel,
    });

    searchMapDispatch({
      type: SearchUpdated.RASTER_LAYERS,
      payload: {
        rasterLayers: rasterLayers.map((layer) => ({
          ...layer,
          selected: layer.id === seKey,
          opacity: layer.id === seKey ? 1 : 0.3,
        })),
        mapTitle: {
          name: !seKey
            ? "HH - Huella humana en el tiempo y ecosistemas estratégicos (EE)"
            : `HH - Huella humana en el tiempo - ${seLabel}`,
        },
      },
    });
  };

  const activeSE = hfTimelineLUT.find((item) => item.label === selectedSE);
  const seExtensionvalue = activeSE ? seExtension[activeSE.classId] : undefined;

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
          colors={timelineFPColors}
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
