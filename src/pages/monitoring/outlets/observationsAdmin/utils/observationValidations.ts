import { getTopics } from "pages/monitoring/api/services/topics";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

/**
 * Creates a validation function to check if an topic with the same name already exists for a given initiative.
 *
 * @param initiativeId - The ID of the initiative to check against.
 * @returns An async function that takes a `topicName` and returns `true` if the observation name does not exist; otherwise, `false`.
 */
export function observationNameNotExist(initiativeId: number) {
  return async (topicName: string) => {
    const existingInitiative = await getTopics({
      filter: `initiativeId eq ${initiativeId} and name eq '${topicName}'`,
    });

    if (isMonitoringAPIError(existingInitiative)) {
      return false;
    }

    return existingInitiative["@odata.count"] === 0;
  };
}
