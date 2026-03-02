import { isODataParams, type ODataParams } from "@appTypes/odata";
import type {
  InitiativeUser,
  ODataUserInfo,
} from "pages/monitoring/types/requestParams";
import type { UserLevel } from "pages/monitoring/types/monitoring";
import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

/**
 * Retrieves users from the Monitoring API.
 *
 * @param idOrOdata - OPTIONAL. Can be an Initiative ID (number/string) to get associated users, or an ODataParams object to filter the general user list. If no param is passed, it will return all the users
 * @returns A `Promise` resolving to:
 * - `InitiativeUser[]` if an Initiative ID is provided.
 * - `ODataUserInfo[]` if an OData object is provided or if called without arguments.
 */
export async function getUsers(
  oDataParams?: ODataParams,
): Promise<ODataUserInfo>;
export async function getUsers(
  byInitiativeId: number | string,
): Promise<InitiativeUser[]>;
export async function getUsers(
  idOrOdata?: ODataParams | number | string,
): Promise<InitiativeUser[] | ODataUserInfo> {
  const isId = typeof idOrOdata === "string" || typeof idOrOdata === "number";
  const endpoint = isId
    ? `InitiativeUser/GetByInitiative/${idOrOdata}`
    : "User";
  const oDataParams =
    idOrOdata !== undefined && !isId && isODataParams(idOrOdata)
      ? idOrOdata
      : undefined;

  try {
    const res = await monitoringAPI<InitiativeUser[] | ODataUserInfo>({
      type: "get",
      endpoint,
      options: { oData: oDataParams },
    });

    if (isMonitoringAPIError(res)) {
      throw new Error(res.message);
    }

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getUserLevels() {
  try {
    const res = await monitoringAPI<UserLevel[]>({
      type: "get",
      endpoint: "InitiativeUserLevel",
    });

    if (isMonitoringAPIError(res)) {
      throw new Error(res.message);
    }

    return res;
  } catch (err) {
    console.error(err);
    return [];
  }
}
