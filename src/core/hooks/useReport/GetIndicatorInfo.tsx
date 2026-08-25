import { useEffect, type ReactElement } from "react";

import { useReport } from "@hooks/useReport";
import type { IndicatorSection, IndicatorTag } from "@appTypes/report";

import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";

export function GetIndicatorInfo({
  graphId,
  mapUrl,
  mapElementId,
  children,
  singleMap = true,
}: {
  graphId: string;
  mapUrl: string | null;
  mapElementId: string | null;
  singleMap?: boolean;
  children: ReactElement;
}) {
  const { currentIndicator } = useIndicatorsCTX();
  const { setCurrentSectionPool } = useReport();

  useEffect(() => {
    if (!currentIndicator) {
      setCurrentSectionPool(null);
      return;
    }

    const tags = currentIndicator.tags.reduce<Record<number, IndicatorTag[]>>(
      (all, current) => {
        const tag = current.tag;
        if (!all[tag.category.id]) {
          all[tag.category.id] = [];
        }

        all[tag.category.id].push({
          name: tag.name,
          fullName: tag?.fullName,
          url: tag?.url,
        });

        return all;
      },
      {},
    );

    const lastVersion = currentIndicator.versions.at(-1);
    const { name, type, version } = currentIndicator;

    const sectionInfo: Omit<IndicatorSection, "graphs" | "mapUrl"> = {
      title: currentIndicator.name ?? currentIndicator.type.name,
      type: currentIndicator.type.name,
      creationDate: currentIndicator.creationDate,
      lastUpdate: lastVersion?.creationDate ?? currentIndicator.creationDate,
      version: currentIndicator.version,
      BiologicalGroupTag: tags[3] ?? [],
      EcosystemTag: tags[4] ?? [],
      description: currentIndicator.description,
      singleMap,
      card: {
        methodology: currentIndicator.methodology,
        interpretation: currentIndicator.interpretation,
        considerations: currentIndicator.considerations,
        authorship: currentIndicator.authorship,
      },
    };

    setCurrentSectionPool({
      sectionId: `${name}_${type.name}_${version}`,
      graphId: graphId,
      graphComponent: children,
      sectionInfo,
      mapUrl,
      mapElementId,
      sectionUrl: `${window.location.origin}/Monitoreo/Iniciativas/${currentIndicator.initiativeId}/Indicadores/${currentIndicator.indicatorId}`,
    });

    return () => {
      setCurrentSectionPool(null);
    };
  }, [
    graphId,
    singleMap,
    mapElementId,
    mapUrl,
    children,
    currentIndicator,
    setCurrentSectionPool,
  ]);

  return children;
}
