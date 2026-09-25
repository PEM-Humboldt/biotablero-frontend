import { useEffect, type ReactElement } from "react";

import { useReport } from "@hooks/useReport";
import type { IndicatorSection, IndicatorTag } from "@appTypes/report";

import { useObservationsCTX } from "pages/monitoring/hooks/useObservationsCTX";

export function GetObservationInfo({
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
  const { currentObservation } = useObservationsCTX();
  const { setCurrentSectionPool } = useReport();

  useEffect(() => {
    if (!currentObservation) {
      setCurrentSectionPool(null);
      return;
    }

    const tags = currentObservation.tags.reduce<Record<number, IndicatorTag[]>>(
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

    const lastVersion = currentObservation.versions.at(-1);
    const { name, topic: type, version } = currentObservation;

    const sectionInfo: Omit<IndicatorSection, "graphs" | "mapUrl"> = {
      title: currentObservation.name ?? currentObservation.topic.name,
      type: currentObservation.topic.name,
      creationDate: currentObservation.creationDate,
      lastUpdate: lastVersion?.creationDate ?? currentObservation.creationDate,
      version: currentObservation.version,
      BiologicalGroupTag: tags[3] ?? [],
      EcosystemTag: tags[4] ?? [],
      description: currentObservation?.description ?? "",
      singleMap,
      card: {
        methodology: currentObservation?.methodology ?? "",
        interpretation: currentObservation?.interpretation ?? "",
        considerations: currentObservation?.considerations ?? "",
        authorship: currentObservation?.authorship ?? "",
      },
    };

    setCurrentSectionPool({
      sectionId: `${name}_${type.name}_${version}`,
      graphId: graphId,
      graphComponent: children,
      sectionInfo,
      mapUrl,
      mapElementId,
      sectionUrl: `${window.location.origin}/Monitoreo/Iniciativas/${currentObservation.initiativeId}/Indicadores/${currentObservation.observationId}`,
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
    currentObservation,
    setCurrentSectionPool,
  ]);

  return children;
}
