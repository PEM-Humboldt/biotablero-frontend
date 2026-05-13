import type { MonitoringResource } from "pages/monitoring/types/odataResponse";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { SearchBarComponent } from "@appTypes/odata";
import { getTags } from "pages/monitoring/api/services/tags";
import { uiText } from "pages/monitoring/outlets/resources/layout/uiText";

export async function makeSearchResourcesComponents(): Promise<
  SearchBarComponent<MonitoringResource>[]
> {
  const searchComponents: SearchBarComponent<MonitoringResource>[] = [
    {
      type: "text",
      label: "Buscar",
      source: ["name"],
    },
  ];

  const biologicalTags = async () => {
    const res = await getTags({
      filter: "category/id eq 3 or category/id eq 4",
    });
    if (isMonitoringAPIError(res)) {
      return { 3: [], 4: [] };
    }

    return res.value.reduce<Record<number, { value: number; name: string }[]>>(
      (all, tag) => {
        if (!all[tag.category.id]) {
          all[tag.category.id] = [];
        }
        all[tag.category.id].push({ value: tag.id, name: tag.name });

        return all;
      },
      {},
    );
  };

  const tagGroups = await biologicalTags();
  if (3 in tagGroups) {
    searchComponents.push({
      type: "select",
      values: tagGroups[3],
      label: uiText.tagsTitle.ecosystem,
      oDataEntity: "ResourceTags",
      source: ["tag/id"],
    });
  }
  if (4 in tagGroups) {
    searchComponents.push({
      type: "select",
      values: tagGroups[4],
      label: uiText.tagsTitle.BiologicalGroup,
      oDataEntity: "ResourceTags",
      source: ["tag/id"],
    });
  }

  return searchComponents;
}
