import type { ODataResourceType } from "pages/monitoring/types/odataResponse";
import { monitoringAPI } from "pages/monitoring/api/core";

export function getResourcesType() {
  const res = monitoringAPI<ODataResourceType>({
    type: "get",
    endpoint: "ResourceType",
  });

  return res;
}
