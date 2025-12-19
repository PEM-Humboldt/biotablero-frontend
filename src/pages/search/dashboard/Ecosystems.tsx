import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useReducer,
} from "react";

import InfoIcon from "@mui/icons-material/Info";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import TextBoxes from "@ui/TextBoxes";

import {
  transformPAValues,
  transformCoverageValues,
  transformSEAreas,
} from "pages/search/dashboard/ecosystems/transformData";

import {
  SearchLegacyCTX,
  LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import { formatNumber } from "@utils/format";

import BackendAPI from "pages/search/api/backendAPI";
import SearchAPI from "pages/search/api/searchAPI";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { SEPAData } from "pages/search/types/ecosystems";
import { EcosystemsController } from "pages/search/dashboard/EcosystemsController";
import { RasterLayer } from "pages/search/types/layers";

import { Coverage } from "pages/search/dashboard/ecosystems/Coverage";
import { ProtectedAreas } from "pages/search/dashboard/ecosystems/ProtectedAreas";
import { StrategicEcosystems } from "pages/search/dashboard/ecosystems/StrategicEcosystems";
import { SmallStackedBarData } from "@composites/charts/SmallStackedBar";

type TextsContent = { info: string; cons: string; meto: string; quote: string };

type EcosystemsState = {
  showInfoMain: boolean;
  infoShown: Set<string>;
  period: string;

  coverageData: SmallStackedBarData[];

  PAAreas:  Array<{
    area: number;
    label: string;
    key: string;
    percentage: number;
  }>;
  PATotalArea: number;
  PADivergentData: boolean;

  SEAreas: SEPAData[];
  SETotalArea: number;
  activeSE: string;

  layers: RasterLayer[];

  messages: {
    cov: MessageWrapperType;
    pa: MessageWrapperType;
    se: MessageWrapperType;
  };

  texts: {
    ecosystems: TextsContent;
    coverage: TextsContent;
    pa: TextsContent;
    se: TextsContent;
  };
};

type TextSection = keyof EcosystemsState["texts"];

const initialState: EcosystemsState = {
  showInfoMain: false,
  infoShown: new Set(),
  period: "",

  coverageData: [],

  PAAreas: [],
  PATotalArea: 0,
  PADivergentData: false,

  SEAreas: [],
  SETotalArea: 0,
  activeSE: "",

  layers: [],

  messages: {
    cov: "loading",
    pa: "loading",
    se: "loading",
  },

  texts: {
    ecosystems: { info: "", cons: "", meto: "", quote: "" },
    coverage: { info: "", cons: "", meto: "", quote: "" },
    pa: { info: "", cons: "", meto: "", quote: "" },
    se: { info: "", cons: "", meto: "", quote: "" },
  },
};


type EcosystemsAction =
  | { type: "TOGGLE_MAIN_INFO" }
  | { type: "TOGGLE_SECTION_INFO"; payload: string }
  | { type: "SET_PERIOD"; payload: string }

  | { type: "SET_COVERAGE_DATA"; payload: SmallStackedBarData[] }
  | { type: "SET_LAYERS"; payload: RasterLayer[] }

  | { type: "SET_ACTIVE_SE"; payload: string }

  | { type: "SET_MESSAGE"; payload: { key: "cov" | "pa" | "se"; value: MessageWrapperType } }

  | { type: "SET_TEXTS"; payload: { section: keyof EcosystemsState["texts"]; value: TextsContent } };


function ecosystemsReducer(
  state: EcosystemsState,
  action: EcosystemsAction,
): EcosystemsState {
  switch (action.type) {
    case "TOGGLE_MAIN_INFO":
      return { ...state, showInfoMain: !state.showInfoMain };

    case "TOGGLE_SECTION_INFO": {
      const newSet = new Set(state.infoShown);
      newSet.has(action.payload)
        ? newSet.delete(action.payload)
        : newSet.add(action.payload);

      return { ...state, infoShown: newSet };
    }

    case "SET_PERIOD":
      return { ...state, period: action.payload };

    case "SET_COVERAGE_DATA":
      return { ...state, coverageData: action.payload };

    case "SET_LAYERS":
      return { ...state, layers: action.payload };

    case "SET_ACTIVE_SE":
      return { ...state, activeSE: action.payload };

    case "SET_MESSAGE":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.key]: action.payload.value,
        },
      };

    case "SET_TEXTS":
      return {
        ...state,
        texts: {
          ...state.texts,
          [action.payload.section]: action.payload.value,
        },
      };

    default:
      return state;
  }
}

