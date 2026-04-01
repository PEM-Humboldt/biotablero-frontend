import { type ChangeEvent, useEffect, useState } from "react";

import { getInitiatives } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type {
  ODataInitiative,
  ODataInitiativeShortEntry,
  ODataTag,
} from "pages/monitoring/types/odataResponse";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import { JoinInitiativeRequestButton } from "pages/monitoring/ui/JoinInitiativeRequestButton";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";
import { ComboboxOData } from "@ui/ComboboxOData";

export function Browser() {
  // NOTE: Esto es para poder probar el botón de solicitud de ingreso,
  // el llamado de iniciativas para el buscador corresponde a
  // otro ticket y será manejado mejor
  const [allInitiatives, setAllInitiatives] = useState<
    ODataInitiative["value"]
  >([]);
  const { setInitiative } = useInitiativeCTX();
  const [value, setValue] = useState<string>("");
  const [value2, setValue2] = useState<string>("");

  useEffect(() => {
    const fetchInitiatives = async () => {
      const initiatives = await getInitiatives({ orderby: "id desc" });
      if (isMonitoringAPIError(initiatives)) {
        setAllInitiatives([]);
        return;
      }

      setAllInitiatives(initiatives.value);
    };
    void fetchInitiatives();
  }, []);

  const handleInitiativeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    void setInitiative(
      e.target.value !== "" ? Number(e.target.value) : undefined,
    );
  };

  return (
    <div className="absolute p-4 w-[25%] h-[50%] bg-background top-19 left-13 z-10 rounded-lg flex flex-col gap-4">
      <NativeSelect onChange={handleInitiativeChange}>
        <NativeSelectOption value={0}>
          Selecciona una iniciativa
        </NativeSelectOption>
        {allInitiatives.map((initiative) => (
          <NativeSelectOption key={initiative.id} value={initiative.id}>
            nombre:{initiative.name} id:{initiative.id}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <JoinInitiativeRequestButton />

      <ComboboxOData<ODataInitiativeShortEntry>
        value={value}
        setValue={setValue}
        endpoint="Initiative"
        sources={["name"]}
        sourceProcess={(odataResponse) =>
          odataResponse.map((item) => ({
            value: String(item.id),
            label: item.name,
          }))
        }
        loadOnEmpty={false}
        fixedSearchParams={{ orderby: "name asc" }}
        maxItems={4}
        uiText={{
          itemNotFound: "No se encuentra la iniciativa",
          trigger: "Buscar iniciativa",
          inputPlaceholder: "Escribe el nombre de la iniciativa",
          onEmptySearch: "Escribe para iniciar la búsqueda",
        }}
      />

      <ComboboxOData<ODataTag>
        value={value2}
        setValue={setValue2}
        endpoint="Tag"
        sources={["name"]}
        sourceProcess={(odataResponse) =>
          odataResponse.map((item) => ({
            value: String(item.id),
            label: item.name,
          }))
        }
        loadOnEmpty={true}
        fixedSearchParams={{ orderby: "name asc" }}
        maxItems={4}
        uiText={{
          itemNotFound: "No se encuentra el tag",
          trigger: "Buscar tag",
          inputPlaceholder: "Escribe el nombre del tag",
        }}
      />
    </div>
  );
}
