import type { SearchBarComponent } from "@appTypes/odata";
import type { TerritoryStoryShort } from "pages/monitoring/types/odataResponse";

export const searchBarItems: SearchBarComponent<TerritoryStoryShort>[] = [
  {
    label: "Buscar por título o palabras clave",
    placeholder: "'sobre las especies...' o 'guanábana'",
    type: "text",
    source: ["title", "keywords"],
  },
];
