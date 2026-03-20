import type { SearchBarComponent } from "@appTypes/odata";
import type { ODataTerritoryStoryObject } from "pages/monitoring/types/odataResponse";

export const searchBarItems: SearchBarComponent<ODataTerritoryStoryObject>[] = [
  {
    label: "Buscar por título o palabras clave",
    placeholder: "'sobre las especies...' o 'guanábana'",
    type: "text",
    source: ["title", "keywords"],
  },
];
