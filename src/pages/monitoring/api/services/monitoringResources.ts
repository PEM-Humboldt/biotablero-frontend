import type {
  MonitoringResource,
  ODataMonitoringResources,
  ODataResourceType,
} from "pages/monitoring/types/odataResponse";
import { monitoringAPI } from "pages/monitoring/api/core";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";

export async function getResourcesType() {
  const res = monitoringAPI<ODataResourceType>({
    type: "get",
    endpoint: "ResourceType",
  });

  return res;
}

export async function getResource(resourceId: number) {
  const res = await monitoringAPI<MonitoringResource>({
    type: "get",
    endpoint: `Resource/${resourceId}`,
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
