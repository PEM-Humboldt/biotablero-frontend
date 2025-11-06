import { ODataTable } from "@composites/ODataTable";
import type { LogEntryShort } from "pages/monitoring/types/requestParams";
import { formatLogDate } from "pages/monitoring/utils/ODataFormatters";
import { LogDetailsAction } from "pages/monitoring/outlet/monitoringLogs/LogCard";

type LogsTableParams = {
  recordsAmount: number;
  records: LogEntryShort[];
};

export function LogsTable({ recordsAmount, records }: LogsTableParams) {
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
      name: "",
      source: "id",
      type: "action",
      actions: LogDetailsAction,
      label: "Detalles",
    },
  ]);

  return (
    <>
      {recordsAmount}
      <Table values={records} sortCallback={() => console.log("carajo")} />
    </>
  );
}
