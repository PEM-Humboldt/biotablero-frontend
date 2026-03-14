import { type ChangeEvent, useEffect, useState } from "react";

import { getInitiatives } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { ODataInitiative } from "pages/monitoring/types/odataResponse";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";

import { useInitiativeCTX } from "pages/monitoring/hooks/useInitiativeCTX";

export function Selector() {
  const [allInitiatives, setAllInitiatives] = useState<
    ODataInitiative["value"]
  >([]);
  const { setInitiative } = useInitiativeCTX();

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
    <div className="w-full">
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
    </div>
  );
}
