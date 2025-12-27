import React, { useContext, useEffect, useState } from "react";

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

interface Props {}

const CurrentFootprint: React.FC<Props> = () => {
  const context = useContext(SearchLegacyCTX) as LegacyContextValues;
  const {
    areaType,
    areaId,
    setRasterLayers,
    setLoadingLayer,
    setLayerError,
    setMapTitle,
  } = context;

  const [showInfoGraph, setShowInfoGraph] = useState(true);
  const [period, setPeriod] = useState("");
  const [hfCurrent, setHfCurrent] = useState<LargeStackedBarData[]>([]);
  const [hfCurrentValue] = useState("0");
  const [hfCurrentCategory] = useState("");
  const [message, setMessage] = useState<MessageWrapperType>("loading");
  const [texts, setTexts] = useState<{ hfCurrent: textsObject }>({
    hfCurrent: { info: "", cons: "", meto: "", quote: "" },
  });
  const [layers, setLayers] = useState<RasterLayer[]>([]);

  const controller = new CurrentFootprintController();

  const areaTypeId = areaType!.id;
  const areaIdId = areaId!.id.toString();

  useEffect(() => {
    controller.setArea(areaTypeId, areaIdId);

    SearchAPI.requestMetricsValues<"CurrentHF">("CurrentHF", Number(areaIdId))
      .then((res) => {
        const obtainedPeriod = res[0]?.ano ?? "";
        setHfCurrent(controller.transformData(res));
        setPeriod(obtainedPeriod);
        setMessage(null);
        switchLayer(obtainedPeriod);
      })
      .catch(() => {
        setMessage("no-data");
      });

    BackendAPI.requestSectionTexts("hfCurrent")
      .then((res) => {
        setTexts({ hfCurrent: res });
      })
      .catch(() => {
        setTexts({
          hfCurrent: { info: "", cons: "", meto: "", quote: "" },
        });
      });

    return () => {
      controller.cancelActiveRequests();
    };
  }, [areaTypeId, areaIdId]);

  useEffect(() => {
    if (!period) return;

    setLoadingLayer(true);

    controller
      .getCurrentHFLayers(period)
      .then((newLayers) => {
        setLayers(newLayers);
        setRasterLayers(newLayers);
        setLoadingLayer(false);
        setMapTitle({ name: `HH promedio · ${period}` });
      })
      .catch((e) => {
        if (e.toString() !== "Error: request canceled") {
          setLayerError(e.toString());
        }
      });
  }, [period]);

  const switchLayer = (period: string) => {
    setLoadingLayer(true);
    controller
      .getCurrentHFLayers(period)
      .then((layers) => {
        setRasterLayers(layers);
        setLoadingLayer(false);
        setMapTitle({
          name: `HH promedio · ${period}`,
        });
      })
      .catch((e) => {
        if (e.toString() != "Error: request canceled") {
          setLayerError(e.toString());
        }
      });
  };

  const toggleInfoGraph = () => {
    setShowInfoGraph((prev) => !prev);
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
          <InfoIcon
            className={`graphinfo${showInfoGraph ? " activeBox" : ""}`}
            onClick={toggleInfoGraph}
          />
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
};

export default CurrentFootprint;
