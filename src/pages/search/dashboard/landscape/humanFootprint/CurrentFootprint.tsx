import React, { useContext, useEffect, useReducer } from "react";

import InfoIcon from "@mui/icons-material/Info";

import {
  SearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/hooks/SearchContext";

import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import matchColor from "pages/search/utils/matchColor";
import BackendAPI from "pages/search/api/backendAPI";
import SearchAPI from "pages/search/api/searchAPI";
import TextBoxes from "@ui/TextBoxes";

import {
  LargeStackedBar,
  LargeStackedBarData,
} from "@composites/charts/LargeStackedBar";

import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { CurrentFootprintController } from "pages/search/dashboard/landscape/humanFootprint/CurrentFootprintController";
import { RasterLayer } from "pages/search/types/layers";
import { textsObject } from "pages/search/types/texts";

interface State {
  showInfoGraph: boolean;
  period: string;
  hfCurrent: LargeStackedBarData[];
  hfCurrentValue: string;
  hfCurrentCategory: string;
  message: MessageWrapperType;
  texts: { hfCurrent: textsObject };
  layers: RasterLayer[];
}

type Action =
  | { type: "TOGGLE_INFO_GRAPH" }
  | { type: "SET_PERIOD"; payload: string }
  | { type: "SET_HF_CURRENT"; payload: LargeStackedBarData[] }
  | { type: "SET_MESSAGE"; payload: MessageWrapperType }
  | { type: "SET_TEXTS"; payload: textsObject }
  | { type: "SET_LAYERS"; payload: RasterLayer[] };

const initialState: State = {
  showInfoGraph: true,
  period: "",
  hfCurrent: [],
  hfCurrentValue: "0",
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

    case "SET_PERIOD":
      return {
        ...state,
        period: action.payload,
      };

    case "SET_HF_CURRENT":
      return {
        ...state,
        hfCurrent: action.payload,
      };

    case "SET_MESSAGE":
      return {
        ...state,
        message: action.payload,
      };

    case "SET_TEXTS":
      return {
        ...state,
        texts: { hfCurrent: action.payload },
      };

    case "SET_LAYERS":
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

  const controller = new CurrentFootprintController();

  const areaTypeId = areaType!.id;
  const areaIdId = areaId!.id.toString();

  useEffect(() => {
    setLoadingLayer(true);
    controller.setArea(areaTypeId, areaIdId);

    SearchAPI.requestMetricsValues<"CurrentHF">("CurrentHF", Number(areaIdId))
      .then((res) => {
        const obtainedPeriod = res[0]?.ano ?? "";

        dispatch({
          type: "SET_HF_CURRENT",
          payload: controller.transformData(res),
        });

        dispatch({
          type: "SET_PERIOD",
          payload: obtainedPeriod,
        });

        dispatch({
          type: "SET_MESSAGE",
          payload: null,
        });

        switchLayer(obtainedPeriod);
      })
      .catch(() => {
        dispatch({
          type: "SET_MESSAGE",
          payload: "no-data",
        });
      });

    BackendAPI.requestSectionTexts("hfCurrent")
      .then((res) => {
        dispatch({
          type: "SET_TEXTS",
          payload: res,
        });
      })
      .catch(() => {
        dispatch({
          type: "SET_TEXTS",
          payload: {
            info: "",
            cons: "",
            meto: "",
            quote: "",
          },
        });
      });

    return () => {
      controller.cancelActiveRequests();
    };
  }, [areaTypeId, areaIdId]);

  const switchLayer = (period: string) => {
    setLoadingLayer(true);

    controller
      .getCurrentHFLayers(period)
      .then((layersRes) => {
        dispatch({ type: "SET_LAYERS", payload: layersRes });
        setRasterLayers(layersRes);
        setLoadingLayer(false);

        setMapTitle({
          name: `HH promedio · ${period}`,
        });
      })
      .catch((e) => {
        if (e.toString() !== "Error: request canceled") {
          setLayerError(e.toString());
        }
      });
  };

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
              className={`graphinfo${showInfoGraph ? " activeBox" : ""}`}
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
        <h6>Huella humana promedio · 2018</h6>
        <h5
          style={{
            backgroundColor: matchColor("hfCurrent")(hfCurrentCategory),
          }}
        >
          {hfCurrentValue}
        </h5>
      </div>

      <h6>Natural, Baja, Media y Alta</h6>

      <LargeStackedBar
        data={hfCurrent}
        message={message}
        labelX="Hectáreas"
        labelY="Huella Humana Actual"
        units="ha"
        colors={matchColor("hfCurrent")}
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
