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
 *
 * @returns A `Promise` resolving to:
 * - On success: Empta detailed object with all the initiative info
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A `Promise` resolving to:
 * - On success: an `ODataInitiatives` object.
 * - On failure: A `ApiRequestError` object.
 */
export const getInitiatives = createODataGetter<ODataInitiative>("Initiative");

/**
 * Fetches the basic information of initiatives associated with the current user.
 *
 * @returns A `Promise` resolving to:
 * - On success: an n array of UserInInitiative objects.
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A `Promise` resolving to:
 * - On success: an ODataUserRequest object.
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A `Promise` resolving to:
 * - On success: an InitiativeFullInfo of the created initiative.
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A `Promise` resolving to:
 * - On success: An updated InitiativeFullInfo.
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A `Promise` resolving to:
 * - On success: An object with the general items of the initiative updated.
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A `Promise` resolving to:
 * - On success: An object of the created or updated item of type T.
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A `Promise` resolving to:
 * - On success: void
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A `Promise` resolving to:
 * - On success: a JoinRequest object
 * - On failure: A `ApiRequestError` object.
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
 * @returns A `Promise` resolving to:
 * - On success: UserJoinRequestData[]
 * - On failure: A `ApiRequestError` object.
 */
export async function getUserJoinRequests() {
  const res = await monitoringAPI<UserJoinRequestData[]>({
    type: "get",
    endpoint: "JoinRequest/MyRequests",
  });

  return res;
}

/**
 * Sends an email to the emails in the payload inviting them to the initiative
 *
 * @returns A `Promise` resolving to:
 * - On success: JoinInitiativeDataForm
 * - On failure: A `ApiRequestError` object.
 */
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
 *
 * @returns A `Promise` resolving to:
 * - On success: void
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A `Promise` resolving to:
 * - On success: void
 * - On failure: A `ApiRequestError` object.
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
 *
 * @returns A `Promise` resolving to:
 * - On success: void
 * - On failure: A `ApiRequestError` object.
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
