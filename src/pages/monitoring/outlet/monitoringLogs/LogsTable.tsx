import type { LogEntry } from "pages/monitoring/types/requestParams";

type LogsTableParams = {
  recordsAmount: number;
  records: LogEntry[];
};

export function LogsTable({ recordsAmount, records }: LogsTableParams) {
  console.log("records:", records);
  return <h1>{recordsAmount}</h1>;
}
