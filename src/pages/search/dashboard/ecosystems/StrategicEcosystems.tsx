import InfoIcon from "@mui/icons-material/Info";
import { IconTooltip } from "@ui/Tooltips";
import { ShortInfo } from "@composites/ShortInfo";
import TextBoxes from "@ui/TextBoxes";
import EcosystemsBox from "pages/search/dashboard/ecosystems/EcosystemsBox";
import { SEPAData } from "pages/search/types/ecosystems";
import { MessageWrapperType } from "@composites/charts/withMessageWrapper";
import { formatNumber } from "@utils/format";
import { transformSEAreas } from "pages/search/dashboard/ecosystems/transformData";

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

interface Props {
  SEAreas: SEPAData[];
  SETotalArea: number;
  areaHa: number;
  activeSE: string;
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
  setActiveSE: (id: string) => void;
  isLoading: boolean;
  noData: boolean;
}

export function StrategicEcosystems({
  SEAreas,
  SETotalArea,
  areaHa,
  activeSE,
  infoOpen,
  toggleInfo,
  texts,
  messages,
  areaIdStr,
  setActiveSE,
  isLoading,
  noData,
}: Props) {
  const percentage = getPercentage(SETotalArea, areaHa);

  return (
    <div className="ecoest">
      <h4 className="minus20">
        Ecosistemas estratégicos <b>{`${formatNumber(SETotalArea, 0)} ha`}</b>
      </h4>

      <IconTooltip title="Interpretación">
        <InfoIcon
          className={`downSpecial2${infoOpen ? " activeBox" : ""}`}
          onClick={toggleInfo}
        />
      </IconTooltip>

      <h5 className="minusperc">{`${percentage} %`}</h5>

      {percentage > 100 && (
        <h3 className="warningNote">
          La superposición de ecosistemas estratégicos puede resultar en un
          valor mayor al área total.
        </h3>
      )}

      {infoOpen && (
        <ShortInfo
          description={`<p>${texts.info}</p>`}
          className="graphinfo3"
          collapseButton={false}
        />
      )}

      {isLoading && "Cargando..."}

      {!isLoading &&
        noData &&
        "No hay información de ecosistemas estratégicos."}

      {!isLoading && !noData && (
        <EcosystemsBox
          SETotalArea={SETotalArea}
          SEAreas={transformSEAreas(SEAreas, areaHa)}
          activeSE={activeSE}
          setActiveSE={setActiveSE}
        />
      )}

      <TextBoxes
        downloadData={SEAreas}
        downloadName={`eco_strategic_ecosystems_${areaIdStr}.csv`}
        quoteText={texts.quote}
        metoText={texts.meto}
        consText={texts.cons}
        toggleInfo={toggleInfo}
        isInfoOpen={infoOpen}
      />
    </div>
  );
}
