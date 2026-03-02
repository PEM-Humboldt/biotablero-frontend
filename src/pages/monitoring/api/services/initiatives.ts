import { type ODataParams } from "@appTypes/odata";
import type {
  ODataInitiative,
  ODataUserRequest,
  UserInitiatives,
} from "pages/monitoring/types/requestParams";
import type { InitiativeFullInfo } from "pages/monitoring/outlets/initiativesAdmin/types/initiativeData";
import { commonErrorMessage } from "@utils/ui";

import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";

/**
 * Retrieves all the info about the initiative that has the specified id.
 *
 * @param id - The number of the initiative in DB
 * @returns A Promise that resolves in a detailed object with all the initiative info
 */
export async function getInitiative(id: number) {
  try {
    const res = await monitoringAPI<InitiativeFullInfo>({
      type: "get",
      endpoint: `Initiative/${id}`,
    });
    if (isMonitoringAPIError(res)) {
      throw new Error(res.message);
    }
    return res;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Fetches initiative data from the "Initiative" endpoint of the Monitoring API.
 *
 * @param odataParams Optional OData query parameters (filtering, pagination, etc.).
 * @returns A `Promise` that resolves to an `ODataInitiatives` object.
 */
export const getInitiatives = createODataGetter<ODataInitiative>("Initiative");

/**
 * Fetches the basic information of initiatives associated with the current user.
 *
 * @returns a `Promise<UserInitiatives[]>`. An array of {@link UserInitiatives}; returns an empty array if the request fails or no initiatives are found.
 *
 * @remarks
 * - This function handles API errors internally by logging them to the console and returning an empty collection.
 * - It specifically catches both structured API errors (via `isMonitoringAPIError`) and unexpected runtime exceptions.
 */
export async function getUserInitiativesInfo() {
  try {
    const res = await monitoringAPI<UserInitiatives[]>({
      type: "get",
      endpoint: "Auth/InitiativesData",
    });

    if (isMonitoringAPIError(res)) {
      const { status, message, data } = res;
      console.error(
        commonErrorMessage[status] ?? message,
        data ? `: ${data}` : ".",
      );
      return [];
    }

    return res;
  } catch (err) {
    console.error(err);
    return [];
  }
}

/**
 * Retrieves a paginated and filtered list of join requests for a specific initiative using OData parameters.
 *
 * @param initiativeId The unique identifier of the initiative.
 * @param oData An object of type {@link ODataParams} containing query transformations.
 * @returns a `Promise<ODataUserRequest | null>`.
 *
 * @remarks
 * - Failed requests are logged to the console and return `null` to be handled by the caller's state management.
 * - A `try/catch` block is included to prevent network-level exceptions from bubbling up unhandled.
 */
export async function getInitiativeRequests(
  initiativeId: number,
  oData: ODataParams,
) {
  try {
    const res = await monitoringAPI<ODataUserRequest>({
      type: "get",
      endpoint: "JoinRequest",
      options: { data: { initiativeId }, oData },
    });

    if (isMonitoringAPIError(res)) {
      console.error(res.message);
      return null;
    }

    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
}
