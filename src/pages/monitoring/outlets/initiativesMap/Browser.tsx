import { type ChangeEvent, type ReactNode, useEffect, useState } from "react";

import {
  getInitiatives,
  isMonitoringAPIError,
} from "pages/monitoring/api/monitoringAPI";
import type { ODataInitiative } from "pages/monitoring/types/odataResponse";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import { JoinInitiativeRequestButton } from "pages/monitoring/ui/JoinInitiativeRequestButton";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";

export function Browser({ children }: { children: ReactNode }) {
  // NOTE: Esto es para poder probar el botón de solicitud de ingreso,
  // el llamado de iniciativas para el buscador corresponde a
  // otro ticket y será manejado mejor
  const [allInitiatives, setAllInitiatives] = useState<
    ODataInitiative["value"]
  >([]);
  const { setInitiative } = useInitiativeCTX();

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const initiatives = await getInitiatives({ orderby: "id desc" });
        if (isMonitoringAPIError(initiatives)) {
          console.error(initiatives.message);
        }
        setAllInitiatives(initiatives.value);
      } catch (err) {
        console.error(err);
      }
    };
    void fetchInitiatives();
  }, []);

  const handleInitiativeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    void setInitiative(
      e.target.value !== "" ? Number(e.target.value) : undefined,
    );
  };

  return (
    <div className="absolute p-4 w-[25%] h-[50%] bg-background top-19 left-13 z-10 rounded-lg">
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

      {/* <JoinInitiativeRequestButton initiativeId={currentInitiative} /> */}
    </div>
  );
}
