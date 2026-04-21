import type {
  ODataMonitoringResources,
  ODataResourceType,
} from "pages/monitoring/types/odataResponse";
import { monitoringAPI } from "pages/monitoring/api/core";

export function getResourcesType() {
  const res = monitoringAPI<ODataResourceType>({
    type: "get",
    endpoint: "ResourceType",
  });

  return res;
}

export function getEditableResourcesByUser(
  username?: string,
  initiativesAsLeader?: number[],
) {
  const filters: string[] = [];

  if (username) {
    filters.push(`authorUserName eq '${username}'`);
  }

  if (initiativesAsLeader && initiativesAsLeader.length > 0) {
    filters.push(`initiativeId in (${initiativesAsLeader.join(",")})`);
  }

  const res = monitoringAPI<ODataMonitoringResources>({
    type: "get",
    endpoint: "Resource",
    options: {
      oData: { filter: filters.join(" or ") },
    },
  });

  return res;
}
