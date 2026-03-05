import { type ODataParams } from "@appTypes/odata";
import type {
  ODataInitiative,
  ODataUserRequest,
  UserInInitiative,
} from "pages/monitoring/types/odataResponse";
import type {
  InitiativeContact,
  InitiativeFullInfo,
  LocationDataBasic,
  UserData,
} from "pages/monitoring/types/initiative";

import { monitoringAPI } from "pages/monitoring/api/core";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";
import type { UserJoinRequestData } from "pages/monitoring/types/userJoinRequest";
import type { JoinInitiativeDataForm } from "pages/monitoring/outlets/initiativeJoinInvitation/types/initiativeInvitationData";
import type { RoleInInitiative } from "pages/monitoring/types/catalog";

/**
 * Retrieves all the info about the initiative that has the specified id.
 *
 * @param id - The number of the initiative in DB
 * @returns A Promise that resolves in a detailed object with all the initiative info
 */
export async function getInitiative(id: number) {
  const res = await monitoringAPI<InitiativeFullInfo>({
    type: "get",
    endpoint: `Initiative/${id}`,
  });

  return res;
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
 * @returns a `Promise<UserInitiatives[]>`. An array of {@link UserInInitiative}; returns an empty array if the request fails or no initiatives are found.
 *
 * @remarks
 * - This function handles API errors internally by logging them to the console and returning an empty collection.
 * - It specifically catches both structured API errors (via `isMonitoringAPIError`) and unexpected runtime exceptions.
 */
export async function getUserInitiativesInfo() {
  const res = await monitoringAPI<UserInInitiative[]>({
    type: "get",
    endpoint: "Auth/InitiativesData",
  });

  return res;
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
  const res = await monitoringAPI<ODataUserRequest>({
    type: "get",
    endpoint: "JoinRequest",
    options: { data: { initiativeId }, oData },
  });

  return res;
}

/**
 * Creates a new initiative with its associated locations, contacts, and users.
 *
 * @param payload - An object containing arrays of LocationDataBasic, InitiativeContact and UserData, and the general info (key-value pair of strings).
 * @returns A `Promise` resolving to the {@link InitiativeFullInfo} of the created initiative.
 */
export async function createInitiative(payload: {
  locations: LocationDataBasic[];
  contacts: InitiativeContact[];
  users: UserData[];
}) {
  const res = await monitoringAPI<InitiativeFullInfo>({
    type: "post",
    endpoint: "Initiative",
    options: {
      data: payload,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  });

  return res;
}

/**
 * Toggles the enabled/disabled status of an initiative.
 *
 * @param isEnabled - Current status; if true, the initiative will be disabled. If false, it will be enabled.
 * @param initiativeId - The unique identifier of the initiative.
 * @returns A `Promise` resolving to the updated InitiativeFullInfo.
 */
export async function changeInitiativeStatus(
  isEnabled: boolean,
  initiativeId: number,
) {
  const endpoint = isEnabled ? "Disable" : "Enable";
  const method = isEnabled ? "delete" : "post";

  const res = await monitoringAPI<InitiativeFullInfo>({
    type: method,
    endpoint: `Initiative/${endpoint}/${initiativeId}`,
  });

  return res;
}

/**
 * Updates the general info of a specific initiative.
 *
 * @param initiativeId - The unique identifier of the initiative to update.
 * @param payload - A record of strings containing the updated fields.
 * @returns A `Promise` from the `monitoringAPI` call.
 */
export async function updateInitiativeGeneralInfo(
  initiativeId: number,
  payload: Record<string, string>,
) {
  const res = await monitoringAPI({
    type: "put",
    endpoint: `Initiative/${initiativeId}`,
    options: {
      data: payload,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  });

  return res;
}

/**
 * Generic function to create or update an item (Contact info, location and leaders) within an initiative.
 *
 * @param initiativeId - The parent initiative ID (null if not applicable).
 * @param endpoint - The API endpoint string.
 * @param itemInfo - The generic data object of type T to be sent.
 * @param itemId - The ID of the item; if provided, triggers a PUT request, otherwise a POST request.
 * @returns A `Promise` resolving to the created or updated item of type T.
 */
export async function updateInitiativeItem<T>(
  initiativeId: number | null,
  endpoint: string,
  itemInfo: T,
  itemId: number | null,
) {
  const res = await monitoringAPI<T>({
    type: itemId ? "put" : "post",
    endpoint: itemId ? `${endpoint}/${itemId}` : endpoint,
    options: {
      data: { ...itemInfo, initiativeId: initiativeId ?? "" },
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  });

  return res;
}

/**
 * Deletes a specific item from a initiative list (Contact info, location and leaders) a given endpoint.
 *
 * @param endpoint - The API endpoint string.
 * @param itemId - The unique identifier of the item to remove.
 * @returns A `Promise` resolving to the API response status.
 */
export async function removeInitiativeItem(endpoint: string, itemId: number) {
  const res = await monitoringAPI({
    type: "delete",
    endpoint: `${endpoint}/${itemId}`,
    getStatus: true,
  });

  return res;
}

/**
 * Resolves a join request by approving or rejecting it.
 *
 * @param requestId - The unique identifier of the join request.
 * @param resolvedInto - The resolution status: "Approved" or "Rejected".
 * @returns A `Promise` from the `monitoringAPI` call.
 */
export async function updateJoinRequest(
  requestId: number,
  resolvedInto: "Approved" | "Rejected",
) {
  const res = await monitoringAPI({
    type: "put",
    endpoint: `JoinRequest/${requestId}?requestStatus=${resolvedInto}`,
  });

  return res;
}

/**
 * Retrieves the list of join requests submitted by the current authenticated user.
 *
 * @returns a `Promise<UserJoinRequestData[]>`.
 */
export async function getUserJoinRequests() {
  const res = await monitoringAPI<UserJoinRequestData[]>({
    type: "get",
    endpoint: "JoinRequest/MyRequests",
  });

  return res;
}

export async function sendJoinInitiativeInvitation(
  payload: JoinInitiativeDataForm,
) {
  const res = await monitoringAPI<JoinInitiativeDataForm>({
    type: "post",
    endpoint: "JoinInvitation",
    options: {
      data: payload,
    },
  });

  return res;
}

/**
 * Removes the current user from an initiative they are already a member of.
 *
 * @param userIdInInitiative - The unique identifier of the membership record.
 * @returns a `Promise<string | null>` containing a formatted error message if the operation fails, or `null` on success.
 */
export async function leaveInitiative(userIdInInitiative: number) {
  // NOTE: Actualizar el endpoint cuando esté listo
  const res = await monitoringAPI({
    type: "delete",
    endpoint: `InitiativeUser/${userIdInInitiative}`,
  });

  return res;
}

/**
 * Cancels a pending join request.
 *
 * @param requestId - The id of the user's relation with the request.
 * @returns a `Promise<string | null>` containing a formatted error message if the deletion fails, or `null` on success.
 */
export async function cancelJoinRequestToInitiative(requestId: number) {
  const res = await monitoringAPI({
    type: "delete",
    endpoint: `JoinRequest/Cancel/${requestId}`,
  });

  return res;
}

/**
 * Submits a new request for the current authenticated user to join a specific initiative with a designated role.
 *
 * @param initiativeId - The unique identifier of the initiative.
 * @param asRole - The role defined by {@link RoleInInitiative} the user is requesting.
 * @returns a `Promise<string | null>` containing a formatted error message if the request fails, or `null` on success.
 */
export async function makeJoinRequestToInitiative(
  initiativeId: number,
  asRole: RoleInInitiative,
) {
  const res = await monitoringAPI({
    type: "post",
    endpoint: "JoinRequest",
    options: { data: { initiativeId, level: { id: asRole } } },
  });

  return res;
}
