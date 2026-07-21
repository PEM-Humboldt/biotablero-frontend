import type { SearchBarComponent } from "@appTypes/odata";
import type { ODataIndicators } from "pages/monitoring/types/odataResponse";
import { getColombianDepartments } from "pages/monitoring/utils/manageLocation";

// NOTE: cadena de busqueda
// IndicatorVersions/any(l: l/location/id eq 735 or l/location/parent/id eq 735)

export async function searchInitiativeComponents(): Promise<
  SearchBarComponent<ODataIndicators>[]
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
      label: "Departamento",
      type: "select",
      source: ["location/id", "location/parent/id"],
      values: departments,
      oDataEntity: "IndicatorVersions",
    },
  ];
}
