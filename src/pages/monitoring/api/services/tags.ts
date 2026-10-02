import type {
  ODataTagInfo,
  TagInInitiative,
} from "pages/monitoring/types/odataResponse";
import { monitoringAPI } from "pages/monitoring/api/core";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";
import type { TagCategory, TagDataForm } from "pages/monitoring/types/tagData";

/**
 * Fetches tags from the "Tags" endpoint of the Monitoring API.
 *
 * @param odataParams Optional OData query parameters (filtering, pagination, etc.).
 * @returns A `Promise` that resolves to an `ODataLog` object.
 */
export const getTags = createODataGetter<ODataTagInfo>("Tag");

/**
 * Retrieves a list of available tag categories.
 *
 * @returns A Promise that resolves to:
 * - On success: a list with the TagCategoryValues.
 * - On failure: A `ApiRequestError` object.
 */
export async function getTagCategories() {
  const res = await monitoringAPI<TagCategory[]>({
    type: "get",
    endpoint: "TagCategory",
  });

  return res;
}

/**
 * Get data of a specific entity by its identifier.
 *
 * @param id - Entity identifier.
 *
 * @returns A Promise that resolves to:
 * - On success: the entire tag object.
 * - On failure: A `ApiRequestError` object.
 */
export async function getTagById(id: number) {
  const res = await monitoringAPI<TagDataForm>({
    type: "get",
    endpoint: `Tag/${id}`,
  });

  return res;
}

/**
 * Add entity.
 * @param data Entity data.
 * @returns A Promise that resolves to:
 * - On success: the entire tag object.
 * - On failure: A `ApiRequestError` object.
 */
export async function addTag(data: TagDataForm) {
  const res = await monitoringAPI<TagDataForm>({
    type: "post",
    endpoint: "Tag",
    options: {
      data: data,
    },
  });

  return res;
}

/**
 * Update entity.
 * @param data Entity data.
 * @returns A Promise that resolves to:
 * - On success: the entire tag object.
 * - On failure: A `ApiRequestError` object.
 */
export async function updateTag(id: number, data: TagDataForm) {
  const res = await monitoringAPI<TagDataForm>({
    type: "put",
    endpoint: `Tag/${id}`,
    options: {
      data: data,
    },
  });

  return res;
}

/**
 * Delete entity.
 * @param data Entity data.
 * @returns A Promise that resolves to:
 * - On success: the entire tag object.
 * - On failure: A `ApiRequestError` object.
 */
export async function deleteTag(id: number) {
  const res = await monitoringAPI<TagDataForm>({
    type: "delete",
    endpoint: `Tag/${id}`,
  });

  return res;
}

export async function addTagToInitiative(initiativeId: number, tagId: number) {
  const res = await monitoringAPI<TagInInitiative>({
    type: "post",
    endpoint: `InitiativeTag?initiativeId=${initiativeId}&tagId=${tagId}`,
  });

  return res;
}

export async function removeTagFromInitiative(tagInInitiativeId: number) {
  const res = await monitoringAPI<undefined>({
    type: "delete",
    endpoint: `InitiativeTag/${tagInInitiativeId}`,
  });

  return res;
}
