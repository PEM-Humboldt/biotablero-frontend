import type {
  ODataMonitoringResources,
  ODataResourceType,
} from "pages/monitoring/types/odataResponse";
import { monitoringAPI } from "pages/monitoring/api/core";
import { createODataGetter } from "../oDataGetter";

export function getResourcesType() {
  const res = monitoringAPI<ODataResourceType>({
    type: "get",
    endpoint: "ResourceType",
  });

  return res;
}

export const getEditableResourcesByUser =
  createODataGetter<ODataMonitoringResources>("Resource");

export async function deleteResource(resourceId: number) {
  const res = await monitoringAPI({
    type: "delete",
    endpoint: `Resource/${resourceId}`,
  });

  return res;
}
