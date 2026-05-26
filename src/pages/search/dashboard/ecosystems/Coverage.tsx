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
import { AddToReportButton } from "@hooks/useReport/AddReportButton";
import { useSearchStateCTX } from "pages/search/hooks/SearchContext";

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
  resetActiveSE?: () => void;
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
  const { mapTitle, searchType, areaId } = useSearchStateCTX();

  const graph = (
    <>
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
    </>
  );

  const reportId = [
    "coverage",
    areaId ? areaId.area_type.id : null,
    areaId ? areaId.name : null,
  ]
    .filter(Boolean)
    .join("_");

  const reportAdditionalInfo = {
    ["Tipo de consulta"]:
      searchType === "definedArea"
        ? "Areas definidas"
        : "Polígono personalizado",
    ["Tipo de area"]: areaId?.area_type.label ?? "Indefinida",
    ["Ubicación"]: areaId?.name.toLocaleLowerCase() ?? "Sin ubicación base",
  };

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
              fontSize="medium"
              className={`ecoest-info-icon${infoOpen ? " activeBox" : ""}`}
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

      {graph}

      <AddToReportButton
        sectionId={reportId}
        sectionTitle={mapTitle.name}
        sectionDescription={texts.info ?? "Testeo"}
        graphElement={graph}
        includeMap={true}
        mapContainerId="map"
        graphStateId={null}
        aditionalInfo={reportAdditionalInfo}
      />

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