export function Ecosystems() {
  const context = useContext(SearchLegacyCTX) as LegacyContextValues;
  const { areaType, areaId, areaHa } = context;

  const controller = useMemo(() => new EcosystemsController(), []);
  const isMounted = useRef(true);

  const [state, dispatch] = useReducer(ecosystemsReducer, initialState);

  const {
    showInfoMain,
    infoShown,
    period,
    coverageData,
    layers,
    activeSE,
    messages,
    texts,
  } = state;

  const areaTypeId = areaType?.id;
  const areaIdId = areaId?.id.toString();
  const areaIdStr = areaIdId ?? "";

  const periodRef = useRef(period);
  useEffect(() => {
    periodRef.current = period;
  }, [period]);

  const contextRef = useRef(context);
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const switchLayer = useCallback((periodArg?: string) => {
    const contextRefCurrent = contextRef.current;

    contextRefCurrent.setMapTitle({ name: "Coberturas" });

    const p = periodArg ?? periodRef.current;
    if (!p) {
      contextRefCurrent.setRasterLayers([]);
      contextRefCurrent.setLoadingLayer(false);
      return;
    }

    controller
      .getCoveragesLayers(p)
      .then((layersRes) => {
        if (!isMounted.current) return;
        dispatch({ type: "SET_LAYERS", payload: layersRes });
        contextRefCurrent.setRasterLayers(layersRes);
        contextRefCurrent.setLoadingLayer(false);
        contextRefCurrent.setMapTitle({ name: "Coberturas" });
      })
      .catch((e) => {
        if (!isMounted.current) return;
        contextRefCurrent.setLoadingLayer(false);
        if (!e.toString().includes("request canceled")) {
          contextRefCurrent.setLayerError?.(e.toString());
        }
      });
  }, []);

  useEffect(() => {
    isMounted.current = true;

    contextRef.current.setLoadingLayer(true);
    
    if (!areaTypeId || !areaIdId) return;

    controller.setArea(areaTypeId, areaIdId);
    switchLayer();

    SearchAPI.requestMetricsValues<"Coverage">("Coverage", Number(areaIdId))
      .then((res) => {
        if (!isMounted.current) return;

        const obtainedPeriod = res[0]?.ano ?? "";
        dispatch({ type: "SET_PERIOD", payload: obtainedPeriod });

        dispatch({
          type: "SET_COVERAGE_DATA",
          payload: transformCoverageValues(res),
        });
        dispatch({
          type: "SET_MESSAGE",
          payload: { key: "cov", value: null },
        });

        switchLayer(obtainedPeriod);
      })
      .catch(() => {
        if (!isMounted.current) return;
        dispatch({
          type: "SET_MESSAGE",
          payload: { key: "cov", value: "no-data" },
        });        
        contextRef.current.setLoadingLayer(false);
      });

    // TEXTS

    const TEXT_SECTIONS: TextSection[] = [
      "ecosystems",
      "coverage",
      "pa",
      "se",
    ];

    TEXT_SECTIONS.forEach((section) => {
      BackendAPI.requestSectionTexts(section)
        .then((res) => {
          if (!isMounted.current) return;
          dispatch({
            type: "SET_TEXTS",
            payload: { section, value: res },
          });
        })
        .catch(() => {
          if (!isMounted.current) return;
          dispatch({
            type: "SET_TEXTS",
            payload: { section, value: { info: "", cons: "", meto: "", quote: "" } },
          });
        });
    });

    return () => {
      isMounted.current = false;
      context.clearLayers();
      controller.cancelActiveRequests();
    };
  }, [areaTypeId, areaIdId]);

  /**
   * Toggles the visibility state of the main tooltip.
   */
    const toggleInfoGeneral = () =>
      dispatch({ type: "TOGGLE_MAIN_INFO" });

  /**
   * Toggles the display of a specific help section.
   *
   * @param {string} value - Section id
   */
  const toggleInfo = (value: string) =>
    dispatch({ type: "TOGGLE_SECTION_INFO", payload: value });

  /**
   * Set active strategic ecosystem graph
   *
   * @param {String} se selected strategic ecosystem
   */
  const switchActiveSEHandler = (se: string) => {
    const newVal = activeSE !== se && se !== "" ? se : "";
    dispatch({ type: "SET_ACTIVE_SE", payload: newVal });

    if (newVal === "") switchLayer();
  };

  /**
   * Set the selected layer to highlight
   *  @param {string} selectedKey Special Ecosystem type
   */
  const clickOnGraph = (selectedKey: string) => {
    context.setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === selectedKey,
      })),
    );
  };

  const resetActiveSE = () => {
    if (activeSE) dispatch({ type: "SET_ACTIVE_SE", payload: "" });  
  };

  return (
    <div className="graphcard">
      <h2>
        <IconTooltip title="¿Cómo interpretar las gráficas?">
          <InfoIcon className="graphinfo" onClick={toggleInfoGeneral} />
        </IconTooltip>
      </h2>

      {showInfoMain && (
        <ShortInfo
          description={`<p>${texts.ecosystems.info}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}

      <div className="graphcontainer pt5">
        {/* COVERAGE */}
        <Coverage
          coverage={coverageData}
          infoOpen={infoShown.has("coverage")}
          toggleInfo={() => toggleInfo("coverage")}
          texts={texts.coverage}
          messages={messages.cov}
          areaIdStr={areaIdStr}
          onClickGraph={clickOnGraph}
          resetActiveSE={resetActiveSE}
        />

        {/* PROTECTED AREAS */}
        {/*}
        <ProtectedAreas
          PAAreas={PAAreas}
          PATotalArea={PATotalArea}
          PADivergentData={PADivergentData}
          areaHa={areaHa!}
          infoOpen={infoShown.has("pa")}
          toggleInfo={() => toggleInfo("pa")}
          texts={texts.pa}
          messages={messages.pa}
          areaIdStr={areaIdStr}
        />
        {*/}

        {/* STRATEGIC ECOSYSTEMS */}
        {/*}
        <StrategicEcosystems
          SEAreas={SEAreas}
          SETotalArea={SETotalArea}
          areaHa={areaHa!}
          activeSE={activeSE}
          infoOpen={infoShown.has("se")}
          toggleInfo={() => toggleInfo("se")}
          texts={texts.se}
          messages={messages.se}
          areaIdStr={areaIdStr}
          setActiveSE={setActiveSE}
          isLoading={messages.se === "loading"}
          noData={messages.se === "no-data"}
        />
        {*/}
      </div>
    </div>
  );
}
