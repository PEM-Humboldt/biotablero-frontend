import type {
  MonitoringResource,
  ResourceTag,
} from "pages/monitoring/types/odataResponse";
import type { MonirotingResourceForm } from "pages/monitoring/outlets/resources/manager/resourcesEditor/types/resources";

export function setInitialInformation(
  resource: MonitoringResource | null,
): MonirotingResourceForm {
  return {
    initiativeId: resource?.initiativeId || null,
    name: resource?.name || "",
    description: resource?.description || "",
    isDraft: resource?.isDraft || false,
    files: resource?.files && resource.files.length > 0 ? resource.files : [],
    links: resource?.links && resource.links.length > 0 ? resource.links : [],
    tags:
      resource?.tags && resource.tags.length > 0
        ? resource.tags.reduce<Record<number, ResourceTag[]>>((all, tag) => {
            const tagCategoryId = tag.tag.category.id;
            if (!all[tagCategoryId]) {
              all[tagCategoryId] = [];
            }
            all[tagCategoryId].push(tag);
            return all;
          }, {})
        : {},
  };
}
