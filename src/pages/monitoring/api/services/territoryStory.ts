import type { ODataTerritoryStory } from "pages/monitoring/types/odataResponse";

import { monitoringAPI } from "pages/monitoring/api/core";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";
import type { TerritoryStoryFull } from "pages/monitoring/types/territoryStory";

export function getTerritoryStoriesFromInitiative(initiativeId: number) {
  return createODataGetter<ODataTerritoryStory>(
    `TerritoryStory/GetByInitiative/${initiativeId}`,
  );
}

export function getTerritoryStory(territoryStoryId: number) {
  const res = monitoringAPI<TerritoryStoryFull>({
    type: "get",
    endpoint: `TerritoryStory/${territoryStoryId}`,
  });

  return res;
}

export function createTerritoryStory(data: {
  [K in keyof TerritoryStoryFull]: string | Record<string, string[]>;
}) {
  const res = monitoringAPI<TerritoryStoryFull>({
    type: "post",
    endpoint: "TerritoryStory",
    options: { data },
  });

  return res;
}

export function editTerritoryStoryGeneralInfo(
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
