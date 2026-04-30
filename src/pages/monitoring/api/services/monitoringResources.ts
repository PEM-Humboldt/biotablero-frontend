import type {
  MonitoringResource,
  ODataMonitoringResources,
  ODataResourceType,
  ResourceTag,
} from "pages/monitoring/types/odataResponse";
import { monitoringAPI } from "pages/monitoring/api/core";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";
import type { RequestData } from "pages/monitoring/api/types/definitions";

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

export const getResources =
  createODataGetter<ODataMonitoringResources>("Resource");

export async function createResource(resource: RequestData) {
  const res = await monitoringAPI<MonitoringResource>({
    type: "post",
    endpoint: "Resource",
    options: { data: resource },
  });

  return res;
}

export async function updateResource(
  resourceId: number,
  resource: RequestData,
) {
  const res = await monitoringAPI<MonitoringResource>({
    type: "put",
    endpoint: `Resource/${resourceId}`,
    options: { data: resource },
  });

  return res;
}

export async function removeResource(resourceId: number) {
  const res = await monitoringAPI({
    type: "delete",
    endpoint: `Resource/${resourceId}`,
  });

  return res;
}

export async function AddResourceTag(resourceId: number, tagId: number) {
  const res = await monitoringAPI<ResourceTag>({
    type: "post",
    endpoint: `Resource?resourceId=${resourceId}&tagId=${tagId}`,
  });

  return res;
}

export async function removeResourceTag(tagInResourceId: number) {
  const res = await monitoringAPI<ResourceTag>({
    type: "delete",
    endpoint: `Resource/${tagInResourceId}`,
  });

  return res;
}

export async function addResourceLink(resourceLinkInfo: RequestData) {
  const res = await monitoringAPI<MonitoringResource>({
    type: "post",
    endpoint: `ResourceLink`,
    options: { data: resourceLinkInfo },
  });

  return res;
}

export async function editResourceLink(
  linkInresourceId: number,
  resourceLinkInfo: RequestData,
) {
  const res = await monitoringAPI<MonitoringResource>({
    type: "put",
    endpoint: `ResourceLink/${linkInresourceId}`,
    options: { data: resourceLinkInfo },
  });

  return res;
}

export async function removeResourceLink(linkInresourceId: number) {
  const res = await monitoringAPI<MonitoringResource>({
    type: "delete",
    endpoint: `ResourceLink/${linkInresourceId}`,
  });

  return res;
}

export async function addResourceFile(
  resourceId: number,
  description: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("ResourceId", String(resourceId));
  formData.append("Name", description);
  formData.append("File", file);

  const res = await monitoringAPI<MonitoringResource>({
    type: "post",
    endpoint: "ResourceFile",
    options: { data: formData },
  });

  return res;
}

export async function editResourceFile(
  fileInResourceId: number,
  description: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("Name", description);
  formData.append("File", file);

  const res = await monitoringAPI<MonitoringResource>({
    type: "put",
    endpoint: `ResourceFile/${fileInResourceId}`,
    options: { data: formData },
  });

  return res;
}

export async function removeResourceFile(fileInresourceId: number) {
  const res = await monitoringAPI<MonitoringResource>({
    type: "delete",
    endpoint: `ResourceFile/${fileInresourceId}`,
  });

  return res;
}
