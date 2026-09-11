import { monitoringAPI } from "pages/monitoring/api/core";

export async function checkMonitoringBackend(
  signal?: AbortSignal,
): Promise<boolean> {
  try {
    const response = await monitoringAPI<{
      results?: { postgres?: string };
    }>({
      type: "get",
      endpoint: "health/ready",
      getStatus: true,
      options: {
        timeout: 5000,
        signal,
        validateStatus: (status) => status === 200 || status === 503,
      },
    });

    return (
      !("message" in response) && response.data?.results?.postgres === "Healthy"
    );
  } catch {
    return false;
  }
}
