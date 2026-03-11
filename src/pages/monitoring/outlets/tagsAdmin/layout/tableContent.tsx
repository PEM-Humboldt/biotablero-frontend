import type { ODataColumn } from "@appTypes/odata";
import { TagEntryShort } from "pages/monitoring/types/odataResponse";
import { TagFormButton } from "pages/monitoring/outlets/tagsAdmin/TagFormBtn";

export const tableContent: ODataColumn<TagEntryShort>[] = [
  { name: "Categoría", source: "categoryName", type: "text", sortBy: true },
  { name: "Nombre", source: "name", type: "text", sortBy: true },
  { name: "Url", source: "url", type: "text" },
  {
    name: "Acciones",
    source: "id",
    type: "action",
    actions: TagFormButton,
    label: "Detalles",
  },
];
