import InfoIcon from "@mui/icons-material/Info";
import { IconTooltip } from "@ui/Tooltips";
import { ShortInfo } from "@composites/ShortInfo";
import SmallStackedBar, {
  SmallStackedBarData,
} from "@composites/charts/SmallStackedBar";
import TextBoxes from "@ui/TextBoxes";
import { matchColor } from "pages/search/utils/matchColor";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";
import colorPalettes from "pages/search/utils/colorPalettes";

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
      <div className="graphcontainer">
        <h4>
          <button type="button" onClick={resetActiveSE}>
            Cobertura
          </button>
        </h4>

        <IconTooltip title="Interpretación">
          <span className="iconWrapper">
            <InfoIcon
              fontSize="inherit"
              className={`downSpecial${infoOpen ? " activeBox" : ""}`}
              onClick={toggleInfo}
            />
          </span>
        </IconTooltip>

        {infoOpen && (
          <ShortInfo
            description={`<p>${texts.info}</p>`}
            className="graphinfo3"
            collapseButton={false}
          />
        )}
      </div>

      <h6>Natural, Secundaria y Transformada:</h6>

      <div className="graficaeco">
        <div className="svgPointer">
          <SmallStackedBar
            loadStatus={messages}
            data={coverage}
            units="ha"
            colors={(key: string) =>
              matchColor("coverage")(key) || colorPalettes.default[0]
            }
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
