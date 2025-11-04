import { ODataTable } from "@composites/ODataTable";
import { monitoringAPI } from "pages/monitoring/api/monitoringAPI";
import type { LogEntry } from "pages/monitoring/types/requestParams";
import { formatLogDate } from "pages/monitoring/utils/ODataFormatters";

type LogsTableParams = {
  recordsAmount: number;
  records: LogEntry[];
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
      action: async (id) => {
        console.log(
          await monitoringAPI({ type: "get", endpoint: `Logs/${id}` }),
        );
      },
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
