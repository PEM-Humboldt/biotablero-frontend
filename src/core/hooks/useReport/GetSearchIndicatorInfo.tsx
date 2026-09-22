import type { GraphDTO, SearchSection } from "@appTypes/report";
import { useReport } from "@hooks/useReport";
import { ReactElement, useEffect } from "react";

export function GetSearchIndicatorInfo({
  title,
  description,
  graphInfo,
  tableData,
  graphId,
  children,
}: {
  title: string;
  description: string;
  graphInfo?: Record<string, string>;
  tableData: GraphDTO[];
  graphId: string;
  mapElementId?: string;
  children: ReactElement;
}) {
  const {
    setCurrentSectionPool,
    wrapperIdToCapture,
    setWrapperIdToCapture,
    addSection,
  } = useReport();

  useEffect(() => {
    if (title !== wrapperIdToCapture) {
      return;
    }

    console.log("salio el", title);

    const sectionInfo: Omit<SearchSection, "graphs"> = {
      title,
      description,
      graphInfo,
      rawData: tableData,
    };

    setCurrentSectionPool({
      sectionId: title,
      graphId,
      graphComponent: children,
      sectionInfo,
      mapUrl: null,
      mapElementId: "map",
      sectionUrl: window.location.href,
    });

    console.log("aca");
    void addSection();
    setWrapperIdToCapture("");
  }, [
    title,
    children,
    description,
    graphId,
    graphInfo,
    tableData,
    addSection,
    wrapperIdToCapture,
    setWrapperIdToCapture,
    setCurrentSectionPool,
  ]);

  return children;
}
