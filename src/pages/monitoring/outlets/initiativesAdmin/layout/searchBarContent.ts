import { type SearchBarComponent } from "@appTypes/odata";
import { getLocation } from "pages/monitoring/api/monitoringAPI";
import { type ODataInitiativeEntry } from "pages/monitoring/types/requestParams";

export const searchBarItems: SearchBarComponent<ODataInitiativeEntry>[] =
  await (async () => [
    { label: "Nombre de la iniciativa", type: "text", source: ["name"] },
    {
      label: "desde",
      type: "date",
      source: ["creationDate"],
      dateOperator: "ge",
    },
    {
      label: "hasta",
      type: "date",
      source: ["creationDate"],
      dateOperator: "le",
    },
    {
      label: "Departamento",
      type: "select",
      source: ["location/id"],
      values: await getLocation(),
      oDataEntity: "InitiativeLocations",
      childUpdater: async (value: number | string) => {
        return await getLocation(value);
      },
    },
    {
      label: "Municipio",
      type: "select",
      source: ["location/id"],
      oDataEntity: "InitiativeLocations",
      values: null,
      dependsOnLabel: "Departamento",
    },
  ])();
