import { type SearchBarComponent } from "@appTypes/odata";
import { type ODataInitiativeShortEntry } from "pages/monitoring/types/requestParams";
import {
  getColombianDepartments,
  getMunicipalitiesByDepartment,
} from "pages/monitoring/utils/manageLocation";

export const searchBarItems: SearchBarComponent<ODataInitiativeShortEntry>[] = [
  { label: "", type: "text", source: ["name"] },
  {
    label: "",
    type: "date",
    source: ["creationDate"],
    dateOperator: "ge",
  },
  {
    label: "",
    type: "date",
    source: ["creationDate"],
    dateOperator: "le",
  },
  {
    label: "",
    type: "select",
    source: ["location/id", "location/parent/id"],
    values: await getColombianDepartments(),
    oDataEntity: "InitiativeLocations",
    childUpdater: getMunicipalitiesByDepartment,
  },
  {
    label: "",
    type: "select",
    source: ["location/id"],
    oDataEntity: "InitiativeLocations",
    values: null,
    dependsOnLabel: "Departamento",
  },
];
