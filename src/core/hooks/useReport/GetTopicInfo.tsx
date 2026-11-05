import { useEffect, type ReactElement } from "react";

import { useReport } from "@hooks/useReport";
import type { IndicatorSection, IndicatorTag } from "@appTypes/report";

import { useTopicsCTX } from "pages/monitoring/hooks/useTopicsCTX";

export function GetTopicInfo({
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
  const { currentTopic } = useTopicsCTX();
  const { setCurrentSectionPool } = useReport();

  useEffect(() => {
    if (!currentTopic) {
      setCurrentSectionPool(null);
      return;
    }

    const tags = currentTopic.tags.reduce<Record<number, IndicatorTag[]>>(
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

    const lastVersion = currentTopic.versions.at(-1);
    const { name, topicType: type, version } = currentTopic;

    const sectionInfo: Omit<IndicatorSection, "graphs"> = {
      title: currentTopic.name ?? currentTopic.topicType.name,
      type: currentTopic.topicType.name,
      creationDate: currentTopic.creationDate,
      lastUpdate: lastVersion?.creationDate ?? currentTopic.creationDate,
      version: currentTopic.version,
      BiologicalGroupTag: tags[3] ?? [],
      EcosystemTag: tags[4] ?? [],
      description: currentTopic?.description ?? "",
      singleMap,
      url: `${window.location.origin}/Monitoreo/Iniciativas/${currentTopic.initiativeId}/Indicadores/${currentTopic.topicId}`,
      card: {
        methodology: currentTopic?.methodology ?? "",
        interpretation: currentTopic?.interpretation ?? "",
        considerations: currentTopic?.considerations ?? "",
        authorship: currentTopic?.authorship ?? "",
      },
    };

    setCurrentSectionPool({
      sectionId: `${name}_${type.name}_${version}`,
      graphId: graphId,
      graphComponent: children,
      sectionInfo,
      mapUrl,
      mapElementId,
      sectionUrl: `${window.location.origin}/Monitoreo/Iniciativas/${currentTopic.initiativeId}/Indicadores/${currentTopic.topicId}`,
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
    currentTopic,
    setCurrentSectionPool,
  ]);

  return children;
}
