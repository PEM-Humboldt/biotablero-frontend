import type {
  ODataTagInfo,
} from "pages/monitoring/types/odataResponse";
import { monitoringAPI } from "pages/monitoring/api/core";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";

/**
 * Fetches tags from the "Tags" endpoint of the Monitoring API.
 *
 * @param odataParams Optional OData query parameters (filtering, pagination, etc.).
 * @returns A `Promise` that resolves to an `ODataLog` object.
 */
export const getTags = createODataGetter<ODataTagInfo>("Tag");