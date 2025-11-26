import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { IconTooltip } from "@ui/Tooltips";
import { ShortInfo } from "@composites/ShortInfo";
import SmallStackedBar, {
  SmallStackedBarData,
} from "@composites/charts/SmallStackedBar";
import TextBoxes from "@ui/TextBoxes";
import matchColor from "pages/search/utils/matchColor";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";

interface Props {
  coverage: SmallStackedBarData[];
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
  onClickGraph: (id: string) => void;
  resetActiveSE: () => void;
}

export function Coverage({
  coverage,
  infoOpen,
  toggleInfo,
  texts,
  messages,
  areaIdStr,
  onClickGraph,
  resetActiveSE,
}: Props) {
  return (
    <>
      <button onClick={resetActiveSE} type="button" className="tittlebtn">
        <h4>Cobertura</h4>
      </button>

      <IconTooltip title="Interpretación">
        <InfoIcon
          className={`downSpecial${infoOpen ? " activeBox" : ""}`}
          onClick={toggleInfo}
        />
      </IconTooltip>

      {infoOpen && (
        <ShortInfo
          description={`<p>${texts.info}</p>`}
          className="graphinfo3"
          collapseButton={false}
        />
      )}

      <h6>Natural, Secundaria y Transformada:</h6>

      <div className="graficaeco">
        <div className="svgPointer">
          <SmallStackedBar
            loadStatus={messages}
            data={coverage}
            units="ha"
            colors={matchColor("coverage")}
            onClickGraphHandler={onClickGraph}
          />
        </div>
      </div>

      <TextBoxes
        downloadData={coverage}
        downloadName={`eco_coverages_${areaIdStr}.csv`}
        quoteText={texts.quote}
        metoText={texts.meto}
        consText={texts.cons}
        toggleInfo={toggleInfo}
        isInfoOpen={infoOpen}
      />
    </>
  );
}
