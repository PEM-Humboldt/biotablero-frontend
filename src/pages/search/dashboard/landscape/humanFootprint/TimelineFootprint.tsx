import { useContext, useEffect, useRef, useReducer } from "react";
import InfoIcon from "@mui/icons-material/Info";

import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import {
  SearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import { formatNumber } from "@utils/format";
import processDataCsv from "pages/search/utils/processDataCsv";
import TextBoxes from "@ui/TextBoxes";

import { timelineHF } from "pages/search/types/humanFootprint";
import { seDetails } from "pages/search/types/ecosystems";
import type { TextsObject } from "pages/search/types/texts";
import Lines from "@composites/charts/Lines";
import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { CartesianMarkerProps } from "@nivo/core";
import { TimelineFootprintController } from "pages/search/dashboard/landscape/humanFootprint/TimelineFootprintController";
import { RasterLayer } from "pages/search/types/layers";
import { matchColor } from "pages/search/utils/matchColor";

type SEKeys = Record<"paramo" | "dryForest" | "wetland" | "aTotal", string>;

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

interface TimelineSeries {
  key: TimelineSeriesKey;
  label: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

const timelineSeriesConfig: Array<{
  key: TimelineSeriesKey;
  label: string;
  source: TimelineField;
}> = [
  { key: "aTotal", label: "Área consulta", source: "poligono" },
  { key: "paramo", label: "Páramo", source: "paramo" },
  { key: "dryForest", label: "Bosque Seco Tropical", source: "bosqueSeco" },
  { key: "wetland", label: "Humedal", source: "humedal" },
];

const transformTimelineData = (
  data: Array<timelineHF>,
): Array<TimelineSeries> => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const orderedData = [...data].sort(
    (left, right) => Number(left.id) - Number(right.id),
  );

  return timelineSeriesConfig.map(({ key, label, source }) => ({
    key,
    label,
    data: orderedData.map((row) => ({
      x: row.id,
      y: row[source],
    })),
  }));
};

const changeValues: Array<CartesianMarkerProps> = [
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

interface seDetailsExt extends seDetails {
  type: string;
}

interface State {
  showInfoGraph: boolean;
  hfTimeline: Array<TimelineSeries>;
  message: MessageWrapperType;
  selectedEcosystem: seDetailsExt | null;
  texts: {
    hfTimeline: textsObject;
  };
  layers: Array<RasterLayer>;
}

type Action =
  | { type: "TOGGLE_INFO_GRAPH" }
  | { type: "TIMELINE_VALUES_SUCCEEDED"; payload: Array<TimelineSeries> }
  | { type: "TIMELINE_VALUES_FAILED" }
  | { type: "SET_SELECTED_ECOSYSTEM"; payload: seDetailsExt | null }
  | { type: "SET_TEXTS"; payload: textsObject }
  | { type: "SET_LAYERS"; payload: Array<RasterLayer> };

const initialState: State = {
  showInfoGraph: true,
  hfTimeline: [],
  message: "loading",
  selectedEcosystem: null,
  texts: {
    hfTimeline: { info: "", cons: "", meto: "", quote: "" },
  },
  layers: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_INFO_GRAPH":
      return { ...state, showInfoGraph: !state.showInfoGraph };
    case "TIMELINE_VALUES_SUCCEEDED":
      return { ...state, hfTimeline: action.payload, message: null };
    case "TIMELINE_VALUES_FAILED":
      return { ...state, message: "no-data" };
    case "SET_SELECTED_ECOSYSTEM":
      return { ...state, selectedEcosystem: action.payload };
    case "SET_TEXTS":
      return { ...state, texts: { hfTimeline: action.payload } };
    case "SET_LAYERS":
      return { ...state, layers: action.payload };
    default:
      return state;
  }
}

export function TimelineFootprint() {
  const context = useContext(SearchLegacyCTX) as LegacyContextValues;
  const {
    areaType,
    areaId,
    setRasterLayers,
    setLoadingLayer,
    setLayerError,
    setMapTitle,
  } = context;

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    showInfoGraph,
    hfTimeline,
    selectedEcosystem,
    message,
    texts,
    layers,
  } = state;
  const controllerRef = useRef(new TimelineFootprintController());
  const controller = controllerRef.current;
  const areaTypeId = areaType?.id;
  const areaIdId = areaId?.id;
  const hfTimelineColors = (key: string | number) =>
    matchColor("hfTimeline")(key) ?? "#3d3c48";
  const timelineLinesKey = hfTimeline
    .map(
      ({ key, data }) =>
        `${key}:${data.map(({ x, y }) => `${x}-${y}`).join(",")}`,
    )
    .join("|");

  useEffect(() => {
    let isCurrent = true;

    if (!areaTypeId || !areaIdId) {
      setLoadingLayer(false);
      return () => {
        isCurrent = false;
        controller.cancelActiveRequests();
      };
    }

    controller.setArea(areaTypeId, areaIdId.toString());

    controller
      .getTimelineData()
      .then((timelineData) => {
        if (!isCurrent) return;
        dispatch({
          type: "TIMELINE_VALUES_SUCCEEDED",
          payload: transformTimelineData(timelineData),
        });
      })
      .catch(() => {
        if (!isCurrent) return;
        dispatch({ type: "TIMELINE_VALUES_FAILED" });
      });

    setLoadingLayer(true);

    controller
      .getLayer()
      .then((timelineHF) => {
        if (!isCurrent) return;
        dispatch({ type: "SET_LAYERS", payload: timelineHF });
        setRasterLayers(timelineHF);
        setMapTitle({
          name: "HH - Huella humana en el tiempo y ecosistemas estratégicos (EE)",
        });
      })
      .catch((error) => {
        if (!isCurrent) return;
        setLayerError(error);
      })
      .finally(() => {
        if (!isCurrent) return;
        setLoadingLayer(false);
      });

    return () => {
      isCurrent = false;
      controller.cancelActiveRequests();
    };
  }, [
    areaTypeId,
    areaIdId,
    controller,
    setLayerError,
    setLoadingLayer,
    setMapTitle,
    setRasterLayers,
  ]);

  const toggleInfoGraph = () => {
    dispatch({ type: "TOGGLE_INFO_GRAPH" });
  };

  const clickOnGraph = async (selectedKey: string) => {
    let layerDescription = "";

    const seTitle: SEKeys = {
      paramo: "Páramos",
      dryForest: "Bosque seco tropical",
      wetland: "Humedales",
      aTotal: "Total",
    };

    if (selectedKey === "aTotal") {
      setRasterLayers(
        layers.filter((layer) => ["timelineHF"].includes(layer.id)),
      );
      setMapTitle({
        name: "HH - Huella humana en el tiempo y ecosistemas estratégicos (EE)",
      });
      dispatch({ type: "SET_SELECTED_ECOSYSTEM", payload: null });
      return;
    }

    layerDescription = `HH - Huella humana en el tiempo - ${
      seTitle[selectedKey as keyof SEKeys]
    }`;

    const existingLayer = layers.find((layer) => layer.id === selectedKey);

    if (!existingLayer) {
      setLoadingLayer(true);
      try {
        const SELayer = await controller.getSELayer(
          selectedKey as keyof Omit<SEKeys, "aTotal">,
        );
        const nextLayers = [...layers, ...SELayer];
        dispatch({ type: "SET_LAYERS", payload: nextLayers });
        setRasterLayers(
          nextLayers.filter((layer) =>
            ["timelineHF", selectedKey].includes(layer.id),
          ),
        );
      } catch (error) {
        setLayerError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoadingLayer(false);
      }
    } else {
      setRasterLayers(
        layers.filter((layer) =>
          ["timelineHF", selectedKey].includes(layer.id),
        ),
      );
    }

    setMapTitle({ name: layerDescription });
  };

  if (!areaTypeId || !areaIdId) {
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
          data={hfTimeline}
          loadStatus={message}
          markers={changeValues}
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
          downloadData={processDataCsv(hfTimeline)}
          downloadName={`timeline_hf_${areaTypeId}_${areaIdId}.csv`}
          isInfoOpen={showInfoGraph}
          toggleInfo={toggleInfoGraph}
        />
      </div>
    </div>
  );
}

export default TimelineFootprint;
