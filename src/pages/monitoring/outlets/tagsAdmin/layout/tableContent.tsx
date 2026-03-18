import type { ODataColumn } from "@appTypes/odata";
import type { TagEntryShort } from "pages/monitoring/types/odataResponse";
import { TagTableButtons } from "pages/monitoring/outlets/tagsAdmin/TagTableBtns";
import type { ApiRequestError } from "@appTypes/api";
import type { TagDataForm } from "pages/monitoring/types/tagData";

export const getTableContent = (
  onActionSuccess: () => void,
  tagActions: (
    action: "get" | "create" | "edit" | "delete",
  ) => (
    id?: number,
  ) => (tag?: TagDataForm) => Promise<TagDataForm | ApiRequestError>,
): ODataColumn<TagEntryShort>[] => [
  { name: "Categoría", source: "categoryName", type: "text", sortBy: true },
  { name: "Nombre", source: "name", type: "text", sortBy: true },
  { name: "Url", source: "url", type: "text" },
  {
    name: "Acciones",
    source: "id",
    type: "action",
    actions: ({ value }) => (
      <TagTableButtons
        value={value}
        onActionSuccess={onActionSuccess}
        tagActions={tagActions}
      />
    ),
    label: "Detalles",
  },
];
