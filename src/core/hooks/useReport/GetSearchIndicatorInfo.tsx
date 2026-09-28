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
  tableData: GraphDTO[] | Record<string, string | number>[];
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
      // NOTE: actualizar el enlace cuando el estado de seccion dependa de url
      url: window.location.href,
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
    addSectionToRegistry,
    children,
    description,
    graphId,
    graphInfo,
    includesMap,
    removeSectionFromRegistry,
    tableData,
    title,
    wrapperId,
  ]);

  return children;
}
