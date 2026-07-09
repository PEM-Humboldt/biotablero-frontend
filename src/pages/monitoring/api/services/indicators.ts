import type { ODataIndicators } from "pages/monitoring/types/odataResponse";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";
import { monitoringAPI } from "pages/monitoring/api/core";
import type {
  IndicatorData,
  IndicatorMetadata,
} from "pages/monitoring/types/indicators";

/**
 * Fetches indicators metadata from the "Indicator" endpoint of the Monitoring API using odataParams.
 *
 * @param odataParams Optional OData query parameters
 *
 * @returns A `Promise` resolving to:
 * - On success: An `ODataIndicators` object.
 * - On failure: A `ApiRequestError` object.
 */
export const getIndicators = createODataGetter<ODataIndicators>("Indicator");

/**
 * Retrieves all the indicators metadata associated with a specific initiative.
 *
 * @param initiativeId - The initiative identifier in db
 *
 * @returns A `Promise` resolving to:
 * - On success: An array of `IndicatorMetadata` objects
 * - On failure: A `ApiRequestError` object.
 */
export async function getIndicatorsByInitiative(initiativeId: number) {
  const res = await monitoringAPI<IndicatorMetadata[]>({
    type: "get",
    endpoint: `Indicator/GetByInitiative/${initiativeId}`,
  });

  return res;
}

/**
 * Retrieves the data values of the specified indicator needed for rendering.
 *
 * @param indicatorId - The number of the indicator in DB
 *
 * @returns A `Promise` resolving to:
 * - On success: An `IndicatorData` object
 * - On failure: A `ApiRequestError` object.
 */
export async function getIndicatorData(indicatorId: number) {
  const res = await monitoringAPI<IndicatorData>({
    type: "get",
    endpoint: `IndicatorVersion/${indicatorId}`,
  });

  return res;
}

/**
 * Retrieves all the metadata from the specified indicator.
 *
 * @param indicatorId - The number of the indicator in DB
 *
 * @returns A `Promise` resolving to:
 * - On success: An `IndicatorData` object
 * - On failure: A `ApiRequestError` object.
 */
export async function getIndicatorMetadata(indicatorId: number) {
  const res = await monitoringAPI<IndicatorMetadata>({
    type: "get",
    endpoint: `Indicator/${indicatorId}`,
  });

  return res;
}
