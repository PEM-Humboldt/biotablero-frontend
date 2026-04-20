import { useEffect, useContext, useReducer } from "react";

import SmallStackedBar, {
  SmallStackedBarData,
} from "@composites/charts/SmallStackedBar";
import colorPalettes from "pages/search/utils/colorPalettes";

import { RasterLayer } from "pages/search/types/layers";

import {
  SearchLegacyCTX,
  LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import { StrategicEcosystemsDistributionController } from "pages/search/dashboard/ecosystems/StrategicEcosystemsDistributionController";
import { matchColor } from "pages/search/utils/matchColor";
import { SEKey } from "pages/search/types/ecosystems";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";

interface Props {
  SEType: SEKey;
  disableGraphClick?: boolean;
}

interface EcosystemsState {
  distributionData: SmallStackedBarData[];
  layers: RasterLayer[];
  loading: boolean;
  noData: boolean;
}

const initialState: EcosystemsState = {
  distributionData: [],
  layers: [],
  loading: true,
  noData: false,
};

type EcosystemsAction =
  | { type: "DISTRIBUTION_VALUES_REQUESTED" }
  | { type: "DISTRIBUTION_VALUES_SUCCEEDED"; payload: SmallStackedBarData[] }
  | { type: "DISTRIBUTION_LAYERS_SUCCEEDED"; payload: RasterLayer[] }
  | { type: "DISTRIBUTION_VALUES_FAILED" };

function ecosystemsReducer(
  state: EcosystemsState,
  action: EcosystemsAction,
): EcosystemsState {
  switch (action.type) {
    case "DISTRIBUTION_VALUES_REQUESTED":
      return {
        ...state,
        loading: true,
        noData: false,
      };

    case "DISTRIBUTION_VALUES_SUCCEEDED":
      return {
        ...state,
        distributionData: action.payload,
        loading: false,
        noData: action.payload.length === 0,
      };

    case "DISTRIBUTION_LAYERS_SUCCEEDED":
      return { ...state, layers: action.payload };

    case "DISTRIBUTION_VALUES_FAILED":
      return {
        ...state,
        loading: false,
        noData: true,
      };

    default:
      return state;
  }
}
const controller = new StrategicEcosystemsDistributionController();

export function StrategicEcosystemsDistribution({
  SEType,
  disableGraphClick = false,
}: Props) {
  const [state, dispatch] = useReducer(ecosystemsReducer, initialState);

  const context = useContext(SearchLegacyCTX) as LegacyContextValues;

  const { areaType, areaId } = context;

  const { distributionData, layers, loading, noData } = state;

  const loadStatus: MessageWrapperType = loading
    ? "loading"
    : noData
      ? "no-data"
      : null;

  if (!areaType || !areaId) {
    context.setLoadingLayer(false);
    return;
  }

  const areaTypeId = areaType.id;
  const areaIdId = areaId.id;

  const clickOnGraph = (selectedKey: string) => {
    if (disableGraphClick) {
      return;
    }
    context.setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === selectedKey,
      })),
    );
  };

  useEffect(() => {
    dispatch({ type: "DISTRIBUTION_VALUES_REQUESTED" });
    controller.setArea(areaTypeId, areaIdId);

    context.setRasterLayers([]);
    context.setLoadingLayer(true);

    controller
      .getStrategicEcosystemsDistributionValues(SEType)
      .then((distributionDataRes) => {
        controller
          .getStrategicEcosystemsDistributionLayers(SEType)
          .then((layersRes) => {
            dispatch({
              type: "DISTRIBUTION_LAYERS_SUCCEEDED",
              payload: layersRes,
            });
            context.setRasterLayers(layersRes);
            context.setLoadingLayer(false);
            context.setMapTitle({ name: `Coberturas - ${SEType}` });
          })
          .catch((e) => {
            context.setLoadingLayer(false);
            if (!e.toString().includes("request canceled")) {
              context.setLayerError?.(e.toString());
            }
          });
        dispatch({
          type: "DISTRIBUTION_VALUES_SUCCEEDED",
          payload: distributionDataRes,
        });
      })
      .catch(() => {
        dispatch({ type: "DISTRIBUTION_VALUES_FAILED" });
        context.setLoadingLayer(false);
      });

    return () => {
      controller.cancelActiveRequests();
      context.clearLayers();
    };
  }, [areaTypeId, areaIdId, SEType]);

  return (
    <>
      <h3>Distribución de coberturas:</h3>

      <div className="graficaeco">
        <div className="svgPointer">
          <SmallStackedBar
            loadStatus={loadStatus}
            data={distributionData}
            units="ha"
            colors={(key: string) =>
              matchColor("coverage")(key) || colorPalettes.default[0]
            }
            onClickGraphHandler={clickOnGraph}
          />
        </div>
      </div>
    </>
  );
}
