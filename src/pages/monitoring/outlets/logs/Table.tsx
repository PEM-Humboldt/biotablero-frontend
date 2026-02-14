import { ODataTableFactory } from "@composites/ODataTable";

import type { LogEntryShort } from "pages/monitoring/types/odataResponse";
import { tableContent } from "pages/monitoring/outlets/logs/table/layout/tableContent";

export function LogsTable({ records }: { records: LogEntryShort[] }) {
  const Table = ODataTableFactory<LogEntryShort>(tableContent);

  return <Table values={records} />;
}
