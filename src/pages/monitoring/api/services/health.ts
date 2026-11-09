import { monitoringAPI } from "pages/monitoring/api/core";
import { isMonitoringAPIError } from "../types/guards";

export async function checkMonitoringBackend(
  signal?: AbortSignal,
): Promise<boolean> {
  const response = await monitoringAPI({
    type: "get",
    endpoint: "health/live",
    getStatus: true,
    options: { timeout: 5000, signal },
  });
  if (isMonitoringAPIError(response)) {
    if (response.message !== "Request cancelled by the user") {
      console.error(response.message, 66);
    }
    return false;
  }

  return true;
}
