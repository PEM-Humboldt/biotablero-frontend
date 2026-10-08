import type {
  ODataObservations,
  TagInIndicator,
} from "pages/monitoring/types/odataResponse";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";
import { monitoringAPI } from "pages/monitoring/api/core";
import type {
  ObservationData,
  ObservationMetadata,
} from "pages/monitoring/types/observations";
import { serializeQueryParams } from "@utils/htmlRequest";

/**
 * Fetches the observatios metadata from the "Observation" endpoint using odataParams.
 *
 * @param odataParams Optional OData query parameters
 *
 * @returns A `Promise` resolving to:
 * - On success: An `ODataObservations` object.
 * - On failure: A `ApiRequestError` object.
 */
export const getObservations =
  createODataGetter<ODataObservations>("Observation");

/**
 * Retrieves all the observations metadata associated with a specific initiative.
 *
 * @param initiativeId - The initiative identifier in db
 *
 * @returns A `Promise` resolving to:
 * - On success: An array of `ObservationMetadata` objects
 * - On failure: A `ApiRequestError` object.
 */
export async function getObservationsByInitiative(initiativeId: number) {
  const res = await monitoringAPI<ObservationMetadata[]>({
    type: "get",
    endpoint: `Observation/GetByInitiative/${initiativeId}`,
  });

  return res;
}

/**
 * Retrieves the data values of the specified observation needed for rendering.
 *
 * @param observationId - The number of the indicator in DB
 *
 * @returns A `Promise` resolving to:
 * - On success: An `ObservationData` object
 * - On failure: A `ApiRequestError` object.
 */
export async function getObservationData(observationId: number) {
  const res = await monitoringAPI<ObservationData>({
    type: "get",
    endpoint: `ObservationVersion/${observationId}`,
  });

  return res;
}

export async function updateObservationData(
  observationId: number,
  payload: Record<
    | "description"
    | "methodology"
    | "interpretation"
    | "considerations"
    | "authorship",
    string
  >,
) {
  const res = await monitoringAPI<ObservationData>({
    type: "put",
    endpoint: `ObservationVersion/${observationId}`,
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
 * Retrieves all the metadata from the specified observation.
 *
 * @param observationId - The number of the indicator in DB
 *
 * @returns A `Promise` resolving to:
 * - On success: An `ObservationMetadata` object
 * - On failure: A `ApiRequestError` object.
 */
export async function getObservationMetadata(observationId: number) {
  const res = await monitoringAPI<ObservationMetadata>({
    type: "get",
    endpoint: `Observation/${observationId}`,
  });

  return res;
}

export async function updateObservationName(
  observationId: number,
  name: string,
) {
  const res = await monitoringAPI<ObservationMetadata>({
    type: "put",
    endpoint: `Observation/${observationId}`,
    options: {
      data: { Name: name },
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  });

  return res;
}
