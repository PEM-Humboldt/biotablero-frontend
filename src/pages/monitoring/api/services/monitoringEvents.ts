import { InitiativeMonitoringEvent } from "pages/monitoring/types/stats";
import { monitoringAPI } from "pages/monitoring/api/core";
import { ODataMonitoringEvents } from "pages/monitoring/types/odataResponse";
import { ODataParams } from "@appTypes/odata";

/**
 * Retrieves the tracking events of a specific initiative, with an option to filter by year.
 *
 * @param initiativeId - The identifier of the initiative whose events are being requested.
 * @param year - Optional. The specific calendar year to filter the event history.
 *
 * @returns A `Promise` that resolves to:
 * - On success: An array of `InitiativeMonitoringEvent` objects.
 * - On failure: An `ApiRequestError` object.
 */
export async function getInitiativeMonitoringEvents(
  initiativeId: number,
  year?: number,
) {
  const fetchFromYear = year ? `?year=${year}` : "";
  const res = await monitoringAPI<InitiativeMonitoringEvent[]>({
    type: "get",
    endpoint: `InitiativeStats/GetMonitoringEvents/${initiativeId}${fetchFromYear}`,
  });

  return res;
}

/**
 * Fetches all Monitoring Evente from the "InitiativeId"
 *
 * @param odataParams Optional OData query parameters (filtering, pagination, etc.).
 *
 * @returns A `Promise` resolving to:
 * - On success: an `ODataMonitoringEvents` object.
 * - On failure: A `ApiRequestError` object.
 */
export function getMonitoringEventsByInitiative(initiativeId: number) {
  return async (odataParams: ODataParams) => {
    const result = await monitoringAPI<ODataMonitoringEvents>({
      endpoint: `MonitoringEvents`,
      type: "get",
      options: { oData: odataParams, data: { initiativeId: initiativeId } },
    });

    return result;
  };
}
