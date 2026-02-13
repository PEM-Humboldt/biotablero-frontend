import type { ODataColumn } from "@appTypes/odata";
import type { LogEntryShort } from "pages/monitoring/types/requestParams";
import { formatLogDate } from "pages/monitoring/utils/formatters";
import { ShowLogDetailsButton } from "pages/monitoring/outlets/logs/ShowDetailBtn";

export const tableContent: ODataColumn<LogEntryShort>[] = [
  { name: "Id", source: "id", type: "text" },
  {
    name: "Fecha",
    source: "timeStamp",
    type: "text",
    sortBy: true,
    processValue: formatLogDate,
  },
  { name: "Usuario", source: "userName", type: "text", sortBy: true },
  { name: "Tipo", source: "type", type: "text", sortBy: true },
  { name: "Descripción", source: "shortMessage", type: "text" },
  {
    name: "Acciones",
    source: "id",
    type: "action",
    actions: ShowLogDetailsButton,
    label: "Detalles",
  },
];
