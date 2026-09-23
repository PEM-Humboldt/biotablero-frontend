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
  const { addSectionToRegistry, removeSectionFromRegistry } = useReport();

  useEffect(() => {
    const sectionInfo: Omit<SearchSection, "graphs"> = {
      title,
      description,
      graphInfo,
      rawData: tableData,
    };

    addSectionToRegistry(title, {
      sectionId: title,
      graphId,
      graphComponent: children,
      sectionInfo,
      mapUrl: null,
      mapElementId: "map",
      sectionUrl: window.location.href,
    });

    return () => {
      removeSectionFromRegistry(title);
    };
  }, [
    title,
    children,
    description,
    graphId,
    graphInfo,
    tableData,
    addSectionToRegistry,
    removeSectionFromRegistry,
  ]);

  return children;
}
