import { useReport } from "@hooks/useReport";
import { useEffect, type ReactElement } from "react";
import { useIndicatorsCTX } from "pages/monitoring/hooks/useIndicatorsCTX";
import type { IndicatorSection, IndicatorTag } from "@appTypes/report";

export function GetIndicatorInfo({
  graphStateStringId,
  mapFromLeafletElementId,
  children,
}: {
  graphStateStringId: string;
  mapFromLeafletElementId: string | null;
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
      card: {
        methodology: currentIndicator.methodology,
        interpretation: currentIndicator.interpretation,
        considerations: currentIndicator.considerations,
        authorship: currentIndicator.authorship,
      },
    };

    setCurrentSectionPool({
      sectionId: `${name}_${type.name}_${version}`,
      graphId: graphStateStringId,
      graphComponent: children,
      sectionInfo,
      mapFromLeafletElementId,
    });

    return () => {
      setCurrentSectionPool(null);
    };
  }, [
    graphStateStringId,
    mapFromLeafletElementId,
    children,
    currentIndicator,
    setCurrentSectionPool,
  ]);

  return children;
}
