import { getTerritoryStoriesFromInitiative } from "pages/monitoring/api/services/territoryStory";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

export function storyTitleNotExist(initiativeId: number) {
  return async (storyTitle: string) => {
    const existingTitle = await getTerritoryStoriesFromInitiative(initiativeId)(
      {
        filter: `title eq '${storyTitle}'`,
      },
    );

    if (isMonitoringAPIError(existingTitle)) {
      return false;
    }

    return existingTitle["@odata.count"] === 0;
  };
}
