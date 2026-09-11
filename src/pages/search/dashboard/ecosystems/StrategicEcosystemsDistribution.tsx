import { useEffect, useRef, useState } from "react";

import SmallStackedBar, {
  SmallStackedBarData,
} from "@composites/charts/SmallStackedBar";
import colorPalettes from "pages/search/utils/colorPalettes";

import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";

import { StrategicEcosystemsDistributionController } from "pages/search/dashboard/ecosystems/StrategicEcosystemsDistributionController";
import { matchColor } from "pages/search/utils/matchColor";
import { SEKey, SELabels } from "pages/search/types/ecosystems";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";

interface Props {
  SEType: SEKey;
}

type ChartStatus = "loading" | "ready" | "error";

export function StrategicEcosystemsDistribution({ SEType }: Props) {
  const [distributionData, setDistributionData] = useState<
    SmallStackedBarData[]
  >([]);
  const [chartStatus, setChartStatus] = useState<ChartStatus>("loading");

  const { areaType, areaId, rasterLayers: layers } = useSearchStateCTX();
  const dispatchSearchMap = useSearchDispatchCTX();

  const controllerRef = useRef(new StrategicEcosystemsDistributionController());
  const controller = controllerRef.current;

  let loadStatus: MessageWrapperType = null;

  if (chartStatus === "loading") {
    loadStatus = "loading";
  } else if (chartStatus === "error" || distributionData.length === 0) {
    loadStatus = "no-data";
  }

  const areaTypeId = areaType?.id;
  const areaIdId = areaId?.id;

  const clickOnGraph = (selectedKey: string) => {
    dispatchSearchMap({
      type: SearchUpdated.RASTER_LAYERS,
      payload: {
        rasterLayers: layers.map((layer) => ({
          ...layer,
          selected: layer.id === selectedKey,
        })),
      },
    });
  };

  useEffect(() => {
    let isCurrent = true;

    if (!areaTypeId || !areaIdId) {
      return () => {
        isCurrent = false;
        controller.cancelActiveRequests();
      };
    }

    const loadData = async () => {
      setChartStatus("loading");
      setDistributionData([]);
      controller.setArea(areaTypeId, areaIdId);

      dispatchSearchMap({
        type: SearchUpdated.RASTER_LAYERS,
        payload: {
          rasterLayers: [],
          showBackgroundLayer: true,
          forceLoadState: true,
        },
      });

      try {
        const distributionDataRes =
          await controller.getStrategicEcosystemsDistributionValues(SEType);

        if (!isCurrent) return;
        setDistributionData(distributionDataRes);
        setChartStatus("ready");

        const layersRes =
          await controller.getStrategicEcosystemsDistributionLayers(SEType);

        if (!isCurrent) return;

        dispatchSearchMap({
          type: SearchUpdated.RASTER_LAYERS,
          payload: {
            rasterLayers: layersRes,
            showBackgroundLayer: true,
            mapTitle: { name: `Coberturas - ${SELabels[SEType]}` },
          },
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const isCanceled = errorMessage.includes("request canceled");

        if (!isCurrent || isCanceled) return;

        setDistributionData([]);
        setChartStatus("error");
        dispatchSearchMap({
          type: SearchUpdated.LAYER_ERROR,
          layerError: errorMessage,
        });
      }
    };

    void loadData();

    return () => {
      isCurrent = false;
      controller.cancelActiveRequests();
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
