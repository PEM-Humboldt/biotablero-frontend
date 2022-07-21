import React, { useEffect, useState } from "react";

import AnnouncementIcon from "@mui/icons-material/Announcement";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

import ShortInfo from "components/ShortInfo";
import DownloadCSV from "components/DownloadCSV";
import { IconTooltip } from "components/Tooltips";

interface props {
  downloadData: Array<unknown>;
  downloadName: string;
  quoteText: string;
  metoText: string;
  consText: string;
  toggleInfo: () => void;
  isInfoOpen: boolean;
}

type boxValues = "meto" | "cons" | "quote" | null;

const TextBoxes: React.FC<props> = (props) => {
  const {
    downloadData,
    downloadName,
    quoteText,
    metoText,
    consText,
    toggleInfo,
    isInfoOpen,
  } = props;

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
      <h3 className="textBoxes">
        {metoText !== "" && (
          <IconTooltip title="Metodología">
            <CollectionsBookmarkIcon
              className={`graphinfo3${
                activeBox === "meto" ? " activeBox" : ""
              }`}
              onClick={() => clickOnBox("meto")}
            />
          </IconTooltip>
        )}
        {consText !== "" && (
          <IconTooltip title="Consideraciones">
            <AnnouncementIcon
              className={`graphinfo3${
                activeBox === "cons" ? " activeBox" : ""
              }`}
              onClick={() => clickOnBox("cons")}
            />
          </IconTooltip>
        )}
        {quoteText !== "" && (
          <IconTooltip title="Autoría">
            <FormatQuoteIcon
              className={`graphinfo3${
                activeBox === "quote" ? " activeBox" : ""
              }`}
              onClick={() => clickOnBox("quote")}
            />
          </IconTooltip>
        )}
        {downloadData.length !== 0 && (
          <DownloadCSV
            className="downBtnSpecial"
            data={downloadData}
            filename={downloadName}
          />
        )}
      </h3>
      {boxShown === "quote" && (
        <ShortInfo
          description={quoteText}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
      {boxShown === "meto" && (
        <ShortInfo
          description={metoText}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
      {boxShown === "cons" && (
        <ShortInfo
          description={consText}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
    </>
  );
};

export default TextBoxes;
