import { useEffect, useRef, useState } from "react";

import SmallStackedBar, {
  SmallStackedBarData,
} from "@composites/charts/SmallStackedBar";
import colorPalettes from "pages/search/utils/colorPalettes";

import { RasterLayer } from "pages/search/types/layers";

import { useSearchLegacyCTX } from "pages/search/hooks/SearchContext";

import { StrategicEcosystemsDistributionController } from "pages/search/dashboard/ecosystems/StrategicEcosystemsDistributionController";
import { matchColor } from "pages/search/utils/matchColor";
import { SEKey, SELabels } from "pages/search/types/ecosystems";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";

interface Props {
  SEType: SEKey;
  disableGraphClick?: boolean;
}

type ChartStatus = "loading" | "ready" | "error";

export function StrategicEcosystemsDistribution({
  SEType,
  disableGraphClick = false,
}: Props) {
  const [distributionData, setDistributionData] = useState<
    SmallStackedBarData[]
  >([]);
  const [layers, setLayers] = useState<RasterLayer[]>([]);
  const [chartStatus, setChartStatus] = useState<ChartStatus>("loading");

  const {
    areaType,
    areaId,
    setLoadingLayer,
    setRasterLayers,
    setShowAreaLayer,
    setMapTitle,
    setLayerError,
  } = useSearchLegacyCTX();

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
    if (disableGraphClick) {
      return;
    }
    setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === selectedKey,
      })),
    );
  };

  useEffect(() => {
    let isCurrent = true;

    if (!areaTypeId || !areaIdId) {
      setLoadingLayer(false);
      return () => {
        isCurrent = false;
        controller.cancelActiveRequests();
      };
    }

    const loadData = async () => {
      setChartStatus("loading");
      setDistributionData([]);
      setLayers([]);
      controller.setArea(areaTypeId, areaIdId);

      setShowAreaLayer(true);
      setRasterLayers([]);
      setLoadingLayer(true);

      try {
        const distributionDataRes =
          await controller.getStrategicEcosystemsDistributionValues(SEType);

        if (!isCurrent) return;
        setDistributionData(distributionDataRes);
        setChartStatus("ready");

        const layersRes =
          await controller.getStrategicEcosystemsDistributionLayers(SEType);

        if (!isCurrent) return;
        setLayers(layersRes);
        setRasterLayers(layersRes);
        setMapTitle({ name: `Coberturas - ${SELabels[SEType]}` });
        setLoadingLayer(false);
      } catch (error) {
        if (!isCurrent) return;

        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes("request canceled")) {
          setLayerError?.(errorMessage);
        }
        setDistributionData([]);
        setChartStatus("error");
        setLoadingLayer(false);
      }
    };

    loadData();

    return () => {
      isCurrent = false;
      controller.cancelActiveRequests();
    };
  }, [areaTypeId, areaIdId, SEType, controller]);

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
