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
import {
  hfTimelineLUT,
  TimelineFootprintController,
} from "pages/search/dashboard/landscape/humanFootprint/TimelineFootprintController";
import { matchColor } from "pages/search/utils/matchColor";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";
import { getMetricTexts } from "pages/search/utils/texts";
import type { RasterLayer } from "pages/search/types/layers";

export type SEKey = (typeof hfTimelineLUT)[number]["key"];
export type SELabel = (typeof hfTimelineLUT)[number]["label"];
export type SESource = (typeof hfTimelineLUT)[number]["classId"];

export type TimelineFPSeries = {
  key: SEKey;
  label: SELabel;
  data: { x: string; y: number }[];
};

type TimelineFPState = {
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

  return hfTimelineLUT
    .map(({ key, label, classId: source }) => ({
      key,
      label,
      data: orderedData
        .map((row) => ({ x: row.id, y: row[source] }))
        .filter((point) => point.y !== 0),
    }))
    .filter((series) => series.data.length > 0);
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
  const { areaType, areaId } = useSearchStateCTX();
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
    if (!areaType?.id || !areaId?.id) {
      return;
    }
    let isCurrent = true;

    const controller = controllerRef.current;
    controller.setArea(areaType.id, areaId.id);

    searchMapDispatch({
      type: SearchUpdated.RASTER_LAYERS,
      payload: { rasterLayers: [], showBackgroundLayer: true },
    });

    Promise.all([
      controller.getTimelineData(),
      getMetricTexts("timelineHF"),
      controller.getSEData(),
    ])
      .then(([timelineRawData, timelineTexts, seData]) => {
        if (!isCurrent) {
          return;
        }

        timelineHFDispatch({
          type: TimelineFPUpdated.SERIES,
          payload: {
            timelineData: timelineRawData,
            texts: timelineTexts,
            seValues: seData,
          },
        });
      })
      .catch((error) => {
        timelineHFDispatch({
          type: TimelineFPUpdated.ERRORS_FOUND,
          error: typeof error === "string" ? error : JSON.stringify(error),
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

  const handleEcosystemSelection = async (ecosystemLabel: string) => {
    if (!controllerRef.current) {
      return;
    }

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

    let layer: RasterLayer[] = [];

    if (seKey) {
      searchMapDispatch({
        type: SearchUpdated.LOADING_LAYER,
        loadingLayer: true,
      });

      layer = await controllerRef.current.getSELayer(seKey);
    }

    searchMapDispatch({
      type: SearchUpdated.RASTER_LAYERS,
      payload: {
        rasterLayers: layer,
        mapTitle: {
          name: !seKey
            ? "HH - Huella humana en el tiempo y ecosistemas estratégicos (EE)"
            : `HH - Huella humana en el tiempo - ${seLabel}`,
        },
      },
    });
  };

  const availableLabels = [
    hfTimelineLUT[0].label,
    ...hfTimelineLUT
      .filter((item) => seExtension[item.classId])
      .map((item) => item.label),
  ];
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
      {!message && <p>Haz clic en un ecosistema para ver su comportamiento</p>}

      <div>
        <Lines
          loadStatus={message}
          colors={timelineFPColors}
          seriesData={timelineData}
          markers={hfTimelineMarkers}
          showLegend={false}
          enablePoints={true}
          height={300}
        />

        {!message && (
          <GraphLegend
            keys={availableLabels}
            isBar={false}
            customColorMap={customColorMap}
            onClick={(esLabel: string) =>
              void handleEcosystemSelection(esLabel)
            }
            selected={selectedSE ? [selectedSE] : []}
            className="justify-center"
          />
        )}

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
