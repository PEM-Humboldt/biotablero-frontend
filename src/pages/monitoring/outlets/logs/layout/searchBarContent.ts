import { isResponseRequestError } from "@api/auth";
import { type SearchBarComponent } from "@appTypes/odata";
import { monitoringAPI } from "pages/monitoring/api/monitoringAPI";
import { type ODataLogEntryShort } from "pages/monitoring/types/requestParams";

type TypeValue = {
  id: number;
  name: string;
};

const getTypeValues = async () => {
  try {
    const res = await monitoringAPI<TypeValue[]>({
      type: "get",
      endpoint: "LogType",
    });

    if (isResponseRequestError(res)) {
      throw new Error(res.message);
    }

    return res.map(({ name }) => name);
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const searchBarItems: SearchBarComponent<ODataLogEntryShort>[] =
  await (async () => [
    { label: "Usuario", type: "text", source: ["userName"] },
    {
      label: "fecha inicio",
      type: "date",
      source: ["timeStamp"],
      dateOperator: "ge",
    },
    {
      label: "fecha final",
      type: "date",
      source: ["timeStamp"],
      dateOperator: "le",
    },
    {
      label: "Seleccione el tipo",
      type: "select",
      source: ["type"],
      values: await getTypeValues(),
    },
  ])();
