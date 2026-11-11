import {
  MONITORING_EVENTS_MAX_PER_MONTH,
  MONITORING_EVENTS_MIN_PER_MONTH,
} from "@config/monitoring";
import { getMonitoringEventsByInitiative } from "pages/monitoring/api/services/monitoringEvents";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { uiText } from "pages/monitoring/outlets/initiativesAdmin/initiativeCard/monitoringEventsEditor/layout/uiText";

/**
 * Checks if given amount of monitoring events is within a valid range
 *
 * @param amount - The monitoring events made in the month
 *
 * @returns null if it is within range, an array with the errors othewise
 */
export function isAmountValid(amount: number): string[] | null {
  return amount <= MONITORING_EVENTS_MIN_PER_MONTH ||
    amount >= MONITORING_EVENTS_MAX_PER_MONTH
    ? [uiText.validationErrors.invalidAmount]
    : null;
}

/**
 * Checks if a monitoring event already exists for a given
 *
 * @param initiativeId - The ID of the initiative to check.
 * @param date - The date containing the target month and year.
 *
 * @returns A `Promise` resolving to:
 * - On success: null
 * - On failure: an array with the errors
 */
export async function isNewEvent(
  initiativeId: number,
  date: Date,
): Promise<string[] | null> {
  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth() + 1; // el offset de mes en JS;

  const res = await getMonitoringEventsByInitiative(initiativeId)({
    filter: `year(Date) eq ${utcYear} and month(Date) eq ${utcMonth}`,
  });

  if (isMonitoringAPIError(res)) {
    return res.data.map((err) => err.msg);
  }

  if (res["@odata.count"] !== 0) {
    return [uiText.validationErrors.alreadyExist];
  }

  return null;
}
