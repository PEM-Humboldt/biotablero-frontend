import { type SearchBarComponent } from "@appTypes/odata";
import { type ODataInitiativeEntry } from "pages/monitoring/types/requestParams";
import {
  COLOMBIAN_DEPARTMENTS,
  getMunicipalitiesByDepartment,
} from "pages/monitoring/utils/manageLocation";

export const searchBarItems: SearchBarComponent<ODataInitiativeEntry>[] = [
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
    values: COLOMBIAN_DEPARTMENTS,
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
];
