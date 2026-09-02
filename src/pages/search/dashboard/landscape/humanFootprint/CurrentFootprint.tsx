import { useContext, useEffect, useReducer, useRef } from "react";

import InfoIcon from "@mui/icons-material/Info";

import {
  SearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/hooks/SearchContext";

import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import { matchColor } from "pages/search/utils/matchColor";
import TextBoxes from "@ui/TextBoxes";

import {
  LargeStackedBar,
  LargeStackedBarData,
} from "@composites/charts/LargeStackedBar";

import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { CurrentFootprintController } from "pages/search/dashboard/landscape/humanFootprint/CurrentFootprintController";
import { RasterLayer } from "pages/search/types/layers";
import { textsObject } from "pages/search/types/texts";
import colorPalettes from "pages/search/utils/colorPalettes";
import { formatNumber } from "@utils/format";
import SearchAPI from "pages/search/api/searchAPI";
import { mapMetricInfoToTexts } from "pages/search/utils/texts";

interface State {
  showInfoGraph: boolean;
  period: string;
  hfCurrent: LargeStackedBarData[];
  hfCurrentValue: number;
  hfCurrentCategory: string;
  message: MessageWrapperType;
  texts: { hfCurrent: textsObject };
  layers: RasterLayer[];
}

type Action =
  | { type: "TOGGLE_INFO_GRAPH" }
  | {
      type: "AVERAGE_SUCCEEDED";
      payload: { id: string; average: number; category: string };
    }
  | { type: "CURRENTHF_LAYERS_SUCCEEDED"; payload: RasterLayer[] }
  | { type: "CURRENTHF_VALUES_SUCCEEDED"; payload: LargeStackedBarData[] }
  | { type: "CURRENTHF_VALUES_FAILED" }
  | { type: "SET_TEXTS"; payload: textsObject };

const initialState: State = {
  showInfoGraph: true,
  period: "",
  hfCurrent: [],
  hfCurrentValue: 0,
  hfCurrentCategory: "",
  message: "loading",
  texts: {
    hfCurrent: {
      info: "",
      cons: "",
      meto: "",
      quote: "",
    },
  },
  layers: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_INFO_GRAPH":
      return {
        ...state,
        showInfoGraph: !state.showInfoGraph,
      };

    case "AVERAGE_SUCCEEDED":
      return {
        ...state,
        period: action.payload.id,
        hfCurrentValue: action.payload.average,
        hfCurrentCategory: action.payload.category,
      };

    case "CURRENTHF_VALUES_SUCCEEDED":
      return {
        ...state,
        hfCurrent: action.payload,
        message: null,
      };

    case "CURRENTHF_VALUES_FAILED":
      return {
        ...state,
        message: "no-data",
      };

    case "SET_TEXTS":
      return {
        ...state,
        texts: { hfCurrent: action.payload },
      };

    case "CURRENTHF_LAYERS_SUCCEEDED":
      return {
        ...state,
        layers: action.payload,
      };

    default:
      return state;
  }
}

export function CurrentFootprint() {
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
    period,
    hfCurrent,
    hfCurrentValue,
    hfCurrentCategory,
    message,
    texts,
    layers,
  } = state;

  const controllerRef = useRef(new CurrentFootprintController());
  const controller = controllerRef.current;
  const areaTypeId = areaType?.id;
  const areaIdId = areaId?.id;

  useEffect(() => {
    let isCurrent = true;

    if (!areaTypeId || !areaIdId) {
      setLoadingLayer(false);
      return () => {
        isCurrent = false;
        controller.cancelActiveRequests();
      };
    }

    controller.setArea(areaTypeId, areaIdId);

    setLoadingLayer(true);

    controller
      .getCurrentHFAverage()
      .then((res) => {
        if (!isCurrent) return;
        dispatch({ type: "AVERAGE_SUCCEEDED", payload: res });
      })
      .catch((e) => {
        if (!isCurrent) return;
        if (e.toString() !== "Error: request canceled") {
          setLayerError(e.toString());
        }
      });

    controller
      .getCurrentHFValues()
      .then((currentHFValues) => {
        if (!isCurrent) return;
        controller
          .getCurrentHFLayers()
          .then((layersRes) => {
            if (!isCurrent) return;
            dispatch({
              type: "CURRENTHF_LAYERS_SUCCEEDED",
              payload: layersRes,
            });
            setRasterLayers(layersRes);
            setLoadingLayer(false);
            setMapTitle({
              name: `HH promedio · ${controller.itemId}`,
            });
          })
          .catch((e) => {
            if (!isCurrent) return;
            if (e.toString() !== "Error: request canceled") {
              setLayerError(e.toString());
            }
            setLoadingLayer(false);
          });

        dispatch({
          type: "CURRENTHF_VALUES_SUCCEEDED",
          payload: currentHFValues,
        });
      })
      .catch(() => {
        if (!isCurrent) return;
        dispatch({ type: "CURRENTHF_VALUES_FAILED" });
        setLoadingLayer(false);
      });

    SearchAPI.requestMetricsInfo("currentHF")
      .then((res) => {
        if (!isCurrent) return;
        const value = mapMetricInfoToTexts(res);
        dispatch({
          type: "SET_TEXTS",
          payload: value,
        });
      })
      .catch(() => {
        if (!isCurrent) return;
        dispatch({
          type: "SET_TEXTS",
          payload: { info: "", cons: "", meto: "", quote: "" },
        });
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

  if (!areaTypeId || !areaIdId) {
    return null;
  }

  const toggleInfoGraph = () => {
    dispatch({ type: "TOGGLE_INFO_GRAPH" });
  };

  const clickOnGraph = (selectedKey: string) => {
    setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === selectedKey,
      })),
    );
  };

  return (
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
          description={`<p>${texts.hfCurrent.info}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}

      <div>
        <h6>Huella humana promedio · {period}</h6>
        <h5
          style={{
            backgroundColor:
              matchColor("hfCurrent")(hfCurrentCategory) ||
              colorPalettes.default[0],
          }}
        >
          {formatNumber(hfCurrentValue, 2)}
        </h5>
      </div>

      <h6>Natural, Baja, Media, Alta y Muy Alta</h6>

      <LargeStackedBar
        loadStatus={message}
        data={hfCurrent}
        labelX="Hectáreas"
        labelY="Huella Humana Actual"
        units="ha"
        colors={(key) =>
          matchColor("hfCurrent")(key) || colorPalettes.default[0]
        }
        padding={0.25}
        onClickGraphHandler={clickOnGraph}
      />

      <TextBoxes
        consText={texts.hfCurrent.cons}
        metoText={texts.hfCurrent.meto}
        quoteText={texts.hfCurrent.quote}
        downloadData={hfCurrent}
        downloadName={`hf_current_${areaTypeId}_${areaIdId}.csv`}
        isInfoOpen={showInfoGraph}
        toggleInfo={toggleInfoGraph}
      />
    </div>
  );
}
