import type { ODataColumn } from "@appTypes/odata";
import type { TagEntryShort } from "pages/monitoring/types/odataResponse";
import { TagTableButtons } from "pages/monitoring/outlets/tagsAdmin/TagTableBtns";

export const getTableContent = (
  onActionSuccess: () => void,
): ODataColumn<TagEntryShort>[] => [
  { name: "Categoría", source: "categoryName", type: "text", sortBy: true },
  { name: "Nombre", source: "name", type: "text", sortBy: true },
  { name: "Url", source: "url", type: "text" },
  {
    name: "Acciones",
    source: "id",
    type: "action",
    actions: ({ value }) => (
      <TagTableButtons value={value} onActionSuccess={onActionSuccess} />
    ),
    label: "Detalles",
  },
];
