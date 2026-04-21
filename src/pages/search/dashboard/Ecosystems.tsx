import { useEffect, useContext, useReducer, useState } from "react";

import InfoIcon from "@mui/icons-material/Info";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";

import {
  SearchLegacyCTX,
  LegacyContextValues,
} from "pages/search/hooks/SearchContext";

import BackendAPI from "pages/search/api/backendAPI";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { EcosystemsController } from "pages/search/dashboard/EcosystemsController";
import { RasterLayer } from "pages/search/types/layers";

import { Coverage } from "pages/search/dashboard/ecosystems/Coverage";
// import { ProtectedAreas } from "pages/search/dashboard/ecosystems/ProtectedAreas";
import { StrategicEcosystems } from "pages/search/dashboard/ecosystems/StrategicEcosystems";
import { SmallStackedBarData } from "@composites/charts/SmallStackedBar";

type TextsContent = { info: string; cons: string; meto: string; quote: string };

type EcosystemsState = {
  showInfoMain: boolean;
  infoShown: Set<string>;

  coverageData: SmallStackedBarData[];

  PAAreas: Array<{
    area: number;
    label: string;
    key: string;
    percentage: number;
  }>;
  PATotalArea: number;
  PADivergentData: boolean;

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

  coverageData: [],

  PAAreas: [],
  PATotalArea: 0,
  PADivergentData: false,

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
  | { type: "COVERAGE_VALUES_SUCCEEDED"; payload: SmallStackedBarData[] }
  | { type: "COVERAGE_LAYERS_SUCCEEDED"; payload: RasterLayer[] }
  | { type: "COVERAGE_VALUES_FAILED" }
  | {
      type: "SET_TEXTS";
      payload: { section: keyof EcosystemsState["texts"]; value: TextsContent };
    };

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

    case "COVERAGE_VALUES_SUCCEEDED":
      return {
        ...state,
        coverageData: action.payload,
        messages: {
          ...state.messages,
          cov: null,
        },
      };

    case "COVERAGE_LAYERS_SUCCEEDED":
      return { ...state, layers: action.payload };

    case "COVERAGE_VALUES_FAILED":
      return {
        ...state,
        messages: {
          ...state.messages,
          cov: "no-data",
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

const controller = new EcosystemsController();

export function Ecosystems() {
  const context = useContext(SearchLegacyCTX) as LegacyContextValues;
  const { areaType, areaId, areaHa } = context;
  const [hasActiveSE, setHasActiveSE] = useState(false);

  const [state, dispatch] = useReducer(ecosystemsReducer, initialState);

  const { showInfoMain, infoShown, coverageData, layers, messages, texts } =
    state;

  if (!areaType || !areaId) {
    context.setLoadingLayer(false);
    return;
  }

  const areaTypeId = areaType.id;
  const areaIdId = areaId.id;

  useEffect(() => {
    controller.setArea(areaTypeId, areaIdId);

    context.setLoadingLayer(true);

    controller
      .getCoverageValues()
      .then((coverageDataRes) => {
        controller
          .getCoveragesLayers()
          .then((layersRes) => {
            dispatch({ type: "COVERAGE_LAYERS_SUCCEEDED", payload: layersRes });
            context.setRasterLayers(layersRes);
            context.setLoadingLayer(false);
            context.setMapTitle({ name: "Coberturas" });
          })
          .catch((e) => {
            context.setLoadingLayer(false);
            if (!e.toString().includes("request canceled")) {
              context.setLayerError?.(e.toString());
            }
          });
        dispatch({
          type: "COVERAGE_VALUES_SUCCEEDED",
          payload: coverageDataRes,
        });
      })
      .catch(() => {
        dispatch({ type: "COVERAGE_VALUES_FAILED" });
        context.setLoadingLayer(false);
      });

    const TEXT_SECTIONS: TextSection[] = ["ecosystems", "coverage", "pa", "se"];

    TEXT_SECTIONS.forEach((section) => {
      BackendAPI.requestSectionTexts(section)
        .then((res) => {
          dispatch({
            type: "SET_TEXTS",
            payload: { section, value: res },
          });
        })
        .catch(() => {
          dispatch({
            type: "SET_TEXTS",
            payload: {
              section,
              value: { info: "", cons: "", meto: "", quote: "" },
            },
          });
        });
    });

    return () => {
      context.clearLayers();
      controller.cancelActiveRequests();
    };
  }, [areaTypeId, areaIdId]);

  /**
   * Toggles the visibility state of the main tooltip.
   */
  const toggleInfoGeneral = () => dispatch({ type: "TOGGLE_MAIN_INFO" });

  /**
   * Toggles the display of a specific help section.
   *
   * @param {TextSection} value - Section id
   */
  const toggleInfo = (value: TextSection) =>
    dispatch({ type: "TOGGLE_SECTION_INFO", payload: value });

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

  const restoreCoverageLayers = () => {
    context.setRasterLayers(layers);
    context.setMapTitle({ name: "Coberturas" });
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
          disableGraphClick={hasActiveSE}
          toggleInfo={() => toggleInfo("coverage")}
          texts={texts.coverage}
          messages={messages.cov}
          areaIdStr={`${areaIdId}`}
          onClickGraph={clickOnGraph}
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

        <StrategicEcosystems
          areaTypeId={areaTypeId}
          areaIdId={areaIdId}
          areaHa={areaHa!}
          texts={texts.se}
          onActiveSEChange={setHasActiveSE}
          onSEDetailClose={restoreCoverageLayers}
        />
      </div>
    </div>
  );
}
