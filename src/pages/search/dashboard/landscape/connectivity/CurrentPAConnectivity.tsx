import { useEffect, useReducer, useRef } from "react";
import InfoIcon from "@mui/icons-material/Info";

import { PointFilledLegend } from "@ui/CssLegends";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import { Button } from "@ui/shadCN/component/button";
import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";

import { matchColor } from "pages/search/utils/matchColor";
import TextBoxes from "@ui/TextBoxes";

import { DPC } from "pages/search/types/connectivity";
import type { TextsObject } from "pages/search/types/texts";
import { getMetricTexts } from "pages/search/utils/texts";
import {
  SmallBars,
  SmallBarsData,
  type SmallBarTooltip,
} from "@composites/charts/SmallBars";
import { LargeStackedBar } from "@composites/charts/LargeStackedBar";
import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { CurrentPAConnectivityController } from "pages/search/dashboard/landscape/connectivity/CurrentPAConnectivityController";
import { formatNumber } from "@utils/format";
import colorPalettes from "pages/search/utils/colorPalettes";
import { RasterLayer } from "pages/search/types/layers";
import { CurrentPAConnGraphData } from "pages/search/dashboard/landscape/connectivity/CurrentPAConnectivityController";

const legendDPCCategories = {
  muy_bajo: "Muy bajo",
  bajo: "Bajo",
  medio: "Medio",
  alto: "Alto",
  muy_alto: "Muy Alto",
};
const DPCCats = (
  Object.keys(legendDPCCategories) as Array<keyof typeof legendDPCCategories>
).reverse();

type CurrentPAConnBarData = CurrentPAConnGraphData;

interface CurrentPAConnState {
  infoShown: Set<string>;
  dpcData: Array<DPC>;
  showLowestDpc: boolean;
  currentPAConnData: Array<CurrentPAConnBarData>;
  currentPAConnPercentage: number;
  messages: {
    currentPAConn: MessageWrapperType;
    dpc: MessageWrapperType;
  };
  graphData: {
    transformedData: Array<SmallBarsData>;
    keys: Array<string>;
    tooltips: Array<SmallBarTooltip>;
  };
  texts: {
    paConnDPC: TextsObject;
    protConn: TextsObject;
  };
  layers: RasterLayer[];
}

type DpcPayload = {
  dpcData: Array<DPC>;
  graphData: {
    transformedData: Array<SmallBarsData>;
    keys: Array<string>;
    tooltips: Array<SmallBarTooltip>;
  };
  showLowestDpc: boolean;
};

type CurrentPAConnPayload = {
  currentPAConnData: Array<CurrentPAConnBarData>;
  currentPAConnPercentage: number;
};

type Action =
  | { type: "TOGGLE_INFO"; payload: string }
  | { type: "DPC_SUCCEEDED"; payload: DpcPayload }
  | { type: "DPC_FAILED" }
  | { type: "CURRENT_PA_CONN_SUCCEEDED"; payload: CurrentPAConnPayload }
  | { type: "CURRENT_PA_CONN_FAILED" }
  | {
      type: "SET_TEXTS";
      payload: { key: keyof CurrentPAConnState["texts"]; texts: TextsObject };
    }
  | { type: "PA_LAYERS_SUCCEEDED"; payload: RasterLayer[] };

const initialState: CurrentPAConnState = {
  infoShown: new Set(["protConn", "dpc"]),
  dpcData: [],
  showLowestDpc: false,
  currentPAConnData: [],
  currentPAConnPercentage: 0,
  messages: {
    currentPAConn: "loading",
    dpc: "loading",
  },
  graphData: {
    transformedData: [],
    keys: [],
    tooltips: [],
  },
  texts: {
    paConnDPC: { info: "", cons: "", meto: "", quote: "" },
    protConn: { info: "", cons: "", meto: "", quote: "" },
  },
  layers: [],
};

