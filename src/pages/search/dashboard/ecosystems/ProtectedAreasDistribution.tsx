import { useEffect, useRef, useState } from "react";

import SmallStackedBar, {
  SmallStackedBarData,
} from "@composites/charts/SmallStackedBar";
import colorPalettes from "pages/search/utils/colorPalettes";

import { useSearchLegacyCTX } from "pages/search/hooks/SearchContext";

import { ProtectedAreasDistributionController } from "pages/search/dashboard/ecosystems/ProtectedAreasDistributionController";
import { matchColor } from "pages/search/utils/matchColor";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { SEKey } from "pages/search/types/ecosystems";

type ChartStatus = "loading" | "ready" | "error";

interface Props {
  SEType: SEKey;
}

export function ProtectedAreasDistribution({ SEType }: Props) {
  const [distributionData, setDistributionData] = useState<
    SmallStackedBarData[]
  >([]);
  const [chartStatus, setChartStatus] = useState<ChartStatus>("loading");

  const { areaType, areaId, areaHa } = useSearchLegacyCTX();

  const controllerRef = useRef(new ProtectedAreasDistributionController());
  const controller = controllerRef.current;
  const protectedAreasColors = matchColor("pa", true);

  let loadStatus: MessageWrapperType = null;

  if (chartStatus === "loading") {
    loadStatus = "loading";
  } else if (chartStatus === "error" || distributionData.length === 0) {
    loadStatus = "no-data";
  }

  const areaTypeId = areaType?.id;
  const areaIdId = areaId?.id;

  useEffect(() => {
    let isCurrent = true;

    if (!areaTypeId || !areaIdId) {
      return () => {
        isCurrent = false;
        controller.cancelActiveRequests();
      };
    }

    setChartStatus("loading");
    setDistributionData([]);
    controller.setArea(areaTypeId, areaIdId);

    controller
      .getProtectedAreasDistributionValues(SEType, areaHa ?? 0)
      .then((distributionDataRes) => {
        if (!isCurrent) return;
        setDistributionData(distributionDataRes);
        setChartStatus("ready");
      })
      .catch((error) => {
        if (!isCurrent) return;

        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("request canceled")) {
          return;
        }
        setDistributionData([]);
        setChartStatus("error");
      });

    return () => {
      isCurrent = false;
      controller.cancelActiveRequests();
    };
  }, [areaTypeId, areaIdId, areaHa, SEType]);

  return (
    <>
      <h3>Distribución en áreas protegidas:</h3>

      <div className="graficaeco">
        <div className="svgPointer">
          <SmallStackedBar
            loadStatus={loadStatus}
            data={distributionData}
            units="ha"
            colors={(key: string) =>
              protectedAreasColors(key) || colorPalettes.default[0]
            }
          />
        </div>
      </div>
    </>
  );
}
