import { ODataTable } from "@composites/ODataTable";
import type { LogEntryShort } from "pages/monitoring/types/requestParams";
import { formatLogDate } from "pages/monitoring/utils/ODataFormatters";
import { LogDetailsAction } from "pages/monitoring/outlet/monitoringLogs/LogCard";

export function LogsTable({ records }: { records: LogEntryShort[] }) {
  const Table = ODataTable([
    { name: "id", source: "id", type: "text" },
    {
      name: "fecha",
      source: "timeStamp",
      type: "text",
      sortBy: true,
      processValue: formatLogDate,
    },
    { name: "Usuario", source: "userName", type: "text", sortBy: true },
    { name: "tipo", source: "type", type: "text", sortBy: true },
    { name: "Descripción", source: "shortMessage", type: "text" },
    {
      name: "Acciones",
      source: "id",
      type: "action",
      actions: LogDetailsAction,
      label: "Detalles",
    },
  ]);

  const handleSort = () => {};

  return <Table values={records} sortCallback={handleSort} />;
}