function reducer(
  state: CurrentPAConnState,
  action: Action,
): CurrentPAConnState {
  switch (action.type) {
    case "TOGGLE_INFO": {
      const infoShown = new Set(state.infoShown);
      if (infoShown.has(action.payload)) infoShown.delete(action.payload);
      else infoShown.add(action.payload);
      return { ...state, infoShown };
    }
    case "DPC_SUCCEEDED":
      return {
        ...state,
        dpcData: action.payload.dpcData,
        graphData: action.payload.graphData,
        messages: { ...state.messages, dpc: null },
        showLowestDpc: action.payload.showLowestDpc,
      };
    case "DPC_FAILED":
      return {
        ...state,
        messages: { ...state.messages, dpc: "no-data" },
      };
    case "CURRENT_PA_CONN_SUCCEEDED":
      return {
        ...state,
        currentPAConnData: action.payload.currentPAConnData,
        currentPAConnPercentage: action.payload.currentPAConnPercentage,
        messages: { ...state.messages, currentPAConn: null },
      };
    case "CURRENT_PA_CONN_FAILED":
      return {
        ...state,
        messages: { ...state.messages, currentPAConn: "no-data" },
      };
    case "SET_TEXTS":
      return {
        ...state,
        texts: {
          ...state.texts,
          [action.payload.key]: action.payload.texts,
        },
      };
    case "PA_LAYERS_SUCCEEDED":
      return {
        ...state,
        layers: action.payload,
      };
    default:
      return state;
  }
}

