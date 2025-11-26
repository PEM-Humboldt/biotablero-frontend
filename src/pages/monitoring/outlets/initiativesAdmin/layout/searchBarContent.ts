import { type SearchBarComponent } from "@appTypes/odata";
import { type ODataInitiativeEntry } from "pages/monitoring/types/requestParams";

// TODO: Solucionar lo de la divipola
// const getTypeValues = async () => {
//   try {
//     const res = await monitoringAPI<TypeValue[]>({
//       type: "get",
//       endpoint: "LogType",
//     });
//     if (isResponseRequestError(res)) {
//       throw new Error(res.message);
//     }
//     return res.map(({ name }) => name);
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// };

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
    label: "ubicacion",
    type: "text",
    source: ["locality", "location/name"],
    oDataEntity: "InitiativeLocations",
  },
];
