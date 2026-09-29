import {
  InfoIcon,
  type LucideIcon,
  MessageCircleQuestionMark,
} from "lucide-react";
import { useEffect, useState } from "react";

import { ShortInfo } from "@composites/ShortInfo";
import DownloadCSV from "@ui/DownloadCSV";
import { AddSearchIndicatorToReportBtn } from "@ui/AddSearchIndicatorToReport";

import type { TextsObject } from "pages/search/types/texts";

// NOTE: Merecemos mejor que material, borrar apenas se
// se actualice Search a la nueva UI
import AnnouncementIcon from "@mui/icons-material/Announcement";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { type OverridableComponent } from "@mui/material/OverridableComponent";
import { type SvgIconTypeMap } from "@mui/material";

type boxValues = keyof TextsObject | null;
interface DownloadProps<T = Record<string, unknown>> {
  data: T[];
  filename: string;
}

const keyTitleDictionary: Record<
  keyof TextsObject,
  {
    title: string;
    icon: OverridableComponent<SvgIconTypeMap<unknown, "svg">> | LucideIcon;
  }
> = {
  info: { title: "Información", icon: InfoIcon },
  meto: { title: "Metodología", icon: CollectionsBookmarkIcon },
  cons: { title: "Consideraciones", icon: AnnouncementIcon },
  quote: { title: "Autoría", icon: FormatQuoteIcon },
  helper: { title: "Ayuda", icon: MessageCircleQuestionMark },
};

export function TextBoxes<T>({
  addToReportWrapperId,
  texts,
  textsToDisplay = ["meto", "cons", "quote"],
  toggleInfo,
  isInfoOpen,
  download,
}: {
  addToReportWrapperId?: string;
  texts: Partial<TextsObject>;
  textsToDisplay?: (keyof TextsObject)[];
  toggleInfo: () => void;
  isInfoOpen: boolean;
  download: DownloadProps<T>;
}) {
  const [activeBox, setActiveBox] = useState<boxValues>(null);

  useEffect(() => {
    if (isInfoOpen) {
      setActiveBox(null);
    }
  }, [isInfoOpen]);

  const clickOnBox = (name: boxValues) => {
    setActiveBox((prev) => (prev === name ? null : name));

    if (isInfoOpen) {
      toggleInfo();
    }
  };

  const textsAvailable = textsToDisplay.filter(
    (t) => texts[t] !== undefined && texts[t] !== "" && keyTitleDictionary[t],
  );

  return (
    <>
      <div className="flex items-center py-1 px-2 text-grey *:hover:text-accent">
        {addToReportWrapperId && (
          <AddSearchIndicatorToReportBtn
            wrapperId={addToReportWrapperId}
            inButtonGroup={true}
          />
        )}

        {textsAvailable.map((textKey) => {
          const { title, icon: Icon } = keyTitleDictionary[textKey];
          return (
            <button
              key={`indicatorHelper_${textKey}`}
              onClick={() => clickOnBox(textKey)}
              title={title}
            >
              <Icon
                className={`graphinfo3${
                  activeBox === textKey ? " activeBox" : ""
                }`}
              />
            </button>
          );
        })}

        {download && download.data.length > 0 && (
          <DownloadCSV
            className="downBtnSpecial"
            data={download.data}
            filename={download.filename}
          />
        )}
      </div>

      {activeBox !== null && (
        <ShortInfo
          description={`<p>${texts[activeBox]}</p>`}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
    </>
  );
}
