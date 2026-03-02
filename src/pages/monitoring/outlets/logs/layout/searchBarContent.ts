import { type SearchBarComponent } from "@appTypes/odata";
import { getLogTypes } from "pages/monitoring/api/services/logs";
import { type ODataLogEntryShort } from "pages/monitoring/types/requestParams";

export const searchBarItems: SearchBarComponent<ODataLogEntryShort>[] =
  await (async () => [
    { label: "Usuario", type: "text", source: ["userName"] },
    {
      label: "fecha inicio",
      type: "date",
      source: ["timeStamp"],
      dateOperator: "ge",
    },
    {
      label: "fecha final",
      type: "date",
      source: ["timeStamp"],
      dateOperator: "le",
    },
    {
      label: "Tipo de registro",
      placeholder: "Seleciona el tipo",
      type: "select",
      source: ["type"],
      values: await getLogTypes(),
    },
  ])();
