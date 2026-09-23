import { useEffect, useState } from "react";

import AnnouncementIcon from "@mui/icons-material/Announcement";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

import { ShortInfo } from "@composites/ShortInfo";
import DownloadCSV from "@ui/DownloadCSV";
import { IconTooltip } from "@ui/Tooltips";
import { AddSearchIndicatorToReportBtn } from "@ui/AddSearchIndicatorToReport";

interface TextBoxProps {
  downloadData?: Array<unknown>;
  downloadName: string;
  quoteText: string;
  metoText: string;
  consText: string;
  toggleInfo: () => void;
  isInfoOpen: boolean;
  addToReportWrapperId?: string;
}

type boxValues = "meto" | "cons" | "quote" | null;

// TODO: Actualizar los íconos al nuevo look&feel
function TextBoxes({
  downloadData,
  downloadName,
  quoteText,
  metoText,
  consText,
  toggleInfo,
  isInfoOpen,
  addToReportWrapperId,
}: TextBoxProps) {
  const [boxShown, setBoxShown] = useState<boxValues>(null);
  const [activeBox, setActiveBox] = useState<boxValues>(null);

  useEffect(() => {
    if (isInfoOpen) {
      setBoxShown(null);
      setActiveBox(null);
    }
  }, [isInfoOpen]);

  const clickOnBox = (name: boxValues) => {
    if (name === boxShown) {
      setBoxShown(null);
      setActiveBox(null);
    } else {
      setBoxShown(name);
      setActiveBox(name);
    }
    if (isInfoOpen) {
      toggleInfo();
    }
  };

  return (
    <>
      <div className="flex items-centera py-1 px-2 text-grey *:hover:text-accent">
        {addToReportWrapperId && (
          <IconTooltip title="Agregar a reporte">
            <span>
              <AddSearchIndicatorToReportBtn
                wrapperId={addToReportWrapperId}
                inButtonGroup={true}
              />
            </span>
          </IconTooltip>
        )}
        {metoText !== "" && (
          <button onClick={() => clickOnBox("meto")} title="Metodología">
            <CollectionsBookmarkIcon
              className={`graphinfo3${
                activeBox === "meto" ? " activeBox" : ""
              }`}
            />
          </button>
        )}
        {consText !== "" && (
          <button onClick={() => clickOnBox("cons")} title="Consideraciones">
            <AnnouncementIcon
              className={`graphinfo3${
                activeBox === "cons" ? " activeBox" : ""
              }`}
            />
          </button>
        )}
        {quoteText !== "" && (
          <button onClick={() => clickOnBox("quote")} title="Consideraciones">
            <FormatQuoteIcon
              className={`graphinfo3${
                activeBox === "quote" ? " activeBox" : ""
              }`}
            />
          </button>
        )}
        {downloadData?.length !== 0 && (
          <DownloadCSV
            className="downBtnSpecial"
            data={downloadData}
            filename={downloadName}
          />
        )}
      </div>

      {boxShown === "quote" && (
        <ShortInfo
          description={`<p>${quoteText}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
      {boxShown === "meto" && (
        <ShortInfo
          description={`<p>${metoText}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
      {boxShown === "cons" && (
        <ShortInfo
          description={`<p>${consText}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
    </>
  );
}

export default TextBoxes;
