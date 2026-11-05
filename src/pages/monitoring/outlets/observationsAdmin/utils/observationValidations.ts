import { getObservations } from "pages/monitoring/api/services/observations";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

/*
 * Checks if a observation with the same name already exist
 *
 * @param observationName - the name of the observation
 * @returns `true` if the observation name does not exist; otherwise, `false`.
 */
export function observationNameNotExist(initiativeId: number) {
  return async (observationName: string) => {
    const existingInitiative = await getObservations({
      filter: `initiativeId eq ${initiativeId} and name eq '${observationName}'`,
    });

    if (isMonitoringAPIError(existingInitiative)) {
      return false;
    }

    return existingInitiative["@odata.count"] === 0;
  };
}
