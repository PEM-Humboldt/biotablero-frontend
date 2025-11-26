import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { IconTooltip } from "@ui/Tooltips";
import { ShortInfo } from "@composites/ShortInfo";
import SmallStackedBar from "@composites/charts/SmallStackedBar";
import TextBoxes from "@ui/TextBoxes";
import matchColor from "pages/search/utils/matchColor";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { formatNumber } from "@utils/format";

/**
 * Calculate percentage for a given value according to total
 *
 * @param {number} part value for the given part
 * @param {number} total value obtained by adding all parts
 *
 * @returns {number} percentage associated to each part
 */
const getPercentage = (part: number, total: number): number =>
  parseFloat(((part * 100) / total).toFixed(2));

interface PAArea {
  area: number;
  label: string;
  key: string;
  percentage: number;
}

interface Props {
  PAAreas: PAArea[];
  PATotalArea: number;
  PADivergentData: boolean;
  areaHa: number;
  infoOpen: boolean;
  toggleInfo: () => void;
  texts: {
    info: string;
    cons: string;
    meto: string;
    quote: string;
  };
  messages: MessageWrapperType;
  areaIdStr: string;
}

export function ProtectedAreas({
  PAAreas,
  PATotalArea,
  PADivergentData,
  areaHa,
  infoOpen,
  toggleInfo,
  texts,
  messages,
  areaIdStr,
}: Props) {
  return (
    <>
      <h4>
        Áreas protegidas <b>{`${formatNumber(PATotalArea, 0)} ha`}</b>
      </h4>

      <IconTooltip title="Interpretación">
        <InfoIcon
          className={`downSpecial${infoOpen ? " activeBox" : ""}`}
          onClick={toggleInfo}
        />
      </IconTooltip>

      <h5>{`${getPercentage(PATotalArea, areaHa)} %`}</h5>

      {infoOpen && (
        <ShortInfo
          description={`<p>${texts.info}</p>`}
          className="graphinfo3"
          collapseButton={false}
        />
      )}

      <div className="graficaeco">
        <h6>Distribución por áreas protegidas:</h6>
        <SmallStackedBar
          loadStatus={messages}
          data={PAAreas}
          units="ha"
          colors={matchColor("pa", true)}
          scaleType={PADivergentData ? "symlog" : "linear"}
        />
      </div>

      <TextBoxes
        downloadData={PAAreas}
        downloadName={`eco_protected_areas_${areaIdStr}.csv`}
        quoteText={texts.quote}
        metoText={texts.meto}
        consText={texts.cons}
        toggleInfo={toggleInfo}
        isInfoOpen={infoOpen}
      />
    </>
  );
}
