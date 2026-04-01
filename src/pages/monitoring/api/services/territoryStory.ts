import type { ODataTerritoryStory } from "pages/monitoring/types/odataResponse";

import { monitoringAPI } from "pages/monitoring/api/core";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";
import type { TerritoryStoryFull } from "pages/monitoring/types/territoryStory";
import type { RequestData } from "pages/monitoring/api/types/definitions";

export function getTerritoryStoriesFromInitiative(initiativeId: number) {
  return createODataGetter<ODataTerritoryStory>(
    `TerritoryStory/GetByInitiative/${initiativeId}`,
  );
}

export async function getTerritoryStory(territoryStoryId: number) {
  const res = monitoringAPI<TerritoryStoryFull>({
    type: "get",
    endpoint: `TerritoryStory/${territoryStoryId}`,
  });

  return res;
}

export async function createTerritoryStory(data: RequestData) {
  const res = monitoringAPI<TerritoryStoryFull>({
    type: "post",
    endpoint: "TerritoryStory",
    options: { data },
  });

  return res;
}

export async function editTerritoryStoryGeneralInfo(
  territoryStoryId: number,
  data: { [K in "title" | "text" | "keywords" | "restricted"]?: string },
) {
  const res = monitoringAPI<TerritoryStoryFull>({
    type: "put",
    endpoint: `TerritoryStory/${territoryStoryId}`,
    options: { data },
  });

  return res;
}

export async function enableTerritoryStory(territoryStoryId: number) {
  const res = monitoringAPI<null>({
    type: "post",
    endpoint: `TerritoryStory/Enable/${territoryStoryId}`,
  });

  return res;
}

export async function disableTerritoryStory(territoryStoryId: number) {
  const res = monitoringAPI<null>({
    type: "delete",
    endpoint: `TerritoryStory/Disable/${territoryStoryId}`,
  });

  return res;
}

export async function setFeaturedStory(territoryStoryId: number) {
  const res = monitoringAPI<TerritoryStoryFull>({
    type: "post",
    endpoint: `TerritoryStory/FeaturedContent/${territoryStoryId}`,
  });

  return res;
}
