import { type SearchBarComponent } from "@appTypes/odata";
import { type ODataLogEntryShort } from "pages/monitoring/types/requestParams";

export const searchComponents: SearchBarComponent<ODataLogEntryShort>[] = [
  { label: "Usuario", type: "text", source: "userName" },
  {
    label: "fecha inicio",
    type: "date",
    source: "timeStamp",
    dateOperator: "ge",
  },
  {
    label: "fecha final",
    type: "date",
    source: "timeStamp",
    dateOperator: "le",
  },
  {
    label: "Seleccione el tipo",
    type: "select",
    source: "type",
    values: ["create", "update", "delete"],
  },
];