function CurrentPAConnectivity() {
  const context = useSearchStateCTX();
  const searchDispatch = useSearchDispatchCTX();
  const { areaType, areaId } = context;

  const controllerRef = useRef(new CurrentPAConnectivityController());
  const controller = controllerRef.current;

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!areaType || !areaId) {
      searchDispatch({
        type: SearchUpdated.LOADING_LAYER,
        loadingLayer: false,
      });
      return () => {
        controller.cancelActiveRequests();
      };
    }
    controller.setArea(areaType.id, areaId.id);
    searchDispatch({
      type: SearchUpdated.LOADING_LAYER,
      loadingLayer: true,
    });

    controller
      .getCurrentPAConn()
      .then((result) => {
        dispatch({ type: "CURRENT_PA_CONN_SUCCEEDED", payload: result });
      })
      .catch((error) => {
        if (error?.message === "request canceled") return;
        dispatch({ type: "CURRENT_PA_CONN_FAILED" });
      });

    controller
      .loadSortedDpcData(false)
      .then((result) => {
        controller
          .getPALayers()
          .then((layersRes) => {
            dispatch({
              type: "PA_LAYERS_SUCCEEDED",
              payload: layersRes,
            });
            searchDispatch({
              type: SearchUpdated.WILDCARD,
              payload: {
                rasterLayers: layersRes,
                showAreaLayer: true,
                loadingLayer: false,
                mapTitle: { name: "Conectividad de áreas protegidas" },
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
          })
          .finally(() => {
            searchDispatch({
              type: SearchUpdated.LOADING_LAYER,
              loadingLayer: false,
            });
          });
        dispatch({
          type: "DPC_SUCCEEDED",
          payload: { ...result, showLowestDpc: false },
        });
      })
      .catch((error) => {
        if (error?.message === "request canceled") return;
        dispatch({ type: "DPC_FAILED" });
      });

    const textMetrics = [
      { metric: "protConn", key: "protConn" },
      { metric: "dpc", key: "paConnDPC" },
    ] as const;

    textMetrics.forEach(({ metric, key }) => {
      getMetricTexts(metric)
        .then((texts) => {
          dispatch({ type: "SET_TEXTS", payload: { key, texts } });
        })
        .catch(() => {
          dispatch({
            type: "SET_TEXTS",
            payload: {
              key,
              texts: { info: "", cons: "", meto: "", quote: "" },
            },
          });
        });
    });

    return () => {
      controller.cancelActiveRequests();
    };
  }, [areaType, areaId]);

  const toggleInfo = (value: string) => {
    dispatch({ type: "TOGGLE_INFO", payload: value });
  };

  const toggleDpcMode = () => {
    controller
      .loadSortedDpcData(!state.showLowestDpc)
      .then((result) => {
        dispatch({
          type: "DPC_SUCCEEDED",
          payload: { ...result, showLowestDpc: !state.showLowestDpc },
        });
      })
      .catch((error) => {
        if (error?.message === "request canceled") return;
        dispatch({ type: "DPC_FAILED" });
      });
  };

  const clickOnDPCGraph = (dpcId: string, category: string) => {
    const { layers } = state;
    searchDispatch({
      type: SearchUpdated.WILDCARD,
      payload: {
        rasterLayers: layers.map((layer) => ({
          ...layer,
          selected: layer.id === dpcId,
        })),
      },
    });
  };

  const {
    dpcData,
    showLowestDpc,
    infoShown,
    messages,
    texts,
    graphData,
    currentPAConnData,
    currentPAConnPercentage,
  } = state;
  const areaTypeId = areaType!.id;
  const areaIdId = areaId!.id.toString();

  return (
    <div className="graphcontainer pt6">
      <div>
        <h6>Conectividad de áreas protegidas</h6>
        <IconTooltip title="Interpretación">
          <span className="iconWrapper">
            <InfoIcon
              fontSize="medium"
              className={`metrics-info-icon${infoShown.has("protConn") ? " activeBox" : ""}`}
              onClick={() => toggleInfo("protConn")}
            />
          </span>
        </IconTooltip>
        {infoShown.has("protConn") && (
          <ShortInfo
            description={`<p>${texts.protConn.info}</p>`}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <div>
          <LargeStackedBar
            data={currentPAConnData}
            colors={(key: string | number) =>
              matchColor("currentPAConn")(key) || colorPalettes.default[0]
            }
            loadStatus={messages.currentPAConn}
            labelX="Porcentaje (%)"
            labelY="Conectividad de áreas protegidas"
            units="%"
            padding={0.25}
          />
        </div>
        {currentPAConnData.length > 0 && (
          <div className="mb2 ml-6">
            <h6 className="innerInfo">Porcentaje de área protegida</h6>
            <h5
              className="innerInfoH5"
              style={{
                backgroundColor: matchColor("timelinePAConn")("prot"),
              }}
            >
              {`${formatNumber(currentPAConnPercentage, 2)}%`}
            </h5>
          </div>
        )}
        <TextBoxes
          consText={texts.protConn.cons}
          metoText={texts.protConn.meto}
          quoteText={texts.protConn.quote}
          downloadData={currentPAConnData}
          downloadName={`conn_pa_current_${areaTypeId}_${areaIdId}.csv`}
          isInfoOpen={infoShown.has("protConn")}
          toggleInfo={() => toggleInfo("protConn")}
        />
        <h6>Aporte de las áreas protegidas a la conectividad</h6>
        <IconTooltip title="Interpretación">
          <span className="iconWrapper">
            <InfoIcon
              fontSize="medium"
              className={`metrics-info-icon${infoShown.has("dpc") ? " activeBox" : ""}`}
              onClick={() => toggleInfo("dpc")}
            />
          </span>
        </IconTooltip>
        <div className="mb2 ml-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleDpcMode}
          >
            {showLowestDpc ? "Áreas con mayor dPC" : "Áreas con menor dPC"}
          </Button>
        </div>
        <div className="mb2 ml-6">
          <span className="text-sm text-muted-foreground">
            {showLowestDpc
              ? "Áreas que menos aportan."
              : "Áreas que más aportan."}
          </span>
        </div>
        {infoShown.has("dpc") && (
          <ShortInfo
            description={`<p>${texts.paConnDPC.info}</p>`}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <h3 className="innerInfoH3">
          Haz clic en un área protegida para visualizarla
        </h3>
        <div>
          {dpcData.length > 0 && (
            <SmallBars
              data={graphData.transformedData}
              keys={graphData.keys}
              tooltips={graphData.tooltips}
              loadStatus={messages.dpc}
              colors={(key: string) =>
                matchColor("dpc")(key) || colorPalettes.default[0]
              }
              onClickHandler={clickOnDPCGraph}
              animate={false}
              margin={{
                bottom: 50,
                left: 40,
              }}
              axisX={{
                enabled: true,
                legend: "dPC",
                format: ".2f",
              }}
              enableLabel={true}
            />
          )}
        </div>
        <div className="dpcLegend">
          {DPCCats.map((cat) => (
            <PointFilledLegend color={matchColor("dpc")(cat)} key={cat}>
              {legendDPCCategories[cat]}
            </PointFilledLegend>
          ))}
        </div>
        <TextBoxes
          consText={texts.paConnDPC.cons}
          metoText={texts.paConnDPC.meto}
          quoteText={texts.paConnDPC.quote}
          downloadData={dpcData}
          downloadName={`conn_dpc_${areaTypeId}_${areaIdId}.csv`}
          isInfoOpen={infoShown.has("dpc")}
          toggleInfo={() => toggleInfo("dpc")}
        />
      </div>
    </div>
  );
}

export default CurrentPAConnectivity;
