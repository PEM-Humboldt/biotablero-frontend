import { ODataTableFactory } from "@composites/ODataTable";

import type { LogEntryShort } from "pages/monitoring/types/requestParams";
import { tableContent } from "pages/monitoring/outlets/logs/layout/tableContent";

export function LogsTable({ records }: { records: LogEntryShort[] }) {
  const Table = ODataTableFactory<LogEntryShort>(tableContent);

  return <Table values={records} />;
}
