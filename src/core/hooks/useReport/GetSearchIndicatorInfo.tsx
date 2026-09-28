import { type ReactElement, useEffect } from "react";

import type { GraphDTO, SearchSection } from "@appTypes/report";
import type { TextsObject } from "pages/search/types/texts";
import { useReport } from "@hooks/useReport";

export function GetSearchIndicatorInfo({
  wrapperId,
  title,
  graphInfo,
  tableData,
  graphId,
  includesMap,
  children,
}: {
  wrapperId: string;
  title: string;
  graphInfo?: TextsObject;
  tableData: GraphDTO[] | Record<string, string | number>[];
  graphId: string;
  mapElementId?: string;
  includesMap: boolean;
  children: ReactElement;
}) {
  const { addSectionToRegistry, removeSectionFromRegistry } = useReport();

  useEffect(() => {
    const { info, ...otherInfo } = graphInfo ?? {};
    const sectionInfo: Omit<SearchSection, "graphs"> = {
      title,
      description: info ?? "",
      graphInfo: otherInfo,
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
