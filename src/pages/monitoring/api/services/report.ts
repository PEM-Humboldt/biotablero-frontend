import { monitoringAPI } from "../core";

export async function sendReportDownloadReason(
  description: string,
  data: string,
) {
  const res = await monitoringAPI({
    type: "post",
    endpoint: "Reports",
    options: { data: { description, data } },
  });

  return res;
}
