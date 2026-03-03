import type { ImageUploadInfo } from "pages/monitoring/api/types/definitions";
import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

/**
 * Uploads a collection of images to their respective API endpoints.
 *
 * @param images An array of {@link ImageUploadInfo} containing the File and its destination path.
 * @returns a `Promise<string[]>`. The array contains error messages for any failed uploads; an empty array indicates total success.
 *
 * @remarks
 * - Non-File instances in the input array are silently skipped.
 * - This function does not throw on API errors, it collects server error messages in the returned array to be handled by the caller.
 * - A `try/catch` is only necessary if you need to catch unexpected runtime or network exceptions not handled by `monitoringAPI`.
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
