import { useEffect, useContext, useState } from "react";

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

  const context = useContext(SearchLegacyCTX) as LegacyContextValues;

  const { areaType, areaId } = context;
  const controller = new StrategicEcosystemsDistributionController();
  const loading = chartStatus === "loading";

  const loadStatus: MessageWrapperType = loading
    ? "loading"
    : chartStatus === "error" || distributionData.length === 0
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

  const isCancelError = (error: unknown) =>
    String(error).toLowerCase().includes("cancel");

  useEffect(() => {
    setChartStatus("loading");
    setDistributionData([]);
    setLayers([]);
    controller.setArea(areaTypeId, areaIdId);

    context.setRasterLayers([]);
    context.setLoadingLayer(true);

    const loadData = async () => {
      try {
        const distributionDataRes =
          await controller.getStrategicEcosystemsDistributionValues(SEType);
        setDistributionData(distributionDataRes);
        setChartStatus("ready");
      } catch (error) {
        if (isCancelError(error)) {
          return;
        }
        setDistributionData([]);
        setChartStatus("error");
        context.setLoadingLayer(false);
        return;
      }

      try {
        const layersRes =
          await controller.getStrategicEcosystemsDistributionLayers(SEType);
        setLayers(layersRes);
        context.setRasterLayers(layersRes);
        context.setMapTitle({ name: `Coberturas - ${SELabels[SEType]}` });
      } catch (error) {
        if (!isCancelError(error)) {
          context.setLayerError?.(
            error instanceof Error ? error.message : String(error),
          );
        }
      } finally {
        context.setLoadingLayer(false);
      }
    };

    void loadData();

    return () => {
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
