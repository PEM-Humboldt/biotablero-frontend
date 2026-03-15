import type { ImageUploadInfo } from "pages/monitoring/api/types/definitions";
import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { VideoObjectTS } from "pages/monitoring/types/territoryStory";

/**
 * Uploads a collection of images to their respective API endpoints.
 *
 * @param images An array of {@link ImageUploadInfo} containing the File and its destination path.
 *
 * @returns A `Promise` resolving to:
 * - On success: Empty string[].
 * - On failure: A `ApiRequestError` object.
 */
export async function uploadImages(
  images: ImageUploadInfo[],
): Promise<string[]> {
  if (images.length === 0) {
    return [];
  }

  const imageUploadErrors: string[] = [];

  for (const image of images) {
    if (!(image.file instanceof File)) {
      continue;
    }

    const formData = new FormData();
    formData.append("formFile", image.file);

    const res = await monitoringAPI({
      type: "post",
      endpoint: image.path,
      options: { data: formData, headers: { accept: "*/*" } },
    });

    if (isMonitoringAPIError(res)) {
      imageUploadErrors.push(
        `Error cargando ${image.file.name}: ${res.data[0].msg}`,
      );
    }
  }

  return imageUploadErrors;
}

export async function postTerritoryStoryVideo(
  territoryStoryId: number,
  fileUrl: string,
) {
  const payload = { territoryStoryId, fileUrl };
  const res = await monitoringAPI<VideoObjectTS[]>({
    type: "post",
    endpoint: `/TerritoryStoryVideo/GetByTerritoryStory/${territoryStoryId}`,
    options: { data: payload },
  });

  return res;
}

export async function deleteTerritoryStoryVideo(territoryStoryVideoId: number) {
  const res = await monitoringAPI<VideoObjectTS[]>({
    type: "delete",
    endpoint: `/TerritoryStoryVideo/${territoryStoryVideoId}`,
  });

  return res;
}

export async function getTerritoryStoryVideos(territoryStoryId: number) {
  const res = await monitoringAPI<VideoObjectTS[]>({
    type: "get",
    endpoint: `/TerritoryStoryVideo/GetByTerritoryStory/${territoryStoryId}`,
  });

  return res;
}

export async function postTerritoryStoryImage(
  territoryStoryId: number,
  description: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("TerritoryStoryId", String(territoryStoryId));
  formData.append("Description", description);
  formData.append("File", file);

  const res = await monitoringAPI({
    type: "post",
    endpoint: "TerritoryStoryImage",
    options: { data: formData, headers: { accept: "*/*" } },
  });

  return res;
}
