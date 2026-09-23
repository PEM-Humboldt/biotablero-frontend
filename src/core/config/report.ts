import { ReportType } from "@appTypes/report";
import { type PageProps } from "@react-pdf/renderer";

export const REPORT_NOTE_MAX_LENGTH = 250;
export const REPORT_PAGE_SIZE: PageProps["size"] = "LETTER";
export const REPORT_DOWNLOAD_NAME_PREFIX: Partial<Record<ReportType, string>> =
  {
    [ReportType.MONITORING_INDICATORS]: "Biotablero_MonitoreoComunitario",
    [ReportType.SEARCH_INDICATORS]: "Biotablero_Consultas",
  };
