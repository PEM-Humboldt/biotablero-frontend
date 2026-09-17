import { useCallback, useEffect, useRef, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";

import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import { ShortInfo } from "@composites/ShortInfo";
import { IconTooltip } from "@ui/Tooltips";
import { matchColor } from "pages/search/utils/matchColor";
import { formatNumber } from "@utils/format";
import TextBoxes from "@ui/TextBoxes";

import type { ForestLPExt } from "pages/search/types/forest";
import { SmallBars } from "@composites/charts/SmallBars";
import type { TextsObject } from "pages/search/types/texts";
import { type MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { ForestLossPersistenceController } from "pages/search/dashboard/landscape/forest/ForestLossPersistenceController";
import type { RasterLayer } from "pages/search/types/layers";
import colorPalettes from "pages/search/utils/colorPalettes";
import { getMetricTexts } from "pages/search/utils/texts";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";

export function ForestLossPersistence() {
  const { areaType, areaId } = useSearchStateCTX();
  const dispatchSearchMap = useSearchDispatchCTX();

  const [showInfoGraph, setShowInfoGraph] = useState(true);
  const [forestLP, setForestLP] = useState<Array<ForestLPExt>>([]);
  const [message, setMessage] = useState<MessageWrapperType>("loading");
  const [currentPersistence, setCurrentPersistence] = useState(0);
  const [texts, setTexts] = useState<{ forestLP: TextsObject }>({
    forestLP: { info: "", cons: "", meto: "", quote: "" },
  });
  const [layers, setLayers] = useState<Array<RasterLayer>>([]);
  const [currentPeriod, setCurrentPeriod] = useState("");

  const controllerRef = useRef(new ForestLossPersistenceController());

  const areaTypeId = areaType?.id;
  const areaIdId = areaId?.id;

  const toggleInfoGraph = () => {
    setShowInfoGraph((prev) => !prev);
  };

  const switchLayer = useCallback(
    (period: string) => {
      const controller = controllerRef.current;

      dispatchSearchMap({
        type: SearchUpdated.LOADING_LAYER,
        loadingLayer: true,
      });

      controller
        .getLayers(period)
        .then((layersRes) => {
          setLayers(layersRes);
          dispatchSearchMap({
            type: SearchUpdated.RASTER_LAYERS,
            payload: {
              rasterLayers: layersRes,
              mapTitle: {
                name: `Pérdida y persistencia de bosque (${period})`,
              },
            },
          });
        })
        .catch((e) => {
          if (String(e).includes("Error: request canceled")) {
            dispatchSearchMap({
              type: SearchUpdated.LOADING_LAYER,
              loadingLayer: false,
            });
            return;
          }
          dispatchSearchMap({
            type: SearchUpdated.LAYER_ERROR,
            layerError: e instanceof Error ? e.message : String(e),
          });
        });
    },
    [dispatchSearchMap],
  );

  useEffect(() => {
    let isCurrent = true;

    if (!areaTypeId || !areaIdId) {
      dispatchSearchMap({
        type: SearchUpdated.LOADING_LAYER,
        loadingLayer: false,
      });
      return;
    }

    const controller = controllerRef.current;
    controller.setArea(areaTypeId, areaIdId);

    dispatchSearchMap({
      type: SearchUpdated.LOADING_LAYER,
      loadingLayer: true,
    });
    controller
      .getForestLPData()
      .then((data) => {
        if (!isCurrent) return;

        const nextPeriod = data.forestLP[data.forestLP.length - 1]?.id || "";
        setCurrentPeriod(nextPeriod);
        setForestLP(data.forestLP);
        setCurrentPersistence(data.currentPersistence);
        setMessage(null);

        if (nextPeriod) {
          switchLayer(nextPeriod);
        } else {
          dispatchSearchMap({
            type: SearchUpdated.LOADING_LAYER,
            loadingLayer: false,
          });
        }
      })
      .catch(() => {
        if (!isCurrent) return;
        setMessage("no-data");
        dispatchSearchMap({
          type: SearchUpdated.LOADING_LAYER,
          loadingLayer: false,
        });
      });

    getMetricTexts("lossPersistence")
      .then((res) => {
        if (!isCurrent) return;
        setTexts({ forestLP: res });
      })
      .catch(() => {});

    return () => {
      isCurrent = false;
      controller.cancelActiveRequests();
    };
  }, [areaTypeId, areaIdId, switchLayer, dispatchSearchMap]);

  if (!areaTypeId || !areaIdId) {
    return null;
  }

  const areaIdStr = areaIdId.toString();
  const graphData = controllerRef.current.getGraphData(forestLP);

  return (
    <div className="graphcontainer pt6">
      <h2>
        <IconTooltip title="Interpretación">
          <InfoIcon
            className={`metrics-info-icon${showInfoGraph ? " activeBox" : ""}`}
            onClick={toggleInfoGraph}
          />
        </IconTooltip>
      </h2>
      {showInfoGraph && (
        <ShortInfo
          description={`<p>${texts.forestLP.info}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
      <div>
        <h6>Cobertura actual</h6>
        <h5
          style={{
            backgroundColor:
              matchColor("forestLP")("Persistencia") ||
              colorPalettes.default[0],
          }}
        >
          {`${formatNumber(currentPersistence, 0)} ha `}
        </h5>
      </div>
      <div>
        <h6>Cobertura de bosque en el tiempo</h6>
      </div>
      <div>
        <SmallBars
          data={graphData.transformedData}
          keys={graphData.keys}
          tooltips={graphData.tooltips}
          loadStatus={message}
          margin={{
            left: 100,
            bottom: 50,
          }}
          axisY={{
            enabled: true,
            legend: "Periodo",
          }}
          axisX={{
            enabled: true,
            legend: "Hectáreas",
            format: ".2s",
          }}
          colors={(key: string) =>
            matchColor("forestLP")(key) || colorPalettes.default[0]
          }
          onClickHandler={(period, category) => {
            if (period === currentPeriod) {
              dispatchSearchMap({
                type: SearchUpdated.RASTER_LAYERS,
                payload: {
                  rasterLayers: layers.map((layer) => ({
                    ...layer,
                    selected: layer.id === category,
                  })),
                },
              });
            } else {
              setCurrentPeriod(period);
              switchLayer(period);
            }
          }}
          selectedIndexValue={currentPeriod}
        />
      </div>
      <TextBoxes
        consText={texts.forestLP.cons}
        metoText={texts.forestLP.meto}
        quoteText={texts.forestLP.quote}
        downloadData={controllerRef.current.getDownloadData(forestLP)}
        downloadName={`forest_loss_persistence_${areaTypeId}_${areaIdStr}.csv`}
        isInfoOpen={showInfoGraph}
        toggleInfo={toggleInfoGraph}
      />
    </div>
  );
}
