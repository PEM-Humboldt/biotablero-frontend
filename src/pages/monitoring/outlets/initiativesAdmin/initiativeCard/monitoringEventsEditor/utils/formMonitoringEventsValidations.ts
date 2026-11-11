import {
  MONITORING_EVENTS_MAX_PER_MONTH,
  MONITORING_EVENTS_MIN_PER_MONTH,
} from "@config/monitoring";
import { getMonitoringEventsByInitiative } from "pages/monitoring/api/services/monitoringEvents";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

/**
 * Checks if given amount of monitoring events is within a valid range
 *
 * @param amount - The monitoring events made in the month
 *
 * @returns true if it is within range, false othewise
 */
export function isAmountValid(amount: number): boolean {
  return (
    amount >= MONITORING_EVENTS_MIN_PER_MONTH &&
    amount <= MONITORING_EVENTS_MAX_PER_MONTH
  );
}

/**
 * Checks if a monitoring event already exists for a given
 *
 * @param initiativeId - The ID of the initiative to check.
 * @param date - The date containing the target month and year.
 *
 * @returns A `Promise` resolving to:
 * - On success: A `boolean`
 * - On failure: An array of error strings (`string[]`).
 */
export async function isNewEvent(
  initiativeId: number,
  date: Date,
): Promise<boolean | string[]> {
  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth() + 1; // el offset de mes en JS;

  const res = await getMonitoringEventsByInitiative(initiativeId)({
    filter: `year(Date) eq ${utcYear} and month(Date) eq ${utcMonth}`,
  });
  if (isMonitoringAPIError(res)) {
    return res.data.map((err) => err.msg);
  }
  console.log(res);

  return res["@odata.count"] === 0;
}
