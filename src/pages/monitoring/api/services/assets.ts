import type { ImageUploadInfo } from "pages/monitoring/api/types/definitions";
import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type {
  ImageObjectTS,
  VideoObjectTS,
} from "pages/monitoring/types/territoryStory";

/**
 * Uploads an initiative image or banner file to the API.
 *
 * @param imageType The type of asset to upload ("image" | "banner").
 * @param file The image file to be uploaded.
 * @param initiativeId The unique identifier of the initiative.
 *
 * @returns A `Promise` resolving to:
 * - On success: `undefined`.
 * - On failure: A formatted error message `string`.
 */
async function uploadInitiativeImage(
  imageType: "image" | "banner",
  file: File,
  initiativeId: number,
) {
  const endpointParam = imageType === "image" ? "UploadImage" : "UploadBanner";
  const formData = new FormData();
  formData.append("formFile", file);

  const res = await monitoringAPI({
    type: "post",
    endpoint: `Initiative/${endpointParam}/${initiativeId}`,
    options: { data: formData, headers: { accept: "*/*" } },
  });

  if (isMonitoringAPIError(res)) {
    return `Error cargando ${file.name}: ${res.data[0].msg}`;
  }

  return;
}

/**
 * Removes an initiative image or banner from the API.
 *
 * @param imageType The type of asset to remove ("image" | "banner").
 * @param initiativeId The unique identifier of the initiative.
 *
 * @returns A `Promise` resolving to:
 * - On success: `undefined`.
 * - On failure: A formatted error message `string`.
 */
async function removeInitiativeImage(
  imageType: "image" | "banner",
  initiativeId: number,
) {
  const endpointParam = imageType === "image" ? "RemoveImage" : "RemoveBanner";

  const res = await monitoringAPI({
    type: "delete",
    endpoint: `Initiative/${endpointParam}/${initiativeId}`,
  });

  if (isMonitoringAPIError(res)) {
    return `Error eliminando la imagen: ${res.data[0].msg}`;
  }

  return;
}

/**
 * Uploads a collection of images to their respective API endpoints.
 *
 * @param images An array of {@link ImageUploadInfo} containing the File and its destination path.
 * @param initiativeId The unique identifier of the initiative.
 *
 * @returns A `Promise` resolving to:
 * - On success: Empty string[].
 * - On failure: A `ApiRequestError` object.
 */
export async function uploadImages(
  images: ImageUploadInfo[],
  initiativeId: number,
): Promise<string[]> {
  if (images.length === 0) {
    return [];
  }

  const imageUploadErrors: string[] = [];

  for (const image of images) {
    let res: string | undefined;
    if (image.action === "remove") {
      res = await removeInitiativeImage(image.type, initiativeId);
    } else if (image.file instanceof File) {
      res = await uploadInitiativeImage(image.type, image.file, initiativeId);
    }
    if (res) {
      imageUploadErrors.push(res);
    }
  }

  return imageUploadErrors;
}

/**
 * Registers a video URL for a specific territory story.
 *
 * @param territoryStoryId The unique identifier of the territory story.
 * @param fileUrl The remote URL of the video file.
 *
 * @returns A `Promise` resolving to:
 * - On success: An array of {@link VideoObjectTS}.
 * - On failure: A `MonitoringAPIError` object.
 */
export async function postTerritoryStoryVideo(
  territoryStoryId: number,
  fileUrl: string,
) {
  const payload = { territoryStoryId, fileUrl };
  const res = await monitoringAPI<VideoObjectTS[]>({
    type: "post",
    endpoint: `TerritoryStoryVideo`,
    options: { data: payload },
  });

  return res;
}

/**
 * Deletes a video associated with a territory story by its ID.
 *
 * @param territoryStoryVideoId The unique identifier of the territory story video to remove.
 *
 * @returns A `Promise` resolving to:
 * - On success: An array of {@link VideoObjectTS}.
 * - On failure: A `MonitoringAPIError` object.
 */
export async function deleteTerritoryStoryVideo(territoryStoryVideoId: number) {
  const res = await monitoringAPI<VideoObjectTS[]>({
    type: "delete",
    endpoint: `TerritoryStoryVideo/${territoryStoryVideoId}`,
  });

  return res;
}

/**
 * Retrieves all videos associated with a specific territory story.
 *
 * @param territoryStoryId The unique identifier of the territory story.
 *
 * @returns A `Promise` resolving to:
 * - On success: An array of {@link VideoObjectTS}.
 * - On failure: A `MonitoringAPIError` object.
 */
export async function getTerritoryStoryVideos(territoryStoryId: number) {
  const res = await monitoringAPI<VideoObjectTS[]>({
    type: "get",
    endpoint: `TerritoryStoryVideo/GetByTerritoryStory/${territoryStoryId}`,
  });

  return res;
}

/**
 * Uploads a new image with description for a territory story.
 *
 * @param territoryStoryId The unique identifier of the territory story.
 * @param description Brief description or caption for the image.
 * @param file The image file to be uploaded.
 *
 * @returns A `Promise` resolving to:
 * - On success: The created {@link ImageObjectTS}.
 * - On failure: A `MonitoringAPIError` object.
 */
export async function postTerritoryStoryImage(
  territoryStoryId: number,
  description: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("TerritoryStoryId", String(territoryStoryId));
  formData.append("Description", description);
  formData.append("File", file);

  const res = await monitoringAPI<ImageObjectTS>({
    type: "post",
    endpoint: "TerritoryStoryImage",
    options: { data: formData, headers: { accept: "*/*" } },
  });

  return res;
}

/**
 * Deletes a territory story image by its ID.
 *
 * @param imageInTSId The unique identifier of the image to remove.
 *
 * @returns A `Promise` resolving to:
 * - On success: The API response payload.
 * - On failure: A `MonitoringAPIError` object.
 */
export async function deleteTerritoryStoryImage(imageInTSId: number) {
  const res = await monitoringAPI({
    type: "delete",
    endpoint: `TerritoryStoryImage/${imageInTSId}`,
  });

  return res;
}

/**
 * Sets a specific territory story image as featured content.
 *
 * @param imageInTSId The unique identifier of the image to feature.
 *
 * @returns A `Promise` resolving to:
 * - On success: The updated {@link ImageObjectTS}.
 * - On failure: A `MonitoringAPIError` object.
 */
export async function setImageAsFeatured(imageInTSId: number) {
  const res = await monitoringAPI<ImageObjectTS>({
    type: "post",
    endpoint: `TerritoryStoryImage/FeaturedContent/${imageInTSId}`,
  });

  return res;
}
