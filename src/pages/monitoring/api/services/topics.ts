import type { ODataTopics } from "pages/monitoring/types/odataResponse";
import { createODataGetter } from "pages/monitoring/api/oDataGetter";
import { monitoringAPI } from "pages/monitoring/api/core";
import type { TopicData, TopicMetadata } from "pages/monitoring/types/topics";

/**
 * Fetches the topics metadata from the "Topic" endpoint using odataParams.
 *
 * @param odataParams Optional OData query parameters
 *
 * @returns A `Promise` resolving to:
 * - On success: An `ODataTopics` object.
 * - On failure: A `ApiRequestError` object.
 */
export const getTopics = createODataGetter<ODataTopics>("Topic");

/**
 * Retrieves all the topics metadata associated with a specific initiative.
 *
 * @param initiativeId - The initiative identifier in db
 *
 * @returns A `Promise` resolving to:
 * - On success: An array of `TopicMetadata` objects
 * - On failure: A `ApiRequestError` object.
 */
export async function getTopicsByInitiative(initiativeId: number) {
  const res = await monitoringAPI<TopicMetadata[]>({
    type: "get",
    endpoint: `Topic/GetByInitiative/${initiativeId}`,
  });

  return res;
}

/**
 * Retrieves the data values of the specified topic needed for rendering.
 *
 * @param topicId - The number of the indicator in DB
 *
 * @returns A `Promise` resolving to:
 * - On success: An `TopicData` object
 * - On failure: A `ApiRequestError` object.
 */
export async function getTopicData(topicId: number) {
  const res = await monitoringAPI<TopicData>({
    type: "get",
    endpoint: `TopicVersion/${topicId}`,
  });

  return res;
}

export async function updateTopicData(
  topicId: number,
  payload: Record<
    | "description"
    | "methodology"
    | "interpretation"
    | "considerations"
    | "authorship",
    string
  >,
) {
  const res = await monitoringAPI<TopicData>({
    type: "put",
    endpoint: `TopicVersion/${topicId}`,
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
 * Retrieves all the metadata from the specified topic.
 *
 * @param topicId - The number of the indicator in DB
 *
 * @returns A `Promise` resolving to:
 * - On success: An `TopicMetadata` object
 * - On failure: A `ApiRequestError` object.
 */
export async function getTopicMetadata(topicId: number) {
  const res = await monitoringAPI<TopicMetadata>({
    type: "get",
    endpoint: `Topic/${topicId}`,
  });

  return res;
}

export async function updateTopicName(topicId: number, name: string) {
  const res = await monitoringAPI<TopicMetadata>({
    type: "put",
    endpoint: `Topic/${topicId}`,
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
