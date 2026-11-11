import { InitiativeMonitoringEvent } from "pages/monitoring/types/stats";
import { monitoringAPI } from "pages/monitoring/api/core";
import { ODataMonitoringEvents } from "pages/monitoring/types/odataResponse";
import { ODataParams } from "@appTypes/odata";
import { MonitoringEvent } from "pages/monitoring/types/monitoringEvents";

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
 * Fetches all Monitoring Events from the "InitiativeId"
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

/**
 * Create a Monitoring Evente for a specific initiative
 *
 * @param initiativeId - the initiative id to attach the event
 * @param date - the date of the monitoring events
 * @param amount - how many monitoring events happened in that date
 *
 * @returns A `Promise` resolving to:
 * - On success: an `MonitoringEvent` object.
 * - On failure: A `ApiRequestError` object.
 */
export async function createMonitoringEvent(
  initiativeId: number,
  date: Date,
  amount: number,
) {
  const res = await monitoringAPI<MonitoringEvent>({
    type: "post",
    endpoint: "MonitoringEvents",
    options: {
      data: {
        InitiativeId: initiativeId,
        Value: amount,
        Date: new Date(Date.UTC(date)).toISOString(),
      },
    },
  });

  return res;
}

/**
 * Updates the amount of events in a specific Monitoring Event
 *
 * @param eventId - the monitoring event id
 * @param amount - the new value of monitoring events
 *
 * @returns A `Promise` resolving to:
 * - On success: an `MonitoringEvent` object.
 * - On failure: A `ApiRequestError` object.
 */
export async function updateMonitoringEvent(
  eventId: number,
  amount: number,
  date: Date,
) {
  const res = await monitoringAPI<MonitoringEvent>({
    type: "put",
    endpoint: `MonitoringEvents/${eventId}`,
    options: { data: { Value: amount, Date: date.toISOString() } },
  });

  return res;
}

/**
 * Deletes a specific Monitoring Event
 *
 * @param eventId - the monitoring event id to delete
 *
 * @returns A `Promise` resolving to:
 * - On success: undefined
 * - On failure: A `ApiRequestError` object.
 */
export async function deleteMonitoringEvent(eventId: number) {
  const res = await monitoringAPI<undefined>({
    type: "delete",
    endpoint: `MonitoringEvents/${eventId}`,
  });

  return res;
}
