import { type SearchBarComponent } from "@appTypes/odata";
import { type ODataInitiativeShortEntry } from "pages/monitoring/types/odataResponse";
import {
  getColombianDepartments,
  getMunicipalitiesByDepartment,
} from "pages/monitoring/utils/manageLocation";

export async function searchBarItems(): Promise<
  SearchBarComponent<ODataInitiativeShortEntry>[]
> {
  const departments = await getColombianDepartments();

  return [
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
      source: ["location/id", "location/parent/id"],
      values: departments,
      oDataEntity: "InitiativeLocations",
      childUpdater: getMunicipalitiesByDepartment,
    },
    {
      label: "Municipio",
      type: "select",
      source: ["location/id"],
      oDataEntity: "InitiativeLocations",
      values: null,
      dependsOnLabel: "Departamento",
    },
    {
      label: "Estado",
      type: "select",
      source: ["enabled"],
      values: [
        { value: "false", name: "inactivas" },
        { value: "true", name: "activas" },
      ],
    },
  ];
}
