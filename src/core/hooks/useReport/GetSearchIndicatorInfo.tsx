import { type ReactElement, useEffect } from "react";

import type { GraphDTO, SearchSection } from "@appTypes/report";
import { useReport } from "@hooks/useReport";

export function GetSearchIndicatorInfo({
  wrapperId,
  title,
  description,
  graphInfo,
  tableData,
  graphId,
  includesMap,
  children,
}: {
  wrapperId: string;
  title: string;
  description: string;
  graphInfo?: Record<string, string>;
  tableData: GraphDTO[];
  graphId: string;
  mapElementId?: string;
  includesMap: boolean;
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

    addSectionToRegistry(wrapperId, {
      sectionId: title,
      graphId,
      graphComponent: children,
      sectionInfo,
      mapUrl: null,
      mapElementId: includesMap ? "map" : null,
      sectionUrl: window.location.href,
    });

    return () => {
      removeSectionFromRegistry(title);
    };
  }, [
    wrapperId,
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
