// NOTE: Este selector de iniciativas sólo tiene uso mientras se construye
// el naegador de iniciativas, no debe ser usado en ninguna otra parte pues
// será borrado

import { type ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getInitiatives } from "pages/monitoring/api/services/initiatives";
import { isMonitoringAPIError } from "pages/monitoring/api/types/guards";
import type { ODataInitiative } from "pages/monitoring/types/odataResponse";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";

export function InitiativeSelector_NOT_FOR_PRODUCTION() {
  const [allInitiatives, setAllInitiatives] = useState<
    ODataInitiative["value"]
  >([]);
  const navigate = useNavigate();
  const params = useParams();

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
    void navigate(`/Monitoreo/Iniciativas/${e.target.value}`);
  };

  return (
    <div className="w-full">
      <NativeSelect
        onChange={handleInitiativeChange}
        value={params.initiativeId ?? 0}
      >
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
