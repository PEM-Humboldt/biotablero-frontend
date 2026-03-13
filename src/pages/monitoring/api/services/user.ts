import { isODataParams, type ODataParams } from "@appTypes/odata";
import type {
  InitiativeUser,
  ODataUserInfo,
} from "pages/monitoring/types/odataResponse";
import type {
  RoleInInitiative,
  UserLevel,
} from "pages/monitoring/types/catalog";
import { monitoringAPI } from "pages/monitoring/api/core";
import type { ApiRequestError } from "@appTypes/api";

/**
 * Retrieves users from the Monitoring API.
 *
 * @param idOrOdata - OPTIONAL. Can be an Initiative ID (number/string) to get associated users, or an ODataParams object to filter the general user list. If no param is passed, it will return all the users
 *
 * @returns A `Promise` resolving to:
 * - On success:
 *   - `InitiativeUser[]` if an Initiative ID is provided.
 *   - `ODataUserInfo[]` if an OData object is provided or if called without arguments.
 * - On failure: A `ApiRequestError` object.
 */
export async function getUsers(
  oDataParams?: ODataParams,
): Promise<ODataUserInfo | ApiRequestError>;
export async function getUsers(
  byInitiativeId: number | string,
): Promise<InitiativeUser[] | ApiRequestError>;
export async function getUsers(
  idOrOdata?: ODataParams | number | string,
): Promise<InitiativeUser[] | ODataUserInfo | ApiRequestError> {
  const isId = typeof idOrOdata === "string" || typeof idOrOdata === "number";
  const endpoint = isId
    ? `InitiativeUser/GetByInitiative/${idOrOdata}`
    : "User";
  const oDataParams =
    idOrOdata !== undefined && !isId && isODataParams(idOrOdata)
      ? idOrOdata
      : undefined;

  const res = await monitoringAPI<InitiativeUser[] | ODataUserInfo>({
    type: "get",
    endpoint,
    options: { oData: oDataParams },
  });

  return res;
}

/**
 * Fetches the available security or access levels for initiative users.
 *
 * @returns A `Promise` resolving to:
 * - On success: an array of UserLevel[] -> { id: RoleInInitiative, name: string }[]
 * - On failure: A `ApiRequestError` object.
 */
export async function getUserLevels() {
  const res = await monitoringAPI<UserLevel[]>({
    type: "get",
    endpoint: "InitiativeUserLevel",
  });

  return res;
}

/**
 * Updates the role and optionally the focus area of a specific user within an initiative.
 *
 * it catches internal errors and returns them as a string instead of throwing,
 * or `null` if the operation is successful.
 *
 * @param userIdInInitiative - The unique identifier of the user-initiative relationship.
 * @param newRole - The new role level to assign to the user.
 * @param focusArea - Optional string to define or update the user's area of focus.
 * @returns A `Promise` resolving to:
 * - On success: void
 * - On failure: A `ApiRequestError` object.
 */
export async function changeUserRoleInInitiative(
  userIdInInitiative: number,
  newRole: RoleInInitiative,
  focusArea?: string,
) {
  const res = await monitoringAPI({
    type: "put",
    endpoint: `InitiativeUser/${userIdInInitiative}`,
    options: {
      data: {
        level: { id: newRole },
        ...(focusArea ? { focusArea } : {}),
      },
    },
  });

  return res;
}

/**
 * Removes a user from an initiative by deleting their user-initiative record.
 *
 * It returns an error message if the API returns a `RequestError`
 * or if an exception occurs during execution.
 *
 * @param userIdInInitiative - The unique identifier of the user-initiative relationship to be deleted.
 *
 * @returns A `Promise` resolving to:
 * - On success: void.
 * - On failure: A `ApiRequestError` object.
 */
export async function removeUserFromInitiative(userIdInInitiative: number) {
  const res = await monitoringAPI({
    type: "delete",
    endpoint: `InitiativeUser/${userIdInInitiative}`,
  });

  return res;
}
