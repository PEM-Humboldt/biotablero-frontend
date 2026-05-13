import { getResources } from "pages/monitoring/api/services/monitoringResources";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";

export async function resourceNameNotExist(resourceName: string) {
  const existingTitle = await getResources({
    filter: `name eq '${resourceName}'`,
  });

  if (isMonitoringAPIError(existingTitle)) {
    return false;
  }

  return existingTitle["@odata.count"] === 0;
}

export async function urlIsActive(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "no-cors",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return response.status < 300 || response.type === "opaque";
  } catch {
    return false;
  }
}
